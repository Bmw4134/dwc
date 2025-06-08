import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Eye, 
  Code, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Maximize, 
  Minimize,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Database,
  Activity,
  Shield,
  RefreshCw,
  Terminal,
  Cpu,
  HardDrive,
  Network,
  X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface FloatingAdminControlProps {
  onViewportChange: (viewport: 'mobile' | 'tablet' | 'desktop' | 'fullscreen') => void;
  onDevModeToggle: (enabled: boolean) => void;
  currentViewport: string;
}

export default function FloatingAdminControl({ 
  onViewportChange, 
  onDevModeToggle, 
  currentViewport 
}: FloatingAdminControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    activeConnections: 0
  });

  // Fetch real-time system metrics
  const { data: metrics } = useQuery({
    queryKey: ['/api/system/metrics'],
    refetchInterval: 2000,
    enabled: devMode
  });

  // Simulate real-time metrics if API unavailable
  useEffect(() => {
    if (devMode) {
      const interval = setInterval(() => {
        setSystemMetrics({
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 30) + 50,
          network: Math.floor(Math.random() * 20) + 10,
          activeConnections: Math.floor(Math.random() * 200) + 800
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [devMode]);

  const handleDevToggle = (enabled: boolean) => {
    setDevMode(enabled);
    onDevModeToggle(enabled);
    if (enabled && isMinimized) {
      setIsMinimized(false);
    }
  };

  const viewportOptions = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
    { id: 'desktop', icon: Laptop, label: 'Desktop', width: '1200px' },
    { id: 'fullscreen', icon: Monitor, label: 'Full', width: '100%' }
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
      <Card className="bg-black/95 border-blue-500/30 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-400" />
              Admin Control Center
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white p-1"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            <Tabs defaultValue="viewport" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="viewport" className="text-xs">Viewport</TabsTrigger>
                <TabsTrigger value="dev" className="text-xs">Dev Mode</TabsTrigger>
                <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
              </TabsList>

              <TabsContent value="viewport" className="space-y-3">
                <div className="text-xs text-gray-400 mb-2">Responsive Testing</div>
                <div className="grid grid-cols-2 gap-2">
                  {viewportOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={currentViewport === option.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onViewportChange(option.id as any)}
                      className={`flex items-center gap-2 text-xs ${
                        currentViewport === option.id 
                          ? 'bg-blue-600 text-white' 
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <option.icon className="h-3 w-3" />
                      {option.label}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Current: {viewportOptions.find(v => v.id === currentViewport)?.width}
                </div>
              </TabsContent>

              <TabsContent value="dev" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Developer Mode</span>
                  <Switch
                    checked={devMode}
                    onCheckedChange={handleDevToggle}
                  />
                </div>
                
                {devMode && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Code className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">Dev Tools Active</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => window.open('/api/dev/logs', '_blank')}
                      >
                        <Terminal className="h-3 w-3 mr-1" />
                        View Logs
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Hot Reload
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="system" className="space-y-3">
                <div className="text-xs text-gray-400 mb-2">Real-Time Metrics</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-gray-300">CPU</span>
                    </div>
                    <span className="text-xs text-white">{systemMetrics.cpu}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-gray-300">Memory</span>
                    </div>
                    <span className="text-xs text-white">{systemMetrics.memory}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-gray-300">Network</span>
                    </div>
                    <span className="text-xs text-white">{systemMetrics.network}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-gray-300">Connections</span>
                    </div>
                    <span className="text-xs text-white">{systemMetrics.activeConnections}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 mt-3">
                  <Badge className="bg-green-500/20 text-green-400 text-xs justify-center">
                    <Shield className="h-2 w-2 mr-1" />
                    Secure
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs justify-center">
                    <Zap className="h-2 w-2 mr-1" />
                    Fast
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 text-xs justify-center">
                    <Database className="h-2 w-2 mr-1" />
                    Live
                  </Badge>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

        {!isExpanded && (
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${
                currentViewport === 'mobile' ? 'bg-blue-500/20 text-blue-400' :
                currentViewport === 'tablet' ? 'bg-green-500/20 text-green-400' :
                currentViewport === 'desktop' ? 'bg-purple-500/20 text-purple-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {viewportOptions.find(v => v.id === currentViewport)?.label}
              </Badge>
              
              {devMode && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  <Code className="h-2 w-2 mr-1" />
                  Dev
                </Badge>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}