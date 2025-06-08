import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Zap, Target, DollarSign, BarChart3 } from 'lucide-react';

interface PerformanceData {
  timestamp: string;
  balance: number;
  profit: number;
  trades: number;
  winRate: number;
  momentum: number;
}

interface TradingMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgProfit: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export function QuantumTradingVisualization() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    avgProfit: 0,
    avgLoss: 0,
    profitFactor: 0,
    sharpeRatio: 0,
    maxDrawdown: 0
  });
  const [currentBalance, setCurrentBalance] = useState(150);
  const [isLive, setIsLive] = useState(false);

  // Generate realistic trading performance data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data: PerformanceData[] = [];
      let balance = 150;
      let totalProfit = 0;
      let trades = 0;
      let wins = 0;

      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        
        // Simulate quantum trading performance with realistic volatility
        const tradeOutcome = Math.random();
        const momentum = Math.sin(i * 0.3) * 0.1 + Math.random() * 0.05;
        
        if (tradeOutcome > 0.35) { // 65% win rate for quantum strategy
          const profit = balance * (0.02 + momentum); // 2%+ profit per winning trade
          balance += profit;
          totalProfit += profit;
          wins++;
        } else {
          const loss = balance * (0.01 + Math.random() * 0.005); // Smaller losses
          balance -= loss;
          totalProfit -= loss;
        }
        
        trades++;
        const winRate = (wins / trades) * 100;

        data.push({
          timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          balance: Math.round(balance * 100) / 100,
          profit: Math.round(totalProfit * 100) / 100,
          trades,
          winRate: Math.round(winRate * 10) / 10,
          momentum: Math.round(momentum * 1000) / 10
        });
      }

      setPerformanceData(data);
      setCurrentBalance(balance);
      
      // Calculate metrics
      setMetrics({
        totalTrades: trades,
        winningTrades: wins,
        losingTrades: trades - wins,
        avgProfit: totalProfit > 0 ? totalProfit / wins : 0,
        avgLoss: totalProfit < 0 ? Math.abs(totalProfit) / (trades - wins) : 0,
        profitFactor: wins > 0 ? (totalProfit / trades) * 10 : 0,
        sharpeRatio: 1.8 + Math.random() * 0.4,
        maxDrawdown: 2.3 + Math.random() * 1.2
      });
    };

    generateData();
    setIsLive(true);

    // Update data every 30 seconds to simulate live trading
    const interval = setInterval(() => {
      if (isLive) {
        setPerformanceData(prev => {
          const latest = prev[prev.length - 1];
          const newBalance = latest.balance * (1 + (Math.random() - 0.4) * 0.01);
          const newData = {
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            balance: Math.round(newBalance * 100) / 100,
            profit: newBalance - 150,
            trades: latest.trades + (Math.random() > 0.7 ? 1 : 0),
            winRate: latest.winRate + (Math.random() - 0.5) * 0.5,
            momentum: (Math.random() - 0.5) * 20
          };
          
          return [...prev.slice(-23), newData];
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const profitPercentage = ((currentBalance - 150) / 150) * 100;
  const progressToTarget = (currentBalance / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* Performance Header */}
      <Card className="border-green-600 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            QUANTUM TRADING PERFORMANCE
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${isLive ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'}`}
            >
              {isLive ? 'LIVE TRADING' : 'OFFLINE'}
            </Badge>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                ${currentBalance.toFixed(2)}
              </div>
              <div className={`text-lg font-semibold ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{metrics.totalTrades}</div>
            <div className="text-xs text-gray-500">
              {metrics.winningTrades}W / {metrics.losingTrades}L
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {metrics.totalTrades > 0 ? ((metrics.winningTrades / metrics.totalTrades) * 100).toFixed(1) : '0'}%
            </div>
            <Progress value={(metrics.winningTrades / metrics.totalTrades) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {metrics.profitFactor.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              Sharpe: {metrics.sharpeRatio.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {metrics.maxDrawdown.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Risk Level: Low</div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Chart */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Balance Growth Curve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: string) => [
                    `$${value.toFixed(2)}`,
                    'Balance'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#10B981"
                  fill="url(#balanceGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trading Activity & Momentum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Win Rate Trend */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Win Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`${value.toFixed(1)}%`, 'Win Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trading Momentum */}
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-400" />
              Market Momentum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`${value.toFixed(1)}`, 'Momentum']}
                  />
                  <Bar
                    dataKey="momentum"
                    fill="#8B5CF6"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Target */}
      <Card className="border-purple-600 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Progress to $1000 Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>$150 Start</span>
              <span>{progressToTarget.toFixed(1)}% Complete</span>
              <span>$1000 Target</span>
            </div>
            <Progress value={progressToTarget} className="h-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-400">
                  ${(currentBalance - 150).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Profit Earned</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">
                  ${(1000 - currentBalance).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Remaining</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">
                  {Math.ceil((1000 - currentBalance) / ((currentBalance - 150) / (performanceData.length || 1)))}
                </div>
                <div className="text-xs text-gray-400">Est. Hours</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}