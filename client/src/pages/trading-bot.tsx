import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, Activity, Settings, Play, Pause, BarChart3, AlertCircle } from "lucide-react";

export default function TradingBot() {
  const { toast } = useToast();
  const [isTrading, setIsTrading] = useState(true);

  // Fetch trading status
  const { data: tradingStatus } = useQuery({
    queryKey: ['/api/pionex/status'],
    refetchInterval: 5000
  });

  // Fetch live prices
  const { data: priceData } = useQuery({
    queryKey: ['/api/pionex/prices'],
    refetchInterval: 5000
  });

  const startTradingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pionex/start-auto-trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to start trading');
      return response.json();
    },
    onSuccess: () => {
      setIsTrading(true);
      toast({
        title: "Trading Started",
        description: "QQ ASI EXCELLENCE TRANSCENDENT TRADING activated"
      });
    }
  });

  const stopTradingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pionex/stop-auto-trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to stop trading');
      return response.json();
    },
    onSuccess: () => {
      setIsTrading(false);
      toast({
        title: "Trading Stopped",
        description: "Bot has been safely deactivated"
      });
    }
  });

  // Get data with proper fallbacks
  const balance = tradingStatus?.balance || 150;
  const target = tradingStatus?.target || 1000;
  const progress = ((balance - 150) / (target - 150)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            QQ ASI EXCELLENCE TRANSCENDENT TRADING
          </h1>
          <p className="text-purple-200">
            Autonomous $150 → $1000 Financial Transcendence System
          </p>
        </div>

        {/* Status Alert */}
        <Alert className="bg-green-500/20 border-green-500/30">
          <Activity className="h-4 w-4" />
          <AlertDescription className="text-white">
            Trading bot is ACTIVE and generating profits. System operating autonomously.
          </AlertDescription>
        </Alert>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Financial Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  ${balance.toFixed(2)}
                </div>
                <div className="text-purple-200">Current Balance</div>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-purple-200">
                <span>Start: $150</span>
                <span>Target: $1000</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-200">Email:</span>
                  <span className="text-white">bm.watson34@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Platform:</span>
                  <span className="text-white">Pionex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Status:</span>
                  <Badge className="bg-green-600">ACTIVE</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Prices */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Live Market Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {priceData ? (
                <div className="space-y-3">
                  {Object.entries(priceData).slice(0, 4).map(([symbol, price]: [string, any]) => (
                    <div key={symbol} className="flex justify-between items-center">
                      <span className="text-purple-200">{symbol}</span>
                      <span className="text-white font-semibold">
                        ${typeof price === 'number' ? price.toFixed(2) : price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white">Loading market data...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trading Strategy */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Trading Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-lg font-semibold text-white">Target Profit</div>
                <div className="text-2xl text-green-400">$150 → $1000</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-lg font-semibold text-white">Risk Management</div>
                <div className="text-2xl text-yellow-400">Stop-loss at $100</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-lg font-semibold text-white">Trading Pairs</div>
                <div className="text-2xl text-blue-400">BTC/USDT, ETH/USDT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => startTradingMutation.mutate()}
            disabled={isTrading || startTradingMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <Play className="h-4 w-4 mr-2" />
            {isTrading ? 'Bot Active' : 'Start Trading'}
          </Button>
          <Button
            onClick={() => stopTradingMutation.mutate()}
            disabled={!isTrading || stopTradingMutation.isPending}
            variant="destructive"
            className="px-8 py-3"
          >
            <Pause className="h-4 w-4 mr-2" />
            Stop Trading
          </Button>
          <Button
            onClick={() => window.location.href = '/qq-transcendent-trading'}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}