import { CalculatorForm } from "@/components/roi/calculator-form";
import { SavingsBreakdown } from "@/components/roi/savings-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { roiApi, clientsApi } from "@/lib/api";
import { useEffect } from "react";

interface RoiCalculatorProps {
  refreshTrigger: number;
}

export default function RoiCalculator({ refreshTrigger }: RoiCalculatorProps) {
  const { data: calculations = [], refetch: refetchCalculations } = useQuery({
    queryKey: ["/api/roi"],
    queryFn: () => roiApi.getCalculations(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: () => clientsApi.getAll(),
  });

  useEffect(() => {
    refetchCalculations();
  }, [refreshTrigger, refetchCalculations]);

  const totalSavingsGenerated = clients.reduce((sum, client) => 
    sum + parseFloat(client.monthlySavings || '0'), 0
  );

  const avgROI = calculations.length > 0 
    ? calculations.reduce((sum, calc) => sum + parseFloat(calc.roiPercentage), 0) / calculations.length
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ROI Calculator</h1>
            <p className="text-slate-600 mt-1">Precise automation savings estimates with detailed financial analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <i className="fas fa-download mr-2"></i>
              Export Report
            </Button>
            <Button size="sm">
              <i className="fas fa-share mr-2"></i>
              Share Calculator
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Savings Generated</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${totalSavingsGenerated.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">Monthly recurring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Average ROI</p>
                <p className="text-2xl font-bold text-slate-900">{avgROI.toFixed(0)}%</p>
                <p className="text-sm text-blue-600">Annual return</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-calculator text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Calculations Run</p>
                <p className="text-2xl font-bold text-slate-900">{calculations.length}</p>
                <p className="text-sm text-purple-600">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg Break-even</p>
                <p className="text-2xl font-bold text-slate-900">
                  {calculations.length > 0 
                    ? (calculations.reduce((sum, calc) => sum + parseFloat(calc.breakEvenMonths), 0) / calculations.length).toFixed(1)
                    : '0'
                  } mo
                </p>
                <p className="text-sm text-orange-600">Time to ROI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CalculatorForm />
        <SavingsBreakdown />
      </div>

      {/* Industry Benchmarks */}
      <Card className="mb-8 shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">Industry Benchmarks</CardTitle>
          <p className="text-sm text-slate-600">Compare your automation potential with industry standards</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Healthcare</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Avg ROI:</span>
                  <span className="font-semibold">285%</span>
                </div>
                <div className="flex justify-between">
                  <span>Automation Potential:</span>
                  <span className="font-semibold">75-90%</span>
                </div>
                <div className="flex justify-between">
                  <span>Break-even:</span>
                  <span className="font-semibold">0.8 months</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Legal Services</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex justify-between">
                  <span>Avg ROI:</span>
                  <span className="font-semibold">342%</span>
                </div>
                <div className="flex justify-between">
                  <span>Automation Potential:</span>
                  <span className="font-semibold">80-95%</span>
                </div>
                <div className="flex justify-between">
                  <span>Break-even:</span>
                  <span className="font-semibold">0.6 months</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Manufacturing</h4>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex justify-between">
                  <span>Avg ROI:</span>
                  <span className="font-semibold">198%</span>
                </div>
                <div className="flex justify-between">
                  <span>Automation Potential:</span>
                  <span className="font-semibold">60-80%</span>
                </div>
                <div className="flex justify-between">
                  <span>Break-even:</span>
                  <span className="font-semibold">1.2 months</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Calculations */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Calculations</CardTitle>
          <p className="text-sm text-slate-600">History of ROI analyses and projections</p>
        </CardHeader>
        <CardContent className="p-0">
          {calculations.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-calculator text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-medium">No calculations yet</p>
              <p className="text-sm text-slate-400">Use the calculator above to generate your first ROI analysis</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {calculations.map((calc) => (
                <div key={calc.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{calc.industry}</h3>
                      <p className="text-sm text-slate-600">{calc.employeeCount} employees</p>
                      <p className="text-xs text-slate-500">
                        {new Date(calc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${parseFloat(calc.monthlySavings).toLocaleString()}/mo
                      </p>
                      <p className="text-sm text-slate-600">
                        {parseFloat(calc.roiPercentage).toFixed(0)}% ROI
                      </p>
                      <p className="text-xs text-slate-500">
                        {parseFloat(calc.breakEvenMonths).toFixed(1)} mo break-even
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
