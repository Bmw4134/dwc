import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Eye, Cpu, Brain, Zap, Settings, Download } from 'lucide-react';
import { asiDisplaySimulator } from '@/lib/asi-display-simulator';

export default function ASIDisplaySimulator() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [simulation, setSimulation] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Get current display info
  const [currentDisplay, setCurrentDisplay] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  });

  useEffect(() => {
    const updateDisplay = () => {
      setCurrentDisplay({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1
      });
    };

    window.addEventListener('resize', updateDisplay);
    return () => window.removeEventListener('resize', updateDisplay);
  }, []);

  // Auto-analyze current environment
  useEffect(() => {
    const result = asiDisplaySimulator.analyzeDisplayEnvironment(
      currentDisplay.width,
      currentDisplay.height,
      currentDisplay.pixelRatio
    );
    setAnalysis(result);
  }, [currentDisplay]);

  const runFullSimulation = async () => {
    setIsRunning(true);
    
    // Simulate delay for AI processing
    setTimeout(() => {
      const result = asiDisplaySimulator.simulateAllConfigurations();
      setSimulation(result);
      setIsRunning(false);
    }, 2000);
  };

  const applyOptimalSettings = () => {
    if (analysis?.adaptiveSettings) {
      // Apply the optimal settings to the display optimizer
      const event = new CustomEvent('applyDisplaySettings', {
        detail: analysis.adaptiveSettings
      });
      window.dispatchEvent(event);
    }
  };

  const deviceCategories = [
    { key: 'ultra-high-end', label: 'Ultra High-End', icon: Monitor },
    { key: 'business', label: 'Business Standard', icon: Settings },
    { key: 'mobile', label: 'Mobile/Tablet', icon: Eye },
    { key: 'accessibility', label: 'Accessibility', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="flex space-x-1">
                <Cpu className="h-6 w-6 text-blue-600" />
                <Brain className="h-6 w-6 text-purple-600" />
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <span>ASI → AGI → AI Display Simulator</span>
            </CardTitle>
            <p className="text-gray-600">
              Simulate and optimize display across every possible device configuration using artificial super intelligence
            </p>
          </CardHeader>
        </Card>

        {/* Current Environment Analysis */}
        {analysis && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-green-600" />
                <span>Current Environment Analysis</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {analysis.optimizationScore}% Match
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Detected Configuration</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <div className="font-medium">{analysis.detectedConfiguration.name}</div>
                    <div className="text-sm text-gray-600">
                      {currentDisplay.width} × {currentDisplay.height} @ {currentDisplay.pixelRatio}x
                    </div>
                    <div className="text-sm text-gray-600">
                      Usage: {analysis.detectedConfiguration.usage}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Optimal Settings</h4>
                  <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                    <div className="text-sm">Font Size: {analysis.adaptiveSettings.fontSize}%</div>
                    <div className="text-sm">Contrast: {analysis.adaptiveSettings.contrast}%</div>
                    <div className="text-sm">Text Weight: {analysis.adaptiveSettings.textWeight}</div>
                    <div className="text-sm">Line Height: {analysis.adaptiveSettings.lineHeight}%</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Recommendations</h4>
                <div className="space-y-1">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <Zap className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={applyOptimalSettings} className="bg-blue-600 hover:bg-blue-700">
                  Apply Optimal Settings
                </Button>
                <Button onClick={runFullSimulation} disabled={isRunning} variant="outline">
                  {isRunning ? 'Running Simulation...' : 'Run Full ASI Simulation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Category Simulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deviceCategories.map(category => {
            const configs = asiDisplaySimulator.getConfigurationsByCategory(category.key as any);
            const IconComponent = category.icon;
            
            return (
              <Card key={category.key} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{category.label}</span>
                    <Badge variant="secondary">{configs.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {configs.slice(0, 3).map((config, index) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                        <div className="font-medium">{config.name}</div>
                        <div className="text-gray-600">
                          {config.screenWidth} × {config.screenHeight}
                        </div>
                        <div className="text-gray-600">
                          Font: {config.optimalSettings.fontSize}%
                        </div>
                      </div>
                    ))}
                    {configs.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{configs.length - 3} more configurations
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Full Simulation Results */}
        {simulation && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Complete ASI Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{simulation.totalConfigurations}</div>
                  <div className="text-sm text-gray-600">Total Configurations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{simulation.categoryBreakdown['Ultra High-End']}</div>
                  <div className="text-sm text-gray-600">Ultra High-End</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{simulation.categoryBreakdown['Business Standard']}</div>
                  <div className="text-sm text-gray-600">Business Standard</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{simulation.categoryBreakdown['Accessibility']}</div>
                  <div className="text-sm text-gray-600">Accessibility</div>
                </div>
              </div>

              {/* Optimization Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">ASI → AGI → AI Pipeline Summary</h3>
                <div className="space-y-2">
                  {simulation.optimizationSummary.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Cpu className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Universal Principles */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Universal Optimization Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {simulation.universalPrinciples.map((principle: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{principle}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export ASI Analysis Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Fix for Current Issue */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Fix: Current Display Issue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-3">
              Your current display scaling is still too large. Click below to apply the correct 105% scaling for your windowed 2560×1440 setup:
            </p>
            <Button 
              onClick={() => {
                const event = new CustomEvent('applyDisplaySettings', {
                  detail: { fontSize: 105, contrast: 100, brightness: 100 }
                });
                window.dispatchEvent(event);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Fix Display Scaling Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}