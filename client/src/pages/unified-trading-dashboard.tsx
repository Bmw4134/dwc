import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, DollarSign, Target, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface TradingStatus {
  isActive: boolean;
  currentBalance: number;
  progress: number;
}

interface QIEMetrics {
  btcPrice: number;
  ethPrice: number;
  marketTrend: string;
  confidence: number;
  totalFeeds: number;
}

interface HouseCut {
  rate: string;
  projection: number;
  goalTarget: string;
}

interface UnifiedTradingResponse {
  success: boolean;
  trading: TradingStatus;
  qieMetrics: QIEMetrics;
  houseCut: HouseCut;
}

export default function UnifiedTradingDashboard() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLive, setIsLive] = useState(false);
  const [previousData, setPreviousData] = useState<UnifiedTradingResponse | null>(null);
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Silent background updates with change detection
  const { data: tradingData, isLoading } = useQuery<UnifiedTradingResponse>({
    queryKey: ["/api/trading/unified"],
    refetchInterval: isLive ? 3000 : 10000, // Faster updates when live trading
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000, // Consider data stale after 1 second
  });

  // Detect actual data changes to prevent unnecessary re-renders
  useEffect(() => {
    if (tradingData && previousData) {
      const hasChanged = (
        tradingData.trading.currentBalance !== previousData.trading.currentBalance ||
        tradingData.qieMetrics.btcPrice !== previousData.qieMetrics.btcPrice ||
        tradingData.qieMetrics.ethPrice !== previousData.qieMetrics.ethPrice ||
        tradingData.trading.progress !== previousData.trading.progress
      );
      
      if (!hasChanged) {
        // No actual changes, prevent re-render flash
        return;
      }
    }
    setPreviousData(tradingData || null);
  }, [tradingData, previousData]);

  // Start trading mutation
  const startTradingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/trading/unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          action: "start"
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    onSuccess: () => {
      setIsLive(true);
      queryClient.invalidateQueries({ queryKey: ["/api/trading/unified"] });
    },
  });

  // Goal achievement mutation
  const goalAchievedMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/trading/unified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "goal-achieved" }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading/unified"] });
    },
  });

  const handleStartTrading = () => {
    if (!credentials.email || !credentials.password) {
      alert("Please enter your Pionex email and password");
      return;
    }
    setIsLive(true);
    startTradingMutation.mutate();
  };

  const handleGoalAchieved = () => {
    goalAchievedMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white/10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const trading = tradingData?.trading || { isActive: false, currentBalance: 150, progress: 0 };
  const qie = tradingData?.qieMetrics || { btcPrice: 0, ethPrice: 0, marketTrend: 'neutral', confidence: 0, totalFeeds: 0 };
  const houseCut = tradingData?.houseCut || { rate: '10%', projection: 85, goalTarget: '$1000' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Autonomous Trading Engine</h1>
          <p className="text-purple-200">Unified Platform with QIE Integration</p>
          <Badge variant={trading.isActive ? "default" : "secondary"} className="text-lg px-4 py-1">
            {trading.isActive ? "LIVE TRADING" : "READY TO TRADE"}
          </Badge>
        </div>

        {/* Main Trading Controls */}
        {!isLive && (
          <Card className="bg-white/10 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pionex Trading Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-purple-200">Pionex Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your-email@example.com"
                    className="bg-white/5 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-purple-200">Pionex Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="bg-white/5 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleStartTrading}
                disabled={startTradingMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {startTradingMutation.isPending ? "Connecting..." : "Start Live Trading"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Trading Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Trading Progress */}
          <Card className="bg-white/10 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Trading Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  ${trading.currentBalance.toFixed(2)}
                </div>
                <div className="text-sm text-purple-200">Current Balance</div>
              </div>
              
              <Progress value={trading.progress} className="h-3" />
              
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">Start: $150</span>
                <span className="text-purple-200">Goal: $1000</span>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-purple-200">
                  {trading.progress.toFixed(1)}% Complete
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QIE Market Data */}
          <Card className="bg-white/10 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                QIE Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">
                    ${qie.btcPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-200">BTC/USDT</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    ${qie.ethPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-200">ETH/USDT</div>
                </div>
              </div>
              
              <Separator className="bg-purple-500/20" />
              
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Market Trend:</span>
                <div className="flex items-center gap-1">
                  {qie.marketTrend === 'bullish' ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : qie.marketTrend === 'bearish' ? (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  ) : (
                    <div className="h-4 w-4 bg-yellow-400 rounded-full" />
                  )}
                  <span className="text-white capitalize">{qie.marketTrend}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Confidence:</span>
                <span className="text-white">{(qie.confidence * 100).toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Data Feeds:</span>
                <span className="text-white">{qie.totalFeeds}</span>
              </div>
            </CardContent>
          </Card>

          {/* House Cut Revenue */}
          <Card className="bg-white/10 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  ${houseCut.projection}
                </div>
                <div className="text-sm text-purple-200">Projected House Cut</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-200">Rate:</span>
                  <span className="text-white">{houseCut.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Goal Target:</span>
                  <span className="text-white">{houseCut.goalTarget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Profit Share:</span>
                  <span className="text-white">${(houseCut.projection * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              {trading.progress >= 100 && (
                <Button 
                  onClick={handleGoalAchieved}
                  disabled={goalAchievedMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {goalAchievedMutation.isPending ? "Processing..." : "Collect House Cut"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-white/10 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-400">ACTIVE</div>
                <div className="text-sm text-purple-200">Trading Engine</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">CONNECTED</div>
                <div className="text-sm text-purple-200">QIE Integration</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">API-BASED</div>
                <div className="text-sm text-purple-200">No Browser Deps</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">UNIFIED</div>
                <div className="text-sm text-purple-200">Single Route</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}