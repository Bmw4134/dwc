import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  DollarSign,
  Users,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  Star,
  Award,
  Briefcase,
  Calendar,
  Clock
} from "lucide-react";

interface ClientReport {
  id: string;
  clientName: string;
  websiteUrl: string;
  generatedAt: Date;
  reportType: "executive" | "technical" | "roi" | "comprehensive";
  status: "generating" | "ready" | "delivered";
  kpis: {
    currentTraffic: number;
    projectedTraffic: number;
    currentLeads: number;
    projectedLeads: number;
    currentRevenue: string;
    projectedRevenue: string;
    roiProjection: string;
    timeToBreakeven: string;
  };
  visualAssets: string[];
  downloadUrl?: string;
}

interface KPIMetric {
  title: string;
  current: string;
  projected: string;
  improvement: string;
  icon: any;
  color: string;
}

export default function ClientReportGenerator() {
  const [clientWebsite, setClientWebsite] = useState("https://www.blissfulmemoriesphotos.com/");
  const [reportType, setReportType] = useState<"executive" | "technical" | "roi" | "comprehensive">("comprehensive");
  const { toast } = useToast();

  // Kate's dual websites data
  const katesWebsites = [
    {
      url: "https://www.blissfulmemoriesphotos.com/",
      name: "Blissful Memories Photos",
      traffic: 1420,
      leads: 89,
      revenue: "$12,400"
    },
    {
      url: "https://www.blissfulmemories.studio/",
      name: "Blissful Memories Studio", 
      traffic: 890,
      leads: 34,
      revenue: "$6,800"
    }
  ];

  // Sample report data for Kate's consolidation
  const { data: reportPreview } = useQuery({
    queryKey: ["/api/reports/preview", clientWebsite],
    initialData: {
      id: "kate-consolidation-report",
      clientName: "Kate White Photography",
      websiteUrl: clientWebsite,
      generatedAt: new Date(),
      reportType: "comprehensive",
      status: "ready",
      kpis: {
        currentTraffic: 2310,
        projectedTraffic: 7850,
        currentLeads: 123,
        projectedLeads: 420,
        currentRevenue: "$19,200",
        projectedRevenue: "$94,000",
        roiProjection: "389%",
        timeToBreakeven: "4.2 months"
      },
      visualAssets: [
        "Traffic Growth Chart",
        "Lead Conversion Funnel",
        "Revenue Projection Model",
        "Competitive Analysis",
        "Technical Architecture Diagram"
      ]
    }
  });

  const kpiMetrics: KPIMetric[] = [
    {
      title: "Monthly Traffic",
      current: reportPreview?.kpis.currentTraffic.toLocaleString() || "0",
      projected: reportPreview?.kpis.projectedTraffic.toLocaleString() || "0",
      improvement: "240%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Lead Generation",
      current: reportPreview?.kpis.currentLeads.toString() || "0",
      projected: reportPreview?.kpis.projectedLeads.toString() || "0", 
      improvement: "242%",
      icon: Target,
      color: "text-green-400"
    },
    {
      title: "Monthly Revenue",
      current: reportPreview?.kpis.currentRevenue || "$0",
      projected: reportPreview?.kpis.projectedRevenue || "$0",
      improvement: "389%",
      icon: DollarSign,
      color: "text-emerald-400"
    },
    {
      title: "ROI Projection",
      current: "100%",
      projected: reportPreview?.kpis.roiProjection || "0%",
      improvement: reportPreview?.kpis.roiProjection || "0%",
      icon: TrendingUp,
      color: "text-purple-400"
    }
  ];

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (data: { websiteUrl: string; reportType: string }) => {
      return await apiRequest("/api/reports/generate", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Report Generated",
        description: "Comprehensive client report with KPIs and visuals ready for download"
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate client report",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Client Report Generator
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Generate comprehensive reports with proprietary KPIs and visual analytics for client deal execution
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Professional Deliverables
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Visual Analytics
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Proprietary KPIs
            </Badge>
          </div>
        </div>

        {/* Kate's Websites Overview */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Kate's Current Websites (Pro Bono Case Study)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {katesWebsites.map((site, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">{site.name}</h3>
                  <p className="text-blue-400 text-sm mb-3">{site.url}</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">{site.traffic.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Monthly Traffic</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{site.leads}</p>
                      <p className="text-gray-400 text-xs">Leads</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{site.revenue}</p>
                      <p className="text-gray-400 text-xs">Revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="kpis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="kpis">KPI Dashboard</TabsTrigger>
            <TabsTrigger value="visuals">Visual Assets</TabsTrigger>
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
            <TabsTrigger value="delivery">Client Delivery</TabsTrigger>
          </TabsList>

          {/* KPI Dashboard Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {kpiMetrics.map((metric, index) => (
                <Card key={index} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Current</p>
                        <p className="text-2xl font-bold text-white">{metric.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Projected</p>
                        <p className="text-2xl font-bold text-white">{metric.projected}</p>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-green-400 font-semibold">+{metric.improvement} Improvement</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Consolidated Projection */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Website Consolidation Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-blue-400 font-semibold mb-2">Traffic Consolidation</h3>
                    <p className="text-3xl font-bold text-white">7,850</p>
                    <p className="text-gray-400 text-sm">Combined monthly visitors</p>
                    <p className="text-blue-400 text-sm mt-1">+240% vs current split</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h3 className="text-green-400 font-semibold mb-2">Lead Optimization</h3>
                    <p className="text-3xl font-bold text-white">420</p>
                    <p className="text-gray-400 text-sm">Monthly qualified leads</p>
                    <p className="text-green-400 text-sm mt-1">+242% conversion rate</p>
                  </div>
                  
                  <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <h3 className="text-emerald-400 font-semibold mb-2">Revenue Growth</h3>
                    <p className="text-3xl font-bold text-white">$94K</p>
                    <p className="text-gray-400 text-sm">Projected monthly revenue</p>
                    <p className="text-emerald-400 text-sm mt-1">+389% increase</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h3 className="text-purple-400 font-medium mb-3">Proprietary DWC Methodology Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">AI-driven lead qualification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Automated workflow optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Real-time performance analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Cross-platform integration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visual Assets Tab */}
          <TabsContent value="visuals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportPreview?.visualAssets.map((asset, index) => (
                <Card key={index} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-blue-400" />
                      {asset}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-700/30 rounded-lg flex items-center justify-center mb-3">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Visual Preview</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-3 w-3 mr-1" />
                        PNG
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Custom Visual Asset Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">Chart Types Available</h3>
                    <div className="space-y-2">
                      {[
                        "Traffic Growth Projections",
                        "Lead Conversion Funnels", 
                        "Revenue Trend Analysis",
                        "Competitive Positioning",
                        "ROI Timeline Charts",
                        "Technical Architecture Diagrams"
                      ].map((chart, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-700/30 rounded">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300 text-sm">{chart}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">Export Formats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="text-left">
                        <FileText className="h-4 w-4 mr-2" />
                        High-res PNG
                      </Button>
                      <Button variant="outline" className="text-left">
                        <FileText className="h-4 w-4 mr-2" />
                        Vector SVG
                      </Button>
                      <Button variant="outline" className="text-left">
                        <FileText className="h-4 w-4 mr-2" />
                        Interactive HTML
                      </Button>
                      <Button variant="outline" className="text-left">
                        <FileText className="h-4 w-4 mr-2" />
                        PowerPoint Ready
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Generate Client Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Client Website URL</label>
                    <Input
                      value={clientWebsite}
                      onChange={(e) => setClientWebsite(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="https://client-website.com"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as any)}
                      className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded text-white"
                    >
                      <option value="executive">Executive Summary</option>
                      <option value="technical">Technical Analysis</option>
                      <option value="roi">ROI Focused</option>
                      <option value="comprehensive">Comprehensive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                    <Award className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Executive</p>
                    <p className="text-gray-400 text-xs">C-suite focused</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                    <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Technical</p>
                    <p className="text-gray-400 text-xs">IT team details</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                    <DollarSign className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white font-medium">ROI</p>
                    <p className="text-gray-400 text-xs">Financial focus</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                    <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Comprehensive</p>
                    <p className="text-gray-400 text-xs">Complete analysis</p>
                  </div>
                </div>

                <Button
                  onClick={() => generateReportMutation.mutate({ 
                    websiteUrl: clientWebsite, 
                    reportType 
                  })}
                  disabled={generateReportMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {generateReportMutation.isPending ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Generate Professional Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-green-400" />
                  Client Delivery Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-blue-400 font-semibold mb-2">Executive Presentation</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• 15-slide PowerPoint deck</p>
                      <p>• Key metrics and projections</p>
                      <p>• Visual KPI dashboard</p>
                      <p>• Implementation timeline</p>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                      <Download className="h-3 w-3 mr-1" />
                      Download PPTX
                    </Button>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h3 className="text-green-400 font-semibold mb-2">Technical Documentation</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• Detailed technical specs</p>
                      <p>• Architecture diagrams</p>
                      <p>• Integration requirements</p>
                      <p>• Security protocols</p>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                      <Download className="h-3 w-3 mr-1" />
                      Download PDF
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h3 className="text-purple-400 font-semibold mb-2">ROI Calculator</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• Interactive Excel model</p>
                      <p>• Customizable parameters</p>
                      <p>• Scenario planning tools</p>
                      <p>• Break-even analysis</p>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                      <Download className="h-3 w-3 mr-1" />
                      Download XLSX
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h3 className="text-yellow-400 font-medium mb-3">White-Label Branding Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">• Remove DWC branding completely</p>
                      <p className="text-gray-300 text-sm">• Add client's company branding</p>
                      <p className="text-gray-300 text-sm">• Custom color schemes</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">• Professional logo placement</p>
                      <p className="text-gray-300 text-sm">• Branded report templates</p>
                      <p className="text-gray-300 text-sm">• Custom executive summary</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Complete Package
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Client Presentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}