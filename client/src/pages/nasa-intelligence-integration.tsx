import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Satellite, 
  Globe, 
  Eye, 
  Camera, 
  Zap, 
  TrendingUp,
  Calendar,
  MapPin,
  RefreshCw,
  Download,
  Search,
  Star,
  Sun,
  Moon
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface NASAImageData {
  url: string;
  hdurl?: string;
  title: string;
  explanation: string;
  date: string;
  media_type: string;
  copyright?: string;
}

interface NEOData {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
  is_potentially_hazardous_asteroid: boolean;
}

interface EarthImagery {
  url: string;
  date: string;
  id: string;
  caption?: string;
}

export default function NASAIntelligenceIntegration() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [earthImageDim, setEarthImageDim] = useState('0.12');

  // Astronomy Picture of the Day
  const { data: apodData, isLoading: apodLoading, refetch: refetchAPOD } = useQuery<NASAImageData>({
    queryKey: ['/api/nasa/apod', selectedDate],
    enabled: false
  });

  // Near Earth Objects
  const { data: neoData, isLoading: neoLoading, refetch: refetchNEO } = useQuery<{
    element_count: number;
    near_earth_objects: { [key: string]: NEOData[] };
  }>({
    queryKey: ['/api/nasa/neo', selectedDate],
    enabled: false
  });

  // Earth Imagery
  const { data: earthData, isLoading: earthLoading, refetch: refetchEarth } = useQuery<EarthImagery>({
    queryKey: ['/api/nasa/earth', latitude, longitude, earthImageDim, selectedDate],
    enabled: false
  });

  // Fetch APOD mutation
  const fetchAPODMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nasa/apod?date=${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch APOD data');
      return response.json();
    },
    onSuccess: () => {
      refetchAPOD();
      toast({
        title: "NASA Data Retrieved",
        description: "Astronomy Picture of the Day loaded successfully"
      });
    },
    onError: () => {
      toast({
        title: "NASA API Error", 
        description: "Please provide your NASA API key to access astronomical data",
        variant: "destructive"
      });
    }
  });

  // Fetch NEO mutation
  const fetchNEOMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nasa/neo?date=${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch NEO data');
      return response.json();
    },
    onSuccess: () => {
      refetchNEO();
      toast({
        title: "Near Earth Objects",
        description: "Asteroid tracking data updated"
      });
    },
    onError: () => {
      toast({
        title: "NASA API Error",
        description: "Please provide your NASA API key to access NEO data",
        variant: "destructive"
      });
    }
  });

  // Fetch Earth Imagery mutation
  const fetchEarthMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nasa/earth?lat=${latitude}&lon=${longitude}&dim=${earthImageDim}&date=${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch Earth imagery');
      return response.json();
    },
    onSuccess: () => {
      refetchEarth();
      toast({
        title: "Earth Imagery",
        description: "Satellite imagery retrieved successfully"
      });
    },
    onError: () => {
      toast({
        title: "NASA API Error",
        description: "Please provide your NASA API key to access Earth imagery",
        variant: "destructive"
      });
    }
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const getHazardLevel = (isHazardous: boolean, missDistance: string) => {
    const distance = parseFloat(missDistance);
    if (isHazardous && distance < 1000000) return { level: 'High', color: 'bg-red-500/20 text-red-400' };
    if (isHazardous) return { level: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' };
    return { level: 'Low', color: 'bg-green-500/20 text-green-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NASA Intelligence Integration</h1>
          <p className="text-blue-200">Advanced space data analytics for enterprise intelligence enhancement</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
              <Satellite className="h-4 w-4 mr-2" />
              Earth Observation
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Astronomical Data
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Near Earth Objects
            </Badge>
          </div>
        </div>

        {/* Date and Location Controls */}
        <Card className="bg-black/40 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Data Collection Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Latitude</label>
                <Input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="40.7128"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Longitude</label>
                <Input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="-74.0060"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Image Dimension</label>
                <Input
                  value={earthImageDim}
                  onChange={(e) => setEarthImageDim(e.target.value)}
                  placeholder="0.12"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="apod" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apod">Astronomy Picture</TabsTrigger>
            <TabsTrigger value="neo">Near Earth Objects</TabsTrigger>
            <TabsTrigger value="earth">Earth Imagery</TabsTrigger>
          </TabsList>

          {/* Astronomy Picture of the Day */}
          <TabsContent value="apod">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Astronomy Picture of the Day</CardTitle>
                    <CardDescription className="text-gray-400">
                      Daily astronomical imagery with scientific explanations
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => fetchAPODMutation.mutate()}
                    disabled={fetchAPODMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {fetchAPODMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Load APOD
                  </Button>
                </div>
              </CardHeader>
              
              {apodData && (
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      {apodData.media_type === 'image' ? (
                        <img 
                          src={apodData.url} 
                          alt={apodData.title}
                          className="w-full rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="bg-gray-800 rounded-lg p-8 text-center">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">Video content available</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => window.open(apodData.url, '_blank')}
                          >
                            View Video
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{apodData.title}</h3>
                        <Badge className="bg-blue-500/20 text-blue-400 mb-4">
                          <Calendar className="h-3 w-3 mr-1" />
                          {apodData.date}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed">{apodData.explanation}</p>
                      
                      {apodData.copyright && (
                        <p className="text-sm text-gray-500">© {apodData.copyright}</p>
                      )}
                      
                      <div className="flex gap-2">
                        {apodData.hdurl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(apodData.hdurl, '_blank')}
                            className="border-green-500 text-green-400 hover:bg-green-500/10"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            HD Version
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Near Earth Objects */}
          <TabsContent value="neo">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Near Earth Objects</CardTitle>
                    <CardDescription className="text-gray-400">
                      Asteroid tracking and potential impact assessment
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => fetchNEOMutation.mutate()}
                    disabled={fetchNEOMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {fetchNEOMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Scan NEOs
                  </Button>
                </div>
              </CardHeader>
              
              {neoData && (
                <CardContent>
                  <div className="mb-6">
                    <Badge className="bg-purple-500/20 text-purple-400 text-lg px-4 py-2">
                      {neoData.element_count} Objects Detected
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(neoData.near_earth_objects).map(([date, objects]) => (
                      <div key={date}>
                        <h4 className="text-white font-semibold mb-3">{date}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {objects.slice(0, 4).map((neo) => {
                            const approach = neo.close_approach_data[0];
                            const hazard = getHazardLevel(
                              neo.is_potentially_hazardous_asteroid, 
                              approach.miss_distance.kilometers
                            );
                            
                            return (
                              <Card key={neo.id} className="bg-gray-800/50 border-gray-600">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-white font-medium text-sm truncate">
                                      {neo.name}
                                    </h5>
                                    <Badge className={hazard.color}>
                                      {hazard.level}
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Diameter:</span>
                                      <span className="text-white">
                                        {formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_min)} - 
                                        {formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_max)} km
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Velocity:</span>
                                      <span className="text-white">
                                        {formatNumber(parseFloat(approach.relative_velocity.kilometers_per_hour))} km/h
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Miss Distance:</span>
                                      <span className="text-white">
                                        {formatNumber(parseFloat(approach.miss_distance.kilometers))} km
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Earth Imagery */}
          <TabsContent value="earth">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Earth Imagery</CardTitle>
                    <CardDescription className="text-gray-400">
                      Satellite imagery for location intelligence and market analysis
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => fetchEarthMutation.mutate()}
                    disabled={fetchEarthMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {fetchEarthMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Satellite className="h-4 w-4 mr-2" />
                    )}
                    Capture Image
                  </Button>
                </div>
              </CardHeader>
              
              {earthData && (
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src={earthData.url} 
                        alt="Earth Satellite Imagery"
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Location Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="text-gray-300">
                              {latitude}°, {longitude}°
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">{earthData.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-4">
                        <h4 className="text-white font-semibold mb-2">Business Intelligence Applications</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Market density analysis</li>
                          <li>• Competitor location mapping</li>
                          <li>• Infrastructure development tracking</li>
                          <li>• Environmental impact assessment</li>
                          <li>• Supply chain optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}