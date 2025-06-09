import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Clock, Target, TrendingUp, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
  timeWasted: number; // hours per week
  costPerHour: number;
  automationFeasibility: number; // 0-100%
  qnisModules: string[];
}

export function GeolocationLeadMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedLead, setSelectedLead] = useState<GeolocationLead | null>(null);

  // Fort Worth business address coordinates
  const fortWorthCoords = { lat: 32.6593, lon: -97.2894 };

  const { data: nearbyLeads, isLoading } = useQuery({
    queryKey: ['/api/leads/discover-nearby', fortWorthCoords],
    queryFn: () => apiRequest('POST', '/api/leads/discover-nearby', fortWorthCoords)
  });

  useEffect(() => {
    // Use Fort Worth address as default location
    setUserLocation(fortWorthCoords);
    
    // Try to get user's actual location for enhanced accuracy
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using Fort Worth coordinates');
        }
      );
    }
  }, []);

  const getPriorityColor = (potential: number) => {
    if (potential >= 90) return 'bg-red-500';
    if (potential >= 75) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const calculateWeeklyWaste = (processes: ManualProcess[]) => {
    return processes.reduce((total, process) => total + (process.timeWasted * process.costPerHour), 0);
  };

  const calculateAnnualSavings = (processes: ManualProcess[]) => {
    const weeklySavings = calculateWeeklyWaste(processes);
    return weeklySavings * 52; // Annual savings
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-lg">Scanning Fort Worth area for automation opportunities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Status */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <MapPin className="h-5 w-5" />
            Geolocation Lead Discovery
          </CardTitle>
          <CardDescription className="text-slate-300">
            Scanning within 25 miles of 1513 Mahogany Ln, Fort Worth, TX 76140
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{nearbyLeads?.length || 0}</div>
              <div className="text-sm text-slate-400">Leads Discovered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                ${nearbyLeads?.reduce((sum: number, lead: GeolocationLead) => sum + lead.estimatedValue, 0).toLocaleString() || 0}
              </div>
              <div className="text-sm text-slate-400">Total Opportunity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {nearbyLeads?.reduce((sum: number, lead: GeolocationLead) => sum + lead.manualProcesses.length, 0) || 0}
              </div>
              <div className="text-sm text-slate-400">Manual Processes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {Math.round(nearbyLeads?.reduce((sum: number, lead: GeolocationLead) => sum + lead.automationPotential, 0) / (nearbyLeads?.length || 1)) || 0}%
              </div>
              <div className="text-sm text-slate-400">Avg Automation Potential</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nearbyLeads?.map((lead: GeolocationLead) => (
          <Card key={lead.id} className="bg-slate-800/50 border-slate-600 hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{lead.businessName}</CardTitle>
                  <CardDescription className="text-slate-400">{lead.industry}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getPriorityColor(lead.automationPotential)} text-white`}>
                    {lead.automationPotential}% Potential
                  </Badge>
                  <div className="text-sm text-slate-400">{lead.distance.toFixed(1)} miles</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{lead.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="text-lg font-bold text-emerald-400">
                        ${lead.estimatedValue.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">Est. Annual Value</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="text-lg font-bold text-blue-400">
                        {lead.manualProcesses.length}
                      </div>
                      <div className="text-xs text-slate-400">Manual Processes</div>
                    </div>
                  </div>
                </div>

                {lead.contactInfo?.phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{lead.contactInfo.phone}</span>
                  </div>
                )}

                {lead.businessHours && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{lead.businessHours}</span>
                  </div>
                )}

                {selectedLead?.id === lead.id && (
                  <div className="mt-4 space-y-3 border-t border-slate-600 pt-4">
                    <h4 className="font-semibold text-orange-400">Manual Processes Identified:</h4>
                    {lead.manualProcesses.map((process, idx) => (
                      <div key={idx} className="bg-slate-700/50 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-white">{process.processName}</h5>
                          <Badge variant="outline" className="border-orange-400 text-orange-400">
                            {process.automationFeasibility}% Feasible
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-300 space-y-1">
                          <div>⏱️ {process.timeWasted} hours/week wasted</div>
                          <div>💰 ${process.costPerHour}/hour cost</div>
                          <div>📈 Weekly savings: ${(process.timeWasted * process.costPerHour).toLocaleString()}</div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-slate-400 mb-1">QNIS Modules:</div>
                          <div className="flex flex-wrap gap-1">
                            {process.qnisModules.map((module, midx) => (
                              <Badge key={midx} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-emerald-900/30 border border-emerald-600 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                        <h4 className="font-semibold text-emerald-400">ROI Analysis</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-300">Weekly Waste:</div>
                          <div className="text-xl font-bold text-red-400">
                            ${calculateWeeklyWaste(lead.manualProcesses).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-300">Annual Savings:</div>
                          <div className="text-xl font-bold text-emerald-400">
                            ${calculateAnnualSavings(lead.manualProcesses).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                      Generate Automation Proposal
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {nearbyLeads?.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="py-8 text-center">
            <div className="text-slate-400">
              No leads discovered in the current search radius. 
              <br />
              Expanding search parameters...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}