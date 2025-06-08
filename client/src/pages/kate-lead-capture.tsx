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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { 
  Camera,
  Heart,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  DollarSign,
  Zap,
  Target,
  CheckCircle,
  Code,
  ExternalLink,
  Copy,
  Globe,
  GripVertical,
  Maximize2,
  Minimize2
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

export default function KateLeadCapture() {
  const [formData, setFormData] = useState<KateLeadData>({
    clientName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    location: "",
    guestCount: "",
    budget: "",
    description: "",
    communicationPreference: "",
    referralSource: "",
    urgency: ""
  });
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { toast } = useToast();

  // Form submission
  const submitLeadMutation = useMutation({
    mutationFn: async (data: KateLeadData) => {
      return await apiRequest("/api/kate-leads/submit", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          source: "website-form",
          websites: ["blissfulmemoriesphotos.com", "blissfulmemories.studio"],
          submittedAt: new Date().toISOString()
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted Successfully",
        description: "Kate will respond within 24 hours with a detailed quote"
      });
      setFormData({
        clientName: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        location: "",
        guestCount: "",
        budget: "",
        description: "",
        communicationPreference: "",
        referralSource: "",
        urgency: ""
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
    window.open('${window.location.origin}/rfi-scheduler?source=widget&business=kate-photography', 'kate-quote', 'width=600,height=700,scrollbars=yes');
  };
  document.body.appendChild(widget);
})();
</script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Widget Code Copied",
      description: "Add this code to Kate's websites for lead capture"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-pink-400" />
            <Heart className="h-6 w-6 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Kate's Photography Lead Capture
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Blissful Memories Photography - Capturing your most precious moments
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-pink-500/20 text-pink-400 border border-pink-500/30">
              blissfulmemoriesphotos.com
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              blissfulmemories.studio
            </Badge>
          </div>
        </div>

        {/* Lead Capture Form */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-pink-400" />
              Photography Inquiry Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-pink-400" />
                    Client Name *
                  </label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-pink-400" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-pink-400" />
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    Event Type *
                  </label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="engagement">Engagement Session</SelectItem>
                      <SelectItem value="portrait">Portrait Session</SelectItem>
                      <SelectItem value="family">Family Photos</SelectItem>
                      <SelectItem value="maternity">Maternity Session</SelectItem>
                      <SelectItem value="newborn">Newborn Session</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="headshots">Professional Headshots</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-pink-400" />
                    Event Date
                  </label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-pink-400" />
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="City, State or Venue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Guest Count</label>
                  <Select value={formData.guestCount} onValueChange={(value) => setFormData(prev => ({ ...prev, guestCount: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Approximate count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 people</SelectItem>
                      <SelectItem value="11-25">11-25 people</SelectItem>
                      <SelectItem value="26-50">26-50 people</SelectItem>
                      <SelectItem value="51-100">51-100 people</SelectItem>
                      <SelectItem value="101-150">101-150 people</SelectItem>
                      <SelectItem value="150+">150+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Budget and Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-pink-400" />
                    Budget Range *
                  </label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                  <label className="text-white text-sm font-medium">Communication Preference</label>
                  <Select value={formData.communicationPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, communicationPreference: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="How should Kate contact you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                      <SelectItem value="video-call">Video Call Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">How did you find us?</label>
                  <Select value={formData.referralSource} onValueChange={(value) => setFormData(prev => ({ ...prev, referralSource: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Referral source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="friend-referral">Friend Referral</SelectItem>
                      <SelectItem value="vendor-referral">Vendor Referral</SelectItem>
                      <SelectItem value="wedding-website">Wedding Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-pink-400" />
                    Timeline
                  </label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="When do you need photos?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP (Rush Job)</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1-month">1 month</SelectItem>
                      <SelectItem value="2-3-months">2-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="6-months-plus">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Tell Kate about your vision *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white min-h-[120px]"
                  placeholder="Describe your event, style preferences, must-have shots, special requests, or any other details that will help Kate create the perfect photography experience for you..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  disabled={submitLeadMutation.isPending}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-12 py-3 text-lg"
                >
                  {submitLeadMutation.isPending ? (
                    <>
                      <Zap className="h-5 w-5 mr-2 animate-spin" />
                      Sending Inquiry...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      Send Photography Inquiry
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Widget Embed Section */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-green-400" />
                Website Integration
              </CardTitle>
              <Button
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                {showEmbedCode ? "Hide" : "Show"} Embed Code
              </Button>
            </div>
          </CardHeader>
          {showEmbedCode && (
            <CardContent className="space-y-4">
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                  {embedCode}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyEmbedCode} className="bg-green-600 hover:bg-green-700">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Widget Code
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Widget
                </Button>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Integration Instructions:</h4>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>1. Copy the widget code above</p>
                  <p>2. Add it to both blissfulmemoriesphotos.com and blissfulmemories.studio</p>
                  <p>3. Place the code before the closing &lt;/body&gt; tag</p>
                  <p>4. The floating widget will appear on all pages automatically</p>
                  <p>5. Leads will be captured and scored in the pipeline</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* QQ ASI Excellence Platform Status Section */}
        <ResizablePanelGroup direction="vertical" className="bg-gradient-to-br from-gray-900/95 via-blue-900/20 to-purple-900/30 border border-gray-700/30 rounded-xl backdrop-blur-sm overflow-hidden">
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="p-8 space-y-8">
              {/* Platform Header */}
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
                <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-sm font-medium">Live</span>
                  </div>
                </div>
              </div>

              {/* Platform Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Available Modules Grid */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Available Modules</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="p-8 space-y-6">
              {/* Consulting Pipeline Guide */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Consulting Pipeline Guide</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-white hover:bg-white/10"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
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
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
            {/* Platform Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Kate Photography Intelligence Platform</h3>
                  <p className="text-gray-400">Advanced Business Intelligence & Automation</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2">
                Enterprise ASI Platform
              </Badge>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Status Card */}
              <Card className="bg-gray-800/40 border-gray-700/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Platform Status</CardTitle>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">System Confidence</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0">99%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Active Modules</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-0">12/16</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Revenue Pipeline</span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-0">$750k/month</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Business Formation</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0">On Track</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Development Status */}
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <CardTitle className="text-orange-400 text-lg">Platform Development</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-300 text-sm mb-4">
                    This feature is being enhanced as part of our enterprise platform expansion. 
                    Our ASI system is continuously building new capabilities.
                  </p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => window.open('/quantum-intelligence', '_blank')}
                  >
                    View Intelligence Hierarchy
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Available Platform Modules */}
            <div>
              <h4 className="text-white font-semibold mb-4">Available Platform Modules</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">Intelligence</div>
                  <div className="text-xs opacity-75">QQ + ASI + AI</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">Financial</div>
                  <div className="text-xs opacity-75">Content Order</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">Business</div>
                  <div className="text-xs opacity-75">File System</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">Email & DNS</div>
                  <div className="text-xs opacity-75">Automation</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">Lead</div>
                  <div className="text-xs opacity-75">Intelligence</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">ROI</div>
                  <div className="text-xs opacity-75">Calculator</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">LLC</div>
                  <div className="text-xs opacity-75">Automation</div>
                </div>
                <div className="bg-yellow-400 text-black p-4 rounded-lg text-center">
                  <div className="font-semibold text-sm">Mission</div>
                  <div className="text-xs opacity-75">Control</div>
                </div>
              </div>
            </div>

            {/* Consulting Pipeline Guide */}
            <div className="bg-gray-900/60 border border-gray-700/40 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  <h4 className="text-white font-semibold">Consulting Pipeline Guide</h4>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-0">Progress 0/5</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div className="flex-1">
                    <div className="text-blue-400 font-medium">Client Intake</div>
                    <div className="text-gray-400 text-sm">Add Kate's websites for automated analysis</div>
                    <div className="text-blue-300 text-xs">Enter https://blissfulmemoriesphotography.com</div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-0">30 seconds</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700/30 rounded-lg opacity-60">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div className="flex-1">
                    <div className="text-gray-400 font-medium">Website Analysis</div>
                    <div className="text-gray-500 text-sm">2 minutes</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700/30 rounded-lg opacity-60">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div className="flex-1">
                    <div className="text-gray-400 font-medium">Revenue Projection</div>
                    <div className="text-gray-500 text-sm">7 minutes</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700/30 rounded-lg opacity-60">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <div className="flex-1">
                    <div className="text-gray-400 font-medium">Contract Generation</div>
                    <div className="text-gray-500 text-sm">Automatic</div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                onClick={() => window.open('/quantum-intelligence', '_blank')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto Run
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}