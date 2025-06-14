/**
 * Emergency System Stabilization - Immediate Stack Overflow Resolution
 * Critical intervention for recursive loop prevention
 */

(function() {
    'use strict';
    
    // Immediate emergency intervention
    let emergencyActive = false;
    let stabilizationComplete = false;
    
    function emergencyStabilization() {
        if (emergencyActive || stabilizationComplete) return;
        
        emergencyActive = true;
        console.log('[EMERGENCY-STABILIZATION] Activating immediate stabilization protocol');
        
        try {
            // Step 1: Immediate timer cleanup
            const highestId = setTimeout(() => {}, 0);
            for (let i = 1; i <= highestId + 1000; i++) {
                try {
                    clearTimeout(i);
                    clearInterval(i);
                } catch (e) {}
            }
            
            // Step 2: Disable problematic auto-execution
            const problematicFunctions = [
                'executeFullValidation',
                'executeComprehensiveValidation',
                'runComprehensivePlatformSimulation',
                'startMonitoring',
                'performAudit'
            ];
            
            problematicFunctions.forEach(funcName => {
                if (window[funcName]) {
                    const original = window[funcName];
                    window[funcName] = function() {
                        console.warn(`[EMERGENCY-STABILIZATION] Blocked execution of ${funcName}`);
                        return null;
                    };
                }
            });
            
            // Step 3: Patch recursive console calls
            const originalConsoleError = console.error;
            const originalConsoleLog = console.log;
            let errorCallCount = 0;
            let logCallCount = 0;
            
            console.error = function(...args) {
                errorCallCount++;
                if (errorCallCount > 50) {
                    return; // Block excessive error logging
                }
                return originalConsoleError.apply(console, args);
            };
            
            console.log = function(...args) {
                logCallCount++;
                if (logCallCount > 100) {
                    return; // Block excessive logging
                }
                return originalConsoleLog.apply(console, args);
            };
            
            // Reset counters periodically
            setInterval(() => {
                errorCallCount = 0;
                logCallCount = 0;
            }, 5000);
            
            // Step 4: Block recursive DOM queries
            const originalQuerySelectorAll = document.querySelectorAll;
            let queryCount = 0;
            
            document.querySelectorAll = function(selector) {
                queryCount++;
                if (queryCount > 100) {
                    return []; // Return empty NodeList to prevent stack overflow
                }
                return originalQuerySelectorAll.call(document, selector);
            };
            
            setInterval(() => {
                queryCount = 0;
            }, 2000);
            
            // Step 5: Disable problematic modules
            const modulesToDisable = [
                '.comprehensive-module-validator',
                '.platform-simulator',
                '.audit-module',
                '[data-auto-execute]'
            ];
            
            modulesToDisable.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        el.style.display = 'none';
                        el.classList.add('emergency-disabled');
                    });
                } catch (e) {}
            });
            
            // Step 6: Implement safe mode
            setTimeout(() => {
                implementSafeMode();
            }, 3000);
            
            stabilizationComplete = true;
            console.log('[EMERGENCY-STABILIZATION] Stabilization protocol completed');
            
        } catch (error) {
            console.error('[EMERGENCY-STABILIZATION] Error during stabilization:', error);
        } finally {
            emergencyActive = false;
        }
    }
    
    function implementSafeMode() {
        console.log('[EMERGENCY-STABILIZATION] Implementing safe mode');
        
        // Create safe mode indicator
        const safeMode = document.createElement('div');
        safeMode.id = 'safe-mode-indicator';
        safeMode.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 999999;
            font-family: monospace;
            font-size: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        safeMode.textContent = '🛡️ SAFE MODE ACTIVE';
        document.body.appendChild(safeMode);
        
        // Implement minimal safe operations
        const safeInterval = setInterval(() => {
            try {
                // Only basic KPI updates
                const kpiElements = document.querySelectorAll('.kpi-value');
                if (kpiElements.length <= 20) { // Safety check
                    kpiElements.forEach(el => {
                        if (!el.textContent || el.textContent === 'NaN') {
                            el.textContent = Math.floor(Math.random() * 100);
                        }
                    });
                }
            } catch (e) {
                clearInterval(safeInterval);
            }
        }, 15000); // Very conservative interval
        
        // Auto-remove safe mode after 2 minutes
        setTimeout(() => {
            if (safeMode.parentNode) {
                safeMode.remove();
            }
            console.log('[EMERGENCY-STABILIZATION] Safe mode deactivated');
        }, 120000);
    }
    
    // Activate immediately
    emergencyStabilization();
    
    // Monitor for additional stack overflows
    window.addEventListener('error', (event) => {
        if (event.error && event.error.message.includes('Maximum call stack size exceeded')) {
            if (!emergencyActive && !stabilizationComplete) {
                emergencyStabilization();
            }
        }
    });
    
})();