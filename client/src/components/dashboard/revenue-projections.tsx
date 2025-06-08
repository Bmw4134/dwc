import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { forecastingApi, clientsApi } from "@/lib/api";

export function RevenueProjections() {
  const { data: forecast, isLoading: forecastLoading } = useQuery({
    queryKey: ["/api/forecasting/revenue"],
    queryFn: () => forecastingApi.getRevenueProjections(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  if (forecastLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentClients = clients.length;
  const currentMRR = parseFloat(forecast?.currentMRR || '0');
  const progressToYear1 = currentClients > 0 ? (currentClients / 100) * 100 : 0;

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Revenue Projections</CardTitle>
            <p className="text-sm text-slate-600">Path to $6M ARR</p>
          </div>
          <Button variant="outline" size="sm">
            <i className="fas fa-download mr-2"></i>
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Current Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Current Progress</span>
            <span className="text-sm font-bold text-slate-900">{currentClients} clients</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(progressToYear1, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ${currentMRR.toLocaleString()} MRR
          </div>
        </div>

        {/* Milestone Targets */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">50 Clients</span>
            <span className="text-sm font-bold text-green-600">$480K ARR</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">100 Clients</span>
            <span className="text-sm font-bold text-green-600">$960K ARR</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">250 Clients</span>
            <span className="text-sm font-bold text-green-600">$2.4M ARR</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-slate-700">500 Clients</span>
            <span className="text-sm font-bold text-green-600">$6M ARR</span>
          </div>
        </div>

        {/* Bank-Ready Metrics */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Investor Projection</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Time to $1M ARR:</span>
              <span className="font-semibold">18 months</span>
            </div>
            <div className="flex justify-between">
              <span>Average Client Value:</span>
              <span className="font-semibold">$12K ARR</span>
            </div>
            <div className="flex justify-between">
              <span>Market Size:</span>
              <span className="font-semibold">$50B+ TAM</span>
            </div>
          </div>
        </div>

        {/* Growth Strategy */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Growth Strategy</h4>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center">
              <i className="fas fa-check text-green-600 mr-2"></i>
              ZIP 76140 market penetration (Current)
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock text-orange-500 mr-2"></i>
              Expand to adjacent ZIP codes (Q2)
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock text-orange-500 mr-2"></i>
              Dallas-Fort Worth metro expansion (Q3)
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock text-orange-500 mr-2"></i>
              Texas statewide rollout (Q4)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
