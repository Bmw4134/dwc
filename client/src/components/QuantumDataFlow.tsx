import React, { useEffect, useState } from 'react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
  delay: number;
  color: string;
}

export const QuantumDataFlow: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Generate quantum data points
    const points: DataPoint[] = [];
    const colors = ['emerald', 'cyan', 'purple', 'blue', 'indigo'];
    
    for (let i = 0; i < 12; i++) {
      points.push({
        id: `data-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setDataPoints(points);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Neural Network SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.6}} />
            <stop offset="50%" style={{stopColor: '#06b6d4', stopOpacity: 0.4}} />
            <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.6}} />
          </linearGradient>
        </defs>
        
        {/* Neural connections */}
        <g className="animate-neural-connect">
          <line x1="10%" y1="20%" x2="30%" y2="60%" stroke="url(#neural-gradient)" strokeWidth="2" />
          <line x1="30%" y1="60%" x2="70%" y2="40%" stroke="url(#neural-gradient)" strokeWidth="2" style={{animationDelay: '0.5s'}} />
          <line x1="70%" y1="40%" x2="90%" y2="80%" stroke="url(#neural-gradient)" strokeWidth="2" style={{animationDelay: '1s'}} />
          <line x1="20%" y1="80%" x2="60%" y2="20%" stroke="url(#neural-gradient)" strokeWidth="2" style={{animationDelay: '1.5s'}} />
          <line x1="60%" y1="20%" x2="80%" y2="70%" stroke="url(#neural-gradient)" strokeWidth="2" style={{animationDelay: '2s'}} />
        </g>
        
        {/* Neural nodes */}
        <circle cx="10%" cy="20%" r="4" fill="#10b981" className="animate-quantum-pulse" />
        <circle cx="30%" cy="60%" r="6" fill="#06b6d4" className="animate-quantum-pulse" style={{animationDelay: '0.3s'}} />
        <circle cx="70%" cy="40%" r="5" fill="#8b5cf6" className="animate-quantum-pulse" style={{animationDelay: '0.6s'}} />
        <circle cx="90%" cy="80%" r="4" fill="#3b82f6" className="animate-quantum-pulse" style={{animationDelay: '0.9s'}} />
        <circle cx="20%" cy="80%" r="3" fill="#10b981" className="animate-quantum-pulse" style={{animationDelay: '1.2s'}} />
        <circle cx="60%" cy="20%" r="5" fill="#06b6d4" className="animate-quantum-pulse" style={{animationDelay: '1.5s'}} />
        <circle cx="80%" cy="70%" r="4" fill="#8b5cf6" className="animate-quantum-pulse" style={{animationDelay: '1.8s'}} />
      </svg>

      {/* Floating data particles */}
      {dataPoints.map((point) => (
        <div
          key={point.id}
          className={`absolute w-2 h-2 bg-${point.color}-400 rounded-full animate-data-flow opacity-60`}
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            animationDelay: `${point.delay}s`
          }}
        />
      ))}

      {/* Quantum grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }, (_, i) => (
            <div
              key={i}
              className="border border-emerald-400/20 animate-quantum-pulse"
              style={{animationDelay: `${(i * 0.05)}s`}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};