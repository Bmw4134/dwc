import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantumParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  phase: number;
  spin: number;
  entangled?: number[];
}

interface LoadingStage {
  name: string;
  description: string;
  duration: number;
  particles: number;
  fieldIntensity: number;
  quantumState: 'superposition' | 'entanglement' | 'collapse' | 'coherence';
}

const loadingStages: LoadingStage[] = [
  {
    name: 'Quantum Field Initialization',
    description: 'Establishing quantum coherence matrix',
    duration: 2000,
    particles: 50,
    fieldIntensity: 0.3,
    quantumState: 'superposition'
  },
  {
    name: 'Neural Network Entanglement',
    description: 'Creating quantum-classical interfaces',
    duration: 2500,
    particles: 100,
    fieldIntensity: 0.6,
    quantumState: 'entanglement'
  },
  {
    name: 'AI Core Synchronization',
    description: 'Aligning quantum processors',
    duration: 2000,
    particles: 150,
    fieldIntensity: 0.9,
    quantumState: 'coherence'
  },
  {
    name: 'System Materialization',
    description: 'Collapsing wave functions',
    duration: 1500,
    particles: 200,
    fieldIntensity: 1.0,
    quantumState: 'collapse'
  }
];

export default function QuantumLoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<QuantumParticle[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize quantum particles
  useEffect(() => {
    const stage = loadingStages[currentStage];
    if (!stage) return;

    const newParticles: QuantumParticle[] = [];
    for (let i = 0; i < stage.particles; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        energy: Math.random() * 100,
        phase: Math.random() * Math.PI * 2,
        spin: Math.random() > 0.5 ? 1 : -1,
        entangled: stage.quantumState === 'entanglement' ? 
          Array.from({length: 2}, () => Math.floor(Math.random() * stage.particles)).filter(id => id !== i) : 
          undefined
      });
    }
    setParticles(newParticles);
  }, [currentStage]);

  // Quantum field animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const stage = loadingStages[currentStage];
      if (!stage) return;

      // Quantum field background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, `rgba(0, 255, 255, ${stage.fieldIntensity * 0.1})`);
      gradient.addColorStop(0.5, `rgba(138, 43, 226, ${stage.fieldIntensity * 0.05})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum particles
      particles.forEach((particle, index) => {
        const time = Date.now() * 0.001;
        
        // Update particle position based on quantum state
        switch (stage.quantumState) {
          case 'superposition':
            particle.x += Math.sin(time + particle.phase) * 0.5;
            particle.y += Math.cos(time + particle.phase) * 0.5;
            break;
          case 'entanglement':
            if (particle.entangled) {
              particle.entangled.forEach(entangledId => {
                const entangled = particles[entangledId];
                if (entangled) {
                  const dx = entangled.x - particle.x;
                  const dy = entangled.y - particle.y;
                  particle.vx += dx * 0.0001;
                  particle.vy += dy * 0.0001;
                }
              });
            }
            particle.x += particle.vx;
            particle.y += particle.vy;
            break;
          case 'coherence':
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const angle = Math.atan2(centerY - particle.y, centerX - particle.x);
            particle.x += Math.cos(angle) * 0.5;
            particle.y += Math.sin(angle) * 0.5;
            break;
          case 'collapse':
            particle.x += particle.vx * 2;
            particle.y += particle.vy * 2;
            particle.energy *= 0.98;
            break;
        }

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with quantum effects
        const size = (particle.energy / 100) * 3 + 1;
        const alpha = stage.fieldIntensity * (particle.energy / 100);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${(particle.phase * 180 / Math.PI + time * 50) % 360}, 70%, 60%)`;
        
        // Quantum glow effect
        const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 4);
        glowGradient.addColorStop(0, `hsl(${(particle.phase * 180 / Math.PI + time * 50) % 360}, 70%, 60%)`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(particle.x - size * 4, particle.y - size * 4, size * 8, size * 8);
        
        // Particle core
        ctx.fillStyle = `hsl(${(particle.phase * 180 / Math.PI + time * 50) % 360}, 70%, 80%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        // Draw entanglement connections
        if (stage.quantumState === 'entanglement' && particle.entangled) {
          particle.entangled.forEach(entangledId => {
            const entangled = particles[entangledId];
            if (entangled) {
              ctx.save();
              ctx.globalAlpha = 0.3;
              ctx.strokeStyle = '#00ffff';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(entangled.x, entangled.y);
              ctx.stroke();
              ctx.restore();
            }
          });
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, currentStage]);

  // Stage progression
  useEffect(() => {
    const stage = loadingStages[currentStage];
    if (!stage) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (stage.duration / 50));
        if (newProgress >= 100) {
          if (currentStage < loadingStages.length - 1) {
            setCurrentStage(currentStage + 1);
            return 0;
          } else {
            // Loading complete
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(onComplete, 500);
            }, 500);
            return 100;
          }
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentStage, onComplete]);

  const stage = loadingStages[currentStage];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* Quantum field canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Loading interface */}
          <div className="relative z-10 text-center text-white">
            {/* DWC Systems Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="text-6xl font-thin tracking-wider mb-2">
                <span className="text-cyan-400">DWC</span>
                <span className="text-white mx-2">SYSTEMS</span>
              </div>
              <div className="text-sm text-gray-400 tracking-widest">
                QUANTUM INTELLIGENCE PLATFORM
              </div>
            </motion.div>

            {/* Stage Information */}
            {stage && (
              <motion.div
                key={currentStage}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-light mb-2 text-cyan-300">
                  {stage.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {stage.description}
                </p>
              </motion.div>
            )}

            {/* Quantum Progress Bar */}
            <div className="w-80 mx-auto mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>QUANTUM STATE: {stage?.quantumState.toUpperCase()}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              {/* Stage indicators */}
              <div className="flex justify-between mt-3">
                {loadingStages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index <= currentStage
                        ? 'bg-cyan-400'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quantum metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="grid grid-cols-3 gap-6 text-xs text-gray-400"
            >
              <div>
                <div className="text-cyan-400 font-mono">{particles.length}</div>
                <div>PARTICLES</div>
              </div>
              <div>
                <div className="text-purple-400 font-mono">
                  {stage?.fieldIntensity ? (stage.fieldIntensity * 100).toFixed(0) : 0}%
                </div>
                <div>FIELD INTENSITY</div>
              </div>
              <div>
                <div className="text-green-400 font-mono">
                  {stage?.quantumState === 'entanglement' ? 'ACTIVE' : 'STABLE'}
                </div>
                <div>COHERENCE</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}