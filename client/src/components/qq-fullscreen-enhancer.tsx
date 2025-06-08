import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize, 
  Minimize, 
  Smartphone, 
  Tablet, 
  Monitor,
  Settings,
  Zap
} from 'lucide-react';

interface DeviceProfile {
  type: 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  touchCapable: boolean;
}

interface QQScalingRules {
  baseScale: number;
  fontScale: number;
  componentScale: number;
  spacingScale: number;
  touchTargetScale: number;
  widgetScale: number;
}

export default function QQFullscreenEnhancer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile | null>(null);
  const [scalingRules, setScalingRules] = useState<QQScalingRules | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Detect device characteristics with QQ intelligence
  const detectDevice = useCallback((): DeviceProfile => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let type: DeviceProfile['type'] = 'desktop';
    if (width <= 768) type = 'mobile';
    else if (width <= 1024) type = 'tablet';
    else if (width >= 2560) type = 'ultrawide';

    const orientation = width > height ? 'landscape' : 'portrait';

    return {
      type,
      width,
      height,
      orientation,
      pixelRatio,
      touchCapable
    };
  }, []);

  // Generate QQ scaling rules based on device
  const generateScalingRules = useCallback((device: DeviceProfile): QQScalingRules => {
    let baseScale = 1;
    let fontScale = 1;
    let componentScale = 1;
    let spacingScale = 1;
    let touchTargetScale = 1;
    let widgetScale = 1;

    // QQ modeling logic for perfect scaling
    switch (device.type) {
      case 'mobile':
        baseScale = device.orientation === 'portrait' ? 0.85 : 0.8;
        fontScale = 0.9;
        componentScale = 0.85;
        spacingScale = 0.7;
        touchTargetScale = 1.2; // Larger touch targets
        widgetScale = 0.8;
        break;
      
      case 'tablet':
        baseScale = device.orientation === 'portrait' ? 0.95 : 1.0;
        fontScale = 1.0;
        componentScale = 0.95;
        spacingScale = 0.9;
        touchTargetScale = 1.1;
        widgetScale = 0.9;
        break;
      
      case 'desktop':
        baseScale = 1.0;
        fontScale = 1.0;
        componentScale = 1.0;
        spacingScale = 1.0;
        touchTargetScale = 1.0;
        widgetScale = 1.0;
        break;
      
      case 'ultrawide':
        baseScale = 1.1;
        fontScale = 1.05;
        componentScale = 1.1;
        spacingScale = 1.2;
        touchTargetScale = 1.0;
        widgetScale = 1.1;
        break;
    }

    // High DPI adjustments
    if (device.pixelRatio > 2) {
      fontScale *= 1.1;
      componentScale *= 1.05;
    }

    return {
      baseScale,
      fontScale,
      componentScale,
      spacingScale,
      touchTargetScale,
      widgetScale
    };
  }, []);

  // Apply QQ scaling to the entire platform
  const applyQQScaling = useCallback((rules: QQScalingRules, device: DeviceProfile) => {
    const root = document.documentElement;
    
    // Core scaling variables
    root.style.setProperty('--qq-base-scale', rules.baseScale.toString());
    root.style.setProperty('--qq-font-scale', rules.fontScale.toString());
    root.style.setProperty('--qq-component-scale', rules.componentScale.toString());
    root.style.setProperty('--qq-spacing-scale', rules.spacingScale.toString());
    root.style.setProperty('--qq-touch-scale', rules.touchTargetScale.toString());
    root.style.setProperty('--qq-widget-scale', rules.widgetScale.toString());

    // Device-specific optimizations
    root.style.setProperty('--qq-device-type', device.type);
    root.style.setProperty('--qq-orientation', device.orientation);
    root.style.setProperty('--qq-pixel-ratio', device.pixelRatio.toString());

    // Apply scaling to all major elements
    const scalableElements = [
      '.card', '.button', '.input', '.floating-widget', 
      '.sidebar', '.header', '.navigation', '.modal',
      '[class*="card"]', '[class*="button"]', '[class*="floating"]'
    ];

    scalableElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.transform = `scale(${rules.componentScale})`;
          element.style.transformOrigin = 'top left';
          element.style.transition = 'transform 0.3s ease-in-out';
        }
      });
    });

    // Scale floating widgets specifically
    const floatingWidgets = document.querySelectorAll('[class*="floating"], [class*="widget"]');
    floatingWidgets.forEach(widget => {
      if (widget instanceof HTMLElement) {
        widget.style.transform = `scale(${rules.widgetScale})`;
        widget.style.transformOrigin = 'center center';
      }
    });

    // Adjust touch targets for mobile
    if (device.touchCapable) {
      const touchElements = document.querySelectorAll('button, a, input, [role="button"]');
      touchElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.minHeight = `${44 * rules.touchTargetScale}px`;
          element.style.minWidth = `${44 * rules.touchTargetScale}px`;
          element.style.padding = `${12 * rules.spacingScale}px ${16 * rules.spacingScale}px`;
        }
      });
    }

    // Apply native app-like styling
    if (device.type === 'mobile') {
      document.body.classList.add('qq-mobile-app-mode');
      root.style.setProperty('--qq-border-radius', '12px');
      root.style.setProperty('--qq-shadow', '0 4px 20px rgba(0,0,0,0.15)');
    } else {
      document.body.classList.remove('qq-mobile-app-mode');
      root.style.setProperty('--qq-border-radius', '8px');
      root.style.setProperty('--qq-shadow', '0 2px 10px rgba(0,0,0,0.1)');
    }
  }, []);

  // Toggle fullscreen with QQ enhancements
  const toggleFullscreen = useCallback(async () => {
    setIsTransitioning(true);
    
    try {
      if (!isFullscreen) {
        // Enter fullscreen
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
        
        setIsFullscreen(true);
        
        // Apply QQ scaling after fullscreen
        setTimeout(() => {
          const device = detectDevice();
          const rules = generateScalingRules(device);
          setDeviceProfile(device);
          setScalingRules(rules);
          applyQQScaling(rules, device);
        }, 100);
        
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        
        setIsFullscreen(false);
        
        // Reset scaling
        const root = document.documentElement;
        const properties = [
          '--qq-base-scale', '--qq-font-scale', '--qq-component-scale',
          '--qq-spacing-scale', '--qq-touch-scale', '--qq-widget-scale'
        ];
        properties.forEach(prop => root.style.removeProperty(prop));
        
        // Reset element transforms
        const scaledElements = document.querySelectorAll('[style*="transform"]');
        scaledElements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.transform = '';
            element.style.transformOrigin = '';
          }
        });
        
        document.body.classList.remove('qq-mobile-app-mode');
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    } finally {
      setIsTransitioning(false);
    }
  }, [isFullscreen, detectDevice, generateScalingRules, applyQQScaling]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      
      if (isCurrentlyFullscreen !== isFullscreen) {
        setIsFullscreen(isCurrentlyFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Handle window resize in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const handleResize = () => {
        const device = detectDevice();
        const rules = generateScalingRules(device);
        setDeviceProfile(device);
        setScalingRules(rules);
        applyQQScaling(rules, device);
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, [isFullscreen, detectDevice, generateScalingRules, applyQQScaling]);

  // Initialize device detection
  useEffect(() => {
    const device = detectDevice();
    setDeviceProfile(device);
  }, [detectDevice]);

  const getDeviceIcon = () => {
    if (!deviceProfile) return <Monitor className="h-4 w-4" />;
    
    switch (deviceProfile.type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    if (isTransitioning) return 'bg-yellow-500';
    return isFullscreen ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      {/* Device Info Badge */}
      {deviceProfile && (
        <Badge variant="outline" className="bg-slate-800/90 text-white border-slate-600">
          {getDeviceIcon()}
          <span className="ml-1 text-xs">
            {deviceProfile.type} {deviceProfile.orientation}
          </span>
        </Badge>
      )}

      {/* Fullscreen Toggle Button */}
      <Button
        onClick={toggleFullscreen}
        disabled={isTransitioning}
        variant="outline"
        size="sm"
        className="bg-slate-800/90 text-white border-slate-600 hover:bg-slate-700"
      >
        {isTransitioning ? (
          <Settings className="h-4 w-4 animate-spin" />
        ) : isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
        <span className="ml-2">
          {isTransitioning ? 'Scaling...' : isFullscreen ? 'Exit App Mode' : 'App Mode'}
        </span>
      </Button>

      {/* Status Indicator */}
      <div className={`w-3 h-3 rounded-full ${getStatusColor()} transition-colors`} />

      {/* Scaling Info */}
      {isFullscreen && scalingRules && (
        <Badge variant="outline" className="bg-slate-800/90 text-white border-slate-600">
          <Zap className="h-3 w-3 mr-1" />
          {Math.round(scalingRules.baseScale * 100)}%
        </Badge>
      )}
    </div>
  );
}