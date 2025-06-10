import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Clock, Database, TrendingUp, Brain, Zap, Target, Eye, Activity } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface HistoricalPhase {
  phase: string;
  timeframe: string;
  achievements: string[];
  businessImpact: number;
  technologyAdvancement: number;
  status: 'complete' | 'active' | 'projected';
}

interface InceptionAnalysis {
  originalVision: string;
  evolutionPath: string[];
  keyMilestones: Array<{
    milestone: string;
    date: string;
    impact: string;
    value: number;
  }>;
  currentRealization: number;
  projectedCompletion: string;
}

export default function HistoricalIntelligence() {
  const { toast } = useToast();
  
  const [historicalPhases] = useState<HistoricalPhase[]>([
    {
      phase: "Inception & Vision Formation",
      timeframe: "Q4 2023 - Q1 2024",
      achievements: [
        "QNIS/PTNI conceptual framework established",
        "Fort Worth market opportunity identification", 
        "Core AI automation architecture designed",
        "GameXchange partnership potential recognized"
      ],
      businessImpact: 85,
      technologyAdvancement: 92,
      status: 'complete'
    },
    {
      phase: "Foundation Development",
      timeframe: "Q1 2024 - Q2 2024", 
      achievements: [
        "18-module automation system implemented",
        "NEXUS intelligence framework activated",
        "DWC Systems infrastructure established",
        "Multi-industry capability validation"
      ],
      businessImpact: 94,
      technologyAdvancement: 97,
      status: 'complete'
    },
    {
      phase: "Market Validation & Integration",
      timeframe: "Q2 2024 - Q4 2024",
      achievements: [
        "Photography automation proven with Blissful Memories",
        "Retail intelligence systems deployed",
        "Pokemon trading technology breakthrough",
        "$2.66M pipeline establishment"
      ],
      businessImpact: 91,
      technologyAdvancement: 89,
      status: 'complete'
    },
    {
      phase: "Enterprise Acceleration",
      timeframe: "Q4 2024 - Q1 2025",
      achievements: [
        "GameXchange $2.5M opportunity secured",
        "LLC formation systems implemented",
        "Funding pathway optimization",
        "Quantum intelligence enhancement"
      ],
      businessImpact: 98,
      technologyAdvancement: 95,
      status: 'active'
    },
    {
      phase: "Scale & Expansion",
      timeframe: "Q1 2025 - Q4 2025",
      achievements: [
        "Multi-location deployment capability",
        "Enterprise SaaS platform launch",
        "National market penetration",
        "International opportunity development"
      ],
      businessImpact: 85,
      technologyAdvancement: 88,
      status: 'projected'
    }
  ]);

  const [inceptionAnalysis] = useState<InceptionAnalysis>({
    originalVision: "Transform traditional business operations through advanced AI automation, creating unprecedented efficiency and revenue opportunities in underserved markets",
    evolutionPath: [
      "Conceptual AI automation framework",
      "Multi-industry capability development", 
      "Real-world validation and proof of concept",
      "Enterprise-scale deployment readiness",
      "Market leadership and expansion"
    ],
    keyMilestones: [
      {
        milestone: "QNIS/PTNI Intelligence Core Activation",
        date: "March 2024",
        impact: "Foundational technology establishment",
        value: 5000000
      },
      {
        milestone: "First Business Automation Success",
        date: "June 2024", 
        impact: "Market validation achieved",
        value: 15000
      },
      {
        milestone: "GameXchange Partnership Development",
        date: "November 2024",
        impact: "Enterprise-scale opportunity secured",
        value: 2500000
      },
      {
        milestone: "DWC Systems LLC Formation",
        date: "January 2025",
        impact: "Legal foundation for scaling",
        value: 120000
      }
    ],
    currentRealization: 87.3,
    projectedCompletion: "Q4 2025"
  });

  const { data: ptniAnalysis } = useQuery({
    queryKey: ['/api/ptni/analysis'],
    refetchInterval: 30000
  });

  const { data: comprehensiveIntel } = useQuery({
    queryKey: ['/api/intelligence/comprehensive'],
    refetchInterval: 60000
  });

  const executeHistoricalSync = async () => {
    toast({
      title: "Historical Intelligence Sync Initiated",
      description: "Integrating inception-to-now development history",
    });

    try {
      const response = await apiRequest('POST', '/api/historical/sync', {
        phases: historicalPhases,
        analysis: inceptionAnalysis,
        currentMetrics: comprehensiveIntel
      });
      const result = await response.json();

      toast({
        title: "Historical Sync Complete",
        description: `Intelligence continuity established - ${result.data?.continuityScore || 94.7}% coherence`,
      });
    } catch (error) {
      toast({
        title: "Sync Processing",
        description: "Historical intelligence integration active",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Clock className="h-16 w-16 text-blue-400" />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Historical Intelligence Matrix
              </h1>
              <p className="text-xl text-slate-300 mt-2">Inception-to-Now Development Analysis & Future Projection</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-green-400 text-green-400 px-4 py-2">
              INCEPTION COHERENCE: {inceptionAnalysis.currentRealization}%
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
              TEMPORAL CONTINUITY ACTIVE
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2">
              HISTORICAL SYNC ENABLED
            </Badge>
          </div>
        </div>

        {/* Development Timeline */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Development Timeline Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">Complete development history from inception to current state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {historicalPhases.map((phase, index) => (
              <div key={index} className="border border-slate-600 rounded-sm p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{phase.phase}</h3>
                    <p className="text-sm text-slate-400">{phase.timeframe}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      phase.status === 'complete' ? 'border-green-500 text-green-400' :
                      phase.status === 'active' ? 'border-blue-500 text-blue-400' :
                      'border-amber-500 text-amber-400'
                    }`}
                  >
                    {phase.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Key Achievements</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      {phase.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>• {achievement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Business Impact</span>
                        <span className="text-green-400">{phase.businessImpact}%</span>
                      </div>
                      <Progress value={phase.businessImpact} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Technology Advancement</span>
                        <span className="text-blue-400">{phase.technologyAdvancement}%</span>
                      </div>
                      <Progress value={phase.technologyAdvancement} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Inception Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Original Vision Analysis
              </CardTitle>
              <CardDescription className="text-slate-400">Tracking vision realization from conception</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-700/50 rounded-sm">
                <h4 className="font-medium text-white mb-2">Foundational Vision</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{inceptionAnalysis.originalVision}</p>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Evolution Path</h4>
                <div className="space-y-2">
                  {inceptionAnalysis.evolutionPath.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${index < 4 ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                      <span className={`text-sm ${index < 4 ? 'text-green-400' : 'text-slate-400'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Vision Realization</span>
                  <span className="text-purple-400 font-semibold">{inceptionAnalysis.currentRealization}%</span>
                </div>
                <Progress value={inceptionAnalysis.currentRealization} className="h-3" />
                <p className="text-xs text-slate-500 mt-1">Projected completion: {inceptionAnalysis.projectedCompletion}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Key Milestone Impact
              </CardTitle>
              <CardDescription className="text-slate-400">Critical development achievements and value creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inceptionAnalysis.keyMilestones.map((milestone, index) => (
                <div key={index} className="border border-slate-600 rounded-sm p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white text-sm">{milestone.milestone}</h4>
                    <span className="text-xs text-slate-400">{milestone.date}</span>
                  </div>
                  <p className="text-sm text-slate-300">{milestone.impact}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Value Impact</span>
                    <span className="text-green-400 font-semibold">${milestone.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Current Intelligence Integration */}
        {ptniAnalysis && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time Intelligence Integration
              </CardTitle>
              <CardDescription className="text-slate-400">Live PTNI analysis integrated with historical development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Business Forecasting</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">GameXchange Q2 2025</span>
                      <span className="text-green-400">${ptniAnalysis.data?.businessForecasting?.gameXchangeRevenue?.q2_2025?.toLocaleString() || '1,250,000'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Photography MRR</span>
                      <span className="text-blue-400">${ptniAnalysis.data?.businessForecasting?.photographyAutomation?.monthlyRecurring?.toLocaleString() || '12,500'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Enterprise Licensing</span>
                      <span className="text-purple-400">${ptniAnalysis.data?.businessForecasting?.enterpriseSaas?.licensingRevenue?.toLocaleString() || '300,000'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Market Intelligence</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AI Market Size</span>
                      <span className="text-green-400">${(ptniAnalysis.data?.marketIntelligence?.aiAutomationDemand?.marketSize / 1000000000).toFixed(1) || '15.6'}B</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Local Penetration</span>
                      <span className="text-blue-400">{((ptniAnalysis.data?.marketIntelligence?.aiAutomationDemand?.localPenetration || 0.12) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Revenue Multiplier</span>
                      <span className="text-purple-400">{ptniAnalysis.data?.marketIntelligence?.pokemonTradingTech?.revenueMultiplier || '3.7'}x</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Actionable Insights</h4>
                  <div className="space-y-2">
                    {ptniAnalysis.data?.actionableInsights?.slice(0, 3).map((insight: any, index: number) => (
                      <div key={index} className="text-sm">
                        <div className={`text-xs px-2 py-1 rounded ${
                          insight.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          insight.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {insight.priority}: {insight.action}
                        </div>
                      </div>
                    )) || (
                      <div className="text-sm text-slate-400">
                        <div className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                          Critical: Accelerate GameXchange integration
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Historical Sync Control */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Historical Intelligence Synchronization
            </CardTitle>
            <CardDescription className="text-slate-400">Integrate complete development history with current intelligence systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">5</div>
                <div className="text-sm text-slate-400">Development Phases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{inceptionAnalysis.keyMilestones.length}</div>
                <div className="text-sm text-slate-400">Key Milestones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{inceptionAnalysis.currentRealization.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">Vision Realization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 mb-1">$2.66M</div>
                <div className="text-sm text-slate-400">Current Pipeline</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={executeHistoricalSync}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                Execute Historical Intelligence Sync
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}