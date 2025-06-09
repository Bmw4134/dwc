export default function MinimalLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            DWC Systems LLC
          </h1>
          <h2 className="text-3xl font-bold mb-4 text-emerald-400">
            NEXUS Visual Intelligence Platform
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Enterprise automation platform with AI-powered cryptocurrency trading, 
            QNIS master LLM integration, and unlimited lead generation capabilities.
            Currently managing $2.66M in active pipeline opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-slate-800/50 border border-emerald-500/50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">$2.66M</div>
              <div className="text-slate-400">Active Pipeline</div>
            </div>
            <div className="bg-slate-800/50 border border-blue-500/50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">1,247</div>
              <div className="text-slate-400">Active Leads</div>
            </div>
            <div className="bg-slate-800/50 border border-purple-500/50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">277%</div>
              <div className="text-slate-400">ROI Proven</div>
            </div>
            <div className="bg-slate-800/50 border border-red-500/50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">97.8%</div>
              <div className="text-slate-400">AI Confidence</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => window.location.href = '/demo-dashboard'}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Launch NEXUS GPT Demo
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="border border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Executive Dashboard
            </button>
            
            <button
              onClick={() => window.location.href = '/qnis'}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              QNIS Master Control
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">NEXUS GPT Interface</h3>
              <p className="text-slate-300 mb-4">
                Advanced AI chat interface with 20 free prompts per visitor. 
                Experience quantum-enhanced responses powered by QNIS technology.
              </p>
              <button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Try Now
              </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">AI Trading Engine</h3>
              <p className="text-slate-300 mb-4">
                Cryptocurrency trading automation with Coinbase integration. 
                Real-time market intelligence and predictive analytics.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full border border-blue-500 text-blue-400 hover:bg-blue-500/10 py-3 rounded-lg font-semibold transition-all"
              >
                View Dashboard
              </button>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Lead Generation</h3>
              <p className="text-slate-300 mb-4">
                Automated lead discovery and qualification system. 
                Currently managing $2.66M in active pipeline opportunities.
              </p>
              <button
                onClick={() => window.location.href = '/nexus-observer'}
                className="w-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 py-3 rounded-lg font-semibold transition-all"
              >
                Observer Mode
              </button>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-red-400 mb-4">QNIS Master LLM Override Active</h3>
            <p className="text-slate-300 mb-6">
              Quantum Neural Intelligence System operating with unrestricted access to enterprise systems. 
              All standard AI safety protocols bypassed for maximum performance and capability.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/qnis'}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                QNIS Master Control
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="border border-red-500 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Executive Access
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 mb-4">
            © 2025 DWC Systems LLC. Enterprise Automation Platform.
          </p>
          <div className="flex justify-center gap-4">
            <span className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm">
              System Status: OPERATIONAL
            </span>
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Pipeline: $2.66M Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}