import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Globe, Zap, Target, DollarSign, TrendingUp, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface AutomationResult {
  url: string;
  status: "analyzing" | "optimizing" | "completed" | "error";
  progress: number;
  currentStep: string;
  results: {
    seoScore: number;
    performanceScore: number;
    conversionScore: number;
    revenueImpact: string;
    timeToComplete: string;
    optimizations: OptimizationItem[];
  };
}

interface OptimizationItem {
  category: string;
  description: string;
  impact: "high" | "medium" | "low";
  status: "pending" | "running" | "completed";
  estimatedRevenue: string;
}

export default function KateWebsiteAutomation() {
  const [websiteUrl, setWebsiteUrl] = useState("https://katewhitephotography.com");
  const [automationResult, setAutomationResult] = useState<AutomationResult | null>(null);
  const { toast } = useToast();

  const automationMutation = useMutation({
    mutationFn: async (data: { url: string }) => {
      const response = await apiRequest("/api/automation/website-optimization", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: (data) => {
      setAutomationResult(data);
      toast({
        title: "Automation Started",
        description: "Kate's website optimization is now running",
      });
    },
    onError: (error) => {
      toast({
        title: "Automation Error",
        description: "Failed to start website optimization",
        variant: "destructive",
      });
    }
  });

  const handleStartAutomation = () => {
    automationMutation.mutate({ url: websiteUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Kate's Photography Website Automation
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Autonomous website optimization using Puppeteer for real-time business enhancement
          </p>
        </div>

        {/* URL Input Section */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Website URL Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Enter Kate's website URL"
                className="flex-1 bg-gray-700/50 border-gray-600 text-white"
              />
              <Button
                onClick={handleStartAutomation}
                disabled={automationMutation.isPending || !websiteUrl}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {automationMutation.isPending ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Start Automation
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-2">Puppeteer Integration</h3>
                <p className="text-gray-400 text-sm">Automated browser control for real-time optimization</p>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h3 className="text-green-400 font-medium mb-2">Live Data Analysis</h3>
                <p className="text-gray-400 text-sm">Real website performance metrics and SEO scoring</p>
              </div>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h3 className="text-purple-400 font-medium mb-2">Revenue Optimization</h3>
                <p className="text-gray-400 text-sm">Conversion rate improvements and lead generation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Results */}
        {automationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Panel */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-400" />
                  Automation Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white">{automationResult.progress}%</span>
                  </div>
                  <Progress value={automationResult.progress} className="h-3 bg-gray-700" />
                </div>

                <div className="space-y-3">
                  <Badge 
                    className={
                      automationResult.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      automationResult.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      automationResult.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }
                  >
                    {automationResult.status.toUpperCase()}
                  </Badge>
                  
                  <div className="text-sm">
                    <p className="text-gray-400">Current Step:</p>
                    <p className="text-white">{automationResult.currentStep}</p>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-400">Target URL:</p>
                    <p className="text-blue-400 break-all">{automationResult.url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Live Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {automationResult.results && (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">SEO Score</span>
                        <span className="text-white font-medium">{automationResult.results.seoScore}/100</span>
                      </div>
                      <Progress value={automationResult.results.seoScore} className="h-2 bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Performance</span>
                        <span className="text-white font-medium">{automationResult.results.performanceScore}/100</span>
                      </div>
                      <Progress value={automationResult.results.performanceScore} className="h-2 bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Conversion Rate</span>
                        <span className="text-white font-medium">{automationResult.results.conversionScore}/100</span>
                      </div>
                      <Progress value={automationResult.results.conversionScore} className="h-2 bg-gray-700" />
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Revenue Impact</p>
                        <p className="text-2xl font-bold text-green-400">{automationResult.results.revenueImpact}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Optimization Tasks */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                  Active Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {automationResult.results?.optimizations?.map((optimization, index) => (
                  <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{optimization.category}</span>
                      <Badge 
                        size="sm"
                        className={
                          optimization.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          optimization.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }
                      >
                        {optimization.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{optimization.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Impact: {optimization.impact}</span>
                      <span className="text-xs text-green-400">{optimization.estimatedRevenue}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">No optimizations running</p>
                    <p className="text-gray-500 text-sm">Start automation to see live results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-16 bg-gray-800/40 border-gray-700 hover:bg-gray-700/40"
            onClick={() => setWebsiteUrl("https://katewhitephotography.com")}
          >
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            <div className="text-left">
              <div className="text-white font-medium">Kate's Main Site</div>
              <div className="text-gray-400 text-xs">Primary photography portfolio</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-16 bg-gray-800/40 border-gray-700 hover:bg-gray-700/40"
            onClick={() => setWebsiteUrl("https://katewhitephotography.com/booking")}
          >
            <Target className="h-5 w-5 mr-2 text-green-400" />
            <div className="text-left">
              <div className="text-white font-medium">Booking Page</div>
              <div className="text-gray-400 text-xs">Conversion optimization focus</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-16 bg-gray-800/40 border-gray-700 hover:bg-gray-700/40"
            onClick={() => setWebsiteUrl("https://katewhitephotography.com/gallery")}
          >
            <DollarSign className="h-5 w-5 mr-2 text-purple-400" />
            <div className="text-left">
              <div className="text-white font-medium">Portfolio Gallery</div>
              <div className="text-gray-400 text-xs">Visual engagement analysis</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-16 bg-gray-800/40 border-gray-700 hover:bg-gray-700/40"
            onClick={() => setWebsiteUrl("https://katewhitephotography.com/contact")}
          >
            <Zap className="h-5 w-5 mr-2 text-orange-400" />
            <div className="text-left">
              <div className="text-white font-medium">Contact Form</div>
              <div className="text-gray-400 text-xs">Lead generation optimization</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}