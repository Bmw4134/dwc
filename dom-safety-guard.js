/**
 * DOM Safety Guard System
 * Implements guarded logic for all DOM manipulations
 */

class DOMSafetyGuard {
    constructor() {
        this.isReady = false;
        this.pendingOperations = [];
        this.retryCount = new Map();
        this.maxRetries = 3;
        
        this.waitForDOMReady();
    }

    waitForDOMReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.isReady = true;
                this.processPendingOperations();
            });
        } else {
            this.isReady = true;
            // If DOM is already ready, process any existing operations
            setTimeout(() => this.processPendingOperations(), 0);
        }
    }

    processPendingOperations() {
        const operations = [...this.pendingOperations];
        this.pendingOperations = [];
        
        operations.forEach(operation => {
            try {
                operation.callback();
            } catch (error) {
                console.warn('[DOM-GUARD] Failed to execute pending operation:', error);
            }
        });
    }

    // Safe element selection with null checks
    safeQuerySelector(selector, context = document) {
        if (!this.isReady && context === document) {
            return null;
        }
        
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.warn(`[DOM-GUARD] Invalid selector: ${selector}`, error);
            return null;
        }
    }

    safeQuerySelectorAll(selector, context = document) {
        if (!this.isReady && context === document) {
            return [];
        }
        
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (error) {
            console.warn(`[DOM-GUARD] Invalid selector: ${selector}`, error);
            return [];
        }
    }

    // Safe element manipulation
    safeSetText(element, text) {
        if (!element) return false;
        
        try {
            if (element.textContent !== undefined) {
                element.textContent = text;
            } else if (element.innerText !== undefined) {
                element.innerText = text;
            }
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to set text:', error);
            return false;
        }
    }

    safeSetHTML(element, html) {
        if (!element) return false;
        
        try {
            element.innerHTML = html;
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to set HTML:', error);
            return false;
        }
    }

    safeAddClass(element, className) {
        if (!element || !element.classList) return false;
        
        try {
            element.classList.add(className);
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to add class:', error);
            return false;
        }
    }

    safeRemoveClass(element, className) {
        if (!element || !element.classList) return false;
        
        try {
            element.classList.remove(className);
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to remove class:', error);
            return false;
        }
    }

    safeToggleClass(element, className, force) {
        if (!element || !element.classList) return false;
        
        try {
            if (force !== undefined) {
                element.classList.toggle(className, force);
            } else {
                element.classList.toggle(className);
            }
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to toggle class:', error);
            return false;
        }
    }

    safeSetStyle(element, property, value) {
        if (!element || !element.style) return false;
        
        try {
            element.style[property] = value;
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to set style:', error);
            return false;
        }
    }

    safeSetAttribute(element, attribute, value) {
        if (!element) return false;
        
        try {
            element.setAttribute(attribute, value);
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to set attribute:', error);
            return false;
        }
    }

    // Safe event handling
    safeAddEventListener(element, event, handler, options) {
        if (!element || typeof handler !== 'function') return false;
        
        try {
            element.addEventListener(event, handler, options);
            return true;
        } catch (error) {
            console.warn('[DOM-GUARD] Failed to add event listener:', error);
            return false;
        }
    }

    // Deferred execution for DOM operations
    whenReady(callback, identifier = null) {
        if (typeof callback !== 'function') {
            console.warn('[DOM-GUARD] Invalid callback provided');
            return;
        }

        if (this.isReady) {
            try {
                callback();
            } catch (error) {
                console.warn('[DOM-GUARD] Callback execution failed:', error);
            }
        } else {
            this.pendingOperations.push({
                callback,
                identifier,
                timestamp: Date.now()
            });
        }
    }

    // Retry mechanism for critical operations
    withRetry(operation, identifier, maxRetries = this.maxRetries) {
        const retryKey = identifier || 'anonymous';
        const currentRetries = this.retryCount.get(retryKey) || 0;

        if (currentRetries >= maxRetries) {
            console.warn(`[DOM-GUARD] Max retries exceeded for: ${retryKey}`);
            return false;
        }

        try {
            const result = operation();
            this.retryCount.delete(retryKey); // Reset on success
            return result;
        } catch (error) {
            this.retryCount.set(retryKey, currentRetries + 1);
            console.warn(`[DOM-GUARD] Operation failed, retry ${currentRetries + 1}/${maxRetries}:`, error);
            
            // Retry after a short delay
            setTimeout(() => {
                this.withRetry(operation, identifier, maxRetries);
            }, 100 * (currentRetries + 1)); // Exponential backoff
            
            return false;
        }
    }

    // Wait for specific element to exist
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = this.safeQuerySelector(selector);
            
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = this.safeQuerySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Timeout fallback
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Batch DOM operations for performance
    batchOperations(operations) {
        if (!Array.isArray(operations)) {
            console.warn('[DOM-GUARD] Invalid operations array');
            return;
        }

        this.whenReady(() => {
            const fragment = document.createDocumentFragment();
            
            operations.forEach(operation => {
                try {
                    if (typeof operation === 'function') {
                        operation();
                    }
                } catch (error) {
                    console.warn('[DOM-GUARD] Batch operation failed:', error);
                }
            });
        });
    }

    // Element validation
    isValidElement(element) {
        return element && 
               element.nodeType === Node.ELEMENT_NODE && 
               element.parentNode !== null;
    }

    // Clean up
    destroy() {
        this.pendingOperations = [];
        this.retryCount.clear();
        this.isReady = false;
    }
}

// Global instance
window.DOMGuard = new DOMSafetyGuard();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMSafetyGuard;
}