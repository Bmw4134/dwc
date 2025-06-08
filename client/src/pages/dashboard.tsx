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
import { DashboardOrganizer } from "@/components/dashboard-organizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { clientsApi, insightsApi } from "@/lib/api";
import { useEffect, useState } from "react";

interface DashboardProps {
  refreshTrigger: number;
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
  const { data: clients = [], refetch: refetchClients } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  const { data: insights = [], refetch: refetchInsights } = useQuery({
    queryKey: ["/api/insights"],
    queryFn: () => insightsApi.getAll({ priority: "high" }),
  });

  useEffect(() => {
    refetchClients();
    refetchInsights();
  }, [refreshTrigger, refetchClients, refetchInsights]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Enterprise Dashboard</h1>
            <p className="text-slate-600 mt-1">Real-time business intelligence for ZIP 76140</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <i className="fas fa-download mr-2"></i>
              Export Report
            </Button>
            <Button size="sm">
              <i className="fas fa-plus mr-2"></i>
              New Client
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <KpiCards />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LeadMap />
        <AiInsights />
      </div>

      {/* Voice Command Interface */}
      <div className="mb-8">
        <VoiceCommandInterface className="max-w-4xl mx-auto" />
      </div>

      {/* Real-time Lead Generation Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PhotoLeadGenerator />
        <ARBusinessOverlay />
      </div>

      {/* Interactive Trading Strategy Wizard */}
      <div className="mb-8">
        <TradingStrategyWizard className="max-w-6xl mx-auto" />
      </div>

      {/* Advanced Fleet Map with Real-time Tracking */}
      <div className="mb-8">
        <AdvancedFleetMap className="max-w-7xl mx-auto" />
      </div>

      {/* AI Trading Bot - Quantum Enhanced */}
      <div className="mb-8">
        <AITradingBot className="max-w-7xl mx-auto" />
      </div>

      {/* ROI Dashboard & Revenue Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueProjections />
        
        {/* AI Agent Activity */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">AI Agent Activity</CardTitle>
            <p className="text-sm text-slate-600">Real-time learning and optimization</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-brain text-purple-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Pain Point Detection Enhanced</p>
                  <p className="text-xs text-slate-600">Accuracy increased to 94.2% for healthcare sector</p>
                  <span className="text-xs text-slate-500">2 minutes ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-robot text-green-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">New Automation Pattern</p>
                  <p className="text-xs text-slate-600">Created patient intake optimization workflow</p>
                  <span className="text-xs text-slate-500">15 minutes ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-blue-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Lead Qualification Updated</p>
                  <p className="text-xs text-slate-600">23 businesses in 76140 marked as high-priority</p>
                  <span className="text-xs text-slate-500">1 hour ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-chart-line text-orange-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">ROI Model Refined</p>
                  <p className="text-xs text-slate-600">Restaurant automation calculations enhanced</p>
                  <span className="text-xs text-slate-500">3 hours ago</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Next Learning Phase</h4>
              <p className="text-sm text-purple-800 mb-3">Expanding to retail automation patterns</p>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <p className="text-xs text-purple-700 mt-1">67% complete</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Client Projects & Platform Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Client Projects */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Active Client Projects</CardTitle>
            <p className="text-sm text-slate-600">Current implementations & savings</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {clients.length > 0 ? clients.map((client) => (
                <div key={client.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{client.businessName}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      client.implementationStatus === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : client.implementationStatus === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {client.implementationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Business automation implementation</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Monthly Savings:</span>
                    <span className="font-bold text-green-600">
                      ${parseFloat(client.monthlySavings || '0').toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        client.implementationStatus === 'active' ? 'bg-green-500' :
                        client.implementationStatus === 'in_progress' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: client.implementationStatus === 'active' ? '85%' :
                               client.implementationStatus === 'in_progress' ? '45%' : '15%'
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {client.implementationStatus === 'active' ? '85%' :
                     client.implementationStatus === 'in_progress' ? '45%' : '15%'} complete
                  </p>
                </div>
              )) : (
                <div className="text-center py-8">
                  <i className="fas fa-users text-4xl text-slate-300 mb-4"></i>
                  <p className="text-slate-500">No active clients yet</p>
                  <p className="text-sm text-slate-400">Start by converting leads from ZIP 76140</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Tools Overview */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Platform Tools</CardTitle>
            <p className="text-sm text-slate-600">Available automation capabilities</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="fas fa-search-plus text-2xl text-blue-600 mb-2"></i>
                <h4 className="font-medium text-slate-900 text-sm">Pain Point Scanner</h4>
                <p className="text-xs text-slate-600 mt-1">AI-powered department analysis</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="fas fa-robot text-2xl text-green-600 mb-2"></i>
                <h4 className="font-medium text-slate-900 text-sm">Workflow Builder</h4>
                <p className="text-xs text-slate-600 mt-1">Visual automation designer</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="fas fa-calculator text-2xl text-purple-600 mb-2"></i>
                <h4 className="font-medium text-slate-900 text-sm">ROI Calculator</h4>
                <p className="text-xs text-slate-600 mt-1">Precise savings estimates</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="fas fa-chart-line text-2xl text-orange-500 mb-2"></i>
                <h4 className="font-medium text-slate-900 text-sm">Performance Tracker</h4>
                <p className="text-xs text-slate-600 mt-1">Real-time savings monitoring</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="fas fa-globe text-2xl text-indigo-500 mb-2"></i>
                <h4 className="font-medium text-slate-900 text-sm">Web Automation</h4>
                <p className="text-xs text-slate-600 mt-1">Headless browser integration</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <i className="fas fa-presentation text-2xl text-red-500 mb-2"></i>
                <h4 className="font-medium text-slate-900 text-sm">Client Demos</h4>
                <p className="text-xs text-slate-600 mt-1">White-label presentations</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <h4 className="font-medium mb-2">Ready for Investor Demo</h4>
              <p className="text-sm opacity-90 mb-3">
                Complete platform demonstrating $6M ARR potential with proven automation ROI across multiple industries.
              </p>
              <Button variant="secondary" size="sm">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
