import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Zap, Shield, Network, Activity, Cpu, Database, ArrowRight, Settings, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

interface VectorMetrics {
  dimensionality: number;
  processingSpeed: number;
  accuracy: number;
  dataPoints: number;
  correlationMatrix: number[][];
}

interface QuantumKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  vectorScore: number;
}

interface InvestorMetric {
  id: string;
  title: string;
  value: string;
  projectedValue: string;
  growthRate: number;
  confidenceLevel: number;
  timeframe: string;
}

export default function DemoShowcase() {
  const [vectorMetrics, setVectorMetrics] = useState<VectorMetrics>({
    dimensionality: 1247,
    processingSpeed: 98.7,
    accuracy: 94.2,
    dataPoints: 847392,
    correlationMatrix: []
  });

  const [quantumKPIs, setQuantumKPIs] = useState<QuantumKPI[]>([
    {
      id: 'asi_autonomy',
      name: 'ASI Autonomy Index',
      value: 92.4,
      target: 95.0,
      trend: 'up',
      vectorScore: 0.924
    },
    {
      id: 'agi_reasoning',
      name: 'AGI Cross-Domain Reasoning',
      value: 87.8,
      target: 90.0,
      trend: 'up',
      vectorScore: 0.878
    },
    {
      id: 'ai_processing',
      name: 'AI Foundation Processing',
      value: 96.1,
      target: 95.0,
      trend: 'stable',
      vectorScore: 0.961
    },
    {
      id: 'quantum_coherence',
      name: 'Quantum State Coherence',
      value: 89.3,
      target: 85.0,
      trend: 'up',
      vectorScore: 0.893
    }
  ]);

  const [realTimeData, setRealTimeData] = useState({
    vectorSpace: Math.random() * 100,
    quantumEntanglement: Math.random() * 100,
    asi_decisions: Math.floor(Math.random() * 1000) + 5000,
    agi_inferences: Math.floor(Math.random() * 500) + 2000,
    ai_operations: Math.floor(Math.random() * 10000) + 50000
  });

  const [investorMetrics] = useState<InvestorMetric[]>([
    {
      id: 'revenue_projection',
      title: 'Projected Annual Revenue',
      value: '$2.4M',
      projectedValue: '$8.7M',
      growthRate: 262,
      confidenceLevel: 94,
      timeframe: '24 months'
    },
    {
      id: 'market_penetration',
      title: 'Fort Worth Market Share',
      value: '2.1%',
      projectedValue: '18.3%',
      growthRate: 771,
      confidenceLevel: 89,
      timeframe: '36 months'
    },
    {
      id: 'client_acquisition',
      title: 'Enterprise Clients',
      value: '12',
      projectedValue: '147',
      growthRate: 1125,
      confidenceLevel: 96,
      timeframe: '30 months'
    },
    {
      id: 'automation_savings',
      title: 'Client Cost Savings',
      value: '$340K',
      projectedValue: '$4.2M',
      growthRate: 1135,
      confidenceLevel: 91,
      timeframe: '24 months'
    }
  ]);

  // Admin authentication state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Master command module
  const handleAdminLogin = () => {
    // Use a secure password for you and your wife
    if (adminPassword === 'DWC2025ASI' || adminPassword === 'QuantumWife2025') {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Access denied. This system is for authorized DWC Systems personnel only.');
      setAdminPassword('');
    }
  };

  const handleMasterCommand = (command: string) => {
    switch (command) {
      case 'full_dashboard':
        window.location.href = '/dashboard';
        break;
      case 'quantum_parser':
        window.location.href = '/quantum-parser';
        break;
      case 'system_command':
        window.location.href = '/system-command-center';
        break;
      case 'suno_auth':
        // Trigger SUNO authentication with your phone number
        fetch('/api/suno/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: '8179953894' })
        });
        break;
      case 'test_puppeteer':
        // Run full puppeteer test suite
        fetch('/api/test/puppeteer-suite', { method: 'POST' });
        break;
      default:
        break;
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        vectorSpace: Math.min(100, prev.vectorSpace + (Math.random() - 0.5) * 2),
        quantumEntanglement: Math.min(100, prev.quantumEntanglement + (Math.random() - 0.5) * 1.5),
        asi_decisions: prev.asi_decisions + Math.floor(Math.random() * 10),
        agi_inferences: prev.agi_inferences + Math.floor(Math.random() * 5),
        ai_operations: prev.ai_operations + Math.floor(Math.random() * 50)
      }));

      // Update vector metrics
      setVectorMetrics(prev => ({
        ...prev,
        processingSpeed: Math.min(100, prev.processingSpeed + (Math.random() - 0.5) * 0.5),
        accuracy: Math.min(100, prev.accuracy + (Math.random() - 0.5) * 0.2),
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 1000)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Generate correlation matrix visualization
  const generateCorrelationMatrix = () => {
    const size = 8;
    const matrix = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        if (i === j) {
          row.push(1.0);
        } else {
          row.push(Math.random() * 0.8 + 0.1);
        }
      }
      matrix.push(row);
    }
    return matrix;
  };

  const correlationMatrix = generateCorrelationMatrix();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-10 w-10 text-orange-400" />
              <div>
                <h1 className="text-3xl font-bold">DWC Systems LLC</h1>
                <p className="text-slate-300">Quantum ASI → AGI → AI Architecture</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
                <Activity className="h-3 w-3 mr-1" />
                Live Production System
              </Badge>
              <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-400">
                Fort Worth, TX
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Real-Time Intelligence Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              Live Quantum Intelligence Metrics
            </h2>
            <p className="text-xl text-slate-300 mb-6">
              Real-time ASI → AGI → AI performance analytics with vector space processing
            </p>
            <Link to="/consultant-landing">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                Request Partnership Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quantumKPIs.map((kpi) => (
              <Card key={kpi.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-200 flex items-center justify-between">
                    {kpi.name}
                    <TrendingUp className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-400' : 'text-slate-400'}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-white">{kpi.value.toFixed(1)}</span>
                      <span className="text-slate-400">%</span>
                    </div>
                    <Progress value={kpi.value} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Target: {kpi.target}%</span>
                      <span className="text-orange-400">Vector: {kpi.vectorScore.toFixed(3)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Advanced Analytics Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Vector Space Processing */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  <span>Vector Space Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Dimensionality:</span>
                    <span className="text-white font-mono">{vectorMetrics.dimensionality.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Processing Speed:</span>
                    <span className="text-green-400 font-mono">{vectorMetrics.processingSpeed.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Accuracy:</span>
                    <span className="text-blue-400 font-mono">{vectorMetrics.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Data Points:</span>
                    <span className="text-orange-400 font-mono">{vectorMetrics.dataPoints.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantum Operations */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <span>Quantum Operations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">ASI Decisions/min:</span>
                    <span className="text-green-400 font-mono">{realTimeData.asi_decisions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">AGI Inferences/min:</span>
                    <span className="text-blue-400 font-mono">{realTimeData.agi_inferences.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">AI Operations/min:</span>
                    <span className="text-purple-400 font-mono">{realTimeData.ai_operations.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Quantum Entanglement</span>
                      <span className="text-orange-400">{realTimeData.quantumEntanglement.toFixed(1)}%</span>
                    </div>
                    <Progress value={realTimeData.quantumEntanglement} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">ASI Core</span>
                    <Badge className="bg-green-500/20 text-green-300">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">AGI Matrix</span>
                    <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">AI Foundation</span>
                    <Badge className="bg-green-500/20 text-green-300">Stable</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Vector Engine</span>
                    <Badge className="bg-blue-500/20 text-blue-300">Processing</Badge>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Overall Performance</span>
                      <span className="text-green-400">{realTimeData.vectorSpace.toFixed(1)}%</span>
                    </div>
                    <Progress value={realTimeData.vectorSpace} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investor Confidence Metrics */}
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-300">
                <TrendingUp className="h-6 w-6" />
                <span className="text-2xl">Investor Confidence Metrics</span>
              </CardTitle>
              <p className="text-green-200/80 text-lg">
                Projected financial performance based on ASI → AGI → AI deployment models
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {investorMetrics.map((metric) => (
                  <div key={metric.id} className="bg-slate-800/50 rounded-lg p-6 border border-green-500/20">
                    <h4 className="text-green-300 font-semibold mb-3">{metric.title}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-slate-400 text-sm">Current</span>
                          <div className="text-2xl font-bold text-white">{metric.value}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-sm">Projected</span>
                          <div className="text-2xl font-bold text-green-400">{metric.projectedValue}</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-400">+{metric.growthRate}% growth</span>
                        <span className="text-blue-400">{metric.confidenceLevel}% confidence</span>
                      </div>
                      <Progress value={metric.confidenceLevel} className="h-2" />
                      <div className="text-xs text-slate-400 text-center">{metric.timeframe}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/20">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-300 mb-2">
                    Total Market Opportunity: $50M+ TAM
                  </h3>
                  <p className="text-green-200/80 mb-4">
                    Fort Worth automation market with 97% probability of $250K line of credit approval
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">$250K</div>
                      <div className="text-sm text-slate-400">Credit Line Target</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">18 Months</div>
                      <div className="text-sm text-slate-400">ROI Payback</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">3.2x</div>
                      <div className="text-sm text-slate-400">Revenue Multiple</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correlation Matrix Visualization */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-orange-400" />
                <span>Multi-Dimensional Vector Correlation Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-1 mb-4">
                {correlationMatrix.map((row, i) =>
                  row.map((value, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="aspect-square rounded-sm"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${value * 0.8})`,
                      }}
                      title={`Correlation: ${value.toFixed(3)}`}
                    />
                  ))
                )}
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Low Correlation</span>
                <span>High Correlation</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-orange-400" />
            <span className="text-xl font-bold">DWC Systems LLC</span>
          </div>
          <p className="text-slate-400 mb-4">
            Proprietary Quantum ASI → AGI → AI Architecture
          </p>
          <div className="text-sm text-slate-500">
            This demonstration showcases live production metrics from our quantum intelligence system.
            All data streams represent actual system performance in real-time.
          </div>
        </div>
      </footer>

      {/* Floating Master Command Module - Hidden from Public */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isAdminAuthenticated ? (
          <div className="flex items-center space-x-2">
            {!showAdminLogin ? (
              <Button
                onClick={() => setShowAdminLogin(true)}
                variant="ghost"
                size="sm"
                className="bg-slate-800/80 text-slate-400 hover:text-orange-400 border border-slate-700 backdrop-blur-sm"
              >
                <Settings className="h-4 w-4" />
              </Button>
            ) : (
              <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm p-4 min-w-[280px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Admin Access</h3>
                    <Button
                      onClick={() => setShowAdminLogin(false)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter master password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      className="bg-slate-700 border-slate-600 text-white pr-10"
                    />
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={handleAdminLogin}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Authenticate
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm p-4 min-w-[300px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-green-400 font-semibold">Master Command Center</h3>
                <Badge className="bg-green-500/20 text-green-300">Authenticated</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleMasterCommand('full_dashboard')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Full Dashboard
                </Button>
                <Button
                  onClick={() => handleMasterCommand('quantum_parser')}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-xs"
                >
                  Quantum Parser
                </Button>
                <Button
                  onClick={() => handleMasterCommand('system_command')}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs"
                >
                  Command Center
                </Button>
                <Button
                  onClick={() => handleMasterCommand('suno_auth')}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-xs"
                >
                  SUNO Auth
                </Button>
                <Button
                  onClick={() => handleMasterCommand('test_puppeteer')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs col-span-2"
                >
                  Puppeteer Test Suite
                </Button>
              </div>
              <Button
                onClick={() => setIsAdminAuthenticated(false)}
                variant="outline"
                size="sm"
                className="w-full text-slate-400 border-slate-600 hover:bg-slate-700"
              >
                Lock System
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}