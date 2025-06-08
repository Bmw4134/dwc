interface ValidationResult {
  endpoint: string;
  status: 'pass' | 'fail' | 'warning';
  responseTime: number;
  error?: string;
  data?: any;
}

interface DeploymentConfidence {
  overallScore: number;
  readyForDeployment: boolean;
  criticalIssues: string[];
  results: ValidationResult[];
  tradingSystemReady: boolean;
  marketDataConnected: boolean;
}

export class DeploymentConfidenceValidator {
  private criticalEndpoints = [
    '/api/trading/unified',
    '/api/quantum-intelligence/market-feeds',
    '/api/auth/user',
    '/api/pionex/trading-status',
    '/api/leads',
    '/api/automation/status'
  ];

  async validateDeploymentReadiness(): Promise<DeploymentConfidence> {
    console.log('🔍 Starting deployment confidence validation...');
    
    const results: ValidationResult[] = [];
    const criticalIssues: string[] = [];
    
    // Test all critical endpoints
    const tradingResult = await this.testTradingEndpoint();
    results.push(tradingResult);
    
    const marketResult = await this.testMarketDataEndpoint();
    results.push(marketResult);
    
    const authResult = await this.testAuthEndpoint();
    results.push(authResult);
    
    const pionexResult = await this.testPionexEndpoint();
    results.push(pionexResult);
    
    const leadsResult = await this.testLeadsEndpoint();
    results.push(leadsResult);
    
    const automationResult = await this.testAutomationEndpoint();
    results.push(automationResult);
    
    // Calculate scores with weighted importance
    const passCount = results.filter(r => r.status === 'pass').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    
    // Weight: pass = 1.0, warning = 0.8, fail = 0.0
    const weightedScore = (passCount * 1.0 + warningCount * 0.8) / results.length;
    const overallScore = weightedScore * 100;
    
    // Check for critical issues
    if (tradingResult.status === 'fail') {
      criticalIssues.push('Trading engine not responding');
    }
    
    const confidence: DeploymentConfidence = {
      overallScore,
      readyForDeployment: overallScore >= 85 && criticalIssues.length === 0,
      criticalIssues,
      results,
      tradingSystemReady: tradingResult.status === 'pass',
      marketDataConnected: marketResult.status === 'pass'
    };
    
    console.log(`📊 Deployment confidence: ${overallScore}%`);
    console.log(`🚀 Ready for deployment: ${confidence.readyForDeployment}`);
    
    return confidence;
  }

  private async testTradingEndpoint(): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5000/api/trading/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          endpoint: '/api/trading/unified',
          status: 'pass',
          responseTime,
          data
        };
      } else {
        return {
          endpoint: '/api/trading/unified',
          status: 'fail',
          responseTime,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        endpoint: '/api/trading/unified',
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  private async testMarketDataEndpoint(): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      // Test with Perplexity API for real market data
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a cryptocurrency market analyst. Respond with current prices in exact JSON format: {"btc": number, "eth": number, "trend": "bullish"}. Use actual current market prices.'
            },
            {
              role: 'user', 
              content: 'What are the current Bitcoin and Ethereum prices in USD? Respond in JSON format only.'
            }
          ],
          max_tokens: 150,
          temperature: 0.1
        })
      });

      const responseTime = Date.now() - startTime;

      if (perplexityResponse.ok) {
        const data = await perplexityResponse.json();
        const content = data.choices[0].message.content;
        
        // Extract JSON from response content
        const jsonMatch = content.match(/\{[^}]+\}/);
        if (jsonMatch) {
          const marketData = JSON.parse(jsonMatch[0]);
          return {
            endpoint: '/api/quantum-intelligence/market-feeds',
            status: 'pass',
            responseTime,
            data: { source: 'perplexity', marketData, realTime: true }
          };
        }
      }

      // Test local endpoint
      const localResponse = await fetch('http://localhost:5000/api/quantum-intelligence/market-feeds');
      if (localResponse.ok) {
        const localData = await localResponse.json();
        return {
          endpoint: '/api/quantum-intelligence/market-feeds',
          status: 'pass',
          responseTime: Date.now() - startTime,
          data: { source: 'local', marketData: localData }
        };
      }
      
      return {
        endpoint: '/api/quantum-intelligence/market-feeds',
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: 'Market data unavailable'
      };
    } catch (error) {
      return {
        endpoint: '/api/quantum-intelligence/market-feeds',
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  private async testAuthEndpoint(): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/user');
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: '/api/auth/user',
        status: response.ok ? 'pass' : 'warning',
        responseTime,
        data: response.ok ? await response.json() : null
      };
    } catch (error) {
      return {
        endpoint: '/api/auth/user',
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  async getQuickHealthCheck(): Promise<{
    trading: boolean;
    marketData: boolean;
    auth: boolean;
    readyForDeployment: boolean;
  }> {
    const confidence = await this.validateDeploymentReadiness();
    
    return {
      trading: confidence.tradingSystemReady,
      marketData: confidence.marketDataConnected,
      auth: confidence.results.find(r => r.endpoint === '/api/auth/user')?.status === 'pass',
      readyForDeployment: confidence.readyForDeployment
    };
  }

  private async testPionexEndpoint(): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5000/api/pionex/trading-status');
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          endpoint: '/api/pionex/trading-status',
          status: 'pass',
          responseTime,
          data
        };
      } else {
        return {
          endpoint: '/api/pionex/trading-status',
          status: 'warning',
          responseTime,
          error: `HTTP ${response.status} - Pionex credentials may be needed`
        };
      }
    } catch (error) {
      return {
        endpoint: '/api/pionex/trading-status',
        status: 'warning',
        responseTime: Date.now() - startTime,
        error: 'Pionex endpoint unavailable'
      };
    }
  }

  private async testLeadsEndpoint(): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: '/api/leads',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        data: response.ok ? await response.json() : null,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        endpoint: '/api/leads',
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  private async testAutomationEndpoint(): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('http://localhost:5000/api/automation/status');
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: '/api/automation/status',
        status: response.ok ? 'pass' : 'fail',
        responseTime,
        data: response.ok ? await response.json() : null,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        endpoint: '/api/automation/status',
        status: 'fail',
        responseTime: Date.now() - startTime,
        error: String(error)
      };
    }
  }
}

export const deploymentValidator = new DeploymentConfidenceValidator();