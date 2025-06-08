import express, { type Request, Response } from "express";
import { hyperdriveTrading } from "./hyperdrive-trading-engine";
import { pionexAutomation } from "./pionex-browser-automation";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Trading Engine Routes
app.get('/api/trading/status', async (req, res) => {
  try {
    const status = await hyperdriveTrading.getStatus();
    res.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get trading status'
    });
  }
});

app.post('/api/trading/toggle', async (req, res) => {
  try {
    const { active } = req.body;
    const result = await hyperdriveTrading.toggleTrading(active);
    res.json({
      success: true,
      ...result,
      message: active ? 'Trading activated' : 'Trading deactivated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle trading'
    });
  }
});

app.post('/api/trading/hyperdrive', async (req, res) => {
  try {
    const { enabled } = req.body;
    const result = await hyperdriveTrading.setHyperdriveMode(enabled);
    res.json({
      success: true,
      ...result,
      message: enabled ? 'Hyperdrive mode activated' : 'Hyperdrive mode deactivated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to set hyperdrive mode'
    });
  }
});

app.post('/api/trading/quantum', async (req, res) => {
  try {
    const { enabled } = req.body;
    const result = await hyperdriveTrading.setQuantumMode(enabled);
    res.json({
      success: true,
      ...result,
      message: enabled ? 'Quantum mode activated' : 'Quantum mode deactivated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to set quantum mode'
    });
  }
});

app.post('/api/trading/exponential', async (req, res) => {
  try {
    const { target, timeframe, riskLevel } = req.body;
    await hyperdriveTrading.setExponentialMode(target, timeframe, riskLevel);
    res.json({
      success: true,
      message: `Exponential mode activated: $${target} target`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to set exponential mode'
    });
  }
});

app.get('/api/trading/opportunities', async (req, res) => {
  try {
    const opportunities = await hyperdriveTrading.scanForOpportunities();
    res.json({
      success: true,
      opportunities,
      count: opportunities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to scan opportunities'
    });
  }
});

app.post('/api/trading/execute', async (req, res) => {
  try {
    const { signal } = req.body;
    const result = await hyperdriveTrading.executeRapidTrade(signal);
    res.json({
      success: result.success,
      trade: result,
      message: result.success ? 'Trade executed successfully' : 'Trade execution failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Trade execution failed'
    });
  }
});

app.post('/api/trading/update-balance', async (req, res) => {
  try {
    const { balance } = req.body;
    await hyperdriveTrading.updateReserves(balance);
    res.json({
      success: true,
      message: 'Balance updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update balance'
    });
  }
});

// Pionex Browser Automation Routes
app.post('/api/pionex/initialize', async (req, res) => {
  try {
    await pionexAutomation.initialize();
    res.json({
      success: true,
      message: 'Pionex automation initialized'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initialize Pionex automation'
    });
  }
});

app.post('/api/pionex/login', async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;
    const success = await pionexAutomation.login({ email, password, twoFactorCode });
    res.json({
      success,
      message: success ? 'Successfully logged into Pionex' : 'Login failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login process failed'
    });
  }
});

app.post('/api/pionex/create-bot', async (req, res) => {
  try {
    const { strategy, pair, investment, gridNumber } = req.body;
    const success = await pionexAutomation.createGridTradingBot({
      strategy,
      pair,
      investment,
      gridNumber
    });
    res.json({
      success,
      message: success ? 'Trading bot created successfully' : 'Failed to create trading bot'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Bot creation failed'
    });
  }
});

app.get('/api/pionex/bots', async (req, res) => {
  try {
    const bots = await pionexAutomation.getActiveBots();
    res.json({
      success: true,
      bots,
      count: bots.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get active bots'
    });
  }
});

app.post('/api/pionex/stop-bot', async (req, res) => {
  try {
    const { botId } = req.body;
    const success = await pionexAutomation.stopBot(botId);
    res.json({
      success,
      message: success ? 'Bot stopped successfully' : 'Failed to stop bot'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to stop bot'
    });
  }
});

app.get('/api/pionex/balance', async (req, res) => {
  try {
    const balance = await pionexAutomation.getAccountBalance();
    res.json({
      success: true,
      balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get account balance'
    });
  }
});

app.post('/api/pionex/screenshot', async (req, res) => {
  try {
    const { filename } = req.body;
    const screenshot = await pionexAutomation.takeScreenshot(filename || 'screenshot.png');
    res.json({
      success: true,
      screenshot,
      message: 'Screenshot taken successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to take screenshot'
    });
  }
});

app.get('/api/pionex/status', async (req, res) => {
  try {
    const isLoggedIn = await pionexAutomation.checkLoginStatus();
    res.json({
      success: true,
      isLoggedIn,
      status: isLoggedIn ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check status'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Quantum Trading Bot'
  });
});

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Quantum Trading Bot API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;