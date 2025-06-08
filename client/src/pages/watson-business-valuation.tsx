import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Brain, Zap, Download, Lock, Eye } from "lucide-react";

interface BusinessValuation {
  totalEnterpriseValue: number;
  technologyAssets: number;
  quantumEnhancementPremium: number;
  revenueMultiple: number;
  marketPositionValue: number;
  growthTrajectoryValue: number;
  confidenceRating: number;
  lastUpdated: string;
}

interface ValuationComponent {
  category: string;
  value: number;
  description: string;
  justification: string[];
  confidence: number;
}

interface QuantumMetrics {
  qQuality: number;
  qAutonomy: number;
  qScalability: number;
  qInnovation: number;
  overallQuantumScore: number;
  marketDifferentiation: number;
}

export default function WatsonBusinessValuation() {
  const [realtimeValue, setRealtimeValue] = useState(0);

  // Main valuation data
  const { data: valuationData, isLoading } = useQuery({
    queryKey: ["/api/watson/business-valuation"],
    refetchInterval: 30000, // Update every 30 seconds
    retry: false
  });

  // Real-time metrics
  const { data: realtimeData } = useQuery({
    queryKey: ["/api/watson/valuation-realtime"],
    refetchInterval: 5000, // Update every 5 seconds
    retry: false
  });

  // Lender presentation data
  const { data: lenderPresentation } = useQuery({
    queryKey: ["/api/watson/lender-presentation"],
    retry: false
  });

  // Update realtime value with smooth animation
  useEffect(() => {
    if (realtimeData?.marketValue) {
      setRealtimeValue(realtimeData.marketValue);
    }
  }, [realtimeData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading Watson Valuation Module...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-xl">Access Restricted - Watson Only</div>
          </div>
        </div>
      </div>
    );
  }

  const valuation: BusinessValuation = valuationData.valuation;
  const components: ValuationComponent[] = valuationData.components;
  const quantumMetrics: QuantumMetrics = valuationData.quantumMetrics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Lock className="h-8 w-8 text-purple-400" />
              DWC Business Valuation
              <Badge variant="secondary" className="bg-purple-600 text-white">
                Watson Only
              </Badge>
            </h1>
            <p className="text-slate-300 mt-2">
              Private enterprise valuation for lender presentations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Eye className="h-3 w-3 mr-1" />
              Live Updates
            </Badge>
            <Button variant="outline" className="text-white border-purple-400">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Valuation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Enterprise Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(realtimeValue || valuation.totalEnterpriseValue)}
              </div>
              <p className="text-xs text-green-400 mt-1">
                +{formatPercent(0.15)} from baseline
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Technology Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(valuation.technologyAssets)}
              </div>
              <p className="text-xs text-blue-400 mt-1">
                Quantum-enhanced platform
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Revenue Multiple
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {valuation.revenueMultiple}x
              </div>
              <p className="text-xs text-yellow-400 mt-1">
                Premium for proven ROI
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Confidence Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPercent(valuation.confidenceRating)}
              </div>
              <p className="text-xs text-green-400 mt-1">
                High certainty valuation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="components" className="text-white">Valuation Components</TabsTrigger>
            <TabsTrigger value="quantum" className="text-white">Quantum Metrics</TabsTrigger>
            <TabsTrigger value="lender" className="text-white">Lender Presentation</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {components.map((component, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {component.category}
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {formatCurrency(component.value)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Confidence</span>
                          <span className="text-white">{formatPercent(component.confidence)}</span>
                        </div>
                        <Progress 
                          value={component.confidence * 100} 
                          className="h-2"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-2">Key Justifications:</p>
                        <ul className="space-y-1">
                          {component.justification.slice(0, 3).map((point, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quantum" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Quantum Intelligence Metrics (QQ QASI QAGI QANI QAI)
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Advanced quantum enhancement assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Quality (QQ)</span>
                        <span className="text-white">{formatPercent(quantumMetrics.qQuality)}</span>
                      </div>
                      <Progress value={quantumMetrics.qQuality * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Autonomy (QASI)</span>
                        <span className="text-white">{formatPercent(quantumMetrics.qAutonomy)}</span>
                      </div>
                      <Progress value={quantumMetrics.qAutonomy * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Scalability (QAGI)</span>
                        <span className="text-white">{formatPercent(quantumMetrics.qScalability)}</span>
                      </div>
                      <Progress value={quantumMetrics.qScalability * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Innovation (QANI)</span>
                        <span className="text-white">{formatPercent(quantumMetrics.qInnovation)}</span>
                      </div>
                      <Progress value={quantumMetrics.qInnovation * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Overall QAI Score</span>
                        <span className="text-white">{formatPercent(quantumMetrics.overallQuantumScore)}</span>
                      </div>
                      <Progress value={quantumMetrics.overallQuantumScore * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Market Differentiation</span>
                        <span className="text-white">{formatPercent(quantumMetrics.marketDifferentiation)}</span>
                      </div>
                      <Progress value={quantumMetrics.marketDifferentiation * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lender" className="space-y-4">
            {lenderPresentation && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-300">Business:</span>
                        <p className="text-white font-medium">{lenderPresentation.executiveSummary.businessName}</p>
                      </div>
                      <div>
                        <span className="text-slate-300">Industry:</span>
                        <p className="text-white font-medium">{lenderPresentation.executiveSummary.industry}</p>
                      </div>
                      <div>
                        <span className="text-slate-300">Enterprise Value:</span>
                        <p className="text-green-400 font-bold">
                          {formatCurrency(lenderPresentation.executiveSummary.enterpriseValue)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-300">Confidence:</span>
                        <p className="text-purple-400 font-medium">{lenderPresentation.executiveSummary.confidenceLevel}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      Funding Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(lenderPresentation.fundingJustification.requestedAmount)}
                      </div>
                      <p className="text-slate-300 text-sm">Requested Funding</p>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm mb-2">Use of Funds:</p>
                      <ul className="space-y-1">
                        {lenderPresentation.fundingJustification.useOfFunds.map((use: string, i: number) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded">
                      <p className="text-green-400 font-medium text-sm">
                        Projected ROI: {lenderPresentation.fundingJustification.projectedROI}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Real-time Updates Footer */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 text-sm">Live Market Data</span>
                </div>
                {realtimeData && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">
                      Active Users: <span className="text-white">{realtimeData.activeUsers}</span>
                    </span>
                    <span className="text-slate-400">
                      System Uptime: <span className="text-green-400">{realtimeData.systemUptime?.toFixed(1)}%</span>
                    </span>
                    <span className="text-slate-400">
                      Client Satisfaction: <span className="text-purple-400">{realtimeData.clientSatisfaction?.toFixed(1)}/5.0</span>
                    </span>
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500">
                Last updated: {new Date(valuation.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}