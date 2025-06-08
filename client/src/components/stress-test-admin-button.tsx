import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Activity,
  Target,
  TrendingUp
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface StressTestResults {
  totalTests: number;
  successRate: number;
  avgResponseTime: number;
  criticalIssues: string[];
  performanceScore: number;
  timestamp: Date;
}

export default function StressTestAdminButton() {
  const [testResults, setTestResults] = useState<StressTestResults | null>(null);
  const { toast } = useToast();

  const stressTestMutation = useMutation({
    mutationFn: async (): Promise<{ results: StressTestResults }> => {
      const response = await fetch('/api/stress-test/kate/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Stress test failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(data.results);
      toast({
        title: "Stress Test Complete",
        description: `Success rate: ${data.results.successRate.toFixed(1)}% - ${data.results.criticalIssues.length} issues found`,
        variant: data.results.successRate > 80 ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Stress Test Failed",
        description: error.message || "Failed to complete stress test",
        variant: "destructive",
      });
    },
  });

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 85) return { text: "Excellent", color: "bg-green-500/20 text-green-400" };
    if (score >= 70) return { text: "Good", color: "bg-yellow-500/20 text-yellow-400" };
    return { text: "Needs Work", color: "bg-red-500/20 text-red-400" };
  };

  return (
    <Card className="bg-gray-900/95 border-gray-700/50 backdrop-blur-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Kate Automation Stress Test
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Launch Button */}
        <Button
          onClick={() => stressTestMutation.mutate()}
          disabled={stressTestMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {stressTestMutation.isPending ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Running Stress Test...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Launch Comprehensive Test
            </>
          )}
        </Button>

        {/* Test Configuration Info */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
          <h4 className="text-white font-medium mb-2 text-sm">Test Configuration</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">
              <span className="text-blue-300">25</span> Concurrent Users
            </div>
            <div className="text-gray-400">
              <span className="text-blue-300">10 min</span> Duration
            </div>
            <div className="text-gray-400">
              <span className="text-blue-300">50</span> Actions/User
            </div>
            <div className="text-gray-400">
              <span className="text-blue-300">40%</span> Mobile Users
            </div>
          </div>
        </div>

        {/* Results Display */}
        {testResults && (
          <div className="space-y-3">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Test Results</h4>
                <Badge className={getPerformanceBadge(testResults.performanceScore).color}>
                  {getPerformanceBadge(testResults.performanceScore).text}
                </Badge>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getPerformanceColor(testResults.successRate)}`}>
                    {testResults.successRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getPerformanceColor(100 - (testResults.avgResponseTime / 50))}`}>
                    {testResults.avgResponseTime.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-gray-400">Avg Response</div>
                </div>
              </div>

              {/* Performance Score */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Performance Score</span>
                  <span className={`font-medium ${getPerformanceColor(testResults.performanceScore)}`}>
                    {testResults.performanceScore}/100
                  </span>
                </div>
                <Progress 
                  value={testResults.performanceScore} 
                  className="h-2 bg-gray-700"
                />
              </div>

              {/* Test Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-blue-300 font-medium">{testResults.totalTests}</div>
                  <div className="text-gray-400">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-green-300 font-medium">
                    {Math.round((testResults.successRate / 100) * testResults.totalTests)}
                  </div>
                  <div className="text-gray-400">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-red-300 font-medium">{testResults.criticalIssues.length}</div>
                  <div className="text-gray-400">Issues</div>
                </div>
              </div>
            </div>

            {/* Critical Issues */}
            {testResults.criticalIssues.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-300 font-medium text-sm">Critical Issues</span>
                </div>
                <div className="space-y-1">
                  {testResults.criticalIssues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="text-xs text-red-200 truncate">
                      • {issue}
                    </div>
                  ))}
                  {testResults.criticalIssues.length > 3 && (
                    <div className="text-xs text-red-300">
                      +{testResults.criticalIssues.length - 3} more issues
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Indicator */}
            {testResults.successRate >= 80 && testResults.criticalIssues.length === 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 font-medium text-sm">
                    System Ready for Production
                  </span>
                </div>
                <div className="text-xs text-green-200 mt-1">
                  All automation systems are performing optimally
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test Coverage Info */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
          <h4 className="text-white font-medium mb-2 text-sm">Test Coverage</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>• Lead capture forms</div>
            <div>• Mobile responsiveness</div>
            <div>• Theme transitions</div>
            <div>• Admin widget drag</div>
            <div>• Navigation system</div>
            <div>• Performance metrics</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}