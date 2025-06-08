import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Building2, Brain, TrendingUp, Zap } from "lucide-react";

export default function SimpleLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900 text-white">
      {/* Header */}
      <header className="border-b border-emerald-500/20 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-emerald-400 mr-3" />
              <span className="text-2xl font-bold text-white">DWC Systems</span>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/demo-login')}
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
              >
                Demo Access
              </Button>
              <Button 
                onClick={() => setLocation('/real-login')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Secure Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Enterprise Automation Platform
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            AI-powered trading, quantum intelligence, and endless lead generation with NEXUS Visual Intelligence
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => setLocation('/demo-dashboard')}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
            >
              <Brain className="mr-2 h-5 w-5" />
              Try NEXUS GPT (20 Free Prompts)
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation('/dashboard')}
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-4 text-lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Executive Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-emerald-500/20">
            <Brain className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">QNIS Master LLM</h3>
            <p className="text-slate-300">
              Primary reasoning engine with Perplexity Pro integration for intelligent fact resolution and behavioral prediction
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-emerald-500/20">
            <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">AI Trading Engine</h3>
            <p className="text-slate-300">
              Coinbase integration with real-time market intelligence and automated trading capabilities
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-emerald-500/20">
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-white">NEXUS Intelligence</h3>
            <p className="text-slate-300">
              Quantum-secure authentication, visitor tracking, and 18-module enterprise automation suite
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/20 bg-slate-900/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 DWC Systems LLC. Enterprise Automation Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}