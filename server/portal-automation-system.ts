import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

interface PlatformCredentials {
  email: string;
  password: string;
  platformName: string;
  loginUrl: string;
  sessionCookies?: any[];
  lastLoginAt?: Date;
  sessionValid?: boolean;
}

interface PlatformSession {
  platformName: string;
  cookies: any[];
  userAgent: string;
  sessionData: any;
  expiresAt: Date;
  isValid: boolean;
}

interface AutomationTask {
  id: string;
  platformName: string;
  action: 'login' | 'scrape' | 'analyze' | 'extract';
  target: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  requiresManual2FA: boolean;
  pausedForInput?: boolean;
  createdAt: Date;
  completedAt?: Date;
  results?: any;
}

export class PortalAutomationSystem {
  private browser: Browser | null = null;
  private sessionStore: Map<string, PlatformSession> = new Map();
  private credentials: Map<string, PlatformCredentials> = new Map();
  private activeTasks: Map<string, AutomationTask> = new Map();
  private sessionStorePath: string = './data/sessions.json';
  private credentialsPath: string = './data/credentials.json';

  constructor() {
    this.initializeSystem();
  }

  private async initializeSystem(): Promise<void> {
    try {
      await this.ensureDataDirectory();
      await this.loadStoredSessions();
      await this.loadStoredCredentials();
    } catch (error) {
      console.error('Failed to initialize portal automation system:', error);
    }
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir('./data', { recursive: true });
    } catch (error) {
      // Directory already exists or cannot be created
    }
  }

  async addPlatformCredentials(credentials: PlatformCredentials): Promise<void> {
    this.credentials.set(credentials.platformName, credentials);
    await this.saveCredentials();
    console.log(`Added credentials for ${credentials.platformName}`);
  }

  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false, // Keep visible for manual 2FA
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ],
        defaultViewport: { width: 1280, height: 720 }
      });
    }
  }

  async loginWithManual2FA(platformName: string): Promise<{
    success: boolean;
    sessionStored: boolean;
    requiresManualInput: boolean;
    message: string;
  }> {
    const credentials = this.credentials.get(platformName);
    if (!credentials) {
      throw new Error(`No credentials found for platform: ${platformName}`);
    }

    await this.initializeBrowser();
    const page = await this.browser!.newPage();

    try {
      console.log(`🚀 Starting automated login for ${platformName}...`);
      
      // Navigate to login page
      await page.goto(credentials.loginUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Fill in credentials
      await this.waitForSelectorAndFill(page, 'input[type="email"], input[name="email"], input[id="email"]', credentials.email);
      await this.waitForSelectorAndFill(page, 'input[type="password"], input[name="password"], input[id="password"]', credentials.password);

      // Click login button
      await this.clickLoginButton(page);

      // Wait for potential 2FA requirement
      await page.waitForTimeout(3000);

      // Check if 2FA is required
      const requires2FA = await this.detect2FARequirement(page);

      if (requires2FA) {
        console.log('⚠️  2FA REQUIRED - Manual input needed');
        console.log('🔐 Please complete 2FA verification in the browser window');
        console.log('⏱️  Waiting up to 120 seconds for manual completion...');

        // Create automation task for tracking
        const taskId = `2fa-${platformName}-${Date.now()}`;
        const task: AutomationTask = {
          id: taskId,
          platformName,
          action: 'login',
          target: credentials.loginUrl,
          status: 'paused',
          requiresManual2FA: true,
          pausedForInput: true,
          createdAt: new Date()
        };
        
        this.activeTasks.set(taskId, task);

        // Wait for manual 2FA completion
        const loginSuccess = await this.waitForManual2FACompletion(page, 120000);

        if (loginSuccess) {
          console.log('✅ 2FA completed successfully!');
          task.status = 'completed';
          task.completedAt = new Date();
          
          // Store session
          await this.storeSessionData(page, platformName);
          
          return {
            success: true,
            sessionStored: true,
            requiresManualInput: true,
            message: '2FA completed and session stored successfully'
          };
        } else {
          task.status = 'failed';
          return {
            success: false,
            sessionStored: false,
            requiresManualInput: true,
            message: '2FA timeout - please try again'
          };
        }
      } else {
        // No 2FA required, check if login was successful
        const loginSuccess = await this.verifyLoginSuccess(page);
        
        if (loginSuccess) {
          console.log('✅ Login successful without 2FA');
          await this.storeSessionData(page, platformName);
          
          return {
            success: true,
            sessionStored: true,
            requiresManualInput: false,
            message: 'Login successful and session stored'
          };
        } else {
          return {
            success: false,
            sessionStored: false,
            requiresManualInput: false,
            message: 'Login failed - please check credentials'
          };
        }
      }

    } catch (error) {
      console.error(`Login automation failed for ${platformName}:`, error);
      throw new Error(`Login automation failed: ${error}`);
    } finally {
      await page.close();
    }
  }

  private async waitForSelectorAndFill(page: Page, selector: string, value: string): Promise<void> {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      await page.fill(selector, value);
    } catch (error) {
      // Try alternative selectors
      const alternativeSelectors = [
        'input[placeholder*="email" i]',
        'input[placeholder*="username" i]',
        'input[placeholder*="password" i]',
        'input[aria-label*="email" i]',
        'input[aria-label*="password" i]'
      ];

      for (const altSelector of alternativeSelectors) {
        try {
          await page.waitForSelector(altSelector, { timeout: 2000 });
          await page.fill(altSelector, value);
          return;
        } catch {
          continue;
        }
      }
      
      throw new Error(`Could not find input field with selector: ${selector}`);
    }
  }

  private async clickLoginButton(page: Page): Promise<void> {
    const buttonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Sign In")',
      'button:contains("Login")',
      'button:contains("Log In")',
      '[role="button"]:contains("Sign In")',
      '[role="button"]:contains("Login")'
    ];

    for (const selector of buttonSelectors) {
      try {
        await page.click(selector);
        return;
      } catch {
        continue;
      }
    }

    // Fallback: press Enter on password field
    try {
      await page.keyboard.press('Enter');
    } catch (error) {
      throw new Error('Could not find or click login button');
    }
  }

  private async detect2FARequirement(page: Page): Promise<boolean> {
    const twoFAIndicators = [
      'input[placeholder*="code" i]',
      'input[placeholder*="verification" i]',
      'input[placeholder*="authenticator" i]',
      'text=Enter the 6-digit code',
      'text=Two-factor authentication',
      'text=Verification code',
      'text=Enter code',
      '[data-testid*="2fa"]',
      '[data-testid*="verification"]',
      '.two-factor',
      '.verification-code',
      '#verification-code',
      '#two-factor'
    ];

    for (const indicator of twoFAIndicators) {
      try {
        await page.waitForSelector(indicator, { timeout: 2000 });
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  private async waitForManual2FACompletion(page: Page, timeoutMs: number = 120000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        // Check if we've moved past the 2FA page
        const still2FA = await this.detect2FARequirement(page);
        if (!still2FA) {
          // Verify we're actually logged in
          const loginSuccess = await this.verifyLoginSuccess(page);
          if (loginSuccess) {
            return true;
          }
        }
        
        // Check every 2 seconds
        await page.waitForTimeout(2000);
        
      } catch (error) {
        console.error('Error during 2FA wait:', error);
        await page.waitForTimeout(2000);
      }
    }
    
    return false;
  }

  private async verifyLoginSuccess(page: Page): Promise<boolean> {
    const successIndicators = [
      '[data-testid*="dashboard"]',
      '[data-testid*="profile"]',
      '.dashboard',
      '.user-menu',
      '.profile-menu',
      'nav[role="navigation"]',
      'text=Dashboard',
      'text=Profile',
      'text=Logout',
      'text=Sign Out',
      '[aria-label*="user menu" i]',
      '[aria-label*="profile" i]'
    ];

    for (const indicator of successIndicators) {
      try {
        await page.waitForSelector(indicator, { timeout: 3000 });
        return true;
      } catch {
        continue;
      }
    }

    // Check if URL changed to indicate successful login
    const currentUrl = page.url();
    const loginUrl = this.credentials.get('current')?.loginUrl || '';
    
    return !currentUrl.includes('login') && !currentUrl.includes('signin') && currentUrl !== loginUrl;
  }

  private async storeSessionData(page: Page, platformName: string): Promise<void> {
    try {
      const cookies = await page.cookies();
      const userAgent = await page.evaluate(() => navigator.userAgent);
      
      const sessionData = await page.evaluate(() => {
        return {
          localStorage: JSON.stringify(localStorage),
          sessionStorage: JSON.stringify(sessionStorage),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        };
      });

      const session: PlatformSession = {
        platformName,
        cookies,
        userAgent,
        sessionData,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isValid: true
      };

      this.sessionStore.set(platformName, session);
      await this.saveSessionStore();
      
      console.log(`✅ Session data stored for ${platformName}`);
      
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  }

  async restoreSession(page: Page, platformName: string): Promise<boolean> {
    const session = this.sessionStore.get(platformName);
    
    if (!session || !session.isValid || new Date() > session.expiresAt) {
      console.log(`No valid session found for ${platformName}`);
      return false;
    }

    try {
      // Set cookies
      await page.setCookie(...session.cookies);
      
      // Restore local storage and session storage
      await page.evaluate((sessionData) => {
        if (sessionData.localStorage) {
          const localStorageData = JSON.parse(sessionData.localStorage);
          for (const [key, value] of Object.entries(localStorageData)) {
            localStorage.setItem(key, value as string);
          }
        }
        
        if (sessionData.sessionStorage) {
          const sessionStorageData = JSON.parse(sessionData.sessionStorage);
          for (const [key, value] of Object.entries(sessionStorageData)) {
            sessionStorage.setItem(key, value as string);
          }
        }
      }, session.sessionData);

      console.log(`✅ Session restored for ${platformName}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to restore session for ${platformName}:`, error);
      return false;
    }
  }

  async automateWithSession(platformName: string, actions: string[]): Promise<any> {
    await this.initializeBrowser();
    const page = await this.browser!.newPage();

    try {
      // Try to restore existing session first
      const sessionRestored = await this.restoreSession(page, platformName);
      
      if (!sessionRestored) {
        // Need to login first
        console.log(`No valid session for ${platformName}, initiating login...`);
        const loginResult = await this.loginWithManual2FA(platformName);
        
        if (!loginResult.success) {
          throw new Error(`Login failed for ${platformName}: ${loginResult.message}`);
        }
      }

      // Execute automation actions
      const results = [];
      for (const action of actions) {
        const result = await this.executeAction(page, action);
        results.push(result);
      }

      return {
        success: true,
        platform: platformName,
        actionsCompleted: actions.length,
        results
      };

    } catch (error) {
      console.error(`Automation failed for ${platformName}:`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  private async executeAction(page: Page, action: string): Promise<any> {
    // This would contain specific automation logic based on the action
    console.log(`Executing action: ${action}`);
    
    // Placeholder for action execution
    await page.waitForTimeout(1000);
    
    return {
      action,
      completed: true,
      timestamp: new Date()
    };
  }

  async getActiveTasks(): Promise<AutomationTask[]> {
    return Array.from(this.activeTasks.values());
  }

  async resumePausedTask(taskId: string): Promise<boolean> {
    const task = this.activeTasks.get(taskId);
    if (!task || !task.pausedForInput) {
      return false;
    }

    task.status = 'running';
    task.pausedForInput = false;
    
    console.log(`Resuming task ${taskId}`);
    return true;
  }

  private async saveSessionStore(): Promise<void> {
    try {
      const sessionData = {};
      for (const [key, value] of this.sessionStore.entries()) {
        sessionData[key] = value;
      }
      
      await fs.writeFile(this.sessionStorePath, JSON.stringify(sessionData, null, 2));
    } catch (error) {
      console.error('Failed to save session store:', error);
    }
  }

  private async loadStoredSessions(): Promise<void> {
    try {
      const data = await fs.readFile(this.sessionStorePath, 'utf-8');
      const sessionData = JSON.parse(data);
      
      for (const [key, value] of Object.entries(sessionData)) {
        this.sessionStore.set(key, value as PlatformSession);
      }
      
      console.log(`Loaded ${this.sessionStore.size} stored sessions`);
    } catch (error) {
      console.log('No existing session data found, starting fresh');
    }
  }

  private async saveCredentials(): Promise<void> {
    try {
      const credData = {};
      for (const [key, value] of this.credentials.entries()) {
        // Don't store actual passwords in plain text
        credData[key] = {
          ...value,
          password: '***encrypted***' // In production, use proper encryption
        };
      }
      
      await fs.writeFile(this.credentialsPath, JSON.stringify(credData, null, 2));
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  }

  private async loadStoredCredentials(): Promise<void> {
    try {
      const data = await fs.readFile(this.credentialsPath, 'utf-8');
      const credData = JSON.parse(data);
      
      // Note: In production, you'd decrypt passwords here
      console.log(`Loaded credentials for ${Object.keys(credData).length} platforms`);
    } catch (error) {
      console.log('No existing credentials found');
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    
    await this.saveSessionStore();
    console.log('Portal automation system cleaned up');
  }
}

export const portalAutomationSystem = new PortalAutomationSystem();