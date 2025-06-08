import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings,
  Wrench,
  Monitor,
  Eye,
  EyeOff,
  LayoutDashboard,
  TrendingUp,
  Target,
  MapPin,
  Brain,
  Users,
  Building2,
  Camera,
  Mic,
  Globe,
  Shield,
  Rocket,
  Database,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Import all your existing dashboard components
import ConsultingDashboard from "@/pages/consulting-dashboard";
import LeadIntelligenceDashboard from "@/pages/lead-intelligence-dashboard";
import ExecutiveOperationsDashboard from "@/pages/executive-operations-dashboard";
import QuantumIntelligenceHub from "@/pages/quantum-intelligence-hub";
import QuantumKaizenDashboard from "@/pages/quantum-kaizen-dashboard";
import ClientAutomationDashboard from "@/pages/client-automation-dashboard";
import DeviceAdaptationDashboard from "@/pages/device-adaptation-dashboard";
import FixAnythingModule from "@/components/fix-anything-module";
import InteractiveQuantumSparklines from "@/components/interactive-quantum-sparklines";

interface DashboardModule {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<any>;
  visible: boolean;
  status: 'active' | 'inactive' | 'error';
  description: string;
  features: string[];
  lastUpdated: string;
}

const DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: 'consulting',
    name: 'Consulting Dashboard',
    category: 'core',
    component: ConsultingDashboard,
    visible: true,
    status: 'active',
    description: 'Main business consulting automation platform',
    features: ['Lead Generation', 'Revenue Tracking', 'Client Management'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'lead-intelligence',
    name: 'Lead Intelligence Dashboard',
    category: 'leads',
    component: LeadIntelligenceDashboard,
    visible: true,
    status: 'active',
    description: 'Advanced lead capture and qualification system',
    features: ['Photo Lead Generation', 'AR Business Scanner', 'GPS Tracking'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'executive-ops',
    name: 'Executive Operations',
    category: 'management',
    component: ExecutiveOperationsDashboard,
    visible: true,
    status: 'active',
    description: 'Executive-level operational oversight and control',
    features: ['System Overview', 'Performance Metrics', 'Strategic Planning'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'quantum-intelligence',
    name: 'Quantum Intelligence Hub',
    category: 'ai',
    component: QuantumIntelligenceHub,
    visible: false,
    status: 'active',
    description: 'Advanced AI processing and quantum computing interface',
    features: ['Quantum Processing', 'AI Models', 'Data Analysis'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'quantum-kaizen',
    name: 'Quantum Kaizen Dashboard',
    category: 'optimization',
    component: QuantumKaizenDashboard,
    visible: false,
    status: 'active',
    description: 'Continuous improvement and optimization system',
    features: ['Process Optimization', 'Performance Tracking', 'Automation'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'client-automation',
    name: 'Client Automation Dashboard',
    category: 'automation',
    component: ClientAutomationDashboard,
    visible: false,
    status: 'active',
    description: 'Automated client interaction and management system',
    features: ['Client Communications', 'Workflow Automation', 'Task Management'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'device-adaptation',
    name: 'Device Adaptation Dashboard',
    category: 'mobile',
    component: DeviceAdaptationDashboard,
    visible: false,
    status: 'active',
    description: 'Mobile and device optimization control center',
    features: ['Mobile Optimization', 'Device Detection', 'Responsive Design'],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'quantum-sparklines',
    name: 'Quantum Performance Sparklines',
    category: 'analytics',
    component: InteractiveQuantumSparklines,
    visible: true,
    status: 'active',
    description: 'Interactive quantum performance visualization with 4M user simulation',
    features: ['Real-time Metrics', 'Quantum Physics Simulation', 'Mobile Optimized'],
    lastUpdated: new Date().toISOString()
  }
];

const CATEGORIES = {
  core: { name: 'Core Business', icon: Building2, color: 'blue' },
  leads: { name: 'Lead Generation', icon: Target, color: 'green' },
  management: { name: 'Management', icon: Users, color: 'purple' },
  ai: { name: 'AI & Intelligence', icon: Brain, color: 'orange' },
  optimization: { name: 'Optimization', icon: TrendingUp, color: 'yellow' },
  automation: { name: 'Automation', icon: Zap, color: 'red' },
  mobile: { name: 'Mobile & Device', icon: Monitor, color: 'gray' },
  analytics: { name: 'Analytics & Performance', icon: Database, color: 'indigo' }
};

export default function UniversalDashboardManager() {
  const [dashboards, setDashboards] = useState(DASHBOARD_MODULES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [showFixAnything, setShowFixAnything] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleDashboard = (id: string) => {
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === id 
        ? { ...dashboard, visible: !dashboard.visible }
        : dashboard
    ));
  };

  const getFilteredDashboards = () => {
    if (activeCategory === 'all') return dashboards;
    return dashboards.filter(d => d.category === activeCategory);
  };

  const getVisibleDashboards = () => {
    return dashboards.filter(d => d.visible);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES[category as keyof typeof CATEGORIES];
    if (!categoryData) return Monitor;
    return categoryData.icon;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = CATEGORIES[category as keyof typeof CATEGORIES];
    return categoryData?.color || 'gray';
  };

  const renderActiveDashboard = () => {
    if (!activeDashboard) return null;
    
    const dashboard = dashboards.find(d => d.id === activeDashboard);
    if (!dashboard) return null;

    const DashboardComponent = dashboard.component;
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveDashboard(null)}
            >
              ← Back to Overview
            </Button>
            <h2 className="text-lg font-semibold">{dashboard.name}</h2>
            <Badge variant="outline">{dashboard.category}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFixAnything(!showFixAnything)}
          >
            <Wrench className="h-4 w-4 mr-1" />
            Fix Console
          </Button>
        </div>
        
        {showFixAnything && (
          <div className="mb-6">
            <FixAnythingModule />
          </div>
        )}
        
        <DashboardComponent />
      </div>
    );
  };

  if (activeDashboard) {
    return renderActiveDashboard();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Universal Dashboard Manager</h1>
            <p className="text-lg text-gray-600">Consolidated control across all your dashboards</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              {getVisibleDashboards().length} Active
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              {dashboards.length} Total
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFixAnything(!showFixAnything)}
            >
              <Wrench className="h-4 w-4 mr-1" />
              {showFixAnything ? 'Hide' : 'Show'} Fix Console
            </Button>
          </div>
        </div>
      </div>

      {/* Fix Anything Module */}
      {showFixAnything && (
        <div className="mb-8">
          <FixAnythingModule />
        </div>
      )}

      {/* Dashboard Overview */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-8">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <LayoutDashboard className="h-3 w-3" />
              All
            </TabsTrigger>
            {Object.entries(CATEGORIES).map(([key, category]) => {
              const IconComponent = category.icon;
              const count = dashboards.filter(d => d.category === key).length;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                  <IconComponent className="h-3 w-3" />
                  {category.name}
                  <Badge variant="secondary" className="text-xs ml-1">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="view-mode" className="text-sm">View:</Label>
            <Switch
              id="view-mode"
              checked={viewMode === 'list'}
              onCheckedChange={(checked) => setViewMode(checked ? 'list' : 'grid')}
            />
            <span className="text-sm">{viewMode === 'grid' ? 'Grid' : 'List'}</span>
          </div>
        </div>

        <TabsContent value={activeCategory}>
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {getFilteredDashboards().map(dashboard => {
              const IconComponent = getCategoryIcon(dashboard.category);
              const categoryColor = getCategoryColor(dashboard.category);
              
              return (
                <Card 
                  key={dashboard.id} 
                  className={`border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                    dashboard.visible 
                      ? 'border-blue-200 bg-blue-50/50' 
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={dashboard.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {dashboard.status === 'active' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {dashboard.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDashboard(dashboard.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {dashboard.visible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{dashboard.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dashboard.features.slice(0, 3).map(feature => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {dashboard.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{dashboard.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(dashboard.lastUpdated).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setActiveDashboard(dashboard.id)}
                        disabled={!dashboard.visible}
                        className="h-7 text-xs"
                      >
                        Open Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8 border border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDashboards(prev => prev.map(d => ({ ...d, visible: true })));
              }}
            >
              Show All Dashboards
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDashboards(prev => prev.map(d => ({ ...d, visible: false })));
              }}
            >
              Hide All Dashboards
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const coreDashboards = ['consulting', 'lead-intelligence', 'executive-ops'];
                setDashboards(prev => prev.map(d => ({ 
                  ...d, 
                  visible: coreDashboards.includes(d.id) 
                })));
              }}
            >
              Show Core Only
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveCategory('all')}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}