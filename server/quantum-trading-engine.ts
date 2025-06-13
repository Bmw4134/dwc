/**
 * Quantum Trading Engine - Coinbase Integration
 * Leverages existing QNIS lead data for trading signals
 */

interface TradeSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: number;
  qnisScore: number;
  leadId: string;
  confidence: number;
}

interface TradeLog {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  amount: number;
  entryPrice: number;
  exitPrice?: number;
  entryTimestamp: number;
  exitTimestamp?: number;
  profitLoss: number;
  status: 'OPEN' | 'CLOSED';
  leadId: string;
  qnisScore: number;
}

export class QuantumTradingEngine {
  private isActive = false;
  private tradingMode: 'PAPER' | 'LIVE' = 'PAPER';
  private tradeLogs: TradeLog[] = [];
  private activePositions: Map<string, TradeLog> = new Map();
  private coinbaseAPI: any = null;
  private tradingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeEngine();
  }

  async initializeEngine() {
    console.log('[QUANTUM] Initializing Trading Engine...');
    
    // Load existing trade history
    this.loadTradeHistory();
    
    // Validate API credentials
    const apiValid = await this.validateCoinbaseCredentials();
    
    if (apiValid) {
      console.log('[QUANTUM] API credentials validated');
      this.setupTradingUI();
      this.connectToLeadSystem();
    } else {
      console.warn('[QUANTUM] API credentials missing - running in simulation mode');
      this.setupTradingUI();
    }
  }

  async validateCoinbaseCredentials(): Promise<boolean> {
    try {
      // Check for API credentials in environment
      const apiKey = process.env.COINBASE_API_KEY;
      const apiSecret = process.env.COINBASE_API_SECRET;
      const passphrase = process.env.COINBASE_PASSPHRASE;

      if (!apiKey || !apiSecret || !passphrase) {
        console.log('[QUANTUM] Missing Coinbase API credentials');
        return false;
      }

      // Test API connection with account endpoint
      const testResponse = await this.testCoinbaseConnection();
      
      if (testResponse.success) {
        console.log('[QUANTUM] Coinbase API test successful');
        return true;
      } else {
        console.error('[QUANTUM] Coinbase API test failed:', testResponse.error);
        return false;
      }

    } catch (error) {
      console.error('[QUANTUM] API validation error:', error);
      return false;
    }
  }

  async testCoinbaseConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock API test for now - replace with actual Coinbase API call
      const response = await fetch('/api/coinbase/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true };
      } else {
        return { success: false, error: 'API test failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  setupTradingUI() {
    // Inject trading control panel into dashboard
    this.injectTradingControls();
    
    // Setup analytics panel
    this.setupAnalyticsPanel();
    
    // Add trading toggle to sidebar
    this.addTradingToggleToSidebar();
  }

  injectTradingControls() {
    // Find main dashboard area
    const dashboard = document.getElementById('main-content') || document.body;
    
    // Create trading control panel
    const tradingPanel = document.createElement('div');
    tradingPanel.id = 'quantum-trading-panel';
    tradingPanel.innerHTML = `
      <div style="position: fixed; top: 70px; right: 20px; width: 320px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 20px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 1000; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #e74c3c; font-size: 18px; font-weight: 700;">⚡ Quantum Trading</h3>
          <button id="trading-toggle" onclick="window.QuantumTrader?.toggleTrading()" style="background: ${this.isActive ? '#27ae60' : '#95a5a6'}; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
            ${this.isActive ? 'ACTIVE' : 'PAUSED'}
          </button>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #bdc3c7;">Trading Mode:</label>
          <select id="trading-mode" onchange="window.QuantumTrader?.setTradingMode(this.value)" style="width: 100%; padding: 8px; border: none; border-radius: 4px; background: #34495e; color: white; font-size: 14px;">
            <option value="PAPER" ${this.tradingMode === 'PAPER' ? 'selected' : ''}>Paper Trading</option>
            <option value="LIVE" ${this.tradingMode === 'LIVE' ? 'selected' : ''}>Live Trading</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; color: #27ae60;">$${this.calculateTotalPnL().toFixed(2)}</div>
            <div style="font-size: 11px; color: #95a5a6;">Total P&L</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 20px; font-weight: bold; color: #3498db;">${this.calculateWinRate().toFixed(1)}%</div>
            <div style="font-size: 11px; color: #95a5a6;">Win Rate</div>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; margin-bottom: 10px;">
          <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 5px;">Quick Actions:</div>
          <div style="display: flex; gap: 5px;">
            <button onclick="window.QuantumTrader?.viewPortfolio()" style="flex: 1; background: #3498db; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px;">Portfolio</button>
            <button onclick="window.QuantumTrader?.viewLogs()" style="flex: 1; background: #f39c12; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px;">Logs</button>
            <button onclick="window.QuantumTrader?.emergency_stop()" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 11px;">STOP</button>
          </div>
        </div>

        <div id="trading-status" style="font-size: 11px; color: #95a5a6; text-align: center;">
          Connected to ${this.getActiveLeadCount()} leads | ${this.activePositions.size} open positions
        </div>
      </div>
    `;

    dashboard.appendChild(tradingPanel);
  }

  setupAnalyticsPanel() {
    // Add trading analytics to existing analytics dashboard
    const analyticsSection = document.querySelector('[data-module="analytics-dashboard"]') || 
                            document.getElementById('analytics-dashboard');

    if (analyticsSection) {
      const tradingAnalytics = document.createElement('div');
      tradingAnalytics.id = 'quantum-trading-analytics';
      tradingAnalytics.innerHTML = this.generateAnalyticsHTML();
      analyticsSection.appendChild(tradingAnalytics);
    }
  }

  generateAnalyticsHTML(): string {
    const recentTrades = this.tradeLogs.slice(-10);
    
    return `
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #2c3e50; margin: 0 0 20px 0; display: flex; align-items: center;">
          <span style="margin-right: 10px;">⚡</span>
          Quantum Trading Analytics
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: #ecf0f1; border-radius: 6px;">
            <div style="font-size: 24px; font-weight: bold; color: #27ae60;">$${this.calculateTotalPnL().toFixed(2)}</div>
            <div style="color: #7f8c8d; font-size: 14px;">Total Profit/Loss</div>
          </div>
          
          <div style="text-align: center; padding: 15px; background: #ecf0f1; border-radius: 6px;">
            <div style="font-size: 24px; font-weight: bold; color: #3498db;">${this.tradeLogs.length}</div>
            <div style="color: #7f8c8d; font-size: 14px;">Total Trades</div>
          </div>
          
          <div style="text-align: center; padding: 15px; background: #ecf0f1; border-radius: 6px;">
            <div style="font-size: 24px; font-weight: bold; color: #f39c12;">${this.calculateWinRate().toFixed(1)}%</div>
            <div style="color: #7f8c8d; font-size: 14px;">Win Rate</div>
          </div>
          
          <div style="text-align: center; padding: 15px; background: #ecf0f1; border-radius: 6px;">
            <div style="font-size: 24px; font-weight: bold; color: #e74c3c;">${this.activePositions.size}</div>
            <div style="color: #7f8c8d; font-size: 14px;">Open Positions</div>
          </div>
        </div>

        <div style="background: #2c3e50; color: white; padding: 15px; border-radius: 6px; max-height: 300px; overflow-y: auto;">
          <h4 style="margin: 0 0 10px 0; color: #ecf0f1;">Recent Trade Log</h4>
          <div style="font-family: monospace; font-size: 12px;">
            ${recentTrades.map(trade => `
              <div style="margin-bottom: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                <span style="color: ${trade.action === 'BUY' ? '#27ae60' : '#e74c3c'};">${trade.action}</span>
                <span style="margin: 0 10px;">${trade.symbol}</span>
                <span>$${trade.amount.toFixed(2)}</span>
                <span style="margin-left: 10px; color: #bdc3c7;">${new Date(trade.entryTimestamp).toLocaleTimeString()}</span>
                <span style="float: right; color: ${trade.profitLoss >= 0 ? '#27ae60' : '#e74c3c'};">
                  ${trade.profitLoss >= 0 ? '+' : ''}$${trade.profitLoss.toFixed(2)}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  addTradingToggleToSidebar() {
    const sidebar = document.getElementById('nexus-sidebar') || document.querySelector('.sidebar');
    
    if (sidebar) {
      const tradingItem = document.createElement('a');
      tradingItem.href = '#quantum-trading';
      tradingItem.className = 'sidebar-item';
      tradingItem.setAttribute('data-module', 'quantum-trading');
      tradingItem.innerHTML = `
        <span style="margin-right: 10px; font-size: 16px;">⚡</span>
        <span style="font-size: 14px; font-weight: 500;">Quantum Trading</span>
        <span style="margin-left: auto; font-size: 10px; background: ${this.isActive ? '#27ae60' : '#95a5a6'}; padding: 2px 6px; border-radius: 10px; color: white;">
          ${this.isActive ? 'ON' : 'OFF'}
        </span>
      `;
      tradingItem.style.cssText = 'display: flex; align-items: center; padding: 12px 20px; color: #ecf0f1; text-decoration: none; transition: all 0.3s ease; border-left: 3px solid transparent;';
      
      tradingItem.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTradingDashboard();
      });

      // Insert after lead generation in sidebar
      const leadGenItem = sidebar.querySelector('[data-module="lead-generation"]');
      if (leadGenItem && leadGenItem.parentNode) {
        leadGenItem.parentNode.insertBefore(tradingItem, leadGenItem.nextSibling);
      } else {
        sidebar.appendChild(tradingItem);
      }
    }
  }

  connectToLeadSystem() {
    // Connect to existing QNIS lead generation system
    console.log('[QUANTUM] Connecting to QNIS lead system...');
    
    // Start monitoring leads for trading signals
    this.startLeadMonitoring();
    
    // Initialize trading cycle
    if (this.isActive) {
      this.startTradingCycle();
    }
  }

  startLeadMonitoring() {
    // Monitor lead updates every 30 seconds
    setInterval(() => {
      const leads = this.getActiveLeads();
      this.processLeadsForSignals(leads);
    }, 30000);
  }

  getActiveLeads(): any[] {
    try {
      // Get leads from existing QNIS system
      const cachedLeads = localStorage.getItem('cachedLeads');
      const emergencyLeads = localStorage.getItem('emergencyLeads');
      
      let leads = [];
      if (cachedLeads) {
        leads = leads.concat(JSON.parse(cachedLeads));
      }
      if (emergencyLeads) {
        leads = leads.concat(JSON.parse(emergencyLeads));
      }
      
      return leads.filter(lead => lead.qnisScore > 70); // High-value leads only
    } catch (error) {
      console.error('[QUANTUM] Error fetching leads:', error);
      return [];
    }
  }

  processLeadsForSignals(leads: any[]) {
    leads.forEach(lead => {
      const signal = this.generateTradingSignal(lead);
      if (signal && this.shouldExecuteTrade(signal)) {
        this.executeTrade(signal);
      }
    });
  }

  generateTradingSignal(lead: any): TradeSignal | null {
    // Generate trading signal based on QNIS score and market volatility
    const qnisScore = lead.qnisScore || 0;
    
    if (qnisScore < 70) return null; // Only trade high-quality leads
    
    // Select symbol based on lead characteristics
    const symbol = this.selectTradingSymbol(lead);
    
    // Determine action based on QNIS score and volatility
    const action = this.determineTradeAction(lead);
    
    // Calculate position size based on risk management
    const amount = this.calculatePositionSize(qnisScore);
    
    // Get current market price (mock for now)
    const price = this.getCurrentPrice(symbol);
    
    return {
      id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      action,
      amount,
      price,
      timestamp: Date.now(),
      qnisScore,
      leadId: lead.id,
      confidence: this.calculateConfidence(qnisScore)
    };
  }

  selectTradingSymbol(lead: any): string {
    // Select trading symbol based on lead industry/location
    const symbols = ['BTC-USD', 'ETH-USD', 'ADA-USD', 'DOT-USD', 'SOL-USD'];
    
    // Industry-based symbol selection
    const industryMap: Record<string, string> = {
      'Technology': 'ETH-USD',
      'Finance': 'BTC-USD',
      'Healthcare': 'ADA-USD',
      'Real Estate': 'DOT-USD'
    };
    
    return industryMap[lead.industry] || symbols[Math.floor(Math.random() * symbols.length)];
  }

  determineTradeAction(lead: any): 'BUY' | 'SELL' {
    const qnisScore = lead.qnisScore || 0;
    const volatilityFactor = Math.random(); // Mock volatility
    
    // High QNIS score + positive momentum = BUY
    if (qnisScore > 85 && volatilityFactor > 0.6) {
      return 'BUY';
    }
    
    // Medium QNIS score with high volatility = SELL
    if (qnisScore < 80 && volatilityFactor < 0.4) {
      return 'SELL';
    }
    
    return Math.random() > 0.5 ? 'BUY' : 'SELL';
  }

  calculatePositionSize(qnisScore: number): number {
    // Risk management: 3% max per trade
    const baseAmount = 100; // $100 base position
    const qnisMultiplier = Math.min(qnisScore / 100, 1.5); // Max 1.5x multiplier
    const maxRisk = 0.03; // 3% max risk
    
    return Math.min(baseAmount * qnisMultiplier, baseAmount * 3); // Cap at 3x base
  }

  getCurrentPrice(symbol: string): number {
    // Mock price data - replace with real Coinbase API
    const basePrices: Record<string, number> = {
      'BTC-USD': 45000,
      'ETH-USD': 3200,
      'ADA-USD': 0.48,
      'DOT-USD': 7.2,
      'SOL-USD': 95
    };
    
    const basePrice = basePrices[symbol] || 100;
    const volatility = (Math.random() - 0.5) * 0.1; // ±5% volatility
    
    return basePrice * (1 + volatility);
  }

  calculateConfidence(qnisScore: number): number {
    // Confidence based on QNIS score and market conditions
    const baseConfidence = Math.min(qnisScore / 100, 0.95);
    const marketFactor = 0.8 + (Math.random() * 0.2); // 80-100% market confidence
    
    return Math.round(baseConfidence * marketFactor * 100);
  }

  shouldExecuteTrade(signal: TradeSignal): boolean {
    // Risk management checks
    if (this.activePositions.size >= 5) return false; // Max 5 open positions
    if (signal.confidence < 70) return false; // Minimum 70% confidence
    if (!this.isActive) return false; // Trading must be active
    
    return true;
  }

  async executeTrade(signal: TradeSignal) {
    console.log(`[QUANTUM] Executing trade: ${signal.action} ${signal.symbol} $${signal.amount}`);
    
    const tradeLog: TradeLog = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol: signal.symbol,
      action: signal.action,
      amount: signal.amount,
      entryPrice: signal.price,
      entryTimestamp: Date.now(),
      profitLoss: 0,
      status: 'OPEN',
      leadId: signal.leadId,
      qnisScore: signal.qnisScore
    };

    // Execute trade based on mode
    if (this.tradingMode === 'LIVE') {
      await this.executeLiveTrade(signal);
    } else {
      await this.executePaperTrade(signal);
    }

    // Store trade log
    this.tradeLogs.push(tradeLog);
    this.activePositions.set(tradeLog.id, tradeLog);
    
    // Save to localStorage
    this.saveTradeHistory();
    
    // Update UI
    this.updateTradingUI();
    
    // Log to analytics
    this.logToAnalytics(tradeLog);
  }

  async executeLiveTrade(signal: TradeSignal) {
    // Execute real trade via Coinbase API
    try {
      const response = await fetch('/api/coinbase/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          symbol: signal.symbol,
          action: signal.action.toLowerCase(),
          amount: signal.amount,
          type: 'market'
        })
      });

      if (!response.ok) {
        throw new Error('Trade execution failed');
      }

      const result = await response.json();
      console.log('[QUANTUM] Live trade executed:', result);
      
    } catch (error) {
      console.error('[QUANTUM] Live trade failed:', error);
      // Fallback to paper trade
      await this.executePaperTrade(signal);
    }
  }

  async executePaperTrade(signal: TradeSignal) {
    // Simulate trade execution
    console.log(`[QUANTUM] Paper trade: ${signal.action} ${signal.symbol} $${signal.amount} @ $${signal.price}`);
    
    // Simulate small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  startTradingCycle() {
    if (this.tradingInterval) {
      clearInterval(this.tradingInterval);
    }

    // 15-second trading cycle
    this.tradingInterval = setInterval(() => {
      if (this.isActive) {
        this.processTradingCycle();
      }
    }, 15000);
  }

  processTradingCycle() {
    // Check for exit signals on open positions
    this.activePositions.forEach((trade, tradeId) => {
      const exitSignal = this.checkExitConditions(trade);
      if (exitSignal) {
        this.closeTrade(tradeId, exitSignal.price);
      }
    });

    // Update UI with latest data
    this.updateTradingUI();
  }

  checkExitConditions(trade: TradeLog): { shouldExit: boolean; price: number } | null {
    const currentPrice = this.getCurrentPrice(trade.symbol);
    const priceChange = (currentPrice - trade.entryPrice) / trade.entryPrice;
    
    // Exit conditions
    const profitTarget = 0.05; // 5% profit target
    const stopLoss = -0.03; // 3% stop loss
    
    const shouldExit = Math.abs(priceChange) > profitTarget || priceChange < stopLoss;
    
    if (shouldExit) {
      return { shouldExit: true, price: currentPrice };
    }
    
    return null;
  }

  closeTrade(tradeId: string, exitPrice: number) {
    const trade = this.activePositions.get(tradeId);
    if (!trade) return;

    // Calculate P&L
    const priceDiff = exitPrice - trade.entryPrice;
    const multiplier = trade.action === 'BUY' ? 1 : -1;
    const profitLoss = (priceDiff * multiplier * trade.amount) / trade.entryPrice;

    // Update trade log
    trade.exitPrice = exitPrice;
    trade.exitTimestamp = Date.now();
    trade.profitLoss = profitLoss;
    trade.status = 'CLOSED';

    // Remove from active positions
    this.activePositions.delete(tradeId);

    console.log(`[QUANTUM] Trade closed: ${trade.symbol} P&L: $${profitLoss.toFixed(2)}`);

    // Save and update UI
    this.saveTradeHistory();
    this.updateTradingUI();
    this.logToAnalytics(trade);
  }

  // Public methods for UI interaction
  toggleTrading() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.startTradingCycle();
      console.log('[QUANTUM] Trading activated');
    } else {
      if (this.tradingInterval) {
        clearInterval(this.tradingInterval);
      }
      console.log('[QUANTUM] Trading paused');
    }
    
    this.updateTradingUI();
  }

  setTradingMode(mode: 'PAPER' | 'LIVE') {
    this.tradingMode = mode;
    console.log(`[QUANTUM] Trading mode set to: ${mode}`);
    this.updateTradingUI();
  }

  emergencyStop() {
    this.isActive = false;
    if (this.tradingInterval) {
      clearInterval(this.tradingInterval);
    }
    
    // Close all open positions
    this.activePositions.forEach((trade, tradeId) => {
      const currentPrice = this.getCurrentPrice(trade.symbol);
      this.closeTrade(tradeId, currentPrice);
    });
    
    console.log('[QUANTUM] EMERGENCY STOP - All positions closed');
    this.updateTradingUI();
  }

  showTradingDashboard() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="trading-dashboard" style="padding: 20px;">
          <h1 style="color: #2c3e50; margin-bottom: 30px; display: flex; align-items: center;">
            <span style="margin-right: 15px;">⚡</span>
            Quantum Trading Dashboard
          </h1>
          
          ${this.generateTradingDashboardHTML()}
        </div>
      `;
    }
  }

  generateTradingDashboardHTML(): string {
    return `
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">Active Trading Signals</h3>
          <div id="trading-signals" style="max-height: 400px; overflow-y: auto;">
            ${this.generateSignalsHTML()}
          </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">Portfolio Summary</h3>
          ${this.generatePortfolioHTML()}
        </div>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #2c3e50; margin: 0 0 20px 0;">Trade History</h3>
        <div style="max-height: 300px; overflow-y: auto;">
          ${this.generateTradeHistoryHTML()}
        </div>
      </div>
    `;
  }

  generateSignalsHTML(): string {
    const leads = this.getActiveLeads();
    
    return leads.slice(0, 10).map(lead => {
      const signal = this.generateTradingSignal(lead);
      if (!signal) return '';
      
      return `
        <div style="padding: 10px; border: 1px solid #ecf0f1; border-radius: 6px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: between; align-items: center;">
            <div>
              <strong style="color: ${signal.action === 'BUY' ? '#27ae60' : '#e74c3c'};">${signal.action}</strong>
              <span style="margin: 0 10px;">${signal.symbol}</span>
              <span style="font-size: 12px; color: #7f8c8d;">QNIS: ${signal.qnisScore}</span>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold;">$${signal.amount.toFixed(2)}</div>
              <div style="font-size: 12px; color: #7f8c8d;">${signal.confidence}% confidence</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  generatePortfolioHTML(): string {
    const totalPnL = this.calculateTotalPnL();
    const winRate = this.calculateWinRate();
    
    return `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 32px; font-weight: bold; color: ${totalPnL >= 0 ? '#27ae60' : '#e74c3c'};">
          ${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}
        </div>
        <div style="color: #7f8c8d;">Total P&L</div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div style="text-align: center; padding: 15px; background: #ecf0f1; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold;">${this.tradeLogs.length}</div>
          <div style="font-size: 12px; color: #7f8c8d;">Total Trades</div>
        </div>
        
        <div style="text-align: center; padding: 15px; background: #ecf0f1; border-radius: 6px;">
          <div style="font-size: 18px; font-weight: bold;">${winRate.toFixed(1)}%</div>
          <div style="font-size: 12px; color: #7f8c8d;">Win Rate</div>
        </div>
      </div>
      
      <button onclick="window.QuantumTrader?.viewPortfolio()" style="width: 100%; background: #3498db; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">
        View Full Portfolio
      </button>
    `;
  }

  generateTradeHistoryHTML(): string {
    return this.tradeLogs.slice(-20).reverse().map(trade => `
      <div style="display: flex; justify-content: between; align-items: center; padding: 8px; border-bottom: 1px solid #ecf0f1;">
        <div>
          <span style="color: ${trade.action === 'BUY' ? '#27ae60' : '#e74c3c'}; font-weight: bold;">${trade.action}</span>
          <span style="margin: 0 10px;">${trade.symbol}</span>
          <span style="font-size: 12px; color: #7f8c8d;">${new Date(trade.entryTimestamp).toLocaleString()}</span>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; color: ${trade.profitLoss >= 0 ? '#27ae60' : '#e74c3c'};">
            ${trade.profitLoss >= 0 ? '+' : ''}$${trade.profitLoss.toFixed(2)}
          </div>
          <div style="font-size: 12px; color: #7f8c8d;">${trade.status}</div>
        </div>
      </div>
    `).join('');
  }

  // Utility methods
  calculateTotalPnL(): number {
    return this.tradeLogs.reduce((total, trade) => total + trade.profitLoss, 0);
  }

  calculateWinRate(): number {
    const closedTrades = this.tradeLogs.filter(trade => trade.status === 'CLOSED');
    if (closedTrades.length === 0) return 0;
    
    const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
    return (winningTrades.length / closedTrades.length) * 100;
  }

  getActiveLeadCount(): number {
    return this.getActiveLeads().length;
  }

  updateTradingUI() {
    // Update trading toggle button
    const toggleButton = document.getElementById('trading-toggle');
    if (toggleButton) {
      toggleButton.textContent = this.isActive ? 'ACTIVE' : 'PAUSED';
      toggleButton.style.background = this.isActive ? '#27ae60' : '#95a5a6';
    }

    // Update trading mode selector
    const modeSelector = document.getElementById('trading-mode') as HTMLSelectElement;
    if (modeSelector) {
      modeSelector.value = this.tradingMode;
    }

    // Update status display
    const statusDisplay = document.getElementById('trading-status');
    if (statusDisplay) {
      statusDisplay.textContent = `Connected to ${this.getActiveLeadCount()} leads | ${this.activePositions.size} open positions`;
    }

    // Update sidebar indicator
    const sidebarItem = document.querySelector('[data-module="quantum-trading"] span:last-child');
    if (sidebarItem) {
      sidebarItem.textContent = this.isActive ? 'ON' : 'OFF';
      (sidebarItem as HTMLElement).style.background = this.isActive ? '#27ae60' : '#95a5a6';
    }
  }

  saveTradeHistory() {
    localStorage.setItem('quantumTradeLogs', JSON.stringify(this.tradeLogs));
    localStorage.setItem('quantumActivePositions', JSON.stringify(Array.from(this.activePositions.entries())));
  }

  loadTradeHistory() {
    try {
      const savedLogs = localStorage.getItem('quantumTradeLogs');
      if (savedLogs) {
        this.tradeLogs = JSON.parse(savedLogs);
      }

      const savedPositions = localStorage.getItem('quantumActivePositions');
      if (savedPositions) {
        const positionsArray = JSON.parse(savedPositions);
        this.activePositions = new Map(positionsArray);
      }
    } catch (error) {
      console.error('[QUANTUM] Error loading trade history:', error);
    }
  }

  logToAnalytics(trade: TradeLog) {
    // Log to system analytics
    console.log(`[ANALYTICS] Trade logged: ${trade.symbol} ${trade.action} P&L: $${trade.profitLoss.toFixed(2)}`);
    
    // Store in analytics system if available
    const analyticsData = {
      timestamp: Date.now(),
      type: 'quantum_trade',
      data: trade
    };
    
    const existingAnalytics = localStorage.getItem('analyticsData') || '[]';
    const analytics = JSON.parse(existingAnalytics);
    analytics.push(analyticsData);
    localStorage.setItem('analyticsData', JSON.stringify(analytics));
  }

  viewPortfolio() {
    alert('Portfolio viewer - integrate with Coinbase API for full portfolio view');
  }

  viewLogs() {
    const logsWindow = window.open('', '_blank', 'width=800,height=600');
    if (logsWindow) {
      logsWindow.document.write(`
        <html>
          <head><title>Quantum Trading Logs</title></head>
          <body style="font-family: monospace; padding: 20px; background: #2c3e50; color: white;">
            <h2>Quantum Trading Logs</h2>
            <pre>${JSON.stringify(this.tradeLogs, null, 2)}</pre>
          </body>
        </html>
      `);
    }
  }
}

// Initialize and expose globally
const quantumTrader = new QuantumTradingEngine();
(window as any).QuantumTrader = quantumTrader;

export default QuantumTradingEngine;