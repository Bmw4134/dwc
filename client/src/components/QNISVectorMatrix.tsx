import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface VectorNode {
  x: number;
  y: number;
  z: number;
  intensity: number;
  connections: number[];
}

export default function QNISVectorMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes] = useState<VectorNode[]>(() => {
    // Generate quantum vector matrix nodes
    const nodeCount = 64;
    return Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * 800,
      y: Math.random() * 400,
      z: Math.random() * 200,
      intensity: 0.3 + Math.random() * 0.7,
      connections: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, 
        () => Math.floor(Math.random() * nodeCount)).filter(n => n !== i)
    }));
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum field grid
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw vector connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          if (targetIndex < nodes.length) {
            const target = nodes[targetIndex];
            const distance = Math.sqrt(
              Math.pow(node.x - target.x, 2) + 
              Math.pow(node.y - target.y, 2)
            );
            
            if (distance < 150) {
              const alpha = (1 - distance / 150) * 0.6;
              const pulse = 0.5 + 0.5 * Math.sin(time * 3 + i * 0.1);
              
              ctx.strokeStyle = `rgba(34, 197, 94, ${alpha * pulse})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(target.x, target.y);
              ctx.stroke();

              // Data flow particles
              const progress = (time * 2 + i * 0.1) % 1;
              const particleX = node.x + (target.x - node.x) * progress;
              const particleY = node.y + (target.y - node.y) * progress;
              
              ctx.fillStyle = `rgba(168, 85, 247, ${0.8 * pulse})`;
              ctx.beginPath();
              ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });

      // Draw quantum nodes
      nodes.forEach((node, i) => {
        const pulse = 0.7 + 0.3 * Math.sin(time * 2 + i * 0.05);
        const baseRadius = 6 + node.intensity * 8;
        const radius = baseRadius * pulse;

        // Node glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 2
        );
        gradient.addColorStop(0, `rgba(34, 197, 94, ${0.6 * pulse})`);
        gradient.addColorStop(0.5, `rgba(34, 197, 94, ${0.3 * pulse})`);
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = `rgba(34, 197, 94, ${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Vector intensity indicator
        if (node.intensity > 0.7) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.8 * pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // QNIS quantum waves
      for (let wave = 0; wave < 3; wave++) {
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 - wave * 0.05})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 2) {
          const waveHeight = 20 * Math.sin(x * 0.01 + time * 2 + wave * 2);
          const y = canvas.height / 2 + waveHeight + wave * 50;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [nodes]);

  return (
    <Card className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-emerald-900/30">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 text-emerald-400 font-mono text-sm">
        <div>QNIS VECTOR MATRIX</div>
        <div className="text-xs text-emerald-300/60">Quantum Neural Intelligence System</div>
      </div>
      <div className="absolute bottom-4 right-4 text-purple-400 font-mono text-xs">
        <div>PERPLEXITY PRO CORE</div>
        <div className="text-purple-300/60">Deep Research Integration</div>
      </div>
    </Card>
  );
}