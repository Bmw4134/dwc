import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Palette, Play, Square, CheckCircle, Clock, AlertCircle, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationTask {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  logs: string[];
}

interface ClientProject {
  id: string;
  clientName: string;
  businessType: string;
  domains?: string[];
  requirements: string[];
  status: 'discovery' | 'development' | 'testing' | 'deployed';
  automationTasks: AutomationTask[];
  progress: number;
}

export default function ClientAutomationDashboard() {
  const [currentProject, setCurrentProject] = useState<ClientProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const startKateProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/automation/start-kate-project', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start Kate\'s project');
      }
      
      const data = await response.json();
      setCurrentProject(data.project);
      setLogs(prev => [...prev, data.message]);
      
      toast({
        title: "Project Started",
        description: "Kate's photography automation project has been initialized",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start Kate's project automation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startDeluxProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/automation/start-delux-project', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to start Delux Graphics project');
      }
      
      const data = await response.json();
      setCurrentProject(data.project);
      setLogs(prev => [...prev, data.message]);
      
      toast({
        title: "Project Started",
        description: "Delux Graphics automation project has been initialized",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start Delux Graphics project automation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/automation/execute-task/${taskId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute task');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update the current project with task results
        setCurrentProject(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            automationTasks: prev.automationTasks.map(task => 
              task.id === taskId 
                ? { ...task, status: 'completed', result: result.result }
                : task
            )
          };
        });
        
        toast({
          title: "Task Completed",
          description: "Automation task executed successfully",
        });
      } else {
        throw new Error(result.error || 'Task execution failed');
      }
    } catch (error) {
      toast({
        title: "Task Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const runFullPipeline = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/automation/run-full-pipeline', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to run automation pipeline');
      }
      
      const data = await response.json();
      setLogs(prev => [...prev, data.message]);
      
      toast({
        title: "Pipeline Completed",
        description: "Full automation pipeline has been executed",
      });
      
      // Refresh project status
      fetchProjectStatus();
    } catch (error) {
      toast({
        title: "Pipeline Failed",
        description: "Failed to execute full automation pipeline",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectStatus = async () => {
    try {
      const response = await fetch('/api/automation/project-status');
      if (response.ok) {
        const data = await response.json();
        setCurrentProject(data.project);
      }
    } catch (error) {
      console.error('Failed to fetch project status:', error);
    }
  };

  useEffect(() => {
    fetchProjectStatus();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Automation Pipeline</h1>
          <p className="text-muted-foreground">
            Autonomous client workflow management for Kate's Photography and Delux Graphics
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={startKateProject} 
            disabled={isLoading}
            variant="outline"
          >
            <Camera className="h-4 w-4 mr-2" />
            Start Kate's Project
          </Button>
          
          <Button 
            onClick={startDeluxProject} 
            disabled={isLoading}
            variant="outline"
          >
            <Palette className="h-4 w-4 mr-2" />
            Start Delux Graphics
          </Button>
          
          {currentProject && (
            <Button 
              onClick={runFullPipeline} 
              disabled={isLoading}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Full Pipeline
            </Button>
          )}
        </div>
      </div>

      {currentProject ? (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentProject.businessType === 'Photography Services' ? (
                    <Camera className="h-5 w-5" />
                  ) : (
                    <Palette className="h-5 w-5" />
                  )}
                  {currentProject.clientName}
                </CardTitle>
                <CardDescription>{currentProject.businessType}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {currentProject.progress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={currentProject.progress} className="w-full" />
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(currentProject.status)}
                  >
                    {currentProject.status}
                  </Badge>
                </div>

                {currentProject.domains && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Domains</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.domains.map((domain, index) => (
                        <Badge key={index} variant="secondary">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentProject.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="grid gap-4">
              {currentProject.automationTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        {task.description}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{task.type}</Badge>
                        {task.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => executeTask(task.id)}
                            disabled={isLoading}
                          >
                            Execute
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {task.logs.length > 0 && (
                    <CardContent>
                      <ScrollArea className="h-20">
                        <div className="text-xs space-y-1">
                          {task.logs.map((log, index) => (
                            <div key={index} className="text-muted-foreground">
                              {log}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Automation Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Project</CardTitle>
            <CardDescription>
              Start an automation project for Kate's Photography or Delux Graphics to begin
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5" />
                <h3 className="font-medium">Kate's Photography</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Portfolio website with booking system and client management
              </p>
              <Button onClick={startKateProject} disabled={isLoading} className="w-full">
                Start Photography Project
              </Button>
            </div>
            
            <div className="flex-1 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-5 w-5" />
                <h3 className="font-medium">Delux Graphics</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Multi-domain automation for graphics and media business
              </p>
              <Button onClick={startDeluxProject} disabled={isLoading} className="w-full">
                Start Delux Graphics Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}