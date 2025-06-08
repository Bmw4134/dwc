import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { NexusChat } from "@/components/nexus-chat";
import { 
  Building2, 
  BarChart3, 
  Users, 
  DollarSign,
  TrendingUp,
  Shield,
  Eye,
  Lock,
  AlertTriangle,
  Activity,
  Globe,
  ArrowLeft
} from "lucide-react";

interface DemoMetrics {
  totalLeads: number;
  activeProposals: number;
  monthlyRevenue: number;
  conversionRate: number;
  systemHealth: number;
  demoLeads: Array<{
    name: string;
    value: number;
    status: string;
    industry: string;
  }>;
}

export default function DemoDashboard() {
  const [, setLocation] = useLocation();
  const [metrics, setMetrics] = useState<DemoMetrics | null>(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    // Simulate demo data loading
    const loadDemoData = () => {
      setMetrics({
        totalLeads: 12,
        activeProposals: 8,
        monthlyRevenue: 45000,
        conversionRate: 67.3,
        systemHealth: 94.2,
        demoLeads: [
          { name: "Demo Tech Corp", value: 15000, status: "Active Prospect", industry: "Technology" },
          { name: "Sample Industries", value: 25000, status: "Qualified", industry: "Manufacturing" },
          { name: "Test Marketing LLC", value: 8500, status: "Contacted", industry: "Marketing" }
        ]
      });
    };

    setTimeout(loadDemoData, 1000);
  }, []);

  const handleExitDemo = () => {
    setLocation('/');
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-emerald-400 text-lg">Loading Demo Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900">
      {/* Demo Header with Security Notice */}
      <div className="bg-orange-900/80 backdrop-blur-sm border-b border-orange-500/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-semibold">DEMO ENVIRONMENT</span>
              <Badge variant="outline" className="border-orange-400 text-orange-300">
                Read-Only Access
              </Badge>
            </div>
            <Button 
              onClick={handleExitDemo}
              variant="outline"
              size="sm"
              className="border-orange-400 text-orange-300 hover:bg-orange-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Building2 className="w-10 h-10 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">DWC Systems Demo</h1>
              <p className="text-slate-300">Enterprise Automation Platform Preview</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">System Health: {metrics.systemHealth}%</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-1 flex space-x-1 border border-emerald-500/30 mb-8">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 px-4 py-3 font-medium text-sm rounded-md transition-all flex items-center justify-center ${
              activeView === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveView('leads')}
            className={`flex-1 px-4 py-3 font-medium text-sm rounded-md transition-all flex items-center justify-center ${
              activeView === 'leads'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Leads
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className={`flex-1 px-4 py-3 font-medium text-sm rounded-md transition-all flex items-center justify-center ${
              activeView === 'chat'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            NEXUS Chat
          </button>
        </div>

        {/* Content Area */}
        {activeView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/80 border-blue-500/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-400 text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.totalLeads}</div>
                <p className="text-slate-400 text-xs">Demo data only</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-400 text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Active Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.activeProposals}</div>
                <p className="text-slate-400 text-xs">Demo data only</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-green-500/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-400 text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${metrics.monthlyRevenue.toLocaleString()}</div>
                <p className="text-slate-400 text-xs">Demo data only</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-yellow-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.conversionRate}%</div>
                <p className="text-slate-400 text-xs">Demo data only</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'leads' && (
          <Card className="bg-slate-800/80 border-emerald-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Demo Lead Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.demoLeads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                    <div>
                      <h3 className="text-white font-semibold">{lead.name}</h3>
                      <p className="text-slate-400 text-sm">{lead.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold">${lead.value.toLocaleString()}</div>
                      <Badge variant="outline" className="border-emerald-400 text-emerald-300 text-xs">
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-orange-900/30 border border-orange-500/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-semibold">Demo Limitation</span>
                </div>
                <p className="text-orange-200 text-sm">
                  This is sample data for demonstration purposes. Full platform access includes real lead management, CRM integration, and advanced analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === 'chat' && (
          <Card className="bg-slate-800/80 border-emerald-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                NEXUS AI Chat Interface
              </CardTitle>
              <p className="text-slate-300 text-sm mt-2">
                Experience our AI-powered business intelligence assistant
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900/50 rounded-lg p-1 border border-emerald-500/30">
                <NexusChat />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}