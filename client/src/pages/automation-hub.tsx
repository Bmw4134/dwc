import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Square, 
  Monitor, 
  Activity, 
  Zap, 
  Settings, 
  RefreshCw,
  Target,
  TrendingUp,
  Globe,
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AutomationTask {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
}

interface AutomationSession {
  id: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
  currentUrl?: string;
}

export default function AutomationHub() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [scanLocation, setScanLocation] = useState('Fort Worth, TX');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active automation tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/automation/active-tasks'],
    refetchInterval: 3000,
    enabled: !!activeSession
  });

  // Fetch session status
  const { data: sessionData } = useQuery({
    queryKey: ['/api/automation/session-status', activeSession],
    refetchInterval: 5000,
    enabled: !!activeSession
  });

  const tasks: AutomationTask[] = tasksData?.tasks || [];
  const session: AutomationSession | null = sessionData || null;

  // Create automation session
  const createSessionMutation = useMutation({
    mutationFn: () => apiRequest('/api/automation/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: (data) => {
      setActiveSession(data.sessionId);
      toast({
        title: "Automation Session Created",
        description: "Dashboard automation is ready to start",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/active-tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Session Creation Failed",
        description: "Failed to create automation session",
        variant: "destructive",
      });
    }
  });

  // Execute full workflow
  const fullWorkflowMutation = useMutation({
    mutationFn: () => apiRequest(`/api/automation/execute-full-workflow/${activeSession}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      toast({
        title: "Full Automation Started",
        description: "Complete dashboard automation workflow is running",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/active-tasks'] });
    },
    onError: () => {
      toast({
        title: "Automation Failed",
        description: "Failed to start full automation workflow",
        variant: "destructive",
      });
    }
  });

  // Business scan automation
  const businessScanMutation = useMutation({
    mutationFn: () => apiRequest(`/api/automation/run-business-scan/${activeSession}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: scanLocation })
    }),
    onSuccess: () => {
      toast({
        title: "Business Scan Started",
        description: `Automated business scanning for ${scanLocation}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/active-tasks'] });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Failed to start business scan automation",
        variant: "destructive",
      });
    }
  });

  // Trading automation
  const tradingAutomationMutation = useMutation({
    mutationFn: () => apiRequest(`/api/automation/run-trading-automation/${activeSession}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      toast({
        title: "Trading Automation Started",
        description: "QQ trading automation is running",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/active-tasks'] });
    },
    onError: () => {
      toast({
        title: "Trading Automation Failed",
        description: "Failed to start trading automation",
        variant: "destructive",
      });
    }
  });

  // Close session
  const closeSessionMutation = useMutation({
    mutationFn: () => apiRequest(`/api/automation/session/${activeSession}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      setActiveSession(null);
      toast({
        title: "Session Closed",
        description: "Automation session has been terminated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/active-tasks'] });
    },
    onError: () => {
      toast({
        title: "Close Failed",
        description: "Failed to close automation session",
        variant: "destructive",
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'running': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Automation Hub</h1>
          <p className="text-purple-200">Dashboard Automation using Puppeteer & Playwright</p>
        </div>

        {/* Session Control */}
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Automation Session Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!activeSession ? (
                  <Button 
                    onClick={() => createSessionMutation.mutate()}
                    disabled={createSessionMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Session Active</span>
                    <Button 
                      onClick={() => closeSessionMutation.mutate()}
                      disabled={closeSessionMutation.isPending}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Close
                    </Button>
                  </div>
                )}
              </div>
              
              {session && (
                <div className="text-sm text-purple-200">
                  <div>Session ID: {activeSession}</div>
                  <div>Created: {new Date(session.createdAt).toLocaleTimeString()}</div>
                  {session.currentUrl && <div>Current: {session.currentUrl}</div>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Automation Controls */}
        {activeSession && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Full Workflow Automation */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Full Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-sm">
                  Complete end-to-end automation including QQ trading, business scanning, and intelligence analysis.
                </p>
                <Button 
                  onClick={() => fullWorkflowMutation.mutate()}
                  disabled={fullWorkflowMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Execute Full Automation
                </Button>
              </CardContent>
            </Card>

            {/* Business Scan Automation */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Business Scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location" className="text-purple-200 text-sm">Location</Label>
                  <Input
                    id="location"
                    value={scanLocation}
                    onChange={(e) => setScanLocation(e.target.value)}
                    placeholder="Enter location..."
                    className="mt-1 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <Button 
                  onClick={() => businessScanMutation.mutate()}
                  disabled={businessScanMutation.isPending || !scanLocation}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Start Business Scan
                </Button>
              </CardContent>
            </Card>

            {/* Trading Automation */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  QQ Trading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-200 text-sm">
                  Automated quantum trading with real market data and AI-powered signals.
                </p>
                <Button 
                  onClick={() => tradingAutomationMutation.mutate()}
                  disabled={tradingAutomationMutation.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Start Trading Bot
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Tasks */}
        {activeSession && (
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Active Automation Tasks
              </CardTitle>
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/automation/active-tasks'] })}
                variant="ghost"
                size="sm"
                className="text-purple-200"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-slate-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <h4 className="font-semibold text-white">{task.name}</h4>
                            <p className="text-sm text-purple-200">{task.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      {task.status === 'running' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-purple-200">Progress</span>
                            <span className="text-white">{task.progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>ID: {task.id}</span>
                        {task.startTime && (
                          <span>Started: {new Date(task.startTime).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-purple-200">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active automation tasks</p>
                  <p className="text-sm text-slate-400">Start an automation to see progress here</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Puppeteer Engine</p>
                  <p className="text-sm text-purple-200">Ready for automation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Playwright Engine</p>
                  <p className="text-sm text-purple-200">Ready for automation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Dashboard API</p>
                  <p className="text-sm text-purple-200">Connected and monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!activeSession && (
          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <Monitor className="w-16 h-16 mx-auto mb-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Dashboard Automation Engine
              </h3>
              <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
                Automate your dashboard interactions using Puppeteer and Playwright. 
                This system will handle everything from navigation to data extraction, 
                creating a complete plug-and-play automation experience.
              </p>
              <Button 
                onClick={() => createSessionMutation.mutate()}
                disabled={createSessionMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Automation Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}