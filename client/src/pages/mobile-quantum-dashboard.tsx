
import React from 'react';

export default function MobileQuantumDashboard() {
    return (
        <div style={{ padding: '1em', fontFamily: 'sans-serif' }}>
            <h1>Quantum Sparklines - Mobile Optimized</h1>
            <p>Welcome to the mobile dashboard with minimal clutter and responsive layout.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                <div style={{ background: '#111', color: '#0f0', padding: '1em', borderRadius: '8px' }}>
                    Sparkline: Strategy Alpha Live
                </div>
                <div style={{ background: '#111', color: '#0ff', padding: '1em', borderRadius: '8px' }}>
                    Touch for Drilldown Metrics
                </div>
            </div>
        </div>
    );
}
