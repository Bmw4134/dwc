import { chromium, Browser, Page } from 'playwright';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ApiKeyRequest {
  serviceName: string;
  email: string;
  businessName: string;
  website: string;
  purpose: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface ApiKeyResult {
  success: boolean;
  serviceName: string;
  apiKey?: string;
  accountDetails?: any;
  screenshots: string[];
  steps: string[];
  error?: string;
  loginCredentials?: {
    email: string;
    password: string;
    accountId?: string;
  };
}

interface ServiceConfig {
  name: string;
  registrationUrl: string;
  apiKeyUrl?: string;
  steps: AutomationStep[];
  rateLimit: {
    free: string;
    paid?: string;
  };
  documentation: string;
}

interface AutomationStep {
  action: 'navigate' | 'click' | 'type' | 'wait' | 'screenshot' | 'extract' | 'verify';
  selector?: string;
  value?: string;
  description: string;
  timeout?: number;
  optional?: boolean;
}

export class AutomatedApiKeyManager {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private screenshots: string[] = [];
  private executionSteps: string[] = [];

  private serviceConfigs: ServiceConfig[] = [
    {
      name: 'NASA',
      registrationUrl: 'https://api.nasa.gov/',
      steps: [
        {
          action: 'navigate',
          value: 'https://api.nasa.gov/',
          description: 'Navigate to NASA API portal'
        },
        {
          action: 'click',
          selector: 'a[href*="signup"], button:contains("Get API Key"), .signup-btn, [data-testid="signup"]',
          description: 'Click on signup/get API key button'
        },
        {
          action: 'type',
          selector: 'input[name="first_name"], input[id*="first"], input[placeholder*="first"]',
          value: '{firstName}',
          description: 'Enter first name'
        },
        {
          action: 'type',
          selector: 'input[name="last_name"], input[id*="last"], input[placeholder*="last"]',
          value: '{lastName}',
          description: 'Enter last name'
        },
        {
          action: 'type',
          selector: 'input[name="email"], input[type="email"], input[id*="email"]',
          value: '{email}',
          description: 'Enter email address'
        },
        {
          action: 'type',
          selector: 'textarea[name="purpose"], textarea[id*="purpose"], select[name="purpose"]',
          value: '{purpose}',
          description: 'Enter API usage purpose'
        },
        {
          action: 'click',
          selector: 'button[type="submit"], input[type="submit"], .submit-btn, button:contains("Submit")',
          description: 'Submit registration form'
        },
        {
          action: 'wait',
          timeout: 5000,
          description: 'Wait for registration confirmation'
        },
        {
          action: 'extract',
          selector: 'code, .api-key, .key-value, [data-key], pre',
          description: 'Extract API key from response'
        }
      ],
      rateLimit: {
        free: '1000 requests/hour',
        paid: 'Contact for enterprise rates'
      },
      documentation: 'https://api.nasa.gov/docs'
    },
    {
      name: 'OpenWeatherMap',
      registrationUrl: 'https://openweathermap.org/api',
      steps: [
        {
          action: 'navigate',
          value: 'https://home.openweathermap.org/users/sign_up',
          description: 'Navigate to OpenWeatherMap signup'
        },
        {
          action: 'type',
          selector: 'input[name="user[username]"]',
          value: '{businessName}',
          description: 'Enter username'
        },
        {
          action: 'type',
          selector: 'input[name="user[email]"]',
          value: '{email}',
          description: 'Enter email'
        },
        {
          action: 'type',
          selector: 'input[name="user[password]"]',
          value: '{password}',
          description: 'Enter password'
        },
        {
          action: 'type',
          selector: 'input[name="user[password_confirmation]"]',
          value: '{password}',
          description: 'Confirm password'
        },
        {
          action: 'click',
          selector: 'input[name="agreement_age"]',
          description: 'Accept age agreement'
        },
        {
          action: 'click',
          selector: 'input[name="agreement_privacy"]',
          description: 'Accept privacy policy'
        },
        {
          action: 'click',
          selector: 'input[type="submit"]',
          description: 'Submit registration'
        }
      ],
      rateLimit: {
        free: '60 calls/minute, 1000 calls/day',
        paid: 'Up to 3M calls/month'
      },
      documentation: 'https://openweathermap.org/api/one-call-3'
    },
    {
      name: 'Google Maps',
      registrationUrl: 'https://console.cloud.google.com/',
      steps: [
        {
          action: 'navigate',
          value: 'https://console.cloud.google.com/apis/credentials',
          description: 'Navigate to Google Cloud Console'
        },
        {
          action: 'click',
          selector: 'button:contains("Create Credentials")',
          description: 'Click create credentials'
        },
        {
          action: 'click',
          selector: 'a:contains("API key")',
          description: 'Select API key option'
        },
        {
          action: 'wait',
          timeout: 3000,
          description: 'Wait for API key generation'
        },
        {
          action: 'extract',
          selector: '.api-key-value, [data-testid="api-key"]',
          description: 'Extract generated API key'
        }
      ],
      rateLimit: {
        free: '$200 credit monthly',
        paid: 'Pay per use after credit'
      },
      documentation: 'https://developers.google.com/maps/documentation'
    }
  ];

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set viewport and user agent
    await this.page.setViewportSize({ width: 1200, height: 800 });
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
  }

  // Automatically acquire API key for specified service
  async acquireApiKey(request: ApiKeyRequest): Promise<ApiKeyResult> {
    if (!this.page) throw new Error('Browser not initialized');

    const config = this.serviceConfigs.find(c => c.name.toLowerCase() === request.serviceName.toLowerCase());
    if (!config) {
      throw new Error(`Service ${request.serviceName} not supported`);
    }

    this.screenshots = [];
    this.executionSteps = [];
    
    try {
      // Generate random password for account creation
      const password = this.generateSecurePassword();
      
      // Replace placeholders in steps
      const processedSteps = this.processSteps(config.steps, {
        ...request,
        password,
        firstName: request.firstName || request.businessName.split(' ')[0] || 'John',
        lastName: request.lastName || request.businessName.split(' ')[1] || 'Smith'
      });

      let apiKey = '';
      let accountDetails = {};

      for (const step of processedSteps) {
        this.executionSteps.push(step.description);
        
        try {
          switch (step.action) {
            case 'navigate':
              if (step.value) {
                await this.page.goto(step.value, { waitUntil: 'networkidle' });
              }
              break;

            case 'click':
              if (step.selector) {
                await this.smartClick(step.selector, step.timeout);
              }
              break;

            case 'type':
              if (step.selector && step.value) {
                await this.smartType(step.selector, step.value, step.timeout);
              }
              break;

            case 'wait':
              await this.page.waitForTimeout(step.timeout || 2000);
              break;

            case 'screenshot':
              await this.takeScreenshot(`Step: ${step.description}`);
              break;

            case 'extract':
              if (step.selector) {
                apiKey = await this.extractText(step.selector);
              }
              break;

            case 'verify':
              await this.verifyElement(step.selector || '');
              break;
          }

          // Take screenshot after each major step
          if (['click', 'type', 'extract'].includes(step.action)) {
            await this.takeScreenshot(`After: ${step.description}`);
          }

        } catch (error) {
          if (!step.optional) {
            console.error(`Failed step: ${step.description}`, error);
            // Try alternative approaches
            await this.tryAlternativeApproach(step);
          }
        }

        await this.page.waitForTimeout(1000); // Brief pause between steps
      }

      // Additional extraction attempts if API key not found
      if (!apiKey) {
        apiKey = await this.findApiKeyOnPage();
      }

      // Try to extract account details
      accountDetails = await this.extractAccountDetails();

      return {
        success: !!apiKey,
        serviceName: request.serviceName,
        apiKey,
        accountDetails,
        screenshots: this.screenshots,
        steps: this.executionSteps,
        loginCredentials: apiKey ? {
          email: request.email,
          password,
          accountId: accountDetails.accountId || accountDetails.userId
        } : undefined
      };

    } catch (error) {
      return {
        success: false,
        serviceName: request.serviceName,
        screenshots: this.screenshots,
        steps: this.executionSteps,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Smart click that tries multiple selector strategies
  private async smartClick(selector: string, timeout = 10000): Promise<void> {
    const selectors = selector.split(', ');
    
    for (const sel of selectors) {
      try {
        if (sel.includes(':contains(')) {
          // Handle text-based selectors
          const text = sel.match(/:contains\("([^"]+)"\)/)?.[1];
          if (text) {
            await this.page.evaluate((searchText) => {
              const elements = Array.from(document.querySelectorAll('button, a, input[type="submit"], .btn'));
              const element = elements.find(el => el.textContent?.includes(searchText));
              if (element) (element as HTMLElement).click();
            }, text);
            return;
          }
        } else {
          await this.page.waitForSelector(sel, { timeout: 5000 });
          await this.page.click(sel);
          return;
        }
      } catch (error) {
        continue; // Try next selector
      }
    }
    
    throw new Error(`Could not click any selector: ${selector}`);
  }

  // Smart typing with various input handling
  private async smartType(selector: string, value: string, timeout = 10000): Promise<void> {
    const selectors = selector.split(', ');
    
    for (const sel of selectors) {
      try {
        await this.page.waitForSelector(sel, { timeout: 5000 });
        await this.page.click(sel);
        await this.page.evaluate((selector) => {
          const element = document.querySelector(selector) as HTMLInputElement;
          if (element) element.value = '';
        }, sel);
        await this.page.type(sel, value, { delay: 50 });
        return;
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`Could not type in any selector: ${selector}`);
  }

  // Extract text from various elements
  private async extractText(selector: string): Promise<string> {
    const selectors = selector.split(', ');
    
    for (const sel of selectors) {
      try {
        await this.page.waitForSelector(sel, { timeout: 5000 });
        const text = await this.page.$eval(sel, el => el.textContent || (el as HTMLInputElement).value);
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (error) {
        continue;
      }
    }
    
    return '';
  }

  // Find API key using various patterns
  private async findApiKeyOnPage(): Promise<string> {
    const apiKeyPatterns = [
      /[A-Za-z0-9]{20,}/,  // Generic API key pattern
      /sk-[A-Za-z0-9]{48}/, // OpenAI-style
      /AIza[A-Za-z0-9-]{35}/, // Google API key
      /[a-f0-9]{32}/, // MD5-style
      /[A-Z0-9]{16,}/ // All caps alphanumeric
    ];

    const pageContent = await this.page.content();
    
    for (const pattern of apiKeyPatterns) {
      const match = pageContent.match(pattern);
      if (match) {
        return match[0];
      }
    }

    // Try extracting from specific elements
    const keyElements = await this.page.$$eval(
      'code, .api-key, .key, [data-key], pre, .token, .secret',
      elements => elements.map(el => el.textContent).filter(Boolean)
    );

    for (const text of keyElements) {
      for (const pattern of apiKeyPatterns) {
        const match = text?.match(pattern);
        if (match) {
          return match[0];
        }
      }
    }

    return '';
  }

  // Extract account details from the page
  private async extractAccountDetails(): Promise<any> {
    try {
      return await this.page.evaluate(() => {
        const details: any = {};
        
        // Look for account ID patterns
        const accountIdEl = document.querySelector('[data-account-id], .account-id, #account-id');
        if (accountIdEl) details.accountId = accountIdEl.textContent;
        
        // Look for user ID patterns
        const userIdEl = document.querySelector('[data-user-id], .user-id, #user-id');
        if (userIdEl) details.userId = userIdEl.textContent;
        
        // Look for rate limit information
        const rateLimitEl = document.querySelector('.rate-limit, .quota, .usage');
        if (rateLimitEl) details.rateLimit = rateLimitEl.textContent;
        
        return details;
      });
    } catch (error) {
      return {};
    }
  }

  // Try alternative approaches when primary fails
  private async tryAlternativeApproach(step: AutomationStep): Promise<void> {
    if (step.action === 'click') {
      // Try clicking by text content
      await this.page.evaluate((description) => {
        const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"]'));
        const button = buttons.find(btn => 
          btn.textContent?.toLowerCase().includes('submit') ||
          btn.textContent?.toLowerCase().includes('sign up') ||
          btn.textContent?.toLowerCase().includes('register') ||
          btn.textContent?.toLowerCase().includes('get') ||
          btn.textContent?.toLowerCase().includes('create')
        );
        if (button) (button as HTMLElement).click();
      }, step.description);
    }
  }

  // Verify element exists
  private async verifyElement(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Take screenshot with description
  private async takeScreenshot(description: string): Promise<void> {
    if (!this.page) return;
    
    const screenshot = await this.page.screenshot({ 
      encoding: 'base64',
      fullPage: false 
    });
    
    this.screenshots.push(`data:image/png;base64,${screenshot}`);
  }

  // Process step templates with actual values
  private processSteps(steps: AutomationStep[], data: any): AutomationStep[] {
    return steps.map(step => ({
      ...step,
      value: step.value ? this.replaceTemplates(step.value, data) : step.value
    }));
  }

  // Replace template variables
  private replaceTemplates(template: string, data: any): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Generate secure random password
  private generateSecurePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Batch acquire multiple API keys
  async batchAcquireKeys(requests: ApiKeyRequest[]): Promise<ApiKeyResult[]> {
    const results: ApiKeyResult[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.acquireApiKey(request);
        results.push(result);
        
        // Wait between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        results.push({
          success: false,
          serviceName: request.serviceName,
          screenshots: [],
          steps: [],
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  // Get supported services
  getSupportedServices(): ServiceConfig[] {
    return this.serviceConfigs;
  }

  // Use OpenAI to generate custom automation steps for unsupported services
  async generateCustomSteps(serviceName: string, registrationUrl: string): Promise<AutomationStep[]> {
    try {
      const prompt = `Generate automated steps to register for ${serviceName} API at ${registrationUrl}.
      
      Provide steps in JSON format as an array of objects with:
      - action: 'navigate'|'click'|'type'|'wait'|'extract'
      - selector: CSS selector (optional)
      - value: value to type or URL to navigate (optional)
      - description: human-readable description
      - timeout: timeout in milliseconds (optional)
      
      Focus on common registration patterns: navigate to signup, fill form fields (name, email, purpose), submit, and extract API key.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an automation expert. Generate precise web automation steps for API registration." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.steps || [];
    } catch (error) {
      throw new Error('Failed to generate custom automation steps');
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export const automatedApiKeyManager = new AutomatedApiKeyManager();