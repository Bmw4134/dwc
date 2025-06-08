/**
 * QQ DELTA FLOW ENGINE
 * Advanced order flow analysis integrating NinjaTrader delta strategies
 * with QQ ASI Excellence for fluid dynamic trading
 */

interface DeltaFlowSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  symbol: string;
  confidence: number;
  delta: number;
  candleType: 'GREEN' | 'RED' | 'DOJI';
  atrStopLoss: number;
  atrProfitTarget: number;
  reasoning: string;
  reversal: boolean;
}

interface OrderFlowData {
  delta: number;
  volume: number;
  bidVolume: number;
  askVolume: number;
  price: number;
  timestamp: number;
}

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isGreen: boolean;
  isRed: boolean;
  bodySize: number;
}

export class QQDeltaFlowEngine {
  private maxDelta = 150; // Minimum delta threshold for trade execution
  private atrProfitMultiplier = 2.0; // 2x ATR for profit target
  private atrStopMultiplier = 1.5; // 1.5x ATR for stop loss
  private minBodySize = 1; // Minimum candle body size in ticks
  
  /**
   * Generate QQ Delta Flow trading signal using NinjaTrader strategy logic
   */
  async generateDeltaFlowSignal(symbol: string, candleData: CandleData, orderFlow: OrderFlowData, atr: number): Promise<DeltaFlowSignal> {
    const { delta } = orderFlow;
    const { isGreen, isRed, bodySize, close } = candleData;
    
    const absoluteDelta = Math.abs(delta);
    const isNegativeDelta = delta < 0;
    const isPositiveDelta = delta > 0;
    
    // QQ ASI Excellence Delta Logic:
    // GREEN candle + NEGATIVE delta (selling pressure during price rise) = LONG signal
    // RED candle + POSITIVE delta (buying pressure during price fall) = SHORT signal
    
    const longSignal = isGreen && isNegativeDelta && absoluteDelta >= this.maxDelta && bodySize >= this.minBodySize;
    const shortSignal = isRed && isPositiveDelta && absoluteDelta >= this.maxDelta && bodySize >= this.minBodySize;
    
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0;
    let reasoning = '';
    
    if (longSignal) {
      action = 'BUY';
      confidence = this.calculateDeltaConfidence(absoluteDelta, bodySize, atr);
      reasoning = `GREEN candle with NEGATIVE delta (${delta.toFixed(0)}) - Smart money selling into strength, expecting reversal UP`;
    } else if (shortSignal) {
      action = 'SELL';
      confidence = this.calculateDeltaConfidence(absoluteDelta, bodySize, atr);
      reasoning = `RED candle with POSITIVE delta (${delta.toFixed(0)}) - Smart money buying into weakness, expecting reversal DOWN`;
    } else {
      reasoning = `No QQ Delta signal: Delta=${delta.toFixed(0)}, Candle=${isGreen ? 'GREEN' : isRed ? 'RED' : 'DOJI'}`;
    }
    
    // Calculate ATR-based levels
    const atrStopLoss = action === 'BUY' 
      ? close - (atr * this.atrStopMultiplier)
      : close + (atr * this.atrStopMultiplier);
      
    const atrProfitTarget = action === 'BUY'
      ? close + (atr * this.atrProfitMultiplier)  
      : close - (atr * this.atrProfitMultiplier);
    
    return {
      action,
      symbol,
      confidence,
      delta,
      candleType: isGreen ? 'GREEN' : isRed ? 'RED' : 'DOJI',
      atrStopLoss,
      atrProfitTarget,
      reasoning,
      reversal: longSignal || shortSignal
    };
  }
  
  /**
   * Calculate confidence based on delta strength and candle characteristics
   */
  private calculateDeltaConfidence(absoluteDelta: number, bodySize: number, atr: number): number {
    // Base confidence from delta strength
    let confidence = Math.min(absoluteDelta / 500, 0.8); // Max 80% from delta
    
    // Boost confidence for larger candle bodies (more conviction)
    const bodyStrength = bodySize / atr;
    confidence += Math.min(bodyStrength * 0.1, 0.15); // Up to 15% boost
    
    // QQ Excellence modifier for extreme delta readings
    if (absoluteDelta > 300) {
      confidence += 0.05; // Extra 5% for very strong delta
    }
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }
  
  /**
   * Enhanced position sizing using QQ ASI risk management
   */
  calculateQQPositionSize(balance: number, confidence: number, atr: number, stopDistance: number): number {
    // QQ ASI Excellence position sizing:
    // - Higher confidence = larger position
    // - Tighter stops = larger position  
    // - Maximum 2% risk per trade
    
    const maxRiskPerTrade = 0.02; // 2% max risk
    const riskAmount = balance * maxRiskPerTrade;
    
    // Calculate position size based on stop loss distance
    const basePositionSize = riskAmount / stopDistance;
    
    // Confidence multiplier (0.5x to 1.5x based on confidence)
    const confidenceMultiplier = 0.5 + (confidence * 1.0);
    
    return basePositionSize * confidenceMultiplier;
  }
  
  /**
   * Detect reversal patterns using delta divergence
   */
  detectDeltaDivergence(priceData: CandleData[], deltaData: number[]): {
    bullishDivergence: boolean;
    bearishDivergence: boolean;
    strength: number;
  } {
    if (priceData.length < 5 || deltaData.length < 5) {
      return { bullishDivergence: false, bearishDivergence: false, strength: 0 };
    }
    
    const recentPrices = priceData.slice(-5);
    const recentDeltas = deltaData.slice(-5);
    
    // Price trend analysis
    const priceHighs = recentPrices.map(c => c.high);
    const priceLows = recentPrices.map(c => c.low);
    
    const makingHigherHighs = priceHighs[4] > priceHighs[2] && priceHighs[2] > priceHighs[0];
    const makingLowerLows = priceLows[4] < priceLows[2] && priceLows[2] < priceLows[0];
    
    // Delta trend analysis  
    const deltaSum = recentDeltas.reduce((sum, d, i) => {
      return i < 2 ? sum + d : sum;
    }, 0);
    const recentDeltaSum = recentDeltas.slice(-2).reduce((sum, d) => sum + d, 0);
    
    const deltaWeakening = recentDeltaSum < deltaSum * 0.5;
    const deltaStrengthening = recentDeltaSum > deltaSum * 1.5;
    
    // Divergence detection
    const bullishDivergence = makingLowerLows && deltaStrengthening;
    const bearishDivergence = makingHigherHighs && deltaWeakening;
    
    const strength = Math.abs(recentDeltaSum) / 1000; // Normalize strength
    
    return {
      bullishDivergence,
      bearishDivergence,
      strength: Math.min(strength, 1.0)
    };
  }
  
  /**
   * Real-time market hours filter (6:30 AM - 1:00 PM EST)
   */
  isMarketHours(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeValue = hours * 100 + minutes;
    
    // 6:30 AM to 1:00 PM EST (630 to 1300)
    return timeValue >= 630 && timeValue < 1300;
  }
  
  /**
   * Generate comprehensive QQ Delta Flow report
   */
  generateDeltaFlowReport(signals: DeltaFlowSignal[]): {
    totalSignals: number;
    longSignals: number;
    shortSignals: number;
    averageConfidence: number;
    strongestSignal: DeltaFlowSignal | null;
    marketBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  } {
    const longSignals = signals.filter(s => s.action === 'BUY').length;
    const shortSignals = signals.filter(s => s.action === 'SELL').length;
    const totalSignals = longSignals + shortSignals;
    
    const averageConfidence = totalSignals > 0 
      ? signals.reduce((sum, s) => sum + s.confidence, 0) / totalSignals 
      : 0;
    
    const strongestSignal = signals.reduce((strongest, current) => {
      return current.confidence > (strongest?.confidence || 0) ? current : strongest;
    }, null as DeltaFlowSignal | null);
    
    let marketBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    if (longSignals > shortSignals * 1.5) marketBias = 'BULLISH';
    else if (shortSignals > longSignals * 1.5) marketBias = 'BEARISH';
    
    return {
      totalSignals,
      longSignals,
      shortSignals,
      averageConfidence,
      strongestSignal,
      marketBias
    };
  }
}

export const qqDeltaFlowEngine = new QQDeltaFlowEngine();