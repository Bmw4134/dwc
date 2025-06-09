import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Brain, Zap, Shield } from "lucide-react";

interface QNISMetrics {
  systemHealth: number;
  quantumBehaviorConfidence: number;
  automationLinkage: number;
  totalPipelineValue: number;
  activeModules: number;
  realLeads: Array<{
    name: string;
    value: number;
    status: string;
    industry: string;
  }>;
}

export default function QNISMetricsDashboard() {
  const { data: metrics, isLoading } = useQuery<QNISMetrics>({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 2000,
  });

  const { data: nexusStatus } = useQuery<{ data: any }>({
    queryKey: ['/api/nexus/system-status'],
    refetchInterval: 3000,
  });

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-emerald-900/30">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-emerald-500/20 rounded mb-2"></div>
                <div className="h-8 bg-emerald-500/20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-emerald-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">
              System Health
            </CardTitle>
            <Shield className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.systemHealth.toFixed(1)}%
            </div>
            <Progress 
              value={metrics.systemHealth} 
              className="mt-2 h-2"
            />
            <Badge variant="outline" className="mt-2 border-emerald-500 text-emerald-400">
              OPTIMAL
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/50 to-purple-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">
              QNIS Confidence
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.quantumBehaviorConfidence.toFixed(1)}%
            </div>
            <Progress 
              value={metrics.quantumBehaviorConfidence} 
              className="mt-2 h-2"
            />
            <Badge variant="outline" className="mt-2 border-purple-500 text-purple-400">
              QUANTUM ACTIVE
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-gradient-to-br from-slate-900/50 to-blue-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">
              Automation Linkage
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.automationLinkage}%
            </div>
            <Progress 
              value={metrics.automationLinkage} 
              className="mt-2 h-2"
            />
            <Badge variant="outline" className="mt-2 border-blue-500 text-blue-400">
              SYNCHRONIZED
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-gradient-to-br from-slate-900/50 to-amber-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-400">
              Pipeline Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(metrics.totalPipelineValue / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-amber-400 mt-2">
              Active Opportunities
            </p>
            <Badge variant="outline" className="mt-2 border-amber-500 text-amber-400">
              GROWING
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* NEXUS System Status */}
      {nexusStatus?.data && (
        <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-emerald-900/30">
          <CardHeader>
            <CardTitle className="text-emerald-400">NEXUS Intelligence Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {nexusStatus.data.activeModules}/{nexusStatus.data.totalModules}
                </div>
                <div className="text-xs text-emerald-400">Active Modules</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {nexusStatus.data.automationLinkage}
                </div>
                <div className="text-xs text-emerald-400">Linkage</div>
              </div>
              <div className="text-center">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500">
                  {nexusStatus.data.runtimeState}
                </Badge>
              </div>
              <div className="text-center">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                  {nexusStatus.data.nexusIntelligence}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Lead Pipeline */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-emerald-900/30">
        <CardHeader>
          <CardTitle className="text-emerald-400">Live Lead Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.realLeads.map((lead, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-emerald-500/20"
              >
                <div className="flex-1">
                  <div className="font-semibold text-white">{lead.name}</div>
                  <div className="text-sm text-emerald-400">{lead.industry}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    ${lead.value.toLocaleString()}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 text-xs ${
                      lead.status === 'Active Negotiation' 
                        ? 'border-amber-500 text-amber-400'
                        : lead.status === 'Qualified'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-blue-500 text-blue-400'
                    }`}
                  >
                    {lead.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}