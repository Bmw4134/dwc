import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Eye, Brain, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface VisionDetection {
  timestamp: string;
  pattern_type: string;
  confidence: number;
  coordinates: { x: number; y: number; width: number; height: number };
  analysis: {
    candlestick_pattern: string;
    wick_analysis: string;
    rsi_level: number;
    volume_indication: string;
  };
}

interface OCRResult {
  text: string;
  confidence: number;
  position: { x: number; y: number };
  context: string;
}

export default function VisionView() {
  const [isRecording, setIsRecording] = useState(false);
  const [ocrActive, setOcrActive] = useState(false);
  const [screenshotInterval, setScreenshotInterval] = useState<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: visionData } = useQuery({
    queryKey: ['/api/vision/detections'],
    refetchInterval: 1000
  });

  const { data: ocrResults } = useQuery({
    queryKey: ['/api/vision/ocr-results'],
    refetchInterval: 5000
  });

  const { data: visionMetrics } = useQuery({
    queryKey: ['/api/multiview/vision/metrics'],
    refetchInterval: 500
  });

  const startVisionRecording = async () => {
    setIsRecording(true);
    try {
      await fetch('/api/multiview/vision/start-recording', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to start vision recording:', error);
    }
  };

  const stopVisionRecording = async () => {
    setIsRecording(false);
    try {
      await fetch('/api/multiview/vision/stop-recording', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to stop vision recording:', error);
    }
  };

  const startOCRCapture = async () => {
    setOcrActive(true);
    try {
      await fetch('/api/multiview/vision/start-ocr', {
        method: 'POST'
      });
      
      // Start 5-second interval OCR
      const interval = setInterval(async () => {
        try {
          await fetch('/api/multiview/vision/capture-screenshot', {
            method: 'POST'
          });
        } catch (error) {
          console.error('Screenshot capture failed:', error);
        }
      }, 5000);
      
      setScreenshotInterval(interval);
    } catch (error) {
      console.error('Failed to start OCR:', error);
    }
  };

  const stopOCRCapture = async () => {
    setOcrActive(false);
    if (screenshotInterval) {
      clearInterval(screenshotInterval);
      setScreenshotInterval(null);
    }
    
    try {
      await fetch('/api/multiview/vision/stop-ocr', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to stop OCR:', error);
    }
  };

  const renderDetectionOverlay = (detection: VisionDetection) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw detection box
    ctx.strokeStyle = detection.confidence > 0.8 ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      detection.coordinates.x,
      detection.coordinates.y,
      detection.coordinates.width,
      detection.coordinates.height
    );

    // Draw label
    ctx.fillStyle = detection.confidence > 0.8 ? '#10B981' : '#F59E0B';
    ctx.font = '12px Arial';
    ctx.fillText(
      `${detection.pattern_type} (${Math.round(detection.confidence * 100)}%)`,
      detection.coordinates.x,
      detection.coordinates.y - 5
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vision Intelligence View</h1>
            <p className="text-gray-300">OpenCV pattern recognition with real-time OCR analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isRecording ? "destructive" : "secondary"}>
              {isRecording ? "Recording Vision" : "Standby"}
            </Badge>
            <Badge variant={ocrActive ? "destructive" : "secondary"}>
              {ocrActive ? "OCR Active" : "OCR Standby"}
            </Badge>
            <Button 
              onClick={isRecording ? stopVisionRecording : startVisionRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isRecording ? "Stop Vision" : "Start Vision"}
            </Button>
            <Button 
              onClick={ocrActive ? stopOCRCapture : startOCRCapture}
              variant={ocrActive ? "destructive" : "outline"}
            >
              <Camera className="w-4 h-4 mr-2" />
              {ocrActive ? "Stop OCR" : "Start OCR"}
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pattern Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {visionMetrics?.pattern_confidence || 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-400">
                {visionMetrics?.detections_count || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">OCR Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {visionMetrics?.ocr_accuracy || 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Learning Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {visionMetrics?.learning_rate || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vision Canvas */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Computer Vision Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time pattern recognition on trading charts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-64 bg-gray-800 rounded border border-gray-600"
                />
                <div className="absolute top-2 left-2 space-y-1">
                  {visionData?.detections?.slice(0, 3).map((detection: VisionDetection, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {detection.pattern_type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Pattern Analysis */}
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-white">Latest Pattern Analysis</h4>
                {visionData?.detections?.[0] && (
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-white">
                        Pattern: {visionData.detections[0].analysis.candlestick_pattern}
                      </div>
                      <div className="text-white">
                        RSI: {visionData.detections[0].analysis.rsi_level}
                      </div>
                      <div className="text-gray-300">
                        Wick: {visionData.detections[0].analysis.wick_analysis}
                      </div>
                      <div className="text-gray-300">
                        Volume: {visionData.detections[0].analysis.volume_indication}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* OCR Results */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                OCR Text Recognition
              </CardTitle>
              <CardDescription className="text-gray-400">
                Automated text extraction every 5 seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {ocrResults?.results?.map((result: OCRResult, index: number) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {result.context}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {Math.round(result.confidence * 100)}% confident
                      </span>
                    </div>
                    <div className="text-sm text-white font-mono">
                      "{result.text}"
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Position: ({result.position.x}, {result.position.y})
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    No OCR results yet
                  </div>
                )}
              </div>
              
              {/* OCR Progress */}
              {ocrActive && (
                <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-4 h-4 text-purple-400 animate-pulse" />
                    <div className="flex-1">
                      <div className="text-sm text-white mb-1">Next screenshot in:</div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detection History */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Pattern Detection History</CardTitle>
            <CardDescription className="text-gray-400">
              Recent computer vision detections with confidence scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visionData?.detections?.map((detection: VisionDetection, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-4">
                    <Badge 
                      variant="outline" 
                      className={`${
                        detection.confidence > 0.8 ? 'border-green-500 text-green-400' :
                        detection.confidence > 0.6 ? 'border-yellow-500 text-yellow-400' :
                        'border-red-500 text-red-400'
                      }`}
                    >
                      {detection.pattern_type}
                    </Badge>
                    <div className="text-sm text-white">
                      {detection.analysis.candlestick_pattern}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      {Math.round(detection.confidence * 100)}% confidence
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(detection.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-400">
                  <Brain className="w-8 h-8 mx-auto mb-2" />
                  No pattern detections yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}