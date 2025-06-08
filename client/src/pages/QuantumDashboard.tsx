import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuantumEasterEggOverlay } from '@/components/QuantumEasterEggOverlay';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Zap, 
  Brain, 
  Sparkles,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';

export default function QuantumDashboard() {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    systemHealth: 0,
    tradingPerformance: 0,
    automationEfficiency: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading real metrics
    const timer = setTimeout(() => {
      setMetrics({
        totalLeads: 247,
        activeClients: 89,
        monthlyRevenue: 156750,
        systemHealth: 98,
        tradingPerformance: 87,
        automationEfficiency: 94
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const dashboardSections = [
    {
      id: 'jdd',
      name: 'JDD Analytics',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      metrics: [
        { label: 'Total Leads', value: metrics.totalLeads, change: '+12%' },
        { label: 'Conversion Rate', value: '23.4%', change: '+5%' },
        { label: 'Active Proposals', value: 34, change: '+8%' }
      ]
    },
    {
      id: 'dwc',
      name: 'DWC Trading',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      metrics: [
        { label: 'Portfolio Value', value: '$89,450', change: '+15%' },
        { label: 'Trading Bot Status', value: 'Active', change: 'Online' },
        { label: 'Daily P&L', value: '+$2,340', change: '+4.2%' }
      ]
    },
    {
      id: 'traxovo',
      name: 'TRAXOVO Intelligence',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      metrics: [
        { label: 'Data Processing', value: '99.2%', change: 'Optimal' },
        { label: 'Predictive Accuracy', value: '94.7%', change: '+2%' },
        { label: 'Intelligence Score', value: 'A+', change: 'Excellent' }
      ]
    },
    {
      id: 'dwai',
      name: 'DWAI Analytics',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      metrics: [
        { label: 'AI Model Performance', value: '96.8%', change: '+3%' },
        { label: 'Learning Rate', value: 'High', change: 'Adaptive' },
        { label: 'System Integration', value: '100%', change: 'Complete' }
      ]
    }
  ];

  if (loading) {
    return (
      <QuantumEasterEggOverlay>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading Quantum Dashboard...</p>
            </div>
          </div>
        </div>
      </QuantumEasterEggOverlay>
    );
  }

  return (
    <QuantumEasterEggOverlay>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section with Logo (Easter Egg Trigger) */}
          <div className="text-center space-y-4">
            <div 
              data-logo="true"
              className="inline-flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DWC Systems Quantum Dashboard
                </h1>
                <p className="text-gray-600">Watson Intelligence & Enterprise Automation Platform</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Badge className="bg-green-100 text-green-800">
                <Zap className="w-3 h-3 mr-1" />
                System Operational
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Brain className="w-3 h-3 mr-1" />
                Watson AGI Active
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                <Activity className="w-3 h-3 mr-1" />
                Quantum Enhanced
              </Badge>
            </div>
          </div>

          {/* Navigation Tabs (Easter Egg Hover Triggers) */}
          <div className="flex justify-center">
            <div className="flex bg-white rounded-xl p-1 shadow-lg">
              {dashboardSections.map((section) => (
                <Button
                  key={section.id}
                  data-nav={section.id}
                  variant="ghost"
                  className="px-6 py-3 hover:bg-gray-100 transition-colors"
                >
                  {section.icon}
                  <span className="ml-2">{section.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Lead Metrics (Double-click Easter Egg) */}
            <Card 
              data-metric="leads"
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalLeads}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            {/* Revenue Metrics (Double-click Easter Egg) */}
            <Card 
              data-metric="revenue"
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+23%</span> from last month
                </p>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            {/* Active Clients */}
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeClients}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
                <Progress value={65} className="mt-2" />
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.systemHealth}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Optimal</span> performance
                </p>
                <Progress value={metrics.systemHealth} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dashboardSections.map((section) => (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${section.color} text-white`}>
                  <CardTitle className="flex items-center gap-2">
                    {section.icon}
                    {section.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {section.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <div className="text-right">
                          <div className="font-bold">{metric.value}</div>
                          <div className="text-xs text-green-600">{metric.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trading Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Trading Performance</div>
                  <Progress value={metrics.tradingPerformance} className="h-3" />
                  <div className="text-xs text-gray-600">{metrics.tradingPerformance}% efficiency</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Automation Efficiency</div>
                  <Progress value={metrics.automationEfficiency} className="h-3" />
                  <div className="text-xs text-gray-600">{metrics.automationEfficiency}% automated</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">System Integration</div>
                  <Progress value={100} className="h-3" />
                  <div className="text-xs text-gray-600">100% connected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Easter Egg Instructions */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Sparkles className="w-5 h-5" />
                Quantum Interactions Available
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  • Triple-click the logo for developer console
                  • Double-click metrics cards for hidden analytics
                  • Hover navigation tabs in sequence for unified view
                </div>
                <div>
                  • Use Konami code for quantum mode
                  • Type "watson" in any field for AGI interface
                  • Enter Fibonacci sequence in trading inputs
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </QuantumEasterEggOverlay>
  );
}