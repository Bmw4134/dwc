import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface QuantumParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  energy: number;
}

interface QuantumDataPoint {
  value: number;
  timestamp: number;
  confidence: number;
  category: string;
}

export const QuantumParticleField = ({ 
  particleCount = 50, 
  width = 400, 
  height = 300 
}: {
  particleCount?: number;
  width?: number;
  height?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<QuantumParticle[]>([]);

  useEffect(() => {
    const initParticles = () => {
      const newParticles: QuantumParticle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`,
          energy: Math.random()
        });
      }
      setParticles(newParticles);
    };

    initParticles();
  }, [particleCount, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Boundary collision
        if (newX <= 0 || newX >= width) newVx *= -0.8;
        if (newY <= 0 || newY >= height) newVy *= -0.8;

        newX = Math.max(0, Math.min(width, newX));
        newY = Math.max(0, Math.min(height, newY));

        // Draw particle
        ctx.beginPath();
        ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();

        // Add quantum entanglement lines
        prev.forEach(other => {
          if (other.id !== particle.id) {
            const distance = Math.sqrt(
              Math.pow(newX - other.x, 2) + Math.pow(newY - other.y, 2)
            );
            if (distance < 80) {
              ctx.beginPath();
              ctx.moveTo(newX, newY);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 * (1 - distance / 80)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          energy: Math.sin(Date.now() / 1000 + particle.id) * 0.5 + 0.5
        };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ filter: 'blur(0.5px)' }}
    />
  );
};

export const AnimatedMetricCard = ({ 
  title, 
  value, 
  unit = '', 
  trend = 0,
  confidence = 0.95 
}: {
  title: string;
  value: number;
  unit?: string;
  trend?: number;
  confidence?: number;
}) => {
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate value counting
    const animateValue = async () => {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = displayValue;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setDisplayValue(startValue + (value - startValue) * easeOutQuart);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    animateValue();
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    });
  }, [value, controls, displayValue]);

  return (
    <motion.div
      animate={controls}
      className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 overflow-hidden"
      whileHover={{ 
        scale: 1.02,
        borderColor: 'rgba(34, 211, 238, 0.4)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 animate-pulse" />
      
      {/* Quantum particles in background */}
      <QuantumParticleField particleCount={15} width={300} height={150} />
      
      <div className="relative z-10">
        <motion.h3 
          className="text-sm text-cyan-300 mb-2 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <motion.div 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          {typeof displayValue === 'number' ? displayValue.toFixed(1) : displayValue}{unit}
        </motion.div>

        {/* Confidence indicator */}
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </div>
          <span className="text-xs text-cyan-400">
            {(confidence * 100).toFixed(0)}%
          </span>
        </motion.div>

        {/* Trend indicator */}
        {trend !== 0 && (
          <motion.div 
            className={`flex items-center mt-2 text-xs ${
              trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.span
              animate={{ y: trend > 0 ? [-2, 0, -2] : [2, 0, 2] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {trend > 0 ? '↗' : '↘'}
            </motion.span>
            <span className="ml-1">{Math.abs(trend).toFixed(1)}%</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const QuantumDataVisualization = ({ 
  data, 
  title = "Quantum Data Stream" 
}: {
  data: QuantumDataPoint[];
  title?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animatedData, setAnimatedData] = useState<QuantumDataPoint[]>([]);

  useEffect(() => {
    // Animate data points appearing
    const animateDataPoints = () => {
      data.forEach((point, index) => {
        setTimeout(() => {
          setAnimatedData(prev => [...prev, point]);
        }, index * 100);
      });
    };

    setAnimatedData([]);
    animateDataPoints();
  }, [data]);

  const maxValue = Math.max(...data.map(d => d.value));
  const width = 400;
  const height = 200;
  const padding = 40;

  return (
    <div className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-purple-300 mb-4">{title}</h3>
      
      <svg ref={svgRef} width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        {/* Animated grid */}
        {[1, 2, 3, 4].map(i => (
          <motion.line
            key={i}
            x1={padding}
            y1={padding + (height - 2 * padding) * i / 4}
            x2={width - padding}
            y2={padding + (height - 2 * padding) * i / 4}
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
          />
        ))}

        {/* Data line */}
        <motion.path
          d={`M ${animatedData.map((point, i) => 
            `${padding + (width - 2 * padding) * i / (data.length - 1)},${
              height - padding - (height - 2 * padding) * (point.value / maxValue)
            }`
          ).join(' L ')}`}
          fill="none"
          stroke="url(#dataGradient)"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Data points */}
        <AnimatePresence>
          {animatedData.map((point, i) => (
            <motion.circle
              key={i}
              cx={padding + (width - 2 * padding) * i / (data.length - 1)}
              cy={height - padding - (height - 2 * padding) * (point.value / maxValue)}
              r={4}
              fill={`hsl(${240 + point.confidence * 120}, 70%, 60%)`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.5 }}
            />
          ))}
        </AnimatePresence>

        {/* Quantum energy waves */}
        <motion.path
          d={`M ${padding} ${height/2} Q ${width/2} ${height/2 - 20} ${width - padding} ${height/2}`}
          fill="none"
          stroke="rgba(34, 211, 238, 0.3)"
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Real-time indicator */}
      <motion.div 
        className="absolute top-4 right-4 flex items-center space-x-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span className="text-xs text-green-400">Live Data</span>
      </motion.div>
    </div>
  );
};

export const QuantumLoader = ({ isLoading = true }: { isLoading?: boolean }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};