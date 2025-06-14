import React, { useEffect, useRef, useState, memo } from 'react';
import { moduleRegistry, type DiagnosticModule } from './ModuleRegistry';

export interface ModuleProps {
  moduleId: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  logs: string[];
  compliance: number;
  onStatusChange?: (status: DiagnosticModule['status']) => void;
  onLogAdd?: (log: string) => void;
}

export interface SafeModuleHook {
  addTimer: (callback: () => void, delay: number) => void;
  addInterval: (callback: () => void, interval: number) => void;
  updateStatus: (status: DiagnosticModule['status']) => void;
  addLog: (message: string) => void;
  canUpdate: () => boolean;
  markUpdated: () => void;
}

export function useSafeModule(moduleId: string, props: ModuleProps): SafeModuleHook {
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const updateCountRef = useRef(0);
  const lastUpdateRef = useRef(0);

  const addTimer = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.error(`[MODULE-${moduleId}] Timer error:`, error);
      }
      timersRef.current.delete(timer);
      moduleRegistry.removeTimer(moduleId, timer);
    }, delay);
    
    timersRef.current.add(timer);
    moduleRegistry.addTimer(moduleId, timer);
  };

  const addInterval = (callback: () => void, interval: number) => {
    const intervalId = setInterval(() => {
      try {
        if (moduleRegistry.canUpdate(moduleId)) {
          callback();
          moduleRegistry.markUpdated(moduleId);
        }
      } catch (error) {
        console.error(`[MODULE-${moduleId}] Interval error:`, error);
      }
    }, interval);
    
    intervalsRef.current.add(intervalId);
    moduleRegistry.addInterval(moduleId, intervalId);
  };

  const updateStatus = (status: DiagnosticModule['status']) => {
    moduleRegistry.updateModuleStatus(moduleId, status);
    props.onStatusChange?.(status);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(`[MODULE-${moduleId}] ${logMessage}`);
    props.onLogAdd?.(logMessage);
  };

  const canUpdate = () => moduleRegistry.canUpdate(moduleId);
  const markUpdated = () => moduleRegistry.markUpdated(moduleId);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timers
      timersRef.current.forEach(timer => {
        clearTimeout(timer);
        moduleRegistry.removeTimer(moduleId, timer);
      });
      
      // Clear all intervals
      intervalsRef.current.forEach(interval => {
        clearInterval(interval);
        moduleRegistry.removeInterval(moduleId, interval);
      });
      
      timersRef.current.clear();
      intervalsRef.current.clear();
      
      console.log(`[MODULE-${moduleId}] Cleaned up all timers and intervals`);
    };
  }, [moduleId]);

  return {
    addTimer,
    addInterval,
    updateStatus,
    addLog,
    canUpdate,
    markUpdated
  };
}

export const ModuleBase = memo(function ModuleBase({ 
  children, 
  moduleId, 
  className = '',
  title 
}: {
  children: React.ReactNode;
  moduleId: string;
  className?: string;
  title?: string;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(moduleRegistry.isModuleActive(moduleId));
    
    const checkInterval = setInterval(() => {
      setIsActive(moduleRegistry.isModuleActive(moduleId));
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [moduleId]);

  if (!isActive) {
    return null;
  }

  return (
    <div 
      className={`diagnostic-module ${className}`}
      data-module-id={moduleId}
      style={{
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {title && (
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#60a5fa',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            marginRight: '8px',
            animation: 'pulse 2s infinite'
          }} />
          {title}
        </div>
      )}
      {children}
    </div>
  );
});