import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, Scan, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessAnalysis {
  businessName: string;
  address: string;
  industry: string;
  phoneNumber?: string;
  estimatedValue: number;
  confidence: number;
  extractedText: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface PhotoLeadGeneratorProps {
  className?: string;
}

export function PhotoLeadGenerator({ className = "" }: PhotoLeadGeneratorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize location services
  const enableLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });
      
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setLocationEnabled(true);
      
      toast({
        title: "Location Services Enabled",
        description: "Now tracking nearby business opportunities",
      });
    } catch (error) {
      console.error('Location access denied:', error);
      toast({
        title: "Location Access Required",
        description: "Enable location services for nearby lead mapping",
        variant: "destructive"
      });
    }
  };

  // Start camera capture
  const startCamera = async () => {
    try {
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
    } catch (error) {
      console.error('Camera access denied:', error);
      toast({
        title: "Camera Access Required",
        description: "Enable camera permissions for photo lead generation",
        variant: "destructive"
      });
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Process the captured image
        processImage(imageData);
      }
    }
  };

  // Process uploaded or captured image
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Remove data URL prefix for base64 data
      const base64Data = imageData.split(',')[1];
      
      const response = await fetch('/api/leads/analyze-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
          location: userLocation
        })
      });

      if (!response.ok) {
        throw new Error('Image analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
      
      toast({
        title: "Business Analysis Complete",
        description: `Found: ${result.businessName} - ${result.confidence}% confidence`,
      });
      
    } catch (error) {
      console.error('Image processing error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create lead from analysis
  const createLead = async () => {
    if (!analysis) return;
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: analysis.businessName,
          address: analysis.address,
          industry: analysis.industry,
          phoneNumber: analysis.phoneNumber,
          estimatedValue: analysis.estimatedValue,
          source: 'photo_capture',
          coordinates: analysis.coordinates,
          priority: analysis.confidence > 0.8 ? 'high' : 'medium',
          status: 'new'
        })
      });

      if (response.ok) {
        toast({
          title: "Lead Created",
          description: `${analysis.businessName} added to pipeline`,
        });
        
        // Reset for next capture
        setAnalysis(null);
        setCapturedImage(null);
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
          <Camera className="h-5 w-5" />
          Photo Lead Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Capture business photos for instant lead analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Location Services */}
        <div className="flex items-center gap-2">
          <Button
            onClick={enableLocation}
            variant={locationEnabled ? "secondary" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {locationEnabled ? "Location Active" : "Enable Location"}
          </Button>
          {userLocation && (
            <span className="text-xs text-muted-foreground">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          )}
        </div>

        {/* Camera Controls */}
        <div className="flex gap-2">
          <Button onClick={startCamera} variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Start Camera
          </Button>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline" 
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Camera Preview */}
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full max-h-64 object-cover rounded border"
            style={{ display: videoRef.current?.srcObject ? 'block' : 'none' }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {videoRef.current?.srcObject && (
            <Button
              onClick={capturePhoto}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
              size="sm"
            >
              <Scan className="h-4 w-4 mr-2" />
              Capture & Analyze
            </Button>
          )}
        </div>

        {/* Captured Image */}
        {capturedImage && (
          <div className="space-y-2">
            <img 
              src={capturedImage} 
              alt="Captured business" 
              className="w-full max-h-48 object-cover rounded border"
            />
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Analyzing business information...</span>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-lg">{analysis.businessName}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Industry:</span> {analysis.industry}
              </div>
              <div>
                <span className="font-medium">Value:</span> ${analysis.estimatedValue.toLocaleString()}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Address:</span> {analysis.address}
              </div>
              {analysis.phoneNumber && (
                <div className="col-span-2">
                  <span className="font-medium">Phone:</span> {analysis.phoneNumber}
                </div>
              )}
              <div className="col-span-2">
                <span className="font-medium">Confidence:</span> {analysis.confidence}%
              </div>
            </div>
            
            <Button onClick={createLead} className="w-full">
              Add to Lead Pipeline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}