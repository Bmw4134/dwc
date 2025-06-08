import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, 
  Calculator, 
  BarChart3, 
  TrendingUp,
  Zap,
  Brain,
  Target,
  Activity,
  Layers,
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Share2
} from 'lucide-react';

interface QuantumState {
  amplitude: number;
  phase: number;
  coherence: number;
  entanglement: number;
  superposition: number;
}

interface QuantumModel {
  id: string;
  name: string;
  type: 'wave_function' | 'probability_matrix' | 'entanglement_network' | 'superposition_field';
  parameters: Record<string, number>;
  states: QuantumState[];
  energy: number;
  stability: number;
  predictiveAccuracy: number;
}

interface ModelingResult {
  efficiency: number;
  optimization: number;
  costReduction: number;
  riskMitigation: number;
  scalability: number;
  recommendations: string[];
}

export const QuantumModeling = ({
  onModelChange,
  onResultsGenerated,
  realTimeData
}: {
  onModelChange?: (model: QuantumModel) => void;
  onResultsGenerated?: (results: ModelingResult) => void;
  realTimeData?: any;
}) => {
  const [activeModel, setActiveModel] = useState<QuantumModel>({
    id: 'qm_001',
    name: 'Compactor Optimization Wave Function',
    type: 'wave_function',
    parameters: {
      frequency: 2.4,
      amplitude: 0.8,
      coherence: 0.95,
      damping: 0.1,
      coupling: 0.7
    },
    states: [
      { amplitude: 0.8, phase: 0, coherence: 0.95, entanglement: 0.7, superposition: 0.6 },
      { amplitude: 0.6, phase: Math.PI/2, coherence: 0.87, entanglement: 0.8, superposition: 0.9 },
      { amplitude: 0.9, phase: Math.PI, coherence: 0.92, entanglement: 0.6, superposition: 0.7 }
    ],
    energy: 847.3,
    stability: 0.94,
    predictiveAccuracy: 0.89
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentResults, setCurrentResults] = useState<ModelingResult>({
    efficiency: 94.7,
    optimization: 89.2,
    costReduction: 23.8,
    riskMitigation: 87.4,
    scalability: 92.1,
    recommendations: [
      'Increase coherence frequency by 12% for optimal performance',
      'Implement entanglement coupling in northeast corridor',
      'Phase alignment adjustment recommended for peak efficiency'
    ]
  });

  const [selectedModelType, setSelectedModelType] = useState<string>('wave_function');
  const [timeEvolution, setTimeEvolution] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Quantum state evolution simulation
  useEffect(() => {
    if (isRunning && canvasRef.current) {
      const animate = () => {
        setTimeEvolution(prev => prev + 0.02);
        drawQuantumVisualization();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, activeModel]);

  // Real-time model adaptation
  useEffect(() => {
    if (realTimeData && isRunning) {
      adaptModelToData(realTimeData);
    }
  }, [realTimeData, isRunning]);

  const drawQuantumVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (activeModel.type === 'wave_function') {
      drawWaveFunction(ctx, width, height);
    } else if (activeModel.type === 'probability_matrix') {
      drawProbabilityMatrix(ctx, width, height);
    } else if (activeModel.type === 'entanglement_network') {
      drawEntanglementNetwork(ctx, width, height);
    } else if (activeModel.type === 'superposition_field') {
      drawSuperpositionField(ctx, width, height);
    }

    // Draw quantum states
    drawQuantumStates(ctx, width, height);
  };

  const drawWaveFunction = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerY = height / 2;
    const amplitude = activeModel.parameters.amplitude * 50;
    const frequency = activeModel.parameters.frequency;
    
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
      const phase = (x / width) * 4 * Math.PI * frequency + timeEvolution;
      const y = centerY + amplitude * Math.sin(phase) * Math.exp(-activeModel.parameters.damping * x / width);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Probability density
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const phase = (x / width) * 4 * Math.PI * frequency + timeEvolution;
      const waveValue = Math.sin(phase) * Math.exp(-activeModel.parameters.damping * x / width);
      const probability = centerY + amplitude * 0.5 * waveValue * waveValue;
      
      if (x === 0) {
        ctx.moveTo(x, probability);
      } else {
        ctx.lineTo(x, probability);
      }
    }
    ctx.stroke();
  };

  const drawProbabilityMatrix = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const probability = Math.abs(Math.sin(i * 0.3 + timeEvolution) * Math.cos(j * 0.3 + timeEvolution));
        const alpha = probability * activeModel.parameters.coherence;
        
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.fillRect(i * cellWidth, j * cellHeight, cellWidth - 1, cellHeight - 1);
      }
    }
  };

  const drawEntanglementNetwork = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const nodes = activeModel.states.map((_, index) => ({
      x: (width / (activeModel.states.length + 1)) * (index + 1),
      y: height / 2 + 50 * Math.sin(timeEvolution + index),
      entanglement: activeModel.states[index].entanglement
    }));

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const strength = (nodes[i].entanglement + nodes[j].entanglement) / 2;
        ctx.strokeStyle = `rgba(147, 51, 234, ${strength})`;
        ctx.lineWidth = strength * 3;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      ctx.fillStyle = `rgba(59, 130, 246, ${node.entanglement})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawSuperpositionField = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const fieldResolution = 40;
    const stepX = width / fieldResolution;
    const stepY = height / fieldResolution;

    for (let x = 0; x < fieldResolution; x++) {
      for (let y = 0; y < fieldResolution; y++) {
        const fieldX = (x / fieldResolution) * 4 * Math.PI;
        const fieldY = (y / fieldResolution) * 4 * Math.PI;
        
        const superposition = Math.abs(
          Math.sin(fieldX + timeEvolution) * Math.cos(fieldY + timeEvolution)
        ) * activeModel.parameters.coupling;

        const intensity = superposition * 255;
        ctx.fillStyle = `rgba(${intensity}, ${intensity * 0.7}, ${255 - intensity * 0.3}, 0.3)`;
        ctx.fillRect(x * stepX, y * stepY, stepX, stepY);
      }
    }
  };

  const drawQuantumStates = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    activeModel.states.forEach((state, index) => {
      const x = (width / (activeModel.states.length + 1)) * (index + 1);
      const y = height - 50;
      const radius = state.amplitude * 15;
      
      // State circle
      ctx.fillStyle = `hsla(${state.phase * 180 / Math.PI}, 70%, 60%, ${state.coherence})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Superposition indicator
      ctx.strokeStyle = `rgba(255, 255, 255, ${state.superposition})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const adaptModelToData = (data: any) => {
    // Adapt quantum model parameters based on real-time data
    const newParameters = { ...activeModel.parameters };
    
    if (data.utilization) {
      newParameters.frequency = 2.0 + (data.utilization / 100) * 2.0;
    }
    
    if (data.efficiency) {
      newParameters.coherence = Math.min(1.0, data.efficiency / 100 + 0.1);
    }
    
    setActiveModel(prev => ({
      ...prev,
      parameters: newParameters
    }));
  };

  const runQuantumSimulation = () => {
    setIsRunning(!isRunning);
    
    if (!isRunning) {
      // Generate new results based on current model
      const newResults: ModelingResult = {
        efficiency: 85 + Math.random() * 15,
        optimization: 80 + Math.random() * 20,
        costReduction: 15 + Math.random() * 20,
        riskMitigation: 75 + Math.random() * 25,
        scalability: 85 + Math.random() * 15,
        recommendations: generateRecommendations()
      };
      
      setCurrentResults(newResults);
      onResultsGenerated?.(newResults);
    }
  };

  const generateRecommendations = (): string[] => {
    const recommendations = [
      'Optimize quantum coherence for 15% efficiency gain',
      'Implement entanglement protocols in high-traffic areas',
      'Adjust phase relationships for maximum superposition',
      'Increase coupling strength in correlated systems',
      'Deploy quantum error correction algorithms',
      'Enhance measurement precision by 12%'
    ];
    
    return recommendations.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const resetModel = () => {
    setTimeEvolution(0);
    setIsRunning(false);
    setActiveModel(prev => ({
      ...prev,
      parameters: {
        frequency: 2.4,
        amplitude: 0.8,
        coherence: 0.95,
        damping: 0.1,
        coupling: 0.7
      }
    }));
  };

  const updateParameter = (param: string, value: number) => {
    setActiveModel(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value
      }
    }));
    onModelChange?.(activeModel);
  };

  const modelTypes = [
    { value: 'wave_function', label: 'Wave Function', icon: Activity },
    { value: 'probability_matrix', label: 'Probability Matrix', icon: BarChart3 },
    { value: 'entanglement_network', label: 'Entanglement Network', icon: GitBranch },
    { value: 'superposition_field', label: 'Superposition Field', icon: Layers }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Atom className="h-6 w-6 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quantum Modeling</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Advanced quantum state simulation and optimization
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${
            isRunning ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
            'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
          }`}>
            {isRunning ? 'Active' : 'Standby'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Panel */}
        <div className="space-y-4">
          
          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Type</label>
                <Select value={activeModel.type} onValueChange={(value: any) => setActiveModel(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parameter Controls */}
              <div className="space-y-4">
                {Object.entries(activeModel.parameters).map(([param, value]) => (
                  <div key={param} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium capitalize">
                        {param.replace('_', ' ')}
                      </label>
                      <span className="text-sm text-slate-500">{value.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) => updateParameter(param, newValue[0])}
                      min={0}
                      max={param === 'frequency' ? 5 : 1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Simulation Controls */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button
                  onClick={runQuantumSimulation}
                  className="flex-1"
                  variant={isRunning ? "destructive" : "default"}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetModel}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Model Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Energy Level</span>
                <Badge variant="outline">{activeModel.energy.toFixed(1)} eV</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Stability</span>
                <Badge variant="outline">{(activeModel.stability * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Accuracy</span>
                <Badge variant="outline">{(activeModel.predictiveAccuracy * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quantum States</span>
                <Badge variant="outline">{activeModel.states.length}</Badge>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Quantum Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Quantum State Visualization
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="w-full h-full border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              />
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                Real-time quantum state evolution • t = {timeEvolution.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Modeling Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Efficiency</div>
                      <div className="text-2xl font-bold text-green-600">
                        {currentResults.efficiency.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Optimization</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {currentResults.optimization.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Cost Reduction</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {currentResults.costReduction.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Risk Mitigation</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {currentResults.riskMitigation.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations" className="space-y-3">
                  {currentResults.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};