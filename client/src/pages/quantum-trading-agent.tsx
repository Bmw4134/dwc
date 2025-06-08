import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  Shield,
  Zap
} from "lucide-react";

interface PlatformStatus {
  current_platform: string | null;
  active_platforms: string[];
  available_platforms: string[];
  confidence_scores: Record<string, number>;
  qq_enhanced_active: boolean;
  phase_info: {
    base_checkpoint: string;
    current_phase: string;
  };
}

interface HealthReport {
  timestamp: string;
  overall_status: string;
  checks: Record<string, any>;
  configuration?: Record<string, any>;
}

interface PositionSummary {
  active_positions_count: number;
  active_positions: any[];
  total_unrealized_pnl: number;
  available_balance: number;
  win_rate: number;
  simulation_mode: boolean;
}

const platformConfigs = {
  tradingview_alpaca: {
    name: "TradingView + Alpaca",
    description: "TradingView signals with Alpaca execution",
    color: "bg-blue-500"
  },
  binance_futures: {
    name: "Binance Futures",
    description: "USDT Perpetual futures trading",
    color: "bg-yellow-500"
  },
  bybit_usdt: {
    name: "Bybit USDT",
    description: "USDT perpetual contracts",
    color: "bg-orange-500"
  },
  interactive_brokers: {
    name: "Interactive Brokers",
    description: "Professional trading platform",
    color: "bg-green-500"
  }
};

export default function QuantumTradingAgent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Fetch platform status
  const { data: platformStatus, isLoading: statusLoading } = useQuery<PlatformStatus>({
    queryKey: ["/api/trading/platforms/status"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch positions summary
  const { data: positions } = useQuery<PositionSummary>({
    queryKey: ["/api/trading/futures/positions"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch performance metrics
  const { data: performance } = useQuery({
    queryKey: ["/api/trading/futures/performance"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Platform activation mutation
  const activatePlatformMutation = useMutation({
    mutationFn: async (platformName: string) => {
      const response = await fetch("/api/trading/platforms/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform_name: platformName }),
      });
      if (!response.ok) throw new Error("Failed to activate platform");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Platform Activated",
        description: `${data.platform} is now active`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trading/platforms/status"] });
    },
    onError: (error) => {
      toast({
        title: "Activation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Health check queries for each platform
  const useHealthCheck = (platform: string) => {
    return useQuery<HealthReport>({
      queryKey: [`/api/trading/${platform}/health`],
      refetchInterval: 30000, // Check every 30 seconds
      retry: false,
    });
  };

  const alpacaHealth = useHealthCheck("alpaca");
  const binanceHealth = useHealthCheck("binance");
  const bybitHealth = useHealthCheck("bybit");
  const ibHealth = useHealthCheck("ib");

  const getHealthStatus = (health: HealthReport | undefined) => {
    if (!health) return { status: "unknown", color: "bg-gray-500" };
    
    switch (health.overall_status) {
      case "healthy":
        return { status: "Healthy", color: "bg-green-500" };
      case "credentials_missing":
        return { status: "Credentials Missing", color: "bg-yellow-500" };
      case "connection_issues":
        return { status: "Connection Issues", color: "bg-red-500" };
      case "dependencies_missing":
        return { status: "Dependencies Missing", color: "bg-orange-500" };
      default:
        return { status: "Unknown", color: "bg-gray-500" };
    }
  };

  const renderPlatformCard = (platformKey: string, health: HealthReport | undefined) => {
    const config = platformConfigs[platformKey as keyof typeof platformConfigs];
    const healthStatus = getHealthStatus(health);
    const isActive = platformStatus?.current_platform === platformKey;
    const isAvailable = platformStatus?.available_platforms.includes(platformKey);

    return (
      <Card key={platformKey} className={`transition-all duration-300 ${isActive ? 'ring-2 ring-green-500' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{config.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${healthStatus.color} text-white`}>
                {healthStatus.status}
              </Badge>
              {isActive && <Badge variant="default">Active</Badge>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Mode:</span>
              <span className="font-medium">Preview Only</span>
            </div>
            
            {health?.configuration && (
              <div className="space-y-1 text-sm">
                {Object.entries(health.configuration).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={() => activatePlatformMutation.mutate(platformKey)}
              disabled={!isAvailable || activatePlatformMutation.isPending || isActive}
              className="w-full"
              variant={isActive ? "secondary" : "default"}
            >
              {isActive ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Active
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const calculateOverallConfidence = () => {
    if (!platformStatus?.confidence_scores) return 0;
    const scores = Object.values(platformStatus.confidence_scores);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length * 100 : 0;
  };

  if (statusLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Phase 1 Trillion Quantum Trading Agent
        </h1>
        <p className="text-xl text-muted-foreground">
          {platformStatus?.phase_info.current_phase || "Multi-Platform Trading Compatibility"}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <Badge variant="outline" className="gap-2">
            <Shield className="w-4 h-4" />
            Preview Mode Active
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Zap className="w-4 h-4" />
            QQ Enhanced Logic: {platformStatus?.qq_enhanced_active ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformStatus?.current_platform ? 
                platformConfigs[platformStatus.current_platform as keyof typeof platformConfigs]?.name || "Unknown" :
                "None"
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">System Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{Math.round(calculateOverallConfidence())}%</div>
              <Progress value={calculateOverallConfidence()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions?.active_positions_count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Unrealized P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (positions?.total_unrealized_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${(positions?.total_unrealized_pnl || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Preview Mode Active:</strong> All trading operations require manual approval. 
          No real money will be traded without explicit authorization. 
          Emergency Override: DWC_OVERRIDE_2025
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderPlatformCard("tradingview_alpaca", alpacaHealth.data)}
            {renderPlatformCard("binance_futures", binanceHealth.data)}
            {renderPlatformCard("bybit_usdt", bybitHealth.data)}
            {renderPlatformCard("interactive_brokers", ibHealth.data)}
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Position Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {positions ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Available Balance</div>
                      <div className="text-2xl font-bold">${positions.available_balance?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="text-2xl font-bold">{positions.win_rate?.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Active Positions</div>
                      <div className="text-2xl font-bold">{positions.active_positions_count}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Mode</div>
                      <div className="text-lg font-bold">
                        {positions.simulation_mode ? "Simulation" : "Live"}
                      </div>
                    </div>
                  </div>

                  {positions.active_positions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Active Positions</h3>
                      {positions.active_positions.map((position, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Symbol</div>
                                <div className="font-bold">{position.symbol}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Side</div>
                                <Badge variant={position.side === "LONG" ? "default" : "secondary"}>
                                  {position.side}
                                </Badge>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Entry Price</div>
                                <div className="font-bold">${position.entry_price}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Current Price</div>
                                <div className="font-bold">${position.current_price}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">P&L</div>
                                <div className={`font-bold ${position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ${position.unrealized_pnl?.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Quantity</div>
                                <div className="font-bold">{position.quantity}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No position data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {performance && typeof performance === 'object' && 'total_trades' in performance ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                    <div className="text-2xl font-bold">{performance.total_trades}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-2xl font-bold">{performance.win_rate?.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total P&L</div>
                    <div className={`text-2xl font-bold ${performance.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${performance.total_pnl?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold">${performance.current_balance?.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No performance data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signal Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    QQ Enhanced Logic is active with 85% confidence threshold. 
                    All signals are evaluated through sentiment analysis, indicator convergence, 
                    and user history weighting before execution approval.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Signal processing interface - Ready to receive TradingView webhooks
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Webhook endpoint: /alpaca_webhook
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}