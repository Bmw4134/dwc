import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface QuantumReward {
  id: string;
  name: string;
  description: string;
  rarity: string;
  icon: string;
  quantumState?: string;
  timestamp?: string;
  interactionCount?: number;
}

interface EasterEggState {
  activeSequences: Map<string, any[]>;
  unlockedRewards: QuantumReward[];
  quantumMode: boolean;
  developerConsole: boolean;
}

export const useQuantumEasterEggs = () => {
  const [easterEggState, setEasterEggState] = useState<EasterEggState>({
    activeSequences: new Map(),
    unlockedRewards: [],
    quantumMode: false,
    developerConsole: false
  });

  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [clickSequence, setClickSequence] = useState<string[]>([]);
  const [hoverSequence, setHoverSequence] = useState<string[]>([]);

  // Konami Code Detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...keySequence, event.code].slice(-10);
      setKeySequence(newSequence);

      // Check for Konami Code
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
      if (newSequence.length >= 10 && 
          newSequence.slice(-10).every((key, index) => key === konamiCode[index])) {
        validateEasterEgg('konami', konamiCode);
      }

      // Check for "watson" typing
      const watsonSequence = ['KeyW', 'KeyA', 'KeyT', 'KeyS', 'KeyO', 'KeyN'];
      if (newSequence.length >= 6 &&
          newSequence.slice(-6).every((key, index) => key === watsonSequence[index])) {
        validateEasterEgg('watson_keyword', ['w', 'a', 't', 's', 'o', 'n']);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence]);

  // Logo Triple Click Detection
  const handleLogoClick = useCallback(() => {
    const newSequence = [...clickSequence, 'click'].slice(-3);
    setClickSequence(newSequence);

    if (newSequence.length === 3 && newSequence.every(click => click === 'click')) {
      validateEasterEgg('logo_triple_click', ['click', 'click', 'click']);
      setClickSequence([]);
    }

    // Clear sequence after 2 seconds
    setTimeout(() => setClickSequence([]), 2000);
  }, [clickSequence]);

  // Dashboard Element Double Click
  const handleMetricDoubleClick = useCallback((metric: string) => {
    if (metric === 'leads' || metric === 'revenue') {
      const elementKey = `double_click_${metric}`;
      const currentSequence = easterEggState.activeSequences.get('double_click_metrics') || [];
      const newSequence = [...currentSequence, elementKey];

      if (newSequence.length === 2 && 
          newSequence.includes('double_click_leads') && 
          newSequence.includes('double_click_revenue')) {
        validateEasterEgg('double_click_metrics', newSequence);
        easterEggState.activeSequences.delete('double_click_metrics');
      } else {
        easterEggState.activeSequences.set('double_click_metrics', newSequence);
      }
    }
  }, [easterEggState.activeSequences]);

  // Navigation Hover Pattern
  const handleNavHover = useCallback((navItem: string) => {
    const newSequence = [...hoverSequence, `hover_${navItem}`].slice(-5);
    setHoverSequence(newSequence);

    const expectedPattern = ['hover_jdd', 'hover_dwc', 'hover_traxovo', 'hover_dwai', 'hover_jdd'];
    if (newSequence.length === 5 && 
        newSequence.every((item, index) => item === expectedPattern[index])) {
      validateEasterEgg('nav_hover_pattern', expectedPattern);
      setHoverSequence([]);
    }
  }, [hoverSequence]);

  // Fibonacci Trading Input Detection
  const checkFibonacciSequence = useCallback((values: number[]) => {
    const fibonacci = [1, 1, 2, 3, 5, 8, 13];
    if (values.length === 7 && values.every((val, index) => val === fibonacci[index])) {
      validateEasterEgg('fibonacci_trading', fibonacci);
    }
  }, []);

  // Validate Easter Egg with Backend
  const validateEasterEgg = async (eggKey: string, sequence: any[]) => {
    try {
      const userId = 'quantum_user_' + Date.now();
      const response = await apiRequest('/api/quantum/validate-sequence', {
        method: 'POST',
        body: { eggKey, sequence, userId }
      });

      if (response.activated && response.reward) {
        setEasterEggState(prev => ({
          ...prev,
          unlockedRewards: [...prev.unlockedRewards, response.reward],
          quantumMode: response.reward.reward === 'quantum_mode_unlocked' ? true : prev.quantumMode,
          developerConsole: response.reward.reward === 'developer_console' ? true : prev.developerConsole
        }));

        // Trigger visual effects
        triggerQuantumEffect(response.reward);
      }
    } catch (error) {
      console.log('Easter egg validation in progress...');
    }
  };

  // Trigger Visual Quantum Effects
  const triggerQuantumEffect = (reward: QuantumReward) => {
    // Create quantum particle effect
    const particles = document.createElement('div');
    particles.className = 'quantum-particles';
    particles.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
      animation: quantumPulse 2s ease-out;
    `;

    document.body.appendChild(particles);

    // Show reward notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: quantumSlideIn 0.5s ease-out;
        max-width: 300px;
      ">
        <div style="font-size: 24px; margin-bottom: 8px;">${reward.icon}</div>
        <div style="font-weight: bold; margin-bottom: 4px;">${reward.title}</div>
        <div style="font-size: 14px; opacity: 0.9;">${reward.description}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Add quantum CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes quantumPulse {
        0% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(1); }
      }
      @keyframes quantumSlideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      .quantum-mode {
        filter: hue-rotate(180deg) saturate(1.2);
        transition: all 0.3s ease;
      }
      .quantum-mode:hover {
        box-shadow: 0 0 20px rgba(59,130,246,0.5);
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    setTimeout(() => {
      particles.remove();
      notification.remove();
    }, 3000);
  };

  // Generate Quantum State
  const generateQuantumState = async () => {
    try {
      const response = await apiRequest('/api/quantum/generate-state');
      return response;
    } catch (error) {
      console.log('Quantum state generation in progress...');
      return null;
    }
  };

  // Watson AGI Interaction
  const interactWithWatson = async (message: string) => {
    try {
      const userId = 'quantum_user_' + Date.now();
      const response = await apiRequest('/api/quantum/watson-interaction', {
        method: 'POST',
        body: { message, userId }
      });
      return response;
    } catch (error) {
      console.log('Watson AGI interaction in progress...');
      return null;
    }
  };

  return {
    easterEggState,
    handleLogoClick,
    handleMetricDoubleClick,
    handleNavHover,
    checkFibonacciSequence,
    generateQuantumState,
    interactWithWatson,
    unlockedRewards: easterEggState.unlockedRewards,
    quantumMode: easterEggState.quantumMode,
    developerConsole: easterEggState.developerConsole
  };
};