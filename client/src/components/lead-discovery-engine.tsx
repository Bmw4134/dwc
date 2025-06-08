import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, MapPin, TrendingUp, Target, Zap, Building, DollarSign, Users, Phone, Mail, Globe } from 'lucide-react';

interface GeneratedLead {
  businessName: string;
  industry: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    zipCode: string;
    businessDensity: number;
  };
  estimatedValue: number;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  automationPotential: number;
  contactInfo: {
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  aiInsights: string[];
  competitorAnalysis: {
    hasAutomation: boolean;
    techStack: string[];
    opportunities: string[];
  };
  marketData: {
    industryGrowth: number;
    localDemand: number;
    seasonality: string;
  };
}

interface LeadGenerationResponse {
  success: boolean;
  data: {
    leads: GeneratedLead[];
    totalValue: number;
    averageConfidence: number;
    coverage: {
      radius: string;
      location: { latitude: number; longitude: number };
      marketDensity: string;
    };
  };
}

const LeadDiscoveryEngine: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    latitude: 32.7767,
    longitude: -96.7970,
    count: 20,
    industry: '',
    minValue: 10000,
    maxValue: 500000,
    radius: 50
  });
  
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<GeneratedLead | null>(null);
  const [discoveryMode, setDiscoveryMode] = useState<'generate' | 'search' | 'intelligence'>('generate');
  
  const queryClient = useQueryClient();

  // Lead generation mutation
  const generateLeadsMutation = useMutation({
    mutationFn: async (params: any) => {
      const response = await apiRequest('POST', '/api/leads/generate', params);
      return response.json() as Promise<LeadGenerationResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedLeads(data.data.leads);
        console.log(`Generated ${data.data.leads.length} leads with $${data.data.totalValue.toLocaleString()} total pipeline value`);
      }
    },
    onError: (error) => {
      console.error('Lead generation failed:', error);
    }
  });

  // Advanced search mutation
  const searchLeadsMutation = useMutation({
    mutationFn: async (params: any) => {
      const response = await apiRequest('POST', '/api/leads/search', params);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedLeads(data.data.leads);
      }
    }
  });

  // Market intelligence query
  const { data: marketIntelligence } = useQuery({
    queryKey: ['/api/market/intelligence', searchParams.industry || 'Professional Services', 'Dallas'],
    enabled: discoveryMode === 'intelligence'
  });

  const handleGenerateLeads = () => {
    generateLeadsMutation.mutate({
      latitude: searchParams.latitude,
      longitude: searchParams.longitude,
      count: searchParams.count
    });
  };

  const handleAdvancedSearch = () => {
    searchLeadsMutation.mutate({
      industry: searchParams.industry,
      minValue: searchParams.minValue,
      maxValue: searchParams.maxValue,
      radius: searchParams.radius,
      location: { lat: searchParams.latitude, lng: searchParams.longitude }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Zap className="h-6 w-6 text-yellow-400" />
            Lead Discovery Engine - Unlimited Business Opportunities
          </CardTitle>
          <p className="text-blue-200">Generate endless qualified leads using location intelligence and AI-powered market analysis</p>
        </CardHeader>
      </Card>

      {/* Discovery Controls - Mobile Optimized */}
      <Tabs value={discoveryMode} onValueChange={(value) => setDiscoveryMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700 h-auto">
          <TabsTrigger value="generate" className="text-white data-[state=active]:bg-blue-600 p-3 flex-col gap-1">
            <Target className="h-5 w-5" />
            <span className="text-xs hidden sm:block">Generate</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="text-white data-[state=active]:bg-purple-600 p-3 flex-col gap-1">
            <Search className="h-5 w-5" />
            <span className="text-xs hidden sm:block">Search</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="text-white data-[state=active]:bg-green-600 p-3 flex-col gap-1">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs hidden sm:block">Intelligence</span>
          </TabsTrigger>
        </TabsList>

        {/* Lead Generation Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Location-Based Lead Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <label className="text-sm text-gray-300 mb-2 block">Location (Dallas Area)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.0001"
                      value={searchParams.latitude}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                      className="bg-gray-800 border-gray-600 text-white text-sm"
                      placeholder="Latitude"
                    />
                    <Input
                      type="number"
                      step="0.0001"
                      value={searchParams.longitude}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                      className="bg-gray-800 border-gray-600 text-white text-sm"
                      placeholder="Longitude"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Lead Count</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={searchParams.count}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Quick Generate</label>
                  <Button 
                    onClick={handleGenerateLeads}
                    disabled={generateLeadsMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-10"
                    size="sm"
                  >
                    {generateLeadsMutation.isPending ? 'Generating...' : 'Generate Now'}
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">AI-Powered Lead Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Industry Filter</label>
                  <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="">All Industries</SelectItem>
                      <SelectItem value="Photography Services">Photography Services</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Professional Services">Professional Services</SelectItem>
                      <SelectItem value="Technology Services">Technology Services</SelectItem>
                      <SelectItem value="Restaurants">Restaurants & Food Service</SelectItem>
                      <SelectItem value="Retail">Retail Stores</SelectItem>
                      <SelectItem value="Healthcare">Healthcare Practices</SelectItem>
                      <SelectItem value="Auto Services">Auto Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Search Radius (miles)</label>
                  <Input
                    type="number"
                    value={searchParams.radius}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Min Deal Value</label>
                  <Input
                    type="number"
                    value={searchParams.minValue}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, minValue: parseInt(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Max Deal Value</label>
                  <Input
                    type="number"
                    value={searchParams.maxValue}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, maxValue: parseInt(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAdvancedSearch}
                disabled={searchLeadsMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {searchLeadsMutation.isPending ? 'Searching...' : 'Search Qualified Leads'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              {marketIntelligence?.success && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400 text-sm">Market Size</div>
                      <div className="text-green-300 text-xl font-bold">
                        ${(marketIntelligence.data.marketSize / 1000000).toFixed(0)}M
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400 text-sm">Growth Rate</div>
                      <div className="text-blue-300 text-xl font-bold">
                        {marketIntelligence.data.growthRate}%
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400 text-sm">Competitors</div>
                      <div className="text-orange-300 text-xl font-bold">
                        {marketIntelligence.data.competitorCount}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400 text-sm">Automation Adoption</div>
                      <div className="text-purple-300 text-xl font-bold">
                        {marketIntelligence.data.automationAdoption}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Market Opportunities</h4>
                      <div className="space-y-2">
                        {marketIntelligence.data.opportunities.map((opportunity: string, idx: number) => (
                          <div key={idx} className="text-sm text-gray-300 bg-gray-800/30 p-2 rounded">
                            {opportunity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Recommendations</h4>
                      <div className="space-y-2">
                        {marketIntelligence.data.recommendations.map((rec: string, idx: number) => (
                          <div key={idx} className="text-sm text-gray-300 bg-gray-800/30 p-2 rounded">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generated Leads Display */}
      {generatedLeads.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-400" />
                  Generated Leads ({generatedLeads.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {generatedLeads.map((lead, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedLead === lead 
                        ? 'bg-blue-600/20 border border-blue-500' 
                        : 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700'
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{lead.businessName}</h4>
                      <Badge className={getPriorityColor(lead.priority)}>
                        {lead.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{lead.industry}</span>
                      <span className="text-green-400 font-medium">{formatCurrency(lead.estimatedValue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-gray-400">{lead.location.city}, {lead.location.state}</span>
                      <span className="text-blue-400">{lead.confidence}% confidence</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Lead Details */}
          <div className="space-y-4">
            {selectedLead ? (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{selectedLead.businessName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedLead.priority)}>
                      {selectedLead.priority}
                    </Badge>
                    <Badge variant="outline" className="text-gray-300">
                      {selectedLead.industry}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Value & Confidence */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400 text-sm">Estimated Value</div>
                      <div className="text-green-400 text-lg font-bold">
                        {formatCurrency(selectedLead.estimatedValue)}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded">
                      <div className="text-gray-400 text-sm">Confidence</div>
                      <div className="text-blue-400 text-lg font-bold">
                        {selectedLead.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h5 className="text-white font-medium mb-2">Contact Information</h5>
                    <div className="space-y-2 text-sm">
                      {selectedLead.contactInfo.website && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Globe className="h-4 w-4" />
                          {selectedLead.contactInfo.website}
                        </div>
                      )}
                      {selectedLead.contactInfo.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="h-4 w-4" />
                          {selectedLead.contactInfo.phone}
                        </div>
                      )}
                      {selectedLead.contactInfo.address && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="h-4 w-4" />
                          {selectedLead.contactInfo.address}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h5 className="text-white font-medium mb-2">AI Insights</h5>
                    <div className="space-y-2">
                      {selectedLead.aiInsights.slice(0, 3).map((insight, idx) => (
                        <div key={idx} className="text-xs text-gray-400 bg-gray-800/30 p-2 rounded">
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Market Data */}
                  <div>
                    <h5 className="text-white font-medium mb-2">Market Analysis</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-800/30 p-2 rounded">
                        <div className="text-gray-400">Industry Growth</div>
                        <div className="text-green-400 font-medium">{selectedLead.marketData.industryGrowth}%</div>
                      </div>
                      <div className="bg-gray-800/30 p-2 rounded">
                        <div className="text-gray-400">Local Demand</div>
                        <div className="text-blue-400 font-medium">{selectedLead.marketData.localDemand}/100</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Lead
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-2">Select a lead to view details</div>
                  <Users className="h-8 w-8 text-gray-500 mx-auto" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDiscoveryEngine;