import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, Clock, Plus, Play, Smartphone, Wifi, Shield } from "lucide-react";

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  expectedStatus: number;
  requiresAuth: boolean;
  testPayload?: any;
  headers?: Record<string, string>;
  lastTested?: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  responseTime?: number;
  errorMessage?: string;
}

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
  timestamp: string;
}

export default function MobileApiManager() {
  const [newEndpoint, setNewEndpoint] = useState({
    id: '',
    name: '',
    url: '',
    method: 'GET' as const,
    expectedStatus: 200,
    requiresAuth: false,
    testPayload: '',
    headers: ''
  });

  // Fetch API endpoints status
  const { data: endpoints, isLoading: endpointsLoading } = useQuery({
    queryKey: ['/api/verification/endpoints'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent test results
  const { data: testResults } = useQuery({
    queryKey: ['/api/verification/results'],
    refetchInterval: 30000
  });

  // Test single endpoint
  const testEndpointMutation = useMutation({
    mutationFn: async (endpointId: string) => {
      return apiRequest(`/api/verification/test/${endpointId}`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/endpoints'] });
      queryClient.invalidateQueries({ queryKey: ['/api/verification/results'] });
    }
  });

  // Test all endpoints
  const testAllMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/verification/test-all', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/endpoints'] });
      queryClient.invalidateQueries({ queryKey: ['/api/verification/results'] });
    }
  });

  // Add new endpoint
  const addEndpointMutation = useMutation({
    mutationFn: async (endpoint: any) => {
      return apiRequest('/api/verification/endpoints', {
        method: 'POST',
        body: JSON.stringify(endpoint),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/endpoints'] });
      setNewEndpoint({
        id: '',
        name: '',
        url: '',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        testPayload: '',
        headers: ''
      });
    }
  });

  // Start/stop monitoring
  const monitoringMutation = useMutation({
    mutationFn: async (action: 'start' | 'stop') => {
      return apiRequest(`/api/verification/monitoring/${action}`, {
        method: 'POST'
      });
    }
  });

  const handleAddEndpoint = () => {
    try {
      const endpoint = {
        ...newEndpoint,
        id: newEndpoint.id || `custom_${Date.now()}`,
        testPayload: newEndpoint.testPayload ? JSON.parse(newEndpoint.testPayload) : undefined,
        headers: newEndpoint.headers ? JSON.parse(newEndpoint.headers) : undefined
      };
      addEndpointMutation.mutate(endpoint);
    } catch (error) {
      console.error('Invalid JSON in payload or headers');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Down</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  const healthSummary = endpoints ? {
    total: endpoints.length,
    healthy: endpoints.filter((e: ApiEndpoint) => e.status === 'healthy').length,
    degraded: endpoints.filter((e: ApiEndpoint) => e.status === 'degraded').length,
    down: endpoints.filter((e: ApiEndpoint) => e.status === 'down').length
  } : { total: 0, healthy: 0, degraded: 0, down: 0 };

  const overallHealth = healthSummary.total > 0 
    ? Math.round((healthSummary.healthy / healthSummary.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* Mobile-Optimized Header */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Smartphone className="h-6 w-6 text-blue-500" />
            <Wifi className="h-6 w-6 text-green-500" />
            <Shield className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mobile API Management Center
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Monitor and manage all APIs from your iPhone. No Replit access required.
          </p>
        </div>

        {/* Health Overview Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">System Health</CardTitle>
              <div className="text-2xl font-bold text-blue-600">{overallHealth}%</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="space-y-1">
                <div className="text-lg font-semibold">{healthSummary.total}</div>
                <div className="text-xs text-muted-foreground">Total APIs</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-green-600">{healthSummary.healthy}</div>
                <div className="text-xs text-muted-foreground">Healthy</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-yellow-600">{healthSummary.degraded}</div>
                <div className="text-xs text-muted-foreground">Degraded</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-red-600">{healthSummary.down}</div>
                <div className="text-xs text-muted-foreground">Down</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => testAllMutation.mutate()}
            disabled={testAllMutation.isPending}
            className="h-12"
          >
            <Play className="w-4 h-4 mr-2" />
            {testAllMutation.isPending ? 'Testing...' : 'Test All'}
          </Button>
          <Button
            onClick={() => monitoringMutation.mutate('start')}
            disabled={monitoringMutation.isPending}
            variant="outline"
            className="h-12"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Start Monitor
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">APIs</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-3">
            {endpointsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading APIs...</div>
            ) : endpoints?.length === 0 ? (
              <Alert>
                <AlertDescription>No API endpoints configured yet.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {endpoints?.map((endpoint: ApiEndpoint) => (
                  <Card key={endpoint.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm truncate">{endpoint.name}</h3>
                          {getStatusBadge(endpoint.status)}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{endpoint.method}</Badge>
                            <span className="truncate">{endpoint.url}</span>
                          </div>
                          {endpoint.lastTested && (
                            <div>Last tested: {new Date(endpoint.lastTested).toLocaleTimeString()}</div>
                          )}
                          {endpoint.responseTime && (
                            <div>Response: {endpoint.responseTime}ms</div>
                          )}
                        </div>
                        {endpoint.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">{endpoint.errorMessage}</div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => testEndpointMutation.mutate(endpoint.id)}
                        disabled={testEndpointMutation.isPending}
                      >
                        Test
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Add New Tab */}
          <TabsContent value="add" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-sm">API Name</Label>
                    <Input
                      id="name"
                      value={newEndpoint.name}
                      onChange={(e) => setNewEndpoint({...newEndpoint, name: e.target.value})}
                      placeholder="My Custom API"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="url" className="text-sm">URL</Label>
                    <Input
                      id="url"
                      value={newEndpoint.url}
                      onChange={(e) => setNewEndpoint({...newEndpoint, url: e.target.value})}
                      placeholder="/api/my-endpoint"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="method" className="text-sm">Method</Label>
                      <Select
                        value={newEndpoint.method}
                        onValueChange={(value: any) => setNewEndpoint({...newEndpoint, method: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="status" className="text-sm">Expected Status</Label>
                      <Input
                        id="status"
                        type="number"
                        value={newEndpoint.expectedStatus}
                        onChange={(e) => setNewEndpoint({...newEndpoint, expectedStatus: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="payload" className="text-sm">Test Payload (JSON)</Label>
                    <Textarea
                      id="payload"
                      value={newEndpoint.testPayload}
                      onChange={(e) => setNewEndpoint({...newEndpoint, testPayload: e.target.value})}
                      placeholder='{"key": "value"}'
                      className="mt-1 text-xs"
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleAddEndpoint}
                  disabled={!newEndpoint.name || !newEndpoint.url || addEndpointMutation.isPending}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addEndpointMutation.isPending ? 'Adding...' : 'Add API Endpoint'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-3">
            {testResults?.length === 0 ? (
              <Alert>
                <AlertDescription>No test results available yet.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {testResults?.slice(0, 20).map((result: ApiTestResult, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium">{result.endpoint}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.responseTime}ms
                      </div>
                    </div>
                    {!result.success && result.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">{result.errorMessage}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}