import { useState, useEffect } from 'react';

type ViewMode = 'mobile' | 'desktop';

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('dwc-view-mode');
    if (saved === 'desktop' || saved === 'mobile') return saved;
    
    // Auto-detect based on screen size
    return window.innerWidth >= 1024 ? 'desktop' : 'mobile';
  });

  const [isMobileDevice, setIsMobileDevice] = useState(() => 
    window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobileDevice(newIsMobile);
      
      // Auto-switch to mobile on small screens unless user explicitly chose desktop
      if (newIsMobile && localStorage.getItem('dwc-view-mode') !== 'desktop') {
        setViewMode('mobile');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === 'mobile' ? 'desktop' : 'mobile';
    setViewMode(newMode);
    localStorage.setItem('dwc-view-mode', newMode);
  };

  const forceDesktop = () => {
    setViewMode('desktop');
    localStorage.setItem('dwc-view-mode', 'desktop');
  };

  const forceMobile = () => {
    setViewMode('mobile');
    localStorage.setItem('dwc-view-mode', 'mobile');
  };

  return {
    viewMode,
    isMobileDevice,
    isDesktopMode: viewMode === 'desktop',
    isMobileMode: viewMode === 'mobile',
    toggleViewMode,
    forceDesktop,
    forceMobile
  };
}