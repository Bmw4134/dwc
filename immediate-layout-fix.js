// Immediate Layout Fix - Simple and Direct
(function() {
    'use strict';
    
    console.log('[IMMEDIATE-FIX] Starting immediate layout fix...');
    
    // Wait for DOM
    function applyFix() {
        // Fix sidebar positioning
        const sidebar = document.getElementById('nexus-sidebar') || document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.position = 'fixed';
            sidebar.style.left = '0';
            sidebar.style.top = '0';
            sidebar.style.width = '250px';
            sidebar.style.height = '100vh';
            sidebar.style.zIndex = '1000';
            sidebar.style.backgroundColor = '#1a1a2e';
        }
        
        // Fix main content
        const mainContent = document.getElementById('main-content') || document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = '250px';
            mainContent.style.width = 'calc(100% - 250px)';
            mainContent.style.position = 'relative';
            mainContent.style.zIndex = '1';
            mainContent.style.minHeight = '100vh';
            mainContent.style.padding = '20px';
        }
        
        // Fix any overlapping modules
        const modules = document.querySelectorAll('.dashboard-module, .module-container, #qnis-map-container');
        modules.forEach(module => {
            module.style.position = 'relative';
            module.style.zIndex = '1';
            module.style.maxWidth = '100%';
        });
        
        // Create debug button
        createDebugButton();
        
        console.log('[IMMEDIATE-FIX] Layout fixed');
    }
    
    function createDebugButton() {
        // Remove existing button
        const existing = document.getElementById('debug-btn');
        if (existing) existing.remove();
        
        const btn = document.createElement('button');
        btn.id = 'debug-btn';
        btn.textContent = '🧠 Rerun Layout IQ';
        btn.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 1003;
            background: #9b59b6;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        btn.onclick = function() {
            console.log('[DEBUG] Running layout analysis...');
            
            // Quick analysis
            const sidebar = document.getElementById('nexus-sidebar') || document.querySelector('.sidebar');
            const mainContent = document.getElementById('main-content') || document.querySelector('.main-content');
            
            const analysis = {
                sidebar: sidebar ? {
                    width: sidebar.offsetWidth,
                    left: sidebar.getBoundingClientRect().left,
                    zIndex: getComputedStyle(sidebar).zIndex
                } : 'Not found',
                mainContent: mainContent ? {
                    left: mainContent.getBoundingClientRect().left,
                    marginLeft: getComputedStyle(mainContent).marginLeft,
                    width: mainContent.offsetWidth
                } : 'Not found',
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
            
            console.log('[DEBUG] Layout analysis:', analysis);
            alert('Layout analysis complete - check console for details');
            
            // Reapply fixes
            applyFix();
        };
        
        document.body.appendChild(btn);
    }
    
    // Apply fix when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFix);
    } else {
        applyFix();
    }
    
    // Monitor for changes
    const observer = new MutationObserver(function(mutations) {
        let needsFix = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const added = Array.from(mutation.addedNodes);
                if (added.some(node => node.nodeType === 1 && 
                    (node.id === 'nexus-sidebar' || node.className && node.className.includes('sidebar')))) {
                    needsFix = true;
                }
            }
        });
        if (needsFix) {
            setTimeout(applyFix, 100);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
})();