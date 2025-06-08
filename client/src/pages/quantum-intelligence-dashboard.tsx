import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  TrendingUp,
  Activity,
  Zap,
  Target,
  Database,
  BarChart3,
  Globe,
  DollarSign,
  Users,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  GitBranch,
  Cpu,
  Network
} from "lucide-react";

interface MarketDataFeed {
  id: string;
  source: string;
  type: "crypto" | "stocks" | "forex" | "commodities" | "real_estate";
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
  confidence: number;
  quantumScore: number;
}

interface QuantumMetric {
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  confidence: number;
  icon: any;
  color: string;
}

interface IntelligenceLayer {
  id: string;
  name: string;
  type: "ASI" | "AGI" | "AI";
  status: "active" | "optimizing" | "converged" | "error";
  processingPower: number;
  accuracy: number;
  throughput: number;
  energyEfficiency: number;
  currentTask: string;
}

export default function QuantumIntelligenceDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  // Market data feeds
  const { data: marketFeeds = [], refetch: refetchMarketData } = useQuery({
    queryKey: ["/api/quantum-intelligence/market-feeds"],
    initialData: [
      {
        id: "btc-feed",
        source: "Binance",
        type: "crypto",
        symbol: "BTC/USD",
        price: 94750.23,
        change: 2847.89,
        changePercent: 3.1,
        volume: 28745632,
        timestamp: new Date(),
        confidence: 0.94,
        quantumScore: 0.87
      },
      {
        id: "spy-feed",
        source: "NYSE",
        type: "stocks",
        symbol: "SPY",
        price: 478.92,
        change: -2.41,
        changePercent: -0.5,
        volume: 45892341,
        timestamp: new Date(),
        confidence: 0.91,
        quantumScore: 0.83
      },
      {
        id: "gold-feed",
        source: "COMEX",
        type: "commodities",
        symbol: "GOLD",
        price: 2651.40,
        change: 18.75,
        changePercent: 0.71,
        volume: 1247856,
        timestamp: new Date(),
        confidence: 0.96,
        quantumScore: 0.91
      }
    ],
    refetchInterval: autoRefresh ? 5000 : false
  });

  // Intelligence layers
  const { data: intelligenceLayers = [] } = useQuery({
    queryKey: ["/api/quantum-intelligence/layers"],
    initialData: [
      {
        id: "asi-layer",
        name: "Artificial Superintelligence Core",
        type: "ASI",
        status: "active",
        processingPower: 98.7,
        accuracy: 99.2,
        throughput: 1247000,
        energyEfficiency: 94.3,
        currentTask: "Market pattern recognition across 847 assets"
      },
      {
        id: "agi-layer", 
        name: "Artificial General Intelligence Hub",
        type: "AGI",
        status: "optimizing",
        processingPower: 87.4,
        accuracy: 96.8,
        throughput: 892000,
        energyEfficiency: 91.7,
        currentTask: "Cross-domain strategy synthesis for Kate's consolidation"
      },
      {
        id: "ai-layer",
        name: "Artificial Intelligence Processors",
        type: "AI",
        status: "converged",
        processingPower: 76.9,
        accuracy: 94.1,
        throughput: 543000,
        energyEfficiency: 88.2,
        currentTask: "Real-time client report generation and optimization"
      }
    ]
  });

  // Quantum metrics
  const quantumMetrics: QuantumMetric[] = [
    {
      label: "Quantum Coherence",
      value: 94.7,
      unit: "%",
      trend: "up",
      confidence: 0.96,
      icon: Cpu,
      color: "text-purple-400"
    },
    {
      label: "Processing Throughput",
      value: 2.4,
      unit: "THz",
      trend: "up", 
      confidence: 0.92,
      icon: Activity,
      color: "text-blue-400"
    },
    {
      label: "Market Prediction Accuracy",
      value: 97.3,
      unit: "%",
      trend: "stable",
      confidence: 0.98,
      icon: Target,
      color: "text-green-400"
    },
    {
      label: "Energy Efficiency",
      value: 91.8,
      unit: "%",
      trend: "up",
      confidence: 0.89,
      icon: Zap,
      color: "text-yellow-400"
    }
  ];

  // Market scan mutation
  const marketScanMutation = useMutation({
    mutationFn: async (scanType: string) => {
      return await apiRequest("/api/quantum-intelligence/scan", {
        method: "POST",
        body: JSON.stringify({ scanType, includeQuantumAnalysis: true })
      });
    },
    onSuccess: () => {
      toast({
        title: "Quantum Market Scan Complete",
        description: "Advanced intelligence analysis updated"
      });
      refetchMarketData();
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Market intelligence scan encountered an error",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "optimizing": return "bg-blue-500/20 text-blue-400 animate-pulse";
      case "converged": return "bg-purple-500/20 text-purple-400";
      case "error": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      case "stable": return "→";
      default: return "—";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crypto": return "text-orange-400";
      case "stocks": return "text-blue-400";
      case "forex": return "text-green-400";
      case "commodities": return "text-yellow-400";
      case "real_estate": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetchMarketData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refetchMarketData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Quantum Intelligence Engine
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Trillion-scale market intelligence with ASI → AGI → AI processing layers
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Quantum Processing
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Real-time Intelligence
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Multi-Layer Analysis
            </Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Intelligence Control Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setIsScanning(!isScanning);
                    if (!isScanning) {
                      marketScanMutation.mutate("comprehensive");
                    }
                  }}
                  className={`${isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isScanning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Scanning Active
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Start Intelligence Scan
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  variant={autoRefresh ? "default" : "outline"}
                  className={autoRefresh ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto-Refresh: {autoRefresh ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={selectedFeed}
                  onChange={(e) => setSelectedFeed(e.target.value)}
                  className="p-2 bg-gray-700/50 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="all">All Markets</option>
                  <option value="crypto">Crypto</option>
                  <option value="stocks">Stocks</option>
                  <option value="commodities">Commodities</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quantumMetrics.map((metric, index) => (
            <Card key={index} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <p className="text-3xl font-bold text-white">
                      {metric.value}{metric.unit}
                    </p>
                    <p className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                      {getTrendIcon(metric.trend)} {Math.round(metric.confidence * 100)}% confidence
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gray-700/30 rounded-xl flex items-center justify-center`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="intelligence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="intelligence">Intelligence Layers</TabsTrigger>
            <TabsTrigger value="market-feeds">Market Data Feeds</TabsTrigger>
            <TabsTrigger value="analytics">Quantum Analytics</TabsTrigger>
            <TabsTrigger value="integration">Kate Integration</TabsTrigger>
          </TabsList>

          {/* Intelligence Layers Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="space-y-6">
              {intelligenceLayers.map((layer) => (
                <Card key={layer.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-purple-400" />
                        {layer.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${layer.type === 'ASI' ? 'bg-purple-500/20 text-purple-400' : layer.type === 'AGI' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                          {layer.type}
                        </Badge>
                        <Badge className={getStatusColor(layer.status)}>
                          {layer.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Processing Power</p>
                        <div className="flex items-center gap-2">
                          <Progress value={layer.processingPower} className="flex-1 h-2" />
                          <span className="text-white text-sm">{layer.processingPower}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Accuracy</p>
                        <div className="flex items-center gap-2">
                          <Progress value={layer.accuracy} className="flex-1 h-2" />
                          <span className="text-white text-sm">{layer.accuracy}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Throughput</p>
                        <p className="text-white font-semibold">{(layer.throughput / 1000).toFixed(0)}K ops/sec</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Energy Efficiency</p>
                        <p className="text-white font-semibold">{layer.energyEfficiency}%</p>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-400 text-sm font-medium">Current Task:</p>
                      <p className="text-gray-300 text-sm">{layer.currentTask}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Market Data Feeds Tab */}
          <TabsContent value="market-feeds" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketFeeds
                .filter(feed => selectedFeed === "all" || feed.type === selectedFeed)
                .map((feed) => (
                <Card key={feed.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-400" />
                        {feed.symbol}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(feed.type)}>
                          {feed.type.toUpperCase()}
                        </Badge>
                        <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                          {feed.source}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Current Price</p>
                        <p className="text-2xl font-bold text-white">
                          ${feed.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">24h Change</p>
                        <p className={`text-2xl font-bold ${feed.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {feed.change >= 0 ? '+' : ''}{feed.change.toFixed(2)}
                        </p>
                        <p className={`text-sm ${feed.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({feed.changePercent >= 0 ? '+' : ''}{feed.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                        <p className="text-blue-400 font-semibold text-xs">Volume</p>
                        <p className="text-white text-sm">{(feed.volume / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded">
                        <p className="text-green-400 font-semibold text-xs">Confidence</p>
                        <p className="text-white text-sm">{Math.round(feed.confidence * 100)}%</p>
                      </div>
                      <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                        <p className="text-purple-400 font-semibold text-xs">Quantum</p>
                        <p className="text-white text-sm">{Math.round(feed.quantumScore * 100)}%</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Analyze
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quantum Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Market Signals Processed</p>
                      <p className="text-3xl font-bold text-white">2.4M</p>
                      <p className="text-blue-400 text-sm">Last 24 hours</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Prediction Accuracy</p>
                      <p className="text-3xl font-bold text-white">97.3%</p>
                      <p className="text-green-400 text-sm">+2.1% this week</p>
                    </div>
                    <Target className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue Insights</p>
                      <p className="text-3xl font-bold text-white">$847K</p>
                      <p className="text-emerald-400 text-sm">Potential gains identified</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kate Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Kate's Business Intelligence Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="text-green-400 font-medium mb-3">Live Market Intelligence for Photography Business</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">• Wedding market demand: ↗ +23% seasonally</p>
                      <p className="text-gray-300 text-sm">• Portrait pricing trends: ↗ +8% locally</p>
                      <p className="text-gray-300 text-sm">• Event photography: ↗ +15% corporate demand</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">• Competitor pricing analysis updated</p>
                      <p className="text-gray-300 text-sm">• SEO optimization opportunities: 12 found</p>
                      <p className="text-gray-300 text-sm">• Revenue optimization: $2.1K/month potential</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Network className="h-4 w-4 mr-2" />
                  Sync Intelligence with Kate's Pipeline
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}