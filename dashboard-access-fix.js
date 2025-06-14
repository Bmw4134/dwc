/**
 * Dashboard Access Fix - Prevents auto-recovery interference
 */
class DashboardAccessFix {
    constructor() {
        this.recoveryBlocked = false;
    }

    initializeDashboardAccess() {
        console.log('[DASHBOARD-FIX] Securing normal dashboard access');
        
        // Prevent any auto-recovery systems from launching
        this.blockAutoRecovery();
        
        // Ensure clean dashboard state
        this.ensureCleanDashboard();
        
        // Setup manual recovery trigger only
        this.setupManualRecoveryOnly();
    }

    blockAutoRecovery() {
        // Override any auto-recovery triggers
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            // Block recovery-related timeouts
            if (callback && callback.toString().includes('Recovery') || 
                callback && callback.toString().includes('recovery')) {
                console.log('[DASHBOARD-FIX] Blocked auto-recovery trigger');
                return null;
            }
            return originalSetTimeout.call(this, callback, delay, ...args);
        };
        
        this.recoveryBlocked = true;
        console.log('[DASHBOARD-FIX] Auto-recovery systems blocked');
    }

    ensureCleanDashboard() {
        // Remove any existing recovery overlays
        const existingOverlays = document.querySelectorAll('#nexus-recovery-overlay, [id*="recovery"], [class*="recovery"]');
        existingOverlays.forEach(overlay => {
            if (overlay.id === 'nexus-recovery-overlay') {
                overlay.remove();
                console.log('[DASHBOARD-FIX] Removed recovery overlay');
            }
        });
        
        // Ensure sidebar is visible and functional
        const sidebar = document.querySelector('.sidebar, #sidebar');
        if (sidebar) {
            sidebar.style.display = 'block';
            sidebar.style.visibility = 'visible';
        }
        
        // Ensure main content is accessible
        const mainContent = document.querySelector('.main-content, #main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.visibility = 'visible';
        }
    }

    setupManualRecoveryOnly() {
        // Create manual recovery button in admin section only
        const adminSection = document.querySelector('#admin-module, .admin-controls');
        if (adminSection) {
            const recoveryButton = document.createElement('button');
            recoveryButton.textContent = 'Manual System Recovery';
            recoveryButton.className = 'manual-recovery-btn';
            recoveryButton.style.cssText = `
                background: #ff4444;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin: 10px 0;
                font-weight: bold;
            `;
            
            recoveryButton.onclick = () => {
                if (confirm('Are you sure you want to run system recovery? This will rebuild all modules.')) {
                    if (window.startNEXUSRecovery) {
                        window.startNEXUSRecovery();
                    }
                }
            };
            
            adminSection.appendChild(recoveryButton);
            console.log('[DASHBOARD-FIX] Manual recovery button added to admin section');
        }
    }

    // Expose method to manually trigger recovery if needed
    static triggerManualRecovery() {
        if (window.startNEXUSRecovery && confirm('Run full system recovery?')) {
            window.startNEXUSRecovery();
        }
    }
}

// Initialize dashboard access protection immediately
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardFix = new DashboardAccessFix();
    window.dashboardFix.initializeDashboardAccess();
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // Wait for DOM
} else {
    window.dashboardFix = new DashboardAccessFix();
    window.dashboardFix.initializeDashboardAccess();
}

console.log('[DASHBOARD-FIX] Dashboard access protection loaded');