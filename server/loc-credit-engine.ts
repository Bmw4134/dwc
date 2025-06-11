import express from 'express';

interface LetterOfCreditApplication {
  applicantName: string;
  applicantType: 'individual' | 'business';
  businessName?: string;
  creditAmount: number;
  purpose: string;
  beneficiaryName: string;
  beneficiaryBank: string;
  tradingCountry: string;
  goodsDescription: string;
  shipmentTerms: string;
  paymentTerms: string;
  documentRequirements: string[];
  collateralOffered: string;
  creditHistory: {
    score: number;
    previousDefaults: number;
    businessYears: number;
    annualRevenue: number;
  };
  bankRelationship: boolean;
  insuranceCoverage: boolean;
}

interface LOCResult {
  id: string;
  status: 'under-review' | 'approved' | 'rejected' | 'requires-documentation';
  applicantName: string;
  creditAmount: number;
  approvedAmount?: number;
  interestRate: number;
  fees: {
    issuanceFee: number;
    amendmentFee: number;
    confirmationFee: number;
    adviceFee: number;
  };
  terms: {
    validity: number; // days
    confirmationType: 'confirmed' | 'unconfirmed';
    transferable: boolean;
    revocable: boolean;
  };
  requirements: string[];
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
    score: number;
  };
  nextSteps: string[];
  estimatedProcessingDays: number;
  approvalProbability: number;
}

interface TradeFinanceMetrics {
  totalApplications: number;
  approvedAmount: number;
  averageRate: number;
  successRate: number;
  processingTime: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export class LOCCreditEngine {
  private applications: Map<string, LOCResult> = new Map();
  private baseInterestRate = 3.5; // Base rate percentage

  async processLOCApplication(application: LetterOfCreditApplication): Promise<LOCResult> {
    const id = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const riskAssessment = this.assessRisk(application);
    const interestRate = this.calculateInterestRate(application, riskAssessment);
    const fees = this.calculateFees(application.creditAmount);
    const approvalProbability = this.calculateApprovalProbability(application, riskAssessment);
    
    const result: LOCResult = {
      id,
      status: this.determineInitialStatus(riskAssessment, approvalProbability),
      applicantName: application.applicantName,
      creditAmount: application.creditAmount,
      approvedAmount: approvalProbability > 70 ? application.creditAmount : application.creditAmount * 0.8,
      interestRate,
      fees,
      terms: this.generateTerms(application, riskAssessment),
      requirements: this.generateRequirements(application),
      riskAssessment,
      nextSteps: this.generateNextSteps(application, riskAssessment),
      estimatedProcessingDays: this.calculateProcessingTime(riskAssessment),
      approvalProbability
    };

    this.applications.set(id, result);
    return result;
  }

  private assessRisk(application: LetterOfCreditApplication): LOCResult['riskAssessment'] {
    let score = 100;
    const factors: string[] = [];

    // Credit score assessment
    if (application.creditHistory.score < 650) {
      score -= 30;
      factors.push('Below average credit score');
    } else if (application.creditHistory.score > 750) {
      score += 10;
      factors.push('Excellent credit score');
    }

    // Business experience
    if (application.creditHistory.businessYears < 2) {
      score -= 20;
      factors.push('Limited business experience');
    } else if (application.creditHistory.businessYears > 5) {
      score += 10;
      factors.push('Established business history');
    }

    // Revenue assessment
    const revenueRatio = application.creditAmount / application.creditHistory.annualRevenue;
    if (revenueRatio > 0.5) {
      score -= 25;
      factors.push('High credit-to-revenue ratio');
    } else if (revenueRatio < 0.2) {
      score += 15;
      factors.push('Conservative credit request');
    }

    // Country risk
    const highRiskCountries = ['AF', 'IR', 'KP', 'SY'];
    if (highRiskCountries.includes(application.tradingCountry)) {
      score -= 40;
      factors.push('High-risk trading country');
    }

    // Previous defaults
    if (application.creditHistory.previousDefaults > 0) {
      score -= application.creditHistory.previousDefaults * 15;
      factors.push('Previous payment defaults');
    }

    // Bank relationship
    if (application.bankRelationship) {
      score += 10;
      factors.push('Existing banking relationship');
    }

    // Insurance coverage
    if (application.insuranceCoverage) {
      score += 5;
      factors.push('Trade insurance coverage');
    }

    const riskLevel: 'low' | 'medium' | 'high' = 
      score >= 80 ? 'low' : score >= 60 ? 'medium' : 'high';

    return {
      riskLevel,
      factors,
      score: Math.max(0, Math.min(100, score))
    };
  }

  private calculateInterestRate(application: LetterOfCreditApplication, risk: LOCResult['riskAssessment']): number {
    let rate = this.baseInterestRate;

    // Risk premium
    switch (risk.riskLevel) {
      case 'low':
        rate += 0.5;
        break;
      case 'medium':
        rate += 1.5;
        break;
      case 'high':
        rate += 3.0;
        break;
    }

    // Amount premium
    if (application.creditAmount > 1000000) {
      rate += 0.5;
    } else if (application.creditAmount < 100000) {
      rate -= 0.2;
    }

    // Country risk premium
    const emergingMarkets = ['IN', 'CN', 'BR', 'MX', 'TH'];
    if (emergingMarkets.includes(application.tradingCountry)) {
      rate += 0.75;
    }

    return Math.round(rate * 100) / 100;
  }

  private calculateFees(amount: number): LOCResult['fees'] {
    const baseIssuanceFee = Math.max(500, amount * 0.002);
    
    return {
      issuanceFee: Math.round(baseIssuanceFee),
      amendmentFee: Math.round(baseIssuanceFee * 0.5),
      confirmationFee: Math.round(amount * 0.001),
      adviceFee: 150
    };
  }

  private generateTerms(application: LetterOfCreditApplication, risk: LOCResult['riskAssessment']): LOCResult['terms'] {
    return {
      validity: risk.riskLevel === 'low' ? 180 : risk.riskLevel === 'medium' ? 120 : 90,
      confirmationType: risk.riskLevel === 'high' ? 'confirmed' : 'unconfirmed',
      transferable: application.creditAmount < 500000 && risk.riskLevel !== 'high',
      revocable: false // Modern LCs are typically irrevocable
    };
  }

  private generateRequirements(application: LetterOfCreditApplication): string[] {
    const requirements = [
      'Commercial invoice',
      'Bill of lading or airway bill',
      'Packing list',
      'Certificate of origin'
    ];

    if (application.creditAmount > 250000) {
      requirements.push('Inspection certificate');
    }

    if (application.insuranceCoverage) {
      requirements.push('Insurance certificate');
    }

    if (application.goodsDescription.toLowerCase().includes('food')) {
      requirements.push('Health certificate');
    }

    return requirements;
  }

  private generateNextSteps(application: LetterOfCreditApplication, risk: LOCResult['riskAssessment']): string[] {
    const steps = [
      'Submit completed application with required documents',
      'Provide financial statements for last 3 years',
      'Complete KYC (Know Your Customer) verification'
    ];

    if (risk.riskLevel === 'high') {
      steps.push('Provide additional collateral documentation');
      steps.push('Schedule risk assessment interview');
    }

    if (application.creditAmount > 500000) {
      steps.push('Board approval required');
    }

    steps.push('Final credit approval and LC issuance');

    return steps;
  }

  private calculateProcessingTime(risk: LOCResult['riskAssessment']): number {
    let days = 5; // Base processing time

    switch (risk.riskLevel) {
      case 'low':
        days += 2;
        break;
      case 'medium':
        days += 5;
        break;
      case 'high':
        days += 10;
        break;
    }

    return days;
  }

  private calculateApprovalProbability(application: LetterOfCreditApplication, risk: LOCResult['riskAssessment']): number {
    let probability = risk.score;

    // Adjust based on credit amount vs revenue
    const revenueRatio = application.creditAmount / application.creditHistory.annualRevenue;
    if (revenueRatio > 0.8) {
      probability -= 20;
    }

    // Bank relationship bonus
    if (application.bankRelationship) {
      probability += 15;
    }

    return Math.max(10, Math.min(95, probability));
  }

  private determineInitialStatus(risk: LOCResult['riskAssessment'], probability: number): LOCResult['status'] {
    if (probability > 80 && risk.riskLevel === 'low') {
      return 'approved';
    } else if (probability < 40 || risk.riskLevel === 'high') {
      return 'requires-documentation';
    } else {
      return 'under-review';
    }
  }

  async getLOCStatus(id: string): Promise<LOCResult | null> {
    return this.applications.get(id) || null;
  }

  async getAllApplications(): Promise<LOCResult[]> {
    return Array.from(this.applications.values());
  }

  async getTradeFinanceMetrics(): Promise<TradeFinanceMetrics> {
    const applications = Array.from(this.applications.values());
    
    if (applications.length === 0) {
      return {
        totalApplications: 0,
        approvedAmount: 0,
        averageRate: this.baseInterestRate,
        successRate: 0,
        processingTime: 7,
        riskDistribution: { low: 0, medium: 0, high: 0 }
      };
    }

    const approved = applications.filter(app => app.status === 'approved');
    const totalApprovedAmount = approved.reduce((sum, app) => sum + (app.approvedAmount || 0), 0);
    const averageRate = applications.reduce((sum, app) => sum + app.interestRate, 0) / applications.length;
    const averageProcessingTime = applications.reduce((sum, app) => sum + app.estimatedProcessingDays, 0) / applications.length;

    const riskCounts = applications.reduce((counts, app) => {
      counts[app.riskAssessment.riskLevel]++;
      return counts;
    }, { low: 0, medium: 0, high: 0 });

    return {
      totalApplications: applications.length,
      approvedAmount: totalApprovedAmount,
      averageRate: Math.round(averageRate * 100) / 100,
      successRate: Math.round((approved.length / applications.length) * 100),
      processingTime: Math.round(averageProcessingTime),
      riskDistribution: riskCounts
    };
  }

  // Generate sample data for demonstration
  generateSampleApplications(): void {
    const sampleApplications = [
      {
        applicantName: 'DWC Import/Export LLC',
        applicantType: 'business' as const,
        businessName: 'DWC Import/Export LLC',
        creditAmount: 500000,
        purpose: 'Import of manufacturing equipment',
        beneficiaryName: 'Tech Manufacturing Co.',
        beneficiaryBank: 'Industrial Bank of Korea',
        tradingCountry: 'KR',
        goodsDescription: 'CNC machinery and industrial equipment',
        shipmentTerms: 'FOB Seoul',
        paymentTerms: '90 days after sight',
        documentRequirements: ['Commercial Invoice', 'Bill of Lading', 'Inspection Certificate'],
        collateralOffered: 'Equipment and inventory',
        creditHistory: {
          score: 720,
          previousDefaults: 0,
          businessYears: 5,
          annualRevenue: 2000000
        },
        bankRelationship: true,
        insuranceCoverage: true
      },
      {
        applicantName: 'Global Trading Solutions',
        applicantType: 'business' as const,
        businessName: 'Global Trading Solutions',
        creditAmount: 250000,
        purpose: 'Import of consumer electronics',
        beneficiaryName: 'Electronics Manufacturer Ltd',
        beneficiaryBank: 'China Construction Bank',
        tradingCountry: 'CN',
        goodsDescription: 'Consumer electronics and accessories',
        shipmentTerms: 'CIF Dallas',
        paymentTerms: '60 days after sight',
        documentRequirements: ['Commercial Invoice', 'Packing List', 'Certificate of Origin'],
        collateralOffered: 'Accounts receivable',
        creditHistory: {
          score: 680,
          previousDefaults: 1,
          businessYears: 3,
          annualRevenue: 1200000
        },
        bankRelationship: false,
        insuranceCoverage: true
      }
    ];

    sampleApplications.forEach(app => {
      this.processLOCApplication(app);
    });
  }

  setupRoutes(app: express.Application): void {
    app.post('/api/loc/application', async (req, res) => {
      try {
        const result = await this.processLOCApplication(req.body);
        res.json({ success: true, application: result });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to process LOC application' });
      }
    });

    app.get('/api/loc/application/:id', async (req, res) => {
      try {
        const application = await this.getLOCStatus(req.params.id);
        if (application) {
          res.json({ success: true, application });
        } else {
          res.status(404).json({ success: false, error: 'Application not found' });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch application status' });
      }
    });

    app.get('/api/loc/applications', async (req, res) => {
      try {
        const applications = await this.getAllApplications();
        res.json({ success: true, applications, count: applications.length });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch applications' });
      }
    });

    app.get('/api/loc/metrics', async (req, res) => {
      try {
        const metrics = await this.getTradeFinanceMetrics();
        res.json({ success: true, metrics });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
      }
    });

    app.get('/api/loc/rates/:amount/:country', (req, res) => {
      const amount = parseInt(req.params.amount);
      const country = req.params.country.toUpperCase();
      
      // Mock rate calculation
      let baseRate = this.baseInterestRate;
      
      if (amount > 1000000) baseRate += 0.5;
      if (['CN', 'IN', 'BR'].includes(country)) baseRate += 0.75;
      if (['AF', 'IR', 'KP'].includes(country)) baseRate += 2.0;
      
      const fees = this.calculateFees(amount);
      
      res.json({
        success: true,
        amount,
        country,
        estimatedRate: Math.round(baseRate * 100) / 100,
        fees,
        estimatedProcessingDays: 7,
        calculatedAt: new Date().toISOString()
      });
    });
  }
}

export const locCreditEngine = new LOCCreditEngine();