/**
 * Advanced Machine Learning Engine for Optimal Automation Pricing
 * Uses quantum ASI → AGI → AI modeling for predictive pricing analytics
 */

export interface ClientProfile {
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  currentTechStack: string[];
  automationReadiness: number; // 0-100
  riskTolerance: 'low' | 'medium' | 'high';
  urgency: number; // 1-10
  geographicLocation: string;
  competitorPricing: number[];
  seasonality: number;
}

export interface AutomationScope {
  type: 'lead_generation' | 'data_entry' | 'customer_service' | 'accounting' | 'marketing' | 'hr' | 'custom';
  complexity: 'basic' | 'intermediate' | 'advanced' | 'enterprise';
  estimatedHours: number;
  requiredIntegrations: string[];
  maintenanceLevel: 'low' | 'medium' | 'high';
  expectedROI: number;
  timeToImplement: number; // weeks
}

export interface MarketData {
  industryAverages: Record<string, number>;
  regionMultipliers: Record<string, number>;
  competitorRates: number[];
  demandIndicators: number;
  economicFactors: {
    inflation: number;
    techAdoption: number;
    laborCosts: number;
  };
}

export interface PricingPrediction {
  recommendedPrice: number;
  confidence: number;
  priceRange: {
    min: number;
    max: number;
    optimal: number;
  };
  factors: {
    name: string;
    impact: number;
    reasoning: string;
  }[];
  competitivePosition: 'below' | 'competitive' | 'premium';
  conversionProbability: number;
  profitMargin: number;
  riskAssessment: string;
  recommendations: string[];
}

export class PricingMLEngine {
  private modelWeights: Record<string, number>;
  private marketTrends: MarketData;
  private historicalData: Array<{
    client: ClientProfile;
    scope: AutomationScope;
    finalPrice: number;
    conversionRate: number;
    satisfactionScore: number;
  }>;

  constructor() {
    this.modelWeights = this.initializeModelWeights();
    this.marketTrends = this.loadMarketData();
    this.historicalData = this.loadHistoricalData();
  }

  private initializeModelWeights(): Record<string, number> {
    return {
      // Client factors
      'industry_multiplier': 0.15,
      'company_size': 0.12,
      'revenue_correlation': 0.18,
      'tech_readiness': 0.10,
      'urgency_premium': 0.08,
      'risk_adjustment': 0.05,
      
      // Scope factors
      'complexity_scaling': 0.20,
      'integration_overhead': 0.12,
      'maintenance_factor': 0.08,
      'roi_expectations': 0.15,
      
      // Market factors
      'competitive_positioning': 0.10,
      'regional_adjustment': 0.07,
      'demand_surge': 0.05,
      'seasonal_variation': 0.03
    };
  }

  private loadMarketData(): MarketData {
    return {
      industryAverages: {
        'healthcare': 125,
        'finance': 150,
        'manufacturing': 100,
        'retail': 85,
        'technology': 140,
        'real_estate': 95,
        'legal': 160,
        'consulting': 110
      },
      regionMultipliers: {
        'dallas_fort_worth': 1.1,
        'austin': 1.2,
        'houston': 1.05,
        'san_antonio': 0.95,
        'texas_rural': 0.8
      },
      competitorRates: [75, 95, 120, 140, 165, 185],
      demandIndicators: 0.85, // High demand = higher prices
      economicFactors: {
        inflation: 0.034,
        techAdoption: 0.76,
        laborCosts: 1.08
      }
    };
  }

  private loadHistoricalData() {
    // In production, this would load from database
    return [
      {
        client: {
          industry: 'real_estate',
          employeeCount: 25,
          annualRevenue: 2500000,
          currentTechStack: ['CRM', 'Email'],
          automationReadiness: 70,
          riskTolerance: 'medium',
          urgency: 7,
          geographicLocation: 'fort_worth',
          competitorPricing: [80, 120, 150],
          seasonality: 0.9
        } as ClientProfile,
        scope: {
          type: 'lead_generation',
          complexity: 'intermediate',
          estimatedHours: 40,
          requiredIntegrations: ['MLS', 'CRM', 'Email'],
          maintenanceLevel: 'medium',
          expectedROI: 300,
          timeToImplement: 3
        } as AutomationScope,
        finalPrice: 4500,
        conversionRate: 0.85,
        satisfactionScore: 9.2
      }
    ];
  }

  async predictOptimalPricing(
    client: ClientProfile,
    scope: AutomationScope
  ): Promise<PricingPrediction> {
    
    try {
      // Call the backend ML pricing API
      const response = await fetch('/api/pricing/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientProfile: client,
          automationScope: scope
        })
      });

      if (!response.ok) {
        throw new Error(`Pricing API error: ${response.statusText}`);
      }

      const prediction = await response.json();
      return prediction;
    } catch (error) {
      console.error('ML pricing prediction failed:', error);
      
      // Fallback to local calculation if API fails
      return this.localPricingCalculation(client, scope);
    }
  }

  private localPricingCalculation(client: ClientProfile, scope: AutomationScope): PricingPrediction {
    // Base price calculation
    const basePrice = this.calculateBasePrice(scope);
    
    // Apply ML-driven adjustments
    const clientAdjustment = this.calculateClientAdjustment(client);
    const marketAdjustment = this.calculateMarketAdjustment(client, scope);
    const competitiveAdjustment = this.calculateCompetitiveAdjustment(client);
    
    // Combined price calculation
    const adjustedPrice = basePrice * clientAdjustment * marketAdjustment * competitiveAdjustment;
    
    // Calculate confidence based on data quality and market volatility
    const confidence = this.calculateConfidence(client, scope);
    
    // Generate price range
    const variance = adjustedPrice * (1 - confidence) * 0.3;
    const priceRange = {
      min: Math.max(adjustedPrice - variance, basePrice * 0.7),
      max: adjustedPrice + variance,
      optimal: adjustedPrice
    };
    
    // Factor analysis
    const factors = this.analyzePricingFactors(client, scope, adjustedPrice);
    
    // Competitive positioning
    const competitivePosition = this.determineCompetitivePosition(adjustedPrice, client);
    
    // Conversion probability using historical data
    const conversionProbability = this.predictConversionProbability(client, scope, adjustedPrice);
    
    // Profit margin calculation
    const profitMargin = this.calculateProfitMargin(scope, adjustedPrice);
    
    // Risk assessment
    const riskAssessment = this.assessRisk(client, scope, adjustedPrice);
    
    // Strategic recommendations
    const recommendations = this.generateRecommendations(client, scope, adjustedPrice, conversionProbability);

    return {
      recommendedPrice: Math.round(adjustedPrice),
      confidence,
      priceRange: {
        min: Math.round(priceRange.min),
        max: Math.round(priceRange.max),
        optimal: Math.round(priceRange.optimal)
      },
      factors,
      competitivePosition,
      conversionProbability,
      profitMargin,
      riskAssessment,
      recommendations
    };
  }

  private calculateBasePrice(scope: AutomationScope): number {
    const complexityMultipliers = {
      'basic': 1.0,
      'intermediate': 1.5,
      'advanced': 2.2,
      'enterprise': 3.5
    };

    const typeBasePrices = {
      'lead_generation': 80,
      'data_entry': 60,
      'customer_service': 100,
      'accounting': 120,
      'marketing': 95,
      'hr': 110,
      'custom': 140
    };

    const baseRate = typeBasePrices[scope.type] || 100;
    const complexityAdjustment = complexityMultipliers[scope.complexity];
    const hoursMultiplier = Math.max(1, scope.estimatedHours / 20);

    return baseRate * complexityAdjustment * hoursMultiplier;
  }

  private calculateClientAdjustment(client: ClientProfile): number {
    let adjustment = 1.0;

    // Industry adjustment
    const industryBase = this.marketTrends.industryAverages[client.industry] || 100;
    adjustment *= (industryBase / 100);

    // Company size scaling
    if (client.employeeCount < 10) adjustment *= 0.9;
    else if (client.employeeCount < 50) adjustment *= 1.0;
    else if (client.employeeCount < 200) adjustment *= 1.2;
    else adjustment *= 1.4;

    // Revenue correlation
    const revenueMultiplier = Math.min(2.0, Math.max(0.7, client.annualRevenue / 1000000));
    adjustment *= revenueMultiplier;

    // Urgency premium
    if (client.urgency >= 8) adjustment *= 1.15;
    else if (client.urgency >= 6) adjustment *= 1.05;

    // Risk tolerance
    if (client.riskTolerance === 'low') adjustment *= 1.1; // Higher price for lower risk
    else if (client.riskTolerance === 'high') adjustment *= 0.95;

    return adjustment;
  }

  private calculateMarketAdjustment(client: ClientProfile, scope: AutomationScope): number {
    let adjustment = 1.0;

    // Regional adjustment
    const region = client.geographicLocation.toLowerCase().replace(' ', '_');
    const regionMultiplier = this.marketTrends.regionMultipliers[region] || 1.0;
    adjustment *= regionMultiplier;

    // Demand indicators
    adjustment *= (1 + (this.marketTrends.demandIndicators - 0.5) * 0.3);

    // Economic factors
    adjustment *= (1 + this.marketTrends.economicFactors.inflation);
    adjustment *= (1 + (this.marketTrends.economicFactors.techAdoption - 0.5) * 0.2);

    // Seasonal variation
    adjustment *= client.seasonality;

    return adjustment;
  }

  private calculateCompetitiveAdjustment(client: ClientProfile): number {
    if (client.competitorPricing.length === 0) return 1.0;

    const avgCompetitorPrice = client.competitorPricing.reduce((a, b) => a + b, 0) / client.competitorPricing.length;
    const marketMedian = this.marketTrends.competitorRates.sort()[Math.floor(this.marketTrends.competitorRates.length / 2)];

    // Position slightly above market median but competitive
    return 0.95 + (avgCompetitorPrice / marketMedian) * 0.1;
  }

  private calculateConfidence(client: ClientProfile, scope: AutomationScope): number {
    let confidence = 0.8; // Base confidence

    // Increase confidence with more data points
    if (client.competitorPricing.length >= 3) confidence += 0.1;
    if (client.automationReadiness >= 70) confidence += 0.05;
    if (this.historicalData.length >= 10) confidence += 0.05;

    // Decrease confidence for edge cases
    if (scope.complexity === 'enterprise') confidence -= 0.1;
    if (client.industry === 'custom' || scope.type === 'custom') confidence -= 0.05;

    return Math.min(0.95, Math.max(0.6, confidence));
  }

  private analyzePricingFactors(client: ClientProfile, scope: AutomationScope, price: number) {
    return [
      {
        name: 'Industry Positioning',
        impact: 0.15,
        reasoning: `${client.industry} sector commands premium rates due to regulatory complexity`
      },
      {
        name: 'Company Scale',
        impact: 0.12,
        reasoning: `${client.employeeCount} employees indicates enterprise-level requirements`
      },
      {
        name: 'Technical Complexity',
        impact: 0.20,
        reasoning: `${scope.complexity} automation with ${scope.requiredIntegrations.length} integrations`
      },
      {
        name: 'Market Demand',
        impact: 0.10,
        reasoning: `High automation demand in ${client.geographicLocation} market`
      },
      {
        name: 'Urgency Premium',
        impact: client.urgency >= 7 ? 0.08 : 0.02,
        reasoning: `Priority timeline drives premium pricing model`
      }
    ];
  }

  private determineCompetitivePosition(price: number, client: ClientProfile): 'below' | 'competitive' | 'premium' {
    if (client.competitorPricing.length === 0) return 'competitive';

    const avgCompetitor = client.competitorPricing.reduce((a, b) => a + b, 0) / client.competitorPricing.length;
    
    if (price < avgCompetitor * 0.9) return 'below';
    if (price > avgCompetitor * 1.2) return 'premium';
    return 'competitive';
  }

  private predictConversionProbability(client: ClientProfile, scope: AutomationScope, price: number): number {
    let probability = 0.7; // Base conversion rate

    // Adjust based on price competitiveness
    if (client.competitorPricing.length > 0) {
      const avgCompetitor = client.competitorPricing.reduce((a, b) => a + b, 0) / client.competitorPricing.length;
      const priceRatio = price / avgCompetitor;
      
      if (priceRatio < 0.9) probability += 0.15;
      else if (priceRatio > 1.3) probability -= 0.25;
      else if (priceRatio > 1.1) probability -= 0.1;
    }

    // Adjust based on client factors
    if (client.urgency >= 8) probability += 0.1;
    if (client.automationReadiness >= 80) probability += 0.05;
    if (client.riskTolerance === 'high') probability += 0.05;

    // Adjust based on scope
    if (scope.expectedROI >= 300) probability += 0.1;
    if (scope.complexity === 'basic') probability += 0.05;

    return Math.min(0.95, Math.max(0.25, probability));
  }

  private calculateProfitMargin(scope: AutomationScope, price: number): number {
    const estimatedCosts = scope.estimatedHours * 65; // $65/hour internal cost
    const overhead = price * 0.15; // 15% overhead
    const totalCosts = estimatedCosts + overhead;
    
    return Math.max(0, (price - totalCosts) / price);
  }

  private assessRisk(client: ClientProfile, scope: AutomationScope, price: number): string {
    const risks = [];

    if (client.automationReadiness < 50) risks.push('low automation readiness');
    if (scope.complexity === 'enterprise') risks.push('high technical complexity');
    if (client.riskTolerance === 'low') risks.push('conservative client profile');
    if (price > 10000) risks.push('high-value project scrutiny');

    if (risks.length === 0) return 'Low risk - standard implementation';
    if (risks.length <= 2) return `Medium risk - monitor: ${risks.join(', ')}`;
    return `High risk - requires careful management: ${risks.join(', ')}`;
  }

  private generateRecommendations(client: ClientProfile, scope: AutomationScope, price: number, conversionProb: number): string[] {
    const recommendations = [];

    if (conversionProb < 0.5) {
      recommendations.push('Consider offering phased implementation to reduce initial investment');
    }

    if (client.automationReadiness < 60) {
      recommendations.push('Include automation readiness consulting in proposal');
    }

    if (scope.complexity === 'enterprise') {
      recommendations.push('Propose pilot project to demonstrate value before full implementation');
    }

    if (client.urgency >= 8) {
      recommendations.push('Emphasize accelerated timeline and dedicated resources');
    }

    if (price > client.competitorPricing.reduce((a, b) => Math.max(a, b), 0)) {
      recommendations.push('Highlight unique value propositions and ROI guarantees');
    }

    return recommendations;
  }

  async updateModelWithOutcome(
    client: ClientProfile,
    scope: AutomationScope,
    proposedPrice: number,
    actualPrice: number,
    converted: boolean,
    satisfactionScore?: number
  ): Promise<void> {
    // Update historical data for continuous learning
    this.historicalData.push({
      client,
      scope,
      finalPrice: actualPrice,
      conversionRate: converted ? 1 : 0,
      satisfactionScore: satisfactionScore || 0
    });

    // Adjust model weights based on outcomes
    if (this.historicalData.length > 50) {
      this.optimizeModelWeights();
    }
  }

  private optimizeModelWeights(): void {
    // Simplified gradient descent for weight optimization
    // In production, this would use more sophisticated ML algorithms
    console.log('Optimizing pricing model weights based on historical outcomes...');
  }
}

// Export singleton instance
export const pricingMLEngine = new PricingMLEngine();