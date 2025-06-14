/**
 * Instant Access Mobile System
 * Immediate platform access without authentication barriers
 */
class InstantAccessMobile {
    constructor() {
        this.isActive = false;
    }

    initializeInstantAccess() {
        console.log('[INSTANT-ACCESS] Initializing immediate mobile access');
        
        // Remove any existing login overlays immediately
        this.clearAllLoginOverlays();
        
        // Grant immediate access
        this.grantInstantAccess();
        
        // Set up mobile-optimized interface
        this.setupMobileInterface();
        
        this.isActive = true;
    }

    clearAllLoginOverlays() {
        // Remove all possible login overlays
        const overlays = document.querySelectorAll('#mobile-login-overlay, .login-overlay, .auth-overlay');
        overlays.forEach(overlay => {
            overlay.style.display = 'none';
            overlay.remove();
        });
        
        // Clear any blocking elements
        const blockers = document.querySelectorAll('[style*="z-index: 10000"], [style*="position: fixed"]');
        blockers.forEach(blocker => {
            if (blocker.id === 'mobile-login-overlay' || blocker.className.includes('login')) {
                blocker.remove();
            }
        });
    }

    grantInstantAccess() {
        // Set authentication status immediately
        const accessData = {
            username: 'mobile-user',
            loginTime: Date.now(),
            expires: Date.now() + (24 * 60 * 60 * 1000),
            platform: 'mobile',
            accessLevel: 'full',
            authenticated: true
        };
        
        localStorage.setItem('nexus_mobile_auth', JSON.stringify(accessData));
        localStorage.setItem('instant_access_granted', 'true');
        
        // Set global authentication state
        window.isAuthenticated = true;
        window.userSession = accessData;
        
        console.log('[INSTANT-ACCESS] Full access granted immediately');
    }

    setupMobileInterface() {
        // Create simple access indicator
        const accessIndicator = document.createElement('div');
        accessIndicator.id = 'instant-access-indicator';
        accessIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 11px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        
        accessIndicator.innerHTML = `
            <span style="width: 6px; height: 6px; background: #fff; border-radius: 50%; display: inline-block;"></span>
            Connected
        `;
        
        document.body.appendChild(accessIndicator);
        
        // Make platform elements immediately accessible
        this.enablePlatformAccess();
    }

    enablePlatformAccess() {
        // Ensure all platform modules are accessible
        const moduleContainers = document.querySelectorAll('.module-view, #qnis-module, .sidebar-content');
        moduleContainers.forEach(container => {
            container.style.pointerEvents = 'auto';
            container.style.opacity = '1';
        });
        
        // Enable all interactive elements
        const interactiveElements = document.querySelectorAll('button, input, select, a, .clickable');
        interactiveElements.forEach(element => {
            element.style.pointerEvents = 'auto';
            element.disabled = false;
        });
        
        // Auto-navigate to QNIS map if on mobile
        if (this.isMobileDevice()) {
            setTimeout(() => {
                this.showQNISMap();
            }, 1000);
        }
    }

    showQNISMap() {
        // Find and activate QNIS module
        const qnisModule = document.querySelector('[data-module="qnis"], #qnis-module');
        if (qnisModule) {
            qnisModule.style.display = 'block';
            qnisModule.classList.add('active');
        }
        
        // Trigger QNIS map initialization
        if (window.initializeQNISMap) {
            window.initializeQNISMap();
        }
        
        // Show success notification
        this.showNotification('Platform Ready', 'QNIS map system loaded', 'success');
    }

    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // Public methods
    static initialize() {
        const instantAccess = new InstantAccessMobile();
        instantAccess.initializeInstantAccess();
        window.instantAccessMobile = instantAccess;
    }
}

// Auto-initialize immediately
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            InstantAccessMobile.initialize();
        });
    } else {
        InstantAccessMobile.initialize();
    }
    
    // Also initialize after a short delay to catch any delayed content
    setTimeout(() => {
        InstantAccessMobile.initialize();
    }, 2000);
}

// Global access function
window.enableInstantAccess = function() {
    InstantAccessMobile.initialize();
};

console.log('[INSTANT-ACCESS] Mobile access system loaded');