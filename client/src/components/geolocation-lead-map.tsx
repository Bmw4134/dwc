import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Zap, Clock, Phone, Globe } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface GeolocationLead {
  id: string;
  businessName: string;
  address: string;
  latitude: number;
  longitude: number;
  industry: string;
  manualProcesses: ManualProcess[];
  automationPotential: number;
  estimatedValue: number;
  distance: number;
  contactInfo?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  businessHours?: string;
  lastUpdated: Date;
}

interface ManualProcess {
  processName: string;
  timeWasted: number;
  costPerHour: number;
  automationFeasibility: number;
  qnisModules: string[];
}

interface LeadDiscoveryData {
  consultantLocation: { latitude: number; longitude: number };
  searchRadius: number;
  leadsFound: number;
  leads: GeolocationLead[];
  totalEstimatedValue: number;
}

export function GeolocationLeadMap() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLead, setSelectedLead] = useState<GeolocationLead | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>('pending');

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.log('Location access denied or failed:', error);
          setLocationPermission('denied');
          // Default to Austin, TX area for demo
          setCurrentLocation({ lat: 30.2672, lon: -97.7431 });
        }
      );
    }
  }, []);

  // Discover nearby leads
  const discoverLeadsMutation = useMutation({
    mutationFn: async (location: { lat: number; lon: number }) => {
      const response = await apiRequest('POST', '/api/leads/discover-nearby', {
        latitude: location.lat,
        longitude: location.lon,
        radius: 50
      });
      return response.json();
    }
  });

  const { data: leadDetails } = useQuery({
    queryKey: ['/api/leads/details', selectedLead?.id],
    enabled: !!selectedLead?.id
  });

  // Trigger lead discovery when location is available
  useEffect(() => {
    if (currentLocation && !discoverLeadsMutation.data) {
      discoverLeadsMutation.mutate(currentLocation);
    }
  }, [currentLocation]);

  const discoveryData: LeadDiscoveryData | null = discoverLeadsMutation.data?.data || null;

  const getPriorityColor = (automationPotential: number, estimatedValue: number) => {
    const score = (automationPotential * 0.4) + (Math.min(estimatedValue / 100000, 10) * 0.6);
    if (score >= 8) return 'bg-red-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            QNIS Lead Discovery Map
          </CardTitle>
          <CardDescription>
            Real-time geolocation-based business automation opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location Status */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Location Status</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      locationPermission === 'granted' ? 'bg-green-500' : 
                      locationPermission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm">
                      {locationPermission === 'granted' ? 'Location Active' :
                       locationPermission === 'denied' ? 'Using Default Location' : 'Getting Location...'}
                    </span>
                  </div>
                  {currentLocation && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}
                    </p>
                  )}
                </div>

                {discoveryData && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Discovery Results</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-muted p-2 rounded">
                          <div className="text-lg font-bold">{discoveryData.leadsFound}</div>
                          <div className="text-xs text-muted-foreground">Leads Found</div>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <div className="text-lg font-bold">{formatCurrency(discoveryData.totalEstimatedValue)}</div>
                          <div className="text-xs text-muted-foreground">Total Value</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentLocation && (
                  <Button 
                    onClick={() => discoverLeadsMutation.mutate(currentLocation)}
                    disabled={discoverLeadsMutation.isPending}
                    className="w-full"
                  >
                    {discoverLeadsMutation.isPending ? 'Scanning...' : 'Refresh Lead Scan'}
                  </Button>
                )}
              </div>
            </div>

            {/* Lead List */}
            <div className="lg:col-span-2">
              {discoveryData?.leads ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Nearby Business Opportunities</h3>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {discoveryData.leads.map((lead) => (
                      <Card 
                        key={lead.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedLead?.id === lead.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{lead.businessName}</h4>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(lead.automationPotential, lead.estimatedValue)}`} />
                              </div>
                              <p className="text-sm text-muted-foreground">{lead.address}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">{lead.industry}</Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {lead.distance}mi
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{formatCurrency(lead.estimatedValue)}</div>
                              <div className="text-xs text-muted-foreground">{lead.automationPotential}% automation</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  {discoverLeadsMutation.isPending ? 'Discovering leads...' : 'No leads data available'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details */}
      {selectedLead && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedLead.businessName} - Automation Analysis</span>
              <Badge className={getPriorityColor(selectedLead.automationPotential, selectedLead.estimatedValue) + ' text-white'}>
                HIGH PRIORITY
              </Badge>
            </CardTitle>
            <CardDescription>{selectedLead.address} • {selectedLead.industry}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Business Information</h3>
                  <div className="space-y-2">
                    {selectedLead.contactInfo?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedLead.contactInfo.phone}</span>
                      </div>
                    )}
                    {selectedLead.contactInfo?.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedLead.contactInfo.website}</span>
                      </div>
                    )}
                    {selectedLead.businessHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedLead.businessHours}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Opportunity Metrics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-3 rounded">
                      <div className="text-xl font-bold text-green-600">{formatCurrency(selectedLead.estimatedValue)}</div>
                      <div className="text-xs text-muted-foreground">Est. Contract Value</div>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <div className="text-xl font-bold">{selectedLead.automationPotential}%</div>
                      <div className="text-xs text-muted-foreground">Automation Potential</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Processes */}
              <div>
                <h3 className="text-sm font-medium mb-2">Manual Processes Identified</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedLead.manualProcesses.map((process, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{process.processName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {process.timeWasted}h/week
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              ${process.costPerHour}/hr
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-red-600">
                            ${(process.timeWasted * process.costPerHour * 52).toLocaleString()}/year
                          </div>
                          <div className="text-xs text-green-600">{process.automationFeasibility}% feasible</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {leadDetails?.data && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Projected ROI</h3>
                    <p className="text-sm text-muted-foreground">Based on QNIS/PTNI automation implementation</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {leadDetails.data.projectedROI.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Return on Investment</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}