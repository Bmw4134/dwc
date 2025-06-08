import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToServer?: boolean;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    context: string = 'Unknown',
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      reportToServer = true
    } = options;

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log to console for debugging
    if (logToConsole) {
      console.error(`[${context}] Error:`, error);
    }

    // Show user-friendly toast notification
    if (showToast) {
      toast({
        title: "System Error",
        description: `An error occurred in ${context}. Please try again.`,
        variant: "destructive",
      });
    }

    // Report to server for monitoring
    if (reportToServer) {
      try {
        fetch('/api/admin/error-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: {
              message: errorMessage,
              stack: errorStack,
              context
            },
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          })
        }).catch(() => {
          // Silently fail if error reporting is unavailable
        });
      } catch {
        // Prevent error handler from crashing
      }
    }
  }, [toast]);

  const handleAsyncError = useCallback((
    asyncOperation: () => Promise<any>,
    context: string = 'Async Operation',
    options: ErrorHandlerOptions = {}
  ) => {
    return asyncOperation().catch((error) => {
      handleError(error, context, options);
      throw error; // Re-throw to allow caller to handle
    });
  }, [handleError]);

  return { handleError, handleAsyncError };
}

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent default browser behavior
    event.preventDefault();
    
    // Report to server
    fetch('/api/admin/error-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          context: 'Unhandled Promise Rejection'
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(() => {
      // Silently fail if error reporting is unavailable
    });
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Report to server
    fetch('/api/admin/error-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          message: event.message,
          stack: event.error?.stack,
          context: 'Global Error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(() => {
      // Silently fail if error reporting is unavailable
    });
  });
};