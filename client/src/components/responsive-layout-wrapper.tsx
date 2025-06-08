import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Maximize, 
  Minimize, 
  Smartphone, 
  Tablet, 
  Monitor,
  Laptop
} from 'lucide-react';
import UnifiedNavigation from './unified-navigation';
import FloatingAdminControl from './floating-admin-control';

interface ResponsiveLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ResponsiveLayoutWrapper({ children }: ResponsiveLayoutWrapperProps) {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop' | 'fullscreen'>('fullscreen');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect actual screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768 && viewport === 'fullscreen') {
        setViewport('mobile');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [viewport]);

  // Fullscreen API integration
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setViewport('fullscreen');
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const handleViewportChange = (newViewport: 'mobile' | 'tablet' | 'desktop' | 'fullscreen') => {
    setViewport(newViewport);
    
    if (newViewport === 'fullscreen') {
      toggleFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const getViewportStyles = () => {
    if (isFullscreen || viewport === 'fullscreen') {
      return {
        width: '100vw',
        height: '100vh',
        margin: '0',
        padding: '0'
      };
    }

    switch (viewport) {
      case 'mobile':
        return {
          width: '375px',
          height: '812px',
          margin: '20px auto',
          borderRadius: '24px',
          border: '8px solid #1f2937',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '1024px',
          margin: '20px auto',
          borderRadius: '16px',
          border: '4px solid #374151',
          boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
        };
      case 'desktop':
        return {
          width: '1200px',
          height: '800px',
          margin: '20px auto',
          borderRadius: '8px',
          border: '2px solid #4b5563',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        };
      default:
        return {
          width: '100%',
          height: '100vh'
        };
    }
  };

  const getContentPadding = () => {
    if (isMobile) return 'pl-0';
    if (navCollapsed) return 'pl-16';
    return 'pl-80';
  };

  const showDeviceFrame = viewport !== 'fullscreen' && !isFullscreen;
  const showNavigation = viewport === 'fullscreen' || isFullscreen || !showDeviceFrame;

  return (
    <div className={`min-h-screen ${isFullscreen ? 'bg-black' : 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'}`}>
      {/* Fullscreen Toggle Button - Only visible when not in device preview mode */}
      {!showDeviceFrame && (
        <Button
          onClick={toggleFullscreen}
          className="fixed top-4 right-20 z-40 bg-black/80 backdrop-blur-sm border border-blue-500/30 text-white"
          size="sm"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      )}

      {/* Device Frame Container */}
      <div 
        ref={containerRef}
        style={getViewportStyles()}
        className={`
          relative overflow-hidden transition-all duration-500 ease-in-out
          ${showDeviceFrame ? 'bg-black' : 'bg-transparent'}
          ${viewport === 'mobile' ? 'shadow-2xl' : ''}
        `}
      >
        {/* Unified Navigation */}
        {showNavigation && (
          <UnifiedNavigation 
            isMobile={isMobile} 
            isCollapsed={navCollapsed && !isMobile}
          />
        )}

        {/* Main Content Area */}
        <div className={`
          h-full overflow-y-auto transition-all duration-300
          ${showNavigation ? getContentPadding() : ''}
          ${showDeviceFrame ? 'rounded-lg' : ''}
        `}>
          {/* Device Status Bar - Mobile Only */}
          {viewport === 'mobile' && showDeviceFrame && (
            <div className="h-6 bg-black flex items-center justify-between px-4 text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
          )}

          {/* App Content */}
          <div className={`
            ${viewport === 'mobile' && showDeviceFrame ? 'h-[calc(100%-24px)]' : 'h-full'}
            ${showDeviceFrame ? 'overflow-hidden' : ''}
          `}>
            {children}
          </div>
        </div>

        {/* Device Controls Overlay - Only in preview mode */}
        {showDeviceFrame && (
          <div className="absolute top-4 left-4 z-30">
            <Card className="bg-black/90 backdrop-blur-sm border-gray-600/30 p-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewport === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewport('mobile')}
                  className="p-2"
                >
                  <Smartphone className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewport === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewport('tablet')}
                  className="p-2"
                >
                  <Tablet className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewport === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewport('desktop')}
                  className="p-2"
                >
                  <Laptop className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewportChange('fullscreen')}
                  className="p-2"
                >
                  <Monitor className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Admin Control */}
      <FloatingAdminControl
        onViewportChange={handleViewportChange}
        onDevModeToggle={setDevMode}
        currentViewport={viewport}
      />

      {/* Development Overlay */}
      {devMode && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 z-50 animate-pulse"></div>
      )}
    </div>
  );
}