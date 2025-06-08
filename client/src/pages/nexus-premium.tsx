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
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2, 
  Target, 
  Zap, 
  BarChart3,
  Globe,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ComponentType<any>;
  color: string;
}

export default function NEXUSPremium() {
  const { toast } = useToast();

  const metrics: MetricCard[] = [
    {
      title: "Monthly Revenue",
      value: "$47,392",
      change: "+23.4%",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "Active Leads",
      value: "1,247",
      change: "+89 today",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Automation Score",
      value: "98.7%",
      change: "+2.1%",
      trend: "up",
      icon: Zap,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Client Satisfaction",
      value: "99.2%",
      change: "Stable",
      trend: "stable",
      icon: Target,
      color: "from-orange-500 to-red-600"
    }
  ];

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/nexus-premium-dashboard"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Premium Navigation Header */}
      <header className="relative border-b border-gray-200/20 dark:border-slate-800/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  NEXUS Intelligence Platform
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Enterprise AI Automation & Analytics Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-800/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">All Systems Operational</span>
              </div>
              
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Launch Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-6 py-12">
        {/* Premium Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={metric.title} className="relative overflow-hidden border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl shadow-gray-200/20 dark:shadow-slate-900/20 hover:shadow-2xl transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    <span className={metric.trend === "up" ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-600 dark:text-gray-400"}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Revenue Analytics
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Real-time performance tracking and forecasting
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Live Data
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Advanced Revenue Analytics Chart
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Real-time data visualization with AI insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Response</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">99.9%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Processing</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Engine</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Optimal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-slate-800 dark:to-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-600">
                  LLC Intelligence Analysis
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <Button className="w-full justify-between bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 dark:from-slate-800 dark:to-slate-700 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-600">
                  Lead Generation Scan
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <Button className="w-full justify-between bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-slate-800 dark:to-slate-700 text-green-700 dark:text-green-300 border border-green-200 dark:border-slate-600">
                  System Optimization
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                AI-Powered Intelligence
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Advanced machine learning algorithms analyze your business data to provide actionable insights and automated decision-making capabilities.
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                Learn More
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Strategic Automation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Streamline complex business processes with intelligent automation that adapts to your workflow and optimizes performance continuously.
              </p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                Explore Features
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Growth Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Comprehensive analytics dashboard with real-time metrics, predictive modeling, and strategic insights for accelerated business growth.
              </p>
              <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                View Analytics
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}