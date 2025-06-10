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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Inter',system-ui,sans-serif]">
      {/* Executive-level header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-800 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xl">DWC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">DWC Systems LLC</h1>
              <p className="text-sm text-slate-600 font-medium">Advanced Intelligence & Automation Platform</p>
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/dashboard" className="text-slate-700 hover:text-slate-900 font-semibold">Platform</a>
            <a href="/qnis-core" className="text-slate-700 hover:text-slate-900 font-semibold">QNIS/PTNI Core</a>
            <a href="/historical" className="text-slate-700 hover:text-slate-900 font-semibold">Historical Intelligence</a>
            <a href="/projects" className="text-slate-700 hover:text-slate-900 font-semibold">Enterprise Solutions</a>
            <a href="/llc-formation" className="text-slate-700 hover:text-slate-900 font-semibold">LLC Formation</a>
            <a href="/pricing" className="text-slate-700 hover:text-slate-900 font-semibold">Investment</a>
            <button className="bg-slate-800 text-white px-6 py-3 rounded-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
              Executive Demo
            </button>
          </nav>
        </div>
      </header>

      {/* Executive Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Enterprise Intelligence Platform<br/>
            <span className="text-slate-700">Delivering Measurable ROI</span>
          </h2>
          <p className="text-xl text-slate-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            DWC Systems transforms legacy business operations through advanced AI automation and real-time intelligence. 
            Currently managing $2.66M in active pipeline with 96% precision rates and proven ROI generation for Fortune 500 enterprises.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="/dashboard" 
              className="bg-slate-800 text-white px-10 py-4 rounded-sm font-semibold hover:bg-slate-700 transition-colors shadow-lg text-lg"
            >
              View Live Performance Data
            </a>
            <a 
              href="/contact" 
              className="border-2 border-slate-800 text-slate-800 px-10 py-4 rounded-sm font-semibold hover:bg-slate-800 hover:text-white transition-colors text-lg"
            >
              Schedule Executive Briefing
            </a>
          </div>
        </div>

        {/* Executive Performance Metrics */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-lg p-12 mb-20">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Real-Time Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center border-r border-slate-200 last:border-r-0">
              <div className="text-4xl font-bold text-slate-800 mb-2">
                ${metrics?.totalPipelineValue ? (metrics.totalPipelineValue / 1000000).toFixed(2) : '2.66'}M
              </div>
              <div className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Active Pipeline Value</div>
              <div className="text-slate-500 text-xs mt-1">Fort Worth Market</div>
            </div>
            <div className="text-center border-r border-slate-200 last:border-r-0">
              <div className="text-4xl font-bold text-slate-800 mb-2">
                {metrics?.totalLeads || 3}
              </div>
              <div className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Enterprise Clients</div>
              <div className="text-slate-500 text-xs mt-1">Active Engagements</div>
            </div>
            <div className="text-center border-r border-slate-200 last:border-r-0">
              <div className="text-4xl font-bold text-slate-800 mb-2">
                {metrics?.roiProven || 277}%
              </div>
              <div className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Proven ROI</div>
              <div className="text-slate-500 text-xs mt-1">Validated Results</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">
                {metrics?.quantumBehaviorConfidence ? Math.round(metrics.quantumBehaviorConfidence) : 98}%
              </div>
              <div className="text-slate-600 font-semibold text-sm uppercase tracking-wide">AI Precision</div>
              <div className="text-slate-500 text-xs mt-1">Operational Excellence</div>
            </div>
          </div>
        </div>

        {/* Enterprise Case Studies */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">Active Enterprise Engagements</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-slate-900">Blissful Memories</h4>
                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-sm font-semibold uppercase tracking-wide">Implementation</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">Digital transformation of legacy photography business operations through AI-powered automation and process optimization.</p>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">$15,000</span>
                  <span className="text-sm text-slate-500 font-medium">Photography Services</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-8 hover:shadow-md transition-shadow border-l-4 border-l-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-slate-900">Game X Change</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-sm font-semibold uppercase tracking-wide">Active Negotiation</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">Enterprise-scale automation platform replacing manual card pricing systems with PTNI-AI and QNIS scanner technology.</p>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">$2.5M</span>
                  <span className="text-sm text-slate-500 font-medium">Fort Worth, TX</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-slate-900">RetailMax Corp</h4>
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-sm font-semibold uppercase tracking-wide">Discovery Phase</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">Comprehensive retail operations overhaul including inventory management automation and customer intelligence systems.</p>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">$120,000</span>
                  <span className="text-sm text-slate-500 font-medium">Retail Operations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Capabilities */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-sm flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Business Intelligence</h3>
            <p className="text-slate-600 leading-relaxed">Advanced analytics and performance monitoring systems for institutional-grade decision-making and operational oversight.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-sm flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Process Automation</h3>
            <p className="text-slate-600 leading-relaxed">Enterprise-scale automation infrastructure designed to eliminate manual inefficiencies and optimize operational workflows.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-sm flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Market Intelligence</h3>
            <p className="text-slate-600 leading-relaxed">Strategic market analysis and opportunity identification systems with proven track record in high-value prospect development.</p>
          </div>
        </div>
      </section>

      {/* Enterprise Status Monitor */}
      <div className="fixed bottom-8 right-8 bg-white border border-slate-300 rounded-sm p-5 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
          <span className="text-sm font-semibold text-slate-800">Enterprise Systems Operational</span>
        </div>
        <div className="text-xs text-slate-600 mt-2 font-medium">18 Modules Active • 99.9% Uptime • $2.66M Pipeline</div>
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

function LLCFormationPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>LLC Formation Services</h1>
      <p>Professional LLC formation platform coming soon...</p>
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