import axios from 'axios';

interface ApiTestResult {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  success: boolean;
  errorMessage?: string;
}

interface ValidationResult {
  timestamp: Date;
  totalTests: number;
  successRate: number;
  avgResponseTime: number;
  criticalIssues: string[];
  endpointResults: ApiTestResult[];
  performanceScore: number;
}

export class KateApiStressValidator {
  private baseUrl: string;
  private testResults: ApiTestResult[] = [];

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async runFullValidation(): Promise<ValidationResult> {
    console.log('🚀 Running Kate API Validation Suite...');
    
    this.testResults = [];
    
    // Core endpoints to validate
    const testSuite = [
      { endpoint: '/api/auth/user', method: 'GET' },
      { endpoint: '/api/kate/lead-capture', method: 'POST', data: this.getTestLeadData() },
      { endpoint: '/api/dashboard/stats', method: 'GET' },
      { endpoint: '/api/audit-website', method: 'POST', data: { url: 'https://katewhitephotography.com' } },
      { endpoint: '/api/leads', method: 'GET' },
      { endpoint: '/api/automation/status', method: 'GET' },
      { endpoint: '/api/stress-test/status', method: 'GET' },
    ];

    // Run tests concurrently for realistic load simulation
    const testPromises = testSuite.map(test => this.runApiTest(test));
    
    // Also run sequential load tests
    for (let i = 0; i < 10; i++) {
      testPromises.push(this.runApiTest({ endpoint: '/api/auth/user', method: 'GET' }));
    }

    const results = await Promise.allSettled(testPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        this.testResults.push(result.value);
      } else {
        this.testResults.push({
          endpoint: testSuite[index]?.endpoint || 'unknown',
          method: testSuite[index]?.method || 'GET',
          responseTime: 30000,
          statusCode: 500,
          success: false,
          errorMessage: result.reason?.message || 'Test failed'
        });
      }
    });

    return this.generateValidationReport();
  }

  private async runApiTest(test: { endpoint: string; method: string; data?: any }): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      const config = {
        method: test.method.toLowerCase() as 'get' | 'post',
        url: `${this.baseUrl}${test.endpoint}`,
        timeout: 10000,
        data: test.data,
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: () => true // Don't throw on any status code
      };

      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      return {
        endpoint: test.endpoint,
        method: test.method,
        responseTime,
        statusCode: response.status,
        success: response.status >= 200 && response.status < 400,
        errorMessage: response.status >= 400 ? `HTTP ${response.status}` : undefined
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: test.endpoint,
        method: test.method,
        responseTime,
        statusCode: 0,
        success: false,
        errorMessage: error.code === 'ECONNREFUSED' ? 'Connection refused' : error.message
      };
    }
  }

  private getTestLeadData() {
    return {
      clientName: `Test Client ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      phone: '555-123-4567',
      eventType: 'wedding',
      eventDate: '2025-08-15',
      location: 'Austin, TX',
      guestCount: '150',
      budget: '5000-7500',
      description: 'Beautiful outdoor wedding ceremony and reception',
      communicationPreference: 'email',
      referralSource: 'google',
      urgency: '1-2-weeks'
    };
  }

  private generateValidationReport(): ValidationResult {
    const totalTests = this.testResults.length;
    const successfulTests = this.testResults.filter(r => r.success).length;
    const successRate = (successfulTests / totalTests) * 100;
    const avgResponseTime = this.testResults.reduce((sum, r) => sum + r.responseTime, 0) / totalTests;

    const criticalIssues: string[] = [];
    
    // Identify critical issues
    this.testResults.forEach(result => {
      if (!result.success) {
        criticalIssues.push(`${result.endpoint} failed: ${result.errorMessage || 'Unknown error'}`);
      } else if (result.responseTime > 5000) {
        criticalIssues.push(`${result.endpoint} slow response: ${result.responseTime}ms`);
      }
    });

    // Performance scoring
    let performanceScore = 100;
    
    // Penalize for failures
    performanceScore -= ((totalTests - successfulTests) / totalTests) * 40;
    
    // Penalize for slow responses
    if (avgResponseTime > 2000) performanceScore -= 20;
    else if (avgResponseTime > 1000) performanceScore -= 10;
    
    // Penalize for critical issues
    performanceScore -= Math.min(criticalIssues.length * 5, 30);
    
    performanceScore = Math.max(0, Math.round(performanceScore));

    const report: ValidationResult = {
      timestamp: new Date(),
      totalTests,
      successRate,
      avgResponseTime,
      criticalIssues,
      endpointResults: this.testResults,
      performanceScore
    };

    // Log comprehensive results
    console.log('\n📊 KATE API VALIDATION RESULTS');
    console.log('===============================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Performance Score: ${performanceScore}/100`);
    console.log(`Critical Issues: ${criticalIssues.length}`);
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 Issues Found:');
      criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    console.log('\n📋 Endpoint Performance:');
    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.method} ${result.endpoint}: ${result.responseTime}ms (${result.statusCode})`);
    });

    return report;
  }

  async validateLeadCaptureFlow(): Promise<boolean> {
    console.log('🎯 Validating Kate Lead Capture Flow...');
    
    try {
      // Test lead submission
      const leadData = this.getTestLeadData();
      const response = await axios.post(`${this.baseUrl}/api/kate/lead-capture`, leadData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.status === 200 && response.data.success) {
        console.log('✅ Lead capture flow working correctly');
        return true;
      } else {
        console.log('❌ Lead capture flow failed:', response.data);
        return false;
      }
    } catch (error: any) {
      console.log('❌ Lead capture flow error:', error.message);
      return false;
    }
  }

  async checkSystemHealth(): Promise<{
    apiOnline: boolean;
    authWorking: boolean;
    databaseConnected: boolean;
    allSystemsGo: boolean;
  }> {
    console.log('🏥 Checking Kate System Health...');

    const health = {
      apiOnline: false,
      authWorking: false,
      databaseConnected: false,
      allSystemsGo: false
    };

    try {
      // Check API availability
      const apiResponse = await axios.get(`${this.baseUrl}/api/stress-test/status`, { timeout: 5000 });
      health.apiOnline = apiResponse.status === 200;

      // Check auth system
      const authResponse = await axios.get(`${this.baseUrl}/api/auth/user`, { 
        timeout: 5000,
        validateStatus: () => true 
      });
      health.authWorking = authResponse.status === 200 || authResponse.status === 304;

      // Check database connectivity (through any endpoint that uses it)
      const dbResponse = await axios.get(`${this.baseUrl}/api/leads`, { 
        timeout: 5000,
        validateStatus: () => true 
      });
      health.databaseConnected = dbResponse.status < 500;

      health.allSystemsGo = health.apiOnline && health.authWorking && health.databaseConnected;

      console.log('📊 System Health Status:');
      console.log(`API Online: ${health.apiOnline ? '✅' : '❌'}`);
      console.log(`Auth Working: ${health.authWorking ? '✅' : '❌'}`);
      console.log(`Database Connected: ${health.databaseConnected ? '✅' : '❌'}`);
      console.log(`All Systems: ${health.allSystemsGo ? '🟢 GO' : '🔴 ISSUES'}`);

    } catch (error: any) {
      console.log('❌ Health check failed:', error.message);
    }

    return health;
  }
}

export const kateApiValidator = new KateApiStressValidator();