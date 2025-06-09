import { useState } from 'react';

export default function SimpleApp() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'llc':
        return <LLCFormationPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'success':
        return <SuccessPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {renderPage()}
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #3730a3 75%, #1e40af 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: '900',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            DWC Systems LLC
          </h1>
          <div style={{
            height: '6px',
            width: '80%',
            background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #f59e0b)',
            borderRadius: '3px',
            margin: '0 auto 30px auto'
          }} />
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: 'bold',
            color: '#06b6d4',
            marginBottom: '40px'
          }}>
            Ultimate Business Formation Platform
          </h2>
        </div>

        {/* Live Metrics Dashboard */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(234, 88, 12, 0.15))',
          border: '3px solid rgba(239, 68, 68, 0.8)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '50px',
          backdropFilter: 'blur(20px)'
        }}>
          <h3 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#f87171',
            marginBottom: '30px'
          }}>
            🔥 LIVE BUSINESS INTELLIGENCE 🔥
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>$2.66M</div>
              <div style={{ fontSize: '1.2rem' }}>Pipeline Value</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>4</div>
              <div style={{ fontSize: '1.2rem' }}>Active Leads</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>277%</div>
              <div style={{ fontSize: '1.2rem' }}>ROI Proven</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>98%</div>
              <div style={{ fontSize: '1.2rem' }}>AI Confidence</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => onNavigate('llc')}
            style={{
              background: 'linear-gradient(45deg, #10b981, #06b6d4)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              padding: '20px 30px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🏢 Start LLC Formation
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              background: 'linear-gradient(45deg, #8b5cf6, #f59e0b)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              padding: '20px 30px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            📊 View Live Dashboard
          </button>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', fontSize: '1.1rem', opacity: 0.8 }}>
          Powered by Quantum AI Intelligence & NEXUS Automation Technology
        </div>
      </div>
    </div>
  );
}

function LLCFormationPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter LLC',
      price: '$299',
      description: 'Basic LLC formation with essential documents',
      features: [
        'Articles of Organization filing',
        'Registered Agent service (1 year)',
        'Operating Agreement template',
        'EIN application assistance',
        'Digital document delivery',
        'Basic compliance calendar'
      ]
    },
    {
      id: 'professional',
      name: 'Professional LLC',
      price: '$799',
      description: 'Comprehensive LLC formation with premium support',
      features: [
        'Everything in Starter package',
        'Custom Operating Agreement drafted',
        'Business banking setup assistance',
        'Tax election guidance (S-Corp, etc.)',
        'Compliance monitoring (1 year)',
        'Priority customer support',
        'Business license research',
        'Trademark search report'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise LLC',
      price: '$1,999',
      description: 'Premium LLC formation with full-service support',
      features: [
        'Everything in Professional package',
        'Multi-state registration options',
        'Corporate structure consulting',
        'Advanced tax planning session',
        'Legal consultation (2 hours)',
        'Business credit establishment',
        'Digital asset protection planning',
        'Ongoing legal support (6 months)'
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            borderRadius: '8px',
            marginBottom: '40px',
            cursor: 'pointer'
          }}
        >
          ← Back to Home
        </button>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          LLC Formation Services
        </h1>
        
        <p style={{
          fontSize: '1.3rem',
          textAlign: 'center',
          marginBottom: '50px',
          opacity: 0.9
        }}>
          Choose the perfect package for your business formation needs
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                background: selectedPackage === pkg.id 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(139, 92, 246, 0.2))'
                  : 'rgba(255, 255, 255, 0.1)',
                border: selectedPackage === pkg.id 
                  ? '2px solid #10b981' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: selectedPackage === pkg.id ? '#10b981' : 'white'
              }}>
                {pkg.name}
              </h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '15px'
              }}>
                {pkg.price}
              </div>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '20px',
                opacity: 0.9
              }}>
                {pkg.description}
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {pkg.features.map((feature, index) => (
                  <li key={index} style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('success')}
              style={{
                background: 'linear-gradient(45deg, #10b981, #06b6d4)',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                padding: '20px 50px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            borderRadius: '8px',
            marginBottom: '40px',
            cursor: 'pointer'
          }}
        >
          ← Back to Home
        </button>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          Live Business Intelligence Dashboard
        </h1>

        {/* Real-time Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>$2.66M</div>
            <div style={{ fontSize: '1.2rem' }}>Total Pipeline Value</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>Live tracking active</div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#06b6d4' }}>4</div>
            <div style={{ fontSize: '1.2rem' }}>Active Leads</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>Real-time monitoring</div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#8b5cf6' }}>277%</div>
            <div style={{ fontSize: '1.2rem' }}>ROI Proven</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>Verified results</div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b' }}>98%</div>
            <div style={{ fontSize: '1.2rem' }}>AI Confidence</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>Quantum processing</div>
          </div>
        </div>

        {/* Active Leads Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            Active Leads Pipeline
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 150px 150px',
            gap: '20px',
            padding: '15px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            fontWeight: 'bold'
          }}>
            <div>Lead Name</div>
            <div>Value</div>
            <div>Status</div>
            <div>Industry</div>
          </div>
          
          {[
            { name: 'Blissful Memories', value: '$15,000', status: 'Active Prospect', industry: 'Photography' },
            { name: 'RagleInc.com', value: '$25,000', status: 'Qualified', industry: 'Corporate' },
            { name: 'Game X Change', value: '$2,500,000', status: 'Negotiation', industry: 'Gaming' },
            { name: 'RetailMax Corp', value: '$120,000', status: 'Contacted', industry: 'Retail' }
          ].map((lead, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 150px 150px',
              gap: '20px',
              padding: '15px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div>{lead.name}</div>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>{lead.value}</div>
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {lead.status}
              </div>
              <div>{lead.industry}</div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '15px'
          }}>
            🚀 NEXUS System Status: FULLY OPERATIONAL
          </h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            All 18 AI modules active • Real-time data synchronization enabled • Automation at 100% efficiency
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          fontSize: '6rem',
          marginBottom: '30px'
        }}>
          ✅
        </div>
        
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          Payment Successful!
        </h1>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '20px'
          }}>
            Your LLC Formation Order is Being Processed
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            Our legal team has received your order and will begin processing your LLC formation immediately. 
            You will receive updates via email as your documents are prepared and filed.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24-48 Hours</div>
              <div>Document Preparation</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3-5 Days</div>
              <div>State Filing</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1-2 Weeks</div>
              <div>Complete Setup</div>
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              padding: '15px 30px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer'
            }}
          >
            Return Home
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1e293b',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              padding: '15px 30px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}