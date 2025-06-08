import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, Zap, TrendingUp, Target, Activity, Settings, Cpu, Network, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useIBMQuantumAnalytics } from '@/lib/quantum-ibm-integration';

export default function QuantumPredictiveAnalytics() {
  const [analysisData, setAnalysisData] = useState({
    marketData: [
      { month: 'Jan', revenue: 45000, volatility: 0.15, growth: 0.08 },
      { month: 'Feb', revenue: 52000, volatility: 0.12, growth: 0.15 },
      { month: 'Mar', revenue: 48000, volatility: 0.18, growth: -0.07 },
      { month: 'Apr', revenue: 58000, volatility: 0.10, growth: 0.20 },
      { month: 'May', revenue: 62000, volatility: 0.14, growth: 0.07 },
      { month: 'Jun', revenue: 67000, volatility: 0.09, growth: 0.08 }
    ],
    businessParams: {
      industry: 'technology',
      employees: 25,
      marketPosition: 'growth',
      riskTolerance: 0.6
    },
    portfolioData: {
      allocation: [0.4, 0.3, 0.2, 0.1],
      sectors: ['automation', 'consulting', 'development', 'training'],
      performance: [0.12, 0.08, 0.15, 0.05]
    },
    constraints: {
      maxRisk: 0.25,
      minReturn: 0.08,
      timeHorizon: 24
    }
  });

  const { runQuantumAnalysis, isProcessing, analysis, quantumMetrics } = useIBMQuantumAnalytics({
    backend: 'simulator',
    shots: 1024,
    optimization_level: 2,
    noise_model: false,
    error_mitigation: true
  });

  const [activeOptimizations, setActiveOptimizations] = useState({
    marketPrediction: true,
    riskAssessment: true,
    portfolioOptimization: true,
    scenarioAnalysis: true
  });

  const [quantumSettings, setQuantumSettings] = useState({
    coherenceTime: 85,
    entanglementDepth: 12,
    superpositionLevels: 8,
    processingPower: 95
  });

  useEffect(() => {
    // Auto-run analysis when component loads
    if (Object.values(activeOptimizations).some(Boolean)) {
      runQuantumAnalysis(analysisData);
    }
  }, []);

  const handleRunAnalysis = async () => {
    await runQuantumAnalysis(analysisData);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const portfolioData = analysisData.portfolioData.sectors.map((sector, index) => ({
    name: sector,
    value: analysisData.portfolioData.allocation[index] * 100,
    performance: analysisData.portfolioData.performance[index] * 100
  }));

  const scenarioData = analysis?.businessOutcomes?.map(scenario => ({
    name: scenario.scenario.substring(0, 15),
    likelihood: scenario.likelihood,
    impact: scenario.impact,
    accuracy: scenario.quantumAccuracy
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                IBM QISKIT QUANTUM PREDICTIVE ANALYTICS
              </h1>
              <p className="text-purple-300">ASI → AGI → AI Enhanced Business Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              QUANTUM ACTIVE
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {quantumMetrics.circuitsExecuted} Circuits Executed
            </Badge>
          </div>
        </div>

        {/* Quantum Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Quantum Advantage</p>
                  <p className="text-2xl font-bold text-purple-400">{quantumMetrics.quantumAdvantage.toFixed(1)}%</p>
                </div>
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <Progress value={quantumMetrics.quantumAdvantage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Coherence Time</p>
                  <p className="text-2xl font-bold text-blue-400">{quantumMetrics.coherenceTime}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
              <Progress value={quantumMetrics.coherenceTime * 10} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Fidelity Score</p>
                  <p className="text-2xl font-bold text-green-400">{quantumMetrics.fidelity.toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={quantumMetrics.fidelity} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Circuits Run</p>
                  <p className="text-2xl font-bold text-orange-400">{quantumMetrics.circuitsExecuted}</p>
                </div>
                <Cpu className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  <span>Quantum Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleRunAnalysis}
                  disabled={isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isProcessing ? 'Processing Quantum Analysis...' : 'Run Quantum Analysis'}
                </Button>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Coherence Time</span>
                      <span className="text-purple-400">{quantumSettings.coherenceTime}%</span>
                    </div>
                    <Slider
                      value={[quantumSettings.coherenceTime]}
                      onValueChange={(value) => setQuantumSettings(prev => ({ ...prev, coherenceTime: value[0] }))}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Entanglement Depth</span>
                      <span className="text-blue-400">{quantumSettings.entanglementDepth}</span>
                    </div>
                    <Slider
                      value={[quantumSettings.entanglementDepth]}
                      onValueChange={(value) => setQuantumSettings(prev => ({ ...prev, entanglementDepth: value[0] }))}
                      max={16}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Processing Power</span>
                      <span className="text-green-400">{quantumSettings.processingPower}%</span>
                    </div>
                    <Slider
                      value={[quantumSettings.processingPower]}
                      onValueChange={(value) => setQuantumSettings(prev => ({ ...prev, processingPower: value[0] }))}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(activeOptimizations).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setActiveOptimizations(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Trends Prediction */}
            {analysis?.marketTrends && (
              <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-300">
                    <TrendingUp className="h-5 w-5" />
                    <span>Market Prediction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Probability</span>
                        <span className="text-purple-400">{analysis.marketTrends.probability.toFixed(1)}%</span>
                      </div>
                      <Progress value={analysis.marketTrends.probability} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Confidence</span>
                        <span className="text-blue-400">{analysis.marketTrends.confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={analysis.marketTrends.confidence} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Quantum Advantage</span>
                        <span className="text-green-400">{analysis.marketTrends.quantumAdvantage.toFixed(1)}%</span>
                      </div>
                      <Progress value={analysis.marketTrends.quantumAdvantage} className="mt-1" />
                    </div>
                    <div className="text-center">
                      <Badge className="bg-purple-500/20 text-purple-300 mt-2">
                        Timeframe: {analysis.marketTrends.timeframe}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Charts and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="trends" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Trends</span>
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="flex items-center space-x-2">
                  <Network className="h-4 w-4" />
                  <span>Scenarios</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center space-x-2">
                  <PieChartIcon className="h-4 w-4" />
                  <span>Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="risk" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Risk</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Revenue Trends & Quantum Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analysisData.marketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} />
                        <Line type="monotone" dataKey="growth" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Quantum Business Scenario Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scenarioData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={scenarioData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                          <Bar dataKey="likelihood" fill="#8B5CF6" />
                          <Bar dataKey="impact" fill="#06B6D4" />
                          <Bar dataKey="accuracy" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        Run quantum analysis to see scenario predictions
                      </div>
                    )}
                  </CardContent>
                </Card>

                {analysis?.businessOutcomes && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.businessOutcomes.slice(0, 4).map((scenario, index) => (
                      <Card key={index} className="bg-slate-800/30 border-slate-600">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-white mb-2">{scenario.scenario}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Likelihood:</span>
                              <span className="text-purple-400">{scenario.likelihood.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Impact:</span>
                              <span className="text-blue-400">{scenario.impact.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Accuracy:</span>
                              <span className="text-green-400">{scenario.quantumAccuracy.toFixed(1)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Quantum Portfolio Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={portfolioData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {portfolioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {analysis?.optimization && (
                  <Card className="bg-slate-800/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-lg">Optimization Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Quantum Efficiency:</span>
                            <span className="text-green-400">{analysis.optimization.quantumEfficiency.toFixed(1)}%</span>
                          </div>
                          <Progress value={analysis.optimization.quantumEfficiency} className="mt-1" />
                        </div>
                        <div className="text-xs text-slate-400 mt-3">
                          Recommended allocation: {analysis.optimization.portfolioAllocation.map(a => a.toFixed(1)).join('%, ')}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Quantum Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis?.riskAssessment ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Volatility</span>
                            <span className="text-red-400">{analysis.riskAssessment.volatility.toFixed(1)}%</span>
                          </div>
                          <Progress value={analysis.riskAssessment.volatility} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Stability Index</span>
                            <span className="text-green-400">{analysis.riskAssessment.stabilityIndex.toFixed(1)}%</span>
                          </div>
                          <Progress value={analysis.riskAssessment.stabilityIndex} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Quantum Uncertainty</span>
                            <span className="text-yellow-400">{analysis.riskAssessment.quantumUncertainty.toFixed(1)}%</span>
                          </div>
                          <Progress value={analysis.riskAssessment.quantumUncertainty} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        Run quantum analysis to see risk assessment
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}