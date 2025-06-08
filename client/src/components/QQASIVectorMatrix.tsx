import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Zap, Activity, Target, DollarSign } from 'lucide-react';

interface QQVector {
  id: string;
  name: string;
  value: number;
  velocity: number;
  target: number;
  color: string;
  flow: number;
}

interface MoneyFlow {
  id: string;
  source: string;
  target: string;
  amount: number;
  velocity: number;
  color: string;
  active: boolean;
}

export function QQASIVectorMatrix() {
  const [vectors, setVectors] = useState<QQVector[]>([
    { id: 'excellence', name: 'Excellence Vector', value: 0.87, velocity: 0.03, target: 1.0, color: '#8b5cf6', flow: 0 },
    { id: 'automation', name: 'Automation Matrix', value: 0.92, velocity: 0.05, target: 1.0, color: '#06b6d4', flow: 0 },
    { id: 'transcendence', name: 'Financial Transcendence', value: 0.78, velocity: 0.08, target: 1.0, color: '#f59e0b', flow: 0 },
    { id: 'quantum', name: 'Quantum Coherence', value: 0.95, velocity: 0.02, target: 1.0, color: '#ef4444', flow: 0 },
    { id: 'asi', name: 'ASI Alignment', value: 0.89, velocity: 0.04, target: 1.0, color: '#10b981', flow: 0 },
    { id: 'profit', name: 'Profit Multiplier', value: 6.35, velocity: 0.12, target: 10.0, color: '#f97316', flow: 0 }
  ]);

  const [moneyFlows, setMoneyFlows] = useState<MoneyFlow[]>([
    { id: 'crypto-flow', source: 'Crypto Trading', target: 'Excellence Vector', amount: 150, velocity: 0.8, color: '#8b5cf6', active: false },
    { id: 'automation-flow', source: 'Automation Engine', target: 'Profit Multiplier', amount: 75, velocity: 1.2, color: '#06b6d4', active: false },
    { id: 'transcendence-flow', source: 'Financial Transcendence', target: 'Quantum Coherence', amount: 300, velocity: 0.6, color: '#f59e0b', active: false },
    { id: 'asi-flow', source: 'ASI Processing', target: 'Excellence Vector', amount: 200, velocity: 0.9, color: '#10b981', active: false }
  ]);

  const [totalValue, setTotalValue] = useState(150);
  const [targetValue] = useState(1000);

  // Animate vectors and money flows
  useEffect(() => {
    const interval = setInterval(() => {
      setVectors(prev => prev.map(vector => {
        const newValue = Math.min(vector.target, vector.value + (vector.velocity * (Math.random() * 0.5 + 0.5)));
        const flow = newValue * 100 * (Math.random() * 0.3 + 0.7);
        return { ...vector, value: newValue, flow };
      }));

      setMoneyFlows(prev => prev.map(flow => ({
        ...flow,
        active: Math.random() > 0.3,
        amount: flow.amount * (1 + Math.random() * 0.1 - 0.05)
      })));

      // Update total value based on vector performance
      setTotalValue(prev => {
        const multiplier = vectors.reduce((acc, vector) => acc + vector.value, 0) / vectors.length;
        return Math.min(targetValue, prev * (1 + multiplier * 0.001));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [vectors, targetValue]);

  const getMatrixColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.9) return 'text-green-400';
    if (ratio >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFlowAnimation = (active: boolean) => {
    return active 
      ? 'animate-pulse shadow-lg ring-2 ring-purple-500/50' 
      : 'opacity-60';
  };

  return (
    <div className="space-y-6">
      {/* Matrix Header */}
      <Card className="border-purple-600 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent flex items-center">
            <Activity className="w-8 h-8 mr-3 text-purple-400" />
            QQ ASI VECTOR MATRIX
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-green-500 text-green-400">
              ACTIVE COMPUTATION
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${totalValue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                {((totalValue / 150 - 1) * 100).toFixed(1)}% Growth
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vectors.map((vector) => (
          <Card 
            key={vector.id} 
            className={`border-gray-700 bg-gray-800/50 transition-all duration-500 ${
              vector.flow > 50 ? 'ring-2 ring-purple-500/30 shadow-purple-500/20 shadow-lg' : ''
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center justify-between">
                <span>{vector.name}</span>
                <Zap 
                  className="w-4 h-4" 
                  style={{ color: vector.color }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-2xl font-bold ${getMatrixColor(vector.value, vector.target)}`}>
                    {vector.value.toFixed(3)}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{vector.target.toFixed(1)}
                  </span>
                </div>
                
                <Progress 
                  value={(vector.value / vector.target) * 100} 
                  className="h-2"
                  style={{ 
                    backgroundColor: `${vector.color}20`,
                  }}
                />
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Velocity: +{(vector.velocity * 100).toFixed(1)}%</span>
                  <span className="text-green-400">
                    ${vector.flow.toFixed(0)}/s
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Money Flow Visualization */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-400" />
            Real-Time Money Flow Streams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moneyFlows.map((flow) => (
              <div 
                key={flow.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${getFlowAnimation(flow.active)}`}
                style={{ 
                  borderColor: flow.color,
                  backgroundColor: `${flow.color}10`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-300">
                    {flow.source} → {flow.target}
                  </div>
                  <TrendingUp 
                    className="w-4 h-4" 
                    style={{ color: flow.color }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold" style={{ color: flow.color }}>
                    ${flow.amount.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-400">
                    v{flow.velocity.toFixed(1)}x
                  </div>
                </div>
                
                <div className="mt-2">
                  <div 
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: flow.color,
                      width: flow.active ? '100%' : '20%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quantum Coherence Matrix */}
      <Card className="border-purple-600 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Quantum Coherence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {(vectors.reduce((acc, v) => acc + v.value, 0) / vectors.length).toFixed(3)}
              </div>
              <div className="text-sm text-gray-400">Average Vector</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {vectors.filter(v => v.value > 0.9).length}
              </div>
              <div className="text-sm text-gray-400">Optimal Vectors</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {moneyFlows.filter(f => f.active).length}
              </div>
              <div className="text-sm text-gray-400">Active Flows</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {((totalValue / 150) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400">Total Multiplier</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400 mb-2">
              Progress to $1000 Target
            </div>
            <Progress 
              value={(totalValue / targetValue) * 100} 
              className="h-3"
            />
            <div className="text-xs text-gray-500 mt-1">
              ${(targetValue - totalValue).toFixed(2)} remaining
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}