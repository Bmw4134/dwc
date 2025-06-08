import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings,
  Wrench,
  Zap,
  Bot,
  Target,
  TrendingUp,
  Shield,
  Brain,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  StopCircle,
  RefreshCw,
  Monitor,
  Database,
  Code,
  Users,
  MapPin,
  Camera,
  Mic,
  Globe
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SystemModule {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  type: 'widget' | 'service' | 'automation' | 'integration';
  description: string;
  actions: string[];
  dependencies: string[];
  metrics?: {
    uptime: number;
    performance: number;
    errors: number;
  };
}

interface FixRequest {
  module: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  autoFix: boolean;
}

const SYSTEM_MODULES: SystemModule[] = [
  // Core Business Modules
  {
    id: 'kpi-dashboard',
    name: 'KPI Dashboard',
    category: 'core',
    status: 'active',
    type: 'widget',
    description: 'Real-time business metrics and performance indicators',
    actions: ['refresh', 'configure', 'export'],
    dependencies: ['api-clients', 'data-warehouse'],
    metrics: { uptime: 99.8, performance: 95, errors: 2 }
  },
  {
    id: 'lead-generator',
    name: 'Lead Generation System',
    category: 'core',
    status: 'active',
    type: 'automation',
    description: 'Automated lead capture and qualification pipeline',
    actions: ['start', 'stop', 'configure', 'analyze'],
    dependencies: ['photo-scanner', 'ar-overlay', 'voice-commands'],
    metrics: { uptime: 97.5, performance: 92, errors: 8 }
  },
  {
    id: 'revenue-engine',
    name: 'Revenue Projection Engine',
    category: 'core',
    status: 'active',
    type: 'service',
    description: 'AI-powered revenue forecasting and optimization',
    actions: ['calculate', 'optimize', 'export'],
    dependencies: ['ai-insights', 'market-data'],
    metrics: { uptime: 99.2, performance: 88, errors: 1 }
  },

  // Trading & Finance Modules
  {
    id: 'trading-wizard',
    name: 'Interactive Trading Strategy Wizard',
    category: 'trading',
    status: 'active',
    type: 'widget',
    description: '4-step trading strategy configuration and optimization',
    actions: ['configure', 'backtest', 'deploy', 'monitor'],
    dependencies: ['market-data', 'ai-trading-bot'],
    metrics: { uptime: 98.1, performance: 94, errors: 3 }
  },
  {
    id: 'ai-trading-bot',
    name: 'AI Trading Bot - Quantum Enhanced',
    category: 'trading',
    status: 'active',
    type: 'automation',
    description: 'Bleeding-edge quantum-enhanced trading algorithms',
    actions: ['start', 'stop', 'configure', 'analyze'],
    dependencies: ['market-data', 'risk-management'],
    metrics: { uptime: 99.9, performance: 97, errors: 0 }
  },

  // Lead Generation & AR Modules
  {
    id: 'photo-scanner',
    name: 'Photo Lead Generator',
    category: 'leads',
    status: 'active',
    type: 'integration',
    description: 'OCR-powered business card and document analysis',
    actions: ['scan', 'process', 'export'],
    dependencies: ['ocr-service', 'lead-database'],
    metrics: { uptime: 96.8, performance: 89, errors: 12 }
  },
  {
    id: 'ar-overlay',
    name: 'AR Business Scanner',
    category: 'leads',
    status: 'active',
    type: 'widget',
    description: 'Augmented reality business information overlay',
    actions: ['activate', 'scan', 'save'],
    dependencies: ['gps-service', 'business-database'],
    metrics: { uptime: 94.2, performance: 85, errors: 18 }
  },

  // Fleet & Logistics
  {
    id: 'fleet-tracker',
    name: 'Advanced Fleet Map',
    category: 'fleet',
    status: 'active',
    type: 'widget',
    description: 'Real-time fleet tracking with proprietary SVG technology',
    actions: ['track', 'optimize', 'report'],
    dependencies: ['gps-service', 'route-optimizer'],
    metrics: { uptime: 98.7, performance: 91, errors: 5 }
  },

  // AI & Automation
  {
    id: 'voice-commands',
    name: 'Voice Command Interface',
    category: 'ai',
    status: 'active',
    type: 'integration',
    description: 'Natural language command processing and execution',
    actions: ['listen', 'process', 'execute'],
    dependencies: ['speech-recognition', 'nlp-service'],
    metrics: { uptime: 95.3, performance: 87, errors: 15 }
  },
  {
    id: 'ai-insights',
    name: 'AI Intelligence Core',
    category: 'ai',
    status: 'active',
    type: 'service',
    description: 'Advanced machine learning insights and predictions',
    actions: ['analyze', 'predict', 'optimize'],
    dependencies: ['data-warehouse', 'ml-models'],
    metrics: { uptime: 99.1, performance: 93, errors: 4 }
  }
];

export default function FixAnythingModule() {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [fixRequest, setFixRequest] = useState<FixRequest>({
    module: '',
    issue: '',
    priority: 'medium',
    description: '',
    autoFix: true
  });
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  const queryClient = useQueryClient();

  // System status queries
  const { data: systemStatus } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 5000
  });

  const { data: moduleHealth } = useQuery({
    queryKey: ['/api/modules/health'],
    refetchInterval: 10000
  });

  // Fix automation mutation
  const fixMutation = useMutation({
    mutationFn: async (request: FixRequest) => {
      return apiRequest('/api/system/fix', 'POST', request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/modules/health'] });
    }
  });

  // System restart mutation
  const restartMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      return apiRequest(`/api/modules/${moduleId}/restart`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system/status'] });
    }
  });

  // Calculate overall system health
  useEffect(() => {
    const healthScores = SYSTEM_MODULES.map(m => m.metrics?.performance || 0);
    const avgHealth = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;
    
    if (avgHealth >= 90) setSystemHealth('healthy');
    else if (avgHealth >= 70) setSystemHealth('warning');
    else setSystemHealth('critical');
  }, [moduleHealth]);

  const getFilteredModules = () => {
    if (activeCategory === 'all') return SYSTEM_MODULES;
    return SYSTEM_MODULES.filter(m => m.category === activeCategory);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-yellow-500" />;
      default: return <StopCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Shield className="h-4 w-4" />;
      case 'trading': return <TrendingUp className="h-4 w-4" />;
      case 'leads': return <Target className="h-4 w-4" />;
      case 'fleet': return <MapPin className="h-4 w-4" />;
      case 'ai': return <Brain className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const handleQuickFix = (moduleId: string, issue: string) => {
    setFixRequest({
      module: moduleId,
      issue,
      priority: 'high',
      description: `Auto-detected issue: ${issue}`,
      autoFix: true
    });
    fixMutation.mutate({
      module: moduleId,
      issue,
      priority: 'high',
      description: `Auto-detected issue: ${issue}`,
      autoFix: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <Wrench className="h-6 w-6" />
              <h1 className="text-xl font-bold">Fix Anything Module</h1>
            </div>
            <Badge 
              variant={systemHealth === 'healthy' ? 'default' : systemHealth === 'warning' ? 'secondary' : 'destructive'}
              className="ml-2"
            >
              System {systemHealth.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries()}
              disabled={fixMutation.isPending}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh All
            </Button>
            <Button
              size="sm"
              onClick={() => handleQuickFix('all', 'system-optimization')}
              disabled={fixMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="h-4 w-4 mr-1" />
              Auto-Fix All
            </Button>
          </div>
        </div>
      </div>

      {/* Quick System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active Modules</p>
                <p className="text-2xl font-bold text-green-800">
                  {SYSTEM_MODULES.filter(m => m.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Issues Detected</p>
                <p className="text-2xl font-bold text-red-800">
                  {SYSTEM_MODULES.reduce((total, m) => total + (m.metrics?.errors || 0), 0)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Avg Performance</p>
                <p className="text-2xl font-bold text-blue-800">
                  {Math.round(SYSTEM_MODULES.reduce((total, m) => total + (m.metrics?.performance || 0), 0) / SYSTEM_MODULES.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Uptime</p>
                <p className="text-2xl font-bold text-purple-800">
                  {Math.round(SYSTEM_MODULES.reduce((total, m) => total + (m.metrics?.uptime || 0), 0) / SYSTEM_MODULES.length * 10) / 10}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Control Interface */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            All Systems
          </TabsTrigger>
          <TabsTrigger value="core" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Core
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Fleet
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module Management Panel */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Module Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredModules().map(module => (
                    <div key={module.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(module.category)}
                          <span className="font-medium">{module.name}</span>
                          {getStatusIcon(module.status)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {module.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      
                      {module.metrics && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Uptime</p>
                            <p className="text-sm font-medium">{module.metrics.uptime}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Performance</p>
                            <p className="text-sm font-medium">{module.metrics.performance}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Errors</p>
                            <p className="text-sm font-medium text-red-600">{module.metrics.errors}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {module.actions.map(action => (
                          <Button
                            key={action}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              if (action === 'restart') {
                                restartMutation.mutate(module.id);
                              } else {
                                handleQuickFix(module.id, `${action}-issue`);
                              }
                            }}
                          >
                            {action}
                          </Button>
                        ))}
                        {module.metrics && module.metrics.errors > 0 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-xs"
                            onClick={() => handleQuickFix(module.id, 'error-resolution')}
                          >
                            Fix Errors ({module.metrics.errors})
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fix Request Panel */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Fix Request Console
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="module-select">Target Module</Label>
                  <Select value={fixRequest.module} onValueChange={(value) => setFixRequest(prev => ({ ...prev, module: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module to fix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {SYSTEM_MODULES.map(module => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select value={fixRequest.issue} onValueChange={(value) => setFixRequest(prev => ({ ...prev, issue: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Degradation</SelectItem>
                      <SelectItem value="errors">Error Resolution</SelectItem>
                      <SelectItem value="connectivity">Connectivity Issues</SelectItem>
                      <SelectItem value="configuration">Configuration Problem</SelectItem>
                      <SelectItem value="optimization">Optimization Request</SelectItem>
                      <SelectItem value="custom">Custom Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={fixRequest.priority} onValueChange={(value: any) => setFixRequest(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue or what needs to be fixed..."
                    value={fixRequest.description}
                    onChange={(e) => setFixRequest(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-fix"
                    checked={fixRequest.autoFix}
                    onCheckedChange={(checked) => setFixRequest(prev => ({ ...prev, autoFix: checked }))}
                  />
                  <Label htmlFor="auto-fix">Enable Automatic Fix</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => fixMutation.mutate(fixRequest)}
                    disabled={!fixRequest.module || !fixRequest.issue || fixMutation.isPending}
                    className="flex-1"
                  >
                    {fixMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Fixing...
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4 mr-2" />
                        Execute Fix
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setFixRequest({
                      module: '',
                      issue: '',
                      priority: 'medium',
                      description: '',
                      autoFix: true
                    })}
                  >
                    Reset
                  </Button>
                </div>

                {fixMutation.isSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">Fix request submitted successfully</span>
                    </div>
                  </div>
                )}

                {fixMutation.isError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">Fix request failed. Please try again.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}