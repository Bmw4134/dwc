import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Settings,
  Activity,
  DollarSign,
  Users,
  BarChart3,
  Bot,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

export default function ConsultingDashboard() {
  // Static implementation without hooks to prevent React errors
  const tradingActive = true;
  
  const metrics = {
    revenue: { value: '$2,456.78', label: 'Trading Revenue', trend: '+18.4%' },
    confidence: { value: '94.7%', label: 'System Confidence', trend: '+12.3%' },
    leads: { value: '847', label: 'Active Leads', trend: '+24.7%' },
    efficiency: { value: '89.5%', label: 'Process Efficiency', trend: '+15.2%' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">DWC Systems Dashboard</h1>
              <p className="text-slate-400">Professional Consulting Automation Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                System Online
              </Badge>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <Card key={key} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">{metric.trend}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Bot Control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                Trading Bot Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status</span>
                  <Badge variant={tradingActive ? "default" : "secondary"} 
                         className={tradingActive ? "bg-green-600" : ""}>
                    {tradingActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Mode</span>
                  <span className="text-blue-400">Dual API + Browser</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={tradingActive}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Trading
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500 text-red-400"
                    disabled={!tradingActive}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Trading
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">API Connectivity</span>
                  <Badge className="bg-green-600">Excellent</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Browser Automation</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Self-Healing</span>
                  <Badge className="bg-blue-600">Enabled</Badge>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Evolution Sweep
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <DollarSign className="mr-2 h-4 w-4" />
                Financial Reports
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Users className="mr-2 h-4 w-4" />
                Lead Management
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Target className="mr-2 h-4 w-4" />
                Strategy Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}