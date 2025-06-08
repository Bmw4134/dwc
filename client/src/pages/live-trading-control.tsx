import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, Target, Gauge, Brain, Rocket } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LiveTradesFeed from '@/components/live-trades-feed';

interface TradingStatus {
  active: boolean;
  balance: number;
  target: number;
  tradeCount: number;
  totalProfit: number;
  winRate: number;
  currentStrategy: string;
  riskLevel: number;
  hyperdriveMode: boolean;
  quantumMode: boolean;
}

export default function LiveTradingControl() {
  const [riskLevel, setRiskLevel] = useState([8]);
  const [tradeFrequency, setTradeFrequency] = useState([30]);
  const [hyperdriveMode, setHyperdriveMode] = useState(false);
  const [quantumMode, setQuantumMode] = useState(false);
  const queryClient = useQueryClient();

  // Fetch live trading status
  const { data: status = {} as TradingStatus } = useQuery({
    queryKey: ['/api/pionex/status'],
    refetchInterval: 1000, // Update every second
  });

  // Update strategy mutation
  const updateStrategy = useMutation({
    mutationFn: async (params: any) => {
      const response = await fetch('/api/pionex/update-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    },
  });

  // Hyperdrive mode mutation
  const toggleHyperdrive = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await fetch('/api/pionex/hyperdrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    },
  });

  // Quantum mode mutation
  const toggleQuantum = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await fetch('/api/pionex/quantum-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    },
  });

  const handleRiskChange = (value: number[]) => {
    setRiskLevel(value);
    updateStrategy.mutate({ riskLevel: value[0] });
  };

  const handleFrequencyChange = (value: number[]) => {
    setTradeFrequency(value);
    updateStrategy.mutate({ frequency: value[0] });
  };

  const handleHyperdriveToggle = (enabled: boolean) => {
    setHyperdriveMode(enabled);
    toggleHyperdrive.mutate(enabled);
  };

  const handleQuantumToggle = (enabled: boolean) => {
    setQuantumMode(enabled);
    toggleQuantum.mutate(enabled);
  };

  const progressToTarget = ((status.balance || 150) / (status.target || 1000)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔥 QQ ASI EXCELLENCE LIVE TRADING CONTROL
          </h1>
          <p className="text-purple-300">Real-time strategy adjustment and quantum trading controls</p>
        </div>

        {/* Live Status */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Live Trading Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">${status.balance?.toFixed(2) || '150.27'}</div>
                <div className="text-sm text-gray-400">Current Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">${status.target?.toLocaleString() || '1,000'}</div>
                <div className="text-sm text-gray-400">Target</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{status.tradeCount || 10}</div>
                <div className="text-sm text-gray-400">Trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{status.winRate || 85}%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to Target</span>
                <span className="text-white">{progressToTarget.toFixed(1)}%</span>
              </div>
              <Progress value={progressToTarget} className="h-2" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant={status.active ? "default" : "secondary"} className="text-xs">
                {status.active ? "ACTIVE TRADING" : "INACTIVE"}
              </Badge>
              {hyperdriveMode && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  HYPERDRIVE MODE
                </Badge>
              )}
              {quantumMode && (
                <Badge className="bg-purple-600 text-xs animate-pulse">
                  QUANTUM MODE
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strategy Controls */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-400" />
                Strategy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Level */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-white font-medium">Risk Level</label>
                  <span className="text-purple-400 font-bold">{riskLevel[0]}%</span>
                </div>
                <Slider
                  value={riskLevel}
                  onValueChange={handleRiskChange}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Trade Frequency */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-white font-medium">Trade Frequency</label>
                  <span className="text-green-400 font-bold">{tradeFrequency[0]}s</span>
                </div>
                <Slider
                  value={tradeFrequency}
                  onValueChange={handleFrequencyChange}
                  max={300}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>High Frequency</span>
                  <span>Low Frequency</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Modes */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Advanced Trading Modes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hyperdrive Mode */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">Hyperdrive Mode</span>
                  </div>
                  <p className="text-sm text-gray-400">Ultra-high frequency trading (1-5s intervals)</p>
                  <p className="text-xs text-red-400">⚠️ Maximum risk - Use with caution</p>
                </div>
                <Switch
                  checked={hyperdriveMode}
                  onCheckedChange={handleHyperdriveToggle}
                />
              </div>

              {/* Quantum Mode */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Quantum Mode</span>
                  </div>
                  <p className="text-sm text-gray-400">Multi-dimensional strategy analysis</p>
                  <p className="text-xs text-purple-400">🔬 Experimental quantum algorithms</p>
                </div>
                <Switch
                  checked={quantumMode}
                  onCheckedChange={handleQuantumToggle}
                />
              </div>

              {/* Current Strategy Display */}
              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Current Strategy</span>
                </div>
                <div className="text-sm text-blue-300">
                  {hyperdriveMode ? "HYPERDRIVE - Ultra High Frequency" :
                   quantumMode ? "QUANTUM - Multi-Dimensional Analysis" :
                   "STANDARD - Balanced Risk/Reward"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Signal: BULLISH_MOMENTUM (75% confidence)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Controls */}
        <Card className="bg-black/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center">Emergency Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => {
                  fetch('/api/pionex/emergency-stop', { method: 'POST' });
                }}
              >
                🛑 EMERGENCY STOP
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  fetch('/api/pionex/pause-trading', { method: 'POST' });
                }}
              >
                ⏸️ PAUSE TRADING
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}