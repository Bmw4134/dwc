import puppeteer, { Browser, Page } from 'puppeteer';

interface BinanceAccountSetup {
  email: string;
  password: string;
  apiKeyLabel: string;
  ipRestriction?: string;
}

interface BinanceAPIResult {
  success: boolean;
  apiKey?: string;
  secretKey?: string;
  error?: string;
  steps: string[];
}

export class BinanceAccountAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private steps: string[] = [];

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true, // Use headless mode for server environments
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-blink-features=AutomationControlled',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Set realistic user agent
    await this.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  }

  async automateAccountCreation(setup: BinanceAccountSetup): Promise<BinanceAPIResult> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    try {
      this.steps = [];
      
      // Step 1: Navigate to Binance
      this.addStep('Navigating to Binance registration page');
      await this.page.goto('https://www.binance.com/en/register', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Step 2: Handle cookie consent
      this.addStep('Handling cookie consent');
      try {
        await this.page.waitForSelector('[data-testid="cookie-accept"]', { timeout: 5000 });
        await this.page.click('[data-testid="cookie-accept"]');
      } catch (e) {
        // Cookie banner might not appear
      }

      // Step 3: Fill registration form
      this.addStep('Filling registration form');
      await this.page.waitForSelector('#email', { timeout: 10000 });
      await this.page.type('#email', setup.email);
      
      await this.page.waitForSelector('#password', { timeout: 5000 });
      await this.page.type('#password', setup.password);
      
      await this.page.waitForSelector('#confirmPassword', { timeout: 5000 });
      await this.page.type('#confirmPassword', setup.password);

      // Accept terms and conditions
      this.addStep('Accepting terms and conditions');
      const termsCheckbox = await this.page.$('[data-testid="checkbox-agreement"]');
      if (termsCheckbox) {
        await termsCheckbox.click();
      }

      // Submit registration
      this.addStep('Submitting registration form');
      await this.page.click('[data-testid="register-submit"]');

      // Step 4: Handle email verification
      this.addStep('Waiting for email verification');
      await this.page.waitForSelector('.verification-container', { timeout: 30000 });
      
      // Pause for manual email verification
      this.addStep('Please verify your email address in your inbox');
      await this.waitForManualStep('Email verification required - please check your email and click the verification link');

      // Step 5: Complete profile setup
      this.addStep('Completing profile setup');
      await this.page.waitForSelector('.profile-setup', { timeout: 30000 });
      
      // Skip advanced verification for now
      const skipButton = await this.page.$('[data-testid="skip-verification"]');
      if (skipButton) {
        await skipButton.click();
      }

      // Step 6: Navigate to API Management
      this.addStep('Navigating to API Management');
      await this.page.goto('https://www.binance.com/en/my/settings/api-management', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Step 7: Create API Key
      this.addStep('Creating new API key');
      await this.page.waitForSelector('[data-testid="create-api-key"]', { timeout: 10000 });
      await this.page.click('[data-testid="create-api-key"]');

      // Fill API key label
      await this.page.waitForSelector('#api-key-label', { timeout: 5000 });
      await this.page.type('#api-key-label', setup.apiKeyLabel);

      // Configure permissions
      this.addStep('Configuring API permissions');
      await this.page.click('[data-testid="enable-reading"]');
      await this.page.click('[data-testid="enable-spot-trading"]');

      // Add IP restriction if provided
      if (setup.ipRestriction) {
        await this.page.click('[data-testid="enable-ip-restriction"]');
        await this.page.type('#ip-address', setup.ipRestriction);
      }

      // Submit API key creation
      await this.page.click('[data-testid="create-api-key-submit"]');

      // Step 8: Handle security verification
      this.addStep('Handling security verification');
      await this.waitForManualStep('Please complete security verification (email/SMS)');

      // Step 9: Extract API credentials
      this.addStep('Extracting API credentials');
      await this.page.waitForSelector('.api-key-display', { timeout: 30000 });
      
      const apiKey = await this.page.$eval('[data-testid="api-key"]', el => el.textContent);
      const secretKey = await this.page.$eval('[data-testid="secret-key"]', el => el.textContent);

      this.addStep('API key created successfully');

      return {
        success: true,
        apiKey: apiKey || undefined,
        secretKey: secretKey || undefined,
        steps: this.steps
      };

    } catch (error) {
      this.addStep(`Error: ${error.message}`);
      return {
        success: false,
        error: error.message,
        steps: this.steps
      };
    }
  }

  private addStep(step: string): void {
    this.steps.push(`[${new Date().toLocaleTimeString()}] ${step}`);
    console.log(`Binance Automation: ${step}`);
  }

  private async waitForManualStep(instruction: string): Promise<void> {
    this.addStep(instruction);
    console.log(`\n⚠️  MANUAL STEP REQUIRED: ${instruction}`);
    console.log('Press any key when ready to continue...');
    
    // In a real implementation, you might want to pause here
    // For demo purposes, we'll add a delay
    await this.page?.waitForTimeout(5000);
  }

  async getAccountStatus(): Promise<any> {
    if (!this.page) return { error: 'Browser not initialized' };

    try {
      await this.page.goto('https://www.binance.com/en/my/dashboard', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      const isLoggedIn = await this.page.$('.user-dropdown') !== null;
      
      return {
        loggedIn: isLoggedIn,
        url: this.page.url(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async takeScreenshot(filename: string): Promise<string> {
    if (!this.page) throw new Error('Browser not initialized');
    
    const path = `./screenshots/${filename}`;
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export const binanceAutomation = new BinanceAccountAutomation();