import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertCircle,
  Settings,
  Database,
  Cpu,
  Eye,
  BarChart3,
  MousePointer2
} from "lucide-react";
import { QNISBehaviorDashboard } from "./QNISBehaviorDashboard";

interface QNISStatus {
  masterLLM: string;
  perplexityProIntegrated: boolean;
  overriddenModels: string[];
  state: {
    activeReasoning: boolean;
    orchestrationLock: boolean;
    moduleAuditStatus: string;
    domExceptions: string[];
    authenticDataSources: string[];
  };
  reasoningEngine: string;
  orchestrationLock: string;
  timestamp: string;
}

interface ExecutiveMetrics {
  totalLeads: number;
  activeProposals: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  automationLinkage: number;
  quantumBehaviorConfidence: number;
  perplexityInsights: {
    marketTrends: string;
    competitiveAnalysis: string;
    growthProjection: string;
    riskAssessment: string;
  };
  qnisConfidence: number;
  factResolutionStatus: string;
  executiveRecommendations: string[];
}

export function QNISMasterDashboard() {
  // QNIS Status Query
  const { data: qnisStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/qnis/status'],
    refetchInterval: 10000
  });

  // Executive Metrics with Perplexity Pro Enhancement
  const { data: executiveMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/qnis/executive-metrics'],
    refetchInterval: 5000
  });

  // API Validation Mutation
  const validateAPIs = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/qnis/validate-apis');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qnis/status'] });
    }
  });

  // DOM Auto-Repair Mutation
  const autoRepairDOM = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/qnis/auto-repair', { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qnis/status'] });
    }
  });

  const status = qnisStatus as QNISStatus;
  const metrics = executiveMetrics as ExecutiveMetrics;

  if (statusLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QNIS Master Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QNIS Master Control</h1>
            <p className="text-sm text-gray-600">Quantum Neural Intelligence System with Perplexity Pro</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-green-600">
            {status?.reasoningEngine} Active
          </Badge>
          <Badge variant="outline">
            {status?.orchestrationLock}
          </Badge>
        </div>
      </div>

      {/* System Override Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>System Override Status</span>
          </CardTitle>
          <CardDescription>
            QNIS has overridden all previous LLM models and activated Perplexity Pro Deep Research Core
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Master LLM</span>
                <Badge className="bg-purple-600">{status?.masterLLM}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Perplexity Pro</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Orchestration Lock</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Overridden Models</span>
              <div className="flex flex-wrap gap-1">
                {status?.overriddenModels?.map((model: string) => (
                  <Badge key={model} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Module Audit</span>
                <Badge className="bg-blue-600">{status?.state?.moduleAuditStatus}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">DOM Exceptions</span>
                <span className="text-sm text-gray-600">{status?.state?.domExceptions?.length || 0} detected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Metrics with Perplexity Pro Enhancement */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Executive Metrics</TabsTrigger>
          <TabsTrigger value="insights">Perplexity Insights</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="controls">System Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                    <p className="text-2xl font-bold">${(metrics?.totalPipelineValue / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">ROI Proven</p>
                    <p className="text-2xl font-bold">{metrics?.roiProven}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">QNIS Confidence</p>
                    <p className="text-2xl font-bold">{metrics?.qnisConfidence}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-2xl font-bold">{metrics?.systemHealth?.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Automation Linkage</span>
                  <span>{metrics?.automationLinkage}%</span>
                </div>
                <Progress value={metrics?.automationLinkage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quantum Behavior Confidence</span>
                  <span>{metrics?.quantumBehaviorConfidence?.toFixed(1)}%</span>
                </div>
                <Progress value={metrics?.quantumBehaviorConfidence} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conversion Rate</span>
                  <span>{metrics?.conversionRate}%</span>
                </div>
                <Progress value={metrics?.conversionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Market Intelligence</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Trends</p>
                  <p className="text-sm">{metrics?.perplexityInsights?.marketTrends}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Competitive Analysis</p>
                  <p className="text-sm">{metrics?.perplexityInsights?.competitiveAnalysis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Projection</p>
                  <p className="text-sm text-green-600 font-medium">{metrics?.perplexityInsights?.growthProjection}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Executive Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.executiveRecommendations?.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Risk Level: {metrics?.perplexityInsights?.riskAssessment}</p>
                  <p className="text-xs text-gray-600">Fact Resolution: {metrics?.factResolutionStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <QNISBehaviorDashboard />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>System Validation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => validateAPIs.mutate()}
                  disabled={validateAPIs.isPending}
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {validateAPIs.isPending ? 'Validating...' : 'Validate Nexus APIs'}
                </Button>
                
                <Button 
                  onClick={() => autoRepairDOM.mutate()}
                  disabled={autoRepairDOM.isPending}
                  variant="outline"
                  className="w-full"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  {autoRepairDOM.isPending ? 'Repairing...' : 'Auto-Repair DOM Exceptions'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Sources</span>
                  <Badge className="bg-green-600">{status?.state?.authenticDataSources?.length} Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Reasoning</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Orchestration Lock</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Update</span>
                  <span className="text-xs text-gray-600">
                    {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'Unknown'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}