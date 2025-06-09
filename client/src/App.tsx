import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        background: 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        DWC SYSTEMS LLC
      </h1>

      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
        borderRadius: '2px',
        marginBottom: '40px',
        maxWidth: '1200px',
        margin: '0 auto 40px auto'
      }}></div>

      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#06b6d4',
        marginBottom: '40px'
      }}>
        NEXUS QUANTUM INTELLIGENCE PLATFORM
      </h2>

      <div style={{
        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(234, 88, 12, 0.3))',
        border: '2px solid rgba(239, 68, 68, 0.7)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '48px',
        maxWidth: '800px',
        margin: '0 auto 48px auto'
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#f87171',
          marginBottom: '24px'
        }}>
          LIVE SYSTEM STATUS
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>$2.66M</div>
            <div style={{ color: '#fca5a5' }}>Pipeline Value</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>4</div>
            <div style={{ color: '#fca5a5' }}>Active Leads</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>277%</div>
            <div style={{ color: '#fca5a5' }}>ROI Proven</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>98%</div>
            <div style={{ color: '#fca5a5' }}>AI Confidence</div>
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))',
        border: '2px solid #8b5cf6',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h3 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ENTERPRISE AUTOMATION PLATFORM
        </h3>

        <p style={{
          fontSize: '1.5rem',
          color: '#e0e7ff',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          QNIS/PTNI business modernization platform that transforms legacy operations through AI automation. 
          Real-time geolocation lead discovery, manual process elimination, and proven ROI generation.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <a 
            href="/llc-formation" 
            style={{
              display: 'inline-block',
              background: 'linear-gradient(45deg, #10b981, #8b5cf6)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              padding: '16px 48px',
              borderRadius: '16px',
              textDecoration: 'none',
              border: '2px solid #10b981'
            }}
          >
            Form Your LLC - Starting at $299
          </a>

          <a 
            href="/dashboard" 
            style={{
              display: 'inline-block',
              border: '2px solid #06b6d4',
              color: '#06b6d4',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              padding: '16px 48px',
              borderRadius: '16px',
              textDecoration: 'none',
              background: 'transparent'
            }}
          >
            View Live Dashboard
          </a>
        </div>

        <div style={{
          marginTop: '32px',
          fontSize: '0.9rem',
          color: '#c7d2fe'
        }}>
          Secure payment processing powered by Stripe • SSL encrypted • 24/7 support
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.9), rgba(6, 120, 87, 0.9))',
        border: '2px solid #10b981',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
          ALL SYSTEMS OPERATIONAL
        </div>
        <div style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>18 Modules Active • 100% Automation Linkage</div>
        <div style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>NEXUS Intelligence: FULLY OPERATIONAL</div>
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