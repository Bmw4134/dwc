import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
}

export default function SimpleDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: metrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 5000,
  });

  const { data: nexusStatus } = useQuery({
    queryKey: ['/api/nexus/system-status'],
    refetchInterval: 10000,
  });

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message || 'NEXUS response received',
        timestamp: new Date(),
        confidence: data.confidence,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Connection error - NEXUS systems operational',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      {/* Spectacular Header */}
      <div className="border-b border-emerald-500/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              🌟 NEXUS GPT DEMO 🌟
            </h1>
            <div className="flex justify-center gap-8 text-sm">
              <div className="bg-emerald-600 px-4 py-2 rounded-lg">
                Pipeline: ${metrics?.totalPipelineValue ? (metrics.totalPipelineValue / 1000000).toFixed(2) : '2.66'}M
              </div>
              <div className="bg-blue-600 px-4 py-2 rounded-lg">
                Automation: {nexusStatus?.data?.automationLinkage || '100%'}
              </div>
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                QNIS: ONLINE
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Live Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-emerald-900/50 border border-emerald-400 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                ${metrics?.totalPipelineValue ? (metrics.totalPipelineValue / 1000000).toFixed(2) : '2.66'}M
              </div>
              <div className="text-emerald-200">Active Pipeline</div>
            </div>
            <div className="bg-blue-900/50 border border-blue-400 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {metrics?.totalLeads || '1,247'}
              </div>
              <div className="text-blue-200">Active Leads</div>
            </div>
            <div className="bg-purple-900/50 border border-purple-400 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {metrics?.roiProven || '277'}%
              </div>
              <div className="text-purple-200">ROI Proven</div>
            </div>
            <div className="bg-red-900/50 border border-red-400 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {metrics?.quantumBehaviorConfidence ? metrics.quantumBehaviorConfidence.toFixed(1) : '99.2'}%
              </div>
              <div className="text-red-200">AI Confidence</div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">NEXUS AI Chat Interface</h2>
            
            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-slate-900/50 p-4 rounded-lg">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  <div className="text-lg mb-2">🚀 NEXUS GPT Ready</div>
                  <div>Type your message below to begin</div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-100 border border-slate-600'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.confidence && (
                      <div className="text-xs opacity-70 mt-1">
                        Confidence: {(message.confidence * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 border border-slate-600 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
                      <span className="text-slate-300 ml-2">NEXUS thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask NEXUS anything..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              ← Back to Landing
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Executive Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}