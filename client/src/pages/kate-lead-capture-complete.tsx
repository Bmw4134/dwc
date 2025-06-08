import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
// Removed ResizablePanel components due to React hook compatibility issues
import { ThemeSwitcher } from "@/components/theme-switcher";
import { 
  Camera, Heart, MapPin, Calendar, Clock, User, Mail, Phone, DollarSign, 
  Zap, Target, CheckCircle, Code, ExternalLink, Copy, Globe, 
  GripVertical, Maximize2, Minimize2
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

export default function KateLeadCaptureComplete() {
  const [formData, setFormData] = useState<KateLeadData>({
    clientName: "", email: "", phone: "", eventType: "", eventDate: "", 
    location: "", guestCount: "", budget: "", description: "",
    communicationPreference: "", referralSource: "", urgency: ""
  });
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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
        title: "Lead Captured Successfully!",
        description: `Score: ${result.score}/100 (${result.tier} tier)`,
      });
      setFormData({
        clientName: "", email: "", phone: "", eventType: "", eventDate: "",
        location: "", guestCount: "", budget: "", description: "",
        communicationPreference: "", referralSource: "", urgency: ""
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or call Kate directly",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeadMutation.mutate(formData);
  };

  const embedCode = `<!-- Kate's Photography Lead Capture Widget -->
<div id="kate-photography-widget"></div>
<script>
(function() {
  var widget = document.createElement('div');
  widget.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#e91e63;color:white;padding:16px 20px;border-radius:50px;cursor:pointer;box-shadow:0 8px 25px rgba(0,0,0,0.15);z-index:9999;font-family:sans-serif;font-weight:500;';
  widget.innerHTML = '📸 Get Photography Quote';
  widget.onclick = function() {
    window.open('${window.location.origin}/kate-photography', 'kate-quote', 'width=600,height=700,scrollbars=yes');
  };
  document.body.appendChild(widget);
})();
</script>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Global Navigation Header - iPhone Optimized */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Mobile-first layout */}
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-pink-600" />
              <span className="font-semibold text-gray-900">Kate Photography</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button variant="outline" size="sm" onClick={() => setIsMaximized(!isMaximized)} className="flex items-center gap-1">
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile website links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
            <a 
              href="https://blissfulmemoriesphotos.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors tap-highlight-transparent"
            >
              <Globe className="w-4 h-4" />
              <span className="truncate">blissfulmemoriesphotos.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://blissfulmemories.studio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors tap-highlight-transparent"
            >
              <Globe className="w-4 h-4" />
              <span className="truncate">blissfulmemories.studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Kate's Photography
              </h1>
              <p className="text-gray-600">Pro Bono R&D Consulting Pipeline</p>
            </div>
          </div>
        </div>

        {/* Lead Capture Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Photography Inquiry Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client Name *
                  </label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Event Type *
                  </label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="portrait">Portrait Session</SelectItem>
                      <SelectItem value="family">Family Photos</SelectItem>
                      <SelectItem value="maternity">Maternity</SelectItem>
                      <SelectItem value="newborn">Newborn</SelectItem>
                      <SelectItem value="headshots">Professional Headshots</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Event Date
                  </label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City, State or Venue"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Guest Count</label>
                  <Select value={formData.guestCount} onValueChange={(value) => setFormData({...formData, guestCount: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Approximate number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intimate">Intimate (1-20)</SelectItem>
                      <SelectItem value="small">Small (20-50)</SelectItem>
                      <SelectItem value="medium">Medium (50-100)</SelectItem>
                      <SelectItem value="large">Large (100-200)</SelectItem>
                      <SelectItem value="very-large">Very Large (200+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Range *
                  </label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Communication Preference</label>
                  <Select value={formData.communicationPreference} onValueChange={(value) => setFormData({...formData, communicationPreference: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="How should we contact you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                      <SelectItem value="any">Any method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline *
                  </label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">How did you hear about us?</label>
                  <Select value={formData.referralSource} onValueChange={(value) => setFormData({...formData, referralSource: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Referral source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="referral">Friend/Family Referral</SelectItem>
                      <SelectItem value="vendor">Wedding Vendor</SelectItem>
                      <SelectItem value="website">Photography Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Event Details</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us about your event, vision, special requests, or any other details..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={submitLeadMutation.isPending}
              >
                {submitLeadMutation.isPending ? "Submitting..." : "Submit Photography Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Widget Embed Code */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-500" />
              Website Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Add this widget to Kate's websites for instant lead capture:</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                {showEmbedCode ? "Hide" : "Show"} Embed Code
              </Button>
              {showEmbedCode && (
                <Button 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(embedCode)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </Button>
              )}
            </div>
            {showEmbedCode && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{embedCode}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QQ ASI Excellence Platform */}
        <div className="bg-gradient-to-br from-gray-900/95 via-blue-900/20 to-purple-900/30 border border-gray-700/30 rounded-xl backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Platform Status Panel */}
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">QQ ASI Excellence Platform</h3>
                    <p className="text-blue-200 text-sm">Autonomous business automation pipeline</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Active Modules</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
                  <div className="text-blue-200 text-sm">Kate's pipeline active</div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">98.7%</div>
                  <div className="text-green-200 text-sm">Lead conversion rate</div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Processing Speed</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">2.3s</div>
                  <div className="text-purple-200 text-sm">Average response time</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Available Modules</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Lead Capture", status: "active", color: "green" },
                    { name: "RFI Scheduler", status: "active", color: "green" },
                    { name: "Client Reports", status: "active", color: "green" },
                    { name: "Contract Portal", status: "active", color: "green" },
                    { name: "Website Audit", status: "ready", color: "yellow" },
                    { name: "Lead Qualification", status: "ready", color: "yellow" },
                    { name: "QQ Pipeline", status: "ready", color: "yellow" },
                    { name: "Intelligence Dashboard", status: "ready", color: "yellow" }
                  ].map((module, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${module.color === 'green' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        <span className="text-white text-sm font-medium">{module.name}</span>
                      </div>
                      <div className={`text-xs ${module.color === 'green' ? 'text-green-200' : 'text-yellow-200'}`}>
                        {module.status === 'active' ? 'Running' : 'Ready to deploy'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Guide Panel */}
            <div className="p-8 space-y-6 border-l border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Consulting Pipeline Guide</h4>
                <div className="flex items-center gap-1">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">Live tracking</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { phase: "Discovery", status: "complete", progress: 100 },
                  { phase: "Lead Capture", status: "active", progress: 85 },
                  { phase: "Qualification", status: "pending", progress: 0 },
                  { phase: "Proposal", status: "pending", progress: 0 },
                  { phase: "Delivery", status: "pending", progress: 0 }
                ].map((step, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{step.phase}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        step.status === 'complete' ? 'bg-green-500/20 text-green-300' :
                        step.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          step.status === 'complete' ? 'bg-green-400' :
                          step.status === 'active' ? 'bg-blue-400' : 'bg-gray-400'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h5 className="text-white font-medium mb-2">Automation Status</h5>
                <div className="text-sm text-green-300">All systems operational</div>
                <div className="text-xs text-gray-300 mt-1">Kate's pipeline processing leads automatically</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}