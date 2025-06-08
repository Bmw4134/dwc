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
  Globe, 
  Merge, 
  DollarSign, 
  Server, 
  Users, 
  TrendingUp,
  Settings,
  Download,
  Upload,
  Shield,
  Zap,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

interface WebsiteData {
  id: string;
  url: string;
  businessName: string;
  status: "active" | "analyzing" | "consolidating" | "migrated";
  traffic: number;
  leads: number;
  revenue: string;
  techStack: string[];
  issues: string[];
  consolidationScore: number;
}

interface HostingPlan {
  name: string;
  price: string;
  features: string[];
  recommended: boolean;
  description: string;
}

export default function WebsiteConsolidationPlatform() {
  const [primaryUrl, setPrimaryUrl] = useState("https://katewhitephotography.com");
  const [secondaryUrl, setSecondaryUrl] = useState("https://katephoto.studio");
  const [selectedPlan, setSelectedPlan] = useState<string>("professional");
  const { toast } = useToast();

  // Website data
  const { data: websites = [], refetch: refetchWebsites } = useQuery({
    queryKey: ["/api/website-consolidation/sites"],
    initialData: [
      {
        id: "primary-site",
        url: "https://katewhitephotography.com",
        businessName: "Kate White Photography",
        status: "active",
        traffic: 2840,
        leads: 127,
        revenue: "$18,500",
        techStack: ["WordPress", "Elementor", "WooCommerce"],
        issues: ["Slow loading", "Mobile optimization", "SEO gaps"],
        consolidationScore: 78
      },
      {
        id: "secondary-site", 
        url: "https://katephoto.studio",
        businessName: "Kate Photo Studio",
        status: "active",
        traffic: 1250,
        leads: 43,
        revenue: "$8,200",
        techStack: ["Squarespace", "Custom CSS"],
        issues: ["Limited functionality", "Poor integration", "Duplicate content"],
        consolidationScore: 45
      }
    ]
  });

  const { data: hostingPlans = [] } = useQuery({
    queryKey: ["/api/hosting/plans"],
    initialData: [
      {
        name: "Starter",
        price: "$49/month",
        features: ["Single consolidated site", "Basic analytics", "SSL certificate", "Email support"],
        recommended: false,
        description: "Perfect for simple photography portfolios"
      },
      {
        name: "Professional", 
        price: "$149/month",
        features: ["Multi-domain setup", "Advanced analytics", "Lead automation", "CRM integration", "Priority support", "Monthly optimization"],
        recommended: true,
        description: "Ideal for growing photography businesses"
      },
      {
        name: "Enterprise",
        price: "$349/month", 
        features: ["Unlimited domains", "White-label platform", "API access", "Custom integrations", "Dedicated support", "Revenue sharing options"],
        recommended: false,
        description: "For established studios with multiple locations"
      }
    ]
  });

  // Consolidation mutation
  const consolidationMutation = useMutation({
    mutationFn: async (data: { primaryUrl: string; secondaryUrl: string; plan: string }) => {
      return await apiRequest("/api/website-consolidation/start", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Consolidation Started",
        description: "Website merger and optimization initiated"
      });
      refetchWebsites();
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to start consolidation",
        variant: "destructive"
      });
    }
  });

  // Export/succession mutation
  const exportMutation = useMutation({
    mutationFn: async (data: { websiteId: string; exportType: string }) => {
      return await apiRequest("/api/website-consolidation/export", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Export Package Ready",
        description: "Website export package generated for external hosting"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "analyzing": return "bg-blue-500/20 text-blue-400";
      case "consolidating": return "bg-orange-500/20 text-orange-400";
      case "migrated": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const calculateCombinedMetrics = () => {
    const totalTraffic = websites.reduce((sum, site) => sum + site.traffic, 0);
    const totalLeads = websites.reduce((sum, site) => sum + site.leads, 0);
    const totalRevenue = websites.reduce((sum, site) => {
      return sum + parseFloat(site.revenue.replace(/[$,]/g, ''));
    }, 0);
    
    return {
      traffic: totalTraffic,
      leads: totalLeads,
      revenue: `$${totalRevenue.toLocaleString()}`,
      projectedGrowth: "340%"
    };
  };

  const metrics = calculateCombinedMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Website Consolidation Platform
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Pro Bono Proof-of-Concept:</span> Kate's dual website merger as methodology showcase
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              R&D Project
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Methodology Development
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Scalable Framework
            </Badge>
          </div>
        </div>

        {/* Combined Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Combined Traffic</p>
                  <p className="text-3xl font-bold text-white">{metrics.traffic.toLocaleString()}</p>
                  <p className="text-blue-400 text-sm">Monthly visitors</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Leads</p>
                  <p className="text-3xl font-bold text-white">{metrics.leads}</p>
                  <p className="text-green-400 text-sm">Active inquiries</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Combined Revenue</p>
                  <p className="text-3xl font-bold text-white">{metrics.revenue}</p>
                  <p className="text-emerald-400 text-sm">Monthly total</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Projected Growth</p>
                  <p className="text-3xl font-bold text-white">{metrics.projectedGrowth}</p>
                  <p className="text-purple-400 text-sm">Post-consolidation</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="consolidation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="consolidation">Website Consolidation</TabsTrigger>
            <TabsTrigger value="hosting">Hosting Plans</TabsTrigger>
            <TabsTrigger value="succession">Succession Planning</TabsTrigger>
            <TabsTrigger value="cost-structure">Cost Structure</TabsTrigger>
          </TabsList>

          {/* Consolidation Tab */}
          <TabsContent value="consolidation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {websites.map((website: WebsiteData) => (
                <Card key={website.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {website.businessName}
                      </CardTitle>
                      <Badge className={getStatusColor(website.status)}>
                        {website.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">{website.url}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">{website.traffic.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">Monthly Traffic</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{website.leads}</p>
                        <p className="text-gray-400 text-xs">Leads</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{website.revenue}</p>
                        <p className="text-gray-400 text-xs">Revenue</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Consolidation Score</span>
                        <span className="text-white">{website.consolidationScore}%</span>
                      </div>
                      <Progress value={website.consolidationScore} className="h-2 bg-gray-700" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Tech Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {website.techStack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Issues to Address:</p>
                      <div className="space-y-1">
                        {website.issues.map((issue, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-3 w-3 text-yellow-400" />
                            <span className="text-gray-300">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Consolidation Controls */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Merge className="h-5 w-5 text-purple-400" />
                  Start Website Consolidation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Primary Website (Keep)</label>
                    <Input
                      value={primaryUrl}
                      onChange={(e) => setPrimaryUrl(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Secondary Website (Merge)</label>
                    <Input
                      value={secondaryUrl}
                      onChange={(e) => setSecondaryUrl(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-blue-400 font-medium mb-2">Consolidation Benefits:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Unified brand presence
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Improved SEO ranking
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Reduced maintenance costs
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Enhanced user experience
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => consolidationMutation.mutate({ 
                    primaryUrl, 
                    secondaryUrl, 
                    plan: selectedPlan 
                  })}
                  disabled={consolidationMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {consolidationMutation.isPending ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Merge className="h-4 w-4 mr-2" />
                  )}
                  Start Website Consolidation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hosting Plans Tab */}
          <TabsContent value="hosting" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hostingPlans.map((plan: HostingPlan, index) => (
                <Card 
                  key={index} 
                  className={`bg-gray-800/40 border-gray-700/50 backdrop-blur-sm relative ${
                    plan.recommended ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">RECOMMENDED</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white text-center">
                      {plan.name}
                    </CardTitle>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{plan.price}</p>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                      className={`w-full ${
                        selectedPlan === plan.name.toLowerCase()
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {selectedPlan === plan.name.toLowerCase() ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Succession Planning Tab */}
          <TabsContent value="succession" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-green-400" />
                  Client Succession Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Export Options</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-700/30 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Complete Website Package</h4>
                        <p className="text-gray-400 text-sm mb-3">Full site export with all assets, configurations, and documentation</p>
                        <Button
                          onClick={() => exportMutation.mutate({ websiteId: 'consolidated', exportType: 'complete' })}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Complete Site
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-gray-700/30 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Assets Only</h4>
                        <p className="text-gray-400 text-sm mb-3">Images, videos, and content files for migration</p>
                        <Button
                          onClick={() => exportMutation.mutate({ websiteId: 'consolidated', exportType: 'assets' })}
                          variant="outline"
                          className="border-gray-600"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Assets
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Migration Support</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">90-Day Transition Support</p>
                          <p className="text-gray-400 text-xs">Technical assistance during migration</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <Server className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-white text-sm font-medium">Backup Hosting</p>
                          <p className="text-gray-400 text-xs">6-month backup hosting included</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <Settings className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-white text-sm font-medium">White-Label Option</p>
                          <p className="text-gray-400 text-xs">Remove DWC branding for external use</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h3 className="text-yellow-400 font-medium mb-2">Succession Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Phase 1: Export preparation</span>
                      <span className="text-gray-400">1-2 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Phase 2: Documentation & training</span>
                      <span className="text-gray-400">2-3 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Phase 3: Migration support</span>
                      <span className="text-gray-400">4-12 weeks</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Structure Tab */}
          <TabsContent value="cost-structure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    Internal Hosting Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Server Infrastructure</span>
                      <span className="text-white font-medium">$89/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">CDN & Security</span>
                      <span className="text-white font-medium">$34/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Backup & Monitoring</span>
                      <span className="text-white font-medium">$19/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Support & Maintenance</span>
                      <span className="text-white font-medium">$67/month</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Internal Cost</span>
                      <span className="text-green-400 font-bold text-lg">$209/month</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Cost per client for internal hosting</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Revenue Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="text-blue-400 font-medium mb-2">Professional Plan</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Client pays:</span>
                          <span className="text-white">$149/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Our costs:</span>
                          <span className="text-red-400">-$209/month</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-600 pt-1">
                          <span className="text-white font-medium">Net margin:</span>
                          <span className="text-red-400 font-bold">-$60/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="text-green-400 font-medium mb-2">Recommended Pricing</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Suggested price:</span>
                          <span className="text-white">$299/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Our costs:</span>
                          <span className="text-red-400">-$209/month</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-600 pt-1">
                          <span className="text-white font-medium">Net margin:</span>
                          <span className="text-green-400 font-bold">+$90/month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-medium mb-2">Scale Economics</h4>
                    <div className="space-y-1 text-xs text-gray-300">
                      <p>• 10 clients: $900/month profit</p>
                      <p>• 25 clients: $2,250/month profit</p>
                      <p>• 50 clients: $4,500/month profit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Pricing Strategy Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="text-yellow-400 font-medium mb-2">Value-Based Pricing</h4>
                    <p className="text-gray-300 text-sm">Price based on business value delivered, not just hosting costs</p>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-2">Tiered Services</h4>
                    <p className="text-gray-300 text-sm">Bundle hosting with consulting, maintenance, and growth services</p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-medium mb-2">Performance Bonus</h4>
                    <p className="text-gray-300 text-sm">Revenue sharing model based on client growth metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}