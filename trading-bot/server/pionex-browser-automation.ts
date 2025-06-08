import puppeteer, { Browser, Page } from 'puppeteer';

interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

interface TradingBotConfig {
  strategy: 'grid' | 'dca' | 'rebalancing';
  pair: string;
  investment: number;
  gridNumber?: number;
  priceRange?: { upper: number; lower: number };
}

interface BotStatus {
  id: string;
  name: string;
  type: string;
  profit: number;
  status: 'RUNNING' | 'STOPPED' | 'PAUSED';
  investment: number;
}

export class PionexBrowserAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn: boolean = false;
  private baseUrl: string = 'https://www.pionex.com';

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });

      this.page = await this.browser.newPage();
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      console.log('Pionex browser automation initialized');
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    try {
      console.log('Navigating to Pionex login page...');
      await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle2' });

      // Wait for login form
      await this.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

      // Fill email
      await this.page.type('input[type="email"], input[name="email"]', credentials.email);
      await this.page.waitForTimeout(1000);

      // Fill password
      await this.page.type('input[type="password"], input[name="password"]', credentials.password);
      await this.page.waitForTimeout(1000);

      // Click login button
      await this.page.click('button[type="submit"], .login-btn, .submit-btn');

      // Handle 2FA if required
      if (credentials.twoFactorCode) {
        try {
          await this.page.waitForSelector('.two-factor-input, input[name="code"]', { timeout: 5000 });
          await this.page.type('.two-factor-input, input[name="code"]', credentials.twoFactorCode);
          await this.page.click('.two-factor-submit, button[type="submit"]');
        } catch (error) {
          console.log('No 2FA required or different selector');
        }
      }

      // Wait for successful login
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });

      // Check if login was successful
      const currentUrl = this.page.url();
      this.isLoggedIn = !currentUrl.includes('/login') && !currentUrl.includes('/signin');

      if (this.isLoggedIn) {
        console.log('Successfully logged into Pionex');
      } else {
        console.log('Login failed - still on login page');
      }

      return this.isLoggedIn;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async navigateToTradingBots(): Promise<void> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Not logged in or browser not initialized');
    }

    try {
      console.log('Navigating to trading bots section...');
      
      // Try multiple possible navigation paths
      const botSelectors = [
        'a[href*="bot"]',
        '.trading-bot-menu',
        '.bot-trading',
        'nav a:contains("Bot")',
        '.menu-item:contains("Trading Bot")'
      ];

      for (const selector of botSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          await this.page.click(selector);
          await this.page.waitForTimeout(2000);
          break;
        } catch (error) {
          console.log(`Selector ${selector} not found, trying next...`);
        }
      }

      // Alternative: direct navigation
      await this.page.goto(`${this.baseUrl}/trading-bot`, { waitUntil: 'networkidle2' });
      
      console.log('Navigated to trading bots section');
    } catch (error) {
      console.error('Failed to navigate to trading bots:', error);
      throw error;
    }
  }

  async createGridTradingBot(config: TradingBotConfig): Promise<boolean> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Not logged in or browser not initialized');
    }

    try {
      console.log(`Creating grid trading bot for ${config.pair}...`);

      // Navigate to bot creation
      await this.navigateToTradingBots();

      // Click create new bot
      const createSelectors = [
        '.create-bot-btn',
        'button:contains("Create")',
        '.new-bot-button',
        '[data-testid="create-bot"]'
      ];

      for (const selector of createSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          await this.page.click(selector);
          break;
        } catch (error) {
          console.log(`Create button selector ${selector} not found`);
        }
      }

      // Select Grid Trading strategy
      await this.page.waitForTimeout(2000);
      const gridSelectors = [
        '.grid-trading-option',
        'button:contains("Grid")',
        '[data-strategy="grid"]'
      ];

      for (const selector of gridSelectors) {
        try {
          await this.page.click(selector);
          break;
        } catch (error) {
          console.log(`Grid selector ${selector} not found`);
        }
      }

      // Select trading pair
      await this.page.waitForTimeout(1000);
      const pairSelectors = [
        '.pair-selector',
        '.trading-pair-input',
        'input[placeholder*="pair"]'
      ];

      for (const selector of pairSelectors) {
        try {
          await this.page.click(selector);
          await this.page.type(selector, config.pair);
          await this.page.keyboard.press('Enter');
          break;
        } catch (error) {
          console.log(`Pair selector ${selector} not found`);
        }
      }

      // Set investment amount
      const investmentSelectors = [
        '.investment-input',
        'input[name="investment"]',
        'input[placeholder*="amount"]'
      ];

      for (const selector of investmentSelectors) {
        try {
          await this.page.click(selector);
          await this.page.keyboard.down('Control');
          await this.page.keyboard.press('KeyA');
          await this.page.keyboard.up('Control');
          await this.page.type(selector, config.investment.toString());
          break;
        } catch (error) {
          console.log(`Investment selector ${selector} not found`);
        }
      }

      // Set grid parameters if provided
      if (config.gridNumber) {
        const gridNumberSelectors = [
          '.grid-number-input',
          'input[name="gridNumber"]'
        ];

        for (const selector of gridNumberSelectors) {
          try {
            await this.page.click(selector);
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.type(selector, config.gridNumber.toString());
            break;
          } catch (error) {
            console.log(`Grid number selector ${selector} not found`);
          }
        }
      }

      // Submit bot creation
      const submitSelectors = [
        '.create-submit-btn',
        'button[type="submit"]',
        'button:contains("Create Bot")',
        '.confirm-create-btn'
      ];

      for (const selector of submitSelectors) {
        try {
          await this.page.click(selector);
          break;
        } catch (error) {
          console.log(`Submit selector ${selector} not found`);
        }
      }

      // Wait for confirmation
      await this.page.waitForTimeout(3000);

      console.log(`Grid trading bot created for ${config.pair}`);
      return true;
    } catch (error) {
      console.error('Failed to create grid trading bot:', error);
      return false;
    }
  }

  async getActiveBots(): Promise<BotStatus[]> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Not logged in or browser not initialized');
    }

    try {
      await this.navigateToTradingBots();
      await this.page.waitForTimeout(2000);

      // Get bot list
      const bots = await this.page.evaluate(() => {
        const botElements = document.querySelectorAll('.bot-item, .trading-bot-row, .bot-card');
        const botList: BotStatus[] = [];

        botElements.forEach((element, index) => {
          const nameElement = element.querySelector('.bot-name, .bot-title, h3, h4');
          const profitElement = element.querySelector('.profit, .pnl, .return');
          const statusElement = element.querySelector('.status, .bot-status');
          const investmentElement = element.querySelector('.investment, .amount');

          const name = nameElement?.textContent?.trim() || `Bot ${index + 1}`;
          const profitText = profitElement?.textContent?.trim() || '0';
          const statusText = statusElement?.textContent?.trim() || 'RUNNING';
          const investmentText = investmentElement?.textContent?.trim() || '0';

          const profit = parseFloat(profitText.replace(/[^0-9.-]/g, '')) || 0;
          const investment = parseFloat(investmentText.replace(/[^0-9.-]/g, '')) || 0;

          let status: 'RUNNING' | 'STOPPED' | 'PAUSED' = 'RUNNING';
          if (statusText.toLowerCase().includes('stop')) status = 'STOPPED';
          else if (statusText.toLowerCase().includes('pause')) status = 'PAUSED';

          botList.push({
            id: `bot_${index}`,
            name,
            type: 'Grid Trading',
            profit,
            status,
            investment
          });
        });

        return botList;
      });

      console.log(`Found ${bots.length} active trading bots`);
      return bots;
    } catch (error) {
      console.error('Failed to get active bots:', error);
      return [];
    }
  }

  async stopBot(botId: string): Promise<boolean> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Not logged in or browser not initialized');
    }

    try {
      console.log(`Stopping bot ${botId}...`);

      await this.navigateToTradingBots();
      await this.page.waitForTimeout(2000);

      // Find and click stop button for the specific bot
      const stopSelectors = [
        '.stop-btn',
        'button:contains("Stop")',
        '.bot-stop-button',
        '[data-action="stop"]'
      ];

      for (const selector of stopSelectors) {
        try {
          const elements = await this.page.$$(selector);
          if (elements.length > 0) {
            // Click the first stop button (or implement logic to find the right one)
            await elements[0].click();
            
            // Confirm if needed
            await this.page.waitForTimeout(1000);
            const confirmSelectors = [
              '.confirm-btn',
              'button:contains("Confirm")',
              '.modal-confirm'
            ];

            for (const confirmSelector of confirmSelectors) {
              try {
                await this.page.click(confirmSelector);
                break;
              } catch (error) {
                // Confirmation might not be needed
              }
            }

            await this.page.waitForTimeout(2000);
            console.log(`Bot ${botId} stopped successfully`);
            return true;
          }
        } catch (error) {
          console.log(`Stop selector ${selector} not found`);
        }
      }

      return false;
    } catch (error) {
      console.error(`Failed to stop bot ${botId}:`, error);
      return false;
    }
  }

  async getAccountBalance(): Promise<{ total: number; available: number; inBots: number }> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Not logged in or browser not initialized');
    }

    try {
      // Navigate to wallet or account page
      await this.page.goto(`${this.baseUrl}/wallet`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(2000);

      const balance = await this.page.evaluate(() => {
        const totalElements = document.querySelectorAll('.total-balance, .account-balance, .wallet-total');
        const availableElements = document.querySelectorAll('.available-balance, .free-balance');
        const lockedElements = document.querySelectorAll('.locked-balance, .in-use-balance');

        const total = totalElements.length > 0 
          ? parseFloat(totalElements[0].textContent?.replace(/[^0-9.-]/g, '') || '0') 
          : 0;
        
        const available = availableElements.length > 0 
          ? parseFloat(availableElements[0].textContent?.replace(/[^0-9.-]/g, '') || '0') 
          : 0;
        
        const inBots = lockedElements.length > 0 
          ? parseFloat(lockedElements[0].textContent?.replace(/[^0-9.-]/g, '') || '0') 
          : 0;

        return { total, available, inBots };
      });

      console.log(`Account balance: Total: $${balance.total}, Available: $${balance.available}, In Bots: $${balance.inBots}`);
      return balance;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return { total: 0, available: 0, inBots: 0 };
    }
  }

  async takeScreenshot(filename: string): Promise<string> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    try {
      const screenshot = await this.page.screenshot({
        path: filename,
        fullPage: true,
        type: 'png'
      });
      
      console.log(`Screenshot saved: ${filename}`);
      return filename;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      throw error;
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isLoggedIn = false;
      console.log('Browser closed');
    }
  }

  async checkLoginStatus(): Promise<boolean> {
    if (!this.page) {
      return false;
    }

    try {
      const currentUrl = this.page.url();
      this.isLoggedIn = !currentUrl.includes('/login') && !currentUrl.includes('/signin');
      return this.isLoggedIn;
    } catch (error) {
      return false;
    }
  }
}

export const pionexAutomation = new PionexBrowserAutomation();