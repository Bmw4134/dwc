import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Target, RefreshCw, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NearbyBusiness {
  googlePlaceId: string;
  businessName: string;
  address: string;
  industry: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  userRatingsTotal: number;
  estimatedValue: number;
  distance: number;
  photoReference?: string;
}

interface ARBusinessOverlayProps {
  className?: string;
}

export function ARBusinessOverlay({ className = "" }: ARBusinessOverlayProps) {
  const [isActive, setIsActive] = useState(false);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<NearbyBusiness[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<NearbyBusiness | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize location and camera services
  const startARMode = async () => {
    try {
      // Get user location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });
      
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      // Start camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsActive(true);
      await scanNearbyBusinesses(position.coords.latitude, position.coords.longitude);
      
      toast({
        title: "AR Mode Active",
        description: "Scanning for nearby business opportunities",
      });

    } catch (error) {
      console.error('AR initialization failed:', error);
      toast({
        title: "AR Setup Failed",
        description: "Enable camera and location permissions",
        variant: "destructive"
      });
    }
  };

  // Stop AR mode and cleanup
  const stopARMode = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
    setNearbyBusinesses([]);
    setSelectedBusiness(null);
  };

  // Scan for nearby businesses
  const scanNearbyBusinesses = async (lat: number, lng: number, radius: number = 1000) => {
    setIsScanning(true);
    
    try {
      const response = await fetch(
        `/api/leads/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.needsSetup) {
          toast({
            title: "Google Places API Required",
            description: "Contact admin to set up Google Places API key for business discovery",
            variant: "destructive"
          });
          return;
        }
        throw new Error(errorData.error || 'Failed to scan businesses');
      }

      const data = await response.json();
      setNearbyBusinesses(data.businesses || []);
      
      toast({
        title: "Business Scan Complete",
        description: `Found ${data.businesses?.length || 0} nearby opportunities`,
      });

    } catch (error) {
      console.error('Business scanning error:', error);
      toast({
        title: "Scan Failed",
        description: "Could not discover nearby businesses",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Refresh scan
  const refreshScan = () => {
    if (userLocation) {
      scanNearbyBusinesses(userLocation.lat, userLocation.lng);
    }
  };

  // Calculate bearing for AR positioning
  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  // Format distance for display
  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // Create lead from selected business
  const createLeadFromBusiness = async (business: NearbyBusiness) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: business.businessName,
          address: business.address,
          industry: business.industry,
          estimatedValue: business.estimatedValue,
          googlePlaceId: business.googlePlaceId,
          coordinates: business.coordinates,
          source: 'ar_discovery',
          priority: business.estimatedValue > 10000 ? 'high' : 'medium',
          status: 'new',
          rating: business.rating,
          userRatingsTotal: business.userRatingsTotal
        })
      });

      if (response.ok) {
        toast({
          title: "Lead Created",
          description: `${business.businessName} added to pipeline`,
        });
        setSelectedBusiness(null);
      }
    } catch (error) {
      console.error('Lead creation failed:', error);
      toast({
        title: "Failed to Create Lead",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          AR Business Scanner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time business discovery with augmented reality overlay
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Controls */}
        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startARMode} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Start AR Scanner
            </Button>
          ) : (
            <>
              <Button onClick={stopARMode} variant="destructive" size="sm">
                Stop AR
              </Button>
              <Button 
                onClick={refreshScan} 
                variant="outline" 
                size="sm"
                disabled={isScanning}
              >
                <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </>
          )}
        </div>

        {/* Location Display */}
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        )}

        {/* AR Camera View */}
        {isActive && (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded border"
              style={{ transform: 'scaleX(-1)' }} // Mirror for front-facing effect
            />
            
            {/* AR Overlay */}
            <div 
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
            >
              {nearbyBusinesses.map((business, index) => {
                if (!userLocation) return null;
                
                const bearing = calculateBearing(
                  userLocation.lat, userLocation.lng,
                  business.coordinates.lat, business.coordinates.lng
                );
                
                // Simple AR positioning based on bearing
                const position = {
                  left: `${((bearing / 360) * 100)}%`,
                  top: `${20 + (index % 3) * 25}%`
                };

                return (
                  <div
                    key={business.googlePlaceId}
                    className="absolute pointer-events-auto"
                    style={position}
                  >
                    <div 
                      className="bg-black/70 text-white p-2 rounded cursor-pointer hover:bg-black/90 transition-colors"
                      onClick={() => setSelectedBusiness(business)}
                    >
                      <div className="text-xs font-semibold truncate max-w-32">
                        {business.businessName}
                      </div>
                      <div className="text-xs text-blue-300">
                        {formatDistance(business.distance)}
                      </div>
                      <div className="text-xs text-green-300">
                        ${(business.estimatedValue / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white/90 p-4 rounded-lg flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Scanning for businesses...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Business List */}
        {nearbyBusinesses.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-sm">
              Nearby Opportunities ({nearbyBusinesses.length})
            </h3>
            {nearbyBusinesses.map((business) => (
              <div
                key={business.googlePlaceId}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedBusiness(business)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{business.businessName}</h4>
                    <p className="text-xs text-muted-foreground">{business.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {business.industry}
                      </Badge>
                      {business.rating > 0 && (
                        <span className="text-xs text-yellow-600">
                          ★ {business.rating} ({business.userRatingsTotal})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ${business.estimatedValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistance(business.distance)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Business Details */}
        {selectedBusiness && (
          <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
            <h3 className="font-semibold text-lg">{selectedBusiness.businessName}</h3>
            <p className="text-sm text-muted-foreground mb-2">{selectedBusiness.address}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="font-medium">Industry:</span> {selectedBusiness.industry}
              </div>
              <div>
                <span className="font-medium">Value:</span> ${selectedBusiness.estimatedValue.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Distance:</span> {formatDistance(selectedBusiness.distance)}
              </div>
              {selectedBusiness.rating > 0 && (
                <div>
                  <span className="font-medium">Rating:</span> ★ {selectedBusiness.rating}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => createLeadFromBusiness(selectedBusiness)}
                size="sm"
                className="flex-1"
              >
                Add to Pipeline
              </Button>
              <Button 
                onClick={() => setSelectedBusiness(null)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}