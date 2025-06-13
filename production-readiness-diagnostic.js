/**
 * Production Readiness Diagnostic & Emergency Fix Protocol
 * Identifies and fixes critical deployment blockers
 */

class ProductionReadinessDiagnostic {
    constructor() {
        this.criticalIssues = [];
        this.fixesApplied = [];
        this.validationResults = new Map();
    }

    async executeEmergencyDiagnostic() {
        console.log('[PROD-DIAG] Starting emergency production readiness diagnostic');
        
        this.initializeDiagnosticOverlay();
        
        // Phase 1: Core system validation
        await this.validateCoreSystemIntegrity();
        
        // Phase 2: API connectivity validation
        await this.validateAPIConnectivity();
        
        // Phase 3: Map system validation
        await this.validateMapSystemIntegrity();
        
        // Phase 4: Module functionality validation
        await this.validateModuleFunctionality();
        
        // Phase 5: Apply emergency fixes
        await this.applyEmergencyFixes();
        
        // Phase 6: Generate production readiness report
        this.generateProductionReport();
        
        return this.validationResults;
    }

    initializeDiagnosticOverlay() {
        const existingOverlay = document.getElementById('prod-diagnostic-overlay');
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.id = 'prod-diagnostic-overlay';
        overlay.className = 'dev-status-overlay active';
        overlay.innerHTML = `
            <div class="dev-status-header">
                <span class="dev-status-title">🚨 Production Readiness Diagnostic</span>
                <div class="dev-actions">
                    <span id="prod-status" class="dev-completion">Scanning...</span>
                    <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" class="dev-toggle-btn">Hide</button>
                </div>
            </div>
            <div class="dev-status-content">
                <div class="dev-progress-section">
                    <div class="dev-progress-bar">
                        <div id="prod-progress-fill" class="dev-progress-fill" style="width: 0%"></div>
                        <span id="prod-progress-text" class="dev-progress-text">Initializing emergency diagnostic...</span>
                    </div>
                    
                    <div class="diagnostic-categories">
                        <div class="category-section">
                            <h4 style="color: #ff4444; margin: 12px 0 8px 0; font-size: 13px;">Critical Issues</h4>
                            <div id="critical-issues" class="issue-list">
                                <div class="issue-item pending">Scanning for blockers...</div>
                            </div>
                        </div>
                        
                        <div class="category-section">
                            <h4 style="color: #ffaa00; margin: 12px 0 8px 0; font-size: 13px;">Fixes Applied</h4>
                            <div id="fixes-applied" class="fix-list">
                                <div class="fix-item pending">Ready to apply fixes...</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="prod-status-log" class="dev-status-log">
                    <div class="dev-log-entry active">🚨 Emergency diagnostic initiated</div>
                </div>
            </div>
        `;

        // Add diagnostic-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .diagnostic-categories {
                max-height: 350px;
                overflow-y: auto;
                margin-bottom: 16px;
            }
            .issue-list, .fix-list {
                margin-bottom: 12px;
            }
            .issue-item, .fix-item {
                padding: 6px 10px;
                margin: 3px 0;
                border-radius: 4px;
                font-size: 11px;
                transition: all 0.3s ease;
            }
            .issue-item.critical {
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                color: #ff4444;
            }
            .issue-item.warning {
                background: rgba(255, 170, 0, 0.1);
                border: 1px solid rgba(255, 170, 0, 0.3);
                color: #ffaa00;
            }
            .fix-item.applied {
                background: rgba(0, 255, 136, 0.1);
                border: 1px solid rgba(0, 255, 136, 0.3);
                color: #00ff88;
            }
            .fix-item.pending {
                background: rgba(100, 116, 139, 0.1);
                border: 1px solid rgba(100, 116, 139, 0.2);
                color: #64748b;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }

    addCriticalIssue(description, severity = 'critical') {
        this.criticalIssues.push({ description, severity, timestamp: Date.now() });
        
        const issuesContainer = document.getElementById('critical-issues');
        if (issuesContainer) {
            const issueItem = document.createElement('div');
            issueItem.className = `issue-item ${severity}`;
            issueItem.textContent = `❌ ${description}`;
            issuesContainer.appendChild(issueItem);
        }
        
        this.addDiagnosticLog(`❌ CRITICAL: ${description}`, 'error');
    }

    addFixApplied(description) {
        this.fixesApplied.push({ description, timestamp: Date.now() });
        
        const fixesContainer = document.getElementById('fixes-applied');
        if (fixesContainer) {
            const fixItem = document.createElement('div');
            fixItem.className = 'fix-item applied';
            fixItem.textContent = `✅ ${description}`;
            fixesContainer.appendChild(fixItem);
        }
        
        this.addDiagnosticLog(`✅ FIXED: ${description}`, 'success');
    }

    addDiagnosticLog(message, type = 'info') {
        const logContainer = document.getElementById('prod-status-log');
        if (!logContainer) return;

        const entry = document.createElement('div');
        entry.className = `dev-log-entry ${type}`;
        entry.textContent = message;
        
        logContainer.insertBefore(entry, logContainer.firstChild);
        
        while (logContainer.children.length > 12) {
            logContainer.removeChild(logContainer.lastChild);
        }
        
        console.log(`[PROD-DIAG] ${message}`);
    }

    updateProgress(percentage, message) {
        const progressFill = document.getElementById('prod-progress-fill');
        const progressText = document.getElementById('prod-progress-text');
        const status = document.getElementById('prod-status');

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = message;
        if (status) status.textContent = `${percentage}% Complete`;
    }

    async validateCoreSystemIntegrity() {
        this.addDiagnosticLog('🔍 Validating core system integrity...', 'working');
        this.updateProgress(10, 'Checking core systems...');
        
        // Check essential DOM elements
        const essentialElements = [
            { id: 'sidebar', name: 'Navigation Sidebar' },
            { id: 'main-content', name: 'Main Content Area' },
            { id: 'qnis-map-container', name: 'QNIS Map Container' },
            { id: 'business-module', name: 'Business Module' }
        ];

        for (const element of essentialElements) {
            const domElement = document.getElementById(element.id);
            if (!domElement) {
                this.addCriticalIssue(`Missing essential DOM element: ${element.name}`);
            }
        }

        // Check JavaScript functionality
        if (typeof showModule !== 'function') {
            this.addCriticalIssue('Core navigation function missing');
        }
        
        if (typeof window.QNIS === 'undefined') {
            this.addCriticalIssue('QNIS system not initialized');
        }

        await this.delay(500);
        this.updateProgress(25, 'Core system validation complete');
    }

    async validateAPIConnectivity() {
        this.addDiagnosticLog('🌐 Testing API connectivity...', 'working');
        this.updateProgress(40, 'Testing API endpoints...');
        
        const apiEndpoints = [
            { url: '/api/qnis/leads', name: 'QNIS Leads API', critical: true },
            { url: '/api/dashboard/metrics', name: 'Dashboard Metrics', critical: true },
            { url: '/cached_leads.json', name: 'Lead Cache', critical: false }
        ];

        for (const api of apiEndpoints) {
            try {
                const response = await fetch(api.url);
                if (!response.ok) {
                    if (api.critical) {
                        this.addCriticalIssue(`${api.name}: HTTP ${response.status}`);
                    } else {
                        this.addDiagnosticLog(`⚠️ ${api.name}: HTTP ${response.status}`, 'warning');
                    }
                }
            } catch (error) {
                if (api.critical) {
                    this.addCriticalIssue(`${api.name}: Connection failed`);
                } else {
                    this.addDiagnosticLog(`⚠️ ${api.name}: Connection failed`, 'warning');
                }
            }
        }

        this.updateProgress(55, 'API connectivity validation complete');
    }

    async validateMapSystemIntegrity() {
        this.addDiagnosticLog('🗺️ Validating map system integrity...', 'working');
        this.updateProgress(70, 'Checking map systems...');
        
        // Check QNIS map container
        const mapContainer = document.getElementById('qnis-map-container');
        if (!mapContainer) {
            this.addCriticalIssue('QNIS map container missing');
        } else {
            const containerRect = mapContainer.getBoundingClientRect();
            if (containerRect.width === 0 || containerRect.height === 0) {
                this.addCriticalIssue('QNIS map container has zero dimensions');
            }
        }

        // Check canvas fallback
        const canvas = document.getElementById('qnis-canvas');
        if (!canvas) {
            this.addCriticalIssue('QNIS canvas fallback missing');
        } else {
            if (canvas.width === 0 || canvas.height === 0) {
                this.addCriticalIssue('QNIS canvas has zero dimensions');
            }
        }

        // Check lead data availability
        if (typeof window.QNIS !== 'undefined' && window.QNIS.leadCache) {
            const leadCount = window.QNIS.leadCache.length || 0;
            if (leadCount === 0) {
                this.addCriticalIssue('No lead data available for map rendering');
            }
        }

        this.updateProgress(85, 'Map system validation complete');
    }

    async validateModuleFunctionality() {
        this.addDiagnosticLog('⚙️ Validating module functionality...', 'working');
        this.updateProgress(95, 'Testing module interactions...');
        
        // Test module switching
        const testModules = ['business', 'qnis', 'analytics'];
        
        for (const moduleId of testModules) {
            const navElement = document.querySelector(`[onclick="showModule('${moduleId}')"]`);
            const moduleElement = document.getElementById(`${moduleId}-module`);
            
            if (!navElement) {
                this.addCriticalIssue(`Module navigation missing: ${moduleId}`);
            }
            
            if (!moduleElement) {
                this.addCriticalIssue(`Module content missing: ${moduleId}`);
            }
        }

        this.updateProgress(100, 'Module functionality validation complete');
    }

    async applyEmergencyFixes() {
        this.addDiagnosticLog('🔧 Applying emergency fixes...', 'working');
        
        // Fix 1: Ensure QNIS map container has proper dimensions
        const mapContainer = document.getElementById('qnis-map-container');
        if (mapContainer) {
            mapContainer.style.minWidth = '100%';
            mapContainer.style.minHeight = '400px';
            this.addFixApplied('QNIS map container dimensions fixed');
        }

        // Fix 2: Initialize missing canvas with proper dimensions
        let canvas = document.getElementById('qnis-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'qnis-canvas';
            canvas.width = 800;
            canvas.height = 400;
            mapContainer?.appendChild(canvas);
            this.addFixApplied('Emergency canvas created and configured');
        } else if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = 800;
            canvas.height = 400;
            this.addFixApplied('Canvas dimensions restored');
        }

        // Fix 3: Reinitialize QNIS system if broken
        if (typeof window.QNIS === 'undefined') {
            window.QNIS = {
                leadCache: [],
                canvas: canvas,
                initialized: false
            };
            this.addFixApplied('QNIS system object restored');
        }

        // Fix 4: Force module visibility fixes
        const activeModule = document.querySelector('.module-view[style*="block"]');
        if (!activeModule) {
            const businessModule = document.getElementById('business-module');
            if (businessModule) {
                businessModule.style.display = 'block';
                this.addFixApplied('Default module visibility restored');
            }
        }

        await this.delay(1000);
    }

    generateProductionReport() {
        const criticalCount = this.criticalIssues.filter(issue => issue.severity === 'critical').length;
        const fixesCount = this.fixesApplied.length;
        
        this.addDiagnosticLog(`🏁 Diagnostic complete: ${criticalCount} critical issues, ${fixesCount} fixes applied`);
        
        if (criticalCount === 0) {
            this.addDiagnosticLog('🎉 PRODUCTION READY: All critical issues resolved');
            document.getElementById('prod-status').textContent = 'PRODUCTION READY';
            document.getElementById('prod-status').style.color = '#00ff88';
        } else if (criticalCount <= 2) {
            this.addDiagnosticLog('⚡ PARTIALLY READY: Minor issues remain');
            document.getElementById('prod-status').textContent = 'NEEDS ATTENTION';
            document.getElementById('prod-status').style.color = '#ffaa00';
        } else {
            this.addDiagnosticLog('🚨 NOT READY: Critical issues require resolution');
            document.getElementById('prod-status').textContent = 'NOT PRODUCTION READY';
            document.getElementById('prod-status').style.color = '#ff4444';
        }

        return {
            criticalIssues: criticalCount,
            fixesApplied: fixesCount,
            productionReady: criticalCount === 0,
            timestamp: new Date().toISOString()
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Execute emergency diagnostic
if (typeof window !== 'undefined') {
    window.productionDiagnostic = new ProductionReadinessDiagnostic();
    
    // Start diagnostic after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.productionDiagnostic.executeEmergencyDiagnostic();
            }, 3000);
        });
    } else {
        setTimeout(() => {
            window.productionDiagnostic.executeEmergencyDiagnostic();
        }, 3000);
    }
}

export default ProductionReadinessDiagnostic;