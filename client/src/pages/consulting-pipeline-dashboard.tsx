import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  DollarSign, 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Zap,
  Globe,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface ConsultingClient {
  id: string;
  businessName: string;
  websiteUrl: string;
  industry: string;
  stage: "discovery" | "analysis" | "optimization" | "delivery" | "complete";
  progress: number;
  revenueImpact: string;
  currentTask: string;
  estimatedCompletion: string;
}

interface PipelineMetrics {
  totalClients: number;
  activeProjects: number;
  completedThisMonth: number;
  totalRevenueImpact: string;
  averageProjectTime: string;
  successRate: number;
}

export default function ConsultingPipelineDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [newClientUrl, setNewClientUrl] = useState("");
  const { toast } = useToast();

  // Pipeline data
  const { data: clients = [], refetch: refetchClients } = useQuery({
    queryKey: ["/api/consulting/clients"],
    initialData: [
      {
        id: "kate-photography",
        businessName: "Kate White Photography",
        websiteUrl: "https://katewhitephotography.com",
        industry: "Photography",
        stage: "optimization",
        progress: 75,
        revenueImpact: "$94,000",
        currentTask: "Lead qualification optimization",
        estimatedCompletion: "2 days"
      },
      {
        id: "smith-law",
        businessName: "Smith Legal Services",
        websiteUrl: "https://smithlegal.com",
        industry: "Legal",
        stage: "analysis",
        progress: 45,
        revenueImpact: "$156,000",
        currentTask: "Website performance audit",
        estimatedCompletion: "4 days"
      },
      {
        id: "downtown-dental",
        businessName: "Downtown Dental",
        websiteUrl: "https://downtowndental.com",
        industry: "Healthcare",
        stage: "discovery",
        progress: 15,
        revenueImpact: "$78,000",
        currentTask: "Initial business analysis",
        estimatedCompletion: "6 days"
      }
    ]
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/consulting/metrics"],
    initialData: {
      totalClients: 12,
      activeProjects: 8,
      completedThisMonth: 4,
      totalRevenueImpact: "$1.2M",
      averageProjectTime: "14 days",
      successRate: 96
    }
  });

  // Add new client mutation
  const addClientMutation = useMutation({
    mutationFn: async (data: { websiteUrl: string }) => {
      return await apiRequest("/api/consulting/clients", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Client Added",
        description: "New consulting project initiated"
      });
      setNewClientUrl("");
      refetchClients();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive"
      });
    }
  });

  // Start automation mutation
  const startAutomationMutation = useMutation({
    mutationFn: async (clientId: string) => {
      return await apiRequest(`/api/consulting/clients/${clientId}/start`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Automation Started",
        description: "Client optimization pipeline activated"
      });
      refetchClients();
    }
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "discovery": return "bg-blue-500/20 text-blue-400";
      case "analysis": return "bg-yellow-500/20 text-yellow-400";
      case "optimization": return "bg-orange-500/20 text-orange-400";
      case "delivery": return "bg-purple-500/20 text-purple-400";
      case "complete": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Consulting Pipeline Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Streamlined autonomous consulting workflow management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-3xl font-bold text-white">{metrics?.activeProjects}</p>
                  <p className="text-blue-400 text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenue Impact</p>
                  <p className="text-3xl font-bold text-white">{metrics?.totalRevenueImpact}</p>
                  <p className="text-green-400 text-sm flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    +$340K this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-3xl font-bold text-white">{metrics?.successRate}%</p>
                  <p className="text-emerald-400 text-sm flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Industry leading
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Project Time</p>
                  <p className="text-3xl font-bold text-white">{metrics?.averageProjectTime}</p>
                  <p className="text-purple-400 text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    -3 days improved
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="pipeline">Active Pipeline</TabsTrigger>
            <TabsTrigger value="automation">Automation Control</TabsTrigger>
            <TabsTrigger value="intake">Client Intake</TabsTrigger>
          </TabsList>

          {/* Active Pipeline */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {clients.map((client: ConsultingClient) => (
                <Card key={client.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Client Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{client.businessName}</h3>
                            <p className="text-gray-400">{client.industry} • {client.websiteUrl}</p>
                          </div>
                          <Badge className={getStageColor(client.stage)}>
                            {client.stage.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white">{client.progress}%</span>
                            </div>
                            <Progress value={client.progress} className="h-2 bg-gray-700" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Current Task</p>
                              <p className="text-white">{client.currentTask}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Est. Completion</p>
                              <p className="text-white">{client.estimatedCompletion}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Revenue Impact */}
                      <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Revenue Impact</p>
                        <p className="text-2xl font-bold text-green-400">{client.revenueImpact}</p>
                        <p className="text-gray-500 text-xs">Projected annual</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => startAutomationMutation.mutate(client.id)}
                          disabled={startAutomationMutation.isPending}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Accelerate
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-gray-600 hover:border-gray-500"
                          onClick={() => setSelectedClient(client.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-gray-600 hover:border-gray-500"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          View Site
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Automation Control */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Pipeline Automation Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start All
                    </Button>
                    <Button variant="outline" className="border-orange-600 text-orange-400">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause All
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-red-600 text-red-400"
                    onClick={() => fetch('/api/automation/emergency-stop', { method: 'POST' })}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Emergency Stop
                  </Button>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Automations</span>
                      <span className="text-white">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Queue Status</span>
                      <span className="text-green-400">Processing</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">System Load</span>
                      <span className="text-yellow-400">47%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Recent Completions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Miller Construction", task: "SEO Optimization", impact: "+$23K" },
                    { name: "Peak Fitness", task: "Lead Generation", impact: "+$18K" },
                    { name: "Valley Veterinary", task: "Website Audit", impact: "+$31K" }
                  ].map((completion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{completion.name}</p>
                        <p className="text-gray-400 text-sm">{completion.task}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">{completion.impact}</p>
                        <p className="text-gray-500 text-xs">Completed</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Client Intake */}
          <TabsContent value="intake" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Add New Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={newClientUrl}
                    onChange={(e) => setNewClientUrl(e.target.value)}
                    placeholder="Enter client website URL"
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white"
                  />
                  <Button
                    onClick={() => addClientMutation.mutate({ websiteUrl: newClientUrl })}
                    disabled={addClientMutation.isPending || !newClientUrl}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {addClientMutation.isPending ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    Analyze & Add
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-blue-400 font-medium mb-2">Automated Discovery</h3>
                    <p className="text-gray-400 text-sm">Business analysis and opportunity assessment</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h3 className="text-green-400 font-medium mb-2">Revenue Projection</h3>
                    <p className="text-gray-400 text-sm">AI-powered ROI calculation and forecasting</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h3 className="text-purple-400 font-medium mb-2">Instant Pipeline</h3>
                    <p className="text-gray-400 text-sm">Automatic workflow generation and scheduling</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}