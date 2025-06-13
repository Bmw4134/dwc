// Disable all redirect systems immediately
(function() {
    // Override window.location methods
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;
    const originalReload = window.location.reload;
    
    window.location.assign = function(url) {
        console.log('[REDIRECT-BLOCK] Blocked redirect to:', url);
        return false;
    };
    
    window.location.replace = function(url) {
        console.log('[REDIRECT-BLOCK] Blocked replace to:', url);
        return false;
    };
    
    window.location.reload = function() {
        console.log('[REDIRECT-BLOCK] Blocked page reload');
        return false;
    };
    
    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(state, title, url) {
        if (url && url.includes('/')) {
            console.log('[REDIRECT-BLOCK] Blocked history pushState to:', url);
            return false;
        }
        return originalPushState.apply(history, arguments);
    };
    
    history.replaceState = function(state, title, url) {
        if (url && url.includes('/')) {
            console.log('[REDIRECT-BLOCK] Blocked history replaceState to:', url);
            return false;
        }
        return originalReplaceState.apply(history, arguments);
    };
    
    // Disable any setTimeout redirects
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        if (typeof fn === 'string' && fn.includes('location')) {
            console.log('[REDIRECT-BLOCK] Blocked setTimeout redirect');
            return;
        }
        if (typeof fn === 'function') {
            const fnString = fn.toString();
            if (fnString.includes('location') || fnString.includes('redirect') || fnString.includes('href')) {
                console.log('[REDIRECT-BLOCK] Blocked setTimeout function redirect');
                return;
            }
        }
        return originalSetTimeout.apply(window, arguments);
    };
    
    // Disable any interval redirects
    const originalSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        if (typeof fn === 'string' && fn.includes('location')) {
            console.log('[REDIRECT-BLOCK] Blocked setInterval redirect');
            return;
        }
        if (typeof fn === 'function') {
            const fnString = fn.toString();
            if (fnString.includes('location') || fnString.includes('redirect') || fnString.includes('href')) {
                console.log('[REDIRECT-BLOCK] Blocked setInterval function redirect');
                return;
            }
        }
        return originalSetInterval.apply(window, arguments);
    };
    
    console.log('[REDIRECT-BLOCK] All redirect systems disabled');
})();