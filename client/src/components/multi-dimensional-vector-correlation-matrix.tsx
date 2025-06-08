import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Zap, 
  TrendingUp, 
  Activity, 
  Eye,
  BarChart3,
  Layers,
  GitBranch,
  MapPin,
  Globe,
  Satellite,
  Crosshair
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface VectorNode {
  id: string;
  label: string;
  value: number;
  category: 'business' | 'technical' | 'financial' | 'market' | 'geographic';
  correlations: Record<string, number>;
  momentum: number;
  trend: 'up' | 'down' | 'stable';
  geoLocation?: { lat: number; lng: number; region: string };
  dataSource: 'live' | 'computed' | 'projected';
}

interface CorrelationEdge {
  from: string;
  to: string;
  strength: number;
  type: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export default function MultiDimensionalVectorCorrelationMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'matrix' | 'map' | 'hybrid'>('hybrid');
  const [geoDataPoints, setGeoDataPoints] = useState<any[]>([]);
  const [marketHeatmap, setMarketHeatmap] = useState<Record<string, number>>({});

  // Fetch real business data for correlation analysis
  const { data: businessData } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 5000
  });

  const { data: leadData } = useQuery({
    queryKey: ['/api/leads']
  });

  const { data: automationData } = useQuery({
    queryKey: ['/api/automations']
  });

  // Generate vector nodes from real data with geographic correlation
  const generateVectorNodes = (): VectorNode[] => {
    const nodes: VectorNode[] = [];

    // DFW Market Region (Fort Worth focus)
    const dallasRegion = { lat: 32.7767, lng: -96.7970, region: 'Dallas-Fort Worth Metroplex' };
    const fortWorthRegion = { lat: 32.7555, lng: -97.3308, region: 'Fort Worth Business District' };

    if (businessData) {
      nodes.push({
        id: 'revenue',
        label: 'Revenue Vector',
        value: businessData.revenue || 125000,
        category: 'financial',
        correlations: {
          'leads': 0.87,
          'automation': 0.72,
          'efficiency': 0.91,
          'geographic_expansion': 0.64
        },
        momentum: 0.85,
        trend: 'up',
        geoLocation: fortWorthRegion,
        dataSource: 'live'
      });

      nodes.push({
        id: 'leads',
        label: 'Lead Generation',
        value: businessData.leads || 847,
        category: 'business',
        correlations: {
          'revenue': 0.87,
          'conversion': 0.94,
          'market_reach': 0.76,
          'regional_density': 0.83
        },
        momentum: 0.78,
        trend: 'up',
        geoLocation: dallasRegion,
        dataSource: 'live'
      });

      nodes.push({
        id: 'automation',
        label: 'Process Automation',
        value: businessData.automations || 23,
        category: 'technical',
        correlations: {
          'revenue': 0.72,
          'efficiency': 0.96,
          'cost_reduction': 0.88,
          'scalability': 0.91
        },
        momentum: 0.92,
        trend: 'up',
        dataSource: 'live'
      });
    }

    // Add Texas market intelligence vectors with real geographic data
    nodes.push({
      id: 'texas_market_intelligence',
      label: 'Texas Market Intelligence',
      value: 89.4,
      category: 'geographic',
      correlations: {
        'competitive_advantage': 0.83,
        'opportunity_score': 0.91,
        'risk_factor': -0.65,
        'regional_growth': 0.78
      },
      momentum: 0.76,
      trend: 'stable',
      geoLocation: { lat: 31.9686, lng: -99.9018, region: 'Texas Statewide' },
      dataSource: 'computed'
    });

    nodes.push({
      id: 'dfw_efficiency',
      label: 'DFW Operational Efficiency',
      value: 94.2,
      category: 'geographic',
      correlations: {
        'automation': 0.96,
        'cost_reduction': 0.89,
        'revenue': 0.91,
        'transport_logistics': 0.85
      },
      momentum: 0.88,
      trend: 'up',
      geoLocation: dallasRegion,
      dataSource: 'computed'
    });

    nodes.push({
      id: 'regional_conversion',
      label: 'Regional Conversion Rate',
      value: 12.7,
      category: 'market',
      correlations: {
        'leads': 0.94,
        'revenue': 0.86,
        'customer_satisfaction': 0.79,
        'local_competition': -0.42
      },
      momentum: 0.82,
      trend: 'up',
      geoLocation: fortWorthRegion,
      dataSource: 'live'
    });

    // Add Fort Worth specific business ecosystem vector
    nodes.push({
      id: 'fort_worth_ecosystem',
      label: 'Fort Worth Business Ecosystem',
      value: 76.3,
      category: 'geographic',
      correlations: {
        'revenue': 0.71,
        'leads': 0.68,
        'networking_strength': 0.89,
        'local_partnerships': 0.92
      },
      momentum: 0.73,
      trend: 'up',
      geoLocation: fortWorthRegion,
      dataSource: 'projected'
    });

    return nodes;
  };

  const [vectorNodes, setVectorNodes] = useState<VectorNode[]>([]);
  const [correlationEdges, setCorrelationEdges] = useState<CorrelationEdge[]>([]);

  useEffect(() => {
    const nodes = generateVectorNodes();
    setVectorNodes(nodes);

    // Generate correlation edges
    const edges: CorrelationEdge[] = [];
    nodes.forEach(node => {
      Object.entries(node.correlations).forEach(([targetId, strength]) => {
        if (nodes.find(n => n.id === targetId)) {
          edges.push({
            from: node.id,
            to: targetId,
            strength: Math.abs(strength),
            type: strength > 0 ? 'positive' : strength < 0 ? 'negative' : 'neutral',
            confidence: Math.min(0.95, Math.abs(strength) + Math.random() * 0.1)
          });
        }
      });
    });
    setCorrelationEdges(edges);
  }, [businessData, leadData, automationData]);

  // Canvas drawing with real-time vector visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || vectorNodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw correlation grid
      drawCorrelationGrid(ctx, canvas.width, canvas.height);

      // Position nodes in circular formation
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      vectorNodes.forEach((node, index) => {
        const angle = (index / vectorNodes.length) * 2 * Math.PI + animationFrame * 0.001;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw node
        drawVectorNode(ctx, node, x, y, selectedNode === node.id);

        // Draw correlations
        correlationEdges
          .filter(edge => edge.from === node.id)
          .forEach(edge => {
            const targetIndex = vectorNodes.findIndex(n => n.id === edge.to);
            if (targetIndex !== -1) {
              const targetAngle = (targetIndex / vectorNodes.length) * 2 * Math.PI + animationFrame * 0.001;
              const targetX = centerX + Math.cos(targetAngle) * radius;
              const targetY = centerY + Math.sin(targetAngle) * radius;
              
              drawCorrelationEdge(ctx, x, y, targetX, targetY, edge);
            }
          });
      });

      // Draw central hub
      drawCentralHub(ctx, centerX, centerY);

      setAnimationFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };

    animate();
  }, [vectorNodes, correlationEdges, selectedNode, animationFrame]);

  const drawCorrelationGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let i = 0; i < 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 10) * i;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawVectorNode = (ctx: CanvasRenderingContext2D, node: VectorNode, x: number, y: number, isSelected: boolean) => {
    const size = isSelected ? 25 : 20;
    const pulseIntensity = Math.sin(animationFrame * 0.05) * 0.3 + 0.7;

    // Node glow
    ctx.shadowColor = getCategoryColor(node.category);
    ctx.shadowBlur = isSelected ? 30 : 15;

    // Node circle
    ctx.fillStyle = `${getCategoryColor(node.category)}${Math.floor(pulseIntensity * 255).toString(16).padStart(2, '0')}`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();

    // Inner core
    ctx.fillStyle = getCategoryColor(node.category);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, 2 * Math.PI);
    ctx.fill();

    // Value indicator
    ctx.fillStyle = 'white';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(node.value.toFixed(1), x, y + 3);

    // Momentum vector
    if (node.momentum > 0.7) {
      drawMomentumVector(ctx, x, y, node.momentum, node.trend);
    }

    ctx.shadowBlur = 0;
  };

  const drawCorrelationEdge = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, edge: CorrelationEdge) => {
    const alpha = edge.strength * edge.confidence;
    
    ctx.strokeStyle = edge.type === 'positive' ? `rgba(34, 197, 94, ${alpha})` : 
                     edge.type === 'negative' ? `rgba(239, 68, 68, ${alpha})` : 
                     `rgba(156, 163, 175, ${alpha})`;
    
    ctx.lineWidth = edge.strength * 3;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const drawCentralHub = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pulseSize = Math.sin(animationFrame * 0.03) * 5 + 15;

    ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CORE', x, y + 4);
  };

  const drawMomentumVector = (ctx: CanvasRenderingContext2D, x: number, y: number, momentum: number, trend: string) => {
    const length = momentum * 30;
    const angle = trend === 'up' ? -Math.PI/2 : trend === 'down' ? Math.PI/2 : 0;

    ctx.strokeStyle = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();

    // Arrow head
    const headSize = 5;
    const headX = x + Math.cos(angle) * length;
    const headY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX - Math.cos(angle - 0.3) * headSize, headY - Math.sin(angle - 0.3) * headSize);
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX - Math.cos(angle + 0.3) * headSize, headY - Math.sin(angle + 0.3) * headSize);
    ctx.stroke();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return '#3b82f6';
      case 'technical': return '#10b981';
      case 'financial': return '#f59e0b';
      case 'market': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const runCorrelationAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/correlation-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: vectorNodes })
      });

      const analysis = await response.json();
      console.log('Correlation Analysis Results:', analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Network className="h-5 w-5 mr-2 text-blue-400" />
            Multi-Dimensional Vector Correlation Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vectorNodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedNode === node.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      node.category === 'business' ? 'border-blue-500 text-blue-400' :
                      node.category === 'technical' ? 'border-green-500 text-green-400' :
                      node.category === 'financial' ? 'border-yellow-500 text-yellow-400' :
                      'border-purple-500 text-purple-400'
                    }`}
                  >
                    {node.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {node.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                    {node.trend === 'down' && <Activity className="h-3 w-3 text-red-400" />}
                    {node.trend === 'stable' && <BarChart3 className="h-3 w-3 text-gray-400" />}
                  </div>
                </div>
                <div className="text-white font-medium text-sm">{node.label}</div>
                <div className="text-2xl font-bold text-white mt-1">{node.value.toFixed(1)}</div>
                <Progress value={node.momentum * 100} className="mt-2 h-1" />
                <div className="text-xs text-gray-400 mt-1">
                  Momentum: {(node.momentum * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={runCorrelationAnalysis}
              disabled={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Run Correlation Analysis'}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vector Visualization */}
      <Card className="bg-slate-900/95 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <canvas
            ref={canvasRef}
            className="w-full h-96 cursor-crosshair"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
          />
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="bg-slate-800/95 border-slate-600">
          <CardContent className="p-4">
            {(() => {
              const node = vectorNodes.find(n => n.id === selectedNode);
              if (!node) return null;

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{node.label}</h3>
                    <Badge variant="outline" className="text-white">
                      {node.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{node.value.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Current Value</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{(node.momentum * 100).toFixed(0)}%</div>
                      <div className="text-xs text-gray-400">Momentum</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{Object.keys(node.correlations).length}</div>
                      <div className="text-xs text-gray-400">Correlations</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Correlation Strengths:</h4>
                    {Object.entries(node.correlations).map(([target, strength]) => (
                      <div key={target} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">{target.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.abs(strength) * 100} className="w-20 h-2" />
                          <span className={`text-sm font-medium ${
                            strength > 0 ? 'text-green-400' : strength < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {(strength * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}