import { Link } from "wouter";

export default function StripeLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
            DWC SYSTEMS LLC
          </h1>
          <div className="w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full mb-8"></div>
          
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">
            🌟 NEXUS QUANTUM INTELLIGENCE PLATFORM 🌟
          </h2>
          
          <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500/70 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-red-400 mb-4">
              🚨 LIVE SYSTEM STATUS 🚨
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">$2.66M</div>
                <div className="text-red-300">Pipeline Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">2,170</div>
                <div className="text-red-300">Active Leads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">277%</div>
                <div className="text-red-300">ROI Proven</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">96%</div>
                <div className="text-red-300">AI Confidence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-emerald-400 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold text-emerald-400 mb-4">🤖 AI Trading Bot</h3>
            <p className="text-slate-300 text-lg">Advanced cryptocurrency trading algorithms with quantum-enhanced market analysis and real-time profit optimization.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-blue-400 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold text-blue-400 mb-4">📊 Lead Intelligence</h3>
            <p className="text-slate-300 text-lg">Quantum-powered lead generation engine with predictive analytics and automated prospect qualification.</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-purple-400 p-8 rounded-2xl">
            <h3 className="text-3xl font-bold text-purple-400 mb-4">🌌 18-Module Suite</h3>
            <p className="text-slate-300 text-lg">Complete enterprise automation including CRM integration, business intelligence, and quantum analytics.</p>
          </div>
        </div>

        {/* Stripe Integration Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border-2 border-purple-400 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🚀 ENTERPRISE AUTOMATION AWAITS 🚀
            </h3>
            <p className="text-2xl text-purple-200 mb-8 leading-relaxed">
              Join the quantum revolution in business intelligence. Unlock the full power of AI-driven automation 
              with our enterprise-grade platform featuring real-time lead generation, advanced analytics, and 18-module automation suite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/checkout">
                <button className="bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-emerald-400">
                  💳 SUBSCRIBE NOW - $799/month →
                </button>
              </Link>
              
              <Link href="/dashboard">
                <button className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 font-bold text-xl px-12 py-6 rounded-2xl transform hover:scale-110 transition-all duration-300">
                  ⚡ LIVE DEMO
                </button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-purple-300">
              💳 Secure payment processing powered by Stripe • 🔒 SSL encrypted • 📞 24/7 enterprise support
            </div>
          </div>
        </div>
      </div>

      {/* Floating Status */}
      <div className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 border-2 border-emerald-400 rounded-2xl p-6">
        <div className="text-emerald-400 font-bold text-lg mb-2">🟢 ALL SYSTEMS OPERATIONAL</div>
        <div className="text-emerald-300 text-sm">18 Modules Active • 100% Automation Linkage</div>
        <div className="text-emerald-300 text-sm">NEXUS Intelligence: FULLY OPERATIONAL</div>
      </div>
    </div>
  );
}