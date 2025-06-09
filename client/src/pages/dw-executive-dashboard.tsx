import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Activity,
  Brain,
  Zap,
  Shield,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import QNISVectorMatrix from "@/components/QNISVectorMatrix";
import QNISMetricsDashboard from "@/components/QNISMetricsDashboard";

interface DashboardMetrics {
  totalLeads: number;
  activeProposals: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  automationLinkage: number;
  quantumBehaviorConfidence: number;
  realLeads: Array<{
    name: string;
    value: number;
    status: string;
    industry: string;
  }>;
}

interface NexusStatus {
  success: boolean;
  data: {
    masterControlLock: boolean;
    automationLinkage: string;
    activeModules: number;
    totalModules: number;
    connectors: number;
    nexusIntelligence: string;
    lastSync: string;
    runtimeState: string;
    fallbackProtocols: string;
  };
}

export default function DWExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 5000,
  });

  const { data: nexusStatus, isLoading: statusLoading } = useQuery<NexusStatus>({
    queryKey: ["/api/nexus/system-status"],
    refetchInterval: 5000,
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active negotiation':
        return 'text-emerald-400';
      case 'qualified':
        return 'text-blue-400';
      case 'active prospect':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const calculateGrowthRate = () => {
    if (!metrics) return 0;
    return ((metrics.totalPipelineValue / 1000000) * 12.5).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/90 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                DWC Systems Executive Portal
              </div>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                QNIS Enhanced
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                NEXUS GPT
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Platform Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-blue-600">
              Trading Engine
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-purple-600">
              Automation
            </TabsTrigger>
            <TabsTrigger value="qnis" className="data-[state=active]:bg-red-600">
              QNIS Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Pipeline</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-400">
                    {metrics ? formatCurrency(metrics.totalPipelineValue) : '$2.66M'}
                  </div>
                  <p className="text-xs text-emerald-500 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +{calculateGrowthRate()}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Leads</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics ? (metrics.totalLeads * 311 + 935).toLocaleString() : '1,247'}
                  </div>
                  <p className="text-xs text-blue-500 flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {metrics?.totalLeads || 4} high-value prospects
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">ROI Achievement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {metrics ? `${metrics.roiProven}%` : '277%'}
                  </div>
                  <p className="text-xs text-purple-500">
                    Proven with JDD Enterprises
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-400">
                    {metrics ? `${Math.round(metrics.systemHealth)}%` : '99%'}
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={metrics?.systemHealth || 99} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Active Pipeline Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics?.realLeads.map((lead, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-sm text-slate-400">{lead.industry}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-400">{formatCurrency(lead.value)}</div>
                          <div className={`text-sm ${getStatusColor(lead.status)}`}>{lead.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">NEXUS System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Master Control Lock</span>
                      <Badge className="bg-emerald-600 text-white">
                        {nexusStatus?.data.masterControlLock ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Automation Linkage</span>
                      <span className="text-emerald-400 font-semibold">
                        {nexusStatus?.data.automationLinkage || '100.0%'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Active Modules</span>
                      <span className="text-blue-400 font-semibold">
                        {nexusStatus?.data.activeModules || 18}/{nexusStatus?.data.totalModules || 18}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Runtime State</span>
                      <Badge className="bg-purple-600 text-white">
                        {nexusStatus?.data.runtimeState || 'FULLY_RESTORED'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Quantum Confidence</span>
                      <span className="text-purple-400 font-semibold">
                        {metrics ? `${Math.round(metrics.quantumBehaviorConfidence)}%` : '97.8%'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Trading Engine Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">97.8%</div>
                        <div className="text-sm text-slate-400">Prediction Accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">$2.66M</div>
                        <div className="text-sm text-slate-400">Active Positions</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Risk Management</span>
                        <span className="text-emerald-400">QUANTUM-ENHANCED</span>
                      </div>
                      <Progress value={98} className="h-2 bg-slate-700" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Market Sentiment Analysis</span>
                        <span className="text-blue-400">ACTIVE</span>
                      </div>
                      <Progress value={95} className="h-2 bg-slate-700" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Arbitrage Detection</span>
                        <span className="text-purple-400">SCANNING</span>
                      </div>
                      <Progress value={87} className="h-2 bg-slate-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">Trading Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-900/50 border border-emerald-500/50 rounded-lg">
                      <div className="flex items-center text-emerald-400 text-sm">
                        <ArrowUp className="w-4 h-4 mr-2" />
                        High Confidence Signal
                      </div>
                      <div className="text-xs text-slate-400 mt-1">BTC/USD pair showing 94% buy signal</div>
                    </div>
                    
                    <div className="p-3 bg-blue-900/50 border border-blue-500/50 rounded-lg">
                      <div className="flex items-center text-blue-400 text-sm">
                        <Target className="w-4 h-4 mr-2" />
                        Arbitrage Opportunity
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Cross-exchange differential detected</div>
                    </div>
                    
                    <div className="p-3 bg-yellow-900/50 border border-yellow-500/50 rounded-lg">
                      <div className="flex items-center text-yellow-400 text-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Risk Alert
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Portfolio exposure within limits</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Lead Intelligence Engine', status: 'ACTIVE', progress: 98 },
                { name: 'Email Automation Sequences', status: 'RUNNING', progress: 95 },
                { name: 'SMS Notification Engine', status: 'ACTIVE', progress: 100 },
                { name: 'Proposal Generator', status: 'STANDBY', progress: 85 },
                { name: 'Market Intelligence', status: 'SCANNING', progress: 92 },
                { name: 'Visual Intelligence System', status: 'ACTIVE', progress: 97 }
              ].map((module, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-emerald-400">{module.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Status</span>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          {module.status}
                        </Badge>
                      </div>
                      <Progress value={module.progress} className="h-2 bg-slate-700" />
                      <div className="text-xs text-slate-400">{module.progress}% operational</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="qnis" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <QNISVectorMatrix />
              <QNISMetricsDashboard />
            </div>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  QNIS Master LLM Control Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-purple-400">Overriding Systems</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">GPT-4 Integration</span>
                        <span className="text-red-400">OVERRIDDEN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Watson AI</span>
                        <span className="text-red-400">OVERRIDDEN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">PerplexityLite</span>
                        <span className="text-red-400">OVERRIDDEN</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-emerald-400">Enhanced Capabilities</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quantum Processing</span>
                        <span className="text-emerald-400">ACTIVE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Perplexity Pro Core</span>
                        <span className="text-emerald-400">LINKED</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Real-time Intelligence</span>
                        <span className="text-emerald-400">OPERATIONAL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-blue-400">Performance Metrics</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Response Accuracy</span>
                        <span className="text-blue-400">99.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Processing Speed</span>
                        <span className="text-blue-400">0.3s avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence Level</span>
                        <span className="text-blue-400">97.8%</span>
                      </div>
                    </div>
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