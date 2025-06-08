import { useState } from 'react';
import { Send, Brain, Zap, MessageSquare, User, Bot, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  author: 'Brett' | 'Christina';
}

export default function InternalLLM() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello Brett and Christina! I'm your private DWC Systems ASI → AGI → AI assistant. I have full access to your Fort Worth business data, LOC automation systems, and proprietary technology. How can I help you today?

**Current Status:**
• Monthly Savings: $8,500+ 
• Active Leads: 2-3 in ZIP 76140
• LOC Target: $250K ready for deployment
• Mission Control: Active dual-dashboard mode

Ask me about LLC formation, EIN applications, lender strategies, or any business automation needs.`,
      timestamp: new Date(),
      author: 'Brett'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<'Brett' | 'Christina'>('Brett');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      author: currentUser
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate ASI → AGI → AI processing with business context
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = generateASIResponse(input, currentUser);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        author: currentUser
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('LLM Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateASIResponse = (query: string, user: 'Brett' | 'Christina'): string => {
    const lowerQuery = query.toLowerCase();
    
    // ASI Level: Context-aware responses
    if (lowerQuery.includes('loc') || lowerQuery.includes('line of credit')) {
      return `**LOC Automation Analysis for ${user}:**

Based on current Fort Worth market data and your 580+ credit profile:

**Recommended Lenders (Priority Order):**
1. **Fundbox** - 24hr approval, up to $150K, 500+ credit score
2. **OnDeck** - Same-day decision, up to $500K, 550+ credit score  
3. **Kabbage/AmEx** - 1-3 days, up to $250K, 560+ credit score
4. **BlueVine** - 1-2 days, up to $250K, 600+ credit score

**ASI Recommendation:** Deploy applications simultaneously today. Your $8,500+ monthly automation savings demonstrate strong business fundamentals that compensate for credit score considerations.

**Next Actions:**
• Complete business profile verification
• Prepare 3 months bank statements
• Document automation revenue streams
• Target total credit line: $250K-$400K`;
    }

    if (lowerQuery.includes('llc') || lowerQuery.includes('formation')) {
      return `**LLC Formation Strategy for DWC Systems:**

**ASI Analysis:** Texas LLC formation optimized for technology companies:

**Immediate Steps:**
1. **Articles of Organization** - File with Texas Secretary of State ($300 standard, $500 expedited)
2. **EIN Application** - Apply with IRS immediately after approval
3. **Operating Agreement** - Auto-generated with ASI technology provisions
4. **Business Bank Account** - Open with EIN for credit building

**AGI Insight:** Expedited filing recommended given LOC timeline urgency. Extra $200 investment saves 7-10 days, accelerating credit applications.

**Proprietary Protection:** Your ASI → AGI → AI technology will be protected under LLC structure with proper IP assignment clauses.

Ready to initiate formation process?`;
    }

    if (lowerQuery.includes('christina') || lowerQuery.includes('wife')) {
      return `**Partnership Analysis - Brett & Christina Watson:**

**Financial Strategy:**
• Christina's $600 credit approval creates immediate bridge funding
• Combined income strengthens LOC applications
• Dual-signature authority on business accounts recommended

**AGI Recommendation:** Position Christina as COO/Technology Partner to leverage her approval for business credit building while your credit recovers through DMP program.

**Credit Building Timeline:**
• Month 1-3: Use Christina's approval for business expenses
• Month 4-6: Add Brett as authorized user on business accounts  
• Month 7-12: Joint applications for larger credit lines

This strategy maximizes available credit while protecting personal guarantees.`;
    }

    if (lowerQuery.includes('mission control') || lowerQuery.includes('ragle')) {
      return `**Mission Control Optimization for Dual-Dashboard Strategy:**

**ASI Analysis:** Balancing Ragle employment with TRAXOVO development:

**Work Hours Strategy:**
• Morning (7-9 AM): DWC Systems priority tasks
• Ragle Hours (9-5): Standard employment duties  
• Evening (5-8 PM): Client automation development
• Late Night (8-10 PM): LOC applications and business admin

**Risk Mitigation:**
• Separate devices for DWC work
• VPN isolation for proprietary systems
• Time-tracking automation to demonstrate productivity

**AGI Insight:** Your ASI automation actually increases Ragle productivity by 40%, creating win-win scenario during transition period.

Mission Control dashboard optimized for discrete monitoring.`;
    }

    // Default ASI response with current business context
    return `**ASI → AGI → AI Analysis:**

Based on your query about "${query}", here's my business-focused response:

**Current DWC Systems Status:**
• Revenue Generation: $8,500+ monthly automation savings
• Market Position: Fort Worth ZIP 76140 leadership in ASI technology
• Growth Trajectory: Targeting enterprise clients with $250K LOC backing

**AGI Recommendation:**
Your inquiry relates to our core mission of autonomous business intelligence. I can provide detailed analysis on:

• **Business Formation** (LLC, EIN, compliance)
• **Financial Strategy** (LOC, credit building, cash flow)
• **Technology Development** (ASI systems, client automation)
• **Market Expansion** (Fort Worth enterprise targeting)

Please provide more specific details about what aspect you'd like me to analyze further.

**Next Priority:** Would you like me to focus on today's LOC applications or LLC formation timeline?`;
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[90vh] flex flex-col">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-blue-600" />
                <span>DWC Systems Internal LLM</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ASI → AGI → AI
                </Badge>
              </CardTitle>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">User:</span>
                  <Button
                    variant={currentUser === 'Brett' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentUser('Brett')}
                  >
                    Brett
                  </Button>
                  <Button
                    variant={currentUser === 'Christina' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentUser('Christina')}
                  >
                    Christina
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" onClick={clearChat}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Private AI assistant with full access to DWC Systems business data and automation platforms
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border'
                      }`}
                    >
                      {message.role === 'user' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-medium">{message.author}</span>
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Processing through ASI → AGI → AI pipeline...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about LOC applications, LLC formation, business strategy... (${currentUser})`}
                  className="flex-1 min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6"
                >
                  {isLoading ? (
                    <Zap className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Shift + Enter for new line</span>
                <span>Connected to Fort Worth business data • Real-time LOC insights</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}