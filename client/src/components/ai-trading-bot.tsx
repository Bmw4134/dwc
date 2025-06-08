import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, TrendingUp, Zap, Brain, Shield, AlertTriangle, DollarSign, Activity, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingPosition {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  current: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}

interface BotMetrics {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  dailyPnL: number;
  sharpeRatio: number;
  maxDrawdown: number;
  accuracy: number;
  efficiency: number;
}

interface MarketSignal {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  price: number;
  reasoning: string;
  aiScore: number;
  timestamp: string;
}

const MOCK_POSITIONS: TradingPosition[] = [
  {
    id: 'pos-001',
    symbol: 'BTC/USD',
    type: 'long',
    entry: 42350.00,
    current: 43120.50,
    quantity: 0.25,
    pnl: 192.63,
    pnlPercent: 1.82,
    timestamp: new Date().toISOString()
  },
  {
    id: 'pos-002',
    symbol: 'ETH/USD',
    type: 'short',
    entry: 2890.75,
    current: 2845.20,
    quantity: 2.5,
    pnl: 113.88,
    pnlPercent: 1.58,
    timestamp: new Date().toISOString()
  }
];

const MOCK_SIGNALS: MarketSignal[] = [
  {
    symbol: 'SOL/USD',
    action: 'buy',
    confidence: 87,
    price: 98.45,
    reasoning: 'Quantum momentum convergence + RSI oversold + volume spike',
    aiScore: 94,
    timestamp: new Date().toISOString()
  },
  {
    symbol: 'MATIC/USD',
    action: 'sell',
    confidence: 73,
    price: 0.845,
    reasoning: 'Neural pattern divergence + resistance level hit',
    aiScore: 78,
    timestamp: new Date().toISOString()
  }
];

export function AITradingBot({ className }: { className?: string }) {
  const [botEnabled, setBotEnabled] = useState(false);
  const [positions, setPositions] = useState<TradingPosition[]>(MOCK_POSITIONS);
  const [signals, setSignals] = useState<MarketSignal[]>(MOCK_SIGNALS);
  const [botSettings, setBotSettings] = useState({
    maxRisk: 2,
    maxPositions: 5,
    takeProfitPercent: 8,
    stopLossPercent: 3,
    aiConfidenceThreshold: 75,
    quantumMode: true
  });
  const [metrics, setMetrics] = useState<BotMetrics>({
    totalTrades: 247,
    winRate: 73.2,
    totalPnL: 15420.50,
    dailyPnL: 892.30,
    sharpeRatio: 2.41,
    maxDrawdown: -4.8,
    accuracy: 89.5,
    efficiency: 96.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update positions with simulated price movements
      setPositions(prev => prev.map(pos => {
        const priceChange = (Math.random() - 0.5) * 0.02; // ±1% movement
        const newPrice = pos.current * (1 + priceChange);
        const pnl = pos.type === 'long' 
          ? (newPrice - pos.entry) * pos.quantity
          : (pos.entry - newPrice) * pos.quantity;
        const pnlPercent = (pnl / (pos.entry * pos.quantity)) * 100;
        
        return {
          ...pos,
          current: newPrice,
          pnl,
          pnlPercent
        };
      }));

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() - 0.4) * 50,
        efficiency: Math.min(100, prev.efficiency + (Math.random() - 0.5) * 0.5)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-600 bg-green-50 border-green-200';
      case 'sell': return 'text-red-600 bg-red-50 border-red-200';
      case 'hold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPositionColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className={cn("shadow-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50", className)}>
      <CardHeader className="border-b border-purple-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Trading Bot - Quantum Enhanced
            <Badge variant="secondary" className="bg-white text-purple-600">
              {botEnabled ? 'Active' : 'Standby'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="bot-toggle" className="text-sm">Enable Bot</Label>
            <Switch
              id="bot-toggle"
              checked={botEnabled}
              onCheckedChange={setBotEnabled}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bot Performance Metrics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 border border-green-200 bg-green-50">
                <div className="text-xs text-green-600">Total P&L</div>
                <div className="text-lg font-bold text-green-700">
                  ${metrics.totalPnL.toLocaleString()}
                </div>
              </Card>
              
              <Card className="p-3 border border-blue-200 bg-blue-50">
                <div className="text-xs text-blue-600">Daily P&L</div>
                <div className="text-lg font-bold text-blue-700">
                  ${metrics.dailyPnL.toFixed(2)}
                </div>
              </Card>
              
              <Card className="p-3 border border-purple-200 bg-purple-50">
                <div className="text-xs text-purple-600">Win Rate</div>
                <div className="text-lg font-bold text-purple-700">
                  {metrics.winRate}%
                </div>
              </Card>
              
              <Card className="p-3 border border-indigo-200 bg-indigo-50">
                <div className="text-xs text-indigo-600">Sharpe Ratio</div>
                <div className="text-lg font-bold text-indigo-700">
                  {metrics.sharpeRatio}
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>AI Accuracy</span>
                  <span>{metrics.accuracy}%</span>
                </div>
                <Progress value={metrics.accuracy} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bot Efficiency</span>
                  <span>{metrics.efficiency.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.efficiency} className="h-2" />
              </div>
            </div>
          </div>

          {/* Live Positions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Positions
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {positions.map((position) => (
                <Card key={position.id} className="p-3 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{position.symbol}</div>
                      <Badge variant="outline" className={position.type === 'long' ? 'text-green-600' : 'text-red-600'}>
                        {position.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className={cn("text-right", getPositionColor(position.pnl))}>
                      <div className="font-bold">${position.pnl.toFixed(2)}</div>
                      <div className="text-sm">({position.pnlPercent.toFixed(2)}%)</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Entry: ${position.entry.toLocaleString()}</div>
                    <div>Current: ${position.current.toLocaleString()}</div>
                    <div>Qty: {position.quantity}</div>
                    <div>{new Date(position.timestamp).toLocaleTimeString()}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Signals & Bot Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Market Signals
            </h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {signals.map((signal, index) => (
                <Card key={index} className={cn("p-3 border-2", getSignalColor(signal.action))}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{signal.symbol}</div>
                      <Badge className={cn("text-xs", getSignalColor(signal.action))}>
                        {signal.action.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${signal.price}</div>
                      <div className="text-xs">AI: {signal.aiScore}%</div>
                    </div>
                  </div>
                  
                  <div className="text-xs mb-2">
                    Confidence: {signal.confidence}%
                  </div>
                  <Progress value={signal.confidence} className="h-1 mb-2" />
                  
                  <div className="text-xs text-gray-600">
                    {signal.reasoning}
                  </div>
                </Card>
              ))}
            </div>

            {/* Bot Settings */}
            <Card className="p-4 border border-gray-200 bg-gray-50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Bot Controls
              </h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Max Risk %</Label>
                    <Input 
                      type="number" 
                      value={botSettings.maxRisk}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, maxRisk: Number(e.target.value) }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Positions</Label>
                    <Input 
                      type="number" 
                      value={botSettings.maxPositions}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, maxPositions: Number(e.target.value) }))}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Take Profit %</Label>
                    <Input 
                      type="number" 
                      value={botSettings.takeProfitPercent}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, takeProfitPercent: Number(e.target.value) }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Stop Loss %</Label>
                    <Input 
                      type="number" 
                      value={botSettings.stopLossPercent}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, stopLossPercent: Number(e.target.value) }))}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Quantum Mode</Label>
                  <Switch
                    checked={botSettings.quantumMode}
                    onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, quantumMode: checked }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Emergency Stop
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Update Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", botEnabled ? "bg-green-500 animate-pulse" : "bg-red-500")}></div>
                <span className="text-sm font-medium">
                  Status: {botEnabled ? 'Trading Active' : 'Standby Mode'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm">
                  AI Confidence: {signals[0]?.confidence || 0}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span>Positions: {positions.length}/{botSettings.maxPositions}</span>
              <span className={cn("font-semibold", getPositionColor(metrics.dailyPnL))}>
                Today: ${metrics.dailyPnL.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}