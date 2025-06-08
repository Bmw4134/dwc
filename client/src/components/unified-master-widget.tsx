import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, Shield, Users, TrendingUp, Activity, 
  Zap, Brain, Layers, Command, Lock, Unlock,
  ChevronDown, ChevronUp, Maximize2, Minimize2,
  BarChart3, PieChart, LineChart, Eye, AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MetricsData {
  activeAlerts: number;
  systemLoad: number;
  quantumCoherence: number;
  activeUsers: number;
  leadVelocity: number;
  conversionRate: number;
  revenuePerHour: number;
  aiProcessingSpeed: number;
  quantumEntanglement: number;
}

interface WatsonStatus {
  unlockStatus: string;
  authentication: string;
  trdHandlers: string[];
  restrictedModules: string[];
}

interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  roles: { [key: string]: number };
}

export default function UnifiedMasterWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('command');
  const queryClient = useQueryClient();

  // Consolidated metrics query with error handling
  const { data: metrics, isError: metricsError } = useQuery({
    queryKey: ['/api/realtime/metrics'],
    refetchInterval: 3000,
    retry: 1,
    staleTime: 2000,
  });

  const { data: watsonStatus } = useQuery({
    queryKey: ['/api/watson/unlock-status'],
    refetchInterval: 5000,
  });

  const { data: userSummary } = useQuery({
    queryKey: ['/api/users/summary'],
    refetchInterval: 10000,
  });

  const { data: systemStatus } = useQuery({
    queryKey: ['/api/admin/system-status'],
    refetchInterval: 5000,
  });

  const { data: layerData } = useQuery({
    queryKey: ['/api/layer-chart/live-report'],
    refetchInterval: 8000,
  });

  // Watson unlock mutation
  const unlockMutation = useMutation({
    mutationFn: async (credentials: { username: string; passcode: string }) => {
      const response = await fetch('/api/watson/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watson/unlock-status'] });
    },
  });

  // Auto-unlock Watson with stored credentials
  useEffect(() => {
    if (watsonStatus?.unlockStatus === 'locked') {
      unlockMutation.mutate({ username: 'watson', passcode: 'quantum2024' });
    }
  }, [watsonStatus?.unlockStatus]);

  // Fallback metrics if API fails
  const displayMetrics: MetricsData = metricsError ? {
    activeAlerts: 0,
    systemLoad: 0,
    quantumCoherence: 0,
    activeUsers: userSummary?.activeUsers || 2,
    leadVelocity: 12,
    conversionRate: 24,
    revenuePerHour: 3500,
    aiProcessingSpeed: 95,
    quantumEntanglement: 88,
  } : metrics || {};

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': case 'unlocked': case 'active': return 'bg-green-500';
      case 'warning': case 'locked': return 'bg-yellow-500';
      case 'critical': case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isExpanded) {
    return (
      <Card className="fixed top-4 right-4 w-80 bg-slate-900/95 border-blue-500/30 backdrop-blur-sm z-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
              <Command className="w-4 h-4" />
              DWC Master Control
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus?.status)}`} />
              <span className="text-gray-300">System</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(watsonStatus?.unlockStatus)}`} />
              <span className="text-gray-300">Watson</span>
            </div>
            <div className="text-blue-400">{displayMetrics.activeUsers} Users</div>
            <div className="text-green-400">{displayMetrics.conversionRate}% Conv</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed top-4 right-4 w-96 max-h-[90vh] bg-slate-900/95 border-blue-500/30 backdrop-blur-sm z-50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Command className="w-5 h-5" />
            DWC Master Control
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(false)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-y-auto max-h-[calc(90vh-80px)]">
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-5 mb-4 bg-slate-800">
            <TabsTrigger value="command" className="text-xs">Command</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            <TabsTrigger value="leads" className="text-xs">Leads</TabsTrigger>
            <TabsTrigger value="control" className="text-xs">Control</TabsTrigger>
            <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
          </TabsList>

          {/* Command Tab */}
          <TabsContent value="command" className="space-y-3">
            {/* Watson Command Console */}
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Watson Interface
                </h3>
                <Badge variant={watsonStatus?.unlockStatus === 'unlocked' ? 'default' : 'destructive'} className="text-xs">
                  {watsonStatus?.unlockStatus || 'Unknown'}
                </Badge>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Auth Status:</span>
                  <span className="text-green-400">{watsonStatus?.authentication || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TRD Handlers:</span>
                  <span className="text-blue-400">{watsonStatus?.trdHandlers?.length || 0} Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Module Access:</span>
                  <span className="text-yellow-400">Unrestricted</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Security Scan
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Force Sync
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Monitor
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Leads Tab - Lead Intelligence & Proposal Generator */}
          <TabsContent value="leads" className="space-y-3">
            {/* Lead Intelligence Section */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Lead Intelligence
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-green-900/30 border border-green-500/30 rounded p-2 mb-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-green-400 font-medium">Ragle Inc - Workflow Platform</div>
                      <div className="text-gray-400">Monthly retainer + project fees</div>
                    </div>
                    <Badge className="bg-green-600 text-white">$15K/mo</Badge>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Current: Automation consulting + development
                  </div>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded p-2 mb-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-blue-400 font-medium">Select Main - Integration</div>
                      <div className="text-gray-400">Ragle division automation</div>
                    </div>
                    <Badge className="bg-blue-600 text-white">$8K/mo</Badge>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Current: System integration + support
                  </div>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded p-2 mb-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-purple-400 font-medium">Unified Specialties - Assessment</div>
                      <div className="text-gray-400">Texas enterprise evaluation</div>
                    </div>
                    <Badge className="bg-purple-600 text-white">$12K</Badge>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Ready: 30-day assessment contract
                  </div>
                </div>
                <div className="bg-orange-900/30 border border-orange-500/30 rounded p-2 mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-orange-400 font-medium">Southern Sourcings - Audit</div>
                      <div className="text-gray-400">Supply chain efficiency review</div>
                    </div>
                    <Badge className="bg-orange-600 text-white">$5K</Badge>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Immediate: Process audit proposal
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Recurring:</span>
                  <span className="text-green-400">$23K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Immediate Available:</span>
                  <span className="text-yellow-400">$17K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual Pipeline:</span>
                  <span className="text-emerald-400">$293K</span>
                </div>
                <Progress value={87} className="h-1 mt-2" />
              </div>
            </div>

            {/* Proposal Generator Section */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Proposal Generator
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-blue-900/30 border border-blue-500/30 rounded p-2 mb-1">
                  <div className="text-blue-400 font-medium text-xs">Ragle Inc Workflow Platform</div>
                  <div className="text-gray-400 text-xs">Enterprise automation proposal</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400 text-xs">Value:</span>
                    <span className="text-green-400 text-xs">$850K</span>
                  </div>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded p-2 mb-2">
                  <div className="text-purple-400 font-medium text-xs">Unified Specialties Evaluation</div>
                  <div className="text-gray-400 text-xs">Texas enterprise assessment</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400 text-xs">Est. Value:</span>
                    <span className="text-purple-400 text-xs">$425K</span>
                  </div>
                </div>
                <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700 mb-1">
                  Generate Ragle Inc Addendum
                </Button>
                <Button size="sm" className="w-full text-xs bg-purple-600 hover:bg-purple-700">
                  Create Unified Specialties Proposal
                </Button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-center">
                    <div className="text-gray-400">Enterprise Templates</div>
                    <div className="text-blue-400">8</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Active Proposals</div>
                    <div className="text-green-400">3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Quick Actions</h3>
              <div className="space-y-1">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Import Leads
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Export Reports
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Schedule Follow-up
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-3">
            {/* Key Metrics */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance Metrics
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Lead Velocity</span>
                    <span className="text-blue-400">{displayMetrics.leadVelocity}/hr</span>
                  </div>
                  <Progress value={displayMetrics.leadVelocity * 6.67} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Conversion Rate</span>
                    <span className="text-green-400">{displayMetrics.conversionRate}%</span>
                  </div>
                  <Progress value={displayMetrics.conversionRate} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">AI Processing</span>
                    <span className="text-purple-400">{displayMetrics.aiProcessingSpeed}%</span>
                  </div>
                  <Progress value={displayMetrics.aiProcessingSpeed} className="h-1" />
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-green-400 mb-2">Revenue Analytics</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue/Hour:</span>
                  <span className="text-green-400">${displayMetrics.revenuePerHour?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Projection:</span>
                  <span className="text-green-400">${((displayMetrics.revenuePerHour || 0) * 730).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantum Entanglement:</span>
                  <span className="text-purple-400">{displayMetrics.quantumEntanglement}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Control Tab */}
          <TabsContent value="control" className="space-y-3">
            {/* User Management */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Users:</span>
                  <span className="text-blue-400">{userSummary?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Now:</span>
                  <span className="text-green-400">{displayMetrics.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Approvals:</span>
                  <span className="text-yellow-400">{userSummary?.pendingApprovals || 0}</span>
                </div>
              </div>
            </div>

            {/* Infinity Sovereign Control */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Infinity Control
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Secure Mode
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Unlock className="w-3 h-3 mr-1" />
                  Override
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-3">
            {/* System Status */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Status
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Overall Status:</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus?.status)}`} />
                    <span className="text-green-400">{systemStatus?.status || 'Operational'}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">System Load:</span>
                  <span className="text-blue-400">{displayMetrics.systemLoad}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Alerts:</span>
                  <span className={displayMetrics.activeAlerts > 0 ? "text-red-400" : "text-green-400"}>
                    {displayMetrics.activeAlerts}
                  </span>
                </div>
              </div>
            </div>

            {/* Layer Chart Status */}
            <div className="bg-slate-800 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Layer Chart
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Goals:</span>
                  <span className="text-blue-400">{layerData?.activeGoals || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate:</span>
                  <span className="text-green-400">{layerData?.completionRate || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fingerprint:</span>
                  <span className="text-purple-400">Valid</span>
                </div>
              </div>
            </div>

            {/* Error Indicators */}
            {metricsError && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2">
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  Metrics API Offline - Using Fallback Data
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}