import type { Express } from "express";
import { createServer, type Server } from "http";
import { pionexBrowserTrader } from "./pionex-browser-trader";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple Pionex trading routes
  app.post('/api/pionex/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      await pionexBrowserTrader.initialize();
      const success = await pionexBrowserTrader.loginToPionex(email, password);
      
      res.json({ success, message: success ? 'Login successful' : 'Login failed' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/pionex/trade', async (req, res) => {
    try {
      const trade = req.body;
      
      if (!trade.pair || !trade.side || !trade.amount) {
        return res.status(400).json({ error: 'Missing required trade parameters' });
      }

      const success = await pionexBrowserTrader.executeTrade(trade);
      
      res.json({ 
        success, 
        message: success ? 'Trade executed successfully' : 'Trade failed',
        trade 
      });
    } catch (error) {
      console.error('Trade error:', error);
      res.status(500).json({ error: 'Trade execution failed' });
    }
  });

  app.get('/api/pionex/account', async (req, res) => {
    try {
      const account = await pionexBrowserTrader.getAccountInfo();
      res.json(account);
    } catch (error) {
      console.error('Account info error:', error);
      res.status(500).json({ error: 'Failed to get account info' });
    }
  });

  app.get('/api/pionex/prices', async (req, res) => {
    try {
      const prices = await pionexBrowserTrader.getCurrentPrices();
      res.json(prices);
    } catch (error) {
      console.error('Price fetch error:', error);
      res.status(500).json({ error: 'Failed to get prices' });
    }
  });

  app.post('/api/pionex/start-auto-trading', async (req, res) => {
    try {
      // Start automated trading with your credentials
      await pionexBrowserTrader.initialize();
      const loginSuccess = await pionexBrowserTrader.loginToPionex(
        'bm.watson34@gmail.com', 
        process.env.DW_BW_PW || ''
      );

      if (!loginSuccess) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      // Execute a small test trade (BTC/USDT buy $10)
      const testTrade = {
        pair: 'BTC/USDT',
        side: 'buy' as 'buy',
        amount: 10,
        type: 'market' as 'market'
      };

      const tradeSuccess = await pionexBrowserTrader.executeTrade(testTrade);
      
      res.json({ 
        success: tradeSuccess,
        message: 'Automated trading started',
        testTrade 
      });
    } catch (error) {
      console.error('Auto trading error:', error);
      res.status(500).json({ error: 'Failed to start automated trading' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}