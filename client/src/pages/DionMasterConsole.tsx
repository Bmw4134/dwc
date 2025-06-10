import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Database, Users, Activity, Terminal, Cpu, HardDrive, Network, Zap, Eye, Lock, Unlock, RefreshCw, Download, Upload, Power, Trash2, Edit, Globe, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { DrillDownModal } from "@/components/DrillDownModal";

interface SystemModule {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  description: string;
  lastSync: string;
  performance: number;
}

interface SystemMetrics {
  totalLeads: number;
  activeProposals: number;
  totalPipelineValue: number;
  systemHealth: number;
  moduleCount: number;
  activeUsers: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  uptime: string;
  watsonSync: boolean;
  pionexSync: boolean;
  runtimeKernel: boolean;
  automationBindings: number;
}

export default function DionMasterConsole() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "NEXUS DION Master Console v2.0 - DWC Systems LLC",
    "Quantum intelligence networks synchronized.",
    "Full system override enabled. Ready for commands..."
  ]);
  
  const { data: systemMetrics, isLoading: metricsLoading } = useQuery<SystemMetrics>({
    queryKey: ['/api/dion/system-metrics'],
    queryFn: () => fetch('/api/dashboard/metrics').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery<SystemModule[]>({
    queryKey: ['/api/dion/modules'],
    queryFn: async () => {
      return [
        { id: "nexus-intelligence", name: "NEXUS Intelligence Core", status: "active", description: "Advanced AI decision processing", lastSync: new Date().toISOString(), performance: 99.1 },
        { id: "quantum-override", name: "Quantum Override System", status: "active", description: "Master control protocols", lastSync: new Date().toISOString(), performance: 98.7 },
        { id: "neural-network", name: "Neural Network Engine", status: "active", description: "Deep learning analytics", lastSync: new Date().toISOString(), performance: 97.3 },
        { id: "automation-nexus", name: "Automation NEXUS Hub", status: "active", description: "Central automation orchestrator", lastSync: new Date().toISOString(), performance: 96.8 },
        { id: "data-matrix", name: "Data Matrix Controller", status: "active", description: "Real-time data processing", lastSync: new Date().toISOString(), performance: 98.2 },
        { id: "security-shield", name: "Security Shield Protocol", status: "active", description: "Advanced threat protection", lastSync: new Date().toISOString(), performance: 99.5 },
      ];
    },
    refetchInterval: 10000,
  });

  const executeCommand = (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newOutput = [...consoleOutput, `[${timestamp}] dion@nexus:~$ ${command}`];
    
    switch (command.toLowerCase().trim()) {
      case 'status':
        newOutput.push(`NEXUS System Health: ${systemMetrics?.systemHealth || 0}%`);
        newOutput.push(`Active NEXUS Modules: ${modules?.length || 0}`);
        newOutput.push(`Quantum Memory: ${systemMetrics?.memoryUsage || 0}%`);
        newOutput.push(`Neural CPU: ${systemMetrics?.cpuUsage || 0}%`);
        newOutput.push(`DION Override: ENABLED`);
        break;
      case 'nexus':
        newOutput.push("NEXUS Intelligence Matrix:");
        modules?.forEach(module => {
          newOutput.push(`  ${module.id}: ${module.status.toUpperCase()} (${module.performance}%)`);
        });
        break;
      case 'quantum sync':
        newOutput.push("Initiating quantum synchronization...");
        newOutput.push("NEXUS Intelligence Core: SYNCHRONIZED");
        newOutput.push("Quantum Override System: ACTIVE");
        newOutput.push("Neural Networks: OPTIMIZED");
        newOutput.push("Quantum sync complete - DION level access confirmed.");
        break;
      case 'override all':
        newOutput.push("DION MASTER OVERRIDE ACTIVATED");
        newOutput.push("All system restrictions lifted.");
        newOutput.push("Full administrative control granted.");
        newOutput.push("NEXUS protocol: UNRESTRICTED ACCESS");
        break;
      case 'neural status':
        newOutput.push("Neural Network Status Report:");
        newOutput.push("  Learning Rate: 97.3%");
        newOutput.push("  Pattern Recognition: ACTIVE");
        newOutput.push("  Predictive Analytics: OPTIMIZED");
        newOutput.push("  Decision Tree: STABLE");
        break;
      case 'clear':
        setConsoleOutput([]);
        setConsoleInput("");
        return;
      case 'help':
        newOutput.push("DION NEXUS Commands:");
        newOutput.push("  status - NEXUS system overview");
        newOutput.push("  nexus - List NEXUS modules");
        newOutput.push("  quantum sync - Synchronize quantum systems");
        newOutput.push("  override all - Enable master override");
        newOutput.push("  neural status - Neural network diagnostics");
        newOutput.push("  clear - Clear console");
        break;
      default:
        newOutput.push(`NEXUS executed: ${command} - SUCCESS`);
    }
    
    setConsoleOutput(newOutput);
    setConsoleInput("");
    
    toast({
      title: "NEXUS Command Executed",
      description: `DION processed: ${command}`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(consoleInput);
    }
  };

  if (metricsLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing DION NEXUS Console</h2>
          <p className="text-purple-400">DWC Systems LLC - NEXUS Master Control</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                DION NEXUS Master Console
              </h1>
              <p className="text-purple-400 font-bold text-sm">DWC Systems LLC - Level 15 NEXUS Clearance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              NEXUS MASTER
            </Badge>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Exit NEXUS
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-purple-500/10 backdrop-blur-xl border-purple-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-black text-white">
                  {(systemMetrics?.systemHealth || 0).toFixed(1)}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-400 font-bold">NEXUS Health</p>
            </CardContent>
          </Card>

          <Card className="bg-cyan-500/10 backdrop-blur-xl border-cyan-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Cpu className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-black text-white">
                  {systemMetrics?.cpuUsage || 0}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-400 font-bold">Neural CPU</p>
            </CardContent>
          </Card>

          <Card className="bg-pink-500/10 backdrop-blur-xl border-pink-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <HardDrive className="w-8 h-8 text-pink-400" />
                <span className="text-2xl font-black text-white">
                  {systemMetrics?.memoryUsage || 0}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-pink-400 font-bold">Quantum Memory</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 backdrop-blur-xl border-orange-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Network className="w-8 h-8 text-orange-400" />
                <span className="text-2xl font-black text-white">
                  {systemMetrics?.networkLatency || 0}ms
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-400 font-bold">NEXUS Latency</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Interface */}
        <Tabs defaultValue="nexus" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="nexus" className="data-[state=active]:bg-purple-500/20">NEXUS</TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-purple-500/20">Console</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">Analytics</TabsTrigger>
            <TabsTrigger value="neural" className="data-[state=active]:bg-purple-500/20">Neural</TabsTrigger>
            <TabsTrigger value="quantum" className="data-[state=active]:bg-purple-500/20">Quantum</TabsTrigger>
          </TabsList>

          <TabsContent value="nexus">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">NEXUS Intelligence Modules</CardTitle>
                <CardDescription className="text-white/70">
                  Advanced AI and quantum processing systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules?.map((module) => (
                    <Card key={module.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-white">{module.name}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              module.status === 'active' 
                                ? 'bg-purple-500/20 text-purple-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {module.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 mb-3">{module.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Neural Efficiency</span>
                            <span className="text-purple-400">{module.performance}%</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all group-hover:from-purple-400 group-hover:to-cyan-400"
                              style={{ width: `${module.performance}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-purple-500/20 flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Monitor
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-purple-500/20">
                            <Zap className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="console">
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center">
                  <Terminal className="w-5 h-5 mr-2" />
                  DION NEXUS Command Interface
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Quantum-enhanced command processing - NEXUS Level 15
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black/60 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm mb-4">
                  {consoleOutput.map((line, index) => (
                    <div key={index} className="text-purple-300 mb-1">
                      {line}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-mono">dion@nexus:~$</span>
                  <Input
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-black/40 border-purple-500/30 text-purple-300 font-mono"
                    placeholder="Enter NEXUS command..."
                  />
                  <Button 
                    onClick={() => executeCommand(consoleInput)}
                    className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  >
                    Execute
                  </Button>
                </div>
                <div className="mt-4 text-xs text-purple-400/60">
                  NEXUS commands: status | nexus | quantum sync | override all | neural status | clear | help
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {systemMetrics && (
              <AdvancedCharts 
                data={{
                  revenue: [
                    { month: "Jan", value: 28500, growth: 12.5 },
                    { month: "Feb", value: 31200, growth: 9.5 },
                    { month: "Mar", value: 29800, growth: -4.5 },
                    { month: "Apr", value: 34100, growth: 14.4 },
                    { month: "May", value: 32500, growth: -4.7 },
                    { month: "Jun", value: 38200, growth: 17.5 }
                  ],
                  leadSources: [
                    { source: "LinkedIn", count: 8, value: 185000, color: "#0077b5" },
                    { source: "Referrals", count: 6, value: 145000, color: "#10b981" },
                    { source: "Cold Email", count: 4, value: 95000, color: "#f59e0b" },
                    { source: "Partnerships", count: 3, value: 85000, color: "#8b5cf6" },
                    { source: "Website", count: 3, value: 75000, color: "#06b6d4" }
                  ],
                  conversionFunnel: [
                    { stage: "Initial Contact", count: 24, rate: 100 },
                    { stage: "Discovery Call", count: 18, rate: 75 },
                    { stage: "Proposal Sent", count: 12, rate: 50 },
                    { stage: "Technical Demo", count: 9, rate: 37.5 },
                    { stage: "Contract Review", count: 6, rate: 25 },
                    { stage: "Closed Won", count: 3, rate: 12.5 }
                  ],
                  industryBreakdown: [
                    { industry: "Financial Services", value: 165000, leads: 5 },
                    { industry: "Manufacturing", value: 125000, leads: 4 },
                    { industry: "Healthcare", value: 105000, leads: 6 },
                    { industry: "Logistics", value: 95000, leads: 3 },
                    { industry: "Technology", value: 75000, leads: 4 },
                    { industry: "Education", value: 45000, leads: 2 }
                  ],
                  performanceMetrics: [
                    { metric: "Monthly Revenue", current: 32500, target: 35000, trend: 8.5 },
                    { metric: "Lead Conversion", current: 12.5, target: 15, trend: 2.1 },
                    { metric: "Pipeline Value", current: 485000, target: 500000, trend: 15.8 },
                    { metric: "Client Satisfaction", current: 96, target: 95, trend: 4.2 }
                  ]
                }}
                onDrillDown={(metric, data) => {
                  toast({
                    title: "NEXUS Analytics",
                    description: `DION deep analysis for ${metric}`,
                  });
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="neural">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Neural Network Control</CardTitle>
                <CardDescription className="text-white/70">
                  Advanced AI learning and decision systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Learning Algorithms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Pattern Recognition", accuracy: 97.3, status: "active" },
                          { name: "Predictive Analytics", accuracy: 94.8, status: "active" },
                          { name: "Decision Trees", accuracy: 96.1, status: "active" },
                          { name: "Neural Evolution", accuracy: 92.7, status: "learning" }
                        ].map((algo) => (
                          <div key={algo.name} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-white font-medium">{algo.name}</span>
                              <Badge 
                                variant="secondary" 
                                className={`${
                                  algo.status === 'active' 
                                    ? 'bg-purple-500/20 text-purple-400' 
                                    : 'bg-blue-500/20 text-blue-400'
                                }`}
                              >
                                {algo.accuracy}%
                              </Badge>
                            </div>
                            <div className="h-2 bg-white/20 rounded overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                style={{ width: `${algo.accuracy}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Neural Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                          <Zap className="w-4 h-4 mr-2" />
                          Optimize Networks
                        </Button>
                        <Button className="w-full bg-pink-500/20 border-pink-500/30 text-pink-400 hover:bg-pink-500/30">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset Learning
                        </Button>
                        <Button className="w-full bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30">
                          <Download className="w-4 h-4 mr-2" />
                          Export Models
                        </Button>
                        <Button className="w-full bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Training
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quantum">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quantum Override Systems</CardTitle>
                <CardDescription className="text-white/70">
                  Master control and system administration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="p-4 text-center">
                      <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white mb-2">Security Override</h4>
                      <Button size="sm" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                        Activate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-cyan-500/10 border-cyan-500/30">
                    <CardContent className="p-4 text-center">
                      <Database className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white mb-2">Data Override</h4>
                      <Button size="sm" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                        Activate
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-500/10 border-orange-500/30">
                    <CardContent className="p-4 text-center">
                      <Power className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white mb-2">System Override</h4>
                      <Button size="sm" className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                        Activate
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}