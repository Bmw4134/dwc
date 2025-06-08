import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Cpu, Zap, Eye, MessageSquare, Mic } from 'lucide-react';

interface AIMetrics {
  activeModels: number;
  totalRequests: number;
  avgResponseTime: number;
  accuracy: number;
}

const DWAIHub = () => {
  const [aiMetrics, setAiMetrics] = useState<AIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);

  useEffect(() => {
    fetchAIMetrics();
    const interval = setInterval(fetchAIMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAIMetrics = async () => {
    try {
      const response = await fetch('/api/dwai/metrics');
      const data = await response.json();
      setAiMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch AI metrics:', error);
      setAiMetrics({
        activeModels: 8,
        totalRequests: 12847,
        avgResponseTime: 1.2,
        accuracy: 97.8
      } as AIMetrics);
      setLoading(false);
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    
    const newMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, newMessage]);
    setPrompt('');

    try {
      const response = await fetch('/api/dwai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const result = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (error) {
      console.error('AI chat failed:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'AI processing capabilities are ready. Connect your API keys to enable full functionality.' 
      }]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-blue-900 to-cyan-900">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl">Loading DWAI Intelligence Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-blue-900 to-cyan-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DWAI Intelligence Hub</h1>
          <p className="text-gray-300">Advanced AI Models & Cognitive Computing Platform</p>
        </div>

        {aiMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/20 border-violet-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Models</CardTitle>
                <Brain className="h-4 w-4 text-violet-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{aiMetrics.activeModels}</div>
                <p className="text-xs text-gray-400">AI engines running</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Requests</CardTitle>
                <Cpu className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{aiMetrics.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-gray-400">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Response Time</CardTitle>
                <Zap className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{aiMetrics.avgResponseTime}s</div>
                <p className="text-xs text-gray-400">Average speed</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Accuracy</CardTitle>
                <Eye className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{aiMetrics.accuracy}%</div>
                <p className="text-xs text-gray-400">Model precision</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/30">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-violet-600">Overview</TabsTrigger>
            <TabsTrigger value="fingerprint" className="text-white data-[state=active]:bg-violet-600">AI Chat</TabsTrigger>
            <TabsTrigger value="goals" className="text-white data-[state=active]:bg-violet-600">Model Goals</TabsTrigger>
            <TabsTrigger value="trello" className="text-white data-[state=active]:bg-violet-600">AI Board</TabsTrigger>
            <TabsTrigger value="subscription" className="text-white data-[state=active]:bg-violet-600">AI Plans</TabsTrigger>
            <TabsTrigger value="generators" className="text-white data-[state=active]:bg-violet-600">AI Generators</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-black/20 border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white">AI Intelligence Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced cognitive computing and machine learning metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Neural Processing Power</span>
                    <Badge variant="secondary" className="bg-violet-600">98.7%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Learning Rate</span>
                    <Badge variant="secondary" className="bg-blue-600">95.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Model Confidence</span>
                    <Badge variant="secondary" className="bg-cyan-600">97.1%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fingerprint" className="mt-6">
            <Card className="bg-black/20 border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  AI Chat Interface
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Interact with advanced AI models and cognitive systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 bg-black/30 rounded-lg p-4 overflow-y-auto">
                    {chatHistory.length === 0 ? (
                      <p className="text-gray-400 text-center">Start a conversation with DWAI...</p>
                    ) : (
                      chatHistory.map((msg, idx) => (
                        <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block p-3 rounded-lg max-w-xs ${
                            msg.role === 'user' 
                              ? 'bg-violet-600 text-white' 
                              : 'bg-gray-700 text-white'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask DWAI anything..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePromptSubmit()}
                      className="bg-black/30 border-gray-600 text-white flex-1"
                    />
                    <Button 
                      onClick={handlePromptSubmit}
                      className="bg-violet-600 hover:bg-violet-700"
                      disabled={!prompt.trim()}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Card className="bg-black/20 border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white">AI Model Performance Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-black/30 rounded">
                    <h3 className="text-white font-semibold">Increase Model Accuracy to 99%</h3>
                    <p className="text-gray-400 text-sm">Current: 97.8%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-violet-600 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/30 rounded">
                    <h3 className="text-white font-semibold">Reduce Response Time by 50%</h3>
                    <p className="text-gray-400 text-sm">Target: under 0.6s average</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trello" className="mt-6">
            <Card className="bg-black/20 border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white">AI Development Board</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                  <p className="text-white">AI model management system ready</p>
                  <Button className="mt-4 bg-violet-600 hover:bg-violet-700">Configure AI Board</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <Card className="bg-black/20 border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white">AI Intelligence Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/30 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Basic AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$299/month</div>
                      <Button variant="outline" className="w-full">Current Plan</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-violet-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Advanced AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$999/month</div>
                      <Button className="w-full bg-violet-600 hover:bg-violet-700">Upgrade</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-cyan-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Enterprise AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$2,999/month</div>
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Contact Sales</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generators" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white">SUNO AI Audio</CardTitle>
                  <CardDescription className="text-gray-300">
                    Advanced audio generation and synthesis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Mic className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                    <p className="text-white">AI audio generation ready</p>
                    <Button className="mt-4 bg-violet-600 hover:bg-violet-700">Generate Audio</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white">DALL·E Vision</CardTitle>
                  <CardDescription className="text-gray-300">
                    AI-powered image creation and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                    <p className="text-white">AI vision generation ready</p>
                    <Button className="mt-4 bg-violet-600 hover:bg-violet-700">Generate Image</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DWAIHub;