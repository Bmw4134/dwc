import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  Signal, 
  Battery,
  Eye,
  Maximize,
  RotateCw,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceAdaptationVisualizerProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function DeviceAdaptationVisualizer({ isVisible = false, onClose }: DeviceAdaptationVisualizerProps) {
  const deviceInfo = useDeviceDetection();
  const [showDetails, setShowDetails] = useState(false);
  const [adaptationHistory, setAdaptationHistory] = useState<Array<{
    timestamp: Date;
    change: string;
    device: string;
  }>>([]);

  // Track device changes and adaptations
  useEffect(() => {
    const newEntry = {
      timestamp: new Date(),
      change: `Interface optimized for ${deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'}`,
      device: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop'
    };
    
    setAdaptationHistory(prev => [newEntry, ...prev.slice(0, 4)]);
  }, [deviceInfo.isMobile, deviceInfo.isTablet, deviceInfo.isDesktop, deviceInfo.isLandscape]);

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

  const getOptimizationBadges = () => {
    const badges = [];
    
    if (deviceInfo.touchSupport) badges.push({ label: 'Touch Optimized', color: 'bg-blue-500' });
    if (!deviceInfo.hasHover) badges.push({ label: 'No-Hover UI', color: 'bg-orange-500' });
    if (deviceInfo.isMobile) badges.push({ label: 'Mobile Layout', color: 'bg-green-500' });
    if (deviceInfo.isTablet) badges.push({ label: 'Tablet Layout', color: 'bg-purple-500' });
    if (deviceInfo.isDesktop) badges.push({ label: 'Desktop Layout', color: 'bg-indigo-500' });
    if (deviceInfo.operatingSystem === 'iOS') badges.push({ label: 'iOS Safari', color: 'bg-gray-500' });
    if (deviceInfo.operatingSystem === 'Android') badges.push({ label: 'Android Chrome', color: 'bg-yellow-500' });
    
    return badges;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-4 right-4 sm:top-4 sm:right-4 z-50 w-80 max-w-[90vw] max-h-[80vh] overflow-y-auto"
      >
        <Card className="bg-black/90 backdrop-blur-sm border border-blue-500/30 text-white shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {getDeviceIcon()}
                Device Adaptation
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Current Device Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Device Type</span>
                <span className="font-medium">
                  {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Screen Size</span>
                <span className="font-medium">
                  {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Orientation</span>
                <div className="flex items-center gap-1">
                  {!deviceInfo.isLandscape && <RotateCw className="h-3 w-3" />}
                  <span className="font-medium">
                    {deviceInfo.isLandscape ? 'Landscape' : 'Portrait'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Connection</span>
                <div className="flex items-center gap-1">
                  {getConnectionIcon()}
                  <span className="font-medium capitalize">
                    {deviceInfo.connectionType}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Optimizations */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-medium">Active Optimizations</div>
              <div className="flex flex-wrap gap-1">
                {getOptimizationBadges().map((badge, index) => (
                  <Badge
                    key={index}
                    className={`${badge.color} text-white text-xs px-2 py-1`}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Touch Target Sizes */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-medium">Interface Scaling</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-400">Touch Targets</div>
                  <div className="font-medium">
                    {deviceInfo.isMobile ? '48px' : deviceInfo.isTablet ? '40px' : '32px'}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-400">Grid Columns</div>
                  <div className="font-medium">
                    {deviceInfo.isMobile ? '1' : deviceInfo.isTablet ? '2' : '3'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Adaptations */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full text-xs h-6 text-gray-400 hover:text-white"
              >
                <Eye className="h-3 w-3 mr-1" />
                {showDetails ? 'Hide' : 'Show'} Adaptation History
              </Button>
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-1"
                  >
                    {adaptationHistory.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/30 rounded p-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">{entry.change}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.device}
                          </Badge>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {entry.timestamp.toLocaleTimeString()}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-medium">Performance</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-400">Pixel Ratio</div>
                  <div className="font-medium">{deviceInfo.devicePixelRatio}x</div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-400">Platform</div>
                  <div className="font-medium">{deviceInfo.operatingSystem}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeviceAdaptationVisualizer;