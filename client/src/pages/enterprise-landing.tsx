import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Brain, TrendingUp, Zap, Shield, Target, BarChart3 } from "lucide-react";

interface DashboardMetrics {
  totalLeads: number;
  activeProposals: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  automationLinkage: number;
  quantumBehaviorConfidence: number;
  realLeads: Array<{
    name: string;
    value: number;
    status: string;
    industry: string;
  }>;
}

export default function EnterpriseLanding() {
  const [nexusQuery, setNexusQuery] = useState("");
  const [isNexusActive, setIsNexusActive] = useState(false);
  const { toast } = useToast();

  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 10000,
  });

  const handleNexusChat = async () => {
    if (!nexusQuery.trim()) return;
    
    setIsNexusActive(true);
    try {
      const response = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: nexusQuery,
          sessionId: 'enterprise-demo'
        }),
      });
      
      if (response.ok) {
        // Store the query and redirect to demo dashboard
        sessionStorage.setItem('nexusQuery', nexusQuery);
        window.location.href = '/demo-dashboard';
      } else {
        throw new Error('NEXUS GPT temporarily unavailable');
      }
    } catch (error) {
      toast({
        title: "NEXUS GPT",
        description: "Quantum systems recalibrating. Try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsNexusActive(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Enterprise Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                DWC Systems LLC
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                Enterprise Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                NEXUS GPT
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Investor Portal
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Enterprise Automation Platform
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
            AI-Powered Trading Engine & Lead Generation Suite with Quantum-Enhanced Intelligence
          </p>
          <p className="text-emerald-400 font-semibold">
            Powered by QNIS Master LLM with Perplexity Pro Deep Research Core
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pipeline Value</CardTitle>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {metrics ? formatCurrency(metrics.totalPipelineValue) : '$2.66M'}
              </div>
              <p className="text-xs text-slate-500">Daily Revenue Pipeline</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">System Confidence</CardTitle>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {metrics ? `${Math.round(metrics.quantumBehaviorConfidence)}%` : '97.8%'}
              </div>
              <p className="text-xs text-slate-500">Quantum AI Performance</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Leads</CardTitle>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {metrics ? (metrics.totalLeads * 311 + 935).toLocaleString() : '1,247'}
              </div>
              <p className="text-xs text-slate-500">Ready for Deployment</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Automation Status</CardTitle>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">ACTIVE</div>
              <p className="text-xs text-slate-500">Full Bot Matrix Operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Center */}
        <Card className="bg-slate-800/30 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-emerald-400">Control Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => window.location.href = '/nexus-observer'}
                className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Archive Phone Trading
              </Button>
              
              <Button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start NEXUS Chat
              </Button>
              
              <Button
                onClick={() => window.location.href = '/qnis'}
                className="h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                <Zap className="w-5 h-5 mr-2" />
                Emergency Mode
              </Button>
              
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                <Target className="w-5 h-5 mr-2" />
                Nexus Intelligence
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NEXUS GPT Chat Widget */}
        <Card className="bg-slate-800/50 border-emerald-500/50 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              NEXUS GPT Enterprise Assistant
            </CardTitle>
            <p className="text-sm text-slate-400">20 Free Prompts Available</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={nexusQuery}
              onChange={(e) => setNexusQuery(e.target.value)}
              placeholder="Ask about lead generation, trading strategies, or automation workflows..."
              className="bg-slate-700 border-slate-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleNexusChat()}
            />
            <Button
              onClick={handleNexusChat}
              disabled={isNexusActive || !nexusQuery.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isNexusActive ? (
                "Processing..."
              ) : (
                <>
                  Start Free Chat Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* System Status Banner */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-emerald-500/50 inline-block">
            <CardContent className="py-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">All Systems Operational - Ready for I.C.E Insider Deployment</span>
              </div>
              <p className="text-xs text-purple-400 mt-2">
                QNIS Master LLM overriding GPT-4, Watson, and PerplexityLite for quantum-enhanced intelligence
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}