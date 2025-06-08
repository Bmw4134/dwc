import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MousePointer2, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Eye,
  Smartphone,
  Monitor,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";

interface BehaviorInsights {
  commonPaths: string[];
  dropOffPoints: string[];
  highValueJourneys: string[];
  mobileVsDesktopPatterns: {
    mobile: string[];
    desktop: string[];
  };
  timeBasedPatterns: {
    peakEngagementHours: number[];
    averageSessionLength: number;
    bounceRateByPage: Record<string, number>;
  };
}

interface PredictedBehavior {
  nextLikelyActions: string[];
  probabilityScore: number;
  timeToNextAction: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'critical';
  conversionPath: string[];
  optimizationSuggestions: string[];
}

interface SimulatedJourney {
  predictedJourney: string[];
  engagementMetrics: {
    totalTimeSpent: number;
    pagesVisited: number;
    conversionLikelihood: number;
    dropOffRisk: number;
  };
  qnisInsights: {
    behaviorType: string;
    personalityProfile: string;
    recommendedExperience: string;
  };
}

export function QNISBehaviorDashboard() {
  const [currentPage, setCurrentPage] = useState('/');
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState({
    sessionId: 'current_session',
    clickSequence: ['/'],
    timeOnPage: 145,
    scrollDepth: 78,
    interactionType: 'exploration' as const,
    deviceType: 'desktop' as const,
    exitIntent: false,
    conversionProbability: 0.85
  });

  // Real-time page tracking
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPage]);

  // Behavior Insights Query
  const { data: behaviorInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/qnis/behavior-insights'],
    refetchInterval: 30000
  });

  // Real-time Recommendations Query
  const { data: recommendations } = useQuery({
    queryKey: ['/api/qnis/recommendations', currentPage, timeOnPage],
    enabled: timeOnPage > 0,
    refetchInterval: 10000
  });

  // Behavior Prediction Mutation
  const predictBehavior = useMutation({
    mutationFn: async (pattern: typeof selectedPattern) => {
      const response = await fetch('/api/qnis/predict-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPattern: pattern })
      });
      return response.json();
    }
  });

  // Journey Simulation Mutation
  const simulateJourney = useMutation({
    mutationFn: async (pattern: typeof selectedPattern) => {
      const response = await fetch('/api/qnis/simulate-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startingPattern: pattern })
      });
      return response.json();
    }
  });

  const insights = behaviorInsights?.insights as BehaviorInsights;
  const prediction = predictBehavior.data?.prediction as PredictedBehavior;
  const simulation = simulateJourney.data?.simulation as SimulatedJourney;
  const realtimeRecs = recommendations?.recommendations;

  if (insightsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QNIS Behavior Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MousePointer2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QNIS Behavior Analytics</h1>
            <p className="text-sm text-gray-600">Real-time user interaction prediction and optimization</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-blue-600">
            Live Tracking
          </Badge>
          <Badge variant="outline">
            Page: {currentPage}
          </Badge>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time on Page</p>
                <p className="text-2xl font-bold">{timeOnPage}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold">{Math.round(insights?.timeBasedPatterns?.averageSessionLength / 60) || 0}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{Math.round(selectedPattern.conversionProbability * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-2xl font-bold">{prediction?.engagementLevel || 'High'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="predictions">QNIS Predictions</TabsTrigger>
          <TabsTrigger value="simulation">Journey Simulation</TabsTrigger>
          <TabsTrigger value="recommendations">Live Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Common User Paths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRight className="w-5 h-5" />
                  <span>Most Common Paths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {insights?.commonPaths?.map((path, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="text-sm font-mono">{path}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* High Value Journeys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>High Conversion Journeys</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {insights?.highValueJourneys?.map((journey, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <Badge className="bg-green-600">{index + 1}</Badge>
                        <span className="text-sm font-mono">{journey}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Device Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Device Behavior Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="font-medium">Mobile Users</span>
                    </div>
                    <div className="space-y-1">
                      {insights?.mobileVsDesktopPatterns?.mobile?.map((pattern, index) => (
                        <p key={index} className="text-sm text-gray-600">{pattern}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Monitor className="w-4 h-4" />
                      <span className="font-medium">Desktop Users</span>
                    </div>
                    <div className="space-y-1">
                      {insights?.mobileVsDesktopPatterns?.desktop?.map((pattern, index) => (
                        <p key={index} className="text-sm text-gray-600">{pattern}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drop-off Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Attention Points</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights?.dropOffPoints?.map((point, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>QNIS Behavior Prediction</CardTitle>
                <CardDescription>Click "Predict" to analyze current user pattern</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => predictBehavior.mutate(selectedPattern)}
                  disabled={predictBehavior.isPending}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {predictBehavior.isPending ? 'Analyzing...' : 'Predict Next Actions'}
                </Button>

                {prediction && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Next Likely Actions</h4>
                      <div className="space-y-2">
                        {prediction.nextLikelyActions?.map((action, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm font-mono">{action}</span>
                            <Badge variant="outline">{Math.round(prediction.probabilityScore * 100)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Engagement Level</h4>
                      <Badge className={`${
                        prediction.engagementLevel === 'critical' ? 'bg-red-600' :
                        prediction.engagementLevel === 'high' ? 'bg-orange-600' :
                        prediction.engagementLevel === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
                      }`}>
                        {prediction.engagementLevel?.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Predicted Conversion Path</h4>
                      <div className="space-y-1">
                        {prediction.conversionPath?.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">{index + 1}</span>
                            <span className="text-sm font-mono">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                {prediction?.optimizationSuggestions && (
                  <div className="space-y-3">
                    {prediction.optimizationSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Extended User Journey Simulation</CardTitle>
              <CardDescription>Simulate predicted user behavior over multiple page visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => simulateJourney.mutate(selectedPattern)}
                disabled={simulateJourney.isPending}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                {simulateJourney.isPending ? 'Simulating...' : 'Run Journey Simulation'}
              </Button>

              {simulation && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Predicted Journey</h4>
                    <div className="space-y-2">
                      {simulation.predictedJourney?.map((page, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          <span className="text-xs bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">{index + 1}</span>
                          <span className="text-sm font-mono">{page}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Engagement Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Time Spent</span>
                          <span className="font-medium">{Math.round(simulation.engagementMetrics?.totalTimeSpent / 60)}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Pages Visited</span>
                          <span className="font-medium">{simulation.engagementMetrics?.pagesVisited}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion Likelihood</span>
                          <span className="font-medium">{Math.round(simulation.engagementMetrics?.conversionLikelihood * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">QNIS Profile Analysis</h4>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Behavior Type:</strong> {simulation.qnisInsights?.behaviorType}</p>
                        <p className="text-sm"><strong>Profile:</strong> {simulation.qnisInsights?.personalityProfile}</p>
                        <p className="text-sm"><strong>Recommendation:</strong> {simulation.qnisInsights?.recommendedExperience}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Optimization Recommendations</CardTitle>
              <CardDescription>Live suggestions based on current user behavior</CardDescription>
            </CardHeader>
            <CardContent>
              {realtimeRecs && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-red-600">Urgent Actions</h4>
                    <div className="space-y-2">
                      {realtimeRecs.urgentActions?.map((action: string, index: number) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">Content Optimizations</h4>
                    <div className="space-y-2">
                      {realtimeRecs.contentOptimizations?.map((opt: string, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm">{opt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-green-600">Next Best Actions</h4>
                    <div className="space-y-2">
                      {realtimeRecs.nextBestActions?.map((action: string, index: number) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}