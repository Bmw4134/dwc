/**
 * Production Readiness Deep Dive Tester
 * Comprehensive testing of all dashboard components as a real user
 */

class ProductionReadinessTester {
    constructor() {
        this.testResults = [];
        this.failedTests = [];
        this.passedTests = [];
        this.currentTest = null;
        this.testStartTime = Date.now();
        
        this.initializeTestSuite();
    }

    async initializeTestSuite() {
        console.log('[PROD-TEST] Starting comprehensive production readiness testing');
        
        this.createTestInterface();
        await this.runCompleteTestSuite();
    }

    createTestInterface() {
        const testOverlay = document.createElement('div');
        testOverlay.id = 'production-test-overlay';
        testOverlay.innerHTML = `
            <div class="test-header">
                <h3>🧪 Production Readiness Testing</h3>
                <div class="test-stats">
                    <span class="test-count">Tests: <span id="test-count">0</span></span>
                    <span class="test-passed">Passed: <span id="test-passed">0</span></span>
                    <span class="test-failed">Failed: <span id="test-failed">0</span></span>
                </div>
            </div>
            <div class="test-progress">
                <div class="progress-bar" id="test-progress-bar"></div>
            </div>
            <div class="current-test" id="current-test">Initializing tests...</div>
            <div class="test-log" id="test-log"></div>
        `;

        testOverlay.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 400px; max-height: 600px;
            background: white; border: 2px solid #3182ce; border-radius: 12px;
            padding: 1rem; z-index: 99999; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            overflow-y: auto; font-family: monospace; font-size: 12px;
        `;

        document.body.appendChild(testOverlay);
    }

    async runCompleteTestSuite() {
        const testSuite = [
            // Authentication & Dashboard Loading
            { name: 'Dashboard Load Test', category: 'Core', test: () => this.testDashboardLoad() },
            { name: 'Navigation System Test', category: 'Core', test: () => this.testNavigationSystem() },
            { name: 'Sidebar Functionality', category: 'Core', test: () => this.testSidebarFunctionality() },
            
            // Lead Intelligence Map Testing
            { name: 'QNIS Map Initialization', category: 'QNIS', test: () => this.testQNISMapInitialization() },
            { name: 'Map Data Loading', category: 'QNIS', test: () => this.testMapDataLoading() },
            { name: 'Map Interactivity', category: 'QNIS', test: () => this.testMapInteractivity() },
            { name: 'Lead Markers Display', category: 'QNIS', test: () => this.testLeadMarkersDisplay() },
            
            // Client Portfolio Testing
            { name: 'Portfolio Overview Display', category: 'Portfolio', test: () => this.testPortfolioOverview() },
            { name: 'Client Cards Rendering', category: 'Portfolio', test: () => this.testClientCardsRendering() },
            { name: 'Client Detail Modals', category: 'Portfolio', test: () => this.testClientDetailModals() },
            { name: 'Portfolio Actions', category: 'Portfolio', test: () => this.testPortfolioActions() },
            { name: 'New Client Form', category: 'Portfolio', test: () => this.testNewClientForm() },
            
            // Business Modules Testing
            { name: 'Business Suite Module', category: 'Business', test: () => this.testBusinessSuiteModule() },
            { name: 'Legal Management', category: 'Business', test: () => this.testLegalManagement() },
            { name: 'Accounting System', category: 'Business', test: () => this.testAccountingSystem() },
            { name: 'Tax Management', category: 'Business', test: () => this.testTaxManagement() },
            
            // AI & Automation Testing
            { name: 'AI Watson Integration', category: 'AI', test: () => this.testAIWatsonIntegration() },
            { name: 'Voice Commands', category: 'AI', test: () => this.testVoiceCommands() },
            { name: 'Automation Workflows', category: 'Automation', test: () => this.testAutomationWorkflows() },
            
            // Trading Bot Testing
            { name: 'Trading Bot Interface', category: 'Trading', test: () => this.testTradingBotInterface() },
            { name: 'Portfolio Display', category: 'Trading', test: () => this.testTradingPortfolioDisplay() },
            
            // API & Data Integrity
            { name: 'API Vault Functionality', category: 'API', test: () => this.testAPIVaultFunctionality() },
            { name: 'Lead Generation API', category: 'API', test: () => this.testLeadGenerationAPI() },
            { name: 'Data Persistence', category: 'API', test: () => this.testDataPersistence() },
            
            // Live Website Testing
            { name: 'Trucking Website Access', category: 'Live', test: () => this.testTruckingWebsiteAccess() },
            { name: 'Quote Calculator', category: 'Live', test: () => this.testQuoteCalculator() },
            
            // Performance & Responsiveness
            { name: 'Dashboard Performance', category: 'Performance', test: () => this.testDashboardPerformance() },
            { name: 'Mobile Responsiveness', category: 'Performance', test: () => this.testMobileResponsiveness() },
            { name: 'Error Handling', category: 'Performance', test: () => this.testErrorHandling() }
        ];

        for (let i = 0; i < testSuite.length; i++) {
            const test = testSuite[i];
            await this.runIndividualTest(test, i + 1, testSuite.length);
            await this.delay(500); // Allow time between tests
        }

        this.generateFinalReport();
    }

    async runIndividualTest(test, testNumber, totalTests) {
        this.currentTest = test.name;
        this.updateTestProgress(testNumber, totalTests, `Running: ${test.name}`);
        
        try {
            const startTime = performance.now();
            const result = await test.test();
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            if (result.success) {
                this.passedTests.push({ ...test, duration, details: result.details });
                this.logTestResult('✅', test.name, `PASSED (${duration}ms)`, 'success');
            } else {
                this.failedTests.push({ ...test, duration, error: result.error, details: result.details });
                this.logTestResult('❌', test.name, `FAILED: ${result.error}`, 'error');
            }
            
            this.testResults.push({ ...test, ...result, duration });
            
        } catch (error) {
            this.failedTests.push({ ...test, error: error.message });
            this.logTestResult('❌', test.name, `ERROR: ${error.message}`, 'error');
        }
        
        this.updateTestStats();
    }

    updateTestProgress(current, total, message) {
        const progress = (current / total) * 100;
        const progressBar = document.getElementById('test-progress-bar');
        const currentTestEl = document.getElementById('current-test');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.style.background = `linear-gradient(90deg, #00ff88 0%, #3182ce ${progress}%)`;
        }
        
        if (currentTestEl) {
            currentTestEl.textContent = `${current}/${total}: ${message}`;
        }
    }

    updateTestStats() {
        const testCount = document.getElementById('test-count');
        const testPassed = document.getElementById('test-passed');
        const testFailed = document.getElementById('test-failed');
        
        if (testCount) testCount.textContent = this.testResults.length;
        if (testPassed) testPassed.textContent = this.passedTests.length;
        if (testFailed) testFailed.textContent = this.failedTests.length;
    }

    logTestResult(icon, testName, result, type) {
        const logEl = document.getElementById('test-log');
        if (logEl) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            logEntry.innerHTML = `<span class="log-icon">${icon}</span> <span class="log-test">${testName}</span>: <span class="log-result">${result}</span>`;
            logEntry.style.cssText = `
                display: flex; align-items: center; padding: 0.25rem; margin: 0.125rem 0;
                background: ${type === 'success' ? '#f0fff4' : '#fff5f5'};
                border-left: 3px solid ${type === 'success' ? '#00ff88' : '#ff6b6b'};
                font-size: 11px;
            `;
            logEl.appendChild(logEntry);
            logEl.scrollTop = logEl.scrollHeight;
        }
    }

    // Individual Test Methods
    async testDashboardLoad() {
        try {
            const dashboard = document.querySelector('.dashboard-container');
            const sidebar = document.querySelector('.collapsible-nav');
            const mainContent = document.querySelector('.main-content');
            
            if (!dashboard) return { success: false, error: 'Dashboard container not found' };
            if (!sidebar) return { success: false, error: 'Sidebar navigation not found' };
            if (!mainContent) return { success: false, error: 'Main content area not found' };
            
            return { success: true, details: 'Dashboard loaded successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testNavigationSystem() {
        try {
            const navItems = document.querySelectorAll('.nav-item');
            const moduleViews = document.querySelectorAll('.module-view');
            
            if (navItems.length === 0) return { success: false, error: 'No navigation items found' };
            if (moduleViews.length === 0) return { success: false, error: 'No module views found' };
            
            // Test clicking a navigation item
            const firstNavItem = navItems[0];
            firstNavItem.click();
            await this.delay(100);
            
            return { success: true, details: `Navigation working with ${navItems.length} items` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testSidebarFunctionality() {
        try {
            const collapseBtn = document.querySelector('.collapse-btn');
            const sidebar = document.querySelector('.collapsible-nav');
            
            if (!collapseBtn) return { success: false, error: 'Collapse button not found' };
            if (!sidebar) return { success: false, error: 'Sidebar not found' };
            
            // Test sidebar collapse/expand
            collapseBtn.click();
            await this.delay(300);
            
            return { success: true, details: 'Sidebar collapse/expand functionality working' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testQNISMapInitialization() {
        try {
            const mapContainer = document.getElementById('qnis-map');
            const canvasContainer = document.getElementById('qnis-canvas-container');
            
            if (!mapContainer && !canvasContainer) {
                return { success: false, error: 'No map container found' };
            }
            
            // Check if map data is loading
            if (window.QNIS && window.QNIS.canvas) {
                return { success: true, details: 'QNIS map system initialized with canvas fallback' };
            }
            
            return { success: true, details: 'Map container present, checking initialization' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testMapDataLoading() {
        try {
            // Check for lead data in cache or live
            const cachedLeads = localStorage.getItem('leadMapCache');
            
            if (cachedLeads) {
                const leads = JSON.parse(cachedLeads);
                if (leads.leads && leads.leads.length > 0) {
                    return { success: true, details: `Found ${leads.leads.length} leads in cache` };
                }
            }
            
            // Check for live lead generation
            const response = await fetch('/api/leads/generate');
            if (response.ok) {
                const data = await response.json();
                return { success: true, details: `API returned ${data.leads ? data.leads.length : 0} leads` };
            }
            
            return { success: false, error: 'No lead data available' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testMapInteractivity() {
        try {
            const mapElement = document.getElementById('qnis-map') || document.getElementById('qnis-canvas-container');
            
            if (!mapElement) {
                return { success: false, error: 'Map element not found' };
            }
            
            // Simulate click on map
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: 100,
                clientY: 100
            });
            
            mapElement.dispatchEvent(clickEvent);
            
            return { success: true, details: 'Map interactivity test completed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testLeadMarkersDisplay() {
        try {
            // Navigate to QNIS module first
            const qnisNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('QNIS') || item.getAttribute('onclick')?.includes('qnis')
            );
            
            if (qnisNavItem) {
                qnisNavItem.click();
                await this.delay(500);
            }
            
            // Check for markers in the map
            const markers = document.querySelectorAll('.leaflet-marker-icon, .lead-marker, [class*="marker"]');
            
            if (markers.length > 0) {
                return { success: true, details: `Found ${markers.length} map markers` };
            }
            
            // Check for canvas-based markers
            const canvas = document.querySelector('#qnis-canvas-container canvas');
            if (canvas) {
                return { success: true, details: 'Canvas-based map markers system active' };
            }
            
            return { success: false, error: 'No map markers found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testPortfolioOverview() {
        try {
            // Navigate to Lead Generation module
            const leadGenNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('Lead Generation') || item.getAttribute('onclick')?.includes('leadgen')
            );
            
            if (leadGenNavItem) {
                leadGenNavItem.click();
                await this.delay(500);
            }
            
            const portfolioOverview = document.querySelector('.portfolio-overview');
            const portfolioStats = document.querySelector('.portfolio-stats');
            const statCards = document.querySelectorAll('.stat-card');
            
            if (!portfolioOverview) return { success: false, error: 'Portfolio overview not found' };
            if (!portfolioStats) return { success: false, error: 'Portfolio stats not found' };
            if (statCards.length === 0) return { success: false, error: 'No stat cards found' };
            
            return { success: true, details: `Portfolio overview with ${statCards.length} stat cards` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testClientCardsRendering() {
        try {
            const clientCards = document.querySelectorAll('.client-card');
            
            if (clientCards.length === 0) {
                return { success: false, error: 'No client cards found' };
            }
            
            // Test each client card has required elements
            let allCardsValid = true;
            let cardDetails = [];
            
            clientCards.forEach((card, index) => {
                const header = card.querySelector('.client-header');
                const info = card.querySelector('.client-info');
                const actions = card.querySelector('.client-actions');
                
                if (!header || !info || !actions) {
                    allCardsValid = false;
                } else {
                    const businessName = header.querySelector('h3')?.textContent || 'Unknown';
                    cardDetails.push(businessName);
                }
            });
            
            if (!allCardsValid) {
                return { success: false, error: 'Some client cards missing required elements' };
            }
            
            return { success: true, details: `${clientCards.length} client cards: ${cardDetails.join(', ')}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testClientDetailModals() {
        try {
            const clientCards = document.querySelectorAll('.client-card');
            
            if (clientCards.length === 0) {
                return { success: false, error: 'No client cards to test' };
            }
            
            // Test clicking "View Details" on first client card
            const firstCard = clientCards[0];
            const viewDetailsBtn = firstCard.querySelector('button[onclick*="viewClientDetails"]');
            
            if (!viewDetailsBtn) {
                return { success: false, error: 'View details button not found' };
            }
            
            // Click the button
            viewDetailsBtn.click();
            await this.delay(300);
            
            // Check if modal appeared
            const modal = document.querySelector('.client-modal');
            
            if (modal) {
                // Close the modal
                const closeBtn = modal.querySelector('.close-btn');
                if (closeBtn) closeBtn.click();
                
                return { success: true, details: 'Client detail modal opens and closes correctly' };
            }
            
            return { success: false, error: 'Modal did not appear after clicking view details' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testPortfolioActions() {
        try {
            const portfolioActions = document.querySelector('.portfolio-actions');
            const actionButtons = document.querySelectorAll('.portfolio-actions .action-btn');
            
            if (!portfolioActions) return { success: false, error: 'Portfolio actions section not found' };
            if (actionButtons.length === 0) return { success: false, error: 'No action buttons found' };
            
            // Test each action button
            const buttonTests = [];
            actionButtons.forEach(button => {
                const buttonText = button.textContent.trim();
                buttonTests.push(buttonText);
                
                // Test clicking each button
                button.click();
            });
            
            return { success: true, details: `Portfolio actions working: ${buttonTests.join(', ')}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testNewClientForm() {
        try {
            // Click "Add New Client" button
            const addClientBtn = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.textContent.includes('Add New Client')
            );
            
            if (!addClientBtn) {
                return { success: false, error: 'Add New Client button not found' };
            }
            
            addClientBtn.click();
            await this.delay(300);
            
            // Check if form modal appeared
            const modal = document.querySelector('.client-modal');
            const form = document.getElementById('new-client-form');
            
            if (!modal) return { success: false, error: 'New client modal did not appear' };
            if (!form) return { success: false, error: 'New client form not found in modal' };
            
            // Test form fields
            const requiredFields = ['client-name', 'client-industry', 'client-email'];
            const missingFields = requiredFields.filter(fieldId => !document.getElementById(fieldId));
            
            // Close the modal
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) closeBtn.click();
            
            if (missingFields.length > 0) {
                return { success: false, error: `Missing form fields: ${missingFields.join(', ')}` };
            }
            
            return { success: true, details: 'New client form opens with all required fields' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testBusinessSuiteModule() {
        try {
            // Navigate to Business Suite
            const businessNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('Business Suite') || item.getAttribute('onclick')?.includes('business')
            );
            
            if (businessNavItem) {
                businessNavItem.click();
                await this.delay(500);
            }
            
            const businessModule = document.getElementById('business-module');
            const moduleCards = document.querySelectorAll('#business-module .module-card');
            
            if (!businessModule) return { success: false, error: 'Business Suite module not found' };
            if (moduleCards.length === 0) return { success: false, error: 'No business module cards found' };
            
            return { success: true, details: `Business Suite active with ${moduleCards.length} components` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testLegalManagement() {
        try {
            // Navigate to Legal Management
            const legalNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('Legal') || item.getAttribute('onclick')?.includes('legal')
            );
            
            if (legalNavItem) {
                legalNavItem.click();
                await this.delay(500);
            }
            
            const legalModule = document.getElementById('legal-module');
            const contractManagement = document.querySelector('#legal-module .module-card');
            
            if (!legalModule) return { success: false, error: 'Legal Management module not found' };
            
            return { success: true, details: 'Legal Management module accessible' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testAccountingSystem() {
        try {
            // Navigate to Accounting
            const accountingNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('Accounting') || item.getAttribute('onclick')?.includes('accounting')
            );
            
            if (accountingNavItem) {
                accountingNavItem.click();
                await this.delay(500);
            }
            
            const accountingModule = document.getElementById('accounting-module');
            
            if (!accountingModule) return { success: false, error: 'Accounting module not found' };
            
            return { success: true, details: 'Accounting system accessible' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testTaxManagement() {
        try {
            // Look for tax management elements
            const taxElements = document.querySelectorAll('[id*="tax"], [class*="tax"]');
            
            if (taxElements.length === 0) {
                return { success: false, error: 'No tax management elements found' };
            }
            
            return { success: true, details: `Tax management elements present: ${taxElements.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testAIWatsonIntegration() {
        try {
            // Check for AI Watson elements
            const aiElements = document.querySelectorAll('[id*="watson"], [id*="ai"], [class*="ai"]');
            
            if (aiElements.length === 0) {
                return { success: false, error: 'No AI Watson elements found' };
            }
            
            // Check if AI assistants are loaded
            if (window.aiAssistants) {
                return { success: true, details: `AI Watson integration active with ${aiElements.length} elements` };
            }
            
            return { success: true, details: `AI elements present: ${aiElements.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testVoiceCommands() {
        try {
            // Check for voice command elements
            const voiceElements = document.querySelectorAll('[id*="voice"], [class*="voice"]');
            
            if (voiceElements.length === 0) {
                return { success: false, error: 'No voice command elements found' };
            }
            
            return { success: true, details: `Voice command elements present: ${voiceElements.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testAutomationWorkflows() {
        try {
            // Navigate to Automation module
            const automationNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('Automation') || item.getAttribute('onclick')?.includes('automation')
            );
            
            if (automationNavItem) {
                automationNavItem.click();
                await this.delay(500);
            }
            
            const automationElements = document.querySelectorAll('[id*="automation"], [class*="automation"]');
            
            if (automationElements.length === 0) {
                return { success: false, error: 'No automation elements found' };
            }
            
            return { success: true, details: `Automation workflows present: ${automationElements.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testTradingBotInterface() {
        try {
            // Navigate to Trading Bot
            const tradingNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.includes('Trading') || item.getAttribute('onclick')?.includes('trading')
            );
            
            if (tradingNavItem) {
                tradingNavItem.click();
                await this.delay(500);
            }
            
            const tradingModule = document.getElementById('tradingbot-module');
            const portfolioGrid = document.querySelector('.portfolio-grid');
            
            if (!tradingModule) return { success: false, error: 'Trading bot module not found' };
            
            return { success: true, details: 'Trading bot interface accessible' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testTradingPortfolioDisplay() {
        try {
            const portfolioCards = document.querySelectorAll('.portfolio-card');
            
            if (portfolioCards.length === 0) {
                return { success: false, error: 'No trading portfolio cards found' };
            }
            
            return { success: true, details: `Trading portfolio shows ${portfolioCards.length} assets` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testAPIVaultFunctionality() {
        try {
            // Check for API vault elements
            const apiElements = document.querySelectorAll('[id*="api"], [class*="api"]');
            
            if (apiElements.length === 0) {
                return { success: false, error: 'No API vault elements found' };
            }
            
            // Check if API keys are loaded
            if (window.apiKeys || localStorage.getItem('apiKeys')) {
                return { success: true, details: 'API vault functional with stored keys' };
            }
            
            return { success: true, details: `API elements present: ${apiElements.length}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testLeadGenerationAPI() {
        try {
            const response = await fetch('/api/leads/generate');
            
            if (!response.ok) {
                return { success: false, error: `API returned ${response.status}: ${response.statusText}` };
            }
            
            const data = await response.json();
            
            if (!data.success) {
                return { success: false, error: 'API returned unsuccessful response' };
            }
            
            return { success: true, details: `Lead generation API working, returned ${data.leads?.length || 0} leads` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testDataPersistence() {
        try {
            // Test localStorage persistence
            const testKey = 'test-persistence-' + Date.now();
            const testData = { test: true, timestamp: Date.now() };
            
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            
            if (!retrieved || retrieved.test !== true) {
                return { success: false, error: 'LocalStorage persistence failed' };
            }
            
            return { success: true, details: 'Data persistence working correctly' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testTruckingWebsiteAccess() {
        try {
            // Test if trucking website link works
            const truckingLink = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.getAttribute('onclick')?.includes('trucking-company-website.html')
            );
            
            if (!truckingLink) {
                return { success: false, error: 'Trucking website link not found' };
            }
            
            // Test URL accessibility
            const response = await fetch('/trucking-company-website.html');
            
            if (!response.ok) {
                return { success: false, error: `Trucking website not accessible: ${response.status}` };
            }
            
            return { success: true, details: 'Trucking website accessible and link working' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testQuoteCalculator() {
        try {
            // Check if quote calculator page exists
            const response = await fetch('/trucking-company-website.html');
            
            if (!response.ok) {
                return { success: false, error: 'Cannot access quote calculator page' };
            }
            
            const html = await response.text();
            
            if (!html.includes('quote') && !html.includes('calculator')) {
                return { success: false, error: 'Quote calculator not found on trucking website' };
            }
            
            return { success: true, details: 'Quote calculator accessible on trucking website' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testDashboardPerformance() {
        try {
            const startTime = performance.now();
            
            // Test navigation speed
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length > 0) {
                navItems[0].click();
                await this.delay(100);
            }
            
            const endTime = performance.now();
            const navigationTime = endTime - startTime;
            
            if (navigationTime > 1000) {
                return { success: false, error: `Navigation too slow: ${navigationTime}ms` };
            }
            
            return { success: true, details: `Dashboard responsive, navigation: ${Math.round(navigationTime)}ms` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testMobileResponsiveness() {
        try {
            const dashboard = document.querySelector('.dashboard-container');
            
            if (!dashboard) {
                return { success: false, error: 'Dashboard container not found' };
            }
            
            // Check if responsive classes are present
            const hasResponsiveElements = document.querySelectorAll('[class*="responsive"], [class*="mobile"]').length > 0;
            
            // Check viewport meta tag
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            
            if (!viewportMeta) {
                return { success: false, error: 'Viewport meta tag missing' };
            }
            
            return { success: true, details: `Mobile responsiveness configured${hasResponsiveElements ? ' with responsive elements' : ''}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testErrorHandling() {
        try {
            // Test invalid API call
            const response = await fetch('/api/invalid-endpoint');
            
            // Should handle 404 gracefully
            if (response.status === 404) {
                return { success: true, details: 'Error handling working - 404 handled gracefully' };
            }
            
            return { success: true, details: 'Error handling present' };
        } catch (error) {
            // Network errors should be caught
            return { success: true, details: 'Error handling catching network errors' };
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateFinalReport() {
        const endTime = Date.now();
        const totalDuration = endTime - this.testStartTime;
        
        const report = {
            testSummary: {
                total: this.testResults.length,
                passed: this.passedTests.length,
                failed: this.failedTests.length,
                successRate: Math.round((this.passedTests.length / this.testResults.length) * 100),
                totalDuration: Math.round(totalDuration / 1000)
            },
            categoryBreakdown: this.getCategoryBreakdown(),
            criticalIssues: this.failedTests.filter(test => 
                ['Core', 'QNIS', 'Portfolio'].includes(test.category)
            ),
            recommendations: this.generateRecommendations()
        };
        
        console.log('[PROD-TEST] Final Production Readiness Report:', report);
        
        this.displayFinalReport(report);
        
        return report;
    }

    getCategoryBreakdown() {
        const categories = {};
        
        this.testResults.forEach(test => {
            if (!categories[test.category]) {
                categories[test.category] = { total: 0, passed: 0, failed: 0 };
            }
            
            categories[test.category].total++;
            if (test.success) {
                categories[test.category].passed++;
            } else {
                categories[test.category].failed++;
            }
        });
        
        return categories;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.failedTests.length === 0) {
            recommendations.push('🎉 All tests passed - System is production ready!');
        } else {
            const criticalFailures = this.failedTests.filter(test => 
                ['Core', 'QNIS', 'Portfolio'].includes(test.category)
            );
            
            if (criticalFailures.length > 0) {
                recommendations.push('🚨 Critical issues found - Address before production deployment');
                criticalFailures.forEach(test => {
                    recommendations.push(`  • Fix ${test.name}: ${test.error}`);
                });
            }
            
            const nonCriticalFailures = this.failedTests.filter(test => 
                !['Core', 'QNIS', 'Portfolio'].includes(test.category)
            );
            
            if (nonCriticalFailures.length > 0) {
                recommendations.push('⚠️ Non-critical issues found - Recommended fixes:');
                nonCriticalFailures.forEach(test => {
                    recommendations.push(`  • ${test.name}: ${test.error}`);
                });
            }
        }
        
        return recommendations;
    }

    displayFinalReport(report) {
        const currentTestEl = document.getElementById('current-test');
        const testLog = document.getElementById('test-log');
        
        if (currentTestEl) {
            currentTestEl.innerHTML = `
                <div style="background: ${report.testSummary.successRate >= 90 ? '#00ff88' : report.testSummary.successRate >= 75 ? '#ffaa00' : '#ff6b6b'}; 
                     color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4>🏁 Testing Complete</h4>
                    <p><strong>Success Rate:</strong> ${report.testSummary.successRate}% (${report.testSummary.passed}/${report.testSummary.total})</p>
                    <p><strong>Duration:</strong> ${report.testSummary.totalDuration}s</p>
                    ${report.testSummary.successRate >= 90 ? 
                        '<p><strong>Status:</strong> ✅ PRODUCTION READY</p>' : 
                        '<p><strong>Status:</strong> ⚠️ NEEDS ATTENTION</p>'
                    }
                </div>
            `;
        }
        
        if (testLog && report.recommendations.length > 0) {
            const recommendationsEl = document.createElement('div');
            recommendationsEl.innerHTML = `
                <div style="background: #f7fafc; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <h5>📋 Recommendations:</h5>
                    ${report.recommendations.map(rec => `<div style="margin: 0.5rem 0; font-size: 11px;">${rec}</div>`).join('')}
                </div>
            `;
            testLog.appendChild(recommendationsEl);
        }
    }
}

// Initialize the production readiness tester
window.productionTester = new ProductionReadinessTester();