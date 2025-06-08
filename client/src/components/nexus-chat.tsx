import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  Zap, 
  Sparkles, 
  User, 
  Bot,
  AlertCircle,
  Crown
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function NexusChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to NEXUS GPT! I'm your AI business intelligence assistant powered by DWC Systems. I can help you with:

• Lead generation strategies
• Market analysis and insights  
• Business automation planning
• Industry trend analysis
• ROI calculations and projections

You have 20 free prompts to explore my capabilities. What would you like to discuss?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || promptCount >= 20) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setPromptCount(data.promptsLeft ? 20 - data.promptsLeft : promptCount + 1);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact our support team for assistance.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNexusResponse = async (userInput: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    const input = userInput.toLowerCase();
    
    // Business intelligence responses based on NEXUS capabilities
    if (input.includes('lead') || input.includes('prospect')) {
      return `Based on DWC Systems' lead generation engine, here's my analysis:

**Current Market Opportunities:**
• Gaming retail sector showing 340% growth potential (ref: Game X Change pipeline)
• Photography services market expanding 25% annually
• Corporate services demand up 180% post-pandemic

**NEXUS Recommendation:**
Focus on high-value prospects in gaming/retail with $2M+ potential. Our quantum behavior simulation indicates 89% success probability for enterprise clients.

**Actionable Next Steps:**
1. Target companies with recent funding rounds
2. Focus on Q4 budget allocation periods
3. Leverage visual intelligence for competitive analysis

Would you like me to analyze a specific industry or provide lead scoring criteria?`;
    }

    if (input.includes('market') || input.includes('industry') || input.includes('trend')) {
      return `**NEXUS Market Intelligence Report:**

**Trending Sectors (Live Analysis):**
🔥 Gaming & Entertainment: $2.5M average deal size
📈 Retail Technology: 277% ROI potential identified
🚀 Corporate Automation: $120K+ monthly opportunities

**Market Dynamics:**
• B2B automation spending up 45% YoY
• Decision cycles shortened by 60% with AI-driven insights
• SMB market showing $15K average project values

**Strategic Insight:**
Companies adopting AI-first approaches see 3x faster growth. Current market timing favors automation solutions with proven ROI metrics.

**NEXUS Prediction:**
Next 6 months optimal for enterprise sales cycles. Focus on Q1 budget planning conversations.

Need specific industry deep-dive analysis?`;
    }

    if (input.includes('roi') || input.includes('revenue') || input.includes('money') || input.includes('cost')) {
      return `**DWC Systems ROI Analysis:**

**Proven Performance Metrics:**
• Current platform ROI: 277% (verified)
• Average deal closure: 33.3% conversion rate
• Pipeline velocity: $2.66M active opportunities

**Investment Scenarios:**
💰 **Starter Investment ($10K):**
   - Expected return: $27,700 (6-month projection)
   - Lead volume: 15-25 qualified prospects
   - Automation level: 60%

💎 **Growth Investment ($50K):**
   - Expected return: $138,500 (6-month projection)  
   - Lead volume: 75-100 qualified prospects
   - Automation level: 85%

🏆 **Enterprise Investment ($100K+):**
   - Expected return: $277K+ (6-month projection)
   - Unlimited lead discovery
   - 100% automation with NEXUS Intelligence

**Cost-Benefit Analysis:**
Traditional sales teams: $180K/year per rep
NEXUS automation: $50K setup, unlimited capacity

Want detailed ROI projections for your specific use case?`;
    }

    if (input.includes('automation') || input.includes('ai') || input.includes('nexus')) {
      return `**NEXUS Automation Intelligence:**

**Current System Capabilities:**
🧠 **Quantum Behavior Simulation:** 97.3% prediction accuracy
⚡ **Watson Integration:** Real-time decision processing
🎯 **Visual Intelligence:** Pattern recognition across industries
🔄 **Auto-Lead Discovery:** Unlimited prospect identification

**Automation Levels Available:**
• **Basic (60%):** Email sequences, lead scoring
• **Advanced (85%):** Multi-channel outreach, AI follow-ups  
• **NEXUS Pro (100%):** Full autonomous pipeline management

**Live Performance Data:**
- System health: 99.5% uptime
- Processing speed: 847 leads/hour capacity
- Decision accuracy: 96.8% success rate

**Unique Differentiator:**
Our quantum behavior simulation predicts prospect actions before they happen, enabling pre-emptive strategy adjustments.

**Integration Options:**
✓ CRM systems (Salesforce, HubSpot)
✓ Communication platforms (Slack, Teams)
✓ Analytics dashboards (custom API)

Ready to see specific automation workflows for your industry?`;
    }

    // Default intelligent response
    return `**NEXUS Analysis Complete:**

I've processed your query through our business intelligence engine. Here's what I can help you with:

**Available Capabilities:**
🔍 **Market Research:** Real-time industry analysis
📊 **Lead Intelligence:** Prospect identification and scoring  
💡 **Strategy Planning:** ROI-optimized business recommendations
🎯 **Competitive Analysis:** Market positioning insights
📈 **Growth Projections:** Data-driven forecasting

**Live System Status:**
• NEXUS Intelligence: OPERATIONAL
• Lead Discovery Engine: ACTIVE  
• Quantum Analysis: RUNNING
• Watson Integration: SYNCHRONIZED

Based on DWC Systems' $2.66M active pipeline and 277% proven ROI, I can provide specific insights for your business challenges.

**What would you like to explore?**
- Specific industry analysis
- Lead generation strategies  
- Automation implementation plans
- ROI projections for your sector

*${20 - promptCount} prompts remaining in your free trial.*`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-bold text-lg">NEXUS GPT</h3>
              <p className="text-blue-100 text-sm">Business Intelligence Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {20 - promptCount} free prompts left
            </Badge>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <Bot className="w-5 h-5 mt-1 text-blue-600" />
                )}
                {message.role === 'user' && (
                  <User className="w-5 h-5 mt-1 text-white" />
                )}
                <div className="flex-1">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {message.content}
                  </pre>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl p-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-gray-600">NEXUS is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        {promptCount >= 20 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Free prompts exhausted</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              Upgrade to continue chatting with unlimited NEXUS GPT access
            </p>
            <Button 
              onClick={() => window.location.href = '/dwc-login'}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white text-sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask NEXUS about lead generation, market analysis, ROI projections..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Zap className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}