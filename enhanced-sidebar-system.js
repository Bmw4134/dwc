/**
 * Enhanced Collapsible Sidebar with AI-Powered Search
 * Integrates with existing Perplexity and OpenAI APIs for intelligent module discovery
 */
class EnhancedSidebarSystem {
    constructor() {
        this.isCollapsed = false;
        this.searchResults = [];
        this.moduleRegistry = new Map();
        this.searchHistory = [];
        this.aiInsights = new Map();
        this.nexusIntelligence = null;
        this.initializeSidebar();
    }

    async initializeSidebar() {
        console.log('[SIDEBAR] Initializing enhanced collapsible sidebar with AI search...');
        
        // Wait for existing systems to load
        await this.waitForSystems();
        
        // Create enhanced sidebar structure
        this.createSidebarStructure();
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Register existing modules
        this.registerExistingModules();
        
        // Setup AI-powered enhancements
        this.setupAIEnhancements();
        
        console.log('[SIDEBAR] Enhanced sidebar system ready');
    }

    async waitForSystems() {
        // Wait for NEXUS intelligence to be available
        let attempts = 0;
        while (attempts < 30 && (!window.NEXUS || !window.QNIS)) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.NEXUS) {
            this.nexusIntelligence = window.NEXUS;
            console.log('[SIDEBAR] NEXUS intelligence connected');
        }
    }

    createSidebarStructure() {
        const existingSidebar = document.querySelector('.sidebar');
        if (!existingSidebar) return;

        // Create enhanced sidebar wrapper
        const enhancedSidebar = document.createElement('div');
        enhancedSidebar.className = 'enhanced-sidebar';
        enhancedSidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="brand-section">
                    <div class="logo-container">
                        <span class="logo-text">DWC NEXUS</span>
                    </div>
                    <button class="collapse-btn" onclick="sidebarSystem.toggleCollapse()">
                        <span class="collapse-icon">⟨</span>
                    </button>
                </div>
                
                <div class="search-section">
                    <div class="search-container">
                        <input type="text" 
                               class="search-input" 
                               placeholder="Search modules & features..."
                               onkeyup="sidebarSystem.handleSearch(event)"
                               onfocus="sidebarSystem.showSearchResults()">
                        <button class="search-btn" onclick="sidebarSystem.performAISearch()">
                            <span class="search-icon">🔍</span>
                        </button>
                    </div>
                    <div class="search-results" style="display: none;"></div>
                </div>
            </div>

            <div class="sidebar-content">
                <div class="module-categories">
                    <div class="category-section" data-category="business">
                        <div class="category-header" onclick="sidebarSystem.toggleCategory('business')">
                            <span class="category-icon">📊</span>
                            <span class="category-title">Business Operations</span>
                            <span class="collapse-indicator">▼</span>
                        </div>
                        <div class="category-modules" id="business-modules">
                            <!-- Business modules will be populated here -->
                        </div>
                    </div>

                    <div class="category-section" data-category="ai">
                        <div class="category-header" onclick="sidebarSystem.toggleCategory('ai')">
                            <span class="category-icon">🤖</span>
                            <span class="category-title">AI Intelligence</span>
                            <span class="collapse-indicator">▼</span>
                        </div>
                        <div class="category-modules" id="ai-modules">
                            <!-- AI modules will be populated here -->
                        </div>
                    </div>

                    <div class="category-section" data-category="automation">
                        <div class="category-header" onclick="sidebarSystem.toggleCategory('automation')">
                            <span class="category-icon">⚡</span>
                            <span class="category-title">Automation</span>
                            <span class="collapse-indicator">▼</span>
                        </div>
                        <div class="category-modules" id="automation-modules">
                            <!-- Automation modules will be populated here -->
                        </div>
                    </div>

                    <div class="category-section" data-category="system">
                        <div class="category-header" onclick="sidebarSystem.toggleCategory('system')">
                            <span class="category-icon">⚙️</span>
                            <span class="category-title">System Control</span>
                            <span class="collapse-indicator">▼</span>
                        </div>
                        <div class="category-modules" id="system-modules">
                            <!-- System modules will be populated here -->
                        </div>
                    </div>
                </div>

                <div class="sidebar-footer">
                    <div class="ai-insights-panel" style="display: none;">
                        <div class="insights-header">
                            <span class="insights-icon">💡</span>
                            <span class="insights-title">AI Insights</span>
                        </div>
                        <div class="insights-content"></div>
                    </div>
                </div>
            </div>
        `;

        // Replace existing sidebar
        existingSidebar.parentNode.replaceChild(enhancedSidebar, existingSidebar);
        
        // Add enhanced styles
        this.addEnhancedStyles();
    }

    addEnhancedStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .enhanced-sidebar {
                width: 280px;
                height: 100vh;
                background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                border-right: 2px solid rgba(0, 255, 136, 0.3);
                transition: width 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
            }

            .enhanced-sidebar.collapsed {
                width: 60px;
            }

            .enhanced-sidebar.collapsed .category-title,
            .enhanced-sidebar.collapsed .logo-text,
            .enhanced-sidebar.collapsed .search-section {
                opacity: 0;
                pointer-events: none;
            }

            .sidebar-header {
                padding: 15px;
                border-bottom: 1px solid rgba(0, 255, 136, 0.2);
                background: rgba(0, 255, 136, 0.05);
            }

            .brand-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .logo-text {
                color: #00ff88;
                font-weight: 700;
                font-size: 18px;
                letter-spacing: 1px;
            }

            .collapse-btn {
                background: rgba(0, 255, 136, 0.2);
                border: 1px solid #00ff88;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .collapse-btn:hover {
                background: rgba(0, 255, 136, 0.3);
                transform: scale(1.1);
            }

            .collapse-icon {
                color: #00ff88;
                font-weight: bold;
                transition: transform 0.3s ease;
            }

            .enhanced-sidebar.collapsed .collapse-icon {
                transform: rotate(180deg);
            }

            .search-container {
                position: relative;
                display: flex;
                align-items: center;
            }

            .search-input {
                width: 100%;
                padding: 10px 40px 10px 15px;
                border: 1px solid rgba(0, 255, 136, 0.3);
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .search-input:focus {
                outline: none;
                border-color: #00ff88;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
            }

            .search-btn {
                position: absolute;
                right: 5px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.2s ease;
            }

            .search-btn:hover {
                background: rgba(0, 255, 136, 0.2);
            }

            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(22, 33, 62, 0.95);
                border: 1px solid rgba(0, 255, 136, 0.3);
                border-radius: 10px;
                max-height: 300px;
                overflow-y: auto;
                z-index: 1001;
                backdrop-filter: blur(10px);
            }

            .search-result-item {
                padding: 12px 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: background 0.2s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .search-result-item:hover {
                background: rgba(0, 255, 136, 0.1);
            }

            .search-result-item:last-child {
                border-bottom: none;
            }

            .result-icon {
                font-size: 16px;
            }

            .result-text {
                flex: 1;
            }

            .result-title {
                color: white;
                font-weight: 500;
                margin-bottom: 2px;
            }

            .result-description {
                color: #94a3b8;
                font-size: 12px;
            }

            .result-score {
                background: rgba(0, 255, 136, 0.2);
                color: #00ff88;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
            }

            .sidebar-content {
                flex: 1;
                overflow-y: auto;
                padding: 10px 0;
            }

            .category-section {
                margin-bottom: 10px;
            }

            .category-header {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                cursor: pointer;
                transition: background 0.2s ease;
                border-left: 3px solid transparent;
            }

            .category-header:hover {
                background: rgba(0, 255, 136, 0.1);
                border-left-color: #00ff88;
            }

            .category-icon {
                margin-right: 12px;
                font-size: 16px;
            }

            .category-title {
                flex: 1;
                color: white;
                font-weight: 500;
                font-size: 14px;
            }

            .collapse-indicator {
                color: #94a3b8;
                font-size: 12px;
                transition: transform 0.2s ease;
            }

            .category-section.collapsed .collapse-indicator {
                transform: rotate(-90deg);
            }

            .category-modules {
                max-height: 500px;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }

            .category-section.collapsed .category-modules {
                max-height: 0;
            }

            .module-item {
                display: flex;
                align-items: center;
                padding: 10px 25px 10px 50px;
                cursor: pointer;
                transition: all 0.2s ease;
                border-left: 3px solid transparent;
                position: relative;
            }

            .module-item:hover {
                background: rgba(0, 255, 136, 0.1);
                border-left-color: #00ff88;
            }

            .module-item.active {
                background: rgba(0, 255, 136, 0.2);
                border-left-color: #00ff88;
            }

            .module-item.active::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: #00ff88;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            }

            .module-icon {
                margin-right: 10px;
                font-size: 14px;
            }

            .module-name {
                color: #e2e8f0;
                font-size: 13px;
                font-weight: 400;
            }

            .module-status {
                margin-left: auto;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #10b981;
                box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
            }

            .module-status.warning {
                background: #f59e0b;
                box-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
            }

            .module-status.error {
                background: #ef4444;
                box-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
            }

            .ai-insights-panel {
                margin: 15px;
                padding: 15px;
                background: rgba(0, 255, 136, 0.05);
                border: 1px solid rgba(0, 255, 136, 0.2);
                border-radius: 10px;
            }

            .insights-header {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }

            .insights-icon {
                margin-right: 8px;
                font-size: 14px;
            }

            .insights-title {
                color: #00ff88;
                font-weight: 500;
                font-size: 12px;
            }

            .insights-content {
                color: #94a3b8;
                font-size: 11px;
                line-height: 1.4;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .enhanced-sidebar {
                    width: 100%;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .enhanced-sidebar.mobile-open {
                    transform: translateX(0);
                }

                .enhanced-sidebar.collapsed {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    registerExistingModules() {
        const modules = [
            // Business Operations
            { id: 'dashboard', name: 'Dashboard Overview', icon: '📊', category: 'business', status: 'active' },
            { id: 'commission', name: 'Commission Analytics', icon: '💰', category: 'business', status: 'active' },
            { id: 'legal-management', name: 'Legal Management', icon: '⚖️', category: 'business', status: 'active' },
            { id: 'tax-management', name: 'Tax Management', icon: '📋', category: 'business', status: 'active' },
            { id: 'investor-deck', name: 'Investor Deck', icon: '📈', category: 'business', status: 'active' },
            
            // AI Intelligence
            { id: 'qnis', name: 'QNIS Lead Map', icon: '🗺️', category: 'ai', status: 'active' },
            { id: 'ai-watson', name: 'AI Watson', icon: '🧠', category: 'ai', status: 'active' },
            { id: 'analytics', name: 'Analytics', icon: '📊', category: 'ai', status: 'active' },
            { id: 'leadgen', name: 'Lead Generation', icon: '🎯', category: 'ai', status: 'active' },
            
            // Automation
            { id: 'workflows', name: 'Workflows', icon: '🔄', category: 'automation', status: 'active' },
            { id: 'tradingbot', name: 'Trading Bot', icon: '🤖', category: 'automation', status: 'active' },
            { id: 'emailcampaign', name: 'Email Campaigns', icon: '📧', category: 'automation', status: 'active' },
            
            // System Control
            { id: 'apikeys', name: 'API Key Control', icon: '🔑', category: 'system', status: 'active' },
            { id: 'admin', name: 'Administration', icon: '⚙️', category: 'system', status: 'active' },
            { id: 'nexus', name: 'NEXUS Console', icon: '🎛️', category: 'system', status: 'active' }
        ];

        modules.forEach(module => {
            this.moduleRegistry.set(module.id, module);
            this.addModuleToCategory(module);
        });

        console.log(`[SIDEBAR] Registered ${modules.length} modules`);
    }

    addModuleToCategory(module) {
        const categoryContainer = document.getElementById(`${module.category}-modules`);
        if (!categoryContainer) return;

        const moduleElement = document.createElement('div');
        moduleElement.className = 'module-item';
        moduleElement.setAttribute('data-module', module.id);
        moduleElement.onclick = () => this.selectModule(module.id);
        
        moduleElement.innerHTML = `
            <span class="module-icon">${module.icon}</span>
            <span class="module-name">${module.name}</span>
            <div class="module-status ${module.status}"></div>
        `;

        categoryContainer.appendChild(moduleElement);
    }

    initializeSearch() {
        // Create search index from modules
        this.searchIndex = Array.from(this.moduleRegistry.values()).map(module => ({
            ...module,
            searchTerms: [
                module.name.toLowerCase(),
                module.category.toLowerCase(),
                module.id.toLowerCase()
            ].join(' ')
        }));
    }

    async handleSearch(event) {
        const query = event.target.value.trim();
        
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        // Basic text search
        const basicResults = this.performBasicSearch(query);
        
        // AI-enhanced search for complex queries
        if (query.length > 5 && this.nexusIntelligence) {
            const aiResults = await this.performAISearch(query);
            this.displaySearchResults([...basicResults, ...aiResults]);
        } else {
            this.displaySearchResults(basicResults);
        }
    }

    performBasicSearch(query) {
        const searchTerms = query.toLowerCase().split(' ');
        
        return this.searchIndex.filter(item => {
            return searchTerms.every(term => 
                item.searchTerms.includes(term)
            );
        }).map(item => ({
            ...item,
            score: this.calculateRelevanceScore(item, query),
            source: 'basic'
        })).sort((a, b) => b.score - a.score);
    }

    async performAISearch(query) {
        if (!query || !this.nexusIntelligence) return [];

        try {
            // Use existing API infrastructure for AI search
            const response = await fetch('/api/ai/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    context: 'dashboard_modules',
                    modules: Array.from(this.moduleRegistry.values())
                })
            });

            if (response.ok) {
                const aiResults = await response.json();
                return aiResults.suggestions || [];
            }
        } catch (error) {
            console.log('[SIDEBAR] AI search unavailable, using basic search');
        }

        return [];
    }

    calculateRelevanceScore(item, query) {
        const queryLower = query.toLowerCase();
        let score = 0;

        // Exact name match gets highest score
        if (item.name.toLowerCase().includes(queryLower)) {
            score += 100;
        }

        // Category match
        if (item.category.toLowerCase().includes(queryLower)) {
            score += 50;
        }

        // Partial matches
        const words = queryLower.split(' ');
        words.forEach(word => {
            if (item.searchTerms.includes(word)) {
                score += 25;
            }
        });

        return score;
    }

    displaySearchResults(results) {
        const searchResultsContainer = document.querySelector('.search-results');
        if (!searchResultsContainer) return;

        if (results.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="search-result-item">
                    <span class="result-icon">❓</span>
                    <div class="result-text">
                        <div class="result-title">No results found</div>
                        <div class="result-description">Try a different search term</div>
                    </div>
                </div>
            `;
        } else {
            searchResultsContainer.innerHTML = results.slice(0, 8).map(result => `
                <div class="search-result-item" onclick="sidebarSystem.selectModule('${result.id}')">
                    <span class="result-icon">${result.icon || '📄'}</span>
                    <div class="result-text">
                        <div class="result-title">${result.name}</div>
                        <div class="result-description">${result.category} • ${result.source || 'module'}</div>
                    </div>
                    <div class="result-score">${Math.round(result.score || 0)}</div>
                </div>
            `).join('');
        }

        searchResultsContainer.style.display = 'block';
    }

    showSearchResults() {
        const searchResultsContainer = document.querySelector('.search-results');
        if (searchResultsContainer && searchResultsContainer.innerHTML.trim()) {
            searchResultsContainer.style.display = 'block';
        }
    }

    hideSearchResults() {
        const searchResultsContainer = document.querySelector('.search-results');
        if (searchResultsContainer) {
            searchResultsContainer.style.display = 'none';
        }
    }

    toggleCollapse() {
        const sidebar = document.querySelector('.enhanced-sidebar');
        if (!sidebar) return;

        this.isCollapsed = !this.isCollapsed;
        sidebar.classList.toggle('collapsed', this.isCollapsed);

        // Update main content margin
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = this.isCollapsed ? '60px' : '280px';
            mainContent.style.transition = 'margin-left 0.3s ease';
        }

        console.log(`[SIDEBAR] ${this.isCollapsed ? 'Collapsed' : 'Expanded'} sidebar`);
    }

    toggleCategory(categoryName) {
        const categorySection = document.querySelector(`[data-category="${categoryName}"]`);
        if (!categorySection) return;

        categorySection.classList.toggle('collapsed');
        
        const indicator = categorySection.querySelector('.collapse-indicator');
        if (indicator) {
            indicator.style.transform = categorySection.classList.contains('collapsed') 
                ? 'rotate(-90deg)' 
                : 'rotate(0deg)';
        }
    }

    selectModule(moduleId) {
        // Remove active state from all modules
        document.querySelectorAll('.module-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active state to selected module
        const moduleElement = document.querySelector(`[data-module="${moduleId}"]`);
        if (moduleElement) {
            moduleElement.classList.add('active');
        }

        // Hide search results
        this.hideSearchResults();

        // Clear search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Trigger module activation
        this.activateModule(moduleId);

        console.log(`[SIDEBAR] Selected module: ${moduleId}`);
    }

    activateModule(moduleId) {
        // Use existing module switching logic
        if (window.switchToModule) {
            window.switchToModule(moduleId);
        } else if (window.showModule) {
            window.showModule(moduleId);
        } else {
            // Fallback: trigger click on existing sidebar item
            const existingItem = document.querySelector(`[onclick*="${moduleId}"]`);
            if (existingItem) {
                existingItem.click();
            }
        }
    }

    async setupAIEnhancements() {
        // Setup periodic AI insights
        setInterval(() => {
            this.generateAIInsights();
        }, 30000); // Every 30 seconds

        // Initial insights
        setTimeout(() => {
            this.generateAIInsights();
        }, 5000);
    }

    async generateAIInsights() {
        try {
            const response = await fetch('/api/ai/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context: 'sidebar_usage',
                    activeModules: Array.from(document.querySelectorAll('.module-item.active')).map(el => el.dataset.module)
                })
            });

            if (response.ok) {
                const insights = await response.json();
                this.displayAIInsights(insights);
            }
        } catch (error) {
            // AI insights are optional - fail silently
        }
    }

    displayAIInsights(insights) {
        const insightsPanel = document.querySelector('.ai-insights-panel');
        const insightsContent = document.querySelector('.insights-content');
        
        if (!insightsPanel || !insightsContent || !insights.suggestion) return;

        insightsContent.textContent = insights.suggestion;
        insightsPanel.style.display = 'block';

        // Auto-hide after 10 seconds
        setTimeout(() => {
            insightsPanel.style.display = 'none';
        }, 10000);
    }
}

// Initialize enhanced sidebar system
let sidebarSystem;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sidebarSystem = new EnhancedSidebarSystem();
    });
} else {
    sidebarSystem = new EnhancedSidebarSystem();
}

// Export for global access
window.sidebarSystem = sidebarSystem;

console.log('[SIDEBAR] Enhanced sidebar system loaded');