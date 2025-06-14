import React, { useState, useEffect, memo } from 'react';
import { moduleRegistry } from './ModuleRegistry';
import AuditModule from './modules/AuditModule';
import MetricsRepairModule from './modules/MetricsRepairModule';

// Import all diagnostic modules
const MODULE_COMPONENTS = {
  'audit': AuditModule,
  'metrics-repair': MetricsRepairModule,
  'compliance-enforcer': React.lazy(() => import('./modules/ComplianceEnforcerModule')),
  'recursive-kpi': React.lazy(() => import('./modules/RecursiveKPIValidator')),
  'rop-sec-v2': React.lazy(() => import('./modules/ROPSecV2Integration'))
};

interface ModuleRendererProps {
  className?: string;
}

const ModuleRenderer = memo(function ModuleRenderer({ className = '' }: ModuleRendererProps) {
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [moduleStats, setModuleStats] = useState({ active: 0, timers: 0, intervals: 0 });
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Register all modules
    Object.entries(MODULE_COMPONENTS).forEach(([id, component]) => {
      moduleRegistry.registerModule(id, id, component);
    });

    // Update active modules every second
    const updateInterval = setInterval(() => {
      const active = moduleRegistry.getAllActiveModules().map(m => m.id);
      setActiveModules(active);
      setModuleStats(moduleRegistry.getModuleStats());
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  const launchModule = (moduleId: string) => {
    const props = {
      moduleId,
      status: 'running' as const,
      logs,
      compliance: 95,
      onStatusChange: (status: any) => {
        console.log(`Module ${moduleId} status: ${status}`);
      },
      onLogAdd: (log: string) => {
        setLogs(prev => [...prev.slice(-20), log]);
      }
    };

    if (moduleRegistry.launchModule(moduleId, props)) {
      console.log(`[MODULE-RENDERER] Launched ${moduleId}`);
    }
  };

  const unmountModule = (moduleId: string) => {
    if (moduleRegistry.unmountModule(moduleId)) {
      console.log(`[MODULE-RENDERER] Unmounted ${moduleId}`);
    }
  };

  const renderActiveModules = () => {
    return activeModules.map(moduleId => {
      const module = moduleRegistry.getActiveModule(moduleId);
      if (!module) return null;

      const Component = module.component;
      const props = {
        moduleId,
        status: module.status,
        logs,
        compliance: 95,
        onStatusChange: (status: any) => {
          moduleRegistry.updateModuleStatus(moduleId, status);
        },
        onLogAdd: (log: string) => {
          setLogs(prev => [...prev.slice(-20), log]);
        }
      };

      return (
        <React.Suspense 
          key={moduleId} 
          fallback={
            <div className="p-4 bg-gray-800 rounded animate-pulse">
              Loading {moduleId}...
            </div>
          }
        >
          <Component {...props} />
        </React.Suspense>
      );
    });
  };

  return (
    <div className={`module-renderer ${className}`}>
      {/* Control Panel */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Diagnostic Control Panel</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-400">Active: {moduleStats.active}</span>
            <span className="text-yellow-400">Timers: {moduleStats.timers}</span>
            <span className="text-blue-400">Intervals: {moduleStats.intervals}</span>
          </div>
        </div>

        {/* Module Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          {Object.keys(MODULE_COMPONENTS).map(moduleId => {
            const isActive = activeModules.includes(moduleId);
            return (
              <button
                key={moduleId}
                onClick={() => isActive ? unmountModule(moduleId) : launchModule(moduleId)}
                className={`px-3 py-2 text-xs rounded transition-colors ${
                  isActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isActive ? 'Stop' : 'Launch'} {moduleId}
              </button>
            );
          })}
        </div>

        {/* Emergency Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => moduleRegistry.emergencyCleanup()}
            className="px-3 py-1 text-xs bg-red-800 hover:bg-red-900 text-white rounded"
          >
            Emergency Cleanup
          </button>
          <button
            onClick={() => {
              const stacked = moduleRegistry.detectStack();
              if (stacked.length > 0) {
                console.warn('[STACK-DETECTION] Found stacked modules:', stacked);
              } else {
                console.log('[STACK-DETECTION] No stacking detected');
              }
            }}
            className="px-3 py-1 text-xs bg-yellow-800 hover:bg-yellow-900 text-white rounded"
          >
            Check Stack
          </button>
        </div>
      </div>

      {/* Active Modules */}
      <div className="space-y-4">
        {activeModules.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No active diagnostic modules. Launch a module to begin.
          </div>
        ) : (
          renderActiveModules()
        )}
      </div>

      {/* Global Logs */}
      {logs.length > 0 && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h4 className="text-sm font-bold text-white mb-2">System Logs</h4>
          <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono">
            {logs.slice(-10).map((log, index) => (
              <div key={index} className="text-gray-400">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// Stack Monitor Utility
export const stackMonitor = {
  maxDepth: 10,
  currentDepth: 0,
  callStack: [] as string[],
  
  enter(moduleId: string): boolean {
    if (this.currentDepth >= this.maxDepth) {
      console.error(`[STACK-MONITOR] Maximum depth exceeded for ${moduleId}`);
      return false;
    }
    
    this.callStack.push(moduleId);
    this.currentDepth++;
    return true;
  },
  
  exit(moduleId: string): void {
    const lastModule = this.callStack.pop();
    if (lastModule !== moduleId) {
      console.warn(`[STACK-MONITOR] Stack mismatch: expected ${moduleId}, got ${lastModule}`);
    }
    this.currentDepth = Math.max(0, this.currentDepth - 1);
  },
  
  getStack(): string[] {
    return [...this.callStack];
  },
  
  isStacked(moduleId: string): boolean {
    return this.callStack.filter(id => id === moduleId).length > 1;
  },
  
  reset(): void {
    this.callStack = [];
    this.currentDepth = 0;
  }
};

// Anti-stacking utilities
export const antiStackingUtils = {
  // Throttled function executor
  throttle<T extends (...args: any[]) => any>(
    fn: T, 
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  },

  // Debounced function executor
  debounce<T extends (...args: any[]) => any>(
    fn: T, 
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  // Safe recursive depth guard
  withDepthGuard<T>(
    fn: () => T, 
    maxDepth: number = 10
  ): () => T | null {
    let depth = 0;
    return () => {
      if (depth >= maxDepth) {
        console.error('[DEPTH-GUARD] Maximum recursion depth exceeded');
        return null;
      }
      depth++;
      try {
        return fn();
      } finally {
        depth--;
      }
    };
  }
};

export default ModuleRenderer;