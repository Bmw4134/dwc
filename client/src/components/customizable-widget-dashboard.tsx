import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Clock,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

interface ChartData {
  time: string;
  balance: number;
  profit: number;
  trades: number;
  winRate: number;
}

export default function CustomizableWidgetDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'balance-chart', title: 'Balance Progression', visible: true, position: 1, size: 'large' },
    { id: 'profit-metrics', title: 'Profit Metrics', visible: true, position: 2, size: 'medium' },
    { id: 'trading-stats', title: 'Trading Statistics', visible: true, position: 3, size: 'medium' },
    { id: 'win-rate-chart', title: 'Win Rate Analysis', visible: true, position: 4, size: 'large' },
    { id: 'performance-breakdown', title: 'Performance Breakdown', visible: true, position: 5, size: 'medium' },
    { id: 'real-time-metrics', title: 'Real-Time Metrics', visible: true, position: 6, size: 'small' }
  ]);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [showConfig, setShowConfig] = useState(false);

  // Fetch persistent metrics and status
  const { data: metrics } = useQuery({
    queryKey: ['/api/trading/persistent-metrics'],
    refetchInterval: 3000
  });

  const { data: status } = useQuery({
    queryKey: ['/api/pionex/status'],
    refetchInterval: 2000
  });

  // Build chart data from real metrics
  useEffect(() => {
    if (metrics && status) {
      const newDataPoint: ChartData = {
        time: new Date().toLocaleTimeString(),
        balance: status.balance || 150,
        profit: metrics.sessionProfit || 0,
        trades: metrics.totalTrades || 0,
        winRate: metrics.winRate || 0
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint].slice(-20); // Keep last 20 points
        return updated;
      });
    }
  }, [metrics, status]);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.position - b.position);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  const renderBalanceChart = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Live Balance Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-slate-400">Current</p>
            <p className="text-lg font-bold text-green-400">
              ${status?.balance?.toFixed(4) || '0.0000'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400">Session High</p>
            <p className="text-lg font-bold text-blue-400">
              ${Math.max(...chartData.map(d => d.balance)).toFixed(4)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400">Growth</p>
            <p className="text-lg font-bold text-purple-400">
              {metrics?.sessionROI?.toFixed(2) || '0.00'}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProfitMetrics = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Profit Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">All-Time Profit</span>
            <span className="text-2xl font-bold text-green-400">
              ${metrics?.allTimeProfit?.toFixed(4) || '0.0000'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Session Profit</span>
            <span className="text-xl font-bold text-blue-400">
              ${metrics?.sessionProfit?.toFixed(4) || '0.0000'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Profit Per Trade</span>
            <span className="text-lg font-bold text-purple-400">
              ${metrics?.profitPerTrade?.toFixed(4) || '0.0000'}
            </span>
          </div>
          <Progress 
            value={((metrics?.currentBalance || 150) - 150) / 10 * 100} 
            className="h-2"
          />
          <p className="text-xs text-slate-400 text-center">
            Progress to next $10 milestone
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTradingStats = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Trading Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Trades</span>
            <span className="font-bold text-blue-400">{metrics?.totalTrades || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Win Rate</span>
            <span className="font-bold text-green-400">{metrics?.winRate?.toFixed(1) || '0.0'}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Trading Streak</span>
            <span className="font-bold text-purple-400">{metrics?.tradingStreak || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">All-Time ROI</span>
            <span className="font-bold text-emerald-400">{metrics?.allTimeROI?.toFixed(2) || '0.00'}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderWinRateChart = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          Win Rate Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Line 
                type="monotone" 
                dataKey="winRate" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderPerformanceBreakdown = () => {
    const performanceData = [
      { name: 'Profitable', value: metrics?.winRate || 0, color: '#10b981' },
      { name: 'Break Even', value: 5, color: '#f59e0b' },
      { name: 'Loss', value: 100 - (metrics?.winRate || 0) - 5, color: '#ef4444' }
    ];

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-emerald-500" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#d1d5db' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRealTimeMetrics = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          Live Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">ACTIVE</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Update</span>
            <span className="text-blue-400">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Next Trade</span>
            <span className="text-purple-400">~30s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.id) {
      case 'balance-chart': return renderBalanceChart();
      case 'profit-metrics': return renderProfitMetrics();
      case 'trading-stats': return renderTradingStats();
      case 'win-rate-chart': return renderWinRateChart();
      case 'performance-breakdown': return renderPerformanceBreakdown();
      case 'real-time-metrics': return renderRealTimeMetrics();
      default: return null;
    }
  };

  const getGridClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-1 md:col-span-3';
      default: return 'col-span-1';
    }
  };

  return (
    <div className="space-y-6">
      {/* Widget Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-500" />
              Dashboard Widgets
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              {showConfig ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showConfig ? 'Hide' : 'Configure'}
            </Button>
          </div>
        </CardHeader>
        {showConfig && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm font-medium">{widget.title}</span>
                  <Switch
                    checked={widget.visible}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleWidgets.map(widget => (
          <div key={widget.id} className={getGridClass(widget.size)}>
            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  );
}