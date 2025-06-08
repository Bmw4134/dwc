import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { roiApi } from "@/lib/api";

export function SavingsBreakdown() {
  const { data: calculations = [], isLoading } = useQuery({
    queryKey: ["/api/roi"],
    queryFn: () => roiApi.getCalculations(),
  });

  const latestCalculation = calculations[0];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestCalculation) {
    return (
      <Card className="shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">ROI Analysis</CardTitle>
          <p className="text-sm text-slate-600">Calculate savings to see detailed breakdown</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <i className="fas fa-calculator text-4xl text-slate-300 mb-4"></i>
            <p className="text-slate-500">No calculations yet</p>
            <p className="text-sm text-slate-400">Use the calculator to see your ROI breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthlySavings = parseFloat(latestCalculation.monthlySavings);
  const annualSavings = parseFloat(latestCalculation.annualSavings);
  const implementationCost = parseFloat(latestCalculation.implementationCost);
  const monthlyServiceFee = parseFloat(latestCalculation.monthlyServiceFee);
  const roiPercentage = parseFloat(latestCalculation.roiPercentage);
  const breakEvenMonths = parseFloat(latestCalculation.breakEvenMonths);

  // Calculate component savings (mock breakdown for demo)
  const laborSavings = monthlySavings * 0.6;
  const errorReduction = monthlySavings * 0.25;
  const efficiencyGains = monthlySavings * 0.15;

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">ROI Analysis</CardTitle>
            <p className="text-sm text-slate-600">{latestCalculation.industry} • {latestCalculation.employeeCount} employees</p>
          </div>
          <Button variant="outline" size="sm">
            <i className="fas fa-file-pdf mr-2"></i>
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Savings Breakdown */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-slate-900">Monthly Savings Breakdown</h4>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Labor Cost Reduction</span>
            <span className="text-lg font-bold text-green-600 font-mono">
              ${laborSavings.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Error Reduction Savings</span>
            <span className="text-lg font-bold text-green-600 font-mono">
              ${errorReduction.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Efficiency Improvements</span>
            <span className="text-lg font-bold text-green-600 font-mono">
              ${efficiencyGains.toLocaleString()}
            </span>
          </div>
          
          <hr className="border-slate-200" />
          
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-slate-900">Total Monthly Savings</span>
            <span className="text-xl font-bold text-green-600 font-mono">
              ${monthlySavings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Investment & Returns */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-slate-900 mb-3">Investment Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Implementation Cost</span>
              <span className="text-sm font-mono text-slate-900">
                ${implementationCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Monthly Service Fee</span>
              <span className="text-sm font-mono text-slate-900">
                ${monthlyServiceFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Break-even Point</span>
              <span className="text-sm font-mono text-blue-600 font-medium">
                {breakEvenMonths} months
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="text-base font-medium text-slate-900">Annual ROI</span>
              <span className="text-lg font-bold text-green-600 font-mono">
                {roiPercentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Competitive Advantage</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>24/7 automated operations</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Reduced human error by 95%</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Scalable without proportional cost increase</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Real-time analytics and reporting</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Button className="flex-1">
            <i className="fas fa-handshake mr-2"></i>
            Schedule Demo
          </Button>
          <Button variant="outline" className="flex-1">
            <i className="fas fa-file-contract mr-2"></i>
            Generate Proposal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
