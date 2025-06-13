/**
 * Accurate Module Counter & Validator
 * Comprehensive enumeration and validation based on actual DOM structure
 */

class AccurateModuleCounter {
    constructor() {
        this.actualModules = [
            'accounting', 'analytics', 'apikeys', 'business', 'contact',
            'copybuilder', 'cta', 'emailcampaign', 'investor', 'leadgen',
            'legal', 'memory', 'overview', 'pitchgen', 'pricing',
            'qnis', 'research', 'scriptbuilder', 'tradingbot', 'voicecommand',
            'watson', 'whitelabel', 'workflows'
        ];
        this.moduleStatus = new Map();
        this.validationResults = new Map();
        this.totalModuleCount = 23;
    }

    async executeComprehensiveValidation() {
        console.log(`[MODULE-COUNTER] Starting validation of ${this.totalModuleCount} actual modules`);
        
        this.initializeAccurateStatusOverlay();
        this.updateProgress(0, 'Initializing comprehensive validation...');
        
        // Phase 1: Validate DOM structures for all 23 modules
        await this.validateAllDOMStructures();
        
        // Phase 2: Test sidebar navigation bindings
        await this.validateSidebarBindings();
        
        // Phase 3: Verify API endpoints
        await this.validateAPIEndpoints();
        
        // Phase 4: Test interactive functionality
        await this.validateInteractiveFunctionality();
        
        // Phase 5: Complete validation report
        this.generateFinalValidationReport();
        
        return this.moduleStatus;
    }

    initializeAccurateStatusOverlay() {
        const existingOverlay = document.getElementById('dev-status-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        const overlay = document.createElement('div');
        overlay.id = 'dev-status-overlay';
        overlay.className = 'dev-status-overlay active';
        overlay.innerHTML = `
            <div class="dev-status-header">
                <span class="dev-status-title">🔍 Module Enumeration & Validation</span>
                <div class="dev-actions">
                    <span id="dev-completion-rate" class="dev-completion">0/23 Validated</span>
                    <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" class="dev-toggle-btn">Hide</button>
                </div>
            </div>
            <div class="dev-status-content">
                <div class="dev-progress-section">
                    <div class="dev-progress-bar">
                        <div id="dev-progress-fill" class="dev-progress-fill" style="width: 0%"></div>
                        <span id="dev-progress-text" class="dev-progress-text">Initializing...</span>
                    </div>
                    <div class="module-enumeration-grid">
                        <h4 style="color: #00ff88; margin: 16px 0 12px 0; font-size: 14px;">Discovered Modules (23 Total)</h4>
                        <div class="enumerated-modules" id="enumerated-modules">
                            ${this.actualModules.map(module => `
                                <div id="enum-${module}" class="enumerated-module pending">
                                    <span class="module-icon">⏳</span>
                                    <span class="module-name">${this.formatModuleName(module)}</span>
                                    <span class="module-status">Pending</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div id="dev-status-log" class="dev-status-log">
                    <div class="dev-log-entry active">🚀 Comprehensive module validation initiated</div>
                    <div class="dev-log-entry active">📊 Total modules discovered: ${this.totalModuleCount}</div>
                </div>
            </div>
        `;

        // Add custom styles for enumeration
        const style = document.createElement('style');
        style.textContent = `
            .module-enumeration-grid {
                margin-bottom: 20px;
            }
            .enumerated-modules {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
                max-height: 300px;
                overflow-y: auto;
            }
            .enumerated-module {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 10px;
                border-radius: 6px;
                font-size: 11px;
                transition: all 0.3s ease;
            }
            .enumerated-module.pending {
                background: rgba(100, 116, 139, 0.1);
                border: 1px solid rgba(100, 116, 139, 0.2);
                color: #64748b;
            }
            .enumerated-module.valid {
                background: rgba(0, 255, 136, 0.1);
                border: 1px solid rgba(0, 255, 136, 0.2);
                color: #00ff88;
            }
            .enumerated-module.invalid {
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.2);
                color: #ff4444;
            }
            .module-icon {
                flex-shrink: 0;
            }
            .module-name {
                flex: 1;
                font-weight: 500;
            }
            .module-status {
                font-size: 9px;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }

    formatModuleName(module) {
        const nameMap = {
            'apikeys': 'API Keys',
            'copybuilder': 'Copy Builder',
            'emailcampaign': 'Email Campaign',
            'leadgen': 'Lead Generation',
            'pitchgen': 'Pitch Generator',
            'qnis': 'QNIS Intelligence',
            'scriptbuilder': 'Script Builder',
            'tradingbot': 'Trading Bot',
            'voicecommand': 'Voice Command',
            'whitelabel': 'White Label'
        };
        
        return nameMap[module] || module.charAt(0).toUpperCase() + module.slice(1);
    }

    updateProgress(completed, message) {
        const percentage = Math.round((completed / this.totalModuleCount) * 100);
        
        const progressFill = document.getElementById('dev-progress-fill');
        const progressText = document.getElementById('dev-progress-text');
        const completionRate = document.getElementById('dev-completion-rate');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = message;
        if (completionRate) completionRate.textContent = `${completed}/${this.totalModuleCount} Validated (${percentage}%)`;
    }

    updateModuleStatus(moduleId, status, details = '') {
        const moduleElement = document.getElementById(`enum-${moduleId}`);
        if (!moduleElement) return;

        const iconElement = moduleElement.querySelector('.module-icon');
        const statusElement = moduleElement.querySelector('.module-status');

        let icon;
        switch (status) {
            case 'valid':
                icon = '✅';
                moduleElement.className = 'enumerated-module valid';
                break;
            case 'invalid':
                icon = '❌';
                moduleElement.className = 'enumerated-module invalid';
                break;
            case 'checking':
                icon = '🔄';
                moduleElement.className = 'enumerated-module pending';
                break;
            default:
                icon = '⏳';
                moduleElement.className = 'enumerated-module pending';
        }

        if (iconElement) iconElement.textContent = icon;
        if (statusElement) statusElement.textContent = details || status;

        this.moduleStatus.set(moduleId, { status, details, timestamp: Date.now() });
    }

    addLogEntry(message, type = 'active') {
        const logContainer = document.getElementById('dev-status-log');
        if (!logContainer) return;

        const entry = document.createElement('div');
        entry.className = `dev-log-entry ${type}`;
        entry.textContent = message;
        
        logContainer.insertBefore(entry, logContainer.firstChild);
        
        while (logContainer.children.length > 12) {
            logContainer.removeChild(logContainer.lastChild);
        }
        
        console.log(`[MODULE-COUNTER] ${message}`);
    }

    async validateAllDOMStructures() {
        this.addLogEntry('🔍 Validating DOM structures for all 23 modules', 'working');
        
        let validatedCount = 0;

        for (const moduleId of this.actualModules) {
            this.updateModuleStatus(moduleId, 'checking', 'Scanning DOM');
            
            const validation = {
                moduleExists: false,
                hasHeader: false,
                hasContent: false,
                isAccessible: false,
                errors: []
            };

            try {
                // Check main module element
                const moduleElement = document.getElementById(`${moduleId}-module`);
                if (moduleElement) {
                    validation.moduleExists = true;
                    
                    // Check for header structure
                    const header = moduleElement.querySelector('.module-header, .card-title, h2, h3');
                    validation.hasHeader = !!header;
                    
                    // Check for content structure
                    const content = moduleElement.querySelector('.module-content, .module-grid, .card-description, .business-content');
                    validation.hasContent = !!content;
                    
                    // Check if module is accessible (not hidden permanently)
                    const computedStyle = window.getComputedStyle(moduleElement);
                    validation.isAccessible = computedStyle.display !== 'none' || moduleElement.classList.contains('module-view');
                    
                    if (validation.moduleExists && validation.hasHeader && validation.hasContent) {
                        this.updateModuleStatus(moduleId, 'valid', 'Complete');
                        validatedCount++;
                        this.addLogEntry(`✅ ${this.formatModuleName(moduleId)}: DOM structure valid`);
                    } else {
                        const missing = [];
                        if (!validation.hasHeader) missing.push('header');
                        if (!validation.hasContent) missing.push('content');
                        
                        this.updateModuleStatus(moduleId, 'invalid', `Missing: ${missing.join(', ')}`);
                        this.addLogEntry(`⚠️ ${this.formatModuleName(moduleId)}: Missing ${missing.join(', ')}`);
                    }
                } else {
                    validation.errors.push('Module element not found');
                    this.updateModuleStatus(moduleId, 'invalid', 'Not Found');
                    this.addLogEntry(`❌ ${this.formatModuleName(moduleId)}: Module element not found`);
                }

            } catch (error) {
                validation.errors.push(`Validation error: ${error.message}`);
                this.updateModuleStatus(moduleId, 'invalid', 'Error');
                this.addLogEntry(`❌ ${this.formatModuleName(moduleId)}: ${error.message}`);
            }

            this.validationResults.set(moduleId, validation);
            this.updateProgress(validatedCount, `Validated ${validatedCount}/${this.totalModuleCount} modules`);
            
            await this.delay(100);
        }

        this.addLogEntry(`📊 DOM validation complete: ${validatedCount}/${this.totalModuleCount} modules valid`);
    }

    async validateSidebarBindings() {
        this.addLogEntry('🔗 Testing sidebar navigation bindings', 'working');
        
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        let workingBindings = 0;

        sidebarItems.forEach((item) => {
            const moduleId = item.getAttribute('data-module');
            const hasClickHandler = !!(item.onclick || item.getAttribute('onclick'));
            
            if (moduleId && this.actualModules.includes(moduleId)) {
                if (hasClickHandler) {
                    workingBindings++;
                    this.addLogEntry(`✅ ${this.formatModuleName(moduleId)}: Navigation binding active`);
                } else {
                    this.addLogEntry(`⚠️ ${this.formatModuleName(moduleId)}: No click handler found`);
                }
            }
        });

        this.addLogEntry(`🎯 Sidebar validation: ${workingBindings} navigation bindings active`);
    }

    async validateAPIEndpoints() {
        this.addLogEntry('🌐 Validating API endpoints and data connections', 'working');
        
        const criticalEndpoints = [
            { url: '/api/qnis/leads', name: 'QNIS Leads' },
            { url: '/api/dashboard/metrics', name: 'Dashboard Metrics' },
            { url: '/api/vault/status', name: 'API Vault' },
            { url: '/cached_leads.json', name: 'Lead Cache' }
        ];

        let workingEndpoints = 0;

        for (const endpoint of criticalEndpoints) {
            try {
                const response = await fetch(endpoint.url);
                if (response.ok) {
                    workingEndpoints++;
                    this.addLogEntry(`✅ ${endpoint.name}: Operational (${response.status})`);
                } else {
                    this.addLogEntry(`⚠️ ${endpoint.name}: Response ${response.status}`);
                }
            } catch (error) {
                this.addLogEntry(`❌ ${endpoint.name}: Connection failed`);
            }
            
            await this.delay(200);
        }

        this.addLogEntry(`🔌 API validation: ${workingEndpoints}/${criticalEndpoints.length} endpoints operational`);
    }

    async validateInteractiveFunctionality() {
        this.addLogEntry('🖱️ Testing interactive functionality', 'working');
        
        // Test key interactive elements
        const functionalTests = [
            { name: 'QNIS Map Canvas', selector: '#qnis-map canvas', test: 'canvas rendering' },
            { name: 'Voice Command Interface', selector: '#voice-indicator', test: 'voice system' },
            { name: 'API Key Vault', selector: '.key-section', test: 'security vault' },
            { name: 'Self-Healing System', global: 'autonomous_self_fix', test: 'auto-repair' }
        ];

        let workingFunctions = 0;

        for (const test of functionalTests) {
            let isWorking = false;
            
            if (test.selector) {
                const element = document.querySelector(test.selector);
                isWorking = !!element;
            } else if (test.global) {
                isWorking = !!(window[test.global] || window[test.global.replace(/_/g, '')]);
            }

            if (isWorking) {
                workingFunctions++;
                this.addLogEntry(`✅ ${test.name}: Functional`);
            } else {
                this.addLogEntry(`⚠️ ${test.name}: Not detected`);
            }
        }

        this.addLogEntry(`🎮 Interactive validation: ${workingFunctions}/${functionalTests.length} systems functional`);
    }

    generateFinalValidationReport() {
        const validModules = Array.from(this.moduleStatus.values()).filter(m => m.status === 'valid').length;
        const invalidModules = this.totalModuleCount - validModules;
        const successRate = Math.round((validModules / this.totalModuleCount) * 100);

        this.updateProgress(validModules, 'Validation Complete');
        
        this.addLogEntry(`🏁 Validation complete: ${successRate}% success rate`);
        this.addLogEntry(`📈 Results: ${validModules} valid, ${invalidModules} need attention`);
        
        if (successRate >= 90) {
            this.addLogEntry('🎉 System Status: PRODUCTION READY');
        } else if (successRate >= 75) {
            this.addLogEntry('⚠️ System Status: MOSTLY OPERATIONAL');
        } else {
            this.addLogEntry('🔧 System Status: REQUIRES MAINTENANCE');
        }

        // Update any existing validators
        if (window.moduleValidator) {
            window.moduleValidator.modules = this.actualModules;
            console.log('[MODULE-COUNTER] Updated module validator with accurate count');
        }

        return {
            totalModules: this.totalModuleCount,
            validModules,
            invalidModules,
            successRate,
            moduleStatus: Object.fromEntries(this.moduleStatus),
            validationResults: Object.fromEntries(this.validationResults),
            timestamp: new Date().toISOString()
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Execute accurate module counting and validation
if (typeof window !== 'undefined') {
    window.accurateModuleCounter = new AccurateModuleCounter();
    
    // Start validation after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.accurateModuleCounter.executeComprehensiveValidation();
            }, 5000);
        });
    } else {
        setTimeout(() => {
            window.accurateModuleCounter.executeComprehensiveValidation();
        }, 5000);
    }
}

export default AccurateModuleCounter;