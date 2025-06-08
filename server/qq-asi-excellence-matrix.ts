/**
 * QQ ASI EXCELLENCE VECTOR MATRIX
 * Advanced KPI tracking and success prediction modeling
 * Logs all automation and trades for continuous learning
 */

interface QQTradeLog {
  id: string;
  timestamp: Date;
  platform: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  result: 'WIN' | 'LOSS' | 'PENDING';
  pnl: number;
  confidence: number;
  automationType: string;
  executionTime: number;
  riskScore: number;
  marketConditions: any;
}

interface QQAutomationLog {
  id: string;
  timestamp: Date;
  automationType: 'trading' | 'lead_capture' | 'form_filling' | 'account_setup';
  platform: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  executionTime: number;
  stepsCompleted: number;
  totalSteps: number;
  errorDetails?: string;
  successRate: number;
  retryAttempts: number;
  dataExtracted?: any;
}

interface QQExcellenceVector {
  winRate: number;
  avgPnL: number;
  riskAdjustedReturn: number;
  automationSuccessRate: number;
  platformReliability: number;
  executionSpeed: number;
  accuracyScore: number;
  adaptabilityIndex: number;
  confidenceLevel: number;
  overallExcellence: number;
}

interface QQKPIMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  avgWinAmount: number;
  avgLossAmount: number;
  maxDrawdown: number;
  sharpeRatio: number;
  automationSuccessRate: number;
  platformUptime: { [platform: string]: number };
  avgExecutionTime: number;
  errorRate: number;
}

export class QQASIExcellenceMatrix {
  private tradeLogs: QQTradeLog[] = [];
  private automationLogs: QQAutomationLog[] = [];
  private kpiCache: QQKPIMetrics | null = null;
  private lastCacheUpdate: number = 0;
  private cacheValidityMs = 60000; // 1 minute cache

  constructor() {}

  async logTrade(trade: Omit<QQTradeLog, 'id' | 'timestamp'>): Promise<void> {
    const tradeLog: QQTradeLog = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...trade
    };
    
    this.tradeLogs.push(tradeLog);
    
    // Clear cache to trigger recalculation
    this.kpiCache = null;
    
    // Store in database (would integrate with actual DB)
    await this.persistTradeLog(tradeLog);
  }

  async logAutomation(automation: Omit<QQAutomationLog, 'id' | 'timestamp'>): Promise<void> {
    const automationLog: QQAutomationLog = {
      id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...automation
    };
    
    this.automationLogs.push(automationLog);
    
    // Clear cache to trigger recalculation
    this.kpiCache = null;
    
    // Store in database
    await this.persistAutomationLog(automationLog);
  }

  async calculateExcellenceVector(): Promise<QQExcellenceVector> {
    const kpis = await this.getKPIMetrics();
    
    // Calculate individual vector components
    const winRate = this.calculateWinRate();
    const avgPnL = this.calculateAvgPnL();
    const riskAdjustedReturn = this.calculateRiskAdjustedReturn();
    const automationSuccessRate = this.calculateAutomationSuccessRate();
    const platformReliability = this.calculatePlatformReliability();
    const executionSpeed = this.calculateExecutionSpeed();
    const accuracyScore = this.calculateAccuracyScore();
    const adaptabilityIndex = this.calculateAdaptabilityIndex();
    const confidenceLevel = this.calculateConfidenceLevel();
    
    // Calculate overall excellence (weighted average)
    const overallExcellence = (
      winRate * 0.25 +
      riskAdjustedReturn * 0.20 +
      automationSuccessRate * 0.15 +
      platformReliability * 0.15 +
      executionSpeed * 0.10 +
      accuracyScore * 0.10 +
      confidenceLevel * 0.05
    );

    return {
      winRate,
      avgPnL,
      riskAdjustedReturn,
      automationSuccessRate,
      platformReliability,
      executionSpeed,
      accuracyScore,
      adaptabilityIndex,
      confidenceLevel,
      overallExcellence
    };
  }

  async getKPIMetrics(): Promise<QQKPIMetrics> {
    // Return cached KPIs if still valid
    if (this.kpiCache && (Date.now() - this.lastCacheUpdate) < this.cacheValidityMs) {
      return this.kpiCache;
    }

    const completedTrades = this.tradeLogs.filter(t => t.result !== 'PENDING');
    const winningTrades = completedTrades.filter(t => t.result === 'WIN');
    const losingTrades = completedTrades.filter(t => t.result === 'LOSS');
    
    const totalPnL = completedTrades.reduce((sum, t) => sum + t.pnl, 0);
    const avgWinAmount = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
      : 0;
    const avgLossAmount = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length)
      : 0;

    const successfulAutomations = this.automationLogs.filter(a => a.status === 'SUCCESS');
    const automationSuccessRate = this.automationLogs.length > 0 
      ? successfulAutomations.length / this.automationLogs.length 
      : 0;

    // Calculate platform uptime
    const platformUptime: { [platform: string]: number } = {};
    const platformGroups = this.groupBy(this.automationLogs, 'platform');
    
    for (const [platform, logs] of Object.entries(platformGroups)) {
      const successfulLogs = logs.filter(l => l.status === 'SUCCESS');
      platformUptime[platform] = logs.length > 0 ? successfulLogs.length / logs.length : 0;
    }

    const avgExecutionTime = this.automationLogs.length > 0
      ? this.automationLogs.reduce((sum, a) => sum + a.executionTime, 0) / this.automationLogs.length
      : 0;

    const errorRate = this.automationLogs.length > 0
      ? this.automationLogs.filter(a => a.status === 'FAILED').length / this.automationLogs.length
      : 0;

    this.kpiCache = {
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      totalPnL,
      avgWinAmount,
      avgLossAmount,
      maxDrawdown: this.calculateMaxDrawdown(),
      sharpeRatio: this.calculateSharpeRatio(),
      automationSuccessRate,
      platformUptime,
      avgExecutionTime,
      errorRate
    };

    this.lastCacheUpdate = Date.now();
    return this.kpiCache;
  }

  async predictTradeSuccess(
    platform: string,
    symbol: string,
    action: 'BUY' | 'SELL',
    confidence: number,
    marketConditions: any
  ): Promise<{
    successProbability: number;
    expectedPnL: number;
    riskScore: number;
    recommendation: 'EXECUTE' | 'CAUTION' | 'ABORT';
    factors: string[];
  }> {
    // Analyze historical performance for similar conditions
    const similarTrades = this.tradeLogs.filter(t => 
      t.platform === platform &&
      t.symbol === symbol &&
      t.action === action
    );

    const platformSuccessRate = similarTrades.length > 0
      ? similarTrades.filter(t => t.result === 'WIN').length / similarTrades.length
      : 0.5;

    const avgPnLForSymbol = similarTrades.length > 0
      ? similarTrades.reduce((sum, t) => sum + t.pnl, 0) / similarTrades.length
      : 0;

    // Factor in current excellence vector
    const excellence = await this.calculateExcellenceVector();
    
    // Calculate success probability (weighted combination)
    const successProbability = (
      platformSuccessRate * 0.4 +
      excellence.winRate * 0.3 +
      confidence * 0.2 +
      excellence.overallExcellence * 0.1
    );

    // Calculate expected PnL
    const expectedPnL = avgPnLForSymbol * successProbability;

    // Calculate risk score
    const riskScore = 1 - (successProbability * excellence.riskAdjustedReturn);

    // Generate recommendation
    let recommendation: 'EXECUTE' | 'CAUTION' | 'ABORT';
    const factors: string[] = [];

    if (successProbability > 0.75 && riskScore < 0.3) {
      recommendation = 'EXECUTE';
      factors.push('High success probability', 'Low risk score', 'Strong historical performance');
    } else if (successProbability > 0.6 && riskScore < 0.5) {
      recommendation = 'CAUTION';
      factors.push('Moderate success probability', 'Acceptable risk level');
    } else {
      recommendation = 'ABORT';
      factors.push('Low success probability', 'High risk score');
    }

    // Add specific factors
    if (excellence.overallExcellence > 0.8) {
      factors.push('Excellent overall system performance');
    }
    if (platformSuccessRate > 0.8) {
      factors.push(`Strong performance on ${platform}`);
    }
    if (confidence > 0.8) {
      factors.push('High signal confidence');
    }

    return {
      successProbability,
      expectedPnL,
      riskScore,
      recommendation,
      factors
    };
  }

  // Private calculation methods
  private calculateWinRate(): number {
    const completedTrades = this.tradeLogs.filter(t => t.result !== 'PENDING');
    if (completedTrades.length === 0) return 0;
    const wins = completedTrades.filter(t => t.result === 'WIN').length;
    return wins / completedTrades.length;
  }

  private calculateAvgPnL(): number {
    const completedTrades = this.tradeLogs.filter(t => t.result !== 'PENDING');
    if (completedTrades.length === 0) return 0;
    return completedTrades.reduce((sum, t) => sum + t.pnl, 0) / completedTrades.length;
  }

  private calculateRiskAdjustedReturn(): number {
    const returns = this.tradeLogs.filter(t => t.result !== 'PENDING').map(t => t.pnl);
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  private calculateAutomationSuccessRate(): number {
    if (this.automationLogs.length === 0) return 0;
    const successful = this.automationLogs.filter(a => a.status === 'SUCCESS').length;
    return successful / this.automationLogs.length;
  }

  private calculatePlatformReliability(): number {
    const platformGroups = this.groupBy(this.automationLogs, 'platform');
    const reliabilityScores = Object.values(platformGroups).map(logs => {
      const successful = logs.filter(l => l.status === 'SUCCESS').length;
      return logs.length > 0 ? successful / logs.length : 0;
    });
    
    return reliabilityScores.length > 0
      ? reliabilityScores.reduce((sum, score) => sum + score, 0) / reliabilityScores.length
      : 0;
  }

  private calculateExecutionSpeed(): number {
    if (this.automationLogs.length === 0) return 0;
    const avgTime = this.automationLogs.reduce((sum, a) => sum + a.executionTime, 0) / this.automationLogs.length;
    // Convert to score (faster = higher score, capped at reasonable limits)
    return Math.max(0, Math.min(1, 1 - (avgTime / 30000))); // 30s = 0 score, 0s = 1 score
  }

  private calculateAccuracyScore(): number {
    const recentTrades = this.tradeLogs.slice(-50); // Last 50 trades
    if (recentTrades.length === 0) return 0;
    
    const highConfidenceTrades = recentTrades.filter(t => t.confidence > 0.8);
    const highConfidenceWins = highConfidenceTrades.filter(t => t.result === 'WIN').length;
    
    return highConfidenceTrades.length > 0 ? highConfidenceWins / highConfidenceTrades.length : 0;
  }

  private calculateAdaptabilityIndex(): number {
    // Measure how well the system adapts to changing market conditions
    const recentTrades = this.tradeLogs.slice(-20);
    const olderTrades = this.tradeLogs.slice(-40, -20);
    
    if (recentTrades.length === 0 || olderTrades.length === 0) return 0.5;
    
    const recentWinRate = recentTrades.filter(t => t.result === 'WIN').length / recentTrades.length;
    const olderWinRate = olderTrades.filter(t => t.result === 'WIN').length / olderTrades.length;
    
    // Higher score if recent performance is better or stable
    return recentWinRate >= olderWinRate ? 1 : recentWinRate / olderWinRate;
  }

  private calculateConfidenceLevel(): number {
    const recentTrades = this.tradeLogs.slice(-20);
    if (recentTrades.length === 0) return 0;
    
    return recentTrades.reduce((sum, t) => sum + t.confidence, 0) / recentTrades.length;
  }

  private calculateMaxDrawdown(): number {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;
    
    for (const trade of this.tradeLogs.filter(t => t.result !== 'PENDING')) {
      runningPnL += trade.pnl;
      if (runningPnL > peak) peak = runningPnL;
      const drawdown = (peak - runningPnL) / Math.max(peak, 1);
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    return maxDrawdown;
  }

  private calculateSharpeRatio(): number {
    const returns = this.tradeLogs.filter(t => t.result !== 'PENDING').map(t => t.pnl);
    if (returns.length < 2) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  private groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as { [key: string]: T[] });
  }

  private async persistTradeLog(trade: QQTradeLog): Promise<void> {
    // Would integrate with actual database
    console.log('Persisting trade log:', trade.id);
  }

  private async persistAutomationLog(automation: QQAutomationLog): Promise<void> {
    // Would integrate with actual database
    console.log('Persisting automation log:', automation.id);
  }

  // Public access methods
  getRecentTradeLogs(limit: number = 50): QQTradeLog[] {
    return this.tradeLogs.slice(-limit);
  }

  getRecentAutomationLogs(limit: number = 50): QQAutomationLog[] {
    return this.automationLogs.slice(-limit);
  }

  getTradingInsights(): any {
    const excellence = this.calculateExcellenceVector();
    const kpis = this.getKPIMetrics();
    
    return {
      topPerformingPlatforms: this.getTopPerformingPlatforms(),
      mostProfitableSymbols: this.getMostProfitableSymbols(),
      timeOfDayAnalysis: this.getTimeOfDayAnalysis(),
      riskPatterns: this.getRiskPatterns(),
      improvementSuggestions: this.getImprovementSuggestions()
    };
  }

  private getTopPerformingPlatforms(): any[] {
    const platformGroups = this.groupBy(this.tradeLogs.filter(t => t.result !== 'PENDING'), 'platform');
    
    return Object.entries(platformGroups).map(([platform, trades]) => {
      const wins = trades.filter(t => t.result === 'WIN').length;
      const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
      
      return {
        platform,
        winRate: wins / trades.length,
        totalPnL,
        tradeCount: trades.length
      };
    }).sort((a, b) => b.winRate - a.winRate);
  }

  private getMostProfitableSymbols(): any[] {
    const symbolGroups = this.groupBy(this.tradeLogs.filter(t => t.result !== 'PENDING'), 'symbol');
    
    return Object.entries(symbolGroups).map(([symbol, trades]) => {
      const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
      const wins = trades.filter(t => t.result === 'WIN').length;
      
      return {
        symbol,
        totalPnL,
        winRate: wins / trades.length,
        tradeCount: trades.length
      };
    }).sort((a, b) => b.totalPnL - a.totalPnL);
  }

  private getTimeOfDayAnalysis(): any {
    const hourlyPerformance: { [hour: number]: { trades: QQTradeLog[], pnl: number } } = {};
    
    this.tradeLogs.filter(t => t.result !== 'PENDING').forEach(trade => {
      const hour = trade.timestamp.getHours();
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = { trades: [], pnl: 0 };
      }
      hourlyPerformance[hour].trades.push(trade);
      hourlyPerformance[hour].pnl += trade.pnl;
    });
    
    return Object.entries(hourlyPerformance).map(([hour, data]) => ({
      hour: parseInt(hour),
      avgPnL: data.pnl / data.trades.length,
      winRate: data.trades.filter(t => t.result === 'WIN').length / data.trades.length,
      tradeCount: data.trades.length
    }));
  }

  private getRiskPatterns(): any {
    const highRiskTrades = this.tradeLogs.filter(t => t.riskScore > 0.7);
    const lowRiskTrades = this.tradeLogs.filter(t => t.riskScore < 0.3);
    
    return {
      highRiskPerformance: {
        count: highRiskTrades.length,
        winRate: highRiskTrades.filter(t => t.result === 'WIN').length / Math.max(highRiskTrades.length, 1),
        avgPnL: highRiskTrades.reduce((sum, t) => sum + t.pnl, 0) / Math.max(highRiskTrades.length, 1)
      },
      lowRiskPerformance: {
        count: lowRiskTrades.length,
        winRate: lowRiskTrades.filter(t => t.result === 'WIN').length / Math.max(lowRiskTrades.length, 1),
        avgPnL: lowRiskTrades.reduce((sum, t) => sum + t.pnl, 0) / Math.max(lowRiskTrades.length, 1)
      }
    };
  }

  private getImprovementSuggestions(): string[] {
    const suggestions: string[] = [];
    const excellence = this.calculateExcellenceVector();
    
    if (excellence.winRate < 0.6) {
      suggestions.push('Consider improving signal accuracy - current win rate below 60%');
    }
    
    if (excellence.automationSuccessRate < 0.9) {
      suggestions.push('Optimize automation reliability - some platforms showing failures');
    }
    
    if (excellence.executionSpeed < 0.7) {
      suggestions.push('Improve execution speed - trades taking longer than optimal');
    }
    
    if (excellence.riskAdjustedReturn < 0.5) {
      suggestions.push('Review risk management - returns not justifying risk taken');
    }
    
    return suggestions;
  }
}

export const qqASIExcellenceMatrix = new QQASIExcellenceMatrix();