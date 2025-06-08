import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Target, 
  Activity,
  BarChart3,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Globe,
  Database,
  Cpu,
  Network
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
  automationsRunning: number;
  leadsProcessed: number;
  revenueGenerated: number;
  systemHealth: "optimal" | "warning" | "critical";
}

interface QuantumModule {
  id: string;
  name: string;
  status: "active" | "standby" | "maintenance";
  performance: number;
  lastUpdate: string;
  capabilities: string[];
}

export default function NEXUSCommand() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 34,
    memoryUsage: 67,
    networkLatency: 12,
    activeConnections: 1247,
    automationsRunning: 43,
    leadsProcessed: 892,
    revenueGenerated: 47392,
    systemHealth: "optimal"
  });

  const quantumModules: QuantumModule[] = [
    {
      id: "intelligence-core",
      name: "Intelligence Core",
      status: "active",
      performance: 98.7,
      lastUpdate: "2 minutes ago",
      capabilities: ["Natural Language Processing", "Predictive Analytics", "Pattern Recognition"]
    },
    {
      id: "automation-engine",
      name: "Automation Engine",
      status: "active",
      performance: 96.2,
      lastUpdate: "5 minutes ago",
      capabilities: ["Process Automation", "Workflow Orchestration", "Task Scheduling"]
    },
    {
      id: "lead-analyzer",
      name: "Lead Analyzer",
      status: "active",
      performance: 94.8,
      lastUpdate: "1 minute ago",
      capabilities: ["Lead Scoring", "Market Analysis", "Opportunity Detection"]
    },
    {
      id: "groundworks-sync",
      name: "GroundWorks Sync",
      status: "active",
      performance: 99.1,
      lastUpdate: "30 seconds ago",
      capabilities: ["Timecard Validation", "Billing Integration", "Resource Management"]
    }
  ];

  // Real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(5, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 5)),
        activeConnections: prev.activeConnections + Math.floor((Math.random() - 0.5) * 20),
        leadsProcessed: prev.leadsProcessed + Math.floor(Math.random() * 5),
        revenueGenerated: prev.revenueGenerated + Math.floor(Math.random() * 100)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case "optimal": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "standby": return "bg-yellow-500";
      case "maintenance": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Quantum Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Command Header */}
      <header className="relative border-b border-gray-200/20 dark:border-slate-800/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/25">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-slate-950 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  NEXUS Command Center
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  Quantum Intelligence • DWC Systems LLC
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className={`${getHealthColor(systemMetrics.systemHealth)} border-current`}>
                <Activity className="w-3 h-3 mr-1" />
                System {systemMetrics.systemHealth.toUpperCase()}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                All Systems Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>Quantum Modules</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Automation</span>
            </TabsTrigger>
            <TabsTrigger value="groundworks" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>GroundWorks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">System Performance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">98.7%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <Progress value={98.7} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Connections</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemMetrics.activeConnections.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Network className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">+5.2% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Leads Processed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemMetrics.leadsProcessed.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">+12.8% this hour</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${systemMetrics.revenueGenerated.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">+8.4% this month</p>
                </CardContent>
              </Card>
            </div>

            {/* System Health Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-indigo-600" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemMetrics.cpuUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{systemMetrics.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={systemMetrics.memoryUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Network Latency</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{systemMetrics.networkLatency.toFixed(0)}ms</span>
                    </div>
                    <Progress value={(50 - systemMetrics.networkLatency) * 2} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Firewall</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Encryption</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">AES-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Access Control</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Secured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Scan</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2 min ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quantumModules.map((module) => (
                <Card key={module.id} className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-white" />
                          </div>
                          <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor(module.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{module.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Updated {module.lastUpdate}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {module.performance}% Performance
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <Progress value={module.performance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Capabilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {module.capabilities.map((capability, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">43</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Automations</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">96.2%</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">847h</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="groundworks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Timecard Validation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Processed Today</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Validation Rate</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Errors Detected</span>
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">3</span>
                  </div>
                  <Progress value={99.8} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Billing Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sync Status</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Sync</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">30 seconds ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Records Synced</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">45,392</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">100%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}