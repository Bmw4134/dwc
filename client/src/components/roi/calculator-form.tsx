import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roiApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function CalculatorForm() {
  const [formData, setFormData] = useState({
    industry: "",
    employeeCount: "",
    monthlyLaborCost: "",
    automationPercentage: "75",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const calculateMutation = useMutation({
    mutationFn: roiApi.calculate,
    onSuccess: (data) => {
      toast({
        title: "ROI Calculation Complete",
        description: `Estimated annual savings: $${parseFloat(data.annualSavings).toLocaleString()}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/roi"] });
    },
    onError: () => {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate ROI. Please check your inputs.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.industry || !formData.employeeCount || !formData.monthlyLaborCost) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    calculateMutation.mutate({
      industry: formData.industry,
      employeeCount: parseInt(formData.employeeCount),
      monthlyLaborCost: parseFloat(formData.monthlyLaborCost),
      automationPercentage: parseFloat(formData.automationPercentage),
    });
  };

  const estimateHourlyCost = () => {
    const employees = parseInt(formData.employeeCount) || 0;
    const avgHourlyRate = 25; // Default hourly rate
    const hoursPerMonth = 160; // Full-time hours
    const estimated = employees * avgHourlyRate * hoursPerMonth;
    setFormData(prev => ({ ...prev, monthlyLaborCost: estimated.toString() }));
  };

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-900">Cost Savings Calculator</CardTitle>
        <p className="text-sm text-slate-600">Get precise automation ROI estimates</p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="industry">Industry *</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Legal Services">Legal Services</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Automotive">Automotive</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Professional Services">Professional Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="employeeCount">Employee Count *</Label>
            <Input
              id="employeeCount"
              type="number"
              placeholder="e.g., 25"
              value={formData.employeeCount}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="monthlyLaborCost">Monthly Labor Cost *</Label>
            <div className="flex space-x-2">
              <Input
                id="monthlyLaborCost"
                type="number"
                placeholder="e.g., 100000"
                value={formData.monthlyLaborCost}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyLaborCost: e.target.value }))}
              />
              <Button type="button" variant="outline" onClick={estimateHourlyCost}>
                Estimate
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Total monthly payroll for automatable roles</p>
          </div>

          <div>
            <Label htmlFor="automationPercentage">Automation Potential</Label>
            <Select value={formData.automationPercentage} onValueChange={(value) => setFormData(prev => ({ ...prev, automationPercentage: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50% (Conservative)</SelectItem>
                <SelectItem value="75">75% (Typical)</SelectItem>
                <SelectItem value="90">90% (Aggressive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Process Selection */}
          <div>
            <Label>Current Manual Processes</Label>
            <div className="mt-2 space-y-2">
              {[
                "Data Entry",
                "Report Generation", 
                "Email Marketing",
                "Inventory Management",
                "Customer Scheduling",
                "Invoice Processing"
              ].map((process) => (
                <label key={process} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span className="text-sm text-slate-700">{process}</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={calculateMutation.isPending}
          >
            {calculateMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Calculating...
              </>
            ) : (
              <>
                <i className="fas fa-calculator mr-2"></i>
                Calculate Savings
              </>
            )}
          </Button>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h4>
          <p className="text-xs text-blue-800">
            Our AI can analyze your business processes and provide personalized automation recommendations.
          </p>
          <Button variant="ghost" size="sm" className="mt-2 text-blue-700 p-0 h-auto">
            Request Free Analysis →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
