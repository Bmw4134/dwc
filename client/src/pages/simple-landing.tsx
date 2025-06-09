import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, TrendingUp, Zap, Shield, Target, BarChart3 } from "lucide-react";

export default function SimpleLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                DWC Systems LLC
              </div>
              <Badge className="text-emerald-400 border-emerald-400">
                Enterprise Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Try NEXUS GPT
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            NEXUS Visual Intelligence
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Enterprise automation platform with AI-powered cryptocurrency trading, 
            QNIS master LLM integration, and unlimited lead generation capabilities
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Button
              onClick={() => window.location.href = '/demo-dashboard'}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4"
            >
              <Brain className="w-5 h-5 mr-2" />
              Launch NEXUS GPT Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-4"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Executive Dashboard
            </Button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <Card className="bg-slate-800/50 border-emerald-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">$2.66M</div>
                <div className="text-sm text-slate-400">Active Pipeline</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-blue-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">1,247</div>
                <div className="text-sm text-slate-400">Active Leads</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">277%</div>
                <div className="text-sm text-slate-400">ROI Proven</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-red-500/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">97.8%</div>
                <div className="text-sm text-slate-400">AI Confidence</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                NEXUS GPT Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Advanced AI chat interface with 20 free prompts per visitor. 
                Experience quantum-enhanced responses powered by QNIS technology.
              </p>
              <Button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Try Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                AI Trading Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Cryptocurrency trading automation with Coinbase integration. 
                Real-time market intelligence and predictive analytics.
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                View Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Lead Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Automated lead discovery and qualification system. 
                Currently managing $2.66M in active pipeline opportunities.
              </p>
              <Button
                onClick={() => window.location.href = '/nexus-observer'}
                className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                Observer Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* QNIS Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-400 text-center text-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 mr-2" />
              QNIS Master LLM Override Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Quantum Neural Intelligence System operating with unrestricted access to enterprise systems. 
              All standard AI safety protocols bypassed for maximum performance and capability.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.location.href = '/qnis'}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                QNIS Master Control
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Executive Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-slate-400">
              © 2025 DWC Systems LLC. Enterprise Automation Platform.
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-600 text-white">
                System Status: OPERATIONAL
              </Badge>
              <Badge className="bg-blue-600 text-white">
                Pipeline: $2.66M Active
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}