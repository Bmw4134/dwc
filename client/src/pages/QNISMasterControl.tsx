import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Settings,
  Database,
  Network,
  Cpu
} from "lucide-react";

interface QNISSystemData {
  masterLLMStatus: string;
  overriddenSystems: string[];
  quantumProcessing: {
    active: boolean;
    confidence: number;
    processingSpeed: string;
  };
  perplexityCore: {
    connected: boolean;
    responseTime: string;
    accuracy: number;
  };
  systemOverrides: {
    gpt4: boolean;
    watson: boolean;
    perplexityLite: boolean;
  };
  emergencyProtocols: {
    active: boolean;
    lastActivated: string;
    protocols: string[];
  };
}

export default function QNISMasterControl() {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'OPERATIONAL' | 'EMERGENCY' | 'OFFLINE'>('OPERATIONAL');

  // Simulated QNIS system data - in production this would come from real API
  const qnisData: QNISSystemData = {
    masterLLMStatus: 'FULLY_OPERATIONAL',
    overriddenSystems: ['GPT-4', 'Watson AI', 'PerplexityLite'],
    quantumProcessing: {
      active: true,
      confidence: 97.8,
      processingSpeed: '0.3s avg'
    },
    perplexityCore: {
      connected: true,
      responseTime: '0.15s',
      accuracy: 99.2
    },
    systemOverrides: {
      gpt4: true,
      watson: true,
      perplexityLite: true
    },
    emergencyProtocols: {
      active: false,
      lastActivated: '2025-06-08 15:30:22',
      protocols: ['Data Recovery', 'System Rollback', 'Manual Override', 'Failsafe Mode']
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

  const handleEmergencyToggle = () => {
    setEmergencyMode(!emergencyMode);
    setSystemStatus(emergencyMode ? 'OPERATIONAL' : 'EMERGENCY');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
      case 'FULLY_OPERATIONAL':
        return 'text-emerald-400';
      case 'EMERGENCY':
        return 'text-red-400';
      case 'OFFLINE':
        return 'text-slate-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (active: boolean) => {
    return active ? (
      <CheckCircle className="w-4 h-4 text-emerald-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-red-700/50 bg-slate-900/90 backdrop-blur">
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
              <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                QNIS Master Control
              </div>
              <Badge variant="outline" className="text-red-400 border-red-400">
                EMERGENCY ACCESS
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${systemStatus === 'OPERATIONAL' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
                {systemStatus}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Emergency Alert */}
        {emergencyMode && (
          <Alert className="mb-8 border-red-500 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>EMERGENCY MODE ACTIVATED:</strong> All systems are operating under emergency protocols. 
              Standard safety constraints may be bypassed. Use extreme caution.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Master LLM Status */}
          <Card className="bg-slate-800/50 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                QNIS Master LLM Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Master LLM Status</span>
                <span className={`font-semibold ${getStatusColor(qnisData.masterLLMStatus)}`}>
                  {qnisData.masterLLMStatus}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Quantum Processing</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(qnisData.quantumProcessing.active)}
                  <span className="text-emerald-400 text-sm">
                    {qnisData.quantumProcessing.confidence}% confidence
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Processing Speed</span>
                <span className="text-blue-400 font-semibold">
                  {qnisData.quantumProcessing.processingSpeed}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Perplexity Pro Core</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(qnisData.perplexityCore.connected)}
                  <span className="text-emerald-400 text-sm">
                    {qnisData.perplexityCore.accuracy}% accuracy
                  </span>
                </div>
              </div>

              <Progress 
                value={qnisData.quantumProcessing.confidence} 
                className="h-2 bg-slate-700"
              />
            </CardContent>
          </Card>

          {/* System Overrides */}
          <Card className="bg-slate-800/50 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                System Overrides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">GPT-4 Integration</span>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-600 text-white">OVERRIDDEN</Badge>
                    {getStatusIcon(qnisData.systemOverrides.gpt4)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Watson AI</span>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-600 text-white">OVERRIDDEN</Badge>
                    {getStatusIcon(qnisData.systemOverrides.watson)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">PerplexityLite</span>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-600 text-white">OVERRIDDEN</Badge>
                    {getStatusIcon(qnisData.systemOverrides.perplexityLite)}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-300 mb-2">Override Justification:</div>
                <div className="text-xs text-slate-400">
                  QNIS Master LLM provides superior quantum-enhanced processing capabilities, 
                  real-time market intelligence integration, and enterprise-grade security protocols 
                  that exceed standard AI implementations.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Protocols */}
          <Card className="bg-slate-800/50 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Protocols
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Emergency Mode</span>
                <Button
                  onClick={handleEmergencyToggle}
                  variant={emergencyMode ? "destructive" : "outline"}
                  size="sm"
                  className={emergencyMode ? "" : "border-red-500 text-red-400 hover:bg-red-500/10"}
                >
                  {emergencyMode ? "DEACTIVATE" : "ACTIVATE"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Last Activated</span>
                <span className="text-slate-400 text-sm">
                  {qnisData.emergencyProtocols.lastActivated}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-slate-300">Available Protocols:</div>
                {qnisData.emergencyProtocols.protocols.map((protocol, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Settings className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{protocol}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Database className="w-4 h-4 mr-2" />
                Access Executive Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Live System Metrics */}
          <Card className="bg-slate-800/50 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Cpu className="w-5 h-5 mr-2" />
                Live System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">
                    {metrics ? `${Math.round(metrics.systemHealth)}%` : '99%'}
                  </div>
                  <div className="text-xs text-slate-400">System Health</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">
                    {nexusStatus?.data.activeModules || 18}/{nexusStatus?.data.totalModules || 18}
                  </div>
                  <div className="text-xs text-slate-400">Active Modules</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Quantum Confidence</span>
                  <span className="text-purple-400 font-semibold">
                    {metrics ? `${Math.round(metrics.quantumBehaviorConfidence)}%` : '97.8%'}
                  </span>
                </div>
                <Progress 
                  value={metrics?.quantumBehaviorConfidence || 97.8} 
                  className="h-2 bg-slate-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Automation Linkage</span>
                  <span className="text-emerald-400 font-semibold">
                    {nexusStatus?.data.automationLinkage || '100.0%'}
                  </span>
                </div>
                <Progress 
                  value={100} 
                  className="h-2 bg-slate-700"
                />
              </div>

              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center text-red-400 text-sm">
                  <Network className="w-4 h-4 mr-2" />
                  Direct Neural Interface Active
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  QNIS operating with unrestricted access to all enterprise systems
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Actions */}
        <Card className="mt-8 bg-slate-800/50 border-red-700/50">
          <CardHeader>
            <CardTitle className="text-red-400">Master Control Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={() => window.location.href = '/nexus-observer'}
                className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Brain className="w-5 h-5 mr-2" />
                NEXUS Observer
              </Button>
              
              <Button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
              >
                <Zap className="w-5 h-5 mr-2" />
                NEXUS GPT Interface
              </Button>
              
              <Button
                onClick={handleEmergencyToggle}
                className="h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Override
              </Button>
              
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}