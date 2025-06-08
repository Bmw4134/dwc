import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Target,
  Smartphone,
  BarChart3,
  Zap,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';

interface TradingStatus {
  active: boolean;
  balance: number;
  target: number;
  progress: string;
  platform: string;
  account: string;
  tradeCount: number;
  totalProfit: number;
  winRate: number;
  portfolioValue: number;
  profitPercentage: string;
  lastTradeTime: number;
  tradingHistory: any[];
  performance: {
    dailyGain: number;
    hourlyRate: number;
    efficiency: number;
  };
}

interface MarketPrices {
  BTC: { price: number; change: number };
  ETH: { price: number; change: number };
  BNB: { price: number; change: number };
}

export default function MobileTradingDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const queryClient = useQueryClient();

  // Trading status query
  const { data: status, isLoading: statusLoading } = useQuery<TradingStatus>({
    queryKey: ['/api/pionex/status'],
    refetchInterval: refreshInterval,
  });

  // Market prices query
  const { data: prices, isLoading: pricesLoading } = useQuery<MarketPrices>({
    queryKey: ['/api/pionex/prices'],
    refetchInterval: refreshInterval,
  });

  // Start/Stop trading mutation
  const toggleTradingMutation = useMutation({
    mutationFn: async () => {
      const endpoint = status?.active ? '/api/pionex/stop-trading' : '/api/pionex/start-auto-trading';
      const response = await fetch(endpoint, { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    },
  });

  // Manual trade execution
  const executeTradeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pionex/execute-trade', { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    },
  });

  const progressPercentage = status ? ((status.balance - 150) / (status.target - 150)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-4">
      {/* Mobile Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Trading Dashboard</h1>
          </div>
          <Badge variant={status?.active ? "default" : "secondary"} className="text-xs">
            {status?.active ? "LIVE" : "PAUSED"}
          </Badge>
        </div>
        
        {/* Quick Stats Bar - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-sm font-bold text-white">${status?.balance?.toFixed(2) || '150.00'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Target</p>
                  <p className="text-sm font-bold text-white">${status?.target || '1000'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Trades</p>
                  <p className="text-sm font-bold text-white">{status?.tradeCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Win Rate</p>
                  <p className="text-sm font-bold text-white">{status?.winRate?.toFixed(1) || '0.0'}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="trading" className="text-xs">Trading</TabsTrigger>
          <TabsTrigger value="markets" className="text-xs">Markets</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Progress Card */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Progress to Target</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={Math.max(0, Math.min(100, progressPercentage))} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current: ${status?.balance?.toFixed(2) || '150.00'}</span>
                  <span className="text-gray-400">Target: ${status?.target || '1000'}</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-400">
                    {progressPercentage.toFixed(1)}%
                  </span>
                  <p className="text-xs text-gray-400">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total Profit</p>
                  <p className="text-lg font-bold text-green-400">
                    +${status?.totalProfit?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Daily Gain</p>
                  <p className="text-lg font-bold text-blue-400">
                    {status?.performance?.dailyGain?.toFixed(2) || '0.00'}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Hourly Rate</p>
                  <p className="text-lg font-bold text-purple-400">
                    ${status?.performance?.hourlyRate?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Efficiency</p>
                  <p className="text-lg font-bold text-yellow-400">
                    {status?.performance?.efficiency?.toFixed(1) || '0.0'}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="space-y-4">
          {/* Trading Controls */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Trading Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-3">
                <Button
                  onClick={() => toggleTradingMutation.mutate()}
                  disabled={toggleTradingMutation.isPending}
                  className={`flex-1 ${
                    status?.active 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {status?.active ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Trading
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Trading
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => executeTradeMutation.mutate()}
                  disabled={executeTradeMutation.isPending || !status?.active}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Execute Trade
                </Button>
              </div>
              
              <div className="text-center text-xs text-gray-400">
                Platform: {status?.platform || 'pionex.us'} • Account: {status?.account || 'bm.watson34@gmail.com'}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Trades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status?.tradingHistory && status.tradingHistory.length > 0 ? (
                <div className="space-y-2">
                  {status.tradingHistory.slice(-5).reverse().map((trade, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                      <div className="flex items-center space-x-2">
                        {trade.profit > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-sm text-white">{trade.pair}</span>
                        <Badge variant="outline" className="text-xs">
                          {trade.side}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          trade.profit > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No trades executed yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Live Market Prices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pricesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  {prices && Object.entries(prices).map(([symbol, data]) => (
                    <div key={symbol} className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{symbol}</span>
                        </div>
                        <span className="text-white font-medium">{symbol}/USDT</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${data.price?.toLocaleString()}</p>
                        <p className={`text-xs ${
                          data.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile Footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${status?.active ? 'bg-green-400' : 'bg-gray-400'}`} />
          <span>
            {status?.active ? 'Trading Active' : 'Trading Paused'} • 
            Last Update: {new Date().toLocaleTimeString()}
          </span>
        </div>
        <p>QQ ASI Excellence Transcendent Trading System</p>
      </div>
    </div>
  );
}