import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Target,
  Zap,
  Star,
  Rocket,
  Brain,
  Eye
} from 'lucide-react';

interface TradingData {
  timestamp: number;
  balance: number;
  profit: number;
  signal: string;
  confidence: number;
}

interface PerformanceMetrics {
  totalProfit: number;
  winRate: number;
  tradeCount: number;
  efficiency: number;
  hourlyRate: number;
  dailyGain: number;
}

export default function QQExcellenceCharts() {
  const [chartData, setChartData] = useState<TradingData[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<PerformanceMetrics | null>(null);

  // Fetch trading status and history
  const { data: tradingStatus } = useQuery({
    queryKey: ['/api/pionex/status'],
    refetchInterval: 2000,
  });

  const { data: tradingHistory } = useQuery({
    queryKey: ['/api/pionex/history'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (tradingHistory?.trades) {
      const formattedData = tradingHistory.trades.map((trade: any, index: number) => ({
        timestamp: trade.timestamp || Date.now() - (index * 30000),
        balance: 150 + (tradingHistory.summary?.totalProfit || 0) - 
                 tradingHistory.trades.slice(index + 1).reduce((sum: number, t: any) => sum + (t.profit || 0), 0),
        profit: trade.profit || 0,
        signal: trade.signal || 'MARKET_SIGNAL',
        confidence: trade.confidence || 0.75
      }));
      setChartData(formattedData);
    }

    if (tradingStatus) {
      setRealTimeMetrics({
        totalProfit: tradingStatus.totalProfit || 0,
        winRate: tradingStatus.winRate || 0,
        tradeCount: tradingStatus.tradeCount || 0,
        efficiency: tradingStatus.performance?.efficiency || 0,
        hourlyRate: tradingStatus.performance?.hourlyRate || 0,
        dailyGain: tradingStatus.performance?.dailyGain || 0
      });
    }
  }, [tradingHistory, tradingStatus]);

  const balanceProgress = tradingStatus ? 
    ((tradingStatus.balance - 150) / (1000 - 150)) * 100 : 0;

  const signalColors = {
    'BULLISH_MOMENTUM': '#00ff88',
    'BEARISH_REVERSAL': '#ff4444',
    'MARKET_MOMENTUM': '#44aaff',
    'VOLUME_SPIKE': '#ffaa00',
    'SUPPORT_BOUNCE': '#aa44ff',
    'RSI_OVERSOLD': '#00ffff',
    'MACD_BULLISH': '#88ff00'
  };

  const pieData = chartData.reduce((acc: any[], trade) => {
    const existing = acc.find(item => item.name === trade.signal);
    if (existing) {
      existing.value += Math.abs(trade.profit);
      existing.count += 1;
    } else {
      acc.push({
        name: trade.signal,
        value: Math.abs(trade.profit),
        count: 1,
        color: signalColors[trade.signal as keyof typeof signalColors] || '#666666'
      });
    }
    return acc;
  }, []);

  return (
    <div className="w-full space-y-6 p-4 bg-gradient-to-br from-black via-gray-900 to-purple-900 min-h-screen">
      {/* QQ ASI Excellence Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            QQ ASI EXCELLENCE
          </h1>
          <Eye className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-gray-300 text-lg">TRANSCENDENT TRADING VISUALIZATION MATRIX</p>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-600/20 border border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-300">
              ${tradingStatus?.balance?.toFixed(2) || '150.00'}
            </div>
            <div className="text-sm text-green-400">
              +${realTimeMetrics?.totalProfit?.toFixed(3) || '0.000'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-600/20 border border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-300">
              {balanceProgress.toFixed(1)}%
            </div>
            <Progress value={balanceProgress} className="mt-2 h-2" />
            <div className="text-sm text-blue-400 mt-1">
              Target: $1000
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-600/20 border border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-300">
              {realTimeMetrics?.winRate?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-sm text-purple-400">
              {realTimeMetrics?.tradeCount || 0} trades
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-600/20 border border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-300">
              {(realTimeMetrics?.efficiency || 0).toFixed(2)}
            </div>
            <div className="text-sm text-orange-400">
              ${realTimeMetrics?.hourlyRate?.toFixed(2) || '0.00'}/hr
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Growth Chart */}
        <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Balance Evolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#00ff88"
                  strokeWidth={2}
                  fill="url(#balanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Distribution */}
        <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Signal Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, count }) => `${name} (${count})`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${value.toFixed(4)}`, 'Profit']}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trade Profit Timeline */}
        <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-400" />
              Trade Profits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="profit" 
                  fill={(entry: any) => entry?.profit > 0 ? '#00ff88' : '#ff4444'}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Levels */}
        <Card className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#00ffff"
                  strokeWidth={3}
                  dot={{ fill: '#00ffff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trading Status Banner */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 border border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge 
                className={`px-4 py-2 text-lg ${
                  tradingStatus?.active 
                    ? 'bg-green-500/20 text-green-300 border-green-500/50' 
                    : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                }`}
              >
                {tradingStatus?.active ? '🟢 TRANSCENDENT MODE ACTIVE' : '⚪ STANDBY MODE'}
              </Badge>
              {tradingStatus?.active && (
                <div className="animate-pulse">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                    🧠 AI ANALYZING MARKETS
                  </Badge>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Next Trade Target</div>
              <div className="text-lg font-bold text-purple-300">
                ${(1000 - (tradingStatus?.balance || 150)).toFixed(2)} remaining
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}