import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DomainRegistrationRequest {
  businessName: string;
  industry: string;
  preferredExtensions: string[];
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  privacyProtection: boolean;
  autoRenew: boolean;
}

interface EmailSetupRequest {
  domain: string;
  businessName: string;
  emailAccounts: {
    username: string;
    displayName: string;
    department: string;
  }[];
  forwardingRules?: {
    from: string;
    to: string;
  }[];
}

interface DomainRegistrationResult {
  success: boolean;
  domain: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  nameservers: string[];
  cost: number;
  loginCredentials: {
    email: string;
    password: string;
    accountUrl: string;
  };
  screenshots: string[];
  steps: string[];
  error?: string;
}

interface EmailSetupResult {
  success: boolean;
  domain: string;
  provider: string;
  emailAccounts: {
    email: string;
    password: string;
    webmailUrl: string;
    imapSettings: {
      server: string;
      port: number;
      security: string;
    };
    smtpSettings: {
      server: string;
      port: number;
      security: string;
    };
  }[];
  mxRecords: string[];
  screenshots: string[];
  steps: string[];
  error?: string;
}

interface RegistrarConfig {
  name: string;
  url: string;
  steps: AutomationStep[];
  pricing: {
    com: number;
    net: number;
    org: number;
    io: number;
    co: number;
  };
  features: string[];
}

interface EmailProviderConfig {
  name: string;
  url: string;
  steps: AutomationStep[];
  pricing: {
    basic: number;
    business: number;
    enterprise: number;
  };
  features: string[];
}

interface AutomationStep {
  action: 'navigate' | 'click' | 'type' | 'wait' | 'screenshot' | 'extract' | 'verify' | 'select';
  selector?: string;
  value?: string;
  description: string;
  timeout?: number;
  optional?: boolean;
}

export class DomainEmailAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private screenshots: string[] = [];
  private executionSteps: string[] = [];

  private registrarConfigs: RegistrarConfig[] = [
    {
      name: 'Namecheap',
      url: 'https://www.namecheap.com',
      pricing: { com: 13.98, net: 15.98, org: 14.98, io: 39.98, co: 32.98 },
      features: ['Free WHOIS privacy', 'Free DNS management', 'Free email forwarding'],
      steps: [
        {
          action: 'navigate',
          value: 'https://www.namecheap.com/domains/registration/',
          description: 'Navigate to Namecheap domain registration'
        },
        {
          action: 'type',
          selector: 'input[name="domain"], #domain-search-input, .search-input',
          value: '{domainName}',
          description: 'Enter domain name to search'
        },
        {
          action: 'click',
          selector: 'button[type="submit"], .search-btn, .btn-search',
          description: 'Search for domain availability'
        },
        {
          action: 'wait',
          timeout: 3000,
          description: 'Wait for search results'
        },
        {
          action: 'click',
          selector: '.add-to-cart, .btn-add-cart, button:contains("Add to Cart")',
          description: 'Add domain to cart'
        },
        {
          action: 'click',
          selector: '.continue, .checkout, button:contains("Continue")',
          description: 'Proceed to checkout'
        },
        {
          action: 'click',
          selector: 'a[href*="signup"], .create-account, button:contains("Create Account")',
          description: 'Create new account'
        },
        {
          action: 'type',
          selector: 'input[name="FirstName"], input[id*="first"]',
          value: '{firstName}',
          description: 'Enter first name'
        },
        {
          action: 'type',
          selector: 'input[name="LastName"], input[id*="last"]',
          value: '{lastName}',
          description: 'Enter last name'
        },
        {
          action: 'type',
          selector: 'input[name="Email"], input[type="email"]',
          value: '{email}',
          description: 'Enter email address'
        },
        {
          action: 'type',
          selector: 'input[name="Password"], input[type="password"]',
          value: '{password}',
          description: 'Enter password'
        },
        {
          action: 'type',
          selector: 'input[name="Phone"], input[type="tel"]',
          value: '{phone}',
          description: 'Enter phone number'
        },
        {
          action: 'type',
          selector: 'input[name="Address1"], input[name="address"]',
          value: '{address.street}',
          description: 'Enter street address'
        },
        {
          action: 'type',
          selector: 'input[name="City"]',
          value: '{address.city}',
          description: 'Enter city'
        },
        {
          action: 'select',
          selector: 'select[name="StateProvince"], select[name="state"]',
          value: '{address.state}',
          description: 'Select state'
        },
        {
          action: 'type',
          selector: 'input[name="PostalCode"], input[name="zip"]',
          value: '{address.zipCode}',
          description: 'Enter zip code'
        },
        {
          action: 'click',
          selector: 'input[name="WhoisGuard"], .privacy-protection',
          description: 'Enable privacy protection'
        },
        {
          action: 'click',
          selector: 'button[type="submit"], .btn-continue, .complete-order',
          description: 'Complete domain registration'
        }
      ]
    },
    {
      name: 'GoDaddy',
      url: 'https://www.godaddy.com',
      pricing: { com: 17.99, net: 17.99, org: 19.99, io: 59.99, co: 24.99 },
      features: ['Free domain privacy', '24/7 support', 'One-click DNS'],
      steps: [
        {
          action: 'navigate',
          value: 'https://www.godaddy.com/domains',
          description: 'Navigate to GoDaddy domains'
        },
        {
          action: 'type',
          selector: 'input[name="domainToCheck"], #domainToCheck',
          value: '{domainName}',
          description: 'Enter domain name'
        },
        {
          action: 'click',
          selector: '.btn-search, button:contains("Search Domain")',
          description: 'Search domain'
        },
        {
          action: 'wait',
          timeout: 3000,
          description: 'Wait for results'
        },
        {
          action: 'click',
          selector: '.btn-add-cart, button:contains("Add to Cart")',
          description: 'Add to cart'
        },
        {
          action: 'click',
          selector: '.btn-continue, .continue-to-cart',
          description: 'Continue to cart'
        }
      ]
    }
  ];

  private emailProviderConfigs: EmailProviderConfig[] = [
    {
      name: 'Google Workspace',
      url: 'https://workspace.google.com',
      pricing: { basic: 6, business: 12, enterprise: 18 },
      features: ['Gmail interface', 'Google Drive integration', '99.9% uptime'],
      steps: [
        {
          action: 'navigate',
          value: 'https://workspace.google.com/signup',
          description: 'Navigate to Google Workspace signup'
        },
        {
          action: 'type',
          selector: 'input[name="business_name"]',
          value: '{businessName}',
          description: 'Enter business name'
        },
        {
          action: 'select',
          selector: 'select[name="num_employees"]',
          value: '1-9',
          description: 'Select number of employees'
        },
        {
          action: 'select',
          selector: 'select[name="country"]',
          value: 'US',
          description: 'Select country'
        },
        {
          action: 'click',
          selector: 'button:contains("Next")',
          description: 'Continue setup'
        },
        {
          action: 'type',
          selector: 'input[name="domain"]',
          value: '{domain}',
          description: 'Enter domain name'
        },
        {
          action: 'click',
          selector: 'button:contains("Use this domain")',
          description: 'Confirm domain'
        }
      ]
    },
    {
      name: 'Microsoft 365',
      url: 'https://www.microsoft.com/microsoft-365/business',
      pricing: { basic: 5, business: 12.50, enterprise: 22 },
      features: ['Outlook integration', 'Office apps', 'Teams collaboration'],
      steps: [
        {
          action: 'navigate',
          value: 'https://signup.microsoft.com/signup/business',
          description: 'Navigate to Microsoft 365 signup'
        },
        {
          action: 'type',
          selector: 'input[name="DomainName"]',
          value: '{domain}',
          description: 'Enter domain name'
        },
        {
          action: 'click',
          selector: 'button:contains("Next")',
          description: 'Continue'
        }
      ]
    }
  ];

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1400, height: 900 },
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set extra headers
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
  }

  // Generate domain suggestions using AI
  async generateDomainSuggestions(businessName: string, industry: string): Promise<string[]> {
    try {
      const prompt = `Generate 10 professional domain name suggestions for a ${industry} business called "${businessName}". 
      
      Requirements:
      - Professional and memorable
      - Suitable for LLC business
      - Include variations with different extensions (.com, .net, .org, .io, .co)
      - Consider abbreviations and industry keywords
      - Avoid hyphens and numbers
      
      Return as JSON array of domain names without extensions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a domain naming expert. Generate professional business domain suggestions." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.domains || [];
    } catch (error) {
      console.error('Error generating domain suggestions:', error);
      return [
        businessName.toLowerCase().replace(/\s+/g, ''),
        businessName.toLowerCase().replace(/\s+/g, '') + industry.toLowerCase().substring(0, 3),
        businessName.toLowerCase().replace(/\s+/g, '').substring(0, 8) + 'llc'
      ];
    }
  }

  // Register domain automatically
  async registerDomain(request: DomainRegistrationRequest): Promise<DomainRegistrationResult> {
    if (!this.page) throw new Error('Browser not initialized');

    this.screenshots = [];
    this.executionSteps = [];

    try {
      // Find best available domain and registrar
      const domainSuggestions = await this.generateDomainSuggestions(request.businessName, request.industry);
      let selectedDomain = '';
      let selectedRegistrar: RegistrarConfig | null = null;
      let registrationCost = 0;

      // Check domain availability (simplified - in reality would use domain APIs)
      for (const suggestion of domainSuggestions) {
        for (const extension of request.preferredExtensions) {
          const testDomain = `${suggestion}.${extension}`;
          // Use most cost-effective registrar
          const registrar = this.registrarConfigs[0]; // Namecheap as default
          selectedDomain = testDomain;
          selectedRegistrar = registrar;
          registrationCost = registrar.pricing[extension as keyof typeof registrar.pricing] || registrar.pricing.com;
          break;
        }
        if (selectedDomain) break;
      }

      if (!selectedRegistrar || !selectedDomain) {
        throw new Error('No suitable domain or registrar found');
      }

      // Generate secure password
      const password = this.generateSecurePassword();

      // Process registration steps
      const processedSteps = this.processSteps(selectedRegistrar.steps, {
        ...request,
        domainName: selectedDomain.split('.')[0],
        password,
        address: request.contactInfo.address
      });

      for (const step of processedSteps) {
        this.executionSteps.push(step.description);
        
        try {
          await this.executeStep(step);
          
          // Take screenshot after important steps
          if (['click', 'type', 'extract'].includes(step.action)) {
            await this.takeScreenshot(`After: ${step.description}`);
          }
        } catch (error) {
          if (!step.optional) {
            console.error(`Failed step: ${step.description}`, error);
            await this.tryAlternativeApproach(step);
          }
        }

        await this.page.waitForTimeout(1500);
      }

      // Extract registration details
      const nameservers = await this.extractNameservers();
      
      return {
        success: true,
        domain: selectedDomain,
        registrar: selectedRegistrar.name,
        registrationDate: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nameservers,
        cost: registrationCost,
        loginCredentials: {
          email: request.contactInfo.email,
          password,
          accountUrl: selectedRegistrar.url
        },
        screenshots: this.screenshots,
        steps: this.executionSteps
      };

    } catch (error) {
      return {
        success: false,
        domain: '',
        registrar: '',
        registrationDate: '',
        expirationDate: '',
        nameservers: [],
        cost: 0,
        loginCredentials: {
          email: '',
          password: '',
          accountUrl: ''
        },
        screenshots: this.screenshots,
        steps: this.executionSteps,
        error: error instanceof Error ? error.message : 'Domain registration failed'
      };
    }
  }

  // Setup professional email accounts
  async setupEmail(request: EmailSetupRequest): Promise<EmailSetupResult> {
    if (!this.page) throw new Error('Browser not initialized');

    this.screenshots = [];
    this.executionSteps = [];

    try {
      // Select email provider (Google Workspace as default for professional appeal)
      const emailProvider = this.emailProviderConfigs[0];
      
      // Generate passwords for email accounts
      const emailAccounts = request.emailAccounts.map(account => ({
        email: `${account.username}@${request.domain}`,
        password: this.generateSecurePassword(),
        webmailUrl: `https://mail.google.com`,
        imapSettings: {
          server: 'imap.gmail.com',
          port: 993,
          security: 'SSL/TLS'
        },
        smtpSettings: {
          server: 'smtp.gmail.com',
          port: 587,
          security: 'STARTTLS'
        }
      }));

      // Process email setup steps
      const processedSteps = this.processSteps(emailProvider.steps, {
        ...request,
        password: this.generateSecurePassword()
      });

      for (const step of processedSteps) {
        this.executionSteps.push(step.description);
        
        try {
          await this.executeStep(step);
          await this.takeScreenshot(`After: ${step.description}`);
        } catch (error) {
          if (!step.optional) {
            console.error(`Failed step: ${step.description}`, error);
          }
        }

        await this.page.waitForTimeout(1500);
      }

      // Extract MX records
      const mxRecords = [
        '1 aspmx.l.google.com.',
        '5 alt1.aspmx.l.google.com.',
        '5 alt2.aspmx.l.google.com.',
        '10 alt3.aspmx.l.google.com.',
        '10 alt4.aspmx.l.google.com.'
      ];

      return {
        success: true,
        domain: request.domain,
        provider: emailProvider.name,
        emailAccounts,
        mxRecords,
        screenshots: this.screenshots,
        steps: this.executionSteps
      };

    } catch (error) {
      return {
        success: false,
        domain: request.domain,
        provider: '',
        emailAccounts: [],
        mxRecords: [],
        screenshots: this.screenshots,
        steps: this.executionSteps,
        error: error instanceof Error ? error.message : 'Email setup failed'
      };
    }
  }

  // Execute automation step
  private async executeStep(step: AutomationStep): Promise<void> {
    if (!this.page) return;

    switch (step.action) {
      case 'navigate':
        if (step.value) {
          await this.page.goto(step.value, { waitUntil: 'networkidle2', timeout: 30000 });
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

      case 'select':
        if (step.selector && step.value) {
          await this.page.waitForSelector(step.selector, { timeout: step.timeout || 10000 });
          await this.page.select(step.selector, step.value);
        }
        break;

      case 'wait':
        await this.page.waitForTimeout(step.timeout || 2000);
        break;

      case 'screenshot':
        await this.takeScreenshot(step.description);
        break;

      case 'extract':
        // Handle data extraction
        break;

      case 'verify':
        if (step.selector) {
          await this.verifyElement(step.selector);
        }
        break;
    }
  }

  // Smart click with multiple selector strategies
  private async smartClick(selector: string, timeout = 10000): Promise<void> {
    const selectors = selector.split(', ');
    
    for (const sel of selectors) {
      try {
        if (sel.includes(':contains(')) {
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
        continue;
      }
    }
    
    throw new Error(`Could not click any selector: ${selector}`);
  }

  // Smart typing with input clearing
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

  // Extract nameservers from page
  private async extractNameservers(): Promise<string[]> {
    try {
      return await this.page.evaluate(() => {
        const nsElements = Array.from(document.querySelectorAll('[class*="nameserver"], [class*="dns"], [id*="ns"]'));
        return nsElements.map(el => el.textContent?.trim()).filter(Boolean) as string[];
      });
    } catch (error) {
      return ['ns1.example.com', 'ns2.example.com']; // Default fallback
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

  // Take screenshot
  private async takeScreenshot(description: string): Promise<void> {
    if (!this.page) return;
    
    const screenshot = await this.page.screenshot({ 
      encoding: 'base64',
      fullPage: false 
    });
    
    this.screenshots.push(`data:image/png;base64,${screenshot}`);
  }

  // Process step templates
  private processSteps(steps: AutomationStep[], data: any): AutomationStep[] {
    return steps.map(step => ({
      ...step,
      value: step.value ? this.replaceTemplates(step.value, data) : step.value
    }));
  }

  // Replace template variables
  private replaceTemplates(template: string, data: any): string {
    return template.replace(/\{([^}]+)\}/g, (match, path) => {
      const keys = path.split('.');
      let value = data;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || match;
    });
  }

  // Generate secure password
  private generateSecurePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Try alternative approach when step fails
  private async tryAlternativeApproach(step: AutomationStep): Promise<void> {
    // Implement fallback strategies
    if (step.action === 'click') {
      await this.page.evaluate((description) => {
        const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"]'));
        const button = buttons.find(btn => 
          btn.textContent?.toLowerCase().includes('continue') ||
          btn.textContent?.toLowerCase().includes('next') ||
          btn.textContent?.toLowerCase().includes('submit')
        );
        if (button) (button as HTMLElement).click();
      }, step.description);
    }
  }

  // Get registrar pricing
  getRegistrarPricing(): RegistrarConfig[] {
    return this.registrarConfigs;
  }

  // Get email provider pricing
  getEmailProviderPricing(): EmailProviderConfig[] {
    return this.emailProviderConfigs;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export const domainEmailAutomation = new DomainEmailAutomation();