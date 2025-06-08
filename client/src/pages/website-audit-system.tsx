import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface WebsiteAuditResult {
  url: string;
  overallScore: number;
  issues: AuditIssue[];
  recommendations: string[];
  potentialRevenue: string;
  conversionOptimizations: ConversionOptimization[];
  seoAnalysis: SEOAnalysis;
  performanceMetrics: PerformanceMetrics;
  competitorAnalysis: CompetitorAnalysis;
}

interface AuditIssue {
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  impact: string;
  solution: string;
  estimatedTimeToFix: string;
  potentialRevenueIncrease: string;
}

interface ConversionOptimization {
  area: string;
  currentRate: number;
  potentialRate: number;
  revenueImpact: string;
  implementation: string[];
}

interface SEOAnalysis {
  currentRanking: string;
  keywordOpportunities: string[];
  localSEOScore: number;
  metaTagsScore: number;
  contentScore: number;
}

interface PerformanceMetrics {
  loadTime: number;
  mobileScore: number;
  desktopScore: number;
  coreWebVitals: string;
}

interface CompetitorAnalysis {
  topCompetitors: string[];
  priceComparison: string;
  serviceGaps: string[];
  marketOpportunities: string[];
}

export default function WebsiteAuditSystem() {
  const { toast } = useToast();
  const [websiteUrl, setWebsiteUrl] = useState("www.katesphotography.com");
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Kate's Photography Studio",
    location: "Austin, TX",
    services: "Wedding photography, family portraits, corporate headshots",
    targetBudget: "$3,000-6,000"
  });
  const [auditResult, setAuditResult] = useState<WebsiteAuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const auditWebsiteMutation = useMutation({
    mutationFn: async (data: { url: string; businessInfo: any }) => {
      const response = await apiRequest("/api/audit-website", "POST", data);
      return response;
    },
    onSuccess: (result: WebsiteAuditResult) => {
      setAuditResult(result);
      setIsAnalyzing(false);
      toast({
        title: "Website Audit Complete",
        description: `Overall score: ${result.overallScore}/100 with ${result.issues.length} issues identified`,
      });
    },
    onError: () => {
      setIsAnalyzing(false);
      toast({
        title: "Audit Failed",
        description: "Unable to complete website audit",
        variant: "destructive",
      });
    },
  });

  const handleAudit = () => {
    setIsAnalyzing(true);
    auditWebsiteMutation.mutate({
      url: websiteUrl,
      businessInfo
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Website Audit & Optimization System
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive Analysis for Photography Business Growth
          </p>
        </div>

        {/* Audit Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔍 Website Analysis Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="www.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <Input
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo(prev => ({...prev, businessName: e.target.value}))}
                  placeholder="Kate's Photography Studio"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={businessInfo.location}
                  onChange={(e) => setBusinessInfo(prev => ({...prev, location: e.target.value}))}
                  placeholder="Austin, TX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Budget</label>
                <Input
                  value={businessInfo.targetBudget}
                  onChange={(e) => setBusinessInfo(prev => ({...prev, targetBudget: e.target.value}))}
                  placeholder="$3,000-6,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Services Offered</label>
              <Input
                value={businessInfo.services}
                onChange={(e) => setBusinessInfo(prev => ({...prev, services: e.target.value}))}
                placeholder="Wedding photography, family portraits, corporate headshots"
              />
            </div>

            <Button 
              onClick={handleAudit}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isAnalyzing || auditWebsiteMutation.isPending}
            >
              {isAnalyzing ? "Analyzing Website..." : "Run Complete Audit"}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={85} className="w-full" />
                <p className="text-sm text-gray-600 text-center">
                  Analyzing SEO, performance, conversions, and competitor landscape...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Results */}
        {auditResult && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  📊 Overall Website Score
                  <div className={`text-4xl font-bold ${getScoreColor(auditResult.overallScore)}`}>
                    {auditResult.overallScore}/100
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{auditResult.potentialRevenue}</p>
                    <p className="text-sm text-gray-600">Revenue Potential</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{auditResult.issues.length}</p>
                    <p className="text-sm text-gray-600">Issues Identified</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{auditResult.recommendations.length}</p>
                    <p className="text-sm text-gray-600">Recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card>
              <CardHeader>
                <CardTitle>🚨 Priority Issues to Fix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditResult.issues.slice(0, 5).map((issue, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{issue.category}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{issue.issue}</h4>
                          <p className="text-sm text-gray-600 mt-1">{issue.impact}</p>
                          <p className="text-sm text-blue-600 mt-2">{issue.solution}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-green-600 font-medium">{issue.potentialRevenueIncrease}</p>
                          <p className="text-gray-500">{issue.estimatedTimeToFix}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle>💰 Conversion Rate Optimizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {auditResult.conversionOptimizations.map((optimization, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{optimization.area}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Rate:</span>
                          <span className="text-red-600">{optimization.currentRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Potential Rate:</span>
                          <span className="text-green-600">{optimization.potentialRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Revenue Impact:</span>
                          <span className="text-blue-600">{optimization.revenueImpact}</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 font-medium">Implementation:</p>
                          <ul className="text-xs text-gray-500 list-disc list-inside mt-1">
                            {optimization.implementation.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance & SEO */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>⚡ Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Load Time:</span>
                    <span className={auditResult.performanceMetrics.loadTime > 3 ? "text-red-600" : "text-green-600"}>
                      {auditResult.performanceMetrics.loadTime}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mobile Score:</span>
                    <span className={getScoreColor(auditResult.performanceMetrics.mobileScore)}>
                      {auditResult.performanceMetrics.mobileScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Desktop Score:</span>
                    <span className={getScoreColor(auditResult.performanceMetrics.desktopScore)}>
                      {auditResult.performanceMetrics.desktopScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Core Web Vitals:</span>
                    <Badge className={auditResult.performanceMetrics.coreWebVitals === "Good" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {auditResult.performanceMetrics.coreWebVitals}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🔍 SEO Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Local SEO Score:</span>
                    <span className={getScoreColor(auditResult.seoAnalysis.localSEOScore)}>
                      {auditResult.seoAnalysis.localSEOScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Meta Tags Score:</span>
                    <span className={getScoreColor(auditResult.seoAnalysis.metaTagsScore)}>
                      {auditResult.seoAnalysis.metaTagsScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Content Score:</span>
                    <span className={getScoreColor(auditResult.seoAnalysis.contentScore)}>
                      {auditResult.seoAnalysis.contentScore}/100
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Ranking:</p>
                    <p className="text-sm text-gray-600">{auditResult.seoAnalysis.currentRanking}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitor Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Competitive Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Top Competitors</h4>
                    <ul className="space-y-2">
                      {auditResult.competitorAnalysis.topCompetitors.map((competitor, index) => (
                        <li key={index} className="text-sm text-gray-600">• {competitor}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Market Opportunities</h4>
                    <ul className="space-y-2">
                      {auditResult.competitorAnalysis.marketOpportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-green-600">• {opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm"><strong>Price Positioning:</strong> {auditResult.competitorAnalysis.priceComparison}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Plan */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Recommended Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}