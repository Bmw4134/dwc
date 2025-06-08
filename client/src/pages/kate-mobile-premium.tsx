import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { 
  Camera, Heart, MapPin, Calendar, Clock, User, Mail, Phone, DollarSign, 
  Zap, Target, CheckCircle, ArrowRight, Sparkles, Globe, ExternalLink,
  ChevronDown, Star, Award
} from "lucide-react";

interface KateLeadData {
  clientName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: string;
  budget: string;
  description: string;
  communicationPreference: string;
  referralSource: string;
  urgency: string;
}

export default function KateMobilePremium() {
  const [formData, setFormData] = useState<KateLeadData>({
    clientName: "", email: "", phone: "", eventType: "", eventDate: "", 
    location: "", guestCount: "", budget: "", description: "",
    communicationPreference: "", referralSource: "", urgency: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const submitLeadMutation = useMutation({
    mutationFn: async (data: KateLeadData) => {
      return await apiRequest("/api/kate-leads/submit", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Photography Inquiry Submitted",
        description: `We'll contact you within 24 hours`,
      });
      setCurrentStep(4);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeadMutation.mutate(formData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        {/* Premium Mobile Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Kate Photography</h1>
                <p className="text-white/80 text-sm">Automation Dashboard</p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
          
          {/* Live Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">All Systems Live</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white/80 text-sm">Active</span>
              </div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-white/60 text-xs">Modules Running</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white/80 text-sm">Success</span>
              </div>
              <div className="text-2xl font-bold text-white">98.7%</div>
              <div className="text-white/60 text-xs">Conversion Rate</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Quick Actions</h3>
            
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl h-14 text-lg font-medium"
              onClick={() => setShowDashboard(false)}
            >
              <Camera className="w-5 h-5 mr-3" />
              New Photography Inquiry
              <ArrowRight className="w-5 h-5 ml-auto" />
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <a 
                href="https://blissfulmemoriesphotos.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 tap-highlight-transparent"
              >
                <Globe className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Main Site</span>
                <ExternalLink className="w-4 h-4 text-white/60" />
              </a>

              <a 
                href="https://blissfulmemories.studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 tap-highlight-transparent"
              >
                <Globe className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Studio</span>
                <ExternalLink className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Pipeline Status</h3>
            {[
              { phase: "Discovery", status: "complete", progress: 100, color: "green" },
              { phase: "Lead Capture", status: "active", progress: 85, color: "blue" },
              { phase: "Qualification", status: "pending", progress: 0, color: "gray" },
            ].map((step, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{step.phase}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    step.color === 'green' ? 'bg-green-500/20 text-green-300' :
                    step.color === 'blue' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {step.status}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step.color === 'green' ? 'bg-green-400' :
                      step.color === 'blue' ? 'bg-blue-400' : 'bg-gray-400'
                    }`}
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Premium Mobile Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 p-6 pb-8 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Kate Photography</h1>
              <p className="text-white/80 text-sm">Capture Your Perfect Moment</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDashboard(true)}
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <Zap className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= step ? 'bg-white text-pink-600' : 'bg-white/20 text-white/60'
              }`}>
                {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full ${
                  currentStep > step ? 'bg-white' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-white/90 text-sm font-medium">
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Event Details"}
            {currentStep === 3 && "Preferences"}
            {currentStep === 4 && "Complete"}
          </p>
        </div>
      </div>

      <div className="p-6">
        {currentStep === 4 ? (
          /* Success Screen */
          <div className="text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h2>
              <p className="text-gray-600">We'll contact you within 24 hours to discuss your photography needs.</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => {setCurrentStep(1); setFormData({clientName: "", email: "", phone: "", eventType: "", eventDate: "", location: "", guestCount: "", budget: "", description: "", communicationPreference: "", referralSource: "", urgency: ""});}}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl h-12"
              >
                Submit Another Inquiry
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDashboard(true)}
                className="w-full rounded-xl h-12 border-gray-300"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        ) : (
          /* Form Steps */
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      placeholder="Enter your full name"
                      className="pl-10 h-12 rounded-xl border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="pl-10 h-12 rounded-xl border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                      className="pl-10 h-12 rounded-xl border-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-300">
                      <SelectValue placeholder="Select your event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="portrait">Portrait Session</SelectItem>
                      <SelectItem value="family">Family Photos</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="pl-10 h-12 rounded-xl border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="City, State or Venue"
                      className="pl-10 h-12 rounded-xl border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-300">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1000">Under $1,000</SelectItem>
                      <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                      <SelectItem value="2000-3500">$2,000 - $3,500</SelectItem>
                      <SelectItem value="3500-5000">$3,500 - $5,000</SelectItem>
                      <SelectItem value="5000-7500">$5,000 - $7,500</SelectItem>
                      <SelectItem value="over-7500">Over $7,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-300">
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="2-3-months">2-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="6-months-plus">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us?</label>
                  <Select value={formData.referralSource} onValueChange={(value) => setFormData({...formData, referralSource: value})}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-300">
                      <SelectValue placeholder="Referral source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="referral">Friend/Family Referral</SelectItem>
                      <SelectItem value="website">Photography Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your vision</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your event, style preferences, or any special requests..."
                    className="min-h-[120px] rounded-xl border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 h-12 rounded-xl border-gray-300"
                >
                  Back
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl h-12"
                  disabled={
                    (currentStep === 1 && (!formData.clientName || !formData.email || !formData.phone)) ||
                    (currentStep === 2 && (!formData.eventType || !formData.budget))
                  }
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={submitLeadMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl h-12"
                >
                  {submitLeadMutation.isPending ? "Submitting..." : "Submit Inquiry"}
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Premium Footer */}
      <div className="p-6 bg-gray-50 rounded-t-3xl mt-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
          <p className="text-sm text-gray-600">Trusted by over 500+ happy couples</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              Award Winning
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Insured & Licensed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}