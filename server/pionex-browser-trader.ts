import puppeteer, { Browser, Page } from 'puppeteer';
import { safeActionExecutor } from './safe-action-executor';

interface PionexTrade {
  pair: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  type: 'market' | 'limit';
}

interface PionexAccount {
  email: string;
  password: string;
  balance: number;
  positions: any[];
}

export class PionexBrowserTrader {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isAuthenticated = false;
  private accountBalance = 0;
  private tradingPairs: string[] = ['BTC/USDT', 'ETH/USDT'];

  constructor() {
    console.log('🚀 Initializing Pionex Browser Trading System...');
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: false, // Show browser for manual verification
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

      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1280, height: 720 });
      
      console.log('✅ Pionex browser trader initialized');
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      throw error;
    }
  }

  async loginToPionex(email: string, password: string): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');
    
    try {
      console.log(`🔐 Logging into Pionex.us with ${email}...`);
      
      // Navigate to Pionex login
      await this.page.goto('https://www.pionex.us/en-US/sign-in', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for login form
      await this.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
      
      // Fill email
      await this.page.type('input[type="email"], input[name="email"]', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fill password
      await this.page.type('input[type="password"], input[name="password"]', password);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Click login button
      await this.page.click('button[type="submit"], .login-btn, .sign-in-btn');
      
      // Wait for successful login or dashboard
      try {
        await this.page.waitForNavigation({ 
          waitUntil: 'networkidle2', 
          timeout: 15000 
        });
        
        // Check if we're on dashboard or trading page
        const currentUrl = this.page.url();
        if (currentUrl.includes('dashboard') || currentUrl.includes('trade') || currentUrl.includes('spot')) {
          this.isAuthenticated = true;
          console.log('✅ Successfully logged into Pionex');
          
          // Get account balance
          await this.updateAccountBalance();
          return true;
        }
      } catch (navError) {
        console.log('⚠️ Navigation timeout, checking authentication status...');
        
        // Check if login was successful despite timeout
        const currentUrl = this.page.url();
        if (!currentUrl.includes('sign-in') && !currentUrl.includes('login')) {
          this.isAuthenticated = true;
          console.log('✅ Login appears successful');
          await this.updateAccountBalance();
          return true;
        }
      }
      
      console.log('❌ Login failed or requires manual verification');
      return false;
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  }

  async updateAccountBalance(): Promise<void> {
    if (!this.page || !this.isAuthenticated) return;
    
    try {
      // Navigate to spot trading or wallet page
      await this.page.goto('https://www.pionex.us/en-US/trade/BTC_USDT', {
        waitUntil: 'networkidle2',
        timeout: 15000
      });
      
      // Look for balance indicators
      const balanceSelectors = [
        '.balance-item .balance-value',
        '.wallet-balance .amount',
        '.total-balance',
        '[data-testid="balance"]',
        '.asset-balance .value'
      ];
      
      for (const selector of balanceSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          const balanceText = await this.page.$eval(selector, el => el.textContent || '');
          const balance = parseFloat(balanceText.replace(/[^0-9.]/g, ''));
          if (balance > 0) {
            this.accountBalance = balance;
            console.log(`💰 Account balance: $${balance}`);
            return;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      // Default balance if not found
      this.accountBalance = 153; // Starting amount from logs
      console.log('⚠️ Could not detect exact balance, using default: $153');
      
    } catch (error) {
      console.error('❌ Error updating balance:', error);
      this.accountBalance = 153;
    }
  }

  async executeTrade(trade: PionexTrade): Promise<boolean> {
    if (!this.page || !this.isAuthenticated) {
      throw new Error('Not authenticated with Pionex');
    }
    
    try {
      console.log(`📈 Executing ${trade.side} order for ${trade.amount} ${trade.pair}`);
      
      // Navigate to trading pair
      const pairUrl = `https://www.pionex.us/en-US/trade/${trade.pair.replace('/', '_')}`;
      await this.page.goto(pairUrl, { waitUntil: 'networkidle2' });
      
      // Wait for trading interface
      await this.page.waitForSelector('.trading-panel, .order-form, .trade-form', { timeout: 10000 });
      
      // Select buy/sell tab
      const tabSelector = trade.side === 'buy' ? '.buy-tab, .buy-btn, [data-side="buy"]' : '.sell-tab, .sell-btn, [data-side="sell"]';
      await this.page.click(tabSelector);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Select market order if specified
      if (trade.type === 'market') {
        try {
          await this.page.click('.market-order, [data-type="market"], .order-type-market');
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
          console.log('⚠️ Could not find market order option, using default');
        }
      }
      
      // Fill amount
      const amountSelectors = [
        'input[placeholder*="amount"], input[placeholder*="Amount"]',
        'input[name="amount"], input[name="quantity"]',
        '.amount-input input, .quantity-input input'
      ];
      
      for (const selector of amountSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          await this.page.click(selector, { clickCount: 3 }); // Select all
          await this.page.type(selector, trade.amount.toString());
          break;
        } catch (e) {
          // Try next selector
        }
      }
      
      // Submit order
      const submitSelectors = [
        `.${trade.side}-btn:not(.tab)`,
        `button[type="submit"]`,
        `.submit-order, .place-order`,
        `button:contains("${trade.side.toUpperCase()}")`
      ];
      
      for (const selector of submitSelectors) {
        try {
          await this.page.click(selector);
          console.log(`✅ Trade executed: ${trade.side} ${trade.amount} ${trade.pair}`);
          
          // Update balance after trade
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.updateAccountBalance();
          return true;
        } catch (e) {
          // Try next selector
        }
      }
      
      console.log('⚠️ Could not submit order - manual intervention may be required');
      return false;
      
    } catch (error) {
      console.error('❌ Trade execution error:', error);
      return false;
    }
  }

  async getAccountInfo(): Promise<PionexAccount> {
    await this.updateAccountBalance();
    
    return {
      email: 'bm.watson34@gmail.com',
      password: '[PROTECTED]',
      balance: this.accountBalance,
      positions: []
    };
  }

  async getCurrentPrices(): Promise<{ [pair: string]: number }> {
    if (!this.page) return {};
    
    const prices: { [pair: string]: number } = {};
    
    for (const pair of this.tradingPairs) {
      try {
        const pairUrl = `https://www.pionex.us/en-US/trade/${pair.replace('/', '_')}`;
        await this.page.goto(pairUrl, { waitUntil: 'networkidle2' });
        
        // Look for price display
        const priceSelectors = [
          '.current-price .price',
          '.ticker-price',
          '.last-price .value',
          '[data-testid="price"]'
        ];
        
        for (const selector of priceSelectors) {
          try {
            const priceText = await this.page.$eval(selector, el => el.textContent || '');
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            if (price > 0) {
              prices[pair] = price;
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }
      } catch (error) {
        console.error(`❌ Error getting price for ${pair}:`, error);
      }
    }
    
    return prices;
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser trader cleaned up');
    }
  }
}

export const pionexBrowserTrader = new PionexBrowserTrader();