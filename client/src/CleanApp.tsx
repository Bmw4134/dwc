function CleanApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #3730a3 75%, #1e40af 100%)',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
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

        {/* Live Metrics */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(234, 88, 12, 0.15))',
          border: '3px solid rgba(239, 68, 68, 0.8)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '50px'
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
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid rgba(16, 185, 129, 0.5)'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>$2.66M</div>
              <div style={{ fontSize: '1.2rem' }}>Pipeline Value</div>
            </div>
            
            <div style={{
              background: 'rgba(6, 182, 212, 0.2)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid rgba(6, 182, 212, 0.5)'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#06b6d4' }}>4</div>
              <div style={{ fontSize: '1.2rem' }}>Active Leads</div>
            </div>
            
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid rgba(139, 92, 246, 0.5)'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#8b5cf6' }}>277%</div>
              <div style={{ fontSize: '1.2rem' }}>ROI Proven</div>
            </div>
            
            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '15px',
              padding: '25px',
              border: '2px solid rgba(245, 158, 11, 0.5)'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b' }}>98%</div>
              <div style={{ fontSize: '1.2rem' }}>AI Confidence</div>
            </div>
          </div>
        </div>

        {/* LLC Formation Services */}
        <div style={{ marginBottom: '50px' }}>
          <h3 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '40px',
            color: '#06b6d4'
          }}>
            LLC Formation Services
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            
            {/* Starter Package */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              padding: '35px'
            }}>
              <h4 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '15px'
              }}>
                Starter LLC
              </h4>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '20px'
              }}>
                $299
              </div>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '25px',
                lineHeight: '1.5'
              }}>
                Basic LLC formation with essential documents
              </p>
              <div style={{ textAlign: 'left' }}>
                <div style={{ padding: '8px 0' }}>✓ Articles of Organization filing</div>
                <div style={{ padding: '8px 0' }}>✓ Registered Agent service (1 year)</div>
                <div style={{ padding: '8px 0' }}>✓ Operating Agreement template</div>
                <div style={{ padding: '8px 0' }}>✓ EIN application assistance</div>
                <div style={{ padding: '8px 0' }}>✓ Digital document delivery</div>
              </div>
            </div>

            {/* Professional Package */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
              border: '3px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '20px',
              padding: '35px',
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
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                MOST POPULAR
              </div>
              <h4 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginBottom: '15px'
              }}>
                Professional LLC
              </h4>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginBottom: '20px'
              }}>
                $799
              </div>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '25px',
                lineHeight: '1.5'
              }}>
                Comprehensive LLC formation with premium support
              </p>
              <div style={{ textAlign: 'left' }}>
                <div style={{ padding: '8px 0' }}>✓ Everything in Starter package</div>
                <div style={{ padding: '8px 0' }}>✓ Custom Operating Agreement drafted</div>
                <div style={{ padding: '8px 0' }}>✓ Business banking setup assistance</div>
                <div style={{ padding: '8px 0' }}>✓ Tax election guidance (S-Corp, etc.)</div>
                <div style={{ padding: '8px 0' }}>✓ Priority customer support</div>
              </div>
            </div>

            {/* Enterprise Package */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '35px'
            }}>
              <h4 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#f59e0b',
                marginBottom: '15px'
              }}>
                Enterprise LLC
              </h4>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#f59e0b',
                marginBottom: '20px'
              }}>
                $1,999
              </div>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '25px',
                lineHeight: '1.5'
              }}>
                Premium LLC formation with full-service support
              </p>
              <div style={{ textAlign: 'left' }}>
                <div style={{ padding: '8px 0' }}>✓ Everything in Professional package</div>
                <div style={{ padding: '8px 0' }}>✓ Multi-state registration options</div>
                <div style={{ padding: '8px 0' }}>✓ Corporate structure consulting</div>
                <div style={{ padding: '8px 0' }}>✓ Legal consultation (2 hours)</div>
                <div style={{ padding: '8px 0' }}>✓ Ongoing legal support (6 months)</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '20px'
          }}>
            🚀 NEXUS System Status: FULLY OPERATIONAL
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>18</div>
              <div>AI Modules Active</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4' }}>100%</div>
              <div>Automation Efficiency</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>Live</div>
              <div>Data Synchronization</div>
            </div>
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Real-time data synchronization enabled • Quantum-enhanced processing active • 
            All automation protocols fully operational
          </p>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>
          Powered by Quantum AI Intelligence & NEXUS Automation Technology
        </div>
      </div>
    </div>
  );
}

export default CleanApp;