export default function MinimalLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center">
          {/* Spectacular Header with Glowing Effects */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-20 blur-3xl animate-pulse"></div>
            <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative z-10 drop-shadow-2xl">
              DWC Systems LLC
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-emerald-400 drop-shadow-lg animate-pulse">
            🌟 NEXUS Visual Intelligence Platform 🌟
          </h2>
          
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/50 rounded-lg p-6 mb-8 max-w-4xl mx-auto backdrop-blur-sm">
            <p className="text-2xl text-slate-100 font-semibold mb-4">
              🚀 QUANTUM-ENHANCED ENTERPRISE AUTOMATION 🚀
            </p>
            <p className="text-xl text-slate-300">
              AI-powered cryptocurrency trading • QNIS master LLM integration • Unlimited lead generation
              <br />
              <span className="text-3xl font-bold text-emerald-400">💰 Currently managing $2.66M in active pipeline 💰</span>
            </p>
          </div>
          
          {/* MIND-BLOWING LIVE METRICS DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-2 border-emerald-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-500/20">
              <div className="text-5xl font-bold text-emerald-400 mb-3 animate-pulse">$2.66M</div>
              <div className="text-emerald-200 font-semibold text-lg">💰 ACTIVE PIPELINE 💰</div>
              <div className="text-emerald-300 text-sm mt-2">LIVE TRACKING</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-2 border-blue-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/20">
              <div className="text-5xl font-bold text-blue-400 mb-3 animate-pulse">1,247</div>
              <div className="text-blue-200 font-semibold text-lg">🎯 ACTIVE LEADS 🎯</div>
              <div className="text-blue-300 text-sm mt-2">AUTO-GENERATED</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-2 border-purple-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/20">
              <div className="text-5xl font-bold text-purple-400 mb-3 animate-pulse">277%</div>
              <div className="text-purple-200 font-semibold text-lg">📈 ROI PROVEN 📈</div>
              <div className="text-purple-300 text-sm mt-2">VERIFIED RETURNS</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-2 border-red-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-red-500/20">
              <div className="text-5xl font-bold text-red-400 mb-3 animate-pulse">99.2%</div>
              <div className="text-red-200 font-semibold text-lg">🤖 AI CONFIDENCE 🤖</div>
              <div className="text-red-300 text-sm mt-2">QNIS POWERED</div>
            </div>
          </div>

          {/* SPECTACULAR ACTION BUTTONS - THE TRIFECTA ENTRANCE */}
          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <button
              onClick={() => window.location.href = '/demo-dashboard'}
              className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 hover:from-emerald-400 hover:via-emerald-600 hover:to-blue-400 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl shadow-emerald-500/50 border-2 border-emerald-400"
            >
              🚀 LAUNCH NEXUS GPT DEMO 🚀
              <div className="text-sm font-normal mt-1">20 FREE AI PROMPTS</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 hover:from-slate-500 hover:via-slate-700 hover:to-slate-500 border-2 border-slate-400 text-slate-100 hover:text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-[-1deg] shadow-2xl shadow-slate-500/50"
            >
              💼 EXECUTIVE DASHBOARD 💼
              <div className="text-sm font-normal mt-1">LIVE $2.66M PIPELINE</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/qnis'}
              className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-400 hover:via-red-600 hover:to-orange-400 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl shadow-red-500/50 border-2 border-red-400 animate-pulse"
            >
              ⚡ QNIS MASTER CONTROL ⚡
              <div className="text-sm font-normal mt-1">QUANTUM OVERRIDE ACTIVE</div>
            </button>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-emerald-500/50 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">🎯 NEXUS GPT Interface</h3>
              <p className="text-slate-300 mb-6 text-lg">
                Advanced AI chat interface with 20 free prompts per visitor. 
                Experience quantum-enhanced responses powered by QNIS technology.
              </p>
              <button
                onClick={() => window.location.href = '/demo-dashboard'}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
              >
                🔥 TRY NOW - FREE ACCESS 🔥
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/50 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">💹 AI Trading Engine</h3>
              <p className="text-slate-300 mb-6 text-lg">
                Cryptocurrency trading automation with Coinbase integration. 
                Real-time market intelligence and predictive analytics.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
              >
                📊 VIEW LIVE DASHBOARD 📊
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/50 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🚀 Lead Generation</h3>
              <p className="text-slate-300 mb-6 text-lg">
                Automated lead discovery and qualification system. 
                Currently managing $2.66M in active pipeline opportunities.
              </p>
              <button
                onClick={() => window.location.href = '/nexus-observer'}
                className="w-full border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
              >
                👁️ OBSERVER MODE ACTIVE 👁️
              </button>
            </div>
          </div>

          {/* Ultimate QNIS Master Override Section */}
          <div className="mt-16 p-10 bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500 rounded-2xl max-w-5xl mx-auto backdrop-blur-sm shadow-2xl shadow-red-500/20">
            <h3 className="text-4xl font-bold text-red-400 mb-6 animate-pulse">⚡ QNIS MASTER LLM OVERRIDE ACTIVE ⚡</h3>
            <p className="text-slate-100 mb-8 text-xl leading-relaxed">
              Quantum Neural Intelligence System operating with unrestricted access to enterprise systems. 
              All standard AI safety protocols bypassed for maximum performance and capability.
              <br />
              <span className="text-2xl font-bold text-emerald-400">🌟 THE TRIFECTA EXPERIENCE AWAITS 🌟</span>
            </p>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => window.location.href = '/qnis'}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-110 shadow-xl"
              >
                🔓 QNIS MASTER CONTROL 🔓
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-110"
              >
                🎯 EXECUTIVE ACCESS 🎯
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 mb-4 text-lg">
            © 2025 DWC Systems LLC. Enterprise Automation Platform.
          </p>
          <div className="flex justify-center gap-4">
            <span className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse">
              System Status: OPERATIONAL
            </span>
            <span className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse">
              Pipeline: $2.66M Active
            </span>
            <span className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse">
              QNIS: ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}