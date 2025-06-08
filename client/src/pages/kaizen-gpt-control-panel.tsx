import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Terminal, 
  GitBranch, 
  Package,
  RefreshCw,
  Settings,
  FileText,
  Zap,
  Shield,
  Database,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KaizenConfig {
  funding: {
    targetAmount: number;
    coOwnerCreditScore: number;
    projectedGrowth: number;
    confidenceLevel: number;
  };
  deployment: {
    isProduction: boolean;
    safeMode: boolean;
    emergencyOverride: string;
  };
  automation: {
    layerSimulationEnabled: boolean;
    autonomousMode: boolean;
    entropyThreshold: number;
  };
}

interface FundingStatus {
  activeModules: string[];
  totalLogs: number;
  lastActivity: string;
  safeMode: boolean;
}

interface FundingReport {
  summary: string;
  recommendations: string[];
  nextSteps: string[];
  metrics: {
    totalActions: number;
    successRate: number;
    averageProcessingTime: number;
    systemReadiness: number;
  };
}

export default function KaizenGPTControlPanel() {
  const [config, setConfig] = useState<KaizenConfig | null>(null);
  const [status, setStatus] = useState<FundingStatus | null>(null);
  const [report, setReport] = useState<FundingReport | null>(null);
  const [moduleName, setModuleName] = useState('');
  const [moduleKind, setModuleKind] = useState('module');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(loadStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    await Promise.all([loadConfig(), loadStatus(), loadReport()]);
  };

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/kaizen/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/kaizen/funding-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const loadReport = async () => {
    try {
      const response = await fetch('/api/kaizen/funding-report');
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    }
  };

  const scaffoldModule = async () => {
    if (!moduleName.trim()) {
      toast({
        title: "Module Name Required",
        description: "Please enter a module name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/kaizen/scaffold-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: moduleName, kind: moduleKind })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Module Scaffolded",
          description: data.message
        });
        setModuleName('');
        await loadStatus();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Scaffolding Failed",
        description: "Failed to create module",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/kaizen/refresh-preview', {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Preview Refreshed",
          description: "System preview has been refreshed"
        });
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<KaizenConfig>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/kaizen/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Configuration Updated",
          description: "System configuration has been updated"
        });
        await loadConfig();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 0.9) return 'text-green-600';
    if (readiness >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Kaizen GPT Control Panel
          </h1>
          <p className="text-xl text-gray-300">
            DWC Funding Dashboard Bundle • Module Scaffolding • Recovery Engine
          </p>
          
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant={status?.safeMode ? "default" : "destructive"}>
              {status?.safeMode ? "Safe Mode Active" : "Safe Mode Disabled"}
            </Badge>
            <Badge variant="outline">
              {status?.activeModules.length || 0} Active Modules
            </Badge>
            <Badge variant="outline">
              {status?.totalLogs || 0} Log Entries
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Terminal className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Module name"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="bg-black/30 border-gray-600 text-white"
                />
                <select 
                  value={moduleKind} 
                  onChange={(e) => setModuleKind(e.target.value)}
                  className="px-3 py-2 bg-black/30 border border-gray-600 rounded text-white"
                >
                  <option value="module">Module</option>
                  <option value="handler">Handler</option>
                  <option value="service">Service</option>
                  <option value="engine">Engine</option>
                </select>
              </div>
              <Button 
                onClick={scaffoldModule} 
                disabled={isLoading} 
                className="bg-purple-600 hover:bg-purple-700 h-full"
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Package className="h-4 w-4 mr-2" />
                )}
                Scaffold Module
              </Button>
              <Button 
                onClick={refreshPreview} 
                disabled={isLoading} 
                variant="outline" 
                className="border-purple-500 text-purple-300 hover:bg-purple-900/30 h-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Preview
              </Button>
              <Button 
                onClick={loadInitialData} 
                variant="outline" 
                className="border-gray-500 text-gray-300 hover:bg-gray-800/30 h-full"
              >
                <Activity className="h-4 w-4 mr-2" />
                Reload Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-purple-600">Modules</TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-purple-600">Configuration</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    System Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-3xl font-bold ${getReadinessColor(report?.metrics.systemReadiness || 0)}`}>
                    {((report?.metrics.systemReadiness || 0) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    Active Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {status?.activeModules.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {((report?.metrics.successRate || 0) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    Total Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {report?.metrics.totalActions || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {config && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Funding Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Target Amount:</span>
                      <span className="text-white font-bold">${config.funding.targetAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credit Score:</span>
                      <span className="text-white font-bold">{config.funding.coOwnerCreditScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Growth:</span>
                      <span className="text-white font-bold">{config.funding.projectedGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Level:</span>
                      <span className="text-white font-bold">{config.funding.confidenceLevel}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Deployment Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Environment:</span>
                      <Badge variant={config.deployment.isProduction ? "destructive" : "default"}>
                        {config.deployment.isProduction ? "Production" : "Development"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Safe Mode:</span>
                      <Badge variant={config.deployment.safeMode ? "default" : "destructive"}>
                        {config.deployment.safeMode ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Override:</span>
                      <span className="text-white font-mono text-xs">
                        {config.deployment.emergencyOverride.substring(0, 8)}...
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Automation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Layer Simulation:</span>
                      <Badge variant={config.automation.layerSimulationEnabled ? "default" : "outline"}>
                        {config.automation.layerSimulationEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Autonomous Mode:</span>
                      <Badge variant={config.automation.autonomousMode ? "default" : "outline"}>
                        {config.automation.autonomousMode ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Entropy Threshold:</span>
                      <span className="text-white font-bold">{config.automation.entropyThreshold}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="modules" className="mt-6">
            <div className="space-y-4">
              {status?.activeModules?.map((module, index) => (
                <Card key={index} className="bg-black/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GitBranch className="h-5 w-5 mr-3 text-purple-400" />
                        <span className="text-white font-medium">{module}</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="text-center py-12 bg-black/20 border-purple-500/30">
                  <CardContent>
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2 text-white">No Modules Found</h3>
                    <p className="text-gray-400">Scaffold a module to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            {config && (
              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-gray-300">Target Amount ($)</label>
                        <Input
                          type="number"
                          value={config.funding.targetAmount}
                          onChange={(e) => setConfig({
                            ...config,
                            funding: { ...config.funding, targetAmount: parseInt(e.target.value) || 0 }
                          })}
                          className="bg-black/30 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-gray-300">Credit Score</label>
                        <Input
                          type="number"
                          value={config.funding.coOwnerCreditScore}
                          onChange={(e) => setConfig({
                            ...config,
                            funding: { ...config.funding, coOwnerCreditScore: parseInt(e.target.value) || 0 }
                          })}
                          className="bg-black/30 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => updateConfig(config)} 
                      disabled={isLoading} 
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Update Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            {report && (
              <div className="space-y-6">
                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      System Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                      {report.summary}
                    </pre>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-300">
                        {report.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-300">
                        {report.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-400 mr-2">→</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Status Alert */}
        {status?.lastActivity && (
          <Alert className="mt-6 bg-purple-900/30 border-purple-500">
            <Activity className="h-4 w-4" />
            <AlertDescription className="text-white">
              Last activity: {new Date(status.lastActivity).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}