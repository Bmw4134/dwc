import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  Brain, 
  Target,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { QuantumModeling } from '@/components/quantum-modeling';
import { QuantumPlaybackControls } from '@/components/quantum-playback-controls';
import { QuantumVoiceNarration } from '@/components/quantum-voice-narration';
import { QuantumSnapshotGallery } from '@/components/quantum-snapshot-gallery';
import QuantumAnimationSpeedCustomizer from '@/components/quantum-animation-speed-customizer';
import LiveVisualEnhancer from '@/components/live-visual-enhancer';
import QQAutomationSandbox from '@/components/qq-automation-sandbox';
import SunoImagineIntegration from '@/components/suno-imagine-integration';

interface MetricData {
  utilization: number;
  savings: number;
  satisfaction: number;
  efficiency: number;
  activeLeads: number;
  totalClients: number;
  roiRate: number;
  automations: number;
}

interface AIInsight {
  id: number;
  type: string;
  description: string;
  confidence: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  impact: string;
}

export default function ModernQuantumDashboard() {
  const [metrics, setMetrics] = useState<MetricData>({
    utilization: 94.7,
    savings: 847,
    satisfaction: 98.2,
    efficiency: 89.1,
    activeLeads: 156,
    totalClients: 42,
    roiRate: 312.4,
    automations: 28
  });

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: 1,
      type: 'Optimization',
      description: 'Route optimization could reduce operational costs by 23% in the northeast corridor',
      confidence: 0.94,
      priority: 'HIGH',
      category: 'Cost Reduction',
      impact: '$127K annual savings'
    },
    {
      id: 2,
      type: 'Market Analysis',
      description: 'Emerging demand detected in Phoenix metro area - 340% growth potential',
      confidence: 0.89,
      priority: 'HIGH',
      category: 'Expansion',
      impact: '$2.1M revenue opportunity'
    },
    {
      id: 3,
      type: 'Efficiency',
      description: 'Automated scheduling could improve client satisfaction by 15%',
      confidence: 0.96,
      priority: 'MEDIUM',
      category: 'Service Quality',
      impact: '15% satisfaction boost'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        utilization: prev.utilization + (Math.random() - 0.5) * 2,
        efficiency: prev.efficiency + (Math.random() - 0.5) * 1.5,
        activeLeads: prev.activeLeads + Math.floor((Math.random() - 0.5) * 10)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOptimizeRoutes = async () => {
    setIsLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMetrics(prev => ({ ...prev, efficiency: Math.min(100, prev.efficiency + 5.2) }));
    setIsLoading(false);
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    icon: Icon,
    color = "blue"
  }: {
    title: string;
    value: number;
    unit?: string;
    trend?: number;
    icon: any;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
              <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
            </div>
            {trend && (
              <Badge variant={trend > 0 ? "default" : "destructive"} className="text-xs">
                {trend > 0 ? "↗" : "↘"} {Math.abs(trend).toFixed(1)}%
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <motion.div 
              className="text-2xl font-bold text-slate-900 dark:text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {typeof value === 'number' ? value.toFixed(1) : value}{unit}
            </motion.div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {title}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const InsightCard = ({ insight }: { insight: AIInsight }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {insight.type}
              </span>
            </div>
            <Badge 
              variant={insight.priority === 'HIGH' ? "destructive" : insight.priority === 'MEDIUM' ? "default" : "secondary"}
              className="text-xs"
            >
              {insight.priority}
            </Badge>
          </div>
          
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
            {insight.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Confidence: {(insight.confidence * 100).toFixed(0)}%
            </div>
            <div className="text-xs font-semibold text-green-600 dark:text-green-400">
              {insight.impact}
            </div>
          </div>
          
          <Progress 
            value={insight.confidence * 100} 
            className="h-1 mt-2"
          />
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Quantum ASI Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Advanced enterprise automation platform leveraging quantum computing and AI for strategic business optimization
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge variant="outline" className="px-4 py-2 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              ASI Active
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
              <Activity className="h-4 w-4 mr-2 text-blue-600" />
              Real-time Analytics
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Quantum Optimization
            </Badge>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            
            {/* Key Metrics Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
              <MetricCard
                title="Compactor Utilization"
                value={metrics.utilization}
                unit="%"
                trend={12.3}
                icon={Target}
                color="blue"
              />
              <MetricCard
                title="Monthly Savings"
                value={metrics.savings}
                unit="K"
                trend={23.8}
                icon={DollarSign}
                color="green"
              />
              <MetricCard
                title="Client Satisfaction"
                value={metrics.satisfaction}
                unit="%"
                trend={5.4}
                icon={Users}
                color="purple"
              />
              <MetricCard
                title="Route Efficiency"
                value={metrics.efficiency}
                unit="%"
                trend={18.7}
                icon={TrendingUp}
                color="orange"
              />
            </motion.div>

            {/* Secondary Metrics */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, staggerChildren: 0.1 }}
            >
              <MetricCard
                title="Active Leads"
                value={metrics.activeLeads}
                trend={8.2}
                icon={Users}
                color="cyan"
              />
              <MetricCard
                title="Total Clients"
                value={metrics.totalClients}
                trend={15.6}
                icon={MapPin}
                color="indigo"
              />
              <MetricCard
                title="ROI Rate"
                value={metrics.roiRate}
                unit="%"
                trend={45.3}
                icon={BarChart3}
                color="emerald"
              />
              <MetricCard
                title="Active Automations"
                value={metrics.automations}
                trend={12.1}
                icon={Zap}
                color="violet"
              />
            </motion.div>

          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Operational Efficiency</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Waste Collection</span>
                          <span className="text-sm font-medium">94.7%</span>
                        </div>
                        <Progress value={94.7} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Route Optimization</span>
                          <span className="text-sm font-medium">89.1%</span>
                        </div>
                        <Progress value={89.1} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Client Retention</span>
                          <span className="text-sm font-medium">98.2%</span>
                        </div>
                        <Progress value={98.2} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Financial Performance</h4>
                      <div className="space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">$847,392</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Cost Savings</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">312.4%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">ROI Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InsightCard insight={insight} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              {/* Quantum Modeling Section */}
              <QuantumModeling
                onModelChange={(model) => console.log('Model updated:', model)}
                onResultsGenerated={(results) => console.log('Results:', results)}
                realTimeData={metrics}
              />

              {/* Quantum Playback Controls */}
              <QuantumPlaybackControls
                onSpeedChange={(speed) => console.log('Speed changed:', speed)}
                onPlayStateChange={(isPlaying) => console.log('Playback state:', isPlaying)}
                onSnapshotCapture={(snapshot) => console.log('Snapshot captured:', snapshot)}
                onVoiceNarration={(enabled) => console.log('Voice narration:', enabled)}
                isRecording={false}
              />

              {/* Voice Narration Panel */}
              <QuantumVoiceNarration
                data={[
                  { label: 'Compactor Utilization', value: metrics.utilization, unit: '%', confidence: 0.96 },
                  { label: 'Monthly Savings', value: metrics.savings, unit: 'K', confidence: 0.94 },
                  { label: 'Client Satisfaction', value: metrics.satisfaction, unit: '%', confidence: 0.98 },
                  { label: 'Route Efficiency', value: metrics.efficiency, unit: '%', confidence: 0.89 }
                ]}
                isVisualizationActive={true}
                onSettingsChange={(settings) => console.log('Voice settings:', settings)}
              />

              {/* Quantum Animation Speed Customizer */}
              <QuantumAnimationSpeedCustomizer
                onSettingsChange={(settings) => console.log('Animation settings:', settings)}
              />

              {/* Live Visual Enhancer */}
              <LiveVisualEnhancer />

              {/* QQ Automation Sandbox */}
              <QQAutomationSandbox
                onAutomationGenerated={(automation) => console.log('Automation generated:', automation)}
              />

              {/* SUNO + IMAGINE Creative Suite */}
              <SunoImagineIntegration />

              {/* Traditional Operations Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Real-time Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Route Optimization</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30">Active</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Demand Prediction</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">Processing</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Brain className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">Market Analysis</span>
                        </div>
                        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30">Standby</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">ASI Processing</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Optimal</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Database Performance</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Normal</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">API Response Time</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Elevated</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Quantum Processing</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <QuantumSnapshotGallery
              onSnapshotLoad={(snapshot) => console.log('Loading snapshot:', snapshot)}
              onSnapshotShare={(snapshot, recipients) => console.log('Sharing snapshot:', snapshot, 'with:', recipients)}
            />
          </TabsContent>
        </Tabs>

        {/* Action Center */}
        <motion.div 
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Quantum Action Center</h3>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleOptimizeRoutes}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Optimizing...
                  </div>
                ) : (
                  'Optimize Routes'
                )}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Generate Report
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Analyze Market
              </Button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}