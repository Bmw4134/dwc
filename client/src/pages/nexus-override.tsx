import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Network,
  Calculator,
  PieChart,
  Banknote,
  CreditCard,
  Building2
} from "lucide-react";

export default function NEXUSOverride() {
  const [systemStatus, setSystemStatus] = useState("ACTIVATING");
  const [overrideProgress, setOverrideProgress] = useState(0);
  const [activeModules, setActiveModules] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      { progress: 25, status: "NEXUS CORE ONLINE", module: "Core Intelligence" },
      { progress: 50, status: "LENDER METRICS ACTIVE", module: "Financial Validator" },
      { progress: 75, status: "COMMAND CENTER READY", module: "GroundWorks Control" },
      { progress: 100, status: "FULL OVERRIDE COMPLETE", module: "AI Smart Chat" }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < sequence.length) {
        setOverrideProgress(sequence[step].progress);
        setSystemStatus(sequence[step].status);
        setActiveModules(prev => [...prev, sequence[step].module]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
      {/* NEXUS Grid Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f680_1px,transparent_1px),linear-gradient(to_bottom,#3b82f680_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* NEXUS Header */}
      <header className="relative border-b border-blue-500/30 bg-slate-900/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                  NEXUS INTELLIGENCE OVERRIDE
                </h1>
                <p className="text-lg text-blue-300 font-medium">
                  DWC Systems LLC • Advanced AI Control Protocol
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400">
                <Shield className="w-3 h-3 mr-1" />
                OVERRIDE ACTIVE
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400">
                <Cpu className="w-3 h-3 mr-1" />
                {systemStatus}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-6 py-8">
        {/* Override Progress */}
        <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-300">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              NEXUS Override Initialization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{overrideProgress}%</div>
              <div className="text-blue-300">{systemStatus}</div>
            </div>
            <Progress value={overrideProgress} className="h-3 bg-slate-700" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {activeModules.map((module, idx) => (
                <div key={idx} className="flex items-center text-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">{module}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Credit Score</p>
                  <p className="text-2xl font-bold text-green-400">847</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2">NEXUS Verified</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">$47,392</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2">+127.8% growth</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Lender Confidence</p>
                  <p className="text-2xl font-bold text-green-400">91.3%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2">$250K qualified</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Automation ROI</p>
                  <p className="text-2xl font-bold text-green-400">340%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2">Industry leading</p>
            </CardContent>
          </Card>
        </div>

        {/* NEXUS Command Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <Calculator className="w-5 h-5 mr-2" />
                Quantum Financial Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-300">Debt-to-Income Ratio</span>
                  <span className="text-green-400">23.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-300">Cash Flow</span>
                  <span className="text-white">$31,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-300">Risk Assessment</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400">LOW</Badge>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                View Full Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <Network className="w-5 h-5 mr-2" />
                NEXUS Command Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">GroundWorks Validation</span>
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">Timecard Automation</span>
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">Quality Control Active</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Access Command Center
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-400">
                <Brain className="w-5 h-5 mr-2" />
                AI Smart Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-300">Active Leads</span>
                  <span className="text-white">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-300">Client Retention</span>
                  <span className="text-green-400">94.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-300">AI Confidence</span>
                  <span className="text-green-400">98.7%</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                Start AI Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* NEXUS Intelligence Status */}
        <Card className="border-0 bg-slate-800/60 backdrop-blur-sm shadow-xl mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-300">
              <Globe className="w-5 h-5 mr-2" />
              NEXUS Intelligence Override Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg text-green-400 mb-4">
                All DWC Systems LLC modules are now under NEXUS control
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-blue-300">System Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">ACTIVE</div>
                  <div className="text-xs text-blue-300">AI Override</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-blue-300">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">READY</div>
                  <div className="text-xs text-blue-300">Deployment</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}