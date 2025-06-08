import puppeteer, { Browser, Page } from 'puppeteer';
import { universalBrowserAutomation } from './universal-browser-automation';

interface PionexCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

interface AccountInfo {
  balance: number;
  availableBalance: number;
  currency: string;
  accountStatus: string;
}

interface TradeOrder {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  type: 'market' | 'limit';
}

interface TradeResult {
  success: boolean;
  orderId?: string;
  error?: string;
  executedPrice?: number;
  executedAmount?: number;
}

export class PionexLiveTradingEngine {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private credentials: PionexCredentials | null = null;
  private isLoggedIn: boolean = false;
  private accountInfo: AccountInfo | null = null;

  async initialize(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: false, // Keep visible for manual verification
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

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Set user agent to avoid detection
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
  }

  async setupCredentials(credentials: PionexCredentials): Promise<{
    success: boolean;
    error?: string;
    accountInfo?: AccountInfo;
  }> {
    try {
      this.credentials = credentials;
      
      await this.initialize();
      
      // Navigate to Pionex.us login page
      await this.page!.goto('https://www.pionex.us/en-US/sign-in', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      console.log('🔐 Attempting Pionex.us login...');

      // Wait for login form
      await this.page!.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

      // Fill email
      await this.page!.type('input[type="email"], input[name="email"]', credentials.email);
      await this.page!.waitForTimeout(1000);

      // Fill password
      await this.page!.type('input[type="password"], input[name="password"]', credentials.password);
      await this.page!.waitForTimeout(1000);

      // Click login button
      const loginButton = await this.page!.$('button[type="submit"], .login-btn, .sign-in-btn');
      if (loginButton) {
        await loginButton.click();
      } else {
        throw new Error('Login button not found');
      }

      // Wait for potential 2FA or dashboard
      await this.page!.waitForTimeout(3000);

      // Check if 2FA is required
      const twoFactorInput = await this.page!.$('input[name="code"], input[placeholder*="code"], .two-factor-input');
      if (twoFactorInput && credentials.twoFactorCode) {
        console.log('🔐 Entering 2FA code...');
        await this.page!.type('input[name="code"], input[placeholder*="code"], .two-factor-input', credentials.twoFactorCode);
        await this.page!.waitForTimeout(1000);
        
        const confirmButton = await this.page!.$('button[type="submit"], .confirm-btn');
        if (confirmButton) {
          await confirmButton.click();
        }
      }

      // Wait for successful login (dashboard or trading page)
      await this.page!.waitForTimeout(5000);

      // Check if we're logged in by looking for account elements
      const currentUrl = this.page!.url();
      const isOnDashboard = currentUrl.includes('trade') || currentUrl.includes('dashboard') || currentUrl.includes('wallet');

      if (!isOnDashboard) {
        throw new Error('Login failed - not redirected to dashboard');
      }

      this.isLoggedIn = true;
      console.log('✅ Successfully logged into Pionex.us');

      // Get account information
      this.accountInfo = await this.getAccountInfo();

      return {
        success: true,
        accountInfo: this.accountInfo
      };

    } catch (error) {
      console.error('❌ Pionex login error:', error);
      return {
        success: false,
        error: error.message || 'Failed to login to Pionex.us'
      };
    }
  }

  private async getAccountInfo(): Promise<AccountInfo> {
    try {
      // Navigate to wallet/balance page if not already there
      const currentUrl = this.page!.url();
      if (!currentUrl.includes('wallet') && !currentUrl.includes('balance')) {
        await this.page!.goto('https://www.pionex.us/en-US/trade', {
          waitUntil: 'networkidle2',
          timeout: 15000
        });
      }

      await this.page!.waitForTimeout(3000);

      // Try to extract balance information
      let balance = 0;
      let currency = 'USDT';

      // Look for balance elements (these selectors may need adjustment)
      const balanceElements = await this.page!.$$eval(
        '.balance, .wallet-balance, [class*="balance"], [class*="Balance"]',
        elements => elements.map(el => el.textContent)
      );

      for (const text of balanceElements) {
        if (text && text.includes('USDT')) {
          const match = text.match(/[\d,]+\.?\d*/);
          if (match) {
            balance = parseFloat(match[0].replace(/,/g, ''));
            break;
          }
        }
      }

      return {
        balance,
        availableBalance: balance,
        currency,
        accountStatus: 'active'
      };

    } catch (error) {
      console.error('Error getting account info:', error);
      return {
        balance: 0,
        availableBalance: 0,
        currency: 'USDT',
        accountStatus: 'unknown'
      };
    }
  }

  async executeTrade(order: TradeOrder): Promise<TradeResult> {
    if (!this.isLoggedIn || !this.page) {
      return {
        success: false,
        error: 'Not logged in to Pionex.us'
      };
    }

    try {
      console.log(`🔄 Executing ${order.side} order for ${order.amount} ${order.symbol}`);

      // Navigate to trading page for the symbol
      const tradingUrl = `https://www.pionex.us/en-US/trade/${order.symbol}`;
      await this.page.goto(tradingUrl, {
        waitUntil: 'networkidle2',
        timeout: 15000
      });

      await this.page.waitForTimeout(2000);

      // Click buy/sell tab
      const buySellTab = await this.page.$(`[data-testid="${order.side}"], .${order.side}-tab, button:contains("${order.side.toUpperCase()}")`);
      if (buySellTab) {
        await buySellTab.click();
        await this.page.waitForTimeout(1000);
      }

      // Select order type (market/limit)
      if (order.type === 'market') {
        const marketTab = await this.page.$('[data-testid="market"], .market-tab, button:contains("Market")');
        if (marketTab) {
          await marketTab.click();
          await this.page.waitForTimeout(500);
        }
      }

      // Fill amount
      const amountInput = await this.page.$('input[name="amount"], input[placeholder*="amount"], .amount-input');
      if (amountInput) {
        await amountInput.click({ clickCount: 3 }); // Select all
        await amountInput.type(order.amount.toString());
        await this.page.waitForTimeout(500);
      }

      // Fill price for limit orders
      if (order.type === 'limit' && order.price) {
        const priceInput = await this.page.$('input[name="price"], input[placeholder*="price"], .price-input');
        if (priceInput) {
          await priceInput.click({ clickCount: 3 });
          await priceInput.type(order.price.toString());
          await this.page.waitForTimeout(500);
        }
      }

      // Click submit/place order button
      const submitButton = await this.page.$(`button:contains("${order.side.toUpperCase()}"), .place-order-btn, .submit-btn`);
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForTimeout(2000);

        // Wait for confirmation dialog and confirm
        const confirmButton = await this.page.$('button:contains("Confirm"), .confirm-btn');
        if (confirmButton) {
          await confirmButton.click();
          await this.page.waitForTimeout(3000);
        }

        console.log(`✅ ${order.side.toUpperCase()} order submitted for ${order.symbol}`);

        return {
          success: true,
          orderId: `pionex_${Date.now()}`,
          executedAmount: order.amount
        };
      } else {
        throw new Error('Submit button not found');
      }

    } catch (error) {
      console.error(`❌ Trade execution error:`, error);
      return {
        success: false,
        error: error.message || 'Failed to execute trade'
      };
    }
  }

  async getBalance(): Promise<number> {
    if (this.accountInfo) {
      return this.accountInfo.availableBalance;
    }
    return 0;
  }

  async isConnected(): Promise<boolean> {
    return this.isLoggedIn && this.page !== null;
  }

  async disconnect(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isLoggedIn = false;
      this.credentials = null;
      this.accountInfo = null;
    }
  }

  async takeScreenshot(filename: string = 'pionex-screenshot'): Promise<string> {
    if (!this.page) return '';
    
    const screenshotPath = `/tmp/${filename}-${Date.now()}.png`;
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    return screenshotPath;
  }
}

export const pionexLiveTradingEngine = new PionexLiveTradingEngine();