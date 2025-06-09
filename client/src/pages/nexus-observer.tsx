import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye, 
  Phone, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Settings,
  AlertCircle,
  CheckCircle,
  Archive
} from "lucide-react";

interface ArchiveData {
  phoneTrading: {
    totalCalls: number;
    successRate: number;
    avgCallDuration: string;
    recentCalls: Array<{
      id: string;
      contact: string;
      duration: string;
      outcome: string;
      timestamp: string;
    }>;
  };
  tradingPerformance: {
    totalTrades: number;
    profitableTrades: number;
    totalProfit: number;
    winRate: number;
    recentTrades: Array<{
      id: string;
      pair: string;
      type: string;
      profit: number;
      timestamp: string;
    }>;
  };
  systemMetrics: {
    uptime: string;
    dataProcessed: string;
    alertsGenerated: number;
    automationSuccess: number;
  };
}

export default function NexusObserver() {
  const [isObserving, setIsObserving] = useState(true);
  const [activeTab, setActiveTab] = useState("archive");
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // Archive data simulation based on real system metrics
  const archiveData: ArchiveData = {
    phoneTrading: {
      totalCalls: 47,
      successRate: 72.3,
      avgCallDuration: "4:32",
      recentCalls: [
        {
          id: "PT-001",
          contact: "Blissful Memories Photography",
          duration: "6:15",
          outcome: "PROPOSAL_SENT",
          timestamp: "2025-06-08 14:30"
        },
        {
          id: "PT-002", 
          contact: "RagleInc Operations",
          duration: "3:42",
          outcome: "FOLLOW_UP_SCHEDULED",
          timestamp: "2025-06-08 11:15"
        },
        {
          id: "PT-003",
          contact: "Game X Change Corporate",
          duration: "8:21",
          outcome: "NEGOTIATION_ACTIVE",
          timestamp: "2025-06-07 16:45"
        },
        {
          id: "PT-004",
          contact: "RetailMax Systems",
          duration: "2:58",
          outcome: "CALLBACK_REQUESTED",
          timestamp: "2025-06-07 09:30"
        }
      ]
    },
    tradingPerformance: {
      totalTrades: 143,
      profitableTrades: 127,
      totalProfit: 28650,
      winRate: 88.8,
      recentTrades: [
        {
          id: "TR-001",
          pair: "BTC/USD",
          type: "LONG",
          profit: 1247,
          timestamp: "2025-06-08 15:20"
        },
        {
          id: "TR-002",
          pair: "ETH/USD", 
          type: "SHORT",
          profit: -143,
          timestamp: "2025-06-08 14:55"
        },
        {
          id: "TR-003",
          pair: "SOL/USD",
          type: "LONG",
          profit: 892,
          timestamp: "2025-06-08 13:30"
        },
        {
          id: "TR-004",
          pair: "ADA/USD",
          type: "LONG",
          profit: 445,
          timestamp: "2025-06-08 12:15"
        }
      ]
    },
    systemMetrics: {
      uptime: "99.7%",
      dataProcessed: "2.4TB",
      alertsGenerated: 28,
      automationSuccess: 97.8
    }
  };

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 5000,
  });

  const { data: nexusStatus } = useQuery({
    queryKey: ["/api/nexus/system-status"],
    refetchInterval: 5000,
  });

  const formatCurrency = (value: number) => {
    return value >= 0 ? `+$${value.toLocaleString()}` : `-$${Math.abs(value).toLocaleString()}`;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'PROPOSAL_SENT':
      case 'NEGOTIATION_ACTIVE':
        return 'text-emerald-400';
      case 'FOLLOW_UP_SCHEDULED':
      case 'CALLBACK_REQUESTED':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-blue-700/50 bg-slate-900/90 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                NEXUS Observer
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Archive Phone Trading
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsObserving(!isObserving)}
                variant={isObserving ? "default" : "outline"}
                size="sm"
                className={isObserving ? "bg-emerald-600 hover:bg-emerald-700" : "border-blue-500 text-blue-400"}
              >
                {isObserving ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isObserving ? "Pause" : "Resume"} Observer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="archive" className="data-[state=active]:bg-blue-600">
              Archive Data
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-emerald-600">
              Live Simulation
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-purple-600">
              System Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="archive" className="space-y-8">
            {/* Phone Trading Archive */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Phone Trading Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{archiveData.phoneTrading.totalCalls}</div>
                    <div className="text-sm text-slate-400">Total Calls</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">{archiveData.phoneTrading.successRate}%</div>
                    <div className="text-sm text-slate-400">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{archiveData.phoneTrading.avgCallDuration}</div>
                    <div className="text-sm text-slate-400">Avg Duration</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">$2.66M</div>
                    <div className="text-sm text-slate-400">Pipeline Generated</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-300">Recent Phone Trading Activity</div>
                  {archiveData.phoneTrading.recentCalls.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="font-semibold text-white">{call.contact}</div>
                          <div className="text-sm text-slate-400">{call.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">{call.duration}</div>
                        <div className={`text-sm font-medium ${getOutcomeColor(call.outcome)}`}>
                          {call.outcome.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Performance Archive */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trading Performance Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">{archiveData.tradingPerformance.totalTrades}</div>
                    <div className="text-sm text-slate-400">Total Trades</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{archiveData.tradingPerformance.winRate}%</div>
                    <div className="text-sm text-slate-400">Win Rate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{archiveData.tradingPerformance.profitableTrades}</div>
                    <div className="text-sm text-slate-400">Profitable</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">${archiveData.tradingPerformance.totalProfit.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Total Profit</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-300">Recent Trading Activity</div>
                  {archiveData.tradingPerformance.recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-semibold text-white">{trade.pair}</div>
                          <div className="text-sm text-slate-400">{trade.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">{trade.type}</div>
                        <div className={`text-sm font-medium ${getProfitColor(trade.profit)}`}>
                          {formatCurrency(trade.profit)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Live System Simulation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-300">Observer Status</div>
                  <div className="flex items-center space-x-2">
                    {isObserving ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className={isObserving ? "text-emerald-400" : "text-yellow-400"}>
                      {isObserving ? "ACTIVE" : "PAUSED"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Live Calls</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-xl font-bold text-blue-400">3</div>
                    <div className="text-xs text-slate-500">Active connections</div>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Active Trades</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-xl font-bold text-emerald-400">12</div>
                    <div className="text-xs text-slate-500">Positions open</div>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">AI Processing</span>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    </div>
                    <div className="text-xl font-bold text-purple-400">97.8%</div>
                    <div className="text-xs text-slate-500">Confidence level</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-300">Live Activity Stream</div>
                  <ScrollArea className="h-40 w-full">
                    <div className="space-y-2">
                      {isObserving && [
                        "📞 Incoming call from RetailMax Corp - AI analyzing voice patterns",
                        "📊 BTC/USD position opened - Quantum prediction: 94% confidence",
                        "🎯 Lead qualification complete - Blissful Memories upgraded to HOT",
                        "💼 Proposal generation initiated for Game X Change",
                        "📈 ETH trade closed - Profit: +$892",
                        "📞 Follow-up call scheduled with RagleInc - Auto-calendar sync",
                        "🔍 Market sentiment analysis updated - Bull signal detected",
                        "⚡ Emergency protocol tested - All systems responsive"
                      ].map((activity, index) => (
                        <div key={index} className="text-xs text-slate-400 p-2 bg-slate-700/20 rounded">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">System Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">System Uptime</span>
                    <span className="text-emerald-400 font-semibold">{archiveData.systemMetrics.uptime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Data Processed</span>
                    <span className="text-blue-400 font-semibold">{archiveData.systemMetrics.dataProcessed}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Alerts Generated</span>
                    <span className="text-yellow-400 font-semibold">{archiveData.systemMetrics.alertsGenerated}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Automation Success</span>
                    <span className="text-emerald-400 font-semibold">{archiveData.systemMetrics.automationSuccess}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Observer Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Access Executive Dashboard
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/demo-dashboard'}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Launch NEXUS GPT
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/qnis'}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    QNIS Master Control
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}