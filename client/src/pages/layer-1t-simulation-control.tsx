import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cpu, 
  Zap, 
  Brain, 
  Network,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Shield,
  GitBranch,
  Layers,
  Activity,
  Target,
  Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LayerSimulationStatus {
  currentLayer: number;
  totalLayers: number;
  simEchoStatus: string[];
  autonomousMode: boolean;
  forkingCapability: boolean;
}

interface SimulationResult {
  layersProcessed: number;
  entropyReduction: number;
  autonomousCapabilities: string[];
  forkingPotential: number;
}

interface DeploymentSweepResult {
  totalLayers: number;
  optimizationScore: number;
  deploymentVectors: number;
  autonomousForksCreated: number;
  systemReadiness: number;
}

export default function Layer1TSimulationControl() {
  const [status, setStatus] = useState<LayerSimulationStatus | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [sweepResult, setSweepResult] = useState<DeploymentSweepResult | null>(null);
  const [targetLayer, setTargetLayer] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchSimulationStatus();
    const interval = setInterval(fetchSimulationStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSimulationStatus = async () => {
    try {
      const response = await fetch('/api/autonomous/layer-simulation-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch simulation status:', error);
    }
  };

  const runLayerSimulation = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/autonomous/run-layer-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLayer })
      });
      
      const data = await response.json();
      if (data.success) {
        setSimulationResult(data.simulation);
        toast({
          title: "Simulation Complete",
          description: `Layer 1T simulation completed to Layer ${targetLayer}`
        });
      }
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to run layer simulation",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runDeploymentSweep = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/autonomous/deployment-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        setSweepResult(data.sweep);
        toast({
          title: "Deployment Sweep Complete",
          description: "Autonomous deployment optimization completed"
        });
      }
    } catch (error) {
      toast({
        title: "Sweep Error",
        description: "Failed to run deployment sweep",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (value: number, threshold: number = 0.8) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Layer 1T Simulation Control Center
          </h1>
          <p className="text-xl text-gray-300">
            Autonomous Deployment System with Entropy Compression & Memory-State Evolution
          </p>
          
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant={status?.autonomousMode ? "default" : "secondary"}>
              {status?.autonomousMode ? "Autonomous Mode Active" : "Autonomous Mode Inactive"}
            </Badge>
            <Badge variant={status?.forkingCapability ? "default" : "outline"}>
              {status?.forkingCapability ? "Fork Ready" : "Fork Pending"}
            </Badge>
            <Badge variant="outline">Layer {status?.currentLayer || 0}/{status?.totalLayers || 100}</Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="mb-8 bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              Simulation Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Target Layer</label>
                <Input
                  type="number"
                  value={targetLayer}
                  onChange={(e) => setTargetLayer(parseInt(e.target.value))}
                  min="1"
                  max="1000"
                  className="bg-black/30 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={runLayerSimulation} 
                  disabled={isRunning} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isRunning ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Run Simulation
                </Button>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={runDeploymentSweep} 
                  disabled={isRunning} 
                  variant="outline" 
                  className="w-full border-purple-500 text-purple-300 hover:bg-purple-900/30"
                >
                  <Network className="h-4 w-4 mr-2" />
                  Deployment Sweep
                </Button>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={fetchSimulationStatus} 
                  variant="outline" 
                  className="w-full border-gray-500 text-gray-300 hover:bg-gray-800/30"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-purple-600">Simulation</TabsTrigger>
            <TabsTrigger value="echo-layers" className="data-[state=active]:bg-purple-600">SimEcho Layers</TabsTrigger>
            <TabsTrigger value="deployment" className="data-[state=active]:bg-purple-600">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* System Status */}
              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Layer</span>
                    <span className="text-white font-bold">{status?.currentLayer || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Layers</span>
                    <span className="text-white font-bold">{status?.totalLayers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Autonomous Mode</span>
                    <Badge variant={status?.autonomousMode ? "default" : "secondary"}>
                      {status?.autonomousMode ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Fork Capability</span>
                    <Badge variant={status?.forkingCapability ? "default" : "outline"}>
                      {status?.forkingCapability ? "Ready" : "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Entropy Compression */}
              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gauge className="h-5 w-5 mr-2" />
                    Entropy Compression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getStatusColor(simulationResult?.entropyReduction || 0)}`}>
                      {((simulationResult?.entropyReduction || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Compression Ratio</div>
                    <Progress 
                      value={(simulationResult?.entropyReduction || 0) * 100} 
                      className="mt-4 h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Memory State Evolution */}
              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Memory Evolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getStatusColor(sweepResult?.systemReadiness || 0)}`}>
                      {((sweepResult?.systemReadiness || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">System Readiness</div>
                    <Progress 
                      value={(sweepResult?.systemReadiness || 0) * 100} 
                      className="mt-4 h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            {simulationResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Layers Processed</span>
                      <span className="text-white font-bold">{simulationResult.layersProcessed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Entropy Reduction</span>
                      <span className="text-white font-bold">{(simulationResult.entropyReduction * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Forking Potential</span>
                      <span className="text-white font-bold">{(simulationResult.forkingPotential * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Autonomous Capabilities</span>
                      <span className="text-white font-bold">{simulationResult.autonomousCapabilities.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Autonomous Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {simulationResult.autonomousCapabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {capability.replace('layer_', 'Layer ').replace('_autonomous', '')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12 bg-black/20 border-purple-500/30">
                <CardContent>
                  <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2 text-white">No Simulation Data</h3>
                  <p className="text-gray-400 mb-4">Run a layer simulation to see results</p>
                  <Button onClick={runLayerSimulation} disabled={isRunning}>
                    Start Simulation
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="echo-layers" className="mt-6">
            <div className="space-y-4">
              {status?.simEchoStatus?.map((echoStatus, index) => (
                <Card key={index} className="bg-black/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GitBranch className="h-5 w-5 mr-3 text-purple-400" />
                        <span className="text-white font-medium">{echoStatus}</span>
                      </div>
                      <Badge variant="outline">SimEcho Layer</Badge>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="text-center py-12 bg-black/20 border-purple-500/30">
                  <CardContent>
                    <Network className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2 text-white">No SimEcho Data</h3>
                    <p className="text-gray-400">SimEcho layers will appear after simulation</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="mt-6">
            {sweepResult ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      Optimization Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className={`text-3xl font-bold ${getStatusColor(sweepResult.optimizationScore)}`}>
                      {(sweepResult.optimizationScore * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-center">
                      <GitBranch className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      Autonomous Forks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-white">
                      {sweepResult.autonomousForksCreated}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      System Readiness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className={`text-3xl font-bold ${getStatusColor(sweepResult.systemReadiness)}`}>
                      {(sweepResult.systemReadiness * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12 bg-black/20 border-purple-500/30">
                <CardContent>
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2 text-white">No Deployment Data</h3>
                  <p className="text-gray-400 mb-4">Run deployment sweep to see optimization results</p>
                  <Button onClick={runDeploymentSweep} disabled={isRunning}>
                    Start Deployment Sweep
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Status Alert */}
        {isRunning && (
          <Alert className="mt-6 bg-purple-900/30 border-purple-500">
            <Zap className="h-4 w-4" />
            <AlertDescription className="text-white">
              Layer 1T simulation is running. This may take several minutes to complete.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}