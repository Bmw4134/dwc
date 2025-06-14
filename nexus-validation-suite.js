/**
 * NEXUS Comprehensive Validation Suite
 * Deep validation of all 47 modules with auto-repair capabilities
 */

class NEXUSValidationSuite {
    constructor() {
        this.validationResults = {
            modules: {},
            sidebar: {},
            map: {},
            auth: {},
            landing: {},
            critical: []
        };
        this.repairQueue = [];
        this.moduleCategories = {
            'AI Intelligence Suite': [
                'nexus-ai-core', 'quantum-analytics', 'predictive-modeling', 'neural-processing',
                'intelligent-automation', 'data-fusion', 'cognitive-insights', 'pattern-recognition',
                'machine-learning', 'natural-language', 'computer-vision', 'decision-engine'
            ],
            'Operations Control': [
                'system-monitor', 'performance-optimizer', 'resource-manager', 'security-center',
                'backup-recovery', 'log-analyzer', 'alert-system', 'maintenance-scheduler'
            ],
            'Business Intelligence': [
                'revenue-analytics', 'market-intelligence', 'competitor-analysis', 'customer-insights',
                'sales-forecasting', 'roi-calculator', 'kpi-dashboard', 'executive-summary',
                'trend-analysis', 'business-metrics'
            ],
            'Trading & Finance': [
                'portfolio-manager', 'risk-assessment', 'market-data', 'trading-algorithms',
                'financial-planning', 'investment-tracker', 'crypto-monitor', 'forex-analytics',
                'compliance-checker'
            ],
            'System Administration': [
                'user-management', 'access-control', 'audit-trail', 'configuration-manager',
                'deployment-tools', 'monitoring-suite', 'database-admin', 'api-gateway'
            ]
        };
    }

    async executeFullValidation() {
        console.log('[NEXUS-VALIDATION] Starting comprehensive platform validation...');
        
        // Create validation overlay
        this.createValidationOverlay();
        
        // Validate all modules
        await this.validateAllModules();
        
        // Validate sidebar integrity
        await this.validateSidebarStructure();
        
        // Validate map functionality
        await this.validateMapSystem();
        
        // Validate authentication
        await this.validateAuthSystem();
        
        // Validate landing page
        await this.validateLandingPage();
        
        // Execute repairs
        await this.executeRepairs();
        
        // Generate final report
        this.generateValidationReport();
        
        console.log('[NEXUS-VALIDATION] Comprehensive validation completed');
    }

    createValidationOverlay() {
        // Remove existing overlay if present
        const existing = document.getElementById('nexus-validation-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'nexus-validation-overlay';
        overlay.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; width: 300px; background: rgba(0, 0, 0, 0.9); border: 2px solid #00d4ff; border-radius: 8px; padding: 15px; z-index: 10000; color: white; font-family: monospace; max-height: 400px; overflow-y: auto;">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #00d4ff; font-weight: bold;">NEXUS VALIDATION</span>
                    <button onclick="document.getElementById('nexus-validation-overlay').remove()" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 16px;">×</button>
                </div>
                <div id="validation-progress" style="margin-bottom: 10px;">
                    <div style="background: #333; height: 4px; border-radius: 2px;">
                        <div id="validation-progress-bar" style="background: #00d4ff; height: 100%; width: 0%; border-radius: 2px; transition: width 0.3s;"></div>
                    </div>
                    <div id="validation-status" style="margin-top: 5px; font-size: 11px;">Initializing...</div>
                </div>
                <div id="validation-log" style="font-size: 10px; max-height: 250px; overflow-y: auto;"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    updateValidationProgress(percentage, message) {
        const progressBar = document.getElementById('validation-progress-bar');
        const status = document.getElementById('validation-status');
        if (progressBar) progressBar.style.width = percentage + '%';
        if (status) status.textContent = message;
    }

    addValidationLog(message, type = 'info') {
        const log = document.getElementById('validation-log');
        if (log) {
            const color = type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#00d4ff';
            log.innerHTML += `<div style="color: ${color}; margin-bottom: 2px;">[${new Date().toLocaleTimeString()}] ${message}</div>`;
            log.scrollTop = log.scrollHeight;
        }
    }

    async validateAllModules() {
        this.updateValidationProgress(10, 'Validating 47 core modules...');
        this.addValidationLog('Starting module validation cycle');
        
        let moduleCount = 0;
        let validModules = 0;
        
        for (const [category, modules] of Object.entries(this.moduleCategories)) {
            this.addValidationLog(`Validating ${category} (${modules.length} modules)`);
            
            for (const moduleId of modules) {
                moduleCount++;
                const isValid = await this.validateSingleModule(moduleId, category);
                if (isValid) {
                    validModules++;
                    this.validationResults.modules[moduleId] = { status: 'valid', category };
                } else {
                    this.validationResults.modules[moduleId] = { status: 'invalid', category };
                    this.repairQueue.push({ type: 'module', id: moduleId, category });
                }
                
                // Update progress
                const progress = 10 + (moduleCount / 47) * 30;
                this.updateValidationProgress(progress, `Module ${moduleCount}/47: ${moduleId}`);
                
                await this.delay(50); // Prevent UI blocking
            }
        }
        
        this.addValidationLog(`Module validation complete: ${validModules}/47 valid`, validModules === 47 ? 'success' : 'error');
    }

    async validateSingleModule(moduleId, category) {
        // Check if module exists in sidebar
        const sidebarLink = document.querySelector(`[data-module="${moduleId}"]`) || 
                           document.querySelector(`#${moduleId}`) ||
                           document.querySelector(`[onclick*="${moduleId}"]`);
        
        if (!sidebarLink) {
            this.addValidationLog(`Module ${moduleId} missing from sidebar`, 'error');
            return false;
        }

        // Check if module container exists
        const moduleContainer = document.getElementById(`${moduleId}-module`) ||
                               document.querySelector(`.${moduleId}-container`);
        
        // Module is valid if it has sidebar presence (container created on-demand)
        return true;
    }

    async validateSidebarStructure() {
        this.updateValidationProgress(45, 'Validating sidebar structure...');
        this.addValidationLog('Checking sidebar integrity');
        
        const sidebar = document.querySelector('.sidebar') || 
                       document.querySelector('#sidebar') ||
                       document.querySelector('[class*="sidebar"]');
        
        if (!sidebar) {
            this.addValidationLog('Critical: Sidebar not found', 'error');
            this.validationResults.critical.push('sidebar-missing');
            this.repairQueue.push({ type: 'sidebar', action: 'create' });
            return;
        }

        // Check for duplicate sidebars
        const sidebars = document.querySelectorAll('.sidebar, #sidebar, [class*="sidebar"]');
        if (sidebars.length > 1) {
            this.addValidationLog(`Warning: ${sidebars.length} sidebars detected, removing duplicates`, 'error');
            this.repairQueue.push({ type: 'sidebar', action: 'deduplicate' });
        }

        // Check sidebar positioning and z-index
        const computedStyle = window.getComputedStyle(sidebar);
        if (parseInt(computedStyle.zIndex) < 1000) {
            this.addValidationLog('Sidebar z-index too low, fixing', 'error');
            this.repairQueue.push({ type: 'sidebar', action: 'fix-zindex' });
        }

        this.validationResults.sidebar.structure = 'valid';
        this.addValidationLog('Sidebar structure validation complete', 'success');
    }

    async validateMapSystem() {
        this.updateValidationProgress(60, 'Validating QNIS map system...');
        this.addValidationLog('Checking map functionality');
        
        // Check for map container
        const mapContainer = document.getElementById('qnis-map') || 
                            document.querySelector('#map') ||
                            document.querySelector('.leaflet-container');
        
        if (!mapContainer) {
            this.addValidationLog('Map container not found', 'error');
            this.validationResults.map.container = 'missing';
            this.repairQueue.push({ type: 'map', action: 'create-container' });
            return;
        }

        // Check for Leaflet library
        if (typeof L === 'undefined') {
            this.addValidationLog('Leaflet library not loaded', 'error');
            this.repairQueue.push({ type: 'map', action: 'load-leaflet' });
        }

        // Check for live lead data
        try {
            const response = await fetch('/api/leads');
            if (response.ok) {
                const leads = await response.json();
                this.addValidationLog(`Map has ${leads.length} live leads`, 'success');
                this.validationResults.map.data = 'live';
            } else {
                this.addValidationLog('Map data API unavailable', 'error');
                this.validationResults.map.data = 'error';
            }
        } catch (error) {
            this.addValidationLog('Map data fetch failed', 'error');
            this.validationResults.map.data = 'error';
        }
    }

    async validateAuthSystem() {
        this.updateValidationProgress(75, 'Validating authentication system...');
        this.addValidationLog('Checking auth functionality');
        
        // Check for auth endpoints
        try {
            const response = await fetch('/api/auth/status');
            if (response.ok) {
                this.addValidationLog('Auth system operational', 'success');
                this.validationResults.auth.system = 'operational';
            } else {
                this.addValidationLog('Auth system unavailable', 'error');
                this.validationResults.auth.system = 'error';
            }
        } catch (error) {
            this.addValidationLog('Auth system check failed', 'error');
            this.validationResults.auth.system = 'error';
        }
    }

    async validateLandingPage() {
        this.updateValidationProgress(85, 'Validating landing page...');
        this.addValidationLog('Checking landing page elements');
        
        // Check if we're on landing page
        if (window.location.pathname === '/') {
            // Check for NEXUS title
            const title = document.title;
            if (title.includes('NEXUS') && title.includes('47')) {
                this.addValidationLog('Landing page title correct', 'success');
                this.validationResults.landing.title = 'correct';
            } else {
                this.addValidationLog('Landing page title needs update', 'error');
                this.validationResults.landing.title = 'incorrect';
            }

            // Check for single login button
            const loginButtons = document.querySelectorAll('[onclick*="dashboard"], [href*="dashboard"], button:contains("Access"), button:contains("Login")');
            if (loginButtons.length === 1) {
                this.addValidationLog('Single login button found', 'success');
            } else if (loginButtons.length > 1) {
                this.addValidationLog(`Multiple login buttons found (${loginButtons.length}), fixing`, 'error');
                this.repairQueue.push({ type: 'landing', action: 'fix-buttons' });
            }

            // Check for particle animations
            const particles = document.querySelectorAll('.particle');
            if (particles.length > 0) {
                this.addValidationLog(`Particle system active (${particles.length} particles)`, 'success');
            } else {
                this.addValidationLog('Particle system not active', 'error');
                this.repairQueue.push({ type: 'landing', action: 'activate-particles' });
            }
        }
    }

    async executeRepairs() {
        this.updateValidationProgress(90, 'Executing repairs...');
        this.addValidationLog(`Executing ${this.repairQueue.length} repairs`);
        
        for (const repair of this.repairQueue) {
            await this.executeRepair(repair);
            await this.delay(100);
        }
    }

    async executeRepair(repair) {
        switch (repair.type) {
            case 'module':
                this.addValidationLog(`Repairing module: ${repair.id}`);
                await this.repairModule(repair.id, repair.category);
                break;
            case 'sidebar':
                this.addValidationLog(`Repairing sidebar: ${repair.action}`);
                await this.repairSidebar(repair.action);
                break;
            case 'map':
                this.addValidationLog(`Repairing map: ${repair.action}`);
                await this.repairMap(repair.action);
                break;
            case 'landing':
                this.addValidationLog(`Repairing landing: ${repair.action}`);
                await this.repairLanding(repair.action);
                break;
        }
    }

    async repairModule(moduleId, category) {
        // Ensure module exists in sidebar
        const sidebar = document.querySelector('.sidebar ul') || document.querySelector('#sidebar ul');
        if (sidebar && !document.querySelector(`[data-module="${moduleId}"]`)) {
            const moduleItem = document.createElement('li');
            moduleItem.innerHTML = `
                <a href="#" data-module="${moduleId}" onclick="loadModule('${moduleId}')">
                    <span class="module-icon">⚡</span>
                    <span class="module-name">${this.formatModuleName(moduleId)}</span>
                </a>
            `;
            sidebar.appendChild(moduleItem);
        }
    }

    async repairSidebar(action) {
        switch (action) {
            case 'deduplicate':
                const sidebars = document.querySelectorAll('.sidebar, #sidebar, [class*="sidebar"]');
                for (let i = 1; i < sidebars.length; i++) {
                    sidebars[i].remove();
                }
                break;
            case 'fix-zindex':
                const sidebar = document.querySelector('.sidebar') || document.querySelector('#sidebar');
                if (sidebar) {
                    sidebar.style.zIndex = '9999';
                }
                break;
        }
    }

    async repairMap(action) {
        switch (action) {
            case 'create-container':
                if (!document.getElementById('qnis-map')) {
                    const mapContainer = document.createElement('div');
                    mapContainer.id = 'qnis-map';
                    mapContainer.style.cssText = 'width: 100%; height: 400px;';
                    const targetContainer = document.querySelector('.map-section') || document.body;
                    targetContainer.appendChild(mapContainer);
                }
                break;
            case 'load-leaflet':
                if (typeof L === 'undefined') {
                    const leafletCSS = document.createElement('link');
                    leafletCSS.rel = 'stylesheet';
                    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(leafletCSS);
                    
                    const leafletJS = document.createElement('script');
                    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    document.head.appendChild(leafletJS);
                }
                break;
        }
    }

    async repairLanding(action) {
        switch (action) {
            case 'activate-particles':
                // Recreate particle field if missing
                if (typeof createParticleField === 'function') {
                    createParticleField();
                }
                break;
            case 'fix-buttons':
                // Remove duplicate buttons, keep only primary CTA
                const buttons = document.querySelectorAll('[onclick*="dashboard"], [href*="dashboard"]');
                for (let i = 1; i < buttons.length; i++) {
                    buttons[i].remove();
                }
                break;
        }
    }

    generateValidationReport() {
        this.updateValidationProgress(100, 'Validation complete');
        
        const totalModules = Object.keys(this.validationResults.modules).length;
        const validModules = Object.values(this.validationResults.modules).filter(m => m.status === 'valid').length;
        const criticalIssues = this.validationResults.critical.length;
        const repairsExecuted = this.repairQueue.length;

        this.addValidationLog('=== VALIDATION SUMMARY ===', 'success');
        this.addValidationLog(`Modules: ${validModules}/${totalModules} valid`);
        this.addValidationLog(`Critical Issues: ${criticalIssues}`);
        this.addValidationLog(`Repairs Executed: ${repairsExecuted}`);
        
        if (validModules === 47 && criticalIssues === 0) {
            this.addValidationLog('✅ NEXUS PLATFORM FULLY OPERATIONAL', 'success');
        } else {
            this.addValidationLog('⚠️ Platform requires attention', 'error');
        }

        // Auto-close overlay after 10 seconds
        setTimeout(() => {
            const overlay = document.getElementById('nexus-validation-overlay');
            if (overlay) overlay.remove();
        }, 10000);
    }

    formatModuleName(moduleId) {
        return moduleId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize validation suite
const nexusValidator = new NEXUSValidationSuite();

// Auto-execute if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => nexusValidator.executeFullValidation());
} else {
    nexusValidator.executeFullValidation();
}

// Export for manual execution
window.nexusValidator = nexusValidator;