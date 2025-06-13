/**
 * Authentication Bypass for Development
 * Prevents redirect loops and enables dashboard access
 */

// Set authentication flag immediately
localStorage.setItem('nexus_authenticated', 'true');
localStorage.setItem('user_session', JSON.stringify({
    authenticated: true,
    user: 'Developer',
    role: 'admin',
    timestamp: Date.now()
}));

// Disable production mode globally
window.PRODUCTION_MODE = false;
window.DEVELOPMENT_MODE = true;
window.DISABLE_AUTH_REDIRECT = true;

console.log('[AUTH-BYPASS] Authentication bypassed for development mode');
console.log('[AUTH-BYPASS] Dashboard access enabled');