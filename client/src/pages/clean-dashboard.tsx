import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  LayoutDashboard, 
  TrendingUp, 
  MapPin, 
  Camera, 
  Mic, 
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { LeadMap } from "@/components/dashboard/lead-map";
import { AiInsights } from "@/components/dashboard/ai-insights";
import { RevenueProjections } from "@/components/dashboard/revenue-projections";
import { VoiceCommandInterface } from "@/components/voice-command-interface";
import { PhotoLeadGenerator } from "@/components/photo-lead-generator";
import { ARBusinessOverlay } from "@/components/ar-business-overlay";
import { TradingStrategyWizard } from "@/components/trading-strategy-wizard";
import { AdvancedFleetMap } from "@/components/advanced-fleet-map";
import { AITradingBot } from "@/components/ai-trading-bot";

interface DashboardProps {
  refreshTrigger: number;
}

const WIDGET_CATEGORIES = {
  core: { 
    name: 'Core Business', 
    icon: LayoutDashboard, 
    widgets: [
      { id: 'kpi', name: 'KPI Overview', component: KpiCards, visible: true },
      { id: 'lead-map', name: 'Lead Map', component: LeadMap, visible: true },
      { id: 'ai-insights', name: 'AI Insights', component: AiInsights, visible: true },
      { id: 'revenue', name: 'Revenue Projections', component: RevenueProjections, visible: true }
    ]
  },
  trading: { 
    name: 'Trading & Finance', 
    icon: TrendingUp,
    widgets: [
      { id: 'trading-wizard', name: 'Strategy Wizard', component: TradingStrategyWizard, visible: false },
      { id: 'ai-bot', name: 'AI Trading Bot', component: AITradingBot, visible: false }
    ]
  },
  leads: { 
    name: 'Lead Generation', 
    icon: Camera,
    widgets: [
      { id: 'photo-leads', name: 'Photo Generator', component: PhotoLeadGenerator, visible: false },
      { id: 'ar-scanner', name: 'AR Scanner', component: ARBusinessOverlay, visible: false }
    ]
  },
  fleet: { 
    name: 'Fleet & Logistics', 
    icon: MapPin,
    widgets: [
      { id: 'fleet-map', name: 'Fleet Tracking', component: AdvancedFleetMap, visible: false }
    ]
  },
  ai: { 
    name: 'AI & Automation', 
    icon: Mic,
    widgets: [
      { id: 'voice-commands', name: 'Voice Commands', component: VoiceCommandInterface, visible: false }
    ]
  }
};

export default function CleanDashboard({ refreshTrigger }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState('core');
  const [categories, setCategories] = useState(WIDGET_CATEGORIES);
  const [showAllWidgets, setShowAllWidgets] = useState(false);

  const toggleWidget = (categoryKey: string, widgetId: string) => {
    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        widgets: prev[categoryKey].widgets.map(widget =>
          widget.id === widgetId 
            ? { ...widget, visible: !widget.visible }
            : widget
        )
      }
    }));
  };

  const getVisibleWidgets = () => {
    if (showAllWidgets) {
      return Object.entries(categories).flatMap(([categoryKey, category]) =>
        category.widgets
          .filter(widget => widget.visible)
          .map(widget => ({ ...widget, categoryKey, categoryName: category.name }))
      );
    }
    return categories[activeCategory]?.widgets.filter(widget => widget.visible) || [];
  };

  const getTotalActiveWidgets = () => {
    return Object.values(categories).reduce((total, category) => 
      total + category.widgets.filter(w => w.visible).length, 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Dashboard Control Panel */}
      <Card className="mb-6 border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dashboard Control
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
                {getTotalActiveWidgets()} Active
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {Object.entries(categories).map(([key, category]) => {
                const IconComponent = category.icon;
                const activeCount = category.widgets.filter(w => w.visible).length;
                return (
                  <TabsTrigger key={key} value={key} className="flex flex-col gap-1 h-16">
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activeCount}/{category.widgets.length}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(categories).map(([categoryKey, category]) => (
              <TabsContent key={categoryKey} value={categoryKey} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.widgets.map(widget => (
                    <Card key={widget.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{widget.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleWidget(categoryKey, widget.id)}
                            className="h-6 w-6 p-0"
                          >
                            {widget.visible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Badge 
                          variant={widget.visible ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {widget.visible ? 'Active' : 'Hidden'}
                        </Badge>
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
      <div className="space-y-8">
        {showAllWidgets ? (
          Object.entries(categories).map(([categoryKey, category]) => {
            const visibleWidgets = category.widgets.filter(w => w.visible);
            if (visibleWidgets.length === 0) return null;

            const IconComponent = category.icon;
            return (
              <div key={categoryKey}>
                <div className="flex items-center gap-2 mb-4">
                  <IconComponent className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <Badge variant="outline">{visibleWidgets.length} widgets</Badge>
                </div>
                <div className="space-y-6">
                  {visibleWidgets.map(widget => {
                    const WidgetComponent = widget.component;
                    return (
                      <div key={widget.id}>
                        <WidgetComponent />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="space-y-6">
            {getVisibleWidgets().map(widget => {
              const WidgetComponent = widget.component;
              return (
                <div key={widget.id}>
                  <WidgetComponent />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 border border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCategories(prev => {
                  const updated = { ...prev };
                  Object.keys(updated).forEach(key => {
                    updated[key] = {
                      ...updated[key],
                      widgets: updated[key].widgets.map(w => ({ ...w, visible: true }))
                    };
                  });
                  return updated;
                });
              }}
            >
              Show All Widgets
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCategories(prev => {
                  const updated = { ...prev };
                  Object.keys(updated).forEach(key => {
                    updated[key] = {
                      ...updated[key],
                      widgets: updated[key].widgets.map(w => ({ ...w, visible: false }))
                    };
                  });
                  return updated;
                });
              }}
            >
              Hide All Widgets
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveCategory('core')}
            >
              Show Core Only
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}