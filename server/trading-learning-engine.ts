interface TradingSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  trades: TradeRecord[];
  totalProfit: number;
  winRate: number;
  marketConditions: string[];
  strategies: string[];
  performance: {
    avgProfitPerTrade: number;
    maxDrawdown: number;
    sharpeRatio: number;
    riskLevel: number;
  };
}

interface TradeRecord {
  timestamp: Date;
  pair: string;
  side: 'buy' | 'sell';
  amount: number;
  signal: string;
  confidence: number;
  profit: number;
  marketData: any;
}

interface LearningModel {
  signalAccuracy: Map<string, { correct: number; total: number }>;
  timePatterns: Map<string, number>; // Hour of day -> avg performance
  marketConditionPerformance: Map<string, number>;
  confidenceCalibration: Map<number, number>; // confidence level -> actual success rate
  riskRewardOptimization: {
    optimalRiskLevel: number;
    maxTradeSize: number;
    stopLossThreshold: number;
  };
}

export class TradingLearningEngine {
  private sessions: TradingSession[] = [];
  private currentSession: TradingSession | null = null;
  private learningModel: LearningModel = {
    signalAccuracy: new Map(),
    timePatterns: new Map(),
    marketConditionPerformance: new Map(),
    confidenceCalibration: new Map(),
    riskRewardOptimization: {
      optimalRiskLevel: 0.05, // Start at 5%
      maxTradeSize: 100,
      stopLossThreshold: 0.02
    }
  };

  async startNewSession(): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    
    this.currentSession = {
      sessionId,
      startTime: new Date(),
      trades: [],
      totalProfit: 0,
      winRate: 0,
      marketConditions: [],
      strategies: [],
      performance: {
        avgProfitPerTrade: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        riskLevel: this.learningModel.riskRewardOptimization.optimalRiskLevel
      }
    };

    console.log(`🧠 Learning Engine: Started new session ${sessionId}`);
    return sessionId;
  }

  async recordTrade(trade: TradeRecord): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.trades.push(trade);
    this.currentSession.totalProfit += trade.profit;
    
    // Update win rate
    const winningTrades = this.currentSession.trades.filter(t => t.profit > 0).length;
    this.currentSession.winRate = winningTrades / this.currentSession.trades.length;

    // Learn from this trade
    await this.learnFromTrade(trade);
    
    console.log(`📊 Learning: Recorded trade ${trade.signal} | Profit: $${trade.profit.toFixed(3)} | Session WR: ${(this.currentSession.winRate * 100).toFixed(1)}%`);
  }

  private async learnFromTrade(trade: TradeRecord): Promise<void> {
    // Update signal accuracy
    const signalStats = this.learningModel.signalAccuracy.get(trade.signal) || { correct: 0, total: 0 };
    signalStats.total++;
    if (trade.profit > 0) signalStats.correct++;
    this.learningModel.signalAccuracy.set(trade.signal, signalStats);

    // Learn time patterns
    const hour = trade.timestamp.getHours().toString();
    const currentPerf = this.learningModel.timePatterns.get(hour) || 0;
    const newPerf = (currentPerf + trade.profit) / 2; // Simple moving average
    this.learningModel.timePatterns.set(hour, newPerf);

    // Calibrate confidence levels
    const confidenceLevel = Math.floor(trade.confidence * 10) / 10; // Round to nearest 0.1
    const actualSuccess = trade.profit > 0 ? 1 : 0;
    const currentCalibration = this.learningModel.confidenceCalibration.get(confidenceLevel) || 0.5;
    const newCalibration = (currentCalibration + actualSuccess) / 2;
    this.learningModel.confidenceCalibration.set(confidenceLevel, newCalibration);
  }

  async endSession(): Promise<TradingSession> {
    if (!this.currentSession) throw new Error('No active session');

    this.currentSession.endTime = new Date();
    
    // Calculate final performance metrics
    this.calculateSessionPerformance();
    
    // Optimize for next session
    this.optimizeParameters();
    
    this.sessions.push(this.currentSession);
    const completedSession = this.currentSession;
    this.currentSession = null;

    console.log(`🎯 Learning: Session completed | Profit: $${completedSession.totalProfit.toFixed(3)} | Trades: ${completedSession.trades.length} | WR: ${(completedSession.winRate * 100).toFixed(1)}%`);
    
    return completedSession;
  }

  private calculateSessionPerformance(): void {
    if (!this.currentSession) return;

    const trades = this.currentSession.trades;
    if (trades.length === 0) return;

    // Average profit per trade
    this.currentSession.performance.avgProfitPerTrade = 
      this.currentSession.totalProfit / trades.length;

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningProfit = 0;

    for (const trade of trades) {
      runningProfit += trade.profit;
      if (runningProfit > peak) peak = runningProfit;
      const drawdown = peak - runningProfit;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    this.currentSession.performance.maxDrawdown = maxDrawdown;

    // Simple Sharpe ratio approximation
    const returns = trades.map(t => t.profit);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((acc, ret) => acc + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    this.currentSession.performance.sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;
  }

  private optimizeParameters(): void {
    if (this.sessions.length < 2) return; // Need at least 2 sessions to compare

    const recentSessions = this.sessions.slice(-5); // Last 5 sessions
    const avgProfit = recentSessions.reduce((sum, s) => sum + s.totalProfit, 0) / recentSessions.length;
    const avgWinRate = recentSessions.reduce((sum, s) => sum + s.winRate, 0) / recentSessions.length;

    // Optimize risk level based on performance
    if (avgProfit > 0 && avgWinRate > 0.6) {
      // Good performance, can increase risk slightly
      this.learningModel.riskRewardOptimization.optimalRiskLevel = 
        Math.min(0.12, this.learningModel.riskRewardOptimization.optimalRiskLevel * 1.1);
    } else if (avgProfit < 0 || avgWinRate < 0.4) {
      // Poor performance, reduce risk
      this.learningModel.riskRewardOptimization.optimalRiskLevel = 
        Math.max(0.02, this.learningModel.riskRewardOptimization.optimalRiskLevel * 0.9);
    }

    console.log(`🔧 Learning: Optimized risk level to ${(this.learningModel.riskRewardOptimization.optimalRiskLevel * 100).toFixed(1)}%`);
  }

  getOptimalRiskLevel(): number {
    return this.learningModel.riskRewardOptimization.optimalRiskLevel;
  }

  getSignalAccuracy(signal: string): number {
    const stats = this.learningModel.signalAccuracy.get(signal);
    return stats ? stats.correct / stats.total : 0.5; // Default 50% if no data
  }

  getBestTradingHours(): string[] {
    const hourPerformance = Array.from(this.learningModel.timePatterns.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8) // Top 8 hours
      .map(([hour]) => hour);
    
    return hourPerformance;
  }

  getCalibratedConfidence(originalConfidence: number): number {
    const confidenceLevel = Math.floor(originalConfidence * 10) / 10;
    const calibration = this.learningModel.confidenceCalibration.get(confidenceLevel);
    return calibration || originalConfidence;
  }

  getPerformanceMetrics(): any {
    return {
      totalSessions: this.sessions.length,
      totalProfitAllTime: this.sessions.reduce((sum, s) => sum + s.totalProfit, 0),
      avgWinRateAllTime: this.sessions.length > 0 
        ? this.sessions.reduce((sum, s) => sum + s.winRate, 0) / this.sessions.length 
        : 0,
      optimalRiskLevel: this.learningModel.riskRewardOptimization.optimalRiskLevel,
      signalAccuracyStats: Object.fromEntries(this.learningModel.signalAccuracy),
      bestTradingHours: this.getBestTradingHours(),
      currentSession: this.currentSession
    };
  }

  // Enhanced trade size calculation based on learning
  calculateOptimalTradeSize(baseBalance: number, confidence: number, signal: string): number {
    const riskLevel = this.getOptimalRiskLevel();
    const signalAccuracy = this.getSignalAccuracy(signal);
    const calibratedConfidence = this.getCalibratedConfidence(confidence);
    
    // Kelly Criterion-inspired sizing
    const winProbability = (signalAccuracy + calibratedConfidence) / 2;
    const kellyFraction = Math.max(0.01, Math.min(0.15, (winProbability - 0.5) * 2));
    
    const baseTradeSize = baseBalance * riskLevel;
    const adjustedTradeSize = baseTradeSize * (1 + kellyFraction);
    
    return Math.min(adjustedTradeSize, this.learningModel.riskRewardOptimization.maxTradeSize);
  }
}

export const tradingLearningEngine = new TradingLearningEngine();