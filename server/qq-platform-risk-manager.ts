/**
 * QQ ASI PLATFORM RISK MANAGER
 * Platform-specific trading restrictions and risk management
 * Protects against violations during high-volume batch trading
 */

interface PlatformRestrictions {
  platform: string;
  maxOrdersPerMinute: number;
  maxOrdersPerHour: number;
  maxOrdersPerDay: number;
  maxPositionSize: number;
  minOrderInterval: number; // milliseconds
  apiRateLimit: number; // requests per second
  restrictedHours: string[]; // UTC hours when trading is restricted
  maxBatchSize: number;
  marginRequirements: number;
  positionLimits: {
    crypto: number;
    stocks: number;
    futures: number;
  };
  riskParameters: {
    maxDrawdown: number;
    stopLossRequired: boolean;
    maxLeverage: number;
  };
}

interface QQRiskProfile {
  totalCapital: number;
  maxRiskPerTrade: number;
  maxDailyRisk: number;
  activeTrades: number;
  currentDrawdown: number;
  platformAllocations: { [platform: string]: number };
}

export class QQPlatformRiskManager {
  private platformRestrictions: Map<string, PlatformRestrictions> = new Map();
  private tradeHistory: Map<string, any[]> = new Map();
  private activeOrders: Map<string, number> = new Map();
  private lastOrderTimes: Map<string, number> = new Map();

  constructor() {
    this.initializePlatformRestrictions();
  }

  private initializePlatformRestrictions(): void {
    // Binance US Restrictions
    this.platformRestrictions.set('binance', {
      platform: 'binance',
      maxOrdersPerMinute: 10,
      maxOrdersPerHour: 1200,
      maxOrdersPerDay: 200000,
      maxPositionSize: 1000000, // $1M USD
      minOrderInterval: 100, // 100ms between orders
      apiRateLimit: 20, // 20 requests per second
      restrictedHours: [], // No specific restricted hours
      maxBatchSize: 50, // Max 50 orders per batch
      marginRequirements: 0.25, // 25% margin requirement
      positionLimits: {
        crypto: 10000000, // $10M crypto
        stocks: 0, // No stocks on Binance
        futures: 5000000 // $5M futures
      },
      riskParameters: {
        maxDrawdown: 0.20, // 20% max drawdown
        stopLossRequired: true,
        maxLeverage: 20
      }
    });

    // Pionex US Restrictions
    this.platformRestrictions.set('pionex', {
      platform: 'pionex',
      maxOrdersPerMinute: 60,
      maxOrdersPerHour: 3600,
      maxOrdersPerDay: 86400,
      maxPositionSize: 100000, // $100k USD per position
      minOrderInterval: 1000, // 1 second between orders
      apiRateLimit: 10, // 10 requests per second
      restrictedHours: [], // No specific restricted hours
      maxBatchSize: 20, // Max 20 orders per batch
      marginRequirements: 0.10, // 10% margin requirement
      positionLimits: {
        crypto: 1000000, // $1M crypto
        stocks: 0, // No stocks
        futures: 500000 // $500k futures
      },
      riskParameters: {
        maxDrawdown: 0.15, // 15% max drawdown
        stopLossRequired: true,
        maxLeverage: 10
      }
    });

    // Interactive Brokers Restrictions
    this.platformRestrictions.set('ibkr', {
      platform: 'ibkr',
      maxOrdersPerMinute: 50,
      maxOrdersPerHour: 2000,
      maxOrdersPerDay: 25000,
      maxPositionSize: 10000000, // $10M USD per position
      minOrderInterval: 250, // 250ms between orders
      apiRateLimit: 50, // 50 requests per second
      restrictedHours: ['22', '23', '0', '1', '2', '3'], // Weekend/overnight restrictions
      maxBatchSize: 100, // Max 100 orders per batch
      marginRequirements: 0.30, // 30% margin requirement
      positionLimits: {
        crypto: 1000000, // $1M crypto
        stocks: 50000000, // $50M stocks
        futures: 20000000 // $20M futures
      },
      riskParameters: {
        maxDrawdown: 0.25, // 25% max drawdown
        stopLossRequired: false, // Optional for stocks
        maxLeverage: 4 // Reg T leverage
      }
    });

    // Alpaca Restrictions
    this.platformRestrictions.set('alpaca', {
      platform: 'alpaca',
      maxOrdersPerMinute: 200,
      maxOrdersPerHour: 10000,
      maxOrdersPerDay: 200000,
      maxPositionSize: 1000000, // $1M USD per position
      minOrderInterval: 100, // 100ms between orders
      apiRateLimit: 200, // 200 requests per minute
      restrictedHours: ['20', '21', '22', '23', '0', '1', '2', '3'], // After hours restrictions
      maxBatchSize: 500, // Max 500 orders per batch
      marginRequirements: 0.25, // 25% margin requirement
      positionLimits: {
        crypto: 100000, // $100k crypto
        stocks: 10000000, // $10M stocks
        futures: 0 // No futures
      },
      riskParameters: {
        maxDrawdown: 0.20, // 20% max drawdown
        stopLossRequired: true,
        maxLeverage: 4
      }
    });
  }

  async validateBatchTradeRequest(
    platform: string, 
    trades: any[], 
    riskProfile: QQRiskProfile
  ): Promise<{
    approved: boolean;
    modifications: any[];
    warnings: string[];
    riskScore: number;
  }> {
    const restrictions = this.platformRestrictions.get(platform);
    if (!restrictions) {
      return {
        approved: false,
        modifications: [],
        warnings: [`Platform ${platform} not supported`],
        riskScore: 1.0
      };
    }

    const warnings: string[] = [];
    const modifications: any[] = [];
    let riskScore = 0;

    // Check batch size limits
    if (trades.length > restrictions.maxBatchSize) {
      warnings.push(`Batch size ${trades.length} exceeds platform limit of ${restrictions.maxBatchSize}`);
      modifications.push({
        type: 'split_batch',
        originalSize: trades.length,
        maxSize: restrictions.maxBatchSize,
        splitInto: Math.ceil(trades.length / restrictions.maxBatchSize)
      });
      riskScore += 0.3;
    }

    // Check order frequency limits
    const currentOrders = this.getRecentOrderCount(platform, 60000); // Last minute
    if (currentOrders + trades.length > restrictions.maxOrdersPerMinute) {
      warnings.push(`Order frequency would exceed ${restrictions.maxOrdersPerMinute}/minute limit`);
      modifications.push({
        type: 'throttle_orders',
        delay: restrictions.minOrderInterval,
        staggered: true
      });
      riskScore += 0.4;
    }

    // Check position size limits
    const totalPositionValue = trades.reduce((sum, trade) => sum + (trade.quantity * trade.price), 0);
    if (totalPositionValue > restrictions.maxPositionSize) {
      warnings.push(`Total position value $${totalPositionValue} exceeds platform limit of $${restrictions.maxPositionSize}`);
      modifications.push({
        type: 'reduce_position_sizes',
        maxPositionValue: restrictions.maxPositionSize,
        scalingFactor: restrictions.maxPositionSize / totalPositionValue
      });
      riskScore += 0.5;
    }

    // Check margin requirements
    const requiredMargin = totalPositionValue * restrictions.marginRequirements;
    const availableCapital = riskProfile.platformAllocations[platform] || 0;
    if (requiredMargin > availableCapital) {
      warnings.push(`Insufficient margin: Required $${requiredMargin}, Available $${availableCapital}`);
      modifications.push({
        type: 'reduce_for_margin',
        requiredMargin,
        availableCapital,
        maxTrades: Math.floor(availableCapital / (restrictions.marginRequirements * (totalPositionValue / trades.length)))
      });
      riskScore += 0.6;
    }

    // Check restricted hours
    const currentHour = new Date().getUTCHours().toString();
    if (restrictions.restrictedHours.includes(currentHour)) {
      warnings.push(`Trading restricted during hour ${currentHour} UTC`);
      modifications.push({
        type: 'schedule_for_later',
        restrictedHours: restrictions.restrictedHours,
        nextAvailableHour: this.getNextAvailableHour(restrictions.restrictedHours)
      });
      riskScore += 0.2;
    }

    // Check risk parameters
    if (riskProfile.currentDrawdown > restrictions.riskParameters.maxDrawdown) {
      warnings.push(`Current drawdown ${riskProfile.currentDrawdown} exceeds max allowed ${restrictions.riskParameters.maxDrawdown}`);
      modifications.push({
        type: 'halt_trading',
        reason: 'max_drawdown_exceeded'
      });
      riskScore += 0.8;
    }

    return {
      approved: riskScore < 0.7,
      modifications,
      warnings,
      riskScore
    };
  }

  async executeBatchWithProtection(
    platform: string,
    trades: any[],
    riskProfile: QQRiskProfile
  ): Promise<{
    executed: any[];
    failed: any[];
    totalExecuted: number;
    totalValue: number;
    executionTime: number;
  }> {
    const startTime = Date.now();
    const validation = await this.validateBatchTradeRequest(platform, trades, riskProfile);
    
    if (!validation.approved) {
      throw new Error(`Batch trading not approved: Risk score ${validation.riskScore}, Warnings: ${validation.warnings.join(', ')}`);
    }

    const restrictions = this.platformRestrictions.get(platform)!;
    const executed: any[] = [];
    const failed: any[] = [];
    let totalValue = 0;

    // Apply modifications if needed
    let modifiedTrades = trades;
    for (const mod of validation.modifications) {
      modifiedTrades = this.applyModification(modifiedTrades, mod);
    }

    // Execute trades with platform-specific throttling
    for (let i = 0; i < modifiedTrades.length; i++) {
      const trade = modifiedTrades[i];
      
      try {
        // Check if we need to wait
        const lastOrderTime = this.lastOrderTimes.get(platform) || 0;
        const timeSinceLastOrder = Date.now() - lastOrderTime;
        
        if (timeSinceLastOrder < restrictions.minOrderInterval) {
          await this.sleep(restrictions.minOrderInterval - timeSinceLastOrder);
        }

        // Execute the trade (placeholder - would call actual trading API)
        const result = await this.executeIndividualTrade(platform, trade);
        executed.push({ ...trade, result });
        totalValue += trade.quantity * trade.price;
        
        this.lastOrderTimes.set(platform, Date.now());
        this.recordTradeExecution(platform, trade);

      } catch (error) {
        failed.push({ ...trade, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return {
      executed,
      failed,
      totalExecuted: executed.length,
      totalValue,
      executionTime: Date.now() - startTime
    };
  }

  private applyModification(trades: any[], modification: any): any[] {
    switch (modification.type) {
      case 'reduce_position_sizes':
        return trades.map(trade => ({
          ...trade,
          quantity: Math.floor(trade.quantity * modification.scalingFactor)
        }));
      
      case 'reduce_for_margin':
        return trades.slice(0, modification.maxTrades);
      
      default:
        return trades;
    }
  }

  private async executeIndividualTrade(platform: string, trade: any): Promise<any> {
    // Placeholder for actual trading execution
    // Would integrate with platform-specific APIs
    return {
      orderId: `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'filled',
      executedPrice: trade.price,
      executedQuantity: trade.quantity,
      fees: trade.quantity * trade.price * 0.001 // 0.1% fee estimate
    };
  }

  private getRecentOrderCount(platform: string, timeWindowMs: number): number {
    const history = this.tradeHistory.get(platform) || [];
    const cutoff = Date.now() - timeWindowMs;
    return history.filter(trade => trade.timestamp > cutoff).length;
  }

  private getNextAvailableHour(restrictedHours: string[]): number {
    const currentHour = new Date().getUTCHours();
    for (let i = 1; i <= 24; i++) {
      const nextHour = (currentHour + i) % 24;
      if (!restrictedHours.includes(nextHour.toString())) {
        return nextHour;
      }
    }
    return currentHour; // Fallback
  }

  private recordTradeExecution(platform: string, trade: any): void {
    if (!this.tradeHistory.has(platform)) {
      this.tradeHistory.set(platform, []);
    }
    this.tradeHistory.get(platform)!.push({
      ...trade,
      timestamp: Date.now()
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getPlatformRestrictions(platform: string): PlatformRestrictions | undefined {
    return this.platformRestrictions.get(platform);
  }

  getAllPlatformRestrictions(): { [platform: string]: PlatformRestrictions } {
    const result: { [platform: string]: PlatformRestrictions } = {};
    for (const [platform, restrictions] of this.platformRestrictions) {
      result[platform] = restrictions;
    }
    return result;
  }
}

export const qqPlatformRiskManager = new QQPlatformRiskManager();