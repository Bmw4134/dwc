import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AuthBridgeModal } from '@/components/auth-bridge-modal';
import { 
  Globe, 
  Target, 
  BarChart3, 
  Mail, 
  Database, 
  Clock, 
  Shield, 
  Zap, 
  FileText, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  ExternalLink
} from 'lucide-react';

interface WebsiteAutomationTask {
  id: string;
  category: 'lead_generation' | 'seo_optimization' | 'content_automation' | 'analytics' | 'conversion';
  taskName: string;
  description: string;
  targetWebsite: string;
  priority: 'high' | 'medium' | 'low';
  automationLevel: 'full' | 'partial' | 'monitoring';
  currentStatus: 'automated' | 'manual' | 'needs-setup';
  estimatedRevenue: string;
  implementationTime: string;
}

interface AutomationMetrics {
  totalWebsites: number;
  automatedTasks: number;
  monthlyLeadsGenerated: number;
  revenueIncrease: number;
  conversionOptimization: number;
}

export default function GrandfatherAutomation() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [websiteUrl1, setWebsiteUrl1] = useState('https://deluxgraphics.com');
  const [websiteUrl2, setWebsiteUrl2] = useState('https://LocalNewsOnly.com');
  const [websiteUrl3, setWebsiteUrl3] = useState('https://2022gcisdfootball.deluxgraphics.com');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authService, setAuthService] = useState<'chatgpt' | 'replit' | 'other'>('chatgpt');
  const [scrapedWebsites, setScrapedWebsites] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const automationTasks: WebsiteAutomationTask[] = [
    {
      id: 'deluxgraphics-lead-capture',
      category: 'lead_generation',
      taskName: 'DeluxGraphics Lead Automation',
      description: 'Automated lead capture and nurturing for graphics design services and gaming content',
      targetWebsite: 'deluxgraphics.com',
      priority: 'high',
      automationLevel: 'full',
      currentStatus: 'needs-setup',
      estimatedRevenue: '$2,500/month',
      implementationTime: '1-2 weeks'
    },
    {
      id: 'localnews-content-automation',
      category: 'content_automation',
      taskName: 'LocalNewsOnly Content Engine',
      description: 'Automated news aggregation, content generation, and audience engagement system',
      targetWebsite: 'LocalNewsOnly.com',
      priority: 'high',
      automationLevel: 'full',
      currentStatus: 'needs-setup',
      estimatedRevenue: '$3,000/month',
      implementationTime: '2-3 weeks'
    },
    {
      id: 'football-sports-automation',
      category: 'lead_generation',
      taskName: 'Sports Portal Lead Generation',
      description: 'Automated sports content monetization and fan engagement system',
      targetWebsite: '2022gcisdfootball.deluxgraphics.com',
      priority: 'medium',
      automationLevel: 'partial',
      currentStatus: 'needs-setup',
      estimatedRevenue: '$1,500/month',
      implementationTime: '1 week'
    },
    {
      id: 'cross-platform-seo',
      category: 'seo_optimization',
      taskName: 'Multi-Site SEO Automation',
      description: 'Unified SEO strategy across all three websites with automated optimization',
      targetWebsite: 'All Sites',
      priority: 'high',
      automationLevel: 'full',
      currentStatus: 'needs-setup',
      estimatedRevenue: '$2,000/month',
      implementationTime: '1-2 weeks'
    },
    {
      id: 'analytics-dashboard',
      category: 'analytics',
      taskName: 'Unified Analytics & Reporting',
      description: 'Comprehensive analytics dashboard tracking performance across all properties',
      targetWebsite: 'All Sites',
      priority: 'medium',
      automationLevel: 'full',
      currentStatus: 'needs-setup',
      estimatedRevenue: '$500/month',
      implementationTime: '1 week'
    },
    {
      id: 'conversion-optimization',
      category: 'conversion',
      taskName: 'Conversion Rate Optimization',
      description: 'A/B testing and conversion optimization across all website properties',
      targetWebsite: 'All Sites',
      priority: 'medium',
      automationLevel: 'partial',
      currentStatus: 'needs-setup',
      estimatedRevenue: '$1,800/month',
      implementationTime: '2 weeks'
    }
  ];

  const { data: metrics } = useQuery<AutomationMetrics>({
    queryKey: ['/api/grandfather/website-metrics'],
    initialData: {
      totalWebsites: 3,
      automatedTasks: 0,
      monthlyLeadsGenerated: 0,
      revenueIncrease: 0,
      conversionOptimization: 0
    }
  });

  const setupAutomationMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch('/api/grandfather/setup-website-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId,
          websiteUrl1,
          websiteUrl2,
          websiteUrl3
        })
      });
      if (!response.ok) throw new Error('Setup failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grandfather/website-metrics'] });
    }
  });

  const scrapeWebsiteMutation = useMutation({
    mutationFn: async (websiteUrl: string) => {
      const response = await fetch('/api/grandfather/scrape-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          websiteUrl,
          action: 'analyze'
        })
      });
      if (!response.ok) throw new Error('Scraping failed');
      return response.json();
    },
    onSuccess: (data) => {
      setScrapedWebsites(prev => [...prev, data]);
    }
  });

  const handleAuthService = (service: 'chatgpt' | 'replit' | 'other') => {
    setAuthService(service);
    setShowAuthModal(true);
  };

  const handleAuthComplete = (authData: any) => {
    console.log('Authentication completed:', authData);
    setShowAuthModal(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lead_generation': return <Target className="h-4 w-4" />;
      case 'seo_optimization': return <Search className="h-4 w-4" />;
      case 'content_automation': return <FileText className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'conversion': return <TrendingUp className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lead_generation': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'seo_optimization': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'content_automation': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'analytics': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'conversion': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'automated': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'manual': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'needs-setup': return <Clock className="h-4 w-4 text-blue-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredTasks = selectedCategory === 'all' 
    ? automationTasks 
    : automationTasks.filter(task => task.category === selectedCategory);

  const totalEstimatedRevenue = automationTasks.reduce((total, task) => {
    const revenue = parseInt(task.estimatedRevenue.replace(/[^0-9]/g, ''));
    return total + revenue;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Grandfather Website Automation Hub
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Comprehensive automation system for DeluxGraphics, LocalNewsOnly, and Sports Portal
            to maximize lead generation and revenue across all digital properties
          </p>
          <div className="flex justify-center gap-4 text-sm text-indigo-300">
            <span>🌐 deluxgraphics.com</span>
            <span>•</span>
            <span>📰 LocalNewsOnly.com</span>
            <span>•</span>
            <span>🏈 2022gcisdfootball.deluxgraphics.com</span>
          </div>
        </div>

        {/* Website Portfolio Control Center */}
        <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 border-indigo-500/30 backdrop-blur-lg shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-indigo-600/20 mr-3">
                  <Globe className="h-5 w-5 text-indigo-400" />
                </div>
                Website Portfolio Control Center
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAuthService('chatgpt')}
                  className="text-xs bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-500/30 hover:from-green-500/30 hover:to-green-400/30 transition-all duration-200"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  ChatGPT
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAuthService('replit')}
                  className="text-xs bg-gradient-to-r from-purple-600/20 to-purple-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-purple-400/30 transition-all duration-200"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Replit
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Graphics Website', value: websiteUrl1, setter: setWebsiteUrl1, placeholder: 'DeluxGraphics URL', icon: '🎨' },
                { label: 'News Website', value: websiteUrl2, setter: setWebsiteUrl2, placeholder: 'LocalNewsOnly URL', icon: '📰' },
                { label: 'Sports Portal', value: websiteUrl3, setter: setWebsiteUrl3, placeholder: 'Football Portal URL', icon: '🏈' }
              ].map((site, index) => (
                <div key={index} className="group relative">
                  <label className="block text-sm font-medium text-indigo-200 mb-3 flex items-center">
                    <span className="text-lg mr-2">{site.icon}</span>
                    {site.label}
                  </label>
                  <div className="relative">
                    <Input
                      value={site.value}
                      onChange={(e) => site.setter(e.target.value)}
                      placeholder={site.placeholder}
                      className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-500/30 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-200 pr-12 rounded-xl"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => scrapeWebsiteMutation.mutate(site.value)}
                      disabled={!site.value || scrapeWebsiteMutation.isPending}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-indigo-600/20 text-indigo-400"
                    >
                      {scrapeWebsiteMutation.isPending ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-400"></div>
                      ) : (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-green-600/10 border-green-500/30 hover:bg-green-600/20 transition-colors"
                        onClick={() => scrapeWebsiteMutation.mutate(site.value)}
                        disabled={!site.value}
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Analyze
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-blue-600/10 border-blue-500/30 hover:bg-blue-600/20 transition-colors"
                        disabled={!site.value}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Extract Leads
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {scrapedWebsites.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl">
                <h4 className="text-green-300 font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Recent Website Analysis
                </h4>
                <div className="space-y-2">
                  {scrapedWebsites.slice(-3).map((site, index) => (
                    <div key={index} className="text-sm text-green-200 flex items-center justify-between">
                      <span>{site.website}</span>
                      <Badge variant="outline" className="text-green-300 border-green-500/30">
                        {site.data?.leadForms || 0} lead forms found
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Globe className="h-4 w-4 mr-2 text-green-400" />
                Active Websites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{metrics?.totalWebsites}</div>
              <p className="text-green-200 text-sm">Properties managed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-400" />
                Automated Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {metrics?.automatedTasks}/{automationTasks.length}
              </div>
              <p className="text-blue-200 text-sm">Tasks active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-400" />
                Monthly Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{metrics?.monthlyLeadsGenerated}</div>
              <p className="text-purple-200 text-sm">Generated/month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-yellow-400" />
                Revenue Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">${totalEstimatedRevenue.toLocaleString()}</div>
              <p className="text-yellow-200 text-sm">Monthly potential</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-red-400" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{metrics?.conversionOptimization}%</div>
              <p className="text-red-200 text-sm">Optimization</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['all', 'lead_generation', 'seo_optimization', 'content_automation', 'analytics', 'conversion'].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`${selectedCategory === category ? 'bg-indigo-600' : 'bg-indigo-800/30'} border-indigo-500/30`}
            >
              {category === 'all' ? 'All Tasks' : category.replace('_', ' ').split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Button>
          ))}
        </div>

        {/* Premium Lead Generation Dashboard */}
        <div className="space-y-8">
          {/* AI Monitoring Command Center */}
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-slate-700/50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Quantum AI Self-Healing Monitor</h3>
                    <p className="text-slate-400 text-sm mt-1">Intelligent behavior modeling & auto-correction system</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-xs font-medium">AI ACTIVE</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-0 rounded-xl px-4 py-2 font-medium transition-all duration-200"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'User Interactions', value: '1,247', change: '+23 in last hour', icon: '👆', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30' },
                  { label: 'Issues Detected', value: '3', change: 'Auto-resolved: 2', icon: '🔍', color: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-500/30' },
                  { label: 'AI Fixes Applied', value: '12', change: '+4 today', icon: '🤖', color: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30' },
                  { label: 'System Health', value: '98.7%', change: 'Optimal performance', icon: '💚', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30' }
                ].map((metric, index) => (
                  <div key={index} className={`bg-gradient-to-br ${metric.color} border ${metric.border} rounded-xl p-4 hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-300 text-sm font-medium">{metric.label}</p>
                        <p className="text-white text-2xl font-bold mt-1">{metric.value}</p>
                        <p className="text-emerald-400 text-xs mt-1">{metric.change}</p>
                      </div>
                      <div className="text-2xl">{metric.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Action Command Center */}
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-xl">
                    <Target className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Lead Generation Command Center</h3>
                    <p className="text-slate-400 text-sm mt-1">Automate website lead capture and conversion</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-xs font-medium">LIVE</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 rounded-xl px-4 py-2 font-medium transition-all duration-200"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Auto-Deploy All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Active Lead Forms', value: '12', change: '+3 today', icon: '📝', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30' },
                  { title: 'Conversion Rate', value: '24.8%', change: '+2.3% vs last week', icon: '📈', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30' },
                  { title: 'Revenue Pipeline', value: '$12,450', change: '+$1,200 this month', icon: '💰', color: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30' }
                ].map((metric, index) => (
                  <div key={index} className={`bg-gradient-to-br ${metric.color} border ${metric.border} rounded-xl p-4 hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-300 text-sm font-medium">{metric.title}</p>
                        <p className="text-white text-2xl font-bold mt-1">{metric.value}</p>
                        <p className="text-green-400 text-xs mt-1">{metric.change}</p>
                      </div>
                      <div className="text-2xl">{metric.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium Automation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <div key={task.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 shadow-2xl group-hover:shadow-blue-500/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl">
                          {getCategoryIcon(task.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white font-semibold">{task.taskName}</CardTitle>
                          <p className="text-slate-400 text-sm mt-1">{task.targetWebsite}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`
                          ${task.currentStatus === 'automated' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : task.currentStatus === 'manual'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                          } rounded-full px-3 py-1
                        `}
                      >
                        {task.currentStatus === 'automated' ? '🟢 Live' : task.currentStatus === 'manual' ? '🟡 Manual' : '🔴 Setup'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-sm leading-relaxed">{task.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs uppercase tracking-wide">Priority</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          <span className="text-white text-sm font-medium capitalize">{task.priority}</span>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs uppercase tracking-wide">Revenue</p>
                        <p className="text-emerald-400 text-sm font-bold mt-1">{task.estimatedRevenue}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => setupAutomationMutation.mutate(task.id)}
                        disabled={setupAutomationMutation.isPending || !websiteUrl1}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 rounded-xl font-medium transition-all duration-200"
                      >
                        {setupAutomationMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Setting up...
                          </div>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            {task.currentStatus === 'automated' ? 'Optimize' : 'Activate'}
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="px-3 bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 rounded-xl"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Generation Strategy */}
        <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 border-indigo-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-300">
              <Target className="h-5 w-5 mr-2" />
              Comprehensive Lead Generation Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-indigo-200">DeluxGraphics Focus</h4>
                <ul className="text-indigo-300 space-y-1">
                  <li>• Design service inquiries</li>
                  <li>• Gaming content creators</li>
                  <li>• Business logo requests</li>
                  <li>• Custom graphics projects</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-indigo-200">LocalNewsOnly Strategy</h4>
                <ul className="text-indigo-300 space-y-1">
                  <li>• Advertising partnerships</li>
                  <li>• Content syndication</li>
                  <li>• Subscription conversions</li>
                  <li>• Local business features</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-indigo-200">Sports Portal Monetization</h4>
                <ul className="text-indigo-300 space-y-1">
                  <li>• Fan engagement tracking</li>
                  <li>• Sports merchandise sales</li>
                  <li>• Event promotion revenue</li>
                  <li>• Team sponsorship leads</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Bridge Modal */}
      <AuthBridgeModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        service={authService}
        onAuthenticated={handleAuthComplete}
      />
    </div>
  );
}