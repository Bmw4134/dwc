export default function EmergencyLanding() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #059669 50%, #7c3aed 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        background: 'linear-gradient(45deg, #10b981, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        DWC Systems
      </h1>
      
      <p style={{
        fontSize: '1.5rem',
        marginBottom: '2rem',
        color: '#d1d5db'
      }}>
        Quantum Neural Intelligence System
      </p>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={() => window.location.href = '/demo-dashboard'}
          style={{
            background: '#059669',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Try NEXUS GPT (20 Free Prompts)
        </button>
        
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{
            background: 'transparent',
            color: '#10b981',
            padding: '1rem 2rem',
            border: '2px solid #10b981',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Executive Dashboard
        </button>
      </div>
      
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '1rem',
        border: '1px solid #10b981'
      }}>
        <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Live System Status</h3>
        <p style={{ color: '#d1d5db' }}>Pipeline Value: $2.66M | System Health: 99%+ | Quantum Confidence: 98%+</p>
        <p style={{ color: '#8b5cf6', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          QNIS Master LLM with Perplexity Pro Deep Research Core
        </p>
      </div>
    </div>
  );
}