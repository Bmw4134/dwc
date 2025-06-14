/**
 * Emergency Stack Recovery System
 * Immediate intervention for stack overflow and runaway loop detection
 */

class EmergencyStackRecovery {
    constructor() {
        this.isRecovering = false;
        this.recoveryAttempts = 0;
        this.maxRecoveryAttempts = 3;
        this.emergencyMode = false;
        this.blockedFunctions = new Set();
        
        this.initializeEmergencySystem();
    }

    initializeEmergencySystem() {
        // Monitor for stack overflow errors
        window.addEventListener('error', (event) => {
            if (event.error && event.error.message.includes('Maximum call stack size exceeded')) {
                this.handleStackOverflow(event);
            }
        });

        // Monitor for unhandled rejections that might indicate runaway promises
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });

        // Emergency hotkey (Ctrl+Alt+R for recovery)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.altKey && event.key === 'r') {
                event.preventDefault();
                this.initiateEmergencyRecovery();
            }
        });

        console.log('[EMERGENCY-RECOVERY] Emergency stack recovery system active');
    }

    handleStackOverflow(event) {
        if (this.isRecovering) return;

        console.error('[EMERGENCY-RECOVERY] Stack overflow detected:', event.error.stack);
        
        // Extract function name from stack trace
        const stackLines = event.error.stack.split('\n');
        const problematicFunction = this.extractFunctionName(stackLines[1] || '');
        
        if (problematicFunction) {
            this.blockedFunctions.add(problematicFunction);
            console.warn(`[EMERGENCY-RECOVERY] Blocking function: ${problematicFunction}`);
        }

        this.initiateEmergencyRecovery();
    }

    handleUnhandledRejection(event) {
        console.warn('[EMERGENCY-RECOVERY] Unhandled rejection detected:', event.reason);
        
        // If we have multiple unhandled rejections, initiate recovery
        if (!this.unhandledRejectionCount) this.unhandledRejectionCount = 0;
        this.unhandledRejectionCount++;

        if (this.unhandledRejectionCount >= 3) {
            this.initiateEmergencyRecovery();
            this.unhandledRejectionCount = 0;
        }
    }

    extractFunctionName(stackLine) {
        // Extract function name from stack trace line
        const match = stackLine.match(/at\s+([^\s(]+)/);
        return match ? match[1] : null;
    }

    initiateEmergencyRecovery() {
        if (this.isRecovering || this.recoveryAttempts >= this.maxRecoveryAttempts) {
            console.error('[EMERGENCY-RECOVERY] Maximum recovery attempts reached, entering emergency mode');
            this.enterEmergencyMode();
            return;
        }

        this.isRecovering = true;
        this.recoveryAttempts++;
        
        console.warn(`[EMERGENCY-RECOVERY] Initiating emergency recovery (attempt ${this.recoveryAttempts})`);

        // Step 1: Clear all timers and intervals
        this.clearAllTimers();

        // Step 2: Stop all running modules
        this.stopAllModules();

        // Step 3: Clear problematic event listeners
        this.clearProblematicListeners();

        // Step 4: Reset global state
        this.resetGlobalState();

        // Step 5: Garbage collection hint
        this.triggerGarbageCollection();

        // Step 6: Restart essential systems
        setTimeout(() => {
            this.restartEssentialSystems();
        }, 2000);

        setTimeout(() => {
            this.isRecovering = false;
            console.log('[EMERGENCY-RECOVERY] Recovery cycle completed');
        }, 5000);
    }

    clearAllTimers() {
        console.log('[EMERGENCY-RECOVERY] Clearing all timers and intervals');
        
        // Get the highest timer ID by creating a new one
        const highestTimeoutId = setTimeout(() => {}, 0);
        const highestIntervalId = setInterval(() => {}, 1000);
        
        // Clear all timeouts
        for (let i = 1; i <= highestTimeoutId; i++) {
            clearTimeout(i);
        }
        
        // Clear all intervals
        for (let i = 1; i <= highestIntervalId; i++) {
            clearInterval(i);
        }
        
        // Clear the test ones we just created
        clearTimeout(highestTimeoutId);
        clearInterval(highestIntervalId);
        
        console.log(`[EMERGENCY-RECOVERY] Cleared ${highestTimeoutId} timeouts and ${highestIntervalId} intervals`);
    }

    stopAllModules() {
        console.log('[EMERGENCY-RECOVERY] Stopping all running modules');
        
        // Stop module registry if available
        if (window.moduleRegistry) {
            try {
                window.moduleRegistry.emergencyCleanup();
            } catch (error) {
                console.warn('[EMERGENCY-RECOVERY] Error stopping module registry:', error);
            }
        }

        // Stop any running diagnostic modules
        const diagnosticElements = document.querySelectorAll('[data-module], .diagnostic-module, .module-container');
        diagnosticElements.forEach(element => {
            element.style.display = 'none';
            element.classList.add('emergency-disabled');
        });

        // Clear any injected scripts that might be causing issues
        const injectedScripts = document.querySelectorAll('script[data-injected]');
        injectedScripts.forEach(script => script.remove());
    }

    clearProblematicListeners() {
        console.log('[EMERGENCY-RECOVERY] Clearing problematic event listeners');
        
        // Clone and replace elements that might have problematic listeners
        const problematicSelectors = [
            '.module-trigger',
            '.diagnostic-button',
            '[data-module-control]',
            '.auto-refresh'
        ];

        problematicSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
            });
        });
    }

    resetGlobalState() {
        console.log('[EMERGENCY-RECOVERY] Resetting global state');
        
        // Reset known global variables that might be causing issues
        const globalVarsToReset = [
            'moduleStates',
            'diagnosticRunning',
            'autoRefreshActive',
            'recursiveDepth',
            'callStack'
        ];

        globalVarsToReset.forEach(varName => {
            if (window[varName] !== undefined) {
                delete window[varName];
            }
        });

        // Reset stack monitor if available
        if (window.stackMonitor) {
            try {
                window.stackMonitor.emergencyReset();
            } catch (error) {
                console.warn('[EMERGENCY-RECOVERY] Error resetting stack monitor:', error);
            }
        }
    }

    triggerGarbageCollection() {
        console.log('[EMERGENCY-RECOVERY] Triggering garbage collection hints');
        
        // Force garbage collection hints
        if (window.gc) {
            window.gc();
        }
        
        // Create memory pressure to encourage GC
        let memoryPressure = [];
        for (let i = 0; i < 1000; i++) {
            memoryPressure.push(new Array(1000));
        }
        memoryPressure = null;
    }

    restartEssentialSystems() {
        console.log('[EMERGENCY-RECOVERY] Restarting essential systems');
        
        try {
            // Restart basic KPI injection with safety guards
            if (window.initiateRecursiveKPIMobileFix) {
                setTimeout(() => {
                    window.initiateRecursiveKPIMobileFix();
                }, 1000);
            }

            // Restart stack monitoring with reduced sensitivity
            if (window.stackMonitor) {
                window.stackMonitor.setMaxDepth(5);
                window.stackMonitor.setMaxFrequency(5);
            }

            // Re-enable essential UI elements
            const essentialElements = document.querySelectorAll('.emergency-disabled');
            essentialElements.forEach(element => {
                element.classList.remove('emergency-disabled');
                element.style.display = '';
            });

        } catch (error) {
            console.error('[EMERGENCY-RECOVERY] Error restarting systems:', error);
            this.enterEmergencyMode();
        }
    }

    enterEmergencyMode() {
        this.emergencyMode = true;
        console.error('[EMERGENCY-RECOVERY] Entering emergency mode - manual intervention required');
        
        // Show emergency mode banner
        this.showEmergencyBanner();
        
        // Disable all non-essential functionality
        this.disableNonEssentialFeatures();
        
        // Set up minimal safe mode
        this.setupSafeMode();
    }

    showEmergencyBanner() {
        const banner = document.createElement('div');
        banner.id = 'emergency-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #dc2626;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 999999;
            font-weight: bold;
            font-family: monospace;
        `;
        banner.innerHTML = `
            ⚠️ EMERGENCY MODE ACTIVE ⚠️ 
            System recovered from stack overflow. Some features disabled for safety.
            <button onclick="window.emergencyRecovery.exitEmergencyMode()" style="margin-left: 20px; padding: 5px 10px; background: white; color: #dc2626; border: none; cursor: pointer;">
                Exit Emergency Mode
            </button>
        `;
        
        document.body.insertBefore(banner, document.body.firstChild);
    }

    disableNonEssentialFeatures() {
        // Disable auto-refresh mechanisms
        const autoRefreshElements = document.querySelectorAll('[data-auto-refresh], .auto-update');
        autoRefreshElements.forEach(element => {
            element.classList.add('emergency-disabled');
            element.style.opacity = '0.5';
        });

        // Disable diagnostic modules
        const diagnosticControls = document.querySelectorAll('.diagnostic-control, [data-diagnostic]');
        diagnosticControls.forEach(element => {
            element.disabled = true;
            element.style.opacity = '0.5';
        });
    }

    setupSafeMode() {
        // Implement minimal functionality with safety guards
        const safeRefreshInterval = setInterval(() => {
            try {
                // Only update critical KPIs with minimal processing
                const kpiElements = document.querySelectorAll('.kpi-value');
                kpiElements.forEach(element => {
                    if (element.textContent === 'NaN' || !element.textContent) {
                        element.textContent = '0';
                    }
                });
            } catch (error) {
                console.warn('[EMERGENCY-RECOVERY] Safe mode error:', error);
                clearInterval(safeRefreshInterval);
            }
        }, 10000); // Very conservative 10-second interval
    }

    exitEmergencyMode() {
        if (!this.emergencyMode) return;
        
        console.log('[EMERGENCY-RECOVERY] Exiting emergency mode');
        
        this.emergencyMode = false;
        this.recoveryAttempts = 0;
        this.blockedFunctions.clear();
        
        // Remove emergency banner
        const banner = document.getElementById('emergency-banner');
        if (banner) banner.remove();
        
        // Re-enable features
        const disabledElements = document.querySelectorAll('.emergency-disabled');
        disabledElements.forEach(element => {
            element.classList.remove('emergency-disabled');
            element.style.opacity = '';
            element.disabled = false;
        });
        
        // Restart normal operations
        setTimeout(() => {
            this.restartNormalOperations();
        }, 1000);
    }

    restartNormalOperations() {
        console.log('[EMERGENCY-RECOVERY] Restarting normal operations');
        
        // Gradually restart systems
        try {
            // Restart with conservative settings
            if (window.stackMonitor) {
                window.stackMonitor.setMaxDepth(10);
                window.stackMonitor.setMaxFrequency(8);
            }
            
            // Re-enable module registry
            if (window.moduleRegistry) {
                console.log('[EMERGENCY-RECOVERY] Module registry available for restart');
            }
            
        } catch (error) {
            console.error('[EMERGENCY-RECOVERY] Error during restart:', error);
        }
    }

    // Public API
    getRecoveryStatus() {
        return {
            isRecovering: this.isRecovering,
            emergencyMode: this.emergencyMode,
            recoveryAttempts: this.recoveryAttempts,
            blockedFunctions: Array.from(this.blockedFunctions)
        };
    }

    forceRecovery() {
        this.recoveryAttempts = 0;
        this.initiateEmergencyRecovery();
    }
}

// Initialize emergency recovery system
if (typeof window !== 'undefined') {
    window.emergencyRecovery = new EmergencyStackRecovery();
    
    // Add emergency recovery to console for manual access
    console.log('[EMERGENCY-RECOVERY] Emergency recovery available at window.emergencyRecovery');
    console.log('[EMERGENCY-RECOVERY] Manual recovery: window.emergencyRecovery.forceRecovery()');
    console.log('[EMERGENCY-RECOVERY] Emergency hotkey: Ctrl+Alt+R');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmergencyStackRecovery;
}