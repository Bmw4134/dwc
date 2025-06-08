import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Zap, 
  Search, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  Eye,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import APISetupWizard from '@/components/api-setup-wizard';

interface Lead {
  id: number;
  businessName: string;
  address: string;
  zipCode: string;
  industry: string;
  employeeCount?: number;
  phoneNumber?: string;
  website?: string;
  automationScore: number;
  estimatedSavings: string;
  priority: 'high' | 'medium' | 'low';
  status: 'prospect' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  painPoints?: any;
  googlePlaceId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export default function LeadIntelligenceDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchZipCode, setSearchZipCode] = useState('');
  const [searchIndustry, setSearchIndustry] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Fetch existing leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    refetchInterval: 30000
  });

  // Fetch dashboard statistics
  const { data: stats } = useQuery<{
    totalLeads: number;
    qualifiedLeads: number;
    activeProposals: number;
    totalRevenue: number;
    conversionRate: number;
    avgDealSize: number;
  }>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000
  });

  // Lead scanning mutation
  const scanLeadsMutation = useMutation({
    mutationFn: async ({ zipCode, industry }: { zipCode: string; industry: string }) => {
      const response = await fetch('/api/leads/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipCode, industry })
      });
      if (!response.ok) throw new Error('Failed to scan leads');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Lead Scan Complete",
        description: `Found ${data.leads.length} new potential clients`
      });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Please check your Google Places API key configuration",
        variant: "destructive"
      });
    }
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Lead> }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Lead Updated",
        description: "Lead status updated successfully"
      });
    }
  });

  const handleScanLeads = () => {
    if (!searchZipCode || !searchIndustry) {
      toast({
        title: "Missing Information",
        description: "Please enter both zip code and industry",
        variant: "destructive"
      });
      return;
    }
    scanLeadsMutation.mutate({ zipCode: searchZipCode, industry: searchIndustry });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-gray-500/20 text-gray-400';
      case 'contacted': return 'bg-blue-500/20 text-blue-400';
      case 'qualified': return 'bg-yellow-500/20 text-yellow-400';
      case 'proposal': return 'bg-purple-500/20 text-purple-400';
      case 'won': return 'bg-green-500/20 text-green-400';
      case 'lost': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lead Intelligence Dashboard</h1>
          <p className="text-blue-200">AI-powered lead generation and qualification system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.totalLeads || 0}</p>
              <p className="text-blue-200 text-sm">Total Leads</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats?.qualifiedLeads || 0}</p>
              <p className="text-green-200 text-sm">Qualified Leads</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">${(stats?.totalRevenue || 0).toLocaleString()}</p>
              <p className="text-purple-200 text-sm">Pipeline Value</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{(stats?.conversionRate || 0).toFixed(1)}%</p>
              <p className="text-yellow-200 text-sm">Conversion Rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scanner">Lead Scanner</TabsTrigger>
            <TabsTrigger value="pipeline">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="setup">API Setup</TabsTrigger>
          </TabsList>

          {/* Lead Scanner Tab */}
          <TabsContent value="scanner">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  AI-Powered Lead Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Zip Code (e.g., 10001)"
                    value={searchZipCode}
                    onChange={(e) => setSearchZipCode(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="Industry (e.g., healthcare)"
                    value={searchIndustry}
                    onChange={(e) => setSearchIndustry(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                  <Button 
                    onClick={handleScanLeads}
                    disabled={scanLeadsMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {scanLeadsMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Scan for Leads
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  Uses Google Places API and AI analysis to identify high-potential automation clients
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Pipeline Tab */}
          <TabsContent value="pipeline">
            <div className="space-y-6">
              {leadsLoading ? (
                <Card className="bg-black/40 border-gray-500/30">
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="h-8 w-8 text-blue-400 mx-auto mb-4 animate-spin" />
                    <p className="text-white">Loading leads...</p>
                  </CardContent>
                </Card>
              ) : leads.length === 0 ? (
                <Card className="bg-black/40 border-gray-500/30">
                  <CardContent className="p-8 text-center">
                    <Target className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">No leads found</p>
                    <p className="text-gray-400">Use the Lead Scanner to find potential clients</p>
                  </CardContent>
                </Card>
              ) : (
                leads.map((lead: Lead) => (
                  <Card key={lead.id} className="bg-black/40 border-gray-500/30 hover:border-blue-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-400" />
                          {lead.businessName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(lead.priority)}>
                            {lead.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.toUpperCase()}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            Score: <span className={getScoreColor(lead.automationScore)}>{lead.automationScore}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Industry</p>
                          <p className="text-white">{lead.industry}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Location</p>
                          <p className="text-white flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.zipCode}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Estimated Savings</p>
                          <p className="text-green-400 font-semibold">${lead.estimatedSavings}</p>
                        </div>
                      </div>
                      
                      {lead.phoneNumber && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Phone className="h-4 w-4" />
                          <span>{lead.phoneNumber}</span>
                        </div>
                      )}
                      
                      {lead.website && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Eye className="h-4 w-4" />
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {lead.website}
                          </a>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          onClick={() => updateLeadMutation.mutate({ 
                            id: lead.id, 
                            updates: { status: 'contacted' } 
                          })}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark Contacted
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateLeadMutation.mutate({ 
                            id: lead.id, 
                            updates: { status: 'qualified' } 
                          })}
                          className="border-green-500 text-green-400 hover:bg-green-500/10"
                        >
                          Qualify Lead
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLead(lead)}
                          className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                        >
                          Generate Proposal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Google Places Scan</span>
                      <span className="text-white">75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Inbound Inquiries</span>
                      <span className="text-white">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Referrals</span>
                      <span className="text-white">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Industry Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Healthcare</span>
                      <span className="text-white">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Professional Services</span>
                      <span className="text-white">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Retail</span>
                      <span className="text-white">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Manufacturing</span>
                      <span className="text-white">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Setup Tab */}
          <TabsContent value="setup">
            <APISetupWizard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}