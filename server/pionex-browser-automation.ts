import puppeteer, { Browser, Page } from 'puppeteer';

interface PionexCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

interface TradingSession {
  browser: Browser | null;
  page: Page | null;
  isLoggedIn: boolean;
  balance: number;
  activePositions: any[];
}

export class PionexBrowserAutomation {
  private session: TradingSession = {
    browser: null,
    page: null,
    isLoggedIn: false,
    balance: 0,
    activePositions: []
  };

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Pionex browser automation...');
    
    this.session.browser = await puppeteer.launch({
      headless: false, // Show browser for verification
      defaultViewport: null,
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

    this.session.page = await this.session.browser.newPage();
    await this.session.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  }

  async loginToPionex(credentials: PionexCredentials): Promise<boolean> {
    if (!this.session.page) {
      throw new Error('Browser not initialized');
    }

    try {
      console.log('🔐 Navigating to Pionex login...');
      await this.session.page.goto('https://www.pionex.us/login', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for login form
      await this.session.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

      console.log('📝 Filling login credentials...');
      // Fill email
      await this.session.page.type('input[type="email"], input[name="email"]', credentials.email);
      
      // Fill password
      await this.session.page.type('input[type="password"], input[name="password"]', credentials.password);

      // Click login button
      await this.session.page.click('button[type="submit"], .login-btn, .btn-login');

      // Handle 2FA if needed
      if (credentials.twoFactorCode) {
        await this.session.page.waitForSelector('.two-factor-input, input[name="code"]', { timeout: 10000 });
        await this.session.page.type('.two-factor-input, input[name="code"]', credentials.twoFactorCode);
        await this.session.page.click('.verify-btn, .confirm-btn');
      }

      // Wait for dashboard
      await this.session.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

      // Verify login success
      const currentUrl = this.session.page.url();
      this.session.isLoggedIn = currentUrl.includes('dashboard') || currentUrl.includes('trading') || currentUrl.includes('portfolio');

      if (this.session.isLoggedIn) {
        console.log('✅ Successfully logged into Pionex');
        await this.updateAccountBalance();
        return true;
      } else {
        console.log('❌ Login failed - not on dashboard');
        return false;
      }

    } catch (error) {
      console.error('❌ Pionex login error:', error);
      return false;
    }
  }

  async updateAccountBalance(): Promise<void> {
    if (!this.session.page || !this.session.isLoggedIn) return;

    try {
      // Navigate to portfolio/balance page
      await this.session.page.goto('https://www.pionex.us/portfolio', { 
        waitUntil: 'networkidle2',
        timeout: 15000 
      });

      // Wait for balance element
      await this.session.page.waitForSelector('.balance, .total-balance, .portfolio-value', { timeout: 10000 });

      // Extract balance
      const balanceText = await this.session.page.$eval(
        '.balance, .total-balance, .portfolio-value',
        el => el.textContent || '0'
      );

      // Parse balance (remove $ and commas)
      const balanceMatch = balanceText.match(/[\d,]+\.?\d*/);
      if (balanceMatch) {
        this.session.balance = parseFloat(balanceMatch[0].replace(/,/g, ''));
        console.log(`💰 Current balance: $${this.session.balance}`);
      }

    } catch (error) {
      console.error('❌ Error updating balance:', error);
    }
  }

  async executeManualTrade(pair: string, side: 'buy' | 'sell', amount: number): Promise<boolean> {
    if (!this.session.page || !this.session.isLoggedIn) {
      console.log('❌ Not logged in to Pionex');
      return false;
    }

    try {
      console.log(`🚀 Executing ${side} trade: ${amount} ${pair}`);

      // Navigate to trading page
      await this.session.page.goto(`https://www.pionex.us/trading/${pair}`, { 
        waitUntil: 'networkidle2',
        timeout: 15000 
      });

      // Wait for trading interface
      await this.session.page.waitForSelector('.trading-panel, .order-form', { timeout: 10000 });

      // Select buy/sell tab
      const tabSelector = side === 'buy' ? '.buy-tab, .btn-buy' : '.sell-tab, .btn-sell';
      await this.session.page.click(tabSelector);

      // Enter amount
      await this.session.page.waitForSelector('input[name="amount"], .amount-input', { timeout: 5000 });
      await this.session.page.click('input[name="amount"], .amount-input', { clickCount: 3 });
      await this.session.page.type('input[name="amount"], .amount-input', amount.toString());

      // Submit order
      await this.session.page.click('.submit-order, .place-order, .confirm-trade');

      // Wait for confirmation
      await this.session.page.waitForSelector('.order-success, .trade-success', { timeout: 10000 });

      console.log(`✅ Trade executed successfully: ${side} ${amount} ${pair}`);
      
      // Update balance after trade
      setTimeout(() => this.updateAccountBalance(), 2000);
      
      return true;

    } catch (error) {
      console.error(`❌ Trade execution failed:`, error);
      return false;
    }
  }

  async getAccountStatus(): Promise<any> {
    await this.updateAccountBalance();
    
    return {
      isLoggedIn: this.session.isLoggedIn,
      balance: this.session.balance,
      activePositions: this.session.activePositions,
      timestamp: new Date()
    };
  }

  async takeScreenshot(filename: string): Promise<string> {
    if (!this.session.page) return '';
    
    const screenshotPath = `./screenshots/${filename}`;
    await this.session.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  async closeBrowser(): Promise<void> {
    if (this.session.browser) {
      await this.session.browser.close();
      this.session.browser = null;
      this.session.page = null;
      this.session.isLoggedIn = false;
    }
  }
}

export const pionexBrowserAutomation = new PionexBrowserAutomation();