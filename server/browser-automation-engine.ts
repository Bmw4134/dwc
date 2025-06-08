import puppeteer, { Browser, Page } from 'puppeteer';

interface LoginCredentials {
  username: string;
  password: string;
  twoFactorCode?: string;
}

interface FormField {
  selector: string;
  value: string;
  type: 'input' | 'select' | 'checkbox' | 'radio';
}

interface AutomationTask {
  id: string;
  url: string;
  name: string;
  steps: AutomationStep[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface AutomationStep {
  action: 'navigate' | 'click' | 'type' | 'select' | 'wait' | 'login' | 'screenshot';
  selector?: string;
  value?: string;
  timeout?: number;
}

export class BrowserAutomationEngine {
  private browser: Browser | null = null;
  private activeTasks: Map<string, AutomationTask> = new Map();
  private activeSessions: Map<string, Page> = new Map();
  private multiWindowSessions: Map<string, Page[]> = new Map();

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false, // Show browser for user visibility
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    console.log('🤖 Browser Automation Engine initialized');
  }

  // Automated login to any website
  async automateLogin(url: string, credentials: LoginCredentials): Promise<{
    success: boolean;
    sessionId: string;
    screenshot?: string;
    error?: string;
  }> {
    if (!this.browser) {
      await this.initialize();
    }

    const sessionId = `session_${Date.now()}`;
    const page = await this.browser!.newPage();
    
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to login page
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Auto-detect and fill login forms
      const loginSuccess = await this.autoDetectAndLogin(page, credentials);
      
      if (loginSuccess) {
        this.activeSessions.set(sessionId, page);
        
        // Take screenshot for verification
        const screenshot = await page.screenshot({ 
          encoding: 'base64',
          fullPage: false 
        });
        
        return {
          success: true,
          sessionId,
          screenshot: screenshot as string
        };
      } else {
        await page.close();
        return {
          success: false,
          sessionId: '',
          error: 'Login failed - could not detect or fill login form'
        };
      }
    } catch (error) {
      await page.close();
      return {
        success: false,
        sessionId: '',
        error: `Login failed: ${error.message}`
      };
    }
  }

  // Auto-detect login forms and fill them
  private async autoDetectAndLogin(page: Page, credentials: LoginCredentials): Promise<boolean> {
    try {
      // Common username field selectors
      const usernameSelectors = [
        'input[type="email"]',
        'input[name="username"]',
        'input[name="email"]',
        'input[name="login"]',
        'input[name="user"]',
        'input[id*="username"]',
        'input[id*="email"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="username" i]'
      ];

      // Common password field selectors
      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        'input[id*="password"]',
        'input[placeholder*="password" i]'
      ];

      // Find username field
      let usernameField = null;
      for (const selector of usernameSelectors) {
        try {
          usernameField = await page.$(selector);
          if (usernameField) break;
        } catch (e) {
          continue;
        }
      }

      // Find password field
      let passwordField = null;
      for (const selector of passwordSelectors) {
        try {
          passwordField = await page.$(selector);
          if (passwordField) break;
        } catch (e) {
          continue;
        }
      }

      if (!usernameField || !passwordField) {
        console.log('❌ Could not find username or password fields');
        return false;
      }

      // Fill username
      await usernameField.click();
      await usernameField.type(credentials.username, { delay: 100 });
      await page.waitForTimeout(500);

      // Fill password
      await passwordField.click();
      await passwordField.type(credentials.password, { delay: 100 });
      await page.waitForTimeout(500);

      // Find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Login")',
        'button:contains("Sign In")',
        'button:contains("Log In")',
        'button[name="submit"]',
        '.login-button',
        '.submit-button'
      ];

      let submitButton = null;
      for (const selector of submitSelectors) {
        try {
          submitButton = await page.$(selector);
          if (submitButton) break;
        } catch (e) {
          continue;
        }
      }

      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(3000);
      } else {
        // Try pressing Enter as fallback
        await passwordField.press('Enter');
        await page.waitForTimeout(3000);
      }

      // Check if login was successful by looking for common post-login indicators
      const postLoginIndicators = [
        '.dashboard',
        '.profile',
        '.account',
        '.logout',
        '.user-menu',
        '[href*="logout"]',
        '[href*="dashboard"]'
      ];

      for (const indicator of postLoginIndicators) {
        try {
          const element = await page.$(indicator);
          if (element) {
            console.log('✅ Login successful - found post-login indicator');
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      // If no indicators found, check if we're still on the same page
      const currentUrl = page.url();
      if (!currentUrl.includes('login') && !currentUrl.includes('signin')) {
        console.log('✅ Login successful - redirected away from login page');
        return true;
      }

      console.log('❌ Login may have failed - still on login page');
      return false;

    } catch (error) {
      console.error('❌ Auto-login error:', error);
      return false;
    }
  }

  // Fill any form automatically
  async fillForm(sessionId: string, formFields: FormField[]): Promise<{
    success: boolean;
    screenshot?: string;
    error?: string;
  }> {
    const page = this.activeSessions.get(sessionId);
    if (!page) {
      return { success: false, error: 'Session not found' };
    }

    try {
      for (const field of formFields) {
        await page.waitForSelector(field.selector, { timeout: 5000 });
        
        switch (field.type) {
          case 'input':
            await page.click(field.selector);
            await page.evaluate((selector) => {
              document.querySelector(selector).value = '';
            }, field.selector);
            await page.type(field.selector, field.value, { delay: 100 });
            break;
            
          case 'select':
            await page.select(field.selector, field.value);
            break;
            
          case 'checkbox':
            if (field.value === 'true') {
              await page.check(field.selector);
            } else {
              await page.uncheck(field.selector);
            }
            break;
        }
        
        await page.waitForTimeout(500);
      }

      const screenshot = await page.screenshot({ 
        encoding: 'base64',
        fullPage: false 
      });

      return {
        success: true,
        screenshot: screenshot as string
      };

    } catch (error) {
      return {
        success: false,
        error: `Form filling failed: ${error.message}`
      };
    }
  }

  // Execute custom automation sequence
  async executeAutomationSequence(sessionId: string, steps: AutomationStep[]): Promise<{
    success: boolean;
    screenshots: string[];
    error?: string;
  }> {
    const page = this.activeSessions.get(sessionId);
    if (!page) {
      return { success: false, screenshots: [], error: 'Session not found' };
    }

    const screenshots: string[] = [];

    try {
      for (const step of steps) {
        switch (step.action) {
          case 'navigate':
            await page.goto(step.value!, { waitUntil: 'networkidle2' });
            break;
            
          case 'click':
            await page.waitForSelector(step.selector!, { timeout: step.timeout || 5000 });
            await page.click(step.selector!);
            break;
            
          case 'type':
            await page.waitForSelector(step.selector!, { timeout: step.timeout || 5000 });
            await page.type(step.selector!, step.value!, { delay: 100 });
            break;
            
          case 'wait':
            await page.waitForTimeout(step.timeout || 1000);
            break;
            
          case 'screenshot':
            const screenshot = await page.screenshot({ 
              encoding: 'base64',
              fullPage: false 
            });
            screenshots.push(screenshot as string);
            break;
        }
        
        await page.waitForTimeout(500);
      }

      return {
        success: true,
        screenshots
      };

    } catch (error) {
      return {
        success: false,
        screenshots,
        error: `Automation sequence failed: ${error.message}`
      };
    }
  }

  // Get session status and screenshot
  async getSessionStatus(sessionId: string): Promise<{
    isActive: boolean;
    url?: string;
    title?: string;
    screenshot?: string;
  }> {
    const page = this.activeSessions.get(sessionId);
    if (!page || page.isClosed()) {
      return { isActive: false };
    }

    try {
      const url = page.url();
      const title = await page.title();
      const screenshot = await page.screenshot({ 
        encoding: 'base64',
        fullPage: false 
      });

      return {
        isActive: true,
        url,
        title,
        screenshot: screenshot as string
      };
    } catch (error) {
      return { isActive: false };
    }
  }

  // Close session
  async closeSession(sessionId: string): Promise<void> {
    const page = this.activeSessions.get(sessionId);
    if (page && !page.isClosed()) {
      await page.close();
    }
    this.activeSessions.delete(sessionId);
  }

  // Create multi-window session for complex automation workflows
  async createMultiWindowSession(urls: string[]): Promise<{
    success: boolean;
    sessionId: string;
    windowIds: string[];
    error?: string;
  }> {
    if (!this.browser) {
      await this.initialize();
    }

    const sessionId = `multi_${Date.now()}`;
    const windows: Page[] = [];
    const windowIds: string[] = [];

    try {
      for (const url of urls) {
        const page = await this.browser!.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        const windowId = `window_${Date.now()}_${windows.length}`;
        windows.push(page);
        windowIds.push(windowId);
        this.activeSessions.set(windowId, page);
      }

      this.multiWindowSessions.set(sessionId, windows);

      return {
        success: true,
        sessionId,
        windowIds
      };

    } catch (error) {
      // Clean up on failure
      for (const page of windows) {
        if (!page.isClosed()) {
          await page.close();
        }
      }
      
      return {
        success: false,
        sessionId: '',
        windowIds: [],
        error: `Multi-window session creation failed: ${(error as Error).message}`
      };
    }
  }

  // Execute automation across multiple windows
  async executeMultiWindowAutomation(sessionId: string, automationSteps: {
    windowIndex: number;
    steps: AutomationStep[];
  }[]): Promise<{
    success: boolean;
    results: { windowIndex: number; success: boolean; error?: string }[];
  }> {
    const windows = this.multiWindowSessions.get(sessionId);
    if (!windows) {
      return {
        success: false,
        results: []
      };
    }

    const results: { windowIndex: number; success: boolean; error?: string }[] = [];

    for (const automation of automationSteps) {
      const window = windows[automation.windowIndex];
      if (!window || window.isClosed()) {
        results.push({
          windowIndex: automation.windowIndex,
          success: false,
          error: 'Window not found or closed'
        });
        continue;
      }

      try {
        // Execute steps on this window
        for (const step of automation.steps) {
          switch (step.action) {
            case 'navigate':
              await window.goto(step.value!, { waitUntil: 'networkidle2' });
              break;
              
            case 'click':
              await window.waitForSelector(step.selector!, { timeout: step.timeout || 5000 });
              await window.click(step.selector!);
              break;
              
            case 'type':
              await window.waitForSelector(step.selector!, { timeout: step.timeout || 5000 });
              await window.type(step.selector!, step.value!, { delay: 100 });
              break;
              
            case 'wait':
              await new Promise(resolve => setTimeout(resolve, step.timeout || 1000));
              break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        results.push({
          windowIndex: automation.windowIndex,
          success: true
        });

      } catch (error) {
        results.push({
          windowIndex: automation.windowIndex,
          success: false,
          error: (error as Error).message
        });
      }
    }

    return {
      success: results.every(r => r.success),
      results
    };
  }

  // Get screenshots from all windows in a multi-window session
  async getMultiWindowScreenshots(sessionId: string): Promise<{
    success: boolean;
    screenshots: { windowIndex: number; screenshot: string; url: string; title: string }[];
  }> {
    const windows = this.multiWindowSessions.get(sessionId);
    if (!windows) {
      return { success: false, screenshots: [] };
    }

    const screenshots: { windowIndex: number; screenshot: string; url: string; title: string }[] = [];

    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      if (!window.isClosed()) {
        try {
          const screenshot = await window.screenshot({ 
            encoding: 'base64',
            fullPage: false 
          });
          const url = window.url();
          const title = await window.title();

          screenshots.push({
            windowIndex: i,
            screenshot: screenshot as string,
            url,
            title
          });
        } catch (error) {
          console.error(`Failed to capture screenshot for window ${i}:`, error);
        }
      }
    }

    return {
      success: true,
      screenshots
    };
  }

  // Get all active sessions
  getAllSessions(): { sessionId: string; url: string; type: 'single' | 'multi' }[] {
    const sessions: { sessionId: string; url: string; type: 'single' | 'multi' }[] = [];
    
    // Single window sessions
    for (const [sessionId, page] of this.activeSessions.entries()) {
      if (!page.isClosed() && !sessionId.startsWith('window_')) {
        sessions.push({
          sessionId,
          url: page.url(),
          type: 'single'
        });
      }
    }

    // Multi-window sessions
    for (const [sessionId, windows] of this.multiWindowSessions.entries()) {
      if (windows.length > 0 && !windows[0].isClosed()) {
        sessions.push({
          sessionId,
          url: `${windows.length} windows`,
          type: 'multi'
        });
      }
    }
    
    return sessions;
  }

  async cleanup(): Promise<void> {
    // Close all sessions
    for (const page of this.activeSessions.values()) {
      if (!page.isClosed()) {
        await page.close();
      }
    }
    this.activeSessions.clear();

    // Close browser
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const browserAutomationEngine = new BrowserAutomationEngine();