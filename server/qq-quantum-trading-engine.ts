import axios from 'axios';
import WebSocket from 'ws';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
  source: 'alpha_vantage' | 'binance' | 'polygon' | 'yahoo';
}

export interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  timestamp: Date;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  percentage: number;
}

export interface QQTradingStats {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalTrades: number;
  winRate: number;
  bestPerformer: string;
  worstPerformer: string;
  activeTrades: number;
}

export class QQQuantumTradingEngine {
  private marketDataCache: Map<string, MarketData> = new Map();
  private activeSignals: Map<string, TradingSignal> = new Map();
  private portfolio: Map<string, PortfolioPosition> = new Map();
  private wsConnections: Map<string, WebSocket> = new Map();
  private tradingActive: boolean = false;
  private riskThreshold: number = 0.02; // 2% max risk per trade

  constructor() {
    this.initializePortfolio();
  }

  private initializePortfolio(): void {
    // Initialize with some crypto and stock positions for testing
    this.portfolio.set('BTCUSD', {
      symbol: 'BTCUSD',
      quantity: 0.1,
      avgPrice: 45000,
      currentPrice: 0,
      unrealizedPnL: 0,
      realizedPnL: 2500,
      percentage: 30
    });

    this.portfolio.set('ETHUSD', {
      symbol: 'ETHUSD',
      quantity: 2.5,
      avgPrice: 2800,
      currentPrice: 0,
      unrealizedPnL: 0,
      realizedPnL: 800,
      percentage: 20
    });

    this.portfolio.set('AAPL', {
      symbol: 'AAPL',
      quantity: 50,
      avgPrice: 180,
      currentPrice: 0,
      unrealizedPnL: 0,
      realizedPnL: 1200,
      percentage: 25
    });

    this.portfolio.set('TSLA', {
      symbol: 'TSLA',
      quantity: 20,
      avgPrice: 220,
      currentPrice: 0,
      unrealizedPnL: 0,
      realizedPnL: -500,
      percentage: 15
    });

    this.portfolio.set('NVDA', {
      symbol: 'NVDA',
      quantity: 15,
      avgPrice: 450,
      currentPrice: 0,
      unrealizedPnL: 0,
      realizedPnL: 3200,
      percentage: 10
    });
  }

  async startQuantumTrading(): Promise<void> {
    console.log('🚀 Starting QQ Quantum Trading Engine...');
    this.tradingActive = true;

    // Start market data feeds
    await this.initializeMarketDataFeeds();
    
    // Start trading algorithms
    this.startTradingAlgorithms();
    
    // Start risk management
    this.startRiskManagement();
  }

  private async initializeMarketDataFeeds(): Promise<void> {
    const symbols = Array.from(this.portfolio.keys());
    
    for (const symbol of symbols) {
      await this.connectToMarketData(symbol);
      await this.delay(200); // Respect rate limits
    }
  }

  private async connectToMarketData(symbol: string): Promise<void> {
    try {
      // Try multiple data sources for redundancy
      let marketData: MarketData | null = null;

      // Try Alpha Vantage first
      if (process.env.ALPHA_VANTAGE_API_KEY) {
        marketData = await this.fetchAlphaVantageData(symbol);
      }

      // Fallback to Yahoo Finance (free)
      if (!marketData) {
        marketData = await this.fetchYahooFinanceData(symbol);
      }

      // Fallback to Binance for crypto
      if (!marketData && symbol.includes('USD')) {
        marketData = await this.fetchBinanceData(symbol);
      }

      if (marketData) {
        this.marketDataCache.set(symbol, marketData);
        this.updatePortfolioPosition(symbol, marketData.price);
      }

    } catch (error) {
      console.error(`Failed to connect market data for ${symbol}:`, error);
    }
  }

  private async fetchAlphaVantageData(symbol: string): Promise<MarketData | null> {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (!apiKey) return null;

      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.replace('USD', ''),
          apikey: apiKey
        },
        timeout: 5000
      });

      const quote = response.data['Global Quote'];
      if (!quote) return null;

      return {
        symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseFloat(quote['06. volume']),
        timestamp: new Date(),
        source: 'alpha_vantage'
      };
    } catch (error) {
      return null;
    }
  }

  private async fetchYahooFinanceData(symbol: string): Promise<MarketData | null> {
    try {
      // Use Yahoo Finance API (free but unofficial)
      const yahooSymbol = symbol.replace('USD', '-USD');
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
        timeout: 5000
      });

      const result = response.data.chart?.result?.[0];
      if (!result) return null;

      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;

      return {
        symbol,
        price: currentPrice,
        change: currentPrice - previousClose,
        changePercent: ((currentPrice - previousClose) / previousClose) * 100,
        volume: meta.regularMarketVolume || 0,
        timestamp: new Date(),
        source: 'yahoo'
      };
    } catch (error) {
      return null;
    }
  }

  private async fetchBinanceData(symbol: string): Promise<MarketData | null> {
    try {
      const binanceSymbol = symbol.replace('USD', 'USDT');
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`, {
        timeout: 5000
      });

      const data = response.data;
      return {
        symbol,
        price: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChange),
        changePercent: parseFloat(data.priceChangePercent),
        volume: parseFloat(data.volume),
        timestamp: new Date(),
        source: 'binance'
      };
    } catch (error) {
      return null;
    }
  }

  private updatePortfolioPosition(symbol: string, currentPrice: number): void {
    const position = this.portfolio.get(symbol);
    if (position) {
      position.currentPrice = currentPrice;
      position.unrealizedPnL = (currentPrice - position.avgPrice) * position.quantity;
      this.portfolio.set(symbol, position);
    }
  }

  private startTradingAlgorithms(): void {
    // Run trading algorithms every 30 seconds
    setInterval(() => {
      if (this.tradingActive) {
        this.runQuantumAnalysis();
      }
    }, 30000);
  }

  private async runQuantumAnalysis(): Promise<void> {
    for (const [symbol, marketData] of this.marketDataCache) {
      const signal = await this.generateTradingSignal(symbol, marketData);
      if (signal) {
        this.activeSignals.set(symbol, signal);
        await this.executeTradingSignal(signal);
      }
    }
  }

  private async generateTradingSignal(symbol: string, marketData: MarketData): Promise<TradingSignal | null> {
    try {
      // Quantum analysis using multiple indicators
      const rsi = this.calculateRSI(symbol);
      const macd = this.calculateMACD(symbol);
      const sentiment = await this.analyzeSentiment(symbol);
      
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let confidence = 0;
      let reasoning = '';

      // Quantum decision matrix
      if (rsi < 30 && macd > 0 && sentiment > 0.6) {
        action = 'BUY';
        confidence = 0.85;
        reasoning = 'Oversold with bullish momentum and positive sentiment';
      } else if (rsi > 70 && macd < 0 && sentiment < 0.4) {
        action = 'SELL';
        confidence = 0.80;
        reasoning = 'Overbought with bearish momentum and negative sentiment';
      } else if (Math.abs(marketData.changePercent) < 1) {
        action = 'HOLD';
        confidence = 0.60;
        reasoning = 'Sideways movement, waiting for clearer signals';
      }

      if (confidence > 0.7) {
        return {
          symbol,
          action,
          confidence,
          targetPrice: action === 'BUY' ? marketData.price * 1.05 : marketData.price * 0.95,
          stopLoss: action === 'BUY' ? marketData.price * 0.98 : marketData.price * 1.02,
          reasoning,
          timeframe: '15m',
          timestamp: new Date()
        };
      }

      return null;
    } catch (error) {
      console.error(`Error generating signal for ${symbol}:`, error);
      return null;
    }
  }

  private calculateRSI(symbol: string): number {
    // Simplified RSI calculation - in production use proper technical analysis
    const marketData = this.marketDataCache.get(symbol);
    if (!marketData) return 50;
    
    // Mock RSI based on change percentage
    const change = marketData.changePercent;
    if (change > 5) return 75;
    if (change > 2) return 65;
    if (change < -5) return 25;
    if (change < -2) return 35;
    return 50;
  }

  private calculateMACD(symbol: string): number {
    // Simplified MACD calculation
    const marketData = this.marketDataCache.get(symbol);
    if (!marketData) return 0;
    
    // Mock MACD based on price momentum
    return marketData.changePercent * 0.1;
  }

  private async analyzeSentiment(symbol: string): Promise<number> {
    // Use Perplexity API for real-time sentiment analysis
    try {
      if (!process.env.PERPLEXITY_API_KEY) return 0.5;

      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Analyze market sentiment for the given symbol. Return only a number between 0 (very bearish) and 1 (very bullish).'
          },
          {
            role: 'user',
            content: `Current market sentiment for ${symbol}?`
          }
        ],
        max_tokens: 50,
        temperature: 0.2
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const sentiment = parseFloat(response.data.choices[0].message.content);
      return isNaN(sentiment) ? 0.5 : Math.max(0, Math.min(1, sentiment));
    } catch (error) {
      return 0.5; // Neutral sentiment on error
    }
  }

  private async executeTradingSignal(signal: TradingSignal): Promise<void> {
    console.log(`📊 QQ Signal: ${signal.action} ${signal.symbol} @ ${signal.confidence * 100}% confidence`);
    console.log(`💡 Reasoning: ${signal.reasoning}`);
    
    // In production, execute actual trades here via broker APIs
    // For now, simulate the execution
    await this.simulateTradeExecution(signal);
  }

  private async simulateTradeExecution(signal: TradingSignal): Promise<void> {
    const position = this.portfolio.get(signal.symbol);
    const marketData = this.marketDataCache.get(signal.symbol);
    
    if (!position || !marketData) return;

    const tradeAmount = this.calculateTradeSize(signal);
    
    if (signal.action === 'BUY' && tradeAmount > 0) {
      position.quantity += tradeAmount;
      position.avgPrice = (position.avgPrice * position.quantity + marketData.price * tradeAmount) / (position.quantity + tradeAmount);
    } else if (signal.action === 'SELL' && position.quantity > tradeAmount) {
      const sellPrice = marketData.price;
      const profit = (sellPrice - position.avgPrice) * tradeAmount;
      position.realizedPnL += profit;
      position.quantity -= tradeAmount;
    }

    this.portfolio.set(signal.symbol, position);
  }

  private calculateTradeSize(signal: TradingSignal): number {
    // Risk management: never risk more than 2% of portfolio
    const portfolioValue = this.getTotalPortfolioValue();
    const maxRisk = portfolioValue * this.riskThreshold;
    
    const marketData = this.marketDataCache.get(signal.symbol);
    if (!marketData) return 0;

    const priceRisk = Math.abs(marketData.price - signal.stopLoss);
    const maxShares = maxRisk / priceRisk;
    
    return Math.floor(maxShares * signal.confidence);
  }

  private startRiskManagement(): void {
    // Monitor risk every 10 seconds
    setInterval(() => {
      if (this.tradingActive) {
        this.monitorRisk();
      }
    }, 10000);
  }

  private monitorRisk(): void {
    for (const [symbol, position] of this.portfolio) {
      const marketData = this.marketDataCache.get(symbol);
      if (!marketData) continue;

      const currentLoss = (position.avgPrice - marketData.price) / position.avgPrice;
      
      // Emergency stop loss at 5%
      if (currentLoss > 0.05) {
        console.log(`🚨 Emergency stop loss triggered for ${symbol}`);
        this.executeEmergencyExit(symbol);
      }
    }
  }

  private executeEmergencyExit(symbol: string): void {
    const position = this.portfolio.get(symbol);
    if (position && position.quantity > 0) {
      console.log(`🛑 Executing emergency exit for ${symbol}`);
      // In production, place immediate market sell order
      position.quantity = 0;
      this.portfolio.set(symbol, position);
    }
  }

  getTotalPortfolioValue(): number {
    let totalValue = 0;
    for (const position of this.portfolio.values()) {
      totalValue += position.quantity * position.currentPrice;
    }
    return totalValue;
  }

  getPortfolioStats(): QQTradingStats {
    const positions = Array.from(this.portfolio.values());
    const totalValue = this.getTotalPortfolioValue();
    
    let dayChange = 0;
    let bestPerformer = '';
    let worstPerformer = '';
    let bestChange = -Infinity;
    let worstChange = Infinity;
    let activeTrades = 0;

    for (const position of positions) {
      const change = position.unrealizedPnL + position.realizedPnL;
      dayChange += change;
      
      if (position.quantity > 0) activeTrades++;
      
      const changePercent = change / (position.avgPrice * position.quantity);
      if (changePercent > bestChange) {
        bestChange = changePercent;
        bestPerformer = position.symbol;
      }
      if (changePercent < worstChange) {
        worstChange = changePercent;
        worstPerformer = position.symbol;
      }
    }

    return {
      totalValue,
      dayChange,
      dayChangePercent: (dayChange / totalValue) * 100,
      totalTrades: 47, // Mock total trades
      winRate: 68.5, // Mock win rate
      bestPerformer,
      worstPerformer,
      activeTrades
    };
  }

  getActiveSignals(): TradingSignal[] {
    return Array.from(this.activeSignals.values());
  }

  getPortfolioPositions(): PortfolioPosition[] {
    return Array.from(this.portfolio.values());
  }

  getMarketData(): MarketData[] {
    return Array.from(this.marketDataCache.values());
  }

  async startTradingEngine(): Promise<void> {
    await this.startQuantumTrading();
  }

  calculatePortfolioStats(): QQTradingStats {
    const positions = Array.from(this.portfolio.values());
    let totalValue = 0;
    let totalPnL = 0;
    let winTrades = 0;
    let totalTrades = 0;
    let bestPerformer = '';
    let worstPerformer = '';
    let bestPerformance = -Infinity;
    let worstPerformance = Infinity;

    for (const position of positions) {
      const positionValue = position.quantity * (position.currentPrice || position.avgPrice);
      totalValue += positionValue;
      totalPnL += position.realizedPnL + position.unrealizedPnL;
      
      if (position.realizedPnL > 0) winTrades++;
      totalTrades++;
      
      const performance = position.realizedPnL + position.unrealizedPnL;
      if (performance > bestPerformance) {
        bestPerformance = performance;
        bestPerformer = position.symbol;
      }
      if (performance < worstPerformance) {
        worstPerformance = performance;
        worstPerformer = position.symbol;
      }
    }

    return {
      totalValue,
      dayChange: totalPnL,
      dayChangePercent: totalValue > 0 ? (totalPnL / totalValue) * 100 : 0,
      totalTrades,
      winRate: totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0,
      bestPerformer: bestPerformer || 'N/A',
      worstPerformer: worstPerformer || 'N/A',
      activeTrades: positions.filter(p => p.quantity > 0).length
    };
  }

  getEngineStatus(): any {
    const positions = this.getPortfolioPositions();
    const signals = this.getActiveSignals();
    const stats = this.calculatePortfolioStats();
    
    return {
      isActive: this.tradingActive,
      portfolioValue: stats.totalValue,
      activePositions: positions.length,
      activeSignals: signals.length,
      dayChange: stats.dayChange,
      dayChangePercent: stats.dayChangePercent,
      winRate: stats.winRate,
      status: this.tradingActive ? 'active' : 'stopped'
    };
  }

  stopTrading(): void {
    this.tradingActive = false;
    for (const ws of this.wsConnections.values()) {
      ws.close();
    }
    console.log('🛑 QQ Quantum Trading Engine stopped');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const qqTradingEngine = new QQQuantumTradingEngine();