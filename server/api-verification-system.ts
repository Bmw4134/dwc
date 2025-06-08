/**
 * Internal API Verification System
 * Live testing and monitoring of all DWC Systems APIs
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  expectedStatus: number;
  requiresAuth: boolean;
  testPayload?: any;
  headers?: Record<string, string>;
  lastTested?: Date;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  responseTime?: number;
  errorMessage?: string;
}

export interface ApiTestResult {
  endpoint: string;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
  timestamp: Date;
}

export class ApiVerificationSystem {
  private endpoints: Map<string, ApiEndpoint> = new Map();
  private testResults: ApiTestResult[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeEndpoints();
  }

  private initializeEndpoints() {
    // Core DWC Systems endpoints
    const coreEndpoints: ApiEndpoint[] = [
      {
        id: 'auth_user',
        name: 'User Authentication',
        url: '/api/auth/user',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'nasa_apod',
        name: 'NASA Picture of the Day',
        url: '/api/nasa/apod',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'nasa_earth',
        name: 'NASA Earth Imagery',
        url: '/api/nasa/earth-imagery',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'email_accounts',
        name: 'Email Accounts',
        url: '/api/email/accounts',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'email_insights',
        name: 'Email Insights',
        url: '/api/email/insights',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'email_threats',
        name: 'Email Security Threats',
        url: '/api/email/threats',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'extractor_components',
        name: 'Component Extractor',
        url: '/api/extractor/components',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'extractor_build',
        name: 'Build Status',
        url: '/api/extractor/build-status',
        method: 'GET',
        expectedStatus: 200,
        requiresAuth: false,
        status: 'unknown'
      },
      {
        id: 'domain_register',
        name: 'Domain Registration',
        url: '/api/domain/register',
        method: 'POST',
        expectedStatus: 200,
        requiresAuth: false,
        testPayload: {
          domain: 'test-domain.com',
          businessName: 'Test Business'
        },
        status: 'unknown'
      },
      {
        id: 'email_setup',
        name: 'Email Setup',
        url: '/api/email/setup',
        method: 'POST',
        expectedStatus: 200,
        requiresAuth: false,
        testPayload: {
          domain: 'test-domain.com',
          emailType: 'business'
        },
        status: 'unknown'
      }
    ];

    coreEndpoints.forEach(endpoint => {
      this.endpoints.set(endpoint.id, endpoint);
    });
  }

  async testSingleEndpoint(endpointId: string): Promise<ApiTestResult> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointId} not found`);
    }

    const startTime = Date.now();
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : 'https://your-domain.replit.app';
      
      const url = `${baseUrl}${endpoint.url}`;
      
      let curlCommand = `curl -s -w "%{http_code}:%{time_total}" -o /dev/null`;
      
      if (endpoint.method === 'POST' && endpoint.testPayload) {
        curlCommand += ` -X POST -H "Content-Type: application/json" -d '${JSON.stringify(endpoint.testPayload)}'`;
      }
      
      curlCommand += ` "${url}"`;
      
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr) {
        throw new Error(stderr);
      }
      
      const [statusCode, timeTotal] = stdout.trim().split(':');
      const responseTime = Math.round(parseFloat(timeTotal) * 1000);
      const status = parseInt(statusCode);
      
      const result: ApiTestResult = {
        endpoint: endpointId,
        success: status === endpoint.expectedStatus,
        responseTime,
        statusCode: status,
        timestamp: new Date()
      };
      
      // Update endpoint status
      endpoint.lastTested = new Date();
      endpoint.responseTime = responseTime;
      endpoint.status = result.success ? 'healthy' : 'degraded';
      
      if (!result.success) {
        endpoint.errorMessage = `Expected ${endpoint.expectedStatus}, got ${status}`;
        result.errorMessage = endpoint.errorMessage;
      } else {
        endpoint.errorMessage = undefined;
      }
      
      this.testResults.push(result);
      this.endpoints.set(endpointId, endpoint);
      
      return result;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const result: ApiTestResult = {
        endpoint: endpointId,
        success: false,
        responseTime,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
      
      // Update endpoint status
      endpoint.lastTested = new Date();
      endpoint.responseTime = responseTime;
      endpoint.status = 'down';
      endpoint.errorMessage = result.errorMessage;
      
      this.testResults.push(result);
      this.endpoints.set(endpointId, endpoint);
      
      return result;
    }
  }

  async testAllEndpoints(): Promise<ApiTestResult[]> {
    const results: ApiTestResult[] = [];
    
    for (const [endpointId] of this.endpoints) {
      try {
        const result = await this.testSingleEndpoint(endpointId);
        results.push(result);
      } catch (error) {
        results.push({
          endpoint: endpointId,
          success: false,
          responseTime: 0,
          errorMessage: error instanceof Error ? error.message : 'Test failed',
          timestamp: new Date()
        });
      }
    }
    
    return results;
  }

  startMonitoring(intervalMinutes: number = 5): void {
    if (this.isMonitoring) {
      this.stopMonitoring();
    }
    
    this.isMonitoring = true;
    
    // Initial test
    this.testAllEndpoints().then(() => {
      console.log('Initial API health check completed');
    });
    
    // Set up interval testing
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.testAllEndpoints();
        console.log(`API monitoring cycle completed at ${new Date().toISOString()}`);
      } catch (error) {
        console.error('API monitoring error:', error);
      }
    }, intervalMinutes * 60 * 1000);
    
    console.log(`API monitoring started with ${intervalMinutes} minute intervals`);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('API monitoring stopped');
  }

  addCustomEndpoint(endpoint: Omit<ApiEndpoint, 'lastTested' | 'status' | 'responseTime' | 'errorMessage'>): void {
    const newEndpoint: ApiEndpoint = {
      ...endpoint,
      status: 'unknown'
    };
    
    this.endpoints.set(endpoint.id, newEndpoint);
    console.log(`Added custom endpoint: ${endpoint.name}`);
  }

  removeEndpoint(endpointId: string): boolean {
    return this.endpoints.delete(endpointId);
  }

  getEndpointStatus(endpointId: string): ApiEndpoint | undefined {
    return this.endpoints.get(endpointId);
  }

  getAllEndpoints(): ApiEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  getHealthSummary(): {
    total: number;
    healthy: number;
    degraded: number;
    down: number;
    unknown: number;
    overallHealth: number;
  } {
    const endpoints = Array.from(this.endpoints.values());
    const total = endpoints.length;
    
    const counts = endpoints.reduce((acc, endpoint) => {
      acc[endpoint.status]++;
      return acc;
    }, { healthy: 0, degraded: 0, down: 0, unknown: 0 });
    
    const overallHealth = total > 0 ? Math.round((counts.healthy / total) * 100) : 0;
    
    return {
      total,
      ...counts,
      overallHealth
    };
  }

  getRecentResults(limit: number = 50): ApiTestResult[] {
    return this.testResults
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  isCurrentlyMonitoring(): boolean {
    return this.isMonitoring;
  }

  generateHealthReport(): {
    timestamp: Date;
    summary: ReturnType<typeof this.getHealthSummary>;
    endpoints: ApiEndpoint[];
    recentTests: ApiTestResult[];
  } {
    return {
      timestamp: new Date(),
      summary: this.getHealthSummary(),
      endpoints: this.getAllEndpoints(),
      recentTests: this.getRecentResults(20)
    };
  }
}

export const apiVerificationSystem = new ApiVerificationSystem();