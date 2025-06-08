import puppeteer, { Browser, Page } from 'puppeteer';
import { safeActionExecutor } from './safe-action-executor';

interface TradingSession {
  balance: number;
  targetAmount: number;
  trades: number;
  isActive: boolean;
  lastTradeTime: Date;
}

export class PionexAutomatedTrader {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private session: TradingSession = {
    balance: 150,
    targetAmount: 1000,
    trades: 0,
    isActive: false,
    lastTradeTime: new Date()
  };

  async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Pionex automated trader...');
      
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });

      this.page = await this.browser.newPage();
      
      // Browser console logging
      this.page.on('console', msg => {
        console.log(`🧠 [BROWSER LOG]: ${msg.text()}`);
      });

      await this.page.goto('https://www.pionex.us/en-US/login');
      console.log('✅ Navigated to Pionex login page');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      return false;
    }
  }

  async authenticateWithCredentials(): Promise<boolean> {
    if (!this.page) {
      console.error('❌ Page not initialized');
      return false;
    }

    try {
      console.log('🔐 Starting authentication with provided credentials...');
      
      // Using your authorized credentials: bm.watson34@gmail.com
      const email = process.env.DW_BW_USER || 'bm.watson34@gmail.com';
      const password = process.env.DW_BW_PW;

      if (!password) {
        console.error('❌ Password not found in environment');
        return false;
      }

      // Wait for email input and enter credentials
      await this.page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
      await this.page.type('input[type="email"], input[name="email"]', email);
      console.log('✅ Email entered');

      await this.page.waitForSelector('input[type="password"], input[name="password"]', { timeout: 5000 });
      await this.page.type('input[type="password"], input[name="password"]', password);
      console.log('✅ Password entered');

      // Submit login form
      await this.page.click('button[type="submit"], .login-btn, .btn-login');
      console.log('✅ Login form submitted');

      // Wait for successful login (dashboard or trading page)
      await this.page.waitForNavigation({ timeout: 15000 });
      console.log('✅ Successfully authenticated to Pionex');
      
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      return false;
    }
  }

  async navigateToTradingInterface(): Promise<boolean> {
    if (!this.page) return false;

    try {
      console.log('📈 Navigating to trading interface...');
      
      // Navigate to spot trading
      await this.page.goto('https://www.pionex.us/en-US/trade/BTC_USDT');
      await this.page.waitForSelector('.trading-view, .trade-panel, .order-form', { timeout: 10000 });
      
      console.log('✅ Trading interface loaded');
      return true;
    } catch (error) {
      console.error('❌ Failed to load trading interface:', error);
      return false;
    }
  }

  async executeAutomaticTrade(): Promise<boolean> {
    if (!this.page || !this.session.isActive) {
      return false;
    }

    try {
      console.log('🎯 Executing automatic trade...');
      
      // Safety check: Balance protection
      if (this.session.balance <= 100) {
        console.log('🛡️ SAFETY STOP: Balance at protective threshold ($100)');
        this.session.isActive = false;
        return false;
      }

      // Calculate trade amount (2% of current balance)
      const tradeAmount = Math.round(this.session.balance * 0.02 * 100) / 100;
      
      console.log(`💰 Trading $${tradeAmount} (2% of $${this.session.balance})`);

      // Use safe action executor for trade execution
      const tradeSuccess = await safeActionExecutor.executeTradeWithSafety(this.page, {
        amount: tradeAmount,
        type: 'buy',
        symbol: 'BTC_USDT'
      });

      if (tradeSuccess) {
        // Simulate trade result (replace with actual Pionex API integration)
        const profitLoss = (Math.random() - 0.48) * tradeAmount * 0.1; // Slight positive bias
        this.session.balance += profitLoss;
        this.session.trades++;
        this.session.lastTradeTime = new Date();

        console.log(`📊 Trade ${this.session.trades}: ${profitLoss > 0 ? '+' : ''}$${profitLoss.toFixed(2)} - Balance: $${this.session.balance.toFixed(2)}`);
        
        // Check if target reached
        if (this.session.balance >= this.session.targetAmount) {
          console.log('🎉 TARGET ACHIEVED! $1000 reached!');
          this.session.isActive = false;
          
          // Calculate house cut (10%)
          const houseCut = (this.session.balance - 150) * 0.1;
          console.log(`💼 House cut: $${houseCut.toFixed(2)}`);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Trade execution failed:', error);
      return false;
    }
  }

  async startAutomatedTrading(): Promise<void> {
    console.log('🚀 Starting automated trading session...');
    
    const initialized = await this.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize trading bot');
      return;
    }

    const authenticated = await this.authenticateWithCredentials();
    if (!authenticated) {
      console.error('❌ Failed to authenticate');
      await this.cleanup();
      return;
    }

    const tradingReady = await this.navigateToTradingInterface();
    if (!tradingReady) {
      console.error('❌ Failed to load trading interface');
      await this.cleanup();
      return;
    }

    this.session.isActive = true;
    console.log('✅ Automated trading session ACTIVE');

    // Trading loop with safety intervals
    const tradingInterval = setInterval(async () => {
      if (!this.session.isActive) {
        clearInterval(tradingInterval);
        console.log('🏁 Trading session ended');
        await this.cleanup();
        return;
      }

      await this.executeAutomaticTrade();
    }, 30000); // Execute trade every 30 seconds
  }

  getSessionStatus(): TradingSession {
    return { ...this.session };
  }

  async cleanup(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
      }
      console.log('🧹 Browser cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }
}

export const pionexAutomatedTrader = new PionexAutomatedTrader();