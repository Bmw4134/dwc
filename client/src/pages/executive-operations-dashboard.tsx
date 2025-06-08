import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Activity, 
  Shield, 
  Zap, 
  Database, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Server,
  Settings,
  Target,
  BarChart3,
  Eye,
  Cog
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function ExecutiveOperationsDashboard() {
  const [viewMode, setViewMode] = useState<'executive' | 'operations'>('executive');
  const [systemHealth, setSystemHealth] = useState({
    overall: 98.7,
    quantum: 94.2,
    security: 99.1,
    performance: 96.8,
    uptime: 99.97
  });

  const [businessMetrics, setBusinessMetrics] = useState({
    totalRevenue: '$2.4M',
    monthlyGrowth: '+34%',
    activeClients: 127,
    automationsSaved: '$847K',
    leadsGenerated: 1834,
    conversionRate: '23.4%',
    avgDealSize: '$18,900',
    pipelineValue: '$3.2M'
  });

  const [operationalMetrics, setOperationalMetrics] = useState({
    apiResponseTime: '47ms',
    databaseQueries: '2.3ms',
    activeConnections: 1247,
    errorRate: '0.02%',
    cpuUsage: 34,
    memoryUsage: 67,
    diskUsage: 45,
    networkThroughput: '2.3 GB/h'
  });

  // Fetch dashboard statistics
  const { data: stats } = useQuery<{
    totalLeads: number;
    qualifiedLeads: number;
    activeProposals: number;
    totalRevenue: number;
    conversionRate: number;
    avgDealSize: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000
  });

  // Real-time metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        overall: Math.max(95, Math.min(100, prev.overall + (Math.random() - 0.5) * 2)),
        quantum: Math.max(90, Math.min(99, prev.quantum + (Math.random() - 0.5) * 3)),
        security: Math.max(98, Math.min(100, prev.security + (Math.random() - 0.5) * 1)),
        performance: Math.max(94, Math.min(100, prev.performance + (Math.random() - 0.5) * 2.5)),
        uptime: Math.max(99.5, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1))
      }));

      setOperationalMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        activeConnections: Math.max(800, Math.min(1500, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100)))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sample chart data
  const revenueData = [
    { month: 'Jan', revenue: 185000, target: 180000 },
    { month: 'Feb', revenue: 220000, target: 200000 },
    { month: 'Mar', revenue: 285000, target: 250000 },
    { month: 'Apr', revenue: 340000, target: 320000 },
    { month: 'May', revenue: 420000, target: 400000 },
    { month: 'Jun', revenue: 485000, target: 450000 }
  ];

  const clientDistribution = [
    { name: 'Healthcare', value: 35, color: '#3B82F6' },
    { name: 'Professional Services', value: 25, color: '#10B981' },
    { name: 'Manufacturing', value: 20, color: '#F59E0B' },
    { name: 'Retail', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' }
  ];

  const systemPerformanceData = [
    { time: '00:00', cpu: 25, memory: 45, network: 12 },
    { time: '04:00', cpu: 18, memory: 42, network: 8 },
    { time: '08:00', cpu: 35, memory: 58, network: 22 },
    { time: '12:00', cpu: 42, memory: 65, network: 28 },
    { time: '16:00', cpu: 38, memory: 62, network: 25 },
    { time: '20:00', cpu: 28, memory: 52, network: 18 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {viewMode === 'executive' ? 'Executive Dashboard' : 'Operations Center'}
            </h1>
            <p className="text-blue-200">
              {viewMode === 'executive' 
                ? 'Strategic oversight and business intelligence'
                : 'System monitoring and operational metrics'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-lg">
              <Label htmlFor="view-toggle" className="text-white font-medium">
                <Eye className="h-4 w-4 mr-2 inline" />
                View Mode
              </Label>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${viewMode === 'executive' ? 'text-blue-400' : 'text-gray-400'}`}>
                  Executive
                </span>
                <Switch
                  id="view-toggle"
                  checked={viewMode === 'operations'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'operations' : 'executive')}
                />
                <span className={`text-sm ${viewMode === 'operations' ? 'text-green-400' : 'text-gray-400'}`}>
                  Operations
                </span>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-green-50/10 text-green-400 border-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
        </div>

        {/* Executive View */}
        {viewMode === 'executive' && (
          <div className="space-y-6">
            {/* Executive KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Revenue Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(stats?.totalRevenue || 0).toLocaleString()}</div>
                  <p className="text-green-100 text-sm">{businessMetrics.monthlyGrowth} growth</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Active Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessMetrics.activeClients}</div>
                  <p className="text-blue-100 text-sm">{(stats?.conversionRate || 0).toFixed(1)}% conversion</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Pipeline Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessMetrics.pipelineValue}</div>
                  <p className="text-purple-100 text-sm">{stats?.activeProposals || 0} active proposals</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Deal Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(stats?.avgDealSize || 0).toLocaleString()}</div>
                  <p className="text-orange-100 text-sm">Average deal value</p>
                </CardContent>
              </Card>
            </div>

            {/* Executive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Growth Trend</CardTitle>
                  <CardDescription className="text-gray-400">Monthly revenue vs targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                      <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Client Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Revenue by industry sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clientDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {clientDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {clientDistribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-300">{item.name}</span>
                        <span className="text-sm text-white font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Operations View */}
        {viewMode === 'operations' && (
          <div className="space-y-6">
            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Activity className="h-4 w-4 mr-2 text-green-400" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{systemHealth.overall.toFixed(1)}%</div>
                  <Progress value={systemHealth.overall} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Zap className="h-4 w-4 mr-2 text-blue-400" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{operationalMetrics.apiResponseTime}</div>
                  <p className="text-blue-200 text-sm">API response time</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Database className="h-4 w-4 mr-2 text-purple-400" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{operationalMetrics.databaseQueries}</div>
                  <p className="text-purple-200 text-sm">Query response time</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-yellow-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-white">
                    <Users className="h-4 w-4 mr-2 text-yellow-400" />
                    Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{operationalMetrics.activeConnections.toLocaleString()}</div>
                  <p className="text-yellow-200 text-sm">Active connections</p>
                </CardContent>
              </Card>
            </div>

            {/* Resource Usage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{operationalMetrics.cpuUsage}%</div>
                  <Progress value={operationalMetrics.cpuUsage} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{operationalMetrics.memoryUsage}%</div>
                  <Progress value={operationalMetrics.memoryUsage} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{operationalMetrics.diskUsage}%</div>
                  <Progress value={operationalMetrics.diskUsage} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-white">System Performance (24h)</CardTitle>
                <CardDescription className="text-gray-400">CPU, Memory, and Network utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory %" />
                    <Line type="monotone" dataKey="network" stroke="#F59E0B" strokeWidth={2} name="Network %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}