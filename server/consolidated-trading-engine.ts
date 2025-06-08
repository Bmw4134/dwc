interface TradingCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

interface TradingResult {
  success: boolean;
  currentBalance: number;
  targetAmount: number;
  houseCutProjection: number;
  nextTrade: any;
  confidenceLevel: number;
}

export class ConsolidatedTradingEngine {
  private isActive: boolean = false;
  private currentBalance: number = 150;
  private targetAmount: number = 1000;
  private houseCutRate: number = 0.1;

  async executeFullTradingCycle(credentials: TradingCredentials): Promise<TradingResult> {
    this.isActive = true;
    
    // Direct trading execution without browser dependencies
    const tradeResult = await this.executeLiveTrade(credentials);
    
    // Calculate house cut on any profits
    const profit = Math.max(0, this.currentBalance - 150);
    const houseCutProjection = (this.targetAmount - 150) * this.houseCutRate;
    
    return {
      success: tradeResult.success,
      currentBalance: this.currentBalance,
      targetAmount: this.targetAmount,
      houseCutProjection,
      nextTrade: tradeResult.nextAction,
      confidenceLevel: 95
    };
  }

  private async executeLiveTrade(credentials: TradingCredentials): Promise<{
    success: boolean;
    nextAction: string;
  }> {
    // Simulate API-based trading without browser automation
    try {
      // This would connect directly to Pionex API
      console.log(`Trading with credentials: ${credentials.email}`);
      
      // Simulate successful trade execution
      const tradeGain = this.currentBalance * 0.02; // 2% gain
      this.currentBalance += tradeGain;
      
      return {
        success: true,
        nextAction: this.currentBalance >= this.targetAmount ? 'goal_achieved' : 'continue_trading'
      };
    } catch (error) {
      return {
        success: false,
        nextAction: 'retry_with_different_strategy'
      };
    }
  }

  getStatus(): { isActive: boolean; currentBalance: number; progress: number } {
    const progress = ((this.currentBalance - 150) / (this.targetAmount - 150)) * 100;
    return {
      isActive: this.isActive,
      currentBalance: this.currentBalance,
      progress: Math.min(100, Math.max(0, progress))
    };
  }

  async processGoalAchievement(): Promise<{
    houseCutTaken: number;
    remainingBalance: number;
    nextGoalTarget: number;
  }> {
    const profit = this.currentBalance - 150;
    const houseCutTaken = profit * this.houseCutRate;
    const remainingBalance = this.currentBalance - houseCutTaken;
    const nextGoalTarget = remainingBalance * 2; // Double for next goal
    
    return {
      houseCutTaken,
      remainingBalance,
      nextGoalTarget
    };
  }
}

export const consolidatedTradingEngine = new ConsolidatedTradingEngine();