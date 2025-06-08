import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Monitor, 
  Play, 
  Square, 
  RotateCcw, 
  Eye, 
  MousePointer,
  Activity,
  Globe,
  Zap
} from 'lucide-react';

interface ObserverStatus {
  health: number;
  confidence: number;
  driftDetection: boolean;
  domTracking: boolean;
  lastValidation: string;
  deploymentReady: boolean;
}

export default function NexusObserver() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState('http://localhost:5000');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch observer status
  const { data: observerStatus } = useQuery({
    queryKey: ['/api/nexus/observer/status'],
    refetchInterval: 5000
  });

  // Start validation mutation
  const validateMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/nexus/observer/validate'),
    onSuccess: () => {
      toast({
        title: "Validation Complete",
        description: "System validation completed successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/observer/status'] });
    },
    onError: () => {
      toast({
        title: "Validation Failed",
        description: "System validation encountered issues",
        variant: "destructive"
      });
    }
  });

  const status = observerStatus?.data as ObserverStatus;

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Monitor className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-green-300">NEXUS Observer</h1>
              <p className="text-green-400/70 font-mono text-sm">Human Simulation & Browser Automation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              variant={status?.deploymentReady ? "default" : "secondary"}
              className={status?.deploymentReady ? "bg-green-500 text-black" : "bg-gray-600 text-gray-300"}
            >
              {status?.deploymentReady ? "READY" : "INITIALIZING"}
            </Badge>
            <Button
              onClick={() => validateMutation.mutate()}
              disabled={validateMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-black"
            >
              {validateMutation.isPending ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Validate System
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">System Health</p>
                  <p className="text-2xl font-bold text-green-300">
                    {status?.health?.toFixed(1) || 0}%
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Confidence</p>
                  <p className="text-2xl font-bold text-green-300">
                    {((status?.confidence || 0) * 100).toFixed(1)}%
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Drift Detection</p>
                  <p className="text-2xl font-bold text-green-300">
                    {status?.driftDetection ? "ON" : "OFF"}
                  </p>
                </div>
                <MousePointer className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">DOM Tracking</p>
                  <p className="text-2xl font-bold text-green-300">
                    {status?.domTracking ? "ACTIVE" : "INACTIVE"}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="browser" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-green-500/20">
            <TabsTrigger value="browser" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Browser Session
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Human Simulation
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Embedded Browser Session</span>
                </CardTitle>
                <CardDescription className="text-green-400/70">
                  Live browser view integrated directly in the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL Controls */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={browserUrl}
                    onChange={(e) => setBrowserUrl(e.target.value)}
                    className="flex-1 bg-gray-800 border border-green-500/20 rounded-lg px-3 py-2 text-green-300 focus:outline-none focus:border-green-500"
                    placeholder="Enter URL to navigate..."
                  />
                  <Button
                    onClick={() => {
                      // Update iframe src
                      const iframe = document.getElementById('browser-iframe') as HTMLIFrameElement;
                      if (iframe) iframe.src = browserUrl;
                    }}
                    className="bg-green-600 hover:bg-green-700 text-black"
                  >
                    Navigate
                  </Button>
                </div>

                {/* Embedded Browser */}
                <div className="w-full h-[600px] border border-green-500/20 rounded-lg overflow-hidden bg-gray-800">
                  <iframe
                    id="browser-iframe"
                    src={browserUrl}
                    className="w-full h-full"
                    style={{ backgroundColor: '#1f2937' }}
                    title="Embedded Browser Session"
                  />
                </div>

                {/* Session Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                  <div className="text-sm text-green-400/70 font-mono">
                    Session: {activeSession || 'No active session'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300">Human Behavior Simulation</CardTitle>
                <CardDescription className="text-green-400/70">
                  Automated user interaction patterns and testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-green-300 font-medium">Mouse Movement</h4>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">ENABLED</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-green-300 font-medium">Click Simulation</h4>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">ENABLED</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-green-300 font-medium">Typing Patterns</h4>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">ENABLED</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-green-300 font-medium">Scroll Behavior</h4>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">ENABLED</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-500/20">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-black">
                    <Play className="w-4 h-4 mr-2" />
                    Start Human Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300">Live System Monitoring</CardTitle>
                <CardDescription className="text-green-400/70">
                  Real-time observer metrics and performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-green-400/70">Last Validation:</span>
                      <span className="text-green-300">
                        {status?.lastValidation ? new Date(status.lastValidation).toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400/70">Deployment Ready:</span>
                      <span className={status?.deploymentReady ? "text-green-300" : "text-yellow-400"}>
                        {status?.deploymentReady ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>

                  <div className="h-32 bg-gray-800 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400/70 text-sm mb-2">Console Output:</div>
                    <div className="text-xs font-mono text-green-300 space-y-1">
                      <div>🧠 NEXUS Observer + Human Simulation Core: ACTIVE</div>
                      <div>📊 Drift detection: ACTIVE</div>
                      <div>👁️ Observer mode: MONITORING</div>
                      <div>✅ Auto-authorization: GRANTED</div>
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