import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  DollarSign,
  MapPin,
  Camera,
  Heart,
  Building,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Code,
  Globe,
  Smartphone,
  Monitor,
  Copy,
  ExternalLink,
  Settings,
  BarChart3,
  Users,
  TrendingUp
} from "lucide-react";

interface RFIFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceType: string;
  budget: string;
  projectDescription: string;
  preferredTimeframe: string;
  communicationPreference: string;
  websiteUrl?: string;
  companySize?: string;
  currentChallenges: string;
}

interface SchedulerSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  available: boolean;
  type: "consultation" | "discovery" | "presentation" | "follow-up";
}

interface LeadSubmission {
  id: string;
  formData: RFIFormData;
  submittedAt: Date;
  score: number;
  category: "high-intent" | "warm" | "passive" | "spam";
  source: string;
  geoLocation?: string;
  scheduledSlot?: SchedulerSlot;
  status: "new" | "contacted" | "scheduled" | "qualified" | "converted";
}

export default function QuantumRFIScheduler() {
  const [activeTab, setActiveTab] = useState("rfi-form");
  const [formData, setFormData] = useState<RFIFormData>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    serviceType: "",
    budget: "",
    projectDescription: "",
    preferredTimeframe: "",
    communicationPreference: "",
    websiteUrl: "",
    companySize: "",
    currentChallenges: ""
  });
  const [selectedSlot, setSelectedSlot] = useState<SchedulerSlot | null>(null);
  const [widgetConfig, setWidgetConfig] = useState({
    primaryColor: "#6366f1",
    company: "Kate's Photography Studio",
    services: ["Wedding Photography", "Portrait Sessions", "Corporate Events", "Custom Projects"],
    embedCode: ""
  });
  const { toast } = useToast();

  // Available scheduler slots
  const { data: availableSlots = [] } = useQuery({
    queryKey: ["/api/rfi-scheduler/slots"],
    initialData: [
      {
        id: "slot-1",
        date: "2025-06-05",
        time: "10:00 AM",
        duration: 60,
        available: true,
        type: "consultation"
      },
      {
        id: "slot-2", 
        date: "2025-06-05",
        time: "2:00 PM",
        duration: 60,
        available: true,
        type: "discovery"
      },
      {
        id: "slot-3",
        date: "2025-06-06",
        time: "11:00 AM",
        duration: 30,
        available: true,
        type: "consultation"
      },
      {
        id: "slot-4",
        date: "2025-06-06",
        time: "3:00 PM",
        duration: 90,
        available: true,
        type: "presentation"
      }
    ]
  });

  // Recent lead submissions
  const { data: recentLeads = [], refetch: refetchLeads } = useQuery({
    queryKey: ["/api/rfi-scheduler/leads"],
    initialData: [
      {
        id: "lead-1",
        formData: {
          businessName: "Sunset Wedding Venue",
          contactName: "Sarah Johnson",
          email: "sarah@sunsetweddings.com",
          phone: "(555) 123-4567",
          serviceType: "Wedding Photography",
          budget: "$3,000-$5,000",
          projectDescription: "Looking for premium wedding photography package for our venue clients",
          preferredTimeframe: "Next 2 weeks",
          communicationPreference: "Email",
          companySize: "Small Business",
          currentChallenges: "Need reliable photographer for high-end clients"
        },
        submittedAt: new Date("2025-06-04T14:30:00"),
        score: 95,
        category: "high-intent",
        source: "website-widget",
        geoLocation: "Austin, TX",
        status: "new"
      },
      {
        id: "lead-2",
        formData: {
          businessName: "Tech Startup Inc",
          contactName: "Mike Chen",
          email: "mike@techstartup.com", 
          phone: "(555) 987-6543",
          serviceType: "Corporate Events",
          budget: "$1,500-$3,000",
          projectDescription: "Quarterly team photos and event coverage",
          preferredTimeframe: "Next month",
          communicationPreference: "Phone",
          companySize: "Mid-size",
          currentChallenges: "Budget constraints but need quality work"
        },
        submittedAt: new Date("2025-06-04T11:15:00"),
        score: 78,
        category: "warm",
        source: "linkedin-referral",
        status: "contacted"
      }
    ]
  });

  // Form submission mutation
  const submitRFIMutation = useMutation({
    mutationFn: async (data: RFIFormData & { scheduledSlot?: SchedulerSlot }) => {
      return await apiRequest("/api/rfi-scheduler/submit", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "RFI Submitted Successfully",
        description: "Your request has been processed and added to the pipeline"
      });
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        serviceType: "",
        budget: "",
        projectDescription: "",
        preferredTimeframe: "",
        communicationPreference: "",
        websiteUrl: "",
        companySize: "",
        currentChallenges: ""
      });
      setSelectedSlot(null);
      refetchLeads();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRFIMutation.mutate({
      ...formData,
      scheduledSlot: selectedSlot || undefined
    });
  };

  const generateEmbedCode = () => {
    const embedCode = `<!-- Kate's Photography RFI Widget -->
<div id="quantum-rfi-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-domain.replit.app/embed/rfi-widget.js';
    script.setAttribute('data-company', '${widgetConfig.company}');
    script.setAttribute('data-color', '${widgetConfig.primaryColor}');
    script.setAttribute('data-services', '${widgetConfig.services.join(',')}');
    document.head.appendChild(script);
  })();
</script>`;
    setWidgetConfig(prev => ({ ...prev, embedCode }));
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(widgetConfig.embedCode);
    toast({
      title: "Embed Code Copied",
      description: "Widget code copied to clipboard"
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "high-intent": return "bg-green-500/20 text-green-400";
      case "warm": return "bg-blue-500/20 text-blue-400";
      case "passive": return "bg-yellow-500/20 text-yellow-400";
      case "spam": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-purple-500/20 text-purple-400";
      case "contacted": return "bg-blue-500/20 text-blue-400";
      case "scheduled": return "bg-orange-500/20 text-orange-400";
      case "qualified": return "bg-green-500/20 text-green-400";
      case "converted": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  useEffect(() => {
    generateEmbedCode();
  }, [widgetConfig.company, widgetConfig.primaryColor, widgetConfig.services]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Quantum RFI + Scheduler Assist
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Advanced lead capture system with intelligent scheduling for Kate's photography business and future clients
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Smart Lead Scoring
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Auto-Scheduling
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Widget Embeddable
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
            <TabsTrigger value="rfi-form">RFI Form</TabsTrigger>
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
            <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="widget">Widget Config</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* RFI Form Tab */}
          <TabsContent value="rfi-form" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Request for Information Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Business Name *</label>
                      <Input
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Your business name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Contact Name *</label>
                      <Input
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Phone Number *</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Service Type *</label>
                      <Select value={formData.serviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding-photography">Wedding Photography</SelectItem>
                          <SelectItem value="portrait-sessions">Portrait Sessions</SelectItem>
                          <SelectItem value="corporate-events">Corporate Events</SelectItem>
                          <SelectItem value="custom-projects">Custom Projects</SelectItem>
                          <SelectItem value="consultation">Consultation Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Budget Range *</label>
                      <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1000">Under $1,000</SelectItem>
                          <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                          <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="over-10000">Over $10,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Project Description *</label>
                    <Textarea
                      value={formData.projectDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[100px]"
                      placeholder="Tell us about your project, event, or photography needs..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Preferred Timeframe</label>
                      <Select value={formData.preferredTimeframe} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTimeframe: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="When do you need this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="next-week">Next Week</SelectItem>
                          <SelectItem value="next-month">Next Month</SelectItem>
                          <SelectItem value="next-quarter">Next Quarter</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Communication Preference</label>
                      <Select value={formData.communicationPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, communicationPreference: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="How should we contact you?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="text">Text Message</SelectItem>
                          <SelectItem value="video-call">Video Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Current Challenges</label>
                    <Textarea
                      value={formData.currentChallenges}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentChallenges: e.target.value }))}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="What challenges are you facing with your current photography needs?"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitRFIMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {submitRFIMutation.isPending ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Processing Request...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Submit RFI & Enter Pipeline
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduler Tab */}
          <TabsContent value="scheduler" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Available Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSlots.map((slot) => (
                    <Card 
                      key={slot.id} 
                      className={`cursor-pointer transition-all duration-200 border ${
                        selectedSlot?.id === slot.id 
                          ? 'bg-blue-500/20 border-blue-400' 
                          : 'bg-gray-700/30 border-gray-600 hover:bg-gray-600/30'
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">{slot.date}</p>
                          <Badge className={`text-xs ${
                            slot.type === 'consultation' ? 'bg-blue-500/20 text-blue-400' :
                            slot.type === 'discovery' ? 'bg-green-500/20 text-green-400' :
                            slot.type === 'presentation' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {slot.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{slot.time} ({slot.duration} min)</span>
                        </div>
                        {selectedSlot?.id === slot.id && (
                          <div className="mt-2 flex items-center text-blue-400 text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedSlot && (
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="text-blue-400 font-medium mb-2">Selected Slot Details</h3>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>Date: {selectedSlot.date}</p>
                      <p>Time: {selectedSlot.time}</p>
                      <p>Duration: {selectedSlot.duration} minutes</p>
                      <p>Type: {selectedSlot.type.charAt(0).toUpperCase() + selectedSlot.type.slice(1)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Pipeline Tab */}
          <TabsContent value="leads" className="space-y-6">
            <div className="space-y-6">
              {recentLeads.map((lead) => (
                <Card key={lead.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Building className="h-5 w-5 text-green-400" />
                        {lead.formData.businessName}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(lead.category)}>
                          {lead.category.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.toUpperCase()}
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          Score: {lead.score}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Contact</p>
                        <p className="text-white">{lead.formData.contactName}</p>
                        <p className="text-gray-300 text-sm">{lead.formData.email}</p>
                        <p className="text-gray-300 text-sm">{lead.formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Service & Budget</p>
                        <p className="text-white">{lead.formData.serviceType}</p>
                        <p className="text-green-400 text-sm">{lead.formData.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Timeline & Source</p>
                        <p className="text-white">{lead.formData.preferredTimeframe}</p>
                        <p className="text-blue-400 text-sm">{lead.source}</p>
                        {lead.geoLocation && (
                          <p className="text-gray-300 text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.geoLocation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm mb-1">Project Description:</p>
                      <p className="text-gray-300 text-sm">{lead.formData.projectDescription}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">
                        Submitted: {lead.submittedAt.toLocaleDateString()} at {lead.submittedAt.toLocaleTimeString()}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Mail className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Widget Configuration Tab */}
          <TabsContent value="widget" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-400" />
                  Widget Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Company Name</label>
                      <Input
                        value={widgetConfig.company}
                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, company: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Primary Color</label>
                      <Input
                        type="color"
                        value={widgetConfig.primaryColor}
                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Services Offered</label>
                    <div className="space-y-2">
                      {widgetConfig.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={service}
                            onChange={(e) => {
                              const newServices = [...widgetConfig.services];
                              newServices[index] = e.target.value;
                              setWidgetConfig(prev => ({ ...prev, services: newServices }));
                            }}
                            className="bg-gray-700/50 border-gray-600 text-white"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newServices = widgetConfig.services.filter((_, i) => i !== index);
                              setWidgetConfig(prev => ({ ...prev, services: newServices }));
                            }}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        onClick={() => setWidgetConfig(prev => ({ 
                          ...prev, 
                          services: [...prev.services, "New Service"] 
                        }))}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Add Service
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Embed Code</h3>
                    <Button onClick={copyEmbedCode} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                  <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                    <pre className="text-green-400 text-xs overflow-x-auto whitespace-pre-wrap">
                      {widgetConfig.embedCode || "Click 'Generate Code' to create embed code"}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={generateEmbedCode} className="bg-purple-600 hover:bg-purple-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Code
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview Widget
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Submissions</p>
                      <p className="text-3xl font-bold text-white">847</p>
                      <p className="text-green-400 text-sm">+23% this month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Conversion Rate</p>
                      <p className="text-3xl font-bold text-white">34.7%</p>
                      <p className="text-green-400 text-sm">+5.2% improvement</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Lead Score</p>
                      <p className="text-3xl font-bold text-white">78.4</p>
                      <p className="text-blue-400 text-sm">High quality leads</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue Pipeline</p>
                      <p className="text-3xl font-bold text-white">$124K</p>
                      <p className="text-emerald-400 text-sm">Potential value</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}