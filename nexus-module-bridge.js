/**
 * NEXUS Module Bridge - Connects React TypeScript modules to dashboard
 * Enables seamless integration of built components into the NEXUS interface
 */

class NEXUSModuleBridge {
    constructor() {
        this.reactModules = new Map();
        this.mountedComponents = new Map();
        this.moduleRegistry = this.initializeModuleRegistry();
    }

    initializeModuleRegistry() {
        return {
            // Executive & Admin Modules
            'watson-console': {
                path: '/src/pages/WatsonMasterConsole.tsx',
                component: 'WatsonMasterConsole',
                title: 'Watson Master Console',
                icon: '🤖',
                category: 'executive'
            },
            'quantum-dashboard': {
                path: '/src/pages/QuantumDashboard.tsx',
                component: 'QuantumDashboard',
                title: 'Quantum Intelligence Dashboard',
                icon: '⚛️',
                category: 'intelligence'
            },
            'trading-dashboard': {
                path: '/src/pages/trading-bot.tsx',
                component: 'TradingBot',
                title: 'Trading Engine',
                icon: '📈',
                category: 'trading'
            },
            'llc-formation': {
                path: '/src/pages/LLCFormationPage.tsx',
                component: 'LLCFormationPage',
                title: 'LLC Formation Portal',
                icon: '🏢',
                category: 'business'
            },
            'lead-intelligence': {
                path: '/src/pages/lead-intelligence-dashboard.tsx',
                component: 'LeadIntelligenceDashboard',
                title: 'Lead Intelligence Engine',
                icon: '🎯',
                category: 'leads'
            },
            'nexus-observer': {
                path: '/src/pages/nexus-observer.tsx',
                component: 'NexusObserver',
                title: 'NEXUS Observer',
                icon: '👁️',
                category: 'monitoring'
            },
            'automation-hub': {
                path: '/src/pages/automation-hub.tsx',
                component: 'AutomationHub',
                title: 'Automation Command Center',
                icon: '🔄',
                category: 'automation'
            },
            'consulting-dashboard': {
                path: '/src/pages/consulting-dashboard.tsx',
                component: 'ConsultingDashboard',
                title: 'Consulting Operations',
                icon: '💼',
                category: 'business'
            },
            'financial-command': {
                path: '/src/pages/financial-command-center.tsx',
                component: 'FinancialCommandCenter',
                title: 'Financial Command Center',
                icon: '💰',
                category: 'financial'
            },
            'api-testing': {
                path: '/src/pages/api-testing.tsx',
                component: 'ApiTesting',
                title: 'API Testing Console',
                icon: '🔧',
                category: 'development'
            },
            'mobile-control': {
                path: '/src/pages/MobileControl.tsx',
                component: 'MobileControl',
                title: 'Mobile Command Interface',
                icon: '📱',
                category: 'mobile'
            },
            'system-logs': {
                path: '/src/pages/system-logs.tsx',
                component: 'SystemLogs',
                title: 'System Diagnostics',
                icon: '📊',
                category: 'system'
            }
        };
    }

    async bridgeModule(moduleId) {
        const moduleConfig = this.moduleRegistry[moduleId];
        if (!moduleConfig) {
            console.warn(`[BRIDGE] Module not found: ${moduleId}`);
            return this.createFallbackModule(moduleId);
        }

        try {
            // Create iframe container for React component
            const moduleContent = this.createModuleContainer(moduleConfig);
            
            // Load the React component in iframe
            await this.loadReactComponent(moduleConfig, moduleContent);
            
            return moduleContent;
        } catch (error) {
            console.error(`[BRIDGE] Error loading module ${moduleId}:`, error);
            return this.createErrorModule(moduleId, error.message);
        }
    }

    createModuleContainer(moduleConfig) {
        return `
            <div class="bridged-module" data-module="${moduleConfig.component}">
                <div class="module-header">
                    <div class="module-header-icon">${moduleConfig.icon}</div>
                    <div class="module-header-title">${moduleConfig.title}</div>
                    <div class="module-status">
                        <span class="status-indicator active"></span>
                        React Module
                    </div>
                </div>
                
                <div class="react-module-frame" id="frame-${moduleConfig.component}">
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <div>Loading ${moduleConfig.title}...</div>
                    </div>
                </div>
                
                <div class="module-controls">
                    <button onclick="window.refreshModule('${moduleConfig.component}')" class="control-btn">
                        🔄 Refresh
                    </button>
                    <button onclick="window.openFullscreen('${moduleConfig.component}')" class="control-btn">
                        🔍 Fullscreen
                    </button>
                    <button onclick="window.openNewTab('${moduleConfig.path}')" class="control-btn">
                        🔗 Open Direct
                    </button>
                </div>
            </div>
        `;
    }

    async loadReactComponent(moduleConfig, containerElement) {
        // Create iframe to load React component
        const frameContainer = document.getElementById(`frame-${moduleConfig.component}`);
        if (!frameContainer) return;

        const iframe = document.createElement('iframe');
        iframe.src = moduleConfig.path;
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.background = 'transparent';
        
        // Handle iframe load
        iframe.onload = () => {
            const loadingState = frameContainer.querySelector('.loading-state');
            if (loadingState) {
                loadingState.style.display = 'none';
            }
            console.log(`[BRIDGE] Successfully loaded ${moduleConfig.title}`);
        };

        iframe.onerror = () => {
            frameContainer.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">Failed to load ${moduleConfig.title}</div>
                    <button onclick="window.retryModule('${moduleConfig.component}')" class="retry-btn">
                        Retry Loading
                    </button>
                </div>
            `;
        };

        frameContainer.appendChild(iframe);
        this.mountedComponents.set(moduleConfig.component, iframe);
    }

    createFallbackModule(moduleId) {
        return `
            <div class="fallback-module">
                <div class="module-header">
                    <div class="module-header-icon">📦</div>
                    <div class="module-header-title">${moduleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div class="module-status">
                        <span class="status-indicator pending"></span>
                        Available Soon
                    </div>
                </div>
                
                <div class="fallback-content">
                    <div class="fallback-icon">🚧</div>
                    <h3>Module Coming Soon</h3>
                    <p>This module is being prepared for integration with the NEXUS platform.</p>
                    
                    <div class="available-modules">
                        <h4>Available Modules:</h4>
                        <div class="module-links">
                            ${Object.entries(this.moduleRegistry).map(([id, config]) => `
                                <button onclick="activateModule('${id}')" class="module-link-btn">
                                    ${config.icon} ${config.title}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createErrorModule(moduleId, errorMessage) {
        return `
            <div class="error-module">
                <div class="module-header">
                    <div class="module-header-icon">❌</div>
                    <div class="module-header-title">Error Loading ${moduleId}</div>
                </div>
                
                <div class="error-content">
                    <div class="error-details">
                        <strong>Error:</strong> ${errorMessage}
                    </div>
                    <div class="error-actions">
                        <button onclick="activateModule('${moduleId}')" class="retry-btn">
                            🔄 Retry
                        </button>
                        <button onclick="activateModule('executive-dashboard')" class="fallback-btn">
                            📊 Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Global helper functions
    setupGlobalHelpers() {
        window.refreshModule = (componentName) => {
            const iframe = this.mountedComponents.get(componentName);
            if (iframe) {
                iframe.src = iframe.src; // Force reload
            }
        };

        window.openFullscreen = (componentName) => {
            const moduleConfig = Object.values(this.moduleRegistry).find(
                config => config.component === componentName
            );
            if (moduleConfig) {
                window.open(moduleConfig.path, '_blank', 'fullscreen=yes');
            }
        };

        window.openNewTab = (path) => {
            window.open(path, '_blank');
        };

        window.retryModule = (componentName) => {
            const moduleConfig = Object.values(this.moduleRegistry).find(
                config => config.component === componentName
            );
            if (moduleConfig) {
                this.loadReactComponent(moduleConfig);
            }
        };
    }

    addBridgeStyles() {
        const styles = `
            <style>
                .bridged-module {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .module-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                
                .status-indicator.active {
                    background: var(--neo-green);
                    box-shadow: 0 0 8px var(--neo-green);
                }
                
                .status-indicator.pending {
                    background: var(--quantum-blue);
                    animation: pulse 2s infinite;
                }
                
                .react-module-frame {
                    min-height: 400px;
                    position: relative;
                }
                
                .loading-state, .error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(0, 212, 255, 0.3);
                    border-top: 3px solid var(--quantum-blue);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                
                .module-controls {
                    display: flex;
                    gap: 0.5rem;
                    padding: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.2);
                }
                
                .control-btn, .retry-btn, .fallback-btn, .module-link-btn {
                    padding: 0.5rem 1rem;
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    color: var(--quantum-blue);
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                }
                
                .control-btn:hover, .retry-btn:hover, .fallback-btn:hover, .module-link-btn:hover {
                    background: rgba(0, 212, 255, 0.2);
                    border-color: var(--quantum-blue);
                }
                
                .fallback-content {
                    padding: 2rem;
                    text-align: center;
                }
                
                .fallback-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                
                .available-modules {
                    margin-top: 2rem;
                    text-align: left;
                }
                
                .module-links {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    initialize() {
        this.setupGlobalHelpers();
        this.addBridgeStyles();
        console.log('[BRIDGE] NEXUS Module Bridge initialized with', Object.keys(this.moduleRegistry).length, 'registered modules');
    }
}

// Initialize bridge system
const moduleBridge = new NEXUSModuleBridge();
moduleBridge.initialize();

// Export for global access
window.NEXUSModuleBridge = moduleBridge;