/**
 * PIONEX BOT LIQUIDATION SYSTEM
 * Automated closing of trading bots and cash extraction
 */

import puppeteer, { Browser, Page } from 'puppeteer';

interface BotStatus {
  id: string;
  name: string;
  type: string;
  profit: number;
  status: 'RUNNING' | 'STOPPED' | 'PAUSED';
  investment: number;
}

interface LiquidationResult {
  success: boolean;
  closedBots: number;
  extractedAmount: number;
  currency: 'USDT' | 'USD' | 'USDC';
  message: string;
}

export class PionexBotLiquidator {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl = 'https://www.pionex.us';

  async initializeBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
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
    
    // Set realistic viewport and user agent
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  }

  async navigateToBotsPage(): Promise<boolean> {
    if (!this.page) return false;

    try {
      console.log('🤖 Navigating to trading bots page...');
      
      // Navigate to bots section
      await this.page.goto(`${this.baseUrl}/en-US/bots`, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for bots to load
      await this.page.waitForSelector('[data-testid="bot-list"], .bot-container, .trading-bot', {
        timeout: 10000
      });

      console.log('✅ Successfully loaded bots page');
      return true;
    } catch (error) {
      console.error('❌ Failed to navigate to bots page:', error);
      return false;
    }
  }

  async scanActiveBots(): Promise<BotStatus[]> {
    if (!this.page) return [];

    try {
      console.log('🔍 Scanning for active trading bots...');

      // Extract bot information
      const bots = await this.page.evaluate(() => {
        const botElements = document.querySelectorAll('.bot-item, .trading-bot-card, [data-testid="bot-card"]');
        const botList: BotStatus[] = [];

        botElements.forEach((element, index) => {
          const nameElement = element.querySelector('.bot-name, .bot-title, h3, h4');
          const profitElement = element.querySelector('.profit, .pnl, .return');
          const statusElement = element.querySelector('.status, .bot-status');
          const investmentElement = element.querySelector('.investment, .amount, .capital');

          const name = nameElement?.textContent?.trim() || `Bot ${index + 1}`;
          const profitText = profitElement?.textContent?.trim() || '0';
          const statusText = statusElement?.textContent?.trim() || 'RUNNING';
          const investmentText = investmentElement?.textContent?.trim() || '0';

          // Parse profit
          const profit = parseFloat(profitText.replace(/[^0-9.-]/g, '')) || 0;
          
          // Parse investment
          const investment = parseFloat(investmentText.replace(/[^0-9.-]/g, '')) || 0;

          // Determine status
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

      console.log(`📊 Found ${bots.length} trading bots`);
      return bots.filter(bot => bot.status === 'RUNNING');
    } catch (error) {
      console.error('❌ Failed to scan bots:', error);
      return [];
    }
  }

  async closeTradingBot(bot: BotStatus): Promise<boolean> {
    if (!this.page) return false;

    try {
      console.log(`🛑 Closing bot: ${bot.name}`);

      // Find and click the bot's close/stop button
      const closed = await this.page.evaluate((botName) => {
        const botElements = document.querySelectorAll('.bot-item, .trading-bot-card, [data-testid="bot-card"]');
        
        for (const element of botElements) {
          const nameElement = element.querySelector('.bot-name, .bot-title, h3, h4');
          if (nameElement?.textContent?.includes(botName)) {
            // Look for close/stop buttons
            const stopButton = element.querySelector('.stop-btn, .close-btn, button[data-action="stop"]');
            const moreOptionsButton = element.querySelector('.more-options, .menu-btn, .actions-btn');
            
            if (stopButton) {
              (stopButton as HTMLElement).click();
              return true;
            } else if (moreOptionsButton) {
              (moreOptionsButton as HTMLElement).click();
              
              // Wait for dropdown and click stop
              setTimeout(() => {
                const stopOption = document.querySelector('.stop-option, .close-option, [data-action="stop"]');
                if (stopOption) {
                  (stopOption as HTMLElement).click();
                }
              }, 500);
              return true;
            }
          }
        }
        return false;
      }, bot.name);

      if (closed) {
        // Handle confirmation dialog if it appears
        try {
          await this.page.waitForSelector('.confirm-dialog, .modal, .popup', { timeout: 3000 });
          
          // Click confirm button
          await this.page.click('.confirm-btn, .ok-btn, button[data-action="confirm"]');
          console.log(`✅ Successfully closed bot: ${bot.name}`);
        } catch {
          console.log(`✅ Bot closed without confirmation: ${bot.name}`);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Failed to close bot ${bot.name}:`, error);
      return false;
    }
  }

  async extractAvailableBalance(): Promise<{ amount: number; currency: string }> {
    if (!this.page) return { amount: 0, currency: 'USDT' };

    try {
      console.log('💰 Extracting available balance...');

      // Navigate to wallet/balance page
      await this.page.goto(`${this.baseUrl}/en-US/wallet`, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Extract USDT balance
      const balance = await this.page.evaluate(() => {
        // Look for USDT balance
        const usdtElements = document.querySelectorAll('*');
        let usdtBalance = 0;

        for (const element of usdtElements) {
          const text = element.textContent || '';
          if (text.includes('USDT') || text.includes('usdt')) {
            // Extract number from text
            const numberMatch = text.match(/[\d,]+\.?\d*/);
            if (numberMatch) {
              const amount = parseFloat(numberMatch[0].replace(/,/g, ''));
              if (amount > usdtBalance) {
                usdtBalance = amount;
              }
            }
          }
        }

        return usdtBalance;
      });

      console.log(`💵 Available balance: ${balance} USDT`);
      return { amount: balance, currency: 'USDT' };
    } catch (error) {
      console.error('❌ Failed to extract balance:', error);
      return { amount: 0, currency: 'USDT' };
    }
  }

  async executeFullLiquidation(): Promise<LiquidationResult> {
    console.log('🚀 Starting automated bot liquidation...');

    try {
      await this.initializeBrowser();
      
      // Check if already logged in by navigating to bots page
      const botsPageLoaded = await this.navigateToBotsPage();
      
      if (!botsPageLoaded) {
        return {
          success: false,
          closedBots: 0,
          extractedAmount: 0,
          currency: 'USDT',
          message: 'Failed to access bots page - please ensure you are logged into Pionex'
        };
      }

      // Scan for active bots
      const activeBots = await this.scanActiveBots();
      console.log(`📊 Found ${activeBots.length} active bots to close`);

      let closedCount = 0;

      // Close each bot
      for (const bot of activeBots) {
        const success = await this.closeTradingBot(bot);
        if (success) {
          closedCount++;
          // Wait between closures to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Wait for bot closures to process
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Extract available balance
      const balanceInfo = await this.extractAvailableBalance();

      console.log('🎉 Liquidation complete!');
      console.log(`📊 Closed bots: ${closedCount}/${activeBots.length}`);
      console.log(`💰 Available balance: ${balanceInfo.amount} ${balanceInfo.currency}`);

      return {
        success: true,
        closedBots: closedCount,
        extractedAmount: balanceInfo.amount,
        currency: balanceInfo.currency as 'USDT',
        message: `Successfully closed ${closedCount} bots and extracted ${balanceInfo.amount} ${balanceInfo.currency}`
      };

    } catch (error) {
      console.error('❌ Liquidation failed:', error);
      return {
        success: false,
        closedBots: 0,
        extractedAmount: 0,
        currency: 'USDT',
        message: `Liquidation failed: ${error.message}`
      };
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async getQuickBalance(): Promise<number> {
    try {
      await this.initializeBrowser();
      const balanceInfo = await this.extractAvailableBalance();
      await this.browser?.close();
      return balanceInfo.amount;
    } catch {
      return 0;
    }
  }
}

export const pionexBotLiquidator = new PionexBotLiquidator();