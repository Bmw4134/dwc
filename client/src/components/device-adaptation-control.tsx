import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { DeviceAdaptationVisualizer } from './device-adaptation-visualizer';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

export function DeviceAdaptationControl() {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const deviceInfo = useDeviceDetection();

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="h-4 w-4" />;
    if (deviceInfo.isTablet) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceLabel = () => {
    if (deviceInfo.isMobile) return 'Mobile';
    if (deviceInfo.isTablet) return 'Tablet';
    return 'Desktop';
  };

  return (
    <>
      {/* Floating Control Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowVisualizer(!showVisualizer)}
          className={`
            bg-black/80 backdrop-blur-sm border-blue-500/30 text-white hover:bg-black/90 
            transition-all duration-300 shadow-lg hover:shadow-xl
            ${showVisualizer ? 'ring-2 ring-blue-500/50' : ''}
          `}
        >
          <div className="flex items-center gap-2">
            {getDeviceIcon()}
            <span className="hidden sm:inline">{getDeviceLabel()}</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
              Live
            </Badge>
            {showVisualizer ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </div>
        </Button>
      </motion.div>

      {/* Device Adaptation Visualizer */}
      <DeviceAdaptationVisualizer
        isVisible={showVisualizer}
        onClose={() => setShowVisualizer(false)}
      />
    </>
  );
}

export default DeviceAdaptationControl;