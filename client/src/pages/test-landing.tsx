export default function TestLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              DWC Systems LLC
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-emerald-400 animate-pulse">
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-2 border-emerald-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-emerald-400 mb-3 animate-pulse">$2.66M</div>
              <div className="text-emerald-200 font-semibold text-lg">💰 ACTIVE PIPELINE 💰</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-2 border-blue-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-blue-400 mb-3 animate-pulse">1,247</div>
              <div className="text-blue-200 font-semibold text-lg">🎯 ACTIVE LEADS 🎯</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-2 border-purple-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-purple-400 mb-3 animate-pulse">277%</div>
              <div className="text-purple-200 font-semibold text-lg">📈 ROI PROVEN 📈</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-2 border-red-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-red-400 mb-3 animate-pulse">99.2%</div>
              <div className="text-red-200 font-semibold text-lg">🤖 AI CONFIDENCE 🤖</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <button
              onClick={() => window.location.href = '/test-demo'}
              className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 hover:from-emerald-400 hover:via-emerald-600 hover:to-blue-400 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-2xl border-2 border-emerald-400"
            >
              🚀 LAUNCH NEXUS GPT DEMO 🚀
            </button>
            
            <button
              onClick={() => window.location.href = '/test-dashboard'}
              className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 hover:from-slate-500 hover:via-slate-700 hover:to-slate-500 border-2 border-slate-400 text-slate-100 hover:text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-2xl"
            >
              💼 EXECUTIVE DASHBOARD 💼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}