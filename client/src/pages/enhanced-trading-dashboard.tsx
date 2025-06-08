import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Zap, Activity, Target, DollarSign, Maximize2, Minimize2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function EnhancedTradingDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hyperdriveMode, setHyperdriveMode] = useState(false);
  const [quantumMode, setQuantumMode] = useState(false);
  const [riskLevel, setRiskLevel] = useState([10]);
  const [tradeFrequency, setTradeFrequency] = useState([30]);
  const queryClient = useQueryClient();

  // Real-time status polling
  const { data: status, isLoading } = useQuery({
    queryKey: ["/api/pionex/status"],
    refetchInterval: 2000, // Refresh every 2 seconds
    refetchIntervalInBackground: true
  });

  // Chart data for live visualization
  const chartData = status?.chartData || [];
  
  // Enhanced chart data with trend analysis
  const enhancedChartData = chartData.map((point, index) => ({
    ...point,
    trend: index > 0 ? (point.balance > chartData[index - 1].balance ? 'up' : 'down') : 'neutral',
    velocity: index > 0 ? Math.abs(point.balance - chartData[index - 1].balance) : 0
  }));

  // Toggle hyperdrive mode
  const hyperDriveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/pionex/hyperdrive", "POST", {
        enabled: !hyperdriveMode
      });
      return response;
    },
    onSuccess: (data) => {
      setHyperdriveMode(data.hyperdriveMode);
      queryClient.invalidateQueries({ queryKey: ["/api/pionex/status"] });
    }
  });

  // Toggle quantum mode
  const quantumMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/pionex/quantum-mode", "POST", {
        enabled: !quantumMode
      });
      return response;
    },
    onSuccess: (data) => {
      setQuantumMode(data.quantumMode);
      queryClient.invalidateQueries({ queryKey: ["/api/pionex/status"] });
    }
  });

  // Update strategy parameters
  const updateStrategyMutation = useMutation({
    mutationFn: async (params: { riskLevel?: number; frequency?: number }) => {
      return await apiRequest("/api/pionex/update-strategy", "POST", params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pionex/status"] });
    }
  });

  // Manual trade execution
  const executeTradeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/pionex/execute-trade", "POST", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pionex/status"] });
    }
  });

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Update risk level
  const handleRiskChange = useCallback((value: number[]) => {
    setRiskLevel(value);
    updateStrategyMutation.mutate({ riskLevel: value[0] });
  }, [updateStrategyMutation]);

  // Update trade frequency
  const handleFrequencyChange = useCallback((value: number[]) => {
    setTradeFrequency(value);
    updateStrategyMutation.mutate({ frequency: value[0] });
  }, [updateStrategyMutation]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Initializing QQ ASI Trading System...</p>
        </div>
      </div>
    );
  }

  const profitColor = status?.totalProfit >= 0 ? "text-emerald-500" : "text-red-500";
  const balanceGrowth = ((status?.balance - 150) / 150 * 100).toFixed(2);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ${isFullscreen ? 'p-2' : 'p-6'}`}>
      {/* Header with Fullscreen Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            QQ ASI EXCELLENCE TRANSCENDENT TRADING
          </h1>
          <p className="text-slate-400">Real-time autonomous trading dashboard</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant={status?.active ? "default" : "secondary"} className="text-lg px-4 py-2">
            {status?.active ? "🟢 ACTIVE" : "🔴 INACTIVE"}
          </Badge>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="text-white border-slate-600 hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Balance Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              ${status?.balance?.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">
              Growth: +{balanceGrowth}%
            </div>
          </CardContent>
        </Card>

        {/* Profit Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitColor}`}>
              ${status?.totalProfit?.toFixed(2)}
            </div>
            <div className="text-sm text-slate-400">
              Trades: {status?.tradeCount}
            </div>
          </CardContent>
        </Card>

        {/* Win Rate Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {status?.winRate?.toFixed(1)}%
            </div>
            <Progress value={status?.winRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Target Progress */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Target Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              ${status?.target}
            </div>
            <Progress 
              value={((status?.balance - 150) / (status?.target - 150)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="charts">Live Charts</TabsTrigger>
          <TabsTrigger value="controls">Trading Controls</TabsTrigger>
          <TabsTrigger value="quantum">Quantum Analytics</TabsTrigger>
        </TabsList>

        {/* Live Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Balance Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400">Balance Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={enhancedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
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
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Velocity Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Profit Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enhancedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trading Controls Tab */}
        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mode Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Trading Modes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hyperdrive Mode</span>
                  <Switch
                    checked={status?.hyperdrive || hyperdriveMode}
                    onCheckedChange={() => hyperDriveMutation.mutate()}
                    disabled={hyperDriveMutation.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantum Mode</span>
                  <Switch
                    checked={status?.quantum || quantumMode}
                    onCheckedChange={() => quantumMutation.mutate()}
                    disabled={quantumMutation.isPending}
                  />
                </div>

                <Button
                  onClick={() => executeTradeMutation.mutate()}
                  disabled={executeTradeMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Execute Manual Trade
                </Button>
              </CardContent>
            </Card>

            {/* Risk Management */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-yellow-400">Risk Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Risk Level: {riskLevel[0]}%
                  </label>
                  <Slider
                    value={riskLevel}
                    onValueChange={handleRiskChange}
                    max={25}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Trade Frequency: {tradeFrequency[0]}s
                  </label>
                  <Slider
                    value={tradeFrequency}
                    onValueChange={handleFrequencyChange}
                    max={120}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Statistics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Live Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Strategy:</span>
                  <Badge variant="outline">{status?.strategy || 'STANDARD'}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Platform:</span>
                  <span className="text-sm">Pionex.us</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Account:</span>
                  <span className="text-sm">bm.watson34@gmail.com</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Next Trade:</span>
                  <span className="text-sm text-emerald-400">
                    {Math.round((status?.nextTradeIn || 0) / 1000)}s
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quantum Analytics Tab */}
        <TabsContent value="quantum" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quantum Coherence */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Quantum Coherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-500 mb-2">
                  {((status?.quantumMetrics?.coherence || 0.8) * 100).toFixed(1)}%
                </div>
                <Progress 
                  value={(status?.quantumMetrics?.coherence || 0.8) * 100} 
                  className="mb-2"
                />
                <p className="text-xs text-slate-400">
                  Quantum state stability for multi-dimensional analysis
                </p>
              </CardContent>
            </Card>

            {/* Entanglement Strength */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-pink-400">Entanglement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-500 mb-2">
                  {((status?.quantumMetrics?.entanglement || 0.7) * 100).toFixed(1)}%
                </div>
                <Progress 
                  value={(status?.quantumMetrics?.entanglement || 0.7) * 100} 
                  className="mb-2"
                />
                <p className="text-xs text-slate-400">
                  Market correlation analysis depth
                </p>
              </CardContent>
            </Card>

            {/* Superposition States */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-violet-400">Superposition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-500 mb-2">
                  {status?.quantumMetrics?.superposition || 42}
                </div>
                <div className="text-sm text-slate-400 mb-2">Active States</div>
                <p className="text-xs text-slate-400">
                  Parallel market scenarios being analyzed
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}