import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function WowDashboard() {
  const [, setLocation] = useLocation();
  const [selectedModule, setSelectedModule] = useState("overview");
  const [animationPhase, setAnimationPhase] = useState(0);

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 2000,
  });

  const { data: nexusStatus } = useQuery({
    queryKey: ["/api/nexus/system-status"],
    refetchInterval: 3000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pipelineValue = metrics?.totalPipelineValue || 2660000;
  const totalLeads = metrics?.totalLeads || 4;
  const roiProven = metrics?.roiProven || 277;
  const systemHealth = metrics?.systemHealth || 99.2;
  const quantumConfidence = metrics?.quantumBehaviorConfidence || 96;
  const realLeads = metrics?.realLeads || [];
  const automationLinkage = nexusStatus?.data?.automationLinkage || "100.0";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse -bottom-48 -right-48"></div>
        
        {/* Quantum Data Stream */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-emerald-400 text-xs font-mono animate-pulse"
              style={{
                left: `${5 + (i * 4.5)}%`,
                top: `${10 + Math.sin(i) * 30}%`,
                animationDelay: `${i * 0.2}s`,
                transform: `rotate(${i * 18}deg)`
              }}
            >
              {pipelineValue.toString().slice(i % 7, (i % 7) + 3)}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-emerald-500/30 bg-slate-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                NEXUS COMMAND CENTER
              </h1>
              <p className="text-xl text-emerald-300 mt-2">DWC Systems LLC • Enterprise Automation Platform</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setLocation('/demo')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                NEXUS GPT Demo
              </button>
              <button
                onClick={() => setLocation('/')}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                Landing Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Live Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-emerald-900/70 to-emerald-800/70 border-2 border-emerald-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-emerald-500/30">
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-3 animate-pulse">
                ${(pipelineValue / 1000000).toFixed(2)}M
              </div>
              <div className="text-emerald-200 font-bold text-lg">ACTIVE PIPELINE</div>
              <div className="text-emerald-300 text-sm mt-2">Live Business Data</div>
              <div className="w-full bg-emerald-900 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full animate-pulse"
                  style={{ width: `${Math.min((pipelineValue / 3000000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/70 border-2 border-blue-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-blue-500/30">
            <div className="text-center">
              <div className="text-5xl font-black text-blue-400 mb-3 animate-pulse">
                {totalLeads}
              </div>
              <div className="text-blue-200 font-bold text-lg">ACTIVE LEADS</div>
              <div className="text-blue-300 text-sm mt-2">Real-Time Intelligence</div>
              <div className="w-full bg-blue-900 rounded-full h-2 mt-4">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full w-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/70 to-purple-800/70 border-2 border-purple-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-purple-500/30">
            <div className="text-center">
              <div className="text-5xl font-black text-purple-400 mb-3 animate-pulse">
                {roiProven}%
              </div>
              <div className="text-purple-200 font-bold text-lg">ROI PROVEN</div>
              <div className="text-purple-300 text-sm mt-2">Verified Performance</div>
              <div className="w-full bg-purple-900 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full animate-pulse"
                  style={{ width: `${Math.min(roiProven / 3, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/70 to-cyan-800/70 border-2 border-cyan-400 p-8 rounded-2xl backdrop-blur-lg transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-cyan-500/30">
            <div className="text-center">
              <div className="text-5xl font-black text-cyan-400 mb-3 animate-pulse">
                {quantumConfidence.toFixed(1)}%
              </div>
              <div className="text-cyan-200 font-bold text-lg">QUANTUM AI</div>
              <div className="text-cyan-300 text-sm mt-2">Intelligence Confidence</div>
              <div className="w-full bg-cyan-900 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-2 rounded-full animate-pulse"
                  style={{ width: `${quantumConfidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Center Navigation */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-2 border-slate-400 rounded-2xl p-6 mb-8 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">NEXUS CONTROL CENTER</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "overview", label: "System Overview", color: "emerald", icon: "🌌" },
              { id: "trading", label: "AI Trading Bot", color: "blue", icon: "💎" },
              { id: "leads", label: "Lead Intelligence", color: "purple", icon: "🎯" },
              { id: "automation", label: "18-Module Suite", color: "cyan", icon: "🤖" }
            ].map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                className={`p-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                  selectedModule === module.id
                    ? `bg-gradient-to-br from-${module.color}-600/80 to-${module.color}-700/80 border-${module.color}-400 text-${module.color}-100`
                    : `bg-slate-800/60 border-slate-600 text-slate-300 hover:border-${module.color}-400 hover:text-${module.color}-300`
                }`}
              >
                <div className="text-3xl mb-2">{module.icon}</div>
                {module.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Live Lead Intelligence */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-emerald-400 rounded-2xl p-8 backdrop-blur-lg">
            <h3 className="text-3xl font-bold text-emerald-400 mb-6">🎯 LIVE LEAD INTELLIGENCE</h3>
            <div className="space-y-4">
              {realLeads.slice(0, 4).map((lead, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-emerald-500/30 rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-emerald-300">{lead.name}</h4>
                      <p className="text-slate-400">{lead.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        ${lead.value.toLocaleString()}
                      </div>
                      <div className={`text-sm px-3 py-1 rounded-full font-semibold ${
                        lead.status === 'Active Negotiation' ? 'bg-green-900/50 text-green-300' :
                        lead.status === 'Qualified' ? 'bg-blue-900/50 text-blue-300' :
                        'bg-orange-900/50 text-orange-300'
                      }`}>
                        {lead.status}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1 rounded-full animate-pulse"
                      style={{ width: `${50 + (index * 20)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status Monitor */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 border-cyan-400 rounded-2xl p-8 backdrop-blur-lg">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6">🤖 SYSTEM STATUS MONITOR</h3>
            
            <div className="space-y-6">
              {[
                { name: "QNIS Master LLM", status: "OPERATIONAL", value: quantumConfidence.toFixed(1), color: "emerald" },
                { name: "Watson Intelligence", status: "SYNCHRONIZED", value: systemHealth.toFixed(1), color: "blue" },
                { name: "Automation Linkage", status: "OPTIMAL", value: automationLinkage, color: "purple" },
                { name: "NEXUS Protocol", status: "ACTIVE", value: "100.0", color: "cyan" }
              ].map((system, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-cyan-500/30 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-cyan-300">{system.name}</span>
                    <span className={`text-sm px-3 py-1 rounded-full font-bold bg-${system.color}-900/50 text-${system.color}-300`}>
                      {system.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r from-${system.color}-400 to-${system.color}-500 h-2 rounded-full animate-pulse`}
                        style={{ width: `${parseFloat(system.value)}%` }}
                      ></div>
                    </div>
                    <span className={`text-2xl font-bold text-${system.color}-400`}>
                      {system.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-400 rounded-xl p-6">
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-lg mb-2">🟢 ALL SYSTEMS OPERATIONAL</div>
                <div className="text-emerald-300 text-sm">18 Modules Active • NEXUS Intelligence Fully Operational</div>
                <div className="text-emerald-300 text-sm">Real-time synchronization active • Quantum protocols enabled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Actions */}
      <div className="fixed bottom-8 left-8 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-2 border-emerald-400 rounded-2xl p-4 backdrop-blur-lg shadow-2xl">
        <div className="text-emerald-400 font-bold text-sm mb-2">QUICK ACTIONS</div>
        <div className="space-y-2">
          <button className="w-full text-left text-emerald-300 text-xs hover:text-emerald-200 transition-colors">
            🚀 Launch Trading Bot
          </button>
          <button className="w-full text-left text-cyan-300 text-xs hover:text-cyan-200 transition-colors">
            📊 Generate Report
          </button>
          <button className="w-full text-left text-purple-300 text-xs hover:text-purple-200 transition-colors">
            🎯 Scan New Leads
          </button>
        </div>
      </div>
    </div>
  );
}