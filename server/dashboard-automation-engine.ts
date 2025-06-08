import puppeteer, { Browser, Page } from 'puppeteer';
import { spawn, ChildProcess } from 'child_process';

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  steps: AutomationStep[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  results?: any;
}

export interface AutomationStep {
  id: string;
  type: 'navigate' | 'click' | 'type' | 'wait' | 'extract' | 'api_call' | 'ai_prompt';
  selector?: string;
  value?: string;
  url?: string;
  endpoint?: string;
  prompt?: string;
  timeout?: number;
  expectedResult?: string;
}

export interface DashboardSession {
  id: string;
  browser: Browser;
  page: Page;
  baseUrl: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export class DashboardAutomationEngine {
  private sessions: Map<string, DashboardSession> = new Map();
  private activeTasks: Map<string, AutomationTask> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async createAutomationSession(): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🚀 Creating new dashboard automation session...');
    
    const browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set up page monitoring
    await this.setupPageMonitoring(page);
    
    const session: DashboardSession = {
      id: sessionId,
      browser,
      page,
      baseUrl: this.baseUrl,
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);
    
    console.log(`✅ Dashboard session created: ${sessionId}`);
    return sessionId;
  }

  private async setupPageMonitoring(page: Page): Promise<void> {
    // Monitor console logs
    page.on('console', (msg) => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });

    // Monitor network requests
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        console.log(`[API Request] ${request.method()} ${request.url()}`);
      }
    });

    // Monitor page errors
    page.on('pageerror', (error) => {
      console.error(`[Page Error] ${error.message}`);
    });
  }

  async executeFullAutomationWorkflow(sessionId: string): Promise<AutomationTask> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const taskId = `task_${Date.now()}`;
    const task: AutomationTask = {
      id: taskId,
      name: 'Complete Dashboard Automation',
      description: 'Full end-to-end automation workflow',
      status: 'running',
      progress: 0,
      startTime: new Date(),
      steps: [
        {
          id: 'navigate_dashboard',
          type: 'navigate',
          url: this.baseUrl,
          timeout: 10000
        },
        {
          id: 'start_qq_trading',
          type: 'click',
          selector: 'button:contains("Start QQ Trading")',
          timeout: 5000
        },
        {
          id: 'navigate_quantum_intelligence',
          type: 'navigate',
          url: `${this.baseUrl}/quantum-intelligence`,
          timeout: 10000
        },
        {
          id: 'trigger_market_analysis',
          type: 'click',
          selector: '[data-testid="market-analysis-trigger"]',
          timeout: 5000
        },
        {
          id: 'scan_local_businesses',
          type: 'api_call',
          endpoint: '/api/business/scan-free-sources',
          value: JSON.stringify({
            location: 'Fort Worth, TX',
            businessTypes: ['restaurant', 'retail', 'healthcare', 'professional_services']
          })
        },
        {
          id: 'generate_lead_insights',
          type: 'ai_prompt',
          prompt: 'Analyze the scanned businesses and generate lead qualification insights',
          timeout: 30000
        },
        {
          id: 'create_automation_plan',
          type: 'api_call',
          endpoint: '/api/automation/create-plan',
          value: JSON.stringify({
            scope: 'full_pipeline',
            target: 'business_optimization'
          })
        },
        {
          id: 'execute_stress_testing',
          type: 'api_call',
          endpoint: '/api/stress-test/run-comprehensive',
          timeout: 60000
        },
        {
          id: 'validate_system_health',
          type: 'api_call',
          endpoint: '/api/system/health-check',
          timeout: 10000
        },
        {
          id: 'generate_final_report',
          type: 'extract',
          selector: '[data-testid="automation-results"]',
          timeout: 15000
        }
      ]
    };

    this.activeTasks.set(taskId, task);

    try {
      await this.executeTaskSteps(session, task);
      task.status = 'completed';
      task.endTime = new Date();
      console.log('🎉 Full automation workflow completed successfully');
    } catch (error) {
      task.status = 'failed';
      task.endTime = new Date();
      console.error('❌ Automation workflow failed:', error);
      throw error;
    }

    return task;
  }

  private async executeTaskSteps(session: DashboardSession, task: AutomationTask): Promise<void> {
    const { page } = session;
    const totalSteps = task.steps.length;

    for (let i = 0; i < task.steps.length; i++) {
      const step = task.steps[i];
      console.log(`📝 Executing step ${i + 1}/${totalSteps}: ${step.id}`);

      try {
        await this.executeStep(page, step);
        task.progress = ((i + 1) / totalSteps) * 100;
        
        // Update last activity
        session.lastActivity = new Date();
        
        // Brief pause between steps
        await this.delay(1000);
        
      } catch (error) {
        console.error(`❌ Step ${step.id} failed:`, error);
        throw new Error(`Step ${step.id} failed: ${error.message}`);
      }
    }
  }

  private async executeStep(page: Page, step: AutomationStep): Promise<any> {
    switch (step.type) {
      case 'navigate':
        console.log(`🔗 Navigating to: ${step.url}`);
        await page.goto(step.url!, { waitUntil: 'networkidle2', timeout: step.timeout });
        break;

      case 'click':
        console.log(`👆 Clicking: ${step.selector}`);
        await page.waitForSelector(step.selector!, { timeout: step.timeout });
        await page.click(step.selector!);
        break;

      case 'type':
        console.log(`⌨️ Typing in: ${step.selector}`);
        await page.waitForSelector(step.selector!, { timeout: step.timeout });
        await page.type(step.selector!, step.value!);
        break;

      case 'wait':
        console.log(`⏱️ Waiting for: ${step.selector || step.timeout + 'ms'}`);
        if (step.selector) {
          await page.waitForSelector(step.selector, { timeout: step.timeout });
        } else {
          await this.delay(step.timeout || 1000);
        }
        break;

      case 'extract':
        console.log(`📤 Extracting data from: ${step.selector}`);
        await page.waitForSelector(step.selector!, { timeout: step.timeout });
        const extractedData = await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          return element ? element.textContent : null;
        }, step.selector!);
        return extractedData;

      case 'api_call':
        console.log(`🔌 Making API call to: ${step.endpoint}`);
        const response = await fetch(`${this.baseUrl}${step.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: step.value
        });
        const result = await response.json();
        console.log(`📊 API Response:`, result);
        return result;

      case 'ai_prompt':
        console.log(`🧠 AI Processing: ${step.prompt}`);
        // In a real implementation, this would call your AI service
        await this.delay(2000); // Simulate AI processing time
        return { ai_response: 'Processed successfully', insights: 'Generated insights' };

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  async runBusinessScanAutomation(sessionId: string, location: string): Promise<AutomationTask> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const taskId = `business_scan_${Date.now()}`;
    const task: AutomationTask = {
      id: taskId,
      name: 'Business Scan Automation',
      description: `Automated business scanning for ${location}`,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      steps: [
        {
          id: 'navigate_to_business_scanner',
          type: 'navigate',
          url: `${this.baseUrl}/quantum-intelligence`,
          timeout: 10000
        },
        {
          id: 'trigger_business_scan',
          type: 'api_call',
          endpoint: '/api/business/scan-free-sources',
          value: JSON.stringify({
            location: location,
            businessTypes: ['restaurant', 'retail', 'healthcare', 'professional_services', 'construction', 'beauty']
          })
        },
        {
          id: 'analyze_results',
          type: 'ai_prompt',
          prompt: `Analyze the business scan results for ${location} and identify high-value prospects`,
          timeout: 30000
        },
        {
          id: 'generate_lead_report',
          type: 'api_call',
          endpoint: '/api/leads/generate-report',
          value: JSON.stringify({ location: location })
        }
      ]
    };

    this.activeTasks.set(taskId, task);

    try {
      await this.executeTaskSteps(session, task);
      task.status = 'completed';
      task.endTime = new Date();
    } catch (error) {
      task.status = 'failed';
      task.endTime = new Date();
      throw error;
    }

    return task;
  }

  async runTradingAutomation(sessionId: string): Promise<AutomationTask> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const taskId = `trading_automation_${Date.now()}`;
    const task: AutomationTask = {
      id: taskId,
      name: 'QQ Trading Automation',
      description: 'Automated trading setup and monitoring',
      status: 'running',
      progress: 0,
      startTime: new Date(),
      steps: [
        {
          id: 'navigate_to_trading',
          type: 'navigate',
          url: `${this.baseUrl}/qq-trading`,
          timeout: 10000
        },
        {
          id: 'start_trading_engine',
          type: 'api_call',
          endpoint: '/api/qq-trading/start',
          timeout: 15000
        },
        {
          id: 'monitor_portfolio',
          type: 'api_call',
          endpoint: '/api/qq-trading/portfolio',
          timeout: 10000
        },
        {
          id: 'check_signals',
          type: 'api_call',
          endpoint: '/api/qq-trading/signals',
          timeout: 10000
        },
        {
          id: 'validate_trading_health',
          type: 'wait',
          timeout: 5000
        }
      ]
    };

    this.activeTasks.set(taskId, task);

    try {
      await this.executeTaskSteps(session, task);
      task.status = 'completed';
      task.endTime = new Date();
    } catch (error) {
      task.status = 'failed';
      task.endTime = new Date();
      throw error;
    }

    return task;
  }

  async getSessionStatus(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { exists: false };
    }

    return {
      exists: true,
      id: session.id,
      isActive: session.isActive,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      currentUrl: await session.page.url()
    };
  }

  async getTaskStatus(taskId: string): Promise<AutomationTask | null> {
    return this.activeTasks.get(taskId) || null;
  }

  async getAllActiveTasks(): Promise<AutomationTask[]> {
    return Array.from(this.activeTasks.values());
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.browser.close();
      this.sessions.delete(sessionId);
      console.log(`🔚 Session ${sessionId} closed`);
    }
  }

  async closeAllSessions(): Promise<void> {
    for (const [sessionId, session] of this.sessions) {
      await session.browser.close();
      this.sessions.delete(sessionId);
    }
    console.log('🔚 All automation sessions closed');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const dashboardAutomation = new DashboardAutomationEngine();