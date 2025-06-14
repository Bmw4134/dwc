/**
 * Stack Monitor - Runtime detection of stacking and runaway loops
 * Prevents module duplication and recursive overflow issues
 */

class StackMonitor {
    constructor() {
        this.maxDepth = 15;
        this.maxCallFrequency = 10; // Max calls per second per function
        this.callStacks = new Map();
        this.callFrequency = new Map();
        this.alertThreshold = 3;
        this.isMonitoring = false;
        this.detectionLog = [];
        
        this.startMonitoring();
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('[STACK-MONITOR] Runtime monitoring active');
        
        // Monitor global function calls
        this.patchConsole();
        this.patchSetInterval();
        this.patchSetTimeout();
        this.patchEventListeners();
        
        // Periodic cleanup
        setInterval(() => this.cleanup(), 30000);
    }

    patchConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const self = this;
        
        console.log = function(...args) {
            self.trackCall('console.log', args);
            return originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
            self.trackCall('console.error', args);
            return originalError.apply(console, args);
        };
    }

    patchSetInterval() {
        const originalSetInterval = window.setInterval;
        const self = this;
        
        window.setInterval = function(callback, delay, ...args) {
            const stackTrace = self.getStackTrace();
            const callId = self.generateCallId('setInterval', stackTrace);
            
            if (self.isStackOverflow(callId)) {
                console.error('[STACK-MONITOR] Interval stacking detected, blocking call');
                return null;
            }
            
            self.trackCall(callId);
            return originalSetInterval.call(window, callback, delay, ...args);
        };
    }

    patchSetTimeout() {
        const originalSetTimeout = window.setTimeout;
        const self = this;
        
        window.setTimeout = function(callback, delay, ...args) {
            const stackTrace = self.getStackTrace();
            const callId = self.generateCallId('setTimeout', stackTrace);
            
            if (self.isStackOverflow(callId)) {
                console.error('[STACK-MONITOR] Timeout stacking detected, blocking call');
                return null;
            }
            
            self.trackCall(callId);
            return originalSetTimeout.call(window, callback, delay, ...args);
        };
    }

    patchEventListeners() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const self = this;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const stackTrace = self.getStackTrace();
            const callId = self.generateCallId(`addEventListener:${type}`, stackTrace);
            
            if (self.isStackOverflow(callId)) {
                console.error('[STACK-MONITOR] Event listener stacking detected, blocking call');
                return;
            }
            
            self.trackCall(callId);
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    trackCall(functionName, args = []) {
        const now = Date.now();
        const callId = typeof functionName === 'string' ? functionName : functionName.toString();
        
        // Track call frequency
        if (!this.callFrequency.has(callId)) {
            this.callFrequency.set(callId, []);
        }
        
        const calls = this.callFrequency.get(callId);
        calls.push(now);
        
        // Keep only calls from last second
        const oneSecondAgo = now - 1000;
        this.callFrequency.set(callId, calls.filter(time => time > oneSecondAgo));
        
        // Check for high frequency (potential runaway)
        if (calls.length > this.maxCallFrequency) {
            this.reportRunawayLoop(callId, calls.length);
        }
        
        // Track stack depth
        const stackTrace = this.getStackTrace();
        this.updateStackDepth(callId, stackTrace);
    }

    updateStackDepth(callId, stackTrace) {
        if (!this.callStacks.has(callId)) {
            this.callStacks.set(callId, { depth: 0, traces: [] });
        }
        
        const stackInfo = this.callStacks.get(callId);
        stackInfo.depth = stackTrace.length;
        stackInfo.traces.push({
            timestamp: Date.now(),
            trace: stackTrace.slice(0, 5) // Keep only top 5 frames
        });
        
        // Keep only recent traces
        const fiveMinutesAgo = Date.now() - 300000;
        stackInfo.traces = stackInfo.traces.filter(t => t.timestamp > fiveMinutesAgo);
        
        if (stackInfo.depth > this.maxDepth) {
            this.reportStackOverflow(callId, stackInfo.depth);
        }
    }

    isStackOverflow(callId) {
        const stackInfo = this.callStacks.get(callId);
        return stackInfo && stackInfo.depth > this.maxDepth;
    }

    reportStackOverflow(callId, depth) {
        const alert = {
            type: 'STACK_OVERFLOW',
            function: callId,
            depth: depth,
            timestamp: Date.now(),
            severity: 'HIGH'
        };
        
        this.detectionLog.push(alert);
        console.error(`[STACK-MONITOR] Stack overflow detected: ${callId} (depth: ${depth})`);
        
        // Try to recover
        this.attemptRecovery(callId);
    }

    reportRunawayLoop(callId, frequency) {
        const alert = {
            type: 'RUNAWAY_LOOP',
            function: callId,
            frequency: frequency,
            timestamp: Date.now(),
            severity: frequency > 50 ? 'CRITICAL' : 'HIGH'
        };
        
        this.detectionLog.push(alert);
        console.error(`[STACK-MONITOR] Runaway loop detected: ${callId} (${frequency} calls/sec)`);
        
        // Emergency throttling
        this.emergencyThrottle(callId);
    }

    attemptRecovery(callId) {
        // Clear problematic intervals/timeouts
        if (callId.includes('setInterval') || callId.includes('setTimeout')) {
            // Emergency clear - this is aggressive but necessary
            const highestId = setTimeout(() => {}, 0);
            for (let i = 0; i < highestId; i++) {
                clearTimeout(i);
                clearInterval(i);
            }
            console.log('[STACK-MONITOR] Emergency timer cleanup performed');
        }
        
        // Reset call tracking for this function
        this.callStacks.delete(callId);
        this.callFrequency.delete(callId);
    }

    emergencyThrottle(callId) {
        // Implement emergency throttling by delaying subsequent calls
        const throttleKey = `throttle_${callId}`;
        window[throttleKey] = true;
        
        setTimeout(() => {
            delete window[throttleKey];
            console.log(`[STACK-MONITOR] Throttle lifted for ${callId}`);
        }, 5000);
    }

    getStackTrace() {
        try {
            throw new Error();
        } catch (e) {
            return e.stack ? e.stack.split('\n').slice(1) : [];
        }
    }

    generateCallId(functionName, stackTrace) {
        // Create unique ID based on function name and call location
        const topFrame = stackTrace[1] || 'unknown';
        const location = topFrame.match(/at\s+(.+?)\s+\((.+?)\)/);
        const caller = location ? location[1] : 'anonymous';
        
        return `${functionName}@${caller}`;
    }

    // Public API
    getDetectionReport() {
        return {
            alerts: [...this.detectionLog],
            activeStacks: this.callStacks.size,
            monitoredFunctions: this.callFrequency.size,
            isHealthy: this.detectionLog.filter(alert => 
                Date.now() - alert.timestamp < 60000
            ).length === 0
        };
    }

    getStackStatistics() {
        const stats = {
            totalStacks: this.callStacks.size,
            maxDepth: 0,
            averageDepth: 0,
            problematicFunctions: []
        };
        
        let totalDepth = 0;
        
        for (const [callId, stackInfo] of this.callStacks.entries()) {
            stats.maxDepth = Math.max(stats.maxDepth, stackInfo.depth);
            totalDepth += stackInfo.depth;
            
            if (stackInfo.depth > this.alertThreshold) {
                stats.problematicFunctions.push({
                    function: callId,
                    depth: stackInfo.depth,
                    recentCalls: stackInfo.traces.length
                });
            }
        }
        
        stats.averageDepth = this.callStacks.size > 0 ? totalDepth / this.callStacks.size : 0;
        
        return stats;
    }

    cleanup() {
        const now = Date.now();
        const fiveMinutesAgo = now - 300000;
        
        // Clean old detection logs
        this.detectionLog = this.detectionLog.filter(alert => 
            alert.timestamp > fiveMinutesAgo
        );
        
        // Clean old call frequency data
        for (const [callId, calls] of this.callFrequency.entries()) {
            const recentCalls = calls.filter(time => time > fiveMinutesAgo);
            if (recentCalls.length === 0) {
                this.callFrequency.delete(callId);
            } else {
                this.callFrequency.set(callId, recentCalls);
            }
        }
        
        // Clean old stack traces
        for (const [callId, stackInfo] of this.callStacks.entries()) {
            stackInfo.traces = stackInfo.traces.filter(t => t.timestamp > fiveMinutesAgo);
            
            if (stackInfo.traces.length === 0) {
                this.callStacks.delete(callId);
            }
        }
    }

    // Emergency methods
    emergencyReset() {
        console.warn('[STACK-MONITOR] Emergency reset initiated');
        
        this.callStacks.clear();
        this.callFrequency.clear();
        this.detectionLog = [];
        
        // Clear all timers
        const highestId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestId; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
        
        console.log('[STACK-MONITOR] Emergency reset complete');
    }

    setMaxDepth(depth) {
        this.maxDepth = Math.max(1, Math.min(50, depth));
        console.log(`[STACK-MONITOR] Max depth set to ${this.maxDepth}`);
    }

    setMaxFrequency(frequency) {
        this.maxCallFrequency = Math.max(1, Math.min(100, frequency));
        console.log(`[STACK-MONITOR] Max frequency set to ${this.maxCallFrequency}`);
    }
}

// Recursive depth guard utility
function withDepthGuard(fn, maxDepth = 10, name = 'anonymous') {
    let currentDepth = 0;
    
    return function(...args) {
        if (currentDepth >= maxDepth) {
            console.error(`[DEPTH-GUARD] Maximum recursion depth (${maxDepth}) exceeded for ${name}`);
            return null;
        }
        
        currentDepth++;
        try {
            return fn.apply(this, args);
        } finally {
            currentDepth--;
        }
    };
}

// Anti-stacking decorator
function preventStacking(fn, name = 'anonymous') {
    let isRunning = false;
    
    return function(...args) {
        if (isRunning) {
            console.warn(`[ANTI-STACK] Prevented stacking call to ${name}`);
            return null;
        }
        
        isRunning = true;
        try {
            return fn.apply(this, args);
        } finally {
            isRunning = false;
        }
    };
}

// Initialize global stack monitor
if (typeof window !== 'undefined') {
    window.stackMonitor = new StackMonitor();
    
    // Add global utilities
    window.withDepthGuard = withDepthGuard;
    window.preventStacking = preventStacking;
    
    // Add to diagnostic panel if available
    setTimeout(() => {
        if (window.moduleRegistry) {
            console.log('[STACK-MONITOR] Integrated with module registry');
        }
    }, 1000);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StackMonitor, withDepthGuard, preventStacking };
}