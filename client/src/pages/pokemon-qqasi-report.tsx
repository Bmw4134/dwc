import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Shield, TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface QQASIReport {
  collection_value: {
    total_market_value: number;
    total_cards: number;
    average_card_value: number;
    high_value_cards: number;
    premium_percentage: number;
  };
  negotiation_power: {
    recommended_minimum_offer: number;
    walk_away_threshold: number;
    negotiation_leverage: 'high' | 'medium' | 'low';
    market_position: string;
  };
  qqasi_analytics: {
    ai_confidence: number;
    market_trend_analysis: string;
    rarity_distribution: any[];
    value_distribution: any[];
    condition_impact: any[];
  };
  executive_summary: {
    key_insights: string[];
    action_items: string[];
    risk_assessment: string;
    opportunity_score: number;
  };
}

interface PokemonQQASIReportProps {
  bulkResults: any[];
  negotiationThreshold: number;
  setNegotiationThreshold: (value: number) => void;
}

export default function PokemonQQASIReport({ bulkResults = [], negotiationThreshold = 70, setNegotiationThreshold }: PokemonQQASIReportProps) {
  const [qqasiReport, setQqasiReport] = useState<QQASIReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQQASIReport = async () => {
    if (!bulkResults.length) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/pokemon/qqasi-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cards: bulkResults,
          negotiation_threshold: negotiationThreshold
        })
      });
      
      const report = await response.json();
      setQqasiReport(report);
    } catch (error) {
      console.error('QQASI analysis failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (bulkResults.length > 0) {
      generateQQASIReport();
    }
  }, [bulkResults, negotiationThreshold]);

  if (!qqasiReport) {
    return (
      <Card className="bg-slate-800/90 border-slate-700">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-2">QQASI Excellence Analysis</h3>
          <p className="text-slate-300">Upload your Pokemon cards to generate enterprise-grade negotiation insights</p>
          {isGenerating && (
            <div className="mt-4">
              <Progress value={75} className="h-2" />
              <p className="text-sm text-blue-400 mt-2">Generating QQASI report...</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getNegotiationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getOfferPercentage = (offerAmount: number) => {
    return ((offerAmount / qqasiReport.collection_value.total_market_value) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Executive Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 md:p-6 border border-blue-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">QQASI Excellence Report</h2>
              <p className="text-blue-300">Quantum Quantified ASI Intelligence - Executive Summary</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
            AI Confidence: {qqasiReport.qqasi_analytics.ai_confidence}%
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Total Value</span>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">${qqasiReport.collection_value.total_market_value.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{qqasiReport.collection_value.total_cards} cards</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Minimum Offer</span>
              <Target className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">${qqasiReport.negotiation_power.recommended_minimum_offer.toFixed(2)}</p>
            <p className="text-xs text-blue-300">{getOfferPercentage(qqasiReport.negotiation_power.recommended_minimum_offer)}% of market value</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Walk Away At</span>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">${qqasiReport.negotiation_power.walk_away_threshold.toFixed(2)}</p>
            <p className="text-xs text-yellow-300">{getOfferPercentage(qqasiReport.negotiation_power.walk_away_threshold)}% threshold</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Leverage</span>
              <Shield className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400 capitalize">{qqasiReport.negotiation_power.negotiation_leverage}</p>
            <p className="text-xs text-purple-300">Opportunity Score: {qqasiReport.executive_summary.opportunity_score}%</p>
          </div>
        </div>
      </motion.div>

      {/* Negotiation Threshold Control */}
      <Card className="bg-slate-800/90 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-400" />
            <span>Negotiation Strategy Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-300">Minimum Acceptable Offer Percentage</label>
              <span className="text-xl font-bold text-blue-400">{negotiationThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={negotiationThreshold}
              onChange={(e) => setNegotiationThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>50% (Desperate)</span>
              <span>70% (Reasonable)</span>
              <span>85% (Strong)</span>
              <span>95% (Premium)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
              <p className="text-red-300 font-semibold">Below {negotiationThreshold}%</p>
              <p className="text-red-400 text-sm">Walk away immediately</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
              <p className="text-yellow-300 font-semibold">{negotiationThreshold}% - {negotiationThreshold + 10}%</p>
              <p className="text-yellow-400 text-sm">Negotiate aggressively</p>
            </div>
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
              <p className="text-green-300 font-semibold">Above {negotiationThreshold + 10}%</p>
              <p className="text-green-400 text-sm">Consider the offer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="insights" className="text-slate-300 data-[state=active]:text-white">Key Insights</TabsTrigger>
          <TabsTrigger value="distribution" className="text-slate-300 data-[state=active]:text-white">Value Distribution</TabsTrigger>
          <TabsTrigger value="market" className="text-slate-300 data-[state=active]:text-white">Market Analysis</TabsTrigger>
          <TabsTrigger value="strategy" className="text-slate-300 data-[state=active]:text-white">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Executive Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {qqasiReport.executive_summary.key_insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-200 text-sm">{insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Action Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {qqasiReport.executive_summary.action_items.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-900/20 rounded-lg">
                    <Target className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-200 text-sm">{action}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={qqasiReport.qqasi_analytics.value_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qqasiReport.qqasi_analytics.value_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/90 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Rarity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={qqasiReport.qqasi_analytics.rarity_distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Market Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <p className="text-blue-300 text-lg font-semibold mb-2">Current Market Position</p>
                <p className="text-slate-200">{qqasiReport.qqasi_analytics.market_trend_analysis}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Negotiation Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Risk Assessment</h4>
                <p className="text-slate-200">{qqasiReport.executive_summary.risk_assessment}</p>
              </div>
              
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Market Position</h4>
                <p className="text-slate-200">{qqasiReport.negotiation_power.market_position}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}