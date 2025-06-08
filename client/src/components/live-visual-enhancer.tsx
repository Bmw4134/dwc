import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Palette, 
  Zap, 
  Monitor,
  Settings,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface VisualSettings {
  contrast: number;
  brightness: number;
  saturation: number;
  textSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  blurReduction: boolean;
  colorBlindMode: boolean;
}

export default function LiveVisualEnhancer() {
  const [settings, setSettings] = useState<VisualSettings>({
    contrast: 100,
    brightness: 100,
    saturation: 100,
    textSize: 100,
    highContrast: false,
    reducedMotion: false,
    blurReduction: false,
    colorBlindMode: false
  });

  const [isActive, setIsActive] = useState(false);

  // Apply visual changes immediately
  const applyVisualChanges = (newSettings: VisualSettings) => {
    const root = document.documentElement;
    
    // Create filter string
    const filterValue = `
      contrast(${newSettings.contrast}%)
      brightness(${newSettings.brightness}%)
      saturate(${newSettings.saturation}%)
    `.replace(/\s+/g, ' ').trim();

    // Apply to entire document
    document.body.style.filter = filterValue;
    document.body.style.transition = 'filter 0.3s ease';

    // Text scaling
    root.style.fontSize = `${16 * (newSettings.textSize / 100)}px`;

    // High contrast mode
    if (newSettings.highContrast) {
      document.body.classList.add('high-contrast-mode');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--border-color', '#ffffff');
      
      // Apply to all existing elements
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          if (el.style.backgroundColor) {
            el.style.backgroundColor = '#000000';
          }
          if (el.style.color) {
            el.style.color = '#ffffff';
          }
        }
      });
    } else {
      document.body.classList.remove('high-contrast-mode');
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--border-color');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01s');
      document.body.classList.add('reduce-motion');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      document.body.classList.remove('reduce-motion');
    }

    // Blur reduction
    if (newSettings.blurReduction) {
      const blurElements = document.querySelectorAll('[class*="blur"], [class*="backdrop"]');
      blurElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.backdropFilter = 'none';
          el.style.filter = el.style.filter.replace(/blur\([^)]*\)/g, '');
        }
      });
    }

    // Color blind mode (protanopia simulation)
    if (newSettings.colorBlindMode) {
      document.body.style.filter = `${filterValue} sepia(100%) hue-rotate(120deg)`;
    }

    // Show confirmation
    showChangeConfirmation();
  };

  const showChangeConfirmation = () => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        Visual Enhancement Applied
      </div>
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector('#visual-enhancer-styles')) {
      const style = document.createElement('style');
      style.id = 'visual-enhancer-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .high-contrast-mode * {
          border-color: #ffffff !important;
        }
        .reduce-motion * {
          animation-duration: 0.01s !important;
          transition-duration: 0.01s !important;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };

  const updateSetting = (key: keyof VisualSettings, value: number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (isActive) {
      applyVisualChanges(newSettings);
    }
  };

  const toggleEnhancer = () => {
    const newState = !isActive;
    setIsActive(newState);
    
    if (newState) {
      applyVisualChanges(settings);
    } else {
      // Reset all visual changes
      document.body.style.filter = '';
      document.documentElement.style.fontSize = '';
      document.body.classList.remove('high-contrast-mode', 'reduce-motion');
      
      // Reset custom properties
      const root = document.documentElement;
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--border-color');
    }
  };

  const resetToDefaults = () => {
    const defaultSettings: VisualSettings = {
      contrast: 100,
      brightness: 100,
      saturation: 100,
      textSize: 100,
      highContrast: false,
      reducedMotion: false,
      blurReduction: false,
      colorBlindMode: false
    };
    setSettings(defaultSettings);
    if (isActive) {
      applyVisualChanges(defaultSettings);
    }
  };

  return (
    <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-6 w-6 mr-2 text-blue-400" />
            Live Visual Enhancer
            <Badge className={`ml-2 ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <Button
            onClick={toggleEnhancer}
            variant={isActive ? "destructive" : "default"}
            size="sm"
          >
            {isActive ? 'Disable' : 'Enable'}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
            className="text-slate-300 hover:text-white"
          >
            <Monitor className="h-4 w-4 mr-2" />
            High Contrast
          </Button>
        </div>

        {/* Visual Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white flex items-center">
            <Palette className="h-4 w-4 mr-2 text-purple-400" />
            Visual Adjustments
          </h3>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300">Contrast</label>
              <span className="text-xs text-slate-400">{settings.contrast}%</span>
            </div>
            <Slider
              value={[settings.contrast]}
              onValueChange={([value]) => updateSetting('contrast', value)}
              max={200}
              min={50}
              step={5}
              className="w-full"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300">Brightness</label>
              <span className="text-xs text-slate-400">{settings.brightness}%</span>
            </div>
            <Slider
              value={[settings.brightness]}
              onValueChange={([value]) => updateSetting('brightness', value)}
              max={200}
              min={50}
              step={5}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300">Color Saturation</label>
              <span className="text-xs text-slate-400">{settings.saturation}%</span>
            </div>
            <Slider
              value={[settings.saturation]}
              onValueChange={([value]) => updateSetting('saturation', value)}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Text Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300">Text Size</label>
              <span className="text-xs text-slate-400">{settings.textSize}%</span>
            </div>
            <Slider
              value={[settings.textSize]}
              onValueChange={([value]) => updateSetting('textSize', value)}
              max={150}
              min={75}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Accessibility Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white flex items-center">
            <Settings className="h-4 w-4 mr-2 text-green-400" />
            Accessibility Options
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">High Contrast Mode</span>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Reduce Motion</span>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Reduce Blur Effects</span>
              <Switch
                checked={settings.blurReduction}
                onCheckedChange={(checked) => updateSetting('blurReduction', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Color Blind Friendly</span>
              <Switch
                checked={settings.colorBlindMode}
                onCheckedChange={(checked) => updateSetting('colorBlindMode', checked)}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-slate-400 bg-slate-800/30 rounded p-3">
          <div className="flex items-center justify-between">
            <span>Enhancement Status:</span>
            <span className={`font-mono ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {isActive ? 'ACTIVE - Changes Applied Immediately' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}