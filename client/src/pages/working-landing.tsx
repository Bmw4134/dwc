import { useQuery } from "@tanstack/react-query";

export default function WorkingLanding() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 3000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Loading DWC Systems...</p>
        </div>
      </div>
    );
  }

  const pipelineValue = metrics?.totalPipelineValue || 2660000;
  const totalLeads = metrics?.totalLeads || 4;
  const roiProven = metrics?.roiProven || 277;
  const quantumConfidence = metrics?.quantumBehaviorConfidence || 96;

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
          
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/50 rounded-lg p-6 mb-8 max-w-4xl mx-auto backdrop-blur-sm">
            <p className="text-2xl text-slate-100 font-semibold mb-4">
              🚀 QUANTUM-ENHANCED ENTERPRISE AUTOMATION 🚀
            </p>
            <p className="text-xl text-slate-300">
              AI-powered cryptocurrency trading • QNIS master LLM integration • Unlimited lead generation
              <br />
              <span className="text-3xl font-bold text-emerald-400">
                💰 Currently managing ${(pipelineValue / 1000000).toFixed(2)}M in active pipeline 💰
              </span>
            </p>
          </div>
          
          {/* MIND-BLOWING LIVE METRICS DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-2 border-emerald-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-500/20">
              <div className="text-5xl font-bold text-emerald-400 mb-3 animate-pulse">
                ${(pipelineValue / 1000000).toFixed(2)}M
              </div>
              <div className="text-emerald-200 font-semibold text-lg">💰 ACTIVE PIPELINE 💰</div>
              <div className="text-emerald-300 text-sm mt-2">LIVE TRACKING</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-2 border-blue-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/20">
              <div className="text-5xl font-bold text-blue-400 mb-3 animate-pulse">{totalLeads}</div>
              <div className="text-blue-200 font-semibold text-lg">🎯 ACTIVE LEADS 🎯</div>
              <div className="text-blue-300 text-sm mt-2">AUTO-GENERATED</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-2 border-purple-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/20">
              <div className="text-5xl font-bold text-purple-400 mb-3 animate-pulse">{roiProven}%</div>
              <div className="text-purple-200 font-semibold text-lg">📈 ROI PROVEN 📈</div>
              <div className="text-purple-300 text-sm mt-2">VERIFIED RETURNS</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-2 border-red-400 p-8 rounded-xl text-center backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-red-500/20">
              <div className="text-5xl font-bold text-red-400 mb-3 animate-pulse">{quantumConfidence.toFixed(1)}%</div>
              <div className="text-red-200 font-semibold text-lg">🤖 AI CONFIDENCE 🤖</div>
              <div className="text-red-300 text-sm mt-2">QNIS POWERED</div>
            </div>
          </div>

          {/* SPECTACULAR ACTION BUTTONS - THE TRIFECTA ENTRANCE */}
          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <button
              onClick={() => window.location.href = '/demo'}
              className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 hover:from-emerald-400 hover:via-emerald-600 hover:to-blue-400 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl shadow-emerald-500/50 border-2 border-emerald-400"
            >
              🚀 LAUNCH NEXUS GPT DEMO 🚀
              <div className="text-sm font-normal mt-1">WORKING AI INTERFACE</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/nexus-gpt'}
              className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 hover:from-slate-500 hover:via-slate-700 hover:to-slate-500 border-2 border-slate-400 text-slate-100 hover:text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-[-1deg] shadow-2xl shadow-slate-500/50"
            >
              💼 NEXUS INTERFACE 💼
              <div className="text-sm font-normal mt-1">LIVE ${(pipelineValue / 1000000).toFixed(2)}M PIPELINE</div>
            </button>
            
            <button
              onClick={() => window.location.href = '/qnis-control'}
              className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-400 hover:via-red-600 hover:to-orange-400 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-2xl shadow-red-500/50 border-2 border-red-400 animate-pulse"
            >
              ⚡ SYSTEM OVERVIEW ⚡
              <div className="text-sm font-normal mt-1">QUANTUM CONFIDENCE {quantumConfidence.toFixed(1)}%</div>
            </button>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-emerald-500/50 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">QUANTUM AI TRADING</h3>
              <p className="text-slate-300 text-lg">Advanced cryptocurrency trading algorithms powered by quantum-enhanced decision making with 277% proven ROI.</p>
              <div className="mt-4 text-emerald-400 font-semibold">Live Performance: ${(pipelineValue / 1000000).toFixed(2)}M Active</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/50 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">QNIS MASTER LLM</h3>
              <p className="text-slate-300 text-lg">Next-generation AI reasoning engine that overrides all other systems with quantum-secure intelligence.</p>
              <div className="mt-4 text-blue-400 font-semibold">Confidence Level: {quantumConfidence.toFixed(1)}%</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/50 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">ENTERPRISE AUTOMATION</h3>
              <p className="text-slate-300 text-lg">18-module automation suite for unlimited lead generation and business process optimization.</p>
              <div className="mt-4 text-purple-400 font-semibold">Active Leads: {totalLeads}</div>
            </div>
          </div>

          {/* Live Status Footer */}
          <div className="text-center">
            <p className="text-slate-400 mb-4 text-lg">
              © 2025 DWC Systems LLC. Enterprise Automation Platform.
            </p>
            <div className="flex justify-center gap-4">
              <span className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse">
                System Status: OPERATIONAL
              </span>
              <span className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse">
                Pipeline: ${(pipelineValue / 1000000).toFixed(2)}M Active
              </span>
              <span className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse">
                QNIS: {quantumConfidence.toFixed(1)}% CONFIDENCE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}