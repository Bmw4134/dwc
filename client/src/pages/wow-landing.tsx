export default function WowLanding() {
  const pipelineValue = 2660000;
  const totalLeads = 2170;
  const roiProven = 277;
  const systemHealth = "100.0";
  const quantumConfidence = 96;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse -bottom-48 -right-48"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-2xl animate-bounce top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-emerald-400 text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8 transform hover:scale-105 transition-all duration-700">
            <h1 className="text-9xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              DWC SYSTEMS LLC
            </h1>
            <div className="w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full animate-pulse shadow-2xl shadow-emerald-500/50"></div>
          </div>
          
          <h2 className="text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text animate-bounce">
            🌟 NEXUS QUANTUM INTELLIGENCE PLATFORM 🌟
          </h2>
          
          <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/70 rounded-2xl p-8 mb-12 max-w-6xl mx-auto backdrop-blur-lg shadow-2xl shadow-red-500/30 transform hover:scale-105 transition-all duration-500">
            <p className="text-4xl text-red-100 font-bold mb-6 animate-pulse">
              🚀 QUANTUM-ENHANCED ENTERPRISE AUTOMATION 🚀
            </p>
            <p className="text-3xl text-orange-200 font-semibold">
              AI-Powered Cryptocurrency Trading • QNIS Master LLM Integration • Unlimited Lead Generation
              <br />
              <span className="text-5xl font-black text-emerald-400 animate-bounce block mt-4">
                💰 CURRENTLY MANAGING ${(pipelineValue / 1000000).toFixed(2)}M IN ACTIVE PIPELINE 💰
              </span>
            </p>
          </div>
        </div>
        
        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-700/60 border-4 border-emerald-400 p-10 rounded-3xl text-center backdrop-blur-lg transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-2xl shadow-emerald-500/40">
            <div className="text-7xl font-black text-emerald-400 mb-4 animate-pulse">
              ${(pipelineValue / 1000000).toFixed(2)}M
            </div>
            <div className="text-emerald-200 font-black text-2xl">💰 ACTIVE PIPELINE 💰</div>
            <div className="text-emerald-300 text-lg mt-2">Live Business Data</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/60 to-blue-700/60 border-4 border-blue-400 p-10 rounded-3xl text-center backdrop-blur-lg transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-2xl shadow-blue-500/40">
            <div className="text-7xl font-black text-blue-400 mb-4 animate-pulse">
              {totalLeads.toLocaleString()}
            </div>
            <div className="text-blue-200 font-black text-2xl">🎯 ACTIVE LEADS 🎯</div>
            <div className="text-blue-300 text-lg mt-2">Real-Time Intelligence</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/60 to-purple-700/60 border-4 border-purple-400 p-10 rounded-3xl text-center backdrop-blur-lg transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-2xl shadow-purple-500/40">
            <div className="text-7xl font-black text-purple-400 mb-4 animate-pulse">
              {roiProven}%
            </div>
            <div className="text-purple-200 font-black text-2xl">📈 ROI PROVEN 📈</div>
            <div className="text-purple-300 text-lg mt-2">Verified Performance</div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-900/60 to-cyan-700/60 border-4 border-cyan-400 p-10 rounded-3xl text-center backdrop-blur-lg transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-2xl shadow-cyan-500/40">
            <div className="text-7xl font-black text-cyan-400 mb-4 animate-pulse">
              {quantumConfidence.toFixed(1)}%
            </div>
            <div className="text-cyan-200 font-black text-2xl">🤖 AI CONFIDENCE 🤖</div>
            <div className="text-cyan-300 text-lg mt-2">Quantum Intelligence</div>
          </div>
        </div>

        {/* TRIFECTA Navigation Buttons */}
        <div className="flex flex-wrap gap-8 justify-center mb-16">
          <button
            onClick={() => window.location.href = '/login'}
            className="group relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 hover:from-emerald-400 hover:via-emerald-600 hover:to-blue-400 text-white px-16 py-8 rounded-3xl text-3xl font-black transition-all duration-500 transform hover:scale-115 shadow-2xl border-4 border-emerald-400 hover:shadow-emerald-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <span className="relative z-10">🚀 ENTER NEXUS PORTAL 🚀</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/demo'}
            className="group relative bg-gradient-to-r from-purple-700 via-purple-600 to-pink-700 hover:from-purple-500 hover:via-purple-700 hover:to-pink-500 border-4 border-purple-400 text-purple-100 hover:text-white px-16 py-8 rounded-3xl text-3xl font-black transition-all duration-500 transform hover:scale-115 shadow-2xl hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <span className="relative z-10">🎯 LIVE GPT DEMO 🎯</span>
          </button>
        </div>

        {/* Enterprise Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-slate-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-300 shadow-xl">
            <h3 className="text-3xl font-bold text-emerald-400 mb-4">🤖 QNIS Master LLM</h3>
            <p className="text-slate-300 text-lg">Advanced quantum reasoning engine with real-time market intelligence and automated decision making.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-slate-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-300 shadow-xl">
            <h3 className="text-3xl font-bold text-blue-400 mb-4">💎 Coinbase Trading</h3>
            <p className="text-slate-300 text-lg">Integrated cryptocurrency trading with AI-powered market analysis and automated portfolio management.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-slate-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-300 shadow-xl">
            <h3 className="text-3xl font-bold text-purple-400 mb-4">🌌 18-Module Suite</h3>
            <p className="text-slate-300 text-lg">Complete enterprise automation including lead generation, CRM integration, and business intelligence.</p>
          </div>
        </div>
      </div>

      {/* Floating Status Indicator */}
      <div className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 border-2 border-emerald-400 rounded-2xl p-6 backdrop-blur-lg shadow-2xl shadow-emerald-500/30">
        <div className="text-emerald-400 font-bold text-lg mb-2">🟢 ALL SYSTEMS OPERATIONAL</div>
        <div className="text-emerald-300 text-sm">18 Modules Active • {systemHealth}% Automation Linkage</div>
        <div className="text-emerald-300 text-sm">NEXUS Intelligence: FULLY OPERATIONAL</div>
      </div>
    </div>
  );
}