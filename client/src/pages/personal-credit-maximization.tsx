import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, CreditCard, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PersonalCreditOption {
  lender: string;
  product: string;
  amount: string;
  apr: string;
  timeframe: string;
  requirements: string[];
  applicationUrl: string;
  successRate: number;
  creditScoreMin: number;
  strategy: 'immediate' | 'short_term' | 'medium_term';
  priority: number;
}

interface CreditMaximizationPlan {
  totalPotential: number;
  phase1: PersonalCreditOption[];
  phase2: PersonalCreditOption[];
  phase3: PersonalCreditOption[];
  businessPhase: PersonalCreditOption[];
  timeline: string;
  actionSteps: string[];
  riskMitigation: string[];
}

interface OptimalSequence {
  sequence: PersonalCreditOption[];
  totalPotential: number;
  timeframe: string;
}

interface CreditReport {
  currentScore: number;
  projectedScore: number;
  recommendations: string[];
  nextSteps: string[];
}

export default function PersonalCreditMaximization() {
  const [targetAmount, setTargetAmount] = useState(50000);
  const queryClient = useQueryClient();

  const { data: maximizationPlan, isLoading: planLoading } = useQuery<CreditMaximizationPlan>({
    queryKey: ['/api/personal-credit/maximization-plan', targetAmount],
    queryFn: () => fetch(`/api/personal-credit/maximization-plan?target=${targetAmount}`).then(res => res.json())
  });

  const { data: optimalSequence, isLoading: sequenceLoading } = useQuery<OptimalSequence>({
    queryKey: ['/api/personal-credit/optimal-sequence'],
  });

  const { data: creditReport, isLoading: reportLoading } = useQuery<CreditReport>({
    queryKey: ['/api/personal-credit/report'],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStrategyBadgeColor = (strategy: string) => {
    switch (strategy) {
      case 'immediate': return 'bg-green-500';
      case 'short_term': return 'bg-blue-500';
      case 'medium_term': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (successRate: number) => {
    if (successRate >= 80) return 'text-green-600';
    if (successRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (planLoading || sequenceLoading || reportLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-blue-300 mt-4">Loading Personal Credit Maximization Strategy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Personal Credit Maximization Dashboard
          </h1>
          <p className="text-blue-300 text-lg">
            Leverage Your 690 Credit Score for Maximum Capital Access
          </p>
        </div>

        {/* Target Amount Selector */}
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-300">Target Funding Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[25000, 50000, 75000, 100000].map((amount) => (
                <Button
                  key={amount}
                  variant={targetAmount === amount ? "default" : "outline"}
                  onClick={() => setTargetAmount(amount)}
                  className={targetAmount === amount ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500/20 text-blue-300"}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm text-green-300">Total Potential</p>
                  <p className="text-2xl font-bold text-green-400">
                    {maximizationPlan ? formatCurrency(maximizationPlan.totalPotential) : '--'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-300">Current Score</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {creditReport?.currentScore || 690}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm text-purple-300">Projected Score</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {creditReport?.projectedScore || 710}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-yellow-300">Timeline</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {optimalSequence?.timeframe || '2-3 weeks'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="optimal-sequence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="optimal-sequence" className="data-[state=active]:bg-blue-600">
              Optimal Sequence
            </TabsTrigger>
            <TabsTrigger value="credit-phases" className="data-[state=active]:bg-blue-600">
              Credit Phases
            </TabsTrigger>
            <TabsTrigger value="action-steps" className="data-[state=active]:bg-blue-600">
              Action Steps
            </TabsTrigger>
            <TabsTrigger value="risk-mitigation" className="data-[state=active]:bg-blue-600">
              Risk Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimal-sequence" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-300">Optimal Application Sequence</CardTitle>
                <CardDescription className="text-slate-400">
                  Recommended order to maximize approval rates and minimize credit impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimalSequence?.sequence.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-4 mb-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{option.lender} - {option.product}</h4>
                        <p className="text-sm text-slate-400">{option.amount} • {option.timeframe}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getDifficultyColor(option.successRate)} bg-transparent border`}>
                        {option.successRate}% Success
                      </Badge>
                      <Button 
                        onClick={() => window.open(option.applicationUrl, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit-phases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phase 1: 0% APR Credit Cards */}
              <Card className="bg-slate-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Phase 1: 0% APR Credit Cards
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Immediate access with no interest for 12-21 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maximizationPlan?.phase1.map((option, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{option.lender}</h5>
                        <Badge className="bg-green-600">{option.apr}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{option.amount}</p>
                      <Progress value={option.successRate} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">{option.successRate}% approval rate</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Phase 2: Personal Lines of Credit */}
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Phase 2: Personal Lines of Credit
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Flexible access to larger amounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maximizationPlan?.phase2.map((option, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{option.lender}</h5>
                        <Badge className="bg-blue-600">{option.apr}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{option.amount}</p>
                      <Progress value={option.successRate} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">{option.successRate}% approval rate</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Phase 3: Personal Loans */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Phase 3: Personal Loans
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Fixed-term funding for specific amounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maximizationPlan?.phase3.map((option, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{option.lender}</h5>
                        <Badge className="bg-purple-600">{option.apr}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{option.amount}</p>
                      <Progress value={option.successRate} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">{option.successRate}% approval rate</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Business Phase */}
              <Card className="bg-slate-800/50 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-yellow-300 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Business Phase: LLC Credit
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Business credit with personal guarantee
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maximizationPlan?.businessPhase.map((option, index) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{option.lender}</h5>
                        <Badge className="bg-yellow-600">{option.apr}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{option.amount}</p>
                      <Progress value={option.successRate} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">{option.successRate}% approval rate</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="action-steps" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-300">Action Steps & Timeline</CardTitle>
                <CardDescription className="text-slate-400">
                  Step-by-step implementation guide for maximum success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maximizationPlan?.actionSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {maximizationPlan?.timeline && (
                  <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">Implementation Timeline</h4>
                    <p className="text-slate-300">{maximizationPlan.timeline}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-mitigation" className="space-y-6">
            <Card className="bg-slate-800/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-300 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Risk Mitigation Strategy
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Protect your credit score while maximizing approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {maximizationPlan?.riskMitigation.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {creditReport && (
              <Card className="bg-slate-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-300">Credit Score Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {creditReport.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                            <p className="text-sm text-slate-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">Next Steps</h4>
                      <div className="space-y-2">
                        {creditReport.nextSteps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                              {index + 1}
                            </div>
                            <p className="text-sm text-slate-300">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}