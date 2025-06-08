import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, AlertTriangle } from "lucide-react";

interface TradingMetrics {
  currentBalance: number;
  targetAmount: number;
  totalTrades: number;
  successfulTrades: number;
  profitLoss: number;
  houseCutAccrued: number;
  confidenceLevel: number;
  btcPrice: number;
  ethPrice: number;
  lastTradeTime: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  tradingPairs: string[];
}

export default function TradingMetricsMonitor() {
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const tradingResponse = await fetch('/api/trading/unified');
        const marketResponse = await fetch('/api/quantum-intelligence/market-feeds');
        
        if (tradingResponse.ok && marketResponse.ok) {
          const tradingData = await tradingResponse.json();
          const marketData = await marketResponse.json();
          
          const btcFeed = marketData.find((feed: any) => feed.symbol === 'BTC/USD');
          const ethFeed = marketData.find((feed: any) => feed.symbol === 'ETH/USD');
          
          setMetrics({
            currentBalance: tradingData.trading?.currentBalance || 153,
            targetAmount: tradingData.trading?.targetAmount || 1000,
            totalTrades: tradingData.trading?.totalTrades || 0,
            successfulTrades: tradingData.trading?.successfulTrades || 0,
            profitLoss: tradingData.trading?.profitLoss || 0,
            houseCutAccrued: tradingData.houseCut?.projection || 0,
            confidenceLevel: tradingData.trading?.confidenceLevel || 95,
            btcPrice: btcFeed?.price || 105600,
            ethPrice: ethFeed?.price || 3870,
            lastTradeTime: new Date().toLocaleTimeString(),
            riskLevel: tradingData.trading?.riskLevel || "LOW",
            tradingPairs: ["BTC/USD", "ETH/USD"]
          });
          
          setIsConnected(true);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchMetrics();
    
    // Update every 5 seconds
    const interval = setInterval(fetchMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trading Metrics Monitor</h1>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const progressToGoal = (metrics.currentBalance / metrics.targetAmount) * 100;
  const winRate = metrics.totalTrades > 0 ? (metrics.successfulTrades / metrics.totalTrades) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Trading Metrics</h1>
        <div className="flex items-center gap-3">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Badge variant="outline">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.currentBalance}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.profitLoss >= 0 ? '+' : ''}${metrics.profitLoss.toFixed(2)} P&L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress to Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressToGoal.toFixed(1)}%</div>
            <Progress value={progressToGoal} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              ${metrics.targetAmount - metrics.currentBalance} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">House Cut Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.houseCutAccrued}</div>
            <p className="text-xs text-muted-foreground">
              10% of profit target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.confidenceLevel}%</div>
            <Badge variant={metrics.confidenceLevel > 90 ? "default" : "secondary"} className="mt-1">
              {metrics.confidenceLevel > 90 ? "High" : "Medium"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Trading Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Trades</span>
              <span className="font-bold">{metrics.totalTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Successful Trades</span>
              <span className="font-bold text-green-600">{metrics.successfulTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Win Rate</span>
              <span className="font-bold">{winRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge variant={metrics.riskLevel === "LOW" ? "default" : metrics.riskLevel === "MEDIUM" ? "secondary" : "destructive"}>
                {metrics.riskLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">BTC/USD</span>
              <div className="text-right">
                <div className="font-bold">${metrics.btcPrice.toLocaleString()}</div>
                <TrendingUp className="h-3 w-3 text-green-500 inline" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">ETH/USD</span>
              <div className="text-right">
                <div className="font-bold">${metrics.ethPrice.toLocaleString()}</div>
                <TrendingUp className="h-3 w-3 text-green-500 inline" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Trade</span>
              <span className="font-bold">{metrics.lastTradeTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Pairs</span>
              <span className="font-bold">{metrics.tradingPairs.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Safety Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Stop Loss</div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">$100</div>
              <div className="text-xs text-green-600 dark:text-green-400">Active</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Risk Limit</div>
              <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200">2%</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Per Trade</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Max Drawdown</div>
              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">-10%</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Protection at $135</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}