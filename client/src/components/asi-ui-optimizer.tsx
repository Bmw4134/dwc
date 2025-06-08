import { useState, useEffect } from 'react';
import { Settings, Eye, Palette, Zap, Brain, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { asiVisualScanner, type ASIVisualAnalysis } from '@/lib/asi-visual-scanner';

interface UITheme {
  contrast: number;
  fontSize: number;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export function ASIUIOptimizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ASIVisualAnalysis[]>([]);
  const [theme, setTheme] = useState<UITheme>({
    contrast: 100,
    fontSize: 100,
    darkMode: false,
    highContrast: false,
    reducedMotion: false
  });

  // ASI → AGI → AI Pipeline
  const runASIAnalysis = async () => {
    setScanning(true);
    try {
      // ASI Level: Scan visual elements
      const asiResults = await asiVisualScanner.performASIScan();
      
      // AGI Level: Generate insights
      const agiInsights = await asiVisualScanner.generateAGIInsights();
      
      // AI Level: Create recommendations
      const aiRecommendations = await asiVisualScanner.generateAIRecommendations();
      
      setScanResults(asiResults);
      
      // Auto-apply critical fixes
      await asiVisualScanner.applyAutoFixes();
      
    } catch (error) {
      console.error('ASI Analysis failed:', error);
    } finally {
      setScanning(false);
    }
  };

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Contrast adjustment
    root.style.setProperty('--contrast-multiplier', `${theme.contrast / 100}`);
    
    // Font size scaling
    root.style.setProperty('--font-scale', `${theme.fontSize / 100}`);
    
    // Dark mode
    if (theme.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // High contrast mode
    if (theme.highContrast) {
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--border-color', '#000000');
    } else {
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--bg-color');
      root.style.removeProperty('--border-color');
    }
    
    // Reduced motion
    if (theme.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }
  }, [theme]);

  const criticalIssues = scanResults.filter(r => r.severity === 'critical').length;
  const highIssues = scanResults.filter(r => r.severity === 'high').length;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400"
          >
            <Brain className="h-4 w-4 mr-2 text-blue-600" />
            ASI
            {criticalIssues > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {criticalIssues}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="end">
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>ASI → AGI → AI Optimizer</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intelligent UI optimization for DWC Systems
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* ASI Analysis */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Visual Analysis</span>
                  <Button
                    size="sm"
                    onClick={runASIAnalysis}
                    disabled={scanning}
                    className="h-7"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {scanning ? 'Scanning...' : 'Run ASI Scan'}
                  </Button>
                </div>
                
                {scanResults.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <div className="font-bold text-red-600">{criticalIssues}</div>
                      <div>Critical</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <div className="font-bold text-orange-600">{highIssues}</div>
                      <div>High</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="font-bold text-green-600">
                        {scanResults.filter(r => r.autoFixable).length}
                      </div>
                      <div>Auto-Fixed</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Controls */}
              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Visual Settings</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Contrast</span>
                      <span>{theme.contrast}%</span>
                    </div>
                    <Slider
                      value={[theme.contrast]}
                      onValueChange={(value) => setTheme(prev => ({ ...prev, contrast: value[0] }))}
                      min={50}
                      max={200}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Font Size</span>
                      <span>{theme.fontSize}%</span>
                    </div>
                    <Slider
                      value={[theme.fontSize]}
                      onValueChange={(value) => setTheme(prev => ({ ...prev, fontSize: value[0] }))}
                      min={75}
                      max={150}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={theme.darkMode}
                        onCheckedChange={(checked) => setTheme(prev => ({ ...prev, darkMode: checked }))}
                      />
                      <span className="text-xs">Dark Mode</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={theme.highContrast}
                        onCheckedChange={(checked) => setTheme(prev => ({ ...prev, highContrast: checked }))}
                      />
                      <span className="text-xs">High Contrast</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AGI Insights */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">AGI Insights</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  Optimizing for Fort Worth LOC applications and Mission Control visibility
                </div>
              </div>

              {/* Internal LLM Access */}
              <div className="border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open('/internal-llm', '_blank')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  DWC Internal LLM
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}