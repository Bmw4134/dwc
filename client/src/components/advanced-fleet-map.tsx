import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Car, MapPin, Fuel, Clock, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FleetVehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car' | 'motorcycle';
  status: 'active' | 'maintenance' | 'offline';
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  fuel: number;
  route?: string;
  destination?: string;
  driver?: string;
  lastUpdate: string;
}

// Mock fleet data for demonstration
const MOCK_FLEET: FleetVehicle[] = [
  {
    id: 'truck-001',
    name: 'Delivery Truck Alpha',
    type: 'truck',
    status: 'active',
    latitude: 33.7490,
    longitude: -84.3880,
    heading: 45,
    speed: 55,
    fuel: 78,
    route: 'Route A-1',
    destination: 'Atlanta Distribution Center',
    driver: 'John Smith',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'van-002',
    name: 'Service Van Beta',
    type: 'van',
    status: 'active',
    latitude: 33.7530,
    longitude: -84.3850,
    heading: 180,
    speed: 35,
    fuel: 92,
    route: 'Route B-2',
    destination: 'Midtown Service Call',
    driver: 'Sarah Johnson',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'car-003',
    name: 'Supervisor Car',
    type: 'car',
    status: 'active',
    latitude: 33.7450,
    longitude: -84.3900,
    heading: 270,
    speed: 25,
    fuel: 45,
    route: 'Inspection Route',
    destination: 'Site Visit #3',
    driver: 'Mike Wilson',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'truck-004',
    name: 'Heavy Hauler',
    type: 'truck',
    status: 'maintenance',
    latitude: 33.7400,
    longitude: -84.3950,
    heading: 0,
    speed: 0,
    fuel: 25,
    route: undefined,
    destination: 'Maintenance Depot',
    driver: undefined,
    lastUpdate: new Date().toISOString()
  }
];

const ATLANTA_BOUNDS = {
  north: 33.8000,
  south: 33.7000,
  east: -84.3500,
  west: -84.4200
};

export function AdvancedFleetMap({ className }: { className?: string }) {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(MOCK_FLEET);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.7490, lng: -84.3880 });
  const [zoomLevel, setZoomLevel] = useState(100);
  const mapRef = useRef<SVGSVGElement>(null);

  // Convert lat/lng to SVG coordinates
  const coordToSVG = (lat: number, lng: number) => {
    const x = ((lng - ATLANTA_BOUNDS.west) / (ATLANTA_BOUNDS.east - ATLANTA_BOUNDS.west)) * 800;
    const y = ((ATLANTA_BOUNDS.north - lat) / (ATLANTA_BOUNDS.north - ATLANTA_BOUNDS.south)) * 600;
    return { x, y };
  };

  // Get vehicle icon based on type
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return Truck;
      case 'van': return Truck;
      case 'car': return Car;
      case 'motorcycle': return Car;
      default: return Car;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'; // green
      case 'maintenance': return '#F59E0B'; // yellow
      case 'offline': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle.status === 'active') {
          // Simulate movement
          const deltaLat = (Math.random() - 0.5) * 0.001;
          const deltaLng = (Math.random() - 0.5) * 0.001;
          const newHeading = vehicle.heading + (Math.random() - 0.5) * 20;
          const newSpeed = Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10);
          
          return {
            ...vehicle,
            latitude: Math.max(ATLANTA_BOUNDS.south, Math.min(ATLANTA_BOUNDS.north, vehicle.latitude + deltaLat)),
            longitude: Math.max(ATLANTA_BOUNDS.west, Math.min(ATLANTA_BOUNDS.east, vehicle.longitude + deltaLng)),
            heading: ((newHeading % 360) + 360) % 360,
            speed: Math.round(newSpeed),
            lastUpdate: new Date().toISOString()
          };
        }
        return vehicle;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50", className)}>
      <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Navigation className="h-6 w-6" />
          Advanced Fleet Tracking Map
          <Badge variant="secondary" className="bg-white text-green-600">
            {vehicles.filter(v => v.status === 'active').length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[700px]">
          {/* Map Area */}
          <div className="flex-1 relative bg-slate-100">
            <svg
              ref={mapRef}
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              className="absolute inset-0"
            >
              {/* Map Background - Atlanta Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#grid)" />
              
              {/* Major Roads */}
              <g stroke="#9CA3AF" strokeWidth="3" fill="none">
                <line x1="0" y1="300" x2="800" y2="300" opacity="0.7" />
                <line x1="400" y1="0" x2="400" y2="600" opacity="0.7" />
                <line x1="200" y1="0" x2="200" y2="600" opacity="0.5" />
                <line x1="600" y1="0" x2="600" y2="600" opacity="0.5" />
                <line x1="0" y1="150" x2="800" y2="150" opacity="0.5" />
                <line x1="0" y1="450" x2="800" y2="450" opacity="0.5" />
              </g>

              {/* Key Locations */}
              <g>
                <circle cx="400" cy="300" r="8" fill="#3B82F6" />
                <text x="410" y="305" fontSize="12" fill="#3B82F6" fontWeight="bold">Downtown</text>
                
                <circle cx="200" cy="150" r="6" fill="#8B5CF6" />
                <text x="210" y="155" fontSize="10" fill="#8B5CF6">Airport</text>
                
                <circle cx="600" cy="450" r="6" fill="#F59E0B" />
                <text x="610" y="455" fontSize="10" fill="#F59E0B">Depot</text>
              </g>

              {/* Vehicles */}
              {vehicles.map((vehicle) => {
                const { x, y } = coordToSVG(vehicle.latitude, vehicle.longitude);
                const IconComponent = getVehicleIcon(vehicle.type);
                
                return (
                  <g key={vehicle.id}>
                    {/* Vehicle Shadow */}
                    <circle 
                      cx={x + 2} 
                      cy={y + 2} 
                      r="12" 
                      fill="rgba(0,0,0,0.2)" 
                    />
                    
                    {/* Vehicle Background */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="12" 
                      fill="white" 
                      stroke={getStatusColor(vehicle.status)}
                      strokeWidth="3"
                      className="cursor-pointer hover:stroke-4"
                      onClick={() => setSelectedVehicle(vehicle)}
                    />
                    
                    {/* Vehicle Icon */}
                    <foreignObject x={x - 8} y={y - 8} width="16" height="16">
                      <IconComponent 
                        className="w-4 h-4" 
                        style={{ color: getStatusColor(vehicle.status) }}
                      />
                    </foreignObject>
                    
                    {/* Heading Indicator */}
                    {vehicle.status === 'active' && (
                      <line
                        x1={x}
                        y1={y}
                        x2={x + Math.sin(vehicle.heading * Math.PI / 180) * 20}
                        y2={y - Math.cos(vehicle.heading * Math.PI / 180) * 20}
                        stroke={getStatusColor(vehicle.status)}
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    )}
                    
                    {/* Vehicle Label */}
                    <text 
                      x={x} 
                      y={y + 25} 
                      fontSize="10" 
                      textAnchor="middle" 
                      fill="#374151"
                      fontWeight="bold"
                    >
                      {vehicle.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Arrow marker for heading */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#10B981"
                  />
                </marker>
              </defs>
            </svg>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))}
                className="bg-white text-gray-700 border hover:bg-gray-50"
              >
                +
              </Button>
              <Button
                size="sm"
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}
                className="bg-white text-gray-700 border hover:bg-gray-50"
              >
                -
              </Button>
            </div>
          </div>

          {/* Vehicle Details Panel */}
          <div className="w-80 border-l border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Fleet Status</h3>
            </div>
            
            <div className="p-4 space-y-4 max-h-[620px] overflow-y-auto">
              {vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-2",
                    selectedVehicle?.id === vehicle.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200"
                  )}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{vehicle.name}</CardTitle>
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: getStatusColor(vehicle.status) + '20',
                          borderColor: getStatusColor(vehicle.status),
                          color: getStatusColor(vehicle.status)
                        }}
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        <span>{vehicle.speed} mph</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        <span>{vehicle.fuel}%</span>
                      </div>
                    </div>
                    
                    {vehicle.driver && (
                      <div className="text-xs text-gray-600">
                        Driver: {vehicle.driver}
                      </div>
                    )}
                    
                    {vehicle.destination && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{vehicle.destination}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Updated {new Date(vehicle.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}