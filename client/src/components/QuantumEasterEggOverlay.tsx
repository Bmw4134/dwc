import React, { useEffect, useState } from 'react';
import { useQuantumEasterEggs } from '@/hooks/useQuantumEasterEggs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Brain, Code, TrendingUp, Command } from 'lucide-react';

interface QuantumEasterEggOverlayProps {
  children: React.ReactNode;
}

export const QuantumEasterEggOverlay: React.FC<QuantumEasterEggOverlayProps> = ({ children }) => {
  const {
    easterEggState,
    handleLogoClick,
    handleMetricDoubleClick,
    handleNavHover,
    generateQuantumState,
    interactWithWatson,
    unlockedRewards,
    quantumMode,
    developerConsole
  } = useQuantumEasterEggs();

  const [showRewards, setShowRewards] = useState(false);
  const [watsonMessage, setWatsonMessage] = useState('');
  const [quantumState, setQuantumState] = useState<any>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythical': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'legendary': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-blue-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getRewardIcon = (id: string) => {
    switch (id) {
      case 'quantum_mode': return <Sparkles className="w-6 h-6" />;
      case 'developer_console': return <Code className="w-6 h-6" />;
      case 'golden_ratio_trading': return <TrendingUp className="w-6 h-6" />;
      case 'hidden_analytics': return <Brain className="w-6 h-6" />;
      case 'agi_interface': return <Zap className="w-6 h-6" />;
      case 'unified_dashboard': return <Command className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const handleQuantumStateGeneration = async () => {
    const state = await generateQuantumState();
    if (state) {
      setQuantumState(state);
    }
  };

  const handleWatsonInteraction = async () => {
    if (watsonMessage.trim()) {
      const response = await interactWithWatson(watsonMessage);
      if (response) {
        alert(`Watson AGI: ${response.watsonResponse}`);
        setWatsonMessage('');
      }
    }
  };

  // Apply quantum mode styling
  useEffect(() => {
    if (quantumMode) {
      document.body.classList.add('quantum-mode');
    } else {
      document.body.classList.remove('quantum-mode');
    }
  }, [quantumMode]);

  return (
    <div className="relative">
      {/* Quantum Mode Indicator */}
      {quantumMode && (
        <div className="fixed top-4 left-4 z-50">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white animate-pulse">
            <Sparkles className="w-4 h-4 mr-2" />
            Quantum Mode Active
          </Badge>
        </div>
      )}

      {/* Developer Console Indicator */}
      {developerConsole && (
        <div className="fixed top-4 left-40 z-50">
          <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <Code className="w-4 h-4 mr-2" />
            Dev Console
          </Badge>
        </div>
      )}

      {/* Rewards Display Toggle */}
      {unlockedRewards.length > 0 && (
        <Button
          onClick={() => setShowRewards(!showRewards)}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Rewards ({unlockedRewards.length})
        </Button>
      )}

      {/* Rewards Panel */}
      {showRewards && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Quantum Rewards Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unlockedRewards.map((reward, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-white ${getRarityColor(reward.rarity)}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getRewardIcon(reward.id)}
                    <div>
                      <h3 className="font-bold">{reward.name}</h3>
                      <Badge variant="outline" className="text-white border-white/30">
                        {reward.rarity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">{reward.description}</p>
                  {reward.timestamp && (
                    <p className="text-xs opacity-70 mt-2">
                      Unlocked: {new Date(reward.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
              <Button
                onClick={() => setShowRewards(false)}
                className="w-full mt-4"
                variant="outline"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Developer Console Panel */}
      {developerConsole && (
        <div className="fixed bottom-20 right-4 w-80 z-40">
          <Card className="bg-black/90 border-green-500 text-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code className="w-4 h-4" />
                Quantum Developer Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleQuantumStateGeneration}
                className="w-full bg-green-700 hover:bg-green-600 text-white"
                size="sm"
              >
                Generate Quantum State
              </Button>
              
              {quantumState && (
                <div className="text-xs bg-gray-800 p-2 rounded">
                  <div>State: {quantumState.quantumState}</div>
                  <div>Coherence: {quantumState.coherence?.toFixed(3)}</div>
                  <div>Entanglement: {quantumState.entanglement?.toFixed(3)}</div>
                </div>
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Message Watson AGI..."
                  value={watsonMessage}
                  onChange={(e) => setWatsonMessage(e.target.value)}
                  className="w-full bg-gray-800 border border-green-500 text-green-400 text-xs p-2 rounded"
                  onKeyPress={(e) => e.key === 'Enter' && handleWatsonInteraction()}
                />
                <Button
                  onClick={handleWatsonInteraction}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  Watson AGI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Children with Quantum Interactions */}
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          
          // Logo click detection
          if (target.closest('[data-logo]')) {
            handleLogoClick();
          }
          
          // Metric double click detection
          if (target.closest('[data-metric="leads"]')) {
            handleMetricDoubleClick('leads');
          }
          if (target.closest('[data-metric="revenue"]')) {
            handleMetricDoubleClick('revenue');
          }
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLElement;
          
          // Navigation hover detection
          if (target.closest('[data-nav="jdd"]')) {
            handleNavHover('jdd');
          }
          if (target.closest('[data-nav="dwc"]')) {
            handleNavHover('dwc');
          }
          if (target.closest('[data-nav="traxovo"]')) {
            handleNavHover('traxovo');
          }
          if (target.closest('[data-nav="dwai"]')) {
            handleNavHover('dwai');
          }
        }}
        className={quantumMode ? 'quantum-enhanced' : ''}
      >
        {children}
      </div>

      {/* Quantum CSS Styles */}
      <style>{`
        .quantum-mode {
          animation: quantumShimmer 3s ease-in-out infinite;
        }
        
        .quantum-enhanced {
          transition: all 0.3s ease;
        }
        
        .quantum-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
        }
        
        @keyframes quantumShimmer {
          0%, 100% { filter: hue-rotate(0deg) saturate(1); }
          25% { filter: hue-rotate(90deg) saturate(1.2); }
          50% { filter: hue-rotate(180deg) saturate(1.4); }
          75% { filter: hue-rotate(270deg) saturate(1.2); }
        }
        
        @keyframes quantumPulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        .quantum-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #3b82f6, transparent);
          border-radius: 50%;
          animation: quantumFloat 2s ease-in-out infinite;
        }
        
        @keyframes quantumFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
};