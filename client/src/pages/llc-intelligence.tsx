import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Building2, DollarSign, FileText, Users, Shield, TrendingUp, Target, Brain } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LLCRequirement {
  id: string;
  category: "legal" | "financial" | "operational" | "compliance" | "strategic";
  requirement: string;
  status: "complete" | "in_progress" | "not_started" | "critical";
  priority: "high" | "medium" | "low";
  description: string;
  actionItems: string[];
  estimatedCost?: number;
  timeRequired?: string;
  fundingImpact: "critical" | "important" | "recommended";
}

interface BusinessProfile {
  businessName: string;
  industry: string;
  targetMarket: string;
  revenueModel: string;
  fundingGoal: number;
  currentRevenue: number;
  operationalStatus: string;
}

export default function LLCIntelligence() {
  const { toast } = useToast();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    businessName: "DWC Systems LLC",
    industry: "Enterprise AI Automation",
    targetMarket: "SMB & Enterprise",
    revenueModel: "SaaS + Consulting",
    fundingGoal: 500000,
    currentRevenue: 47392,
    operationalStatus: "Active with clients"
  });

  const { data: llcRequirements, isLoading } = useQuery({
    queryKey: ["/api/llc-requirements"],
    retry: false,
  });

  const { data: complianceStatus } = useQuery({
    queryKey: ["/api/compliance-check"],
    retry: false,
  });

  const updateRequirementMutation = useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      return await apiRequest("PUT", `/api/llc-requirements/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/llc-requirements"] });
      toast({
        title: "Requirement Updated",
        description: "LLC requirement status has been updated successfully.",
      });
    }
  });

  const requirements: LLCRequirement[] = [
    {
      id: "articles-incorporation",
      category: "legal",
      requirement: "Articles of Incorporation Filed",
      status: "complete",
      priority: "high",
      description: "Legal formation documents filed with state",
      actionItems: ["File with Secretary of State", "Obtain Certificate of Incorporation"],
      estimatedCost: 300,
      timeRequired: "1-2 weeks",
      fundingImpact: "critical"
    },
    {
      id: "operating-agreement",
      category: "legal",
      requirement: "Operating Agreement",
      status: "in_progress",
      priority: "high",
      description: "Comprehensive operating agreement defining member roles and profit distribution",
      actionItems: ["Draft member agreements", "Define profit sharing", "Establish voting rights"],
      estimatedCost: 2500,
      timeRequired: "2-3 weeks",
      fundingImpact: "critical"
    },
    {
      id: "business-license",
      category: "compliance",
      requirement: "Business License & Permits",
      status: "complete",
      priority: "high",
      description: "Required business licenses for AI automation services",
      actionItems: ["General business license", "Technology services permit"],
      estimatedCost: 500,
      timeRequired: "1 week",
      fundingImpact: "critical"
    },
    {
      id: "ein-number",
      category: "financial",
      requirement: "EIN (Tax ID Number)",
      status: "complete",
      priority: "high",
      description: "Federal tax identification number for business operations",
      actionItems: ["Apply with IRS", "Update banking information"],
      estimatedCost: 0,
      timeRequired: "1 day",
      fundingImpact: "critical"
    },
    {
      id: "business-banking",
      category: "financial",
      requirement: "Business Banking Account",
      status: "complete",
      priority: "high",
      description: "Dedicated business banking with proper segregation of funds",
      actionItems: ["Open business checking", "Establish credit line", "Set up merchant services"],
      estimatedCost: 100,
      timeRequired: "1 week",
      fundingImpact: "critical"
    },
    {
      id: "accounting-system",
      category: "financial",
      requirement: "Professional Accounting System",
      status: "in_progress",
      priority: "high",
      description: "Professional bookkeeping and financial reporting system",
      actionItems: ["Implement QuickBooks/Xero", "Hire CPA", "Set up monthly reporting"],
      estimatedCost: 3000,
      timeRequired: "2 weeks",
      fundingImpact: "important"
    },
    {
      id: "ip-protection",
      category: "legal",
      requirement: "Intellectual Property Protection",
      status: "not_started",
      priority: "high",
      description: "Trademark and trade secret protection for AI algorithms",
      actionItems: ["File trademark applications", "Document proprietary processes", "Employee IP agreements"],
      estimatedCost: 5000,
      timeRequired: "3-6 months",
      fundingImpact: "critical"
    },
    {
      id: "insurance-coverage",
      category: "compliance",
      requirement: "Business Insurance",
      status: "not_started",
      priority: "medium",
      description: "Professional liability, E&O, and cyber security insurance",
      actionItems: ["General liability", "Professional liability", "Cyber security coverage"],
      estimatedCost: 8000,
      timeRequired: "2 weeks",
      fundingImpact: "important"
    },
    {
      id: "financial-projections",
      category: "financial",
      requirement: "3-Year Financial Projections",
      status: "in_progress",
      priority: "high",
      description: "Detailed financial forecasting with realistic growth assumptions",
      actionItems: ["Revenue projections", "Expense modeling", "Cash flow analysis", "Break-even analysis"],
      estimatedCost: 5000,
      timeRequired: "3-4 weeks",
      fundingImpact: "critical"
    },
    {
      id: "market-analysis",
      category: "strategic",
      requirement: "Market Analysis & Competitive Landscape",
      status: "not_started",
      priority: "medium",
      description: "Comprehensive market research and competitive positioning",
      actionItems: ["TAM/SAM analysis", "Competitor research", "Market positioning"],
      estimatedCost: 8000,
      timeRequired: "4-6 weeks",
      fundingImpact: "important"
    },
    {
      id: "pitch-deck",
      category: "strategic",
      requirement: "Investor Pitch Deck",
      status: "not_started",
      priority: "high",
      description: "Professional presentation for investor meetings",
      actionItems: ["Problem/solution slides", "Market opportunity", "Financial projections", "Team bios"],
      estimatedCost: 7500,
      timeRequired: "3-4 weeks",
      fundingImpact: "critical"
    },
    {
      id: "due-diligence-room",
      category: "strategic",
      requirement: "Due Diligence Data Room",
      status: "not_started",
      priority: "medium",
      description: "Organized repository of all business documents for investor review",
      actionItems: ["Legal documents", "Financial records", "Customer contracts", "IP documentation"],
      estimatedCost: 2000,
      timeRequired: "2 weeks",
      fundingImpact: "important"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "not_started":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "not_started":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "legal":
        return <Shield className="w-5 h-5" />;
      case "financial":
        return <DollarSign className="w-5 h-5" />;
      case "operational":
        return <Building2 className="w-5 h-5" />;
      case "compliance":
        return <FileText className="w-5 h-5" />;
      case "strategic":
        return <Target className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const completedCount = requirements.filter(r => r.status === "complete").length;
  const totalCount = requirements.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const criticalIncomplete = requirements.filter(r => 
    r.fundingImpact === "critical" && r.status !== "complete"
  );

  const totalEstimatedCost = requirements
    .filter(r => r.status !== "complete")
    .reduce((sum, r) => sum + (r.estimatedCost || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* Sophisticated Header */}
      <div className="relative border-b border-gray-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3">
                  DWC Systems LLC - Intelligence Platform
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                  Powered by NEXUS • Pre-Funding Assessment & Strategic Planning
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  {completionPercentage}%
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Funding Ready
                </div>
                <div className="w-16 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mt-2 mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-slate-700/50">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  ${totalEstimatedCost.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Investment Needed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Critical Alert */}
        {criticalIncomplete.length > 0 && (
          <Card className="mb-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Critical Requirements Missing
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-300">
                These items must be completed before approaching investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {criticalIncomplete.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(req.category)}
                      <span className="font-medium text-gray-900 dark:text-white">{req.requirement}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(req.status)}>
                        {req.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ${req.estimatedCost?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedCount}/{totalCount}
                  </p>
                </div>
                <Progress value={completionPercentage} className="w-16" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining Cost</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalEstimatedCost.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Funding Goal</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${businessProfile.fundingGoal.toLocaleString()}
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${businessProfile.currentRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requirements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="strategic">Strategic</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>LLC Pre-Funding Requirements</CardTitle>
                <CardDescription>
                  Complete assessment of all requirements before seeking investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requirements.map((req) => (
                    <div key={req.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(req.status)}
                          {getCategoryIcon(req.category)}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {req.requirement}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {req.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(req.status)}>
                            {req.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {req.fundingImpact}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Action Items
                          </p>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            {req.actionItems.map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Estimated Cost
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${req.estimatedCost?.toLocaleString() || 0}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Time Required
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {req.timeRequired}
                          </p>
                        </div>
                      </div>

                      {req.status !== "complete" && (
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
                          <Button
                            size="sm"
                            onClick={() => updateRequirementMutation.mutate({
                              id: req.id,
                              status: req.status === "not_started" ? "in_progress" : "complete"
                            })}
                          >
                            Mark as {req.status === "not_started" ? "In Progress" : "Complete"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal Foundation Requirements</CardTitle>
                <CardDescription>
                  Essential legal structures and protections for your LLC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requirements.filter(r => r.category === "legal").map((req) => (
                    <div key={req.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(req.status)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {req.requirement}
                          </h3>
                        </div>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {req.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Cost: ${req.estimatedCost?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Time: {req.timeRequired}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Infrastructure</CardTitle>
                <CardDescription>
                  Financial systems and documentation required for funding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requirements.filter(r => r.category === "financial").map((req) => (
                    <div key={req.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(req.status)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {req.requirement}
                          </h3>
                        </div>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {req.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Cost: ${req.estimatedCost?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Time: {req.timeRequired}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Positioning</CardTitle>
                <CardDescription>
                  Market positioning and investor presentation materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requirements.filter(r => r.category === "strategic").map((req) => (
                    <div key={req.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(req.status)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {req.requirement}
                          </h3>
                        </div>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {req.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Cost: ${req.estimatedCost?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Time: {req.timeRequired}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}