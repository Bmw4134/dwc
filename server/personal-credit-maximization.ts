interface PersonalCreditOption {
  lender: string;
  product: string;
  amount: string;
  apr: string;
  timeframe: string;
  requirements: string[];
  applicationUrl: string;
  successRate: number;
  creditScoreMin: number;
  strategy: 'immediate' | 'short_term' | 'medium_term';
  priority: number;
}

interface CreditMaximizationPlan {
  totalPotential: number;
  phase1: PersonalCreditOption[]; // 0% APR Credit Cards
  phase2: PersonalCreditOption[]; // Personal Lines of Credit
  phase3: PersonalCreditOption[]; // Personal Loans
  businessPhase: PersonalCreditOption[]; // Business Credit with Personal Guarantee
  timeline: string;
  actionSteps: string[];
  riskMitigation: string[];
}

export class PersonalCreditMaximizationEngine {
  private creditScore: number = 690;

  getCreditMaximizationPlan(targetAmount: number = 50000): CreditMaximizationPlan {
    const phase1Options: PersonalCreditOption[] = [
      {
        lender: 'Chase',
        product: 'Freedom Unlimited 0% APR',
        amount: '$5,000-$25,000',
        apr: '0% for 15 months',
        timeframe: '7-10 days',
        requirements: ['690+ credit score', 'Income verification', '<30% credit utilization'],
        applicationUrl: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',
        successRate: 85,
        creditScoreMin: 690,
        strategy: 'immediate',
        priority: 1
      },
      {
        lender: 'Citi',
        product: 'Simplicity 0% APR',
        amount: '$3,000-$15,000',
        apr: '0% for 21 months',
        timeframe: '5-7 days',
        requirements: ['680+ credit score', 'Stable income', 'Low debt-to-income'],
        applicationUrl: 'https://www.citi.com/credit-cards/citi-simplicity-credit-card',
        successRate: 80,
        creditScoreMin: 680,
        strategy: 'immediate',
        priority: 2
      },
      {
        lender: 'Capital One',
        product: 'SavorOne 0% APR',
        amount: '$2,000-$20,000',
        apr: '0% for 15 months',
        timeframe: '3-5 days',
        requirements: ['670+ credit score', 'Employment verification'],
        applicationUrl: 'https://www.capitalone.com/credit-cards/savor-dining-rewards/',
        successRate: 75,
        creditScoreMin: 670,
        strategy: 'immediate',
        priority: 3
      },
      {
        lender: 'Wells Fargo',
        product: 'Active Cash 0% APR',
        amount: '$1,000-$15,000',
        apr: '0% for 15 months',
        timeframe: '5-7 days',
        requirements: ['680+ credit score', 'Banking relationship preferred'],
        applicationUrl: 'https://www.wellsfargo.com/credit-cards/active-cash/',
        successRate: 70,
        creditScoreMin: 680,
        strategy: 'immediate',
        priority: 4
      }
    ];

    const phase2Options: PersonalCreditOption[] = [
      {
        lender: 'Marcus by Goldman Sachs',
        product: 'Personal Line of Credit',
        amount: '$10,000-$100,000',
        apr: '8.99%-23.99%',
        timeframe: '3-7 days',
        requirements: ['680+ credit score', 'Debt-to-income <40%', 'Stable income'],
        applicationUrl: 'https://www.marcus.com/personal-line-of-credit',
        successRate: 75,
        creditScoreMin: 680,
        strategy: 'short_term',
        priority: 1
      },
      {
        lender: 'Wells Fargo',
        product: 'Personal Line of Credit',
        amount: '$3,000-$100,000',
        apr: '9.50%-21.00%',
        timeframe: '5-10 days',
        requirements: ['690+ credit score', 'Banking relationship', 'Income verification'],
        applicationUrl: 'https://www.wellsfargo.com/personal-loans-credit/personal-line-credit/',
        successRate: 70,
        creditScoreMin: 690,
        strategy: 'short_term',
        priority: 2
      }
    ];

    const phase3Options: PersonalCreditOption[] = [
      {
        lender: 'SoFi',
        product: 'Personal Loan',
        amount: '$5,000-$100,000',
        apr: '8.99%-25.81%',
        timeframe: '1-7 days',
        requirements: ['660+ credit score', 'Employment verification', 'No collateral'],
        applicationUrl: 'https://www.sofi.com/personal-loans/',
        successRate: 80,
        creditScoreMin: 660,
        strategy: 'short_term',
        priority: 1
      },
      {
        lender: 'LightStream',
        product: 'Personal Loan',
        amount: '$5,000-$100,000',
        apr: '7.49%-25.49%',
        timeframe: '1-3 days',
        requirements: ['660+ credit score', 'Strong credit history', 'Stable income'],
        applicationUrl: 'https://www.lightstream.com/personal-loans',
        successRate: 75,
        creditScoreMin: 660,
        strategy: 'short_term',
        priority: 2
      }
    ];

    const businessPhaseOptions: PersonalCreditOption[] = [
      {
        lender: 'Chase',
        product: 'Ink Business Unlimited',
        amount: '$25,000-$50,000',
        apr: '0% for 12 months',
        timeframe: '7-14 days',
        requirements: ['LLC registration', 'EIN', 'Personal credit 690+', 'Business checking'],
        applicationUrl: 'https://creditcards.chase.com/business-credit-cards/ink/unlimited',
        successRate: 75,
        creditScoreMin: 690,
        strategy: 'medium_term',
        priority: 1
      },
      {
        lender: 'Capital One',
        product: 'Spark Cash for Business',
        amount: '$15,000-$100,000',
        apr: '0% for 12 months',
        timeframe: '5-10 days',
        requirements: ['Business registration', 'Personal guarantee', 'Revenue projections'],
        applicationUrl: 'https://www.capitalone.com/small-business/credit-cards/spark-cash/',
        successRate: 70,
        creditScoreMin: 680,
        strategy: 'medium_term',
        priority: 2
      }
    ];

    const totalPotentialPhase1 = 75000; // Conservative estimate for 0% APR cards
    const totalPotentialPhase2 = 200000; // Personal lines of credit
    const totalPotentialPhase3 = 100000; // Personal loans
    const totalPotentialBusiness = 150000; // Business credit

    return {
      totalPotential: Math.min(targetAmount, totalPotentialPhase1 + totalPotentialPhase2),
      phase1: phase1Options,
      phase2: phase2Options,
      phase3: phase3Options,
      businessPhase: businessPhaseOptions,
      timeline: this.generateTimeline(targetAmount),
      actionSteps: this.generateActionSteps(targetAmount),
      riskMitigation: this.generateRiskMitigation()
    };
  }

  private generateTimeline(targetAmount: number): string {
    if (targetAmount <= 25000) {
      return 'Week 1-2: Apply for 0% APR credit cards. Week 3: Apply for personal line of credit. Total timeline: 2-3 weeks';
    } else if (targetAmount <= 50000) {
      return 'Week 1-2: Credit cards and personal LOC. Week 3-4: Personal loans. Week 5-6: Business credit setup. Total timeline: 4-6 weeks';
    } else {
      return 'Week 1-3: Personal credit optimization. Week 4-6: Business entity formation and credit. Week 7-8: Asset-based lending. Total timeline: 6-8 weeks';
    }
  }

  private generateActionSteps(targetAmount: number): string[] {
    const baseSteps = [
      'Check credit reports from all 3 bureaus (Experian, Equifax, TransUnion)',
      'Pay down existing credit card balances to below 10% utilization',
      'Request credit limit increases on existing cards',
      'Apply for Chase Freedom Unlimited (highest approval rate)',
      'Apply for Citi Simplicity after 5-7 day gap',
      'Monitor credit score impact between applications',
      'Apply for Marcus personal line of credit',
      'Document all account information and terms'
    ];

    if (targetAmount > 25000) {
      baseSteps.push(
        'Register LLC in Texas after securing personal credit',
        'Open business bank account with initial deposit from personal credit',
        'Apply for business credit cards with personal guarantee',
        'Establish Net-30 trade lines with suppliers'
      );
    }

    if (targetAmount > 50000) {
      baseSteps.push(
        'Explore asset-based lending options',
        'Consider co-signer applications for higher amounts',
        'Research equipment financing opportunities',
        'Establish business credit monitoring'
      );
    }

    return baseSteps;
  }

  private generateRiskMitigation(): string[] {
    return [
      'Space applications 5-7 days apart to minimize credit score impact',
      'Start with highest approval rate lenders first',
      'Keep detailed records of all applications and terms',
      'Set up automatic payments to avoid late fees',
      'Monitor credit utilization across all accounts',
      'Have backup funding sources identified',
      'Maintain emergency fund separate from credit facilities',
      'Consider credit monitoring services for early alerts',
      'Plan debt consolidation strategy if needed',
      'Maintain business and personal credit separation after LLC formation'
    ];
  }

  getOptimalApplicationSequence(): {
    sequence: PersonalCreditOption[];
    totalPotential: number;
    timeframe: string;
  } {
    const plan = this.getCreditMaximizationPlan();
    const optimalSequence: PersonalCreditOption[] = [];

    // Sort by priority and success rate
    const sortedPhase1 = plan.phase1.sort((a, b) => a.priority - b.priority);
    const sortedPhase2 = plan.phase2.sort((a, b) => a.priority - b.priority);

    optimalSequence.push(sortedPhase1[0]); // Chase Freedom Unlimited
    optimalSequence.push(sortedPhase1[1]); // Citi Simplicity
    optimalSequence.push(sortedPhase2[0]); // Marcus LOC

    const totalPotential = 65000; // Conservative estimate for top 3

    return {
      sequence: optimalSequence,
      totalPotential,
      timeframe: '2-3 weeks for $50K+ in available credit'
    };
  }

  generatePersonalCreditReport(currentUtilization: number = 15): {
    currentScore: number;
    projectedScore: number;
    recommendations: string[];
    nextSteps: string[];
  } {
    const projectedScore = this.creditScore + (currentUtilization < 10 ? 20 : 10);

    return {
      currentScore: this.creditScore,
      projectedScore: Math.min(850, projectedScore),
      recommendations: [
        'Target credit utilization below 10% across all cards',
        'Apply for credit limit increases before new applications',
        'Consider becoming an authorized user on spouse/family member accounts',
        'Set up credit monitoring for score tracking',
        'Plan application timing to minimize hard inquiries'
      ],
      nextSteps: [
        'Apply for Chase Freedom Unlimited immediately',
        'Wait 5-7 days, then apply for Citi Simplicity',
        'Apply for Marcus LOC after credit cards are approved',
        'Register LLC after personal credit is secured',
        'Apply for business credit with personal guarantee'
      ]
    };
  }
}

export const personalCreditEngine = new PersonalCreditMaximizationEngine();