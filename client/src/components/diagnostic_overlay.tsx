import { useState, useEffect } from "react";

export default function DiagnosticOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [diagnostics, setDiagnostics] = useState({
    reactLoaded: false,
    apiConnected: false,
    routingActive: false,
    systemHealth: 0,
  });

  useEffect(() => {
    // Quick diagnostic check
    setDiagnostics(prev => ({ ...prev, reactLoaded: true, routingActive: true }));
    
    // Test API connectivity
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setDiagnostics(prev => ({ ...prev, apiConnected: true })))
      .catch(() => setDiagnostics(prev => ({ ...prev, apiConnected: false })));

    // Listen for diagnostic toggle
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 text-xs max-w-xs">
      <div className="mb-2 font-bold">DWC Systems Diagnostics</div>
      <div className={`mb-1 ${diagnostics.reactLoaded ? 'text-green-400' : 'text-red-400'}`}>
        React: {diagnostics.reactLoaded ? 'LOADED' : 'FAILED'}
      </div>
      <div className={`mb-1 ${diagnostics.apiConnected ? 'text-green-400' : 'text-red-400'}`}>
        API: {diagnostics.apiConnected ? 'CONNECTED' : 'DISCONNECTED'}
      </div>
      <div className={`mb-1 ${diagnostics.routingActive ? 'text-green-400' : 'text-red-400'}`}>
        Routing: {diagnostics.routingActive ? 'ACTIVE' : 'INACTIVE'}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}