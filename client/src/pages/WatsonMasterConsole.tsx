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
import { Settings, Shield, Database, Users, Activity, Terminal, Cpu, HardDrive, Network, Zap, Eye, Lock, Unlock, RefreshCw, Download, Upload, Power, Trash2, Edit } from "lucide-react";
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

export default function WatsonMasterConsole() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "Watson Master Console v2.0 - DWC Systems LLC",
    "System initialization complete. All modules synchronized.",
    "Ready for commands..."
  ]);
  
  const { data: systemMetrics, isLoading: metricsLoading } = useQuery<SystemMetrics>({
    queryKey: ['/api/watson/system-metrics'],
    queryFn: () => fetch('/api/dashboard/metrics').then(res => res.json()),
    refetchInterval: 30000, // Reduce polling frequency
    retry: false,
  });

  const { data: modules, isLoading: modulesLoading } = useQuery<SystemModule[]>({
    queryKey: ['/api/watson/modules'],
    queryFn: async () => {
      // Simulating module data from your system
      return [
        { id: "quantum-dashboard", name: "Quantum Performance Dashboard", status: "active", description: "Real-time performance monitoring", lastSync: new Date().toISOString(), performance: 98.5 },
        { id: "automation-kernel", name: "Automation Kernel Engine", status: "active", description: "Core automation processing", lastSync: new Date().toISOString(), performance: 96.8 },
        { id: "ai-trading-bot", name: "AI Trading Bot Enhanced", status: "active", description: "Automated trading intelligence", lastSync: new Date().toISOString(), performance: 94.2 },
        { id: "lead-intelligence", name: "Lead Intelligence Engine", status: "active", description: "Advanced lead processing", lastSync: new Date().toISOString(), performance: 97.1 },
        { id: "visual-intelligence", name: "NEXUS Visual Intelligence", status: "active", description: "Visual analytics processing", lastSync: new Date().toISOString(), performance: 95.3 },
        { id: "nexus-control", name: "NEXUS Master Control", status: "active", description: "Central control system", lastSync: new Date().toISOString(), performance: 99.2 },
      ];
    },
    refetchInterval: 10000,
  });

  const executeCommand = (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newOutput = [...consoleOutput, `[${timestamp}] watson@dwc:~$ ${command}`];
    
    // Process command
    switch (command.toLowerCase().trim()) {
      case 'status':
        newOutput.push(`System Health: ${systemMetrics?.systemHealth || 0}%`);
        newOutput.push(`Active Modules: ${modules?.length || 0}`);
        newOutput.push(`Memory Usage: ${systemMetrics?.memoryUsage || 0}%`);
        newOutput.push(`CPU Usage: ${systemMetrics?.cpuUsage || 0}%`);
        break;
      case 'modules':
        newOutput.push("Active Modules:");
        modules?.forEach(module => {
          newOutput.push(`  ${module.id}: ${module.status} (${module.performance}%)`);
        });
        break;
      case 'sync':
        newOutput.push("Synchronizing all modules...");
        newOutput.push("Watson Intelligence Bridge: ACTIVE");
        newOutput.push("Pionex Trading Intelligence: SYNCHRONIZED");
        newOutput.push("Runtime Kernel: LINKED");
        newOutput.push("Sync complete.");
        break;
      case 'override enable':
        newOutput.push("Master override enabled. Full system access granted.");
        break;
      case 'clear':
        setConsoleOutput([]);
        setConsoleInput("");
        return;
      case 'help':
        newOutput.push("Available commands:");
        newOutput.push("  status - System status overview");
        newOutput.push("  modules - List all modules");
        newOutput.push("  sync - Synchronize all systems");
        newOutput.push("  override enable - Enable master override");
        newOutput.push("  clear - Clear console");
        break;
      default:
        newOutput.push(`Command '${command}' executed successfully.`);
    }
    
    setConsoleOutput(newOutput);
    setConsoleInput("");
    
    toast({
      title: "Command Executed",
      description: `Processed: ${command}`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(consoleInput);
    }
  };

  if (metricsLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing Watson Master Console</h2>
          <p className="text-emerald-400">DWC Systems LLC - Master Admin Access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-emerald-500/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Watson Master Console
              </h1>
              <p className="text-emerald-400 font-bold text-sm">DWC Systems LLC - Level 15 Clearance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              MASTER ADMIN
            </Badge>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Public View
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-emerald-500/10 backdrop-blur-xl border-emerald-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-black text-white">
                  {(systemMetrics?.systemHealth || 0).toFixed(1)}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-400 font-bold">System Health</p>
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
              <p className="text-cyan-400 font-bold">CPU Usage</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/10 backdrop-blur-xl border-purple-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <HardDrive className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-black text-white">
                  {systemMetrics?.memoryUsage || 0}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-400 font-bold">Memory Usage</p>
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
              <p className="text-orange-400 font-bold">Network Latency</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Interface */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="modules" className="data-[state=active]:bg-emerald-500/20">Modules</TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-emerald-500/20">Console</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-500/20">Analytics</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500/20">Users</TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-emerald-500/20">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">System Modules</CardTitle>
                <CardDescription className="text-white/70">
                  Monitor and control all system modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules?.map((module) => (
                    <Card key={module.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-white">{module.name}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              module.status === 'active' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {module.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 mb-3">{module.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Performance</span>
                            <span className="text-emerald-400">{module.performance}%</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                              style={{ width: `${module.performance}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Monitor
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <RefreshCw className="w-3 h-3" />
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
            <Card className="bg-black/40 backdrop-blur-xl border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center">
                  <Terminal className="w-5 h-5 mr-2" />
                  Watson Command Console
                </CardTitle>
                <CardDescription className="text-emerald-300">
                  Direct system command interface - Level 15 Access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black/60 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm mb-4">
                  {consoleOutput.map((line, index) => (
                    <div key={index} className="text-emerald-300 mb-1">
                      {line}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-mono">watson@dwc:~$</span>
                  <Input
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-black/40 border-emerald-500/30 text-emerald-300 font-mono"
                    placeholder="Enter command..."
                  />
                  <Button 
                    onClick={() => executeCommand(consoleInput)}
                    className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                  >
                    Execute
                  </Button>
                </div>
                <div className="mt-4 text-xs text-emerald-400/60">
                  Quick commands: status | modules | sync | override enable | clear | help
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
                    title: "Watson Analytics",
                    description: `Deep dive analysis for ${metric}`,
                  });
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-white/70">
                  Manage system users and access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { username: "watson", role: "Master Admin", clearance: 15, status: "active", lastLogin: "Active Now" },
                    { username: "admin", role: "Administrator", clearance: 10, status: "active", lastLogin: "2 hours ago" },
                    { username: "intelligence", role: "Intelligence Analyst", clearance: 8, status: "active", lastLogin: "1 day ago" },
                    { username: "analyst", role: "Data Analyst", clearance: 6, status: "inactive", lastLogin: "3 days ago" },
                    { username: "viewer", role: "Viewer", clearance: 3, status: "active", lastLogin: "1 hour ago" }
                  ].map((user) => (
                    <Card key={user.username} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{user.username}</h4>
                              <p className="text-sm text-white/60">{user.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge 
                              variant="secondary" 
                              className={`${
                                user.clearance >= 10 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              Level {user.clearance}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`${
                                user.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {user.status}
                            </Badge>
                            <span className="text-sm text-white/60">{user.lastLogin}</span>
                            <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Database Administration</CardTitle>
                <CardDescription className="text-white/70">
                  Direct database access and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Tables Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "leads", records: 24, size: "2.4 MB" },
                          { name: "users", records: 5, size: "128 KB" },
                          { name: "sessions", records: 12, size: "64 KB" },
                          { name: "metrics", records: 180, size: "1.2 MB" },
                          { name: "modules", records: 18, size: "256 KB" }
                        ].map((table) => (
                          <div key={table.name} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                            <div className="flex items-center space-x-3">
                              <Database className="w-4 h-4 text-cyan-400" />
                              <span className="text-white font-medium">{table.name}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-white/60">
                              <span>{table.records} records</span>
                              <span>{table.size}</span>
                              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-6 px-2">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30">
                          <Download className="w-4 h-4 mr-2" />
                          Export Database Backup
                        </Button>
                        <Button className="w-full bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Data
                        </Button>
                        <Button className="w-full bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Optimize Tables
                        </Button>
                        <Button className="w-full bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clean Logs
                        </Button>
                      </div>
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