import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layout, 
  Grid3X3, 
  Maximize2, 
  Minimize2, 
  X, 
  Settings, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import WidgetLayoutManager from './widget-layout-manager';
import WatsonCommandConsole from './watson-command-console';
import WatsonDWUnlockDashboard from './watson-dw-unlock-dashboard';
import TRDUserManagementDashboard from './trd-user-management-dashboard';
import LayerChartDashboard from './layer-chart-dashboard';
import KaizenMasterDashboard from './kaizen-master-dashboard';
import InfinitySovereignControl from './infinity-sovereign-control';
import FloatingMasterCommand from './floating-master-command';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  category: 'control' | 'analytics' | 'management' | 'intelligence';
  priority: 'high' | 'medium' | 'low';
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  isVisible: boolean;
}

export default function CollisionFreeDashboard() {
  const [layoutMode, setLayoutMode] = useState<'windowed' | 'tabbed' | 'grid'>('windowed');
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>([]);
  const [autoArrange, setAutoArrange] = useState(true);

  // Define all available widgets
  const allWidgets: DashboardWidget[] = [
    {
      id: 'watson-console',
      title: 'Watson Command Console',
      component: <WatsonCommandConsole />,
      category: 'control',
      priority: 'high',
      defaultPosition: { x: 50, y: 50 },
      defaultSize: { width: 500, height: 400 },
      isVisible: true
    },
    {
      id: 'watson-unlock',
      title: 'Watson DW Unlock',
      component: <WatsonDWUnlockDashboard />,
      category: 'control',
      priority: 'high',
      defaultPosition: { x: 570, y: 50 },
      defaultSize: { width: 450, height: 400 },
      isVisible: true
    },
    {
      id: 'user-management',
      title: 'TRD User Management',
      component: <TRDUserManagementDashboard />,
      category: 'management',
      priority: 'medium',
      defaultPosition: { x: 50, y: 470 },
      defaultSize: { width: 480, height: 350 },
      isVisible: true
    },
    {
      id: 'layer-chart',
      title: 'Layer Chart Analytics',
      component: <LayerChartDashboard />,
      category: 'analytics',
      priority: 'medium',
      defaultPosition: { x: 550, y: 470 },
      defaultSize: { width: 470, height: 350 },
      isVisible: true
    },
    {
      id: 'kaizen-master',
      title: 'Kaizen Master Dashboard',
      component: <KaizenMasterDashboard />,
      category: 'intelligence',
      priority: 'high',
      defaultPosition: { x: 1040, y: 50 },
      defaultSize: { width: 500, height: 400 },
      isVisible: true
    },
    {
      id: 'infinity-control',
      title: 'Infinity Sovereign Control',
      component: <InfinitySovereignControl />,
      category: 'control',
      priority: 'high',
      defaultPosition: { x: 1040, y: 470 },
      defaultSize: { width: 500, height: 350 },
      isVisible: true
    }
  ];

  // Initialize visible widgets
  useEffect(() => {
    setVisibleWidgets(allWidgets.filter(w => w.isVisible).map(w => w.id));
  }, []);

  // Get widgets for current layout mode
  const getActiveWidgets = () => {
    return allWidgets.filter(widget => visibleWidgets.includes(widget.id));
  };

  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    setVisibleWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  // Handle widget removal
  const handleWidgetRemove = (widgetId: string) => {
    setVisibleWidgets(prev => prev.filter(id => id !== widgetId));
  };

  // Reset all widgets to visible
  const resetAllWidgets = () => {
    setVisibleWidgets(allWidgets.map(w => w.id));
  };

  // Group widgets by category
  const groupedWidgets = allWidgets.reduce((acc, widget) => {
    if (!acc[widget.category]) {
      acc[widget.category] = [];
    }
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, DashboardWidget[]>);

  // Render windowed layout
  const renderWindowedLayout = () => {
    const activeWidgets = getActiveWidgets().map(widget => ({
      id: widget.id,
      title: widget.title,
      children: widget.component,
      defaultPosition: widget.defaultPosition,
      defaultSize: widget.defaultSize,
      priority: widget.priority
    }));

    return (
      <WidgetLayoutManager 
        widgets={activeWidgets}
        onWidgetRemove={handleWidgetRemove}
      />
    );
  };

  // Render tabbed layout
  const renderTabbedLayout = () => {
    return (
      <div className="h-screen p-4">
        <Tabs defaultValue="control" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="control">Control Systems</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          </TabsList>
          
          {Object.entries(groupedWidgets).map(([category, widgets]) => (
            <TabsContent key={category} value={category} className="flex-1 overflow-auto">
              <div className="grid gap-4 h-full">
                {widgets.filter(w => visibleWidgets.includes(w.id)).map(widget => (
                  <Card key={widget.id} className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {widget.title}
                        <Badge variant={widget.priority === 'high' ? 'destructive' : 'secondary'}>
                          {widget.priority}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-auto">
                      {widget.component}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  // Render grid layout
  const renderGridLayout = () => {
    const activeWidgets = getActiveWidgets();
    
    return (
      <div className="h-screen p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {activeWidgets.map(widget => (
            <Card key={widget.id} className="h-96 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between text-sm">
                  {widget.title}
                  <div className="flex items-center gap-2">
                    <Badge variant={widget.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {widget.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWidget(widget.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-3">
                {widget.component}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Layout Controls */}
      <div className="absolute top-4 left-4 z-[10001] flex gap-2">
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <Button
              variant={layoutMode === 'windowed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutMode('windowed')}
            >
              <Layout className="w-4 h-4 mr-1" />
              Windowed
            </Button>
            <Button
              variant={layoutMode === 'tabbed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutMode('tabbed')}
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              Tabbed
            </Button>
            <Button
              variant={layoutMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutMode('grid')}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Grid
            </Button>
          </CardContent>
        </Card>

        {/* Widget Visibility Controls */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Widgets</span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllWidgets}
                className="h-6 px-2"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {allWidgets.map(widget => (
                <Button
                  key={widget.id}
                  variant={visibleWidgets.includes(widget.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleWidget(widget.id)}
                  className="h-6 px-2 text-xs justify-start"
                >
                  {visibleWidgets.includes(widget.id) ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {widget.title.split(' ')[0]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="absolute top-4 right-4 z-[10001]">
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              {visibleWidgets.length} Active Widgets
            </Badge>
            <Badge variant="outline">
              {layoutMode.charAt(0).toUpperCase() + layoutMode.slice(1)} Mode
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Render Layout */}
      {layoutMode === 'windowed' && renderWindowedLayout()}
      {layoutMode === 'tabbed' && renderTabbedLayout()}
      {layoutMode === 'grid' && renderGridLayout()}

      {/* Floating Master Command - Always Visible */}
      <FloatingMasterCommand />
    </div>
  );
}