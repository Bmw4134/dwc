import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Brain, 
  Zap, 
  TrendingUp, 
  Lock, 
  Crown, 
  Star,
  ChevronRight,
  Play,
  Pause
} from "lucide-react";

interface DemoTier {
  name: string;
  icon: any;
  color: string;
  features: string[];
  metrics: any;
}

export function InteractiveDemo({ onClose }: { onClose: () => void }) {
  const [currentTier, setCurrentTier] = useState('demo');
  const [liveData, setLiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics');
        if (response.ok) {
          const data = await response.json();
          setLiveData(data);
        }
      } catch (error) {
        console.log('Using demo data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const tiers: Record<string, DemoTier> = {
    demo: {
      name: 'Demo Tier',
      icon: Play,
      color: 'blue',
      features: [
        'Basic lead discovery (2 leads/day)',
        'Standard AI insights',
        'Weekly reports',
        'Email support'
      ],
      metrics: {
        leads: Math.min(liveData?.totalLeads || 2, 2),
        pipeline: 50000,
        automation: 60
      }
    },
    plus: {
      name: 'Plus Tier',
      icon: Star,
      color: 'purple',
      features: [
        'Enhanced lead discovery (10 leads/day)',
        'Advanced AI analytics',
        'Real-time notifications',
        'Priority support',
        'Custom integrations'
      ],
      metrics: {
        leads: Math.min(liveData?.totalLeads || 4, 10),
        pipeline: liveData?.totalPipelineValue || 1500000,
        automation: 85
      }
    },
    pro: {
      name: 'Pro Tier',
      icon: Crown,
      color: 'emerald',
      features: [
        'Unlimited lead discovery',
        'NEXUS Visual Intelligence',
        'Quantum behavior simulation',
        'Watson AI integration',
        'Multi-industry scanning',
        'Dedicated account manager'
      ],
      metrics: {
        leads: liveData?.totalLeads || 25,
        pipeline: liveData?.totalPipelineValue || 2660000,
        automation: 100
      }
    },
    enterprise: {
      name: 'Enterprise',
      icon: Lock,
      color: 'gold',
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'White-label solutions',
        'API access',
        'On-premise deployment',
        'SLA guarantee',
        '24/7 dedicated support'
      ],
      metrics: {
        leads: (liveData?.totalLeads || 25) * 3,
        pipeline: (liveData?.totalPipelineValue || 2660000) * 2,
        automation: 100
      }
    }
  };

  const currentTierData = tiers[currentTier];
  const IconComponent = currentTierData.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900 rounded-2xl max-w-7xl w-full h-[90vh] overflow-hidden shadow-2xl border border-emerald-500/30">
        
        {/* Header */}
        <div className="bg-black/40 p-6 border-b border-emerald-500/30">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                DWC Systems Live Demo
              </h2>
              <p className="text-emerald-300">Interactive Platform Demonstration</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnimating(!animating)}
                className="border-emerald-500/50 text-emerald-400"
              >
                {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {animating ? 'Pause' : 'Play'}
              </Button>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="p-6 border-b border-emerald-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tiers).map(([key, tier]) => {
              const TierIcon = tier.icon;
              return (
                <button
                  key={key}
                  onClick={() => setCurrentTier(key)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    currentTier === key 
                      ? `border-${tier.color}-500 bg-${tier.color}-500/20` 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <TierIcon className={`w-8 h-8 mx-auto mb-2 text-${tier.color}-400`} />
                  <div className={`text-sm font-semibold text-${tier.color}-400`}>
                    {tier.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Demo Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Live Metrics Panel */}
            <div className="space-y-6">
              <div className="bg-black/30 rounded-xl p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-emerald-400 flex items-center">
                    <IconComponent className="w-6 h-6 mr-2" />
                    {currentTierData.name} Metrics
                  </h3>
                  {animating && (
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold text-${currentTierData.color}-400`}>
                      {currentTierData.metrics.leads}
                    </div>
                    <div className="text-gray-300 text-sm">Active Leads</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold text-${currentTierData.color}-400`}>
                      ${(currentTierData.metrics.pipeline / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-gray-300 text-sm">Pipeline</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold text-${currentTierData.color}-400`}>
                      {currentTierData.metrics.automation}%
                    </div>
                    <div className="text-gray-300 text-sm">Automation</div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-400 mb-4">
                  {currentTierData.name} Features
                </h3>
                <div className="space-y-3">
                  {currentTierData.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <ChevronRight className={`w-4 h-4 mr-2 text-${currentTierData.color}-400`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Lead Portfolio */}
            <div className="space-y-6">
              {currentTier !== 'demo' && liveData?.realLeads && (
                <div className="bg-black/30 rounded-xl p-6 border border-blue-500/30">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">
                    Live Lead Portfolio
                  </h3>
                  <div className="space-y-3">
                    {liveData.realLeads.slice(0, currentTierData.metrics.leads).map((lead: any, index: number) => {
                      const colors = ['green-400', 'yellow-400', 'blue-400', 'purple-400'];
                      const color = colors[index % colors.length];
                      const value = lead.value >= 1000000 ? 
                        `$${(lead.value / 1000000).toFixed(1)}M` : 
                        `$${(lead.value / 1000).toFixed(0)}K`;
                      
                      return (
                        <div key={index} className={`border-l-4 border-${color} pl-4 py-2`}>
                          <div className={`font-semibold text-${color}`}>{lead.name}</div>
                          <div className="text-gray-300 text-sm">{value} - {lead.status}</div>
                          <div className="text-gray-400 text-xs">{lead.industry}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Demonstration */}
              <div className="bg-black/30 rounded-xl p-6 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">
                  AI Intelligence Demo
                </h3>
                <div className="space-y-4">
                  <div className="bg-emerald-900/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Brain className="w-5 h-5 mr-2 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">NEXUS Analysis</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {currentTier === 'demo' 
                        ? "Basic lead scoring available in demo tier"
                        : `Advanced pattern recognition identified ${currentTierData.metrics.leads} high-value prospects with 97.3% confidence rating`
                      }
                    </p>
                  </div>
                  
                  <div className="bg-blue-900/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Zap className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="text-blue-400 font-semibold">Automation Status</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {currentTier === 'demo' 
                        ? "Manual processes with basic automation"
                        : `${currentTierData.metrics.automation}% automated lead processing with quantum behavior simulation`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-8 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl p-6 border border-emerald-400/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                Experience the Full Platform
              </h3>
              <p className="text-gray-300 mb-4">
                {currentTier === 'demo' 
                  ? "Upgrade to unlock unlimited lead discovery and advanced AI capabilities"
                  : `Current tier: ${currentTierData.name} - Showing live business data`
                }
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => window.location.href = '/dwc-login'}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                >
                  Access Live Platform
                </Button>
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-400 text-gray-300"
                >
                  Close Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}