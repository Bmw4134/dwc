import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Zap, 
  Brain, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Cpu,
  Activity,
  Target,
  Smartphone
} from "lucide-react";

interface QuantumIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'typescript' | 'runtime' | 'logical' | 'performance' | 'security';
  description: string;
  location: string;
  solution: string;
  automatedFix: boolean;
  quantum_priority: number;
}

interface KaizenResult {
  component: string;
  issues_detected: number;
  issues_fixed: number;
  performance_improvement: number;
  code_quality_score: number;
  quantum_optimization_level: number;
}

interface ExecutionResult {
  total_issues_found: number;
  total_issues_fixed: number;
  overall_improvement: number;
  quantum_transcendence_level: number;
  executive_summary: string[];
  timestamp: string;
}

export default function QuantumKaizenDashboard() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecution, setLastExecution] = useState<ExecutionResult | null>(null);

  // Execute Quantum Kaizen Analysis
  const executeMutation = useMutation({
    mutationFn: async () => {
      setIsExecuting(true);
      return apiRequest('/api/kaizen/execute', {
        method: 'POST'
      });
    },
    onSuccess: (data) => {
      setLastExecution(data);
      setIsExecuting(false);
      queryClient.invalidateQueries({ queryKey: ['/api/kaizen/issues'] });
      queryClient.invalidateQueries({ queryKey: ['/api/kaizen/results'] });
    },
    onError: () => {
      setIsExecuting(false);
    }
  });

  // Fetch current issues
  const { data: issues = [] } = useQuery({
    queryKey: ['/api/kaizen/issues'],
    refetchInterval: 30000
  });

  // Fetch optimization results
  const { data: results = [] } = useQuery({
    queryKey: ['/api/kaizen/results'],
    refetchInterval: 30000
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-600"><XCircle className="w-3 h-3 mr-1" />Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500"><AlertTriangle className="w-3 h-3 mr-1" />High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500"><CheckCircle className="w-3 h-3 mr-1" />Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      typescript: { icon: Cpu, color: 'bg-blue-600' },
      runtime: { icon: Activity, color: 'bg-red-600' },
      logical: { icon: Brain, color: 'bg-purple-600' },
      performance: { icon: TrendingUp, color: 'bg-green-600' },
      security: { icon: Shield, color: 'bg-orange-600' }
    };
    
    const config = typeMap[type as keyof typeof typeMap] || { icon: Target, color: 'bg-gray-600' };
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const issuesByType = issues.reduce((acc: Record<string, number>, issue: QuantumIssue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  const issuesBySeverity = issues.reduce((acc: Record<string, number>, issue: QuantumIssue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  const averageQualityScore = results.length > 0 
    ? results.reduce((sum: number, result: KaizenResult) => sum + result.code_quality_score, 0) / results.length 
    : 0;

  const totalOptimizationLevel = results.length > 0
    ? results.reduce((sum: number, result: KaizenResult) => sum + result.quantum_optimization_level, 0) / results.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            <Brain className="h-8 w-8 text-purple-500" />
            <Smartphone className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            QUANTUM KAIZEN EXECUTIVE SYSTEM
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quantum-level automated debugging and optimization engine for complete system transcendence
          </p>
        </div>

        {/* Execution Controls */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quantum Execution Control
            </CardTitle>
            <CardDescription>
              Execute full system analysis and automated debugging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isExecuting && (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    Quantum Kaizen analysis in progress... This may take several minutes.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button
                onClick={() => executeMutation.mutate()}
                disabled={isExecuting || executeMutation.isPending}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isExecuting ? (
                  <>
                    <Activity className="w-5 h-5 mr-2 animate-spin" />
                    Executing Quantum Analysis...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Execute Full Quantum Kaizen
                  </>
                )}
              </Button>

              {lastExecution && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Last Execution Results
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Issues Found</div>
                      <div className="text-lg text-red-600">{lastExecution.total_issues_found}</div>
                    </div>
                    <div>
                      <div className="font-medium">Issues Fixed</div>
                      <div className="text-lg text-green-600">{lastExecution.total_issues_fixed}</div>
                    </div>
                    <div>
                      <div className="font-medium">Improvement</div>
                      <div className="text-lg text-blue-600">{lastExecution.overall_improvement.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="font-medium">Transcendence</div>
                      <div className="text-lg text-purple-600">{lastExecution.quantum_transcendence_level}%</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Executed: {new Date(lastExecution.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {issues.length === 0 ? '100%' : `${Math.max(0, 100 - issues.length * 2)}%`}
                  </div>
                  <Progress 
                    value={issues.length === 0 ? 100 : Math.max(0, 100 - issues.length * 2)} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {averageQualityScore.toFixed(0)}%
                  </div>
                  <Progress value={averageQualityScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quantum Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {totalOptimizationLevel.toFixed(0)}%
                  </div>
                  <Progress value={totalOptimizationLevel} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(issuesByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        {getTypeBadge(type)}
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issues by Severity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(issuesBySeverity).map(([severity, count]) => (
                      <div key={severity} className="flex items-center justify-between">
                        {getSeverityBadge(severity)}
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-4">
            {issues.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  No issues detected. System is operating at quantum transcendence level.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {issues.map((issue: QuantumIssue) => (
                  <Card key={issue.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(issue.severity)}
                            {getTypeBadge(issue.type)}
                            {issue.automatedFix && (
                              <Badge className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Auto-Fix
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium">{issue.description}</h3>
                          <p className="text-sm text-muted-foreground">{issue.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Priority</div>
                          <div className="text-lg font-bold text-purple-600">{issue.quantum_priority}</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                          Quantum Solution
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{issue.solution}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {results.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No optimization results available. Execute Quantum Kaizen to generate results.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result: KaizenResult, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        {result.component}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Issues Detected</div>
                            <div className="text-lg text-red-600">{result.issues_detected}</div>
                          </div>
                          <div>
                            <div className="font-medium">Issues Fixed</div>
                            <div className="text-lg text-green-600">{result.issues_fixed}</div>
                          </div>
                          <div>
                            <div className="font-medium">Performance</div>
                            <div className="text-lg text-blue-600">+{result.performance_improvement}%</div>
                          </div>
                          <div>
                            <div className="font-medium">Quality Score</div>
                            <div className="text-lg text-purple-600">{result.code_quality_score}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-2">Quantum Optimization Level</div>
                          <Progress value={result.quantum_optimization_level} className="h-2" />
                          <div className="text-sm text-muted-foreground mt-1">
                            {result.quantum_optimization_level}% Transcendence
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Mobile Tab */}
          <TabsContent value="mobile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile API Management
                </CardTitle>
                <CardDescription>
                  Access API verification and system monitoring from your iPhone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Visit /mobile-api to access the mobile-optimized API management interface.
                    No Replit access required - manage everything from your iPhone.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">API Monitoring</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Real-time endpoint health checks</li>
                      <li>• Automated monitoring with alerts</li>
                      <li>• Response time tracking</li>
                      <li>• Mobile-friendly interface</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Remote Management</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Add new API endpoints remotely</li>
                      <li>• Test individual or all endpoints</li>
                      <li>• View detailed test results</li>
                      <li>• Start/stop monitoring services</li>
                    </ul>
                  </Card>
                </div>
                
                <Button className="w-full" onClick={() => window.open('/mobile-api', '_blank')}>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Open Mobile API Manager
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}