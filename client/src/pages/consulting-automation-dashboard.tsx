import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Search, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface PortalSession {
  platform: string;
  authenticated: boolean;
  lastActivity: string;
  currentUrl?: string;
}

interface AutomationTask {
  id: string;
  platform: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  timestamp: string;
}

export default function ConsultingAutomationDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [auditUrl, setAuditUrl] = useState('katewhitephotography.com');

  // Query portal sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['/api/portal/sessions'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Query automation tasks
  const { data: tasksData } = useQuery({
    queryKey: ['/api/portal/tasks'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Portal authentication mutation
  const authenticateMutation = useMutation({
    mutationFn: async (data: { platform: string; username: string; password: string }) => {
      return apiRequest('/api/portal/authenticate', {
        method: 'POST',
        body: JSON.stringify({
          platform: data.platform,
          username: data.username,
          password: data.password,
          loginUrl: getPlatformLoginUrl(data.platform)
        })
      });
    }
  });

  // Website audit mutation
  const auditMutation = useMutation({
    mutationFn: async (data: { url: string }) => {
      return apiRequest('/api/audit-website', {
        method: 'POST',
        body: JSON.stringify({
          url: data.url,
          businessInfo: { type: 'photography', location: 'Austin, TX' }
        })
      });
    }
  });

  // Task execution mutation
  const executeTaskMutation = useMutation({
    mutationFn: async (data: { platform: string; action: string; parameters: any }) => {
      return apiRequest('/api/portal/execute-task', {
        method: 'POST',
        body: JSON.stringify({
          taskId: `task_${Date.now()}`,
          platform: data.platform,
          action: data.action,
          parameters: data.parameters
        })
      });
    }
  });

  const getPlatformLoginUrl = (platform: string): string => {
    const urls: Record<string, string> = {
      'replit': 'https://replit.com/login',
      'chatgpt': 'https://chat.openai.com/auth/login',
      'github': 'https://github.com/login',
      'notion': 'https://www.notion.so/login',
      'wordpress': '/wp-admin',
      'shopify': '/admin/auth/login',
      'google_analytics': 'https://accounts.google.com/signin'
    };
    return urls[platform] || '';
  };

  const handleAuthenticate = () => {
    if (selectedPlatform && credentials.username && credentials.password) {
      authenticateMutation.mutate({
        platform: selectedPlatform,
        username: credentials.username,
        password: credentials.password
      });
    }
  };

  const handleAuditWebsite = () => {
    if (auditUrl) {
      auditMutation.mutate({ url: auditUrl });
    }
  };

  const handleExecuteTask = (platform: string, action: string, parameters: any) => {
    executeTaskMutation.mutate({ platform, action, parameters });
  };

  const platforms = [
    'replit', 'chatgpt', 'github', 'notion', 
    'wordpress', 'shopify', 'google_analytics'
  ];

  const sessions: PortalSession[] = sessionsData?.sessions || [];
  const tasks: AutomationTask[] = tasksData?.tasks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Consulting Business Automation
          </h1>
          <p className="text-blue-200">
            Complete Lead-to-Deal Pipeline with Cross-Platform Integration
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Sessions</p>
                  <p className="text-2xl font-bold text-white">
                    {sessions.filter(s => s.authenticated).length}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Running Tasks</p>
                  <p className="text-2xl font-bold text-white">
                    {tasks.filter(t => t.status === 'running').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed Today</p>
                  <p className="text-2xl font-bold text-white">
                    {tasks.filter(t => t.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenue Potential</p>
                  <p className="text-2xl font-bold text-white">$40K+</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="automation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="automation" className="text-white">Portal Automation</TabsTrigger>
            <TabsTrigger value="audit" className="text-white">Website Audit</TabsTrigger>
            <TabsTrigger value="leads" className="text-white">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="tasks" className="text-white">Task Monitor</TabsTrigger>
          </TabsList>

          {/* Portal Automation Tab */}
          <TabsContent value="automation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Authentication Panel */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Login Portal
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Authenticate with multiple platforms for automated management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Select Platform
                    </label>
                    <select 
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Choose platform...</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Username/Email
                    </label>
                    <Input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter username or email"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter password"
                    />
                  </div>

                  <Button 
                    onClick={handleAuthenticate}
                    disabled={authenticateMutation.isPending || !selectedPlatform}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {authenticateMutation.isPending ? 'Authenticating...' : 'Authenticate'}
                  </Button>

                  {authenticateMutation.error && (
                    <Alert className="border-red-500 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">
                        Authentication failed. Please check your credentials.
                      </AlertDescription>
                    </Alert>
                  )}

                  {authenticateMutation.data && (
                    <Alert className="border-green-500 bg-green-500/10">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-400">
                        Successfully authenticated with {selectedPlatform}!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Currently authenticated platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessions.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No active sessions. Authenticate with a platform to get started.
                      </p>
                    ) : (
                      sessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                          <div>
                            <p className="text-white font-medium">
                              {session.platform.charAt(0).toUpperCase() + session.platform.slice(1)}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Last active: {new Date(session.lastActivity).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={session.authenticated ? "default" : "destructive"}
                              className={session.authenticated ? "bg-green-600" : "bg-red-600"}
                            >
                              {session.authenticated ? 'Connected' : 'Disconnected'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExecuteTask(session.platform, 'monitor_performance', {})}
                              className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Website Audit Tab */}
          <TabsContent value="audit">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Website Performance Audit
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive analysis for Kate's photography business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    placeholder="Enter website URL"
                  />
                  <Button 
                    onClick={handleAuditWebsite}
                    disabled={auditMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {auditMutation.isPending ? 'Analyzing...' : 'Audit Website'}
                  </Button>
                </div>

                {auditMutation.data && (
                  <div className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {auditMutation.data.overallScore}/100
                            </p>
                            <p className="text-gray-400 text-sm">Overall Score</p>
                            <Progress 
                              value={auditMutation.data.overallScore} 
                              className="mt-2" 
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">
                              {auditMutation.data.potentialRevenue}
                            </p>
                            <p className="text-gray-400 text-sm">Revenue Potential</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">
                              {auditMutation.data.issues.filter((i: any) => i.severity === 'critical').length}
                            </p>
                            <p className="text-gray-400 text-sm">Critical Issues</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Top Priority Issues</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {auditMutation.data.issues.slice(0, 3).map((issue: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-600/50 rounded-md">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium">{issue.issue}</h4>
                                <Badge 
                                  variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}
                                  className={
                                    issue.severity === 'critical' ? 'bg-red-600' : 
                                    issue.severity === 'high' ? 'bg-orange-600' : 'bg-yellow-600'
                                  }
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{issue.impact}</p>
                              <p className="text-green-400 text-sm font-medium">
                                Solution: {issue.solution}
                              </p>
                              <p className="text-blue-400 text-sm">
                                Potential: {issue.potentialRevenueIncrease}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Pipeline Tab */}
          <TabsContent value="leads">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Lead Qualification Pipeline
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Kate White Photography - Active prospects and conversion opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-gray-400 text-sm">Qualified Leads</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">85%</p>
                      <p className="text-gray-400 text-sm">Conversion Rate</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">$24K</p>
                      <p className="text-gray-400 text-sm">Pipeline Value</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-white font-medium mb-4">Active Prospects</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah & Mike Johnson', type: 'Wedding', value: '$3,500', stage: 'Consultation Scheduled' },
                      { name: 'Austin Tech Corp', type: 'Corporate Headshots', value: '$2,800', stage: 'Proposal Sent' },
                      { name: 'The Martinez Family', type: 'Family Session', value: '$850', stage: 'Follow-up Needed' }
                    ].map((lead, index) => (
                      <div key={index} className="p-4 bg-gray-700/50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">{lead.name}</p>
                            <p className="text-gray-400 text-sm">{lead.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-medium">{lead.value}</p>
                            <Badge variant="secondary" className="bg-blue-600 text-white">
                              {lead.stage}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Monitor Tab */}
          <TabsContent value="tasks">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Automation Task Monitor
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time status of cross-platform automation tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No tasks running. Start portal automation to see activity here.
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="p-4 bg-gray-700/50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">
                              {task.platform.charAt(0).toUpperCase() + task.platform.slice(1)} - {task.action}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Started: {new Date(task.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                task.status === 'completed' ? 'default' : 
                                task.status === 'running' ? 'secondary' : 
                                task.status === 'failed' ? 'destructive' : 'outline'
                              }
                              className={
                                task.status === 'completed' ? 'bg-green-600' :
                                task.status === 'running' ? 'bg-blue-600' :
                                task.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
                              }
                            >
                              {task.status}
                            </Badge>
                            {task.status === 'running' && (
                              <Pause className="h-4 w-4 text-gray-400" />
                            )}
                            {task.status === 'failed' && (
                              <RotateCcw className="h-4 w-4 text-gray-400 cursor-pointer" />
                            )}
                          </div>
                        </div>
                        {task.result && (
                          <div className="mt-2 p-2 bg-gray-600/50 rounded text-xs text-gray-300">
                            <pre>{JSON.stringify(task.result, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}