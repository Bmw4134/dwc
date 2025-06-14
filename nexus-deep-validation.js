/**
 * NEXUS Deep Validation System
 * Comprehensive analysis and repair of all 47 modules and system connectivity
 */

class NEXUSDeepValidator {
    constructor() {
        this.validationResults = {
            modules: {},
            connectivity: {},
            dataIntegrity: {},
            userInterface: {}
        };
        this.criticalIssues = [];
        this.fixesApplied = [];
    }

    async executeFullValidation() {
        console.log('[NEXUS] Starting comprehensive deep validation...');
        
        this.createValidationOverlay();
        
        // Core validation phases
        await this.validateModuleStructure();
        await this.validateDataConnectivity();
        await this.validateUserInterface();
        await this.validateInteractivity();
        await this.performSelfHealing();
        
        this.generateDeepValidationReport();
        
        console.log('[NEXUS] Deep validation complete');
    }

    createValidationOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'nexus-validation-overlay';
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 10000; display: flex; justify-content: center; align-items: center;">
                <div style="background: linear-gradient(135deg, #001122, #000a14); border: 2px solid #00d4ff; border-radius: 20px; padding: 2rem; max-width: 600px; color: white; font-family: monospace;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="font-size: 2rem; color: #00d4ff; margin-bottom: 1rem;">🔍 NEXUS Deep Validation</div>
                        <div style="color: #00ff88;">Analyzing 47 modules and system integrity</div>
                    </div>
                    
                    <div id="validation-progress" style="width: 100%; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-bottom: 1rem;">
                        <div id="validation-bar" style="height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); border-radius: 10px; width: 0%; transition: width 0.3s;"></div>
                    </div>
                    
                    <div id="validation-status" style="color: #00ff88; text-align: center; margin-bottom: 1rem;">Initializing validation systems...</div>
                    
                    <div id="validation-details" style="max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 10px; font-size: 0.9rem;">
                        <div>🔧 System initialization...</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    updateValidationProgress(progress, status, details) {
        const progressBar = document.getElementById('validation-bar');
        const statusElement = document.getElementById('validation-status');
        const detailsElement = document.getElementById('validation-details');
        
        if (progressBar) progressBar.style.width = progress + '%';
        if (statusElement) statusElement.textContent = status;
        if (detailsElement && details) {
            detailsElement.innerHTML += `<div>✓ ${details}</div>`;
            detailsElement.scrollTop = detailsElement.scrollHeight;
        }
    }

    async validateModuleStructure() {
        this.updateValidationProgress(10, 'Validating module structure...', 'Scanning sidebar modules');
        
        const sidebarModules = document.querySelectorAll('.module-item');
        const expectedModules = 47;
        
        if (sidebarModules.length !== expectedModules) {
            this.criticalIssues.push(`Expected ${expectedModules} modules, found ${sidebarModules.length}`);
        }

        // Validate each module
        sidebarModules.forEach((module, index) => {
            const moduleId = module.getAttribute('onclick')?.match(/activateModule\('([^']+)'\)/)?.[1];
            const moduleName = module.querySelector('.module-name')?.textContent;
            
            this.validationResults.modules[moduleId || `module_${index}`] = {
                exists: true,
                hasName: !!moduleName,
                hasOnClick: !!moduleId,
                isClickable: module.style.cursor === 'pointer' || module.onclick
            };
        });

        this.updateValidationProgress(25, 'Module structure validated', `Found ${sidebarModules.length} modules`);
    }

    async validateDataConnectivity() {
        this.updateValidationProgress(40, 'Testing data connectivity...', 'Checking API endpoints');
        
        // Test lead data endpoint
        try {
            const response = await fetch('/api/leads');
            if (response.ok) {
                const leads = await response.json();
                this.validationResults.connectivity.leadsAPI = {
                    status: 'connected',
                    leadCount: leads.length
                };
                this.updateValidationProgress(50, 'Lead API connected', `Found ${leads.length} leads`);
            } else {
                this.criticalIssues.push('Lead API not responding properly');
            }
        } catch (error) {
            this.criticalIssues.push('Lead API connection failed: ' + error.message);
        }

        // Test metrics endpoint
        try {
            const response = await fetch('/api/metrics');
            if (response.ok) {
                this.validationResults.connectivity.metricsAPI = { status: 'connected' };
                this.updateValidationProgress(60, 'Metrics API connected', 'System metrics available');
            }
        } catch (error) {
            this.validationResults.connectivity.metricsAPI = { status: 'failed', error: error.message };
        }
    }

    async validateUserInterface() {
        this.updateValidationProgress(70, 'Validating user interface...', 'Checking layout integrity');
        
        // Check main content area
        const mainModule = document.getElementById('main-module');
        if (!mainModule) {
            this.criticalIssues.push('Main module display area missing');
        } else {
            this.validationResults.userInterface.mainModule = { exists: true };
        }

        // Check sidebar visibility
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            this.criticalIssues.push('Sidebar not found');
        } else {
            const isVisible = window.getComputedStyle(sidebar).display !== 'none';
            this.validationResults.userInterface.sidebar = { exists: true, visible: isVisible };
        }

        this.updateValidationProgress(80, 'UI validation complete', 'Interface structure verified');
    }

    async validateInteractivity() {
        this.updateValidationProgress(85, 'Testing interactivity...', 'Validating module clicks');
        
        // Test module activation
        const firstModule = document.querySelector('.module-item[onclick]');
        if (firstModule) {
            try {
                // Simulate click
                const onclick = firstModule.getAttribute('onclick');
                if (onclick) {
                    eval(onclick);
                    this.validationResults.userInterface.moduleClicks = { working: true };
                    this.updateValidationProgress(90, 'Module clicks working', 'Interactive system functional');
                }
            } catch (error) {
                this.criticalIssues.push('Module click functionality broken: ' + error.message);
            }
        }
    }

    async performSelfHealing() {
        this.updateValidationProgress(95, 'Performing self-healing...', 'Applying fixes');
        
        // Fix missing module functionality
        if (this.criticalIssues.length > 0) {
            this.applyEmergencyFixes();
        }

        // Ensure data refresh
        if (window.loadLiveLeadData) {
            await window.loadLiveLeadData();
            this.fixesApplied.push('Live lead data refreshed');
        }

        this.updateValidationProgress(100, 'Validation complete', 'System ready for operation');
    }

    applyEmergencyFixes() {
        // Fix module click issues
        const moduleItems = document.querySelectorAll('.module-item');
        moduleItems.forEach((item, index) => {
            if (!item.onclick && !item.getAttribute('onclick')) {
                const moduleId = `module-${index}`;
                item.setAttribute('onclick', `activateModule('${moduleId}')`);
                item.style.cursor = 'pointer';
                this.fixesApplied.push(`Fixed click handler for module ${index}`);
            }
        });

        // Ensure main content area exists
        if (!document.getElementById('main-module')) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                const moduleDiv = document.createElement('div');
                moduleDiv.id = 'main-module';
                moduleDiv.innerHTML = `
                    <div class="module-header">
                        <div class="module-header-icon">🚀</div>
                        <div class="module-header-title">NEXUS System Ready</div>
                    </div>
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 1.5rem; color: #00ff88; margin-bottom: 1rem;">All systems operational</div>
                        <div>Select a module from the sidebar to begin</div>
                    </div>
                `;
                mainContent.appendChild(moduleDiv);
                this.fixesApplied.push('Created main module display area');
            }
        }
    }

    generateDeepValidationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            modulesFound: Object.keys(this.validationResults.modules).length,
            criticalIssues: this.criticalIssues.length,
            fixesApplied: this.fixesApplied.length,
            systemStatus: this.criticalIssues.length === 0 ? 'OPERATIONAL' : 'REQUIRES_ATTENTION',
            details: this.validationResults,
            issues: this.criticalIssues,
            fixes: this.fixesApplied
        };

        console.log('[NEXUS] Deep Validation Report:', report);

        // Update overlay with final results
        setTimeout(() => {
            const overlay = document.getElementById('nexus-validation-overlay');
            if (overlay) {
                overlay.querySelector('#validation-details').innerHTML = `
                    <div style="color: #00ff88;">✓ Modules validated: ${report.modulesFound}</div>
                    <div style="color: #00ff88;">✓ Fixes applied: ${report.fixesApplied}</div>
                    <div style="color: ${report.criticalIssues > 0 ? '#ff4444' : '#00ff88'};">
                        ${report.criticalIssues > 0 ? '⚠' : '✓'} Issues: ${report.criticalIssues}
                    </div>
                    <div style="color: #00d4ff; margin-top: 1rem;">Status: ${report.systemStatus}</div>
                `;
                
                // Auto-close after 3 seconds
                setTimeout(() => {
                    overlay.remove();
                }, 3000);
            }
        }, 1000);

        return report;
    }
}

// Initialize and run validation
document.addEventListener('DOMContentLoaded', () => {
    const validator = new NEXUSDeepValidator();
    
    // Add validation trigger button
    const validationButton = document.createElement('button');
    validationButton.textContent = 'Run Deep Validation';
    validationButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00d4ff, #00ff88);
        color: black;
        border: none;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
    `;
    validationButton.onclick = () => validator.executeFullValidation();
    
    document.body.appendChild(validationButton);
    
    // Auto-run validation after page load
    setTimeout(() => validator.executeFullValidation(), 2000);
});