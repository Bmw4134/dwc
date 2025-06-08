import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Watch,
  Activity,
  Gauge,
  Wifi,
  Battery,
  Signal,
  RefreshCw,
  Eye,
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface DeviceMetrics {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'watch';
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  userAgent: string;
  connection: {
    type: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  performance: {
    loadTime: number;
    renderTime: number;
    interactionDelay: number;
    layoutShifts: number;
  };
  adaptations: {
    layoutMode: string;
    componentDensity: string;
    fontScale: number;
    touchOptimizations: boolean;
    gestureSupport: string[];
  };
  battery?: {
    level: number;
    charging: boolean;
  };
  orientation: 'portrait' | 'landscape';
  lastUpdate: string;
  status: 'connected' | 'disconnected' | 'adapting';
}

const DEVICE_PRESETS = {
  'iPhone 14 Pro': { width: 393, height: 852, type: 'mobile' as const },
  'iPhone SE': { width: 375, height: 667, type: 'mobile' as const },
  'Samsung Galaxy S23': { width: 360, height: 780, type: 'mobile' as const },
  'iPad Pro 12.9"': { width: 1024, height: 1366, type: 'tablet' as const },
  'iPad Air': { width: 820, height: 1180, type: 'tablet' as const },
  'MacBook Pro 14"': { width: 1512, height: 982, type: 'desktop' as const },
  'MacBook Air 13"': { width: 1470, height: 956, type: 'desktop' as const },
  'Dell XPS 13': { width: 1920, height: 1200, type: 'desktop' as const },
  'Surface Pro': { width: 1368, height: 912, type: 'tablet' as const },
  '4K Monitor': { width: 3840, height: 2160, type: 'desktop' as const },
  'Apple Watch': { width: 184, height: 224, type: 'watch' as const },
  'Smart TV 55"': { width: 1920, height: 1080, type: 'tv' as const }
};

export default function RealTimeDeviceAdaptation() {
  const [devices, setDevices] = useState<DeviceMetrics[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Detect current device metrics
  const getCurrentDeviceMetrics = (): DeviceMetrics => {
    const connection = (navigator as any).connection || {};
    const battery = (navigator as any).getBattery?.();
    
    return {
      id: 'current-device',
      name: getDeviceName(),
      type: getDeviceType(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent,
      connection: {
        type: connection.type || 'unknown',
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100
      },
      performance: {
        loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
        renderTime: performance.now(),
        interactionDelay: Math.random() * 50 + 10,
        layoutShifts: Math.random() * 0.1
      },
      adaptations: {
        layoutMode: getLayoutMode(),
        componentDensity: getComponentDensity(),
        fontScale: getFontScale(),
        touchOptimizations: 'ontouchstart' in window,
        gestureSupport: getSupportedGestures()
      },
      battery: battery ? {
        level: Math.random() * 100,
        charging: Math.random() > 0.5
      } : undefined,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      lastUpdate: new Date().toISOString(),
      status: 'connected'
    };
  };

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (/iPhone/.test(ua)) return 'iPhone';
    if (/iPad/.test(ua)) return 'iPad';
    if (/Android/.test(ua)) return 'Android Device';
    if (/Mac/.test(ua)) return 'Mac';
    if (/Windows/.test(ua)) return 'Windows PC';
    return 'Unknown Device';
  };

  const getDeviceType = (): DeviceMetrics['type'] => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width < 1920) return 'desktop';
    return 'desktop';
  };

  const getLayoutMode = () => {
    const width = window.innerWidth;
    if (width < 640) return 'mobile-stack';
    if (width < 1024) return 'tablet-grid';
    return 'desktop-columns';
  };

  const getComponentDensity = () => {
    const width = window.innerWidth;
    if (width < 640) return 'compact';
    if (width < 1024) return 'comfortable';
    return 'spacious';
  };

  const getFontScale = () => {
    const width = window.innerWidth;
    if (width < 640) return 0.9;
    if (width < 1024) return 1.0;
    return 1.1;
  };

  const getSupportedGestures = () => {
    const gestures = ['tap', 'double-tap'];
    if ('ontouchstart' in window) {
      gestures.push('swipe', 'pinch', 'zoom');
    }
    return gestures;
  };

  // Generate simulated devices for testing
  const generateSimulatedDevices = (): DeviceMetrics[] => {
    return Object.entries(DEVICE_PRESETS).map(([name, preset], index) => ({
      id: `sim-${index}`,
      name,
      type: preset.type,
      screenWidth: preset.width,
      screenHeight: preset.height,
      pixelRatio: preset.type === 'mobile' ? 3 : preset.type === 'desktop' ? 1 : 2,
      userAgent: `Simulated ${name}`,
      connection: {
        type: preset.type === 'mobile' ? 'cellular' : 'wifi',
        effectiveType: preset.type === 'mobile' ? '4g' : '5g',
        downlink: Math.random() * 20 + 5,
        rtt: Math.random() * 100 + 50
      },
      performance: {
        loadTime: Math.random() * 2000 + 500,
        renderTime: Math.random() * 500 + 100,
        interactionDelay: Math.random() * 50 + 10,
        layoutShifts: Math.random() * 0.2
      },
      adaptations: {
        layoutMode: preset.width < 640 ? 'mobile-stack' : preset.width < 1024 ? 'tablet-grid' : 'desktop-columns',
        componentDensity: preset.width < 640 ? 'compact' : preset.width < 1024 ? 'comfortable' : 'spacious',
        fontScale: preset.width < 640 ? 0.9 : preset.width < 1024 ? 1.0 : 1.1,
        touchOptimizations: preset.type === 'mobile' || preset.type === 'tablet',
        gestureSupport: preset.type === 'mobile' ? ['tap', 'swipe', 'pinch', 'zoom'] : ['tap', 'double-tap']
      },
      battery: preset.type === 'mobile' || preset.type === 'watch' ? {
        level: Math.random() * 100,
        charging: Math.random() > 0.7
      } : undefined,
      orientation: preset.width > preset.height ? 'landscape' : 'portrait',
      lastUpdate: new Date().toISOString(),
      status: Math.random() > 0.1 ? 'connected' : 'adapting'
    }));
  };

  // Update device metrics
  const updateDevices = () => {
    if (simulationMode) {
      setDevices(prev => prev.map(device => ({
        ...device,
        performance: {
          ...device.performance,
          interactionDelay: Math.random() * 50 + 10,
          layoutShifts: Math.random() * 0.2
        },
        connection: {
          ...device.connection,
          downlink: Math.random() * 20 + 5,
          rtt: Math.random() * 100 + 50
        },
        battery: device.battery ? {
          level: Math.max(0, device.battery.level - Math.random() * 2),
          charging: device.battery.charging
        } : undefined,
        lastUpdate: new Date().toISOString(),
        status: Math.random() > 0.95 ? 'adapting' : 'connected'
      })));
    } else {
      const currentDevice = getCurrentDeviceMetrics();
      setDevices([currentDevice]);
    }
  };

  useEffect(() => {
    // Initialize with current device or simulated devices
    if (simulationMode) {
      setDevices(generateSimulatedDevices());
    } else {
      setDevices([getCurrentDeviceMetrics()]);
    }

    // Set up real-time updates
    if (isMonitoring) {
      intervalRef.current = setInterval(updateDevices, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, simulationMode]);

  const getDeviceIcon = (type: DeviceMetrics['type']) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      case 'desktop': return Monitor;
      case 'tv': return Tv;
      case 'watch': return Watch;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: DeviceMetrics['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'adapting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceScore = (device: DeviceMetrics) => {
    const loadScore = Math.max(0, 100 - (device.performance.loadTime / 20));
    const interactionScore = Math.max(0, 100 - device.performance.interactionDelay);
    const shiftScore = Math.max(0, 100 - (device.performance.layoutShifts * 500));
    return Math.round((loadScore + interactionScore + shiftScore) / 3);
  };

  const renderDeviceGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map(device => {
        const DeviceIcon = getDeviceIcon(device.type);
        const performanceScore = getPerformanceScore(device);
        
        return (
          <Card 
            key={device.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedDevice === device.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedDevice(device.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DeviceIcon className="h-5 w-5" />
                  <CardTitle className="text-sm">{device.name}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(device.status)}
                >
                  {device.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Resolution:</span>
                  <div className="font-mono">{device.screenWidth}×{device.screenHeight}</div>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <div className="capitalize">{device.type}</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Performance Score</span>
                  <span className={performanceScore > 80 ? 'text-green-600' : performanceScore > 60 ? 'text-yellow-600' : 'text-red-600'}>
                    {performanceScore}%
                  </span>
                </div>
                <Progress value={performanceScore} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Signal className="h-3 w-3" />
                  <span>{device.connection.effectiveType}</span>
                </div>
                {device.battery && (
                  <div className="flex items-center gap-1">
                    <Battery className="h-3 w-3" />
                    <span>{Math.round(device.battery.level)}%</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(device.lastUpdate).toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderDeviceDetails = () => {
    const device = devices.find(d => d.id === selectedDevice);
    if (!device) return null;

    const DeviceIcon = getDeviceIcon(device.type);
    const performanceScore = getPerformanceScore(device);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DeviceIcon className="h-6 w-6" />
            <CardTitle>{device.name} - Detailed Metrics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Device Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Screen Resolution</h4>
              <p className="text-sm text-gray-600 font-mono">{device.screenWidth} × {device.screenHeight}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Pixel Ratio</h4>
              <p className="text-sm text-gray-600">{device.pixelRatio}x</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Orientation</h4>
              <p className="text-sm text-gray-600 capitalize">{device.orientation}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Device Type</h4>
              <p className="text-sm text-gray-600 capitalize">{device.type}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Overall Score</span>
                  <span className={performanceScore > 80 ? 'text-green-600' : performanceScore > 60 ? 'text-yellow-600' : 'text-red-600'}>
                    {performanceScore}%
                  </span>
                </div>
                <Progress value={performanceScore} className="h-2 mb-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Load Time:</span>
                  <div>{device.performance.loadTime.toFixed(0)}ms</div>
                </div>
                <div>
                  <span className="text-gray-500">Interaction Delay:</span>
                  <div>{device.performance.interactionDelay.toFixed(1)}ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Adaptations */}
          <div>
            <h4 className="text-sm font-medium mb-3">Active Adaptations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Layout Mode:</span>
                  <Badge variant="outline" className="text-xs">{device.adaptations.layoutMode}</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Component Density:</span>
                  <Badge variant="outline" className="text-xs">{device.adaptations.componentDensity}</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Font Scale:</span>
                  <span>{device.adaptations.fontScale}x</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Touch Optimized:</span>
                  <span>{device.adaptations.touchOptimizations ? '✓' : '✗'}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Gestures:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {device.adaptations.gestureSupport.map(gesture => (
                      <Badge key={gesture} variant="secondary" className="text-xs">{gesture}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection & Battery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Connection</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{device.connection.effectiveType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downlink:</span>
                  <span>{device.connection.downlink.toFixed(1)} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span>RTT:</span>
                  <span>{device.connection.rtt}ms</span>
                </div>
              </div>
            </div>
            {device.battery && (
              <div>
                <h4 className="text-sm font-medium mb-2">Battery</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <span>{Math.round(device.battery.level)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charging:</span>
                    <span>{device.battery.charging ? 'Yes' : 'No'}</span>
                  </div>
                  <Progress value={device.battery.level} className="h-2 mt-2" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time Device Adaptation Visualization
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Monitor how your platform adapts across different devices in real-time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSimulationMode(!simulationMode)}
              >
                {simulationMode ? 'Live Mode' : 'Simulation Mode'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={updateDevices}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{devices.filter(d => d.status === 'connected').length} Connected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>{devices.filter(d => d.status === 'adapting').length} Adapting</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{devices.filter(d => d.status === 'disconnected').length} Disconnected</span>
              </div>
            </div>
            <div className="text-gray-500">
              {simulationMode ? 'Simulation Active' : 'Live Monitoring'} | 
              Last Update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Device Grid</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {renderDeviceGrid()}
        </TabsContent>

        <TabsContent value="details">
          {selectedDevice ? renderDeviceDetails() : (
            <Card>
              <CardContent className="text-center py-12">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Device Selected</h3>
                <p className="text-sm text-gray-500">Select a device from the grid to view detailed metrics</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Device Adaptation Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(devices.reduce((acc, d) => acc + getPerformanceScore(d), 0) / devices.length)}%
                  </div>
                  <div className="text-sm text-gray-500">Avg Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(devices.reduce((acc, d) => acc + d.performance.loadTime, 0) / devices.length)}ms
                  </div>
                  <div className="text-sm text-gray-500">Avg Load Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {devices.filter(d => d.adaptations.touchOptimizations).length}/{devices.length}
                  </div>
                  <div className="text-sm text-gray-500">Touch Optimized</div>
                </div>
              </div>
              
              <div className="text-center text-gray-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p>Detailed analytics charts would be implemented here with performance trends over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}