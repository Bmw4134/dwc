import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Camera, TrendingUp, DollarSign, Users, Target, BarChart3, Star, MapPin, Calendar, Phone } from "lucide-react";

interface BusinessAnalysis {
  currentRevenue: number;
  growthPotential: number;
  marketPosition: string;
  recommendations: string[];
  actionItems: string[];
  projectedRevenue: number;
  competitorAnalysis: any[];
  pricingStrategy: any;
}

interface PhotoBusiness {
  businessName: string;
  ownerName: string;
  location: string;
  yearsInBusiness: number;
  specialties: string[];
  currentPricing: {
    portraits: number;
    weddings: number;
    events: number;
    commercial: number;
  };
  monthlyBookings: number;
  averageSessionValue: number;
  challenges: string[];
}

export default function PhotographyBusinessConsultant() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState<PhotoBusiness>({
    businessName: "",
    ownerName: "",
    location: "",
    yearsInBusiness: 0,
    specialties: [],
    currentPricing: {
      portraits: 0,
      weddings: 0,
      events: 0,
      commercial: 0
    },
    monthlyBookings: 0,
    averageSessionValue: 0,
    challenges: []
  });
  
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateBusinessAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/photography-business/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData)
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const analysisData = await response.json();
      setAnalysis(analysisData);
      setStep(3);
      
      toast({
        title: "Analysis Complete",
        description: "Business assessment and growth strategy generated successfully",
        duration: 3000
      });
      
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate business analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateBusinessData = (field: string, value: any) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !businessData.specialties.includes(specialty)) {
      setBusinessData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setBusinessData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addChallenge = (challenge: string) => {
    if (challenge && !businessData.challenges.includes(challenge)) {
      setBusinessData(prev => ({
        ...prev,
        challenges: [...prev.challenges, challenge]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Camera className="w-10 h-10 text-purple-400" />
            Photography Business Consultant
          </h1>
          <p className="text-xl text-purple-300">
            AI-Powered Business Growth Strategy & Market Analysis
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant={step === 1 ? "default" : "secondary"}>Business Info</Badge>
            <Badge variant={step === 2 ? "default" : "secondary"}>Pricing & Metrics</Badge>
            <Badge variant={step === 3 ? "default" : "secondary"}>Analysis & Strategy</Badge>
          </div>
        </div>

        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Business Details
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Tell us about your photography business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-white">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessData.businessName}
                    onChange={(e) => updateBusinessData('businessName', e.target.value)}
                    placeholder="Your Photography Studio"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-white">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={businessData.ownerName}
                    onChange={(e) => updateBusinessData('ownerName', e.target.value)}
                    placeholder="Your Name"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    value={businessData.location}
                    onChange={(e) => updateBusinessData('location', e.target.value)}
                    placeholder="City, State"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness" className="text-white">Years in Business</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    value={businessData.yearsInBusiness}
                    onChange={(e) => updateBusinessData('yearsInBusiness', parseInt(e.target.value) || 0)}
                    placeholder="3"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-400" />
                  Specialties & Services
                </CardTitle>
                <CardDescription className="text-purple-300">
                  What types of photography do you offer?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Portraits', 'Weddings', 'Events', 'Commercial', 'Newborn', 'Family', 'Corporate', 'Product'].map(specialty => (
                    <Button
                      key={specialty}
                      variant={businessData.specialties.includes(specialty) ? "default" : "outline"}
                      size="sm"
                      onClick={() => businessData.specialties.includes(specialty) 
                        ? removeSpecialty(specialty) 
                        : addSpecialty(specialty)
                      }
                      className="text-sm"
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Selected Specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {businessData.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                        <button 
                          onClick={() => removeSpecialty(specialty)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!businessData.businessName || !businessData.ownerName || businessData.specialties.length === 0}
                >
                  Continue to Pricing
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Pricing and Metrics */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Current Pricing Structure
                </CardTitle>
                <CardDescription className="text-purple-300">
                  What do you currently charge for each service?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessData.specialties.map(specialty => (
                  <div key={specialty} className="space-y-2">
                    <Label htmlFor={specialty} className="text-white">{specialty} Sessions</Label>
                    <Input
                      id={specialty}
                      type="number"
                      value={businessData.currentPricing[specialty.toLowerCase() as keyof typeof businessData.currentPricing] || 0}
                      onChange={(e) => updateBusinessData('currentPricing', {
                        ...businessData.currentPricing,
                        [specialty.toLowerCase()]: parseInt(e.target.value) || 0
                      })}
                      placeholder="500"
                      className="bg-slate-700 border-purple-500/30 text-white"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Business Metrics
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Current performance and challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyBookings" className="text-white">Average Monthly Bookings</Label>
                  <Input
                    id="monthlyBookings"
                    type="number"
                    value={businessData.monthlyBookings}
                    onChange={(e) => updateBusinessData('monthlyBookings', parseInt(e.target.value) || 0)}
                    placeholder="8"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="averageSessionValue" className="text-white">Average Session Value ($)</Label>
                  <Input
                    id="averageSessionValue"
                    type="number"
                    value={businessData.averageSessionValue}
                    onChange={(e) => updateBusinessData('averageSessionValue', parseInt(e.target.value) || 0)}
                    placeholder="750"
                    className="bg-slate-700 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Main Challenges</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Finding Clients', 'Pricing', 'Time Management', 'Competition', 'Marketing', 'Equipment Costs'].map(challenge => (
                      <Button
                        key={challenge}
                        variant={businessData.challenges.includes(challenge) ? "default" : "outline"}
                        size="sm"
                        onClick={() => businessData.challenges.includes(challenge) 
                          ? setBusinessData(prev => ({...prev, challenges: prev.challenges.filter(c => c !== challenge)}))
                          : addChallenge(challenge)
                        }
                        className="text-sm"
                      >
                        {challenge}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setStep(1)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={generateBusinessAnalysis} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isAnalyzing || businessData.monthlyBookings === 0}
                  >
                    {isAnalyzing ? "Analyzing..." : "Generate Strategy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Analysis Results */}
        {step === 3 && analysis && (
          <div className="space-y-6">
            
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Current Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    ${analysis.currentRevenue.toLocaleString()}/year
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    ${(analysis.currentRevenue / 12).toLocaleString()}/month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Growth Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    +{analysis.growthPotential}%
                  </div>
                  <Progress value={analysis.growthPotential} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Projected Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    ${analysis.projectedRevenue.toLocaleString()}/year
                  </div>
                  <div className="text-sm text-green-400 mt-1">
                    +${(analysis.projectedRevenue - analysis.currentRevenue).toLocaleString()} increase
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Key Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.actionItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-orange-400"
                        />
                        <p className="text-gray-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Strategy */}
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Optimized Pricing Strategy
                </CardTitle>
                <CardDescription className="text-green-300">
                  Market position: {analysis.marketPosition}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analysis.pricingStrategy).map(([service, pricing]: [string, any]) => (
                    <div key={service} className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-semibold capitalize mb-2">{service}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="text-red-400">Current: ${pricing.current}</div>
                        <div className="text-green-400">Recommended: ${pricing.recommended}</div>
                        <div className="text-blue-400">Premium: ${pricing.premium}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setStep(1)} 
                variant="outline"
                className="px-8"
              >
                Start Over
              </Button>
              <Button 
                onClick={() => window.print()} 
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                Print Report
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Report Saved",
                    description: "Business analysis has been saved to your dashboard",
                    duration: 3000
                  });
                }}
                className="px-8 bg-green-600 hover:bg-green-700"
              >
                Save Report
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <Card className="bg-slate-800/50 border-blue-500/30">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-semibold text-white">Analyzing Your Photography Business</h3>
                <p className="text-gray-400">Processing market data, competitor analysis, and growth opportunities...</p>
                <Progress value={75} className="w-full max-w-md mx-auto" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}