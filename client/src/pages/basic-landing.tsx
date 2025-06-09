export default function BasicLanding() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Header */}
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
          marginBottom: '40px'
        }}></div>

        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#06b6d4',
          marginBottom: '40px'
        }}>
          🌟 NEXUS QUANTUM INTELLIGENCE PLATFORM 🌟
        </h2>

        {/* Live Metrics */}
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
            🚨 LIVE SYSTEM STATUS 🚨
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>$2.66M</div>
              <div style={{ color: '#fca5a5' }}>Pipeline Value</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>2,170</div>
              <div style={{ color: '#fca5a5' }}>Active Leads</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>277%</div>
              <div style={{ color: '#fca5a5' }}>ROI Proven</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>96%</div>
              <div style={{ color: '#fca5a5' }}>AI Confidence</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginBottom: '64px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.8))',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '16px' }}>
              🤖 AI Trading Bot
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Advanced cryptocurrency trading algorithms with quantum-enhanced market analysis and real-time profit optimization.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.8))',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px' }}>
              📊 Lead Intelligence
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Quantum-powered lead generation engine with predictive analytics and automated prospect qualification.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.8))',
            border: '2px solid #8b5cf6',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '16px' }}>
              🌌 18-Module Suite
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Complete enterprise automation including CRM integration, business intelligence, and quantum analytics.
            </p>
          </div>
        </div>

        {/* Call to Action */}
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
            🚀 ENTERPRISE AUTOMATION AWAITS 🚀
          </h3>

          <p style={{
            fontSize: '1.5rem',
            color: '#e0e7ff',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Join the quantum revolution in business intelligence. Unlock the full power of AI-driven automation 
            with our enterprise-grade platform featuring real-time lead generation, advanced analytics, and 18-module automation suite.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
          }}>
            <a 
              href="/checkout" 
              style={{
                display: 'inline-block',
                background: 'linear-gradient(45deg, #10b981, #8b5cf6)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                padding: '16px 48px',
                borderRadius: '16px',
                textDecoration: 'none',
                border: '2px solid #10b981',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              💳 SUBSCRIBE NOW - $799/month →
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
                background: 'transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#06b6d4';
                e.currentTarget.style.color = '#1e293b';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#06b6d4';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ⚡ LIVE DEMO
            </a>
          </div>

          <div style={{
            marginTop: '32px',
            fontSize: '0.9rem',
            color: '#c7d2fe'
          }}>
            💳 Secure payment processing powered by Stripe • 🔒 SSL encrypted • 📞 24/7 enterprise support
          </div>
        </div>
      </div>

      {/* Floating Status */}
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
          🟢 ALL SYSTEMS OPERATIONAL
        </div>
        <div style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>18 Modules Active • 100% Automation Linkage</div>
        <div style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>NEXUS Intelligence: FULLY OPERATIONAL</div>
      </div>
    </div>
  );
}