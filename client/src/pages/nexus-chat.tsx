import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Send, 
  Zap, 
  Target, 
  Search, 
  MapPin,
  Building2,
  Users,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Settings,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Globe
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "automation" | "lead_generation" | "analysis" | "general";
  metadata?: any;
}

interface AutomationSuggestion {
  id: string;
  title: string;
  description: string;
  category: "process" | "lead_gen" | "analytics" | "integration";
  estimatedSavings: number;
  timeToImplement: string;
  complexity: "low" | "medium" | "high";
}

interface LeadTarget {
  id: string;
  industry: string;
  location: string;
  companySize: string;
  painPoints: string[];
  automationPotential: number;
  estimatedValue: number;
}

export default function NEXUSChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to NEXUS Intelligence. I can help you automate any business process, identify high-value leads, or analyze opportunities. What would you like to accomplish today?",
      timestamp: new Date(),
      type: "general"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const automationSuggestions: AutomationSuggestion[] = [
    {
      id: "lead-scoring",
      title: "AI Lead Scoring System",
      description: "Automatically score and prioritize leads based on engagement and conversion probability",
      category: "lead_gen",
      estimatedSavings: 15000,
      timeToImplement: "2-3 weeks",
      complexity: "medium"
    },
    {
      id: "email-sequences",
      title: "Smart Email Automation",
      description: "Personalized email sequences that adapt based on recipient behavior and engagement",
      category: "process",
      estimatedSavings: 8000,
      timeToImplement: "1-2 weeks",
      complexity: "low"
    },
    {
      id: "proposal-generation",
      title: "Automated Proposal Generator",
      description: "Generate customized proposals based on client requirements and past successful projects",
      category: "process",
      estimatedSavings: 12000,
      timeToImplement: "3-4 weeks",
      complexity: "high"
    },
    {
      id: "market-analysis",
      title: "Real-time Market Intelligence",
      description: "Continuous monitoring of market trends and competitor activities with automated reports",
      category: "analytics",
      estimatedSavings: 20000,
      timeToImplement: "4-6 weeks",
      complexity: "high"
    }
  ];

  const leadTargets: LeadTarget[] = [
    {
      id: "healthcare-midsize",
      industry: "Healthcare",
      location: "Northeast US",
      companySize: "50-200 employees",
      painPoints: ["Manual patient scheduling", "Paper-based records", "Billing inefficiencies"],
      automationPotential: 85,
      estimatedValue: 45000
    },
    {
      id: "manufacturing-sme",
      industry: "Manufacturing",
      location: "Midwest US",
      companySize: "25-100 employees",
      painPoints: ["Inventory management", "Quality control tracking", "Production scheduling"],
      automationPotential: 92,
      estimatedValue: 65000
    },
    {
      id: "professional-services",
      industry: "Professional Services",
      location: "West Coast",
      companySize: "10-50 employees",
      painPoints: ["Time tracking", "Client communication", "Project management"],
      automationPotential: 78,
      estimatedValue: 25000
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("POST", "/api/nexus-chat", { message });
    },
    onSuccess: (response) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        type: response.type || "general",
        metadata: response.metadata
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "process": return <Settings className="w-4 h-4" />;
      case "lead_gen": return <Target className="w-4 h-4" />;
      case "analytics": return <TrendingUp className="w-4 h-4" />;
      case "integration": return <Globe className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Premium Header */}
      <header className="relative border-b border-gray-200/20 dark:border-slate-800/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  NEXUS Intelligence Chat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  DWC Systems LLC • AI-Powered Business Automation
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                AI Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Smart Chat</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Automation</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Lead Targeting</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl h-[600px] flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <span>NEXUS Intelligence Assistant</span>
                    </CardTitle>
                    <CardDescription>
                      Ask me anything about automation, lead generation, or business optimization
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-4 py-3 ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask NEXUS to automate anything..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickAction("Help me automate lead generation for healthcare companies in the Northeast")}
                    >
                      <div>
                        <div className="font-medium">Target Healthcare Leads</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Find automation opportunities</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickAction("What business processes can I automate to save the most money?")}
                    >
                      <div>
                        <div className="font-medium">Cost-Saving Automation</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Maximize ROI opportunities</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickAction("Generate a proposal for automating manufacturing processes")}
                    >
                      <div>
                        <div className="font-medium">Manufacturing Proposal</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Custom automation plan</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickAction("Analyze my current client portfolio and suggest growth opportunities")}
                    >
                      <div>
                        <div className="font-medium">Portfolio Analysis</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Growth recommendations</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Live Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">$47,392</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">1,247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">98.7%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Automation Score</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {automationSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          {getCategoryIcon(suggestion.category)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{suggestion.title}</h3>
                          <Badge className={getComplexityColor(suggestion.complexity)}>
                            {suggestion.complexity} complexity
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {suggestion.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Savings</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${suggestion.estimatedSavings.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Implementation</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {suggestion.timeToImplement}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleQuickAction(`Tell me more about ${suggestion.title} and how to implement it`)}
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {leadTargets.map((target) => (
                <Card key={target.id} className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{target.industry}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{target.location}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {target.automationPotential}% potential
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Company Size</div>
                        <div className="font-medium text-gray-900 dark:text-white">{target.companySize}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Key Pain Points</div>
                        <div className="space-y-1">
                          {target.painPoints.map((point, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <AlertTriangle className="w-3 h-3 mr-2 text-yellow-500" />
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${target.estimatedValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => handleQuickAction(`Create a targeted automation proposal for ${target.industry} companies with ${target.companySize} focusing on ${target.painPoints.join(', ')}`)}
                    >
                      Generate Proposal
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}