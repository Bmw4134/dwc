import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Search, 
  Target, 
  DollarSign, 
  Users, 
  Code, 
  Globe, 
  Smartphone,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ReplitLead {
  id: string;
  companyName: string;
  industry: string;
  website?: string;
  estimatedValue: number;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  techStack: string[];
  painPoints: string[];
  proposalGenerated: boolean;
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  lastActivity: string;
}

interface ProposalTemplate {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  deliverables: string[];
  timeline: string;
}

export default function ReplitLeadGenerator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ReplitLead | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch existing leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/replit-leads'],
    retry: false,
  });

  // Fetch proposal templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/proposal-templates'],
    retry: false,
  });

  // Lead discovery mutation
  const discoverLeadsMutation = useMutation({
    mutationFn: async (query: string) => {
      return await apiRequest('/api/replit-leads/discover', 'POST', { query });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/replit-leads'] });
      setIsSearching(false);
    },
    onError: () => {
      setIsSearching(false);
    }
  });

  // Generate proposal mutation
  const generateProposalMutation = useMutation({
    mutationFn: async ({ leadId, templateId }: { leadId: string; templateId: string }) => {
      return await apiRequest('/api/replit-leads/generate-proposal', 'POST', { leadId, templateId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/replit-leads'] });
    }
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      return await apiRequest(`/api/replit-leads/${leadId}/status`, 'PATCH', { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/replit-leads'] });
    }
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    discoverLeadsMutation.mutate(searchQuery);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'contacted': return 'bg-yellow-600';
      case 'qualified': return 'bg-purple-600';
      case 'proposal': return 'bg-orange-600';
      case 'closed': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const calculateMetrics = () => {
    const total = leads.length;
    const qualified = leads.filter((lead: ReplitLead) => ['qualified', 'proposal', 'closed'].includes(lead.status)).length;
    const totalValue = leads.reduce((sum: number, lead: ReplitLead) => sum + lead.estimatedValue, 0);
    const avgDealSize = total > 0 ? totalValue / total : 0;
    
    return { total, qualified, totalValue, avgDealSize };
  };

  const metrics = calculateMetrics();

  if (leadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading Replit lead generator...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Replit Lead Generator</h1>
          <p className="text-gray-400">Autonomous web development client acquisition</p>
        </div>
        <Badge className="bg-green-600 text-white">
          Live Pipeline: ${metrics.totalValue.toLocaleString()}
        </Badge>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Total Leads</div>
                <div className="text-xl font-bold text-white">{metrics.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Qualified</div>
                <div className="text-xl font-bold text-white">{metrics.qualified}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-sm text-gray-400">Pipeline Value</div>
                <div className="text-xl font-bold text-white">${metrics.totalValue.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">Avg Deal Size</div>
                <div className="text-xl font-bold text-white">${metrics.avgDealSize.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="discover" className="data-[state=active]:bg-slate-700">
            Discover Leads
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-slate-700">
            Lead Pipeline
          </TabsTrigger>
          <TabsTrigger value="proposals" className="data-[state=active]:bg-slate-700">
            Proposals
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-slate-700">
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="w-5 h-5" />
                Lead Discovery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for companies needing web development..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900 p-3 rounded">
                  <div className="text-blue-400 font-medium">Industry Targets</div>
                  <div className="text-gray-300 mt-1">
                    • Startups needing MVPs<br/>
                    • E-commerce platforms<br/>
                    • SaaS companies<br/>
                    • Digital agencies
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                  <div className="text-green-400 font-medium">Service Offerings</div>
                  <div className="text-gray-300 mt-1">
                    • Replit-based development<br/>
                    • Rapid prototyping<br/>
                    • Full-stack applications<br/>
                    • API integrations
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded">
                  <div className="text-purple-400 font-medium">Value Propositions</div>
                  <div className="text-gray-300 mt-1">
                    • 50% faster development<br/>
                    • Real-time collaboration<br/>
                    • Cloud-native hosting<br/>
                    • Cost-effective solutions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4">
            {leads.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-400">No leads discovered yet</div>
                  <div className="text-sm text-gray-500 mt-1">Use the discovery tab to find potential clients</div>
                </CardContent>
              </Card>
            ) : (
              leads.map((lead: ReplitLead) => (
                <Card key={lead.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-white">{lead.companyName}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                            {lead.priority} priority
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-400 mb-2">
                          {lead.industry} • ${lead.estimatedValue.toLocaleString()} estimated value
                        </div>
                        
                        {lead.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {lead.techStack.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {lead.painPoints.length > 0 && (
                          <div className="text-sm text-gray-300 mb-2">
                            <strong>Pain Points:</strong> {lead.painPoints.join(', ')}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Last activity: {lead.lastActivity}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs"
                        >
                          View Details
                        </Button>
                        
                        {!lead.proposalGenerated && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs"
                            onClick={() => generateProposalMutation.mutate({ 
                              leadId: lead.id, 
                              templateId: 'default' 
                            })}
                          >
                            Generate Proposal
                          </Button>
                        )}
                        
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadMutation.mutate({ 
                            leadId: lead.id, 
                            status: e.target.value 
                          })}
                          className="text-xs bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal Sent</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generated Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400">
                Proposals will appear here once generated for leads
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Proposal Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="bg-slate-900 p-4 rounded">
                  <h3 className="font-medium text-white mb-2">Replit Rapid Development</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    Base Price: $5,000 - $15,000
                  </div>
                  <div className="text-sm text-gray-300">
                    • MVP development in 2-4 weeks<br/>
                    • Real-time collaboration setup<br/>
                    • Cloud deployment included<br/>
                    • 30 days of support
                  </div>
                </div>
                
                <div className="bg-slate-900 p-4 rounded">
                  <h3 className="font-medium text-white mb-2">Enterprise Integration</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    Base Price: $15,000 - $50,000
                  </div>
                  <div className="text-sm text-gray-300">
                    • Full-stack application development<br/>
                    • API integrations and databases<br/>
                    • Scalable architecture design<br/>
                    • 90 days of support
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}