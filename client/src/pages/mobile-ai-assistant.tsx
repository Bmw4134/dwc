import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Send, 
  Brain, 
  Users, 
  Building2, 
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionItems?: ActionItem[];
  leadData?: any;
}

interface ActionItem {
  id: string;
  action: string;
  status: 'pending' | 'completed' | 'failed';
  data?: any;
}

export default function MobileAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const queryClient = useQueryClient();

  // Real-time data queries
  const { data: leads } = useQuery({
    queryKey: ['/api/leads'],
    refetchInterval: 30000
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/dashboard/recent-activity'],
    refetchInterval: 30000
  });

  // AI Processing mutation
  const aiProcessMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest('/api/ai/process-request', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          context: {
            leads: leads || [],
            stats: dashboardStats || {},
            activity: recentActivity || []
          }
        })
      });
      return response;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        actionItems: data.actionItems || [],
        leadData: data.leadData
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Execute any automated actions
      if (data.actionItems) {
        data.actionItems.forEach((item: ActionItem) => {
          executeAction(item);
        });
      }
    }
  });

  // Lead management mutations
  const createLeadMutation = useMutation({
    mutationFn: async (leadData: any) => {
      return await apiRequest('/api/leads', {
        method: 'POST',
        body: JSON.stringify(leadData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return await apiRequest(`/api/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    }
  });

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Welcome to your DWC Systems field assistant! I can help you with:

• Lead management and follow-ups
• Real-time business metrics
• Client communication
• Meeting scheduling
• Market research
• Corporate outreach strategies

What would you like to work on today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      await aiProcessMutation.mutateAsync(text);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAction = async (actionItem: ActionItem) => {
    try {
      switch (actionItem.action) {
        case 'create_lead':
          await createLeadMutation.mutateAsync(actionItem.data);
          break;
        case 'update_lead':
          await updateLeadMutation.mutateAsync(actionItem.data);
          break;
        case 'schedule_followup':
          // Implement scheduling logic
          break;
        case 'send_email':
          // Implement email sending logic
          break;
        default:
          console.log('Unknown action:', actionItem.action);
      }
    } catch (error) {
      console.error('Action execution failed:', error);
    }
  };

  const quickActions = [
    { label: 'Show my leads', command: 'Show me all my current leads and their status' },
    { label: 'Game X Change update', command: 'What\'s the latest on our Game X Change corporate lead?' },
    { label: 'Create new lead', command: 'Help me add a new business lead' },
    { label: 'Today\'s metrics', command: 'Show me today\'s business metrics and KPIs' },
    { label: 'Schedule follow-up', command: 'Help me schedule follow-ups for my leads' },
    { label: 'Market research', command: 'Find potential clients in the gaming retail industry' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-400" />
                <div>
                  <CardTitle className="text-blue-400">DWC Field Assistant</CardTitle>
                  <p className="text-sm text-slate-400">AI-Powered Lead Management</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {leads?.length || 0} Leads
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  Field Ready
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Total Leads</p>
                  <p className="text-lg font-bold text-white">{leads?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Pipeline</p>
                  <p className="text-lg font-bold text-white">${dashboardStats?.totalRevenue?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Qualified</p>
                  <p className="text-lg font-bold text-white">{dashboardStats?.qualifiedLeads || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-400" />
                <div>
                  <p className="text-xs text-slate-400">Active</p>
                  <p className="text-lg font-bold text-white">{dashboardStats?.activeProposals || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start border-slate-600 hover:border-blue-500 hover:bg-blue-900/20"
                  onClick={() => handleSendMessage(action.command)}
                >
                  <Zap className="h-3 w-3 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-700 text-slate-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.actionItems && message.actionItems.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.actionItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 text-xs">
                                {item.status === 'completed' ? (
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                ) : item.status === 'failed' ? (
                                  <AlertCircle className="h-3 w-3 text-red-400" />
                                ) : (
                                  <Clock className="h-3 w-3 text-yellow-400" />
                                )}
                                <span>{item.action}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                        <span className="text-sm">Processing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about leads, schedule meetings, or get business insights..."
                className="flex-1 bg-slate-700 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
              />
              <Button
                size="icon"
                variant="outline"
                className={`border-slate-600 ${isListening ? 'bg-red-600 border-red-500' : 'hover:border-blue-500'}`}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {recognitionRef.current ? (
              <p className="text-xs text-slate-400 mt-2">
                {isListening ? 'Listening... Speak now' : 'Tap microphone for voice input'}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Voice input not supported on this device
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}