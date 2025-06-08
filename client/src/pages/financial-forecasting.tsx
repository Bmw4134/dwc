import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { forecastingApi, clientsApi, dashboardApi } from "@/lib/api";

interface FinancialForecastingProps {
  refreshTrigger: number;
}

export default function FinancialForecasting({ refreshTrigger }: FinancialForecastingProps) {
  const [timeframe, setTimeframe] = useState("12");
  
  const { data: forecast, isLoading: forecastLoading, refetch: refetchForecast } = useQuery({
    queryKey: ["/api/forecasting/revenue", timeframe],
    queryFn: () => forecastingApi.getRevenueProjections(timeframe),
  });

  const { data: clients = [], refetch: refetchClients } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => dashboardApi.getStats(),
  });

  useEffect(() => {
    refetchForecast();
    refetchClients();
    refetchStats();
  }, [refreshTrigger, refetchForecast, refetchClients, refetchStats]);

  const currentMRR = parseFloat(forecast?.currentMRR || '0');
  const currentClients = clients.length;
  const avgClientValue = currentClients > 0 ? currentMRR / currentClients : 9600;

  // Calculate growth metrics
  const monthlyGrowthRate = 0.15; // 15% monthly growth target
  const targetARR = {
    year1: 1600000,
    year2: 5000000,
    year5: 6000000,
  };

  const progressToYear1 = currentClients > 0 ? (currentMRR * 12) / targetARR.year1 * 100 : 0;

  if (forecastLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Financial Forecasting</h1>
            <p className="text-slate-600 mt-1">Revenue projections and growth strategy for investor presentations</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
                <SelectItem value="36">36 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <i className="fas fa-download mr-2"></i>
              Export Model
            </Button>
            <Button size="sm">
              <i className="fas fa-presentation mr-2"></i>
              Investor Deck
            </Button>
          </div>
        </div>
      </div>

      {/* Current Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Current MRR</p>
                <p className="text-2xl font-bold text-slate-900">${currentMRR.toLocaleString()}</p>
                <p className="text-sm text-blue-600">${(currentMRR * 12).toLocaleString()} ARR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active Clients</p>
                <p className="text-2xl font-bold text-slate-900">{currentClients}</p>
                <p className="text-sm text-green-600">${avgClientValue.toLocaleString()} avg value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Growth Rate</p>
                <p className="text-2xl font-bold text-slate-900">{(monthlyGrowthRate * 100).toFixed(0)}%</p>
                <p className="text-sm text-purple-600">Monthly target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-target text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Progress to $1.6M</p>
                <p className="text-2xl font-bold text-slate-900">{progressToYear1.toFixed(1)}%</p>
                <p className="text-sm text-orange-600">Year 1 target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Projection Chart */}
      <Card className="mb-8 shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Revenue Growth Projections</CardTitle>
              <p className="text-sm text-slate-600">Path to $6M ARR with detailed milestone tracking</p>
            </div>
            <Button variant="outline" size="sm">
              <i className="fas fa-chart-bar mr-2"></i>
              View Chart
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Visual chart placeholder */}
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <i className="fas fa-chart-line text-4xl text-slate-400 mb-2"></i>
              <p className="text-slate-600 font-medium">Revenue Growth Chart</p>
              <p className="text-sm text-slate-500">Interactive projection visualization</p>
            </div>
          </div>

          {/* Projection Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">$96K</p>
              <p className="text-sm text-slate-600">Year 1 ARR</p>
              <p className="text-xs text-slate-500">10 clients</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">$1.6M</p>
              <p className="text-sm text-slate-600">Year 2 Target</p>
              <p className="text-xs text-slate-500">100 clients</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">$5M</p>
              <p className="text-sm text-slate-600">Year 3 Vision</p>
              <p className="text-xs text-slate-500">250 clients</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-600">$6M</p>
              <p className="text-sm text-green-600">Year 5 Target</p>
              <p className="text-xs text-green-500">500 clients</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Model & Investment Thesis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Financial Model */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Financial Model</CardTitle>
            <p className="text-sm text-slate-600">Key metrics and unit economics</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Customer Acquisition Cost (CAC)</span>
                <span className="font-bold text-slate-900">$2,400</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Customer Lifetime Value (LTV)</span>
                <span className="font-bold text-slate-900">$86,400</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-slate-700">LTV:CAC Ratio</span>
                <span className="font-bold text-green-600">36:1</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Gross Margin</span>
                <span className="font-bold text-slate-900">85%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Monthly Churn Rate</span>
                <span className="font-bold text-slate-900">2.1%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-slate-700">Payback Period</span>
                <span className="font-bold text-blue-600">3.2 months</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Thesis */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Investment Thesis</CardTitle>
            <p className="text-sm text-slate-600">Why investors should fund DW AI Platform</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Massive TAM</h4>
                <p className="text-sm text-blue-800">$50B+ business automation market with 40% annual growth</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">🚀 Proven Unit Economics</h4>
                <p className="text-sm text-green-800">36:1 LTV:CAC ratio with 3.2 month payback period</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">🤖 AI Moat</h4>
                <p className="text-sm text-purple-800">Proprietary pain point detection with 94.2% accuracy</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">📈 Scalable Model</h4>
                <p className="text-sm text-orange-800">High-margin SaaS with compounding network effects</p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">⚡ Market Timing</h4>
                <p className="text-sm text-red-800">Post-COVID automation urgency drives immediate demand</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funding Scenario Analysis */}
      <Card className="mb-8 shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">Funding Scenarios</CardTitle>
          <p className="text-sm text-slate-600">Growth projections based on different investment levels</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conservative Scenario */}
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3">Conservative ($500K)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">18-month runway</span>
                  <span className="font-medium">50 clients</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Year 2 ARR:</span>
                  <span className="font-medium">$600K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Team size:</span>
                  <span className="font-medium">8 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Market focus:</span>
                  <span className="font-medium">DFW only</span>
                </div>
              </div>
            </div>

            {/* Optimal Scenario */}
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-3">Optimal ($2M) ⭐</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">24-month runway</span>
                  <span className="font-medium text-blue-900">167 clients</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Year 2 ARR:</span>
                  <span className="font-medium text-blue-900">$2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Team size:</span>
                  <span className="font-medium text-blue-900">25 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Market focus:</span>
                  <span className="font-medium text-blue-900">Texas-wide</span>
                </div>
              </div>
            </div>

            {/* Aggressive Scenario */}
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3">Aggressive ($5M)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">36-month runway</span>
                  <span className="font-medium">300 clients</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Year 2 ARR:</span>
                  <span className="font-medium">$3.6M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Team size:</span>
                  <span className="font-medium">50 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Market focus:</span>
                  <span className="font-medium">Multi-state</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Analysis & Exit Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitive Landscape */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Competitive Analysis</CardTitle>
            <p className="text-sm text-slate-600">Market positioning and differentiation</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">UiPath</p>
                  <p className="text-xs text-slate-600">Enterprise RPA platform</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">$35B valuation</p>
                  <p className="text-xs text-red-600">High complexity</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Zapier</p>
                  <p className="text-xs text-slate-600">Workflow automation</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">$5B valuation</p>
                  <p className="text-xs text-yellow-600">Limited AI</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-900">DW AI Platform</p>
                  <p className="text-xs text-green-700">AI-powered SMB focus</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-900">$50M target</p>
                  <p className="text-xs text-green-600">Unique positioning</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">Our Advantage</h5>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• AI-powered pain point detection</li>
                  <li>• SMB market focus (underserved)</li>
                  <li>• Local market expertise</li>
                  <li>• Proven ROI demonstration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exit Strategy */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Exit Strategy</CardTitle>
            <p className="text-sm text-slate-600">Potential acquisition targets and timeline</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Strategic Acquirers</h4>
                <div className="space-y-2 text-sm text-purple-800">
                  <div className="flex justify-between">
                    <span>Microsoft</span>
                    <span className="font-medium">Power Platform synergy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salesforce</span>
                    <span className="font-medium">SMB expansion</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ServiceNow</span>
                    <span className="font-medium">Workflow automation</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Valuation Model</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Revenue Multiple:</span>
                    <span className="font-medium">15x ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>At $6M ARR:</span>
                    <span className="font-medium">$90M exit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span className="font-medium">5-7 years</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">IPO Potential</h4>
                <p className="text-sm text-orange-800">
                  At $100M+ ARR, IPO becomes viable with public market automation multiples of 20-25x revenue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
