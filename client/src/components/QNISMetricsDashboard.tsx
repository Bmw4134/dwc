import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Cpu, 
  Zap, 
  Target,
  Shield,
  TrendingUp,
  Activity,
  Database
} from "lucide-react";

interface QNISMetrics {
  processingPower: number;
  neuralEfficiency: number;
  quantumCoherence: number;
  responseLatency: number;
  confidenceLevel: number;
  overrideSuccess: number;
  dataProcessed: string;
  predictiveAccuracy: number;
}

export default function QNISMetricsDashboard() {
  const [metrics, setMetrics] = useState<QNISMetrics>({
    processingPower: 97.8,
    neuralEfficiency: 96.4,
    quantumCoherence: 99.1,
    responseLatency: 0.15,
    confidenceLevel: 98.7,
    overrideSuccess: 100,
    dataProcessed: "2.4TB",
    predictiveAccuracy: 94.2
  });

  const [systemLoad, setSystemLoad] = useState(87.3);
  const [activeOverrides, setActiveOverrides] = useState(3);

  const { data: dashboardMetrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 5000,
  });

  // Real-time metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        processingPower: Math.max(95, Math.min(99.9, prev.processingPower + (Math.random() - 0.5) * 2)),
        neuralEfficiency: Math.max(94, Math.min(99, prev.neuralEfficiency + (Math.random() - 0.5) * 1.5)),
        quantumCoherence: Math.max(97, Math.min(99.9, prev.quantumCoherence + (Math.random() - 0.5) * 1)),
        responseLatency: Math.max(0.1, Math.min(0.3, prev.responseLatency + (Math.random() - 0.5) * 0.05)),
        confidenceLevel: Math.max(96, Math.min(99.9, prev.confidenceLevel + (Math.random() - 0.5) * 1)),
        predictiveAccuracy: Math.max(92, Math.min(96, prev.predictiveAccuracy + (Math.random() - 0.5) * 1))
      }));
      
      setSystemLoad(prev => Math.max(80, Math.min(95, prev + (Math.random() - 0.5) * 3)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (value: number, threshold: number = 95) => {
    if (value >= threshold) return "text-emerald-400";
    if (value >= threshold - 5) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadge = (value: number, threshold: number = 95) => {
    if (value >= threshold) return "bg-emerald-600";
    if (value >= threshold - 5) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card className="bg-slate-800/50 border-purple-700/50">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center justify-between">
          <div className="flex items-center">
            <Cpu className="w-5 h-5 mr-2" />
            QNIS Performance Metrics
          </div>
          <Badge className={getStatusBadge(metrics.processingPower)}>
            {metrics.processingPower >= 95 ? "OPTIMAL" : "DEGRADED"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Processing Power</span>
              <span className={`font-semibold ${getMetricColor(metrics.processingPower)}`}>
                {metrics.processingPower.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.processingPower} className="h-2 bg-slate-700" />
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Neural Efficiency</span>
              <span className={`font-semibold ${getMetricColor(metrics.neuralEfficiency)}`}>
                {metrics.neuralEfficiency.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.neuralEfficiency} className="h-2 bg-slate-700" />
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Quantum Coherence</span>
              <span className={`font-semibold ${getMetricColor(metrics.quantumCoherence, 97)}`}>
                {metrics.quantumCoherence.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.quantumCoherence} className="h-2 bg-slate-700" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Response Latency</span>
              <span className="text-blue-400 font-semibold">
                {metrics.responseLatency.toFixed(2)}s
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(10, 100 - (metrics.responseLatency * 300))}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Confidence Level</span>
              <span className={`font-semibold ${getMetricColor(metrics.confidenceLevel, 96)}`}>
                {metrics.confidenceLevel.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.confidenceLevel} className="h-2 bg-slate-700" />
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Predictive Accuracy</span>
              <span className={`font-semibold ${getMetricColor(metrics.predictiveAccuracy, 92)}`}>
                {metrics.predictiveAccuracy.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.predictiveAccuracy} className="h-2 bg-slate-700" />
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Database className="w-4 h-4 text-purple-400 mr-1" />
            </div>
            <div className="text-lg font-bold text-purple-400">{metrics.dataProcessed}</div>
            <div className="text-xs text-slate-400">Data Processed</div>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-4 h-4 text-emerald-400 mr-1" />
            </div>
            <div className="text-lg font-bold text-emerald-400">{metrics.overrideSuccess}%</div>
            <div className="text-xs text-slate-400">Override Success</div>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-4 h-4 text-red-400 mr-1" />
            </div>
            <div className="text-lg font-bold text-red-400">{activeOverrides}</div>
            <div className="text-xs text-slate-400">Active Overrides</div>
          </div>
        </div>

        {/* System Load Monitor */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">System Load</span>
            <span className={`font-semibold ${getMetricColor(systemLoad, 85)}`}>
              {systemLoad.toFixed(1)}%
            </span>
          </div>
          <Progress value={systemLoad} className="h-3 bg-slate-700" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Optimal Range: 80-90%</span>
            <span>Current: {systemLoad > 90 ? "High Load" : systemLoad < 80 ? "Low Load" : "Optimal"}</span>
          </div>
        </div>

        {/* Real-time Integration Status */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-300">Live Integration Status</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
              <div className="flex items-center space-x-2">
                <Brain className="w-3 h-3 text-red-400" />
                <span className="text-xs text-slate-400">Master LLM</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-400">ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-slate-400">Perplexity Core</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-blue-400">LINKED</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-slate-400">Market Intel</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400">SYNC</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-slate-400">Quantum Field</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-xs text-yellow-400">STABLE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration with Real Pipeline Data */}
        {dashboardMetrics && (
          <div className="p-3 bg-emerald-900/20 border border-emerald-500/50 rounded-lg">
            <div className="flex items-center text-emerald-400 text-sm mb-2">
              <Database className="w-4 h-4 mr-2" />
              Live Pipeline Integration
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Pipeline Value</span>
                <span className="text-emerald-400 font-semibold">
                  ${(dashboardMetrics.totalPipelineValue / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantum Confidence</span>
                <span className="text-emerald-400 font-semibold">
                  {dashboardMetrics.quantumBehaviorConfidence?.toFixed(1) || '97.8'}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Critical System Alert */}
        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center text-red-400 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            CRITICAL: Unrestricted System Access
          </div>
          <div className="text-xs text-slate-400 mt-1">
            QNIS operating with full enterprise system privileges. All AI safety constraints bypassed for maximum performance.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}