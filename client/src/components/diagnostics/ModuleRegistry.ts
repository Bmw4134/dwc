/**
 * Module Registry - Singleton pattern enforcement for diagnostic modules
 * Prevents stacking and memory leaks with proper lifecycle management
 */

export interface DiagnosticModule {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  component: React.ComponentType<any>;
  instance?: React.ReactElement;
  timers: Set<NodeJS.Timeout>;
  intervals: Set<NodeJS.Timeout>;
  cleanup?: () => void;
  lastUpdate: number;
  updateThrottle: number; // Min milliseconds between updates
}

class ModuleRegistry {
  private static instance: ModuleRegistry;
  private activeModules = new Map<string, DiagnosticModule>();
  private moduleComponents = new Map<string, React.ComponentType<any>>();
  private stackMonitor = new Set<string>();
  
  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  registerModule(id: string, name: string, component: React.ComponentType<any>) {
    this.moduleComponents.set(id, component);
    console.log(`[MODULE-REGISTRY] Registered module: ${name}`);
  }

  launchModule(moduleId: string, props: any = {}): boolean {
    // Prevent stacking - check if module already active
    if (this.activeModules.has(moduleId)) {
      console.warn(`[MODULE-REGISTRY] Module ${moduleId} already active, preventing stack`);
      return false;
    }

    // Stack detection
    if (this.stackMonitor.has(moduleId)) {
      console.error(`[MODULE-REGISTRY] Stack detected for module ${moduleId}, aborting`);
      return false;
    }

    this.stackMonitor.add(moduleId);
    
    const Component = this.moduleComponents.get(moduleId);
    if (!Component) {
      console.error(`[MODULE-REGISTRY] Module ${moduleId} not found`);
      this.stackMonitor.delete(moduleId);
      return false;
    }

    const module: DiagnosticModule = {
      id: moduleId,
      name: moduleId,
      status: 'idle',
      component: Component,
      timers: new Set(),
      intervals: new Set(),
      lastUpdate: 0,
      updateThrottle: 5000 // 5 seconds minimum between updates
    };

    this.activeModules.set(moduleId, module);
    this.stackMonitor.delete(moduleId);
    
    console.log(`[MODULE-REGISTRY] Launched module: ${moduleId}`);
    return true;
  }

  unmountModule(moduleId: string): boolean {
    const module = this.activeModules.get(moduleId);
    if (!module) {
      return false;
    }

    // Clear all timers and intervals
    module.timers.forEach(timer => clearTimeout(timer));
    module.intervals.forEach(interval => clearInterval(interval));
    
    // Call cleanup function if exists
    if (module.cleanup) {
      try {
        module.cleanup();
      } catch (error) {
        console.error(`[MODULE-REGISTRY] Cleanup error for ${moduleId}:`, error);
      }
    }

    this.activeModules.delete(moduleId);
    this.stackMonitor.delete(moduleId);
    
    console.log(`[MODULE-REGISTRY] Unmounted module: ${moduleId}`);
    return true;
  }

  getActiveModule(moduleId: string): DiagnosticModule | undefined {
    return this.activeModules.get(moduleId);
  }

  getAllActiveModules(): DiagnosticModule[] {
    return Array.from(this.activeModules.values());
  }

  isModuleActive(moduleId: string): boolean {
    return this.activeModules.has(moduleId);
  }

  addTimer(moduleId: string, timer: NodeJS.Timeout): void {
    const module = this.activeModules.get(moduleId);
    if (module) {
      module.timers.add(timer);
    }
  }

  addInterval(moduleId: string, interval: NodeJS.Timeout): void {
    const module = this.activeModules.get(moduleId);
    if (module) {
      module.intervals.add(interval);
    }
  }

  removeTimer(moduleId: string, timer: NodeJS.Timeout): void {
    const module = this.activeModules.get(moduleId);
    if (module) {
      module.timers.delete(timer);
    }
  }

  removeInterval(moduleId: string, interval: NodeJS.Timeout): void {
    const module = this.activeModules.get(moduleId);
    if (module) {
      module.intervals.delete(interval);
    }
  }

  updateModuleStatus(moduleId: string, status: DiagnosticModule['status']): void {
    const module = this.activeModules.get(moduleId);
    if (module) {
      module.status = status;
    }
  }

  canUpdate(moduleId: string): boolean {
    const module = this.activeModules.get(moduleId);
    if (!module) return false;
    
    const now = Date.now();
    return (now - module.lastUpdate) >= module.updateThrottle;
  }

  markUpdated(moduleId: string): void {
    const module = this.activeModules.get(moduleId);
    if (module) {
      module.lastUpdate = Date.now();
    }
  }

  emergencyCleanup(): void {
    console.warn('[MODULE-REGISTRY] Emergency cleanup initiated');
    
    for (const moduleId of this.activeModules.keys()) {
      this.unmountModule(moduleId);
    }
    
    this.stackMonitor.clear();
  }

  detectStack(): string[] {
    const stacked = [];
    
    for (const moduleId of this.activeModules.keys()) {
      if (this.stackMonitor.has(moduleId)) {
        stacked.push(moduleId);
      }
    }
    
    return stacked;
  }

  getModuleStats(): { active: number; timers: number; intervals: number } {
    let totalTimers = 0;
    let totalIntervals = 0;
    
    for (const module of this.activeModules.values()) {
      totalTimers += module.timers.size;
      totalIntervals += module.intervals.size;
    }
    
    return {
      active: this.activeModules.size,
      timers: totalTimers,
      intervals: totalIntervals
    };
  }
}

export const moduleRegistry = ModuleRegistry.getInstance();
export default moduleRegistry;