import { useState, useEffect } from 'react';
import { DWCCommandInterface } from './components/dwc-command-interface';

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
    automationPipeline?: {
      currentStage: string;
      progress: number;
      nextAction: string;
      completedSteps: string[];
      pendingSteps: string[];
      automationScore: number;
      lastActivity: string;
    };
  }>;
}

function FinalApp() {
  const [currentView, setCurrentView] = useState('home');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Fetch live dashboard metrics
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const baseStyles = {
    minHeight: '100vh',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 75%, #0f3460 100%)'
      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #3730a3 75%, #1e40af 100%)',
    color: isDarkMode ? '#f8fafc' : 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const Navigation = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: isDarkMode 
        ? 'rgba(10, 10, 10, 0.95)' 
        : 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
      zIndex: 1000,
      padding: '15px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #10b981, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DWC Systems
        </div>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {['home', 'llc-formation', 'dashboard', 'auth'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background: 'none',
                border: 'none',
                color: currentView === view ? '#10b981' : isDarkMode ? '#cbd5e1' : '#e2e8f0',
                fontSize: '1rem',
                fontWeight: currentView === view ? '600' : '400',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {view.replace('-', ' ')}
            </button>
          ))}
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: isDarkMode ? '#f8fafc' : 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div style={{ paddingTop: '100px', padding: '100px 20px 40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Hero Section */}
        <div style={{ marginBottom: '80px' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '900',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1'
          }}>
            Enterprise AI Platform
          </h1>
          
          <div style={{
            height: '6px',
            width: '60%',
            background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #f59e0b)',
            borderRadius: '3px',
            margin: '0 auto 40px auto',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
          }} />
          
          <p style={{
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            color: isDarkMode ? '#cbd5e1' : '#e2e8f0',
            marginBottom: '50px',
            maxWidth: '800px',
            margin: '0 auto 50px auto',
            lineHeight: '1.5'
          }}>
            Quantum-enhanced business intelligence with real-time automation
          </p>
          
          <button
            onClick={() => setCurrentView('llc-formation')}
            style={{
              background: 'linear-gradient(45deg, #10b981, #06b6d4)',
              border: 'none',
              color: 'white',
              padding: '16px 40px',
              fontSize: '1.2rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
            }}
          >
            Start Your LLC Today
          </button>
        </div>

        {/* Live Metrics Dashboard */}
        {metrics && (
          <div style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
            borderRadius: '24px',
            padding: '50px',
            marginBottom: '80px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '40px',
              background: 'linear-gradient(45deg, #ef4444, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🔥 Live Business Intelligence
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              marginBottom: '30px'
            }}>
              {[
                { 
                  label: 'Pipeline Value', 
                  value: formatCurrency(metrics.totalPipelineValue), 
                  color: '#10b981',
                  description: 'Real-time tracking'
                },
                { 
                  label: 'Active Leads', 
                  value: metrics.totalLeads, 
                  color: '#06b6d4',
                  description: 'Live monitoring'
                },
                { 
                  label: 'ROI Proven', 
                  value: `${metrics.roiProven}%`, 
                  color: '#8b5cf6',
                  description: 'Verified results'
                },
                { 
                  label: 'AI Confidence', 
                  value: `${Math.round(metrics.quantumBehaviorConfidence)}%`, 
                  color: '#f59e0b',
                  description: 'Quantum processing'
                }
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: isDarkMode 
                      ? `linear-gradient(135deg, ${metric.color}15, ${metric.color}08)`
                      : `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                    borderRadius: '20px',
                    padding: '30px',
                    border: `2px solid ${metric.color}40`,
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
                    fontWeight: 'bold', 
                    color: metric.color,
                    marginBottom: '10px'
                  }}>
                    {metric.value}
                  </div>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {metric.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.95rem', 
                    opacity: 0.7
                  }}>
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              fontSize: '1rem',
              opacity: 0.8,
              marginTop: '20px'
            }}>
              Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* System Status */}
        <div style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(139, 92, 246, 0.08))'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
          border: `2px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)'}`,
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '30px'
          }}>
            🚀 NEXUS System Status: FULLY OPERATIONAL
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '25px',
            marginBottom: '25px'
          }}>
            {[
              { label: 'AI Modules Active', value: '18' },
              { label: 'Automation Efficiency', value: '100%' },
              { label: 'Data Synchronization', value: 'Live' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: 'bold', 
                  color: '#10b981',
                  marginBottom: '5px'
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '1.1rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            Real-time data synchronization enabled • Quantum-enhanced processing active • 
            All automation protocols fully operational
          </p>
        </div>
      </div>
    </div>
  );

  const LLCFormationPage = () => (
    <div style={{ paddingTop: '100px', padding: '100px 20px 40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#06b6d4'
          }}>
            LLC Formation Services
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: isDarkMode ? '#cbd5e1' : '#e2e8f0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Professional business formation with AI-powered automation
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          
          {/* Starter Package */}
          <div style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.08))'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
            border: `2px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '24px',
            padding: '40px',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '15px'
            }}>
              Starter LLC
            </h3>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '20px'
            }}>
              $299
            </div>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '30px',
              lineHeight: '1.5',
              opacity: 0.9
            }}>
              Basic LLC formation with essential documents
            </p>
            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              {[
                'Articles of Organization filing',
                'Registered Agent service (1 year)',
                'Operating Agreement template',
                'EIN application assistance',
                'Digital document delivery'
              ].map((feature, index) => (
                <div key={index} style={{ 
                  padding: '10px 0',
                  borderBottom: index < 4 ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'}` : 'none',
                  fontSize: '1.1rem'
                }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
            <button style={{
              width: '100%',
              background: 'linear-gradient(45deg, #10b981, #06b6d4)',
              border: 'none',
              color: 'white',
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Get Started
            </button>
          </div>

          {/* Professional Package */}
          <div style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.12))'
              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
            border: `3px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.5)'}`,
            borderRadius: '24px',
            padding: '40px',
            transform: 'scale(1.05)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              MOST POPULAR
            </div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#8b5cf6',
              marginBottom: '15px'
            }}>
              Professional LLC
            </h3>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#8b5cf6',
              marginBottom: '20px'
            }}>
              $799
            </div>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '30px',
              lineHeight: '1.5',
              opacity: 0.9
            }}>
              Comprehensive LLC formation with premium support
            </p>
            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              {[
                'Everything in Starter package',
                'Custom Operating Agreement drafted',
                'Business banking setup assistance',
                'Tax election guidance (S-Corp, etc.)',
                'Priority customer support'
              ].map((feature, index) => (
                <div key={index} style={{ 
                  padding: '10px 0',
                  borderBottom: index < 4 ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'}` : 'none',
                  fontSize: '1.1rem'
                }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
            <button style={{
              width: '100%',
              background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              border: 'none',
              color: 'white',
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Choose Professional
            </button>
          </div>

          {/* Enterprise Package */}
          <div style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.08))'
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
            border: `2px solid ${isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: '24px',
            padding: '40px'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '15px'
            }}>
              Enterprise LLC
            </h3>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '20px'
            }}>
              $1,999
            </div>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '30px',
              lineHeight: '1.5',
              opacity: 0.9
            }}>
              Premium LLC formation with full-service support
            </p>
            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              {[
                'Everything in Professional package',
                'Multi-state registration options',
                'Corporate structure consulting',
                'Legal consultation (2 hours)',
                'Ongoing legal support (6 months)'
              ].map((feature, index) => (
                <div key={index} style={{ 
                  padding: '10px 0',
                  borderBottom: index < 4 ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'}` : 'none',
                  fontSize: '1.1rem'
                }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
            <button style={{
              width: '100%',
              background: 'linear-gradient(45deg, #f59e0b, #ef4444)',
              border: 'none',
              color: 'white',
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Choose Enterprise
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div style={{ paddingTop: '100px', padding: '100px 20px 40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 'bold',
          marginBottom: '40px',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #10b981, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Live Business Dashboard
        </h1>

        {metrics && (
          <>
            {/* Key Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px',
              marginBottom: '40px'
            }}>
              {[
                { 
                  title: 'Total Pipeline', 
                  value: formatCurrency(metrics.totalPipelineValue),
                  change: '+12.5%',
                  color: '#10b981'
                },
                { 
                  title: 'Active Leads', 
                  value: metrics.totalLeads,
                  change: '+3',
                  color: '#06b6d4'
                },
                { 
                  title: 'Conversion Rate', 
                  value: `${metrics.conversionRate}%`,
                  change: '+2.1%',
                  color: '#8b5cf6'
                },
                { 
                  title: 'System Health', 
                  value: `${metrics.systemHealth}%`,
                  change: 'Stable',
                  color: '#f59e0b'
                }
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: isDarkMode 
                      ? `linear-gradient(135deg, ${metric.color}10, ${metric.color}05)`
                      : `linear-gradient(135deg, ${metric.color}15, ${metric.color}08)`,
                    border: `2px solid ${metric.color}30`,
                    borderRadius: '16px',
                    padding: '25px'
                  }}
                >
                  <div style={{ marginBottom: '10px', fontSize: '1.1rem', opacity: 0.8 }}>
                    {metric.title}
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: metric.color,
                    marginBottom: '5px'
                  }}>
                    {metric.value}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#10b981',
                    fontWeight: '500'
                  }}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Lead Map */}
            <div style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '40px'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '25px',
                color: '#06b6d4'
              }}>
                🗺️ Dynamic Lead Map
              </h3>
              
              {/* Map Container */}
              <div style={{
                position: 'relative',
                height: '400px',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '30px'
              }}>
                {/* SVG Map Background */}
                <svg 
                  viewBox="0 0 1000 400" 
                  style={{ width: '100%', height: '100%', position: 'absolute' }}
                >
                  {/* US Map Outline */}
                  <path
                    d="M200 100 L800 100 L850 150 L820 200 L750 250 L650 280 L500 300 L350 290 L250 250 L180 200 L150 150 Z"
                    fill="none"
                    stroke={isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}
                    strokeWidth="2"
                  />
                  
                  {/* Lead Location Markers */}
                  {metrics.realLeads.map((lead, index) => {
                    const positions = [
                      { x: 300, y: 180 }, // Blissful Memories - West Coast
                      { x: 500, y: 160 }, // RagleInc - Central
                      { x: 420, y: 200 }, // Game X Change - Midwest
                      { x: 650, y: 190 }  // RetailMax - East Coast
                    ];
                    const pos = positions[index] || { x: 400, y: 200 };
                    const size = Math.max(8, Math.min(30, lead.value / 100000));
                    
                    return (
                      <g key={index}>
                        {/* Pulsing Ring */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={size + 10}
                          fill="none"
                          stroke={lead.status === 'Active Negotiation' ? '#f59e0b' : '#10b981'}
                          strokeWidth="2"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            values={`${size + 5};${size + 15};${size + 5}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.8;0.2;0.8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        
                        {/* Main Marker */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={size}
                          fill={lead.status === 'Active Negotiation' ? '#f59e0b' : '#10b981'}
                          opacity="0.9"
                        />
                        
                        {/* Company Label */}
                        <text
                          x={pos.x}
                          y={pos.y - size - 8}
                          textAnchor="middle"
                          fill={isDarkMode ? '#f8fafc' : 'white'}
                          fontSize="12"
                          fontWeight="600"
                        >
                          {lead.name}
                        </text>
                        
                        {/* Value Label */}
                        <text
                          x={pos.x}
                          y={pos.y + size + 16}
                          textAnchor="middle"
                          fill={lead.status === 'Active Negotiation' ? '#f59e0b' : '#10b981'}
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {formatCurrency(lead.value)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Real-time Update Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  color: '#10b981',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    background: '#10b981',
                    borderRadius: '50%'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      background: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 1s infinite'
                    }}></div>
                  </div>
                  LIVE
                </div>
              </div>
              
              {/* Map Legend */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '0.9rem' }}>Active Prospects</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#f59e0b',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '0.9rem' }}>Active Negotiation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: '#06b6d4',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{ fontSize: '0.9rem' }}>Qualified Leads</span>
                </div>
              </div>
            </div>

            {/* Blissful Memories Automation Pipeline */}
            {metrics.realLeads[0]?.automationPipeline && (
              <div style={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '30px',
                marginBottom: '40px',
                border: '2px solid #10b981'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  marginBottom: '25px',
                  color: '#10b981'
                }}>
                  🤖 Blissful Memories - Automation Pipeline Status
                </h3>
                
                {/* Pipeline Progress Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '20px',
                  marginBottom: '25px',
                  padding: '20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '5px' }}>Current Stage</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                      {metrics.realLeads[0].automationPipeline.currentStage}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '5px' }}>Progress</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                      {metrics.realLeads[0].automationPipeline.progress}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '5px' }}>Automation Score</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                      {metrics.realLeads[0].automationPipeline.automationScore}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  marginBottom: '30px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${metrics.realLeads[0].automationPipeline.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>

                {/* Next Action */}
                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid #06b6d4',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '25px'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '8px' }}>
                    🎯 Next Action Required:
                  </div>
                  <div style={{ fontSize: '1.1rem' }}>
                    {metrics.realLeads[0].automationPipeline.nextAction}
                  </div>
                </div>

                {/* Completed Steps */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#10b981'
                    }}>
                      ✅ Completed Steps
                    </h4>
                    {metrics.realLeads[0].automationPipeline.completedSteps.map((step, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px 15px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          fontSize: '0.95rem'
                        }}
                      >
                        ✓ {step}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#f59e0b'
                    }}>
                      ⏳ Pending Steps
                    </h4>
                    {metrics.realLeads[0].automationPipeline.pendingSteps.map((step, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px 15px',
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          fontSize: '0.95rem',
                          opacity: 0.8
                        }}
                      >
                        ○ {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Activity */}
                <div style={{
                  marginTop: '25px',
                  padding: '15px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  Last Activity: {new Date(metrics.realLeads[0].automationPipeline.lastActivity).toLocaleDateString()}
                </div>
              </div>
            )}

            {/* Live Leads Table */}
            <div style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '40px'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '25px',
                color: '#06b6d4'
              }}>
                Active Pipeline
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '20px',
                alignItems: 'center',
                paddingBottom: '15px',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
                marginBottom: '20px',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                <div>Company</div>
                <div>Value</div>
                <div>Status</div>
                <div>Industry</div>
              </div>

              {metrics.realLeads.map((lead, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: index < metrics.realLeads.length - 1 
                      ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'}` 
                      : 'none',
                    fontSize: '1rem'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{lead.name}</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                    {formatCurrency(lead.value)}
                  </div>
                  <div style={{
                    color: lead.status === 'Active Negotiation' ? '#f59e0b' : '#06b6d4',
                    fontWeight: '500'
                  }}>
                    {lead.status}
                  </div>
                  <div style={{ opacity: 0.8 }}>{lead.industry}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const AuthPage = () => (
    <div style={{ paddingTop: '100px', padding: '100px 20px 40px 20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '30px',
          background: 'linear-gradient(45deg, #10b981, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Access Dashboard
        </h1>
        
        <div style={{
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>
              Email
            </label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
                background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: isDarkMode ? '#f8fafc' : 'white',
                fontSize: '1rem'
              }}
              placeholder="Enter your email"
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>
              Password
            </label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
                background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: isDarkMode ? '#f8fafc' : 'white',
                fontSize: '1rem'
              }}
              placeholder="Enter your password"
            />
          </div>
          
          <button style={{
            width: '100%',
            background: 'linear-gradient(45deg, #10b981, #06b6d4)',
            border: 'none',
            color: 'white',
            padding: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>
            Sign In
          </button>
          
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Secure access to your business dashboard
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'llc-formation':
        return <LLCFormationPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={baseStyles}>
      <Navigation />
      {renderCurrentView()}
      
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
        fontSize: '1rem',
        opacity: 0.8
      }}>
        Powered by Quantum AI Intelligence & NEXUS Automation Technology
      </div>
      
      {/* DWC Command Control Interface */}
      <DWCCommandInterface isDarkMode={isDarkMode} />
    </div>
  );
}

export default FinalApp;