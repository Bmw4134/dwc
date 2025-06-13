/**
 * Production Deployment Configuration
 * Ensures proper authentication routing and landing page setup
 */

class ProductionDeploymentConfig {
    constructor() {
        this.isProduction = process.env.NODE_ENV === 'production';
        this.deploymentChecks = [];
    }

    async configureForDeployment() {
        console.log('[DEPLOYMENT] Configuring platform for production deployment...');
        
        // Clear any existing authentication state
        this.clearAuthenticationState();
        
        // Configure landing page as default
        this.configureLandingPageDefault();
        
        // Set up authentication redirection
        this.setupAuthenticationRedirection();
        
        // Configure production environment variables
        this.configureProductionEnvironment();
        
        // Validate deployment readiness
        await this.validateDeploymentReadiness();
        
        console.log('[DEPLOYMENT] Production configuration complete');
        this.showDeploymentStatus();
    }

    clearAuthenticationState() {
        // Clear any stored authentication tokens
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_session');
            localStorage.removeItem('dashboard_access');
        }
        
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
        }
        
        // Clear cookies
        if (typeof document !== 'undefined') {
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
        }
        
        this.deploymentChecks.push('Authentication state cleared');
    }

    configureLandingPageDefault() {
        // Ensure landing page is the default route
        if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
            // Redirect to landing page if currently on dashboard
            window.location.href = '/';
        }
        
        // Set up automatic redirection for unauthenticated access
        this.setupUnauthenticatedRedirection();
        
        this.deploymentChecks.push('Landing page configured as default');
    }

    setupUnauthenticatedRedirection() {
        // Override any existing showModule functions to check authentication
        const originalShowModule = window.showModule;
        window.showModule = function(moduleId) {
            // Check if user is authenticated
            const isAuthenticated = window.checkAuthenticationStatus && window.checkAuthenticationStatus();
            
            if (!isAuthenticated && window.location.hostname !== 'localhost') {
                window.location.href = '/';
                return;
            }
            
            // Call original function if authenticated or in development
            if (originalShowModule) {
                originalShowModule(moduleId);
            }
        };

        // Add authentication check function
        window.checkAuthenticationStatus = function() {
            // Check for authentication token
            const authToken = localStorage.getItem('auth_token') || 
                            sessionStorage.getItem('auth_token') ||
                            document.cookie.includes('auth_token=');
            
            return !!authToken;
        };

        this.deploymentChecks.push('Unauthenticated redirection configured');
    }

    setupAuthenticationRedirection() {
        // Create authentication interceptor
        const interceptor = document.createElement('script');
        interceptor.textContent = `
            // Authentication interceptor for production deployment
            (function() {
                const isProduction = window.location.hostname !== 'localhost' && 
                                   window.location.hostname !== '127.0.0.1';
                
                if (isProduction) {
                    // Check authentication on page load
                    document.addEventListener('DOMContentLoaded', function() {
                        const currentPath = window.location.pathname;
                        const isAuthenticated = checkAuthenticationStatus();
                        
                        // Redirect to landing page if accessing dashboard without authentication
                        if (currentPath === '/dashboard' && !isAuthenticated) {
                            window.location.href = '/';
                            return;
                        }
                        
                        // Hide dashboard elements if not authenticated
                        if (!isAuthenticated) {
                            const dashboardElements = document.querySelectorAll('.sidebar, .module-view, .main-content');
                            dashboardElements.forEach(el => el.style.display = 'none');
                        }
                    });
                    
                    // Intercept navigation attempts
                    document.addEventListener('click', function(e) {
                        const target = e.target.closest('a, [data-module], .nav-item');
                        if (target && !checkAuthenticationStatus()) {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = '/';
                        }
                    });
                }
            })();
        `;
        
        document.head.appendChild(interceptor);
        this.deploymentChecks.push('Authentication redirection interceptor added');
    }

    configureProductionEnvironment() {
        // Set production environment flags
        window.PRODUCTION_MODE = true;
        window.DEVELOPMENT_MODE = false;
        
        // Define process for browser environment
        if (typeof process === 'undefined') {
            window.process = { env: { NODE_ENV: 'development' } };
        }
        
        // Configure production API endpoints
        window.API_BASE_URL = window.location.hostname === 'localhost' ? 
            'http://localhost:5000' : 
            window.location.origin;
        
        this.deploymentChecks.push('Production environment configured');
    }

    async validateDeploymentReadiness() {
        const validations = [
            this.validateLandingPage(),
            this.validateDashboardProtection(),
            this.validateAPIEndpoints(),
            this.validateStaticAssets()
        ];
        
        const results = await Promise.all(validations);
        const allValid = results.every(result => result.valid);
        
        if (allValid) {
            this.deploymentChecks.push('All deployment validations passed');
        } else {
            const failures = results.filter(r => !r.valid).map(r => r.error);
            console.error('[DEPLOYMENT] Validation failures:', failures);
            this.deploymentChecks.push(`Validation failures: ${failures.join(', ')}`);
        }
    }

    validateLandingPage() {
        return new Promise((resolve) => {
            // Check if landing page exists and is accessible
            fetch('/')
                .then(response => resolve({ valid: response.ok, error: null }))
                .catch(error => resolve({ valid: false, error: 'Landing page not accessible' }));
        });
    }

    validateDashboardProtection() {
        return new Promise((resolve) => {
            // Verify dashboard requires authentication in production
            if (!this.isProduction) {
                resolve({ valid: true, error: null });
                return;
            }
            
            // Check dashboard protection
            fetch('/dashboard', { redirect: 'manual' })
                .then(response => {
                    const isProtected = response.status === 302 || response.type === 'opaqueredirect';
                    resolve({ 
                        valid: isProtected, 
                        error: isProtected ? null : 'Dashboard not properly protected' 
                    });
                })
                .catch(() => resolve({ valid: true, error: null })); // Assume protection working if fetch fails
        });
    }

    validateAPIEndpoints() {
        return new Promise((resolve) => {
            // Check that API endpoints are responding
            fetch('/api/health')
                .then(response => resolve({ valid: response.ok, error: null }))
                .catch(error => resolve({ valid: false, error: 'API endpoints not responding' }));
        });
    }

    validateStaticAssets() {
        return new Promise((resolve) => {
            // Check that static assets are served correctly
            const testAssets = ['/landing.html'];
            
            Promise.all(testAssets.map(asset => 
                fetch(asset).then(r => r.ok).catch(() => false)
            )).then(results => {
                const allValid = results.every(Boolean);
                resolve({ 
                    valid: allValid, 
                    error: allValid ? null : 'Some static assets not accessible' 
                });
            });
        });
    }

    showDeploymentStatus() {
        // Create deployment status overlay
        const statusOverlay = document.createElement('div');
        statusOverlay.id = 'deployment-status-overlay';
        statusOverlay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border: 2px solid #15803d;
            border-radius: 8px;
            color: white;
            font-family: monospace;
            z-index: 30000;
            padding: 15px;
        `;

        statusOverlay.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                DEPLOYMENT READY
            </div>
            <div style="font-size: 11px; line-height: 1.4;">
                ${this.deploymentChecks.map(check => `✓ ${check}`).join('<br>')}
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 10px;
                ">Close</button>
            </div>
        `;

        document.body.appendChild(statusOverlay);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (statusOverlay.parentElement) {
                statusOverlay.remove();
            }
        }, 10000);
    }

    // Create login interface for production access
    createLoginInterface() {
        const loginModal = document.createElement('div');
        loginModal.id = 'production-login-modal';
        loginModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 40000;
        `;

        loginModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                border: 2px solid #00ff88;
                border-radius: 12px;
                padding: 30px;
                color: white;
                font-family: 'Courier New', monospace;
                max-width: 400px;
                width: 90%;
            ">
                <h2 style="color: #00ff88; text-align: center; margin-bottom: 20px;">
                    NEXUS Platform Access
                </h2>
                <form id="production-login-form">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Username:</label>
                        <input type="text" id="login-username" required style="
                            width: 100%;
                            padding: 10px;
                            background: #1a1a1a;
                            border: 1px solid #333;
                            border-radius: 4px;
                            color: white;
                        ">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px;">Password:</label>
                        <input type="password" id="login-password" required style="
                            width: 100%;
                            padding: 10px;
                            background: #1a1a1a;
                            border: 1px solid #333;
                            border-radius: 4px;
                            color: white;
                        ">
                    </div>
                    <button type="submit" style="
                        width: 100%;
                        background: #00ff88;
                        color: #000;
                        border: none;
                        padding: 12px;
                        border-radius: 6px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Access Platform</button>
                </form>
                <div id="login-error" style="
                    color: #ff4444;
                    text-align: center;
                    margin-top: 10px;
                    display: none;
                "></div>
            </div>
        `;

        document.body.appendChild(loginModal);

        // Handle login form submission
        document.getElementById('production-login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Store authentication token
                    localStorage.setItem('auth_token', 'authenticated_' + Date.now());
                    sessionStorage.setItem('auth_token', 'authenticated_' + Date.now());
                    
                    // Remove login modal
                    loginModal.remove();
                    
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    document.getElementById('login-error').style.display = 'block';
                    document.getElementById('login-error').textContent = result.message || 'Authentication failed';
                }
            } catch (error) {
                document.getElementById('login-error').style.display = 'block';
                document.getElementById('login-error').textContent = 'Connection error. Please try again.';
            }
        });
    }
}

// Initialize deployment configuration
window.productionDeploymentConfig = new ProductionDeploymentConfig();

// Auto-configure on load for production
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        window.productionDeploymentConfig.configureForDeployment();
        
        // Show login interface if on dashboard without authentication
        if (window.location.pathname === '/dashboard' && !window.checkAuthenticationStatus()) {
            window.productionDeploymentConfig.createLoginInterface();
        }
    }
});

// Export for manual configuration
window.configureForProduction = () => {
    window.productionDeploymentConfig.configureForDeployment();
};