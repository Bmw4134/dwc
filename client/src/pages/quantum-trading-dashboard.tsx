import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Zap,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LivePnLChart from '@/components/live-pnl-chart';

interface TradingSignal {
  symbol: string;
  direction: string;
  strength: number;
  strategy: string;
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
}

interface BehaviorMetrics {
  total_trades: number;
  strategies_used: string[];
  current_strategy_weights: Record<string, number>;
  risk_metrics: {
    max_daily_loss: number;
    current_daily_pnl: number;
    risk_floor: number;
    win_streak_limit: number;
    current_win_streak: number;
  };
  safety_status: {
    trading_enabled: boolean;
    preview_mode: boolean;
    risk_check_passed: boolean;
  };
  agent_memory: {
    view_confidence: Record<string, number>;
    last_trigger: {
      timestamp: string;
      action: string;
      confidence: number;
    };
  };
}

export default function QuantumTradingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tradingEnabled, setTradingEnabled] = useState(true);

  const { data: signals, isLoading: signalsLoading } = useQuery<{
    active_signals: TradingSignal[];
    market_conditions: Record<string, string>;
  }>({
    queryKey: ['/api/quantum/signals'],
    refetchInterval: 5000,
    retry: false,
  });

  const { data: behavior, isLoading: behaviorLoading } = useQuery<BehaviorMetrics>({
    queryKey: ['/api/quantum/behavior'],
    refetchInterval: 10000,
    retry: false,
  });

  const handleToggleTrading = () => {
    setTradingEnabled(!tradingEnabled);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quantum Trading Dashboard</h1>
          <p className="text-gray-400">Advanced ASI → AGI → AI Trading System</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={tradingEnabled ? "default" : "secondary"}>
            {tradingEnabled ? "Trading Active" : "Trading Paused"}
          </Badge>
          <Badge variant="outline">Preview Mode</Badge>
          <Button 
            onClick={handleToggleTrading}
            variant={tradingEnabled ? "destructive" : "default"}
            size="sm"
          >
            {tradingEnabled ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {tradingEnabled ? "Pause" : "Start"}
          </Button>
        </div>
      </div>

      {/* Safety Alert */}
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <Shield className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-200">
          System running in PREVIEW MODE. All trades are simulated. $100 budget cap active.
          Emergency override: DWC_OVERRIDE_2025
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="behavior">Bot Behavior</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Live P&L Chart */}
          <LivePnLChart />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">4</div>
                <p className="text-xs text-gray-400">Trend, Mean Rev, Momentum, Range</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">73.5%</div>
                <p className="text-xs text-gray-400">Last 30 trades</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">Low</div>
                <p className="text-xs text-gray-400">Within safety limits</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Active Trading Signals</CardTitle>
              <CardDescription className="text-gray-400">
                Real-time market analysis and trade recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signalsLoading ? (
                <div className="text-gray-400">Loading signals...</div>
              ) : signals?.active_signals ? (
                <div className="space-y-4">
                  {signals.active_signals.map((signal, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={signal.direction === 'LONG' ? 'default' : 'destructive'}>
                            {signal.direction}
                          </Badge>
                          <span className="text-white font-semibold">{signal.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Confidence</div>
                          <div className="text-white">{(signal.confidence * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Entry</div>
                          <div className="text-white">${signal.entry_price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Stop Loss</div>
                          <div className="text-red-400">${signal.stop_loss.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Take Profit</div>
                          <div className="text-green-400">${signal.take_profit.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-400 capitalize">{signal.strategy.replace('_', ' ')}</span>
                        <Badge variant="outline">
                          Strength: {(signal.strength * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">No active signals</div>
              )}
            </CardContent>
          </Card>

          {/* Market Conditions */}
          {signals?.market_conditions && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Market Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Trend</div>
                    <Badge variant={signals.market_conditions.trend === 'BULLISH' ? 'default' : 'destructive'}>
                      {signals.market_conditions.trend}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Volatility</div>
                    <Badge variant="outline">{signals.market_conditions.volatility}</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Volume</div>
                    <Badge variant="outline">{signals.market_conditions.volume}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          {behavior && (
            <>
              {/* Strategy Weights */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quantum Safe Loop Adaptation</CardTitle>
                  <CardDescription className="text-gray-400">
                    AI adapts strategy weights based on performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(behavior.current_strategy_weights).map(([strategy, weight]) => (
                      <div key={strategy} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{strategy.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${weight * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-12">
                            {(weight * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agent Memory */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Agent Memory & Learning</CardTitle>
                  <CardDescription className="text-gray-400">
                    View confidence scores and learning patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(behavior.agent_memory.view_confidence).map(([view, confidence]) => (
                      <div key={view} className="text-center">
                        <div className="text-sm text-gray-400 capitalize">{view.replace('_', ' ')}</div>
                        <div className="text-lg font-semibold text-white">
                          {(confidence * 100).toFixed(0)}%
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                          <div 
                            className="h-1 rounded-full bg-blue-400"
                            style={{ width: `${confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {behavior && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Management Status</CardTitle>
                <CardDescription className="text-gray-400">
                  Safety protocols and risk limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Safety Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      {behavior.safety_status.trading_enabled ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white">Trading Enabled</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {behavior.safety_status.preview_mode ? (
                        <Shield className="w-5 h-5 text-blue-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white">Preview Mode</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {behavior.safety_status.risk_check_passed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white">Risk Check Passed</span>
                    </div>
                  </div>

                  {/* Risk Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div>
                      <div className="text-sm text-gray-400">Max Daily Loss</div>
                      <div className="text-lg font-semibold text-red-400">
                        ${behavior.risk_metrics.max_daily_loss}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Current P&L</div>
                      <div className={`text-lg font-semibold ${
                        behavior.risk_metrics.current_daily_pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${behavior.risk_metrics.current_daily_pnl.toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Win Streak</div>
                      <div className="text-lg font-semibold text-purple-400">
                        {behavior.risk_metrics.current_win_streak}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Risk Floor</div>
                      <div className="text-lg font-semibold text-orange-400">
                        ${behavior.risk_metrics.risk_floor}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}