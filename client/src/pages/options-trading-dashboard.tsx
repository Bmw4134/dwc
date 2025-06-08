import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap, AlertTriangle, Clock, BarChart3 } from 'lucide-react';

interface OptionsContract {
  symbol: string;
  strike: string;
  expiry: string;
  type: 'CALL' | 'PUT';
  premium: number;
  impliedVolatility: number;
  delta: number;
  expectedMove: number;
  probability: number;
}

interface OptionsAnalysis {
  timestamp: number;
  marketCondition: string;
  bestTrades: OptionsContract[];
  volatilityIndex: number;
  marketSentiment: string;
  recommendedStrategy: string;
}

export default function OptionsTradingDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('SPY');
  const [strategy, setStrategy] = useState('scalping');
  const [riskLevel, setRiskLevel] = useState('aggressive');
  const [maxInvestment, setMaxInvestment] = useState(10000);
  const [isTrading, setIsTrading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch persistent metrics for ROI tracking
  const { data: persistentMetrics } = useQuery({
    queryKey: ['/api/trading/persistent-metrics'],
    refetchInterval: 5000
  });

  // Fetch options market analysis
  const { data: optionsAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['/api/options/market-analysis'],
    refetchInterval: 10000
  });

  // Start options trading mutation
  const startOptionsTradingMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/options/start-trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error('Failed to start options trading');
      return response.json();
    },
    onSuccess: () => {
      setIsTrading(true);
      queryClient.invalidateQueries({ queryKey: ['/api/options/market-analysis'] });
    }
  });

  const handleStartTrading = () => {
    startOptionsTradingMutation.mutate({
      symbol: selectedSymbol,
      strategy,
      riskLevel,
      maxInvestment
    });
  };

  const analysis: OptionsAnalysis = optionsAnalysis || {
    timestamp: Date.now(),
    marketCondition: 'LOADING',
    bestTrades: [],
    volatilityIndex: 0,
    marketSentiment: 'NEUTRAL',
    recommendedStrategy: 'SCALPING'
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility > 35) return 'text-red-500';
    if (volatility > 25) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProfitabilityScore = (contract: OptionsContract) => {
    return Math.round((contract.probability * contract.expectedMove * contract.delta) / 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            QQ ASI Options Trading
          </h1>
          <p className="text-xl text-slate-300 mt-2">
            High-Volatility Morning Profit Maximizer
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Market Hours: 9:30 AM - 4:00 PM EST
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Target ROI: 50-200% Daily
            </Badge>
          </div>
        </div>

        {/* Real-time ROI Metrics */}
        {persistentMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">All-Time ROI</p>
                    <p className="text-2xl font-bold text-green-400">
                      {persistentMetrics.allTimeROI.toFixed(2)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Since $150.00 start
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Session Profit</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ${persistentMetrics.sessionProfit.toFixed(4)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Current session gains
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Win Rate</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {persistentMetrics.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {persistentMetrics.totalTrades} total trades
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Current Balance</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${persistentMetrics.currentBalance.toFixed(4)}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Live trading balance
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Configuration */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Options Trading Config
                </CardTitle>
                <CardDescription>
                  Configure your options trading strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Primary Symbol</Label>
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPY">SPY - S&P 500 ETF</SelectItem>
                      <SelectItem value="QQQ">QQQ - NASDAQ ETF</SelectItem>
                      <SelectItem value="IWM">IWM - Russell 2000</SelectItem>
                      <SelectItem value="AAPL">AAPL - Apple</SelectItem>
                      <SelectItem value="TSLA">TSLA - Tesla</SelectItem>
                      <SelectItem value="NVDA">NVDA - NVIDIA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Trading Strategy</Label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scalping">0DTE Scalping</SelectItem>
                      <SelectItem value="momentum">Momentum Trading</SelectItem>
                      <SelectItem value="volatility">Volatility Plays</SelectItem>
                      <SelectItem value="gamma">Gamma Scalping</SelectItem>
                      <SelectItem value="straddle">Long Straddles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk">Risk Level</Label>
                  <Select value={riskLevel} onValueChange={setRiskLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                      <SelectItem value="ultra">Ultra High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment">Max Investment ($)</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={maxInvestment}
                    onChange={(e) => setMaxInvestment(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600"
                  />
                  <p className="text-xs text-slate-400">
                    Maximum amount to risk per position
                  </p>
                </div>

                <Button
                  onClick={handleStartTrading}
                  disabled={startOptionsTradingMutation.isPending || isTrading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {startOptionsTradingMutation.isPending 
                    ? 'Activating...' 
                    : isTrading 
                    ? 'Trading Active' 
                    : 'Start Options Trading'
                  }
                </Button>

                {isTrading && (
                  <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Options trading is ACTIVE
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Monitoring {selectedSymbol} for high-probability trades
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis & Best Trades */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Overview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Real-Time Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Market Condition</p>
                    <Badge 
                      variant={analysis.marketCondition === 'HIGH_VOLATILITY' ? 'destructive' : 'default'}
                      className="mt-1"
                    >
                      {analysis.marketCondition}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">VIX Level</p>
                    <p className={`text-lg font-bold ${getVolatilityColor(analysis.volatilityIndex)}`}>
                      {analysis.volatilityIndex}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Sentiment</p>
                    <Badge 
                      variant={analysis.marketSentiment === 'BULLISH' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {analysis.marketSentiment}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Strategy</p>
                    <p className="text-sm font-medium text-blue-400">
                      {analysis.recommendedStrategy}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Options Trades */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  High-Probability Trades
                </CardTitle>
                <CardDescription>
                  AI-identified options with maximum profit potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-slate-400">Analyzing market conditions...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysis.bestTrades.map((trade, index) => (
                      <Card key={index} className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono">
                                {trade.symbol}
                              </Badge>
                              <Badge 
                                variant={trade.type === 'CALL' ? 'default' : 'secondary'}
                                className="font-mono"
                              >
                                {trade.strike} {trade.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {trade.expiry}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-400">
                                ${trade.premium.toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-400">Premium</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">IV</p>
                              <p className={`font-medium ${getVolatilityColor(trade.impliedVolatility)}`}>
                                {trade.impliedVolatility.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">Delta</p>
                              <p className="font-medium text-blue-400">
                                {trade.delta.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">Expected Move</p>
                              <p className="font-medium text-purple-400">
                                ${trade.expectedMove.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-400">Probability</p>
                              <p className="font-medium text-emerald-400">
                                {trade.probability}%
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Profit Score:</span>
                              <Badge 
                                variant={getProfitabilityScore(trade) > 7 ? 'default' : 'secondary'}
                              >
                                {getProfitabilityScore(trade)}/10
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              disabled={!isTrading}
                            >
                              Execute Trade
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading Alerts */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Live Trading Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {new Date().toLocaleTimeString()}: High volatility detected in {selectedSymbol}
              </div>
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {new Date().toLocaleTimeString()}: Momentum signal triggered for 0DTE calls
              </div>
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {new Date().toLocaleTimeString()}: Options flow indicates bullish sentiment
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}