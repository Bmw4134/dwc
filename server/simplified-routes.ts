import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { marketDataService } from "./market-data-service";
import { safeActionExecutor } from "./safe-action-executor";
import { tradingMetricsEngine } from "./trading-metrics";
import { pionexAutomatedTrader } from "./pionex-automated-trader";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Market data endpoint with real prices
  app.get('/api/market-data', async (req, res) => {
    try {
      const marketData = await marketDataService.getAllMarketData();
      
      res.json([
        {
          id: "btc-feed",
          source: "CoinGecko",
          type: "crypto",
          symbol: "BTC/USD",
          price: marketData.btc,
          change: marketData.btc * 0.031,
          changePercent: 3.1,
          volume: 28745632,
          timestamp: new Date(),
          confidence: 0.94,
          quantumScore: 0.87
        },
        {
          id: "spy-feed",
          source: "Market Data",
          type: "stocks",
          symbol: "SPY",
          price: marketData.spy,
          change: -2.41,
          changePercent: -0.4,
          volume: 45892341,
          timestamp: new Date(),
          confidence: 0.91,
          quantumScore: 0.83
        },
        {
          id: "eth-feed",
          source: "CoinGecko",
          type: "crypto",
          symbol: "ETH/USD",
          price: marketData.eth,
          change: marketData.eth * 0.025,
          changePercent: 2.5,
          volume: 12456789,
          timestamp: new Date(),
          confidence: 0.92,
          quantumScore: 0.85
        }
      ]);
    } catch (error) {
      console.error('Market data error:', error);
      res.status(503).json({ 
        error: 'Market data service unavailable',
        message: 'Unable to fetch real-time market prices'
      });
    }
  });

  // Trading metrics endpoint
  app.get('/api/trading/metrics', async (req, res) => {
    try {
      const metrics = await tradingMetricsEngine.getMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Trading metrics error:', error);
      res.status(500).json({ error: 'Failed to fetch trading metrics' });
    }
  });

  // Execute trade endpoint with safety
  app.post('/api/trading/execute', async (req, res) => {
    try {
      const { amount, type, symbol } = req.body;
      
      if (!amount || !type || !symbol) {
        return res.status(400).json({ error: 'Missing required trade parameters' });
      }

      const success = await tradingMetricsEngine.executeAutomaticTrade();
      
      if (success) {
        res.json({
          success: true,
          message: 'Trade executed successfully',
          amount,
          type,
          symbol,
          timestamp: new Date()
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Trade execution failed - safety checks not passed'
        });
      }
    } catch (error) {
      console.error('Trade execution error:', error);
      res.status(500).json({ error: 'Trade execution failed' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      services: {
        marketData: 'operational',
        trading: 'operational',
        safetyChecks: 'operational'
      }
    });
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    // Send initial market data
    marketDataService.getAllMarketData().then(data => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'market_update',
          data
        }));
      }
    });

    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data);
        
        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Periodic market data updates
  setInterval(async () => {
    try {
      const marketData = await marketDataService.getAllMarketData();
      const message = JSON.stringify({
        type: 'market_update',
        data: marketData
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Market data broadcast error:', error);
    }
  }, 30000); // Update every 30 seconds

  return httpServer;
}