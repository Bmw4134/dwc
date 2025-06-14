/**
 * NEXUS Production Armor - Comprehensive System Protection & Self-Healing
 * Prevents prompt-based regressions and maintains system integrity
 */

class NEXUSProductionArmor {
    constructor() {
        this.integrityScore = 0;
        this.auditLog = [];
        this.deploymentReady = false;
        this.validationCache = new Map();
        this.selfHealingActive = true;
        this.regressionProtection = true;
        
        this.init();
    }

    init() {
        this.log('NEXUS Production Armor initializing...', 'system');
        this.implementRegressionProtection();
        this.startRecursiveValidation();
        this.validateSystemIntegrity();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, message, type };
        this.auditLog.push(logEntry);
        console.log(`[NEXUS-ARMOR] ${message}`);
    }

    // Implement Intelligent Component Snapback Logic
    implementRegressionProtection() {
        this.log('Implementing regression protection...', 'system');
        
        // Protect critical DOM elements from modification
        const criticalElements = [
            '.nexus-sidebar',
            '.kpi-container',
            '.nexus-header',
            '.quantum-bg',
            '.main-content'
        ];

        criticalElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                this.protectElement(element);
            }
        });

        // Implement MutationObserver for DOM protection
        this.setupDOMProtection();
    }

    protectElement(element) {
        // Store original state
        const originalHTML = element.innerHTML;
        const originalClasses = Array.from(element.classList);
        
        // Create protection metadata
        element.dataset.nexusProtected = 'true';
        element.dataset.originalState = JSON.stringify({
            html: originalHTML,
            classes: originalClasses
        });

        // Add recovery method
        element.nexusRestore = () => {
            const state = JSON.parse(element.dataset.originalState);
            element.innerHTML = state.html;
            element.className = state.classes.join(' ');
            this.log(`Restored protected element: ${element.tagName}`, 'recovery');
        };
    }

    setupDOMProtection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.target.dataset?.nexusProtected === 'true') {
                    // Validate mutation is authorized
                    if (!this.isAuthorizedMutation(mutation)) {
                        this.log('Unauthorized DOM modification detected - initiating snapback', 'security');
                        setTimeout(() => {
                            mutation.target.nexusRestore?.();
                        }, 100);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });

        this.domObserver = observer;
    }

    isAuthorizedMutation(mutation) {
        // Allow mutations from known NEXUS operations
        const authorizedSources = [
            'nexus-dashboard',
            'production-validator',
            'qnis-engine',
            'vision-ai'
        ];

        return authorizedSources.some(source => 
            mutation.target.closest(`[data-source="${source}"]`) ||
            mutation.target.classList.contains(source)
        );
    }

    // Recursive Audit Checkpoint Validation
    startRecursiveValidation() {
        this.log('Starting recursive validation system...', 'system');
        
        const validationInterval = setInterval(() => {
            this.performSystemValidation();
        }, 30000); // Every 30 seconds

        this.validationInterval = validationInterval;
    }

    async performSystemValidation() {
        this.log('Performing system validation checkpoint...', 'validation');
        
        const validationResults = {
            sidebarIntegrity: this.validateSidebar(),
            routingIntegrity: this.validateRouting(),
            dataIntegrity: await this.validateDataSources(),
            uiConsistency: this.validateUIConsistency(),
            visionAIStatus: await this.validateVisionAI(),
            qnisMapStatus: this.validateQNISMap()
        };

        const passedValidations = Object.values(validationResults).filter(Boolean).length;
        const totalValidations = Object.keys(validationResults).length;
        this.integrityScore = Math.round((passedValidations / totalValidations) * 100);

        this.log(`Integrity Score: ${this.integrityScore}%`, 'validation');

        if (this.integrityScore < 90 && this.selfHealingActive) {
            this.triggerSelfHealing(validationResults);
        }

        return validationResults;
    }

    validateSidebar() {
        // Use DOM Safety Guard if available
        const safeQuery = window.DOMGuard ? window.DOMGuard.safeQuerySelector.bind(window.DOMGuard) : (sel) => {
            try { return document.querySelector(sel); } catch(e) { return null; }
        };
        
        const safeQueryAll = window.DOMGuard ? window.DOMGuard.safeQuerySelectorAll.bind(window.DOMGuard) : (sel) => {
            try { return Array.from(document.querySelectorAll(sel)); } catch(e) { return []; }
        };

        const sidebar = safeQuery('.nexus-sidebar');
        if (!sidebar) return false;

        const requiredSections = [
            'Core Dashboard',
            'AI Intelligence Suite', 
            'Business Operations',
            'Financial Intelligence',
            'Development Tools'
        ];

        const sectionHeaders = safeQueryAll('.section-title');
        const foundSections = sectionHeaders.map(h => {
            try {
                return h.textContent ? h.textContent.trim() : '';
            } catch(e) {
                return '';
            }
        }).filter(Boolean);

        const allSectionsPresent = requiredSections.every(section => 
            foundSections.includes(section)
        );

        if (!allSectionsPresent) {
            this.log('Sidebar validation failed - missing sections', 'error');
            return false;
        }

        // Validate module counts
        const moduleItems = safeQueryAll('.module-item');
        if (moduleItems.length < 25) {
            this.log(`Sidebar validation failed - insufficient modules: ${moduleItems.length}`, 'error');
            return false;
        }

        return true;
    }

    validateRouting() {
        const safeQueryAll = window.DOMGuard ? window.DOMGuard.safeQuerySelectorAll.bind(window.DOMGuard) : (sel) => {
            try { return Array.from(document.querySelectorAll(sel)); } catch(e) { return []; }
        };
        
        const safeGetElement = (id) => {
            try { return document.getElementById(id); } catch(e) { return null; }
        };

        const moduleItems = safeQueryAll('.module-item');
        let validRoutes = 0;

        moduleItems.forEach(item => {
            try {
                const moduleId = item.dataset ? item.dataset.module : item.getAttribute('data-module');
                if (moduleId) {
                    const contentElement = safeGetElement(`${moduleId}-content`);
                    if (contentElement) {
                        validRoutes++;
                    } else {
                        this.log(`Missing content for module: ${moduleId}`, 'warning');
                    }
                }
            } catch(e) {
                this.log('Error validating module routing', 'warning');
            }
        });

        const routingIntegrity = moduleItems.length > 0 ? validRoutes / moduleItems.length : 0;
        return routingIntegrity > 0.8; // 80% routing integrity threshold
    }

    async validateDataSources() {
        try {
            // Validate leads API
            const leadsResponse = await fetch('/api/leads');
            if (!leadsResponse.ok) {
                this.log('Leads API validation failed', 'error');
                return false;
            }

            const leads = await leadsResponse.json();
            if (!Array.isArray(leads) || leads.length === 0) {
                this.log('No leads data available', 'warning');
                return false;
            }

            // Validate metrics API
            const metricsResponse = await fetch('/api/metrics');
            if (!metricsResponse.ok) {
                this.log('Metrics API validation failed', 'error');
                return false;
            }

            return true;
        } catch (error) {
            this.log(`Data source validation error: ${error.message}`, 'error');
            return false;
        }
    }

    validateUIConsistency() {
        const requiredStyles = [
            '--quantum-blue',
            '--nexus-purple', 
            '--dark-space',
            '--card-glass',
            '--border-glow'
        ];

        try {
            const computedStyle = getComputedStyle(document.documentElement);
            const missingStyles = requiredStyles.filter(style => {
                try {
                    return !computedStyle.getPropertyValue(style);
                } catch(e) {
                    return true;
                }
            });

            if (missingStyles.length > 0) {
                this.log(`Missing CSS variables: ${missingStyles.join(', ')}`, 'error');
                return false;
            }
        } catch(e) {
            this.log('Error validating CSS variables', 'warning');
            return false;
        }

        // Validate design system consistency with safe queries
        const safeQueryAll = window.DOMGuard ? window.DOMGuard.safeQuerySelectorAll.bind(window.DOMGuard) : (sel) => {
            try { return Array.from(document.querySelectorAll(sel)); } catch(e) { return []; }
        };
        
        const cards = safeQueryAll('.card');
        const buttons = safeQueryAll('.btn');
        
        return cards.length > 0 && buttons.length > 0;
    }

    async validateVisionAI() {
        const safeGetElement = (id) => {
            try { return document.getElementById(id); } catch(e) { return null; }
        };
        
        const safeQuery = window.DOMGuard ? window.DOMGuard.safeQuerySelector.bind(window.DOMGuard) : (sel, ctx) => {
            try { return (ctx || document).querySelector(sel); } catch(e) { return null; }
        };

        const visionModule = safeGetElement('vision-ai-content');
        if (!visionModule) return false;

        const uploadArea = safeQuery('#vision-upload-area', visionModule);
        const fileInput = safeQuery('#vision-file-input', visionModule);
        
        if (!uploadArea || !fileInput) {
            this.log('Vision AI components missing', 'error');
            return false;
        }

        // Test Vision AI API endpoint
        try {
            const testResponse = await fetch('/api/vision-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ test: true })
            });
            
            return testResponse.status !== 404;
        } catch (error) {
            this.log('Vision AI API not accessible', 'warning');
            return false;
        }
    }

    validateQNISMap() {
        const safeGetElement = (id) => {
            try { return document.getElementById(id); } catch(e) { return null; }
        };

        const mapContainer = safeGetElement('qnis-map');
        if (!mapContainer) return false;

        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            this.log('Leaflet library not loaded', 'error');
            return false;
        }

        // Validate map initialization with safe access
        try {
            const mapInstance = window.nexusDashboard?.map || window.qnisMap?.getMap?.();
            return !!mapInstance;
        } catch(e) {
            this.log('Error validating map instance', 'warning');
            return false;
        }
    }

    // Self-Healing System
    async triggerSelfHealing(validationResults) {
        this.log('Triggering self-healing protocols...', 'recovery');

        if (!validationResults.sidebarIntegrity) {
            await this.healSidebar();
        }

        if (!validationResults.routingIntegrity) {
            await this.healRouting();
        }

        if (!validationResults.uiConsistency) {
            await this.healUIConsistency();
        }

        if (!validationResults.qnisMapStatus) {
            await this.healQNISMap();
        }
    }

    async healSidebar() {
        this.log('Healing sidebar structure...', 'recovery');
        
        const sidebar = document.querySelector('.nexus-sidebar');
        if (sidebar?.nexusRestore) {
            sidebar.nexusRestore();
        }
    }

    async healRouting() {
        this.log('Healing routing integrity...', 'recovery');
        
        // Re-initialize dashboard navigation
        if (window.nexusDashboard) {
            window.nexusDashboard.setupNavigation();
        }
    }

    async healUIConsistency() {
        this.log('Healing UI consistency...', 'recovery');
        
        // Ensure design system CSS is loaded
        if (!document.querySelector('link[href="nexus-design-system.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'nexus-design-system.css';
            document.head.appendChild(link);
        }
    }

    async healQNISMap() {
        this.log('Healing QNIS map system...', 'recovery');
        
        if (window.nexusDashboard && typeof window.nexusDashboard.initQNISMap === 'function') {
            try {
                await window.nexusDashboard.initQNISMap();
            } catch (error) {
                this.log(`Map healing failed: ${error.message}`, 'error');
            }
        }
    }

    // Final System Validation
    async validateSystemIntegrity() {
        this.log('Performing final system integrity validation...', 'validation');
        
        const validationResults = await this.performSystemValidation();
        
        // Check deployment readiness
        this.deploymentReady = this.integrityScore >= 95;
        
        if (this.deploymentReady) {
            this.log('System validated - DEPLOYMENT READY', 'success');
        } else {
            this.log(`System integrity at ${this.integrityScore}% - requires optimization`, 'warning');
        }

        return {
            integrityScore: this.integrityScore,
            deploymentReady: this.deploymentReady,
            validationResults,
            auditLog: this.auditLog
        };
    }

    // Cache Management
    cacheValidationResult(key, result) {
        this.validationCache.set(key, {
            result,
            timestamp: Date.now(),
            ttl: 300000 // 5 minutes
        });
    }

    getCachedValidationResult(key) {
        const cached = this.validationCache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > cached.ttl) {
            this.validationCache.delete(key);
            return null;
        }
        
        return cached.result;
    }

    // Final Report Generation
    generateFinalReport() {
        const report = {
            timestamp: new Date().toISOString(),
            integrityScore: this.integrityScore,
            deploymentReady: this.deploymentReady,
            systemStatus: this.deploymentReady ? 'PRODUCTION_READY' : 'OPTIMIZATION_REQUIRED',
            auditLog: this.auditLog,
            protectedElements: document.querySelectorAll('[data-nexus-protected="true"]').length,
            validationCacheSize: this.validationCache.size,
            selfHealingStatus: this.selfHealingActive ? 'ACTIVE' : 'DISABLED',
            regressionProtection: this.regressionProtection ? 'ENABLED' : 'DISABLED'
        };

        this.log('Final system report generated', 'system');
        return report;
    }

    // Emergency Override
    emergencyOverride() {
        this.log('EMERGENCY OVERRIDE ACTIVATED', 'emergency');
        this.selfHealingActive = false;
        this.regressionProtection = false;
        
        if (this.domObserver) {
            this.domObserver.disconnect();
        }
        
        if (this.validationInterval) {
            clearInterval(this.validationInterval);
        }
    }

    // Deployment Lock
    lockForDeployment() {
        if (!this.deploymentReady) {
            throw new Error('System not ready for deployment lock');
        }

        this.log('Locking system for deployment...', 'deployment');
        
        // Freeze all protected elements
        document.querySelectorAll('[data-nexus-protected="true"]').forEach(element => {
            element.style.pointerEvents = 'none';
            element.dataset.deploymentLocked = 'true';
        });

        // Cache current state
        const currentState = {
            html: document.documentElement.outerHTML,
            timestamp: Date.now(),
            integrityScore: this.integrityScore
        };

        localStorage.setItem('nexus-deployment-state', JSON.stringify(currentState));
        
        this.log('System locked for deployment - state cached', 'deployment');
        return true;
    }
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.nexusProductionArmor = new NEXUSProductionArmor();
        
        // Global access for debugging
        window.NEXUS_ARMOR = window.nexusProductionArmor;
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NEXUSProductionArmor;
}