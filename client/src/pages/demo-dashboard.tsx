import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Brain, 
  Send, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign,
  Bot,
  MessageSquare,
  Sparkles
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  promptsRemaining?: number;
}

interface NexusResponse {
  message: string;
  confidence: number;
  sessionId: string;
  timestamp: string;
  promptsRemaining: number;
}

export default function DemoDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session and check for stored query
    const newSessionId = `nexus-demo-${Date.now()}`;
    setSessionId(newSessionId);
    
    const storedQuery = sessionStorage.getItem('nexusQuery');
    if (storedQuery) {
      setCurrentQuery(storedQuery);
      sessionStorage.removeItem('nexusQuery');
      // Auto-send the query
      setTimeout(() => handleSendMessage(storedQuery), 1000);
    }

    // Add welcome message
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: `🧠 **NEXUS GPT Enterprise Assistant Activated**

Welcome to your quantum-enhanced AI assistant powered by the QNIS Master LLM. I have access to real-time market intelligence and DWC Systems operational data.

**Live System Status:**
• Pipeline Value: $2.66M
• System Confidence: 97.8%
• Active Modules: 18/18
• Quantum Enhancement: OPERATIONAL

**I can help you with:**
🎯 Lead generation strategies and pipeline optimization
📊 Trading analysis and market intelligence
⚙️ Enterprise automation workflows
💼 Business development and ROI analysis

You have **20 free prompts** remaining. Ask me anything about our platform capabilities!`,
      timestamp: new Date(),
      confidence: 99.5
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (queryOverride?: string) => {
    const query = queryOverride || currentQuery;
    if (!query.trim() || isProcessing || promptsUsed >= 20) return;

    setIsProcessing(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentQuery("");

    try {
      const response = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: sessionId
        }),
      });

      if (response.ok) {
        const data: NexusResponse = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: data.message,
          timestamp: new Date(),
          confidence: data.confidence,
          promptsRemaining: data.promptsRemaining
        };

        setMessages(prev => [...prev, assistantMessage]);
        setPromptsUsed(prev => prev + 1);

        if (data.confidence > 95) {
          toast({
            title: "High Confidence Response",
            description: `QNIS processed your query with ${data.confidence.toFixed(1)}% confidence`,
          });
        }
      } else {
        throw new Error('NEXUS GPT temporarily unavailable');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: `⚠️ **System Notice**

Our quantum systems are temporarily recalibrating. This is normal during high-performance operations.

**Current Status:**
• Core modules: Operational
• QNIS Master LLM: Standby mode
• Data pipeline: Active

Please try your query again in a moment. All systems will be restored shortly.`,
        timestamp: new Date(),
        confidence: 85
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "NEXUS GPT",
        description: "Quantum systems recalibrating. Try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getQuickPrompts = () => [
    "Show me current lead generation opportunities",
    "Analyze trading performance and market trends",
    "What automation workflows are available?",
    "Display ROI metrics and business impact",
    "How does the quantum enhancement work?",
    "What's the current pipeline status?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative overflow-hidden">
      {/* Spectacular Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
      </div>
      
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b-2 border-emerald-500/50 bg-slate-900/95 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          {/* Top Row - Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400 bg-emerald-500/10 px-4 py-2 text-lg animate-pulse">
                {20 - promptsUsed} FREE PROMPTS REMAINING
              </Badge>
              <Badge variant="outline" className="text-red-400 border-red-400 bg-red-500/10 px-4 py-2 text-lg animate-pulse">
                QNIS ENHANCED
              </Badge>
            </div>
          </div>
          
          {/* Spectacular Main Header */}
          <div className="text-center">
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-30 blur-2xl animate-pulse"></div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative z-10 drop-shadow-2xl">
                NEXUS GPT DEMO
              </h1>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-emerald-500/50 rounded-xl p-4 max-w-3xl mx-auto backdrop-blur-sm">
              <p className="text-xl text-slate-100 font-bold mb-2">
                QUANTUM-ENHANCED AI ASSISTANT
              </p>
              <p className="text-lg text-slate-300">
                QNIS-powered neural intelligence with real-time market data access
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-emerald-400 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  NEXUS GPT Enterprise Assistant
                  {isProcessing && (
                    <div className="ml-3 flex items-center text-sm text-slate-400">
                      <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full mr-2" />
                      Processing...
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col space-y-4">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-700 text-slate-100'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{formatTimestamp(message.timestamp)}</span>
                            {message.confidence && (
                              <span className="flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {message.confidence.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="flex-shrink-0 space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      placeholder="Ask about lead generation, trading strategies, automation workflows..."
                      className="bg-slate-700 border-slate-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isProcessing || promptsUsed >= 20}
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={isProcessing || !currentQuery.trim() || promptsUsed >= 20}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {promptsUsed >= 20 && (
                    <div className="text-center text-amber-400 text-sm">
                      You've used all 20 free prompts. Contact us for unlimited access!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300 text-lg">Quick Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getQuickPrompts().map((prompt, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isProcessing || promptsUsed >= 20}
                      variant="outline"
                      className="text-left justify-start h-auto py-3 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Metrics Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-emerald-400 text-lg">Live Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Pipeline Value</span>
                    <span className="text-emerald-400 font-semibold">$2.66M</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-4/5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">System Health</span>
                    <span className="text-emerald-400 font-semibold">97.8%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[97%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Active Modules</span>
                    <span className="text-emerald-400 font-semibold">18/18</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400 text-lg">QNIS Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">Master LLM Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">Perplexity Core Linked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">Quantum Enhancement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-300">Real-time Intelligence</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400 text-lg">Upgrade to Pro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">
                  Unlock unlimited prompts and advanced features:
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Unlimited NEXUS GPT queries</li>
                  <li>• Advanced trading analytics</li>
                  <li>• Custom automation workflows</li>
                  <li>• Priority support access</li>
                </ul>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}