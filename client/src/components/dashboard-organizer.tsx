import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  LayoutDashboard, 
  TrendingUp, 
  MapPin, 
  Camera, 
  Mic, 
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WidgetConfig {
  id: string;
  name: string;
  category: 'core' | 'trading' | 'leads' | 'fleet' | 'ai';
  visible: boolean;
  minimized: boolean;
  component: React.ComponentType<any>;
}

interface DashboardOrganizerProps {
  widgets: WidgetConfig[];
  onWidgetToggle: (id: string, visible: boolean) => void;
  onWidgetMinimize: (id: string, minimized: boolean) => void;
  className?: string;
}

const CATEGORIES = {
  core: { name: 'Core Business', icon: LayoutDashboard, color: 'blue' },
  trading: { name: 'Trading & Finance', icon: TrendingUp, color: 'green' },
  leads: { name: 'Lead Generation', icon: Camera, color: 'purple' },
  fleet: { name: 'Fleet & Logistics', icon: MapPin, color: 'orange' },
  ai: { name: 'AI & Automation', icon: Mic, color: 'indigo' }
};

export function DashboardOrganizer({ 
  widgets, 
  onWidgetToggle, 
  onWidgetMinimize, 
  className 
}: DashboardOrganizerProps) {
  const [activeCategory, setActiveCategory] = useState('core');
  const [showAllWidgets, setShowAllWidgets] = useState(false);

  const getVisibleWidgets = () => {
    if (showAllWidgets) {
      return widgets.filter(w => w.visible);
    }
    return widgets.filter(w => w.visible && w.category === activeCategory);
  };

  const getCategoryStats = (category: string) => {
    const categoryWidgets = widgets.filter(w => w.category === category);
    const visible = categoryWidgets.filter(w => w.visible).length;
    return { total: categoryWidgets.length, visible };
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Dashboard Control Panel */}
      <Card className="border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dashboard Control Center
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="show-all" className="text-sm">Show All</Label>
                <Switch
                  id="show-all"
                  checked={showAllWidgets}
                  onCheckedChange={setShowAllWidgets}
                />
              </div>
              <Badge variant="outline">
                {widgets.filter(w => w.visible).length} Active
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {Object.entries(CATEGORIES).map(([key, category]) => {
                const stats = getCategoryStats(key);
                const IconComponent = category.icon;
                return (
                  <TabsTrigger key={key} value={key} className="flex flex-col gap-1 h-16">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stats.visible}/{stats.total}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(CATEGORIES).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {widgets
                    .filter(w => w.category === key)
                    .map(widget => (
                      <Card key={widget.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{widget.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onWidgetMinimize(widget.id, !widget.minimized)}
                                className="h-6 w-6 p-0"
                              >
                                {widget.minimized ? (
                                  <Maximize2 className="h-3 w-3" />
                                ) : (
                                  <Minimize2 className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onWidgetToggle(widget.id, !widget.visible)}
                                className="h-6 w-6 p-0"
                              >
                                {widget.visible ? (
                                  <Eye className="h-3 w-3" />
                                ) : (
                                  <EyeOff className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={widget.visible ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {widget.visible ? 'Active' : 'Hidden'}
                            </Badge>
                            {widget.minimized && (
                              <Badge variant="outline" className="text-xs">
                                Minimized
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Active Widgets Display */}
      <div className="space-y-6">
        {showAllWidgets ? (
          <div className="space-y-8">
            {Object.entries(CATEGORIES).map(([categoryKey, category]) => {
              const categoryWidgets = widgets.filter(w => w.category === categoryKey && w.visible);
              if (categoryWidgets.length === 0) return null;

              return (
                <div key={categoryKey}>
                  <div className="flex items-center gap-2 mb-4">
                    <category.icon className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <Badge variant="outline">{categoryWidgets.length} widgets</Badge>
                  </div>
                  <div className="space-y-6">
                    {categoryWidgets.map(widget => {
                      const WidgetComponent = widget.component;
                      return (
                        <div key={widget.id} className={widget.minimized ? 'opacity-60' : ''}>
                          <WidgetComponent 
                            className={widget.minimized ? 'scale-75 origin-top-left' : ''}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {getVisibleWidgets().map(widget => {
              const WidgetComponent = widget.component;
              return (
                <div key={widget.id} className={widget.minimized ? 'opacity-60' : ''}>
                  <WidgetComponent 
                    className={widget.minimized ? 'scale-75 origin-top-left' : ''}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => widgets.forEach(w => onWidgetToggle(w.id, true))}
            >
              Show All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => widgets.forEach(w => onWidgetToggle(w.id, false))}
            >
              Hide All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => widgets.forEach(w => onWidgetMinimize(w.id, false))}
            >
              Expand All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => widgets.forEach(w => onWidgetMinimize(w.id, true))}
            >
              Minimize All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}