import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Terminal, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Database,
  Activity
} from 'lucide-react';

interface APIEndpoint {
  name: string;
  method: string;
  url: string;
  description: string;
  status: 'success' | 'error' | 'pending' | 'idle';
  responseTime?: number;
  lastTested?: string;
}

export default function ApiTesting() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [activeTests, setActiveTests] = useState<Set<string>>(new Set());

  // Core API endpoints to test
  const endpoints: APIEndpoint[] = [
    {
      name: 'Dashboard Metrics',
      method: 'GET',
      url: '/api/dashboard/metrics',
      description: 'Real-time dashboard data and performance metrics',
      status: 'idle'
    },
    {
      name: 'NEXUS System Status',
      method: 'GET', 
      url: '/api/nexus/system-status',
      description: 'NEXUS master control and automation status',
      status: 'idle'
    },
    {
      name: 'Observer Status',
      method: 'GET',
      url: '/api/nexus/observer/status', 
      description: 'Human simulation core monitoring status',
      status: 'idle'
    },
    {
      name: 'Recent Activity',
      method: 'GET',
      url: '/api/dashboard/recent-activity',
      description: 'Latest system activities and events',
      status: 'idle'
    },
    {
      name: 'Business Metrics',
      method: 'GET',
      url: '/api/dashboard/business-metrics',
      description: 'Revenue, conversion, and business analytics',
      status: 'idle'
    },
    {
      name: 'Observer Validation',
      method: 'POST',
      url: '/api/nexus/observer/validate',
      description: 'Trigger system validation and health check',
      status: 'idle'
    }
  ];

  const testEndpoint = async (endpoint: APIEndpoint) => {
    const testKey = `${endpoint.method}:${endpoint.url}`;
    setActiveTests(prev => new Set([...prev, testKey]));
    
    const startTime = Date.now();
    
    try {
      const response = await apiRequest(endpoint.method as any, endpoint.url);
      const responseTime = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'success',
          responseTime,
          data: response,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'error',
          responseTime: Date.now() - startTime,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setActiveTests(prev => {
        const updated = new Set(prev);
        updated.delete(testKey);
        return updated;
      });
    }
  };

  const testAllEndpoints = async () => {
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getEndpointStatus = (endpoint: APIEndpoint) => {
    const testKey = `${endpoint.method}:${endpoint.url}`;
    const result = testResults[testKey];
    const isActive = activeTests.has(testKey);
    
    if (isActive) return 'pending';
    if (!result) return 'idle';
    return result.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      success: 'bg-green-500/20 text-green-400',
      error: 'bg-red-500/20 text-red-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      idle: 'bg-gray-500/20 text-gray-400'
    };
    return colors[status] || colors.idle;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-green-300">API Testing Suite</h1>
              <p className="text-green-400/70 font-mono text-sm">Real-time endpoint validation and monitoring</p>
            </div>
          </div>
          <Button
            onClick={testAllEndpoints}
            disabled={activeTests.size > 0}
            className="bg-green-600 hover:bg-green-700 text-black"
          >
            <Zap className="w-4 h-4 mr-2" />
            Test All Endpoints
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Total Endpoints</p>
                  <p className="text-2xl font-bold text-green-300">{endpoints.length}</p>
                </div>
                <Database className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Successful</p>
                  <p className="text-2xl font-bold text-green-300">
                    {Object.values(testResults).filter(r => r.status === 'success').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-red-400">
                    {Object.values(testResults).filter(r => r.status === 'error').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Active Tests</p>
                  <p className="text-2xl font-bold text-yellow-400">{activeTests.size}</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-green-500/20">
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Endpoint Tests
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Test Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <div className="grid gap-4">
              {endpoints.map((endpoint, index) => {
                const status = getEndpointStatus(endpoint);
                const testKey = `${endpoint.method}:${endpoint.url}`;
                const result = testResults[testKey];
                
                return (
                  <Card key={index} className="bg-gray-900 border-green-500/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(status)}
                          <div>
                            <CardTitle className="text-green-300 text-lg">{endpoint.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs font-mono border-green-500/20 text-green-400">
                                {endpoint.method}
                              </Badge>
                              <span className="text-green-400/70 text-sm font-mono">{endpoint.url}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusBadge(status)}>
                            {status.toUpperCase()}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => testEndpoint(endpoint)}
                            disabled={activeTests.has(testKey)}
                            className="bg-green-600 hover:bg-green-700 text-black"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Test
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-green-400/70 text-sm mb-3">{endpoint.description}</p>
                      {result && (
                        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-green-400/70">Response Time:</span>
                            <span className="text-green-300 ml-2">{result.responseTime}ms</span>
                          </div>
                          <div>
                            <span className="text-green-400/70">Last Tested:</span>
                            <span className="text-green-300 ml-2">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-400/70">Status:</span>
                            <span className={`ml-2 ${result.status === 'success' ? 'text-green-300' : 'text-red-400'}`}>
                              {result.status === 'success' ? 'OK' : 'ERROR'}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-300">Detailed Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(testResults).map(([testKey, result]) => (
                    <div key={testKey} className="border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-green-300">{testKey}</span>
                        <Badge className={getStatusBadge(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="bg-gray-800 rounded p-3 text-xs font-mono max-h-40 overflow-auto">
                        <pre className="text-green-400">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                  {Object.keys(testResults).length === 0 && (
                    <div className="text-center py-8 text-green-400/70">
                      No test results yet. Run some endpoint tests to see detailed results here.
                    </div>
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