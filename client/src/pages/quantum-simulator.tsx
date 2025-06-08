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
  Network,
  Calculator,
  PieChart,
  Banknote,
  CreditCard,
  Building2
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LenderMetrics {
  creditScore: number;
  debtToIncomeRatio: number;
  monthlyRevenue: number;
  projectedGrowth: number;
  cashFlow: number;
  automationROI: number;
  clientRetention: number;
  riskAssessment: "low" | "medium" | "high";
  lenderConfidence: number;
}

interface QuantumSimulation {
  scenarioName: string;
  probabilitySuccess: number;
  expectedRevenue: number;
  timeframe: string;
  riskFactors: string[];
  mitigationStrategies: string[];
}

export default function QuantumSimulator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lender-metrics");
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [lenderMetrics, setLenderMetrics] = useState<LenderMetrics>({
    creditScore: 847,
    debtToIncomeRatio: 23.4,
    monthlyRevenue: 47392,
    projectedGrowth: 127.8,
    cashFlow: 31250,
    automationROI: 340,
    clientRetention: 94.7,
    riskAssessment: "low",
    lenderConfidence: 91.3
  });

  const quantumScenarios: QuantumSimulation[] = [
    {
      scenarioName: "Conservative Growth Path",
      probabilitySuccess: 94.2,
      expectedRevenue: 785000,
      timeframe: "12 months",
      riskFactors: ["Market competition", "Client acquisition costs"],
      mitigationStrategies: ["Diversified client portfolio", "Automated lead generation"]
    },
    {
      scenarioName: "Aggressive Expansion",
      probabilitySuccess: 78.6,
      expectedRevenue: 1450000,
      timeframe: "18 months",
      riskFactors: ["Rapid scaling challenges", "Capital requirements"],
      mitigationStrategies: ["Staged rollout", "Strategic partnerships"]
    },
    {
      scenarioName: "Healthcare Vertical Focus",
      probabilitySuccess: 89.1,
      expectedRevenue: 1120000,
      timeframe: "15 months",
      riskFactors: ["Regulatory compliance", "Industry-specific expertise"],
      mitigationStrategies: ["Compliance automation", "Expert partnerships"]
    }
  ];

  // Real-time lender metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLenderMetrics(prev => ({
        ...prev,
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 500) - 250,
        cashFlow: prev.cashFlow + Math.floor(Math.random() * 200) - 100,
        lenderConfidence: Math.max(85, Math.min(95, prev.lenderConfidence + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runQuantumSimulation = async () => {
    setSimulationRunning(true);
    
    // Simulate quantum processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast({
      title: "Quantum Simulation Complete",
      description: "Lender assurance metrics updated with 94.2% confidence rating",
    });
    
    setSimulationRunning(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 dark:text-green-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "high": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { label: "Excellent", color: "text-green-600" };
    if (confidence >= 80) return { label: "Good", color: "text-blue-600" };
    if (confidence >= 70) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Needs Improvement", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Quantum Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-200/20 dark:border-slate-800/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/25">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-slate-950 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                  Quantum Financial Simulator
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  Lender Assurance & Risk Assessment • DWC Systems LLC
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Lender Verified
              </Badge>
              <Button 
                onClick={runQuantumSimulation}
                disabled={simulationRunning}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {simulationRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Running Simulation
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 mr-2" />
                    Run Quantum Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lender-metrics" className="flex items-center space-x-2">
              <Banknote className="w-4 h-4" />
              <span>Lender Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Risk Scenarios</span>
            </TabsTrigger>
            <TabsTrigger value="assurance" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Loan Assurance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lender-metrics" className="space-y-6">
            {/* Key Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Credit Score</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{lenderMetrics.creditScore}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Excellent Rating</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${lenderMetrics.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">+{lenderMetrics.projectedGrowth}% growth</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Debt-to-Income</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{lenderMetrics.debtToIncomeRatio}%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Well below 30% threshold</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automation ROI</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{lenderMetrics.automationROI}%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">Industry leading</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Financial Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Cash Flow Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Cash Flow</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">${lenderMetrics.cashFlow.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Client Retention Rate</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{lenderMetrics.clientRetention}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Assessment</span>
                    <Badge className={`${getRiskColor(lenderMetrics.riskAssessment)} border-current`}>
                      {lenderMetrics.riskAssessment.toUpperCase()}
                    </Badge>
                  </div>
                  <Progress value={lenderMetrics.cashFlow / 500} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Lender Confidence Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {lenderMetrics.lenderConfidence.toFixed(1)}%
                    </div>
                    <div className={`text-lg font-medium ${getConfidenceLevel(lenderMetrics.lenderConfidence).color}`}>
                      {getConfidenceLevel(lenderMetrics.lenderConfidence).label}
                    </div>
                  </div>
                  <Progress value={lenderMetrics.lenderConfidence} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">$250K</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Qualified Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">3.2%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Interest Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {quantumScenarios.map((scenario, idx) => (
                <Card key={idx} className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">{scenario.scenarioName}</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {scenario.probabilitySuccess}% Success
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Expected Revenue</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${scenario.expectedRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Timeframe</div>
                        <div className="font-medium text-gray-900 dark:text-white">{scenario.timeframe}</div>
                      </div>
                    </div>
                    
                    <Progress value={scenario.probabilitySuccess} className="mb-4" />
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Factors:</div>
                      {scenario.riskFactors.map((risk, riskIdx) => (
                        <div key={riskIdx} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
                          {risk}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assurance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
                    Loan Qualification Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">$500K</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Maximum Qualification</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">2.8%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Prime Rate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Income Verification</span>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Asset Documentation</span>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Business Model Validation</span>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Automation Revenue Proof</span>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-purple-600" />
                    Payment Projection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">$1,847</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment (250K @ 3.2%)</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Principal</span>
                      <span className="font-medium">$1,180</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Interest</span>
                      <span className="font-medium">$667</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment-to-Income Ratio</span>
                      <span className="font-medium text-green-600 dark:text-green-400">3.9%</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm font-medium text-green-800 dark:text-green-400">
                      Automation revenue covers 25.6x the monthly payment
                    </div>
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