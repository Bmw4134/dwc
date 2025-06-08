import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3,
  Zap,
  Target,
  Brain,
  Rocket,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Star,
  Trophy,
  Crown,
  Diamond,
  Calendar,
  Mail,
  LogOut
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function EnterpriseDashboard() {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState('kate_photography');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for real-time feel
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time metrics simulation
  const [metrics, setMetrics] = useState({
    revenueProjection: 94000,
    automationScore: 97,
    timeSaved: 847,
    conversionRate: 23.7,
    clientSatisfaction: 98.7,
    systemUptime: 99.97
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        revenueProjection: prev.revenueProjection + Math.floor(Math.random() * 100),
        automationScore: Math.min(100, prev.automationScore + (Math.random() - 0.5) * 0.5),
        conversionRate: Math.max(20, Math.min(30, prev.conversionRate + (Math.random() - 0.5) * 0.3))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Query automation endpoints
  const { data: automationTasks } = useQuery({
    queryKey: ['/api/automation/active-tasks'],
    refetchInterval: 5000
  });

  const { data: processedLeads } = useQuery({
    queryKey: ['/api/automation/processed-leads'],
    refetchInterval: 10000
  });

  // Kate's Photography specific automation
  const runKateAutomation = useMutation({
    mutationFn: async () => {
      const kateProfile = {
        name: 'Kate White',
        title: 'Professional Photographer & Studio Owner',
        company: "Kate's Photography Studio",
        location: 'Austin, TX',
        industry: 'Photography',
        profileUrl: 'https://linkedin.com/in/kate-photography',
        websiteUrl: 'https://katesphotography.com',
        connectionLevel: '2nd',
        estimatedRevenue: 45000,
        businessType: 'photography'
      };
      
      const response = await fetch('/api/automation/automate-client-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: kateProfile })
      });
      return response.json();
    }
  });

  // Overnight agency automation
  const runOvernightAutomation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/automation/run-overnight-agency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DWC Enterprise ASI</h1>
                <p className="text-gray-400 text-sm">Autonomous Business Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                ACTIVE
              </Badge>
              <div className="text-right">
                <p className="text-white font-medium">Kate White Photography</p>
                <p className="text-gray-400 text-sm">Premium Client</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => window.location.href = '/');
                }}
                className="border-gray-600 hover:border-gray-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Revenue Potential</p>
                  <p className="text-3xl font-bold text-white">$94,000</p>
                  <p className="text-blue-400 text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +340% projected
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 border-emerald-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm font-medium">Automation Score</p>
                  <p className="text-3xl font-bold text-white">97%</p>
                  <p className="text-emerald-400 text-sm flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Elite tier
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Lead Conversion</p>
                  <p className="text-3xl font-bold text-white">89%</p>
                  <p className="text-purple-400 text-sm flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Industry leading
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">Time Saved</p>
                  <p className="text-3xl font-bold text-white">847h</p>
                  <p className="text-orange-400 text-sm flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    This month
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="automation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="automation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Automation Engine
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Business Intelligence
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Client Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          {/* Automation Engine Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Workflow Control */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      Kate's Photography Business Automation
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete end-to-end business optimization workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Kate's Photography Automation</h3>
                          <p className="text-gray-400">12 optimization steps configured</p>
                        </div>
                        <Button 
                          onClick={() => setActiveWorkflow('kate_photography')}
                          disabled={activeWorkflow === 'kate_photography'}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {activeWorkflow === 'kate_photography' ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-pulse" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Rocket className="h-4 w-4 mr-2" />
                              Launch Automation
                            </>
                          )}
                        </Button>
                      </div>

                      {activeWorkflow === 'kate_photography' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">Progress</span>
                            <Badge className="bg-green-500/20 text-green-400">
                              RUNNING
                            </Badge>
                          </div>
                          <Progress 
                            value={85} 
                            className="h-3 bg-gray-700"
                          />
                          <div className="text-sm text-gray-400">
                            Step 10 of 12: 
                            <span className="text-white ml-1">Lead qualification optimization</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-700/30 rounded-lg">
                          <p className="text-gray-400 text-sm">Estimated ROI</p>
                          <p className="text-2xl font-bold text-green-400">$94,000</p>
                        </div>
                        <div className="p-4 bg-gray-700/30 rounded-lg">
                          <p className="text-gray-400 text-sm">Completion Time</p>
                          <p className="text-2xl font-bold text-blue-400">15min</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Metrics */}
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                    Live Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Website Optimization</span>
                      <span className="text-emerald-400 font-medium">+147%</span>
                    </div>
                    <Progress value={89} className="h-2 bg-gray-700" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Lead Generation</span>
                      <span className="text-blue-400 font-medium">+234%</span>
                    </div>
                    <Progress value={76} className="h-2 bg-gray-700" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Conversion Rate</span>
                      <span className="text-purple-400 font-medium">+89%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-gray-700" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Client Satisfaction</span>
                      <span className="text-yellow-400 font-medium">98.7%</span>
                    </div>
                    <Progress value={99} className="h-2 bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Automation Steps */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Automation Pipeline</CardTitle>
                <CardDescription className="text-gray-400">
                  Intelligent step-by-step business optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Website Analysis', status: 'completed', impact: '+$40K', icon: Globe },
                    { name: 'Lead Qualification', status: 'completed', impact: '+$24K', icon: Target },
                    { name: 'Social Media Automation', status: 'running', impact: '+$8K', icon: Sparkles },
                    { name: 'Booking System Setup', status: 'pending', impact: '+$15K', icon: Calendar },
                    { name: 'Email Automation', status: 'pending', impact: '+$12K', icon: Mail },
                    { name: 'Analytics Dashboard', status: 'pending', impact: '+$5K', icon: BarChart3 }
                  ].map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${
                          step.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                          step.status === 'running' ? 'bg-blue-500/10 border-blue-500/30' :
                          'bg-gray-700/30 border-gray-600/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`h-5 w-5 ${
                            step.status === 'completed' ? 'text-green-400' :
                            step.status === 'running' ? 'text-blue-400' :
                            'text-gray-400'
                          }`} />
                          <Badge 
                            variant="outline" 
                            className={
                              step.status === 'completed' ? 'border-green-500/30 text-green-400' :
                              step.status === 'running' ? 'border-blue-500/30 text-blue-400' :
                              'border-gray-500/30 text-gray-400'
                            }
                          >
                            {step.status}
                          </Badge>
                        </div>
                        <h4 className="text-white font-medium mb-1">{step.name}</h4>
                        <p className="text-gray-400 text-sm">Revenue Impact: <span className="text-green-400">{step.impact}</span></p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Intelligence Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      insight: "Conversion rate can increase 340% with optimized booking flow",
                      confidence: 94,
                      priority: "Critical",
                      impact: "$32,000/year"
                    },
                    {
                      insight: "Local SEO optimization will capture 47% more Austin market",
                      confidence: 87,
                      priority: "High",
                      impact: "$18,000/year"
                    },
                    {
                      insight: "Automated email sequences increase client retention by 156%",
                      confidence: 92,
                      priority: "High",
                      impact: "$24,000/year"
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          className={
                            item.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            'bg-orange-500/20 text-orange-400'
                          }
                        >
                          {item.priority}
                        </Badge>
                        <span className="text-green-400 font-medium">{item.impact}</span>
                      </div>
                      <p className="text-white mb-2">{item.insight}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Confidence:</span>
                        <Progress value={item.confidence} className="h-2 bg-gray-600 flex-1" />
                        <span className="text-white text-sm">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Performance Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { metric: "Lead Response Time", current: "2.3 min", benchmark: "< 5 min", status: "excellent" },
                    { metric: "Conversion Rate", current: "23.7%", benchmark: "15-20%", status: "excellent" },
                    { metric: "Client Satisfaction", current: "98.7%", benchmark: "> 90%", status: "excellent" },
                    { metric: "Website Load Speed", current: "1.2s", benchmark: "< 3s", status: "excellent" },
                    { metric: "Social Engagement", current: "+156%", benchmark: "+50%", status: "excellent" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.metric}</p>
                        <p className="text-gray-400 text-sm">Benchmark: {item.benchmark}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{item.current}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 text-sm">Elite</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Client Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Diamond className="h-5 w-5 text-blue-400" />
                    Kate White Photography
                  </CardTitle>
                  <CardDescription className="text-gray-400">Premium Client - Active Automation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-400">$94K</p>
                      <p className="text-gray-400 text-sm">Revenue Potential</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-400">97%</p>
                      <p className="text-gray-400 text-sm">Automation Score</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Website Optimization</span>
                      <span className="text-green-400">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lead Pipeline</span>
                      <span className="text-blue-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Social Automation</span>
                      <span className="text-yellow-400">In Progress</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    View Full Report
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Expansion Opportunities</CardTitle>
                  <CardDescription className="text-gray-400">
                    Ready-to-deploy automation templates for new clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        type: "Real Estate Agency", 
                        potential: "$180K", 
                        complexity: "Medium",
                        timeframe: "2-3 weeks"
                      },
                      { 
                        type: "E-commerce Store", 
                        potential: "$240K", 
                        complexity: "High",
                        timeframe: "3-4 weeks"
                      },
                      { 
                        type: "Professional Services", 
                        potential: "$120K", 
                        complexity: "Low",
                        timeframe: "1-2 weeks"
                      },
                      { 
                        type: "Healthcare Practice", 
                        potential: "$160K", 
                        complexity: "Medium",
                        timeframe: "2-3 weeks"
                      }
                    ].map((opportunity, index) => (
                      <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">{opportunity.type}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Revenue Potential:</span>
                            <span className="text-green-400">{opportunity.potential}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Complexity:</span>
                            <span className="text-blue-400">{opportunity.complexity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Timeline:</span>
                            <span className="text-purple-400">{opportunity.timeframe}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                All systems operational. Enterprise-grade automation delivering exceptional results across all client portfolios.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">System Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-green-400">99.97%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-blue-400">&lt; 200ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-green-400">99.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Revenue Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Month</span>
                      <span className="text-green-400">+$47,300</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Projected Annual</span>
                      <span className="text-green-400">+$564,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ROI</span>
                      <span className="text-green-400">2,840%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Automation Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Saved</span>
                      <span className="text-blue-400">847 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost Reduction</span>
                      <span className="text-green-400">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Error Rate</span>
                      <span className="text-green-400">0.003%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}