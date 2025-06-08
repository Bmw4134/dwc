import { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TradeMemory {
  lastTrade: Date;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  currentBalance: number;
  errors: string[];
}

export class SafeActionExecutor {
  private memoryFile = path.join(__dirname, '../data/trade_memory.json');

  async safeActionExecutor(
    page: Page, 
    actionFn: () => Promise<void>, 
    successSelector: string, 
    maxAttempts: number = 3
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Executing trade action - Attempt ${attempt}/${maxAttempts}`);
        
        await actionFn();
        await page.waitForSelector(successSelector, { timeout: 5000 });
        
        console.log(`✅ Action succeeded on attempt ${attempt}`);
        this.logTradeSuccess();
        return true;
      } catch (err: any) {
        console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
        this.logTradeError(err.message);
        
        if (attempt === maxAttempts) {
          throw new Error(`🔥 Action failed after ${maxAttempts} attempts. Aborting to avoid deathloop.`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  }

  async executeTradeWithSafety(page: Page, tradeData: any): Promise<boolean> {
    try {
      // Take screenshot before action
      await page.screenshot({ path: 'logs/before_trade.png' });
      
      const success = await this.safeActionExecutor(
        page,
        async () => {
          // Navigate to trading section
          await page.goto('https://pionex.us/en-US/trade/BTC_USDT', { waitUntil: 'networkidle2' });
          
          // Wait for trading interface to load
          await page.waitForSelector('.trading-panel', { timeout: 10000 });
          
          // Click buy button
          const buyButton = await page.$('.buy-button, [data-testid="buy-button"], .order-buy');
          if (buyButton) {
            await buyButton.click();
          }
          
          // Enter amount
          const amountInput = await page.$('input[placeholder*="amount"], input[name="amount"]');
          if (amountInput) {
            await amountInput.click({ clickCount: 3 });
            await amountInput.type(tradeData.amount.toString());
          }
          
          // Submit trade
          const submitButton = await page.$('.submit-order, .confirm-trade, [data-testid="submit"]');
          if (submitButton) {
            await submitButton.click();
          }
        },
        '.success-popup, .order-success, .trade-confirmed'
      );
      
      if (success) {
        await page.screenshot({ path: 'logs/trade_success.png' });
      }
      
      return success;
    } catch (error: any) {
      console.error('Trade execution failed:', error.message);
      await page.screenshot({ path: 'logs/trade_failed.png' });
      return false;
    }
  }

  private loadTradeMemory(): TradeMemory {
    try {
      if (fs.existsSync(this.memoryFile)) {
        const data = fs.readFileSync(this.memoryFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load trade memory, using defaults');
    }
    
    return {
      lastTrade: new Date(),
      totalTrades: 0,
      successfulTrades: 0,
      failedTrades: 0,
      currentBalance: 153,
      errors: []
    };
  }

  private saveTradeMemory(memory: TradeMemory): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.memoryFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.memoryFile, JSON.stringify(memory, null, 2));
    } catch (error) {
      console.error('Could not save trade memory:', error);
    }
  }

  private logTradeSuccess(): void {
    const memory = this.loadTradeMemory();
    memory.lastTrade = new Date();
    memory.totalTrades += 1;
    memory.successfulTrades += 1;
    this.saveTradeMemory(memory);
  }

  private logTradeError(error: string): void {
    const memory = this.loadTradeMemory();
    memory.lastTrade = new Date();
    memory.totalTrades += 1;
    memory.failedTrades += 1;
    memory.errors.push(`${new Date().toISOString()}: ${error}`);
    
    // Keep only last 10 errors
    if (memory.errors.length > 10) {
      memory.errors = memory.errors.slice(-10);
    }
    
    this.saveTradeMemory(memory);
  }

  getTradeMemory(): TradeMemory {
    return this.loadTradeMemory();
  }
}

export const safeActionExecutor = new SafeActionExecutor();