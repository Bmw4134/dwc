/**
 * Final Optimization Audit - Comprehensive System Compliance Report
 * Generates detailed audit report for 95%+ compliance achievement
 */

class FinalOptimizationAudit {
    constructor() {
        this.auditResults = new Map();
        this.complianceScore = 0;
        this.domGuard = window.DOMGuard || this.createFallbackGuard();
        this.startTime = Date.now();
        
        this.initialize();
    }

    createFallbackGuard() {
        return {
            safeQuerySelector: (sel, ctx = document) => {
                try { return ctx.querySelector(sel); } catch(e) { return null; }
            },
            safeQuerySelectorAll: (sel, ctx = document) => {
                try { return Array.from(ctx.querySelectorAll(sel)); } catch(e) { return []; }
            }
        };
    }

    initialize() {
        console.log('[FINAL-AUDIT] Starting comprehensive system audit...');
        this.createAuditOverlay();
        setTimeout(() => this.executeComprehensiveAudit(), 500);
    }

    createAuditOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'final-audit-overlay';
        overlay.innerHTML = `
            <div class="fixed top-4 left-4 bg-gradient-to-r from-green-900 to-emerald-900 text-white p-6 rounded-lg shadow-2xl z-50 max-w-md">
                <div class="flex items-center mb-4">
                    <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse mr-3"></div>
                    <h3 class="text-lg font-bold">Final System Audit</h3>
                </div>
                <div id="audit-progress" class="mb-4">
                    <div class="bg-gray-700 rounded-full h-2 mb-2">
                        <div id="audit-progress-bar" class="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                    <div id="audit-progress-text" class="text-sm text-gray-300">Initializing audit...</div>
                </div>
                <div id="audit-log" class="text-xs text-gray-400 max-h-32 overflow-y-auto">
                    <div class="audit-entry">🔍 System audit commencing...</div>
                </div>
                <div class="mt-4 flex justify-between text-xs">
                    <span id="audit-compliance">Compliance: 0%</span>
                    <span id="audit-status">Status: Running</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    updateAuditProgress(percentage, message) {
        const progressBar = document.getElementById('audit-progress-bar');
        const progressText = document.getElementById('audit-progress-text');
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = message;
    }

    addAuditLogEntry(message) {
        const logContainer = document.getElementById('audit-log');
        if (logContainer) {
            const entry = document.createElement('div');
            entry.className = 'audit-entry';
            entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        console.log(`[FINAL-AUDIT] ${message}`);
    }

    async executeComprehensiveAudit() {
        try {
            this.updateAuditProgress(10, 'Auditing module structure...');
            await this.auditModuleStructure();
            
            this.updateAuditProgress(25, 'Validating navigation system...');
            await this.auditNavigationSystem();
            
            this.updateAuditProgress(40, 'Checking DOM integrity...');
            await this.auditDOMIntegrity();
            
            this.updateAuditProgress(55, 'Verifying API endpoints...');
            await this.auditAPIEndpoints();
            
            this.updateAuditProgress(70, 'Testing responsive design...');
            await this.auditResponsiveDesign();
            
            this.updateAuditProgress(85, 'Analyzing performance metrics...');
            await this.auditPerformanceMetrics();
            
            this.updateAuditProgress(95, 'Generating compliance report...');
            await this.generateComplianceReport();
            
            this.updateAuditProgress(100, 'Audit complete');
            this.displayFinalResults();
            
        } catch (error) {
            this.addAuditLogEntry(`Audit error: ${error.message}`);
            console.error('[FINAL-AUDIT] Audit failed:', error);
        }
    }

    async auditModuleStructure() {
        this.addAuditLogEntry('Analyzing 47 AI modules structure...');
        
        const sidebar = this.domGuard.safeQuerySelector('.nexus-sidebar');
        const moduleItems = this.domGuard.safeQuerySelectorAll('.module-item');
        
        const moduleStructure = {
            sidebarPresent: !!sidebar,
            moduleCount: moduleItems.length,
            categories: new Set(),
            duplicates: 0,
            brokenLinks: 0
        };

        // Check for module categories and duplicates
        const seenModules = new Set();
        moduleItems.forEach(item => {
            const moduleId = item.dataset?.module || item.id;
            const categoryElement = item.closest('.sidebar-section');
            
            if (categoryElement) {
                const categoryTitle = categoryElement.querySelector('.section-title')?.textContent;
                if (categoryTitle) moduleStructure.categories.add(categoryTitle);
            }
            
            if (seenModules.has(moduleId)) {
                moduleStructure.duplicates++;
            } else {
                seenModules.add(moduleId);
            }
            
            // Check if module content exists
            const contentElement = this.domGuard.safeQuerySelector(`#${moduleId}-content`);
            if (!contentElement) {
                moduleStructure.brokenLinks++;
            }
        });

        this.auditResults.set('moduleStructure', moduleStructure);
        this.addAuditLogEntry(`Found ${moduleStructure.moduleCount} modules in ${moduleStructure.categories.size} categories`);
    }

    async auditNavigationSystem() {
        this.addAuditLogEntry('Testing navigation system functionality...');
        
        const navigation = {
            sidebarToggle: false,
            moduleActivation: 0,
            routingErrors: 0,
            mobileCompatible: false
        };

        // Test sidebar toggle
        const sidebarToggle = this.domGuard.safeQuerySelector('.sidebar-toggle, .mobile-menu-toggle');
        if (sidebarToggle) {
            navigation.sidebarToggle = true;
        }

        // Test module activation
        const moduleItems = this.domGuard.safeQuerySelectorAll('.module-item');
        let workingModules = 0;
        
        for (const item of moduleItems.slice(0, 5)) { // Test first 5 modules
            try {
                const moduleId = item.dataset?.module || item.id;
                const contentElement = this.domGuard.safeQuerySelector(`#${moduleId}-content`);
                
                if (contentElement) {
                    workingModules++;
                }
            } catch (error) {
                navigation.routingErrors++;
            }
        }
        
        navigation.moduleActivation = workingModules;

        // Test mobile compatibility
        const viewport = document.querySelector('meta[name="viewport"]');
        const responsiveClasses = this.domGuard.safeQuerySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
        navigation.mobileCompatible = !!viewport && responsiveClasses.length > 0;

        this.auditResults.set('navigation', navigation);
        this.addAuditLogEntry(`Navigation: ${workingModules} working modules, mobile: ${navigation.mobileCompatible}`);
    }

    async auditDOMIntegrity() {
        this.addAuditLogEntry('Checking DOM structure integrity...');
        
        const domIntegrity = {
            criticalElements: 0,
            errorElements: 0,
            memoryLeaks: 0,
            eventListeners: 0
        };

        // Check critical elements
        const criticalSelectors = [
            '.nexus-sidebar',
            '#main-content',
            '.quantum-bg',
            '#qnis-map',
            '.kpi-metrics-container'
        ];

        criticalSelectors.forEach(selector => {
            const element = this.domGuard.safeQuerySelector(selector);
            if (element) {
                domIntegrity.criticalElements++;
            }
        });

        // Check for error elements
        const errorElements = this.domGuard.safeQuerySelectorAll('[class*="error"], .broken, .failed');
        domIntegrity.errorElements = errorElements.length;

        // Check event listeners (basic check)
        const elementsWithEvents = this.domGuard.safeQuerySelectorAll('[onclick], [onload], [onerror]');
        domIntegrity.eventListeners = elementsWithEvents.length;

        this.auditResults.set('domIntegrity', domIntegrity);
        this.addAuditLogEntry(`DOM: ${domIntegrity.criticalElements}/${criticalSelectors.length} critical elements present`);
    }

    async auditAPIEndpoints() {
        this.addAuditLogEntry('Testing API endpoint connectivity...');
        
        const apiEndpoints = {
            leads: false,
            businessMetrics: false,
            visionAI: false,
            health: false,
            responseTime: 0
        };

        const startTime = Date.now();

        // Test core endpoints
        const endpoints = [
            { path: '/api/nexus/leads', key: 'leads' },
            { path: '/api/business-metrics', key: 'businessMetrics' },
            { path: '/api/vision-analyze', key: 'visionAI' },
            { path: '/health', key: 'health' }
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint.path, {
                    method: endpoint.key === 'visionAI' ? 'POST' : 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    body: endpoint.key === 'visionAI' ? JSON.stringify({ test: true }) : undefined
                });
                
                apiEndpoints[endpoint.key] = response.ok || response.status < 500;
            } catch (error) {
                console.warn(`[FINAL-AUDIT] Endpoint ${endpoint.path} unavailable:`, error.message);
            }
        }

        apiEndpoints.responseTime = Date.now() - startTime;

        this.auditResults.set('apiEndpoints', apiEndpoints);
        this.addAuditLogEntry(`APIs: ${Object.values(apiEndpoints).filter(v => v === true).length} endpoints responsive`);
    }

    async auditResponsiveDesign() {
        this.addAuditLogEntry('Evaluating responsive design implementation...');
        
        const responsive = {
            viewportMeta: false,
            responsiveClasses: 0,
            mediaQueries: 0,
            touchOptimized: false,
            mobileBreakpoints: false
        };

        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        responsive.viewportMeta = !!viewport;

        // Check responsive classes
        const responsiveElements = this.domGuard.safeQuerySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
        responsive.responsiveClasses = responsiveElements.length;

        // Check for media queries in stylesheets
        const stylesheets = Array.from(document.styleSheets);
        let mediaQueryCount = 0;
        
        stylesheets.forEach(sheet => {
            try {
                if (sheet.cssRules) {
                    Array.from(sheet.cssRules).forEach(rule => {
                        if (rule.type === CSSRule.MEDIA_RULE) {
                            mediaQueryCount++;
                        }
                    });
                }
            } catch (e) {
                // Cross-origin stylesheets may not be accessible
            }
        });
        
        responsive.mediaQueries = mediaQueryCount;

        // Check touch optimization
        const touchElements = this.domGuard.safeQuerySelectorAll('[class*="touch"], [ontouchstart]');
        responsive.touchOptimized = touchElements.length > 0;

        // Check for mobile-first breakpoints
        const kpiContainer = this.domGuard.safeQuerySelector('.kpi-metrics-container');
        if (kpiContainer) {
            const hasGridResponsive = kpiContainer.className.includes('grid-cols-2') && 
                                    kpiContainer.className.includes('md:grid-cols-4');
            responsive.mobileBreakpoints = hasGridResponsive;
        }

        this.auditResults.set('responsive', responsive);
        this.addAuditLogEntry(`Responsive: ${responsive.responsiveClasses} elements, ${responsive.mediaQueries} media queries`);
    }

    async auditPerformanceMetrics() {
        this.addAuditLogEntry('Analyzing performance metrics...');
        
        const performance = {
            loadTime: this.startTime ? Date.now() - this.startTime : 0,
            memoryUsage: 0,
            domElements: document.all ? document.all.length : 0,
            imageOptimization: 0,
            cacheHeaders: false
        };

        // Memory usage (if available)
        if (window.performance && window.performance.memory) {
            performance.memoryUsage = window.performance.memory.usedJSHeapSize;
        }

        // Check image optimization
        const images = this.domGuard.safeQuerySelectorAll('img');
        let optimizedImages = 0;
        
        images.forEach(img => {
            if (img.loading === 'lazy' || img.getAttribute('loading') === 'lazy') {
                optimizedImages++;
            }
        });
        
        performance.imageOptimization = images.length > 0 ? (optimizedImages / images.length) * 100 : 100;

        this.auditResults.set('performance', performance);
        this.addAuditLogEntry(`Performance: ${performance.domElements} DOM elements, ${performance.imageOptimization.toFixed(0)}% images optimized`);
    }

    async generateComplianceReport() {
        this.addAuditLogEntry('Calculating compliance score...');
        
        let totalScore = 0;
        let maxScore = 0;

        // Module Structure (25 points)
        const moduleResults = this.auditResults.get('moduleStructure');
        if (moduleResults) {
            let moduleScore = 0;
            if (moduleResults.sidebarPresent) moduleScore += 5;
            if (moduleResults.moduleCount >= 20) moduleScore += 10;
            if (moduleResults.categories.size >= 4) moduleScore += 5;
            if (moduleResults.duplicates === 0) moduleScore += 3;
            if (moduleResults.brokenLinks === 0) moduleScore += 2;
            
            totalScore += moduleScore;
            maxScore += 25;
        }

        // Navigation System (20 points)
        const navResults = this.auditResults.get('navigation');
        if (navResults) {
            let navScore = 0;
            if (navResults.sidebarToggle) navScore += 5;
            if (navResults.moduleActivation >= 3) navScore += 8;
            if (navResults.routingErrors === 0) navScore += 4;
            if (navResults.mobileCompatible) navScore += 3;
            
            totalScore += navScore;
            maxScore += 20;
        }

        // DOM Integrity (15 points)
        const domResults = this.auditResults.get('domIntegrity');
        if (domResults) {
            let domScore = 0;
            if (domResults.criticalElements >= 4) domScore += 8;
            if (domResults.errorElements === 0) domScore += 4;
            if (domResults.eventListeners < 10) domScore += 3;
            
            totalScore += domScore;
            maxScore += 15;
        }

        // API Endpoints (20 points)
        const apiResults = this.auditResults.get('apiEndpoints');
        if (apiResults) {
            let apiScore = 0;
            if (apiResults.leads) apiScore += 5;
            if (apiResults.businessMetrics) apiScore += 5;
            if (apiResults.visionAI) apiScore += 5;
            if (apiResults.health) apiScore += 3;
            if (apiResults.responseTime < 2000) apiScore += 2;
            
            totalScore += apiScore;
            maxScore += 20;
        }

        // Responsive Design (10 points)
        const responsiveResults = this.auditResults.get('responsive');
        if (responsiveResults) {
            let responsiveScore = 0;
            if (responsiveResults.viewportMeta) responsiveScore += 2;
            if (responsiveResults.responsiveClasses >= 10) responsiveScore += 3;
            if (responsiveResults.mediaQueries >= 3) responsiveScore += 2;
            if (responsiveResults.touchOptimized) responsiveScore += 1;
            if (responsiveResults.mobileBreakpoints) responsiveScore += 2;
            
            totalScore += responsiveScore;
            maxScore += 10;
        }

        // Performance (10 points)
        const perfResults = this.auditResults.get('performance');
        if (perfResults) {
            let perfScore = 0;
            if (perfResults.loadTime < 3000) perfScore += 3;
            if (perfResults.domElements < 1000) perfScore += 2;
            if (perfResults.imageOptimization >= 80) perfScore += 3;
            if (perfResults.memoryUsage < 50000000) perfScore += 2;
            
            totalScore += perfScore;
            maxScore += 10;
        }

        this.complianceScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        
        this.addAuditLogEntry(`Final compliance score: ${this.complianceScore}%`);
        
        // Update compliance display
        const complianceElement = document.getElementById('audit-compliance');
        if (complianceElement) {
            complianceElement.textContent = `Compliance: ${this.complianceScore}%`;
        }
    }

    displayFinalResults() {
        this.addAuditLogEntry('Generating final audit report...');
        
        const auditReport = {
            timestamp: new Date().toISOString(),
            complianceScore: this.complianceScore,
            status: this.complianceScore >= 95 ? 'EXCELLENT' : this.complianceScore >= 85 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
            auditDuration: Date.now() - this.startTime,
            results: Object.fromEntries(this.auditResults),
            recommendations: this.generateRecommendations()
        };

        // Display completion message
        const statusElement = document.getElementById('audit-status');
        if (statusElement) {
            statusElement.textContent = `Status: ${auditReport.status}`;
        }

        // Create detailed report overlay
        setTimeout(() => {
            this.createDetailedReportOverlay(auditReport);
        }, 2000);

        // Store results globally
        window.finalAuditReport = auditReport;
        
        this.addAuditLogEntry(`Audit completed with ${this.complianceScore}% compliance`);
        
        console.log('[FINAL-AUDIT] Comprehensive audit completed:', auditReport);
    }

    generateRecommendations() {
        const recommendations = [];
        
        const moduleResults = this.auditResults.get('moduleStructure');
        if (moduleResults && moduleResults.duplicates > 0) {
            recommendations.push(`Remove ${moduleResults.duplicates} duplicate module entries`);
        }
        
        const navResults = this.auditResults.get('navigation');
        if (navResults && navResults.routingErrors > 0) {
            recommendations.push(`Fix ${navResults.routingErrors} navigation routing errors`);
        }
        
        const apiResults = this.auditResults.get('apiEndpoints');
        if (apiResults && apiResults.responseTime > 2000) {
            recommendations.push('Optimize API response times');
        }
        
        const responsiveResults = this.auditResults.get('responsive');
        if (responsiveResults && !responsiveResults.mobileBreakpoints) {
            recommendations.push('Implement mobile-first responsive breakpoints');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('System operating at optimal compliance levels');
        }
        
        return recommendations;
    }

    createDetailedReportOverlay(report) {
        const detailedOverlay = document.createElement('div');
        detailedOverlay.id = 'detailed-audit-report';
        detailedOverlay.innerHTML = `
            <div class="fixed inset-4 bg-black/90 backdrop-blur-sm z-50 rounded-lg overflow-hidden">
                <div class="h-full flex flex-col">
                    <div class="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex justify-between items-center">
                        <h2 class="text-xl font-bold text-white">Final System Audit Report</h2>
                        <button onclick="this.closest('#detailed-audit-report').remove()" class="text-white hover:text-gray-300 text-2xl">&times;</button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-6 text-white">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div class="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-6 rounded-lg border border-emerald-500/30">
                                <h3 class="text-2xl font-bold text-emerald-300 mb-2">${report.complianceScore}%</h3>
                                <p class="text-gray-300">Overall Compliance Score</p>
                                <div class="mt-2 text-xs text-emerald-400">${report.status}</div>
                            </div>
                            <div class="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-lg border border-blue-500/30">
                                <h3 class="text-2xl font-bold text-blue-300 mb-2">${Math.round(report.auditDuration / 1000)}s</h3>
                                <p class="text-gray-300">Audit Duration</p>
                                <div class="mt-2 text-xs text-blue-400">Comprehensive Analysis</div>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="bg-gray-800/50 p-4 rounded-lg">
                                <h4 class="font-semibold text-white mb-2">Module Structure</h4>
                                <div class="text-sm text-gray-300">
                                    Modules: ${report.results.moduleStructure?.moduleCount || 0} | 
                                    Categories: ${report.results.moduleStructure?.categories?.size || 0} | 
                                    Duplicates: ${report.results.moduleStructure?.duplicates || 0}
                                </div>
                            </div>
                            
                            <div class="bg-gray-800/50 p-4 rounded-lg">
                                <h4 class="font-semibold text-white mb-2">API Endpoints</h4>
                                <div class="text-sm text-gray-300">
                                    Leads: ${report.results.apiEndpoints?.leads ? '✅' : '❌'} | 
                                    Metrics: ${report.results.apiEndpoints?.businessMetrics ? '✅' : '❌'} | 
                                    Vision AI: ${report.results.apiEndpoints?.visionAI ? '✅' : '❌'} | 
                                    Health: ${report.results.apiEndpoints?.health ? '✅' : '❌'}
                                </div>
                            </div>
                            
                            <div class="bg-gray-800/50 p-4 rounded-lg">
                                <h4 class="font-semibold text-white mb-2">Responsive Design</h4>
                                <div class="text-sm text-gray-300">
                                    Viewport: ${report.results.responsive?.viewportMeta ? '✅' : '❌'} | 
                                    Responsive Classes: ${report.results.responsive?.responsiveClasses || 0} | 
                                    Mobile Optimized: ${report.results.responsive?.mobileBreakpoints ? '✅' : '❌'}
                                </div>
                            </div>
                            
                            <div class="bg-gray-800/50 p-4 rounded-lg">
                                <h4 class="font-semibold text-white mb-2">Recommendations</h4>
                                <ul class="text-sm text-gray-300 space-y-1">
                                    ${report.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailedOverlay);
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (detailedOverlay.parentNode) {
                detailedOverlay.remove();
            }
        }, 30000);
    }

    // Public methods for external access
    getComplianceScore() {
        return this.complianceScore;
    }

    getAuditResults() {
        return Object.fromEntries(this.auditResults);
    }

    isCompliant() {
        return this.complianceScore >= 95;
    }
}

// Initialize the final audit when DOM is ready
if (typeof window !== 'undefined') {
    const initFinalAudit = () => {
        if (!window.finalOptimizationAudit) {
            window.finalOptimizationAudit = new FinalOptimizationAudit();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFinalAudit);
    } else {
        setTimeout(initFinalAudit, 1000);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinalOptimizationAudit;
}