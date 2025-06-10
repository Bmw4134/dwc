import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface QuantumLoadingScreenProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export function QuantumLoadingScreen({ isLoading, progress = 0, message = "Initializing Quantum Intelligence..." }: QuantumLoadingScreenProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);

  const colors = [
    '#10b981', // emerald-500
    '#06b6d4', // cyan-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#3b82f6', // blue-500
  ];

  const createParticle = (id: number): Particle => ({
    id,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 4 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.8 + 0.2,
    trail: [],
  });

  useEffect(() => {
    if (!isLoading) return;

    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    // Animation loop
    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update position
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) {
            particle.vx *= -1;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            particle.vy *= -1;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          // Update trail
          const newTrail = [...particle.trail, { x: particle.x, y: particle.y, opacity: particle.opacity }];
          if (newTrail.length > 8) {
            newTrail.shift();
          }

          // Fade trail
          const fadedTrail = newTrail.map((point, index) => ({
            ...point,
            opacity: point.opacity * (index / newTrail.length) * 0.6,
          }));

          return {
            ...particle,
            x: newX,
            y: newY,
            trail: fadedTrail,
          };
        })
      );

      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };

    const id = requestAnimationFrame(animate);
    setAnimationId(id);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animationId]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Particle Animation Canvas */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full" style={{ filter: 'blur(0.5px)' }}>
          {particles.map(particle => (
            <g key={particle.id}>
              {/* Particle trail */}
              {particle.trail.map((point, index) => (
                <circle
                  key={`${particle.id}-trail-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={particle.size * 0.5}
                  fill={particle.color}
                  opacity={point.opacity}
                />
              ))}
              {/* Main particle */}
              <circle
                cx={particle.x}
                cy={particle.y}
                r={particle.size}
                fill={particle.color}
                opacity={particle.opacity}
              >
                <animate
                  attributeName="opacity"
                  values={`${particle.opacity};${particle.opacity * 0.3};${particle.opacity}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Glow effect */}
              <circle
                cx={particle.x}
                cy={particle.y}
                r={particle.size * 2}
                fill={particle.color}
                opacity={particle.opacity * 0.1}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Quantum Logo Animation */}
        <div className="mb-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-cyan-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 border-4 border-violet-500/70 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
            <div className="absolute inset-6 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
          QNIS/PTNI Intelligence
        </h2>
        
        <p className="text-gray-300 mb-6 animate-pulse">
          {message}
        </p>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-4">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-400">
            {progress}% Complete
          </div>
        </div>

        {/* Quantum Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Corner Quantum Effects */}
      <div className="absolute top-10 left-10">
        <div className="w-6 h-6 border-2 border-emerald-500/50 rotate-45 animate-spin"></div>
      </div>
      <div className="absolute top-10 right-10">
        <div className="w-8 h-8 border-2 border-cyan-500/50 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-10 left-10">
        <div className="w-4 h-4 bg-violet-500/50 rotate-45 animate-bounce"></div>
      </div>
      <div className="absolute bottom-10 right-10">
        <div className="w-5 h-5 border-2 border-amber-500/50 animate-spin"></div>
      </div>
    </div>
  );
}