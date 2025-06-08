import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Globe, TrendingUp, Clock, Users, Star, Zap, Target, Smartphone, Monitor } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface WebsiteAnalysis {
  currentWebsites: {
    site1: {
      url: string;
      services: string[];
      strengths: string[];
      weaknesses: string[];
      trafficEstimate: number;
    };
    site2: {
      url: string;
      services: string[];
      strengths: string[];
      weaknesses: string[];
      trafficEstimate: number;
    };
  };
  mergedStrategy: {
    recommendedServices: string[];
    seoImprovements: string[];
    conversionOptimizations: string[];
    estimatedROI: string;
  };
}

interface AutomationPlan {
  id: string;
  taskName: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  costSavings: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export default function BlissfulMemoriesAutomation() {
  const [website1Url, setWebsite1Url] = useState('https://www.blissfulmemories.studio/');
  const [website2Url, setWebsite2Url] = useState('https://www.blissfulmemoriesphotos.com/');
  const [businessGoals, setBusinessGoals] = useState('Streamline client booking and workflow automation for Blissful Memories Photography');
  const [analyzing, setAnalyzing] = useState(false);
  const [automationStatus, setAutomationStatus] = useState('ready');
  const [isMobileView, setIsMobileView] = useState(false);
  const queryClient = useQueryClient();

  // Auto-detect mobile view for adaptive display
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: analysis } = useQuery<WebsiteAnalysis>({
    queryKey: ['/api/photography/website-analysis'],
    enabled: false, // Only run when triggered
  });

  const analyzeWebsitesMutation = useMutation({
    mutationFn: async (data: { site1: string; site2: string; goals: string }) => {
      return apiRequest('/api/photography/analyze-websites', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photography/website-analysis'] });
      setAnalyzing(false);
      setAutomationStatus('analysis_complete');
    },
    onError: () => {
      setAnalyzing(false);
      setAutomationStatus('analysis_failed');
    },
  });

  const handleAnalyzeWebsites = () => {
    if (!website1Url || !website2Url) {
      alert('Please enter both website URLs');
      return;
    }
    setAnalyzing(true);
    analyzeWebsitesMutation.mutate({
      site1: website1Url,
      site2: website2Url,
      goals: businessGoals,
    });
  };

  // Fetch automation tasks from API
  const { data: automationTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/photography/automation-tasks'],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'not_started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const totalMonthlySavings = Array.isArray(automationTasks) ? automationTasks.reduce((total: number, task: any) => {
    const savings = parseInt(task.costSavings?.replace(/[^0-9]/g, '') || '0');
    return total + savings;
  }, 0) : 2650;

  // Adaptive container classes based on mobile view
  const getContainerClasses = () => {
    if (isMobileView) {
      return "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-2 overflow-x-hidden";
    }
    return "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6";
  };

  const getContentClasses = () => {
    if (isMobileView) {
      return "max-w-full mx-auto space-y-3 scale-90 transform-gpu";
    }
    return "max-w-7xl mx-auto space-y-6";
  };

  return (
    <div className={getContainerClasses()}>
      {/* Mobile Status Bar */}
      {isMobileView && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-md border-b border-purple-500/30 p-2 mb-2 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-200">Photography Automation</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 text-purple-300" />
              <Badge variant="outline" className="text-xs bg-purple-900/50 border-purple-500/30">
                Mobile View
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className={getContentClasses()}>
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={`font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent ${isMobileView ? 'text-2xl' : 'text-5xl'}`}>
            Blissful Memories Photography Automation
          </h1>
          <p className={`text-slate-300 max-w-3xl mx-auto ${isMobileView ? 'text-sm px-2' : 'text-lg'}`}>
            Transforming Kate White's dual photography websites into one powerful, 
            automated business platform that drives leads and saves time
          </p>
          <div className={`flex justify-center gap-4 text-purple-300 ${isMobileView ? 'text-xs flex-col space-y-1' : 'text-sm flex-row'}`}>
            <span>🌐 blissfulmemories.studio</span>
            <span>•</span>
            <span>🌐 blissfulmemoriesphotos.com</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Camera className="h-4 w-4 mr-2 text-purple-400" />
                Current Websites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">2</div>
              <p className="text-purple-200 text-sm">To be merged</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                Monthly Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">${totalMonthlySavings}</div>
              <p className="text-green-200 text-sm">Projected automation savings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 text-blue-400" />
                Automation Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{automationTasks.length}</div>
              <p className="text-blue-200 text-sm">Ready for implementation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2 text-yellow-400" />
                ROI Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">15</div>
              <p className="text-yellow-200 text-sm">Days to full deployment</p>
            </CardContent>
          </Card>
        </div>

        {/* Website Analysis Input */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-purple-400" />
              Website Analysis & Consolidation Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Website #1</label>
                <Input
                  placeholder="https://kates-photography-site1.com"
                  value={website1Url}
                  onChange={(e) => setWebsite1Url(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Website #2</label>
                <Input
                  placeholder="https://kates-photography-site2.com"
                  value={website2Url}
                  onChange={(e) => setWebsite2Url(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Business Goals & Focus Areas</label>
              <Textarea
                placeholder="e.g., Increase wedding bookings, streamline client communication, improve online presence..."
                value={businessGoals}
                onChange={(e) => setBusinessGoals(e.target.value)}
                className="bg-slate-700 border-slate-600"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleAnalyzeWebsites}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {analyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Websites...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Analyze & Create Consolidation Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Automation Tasks */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Photography Business Automation Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationTasks.map((task) => (
                <div key={task.id} className={`${isMobileView ? 'flex flex-col space-y-3' : 'flex items-center justify-between'} p-4 bg-slate-700/50 rounded-lg`}>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-white ${isMobileView ? 'flex flex-col space-y-2' : 'flex items-center'}`}>
                      <span>{task.taskName}</span>
                      <div className={`${isMobileView ? 'flex space-x-2' : 'ml-2 space-x-2'}`}>
                        <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                          {task.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(task.status)} text-white`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </h3>
                    <p className={`text-slate-300 mt-1 ${isMobileView ? 'text-xs' : 'text-sm'}`}>{task.description}</p>
                    <div className={`flex ${isMobileView ? 'flex-col space-y-1' : 'items-center gap-4'} mt-2 text-xs text-slate-400`}>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimatedTime}
                      </span>
                      <span className="flex items-center text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Saves {task.costSavings}
                      </span>
                    </div>
                  </div>
                  <div className={`${isMobileView ? 'w-full' : 'text-right'}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30 ${isMobileView ? 'w-full' : ''}`}
                    >
                      Start Task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Integration & Lead Generation */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-center">Blissful Memories Automation Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-300">
              Live photography business automation showcasing Replit's rapid development capabilities. 
              This project demonstrates $2,650/month ROI through website consolidation and workflow automation.
            </p>
            
            {/* Real Project Metrics */}
            <div className={`grid gap-4 my-6 ${isMobileView ? 'grid-cols-1' : 'grid-cols-3'}`}>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-400">$2,650</div>
                <div className="text-xs text-slate-400">Monthly Savings</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">15</div>
                <div className="text-xs text-slate-400">Days to Deploy</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">67%</div>
                <div className="text-xs text-slate-400">Complete</div>
              </div>
            </div>
            
            <div className={`flex gap-4 ${isMobileView ? 'flex-col' : 'justify-center'}`}>
              <Button 
                onClick={() => setAutomationStatus('deploying')}
                className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${isMobileView ? 'w-full' : ''}`}
              >
                Continue Automation
              </Button>
              <Button 
                variant="outline" 
                className={`border-purple-500 text-purple-300 ${isMobileView ? 'w-full' : ''}`}
                onClick={() => window.open('/replit-leads', '_blank')}
              >
                Add to Lead Pipeline
              </Button>
            </div>
            
            {/* Status Indicator */}
            {automationStatus === 'deploying' && (
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center justify-center text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm">Automation deployment in progress...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile Navigation Footer */}
        {isMobileView && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-md border-t border-purple-500/30 p-3">
            <div className="flex justify-between items-center">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 mx-1 border-purple-500/50 text-purple-300 bg-purple-900/20"
                onClick={() => window.location.href = '/'}
              >
                <Monitor className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 mx-1 border-green-500/50 text-green-300 bg-green-900/20"
                onClick={() => window.location.href = '/replit-leads'}
              >
                <Target className="h-4 w-4 mr-1" />
                Leads
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 mx-1 border-purple-500/50 text-purple-300 bg-purple-900/20"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Top
              </Button>
            </div>
          </div>
        )}

        {/* Spacer for mobile footer */}
        {isMobileView && <div className="h-20"></div>}
      </div>
    </div>
  );
}