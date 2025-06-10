import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  systemHealth: number;
  activeConnections: number;
}

interface QuantumMetricsProps {
  totalLeads: number;
  systemHealth: number;
  roiProven: number;
  automationLinkage: number;
}

export const QuantumMetrics: React.FC<QuantumMetricsProps> = ({
  totalLeads,
  systemHealth,
  roiProven,
  automationLinkage
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    leads: 0,
    health: 0,
    roi: 0,
    automation: 0
  });

  const [glitchTrigger, setGlitchTrigger] = useState(false);

  // Animate numbers on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        leads: Math.floor(totalLeads * easeOut),
        health: Math.floor(systemHealth * easeOut),
        roi: Math.floor(roiProven * easeOut),
        automation: Math.floor(automationLinkage * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          leads: totalLeads,
          health: systemHealth,
          roi: roiProven,
          automation: automationLinkage
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalLeads, systemHealth, roiProven, automationLinkage]);

  // Trigger quantum glitch effect periodically
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchTrigger(true);
      setTimeout(() => setGlitchTrigger(false), 300);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  const MetricCard: React.FC<{
    value: number;
    label: string;
    suffix?: string;
    color: string;
    icon: string;
    delay: string;
  }> = ({ value, label, suffix = '', color, icon, delay }) => (
    <div 
      className={`text-center group animate-stagger-1 ${glitchTrigger ? 'animate-quantum-glitch' : ''}`}
      style={{ animationDelay: delay }}
    >
      <div className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 backdrop-blur-sm border border-${color}-400/30 rounded-2xl p-8 mb-4 quantum-card hover-glow transition-all duration-300 relative overflow-hidden`}>
        {/* Quantum shimmer overlay */}
        <div className="absolute inset-0 animate-quantum-shimmer opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon */}
        <div className={`text-4xl mb-4 animate-quantum-pulse`} style={{ animationDelay: delay }}>
          {icon}
        </div>
        
        {/* Value with quantum counter effect */}
        <div className={`text-6xl font-black text-${color}-400 mb-4 relative`}>
          <span className="relative z-10">{value}{suffix}</span>
          {/* Quantum trail effect */}
          <div className={`absolute inset-0 text-${color}-400/30 transform translate-x-1 translate-y-1 -z-10`}>
            {value}{suffix}
          </div>
        </div>
        
        {/* Label */}
        <div className={`text-${color}-300 font-bold text-lg uppercase tracking-wide`}>
          {label}
        </div>
        
        {/* Quantum status indicator */}
        <div className="mt-4 flex justify-center">
          <div className={`w-3 h-3 bg-${color}-400 rounded-full animate-quantum-pulse`}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
      <MetricCard
        value={animatedValues.leads}
        label="Neural Targets"
        color="emerald"
        icon="🎯"
        delay="0s"
      />
      
      <MetricCard
        value={animatedValues.health}
        label="System Health"
        suffix="%"
        color="cyan"
        icon="⚡"
        delay="0.2s"
      />
      
      <MetricCard
        value={animatedValues.roi}
        label="Quantum ROI"
        suffix="%"
        color="purple"
        icon="📊"
        delay="0.4s"
      />
      
      <MetricCard
        value={animatedValues.automation}
        label="Auto Linkage"
        suffix="%"
        color="blue"
        icon="🔗"
        delay="0.6s"
      />
    </div>
  );
};