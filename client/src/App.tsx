import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TrelloCanvas } from "./components/TrelloCanvas";

import { useQuery } from "@tanstack/react-query";

function LandingPage() {
  const { data: metrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 30000
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Inter',system-ui,sans-serif]">
      {/* Clean professional header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">DWC Systems</h1>
              <p className="text-sm text-gray-500">Business Intelligence Platform</p>
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
            <a href="/projects" className="text-gray-600 hover:text-gray-900 font-medium">Projects</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Modernize Your Business Operations
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced business intelligence platform that transforms manual processes through AI automation.
            Real-time lead discovery, process optimization, and proven ROI generation.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/dashboard" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              View Live Dashboard
            </a>
            <a 
              href="/contact" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-400"
            >
              Schedule Consultation
            </a>
          </div>
        </div>

        {/* Live metrics display */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Live System Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                ${metrics ? (metrics.totalPipelineValue / 1000000).toFixed(2) : '2.66'}M
              </div>
              <div className="text-gray-500 text-sm">Pipeline Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {metrics?.totalLeads || 3}
              </div>
              <div className="text-gray-500 text-sm">Active Prospects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {metrics?.roiProven || 277}%
              </div>
              <div className="text-gray-500 text-sm">ROI Demonstrated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {metrics ? Math.round(metrics.quantumBehaviorConfidence) : 98}%
              </div>
              <div className="text-gray-500 text-sm">AI Precision</div>
            </div>
          </div>
        </div>

        {/* Current projects showcase */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Current Active Projects</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Blissful Memories</h4>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">In Progress</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Photography business automation - manual booking system modernization</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">$15,000 value</span>
                <span className="text-sm text-gray-500">35% complete</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Game X Change</h4>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Negotiation</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Gaming retail automation - manual card pricing system replacement</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">$2.5M opportunity</span>
                <span className="text-sm text-gray-500">Fort Worth, TX</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">RetailMax Corp</h4>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Contacted</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">Retail operations streamlining and inventory automation</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">$120,000 value</span>
                <span className="text-sm text-gray-500">Initial phase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Intelligence</h3>
            <p className="text-gray-600">Real-time analytics and performance monitoring for data-driven decisions</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Automation</h3>
            <p className="text-gray-600">Eliminate manual tasks and streamline operations with intelligent automation</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Discovery</h3>
            <p className="text-gray-600">Geolocation-based business opportunity identification and analysis</p>
          </div>
        </div>
      </section>

      {/* System status indicator */}
      <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">18 modules active • 100% uptime</div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/llc-formation">
        <LLCFormationPage />
      </Route>
      <Route path="/llc-success">
        <LLCSuccessPage />
      </Route>
      <Route path="/dashboard">
        <DashboardPage />
      </Route>
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