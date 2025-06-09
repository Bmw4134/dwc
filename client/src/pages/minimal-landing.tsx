import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QNISVectorMatrix from "@/components/QNISVectorMatrix";
import QNISMetricsDashboard from "@/components/QNISMetricsDashboard";
import { Brain, Zap, TrendingUp, Shield } from "lucide-react";

export default function MinimalLanding() {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900 text-white">
      {/* Hero Section with QNIS Vector Matrix */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            DWC Systems
          </h1>
          <p className="text-3xl text-slate-300 mb-4">
            Quantum Neural Intelligence System
          </p>
          <p className="text-lg text-emerald-400 mb-8">
            Powered by QNIS Master LLM with Perplexity Pro Deep Research Core
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => handleNavigation('/demo-dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-lg"
            >
              <Brain className="mr-2 h-5 w-5" />
              Try NEXUS GPT (20 Free Prompts)
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleNavigation('/dashboard')}
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-4 text-lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Executive Dashboard
            </Button>
          </div>
        </div>

        {/* QNIS Vector Matrix Visualization */}
        <div className="mb-12">
          <QNISVectorMatrix />
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-emerald-900/30 p-6 text-center">
            <Zap className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Quantum Automation</h3>
            <p className="text-emerald-400">18 active modules with 100% automation linkage for enterprise-grade performance</p>
          </Card>
          
          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900/50 to-purple-900/30 p-6 text-center">
            <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">QNIS Intelligence</h3>
            <p className="text-purple-400">Advanced behavioral prediction with 95%+ confidence quantum neural networks</p>
          </Card>
          
          <Card className="border-amber-500/30 bg-gradient-to-br from-slate-900/50 to-amber-900/30 p-6 text-center">
            <Shield className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-amber-400">Quantum-secure authentication with unbypassable visitor tracking systems</p>
          </Card>
        </div>

        {/* Live Metrics Dashboard */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Live System Intelligence
          </h2>
          <QNISMetricsDashboard />
        </div>

        {/* Pipeline Value Showcase */}
        <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-900/80 to-emerald-900/40 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Current Pipeline Value
          </h3>
          <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent mb-4">
            $2.66M
          </div>
          <p className="text-lg text-emerald-400 mb-6">
            Active opportunities across 4 qualified leads with 33.3% conversion rate
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => handleNavigation('/qnis')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              View QNIS Analysis
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleNavigation('/wow-tester')}
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
            >
              Test Platform
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}