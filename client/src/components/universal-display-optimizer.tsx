import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Eye, Settings, Maximize2, Sun, Contrast, Type } from 'lucide-react';

interface DisplaySettings {
  fontSize: number;
  contrast: number;
  brightness: number;
  saturation: number;
  textWeight: number;
  lineHeight: number;
  letterSpacing: number;
  highContrast: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface DisplayInfo {
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  colorDepth: number;
  hdr: boolean;
  resolution: string;
}

export function UniversalDisplayOptimizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [displayInfo, setDisplayInfo] = useState<DisplayInfo>({
    screenWidth: 1920,
    screenHeight: 1080,
    pixelRatio: 1,
    colorDepth: 24,
    hdr: false,
    resolution: 'HD'
  });

  const [settings, setSettings] = useState<DisplaySettings>({
    fontSize: 100,
    contrast: 100,
    brightness: 100,
    saturation: 100,
    textWeight: 400,
    lineHeight: 100,
    letterSpacing: 0,
    highContrast: false,
    darkMode: false,
    reducedMotion: false,
    largeText: false,
    colorBlindMode: 'none'
  });

  // Detect display capabilities and auto-optimize for windowed mode
  useEffect(() => {
    const detectDisplay = () => {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const windowWidth = window.innerWidth;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const colorDepth = window.screen.colorDepth || 24;
      
      // Detect HDR support
      const hdrSupported = window.matchMedia('(dynamic-range: high)').matches || 
                          colorDepth > 24 || 
                          devicePixelRatio > 1.5;

      let resolution = '4K+';
      if (screenWidth >= 3840) resolution = '4K+';
      else if (screenWidth >= 2560) resolution = '2K/1440p';
      else if (screenWidth >= 1920) resolution = 'Full HD';
      else if (screenWidth >= 1366) resolution = 'HD';
      else resolution = 'Mobile/Low';

      setDisplayInfo({
        screenWidth,
        screenHeight,
        pixelRatio: devicePixelRatio,
        colorDepth,
        hdr: hdrSupported,
        resolution
      });

      // Auto-detect optimal scaling for windowed mode on high-res displays (conservative)
      if (screenWidth >= 2560 && windowWidth < screenWidth * 0.8) {
        // User is in windowed mode on 2560x1440+ - very minimal increase
        setSettings(prev => ({ ...prev, fontSize: Math.max(prev.fontSize, 105) }));
      } else if (devicePixelRatio >= 2) {
        // High DPI display - no auto-scaling
        setSettings(prev => ({ ...prev, fontSize: 100 }));
      }
    };

    detectDisplay();
    window.addEventListener('resize', detectDisplay);
    return () => window.removeEventListener('resize', detectDisplay);
  }, []);

  // Apply real-time CSS scaling that actually works
  useEffect(() => {
    const applyScaling = () => {
      // Remove existing optimization styles
      const existingStyle = document.getElementById('asi-display-optimizer');
      if (existingStyle) existingStyle.remove();

      // Create new style element with aggressive scaling
      const style = document.createElement('style');
      style.id = 'asi-display-optimizer';
      
      // Calculate effective scale based on user settings and screen detection
      const baseScale = settings.fontSize / 100;
      const contrastFilter = `contrast(${settings.contrast}%)`;
      const brightnessFilter = `brightness(${settings.brightness}%)`;
      const saturationFilter = `saturate(${settings.saturation}%)`;
      const combinedFilter = `${contrastFilter} ${brightnessFilter} ${saturationFilter}`;

      style.textContent = `
        html {
          zoom: ${baseScale} !important;
          font-size: ${16 * baseScale}px !important;
        }
        
        body {
          filter: ${combinedFilter} !important;
          font-weight: ${settings.textWeight} !important;
          line-height: ${settings.lineHeight / 100} !important;
          letter-spacing: ${settings.letterSpacing}px !important;
          transition: all 0.3s ease !important;
        }
        
        * {
          font-family: inherit !important;
          font-weight: ${settings.textWeight} !important;
        }
        
        ${settings.highContrast ? `
          * {
            background-color: #000000 !important;
            color: #FFFFFF !important;
            border-color: #FFFFFF !important;
          }
          .bg-white, .bg-gray-50, .bg-blue-50, .bg-green-50 {
            background-color: #000000 !important;
          }
          .text-gray-600, .text-gray-700, .text-gray-800, .text-gray-900 {
            color: #FFFFFF !important;
          }
          .border-gray-200, .border-gray-300 {
            border-color: #FFFFFF !important;
          }
        ` : ''}
        
        ${settings.reducedMotion ? `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        ` : ''}
        
        .text-xs { font-size: ${0.75 * baseScale}rem !important; }
        .text-sm { font-size: ${0.875 * baseScale}rem !important; }
        .text-base { font-size: ${1 * baseScale}rem !important; }
        .text-lg { font-size: ${1.125 * baseScale}rem !important; }
        .text-xl { font-size: ${1.25 * baseScale}rem !important; }
        .text-2xl { font-size: ${1.5 * baseScale}rem !important; }
        .text-3xl { font-size: ${1.875 * baseScale}rem !important; }
        .text-4xl { font-size: ${2.25 * baseScale}rem !important; }
      `;

      document.head.appendChild(style);

      // Apply dark mode
      const root = document.documentElement;
      if (settings.darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Force repaint
      document.body.offsetHeight;
    };

    applyScaling();
    
    // Store settings
    localStorage.setItem('display-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof DisplaySettings>(
    key: K, 
    value: DisplaySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: 'standard' | 'highContrast' | 'largeText' | 'lowVision') => {
    const presets = {
      standard: {
        fontSize: 100,
        contrast: 100,
        brightness: 100,
        saturation: 100,
        textWeight: 400,
        lineHeight: 100,
        letterSpacing: 0,
        highContrast: false,
        darkMode: false,
        reducedMotion: false,
        largeText: false,
        colorBlindMode: 'none' as const
      },
      highContrast: {
        fontSize: 115,
        contrast: 150,
        brightness: 120,
        saturation: 80,
        textWeight: 600,
        lineHeight: 110,
        letterSpacing: 1,
        highContrast: true,
        darkMode: true,
        reducedMotion: false,
        largeText: false,
        colorBlindMode: 'none' as const
      },
      largeText: {
        fontSize: 150,
        contrast: 110,
        brightness: 110,
        saturation: 100,
        textWeight: 500,
        lineHeight: 120,
        letterSpacing: 1,
        highContrast: false,
        darkMode: false,
        reducedMotion: false,
        largeText: true,
        colorBlindMode: 'none' as const
      },
      lowVision: {
        fontSize: 175,
        contrast: 175,
        brightness: 130,
        saturation: 120,
        textWeight: 700,
        lineHeight: 150,
        letterSpacing: 2,
        highContrast: true,
        darkMode: true,
        reducedMotion: true,
        largeText: true,
        colorBlindMode: 'none' as const
      }
    };
    
    setSettings(presets[preset]);
  };

  // Listen for custom events to apply settings
  useEffect(() => {
    const handleApplySettings = (event: any) => {
      setSettings(prev => ({ ...prev, ...event.detail }));
    };

    window.addEventListener('applyDisplaySettings', handleApplySettings);
    return () => window.removeEventListener('applyDisplaySettings', handleApplySettings);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="mb-2 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50"
      >
        <Monitor className="h-4 w-4 mr-2" />
        Display
      </Button>

      {isOpen && (
        <Card className="w-80 bg-white/95 backdrop-blur-sm border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Universal Display Optimizer</span>
            </CardTitle>
            <div className="text-xs text-gray-600">
              <div>Display: {displayInfo.resolution} ({displayInfo.screenWidth}×{displayInfo.screenHeight})</div>
              <div>Ratio: {displayInfo.pixelRatio}x | HDR: {displayInfo.hdr ? 'Yes' : 'No'}</div>
              {displayInfo.screenWidth >= 2560 && window.innerWidth < displayInfo.screenWidth * 0.8 && (
                <Badge variant="outline" className="mt-1 text-blue-600 border-blue-600">
                  Windowed Mode Detected
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => applyPreset('standard')}>
                  <Settings className="h-3 w-3 mr-1" />
                  Standard
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset('highContrast')}>
                  <Contrast className="h-3 w-3 mr-1" />
                  High Contrast
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset('largeText')}>
                  <Type className="h-3 w-3 mr-1" />
                  Large Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyPreset('lowVision')}>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Low Vision
                </Button>
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Size: {settings.fontSize}%</label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={75}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contrast: {settings.contrast}%</label>
              <Slider
                value={[settings.contrast]}
                onValueChange={([value]) => updateSetting('contrast', value)}
                min={50}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Brightness: {settings.brightness}%</label>
              <Slider
                value={[settings.brightness]}
                onValueChange={([value]) => updateSetting('brightness', value)}
                min={50}
                max={150}
                step={5}
                className="w-full"
              />
            </div>

            {/* Text Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Text Weight: {settings.textWeight}</label>
              <Slider
                value={[settings.textWeight]}
                onValueChange={([value]) => updateSetting('textWeight', value)}
                min={300}
                max={900}
                step={100}
                className="w-full"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Contrast</span>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Reduced Motion</span>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>
            </div>

            {/* Color Blind Support */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Blind Support</label>
              <Select 
                value={settings.colorBlindMode} 
                onValueChange={(value: any) => updateSetting('colorBlindMode', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const event = new CustomEvent('applyDisplaySettings', {
                    detail: { fontSize: 100, contrast: 100, brightness: 100 }
                  });
                  window.dispatchEvent(event);
                }}
                className="flex-1 bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
              >
                Fix Now
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}