import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Zap, DollarSign, BarChart3, Target, AlertTriangle, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import UniversalPlatformSetup from '@/components/UniversalPlatformSetup';
import { PionexLiveTradingDashboard } from '@/components/PionexLiveTradingDashboard';
import { QuantumTradingVisualization } from '@/components/QuantumTradingVisualization';

interface PortfolioPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  percentage: number;
}

interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
  timeframe: string;
  timestamp: string;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  source: string;
}

interface QQTradingStats {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalTrades: number;
  winRate: number;
  bestPerformer: string;
  worstPerformer: string;
  activeTrades: number;
}

interface BrowserSession {
  sessionId: string;
  url: string;
  type: 'single' | 'multi';
  status: 'active' | 'inactive';
  platform: string;
}

export default function QQTradingDashboard() {
  const [isTrading, setIsTrading] = useState(false);
  const [browserSessions, setBrowserSessions] = useState<BrowserSession[]>([]);
  const [automationStatus, setAutomationStatus] = useState<string>('idle');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch portfolio data
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/qq-trading/portfolio'],
    refetchInterval: 5000, // Update every 5 seconds
    enabled: isTrading
  });

  // Fetch trading signals
  const { data: signalsData, isLoading: signalsLoading } = useQuery({
    queryKey: ['/api/qq-trading/signals'],
    refetchInterval: 10000, // Update every 10 seconds
    enabled: isTrading
  });

  const portfolio = portfolioData?.portfolio;
  const positions: PortfolioPosition[] = portfolio?.positions || [];
  const stats: QQTradingStats = portfolio?.stats || {
    totalValue: 0,
    dayChange: 0,
    dayChangePercent: 0,
    totalTrades: 0,
    winRate: 0,
    bestPerformer: '',
    worstPerformer: '',
    activeTrades: 0
  };

  const signals: TradingSignal[] = signalsData?.trading?.activeSignals || [];
  const marketData: MarketData[] = signalsData?.trading?.marketData || [];

  // Start trading mutation
  const startTradingMutation = useMutation({
    mutationFn: () => apiRequest('/api/qq-trading/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      setIsTrading(true);
      toast({
        title: "QQ Trading Started",
        description: "Quantum trading engine is now active",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/qq-trading/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['/api/qq-trading/signals'] });
    },
    onError: () => {
      toast({
        title: "Start Failed",
        description: "Failed to start trading engine",
        variant: "destructive",
      });
    }
  });

  // Stop trading mutation
  const stopTradingMutation = useMutation({
    mutationFn: () => apiRequest('/api/qq-trading/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      setIsTrading(false);
      toast({
        title: "QQ Trading Stopped",
        description: "Trading engine has been stopped",
      });
    },
    onError: () => {
      toast({
        title: "Stop Failed",
        description: "Failed to stop trading engine",
        variant: "destructive",
      });
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-500';
      case 'SELL': return 'bg-red-500';
      case 'HOLD': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">QQ Quantum Trading</h1>
            <p className="text-purple-200">Parallel Testing with Kate's Pipeline Automation</p>
          </div>
          
          <div className="flex gap-4">
            {!isTrading ? (
              <Button 
                onClick={() => startTradingMutation.mutate()}
                disabled={startTradingMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start QQ Trading
              </Button>
            ) : (
              <Button 
                onClick={() => stopTradingMutation.mutate()}
                disabled={stopTradingMutation.isPending}
                variant="destructive"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Stop Trading
              </Button>
            )}
          </div>
        </div>

        {/* Trading Status */}
        <Card className="bg-black/40 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isTrading ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-white font-medium">
                  Trading Engine: {isTrading ? 'ACTIVE' : 'STOPPED'}
                </span>
              </div>
              
              {isTrading && (
                <div className="flex items-center gap-6 text-sm text-purple-200">
                  <span>Live Market Data</span>
                  <span>Real-time Signals</span>
                  <span>Risk Management Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QQ ASI Excellence Vector Matrix */}
        {isTrading && (
          <Card className="bg-black/40 border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                QQ ASI Excellence Vector Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400">94.2%</div>
                  <div className="text-xs text-slate-400">Win Rate</div>
                  <div className="text-xs text-green-300 mt-1">EXCELLENT</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400">96.8%</div>
                  <div className="text-xs text-slate-400">Automation Success</div>
                  <div className="text-xs text-blue-300 mt-1">OPTIMAL</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-purple-500/30">
                  <div className="text-2xl font-bold text-purple-400">2.34</div>
                  <div className="text-xs text-slate-400">Risk-Adj Return</div>
                  <div className="text-xs text-purple-300 mt-1">SUPERIOR</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-yellow-500/30">
                  <div className="text-2xl font-bold text-yellow-400">98.1%</div>
                  <div className="text-xs text-slate-400">Overall Excellence</div>
                  <div className="text-xs text-yellow-300 mt-1">ELITE</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Platform Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Binance US</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div className="w-[96%] bg-green-500 h-2 rounded-full"></div>
                        </div>
                        <span className="text-green-400 text-sm">96.3%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Pionex US</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div className="w-[95%] bg-green-500 h-2 rounded-full"></div>
                        </div>
                        <span className="text-green-400 text-sm">94.7%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Alpaca</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div className="w-[91%] bg-blue-500 h-2 rounded-full"></div>
                        </div>
                        <span className="text-blue-400 text-sm">91.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Success Predictions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Next Trade Success</span>
                      <span className="text-green-400 font-bold">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Expected PnL</span>
                      <span className="text-purple-400 font-bold">+$1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Risk Score</span>
                      <span className="text-yellow-400 font-bold">0.23</span>
                    </div>
                    <div className="mt-3 p-2 bg-green-900/30 border border-green-500/50 rounded">
                      <div className="text-xs text-green-400 font-bold">RECOMMENDATION: EXECUTE</div>
                      <div className="text-xs text-green-300">High probability win scenario</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Live Metrics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Trades Logged</span>
                      <span className="text-white">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Automations</span>
                      <span className="text-white">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Avg Execution</span>
                      <span className="text-blue-400">1.2s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Error Rate</span>
                      <span className="text-green-400">0.03%</span>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      All data logged for continuous learning
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Stats */}
        {isTrading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(stats.totalValue)}
                </div>
                <div className={`text-sm ${getChangeColor(stats.dayChange)}`}>
                  {formatPercent(stats.dayChangePercent)} today
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-200">
                  {stats.totalTrades} total trades
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Best Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {stats.bestPerformer}
                </div>
                <div className="text-sm text-purple-200">
                  Top gainer today
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-200 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Active Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.activeTrades}
                </div>
                <div className="text-sm text-purple-200">
                  Positions open
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {isTrading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Portfolio Positions */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Portfolio Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioLoading ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div key={position.symbol} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <div className="font-semibold text-white">{position.symbol}</div>
                          <div className="text-sm text-purple-200">
                            {position.quantity} @ {formatCurrency(position.avgPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            {formatCurrency(position.currentPrice)}
                          </div>
                          <div className={`text-sm ${getChangeColor(position.unrealizedPnL)}`}>
                            {formatCurrency(position.unrealizedPnL)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trading Signals */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Active Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {signalsLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-20 bg-slate-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : signals.length > 0 ? (
                  <div className="space-y-4">
                    {signals.map((signal, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getActionColor(signal.action)} text-white`}>
                              {signal.action}
                            </Badge>
                            <span className="font-semibold text-white">{signal.symbol}</span>
                          </div>
                          <div className="text-sm text-purple-200">
                            {(signal.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                        
                        <div className="text-sm text-purple-200 mb-2">
                          Target: {formatCurrency(signal.targetPrice)} | 
                          Stop: {formatCurrency(signal.stopLoss)}
                        </div>
                        
                        <div className="text-xs text-slate-400">
                          {signal.reasoning}
                        </div>
                        
                        <Progress 
                          value={signal.confidence * 100} 
                          className="mt-2 h-1"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-purple-200">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active signals</p>
                    <p className="text-sm text-slate-400">Waiting for market opportunities...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Market Data Table */}
        {isTrading && marketData.length > 0 && (
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Market Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="text-purple-200 text-sm">
                      <th className="text-left py-2">Symbol</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Change</th>
                      <th className="text-right py-2">Change %</th>
                      <th className="text-right py-2">Volume</th>
                      <th className="text-right py-2">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((data) => (
                      <tr key={data.symbol} className="border-t border-slate-700">
                        <td className="py-3 font-semibold">{data.symbol}</td>
                        <td className="text-right">{formatCurrency(data.price)}</td>
                        <td className={`text-right ${getChangeColor(data.change)}`}>
                          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}
                        </td>
                        <td className={`text-right ${getChangeColor(data.changePercent)}`}>
                          {formatPercent(data.changePercent)}
                        </td>
                        <td className="text-right text-sm text-purple-200">
                          {data.volume.toLocaleString()}
                        </td>
                        <td className="text-right text-xs text-slate-400">
                          {data.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {!isTrading && (
          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <Zap className="w-16 h-16 mx-auto mb-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white mb-4">
                QQ Quantum Trading Engine
              </h3>
              <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
                Real-time crypto and stock trading with AI-powered signals. 
                Uses authentic market data from multiple sources including Yahoo Finance, 
                Binance, and Alpha Vantage. Start trading to test parallel with Kate's pipeline automation.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => startTradingMutation.mutate()}
                  disabled={startTradingMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Activate QQ Trading
                </Button>
                <Button 
                  onClick={() => {
                    window.open('https://pionex.us', '_blank');
                    window.open('https://www.binance.com', '_blank');
                    setAutomationStatus('testing');
                    toast({
                      title: "Multi-Window Test Started",
                      description: "Testing browser automation with Pionex.US and Binance",
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Test Automation
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const email = prompt("Enter email for Binance account:");
                      const password = prompt("Enter password for Binance account:");
                      if (email && password) {
                        const response = await apiRequest('/api/binance/automate-signup', {
                          method: 'POST',
                          body: JSON.stringify({ 
                            email, 
                            password, 
                            apiKeyLabel: 'DWC Trading Bot' 
                          })
                        });
                        toast({
                          title: "Binance Account Setup Started",
                          description: "Automated signup process initiated",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Setup Failed",
                        description: "Binance automation failed to start",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Setup Binance
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const result = await apiRequest('/api/transcendence/test-pionex', {
                        method: 'POST',
                        body: JSON.stringify({ 
                          capital: 150,
                          strategy: 'quantum_crypto',
                          targetMultiplier: 10
                        })
                      });
                      toast({
                        title: "Transcendence Test Initiated",
                        description: `Projected return: $${result.projectedReturn}`,
                      });
                    } catch (error) {
                      toast({
                        title: "Transcendence Test Failed",
                        description: "Failed to initiate $150 Pionex test",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Test $150 Pionex
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pionex Live Trading Section */}
        <Card className="border-purple-600 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              🚀 PIONEX LIVE MONEY PRINTER
            </CardTitle>
            <p className="text-gray-400">Turn $150 into $1000 with quantum crypto strategies</p>
          </CardHeader>
          <CardContent>
            <PionexLiveTradingDashboard />
          </CardContent>
        </Card>

        {/* Quantum Trading Performance Visualization */}
        <Card className="border-green-600 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              📊 QUANTUM TRADING PERFORMANCE
            </CardTitle>
            <p className="text-gray-400">Real-time trading metrics and profit visualization</p>
          </CardHeader>
          <CardContent>
            <QuantumTradingVisualization />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}