import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Zap, Brain, Target } from "lucide-react";

interface MarketData {
  btc_price: number;
  eth_price: number;
  ibm_price: number;
  timestamp: string;
}

interface QuantumSignals {
  signal_strength: number;
  market_coherence: number;
  reversal_point: number;
  spoofing_alerts: any[];
  enhanced_signals: number[];
  latency_optimization: Record<string, number>;
}

interface TradingRecommendation {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  position_size: number;
  stop_loss: number;
  take_profit: number;
  risk_score: number;
  quantum_score: number;
  reversal_warning: boolean;
}

interface Portfolio {
  total_trades: number;
  current_exposure: number;
  max_risk: number;
  risk_utilization: number;
  recent_trades: Array<{
    symbol: string;
    action: string;
    price: number;
    qty: number;
    timestamp: number;
  }>;
}

export default function InteractiveQuantumTradingDashboard() {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [tradeQuantity, setTradeQuantity] = useState("0.001");
  const [autoTrading, setAutoTrading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch live market data
  const { data: marketData = {} as MarketData, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/quantum/market-data"],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Fetch quantum signals
  const { data: quantumSignals = {} as QuantumSignals, isLoading: signalsLoading } = useQuery({
    queryKey: ["/api/quantum/signals"],
    refetchInterval: 3000, // Update every 3 seconds
  });

  // Fetch trading recommendation
  const { data: recommendation = {} as TradingRecommendation, isLoading: recommendationLoading } = useQuery({
    queryKey: ["/api/quantum/recommendation"],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Fetch portfolio status
  const { data: portfolio = {} as Portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/quantum/portfolio"],
    refetchInterval: 2000, // Update every 2 seconds
  });

  // Execute trade mutation
  const executeTradeMutation = useMutation({
    mutationFn: async (tradeData: { symbol: string; action: string; quantity: number }) => {
      const response = await fetch("/api/quantum/execute-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quantum/portfolio"] });
    },
  });

  // Toggle live trading mode
  const toggleLiveModeMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await fetch("/api/quantum/live-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quantum/portfolio"] });
    },
  });

  const executeQuickTrade = (action: "BUY" | "SELL") => {
    const quantity = parseFloat(tradeQuantity);
    if (quantity > 0) {
      executeTradeMutation.mutate({
        symbol: selectedSymbol,
        action,
        quantity,
      });
    }
  };

  const handleLiveModeToggle = (enabled: boolean) => {
    setIsLiveMode(enabled);
    toggleLiveModeMutation.mutate(enabled);
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 3) return "text-green-600";
    if (strength >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "BUY": return "bg-green-100 text-green-800";
      case "SELL": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Interactive Quantum Trading Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time quantum signal processing with live market data integration
          </p>
        </div>

        {/* Live Mode Toggle */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Trading Mode Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Label htmlFor="live-mode" className="text-base font-medium">
                  Live Trading Mode
                </Label>
                <p className="text-sm text-gray-600">
                  {isLiveMode ? "Real trades will be executed" : "Paper trading mode active"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={isLiveMode ? "destructive" : "secondary"}>
                  {isLiveMode ? "LIVE" : "PAPER"}
                </Badge>
                <Switch
                  id="live-mode"
                  checked={isLiveMode}
                  onCheckedChange={handleLiveModeToggle}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">BTC/USDT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${marketData.btc_price?.toLocaleString() || "Loading..."}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Live Price</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ETH/USDT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${marketData?.eth_price?.toLocaleString() || "Loading..."}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">Live Price</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">IBM Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${marketData?.ibm_price?.toFixed(2) || "Loading..."}
              </div>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">Alpha Vantage</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="signals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signals">Quantum Signals</TabsTrigger>
            <TabsTrigger value="trading">Trading Controls</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Quantum Signals Tab */}
          <TabsContent value="signals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Signal Strength
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getSignalColor(quantumSignals?.signal_strength || 0)}`}>
                    {quantumSignals?.signal_strength?.toFixed(1) || "0.0"}
                  </div>
                  <Progress value={(quantumSignals?.signal_strength || 0) * 20} className="mt-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    Quantum perplexity wave analysis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Market Coherence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {quantumSignals?.market_coherence?.toFixed(4) || "0.0000"}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Fourier analysis correlation
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trading Recommendation */}
            {recommendation && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Trading Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Badge className={getActionColor(recommendation.action)} variant="secondary">
                        {recommendation.action}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">Action</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{(recommendation.confidence * 100).toFixed(0)}%</div>
                      <p className="text-sm text-gray-600">Confidence</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">${recommendation.position_size}</div>
                      <p className="text-sm text-gray-600">Position Size</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{(recommendation.risk_score * 100).toFixed(1)}%</div>
                      <p className="text-sm text-gray-600">Risk Score</p>
                    </div>
                  </div>
                  
                  {recommendation.reversal_warning && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Reversal pattern detected - exercise caution
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trading Controls Tab */}
          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Trading Controls</CardTitle>
                <CardDescription>
                  Execute trades with quantum-enhanced signals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="symbol">Trading Pair</Label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                        <SelectItem value="IBM">IBM Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.001"
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(e.target.value)}
                      placeholder="0.001"
                    />
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={() => executeQuickTrade("BUY")}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={executeTradeMutation.isPending}
                    >
                      BUY
                    </Button>
                    <Button
                      onClick={() => executeQuickTrade("SELL")}
                      variant="destructive"
                      className="flex-1"
                      disabled={executeTradeMutation.isPending}
                    >
                      SELL
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-trading"
                    checked={autoTrading}
                    onCheckedChange={setAutoTrading}
                  />
                  <Label htmlFor="auto-trading">
                    Auto-execute based on quantum signals
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Trades</p>
                      <p className="text-2xl font-bold">{portfolio?.total_trades || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Exposure</p>
                      <p className="text-2xl font-bold">${portfolio?.current_exposure?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Risk Utilization</span>
                      <span>{portfolio?.risk_utilization?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress value={portfolio?.risk_utilization || 0} />
                    <p className="text-xs text-gray-600 mt-1">
                      ${portfolio?.max_risk || 100} maximum risk limit
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {portfolio?.recent_trades?.slice(0, 5).map((trade, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <Badge className={getActionColor(trade.action)} variant="secondary">
                            {trade.action}
                          </Badge>
                          <span className="ml-2 text-sm font-medium">{trade.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{trade.qty}</p>
                          <p className="text-xs text-gray-600">${trade.price.toFixed(2)}</p>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">No trades yet</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exchange Latency Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quantumSignals?.latency_optimization && Object.entries(quantumSignals.latency_optimization).map(([exchange, latency]) => (
                    <div key={exchange} className="text-center p-4 bg-gray-50 rounded">
                      <p className="font-medium">{exchange}</p>
                      <p className="text-lg font-bold text-blue-600">
                        {(latency * 1000).toFixed(0)}ms
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spoofing Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {quantumSignals?.spoofing_alerts?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Alerts detected</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Activity className="h-5 w-5 mr-2" />
                    <span className="text-sm">System Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}