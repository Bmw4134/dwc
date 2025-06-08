import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AutomationBuilderProps {
  refreshTrigger: number;
}

export default function AutomationBuilder({ refreshTrigger }: AutomationBuilderProps) {
  const [analysisForm, setAnalysisForm] = useState({
    businessName: "",
    industry: "",
    description: "",
    employeeCount: "",
  });
  
  const [painPointAnalysis, setPainPointAnalysis] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: analysisApi.analyzePainPoints,
    onSuccess: (data) => {
      setPainPointAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: `Identified ${data.painPoints.length} automation opportunities`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze business processes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!analysisForm.businessName || !analysisForm.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in business name and industry",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate({
      businessName: analysisForm.businessName,
      industry: analysisForm.industry,
      description: analysisForm.description,
      employeeCount: analysisForm.employeeCount ? parseInt(analysisForm.employeeCount) : undefined,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Automation Builder</h1>
            <p className="text-slate-600 mt-1">AI-powered business process analysis and automation design</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <i className="fas fa-save mr-2"></i>
              Save Template
            </Button>
            <Button size="sm">
              <i className="fas fa-play mr-2"></i>
              Deploy Automation
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pain Point Analysis Form */}
        <Card className="lg:col-span-2 shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Pain Point Analyzer</CardTitle>
            <p className="text-sm text-slate-600">AI-powered analysis of business processes and automation opportunities</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Name *</label>
                  <Input
                    placeholder="e.g., Johnson Medical Group"
                    value={analysisForm.businessName}
                    onChange={(e) => setAnalysisForm(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industry *</label>
                  <Select value={analysisForm.industry} onValueChange={(value) => setAnalysisForm(prev => ({ ...prev, industry: value }))}>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Employee Count</label>
                <Input
                  type="number"
                  placeholder="e.g., 25"
                  value={analysisForm.employeeCount}
                  onChange={(e) => setAnalysisForm(prev => ({ ...prev, employeeCount: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Description</label>
                <Textarea
                  placeholder="Describe the business operations, current challenges, and processes..."
                  rows={4}
                  value={analysisForm.description}
                  onChange={(e) => setAnalysisForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending}
                className="w-full"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Analyzing Business Processes...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search-plus mr-2"></i>
                    Analyze Pain Points
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Automation Templates */}
        <Card className="shadow-sm border border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg font-semibold text-slate-900">Automation Templates</CardTitle>
            <p className="text-sm text-slate-600">Pre-built automation workflows</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-slate-900 text-sm">Patient Scheduling</h4>
                <p className="text-xs text-slate-600 mt-1">Automated appointment booking and reminders</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">Healthcare</Badge>
                  <span className="text-xs text-green-600 font-medium">$3K/mo savings</span>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-slate-900 text-sm">Document Processing</h4>
                <p className="text-xs text-slate-600 mt-1">AI-powered contract review and filing</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">Legal</Badge>
                  <span className="text-xs text-green-600 font-medium">$5K/mo savings</span>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-slate-900 text-sm">Inventory Management</h4>
                <p className="text-xs text-slate-600 mt-1">Automated stock tracking and reordering</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">Retail</Badge>
                  <span className="text-xs text-green-600 font-medium">$4K/mo savings</span>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-slate-900 text-sm">Customer Follow-up</h4>
                <p className="text-xs text-slate-600 mt-1">Automated email sequences and CRM updates</p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">General</Badge>
                  <span className="text-xs text-green-600 font-medium">$2K/mo savings</span>
                </div>
              </div>

              <Button variant="outline" className="w-full text-sm">
                <i className="fas fa-plus mr-2"></i>
                Browse All Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {painPointAnalysis && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg font-semibold text-slate-900">Analysis Results</CardTitle>
              <p className="text-sm text-slate-600">{analysisForm.businessName} - Automation Opportunities</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    ${painPointAnalysis.totalMonthlySavings?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-green-800">Total Monthly Savings</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{painPointAnalysis.painPoints?.length || 0}</p>
                  <p className="text-sm text-blue-800">Automation Opportunities</p>
                </div>
                <div className={`text-center p-4 rounded-lg border ${getComplexityColor(painPointAnalysis.implementationComplexity)}`}>
                  <p className="text-2xl font-bold capitalize">{painPointAnalysis.implementationComplexity}</p>
                  <p className="text-sm">Implementation Complexity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pain Points Breakdown */}
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg font-semibold text-slate-900">Identified Pain Points</CardTitle>
              <p className="text-sm text-slate-600">Department-by-department automation opportunities</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {painPointAnalysis.painPoints?.map((painPoint: any, index: number) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-slate-900">{painPoint.department}</h4>
                        <Badge className={getDifficultyColor(painPoint.difficulty)}>
                          {painPoint.difficulty} difficulty
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${painPoint.savings?.toLocaleString()}/mo</p>
                        <p className="text-xs text-slate-500">{painPoint.timeWasted}h saved/month</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{painPoint.process}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Implementation time: 2-4 weeks</span>
                      <Button size="sm" variant="outline">
                        <i className="fas fa-cog mr-2"></i>
                        Build Automation
                      </Button>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No pain points identified yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {painPointAnalysis.priorityRecommendations && (
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg font-semibold text-slate-900">Priority Recommendations</CardTitle>
                <p className="text-sm text-slate-600">AI-suggested implementation strategy</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {painPointAnalysis.priorityRecommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-sm text-blue-900">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Workflow Builder (Visual Interface) */}
      <Card className="mt-8 shadow-sm border border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">Visual Workflow Builder</CardTitle>
          <p className="text-sm text-slate-600">Drag-and-drop automation design interface</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-100 rounded-lg p-8 text-center">
            <i className="fas fa-sitemap text-4xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 font-medium">Interactive Workflow Designer</p>
            <p className="text-sm text-slate-500 mb-4">Visual interface for creating automation sequences</p>
            <Button>
              <i className="fas fa-plus mr-2"></i>
              Start Building Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
