/**
 * Permanent Authentication System
 * Sets current authentication as main credentials for DWC Systems
 */

class PermanentAuthSystem {
    constructor() {
        this.currentSession = this.captureCurrentAuth();
        this.authConfig = {
            sessionPersistence: true,
            autoLogin: true,
            credentialStorage: 'secure',
            sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
        };
        this.init();
    }

    init() {
        this.setupPermanentCredentials();
        this.createAuthInterface();
        this.bindAuthEvents();
        console.log('[PERMANENT-AUTH] Main authentication system established');
    }

    captureCurrentAuth() {
        // Capture whatever authentication method is currently being used
        const currentAuth = {
            sessionId: this.generateSessionId(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            authMethod: 'current_session',
            permissions: ['admin', 'developer', 'business_owner'],
            accessLevel: 'full'
        };

        // Store current session as permanent
        localStorage.setItem('dwc_permanent_auth', JSON.stringify(currentAuth));
        sessionStorage.setItem('dwc_active_session', JSON.stringify(currentAuth));
        
        return currentAuth;
    }

    setupPermanentCredentials() {
        // Create permanent authentication token
        const permanentToken = this.generatePermanentToken();
        
        // Store in multiple locations for redundancy
        localStorage.setItem('dwc_master_token', permanentToken);
        localStorage.setItem('dwc_auth_established', 'true');
        localStorage.setItem('dwc_auth_timestamp', Date.now().toString());
        
        // Set up auto-login mechanism
        this.setupAutoLogin();
        
        // Create authentication verification
        this.verifyAndMaintainAuth();
    }

    generatePermanentToken() {
        const tokenData = {
            user: 'dwc_admin',
            role: 'owner',
            permissions: ['all'],
            created: Date.now(),
            expires: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
            signature: this.generateSignature()
        };
        
        return btoa(JSON.stringify(tokenData));
    }

    generateSignature() {
        const data = Date.now() + navigator.userAgent + 'dwc_systems_auth';
        return btoa(data).substring(0, 32);
    }

    generateSessionId() {
        return 'dwc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupAutoLogin() {
        // Override any existing authentication checks
        window.DWC_AUTH_BYPASS = true;
        window.DWC_AUTHENTICATED = true;
        window.DWC_USER_ROLE = 'admin';
        
        // Set up authentication verification function
        window.verifyDWCAuth = () => {
            const token = localStorage.getItem('dwc_master_token');
            const established = localStorage.getItem('dwc_auth_established');
            return token && established === 'true';
        };
        
        // Auto-authenticate on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.maintainAuthentication();
        });
    }

    verifyAndMaintainAuth() {
        // Continuous authentication verification
        setInterval(() => {
            this.maintainAuthentication();
        }, 60000); // Check every minute
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.maintainAuthentication();
            }
        });
    }

    maintainAuthentication() {
        const token = localStorage.getItem('dwc_master_token');
        const established = localStorage.getItem('dwc_auth_established');
        
        if (!token || established !== 'true') {
            // Re-establish authentication
            this.setupPermanentCredentials();
        }
        
        // Update session timestamp
        localStorage.setItem('dwc_last_activity', Date.now().toString());
        
        // Ensure authentication state
        window.DWC_AUTHENTICATED = true;
        
        // Update UI to reflect authenticated state
        this.updateAuthenticatedUI();
    }

    createAuthInterface() {
        const authInterface = document.createElement('div');
        authInterface.id = 'permanent-auth-interface';
        authInterface.innerHTML = `
            <div class="auth-status-panel">
                <div class="auth-header">
                    <h3>Authentication Status</h3>
                    <div class="auth-indicator active" id="auth-indicator">
                        <span class="status-dot"></span>
                        <span class="status-text">Authenticated</span>
                    </div>
                </div>
                
                <div class="auth-details">
                    <div class="auth-item">
                        <span class="auth-label">Session:</span>
                        <span class="auth-value" id="session-id">${this.currentSession.sessionId}</span>
                    </div>
                    <div class="auth-item">
                        <span class="auth-label">Access Level:</span>
                        <span class="auth-value">Full Admin</span>
                    </div>
                    <div class="auth-item">
                        <span class="auth-label">Status:</span>
                        <span class="auth-value">Permanent</span>
                    </div>
                </div>
                
                <div class="auth-actions">
                    <button class="auth-btn primary" onclick="permanentAuth.refreshSession()">
                        Refresh Session
                    </button>
                    <button class="auth-btn secondary" onclick="permanentAuth.exportCredentials()">
                        Export Credentials
                    </button>
                </div>
            </div>
        `;
        
        this.addAuthStyles();
        
        // Add to dashboard
        const dashboard = document.querySelector('.main-content') || document.body;
        dashboard.appendChild(authInterface);
    }

    addAuthStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .auth-status-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 12px;
                padding: 20px;
                width: 300px;
                z-index: 9998;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            
            .auth-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .auth-header h3 {
                color: #3b82f6;
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .auth-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .auth-indicator.active .status-dot {
                background: #10b981;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
            }
            
            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ef4444;
                animation: pulse 2s infinite;
            }
            
            .status-text {
                color: #10b981;
                font-size: 12px;
                font-weight: 600;
            }
            
            .auth-details {
                margin-bottom: 16px;
            }
            
            .auth-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .auth-label {
                color: #94a3b8;
                font-size: 12px;
            }
            
            .auth-value {
                color: #e2e8f0;
                font-size: 12px;
                font-weight: 500;
            }
            
            .auth-actions {
                display: flex;
                gap: 8px;
            }
            
            .auth-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .auth-btn.primary {
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
            }
            
            .auth-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #e2e8f0;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .auth-btn:hover {
                transform: translateY(-1px);
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(styles);
    }

    bindAuthEvents() {
        // Handle page navigation
        window.addEventListener('beforeunload', () => {
            this.saveAuthState();
        });
        
        // Handle storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'dwc_master_token' && !e.newValue) {
                // Re-establish if token was removed
                this.setupPermanentCredentials();
            }
        });
    }

    updateAuthenticatedUI() {
        // Update authentication indicator
        const indicator = document.getElementById('auth-indicator');
        if (indicator) {
            indicator.classList.add('active');
        }
        
        // Update any login buttons to show authenticated state
        const loginButtons = document.querySelectorAll('[onclick*="login"], [onclick*="Login"]');
        loginButtons.forEach(btn => {
            btn.textContent = 'Dashboard';
            btn.onclick = () => window.location.href = '/dashboard';
        });
        
        // Add authenticated class to body
        document.body.classList.add('dwc-authenticated');
    }

    refreshSession() {
        // Generate new session ID but maintain authentication
        this.currentSession.sessionId = this.generateSessionId();
        this.currentSession.timestamp = new Date().toISOString();
        
        // Update stored session
        localStorage.setItem('dwc_permanent_auth', JSON.stringify(this.currentSession));
        sessionStorage.setItem('dwc_active_session', JSON.stringify(this.currentSession));
        
        // Update UI
        const sessionElement = document.getElementById('session-id');
        if (sessionElement) {
            sessionElement.textContent = this.currentSession.sessionId;
        }
        
        this.showNotification('Session refreshed successfully', 'success');
    }

    exportCredentials() {
        const credentials = {
            masterToken: localStorage.getItem('dwc_master_token'),
            sessionData: this.currentSession,
            authConfig: this.authConfig,
            exportedAt: new Date().toISOString(),
            instructions: 'Store these credentials securely. They provide full access to DWC Systems.'
        };
        
        const blob = new Blob([JSON.stringify(credentials, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dwc-authentication-credentials.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Credentials exported successfully', 'success');
    }

    saveAuthState() {
        const authState = {
            session: this.currentSession,
            config: this.authConfig,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('dwc_auth_state', JSON.stringify(authState));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-size: 14px;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Public methods for integration
    isAuthenticated() {
        return localStorage.getItem('dwc_auth_established') === 'true';
    }

    getAuthToken() {
        return localStorage.getItem('dwc_master_token');
    }

    getUserRole() {
        return 'admin';
    }

    getPermissions() {
        return ['all'];
    }
}

// Initialize permanent authentication system
let permanentAuth;
document.addEventListener('DOMContentLoaded', () => {
    permanentAuth = new PermanentAuthSystem();
    
    // Make authentication globally available
    window.DWC_PERMANENT_AUTH = permanentAuth;
    window.DWC_AUTH_CHECK = () => permanentAuth.isAuthenticated();
});

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PermanentAuthSystem;
}