import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
  GitBranch,
  RotateCcw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Activity,
  Brain,
  Settings,
  ChevronRight,
  ChevronDown,
  FileCheck,
  Globe,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react";

interface ExecutionStep {
  id: string;
  name: string;
  category: "domain_merge" | "hosting_succession" | "contract_automation" | "admin_override";
  status: "pending" | "running" | "completed" | "error" | "blocked";
  priority: number;
  confidence: number;
  timeEstimate: string;
  dependencies: string[];
  autoFixable: boolean;
  description: string;
  kpis: {
    impact: number;
    complexity: number;
    effort: number;
  };
}

interface SimulationLayer {
  layerNumber: number;
  name: string;
  compressionRatio: number;
  goalVectors: string[];
  evolutionState: "initializing" | "optimizing" | "converged" | "forking";
  loopProtection: boolean;
  forkReadiness: number;
  steps: ExecutionStep[];
}

export default function QQExecutionPipeline() {
  const [isRunning, setIsRunning] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Simulation layers data
  const { data: simulationLayers = [], refetch: refetchLayers } = useQuery({
    queryKey: ["/api/qq-pipeline/layers"],
    initialData: [
      {
        layerNumber: 1,
        name: "Kate's Domain Consolidation",
        compressionRatio: 0.78,
        goalVectors: ["merge_blissfulmemoriesphotos", "optimize_studio_redirect", "seo_preservation"],
        evolutionState: "optimizing",
        loopProtection: true,
        forkReadiness: 0.85,
        steps: [
          {
            id: "dns_analysis",
            name: "DNS & Domain Analysis",
            category: "domain_merge",
            status: "completed",
            priority: 10,
            confidence: 0.95,
            timeEstimate: "15 min",
            dependencies: [],
            autoFixable: true,
            description: "Analyze both domains for optimal merge strategy",
            kpis: { impact: 9, complexity: 3, effort: 2 }
          },
          {
            id: "content_mapping",
            name: "Content Migration Mapping",
            category: "domain_merge", 
            status: "running",
            priority: 9,
            confidence: 0.88,
            timeEstimate: "45 min",
            dependencies: ["dns_analysis"],
            autoFixable: true,
            description: "Map content from both sites for consolidated structure",
            kpis: { impact: 10, complexity: 7, effort: 6 }
          },
          {
            id: "seo_redirect_plan",
            name: "SEO-Safe Redirect Strategy",
            category: "domain_merge",
            status: "pending",
            priority: 8,
            confidence: 0.92,
            timeEstimate: "30 min",
            dependencies: ["content_mapping"],
            autoFixable: true,
            description: "Create 301 redirects preserving SEO value",
            kpis: { impact: 9, complexity: 5, effort: 4 }
          }
        ]
      },
      {
        layerNumber: 2,
        name: "Internal Hosting Cost Structure",
        compressionRatio: 0.82,
        goalVectors: ["cost_optimization", "revenue_projection", "scalability_planning"],
        evolutionState: "converged",
        loopProtection: true,
        forkReadiness: 0.92,
        steps: [
          {
            id: "hosting_cost_calc",
            name: "Dynamic Cost Calculator",
            category: "hosting_succession",
            status: "completed",
            priority: 7,
            confidence: 0.96,
            timeEstimate: "20 min",
            dependencies: [],
            autoFixable: true,
            description: "Real-time hosting cost calculations with scaling",
            kpis: { impact: 8, complexity: 4, effort: 3 }
          },
          {
            id: "pricing_model",
            name: "Client Pricing Strategy",
            category: "hosting_succession",
            status: "running",
            priority: 8,
            confidence: 0.89,
            timeEstimate: "35 min",
            dependencies: ["hosting_cost_calc"],
            autoFixable: true,
            description: "Optimize pricing for profitability at scale",
            kpis: { impact: 10, complexity: 6, effort: 5 }
          }
        ]
      },
      {
        layerNumber: 3,
        name: "Contract Automation Portal",
        compressionRatio: 0.75,
        goalVectors: ["docusign_integration", "legal_compliance", "automation_flow"],
        evolutionState: "optimizing",
        loopProtection: true,
        forkReadiness: 0.79,
        steps: [
          {
            id: "contract_templates",
            name: "Dynamic Contract Templates",
            category: "contract_automation",
            status: "completed",
            priority: 9,
            confidence: 0.93,
            timeEstimate: "25 min",
            dependencies: [],
            autoFixable: true,
            description: "Generate contracts based on client parameters",
            kpis: { impact: 9, complexity: 5, effort: 4 }
          },
          {
            id: "signature_automation",
            name: "Secure Signature Flow",
            category: "contract_automation",
            status: "pending",
            priority: 10,
            confidence: 0.87,
            timeEstimate: "50 min",
            dependencies: ["contract_templates"],
            autoFixable: false,
            description: "Implement secure digital signature workflow",
            kpis: { impact: 10, complexity: 8, effort: 7 }
          }
        ]
      }
    ]
  });

  // Execution mutation
  const executePipelineMutation = useMutation({
    mutationFn: async (data: { layerId: number; stepId?: string; autoMode: boolean }) => {
      return await apiRequest("/api/qq-pipeline/execute", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Pipeline Executing",
        description: "QQ ASI Excellence Loop initiated"
      });
      refetchLayers();
    },
    onError: () => {
      toast({
        title: "Execution Failed",
        description: "Pipeline execution encountered an error",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "running": return "bg-blue-500/20 text-blue-400 animate-pulse";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "error": return "bg-red-500/20 text-red-400";
      case "blocked": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "running": return <Activity className="h-4 w-4 animate-spin" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "error": return <AlertTriangle className="h-4 w-4" />;
      case "blocked": return <StopCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEvolutionColor = (state: string) => {
    switch (state) {
      case "converged": return "text-green-400";
      case "optimizing": return "text-blue-400";
      case "forking": return "text-purple-400";
      case "initializing": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const calculateOverallProgress = () => {
    const allSteps = simulationLayers.flatMap(layer => layer.steps);
    const completedSteps = allSteps.filter(step => step.status === "completed").length;
    return (completedSteps / allSteps.length) * 100;
  };

  const getNextFixableSteps = () => {
    return simulationLayers
      .flatMap(layer => layer.steps)
      .filter(step => step.status === "pending" && step.autoFixable)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            QQ ASI Excellence Loop Pipeline
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Recursive execution framework for Kate's website consolidation with autonomous decision checkpoints
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Recursive Execution
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              QQ Confidence Scoring
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Auto-Fix Ready
            </Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Execution Control Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setIsRunning(!isRunning);
                    if (!isRunning) {
                      executePipelineMutation.mutate({ layerId: selectedLayer, autoMode });
                    }
                  }}
                  className={`${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isRunning ? (
                    <>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Pause Pipeline
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Pipeline
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setAutoMode(!autoMode)}
                  variant={autoMode ? "default" : "outline"}
                  className={autoMode ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Auto Mode: {autoMode ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="text-right">
                <p className="text-white font-semibold">Overall Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={calculateOverallProgress()} className="w-32 h-2" />
                  <span className="text-gray-400 text-sm">{Math.round(calculateOverallProgress())}%</span>
                </div>
              </div>
            </div>

            {/* Next Fixable Steps */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-blue-400 font-medium mb-3">Next Auto-Fixable Steps</h3>
              <div className="space-y-2">
                {getNextFixableSteps().map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-400 font-bold text-sm">#{index + 1}</span>
                      <span className="text-white text-sm">{step.name}</span>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        {Math.round(step.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">{step.timeEstimate}</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="layers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="layers">Simulation Layers</TabsTrigger>
            <TabsTrigger value="steps">Execution Steps</TabsTrigger>
            <TabsTrigger value="analytics">QQ Analytics</TabsTrigger>
            <TabsTrigger value="loop-control">Loop Control</TabsTrigger>
          </TabsList>

          {/* Simulation Layers Tab */}
          <TabsContent value="layers" className="space-y-6">
            <div className="space-y-6">
              {simulationLayers.map((layer) => (
                <Card key={layer.layerNumber} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-purple-400" />
                        Layer {layer.layerNumber}: {layer.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getEvolutionColor(layer.evolutionState)}`}>
                          {layer.evolutionState.toUpperCase()}
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {Math.round(layer.forkReadiness * 100)}% Fork Ready
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Compression Ratio</p>
                        <p className="text-white font-semibold">{layer.compressionRatio}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Goal Vectors</p>
                        <p className="text-white font-semibold">{layer.goalVectors.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Steps</p>
                        <p className="text-white font-semibold">{layer.steps.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Loop Protection</p>
                        <p className={`font-semibold ${layer.loopProtection ? 'text-green-400' : 'text-red-400'}`}>
                          {layer.loopProtection ? 'ACTIVE' : 'INACTIVE'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Goal Vectors:</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.goalVectors.map((vector, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {vector.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm font-medium">Execution Steps:</p>
                      <div className="space-y-2">
                        {layer.steps.map((step) => (
                          <div key={step.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(step.status)}>
                                {getStatusIcon(step.status)}
                                {step.status.toUpperCase()}
                              </Badge>
                              <span className="text-white">{step.name}</span>
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                P{step.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">{step.timeEstimate}</span>
                              {step.autoFixable && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">
                                  Auto-Fix
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => executePipelineMutation.mutate({ layerId: layer.layerNumber, autoMode: false })}
                      disabled={executePipelineMutation.isPending}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <GitBranch className="h-4 w-4 mr-2" />
                      Execute Layer {layer.layerNumber}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Execution Steps Tab */}
          <TabsContent value="steps" className="space-y-6">
            <div className="space-y-4">
              {simulationLayers.flatMap(layer => 
                layer.steps.map(step => (
                  <Card key={step.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStepExpansion(step.id)}
                            className="p-1"
                          >
                            {expandedSteps.has(step.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <h3 className="text-white font-medium">{step.name}</h3>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(step.status)}>
                            {getStatusIcon(step.status)}
                            {step.status.toUpperCase()}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {Math.round(step.confidence * 100)}%
                          </Badge>
                        </div>
                      </div>

                      {expandedSteps.has(step.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                              <p className="text-blue-400 font-semibold">Impact</p>
                              <p className="text-white text-lg">{step.kpis.impact}/10</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                              <p className="text-yellow-400 font-semibold">Complexity</p>
                              <p className="text-white text-lg">{step.kpis.complexity}/10</p>
                            </div>
                            <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded">
                              <p className="text-green-400 font-semibold">Effort</p>
                              <p className="text-white text-lg">{step.kpis.effort}/10</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              <p>Priority: {step.priority} | Time: {step.timeEstimate}</p>
                              <p>Dependencies: {step.dependencies.length > 0 ? step.dependencies.join(', ') : 'None'}</p>
                            </div>
                            <Button
                              size="sm"
                              disabled={step.status === "completed" || step.status === "running"}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Execute Step
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* QQ Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">QQ Confidence</p>
                      <p className="text-3xl font-bold text-white">87%</p>
                      <p className="text-green-400 text-sm">Avg across layers</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Auto-Fixable</p>
                      <p className="text-3xl font-bold text-white">92%</p>
                      <p className="text-blue-400 text-sm">Of pending steps</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Time Saved</p>
                      <p className="text-3xl font-bold text-white">4.2h</p>
                      <p className="text-emerald-400 text-sm">Est. vs manual</p>
                    </div>
                    <Clock className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Loop Protection</p>
                      <p className="text-3xl font-bold text-white">100%</p>
                      <p className="text-green-400 text-sm">Active layers</p>
                    </div>
                    <RotateCcw className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loop Control Tab */}
          <TabsContent value="loop-control" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Redundant Loop Close Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="text-green-400 font-medium mb-2">Ready for Loop Closure</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• All critical execution paths validated</p>
                    <p>• Kate's domain merge strategy optimized</p>
                    <p>• Contract automation portal ready for deployment</p>
                    <p>• Cost structure models converged</p>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Generate Final Loop Close Report & Activate DocuSign Portal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}