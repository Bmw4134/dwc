/**
 * Mobile Login System for iPhone
 * Optimized interface for mobile access to NEXUS platform
 */
class MobileLoginSystem {
    constructor() {
        this.isAuthenticated = false;
        this.userSession = null;
        this.mobileLoginOverlay = null;
    }

    initializeMobileLogin() {
        console.log('[MOBILE-LOGIN] Initializing iPhone-optimized login system');
        
        // Check if already authenticated
        if (this.checkExistingAuth()) {
            console.log('[MOBILE-LOGIN] User already authenticated');
            return;
        }
        
        // Create mobile-optimized login interface
        this.createMobileLoginInterface();
        
        // Bind mobile-specific events
        this.bindMobileEvents();
        
        // Auto-detect mobile and show login
        if (this.isMobileDevice()) {
            this.showMobileLogin();
        }
    }

    checkExistingAuth() {
        // Check localStorage for existing session
        const savedAuth = localStorage.getItem('nexus_mobile_auth');
        if (savedAuth) {
            try {
                this.userSession = JSON.parse(savedAuth);
                if (this.userSession.expires > Date.now()) {
                    this.isAuthenticated = true;
                    this.showAuthenticatedState();
                    return true;
                }
            } catch (e) {
                localStorage.removeItem('nexus_mobile_auth');
            }
        }
        return false;
    }

    createMobileLoginInterface() {
        // Remove any existing login overlay
        const existing = document.getElementById('mobile-login-overlay');
        if (existing) existing.remove();

        // Create mobile-optimized login overlay
        this.mobileLoginOverlay = document.createElement('div');
        this.mobileLoginOverlay.id = 'mobile-login-overlay';
        this.mobileLoginOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
            z-index: 10000;
            display: none;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        `;

        const loginContent = document.createElement('div');
        loginContent.style.cssText = `
            padding: 40px 20px;
            max-width: 400px;
            margin: 0 auto;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        loginContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 32px; margin-bottom: 10px;">🚀</div>
                <h1 style="margin: 0; font-size: 28px; color: #00ff88; margin-bottom: 8px;">NEXUS Mobile</h1>
                <p style="margin: 0; color: #888; font-size: 16px;">Intelligence Platform Access</p>
            </div>

            <div class="login-form" style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 8px; color: #00ff88; font-weight: 600;">Access Code</label>
                    <input type="password" id="mobile-access-code" placeholder="Enter your access code" style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #333;
                        border-radius: 10px;
                        background: rgba(0,0,0,0.3);
                        color: white;
                        font-size: 16px;
                        -webkit-appearance: none;
                        box-sizing: border-box;
                    ">
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 8px; color: #00ff88; font-weight: 600;">Username</label>
                    <input type="text" id="mobile-username" placeholder="Your username" style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #333;
                        border-radius: 10px;
                        background: rgba(0,0,0,0.3);
                        color: white;
                        font-size: 16px;
                        -webkit-appearance: none;
                        box-sizing: border-box;
                    ">
                </div>

                <button id="mobile-login-btn" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(45deg, #00ff88, #00cc6a);
                    color: #000;
                    border: none;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 20px;
                    transition: transform 0.2s;
                " ontouchstart="this.style.transform='scale(0.95)'" ontouchend="this.style.transform='scale(1)'">
                    Access NEXUS Platform
                </button>

                <div style="text-align: center;">
                    <button id="guest-access-btn" style="
                        background: transparent;
                        color: #888;
                        border: 1px solid #444;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 14px;
                        cursor: pointer;
                    ">
                        Continue as Guest
                    </button>
                </div>
            </div>

            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>DWC Systems • Secure Access Portal</p>
                <p>Version 2.1 • iPhone Optimized</p>
            </div>
        `;

        this.mobileLoginOverlay.appendChild(loginContent);
        document.body.appendChild(this.mobileLoginOverlay);
    }

    bindMobileEvents() {
        // Login button
        document.getElementById('mobile-login-btn')?.addEventListener('click', () => {
            this.processMobileLogin();
        });

        // Guest access button
        document.getElementById('guest-access-btn')?.addEventListener('click', () => {
            this.grantGuestAccess();
        });

        // Enter key support
        document.getElementById('mobile-access-code')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processMobileLogin();
            }
        });

        document.getElementById('mobile-username')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processMobileLogin();
            }
        });

        // Auto-focus on first input when shown
        this.mobileLoginOverlay?.addEventListener('transitionend', () => {
            if (this.mobileLoginOverlay.style.display !== 'none') {
                setTimeout(() => {
                    document.getElementById('mobile-access-code')?.focus();
                }, 100);
            }
        });
    }

    processMobileLogin() {
        const accessCode = document.getElementById('mobile-access-code')?.value;
        const username = document.getElementById('mobile-username')?.value;
        const loginBtn = document.getElementById('mobile-login-btn');

        if (!accessCode && !username) {
            this.showMobileAlert('Please enter access code or username');
            return;
        }

        // Show loading state
        loginBtn.textContent = 'Authenticating...';
        loginBtn.style.background = '#666';

        // Simulate authentication process
        setTimeout(() => {
            const validCodes = ['nexus2024', 'dwc-admin', 'quantum-access', 'mobile-user'];
            const validUsernames = ['admin', 'user', 'guest', 'mobile', 'dwc'];

            if (validCodes.includes(accessCode) || validUsernames.includes(username)) {
                this.authenticateUser(username || 'mobile-user');
            } else {
                // For demo purposes, allow any entry
                this.authenticateUser(username || accessCode || 'authenticated-user');
            }
        }, 1500);
    }

    authenticateUser(username) {
        console.log('[MOBILE-LOGIN] Authenticating user:', username);

        // Create user session
        this.userSession = {
            username: username,
            loginTime: Date.now(),
            expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            platform: 'mobile',
            device: 'iPhone'
        };

        // Save to localStorage
        localStorage.setItem('nexus_mobile_auth', JSON.stringify(this.userSession));
        
        this.isAuthenticated = true;
        
        // Show success message
        this.showAuthenticationSuccess();
        
        // Hide login overlay after success
        setTimeout(() => {
            this.hideMobileLogin();
            this.showAuthenticatedState();
        }, 2000);
    }

    grantGuestAccess() {
        console.log('[MOBILE-LOGIN] Granting guest access');
        
        this.userSession = {
            username: 'guest',
            loginTime: Date.now(),
            expires: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
            platform: 'mobile',
            device: 'iPhone',
            accessLevel: 'guest'
        };

        localStorage.setItem('nexus_mobile_auth', JSON.stringify(this.userSession));
        this.isAuthenticated = true;
        
        this.showMobileAlert('Guest access granted', 'success');
        
        setTimeout(() => {
            this.hideMobileLogin();
            this.showAuthenticatedState();
        }, 1500);
    }

    showAuthenticationSuccess() {
        const loginBtn = document.getElementById('mobile-login-btn');
        if (loginBtn) {
            loginBtn.textContent = '✓ Authentication Successful';
            loginBtn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        }
        
        this.showMobileAlert('Welcome to NEXUS Platform!', 'success');
    }

    showAuthenticatedState() {
        // Create authenticated status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'mobile-auth-status';
        statusIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 9998;
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        statusIndicator.innerHTML = `
            <span style="font-size: 10px;">●</span>
            ${this.userSession.username}
        `;
        
        // Remove existing indicator
        const existing = document.getElementById('mobile-auth-status');
        if (existing) existing.remove();
        
        document.body.appendChild(statusIndicator);
        
        // Add logout functionality
        statusIndicator.addEventListener('click', () => {
            this.showLogoutMenu();
        });
    }

    showLogoutMenu() {
        const logoutMenu = document.createElement('div');
        logoutMenu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            text-align: center;
            backdrop-filter: blur(10px);
        `;
        
        logoutMenu.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #00ff88;">Account Menu</h3>
            <p style="margin: 0 0 20px 0; color: #888;">Logged in as: ${this.userSession.username}</p>
            <button onclick="this.parentElement.remove()" style="
                background: #666;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-right: 10px;
                cursor: pointer;
            ">Cancel</button>
            <button id="logout-confirm-btn" style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            ">Logout</button>
        `;
        
        document.body.appendChild(logoutMenu);
        
        // Bind logout confirmation
        document.getElementById('logout-confirm-btn').addEventListener('click', () => {
            this.logout();
            logoutMenu.remove();
        });
    }

    logout() {
        console.log('[MOBILE-LOGIN] User logging out');
        
        // Clear session data
        localStorage.removeItem('nexus_mobile_auth');
        this.isAuthenticated = false;
        this.userSession = null;
        
        // Remove status indicator
        const statusIndicator = document.getElementById('mobile-auth-status');
        if (statusIndicator) statusIndicator.remove();
        
        // Show logout success
        this.showMobileAlert('Logged out successfully');
        
        // Show login again if on mobile
        setTimeout(() => {
            if (this.isMobileDevice()) {
                this.showMobileLogin();
            }
        }, 1500);
    }

    showMobileLogin() {
        if (this.mobileLoginOverlay) {
            this.mobileLoginOverlay.style.display = 'block';
            
            // Smooth fade in
            setTimeout(() => {
                this.mobileLoginOverlay.style.opacity = '1';
                this.mobileLoginOverlay.style.transition = 'opacity 0.3s ease';
            }, 10);
        }
    }

    hideMobileLogin() {
        if (this.mobileLoginOverlay) {
            this.mobileLoginOverlay.style.opacity = '0';
            this.mobileLoginOverlay.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                this.mobileLoginOverlay.style.display = 'none';
            }, 300);
        }
    }

    showMobileAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10002;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 80%;
            text-align: center;
        `;
        
        alert.textContent = message;
        document.body.appendChild(alert);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // Public methods for integration
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    getUserSession() {
        return this.userSession;
    }

    forceShowLogin() {
        this.showMobileLogin();
    }
}

// Auto-initialize on mobile devices
document.addEventListener('DOMContentLoaded', function() {
    window.mobileLoginSystem = new MobileLoginSystem();
    
    // Initialize immediately if on mobile
    if (window.mobileLoginSystem.isMobileDevice()) {
        window.mobileLoginSystem.initializeMobileLogin();
    }
    
    // Global function for manual login trigger
    window.showMobileLogin = function() {
        window.mobileLoginSystem.forceShowLogin();
    };
    
    console.log('[MOBILE-LOGIN] iPhone login system ready');
});

// Add mobile login button to desktop for testing
if (typeof window !== 'undefined') {
    setTimeout(() => {
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
            const mobileTestBtn = document.createElement('button');
            mobileTestBtn.innerHTML = '📱 Test Mobile Login';
            mobileTestBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                z-index: 9999;
                font-size: 12px;
            `;
            mobileTestBtn.onclick = () => {
                if (window.mobileLoginSystem) {
                    window.mobileLoginSystem.forceShowLogin();
                }
            };
            document.body.appendChild(mobileTestBtn);
        }
    }, 3000);
}