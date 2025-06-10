import { useState, useEffect } from "react";
import { Switch, Route, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { QuantumDataFlow } from "./components/QuantumDataFlow";
import { QuantumMetrics } from "./components/QuantumMetrics";

interface DashboardMetrics {
  totalLeads: number;
  activeProposals: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  automationLinkage: number;
  quantumBehaviorConfidence: number;
  lastUpdated: string;
  realLeads: Array<{
    name: string;
    value: number;
    status: string;
    industry: string;
  }>;
}

function LandingPage() {
  const { data: metrics, isLoading, error } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard-metrics'],
    refetchInterval: 5000,
  });

  // Handle loading state with quantum animations
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="quantum-loader mx-auto mb-6"></div>
          <div className="space-y-3">
            <div className="quantum-skeleton h-4 w-48 mx-auto rounded"></div>
            <div className="quantum-skeleton h-3 w-32 mx-auto rounded"></div>
          </div>
          <p className="text-emerald-300 mt-6 font-semibold animate-quantum-pulse">
            Initializing QNIS/PTNI Intelligence Platform...
          </p>
          {/* Quantum loading particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-quantum-float"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-data-flow"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-quantum-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-data-flow" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Connection Error</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white font-['Inter',system-ui,sans-serif] relative overflow-hidden">
      {/* Quantum animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-quantum-float"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-data-flow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-quantum-float" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-data-flow" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-quantum-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-emerald-300 rounded-full animate-data-flow" style={{animationDelay: '2.2s'}}></div>
        </div>
      </div>

      {/* Premium header with glass morphism */}
      <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative animate-stagger-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div className="animate-stagger-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                QNIS/PTNI <span className="text-emerald-400">Intelligence</span>
              </h1>
              <p className="text-sm text-emerald-300 font-bold mt-1">Quantum Neural • Pattern Recognition • AI Supremacy</p>
            </div>
          </div>
          <nav className="flex items-center space-x-8 animate-stagger-3">
            <Link href="/dashboard" className="text-white hover:text-emerald-400 font-bold transition-all duration-300 hover:scale-105">
              Dashboard
            </Link>
            <Link href="/qnis-core" className="text-white hover:text-cyan-400 font-bold transition-all duration-300 hover:scale-105">
              QNIS Core
            </Link>
            <Link href="/historical" className="text-white hover:text-purple-400 font-bold transition-all duration-300 hover:scale-105">
              Historical Intel
            </Link>
            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-black text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:from-emerald-400 hover:to-cyan-400">
              Neural Access
            </button>
          </nav>
        </div>
      </header>

      {/* Executive Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-7xl font-black text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                QNIS/PTNI
              </span>
              <br/>
              <span className="text-white text-6xl">Intelligence Supremacy</span>
            </h2>
            <p className="text-2xl text-emerald-300 mb-6 max-w-5xl mx-auto leading-relaxed font-bold">
              Quantum Neural Intelligence System • Pattern Recognition Neural Intelligence
            </p>
            <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Advanced AI consulting platform delivering enterprise-grade quantum intelligence solutions with proven ROI metrics and autonomous neural processing capabilities.
            </p>
            <div className="flex justify-center space-x-6">
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-4 rounded-2xl text-xl font-black shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 animate-stagger-1">
                Deploy Intelligence
              </button>
              <button className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-10 py-4 rounded-2xl text-xl font-black shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-stagger-2">
                Neural Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Quantum Data Flow Visualization */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="relative z-10">
            <QuantumDataFlow />
          </div>
        </div>

        {/* Live Intelligence Metrics */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-white mb-12 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Live Intelligence Metrics
            </h3>
            <QuantumMetrics
              totalLeads={metrics?.totalLeads || 3}
              systemHealth={metrics?.systemHealth || 98.5}
              roiProven={metrics?.roiProven || 277}
              automationLinkage={metrics?.automationLinkage || 100}
            />
          </div>
        </div>

        {/* Elite Case Studies */}
        <div className="mb-20">
          <h3 className="text-5xl font-black text-white mb-12 text-center bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Elite Intelligence Engagements
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-amber-500/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-3xl group-hover:from-amber-400/10 group-hover:to-orange-400/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black text-amber-300">Blissful Memories</h4>
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-amber-100 text-lg mb-6 leading-relaxed font-medium">$750K+ photography enterprise automation with quantum lead processing and AI-driven client acquisition systems.</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-amber-300">+340% ROI</span>
                  <span className="text-amber-200 font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-emerald-500/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-3xl group-hover:from-emerald-400/10 group-hover:to-teal-400/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black text-emerald-300">Quantum Trades</h4>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-emerald-100 text-lg mb-6 leading-relaxed font-medium">Automated trading intelligence with real-time market analysis and high-frequency quantum decision algorithms.</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-emerald-300">+580% ROI</span>
                  <span className="text-emerald-200 font-bold">SCALING</span>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-purple-500/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-400/5 rounded-3xl group-hover:from-purple-400/10 group-hover:to-indigo-400/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black text-purple-300">Neural Consulting</h4>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-purple-100 text-lg mb-6 leading-relaxed font-medium">Enterprise neural network deployment with autonomous consulting frameworks and AI-driven strategic planning.</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-purple-300">+420% ROI</span>
                  <span className="text-purple-200 font-bold">DEPLOYED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Capabilities */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-cyan-500/50 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-3xl group-hover:from-cyan-400/10 group-hover:to-blue-400/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="relative mb-6">
                <svg className="w-16 h-16 text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-black text-cyan-400 mb-4">Quantum Processing</h3>
              <p className="text-cyan-100 text-lg leading-relaxed font-medium">Advanced quantum neural networks with real-time pattern recognition and autonomous decision-making capabilities.</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-emerald-500/50 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-400/5 rounded-3xl group-hover:from-emerald-400/10 group-hover:to-green-400/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="relative mb-6">
                <svg className="w-16 h-16 text-emerald-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-black text-emerald-400 mb-4">Neural Automation</h3>
              <p className="text-emerald-100 text-lg leading-relaxed font-medium">Autonomous business process automation with AI-driven optimization and predictive scaling mechanisms.</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-purple-500/50 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-3xl group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="relative mb-6">
                <svg className="w-16 h-16 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-black text-purple-400 mb-4">Neural Market Intelligence</h3>
              <p className="text-purple-100 text-lg leading-relaxed font-medium">Advanced quantum analytics for strategic market domination and high-value prospect identification systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Status Monitor */}
      <div className="fixed bottom-8 right-8 bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-xl border border-emerald-400/50 rounded-2xl p-6 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-lg font-black text-emerald-400">QNIS/PTNI OPERATIONAL</span>
        </div>
        <div className="text-sm text-emerald-300 mt-3 font-bold">
          18 Neural Modules Active • 98%+ Precision • $2.66M Pipeline • 277% ROI
        </div>
        <div className="text-xs text-cyan-300 mt-1 font-medium">
          Quantum Intelligence Supremacy Maintained
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/projects" component={TrelloCanvas} />
      <Route path="/pricing" component={SubscriptionPlans} />
      <Route path="/dashboard" component={LandingPage} />
      <Route path="/qnis-core" component={QNISPTNICore} />
      <Route path="/historical" component={HistoricalIntelligence} />
      <Route path="/llc-formation" component={LLCFormationPage} />
      <Route>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Page Not Found</p>
            <Link href="/" style={{ 
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function LLCSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">LLC Formation Complete!</h1>
          <p className="text-xl text-gray-600 mb-8">Your business entity has been successfully registered and is ready for operations.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 p-6 rounded-xl">
              <h3 className="font-bold text-emerald-800 mb-2">Entity Status</h3>
              <p className="text-emerald-600">Active & Compliant</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-bold text-blue-800 mb-2">EIN Issued</h3>
              <p className="text-blue-600">Tax ID Ready</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="font-bold text-purple-800 mb-2">Banking Ready</h3>
              <p className="text-purple-600">Docs Prepared</p>
            </div>
          </div>
          <Link href="/" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
            Access Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return <LandingPage />;
}

// Placeholder components for routes
function TrelloCanvas() {
  return <div className="p-8">Trello Canvas Component</div>;
}

function SubscriptionPlans() {
  return <div className="p-8">Subscription Plans Component</div>;
}

function QNISPTNICore() {
  return <div className="p-8">QNIS/PTNI Core Component</div>;
}

function HistoricalIntelligence() {
  return <div className="p-8">Historical Intelligence Component</div>;
}

function LLCFormationPage() {
  return <div className="p-8">LLC Formation Component</div>;
}

function App() {
  return <Router />;
}

export default App;