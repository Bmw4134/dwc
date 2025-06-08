import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Zap, 
  Shield, 
  Monitor,
  Cpu,
  Network,
  Database,
  Save
} from 'lucide-react';

export default function NexusConfig() {
  const [config, setConfig] = useState({
    automationLinkage: 100,
    driftDetection: true,
    domTracking: true,
    autoAuthorization: true,
    confidenceThreshold: 98,
    observerRefreshRate: 5000,
    logLevel: 'info',
    maxSessionHistory: 500,
    networkTimeout: 30000,
    retryAttempts: 3
  });

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfig = () => {
    console.log('Saving configuration:', config);
    // Implementation would save to backend
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-green-300">NEXUS Configuration</h1>
              <p className="text-green-400/70 font-mono text-sm">System settings and automation parameters</p>
            </div>
          </div>
          <Button
            onClick={saveConfig}
            className="bg-green-600 hover:bg-green-700 text-black"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="automation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-green-500/20">
            <TabsTrigger value="automation" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Automation
            </TabsTrigger>
            <TabsTrigger value="observer" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Observer
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automation" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Automation Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-300 font-medium">Automation Linkage</h4>
                      <p className="text-green-400/70 text-sm">Current system automation coverage</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {config.automationLinkage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Slider
                      value={[config.automationLinkage]}
                      onValueChange={(value) => updateConfig('automationLinkage', value[0])}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-green-400/70">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-green-300 font-medium">Auto Authorization</h4>
                    <p className="text-green-400/70 text-sm">Automatically authorize high-confidence operations</p>
                  </div>
                  <Switch
                    checked={config.autoAuthorization}
                    onCheckedChange={(checked) => updateConfig('autoAuthorization', checked)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-300 font-medium">Confidence Threshold</h4>
                      <p className="text-green-400/70 text-sm">Minimum confidence for auto-authorization</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {config.confidenceThreshold}%
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[config.confidenceThreshold]}
                    onValueChange={(value) => updateConfig('confidenceThreshold', value[0])}
                    min={80}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="observer" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Observer Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-green-300 font-medium">Drift Detection</h4>
                    <p className="text-green-400/70 text-sm">Monitor for unexpected UI changes</p>
                  </div>
                  <Switch
                    checked={config.driftDetection}
                    onCheckedChange={(checked) => updateConfig('driftDetection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-green-300 font-medium">DOM Tracking</h4>
                    <p className="text-green-400/70 text-sm">Track DOM changes and element interactions</p>
                  </div>
                  <Switch
                    checked={config.domTracking}
                    onCheckedChange={(checked) => updateConfig('domTracking', checked)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-300 font-medium">Refresh Rate</h4>
                      <p className="text-green-400/70 text-sm">Observer monitoring interval (ms)</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {config.observerRefreshRate}ms
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[config.observerRefreshRate]}
                    onValueChange={(value) => updateConfig('observerRefreshRate', value[0])}
                    min={1000}
                    max={30000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-green-300 font-medium">Log Level</h4>
                  <select
                    value={config.logLevel}
                    onChange={(e) => updateConfig('logLevel', e.target.value)}
                    className="w-full bg-gray-800 border border-green-500/20 rounded px-3 py-2 text-green-300"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center space-x-2">
                  <Cpu className="w-5 h-5" />
                  <span>Performance Tuning</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-300 font-medium">Max Session History</h4>
                      <p className="text-green-400/70 text-sm">Maximum number of stored session records</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {config.maxSessionHistory}
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[config.maxSessionHistory]}
                    onValueChange={(value) => updateConfig('maxSessionHistory', value[0])}
                    min={100}
                    max={2000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-300 font-medium">Network Timeout</h4>
                      <p className="text-green-400/70 text-sm">API request timeout (ms)</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {config.networkTimeout}ms
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[config.networkTimeout]}
                    onValueChange={(value) => updateConfig('networkTimeout', value[0])}
                    min={5000}
                    max={60000}
                    step={5000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-green-300 font-medium">Retry Attempts</h4>
                      <p className="text-green-400/70 text-sm">Number of retry attempts for failed operations</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      {config.retryAttempts}
                    </Badge>
                  </div>
                  
                  <Slider
                    value={[config.retryAttempts]}
                    onValueChange={(value) => updateConfig('retryAttempts', value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-green-300 font-medium">Environment Variables</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded border border-green-500/20">
                      <span className="font-mono text-sm text-green-400">DATABASE_URL</span>
                      <Badge className="bg-green-500/20 text-green-400">SET</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded border border-green-500/20">
                      <span className="font-mono text-sm text-green-400">OPENAI_API_KEY</span>
                      <Badge className="bg-green-500/20 text-green-400">SET</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded border border-green-500/20">
                      <span className="font-mono text-sm text-green-400">PERPLEXITY_API_KEY</span>
                      <Badge className="bg-green-500/20 text-green-400">SET</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-green-300 font-medium">System Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800 rounded border border-green-500/20">
                      <div className="flex items-center space-x-2">
                        <Database className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-green-300 font-medium">Database</p>
                          <p className="text-green-400/70 text-sm">Connected</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded border border-green-500/20">
                      <div className="flex items-center space-x-2">
                        <Network className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-green-300 font-medium">Network</p>
                          <p className="text-green-400/70 text-sm">Stable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}