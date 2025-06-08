// Enhanced ASI → AGI → AI Assistant with OpenAI Integration
// Prevents repetitive responses with contextual intelligence

interface ConversationContext {
  previousResponses: string[];
  userInteractionHistory: Array<{
    timestamp: Date;
    query: string;
    response: string;
    confidence: number;
  }>;
  businessContext: {
    currentGoals: string[];
    activeProjects: string[];
    recentMetrics: any;
  };
}

interface AIResponse {
  response: string;
  confidence: number;
  intelligenceLevel: 'ASI' | 'AGI' | 'AI';
  actionItems?: string[];
  followUpQuestions?: string[];
}

export class EnhancedAIAssistant {
  private context: ConversationContext;
  private openaiApiKey: string;
  
  constructor(openaiApiKey: string) {
    this.openaiApiKey = openaiApiKey;
    this.context = {
      previousResponses: [],
      userInteractionHistory: [],
      businessContext: {
        currentGoals: ['Secure $250K funding', 'Generate immediate ROI', 'Build Fort Worth client base'],
        activeProjects: ['Google My Business integration', 'Puppeteer automation', 'Financial forecasting'],
        recentMetrics: {}
      }
    };
  }

  async generateResponse(query: string, currentData?: any): Promise<AIResponse> {
    // Update business context with current data
    if (currentData) {
      this.context.businessContext.recentMetrics = currentData;
    }

    // Determine intelligence level based on query complexity
    const intelligenceLevel = this.determineIntelligenceLevel(query);
    
    // Generate contextual prompt to prevent repetition
    const prompt = this.buildContextualPrompt(query, intelligenceLevel);
    
    try {
      const response = await this.callOpenAI(prompt);
      const confidence = this.calculateConfidence(query, response, intelligenceLevel);
      
      // Store interaction to prevent future repetition
      this.updateContext(query, response, confidence);
      
      return {
        response,
        confidence,
        intelligenceLevel,
        actionItems: this.extractActionItems(response),
        followUpQuestions: this.generateFollowUpQuestions(query, intelligenceLevel)
      };
    } catch (error) {
      // Fallback to contextual offline response
      return this.generateOfflineResponse(query, intelligenceLevel);
    }
  }

  private determineIntelligenceLevel(query: string): 'ASI' | 'AGI' | 'AI' {
    const strategicKeywords = ['funding', 'strategy', 'market', 'growth', 'revenue', 'competitive'];
    const operationalKeywords = ['process', 'automation', 'workflow', 'task', 'schedule'];
    const analyticalKeywords = ['data', 'metrics', 'analysis', 'report', 'calculate'];
    
    const lowerQuery = query.toLowerCase();
    
    if (strategicKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'ASI'; // Artificial Super Intelligence for strategic decisions
    } else if (operationalKeywords.some(keyword => lowerQuery.includes(keyword))) {
      return 'AGI'; // Artificial General Intelligence for general problem solving
    } else {
      return 'AI'; // Artificial Intelligence for specific analysis
    }
  }

  private buildContextualPrompt(query: string, level: 'ASI' | 'AGI' | 'AI'): string {
    const recentResponses = this.context.previousResponses.slice(-3).join('\n');
    const businessGoals = this.context.businessContext.currentGoals.join(', ');
    
    const levelPrompts = {
      ASI: `You are an ASI (Artificial Super Intelligence) business strategist for DWC Systems LLC. Your focus is strategic planning, funding acquisition, and market domination. Brett and Christina need to secure $250K funding through demonstrable ROI.`,
      AGI: `You are an AGI (Artificial General Intelligence) operations manager for DWC Systems LLC. Your focus is process optimization, automation implementation, and operational efficiency for Fort Worth market.`,
      AI: `You are an AI analyst for DWC Systems LLC. Your focus is data analysis, metrics interpretation, and specific technical solutions for business automation.`
    };

    return `${levelPrompts[level]}

CRITICAL: Never repeat these previous responses:
${recentResponses}

Current business context:
- Goals: ${businessGoals}
- Active projects: ${this.context.businessContext.activeProjects.join(', ')}
- Recent metrics: ${JSON.stringify(this.context.businessContext.recentMetrics)}

User query: "${query}"

Provide a fresh, actionable response with specific next steps. Focus on immediate value for funding presentation. Be concise and avoid repeating previous advice.`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Latest model as per guidelines
        messages: [
          {
            role: 'system',
            content: 'You are an intelligent business automation assistant. Provide concise, actionable advice without repetition.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.6, // Reduces repetition
        frequency_penalty: 0.8  // Further reduces repetition
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  private calculateConfidence(query: string, response: string, level: 'ASI' | 'AGI' | 'AI'): number {
    let baseConfidence = 85;
    
    // Adjust based on intelligence level capabilities
    if (level === 'ASI') baseConfidence = 94;
    else if (level === 'AGI') baseConfidence = 88;
    else baseConfidence = 96;
    
    // Reduce confidence if response seems generic
    if (response.length < 100) baseConfidence -= 10;
    if (this.isResponseSimilarToPrevious(response)) baseConfidence -= 15;
    
    return Math.max(65, Math.min(98, baseConfidence));
  }

  private isResponseSimilarToPrevious(response: string): boolean {
    return this.context.previousResponses.some(prev => {
      const similarity = this.calculateStringSimilarity(response, prev);
      return similarity > 0.7; // 70% similarity threshold
    });
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private extractActionItems(response: string): string[] {
    const actionWords = ['implement', 'create', 'setup', 'configure', 'contact', 'analyze', 'review'];
    const sentences = response.split(/[.!?]+/);
    
    return sentences
      .filter(sentence => actionWords.some(word => sentence.toLowerCase().includes(word)))
      .slice(0, 3)
      .map(item => item.trim())
      .filter(item => item.length > 10);
  }

  private generateFollowUpQuestions(query: string, level: 'ASI' | 'AGI' | 'AI'): string[] {
    const questionSets = {
      ASI: [
        'What specific ROI metrics should we prioritize for the funding presentation?',
        'Which market opportunities in Fort Worth offer the fastest returns?',
        'How should we position against competitors for maximum advantage?'
      ],
      AGI: [
        'What automation should we implement first for immediate efficiency gains?',
        'How can we streamline this process for Christina\'s daily operations?',
        'What integration would provide the best operational value?'
      ],
      AI: [
        'What additional data points would strengthen this analysis?',
        'How can we measure the success of this implementation?',
        'What metrics should we track for continuous improvement?'
      ]
    };

    return questionSets[level].slice(0, 2);
  }

  private generateOfflineResponse(query: string, level: 'ASI' | 'AGI' | 'AI'): AIResponse {
    const offlineResponses = {
      ASI: 'Strategic analysis requires real-time market data. Connect OpenAI API for advanced strategic planning capabilities.',
      AGI: 'Process optimization analysis is enhanced with AI integration. Enable OpenAI API for comprehensive workflow recommendations.',
      AI: 'Data analysis capabilities are limited without AI integration. Configure OpenAI API for detailed insights.'
    };

    return {
      response: offlineResponses[level],
      confidence: 75,
      intelligenceLevel: level,
      actionItems: ['Configure OpenAI API integration'],
      followUpQuestions: ['Would you like to set up OpenAI API for enhanced responses?']
    };
  }

  private updateContext(query: string, response: string, confidence: number): void {
    // Add to interaction history
    this.context.userInteractionHistory.push({
      timestamp: new Date(),
      query,
      response,
      confidence
    });

    // Update previous responses to prevent repetition
    this.context.previousResponses.push(response);
    if (this.context.previousResponses.length > 5) {
      this.context.previousResponses.shift(); // Keep only last 5 responses
    }

    // Keep only last 20 interactions for performance
    if (this.context.userInteractionHistory.length > 20) {
      this.context.userInteractionHistory.shift();
    }
  }

  getSystemStatus(): {
    totalInteractions: number;
    averageConfidence: number;
    intelligenceLevelDistribution: Record<string, number>;
  } {
    const interactions = this.context.userInteractionHistory;
    const totalInteractions = interactions.length;
    const averageConfidence = totalInteractions > 0 
      ? interactions.reduce((sum, int) => sum + int.confidence, 0) / totalInteractions 
      : 0;

    const levelDistribution: Record<string, number> = { ASI: 0, AGI: 0, AI: 0 };
    // This would need to be tracked during actual usage

    return {
      totalInteractions,
      averageConfidence: Math.round(averageConfidence),
      intelligenceLevelDistribution: levelDistribution
    };
  }
}

// Factory function for easy integration
export function createEnhancedAssistant(openaiApiKey?: string): EnhancedAIAssistant {
  if (!openaiApiKey) {
    console.warn('OpenAI API key not provided. Assistant will use limited offline responses.');
    return new EnhancedAIAssistant('');
  }
  return new EnhancedAIAssistant(openaiApiKey);
}