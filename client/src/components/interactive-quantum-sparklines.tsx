import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Activity,
  Zap,
  TrendingUp,
  BarChart3,
  Gauge,
  Cpu,
  Database,
  Globe,
  Users,
  Timer,
  Target,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface QuantumMetric {
  id: string;
  name: string;
  value: number;
  trend: number[];
  quantumState: 'coherent' | 'entangled' | 'superposition' | 'collapsed';
  performanceIndex: number;
  criticalThreshold: number;
  unit: string;
  color: string;
}

interface SparklineData {
  timestamp: number;
  value: number;
  quantumFluctuation: number;
  userLoad: number;
}

const QUANTUM_METRICS: QuantumMetric[] = [
  {
    id: 'qcpu',
    name: 'Q-CPU',
    value: 87.3,
    trend: [],
    quantumState: 'coherent',
    performanceIndex: 98.7,
    criticalThreshold: 85,
    unit: '%',
    color: '#3b82f6'
  },
  {
    id: 'qmem',
    name: 'Q-Memory',
    value: 73.2,
    trend: [],
    quantumState: 'entangled',
    performanceIndex: 91.4,
    criticalThreshold: 80,
    unit: 'GB',
    color: '#10b981'
  },
  {
    id: 'qnet',
    name: 'Q-Network',
    value: 45.8,
    trend: [],
    quantumState: 'superposition',
    performanceIndex: 76.3,
    criticalThreshold: 70,
    unit: 'Mbps',
    color: '#f59e0b'
  },
  {
    id: 'qdb',
    name: 'Q-Database',
    value: 92.1,
    trend: [],
    quantumState: 'coherent',
    performanceIndex: 95.8,
    criticalThreshold: 90,
    unit: 'ops/s',
    color: '#8b5cf6'
  },
  {
    id: 'quser',
    name: 'Q-Users',
    value: 3847293,
    trend: [],
    quantumState: 'entangled',
    performanceIndex: 99.2,
    criticalThreshold: 4000000,
    unit: 'active',
    color: '#ef4444'
  },
  {
    id: 'qlatency',
    name: 'Q-Latency',
    value: 12.7,
    trend: [],
    quantumState: 'superposition',
    performanceIndex: 88.9,
    criticalThreshold: 15,
    unit: 'ms',
    color: '#06b6d4'
  }
];

export default function InteractiveQuantumSparklines() {
  const [metrics, setMetrics] = useState<QuantumMetric[]>(QUANTUM_METRICS);
  const [isRunning, setIsRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState([100]);
  const [userLoad, setUserLoad] = useState([2500000]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quantumCoherence, setQuantumCoherence] = useState(97.3);
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement }>({});
  const animationFrameRef = useRef<number>();

  // Generate quantum fluctuation data
  const generateQuantumData = useCallback((metric: QuantumMetric, timestamp: number): SparklineData => {
    const baseValue = metric.value;
    const quantumNoise = (Math.random() - 0.5) * 10;
    const coherenceInfluence = quantumCoherence / 100;
    const userLoadInfluence = (userLoad[0] / 4000000) * 20;
    
    let fluctuation = 0;
    switch (metric.quantumState) {
      case 'coherent':
        fluctuation = quantumNoise * 0.3 * coherenceInfluence;
        break;
      case 'entangled':
        fluctuation = Math.sin(timestamp / 1000) * 5 + quantumNoise * 0.5;
        break;
      case 'superposition':
        fluctuation = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 8;
        break;
      case 'collapsed':
        fluctuation = quantumNoise * 2;
        break;
    }

    return {
      timestamp,
      value: Math.max(0, baseValue + fluctuation - userLoadInfluence),
      quantumFluctuation: fluctuation,
      userLoad: userLoad[0]
    };
  }, [quantumCoherence, userLoad]);

  // Draw sparkline on canvas
  const drawSparkline = useCallback((metric: QuantumMetric, canvas: HTMLCanvasElement) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (metric.trend.length < 2) return;

    const maxValue = Math.max(...metric.trend);
    const minValue = Math.min(...metric.trend);
    const range = maxValue - minValue || 1;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${metric.color}40`);
    gradient.addColorStop(1, `${metric.color}00`);

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    metric.trend.forEach((value, index) => {
      const x = (index / (metric.trend.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    metric.trend.forEach((value, index) => {
      const x = (index / (metric.trend.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = metric.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add quantum glow effect
    if (metric.quantumState === 'coherent') {
      ctx.shadowColor = metric.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw critical threshold line
    if (range > 0) {
      const thresholdY = height - ((metric.criticalThreshold - minValue) / range) * height;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, thresholdY);
      ctx.lineTo(width, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  // Update metrics with quantum simulation
  const updateMetrics = useCallback(() => {
    if (!isRunning) return;

    const now = Date.now();
    
    setMetrics(prevMetrics => 
      prevMetrics.map(metric => {
        const newData = generateQuantumData(metric, now);
        const newTrend = [...metric.trend, newData.value].slice(-50); // Keep last 50 points
        
        // Update quantum state based on performance
        let newQuantumState = metric.quantumState;
        if (newData.value > metric.criticalThreshold * 1.1) {
          newQuantumState = 'coherent';
        } else if (newData.value < metric.criticalThreshold * 0.8) {
          newQuantumState = 'collapsed';
        } else if (Math.random() > 0.7) {
          newQuantumState = Math.random() > 0.5 ? 'entangled' : 'superposition';
        }

        const updatedMetric = {
          ...metric,
          value: newData.value,
          trend: newTrend,
          quantumState: newQuantumState,
          performanceIndex: Math.min(100, (newData.value / metric.criticalThreshold) * 100)
        };

        // Draw sparkline if canvas exists
        const canvas = canvasRefs.current[metric.id];
        if (canvas) {
          drawSparkline(updatedMetric, canvas);
        }

        return updatedMetric;
      })
    );

    // Update quantum coherence based on overall system performance
    setQuantumCoherence(prev => {
      const avgPerformance = metrics.reduce((acc, m) => acc + m.performanceIndex, 0) / metrics.length;
      const targetCoherence = Math.min(100, avgPerformance + Math.random() * 5 - 2.5);
      return prev + (targetCoherence - prev) * 0.1;
    });
  }, [isRunning, metrics, generateQuantumData, drawSparkline]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateMetrics();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      const interval = Math.max(50, 1000 / simulationSpeed[0]);
      const timer = setInterval(() => {
        animate();
      }, interval);

      return () => clearInterval(timer);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, simulationSpeed, updateMetrics]);

  const getQuantumStateColor = (state: QuantumMetric['quantumState']) => {
    switch (state) {
      case 'coherent': return 'bg-green-100 text-green-800';
      case 'entangled': return 'bg-blue-100 text-blue-800';
      case 'superposition': return 'bg-yellow-100 text-yellow-800';
      case 'collapsed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'active' && value > 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value > 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4 overflow-auto' : ''}`}>
      {/* Header Controls - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5" />
                Quantum Performance Sparklines
              </CardTitle>
              <p className="text-xs text-gray-600 mt-1">
                Real-time quantum metrics with 4M user simulation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
                className="px-3"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-3"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* System Status - Compact Mobile Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{quantumCoherence.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{(userLoad[0] / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{simulationSpeed[0]}x</div>
              <div className="text-xs text-gray-500">Speed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {metrics.filter(m => m.quantumState === 'coherent').length}/{metrics.length}
              </div>
              <div className="text-xs text-gray-500">Coherent</div>
            </div>
          </div>

          {/* Controls - Mobile Optimized */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Simulation Speed</span>
                <span>{simulationSpeed[0]}x</span>
              </div>
              <Slider
                value={simulationSpeed}
                onValueChange={setSimulationSpeed}
                max={1000}
                min={1}
                step={10}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>User Load</span>
                <span>{(userLoad[0] / 1000000).toFixed(1)}M</span>
              </div>
              <Slider
                value={userLoad}
                onValueChange={setUserLoad}
                max={4000000}
                min={100000}
                step={50000}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantum Metrics Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <Card 
            key={metric.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                  <CardTitle className="text-sm">{metric.name}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getQuantumStateColor(metric.quantumState)}`}
                >
                  {metric.quantumState}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Current Value */}
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: metric.color }}>
                  {formatValue(metric.value, metric.unit)}
                </div>
                <div className="text-xs text-gray-500">{metric.unit}</div>
              </div>

              {/* Sparkline Canvas */}
              <div className="relative h-16 w-full">
                <canvas
                  ref={el => {
                    if (el) canvasRefs.current[metric.id] = el;
                  }}
                  width={280}
                  height={64}
                  className="w-full h-full"
                />
              </div>

              {/* Performance Index */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Performance</span>
                  <span className={
                    metric.performanceIndex > 90 ? 'text-green-600' :
                    metric.performanceIndex > 70 ? 'text-yellow-600' : 'text-red-600'
                  }>
                    {metric.performanceIndex.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={metric.performanceIndex} 
                  className="h-2"
                />
              </div>

              {/* Expanded Details */}
              {selectedMetric === metric.id && (
                <div className="pt-2 border-t border-gray-200 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Threshold:</span>
                      <div>{formatValue(metric.criticalThreshold, metric.unit)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Trend Points:</span>
                      <div>{metric.trend.length}/50</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantum Fluctuation:</span>
                    <div className="text-xs mt-1">
                      Real-time quantum state affects performance variability and system coherence
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Quantum Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Global Quantum Coherence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Coherence</span>
              <span className={
                quantumCoherence > 95 ? 'text-green-600' :
                quantumCoherence > 80 ? 'text-yellow-600' : 'text-red-600'
              }>
                {quantumCoherence.toFixed(1)}%
              </span>
            </div>
            <Progress value={quantumCoherence} className="h-3" />
            <div className="text-xs text-gray-500 text-center">
              Quantum coherence maintains optimal performance across {(userLoad[0] / 1000000).toFixed(1)}M active users
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}