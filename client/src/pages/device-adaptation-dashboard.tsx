import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Signal, 
  Battery,
  TrendingUp,
  Activity,
  Users,
  BarChart3,
  Zap,
  Settings,
  RefreshCw,
  Maximize,
  RotateCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeviceAdaptationDashboard() {
  const deviceInfo = useDeviceDetection();
  const [adaptationMetrics, setAdaptationMetrics] = useState({
    totalAdaptations: 0,
    performanceScore: 95,
    responsivenessScore: 98,
    touchOptimizationScore: 92,
    loadTime: 1.2,
    adaptationHistory: [] as Array<{
      timestamp: Date;
      change: string;
      performance: number;
      device: string;
    }>
  });

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAdaptationMetrics(prev => ({
        ...prev,
        totalAdaptations: prev.totalAdaptations + 1,
        performanceScore: Math.min(100, prev.performanceScore + Math.random() * 2 - 1),
        responsivenessScore: Math.min(100, prev.responsivenessScore + Math.random() * 1.5 - 0.75),
        touchOptimizationScore: Math.min(100, prev.touchOptimizationScore + Math.random() * 1.8 - 0.9),
        loadTime: Math.max(0.8, prev.loadTime + Math.random() * 0.4 - 0.2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Track device changes
  useEffect(() => {
    const newEntry = {
      timestamp: new Date(),
      change: `Optimized for ${deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'}`,
      performance: adaptationMetrics.performanceScore,
      device: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'
    };
    
    setAdaptationMetrics(prev => ({
      ...prev,
      adaptationHistory: [newEntry, ...prev.adaptationHistory.slice(0, 9)]
    }));
  }, [deviceInfo.isMobile, deviceInfo.isTablet, deviceInfo.isDesktop]);

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="h-5 w-5" />;
    if (deviceInfo.isTablet) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const getConnectionIcon = () => {
    switch (deviceInfo.connectionType) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case '4g': case '3g': return <Signal className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Device Adaptation Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time monitoring of enterprise mobile responsiveness
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Current Device Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getDeviceIcon()}
              Current Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}
            </div>
            <p className="text-xs text-muted-foreground">
              {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Adaptations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adaptationMetrics.totalAdaptations}</div>
            <p className="text-xs text-muted-foreground">
              Real-time optimizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(adaptationMetrics.performanceScore)}`}>
              {adaptationMetrics.performanceScore.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Load Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adaptationMetrics.loadTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">
              Average response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Optimization Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Responsiveness</span>
                <span className={getPerformanceColor(adaptationMetrics.responsivenessScore)}>
                  {adaptationMetrics.responsivenessScore.toFixed(1)}%
                </span>
              </div>
              <Progress value={adaptationMetrics.responsivenessScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Touch Optimization</span>
                <span className={getPerformanceColor(adaptationMetrics.touchOptimizationScore)}>
                  {adaptationMetrics.touchOptimizationScore.toFixed(1)}%
                </span>
              </div>
              <Progress value={adaptationMetrics.touchOptimizationScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Layout Adaptation</span>
                <span className="text-green-500">96.5%</span>
              </div>
              <Progress value={96.5} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gesture Recognition</span>
                <span className="text-green-500">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Device Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="font-medium">{deviceInfo.operatingSystem}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Browser</p>
                <p className="font-medium">{deviceInfo.browser}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pixel Ratio</p>
                <p className="font-medium">{deviceInfo.devicePixelRatio}x</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Connection</p>
                <div className="flex items-center gap-1">
                  {getConnectionIcon()}
                  <p className="font-medium capitalize">{deviceInfo.connectionType}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Orientation</p>
                <div className="flex items-center gap-1">
                  {!deviceInfo.isLandscape && <RotateCw className="h-3 w-3" />}
                  <p className="font-medium">{deviceInfo.isLandscape ? 'Landscape' : 'Portrait'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Touch Support</p>
                <p className="font-medium">{deviceInfo.touchSupport ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {deviceInfo.touchSupport && (
              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
                Touch Targets Enlarged
              </Badge>
            )}
            {!deviceInfo.hasHover && (
              <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300">
                Hover Effects Disabled
              </Badge>
            )}
            {deviceInfo.isMobile && (
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                Mobile Layout Active
              </Badge>
            )}
            {deviceInfo.isTablet && (
              <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300">
                Tablet Layout Active
              </Badge>
            )}
            {deviceInfo.isDesktop && (
              <Badge className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                Desktop Layout Active
              </Badge>
            )}
            {deviceInfo.operatingSystem === 'iOS' && (
              <Badge className="bg-gray-500/20 text-gray-700 dark:text-gray-300">
                iOS Safari Optimizations
              </Badge>
            )}
            {deviceInfo.operatingSystem === 'Android' && (
              <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                Android Chrome Optimizations
              </Badge>
            )}
            <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300">
              Gesture Navigation
            </Badge>
            <Badge className="bg-pink-500/20 text-pink-700 dark:text-pink-300">
              Dynamic Scaling
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Adaptation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Adaptations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adaptationMetrics.adaptationHistory.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{entry.change}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {entry.device}
                  </Badge>
                  <span className={`text-sm font-medium ${getPerformanceColor(entry.performance)}`}>
                    {entry.performance.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}