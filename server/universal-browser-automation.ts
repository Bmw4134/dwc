import puppeteer, { Browser, Page } from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface BrowserConfig {
  headless?: boolean | 'new';
  args?: string[];
  executablePath?: string;
  timeout?: number;
}

export interface AutomationSession {
  id: string;
  browser: Browser;
  page: Page;
  url: string;
  status: 'active' | 'idle' | 'error';
  lastActivity: Date;
}

export class UniversalBrowserAutomation {
  private static instance: UniversalBrowserAutomation;
  private sessions: Map<string, AutomationSession> = new Map();
  private defaultConfig: BrowserConfig;

  constructor() {
    this.defaultConfig = this.detectOptimalConfig();
  }

  static getInstance(): UniversalBrowserAutomation {
    if (!UniversalBrowserAutomation.instance) {
      UniversalBrowserAutomation.instance = new UniversalBrowserAutomation();
    }
    return UniversalBrowserAutomation.instance;
  }

  private detectOptimalConfig(): BrowserConfig {
    // Try to find the best Chrome/Chromium installation
    const possiblePaths = [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
      process.env.PUPPETEER_EXECUTABLE_PATH
    ].filter(Boolean);

    for (const executablePath of possiblePaths) {
      if (fs.existsSync(executablePath!)) {
        return {
          headless: true,
          executablePath,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ],
          timeout: 30000
        };
      }
    }

    // Fallback configuration
    return {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      timeout: 30000
    };
  }

  async createSession(url: string, config?: Partial<BrowserConfig>): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const browserConfig = { ...this.defaultConfig, ...config };
      const browser = await this.launchBrowser(browserConfig);
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to URL
      await page.goto(url, { waitUntil: 'networkidle0', timeout: browserConfig.timeout });
      
      const session: AutomationSession = {
        id: sessionId,
        browser,
        page,
        url,
        status: 'active',
        lastActivity: new Date()
      };
      
      this.sessions.set(sessionId, session);
      return sessionId;
      
    } catch (error) {
      console.error(`Failed to create session for ${url}:`, error);
      throw new Error(`Browser session creation failed: ${error}`);
    }
  }

  private async launchBrowser(config: BrowserConfig): Promise<Browser> {
    const attempts = [
      config,
      { ...config, headless: 'new' as const },
      { ...config, executablePath: undefined },
      { ...config, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    ];

    for (const attempt of attempts) {
      try {
        return await puppeteer.launch(attempt);
      } catch (error) {
        console.log(`Browser launch attempt failed: ${error}`);
        continue;
      }
    }
    
    throw new Error('All browser launch attempts failed');
  }

  async performLogin(sessionId: string, credentials: {
    email: string;
    password: string;
    twoFactorCode?: string;
  }): Promise<{ success: boolean; message: string }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    try {
      const { page } = session;
      
      // Wait for and fill email field
      await page.waitForSelector('input[type="email"], input[name="email"], input[id*="email"]', { timeout: 10000 });
      await page.type('input[type="email"], input[name="email"], input[id*="email"]', credentials.email);
      
      // Wait for and fill password field
      await page.waitForSelector('input[type="password"], input[name="password"], input[id*="password"]', { timeout: 5000 });
      await page.type('input[type="password"], input[name="password"], input[id*="password"]', credentials.password);
      
      // Submit form
      await page.keyboard.press('Enter');
      
      // Wait for potential 2FA or redirect
      await page.waitForTimeout(3000);
      
      // Handle 2FA if provided
      if (credentials.twoFactorCode) {
        try {
          await page.waitForSelector('input[name*="code"], input[id*="code"], input[placeholder*="code"]', { timeout: 5000 });
          await page.type('input[name*="code"], input[id*="code"], input[placeholder*="code"]', credentials.twoFactorCode);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(3000);
        } catch (error) {
          console.log('2FA field not found or not required');
        }
      }
      
      // Check if login was successful
      const currentUrl = page.url();
      const loginSuccess = !currentUrl.includes('login') && !currentUrl.includes('signin');
      
      session.status = loginSuccess ? 'active' : 'error';
      session.lastActivity = new Date();
      
      return {
        success: loginSuccess,
        message: loginSuccess ? 'Login successful' : 'Login failed - check credentials'
      };
      
    } catch (error) {
      session.status = 'error';
      return {
        success: false,
        message: `Login error: ${error}`
      };
    }
  }

  async executeTradeAction(sessionId: string, action: {
    type: 'buy' | 'sell' | 'cancel';
    symbol: string;
    amount: number;
    price?: number;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    try {
      const { page } = session;
      
      // Navigate to trading page if not already there
      if (!page.url().includes('trade') && !page.url().includes('spot')) {
        await page.goto(`${new URL(page.url()).origin}/en/trade/spot/${action.symbol}`, { waitUntil: 'networkidle0' });
      }
      
      // Wait for trading interface to load
      await page.waitForSelector('.trading-panel, .trade-form, [class*="trade"]', { timeout: 10000 });
      
      // Select buy or sell tab
      const tabSelector = action.type === 'buy' ? '[data-bn-type="text"]:contains("Buy")' : '[data-bn-type="text"]:contains("Sell")';
      await page.click(tabSelector).catch(() => {
        // Fallback selectors
        return page.click(`button:contains("${action.type.toUpperCase()}")`);
      });
      
      // Fill amount
      await page.waitForSelector('input[placeholder*="Amount"], input[name*="amount"]', { timeout: 5000 });
      await page.click('input[placeholder*="Amount"], input[name*="amount"]');
      await page.keyboard.press('Control+KeyA');
      await page.type('input[placeholder*="Amount"], input[name*="amount"]', action.amount.toString());
      
      // Fill price if specified (for limit orders)
      if (action.price) {
        await page.waitForSelector('input[placeholder*="Price"], input[name*="price"]', { timeout: 5000 });
        await page.click('input[placeholder*="Price"], input[name*="price"]');
        await page.keyboard.press('Control+KeyA');
        await page.type('input[placeholder*="Price"], input[name*="price"]', action.price.toString());
      }
      
      // Submit trade
      const submitButton = await page.waitForSelector(`button:contains("${action.type.toUpperCase()}")`, { timeout: 5000 });
      await submitButton.click();
      
      // Wait for confirmation
      await page.waitForTimeout(2000);
      
      // Check for success indicators
      const successElement = await page.$('.success, .confirmed, [class*="success"]');
      const success = !!successElement;
      
      session.lastActivity = new Date();
      
      return {
        success,
        message: success ? `${action.type} order submitted successfully` : `${action.type} order failed`,
        data: {
          symbol: action.symbol,
          amount: action.amount,
          price: action.price,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      session.status = 'error';
      return {
        success: false,
        message: `Trade execution error: ${error}`
      };
    }
  }

  async takeScreenshot(sessionId: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    try {
      const screenshot = await session.page.screenshot({ 
        encoding: 'base64',
        fullPage: true 
      });
      return screenshot;
    } catch (error) {
      throw new Error(`Screenshot failed: ${error}`);
    }
  }

  async getPageContent(sessionId: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return await session.page.content();
  }

  async evaluateScript(sessionId: string, script: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return await session.page.evaluate(script);
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.browser.close();
      this.sessions.delete(sessionId);
    }
  }

  async getAllSessions(): Promise<Array<{
    id: string;
    url: string;
    status: string;
    lastActivity: Date;
  }>> {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      url: session.url,
      status: session.status,
      lastActivity: session.lastActivity
    }));
  }

  async cleanup(): Promise<void> {
    for (const [sessionId, session] of this.sessions) {
      try {
        await session.browser.close();
      } catch (error) {
        console.error(`Error closing session ${sessionId}:`, error);
      }
    }
    this.sessions.clear();
  }

  // Health check to ensure browser automation is working
  async healthCheck(): Promise<{ success: boolean; message: string; details: any }> {
    try {
      const testSessionId = await this.createSession('https://example.com');
      const screenshot = await this.takeScreenshot(testSessionId);
      await this.closeSession(testSessionId);
      
      return {
        success: true,
        message: 'Browser automation is operational',
        details: {
          screenshotTaken: !!screenshot,
          sessionCreated: true,
          configUsed: this.defaultConfig
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Browser automation health check failed: ${error}`,
        details: {
          configUsed: this.defaultConfig,
          error: error
        }
      };
    }
  }
}

export const universalBrowserAutomation = UniversalBrowserAutomation.getInstance();