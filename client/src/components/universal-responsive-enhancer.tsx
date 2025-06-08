import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  RotateCcw, 
  Eye, 
  Zap, 
  Settings,
  Maximize2,
  Minimize2,
  Palette,
  Users,
  Lock,
  Unlock
} from 'lucide-react';

interface DeviceProfile {
  type: 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  dpi: number;
  touchEnabled: boolean;
}

interface QQEnhancement {
  contrastBoost: number;
  sharpness: number;
  colorVibrancy: number;
  textScaling: number;
  motionReduction: boolean;
  highContrastMode: boolean;
}

interface UserProfile {
  userId: string;
  name: string;
  role: 'owner' | 'spouse' | 'client';
  preferences: QQEnhancement;
  deviceSettings: DeviceProfile;
  accessLevel: 'full' | 'restricted' | 'readonly';
}

export default function UniversalResponsiveEnhancer() {
  const [currentDevice, setCurrentDevice] = useState<DeviceProfile>({
    type: 'desktop',
    width: 1920,
    height: 1080,
    orientation: 'landscape',
    dpi: 96,
    touchEnabled: false
  });

  const [qqSettings, setQQSettings] = useState<QQEnhancement>({
    contrastBoost: 100,
    sharpness: 100,
    colorVibrancy: 100,
    textScaling: 100,
    motionReduction: false,
    highContrastMode: false
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    userId: 'user_1',
    name: 'Primary User',
    role: 'owner',
    preferences: qqSettings,
    deviceSettings: currentDevice,
    accessLevel: 'full'
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClientMode, setIsClientMode] = useState(false);

  // Detect device characteristics
  const detectDevice = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpi = window.devicePixelRatio * 96;
    const touchEnabled = 'ontouchstart' in window;
    
    let type: DeviceProfile['type'] = 'desktop';
    if (width <= 768) type = 'mobile';
    else if (width <= 1024) type = 'tablet';
    else if (width >= 2560) type = 'ultrawide';

    const orientation = width > height ? 'landscape' : 'portrait';

    const newDevice: DeviceProfile = {
      type,
      width,
      height,
      orientation,
      dpi,
      touchEnabled
    };

    setCurrentDevice(newDevice);
    applyDeviceOptimizations(newDevice);
  }, []);

  // Apply device-specific optimizations
  const applyDeviceOptimizations = (device: DeviceProfile) => {
    const root = document.documentElement;
    
    // Base scaling for different devices
    let baseScale = 1;
    switch (device.type) {
      case 'mobile':
        baseScale = device.orientation === 'portrait' ? 0.9 : 0.85;
        break;
      case 'tablet':
        baseScale = device.orientation === 'portrait' ? 0.95 : 1.0;
        break;
      case 'ultrawide':
        baseScale = 1.1;
        break;
    }

    // Apply responsive scaling
    const finalScale = baseScale * (qqSettings.textScaling / 100);
    root.style.setProperty('--responsive-scale', finalScale.toString());
    
    // Touch-specific optimizations
    if (device.touchEnabled) {
      root.style.setProperty('--touch-target-size', '44px');
      root.style.setProperty('--button-padding', '12px 16px');
    } else {
      root.style.setProperty('--touch-target-size', '32px');
      root.style.setProperty('--button-padding', '8px 12px');
    }

    // Orientation-specific layout
    if (device.orientation === 'portrait') {
      root.style.setProperty('--layout-direction', 'column');
      root.style.setProperty('--sidebar-width', '100%');
      root.style.setProperty('--content-padding', '16px');
    } else {
      root.style.setProperty('--layout-direction', 'row');
      root.style.setProperty('--sidebar-width', '280px');
      root.style.setProperty('--content-padding', '24px');
    }
  };

  // Apply QQ enhancement filters
  const applyQQEnhancements = (settings: QQEnhancement) => {
    const root = document.documentElement;
    
    // CSS filters for visual enhancement
    const filterString = [
      `contrast(${settings.contrastBoost}%)`,
      `brightness(${settings.colorVibrancy}%)`,
      `saturate(${settings.colorVibrancy}%)`,
      settings.sharpness !== 100 ? `blur(${(100 - settings.sharpness) * 0.01}px)` : ''
    ].filter(Boolean).join(' ');

    root.style.setProperty('--qq-filter', filterString);
    
    // High contrast mode
    if (settings.highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Motion reduction
    if (settings.motionReduction) {
      root.style.setProperty('--animation-duration', '0.01s');
      root.style.setProperty('--transition-duration', '0.01s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      root.style.setProperty('--transition-duration', '0.2s');
    }

    // Text scaling
    root.style.setProperty('--text-scale', (settings.textScaling / 100).toString());
  };

  // User switching for multi-user support
  const switchUser = (role: 'owner' | 'spouse' | 'client') => {
    const userProfiles: Record<string, UserProfile> = {
      owner: {
        userId: 'owner_1',
        name: 'Primary Owner',
        role: 'owner',
        preferences: qqSettings,
        deviceSettings: currentDevice,
        accessLevel: 'full'
      },
      spouse: {
        userId: 'spouse_1',
        name: 'Spouse',
        role: 'spouse',
        preferences: { ...qqSettings, textScaling: 110, contrastBoost: 110 },
        deviceSettings: currentDevice,
        accessLevel: 'full'
      },
      client: {
        userId: 'client_1',
        name: 'Client User',
        role: 'client',
        preferences: { ...qqSettings, motionReduction: true },
        deviceSettings: currentDevice,
        accessLevel: 'readonly'
      }
    };

    const newUser = userProfiles[role];
    setCurrentUser(newUser);
    setQQSettings(newUser.preferences);
    setIsClientMode(role === 'client');
    applyQQEnhancements(newUser.preferences);
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Initialize and listen for device changes
  useEffect(() => {
    detectDevice();
    applyQQEnhancements(qqSettings);

    const handleResize = () => detectDevice();
    const handleOrientationChange = () => setTimeout(detectDevice, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectDevice]);

  // Update QQ settings and apply immediately
  const updateQQSetting = (key: keyof QQEnhancement, value: any) => {
    const newSettings = { ...qqSettings, [key]: value };
    setQQSettings(newSettings);
    applyQQEnhancements(newSettings);
    
    // Save to user profile
    setCurrentUser(prev => ({
      ...prev,
      preferences: newSettings
    }));
  };

  const DeviceIcon = () => {
    switch (currentDevice.type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'ultrawide': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div
      className="fixed z-50 select-none"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-sm shadow-2xl w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700 drag-handle cursor-move">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Visual Enhancer</span>
            <Badge variant="outline" className="text-xs">
              {currentDevice.type}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 p-0"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Device Info */}
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <DeviceIcon />
              <span className="text-sm text-white">{currentDevice.width}×{currentDevice.height}</span>
              <Badge className={`text-xs ${currentDevice.orientation === 'portrait' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {currentDevice.orientation}
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              {currentDevice.touchEnabled && <span className="text-xs text-blue-400">Touch</span>}
              <span className="text-xs text-slate-400">{Math.round(currentDevice.dpi)} DPI</span>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-white">{currentUser.name}</span>
              <Badge className={`text-xs ${isClientMode ? 'bg-orange-500' : 'bg-green-500'}`}>
                {currentUser.role}
              </Badge>
            </div>
            {isClientMode ? <Lock className="h-3 w-3 text-orange-400" /> : <Unlock className="h-3 w-3 text-green-400" />}
          </div>
        </div>

        {/* User Switcher */}
        <div className="p-3 border-b border-slate-700">
          <div className="text-xs text-slate-400 mb-2">Switch User</div>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 text-xs ${currentUser.role === 'owner' ? 'bg-slate-700' : ''}`}
              onClick={() => switchUser('owner')}
            >
              Owner
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 text-xs ${currentUser.role === 'spouse' ? 'bg-slate-700' : ''}`}
              onClick={() => switchUser('spouse')}
            >
              Spouse
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 text-xs ${currentUser.role === 'client' ? 'bg-slate-700' : ''}`}
              onClick={() => switchUser('client')}
              disabled={!isClientMode && currentUser.accessLevel !== 'full'}
            >
              Client
            </Button>
          </div>
        </div>

        {/* QQ Enhancement Controls */}
        {isExpanded && (
          <CardContent className="p-3 space-y-4">
            <div className="space-y-3">
              <div className="text-xs text-slate-400">QQ Visual Enhancement</div>
              
              {/* Contrast Boost */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Contrast</span>
                  <span className="text-white">{qqSettings.contrastBoost}%</span>
                </div>
                <Slider
                  value={[qqSettings.contrastBoost]}
                  onValueChange={([value]) => updateQQSetting('contrastBoost', value)}
                  max={200}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Sharpness */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Sharpness</span>
                  <span className="text-white">{qqSettings.sharpness}%</span>
                </div>
                <Slider
                  value={[qqSettings.sharpness]}
                  onValueChange={([value]) => updateQQSetting('sharpness', value)}
                  max={150}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Color Vibrancy */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Vibrancy</span>
                  <span className="text-white">{qqSettings.colorVibrancy}%</span>
                </div>
                <Slider
                  value={[qqSettings.colorVibrancy]}
                  onValueChange={([value]) => updateQQSetting('colorVibrancy', value)}
                  max={150}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Text Scaling */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Text Size</span>
                  <span className="text-white">{qqSettings.textScaling}%</span>
                </div>
                <Slider
                  value={[qqSettings.textScaling]}
                  onValueChange={([value]) => updateQQSetting('textScaling', value)}
                  max={150}
                  min={75}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Toggle Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">High Contrast</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-12 text-xs ${qqSettings.highContrastMode ? 'bg-blue-600' : 'bg-slate-600'}`}
                    onClick={() => updateQQSetting('highContrastMode', !qqSettings.highContrastMode)}
                  >
                    {qqSettings.highContrastMode ? 'ON' : 'OFF'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Reduce Motion</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-12 text-xs ${qqSettings.motionReduction ? 'bg-blue-600' : 'bg-slate-600'}`}
                    onClick={() => updateQQSetting('motionReduction', !qqSettings.motionReduction)}
                  >
                    {qqSettings.motionReduction ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Quick Presets</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      const preset = { contrastBoost: 100, sharpness: 100, colorVibrancy: 100, textScaling: 100, motionReduction: false, highContrastMode: false };
                      setQQSettings(preset);
                      applyQQEnhancements(preset);
                    }}
                  >
                    Default
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      const preset = { contrastBoost: 130, sharpness: 120, colorVibrancy: 110, textScaling: 110, motionReduction: false, highContrastMode: false };
                      setQQSettings(preset);
                      applyQQEnhancements(preset);
                    }}
                  >
                    Enhanced
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      const preset = { contrastBoost: 150, sharpness: 110, colorVibrancy: 90, textScaling: 120, motionReduction: true, highContrastMode: true };
                      setQQSettings(preset);
                      applyQQEnhancements(preset);
                    }}
                  >
                    Accessible
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      const preset = { contrastBoost: 110, sharpness: 130, colorVibrancy: 120, textScaling: 95, motionReduction: false, highContrastMode: false };
                      setQQSettings(preset);
                      applyQQEnhancements(preset);
                    }}
                  >
                    Pitch Ready
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}