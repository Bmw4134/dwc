import express from 'express';

interface LLCFormationData {
  businessName: string;
  state: string;
  businessType: string;
  members: number;
  registeredAgent: boolean;
  ein: boolean;
  operatingAgreement: boolean;
  businessAddress: string;
  businessPurpose: string;
  estimatedRevenue: number;
}

interface LLCFormationResult {
  id: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  businessName: string;
  state: string;
  estimatedCost: number;
  timelineWeeks: number;
  nextSteps: string[];
  documents: {
    name: string;
    status: 'required' | 'submitted' | 'approved';
    description: string;
  }[];
  taxBenefits: {
    benefit: string;
    estimatedSavings: number;
    description: string;
  }[];
  complianceRequirements: {
    requirement: string;
    frequency: string;
    cost: number;
  }[];
}

interface StateRequirements {
  filingFee: number;
  timelineWeeks: number;
  registeredAgentRequired: boolean;
  publicationRequired: boolean;
  additionalRequirements: string[];
}

export class LLCFormationEngine {
  private formations: Map<string, LLCFormationResult> = new Map();
  
  private stateRequirements: { [state: string]: StateRequirements } = {
    'TX': {
      filingFee: 300,
      timelineWeeks: 2,
      registeredAgentRequired: true,
      publicationRequired: false,
      additionalRequirements: ['Certificate of Formation', 'Registered Agent Designation']
    },
    'CA': {
      filingFee: 70,
      timelineWeeks: 3,
      registeredAgentRequired: true,
      publicationRequired: false,
      additionalRequirements: ['Articles of Organization', 'Statement of Information']
    },
    'NY': {
      filingFee: 200,
      timelineWeeks: 4,
      registeredAgentRequired: true,
      publicationRequired: true,
      additionalRequirements: ['Articles of Organization', 'Publication Notice']
    },
    'FL': {
      filingFee: 125,
      timelineWeeks: 2,
      registeredAgentRequired: true,
      publicationRequired: false,
      additionalRequirements: ['Articles of Organization', 'Registered Agent Form']
    },
    'DE': {
      filingFee: 90,
      timelineWeeks: 1,
      registeredAgentRequired: true,
      publicationRequired: false,
      additionalRequirements: ['Certificate of Formation', 'Franchise Tax Registration']
    }
  };

  async processLLCFormation(data: LLCFormationData): Promise<LLCFormationResult> {
    const id = `llc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stateReqs = this.stateRequirements[data.state] || this.stateRequirements['TX'];
    
    const result: LLCFormationResult = {
      id,
      status: 'pending',
      businessName: data.businessName,
      state: data.state,
      estimatedCost: this.calculateTotalCost(data, stateReqs),
      timelineWeeks: stateReqs.timelineWeeks,
      nextSteps: this.generateNextSteps(data, stateReqs),
      documents: this.generateRequiredDocuments(data, stateReqs),
      taxBenefits: this.generateTaxBenefits(data),
      complianceRequirements: this.generateComplianceRequirements(data, stateReqs)
    };

    this.formations.set(id, result);
    return result;
  }

  private calculateTotalCost(data: LLCFormationData, stateReqs: StateRequirements): number {
    let totalCost = stateReqs.filingFee;
    
    if (data.registeredAgent) totalCost += 150; // Annual registered agent fee
    if (data.ein) totalCost += 0; // EIN is free from IRS
    if (data.operatingAgreement) totalCost += 500; // Legal document preparation
    if (stateReqs.publicationRequired) totalCost += 1200; // Publication costs
    
    return totalCost;
  }

  private generateNextSteps(data: LLCFormationData, stateReqs: StateRequirements): string[] {
    const steps = [
      'Verify business name availability',
      `File ${stateReqs.additionalRequirements[0]} with ${data.state} Secretary of State`,
      'Obtain EIN from IRS',
      'Open business bank account'
    ];

    if (data.registeredAgent) {
      steps.splice(2, 0, 'Designate registered agent');
    }

    if (data.operatingAgreement) {
      steps.splice(-1, 0, 'Execute Operating Agreement');
    }

    if (stateReqs.publicationRequired) {
      steps.splice(-1, 0, 'Publish formation notice in local newspaper');
    }

    return steps;
  }

  private generateRequiredDocuments(data: LLCFormationData, stateReqs: StateRequirements): any[] {
    const documents = [
      {
        name: stateReqs.additionalRequirements[0],
        status: 'required' as const,
        description: `Primary formation document filed with ${data.state} state`
      },
      {
        name: 'EIN Application',
        status: data.ein ? 'submitted' : 'required' as const,
        description: 'Federal tax identification number application'
      },
      {
        name: 'Registered Agent Form',
        status: data.registeredAgent ? 'submitted' : 'required' as const,
        description: 'Designation of official business contact'
      }
    ];

    if (data.operatingAgreement) {
      documents.push({
        name: 'Operating Agreement',
        status: 'required' as const,
        description: 'Internal governance document for LLC management'
      });
    }

    return documents;
  }

  private generateTaxBenefits(data: LLCFormationData): any[] {
    const benefits = [
      {
        benefit: 'Pass-through Taxation',
        estimatedSavings: data.estimatedRevenue * 0.15,
        description: 'Avoid double taxation - profits/losses pass through to personal returns'
      },
      {
        benefit: 'Business Expense Deductions',
        estimatedSavings: data.estimatedRevenue * 0.08,
        description: 'Deduct legitimate business expenses including home office, equipment, travel'
      },
      {
        benefit: 'Self-Employment Tax Optimization',
        estimatedSavings: data.estimatedRevenue * 0.05,
        description: 'Potential savings through S-Corp election for higher-income LLCs'
      }
    ];

    return benefits;
  }

  private generateComplianceRequirements(data: LLCFormationData, stateReqs: StateRequirements): any[] {
    const requirements = [
      {
        requirement: 'Annual Report Filing',
        frequency: 'Annual',
        cost: 50
      },
      {
        requirement: 'State Tax Registration',
        frequency: 'One-time',
        cost: 25
      },
      {
        requirement: 'Business License Renewal',
        frequency: 'Annual',
        cost: 100
      }
    ];

    if (data.state === 'CA') {
      requirements.push({
        requirement: 'California Franchise Tax',
        frequency: 'Annual',
        cost: 800
      });
    }

    if (data.state === 'NY' && stateReqs.publicationRequired) {
      requirements.push({
        requirement: 'Publication Compliance',
        frequency: 'One-time',
        cost: 1200
      });
    }

    return requirements;
  }

  async getLLCFormationStatus(id: string): Promise<LLCFormationResult | null> {
    return this.formations.get(id) || null;
  }

  async getAllFormations(): Promise<LLCFormationResult[]> {
    return Array.from(this.formations.values());
  }

  // Sample data for demonstration
  generateSampleFormations(): void {
    const sampleData = [
      {
        businessName: 'DFW Tech Consulting LLC',
        state: 'TX',
        businessType: 'Professional Services',
        members: 2,
        registeredAgent: true,
        ein: true,
        operatingAgreement: true,
        businessAddress: '1234 Main St, Dallas, TX 75201',
        businessPurpose: 'Technology consulting and software development services',
        estimatedRevenue: 250000
      },
      {
        businessName: 'Innovative Solutions LLC',
        state: 'CA',
        businessType: 'Technology',
        members: 1,
        registeredAgent: true,
        ein: true,
        operatingAgreement: false,
        businessAddress: '5678 Tech Blvd, San Francisco, CA 94105',
        businessPurpose: 'Software development and digital marketing services',
        estimatedRevenue: 150000
      }
    ];

    sampleData.forEach(data => {
      this.processLLCFormation(data);
    });
  }

  setupRoutes(app: express.Application): void {
    app.post('/api/llc/formation', async (req, res) => {
      try {
        const result = await this.processLLCFormation(req.body);
        res.json({ success: true, formation: result });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to process LLC formation' });
      }
    });

    app.get('/api/llc/formation/:id', async (req, res) => {
      try {
        const formation = await this.getLLCFormationStatus(req.params.id);
        if (formation) {
          res.json({ success: true, formation });
        } else {
          res.status(404).json({ success: false, error: 'Formation not found' });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch formation status' });
      }
    });

    app.get('/api/llc/formations', async (req, res) => {
      try {
        const formations = await this.getAllFormations();
        res.json({ success: true, formations, count: formations.length });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch formations' });
      }
    });

    app.get('/api/llc/state-requirements/:state', (req, res) => {
      const state = req.params.state.toUpperCase();
      const requirements = this.stateRequirements[state];
      
      if (requirements) {
        res.json({ success: true, requirements, state });
      } else {
        res.status(404).json({ success: false, error: 'State requirements not found' });
      }
    });

    app.get('/api/llc/name-check/:name/:state', (req, res) => {
      const { name, state } = req.params;
      
      // Simulate name availability check
      const isAvailable = !name.toLowerCase().includes('reserved');
      const alternatives = isAvailable ? [] : [
        `${name} Enterprises LLC`,
        `${name} Solutions LLC`,
        `${name} Group LLC`
      ];

      res.json({
        success: true,
        businessName: name,
        state: state.toUpperCase(),
        available: isAvailable,
        alternatives,
        checkedAt: new Date().toISOString()
      });
    });
  }
}

export const llcFormationEngine = new LLCFormationEngine();