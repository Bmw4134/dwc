import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Target,
  BarChart3,
  Clock,
  Sparkles
} from "lucide-react";

interface HeatmapData {
  timestamp: string;
  strategy: string;
  profit: number;
  confidence: number;
  volume: number;
  marketState: string;
  winRate: number;
}

interface QuantumOverlay {
  id: string;
  type: 'momentum' | 'reversal' | 'breakout' | 'quantum_signal';
  intensity: number;
  position: { x: number; y: number };
  duration: number;
}

export default function TradingPerformanceHeatmap() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '1d' | '1w'>('4h');
  const [quantumOverlaysEnabled, setQuantumOverlaysEnabled] = useState(true);
  const [hoverData, setHoverData] = useState<HeatmapData | null>(null);
  const [quantumOverlays, setQuantumOverlays] = useState<QuantumOverlay[]>([]);

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['/api/trading/heatmap', selectedTimeframe],
    refetchInterval: 5000
  });

  const { data: performanceMetrics } = useQuery({
    queryKey: ['/api/trading/performance-metrics'],
    refetchInterval: 2000
  });

  // Generate quantum overlays based on trading patterns
  useEffect(() => {
    if (!heatmapData?.trades || !quantumOverlaysEnabled) return;

    const overlays: QuantumOverlay[] = [];
    
    heatmapData.trades.forEach((trade: any, index: number) => {
      if (trade.confidence > 0.8) {
        overlays.push({
          id: `quantum-${index}`,
          type: 'quantum_signal',
          intensity: trade.confidence,
          position: { 
            x: (index % 24) * 40, 
            y: Math.floor(index / 24) * 30 
          },
          duration: 2000
        });
      }

      if (trade.profit > 0 && trade.strategy === 'MOMENTUM') {
        overlays.push({
          id: `momentum-${index}`,
          type: 'momentum',
          intensity: Math.min(trade.profit / 10, 1),
          position: { 
            x: (index % 24) * 40 + 10, 
            y: Math.floor(index / 24) * 30 + 10 
          },
          duration: 1500
        });
      }
    });

    setQuantumOverlays(overlays);
  }, [heatmapData, quantumOverlaysEnabled]);

  const heatmapGrid = useMemo(() => {
    if (!heatmapData?.trades) return [];

    const grid: HeatmapData[][] = [];
    const hoursPerRow = 24;
    const trades = heatmapData.trades.slice(0, 168); // Last week of data

    for (let i = 0; i < trades.length; i += hoursPerRow) {
      grid.push(trades.slice(i, i + hoursPerRow));
    }

    return grid;
  }, [heatmapData]);

  const getHeatmapColor = (profit: number, confidence: number) => {
    if (profit > 0) {
      const intensity = Math.min(Math.abs(profit) / 5, 1);
      return `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`;
    } else {
      const intensity = Math.min(Math.abs(profit) / 5, 1);
      return `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;
    }
  };

  const getQuantumOverlayStyle = (overlay: QuantumOverlay) => {
    const baseStyles = {
      position: 'absolute' as const,
      left: `${overlay.position.x}px`,
      top: `${overlay.position.y}px`,
      width: '30px',
      height: '20px',
      borderRadius: '4px',
      pointerEvents: 'none' as const,
      animation: `quantumPulse ${overlay.duration}ms ease-in-out infinite`,
      opacity: overlay.intensity * 0.8
    };

    switch (overlay.type) {
      case 'quantum_signal':
        return {
          ...baseStyles,
          background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
        };
      case 'momentum':
        return {
          ...baseStyles,
          background: 'linear-gradient(45deg, #10b981, #34d399)',
          boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
        };
      case 'reversal':
        return {
          ...baseStyles,
          background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
          boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)'
        };
      case 'breakout':
        return {
          ...baseStyles,
          background: 'linear-gradient(45deg, #ef4444, #f87171)',
          boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
        };
      default:
        return baseStyles;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900/95 border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Profit</p>
                <p className="text-2xl font-bold text-green-400">
                  ${performanceMetrics?.totalProfit?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-blue-400">
                  {performanceMetrics?.winRate?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Quantum Signals</p>
                <p className="text-2xl font-bold text-purple-400">
                  {quantumOverlays.filter(o => o.type === 'quantum_signal').length}
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Trades</p>
                <p className="text-2xl font-bold text-orange-400">
                  {performanceMetrics?.activeTrades || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Heatmap */}
      <Card className="bg-gray-900/95 border-gray-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Trading Performance Heatmap
              {quantumOverlaysEnabled && (
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Quantum Overlays Active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={quantumOverlaysEnabled ? "default" : "outline"}
                onClick={() => setQuantumOverlaysEnabled(!quantumOverlaysEnabled)}
                className="text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Quantum
              </Button>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              >
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="relative">
            {/* Time Labels */}
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i}>{i * 4}:00</span>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div 
              className="relative bg-gray-800/30 rounded-lg p-4 min-h-[400px]"
              style={{ position: 'relative' }}
            >
              {heatmapGrid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex mb-1">
                  {row.map((cell, cellIndex) => (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      className="w-8 h-6 mr-1 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                      style={{
                        backgroundColor: getHeatmapColor(cell.profit, cell.confidence),
                        border: cell.confidence > 0.8 ? '1px solid #8b5cf6' : '1px solid transparent'
                      }}
                      onMouseEnter={() => setHoverData(cell)}
                      onMouseLeave={() => setHoverData(null)}
                      title={`Profit: $${cell.profit.toFixed(2)} | Confidence: ${(cell.confidence * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
              ))}

              {/* Quantum Overlays */}
              {quantumOverlaysEnabled && quantumOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  style={getQuantumOverlayStyle(overlay)}
                />
              ))}
            </div>

            {/* Day Labels */}
            <div className="flex flex-col text-xs text-gray-400 mt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <span key={day} className="h-7 flex items-center">{day}</span>
              ))}
            </div>
          </div>

          {/* Hover Data Display */}
          {hoverData && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
              <h4 className="text-white font-medium mb-2">Trade Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Strategy:</span>
                  <span className="text-white ml-2">{hoverData.strategy}</span>
                </div>
                <div>
                  <span className="text-gray-400">Profit:</span>
                  <span className={`ml-2 ${hoverData.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${hoverData.profit.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-blue-400 ml-2">{(hoverData.confidence * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Market State:</span>
                  <span className="text-purple-400 ml-2">{hoverData.marketState}</span>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/60 rounded"></div>
                <span className="text-gray-400">Profitable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/60 rounded"></div>
                <span className="text-gray-400">Loss</span>
              </div>
              {quantumOverlaysEnabled && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded animate-pulse"></div>
                  <span className="text-gray-400">Quantum Signal</span>
                </div>
              )}
            </div>
            <div className="text-gray-500">
              <Clock className="h-3 w-3 inline mr-1" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes quantumPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}