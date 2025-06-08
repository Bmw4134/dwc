import { useState, useEffect } from 'react';

interface AdaptiveDisplayReturn {
  displayMode: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMobileView: boolean;
  getResponsiveClasses: (mobileClass: string, tabletClass: string, desktopClass: string) => string;
}

export const useAdaptiveDisplay = (): AdaptiveDisplayReturn => {
  const [displayMode, setDisplayMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateDisplayMode = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDisplayMode('mobile');
      } else if (width < 1024) {
        setDisplayMode('tablet');
      } else {
        setDisplayMode('desktop');
      }
    };

    updateDisplayMode();
    window.addEventListener('resize', updateDisplayMode);
    
    return () => window.removeEventListener('resize', updateDisplayMode);
  }, []);

  const isMobile = displayMode === 'mobile';
  const isTablet = displayMode === 'tablet';
  const isDesktop = displayMode === 'desktop';
  const isMobileView = isMobile || isTablet;

  const getResponsiveClasses = (mobileClass: string, tabletClass: string, desktopClass: string) => {
    switch (displayMode) {
      case 'mobile':
        return mobileClass;
      case 'tablet':
        return tabletClass;
      case 'desktop':
        return desktopClass;
      default:
        return desktopClass;
    }
  };

  return {
    displayMode,
    isMobile,
    isTablet,
    isDesktop,
    isMobileView,
    getResponsiveClasses
  };
};

export default useAdaptiveDisplay;