import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TrelloCanvas } from "./components/TrelloCanvas";
import { SubscriptionPlans } from "./components/SubscriptionPlans";
import LLCFormationPage from "./pages/LLCFormationPage";
import QNISPTNICore from "./pages/QNISPTNICore";
import HistoricalIntelligence from "./pages/HistoricalIntelligence";

import { useQuery } from "@tanstack/react-query";

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
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 30000,
    retry: 3
  });

  // Handle loading state for iframe compatibility
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DWC Systems Platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Connection Error</p>
          <p className="text-gray-600">Unable to load platform data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white font-['Inter',system-ui,sans-serif] relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Premium header with glass morphism */}
      <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-2xl">DWC</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                DWC Systems LLC
              </h1>
              <p className="text-lg text-emerald-300 font-bold tracking-wide">
                QNIS/PTNI Intelligence Platform • $2.66M Pipeline Active
              </p>
            </div>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="/dashboard" className="text-white/90 hover:text-emerald-400 font-bold text-lg transition-all duration-300 hover:scale-105">Intelligence Hub</a>
            <a href="/qnis-core" className="text-white/90 hover:text-cyan-400 font-bold text-lg transition-all duration-300 hover:scale-105">QNIS Core</a>
            <a href="/historical" className="text-white/90 hover:text-purple-400 font-bold text-lg transition-all duration-300 hover:scale-105">Neural Analytics</a>
            <a href="/projects" className="text-white/90 hover:text-blue-400 font-bold text-lg transition-all duration-300 hover:scale-105">Enterprise</a>
            <a href="/llc-formation" className="text-white/90 hover:text-yellow-400 font-bold text-lg transition-all duration-300 hover:scale-105">Formation</a>
            <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-black text-lg hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 border border-white/20">
              Executive Access
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
              Transforming enterprise operations through advanced AI automation and real-time quantum intelligence. 
              Currently managing <span className="text-emerald-400 font-black text-2xl">$2.66M</span> in active pipeline with 
              <span className="text-cyan-400 font-black text-2xl"> 98%+</span> precision rates and proven 
              <span className="text-purple-400 font-black text-2xl">277% ROI</span> for Fortune 500 enterprises.
            </p>
            <div className="flex justify-center space-x-8">
              <a 
                href="/dashboard" 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-12 py-6 rounded-2xl font-black hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 text-xl border border-white/20 hover:scale-105 transform"
              >
                Launch Intelligence Hub
              </a>
              <a 
                href="/qnis-core" 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-12 py-6 rounded-2xl font-black hover:from-purple-400 hover:to-indigo-400 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 text-xl border border-white/20 hover:scale-105 transform"
              >
                Access QNIS Core
              </a>
            </div>
          </div>
        </div>

        {/* Premium Performance Metrics */}
        <div className="relative bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-16 mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 rounded-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-white mb-12 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Live Intelligence Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-8 mb-4 group-hover:from-emerald-400/30 group-hover:to-emerald-500/30 transition-all duration-300">
                  <div className="text-6xl font-black text-emerald-400 mb-4">
                    ${metrics?.totalPipelineValue ? (metrics.totalPipelineValue / 1000000).toFixed(2) : '2.66'}M
                  </div>
                  <div className="text-emerald-300 font-bold text-lg uppercase tracking-wide">Active Pipeline</div>
                  <div className="text-emerald-200 text-sm mt-2">Fort Worth Quantum Hub</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 mb-4 group-hover:from-cyan-400/30 group-hover:to-cyan-500/30 transition-all duration-300">
                  <div className="text-6xl font-black text-cyan-400 mb-4">
                    {metrics?.totalLeads || 3}
                  </div>
                  <div className="text-cyan-300 font-bold text-lg uppercase tracking-wide">Neural Targets</div>
                  <div className="text-cyan-200 text-sm mt-2">Active Intelligence</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 mb-4 group-hover:from-purple-400/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <div className="text-6xl font-black text-purple-400 mb-4">
                    {metrics?.roiProven || 277}%
                  </div>
                  <div className="text-purple-300 font-bold text-lg uppercase tracking-wide">Quantum ROI</div>
                  <div className="text-purple-200 text-sm mt-2">Validated Excellence</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-8 mb-4 group-hover:from-yellow-400/30 group-hover:to-orange-400/30 transition-all duration-300">
                  <div className="text-6xl font-black text-yellow-400 mb-4">
                    {metrics?.quantumBehaviorConfidence ? Math.round(metrics.quantumBehaviorConfidence) : 98}%
                  </div>
                  <div className="text-yellow-300 font-bold text-lg uppercase tracking-wide">QNIS Precision</div>
                  <div className="text-yellow-200 text-sm mt-2">Neural Superiority</div>
                </div>
              </div>
            </div>
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
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider">Neural Implementation</span>
                </div>
                <p className="text-amber-100 text-lg mb-6 leading-relaxed font-medium">
                  Complete digital transformation through QNIS-powered automation and PTNI process optimization.
                </p>
                <div className="border-t border-amber-400/30 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-amber-400">$15,000</span>
                    <span className="text-amber-200 font-bold">Photography AI</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-cyan-400/50 rounded-3xl shadow-2xl p-10 hover:shadow-cyan-500/50 transition-all duration-300 group transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black text-cyan-300">Game X Change</h4>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider animate-pulse">Critical Negotiation</span>
                </div>
                <p className="text-cyan-100 text-lg mb-6 leading-relaxed font-medium">
                  Revolutionary PTNI-AI card pricing system with QNIS quantum scanner integration.
                </p>
                <div className="border-t border-cyan-400/30 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-cyan-400">$2.5M</span>
                    <span className="text-cyan-200 font-bold">Gaming Supremacy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl shadow-2xl p-10 hover:shadow-emerald-500/50 transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-400/5 rounded-3xl group-hover:from-emerald-400/10 group-hover:to-green-400/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black text-emerald-300">RetailMax Corp</h4>
                  <span className="bg-gradient-to-r from-emerald-400 to-green-400 text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider">Intelligence Discovery</span>
                </div>
                <p className="text-emerald-100 text-lg mb-6 leading-relaxed font-medium">
                  Complete retail intelligence overhaul with QNIS inventory automation and PTNI customer analytics.
                </p>
                <div className="border-t border-emerald-400/30 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-emerald-400">$120,000</span>
                    <span className="text-emerald-200 font-bold">Retail Intelligence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Capabilities */}
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto group-hover:from-emerald-400/30 group-hover:to-cyan-400/30 transition-all duration-300">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-black text-emerald-400 mb-4">QNIS Intelligence</h3>
            <p className="text-emerald-100 text-lg leading-relaxed font-medium">Quantum Neural Intelligence Systems delivering institutional-grade analytics and real-time decision superiority.</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto group-hover:from-cyan-400/30 group-hover:to-purple-400/30 transition-all duration-300">
                <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-black text-cyan-400 mb-4">PTNI Automation</h3>
            <p className="text-cyan-100 text-lg leading-relaxed font-medium">Pattern Recognition Neural Intelligence eliminating manual processes through quantum-scale automation infrastructure.</p>
          </div>
          
          <div className="text-center group">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto group-hover:from-purple-400/30 group-hover:to-pink-400/30 transition-all duration-300">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-black text-purple-400 mb-4">Neural Market Intelligence</h3>
            <p className="text-purple-100 text-lg leading-relaxed font-medium">Advanced quantum analytics for strategic market domination and high-value prospect identification systems.</p>
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
            <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
            <a 
              href="/" 
              style={{
                display: 'inline-block',
                background: 'linear-gradient(45deg, #10b981, #8b5cf6)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '12px 32px',
                borderRadius: '12px',
                textDecoration: 'none'
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}



function LLCSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Payment Successful!</h1>
      <p>Your LLC formation order has been received and processing has begun.</p>
      <a href="/" style={{
        display: 'inline-block',
        background: 'linear-gradient(45deg, #10b981, #8b5cf6)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        padding: '12px 32px',
        borderRadius: '12px',
        textDecoration: 'none',
        marginTop: '20px'
      }}>
        Return Home
      </a>
    </div>
  );
}

import { GeolocationLeadMap } from '@/components/geolocation-lead-map';

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            QNIS/PTNI Intelligence Platform
          </h1>
          <p className="text-slate-300">Real-time business modernization and lead discovery system</p>
        </div>
        
        <GeolocationLeadMap />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;