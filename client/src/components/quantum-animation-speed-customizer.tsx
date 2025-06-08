import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  Eye, 
  Sparkles,
  Clock,
  Target,
  Waves,
  Orbit
} from 'lucide-react';

interface AnimationSettings {
  globalSpeed: number;
  quantumPulse: number;
  dataFlow: number;
  particleSystem: number;
  glowEffects: number;
  transitionSpeed: number;
  enabled: boolean;
  autoAdapt: boolean;
  performanceMode: boolean;
}

interface QuantumAnimationSpeedCustomizerProps {
  onSettingsChange?: (settings: AnimationSettings) => void;
}

export default function QuantumAnimationSpeedCustomizer({ onSettingsChange }: QuantumAnimationSpeedCustomizerProps) {
  const [settings, setSettings] = useState<AnimationSettings>({
    globalSpeed: 100,
    quantumPulse: 100,
    dataFlow: 100,
    particleSystem: 100,
    glowEffects: 100,
    transitionSpeed: 100,
    enabled: true,
    autoAdapt: false,
    performanceMode: false
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Apply settings to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const speedMultiplier = settings.globalSpeed / 100;
    
    // Update CSS custom properties for animations
    root.style.setProperty('--quantum-speed', `${speedMultiplier}s`);
    root.style.setProperty('--pulse-speed', `${(settings.quantumPulse / 100) * speedMultiplier}s`);
    root.style.setProperty('--data-flow-speed', `${(settings.dataFlow / 100) * speedMultiplier}s`);
    root.style.setProperty('--particle-speed', `${(settings.particleSystem / 100) * speedMultiplier}s`);
    root.style.setProperty('--glow-intensity', String(settings.glowEffects / 100));
    root.style.setProperty('--transition-speed', `${(settings.transitionSpeed / 100) * speedMultiplier}s`);
    
    // Performance mode adjustments
    if (settings.performanceMode) {
      root.style.setProperty('--animation-quality', 'low');
      root.style.setProperty('--blur-quality', '2px');
    } else {
      root.style.setProperty('--animation-quality', 'high');
      root.style.setProperty('--blur-quality', '8px');
    }

    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  }, [settings, onSettingsChange]);

  const updateSetting = (key: keyof AnimationSettings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings({
      globalSpeed: 100,
      quantumPulse: 100,
      dataFlow: 100,
      particleSystem: 100,
      glowEffects: 100,
      transitionSpeed: 100,
      enabled: true,
      autoAdapt: false,
      performanceMode: false
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const root = document.documentElement;
    root.style.setProperty('--animation-play-state', isPlaying ? 'paused' : 'running');
  };

  const presets = [
    { name: 'Slow Motion', values: { globalSpeed: 25, quantumPulse: 50, dataFlow: 30, particleSystem: 40 } },
    { name: 'Standard', values: { globalSpeed: 100, quantumPulse: 100, dataFlow: 100, particleSystem: 100 } },
    { name: 'Accelerated', values: { globalSpeed: 200, quantumPulse: 150, dataFlow: 180, particleSystem: 160 } },
    { name: 'Hyper Speed', values: { globalSpeed: 400, quantumPulse: 300, dataFlow: 350, particleSystem: 280 } }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setSettings(prev => ({
      ...prev,
      ...preset.values,
      glowEffects: preset.values.globalSpeed,
      transitionSpeed: preset.values.globalSpeed
    }));
  };

  return (
    <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-6 w-6 mr-2 text-purple-400" />
            Quantum Animation Speed Customizer
            <Badge className={`ml-2 ${settings.enabled ? 'bg-green-500' : 'bg-red-500'}`}>
              {settings.enabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlayPause}
              className="text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Enable Animations</span>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Auto Performance Adapt</span>
            <Switch
              checked={settings.autoAdapt}
              onCheckedChange={(checked) => updateSetting('autoAdapt', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Performance Mode</span>
            <Switch
              checked={settings.performanceMode}
              onCheckedChange={(checked) => updateSetting('performanceMode', checked)}
            />
          </div>
        </div>

        {/* Speed Presets */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-green-400" />
            Speed Presets
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="text-slate-300 hover:text-white"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Individual Animation Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white flex items-center">
            <Settings className="h-4 w-4 mr-2 text-blue-400" />
            Individual Controls
          </h3>

          {/* Global Speed */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 flex items-center">
                <Gauge className="h-4 w-4 mr-2 text-purple-400" />
                Global Speed
              </label>
              <span className="text-xs text-slate-400">{settings.globalSpeed}%</span>
            </div>
            <Slider
              value={[settings.globalSpeed]}
              onValueChange={([value]) => updateSetting('globalSpeed', value)}
              max={500}
              min={10}
              step={10}
              className="w-full"
            />
          </div>

          {/* Quantum Pulse */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-green-400" />
                Quantum Pulse
              </label>
              <span className="text-xs text-slate-400">{settings.quantumPulse}%</span>
            </div>
            <Slider
              value={[settings.quantumPulse]}
              onValueChange={([value]) => updateSetting('quantumPulse', value)}
              max={300}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Data Flow */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 flex items-center">
                <Waves className="h-4 w-4 mr-2 text-blue-400" />
                Data Flow
              </label>
              <span className="text-xs text-slate-400">{settings.dataFlow}%</span>
            </div>
            <Slider
              value={[settings.dataFlow]}
              onValueChange={([value]) => updateSetting('dataFlow', value)}
              max={400}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Particle System */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 flex items-center">
                <Orbit className="h-4 w-4 mr-2 text-orange-400" />
                Particle System
              </label>
              <span className="text-xs text-slate-400">{settings.particleSystem}%</span>
            </div>
            <Slider
              value={[settings.particleSystem]}
              onValueChange={([value]) => updateSetting('particleSystem', value)}
              max={300}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Glow Effects */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 flex items-center">
                <Eye className="h-4 w-4 mr-2 text-yellow-400" />
                Glow Effects
              </label>
              <span className="text-xs text-slate-400">{settings.glowEffects}%</span>
            </div>
            <Slider
              value={[settings.glowEffects]}
              onValueChange={([value]) => updateSetting('glowEffects', value)}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Transition Speed */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                Transition Speed
              </label>
              <span className="text-xs text-slate-400">{settings.transitionSpeed}%</span>
            </div>
            <Slider
              value={[settings.transitionSpeed]}
              onValueChange={([value]) => updateSetting('transitionSpeed', value)}
              max={300}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Preview Demo Area */}
        {previewMode && (
          <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
            <h4 className="text-sm text-white mb-3">Animation Preview</h4>
            <div className="relative h-32 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded overflow-hidden">
              {/* Animated elements for preview */}
              <div className="absolute inset-0">
                {/* Quantum pulse effect */}
                <div 
                  className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-purple-500/50 rounded-full"
                  style={{
                    animation: `pulse var(--pulse-speed, 2s) infinite ease-in-out`,
                    animationPlayState: 'var(--animation-play-state, running)'
                  }}
                ></div>
                
                {/* Data flow lines */}
                <div 
                  className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  style={{
                    animation: `slideInFromLeft var(--data-flow-speed, 3s) infinite linear`,
                    animationPlayState: 'var(--animation-play-state, running)'
                  }}
                ></div>
                
                {/* Particle dots */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animation: `float var(--particle-speed, 4s) infinite ease-in-out ${i * 0.5}s`,
                      animationPlayState: 'var(--animation-play-state, running)'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Performance Info */}
        <div className="text-xs text-slate-400 bg-slate-800/30 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span>Current FPS Impact:</span>
            <span className={`font-mono ${settings.globalSpeed > 200 ? 'text-orange-400' : 'text-green-400'}`}>
              {settings.performanceMode ? 'Low' : settings.globalSpeed > 200 ? 'High' : 'Medium'}
            </span>
          </div>
          <div className="text-slate-500">
            {settings.performanceMode ? 'Optimized for performance' : 'Full quality animations'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}