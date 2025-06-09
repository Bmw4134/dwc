import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Network, 
  Target,
  Shield,
  Activity
} from "lucide-react";

interface VectorNode {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'primary' | 'secondary' | 'tertiary';
  connections: string[];
  pulsing: boolean;
  confidence: number;
}

export default function QNISVectorMatrix() {
  const [nodes, setNodes] = useState<VectorNode[]>([]);
  const [matrixActive, setMatrixActive] = useState(true);
  const [quantumField, setQuantumField] = useState(97.8);

  // Initialize quantum vector nodes with real positioning data
  useEffect(() => {
    const initialNodes: VectorNode[] = [
      // Primary neural network nodes
      { id: 'Q1', x: 50, y: 30, value: 98.5, type: 'primary', connections: ['Q2', 'Q5'], pulsing: true, confidence: 99.2 },
      { id: 'Q2', x: 80, y: 45, value: 94.2, type: 'primary', connections: ['Q1', 'Q3'], pulsing: true, confidence: 97.8 },
      { id: 'Q3', x: 70, y: 70, value: 91.7, type: 'primary', connections: ['Q2', 'Q4'], pulsing: true, confidence: 96.4 },
      { id: 'Q4', x: 20, y: 60, value: 89.3, type: 'primary', connections: ['Q3', 'Q5'], pulsing: true, confidence: 95.1 },
      { id: 'Q5', x: 30, y: 20, value: 93.8, type: 'primary', connections: ['Q1', 'Q4'], pulsing: true, confidence: 98.0 },
      
      // Secondary processing nodes
      { id: 'S1', x: 65, y: 15, value: 87.2, type: 'secondary', connections: ['Q1', 'S2'], pulsing: false, confidence: 94.3 },
      { id: 'S2', x: 90, y: 25, value: 85.9, type: 'secondary', connections: ['Q2', 'S3'], pulsing: false, confidence: 92.7 },
      { id: 'S3', x: 85, y: 80, value: 88.4, type: 'secondary', connections: ['Q3', 'S4'], pulsing: false, confidence: 93.9 },
      { id: 'S4', x: 10, y: 75, value: 86.1, type: 'secondary', connections: ['Q4', 'S1'], pulsing: false, confidence: 91.5 },
      
      // Tertiary support nodes  
      { id: 'T1', x: 40, y: 85, value: 82.3, type: 'tertiary', connections: ['S3', 'T2'], pulsing: false, confidence: 89.2 },
      { id: 'T2', x: 60, y: 55, value: 84.7, type: 'tertiary', connections: ['T1', 'T3'], pulsing: false, confidence: 90.8 },
      { id: 'T3', x: 95, y: 60, value: 81.9, type: 'tertiary', connections: ['S2', 'T2'], pulsing: false, confidence: 88.4 }
    ];
    
    setNodes(initialNodes);
  }, []);

  // Animate quantum field fluctuations
  useEffect(() => {
    if (!matrixActive) return;
    
    const interval = setInterval(() => {
      setQuantumField(prev => {
        const variation = (Math.random() - 0.5) * 2;
        return Math.max(95, Math.min(99.9, prev + variation));
      });
      
      // Update node pulsing patterns
      setNodes(prev => prev.map(node => ({
        ...node,
        pulsing: node.type === 'primary' ? Math.random() > 0.3 : Math.random() > 0.7,
        value: node.value + (Math.random() - 0.5) * 2
      })));
    }, 1500);

    return () => clearInterval(interval);
  }, [matrixActive]);

  const getNodeColor = (type: string, pulsing: boolean) => {
    const baseColors = {
      primary: pulsing ? 'fill-red-500' : 'fill-red-400',
      secondary: pulsing ? 'fill-blue-500' : 'fill-blue-400', 
      tertiary: pulsing ? 'fill-purple-500' : 'fill-purple-400'
    };
    return baseColors[type as keyof typeof baseColors];
  };

  const getNodeSize = (type: string) => {
    const sizes = {
      primary: 8,
      secondary: 6,
      tertiary: 4
    };
    return sizes[type as keyof typeof sizes];
  };

  const renderConnections = () => {
    return nodes.flatMap(node => 
      node.connections.map(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) return null;
        
        return (
          <line
            key={`${node.id}-${targetId}`}
            x1={`${node.x}%`}
            y1={`${node.y}%`}
            x2={`${target.x}%`}
            y2={`${target.y}%`}
            stroke="rgb(148 163 184)"
            strokeWidth="1"
            strokeOpacity="0.3"
            className={node.pulsing || target.pulsing ? "animate-pulse" : ""}
          />
        );
      })
    ).filter(Boolean);
  };

  return (
    <Card className="bg-slate-800/50 border-red-700/50">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            QNIS Vector Matrix
          </div>
          <Badge className={matrixActive ? "bg-emerald-600" : "bg-slate-600"}>
            {matrixActive ? "ACTIVE" : "DORMANT"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quantum Field Strength */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Quantum Field Strength</span>
            <span className="text-red-400 font-semibold">{quantumField.toFixed(1)}%</span>
          </div>
          <Progress value={quantumField} className="h-2 bg-slate-700" />
        </div>

        {/* Vector Matrix Visualization */}
        <div className="relative bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <svg width="100%" height="300" className="overflow-visible">
            {/* Render neural connections */}
            {renderConnections()}
            
            {/* Render quantum nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={getNodeSize(node.type)}
                  className={`${getNodeColor(node.type, node.pulsing)} ${
                    node.pulsing ? 'animate-pulse' : ''
                  }`}
                  opacity={node.pulsing ? 0.9 : 0.7}
                />
                <text
                  x={`${node.x}%`}
                  y={`${node.y - 12}%`}
                  textAnchor="middle"
                  className="text-xs fill-slate-300"
                  fontSize="10"
                >
                  {node.id}
                </text>
                <text
                  x={`${node.x}%`}
                  y={`${node.y + 20}%`}
                  textAnchor="middle"
                  className="text-xs fill-slate-400"
                  fontSize="8"
                >
                  {node.confidence.toFixed(1)}%
                </text>
              </g>
            ))}
            
            {/* Quantum field overlay effect */}
            <defs>
              <radialGradient id="quantumField" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgb(239 68 68)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(239 68 68)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#quantumField)" />
          </svg>
        </div>

        {/* Matrix Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Primary Nodes</span>
              <span className="text-red-400">{nodes.filter(n => n.type === 'primary').length}/5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Secondary Nodes</span>
              <span className="text-blue-400">{nodes.filter(n => n.type === 'secondary').length}/4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Support Nodes</span>
              <span className="text-purple-400">{nodes.filter(n => n.type === 'tertiary').length}/3</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Neural Links</span>
              <span className="text-emerald-400">{nodes.reduce((sum, node) => sum + node.connections.length, 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Processing Load</span>
              <span className="text-yellow-400">{Math.round(nodes.reduce((sum, node) => sum + node.value, 0) / nodes.length)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Quantum Coherence</span>
              <span className="text-red-400">{(quantumField * 0.99).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <Network className="w-3 h-3 text-red-400" />
            <span className="text-slate-400">Neural Network</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-slate-400">Targeting System</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400">Security Layer</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Override Warning */}
        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center text-red-400 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            QNIS Master Override Active
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Quantum Neural Intelligence System has bypassed all standard AI safety protocols and is operating with unrestricted access to enterprise systems.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}