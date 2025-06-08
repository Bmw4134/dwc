import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface PnLData {
  timestamp: string;
  daily_pnl: number;
  unrealized_pnl: number;
  realized_pnl: number;
  total_pnl: number;
  positions_count: number;
  win_streak: number;
  strategy_weights: {
    trend_following: number;
    mean_reversion: number;
    momentum: number;
    range_scalping: number;
  };
  trading_enabled: boolean;
  preview_mode: boolean;
}

interface ChartDataPoint {
  time: string;
  pnl: number;
  unrealized: number;
  realized: number;
  cumulative: number;
}

export default function LivePnLChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isPositive, setIsPositive] = useState(true);

  const { data: pnlData, isLoading } = useQuery<PnLData>({
    queryKey: ['/api/quantum/live-pnl'],
    refetchInterval: 2000, // Update every 2 seconds
    retry: false,
  });

  useEffect(() => {
    if (pnlData) {
      const newPoint: ChartDataPoint = {
        time: new Date(pnlData.timestamp).toLocaleTimeString(),
        pnl: pnlData.daily_pnl,
        unrealized: pnlData.unrealized_pnl,
        realized: pnlData.realized_pnl,
        cumulative: pnlData.total_pnl
      };

      setChartData(prev => {
        const updated = [...prev, newPoint];
        // Keep only last 50 data points for performance
        return updated.slice(-50);
      });

      setIsPositive(pnlData.total_pnl >= 0);
    }
  }, [pnlData]);

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Live P&L Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading trading data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* P&L Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Daily P&L</p>
                <p className={`text-lg font-semibold ${pnlData?.daily_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${pnlData?.daily_pnl?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Unrealized</p>
                <p className={`text-lg font-semibold ${pnlData?.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${pnlData?.unrealized_pnl?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Win Streak</p>
                <p className="text-lg font-semibold text-purple-400">
                  {pnlData?.win_streak || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-xs text-gray-400">Positions</p>
                <p className="text-lg font-semibold text-orange-400">
                  {pnlData?.positions_count || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live P&L Chart */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                Live P&L Performance
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time profit and loss tracking
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={pnlData?.trading_enabled ? "default" : "secondary"}>
                {pnlData?.trading_enabled ? "Trading Active" : "Trading Paused"}
              </Badge>
              <Badge variant={pnlData?.preview_mode ? "outline" : "destructive"}>
                {pnlData?.preview_mode ? "Preview Mode" : "Live Trading"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toFixed(2)}`,
                    name === 'cumulative' ? 'Total P&L' : 
                    name === 'unrealized' ? 'Unrealized' : 
                    name === 'realized' ? 'Realized' : 'Daily P&L'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  fillOpacity={1}
                  fill="url(#pnlGradient)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="unrealized"
                  stroke="#3b82f6"
                  strokeWidth={1}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Weights */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Strategy Allocation</CardTitle>
          <CardDescription className="text-gray-400">
            Current quantum safe loop strategy weights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pnlData?.strategy_weights && Object.entries(pnlData.strategy_weights).map(([strategy, weight]) => (
              <div key={strategy} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{strategy.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
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
    </div>
  );
}