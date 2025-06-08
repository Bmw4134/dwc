import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2,
  VolumeX,
  Camera,
  Share2,
  Download,
  Settings,
  Eye,
  Mic
} from 'lucide-react';

interface PlaybackState {
  isPlaying: boolean;
  speed: number;
  progress: number;
  volume: number;
  isMuted: boolean;
  currentFrame: number;
  totalFrames: number;
}

interface QuantumSnapshot {
  id: string;
  timestamp: number;
  name: string;
  data: any;
  thumbnail: string;
  duration: number;
  speed: number;
}

export const QuantumPlaybackControls = ({
  onSpeedChange,
  onPlayStateChange,
  onSnapshotCapture,
  onVoiceNarration,
  isRecording = false
}: {
  onSpeedChange?: (speed: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onSnapshotCapture?: (snapshot: QuantumSnapshot) => void;
  onVoiceNarration?: (enabled: boolean) => void;
  isRecording?: boolean;
}) => {
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    speed: 1.0,
    progress: 0,
    volume: 0.8,
    isMuted: false,
    currentFrame: 0,
    totalFrames: 100
  });

  const [isNarrationEnabled, setIsNarrationEnabled] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulate playback progress
  useEffect(() => {
    if (playback.isPlaying) {
      intervalRef.current = setInterval(() => {
        setPlayback(prev => {
          const newFrame = prev.currentFrame + prev.speed;
          const newProgress = (newFrame / prev.totalFrames) * 100;
          
          if (newFrame >= prev.totalFrames) {
            onPlayStateChange?.(false);
            return { ...prev, isPlaying: false, currentFrame: 0, progress: 0 };
          }
          
          return { ...prev, currentFrame: newFrame, progress: newProgress };
        });
      }, 50 / playback.speed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playback.isPlaying, playback.speed, onPlayStateChange]);

  const handlePlay = () => {
    const newState = !playback.isPlaying;
    setPlayback(prev => ({ ...prev, isPlaying: newState }));
    onPlayStateChange?.(newState);
  };

  const handleStop = () => {
    setPlayback(prev => ({ ...prev, isPlaying: false, currentFrame: 0, progress: 0 }));
    onPlayStateChange?.(false);
  };

  const handleSpeedChange = (newSpeed: number[]) => {
    const speed = newSpeed[0];
    setPlayback(prev => ({ ...prev, speed }));
    onSpeedChange?.(speed);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volume = newVolume[0];
    setPlayback(prev => ({ ...prev, volume, isMuted: volume === 0 }));
  };

  const handleProgressChange = (newProgress: number[]) => {
    const progress = newProgress[0];
    const currentFrame = (progress / 100) * playback.totalFrames;
    setPlayback(prev => ({ ...prev, progress, currentFrame }));
  };

  const handleSnapshot = () => {
    const snapshot: QuantumSnapshot = {
      id: `snapshot_${Date.now()}`,
      timestamp: Date.now(),
      name: `Quantum State ${new Date().toLocaleTimeString()}`,
      data: { frame: playback.currentFrame, speed: playback.speed },
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMxZTI5M2IiLz48L3N2Zz4=',
      duration: playback.progress,
      speed: playback.speed
    };
    
    onSnapshotCapture?.(snapshot);
  };

  const handleVoiceNarration = () => {
    const newState = !isNarrationEnabled;
    setIsNarrationEnabled(newState);
    onVoiceNarration?.(newState);
  };

  const speedPresets = [0.25, 0.5, 1.0, 1.5, 2.0, 4.0];

  return (
    <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700 text-white">
      <CardContent className="p-4 space-y-4">
        
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>{Math.floor(playback.currentFrame)}/{playback.totalFrames} frames</span>
            <span>{(playback.progress).toFixed(1)}%</span>
          </div>
          <Slider
            value={[playback.progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPlayback(prev => ({ ...prev, currentFrame: Math.max(0, prev.currentFrame - 10) }))}
              className="text-white hover:bg-slate-800"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              className="text-white hover:bg-slate-800"
            >
              {playback.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              className="text-white hover:bg-slate-800"
            >
              <Square className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPlayback(prev => ({ ...prev, currentFrame: Math.min(prev.totalFrames, prev.currentFrame + 10) }))}
              className="text-white hover:bg-slate-800"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-blue-900/30 border-blue-600">
              {playback.speed}x
            </Badge>
            
            {isRecording && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="flex items-center space-x-1"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-red-400">REC</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Animation Speed</span>
            <div className="flex space-x-1">
              {speedPresets.map((preset) => (
                <Button
                  key={preset}
                  variant={playback.speed === preset ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleSpeedChange([preset])}
                  className={`text-xs px-2 py-1 ${
                    playback.speed === preset 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {preset}x
                </Button>
              ))}
            </div>
          </div>
          <Slider
            value={[playback.speed]}
            onValueChange={handleSpeedChange}
            min={0.1}
            max={5.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Advanced Controls Toggle */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceNarration}
              className={`${
                isNarrationEnabled 
                  ? 'text-green-400 bg-green-900/30' 
                  : 'text-slate-400 hover:text-white'
              } hover:bg-slate-800`}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSnapshot}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Controls Panel */}
        <AnimatePresence>
          {showAdvancedControls && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-slate-700"
            >
              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Audio Volume</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPlayback(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                    className="text-slate-400 hover:text-white"
                  >
                    {playback.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Slider
                  value={[playback.isMuted ? 0 : playback.volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Visualization Options */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Frame Rate Display */}
              <div className="flex justify-between text-xs text-slate-400">
                <span>Frame Rate: {(60 * playback.speed).toFixed(1)} FPS</span>
                <span>Duration: {(playback.totalFrames / 60).toFixed(1)}s</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};