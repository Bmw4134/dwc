import express from 'express';
import { leadDashboardGenerator } from '../lead-dashboard-generator.js';

interface NewLeadRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  industry?: string;
  companySize?: string;
  interestLevel?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  message?: string;
}

export class NewLeadAPI {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
    this.setupRoutes();
  }

  private setupRoutes() {
    // Main new lead processing endpoint
    this.app.post('/api/new-lead', async (req, res) => {
      try {
        const leadData = this.validateLeadData(req.body);
        const enhancedLeadData = await this.enhanceLeadData(leadData);
        
        // Generate intelligent dashboard
        const dashboardUrl = await leadDashboardGenerator.processNewLead(enhancedLeadData);
        
        // Trigger follow-up workflows
        await this.triggerLeadWorkflows(enhancedLeadData);
        
        res.json({
          success: true,
          leadId: enhancedLeadData.id,
          dashboardUrl,
          qnisScore: enhancedLeadData.qnisScore,
          message: 'Lead processed and dashboard generated successfully'
        });
      } catch (error) {
        console.error('New lead processing failed:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to process new lead',
          details: error.message
        });
      }
    });

    // Lead status updates
    this.app.post('/api/leads/mark-hot', async (req, res) => {
      try {
        const { leadId, isHot } = req.body;
        await this.updateLeadStatus(leadId, { isHot });
        
        res.json({
          success: true,
          message: `Lead ${isHot ? 'marked as hot' : 'unmarked as hot'}`
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to update lead status'
        });
      }
    });

    // Auto follow-up scheduling
    this.app.post('/api/leads/auto-follow-up', async (req, res) => {
      try {
        const { leadId } = req.body;
        const followUpId = await this.scheduleAutoFollowUp(leadId);
        
        res.json({
          success: true,
          followUpId,
          message: 'Auto follow-up sequence initiated'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to schedule follow-up'
        });
      }
    });

    // Lead to deal conversion
    this.app.post('/api/leads/convert-to-deal', async (req, res) => {
      try {
        const { leadId } = req.body;
        const dealId = await this.convertLeadToDeal(leadId);
        
        res.json({
          success: true,
          dealId,
          message: 'Lead converted to deal successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to convert lead to deal'
        });
      }
    });

    // Get lead dashboard data
    this.app.get('/api/leads/:leadId/dashboard', async (req, res) => {
      try {
        const { leadId } = req.params;
        const dashboardData = await this.getDashboardData(leadId);
        
        res.json({
          success: true,
          data: dashboardData
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch dashboard data'
        });
      }
    });
  }

  private validateLeadData(data: any): NewLeadRequest {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email address is required');
    }

    return {
      email: data.email.toLowerCase().trim(),
      firstName: data.firstName?.trim() || '',
      lastName: data.lastName?.trim() || '',
      company: data.company?.trim() || '',
      phone: data.phone?.trim() || '',
      industry: data.industry || 'unknown',
      companySize: data.companySize || this.inferCompanySize(data.company),
      interestLevel: data.interestLevel || this.inferInterestLevel(data),
      source: data.source || this.determineSource(data),
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      message: data.message?.trim() || ''
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private inferCompanySize(company: string): string {
    if (!company) return 'unknown';
    
    // Simple heuristics based on company name patterns
    const companyLower = company.toLowerCase();
    
    if (companyLower.includes('startup') || companyLower.includes('labs')) return 'startup';
    if (companyLower.includes('enterprise') || companyLower.includes('corp') || companyLower.includes('corporation')) return 'large';
    if (companyLower.includes('llc') || companyLower.includes('inc')) return 'medium';
    
    return 'small'; // Default assumption
  }

  private inferInterestLevel(data: any): string {
    let score = 0;
    
    // High-intent indicators
    if (data.message && data.message.toLowerCase().includes('demo')) score += 3;
    if (data.message && data.message.toLowerCase().includes('pricing')) score += 3;
    if (data.message && data.message.toLowerCase().includes('urgent')) score += 2;
    if (data.phone) score += 2; // Providing phone indicates higher intent
    if (data.company && data.company.length > 5) score += 1;
    
    // UTM campaign analysis
    if (data.utm_campaign) {
      if (data.utm_campaign.includes('demo')) score += 2;
      if (data.utm_campaign.includes('pricing')) score += 2;
      if (data.utm_campaign.includes('conversion')) score += 1;
    }

    if (score >= 5) return 'very_high';
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  private determineSource(data: any): string {
    if (data.utm_source) {
      return data.utm_source;
    }
    
    if (data.message) {
      const message = data.message.toLowerCase();
      if (message.includes('demo')) return 'demo_request';
      if (message.includes('consultation')) return 'consultation_request';
      if (message.includes('pricing')) return 'pricing_inquiry';
    }
    
    return 'website';
  }

  private async enhanceLeadData(leadData: NewLeadRequest): Promise<any> {
    const enhancedData = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      capturedAt: new Date(),
      interactions: [
        {
          type: 'lead_captured',
          timestamp: new Date(),
          details: `Lead captured from ${leadData.source}`,
          value: this.getInteractionValue(leadData.source)
        }
      ]
    };

    // Add initial interaction if message provided
    if (leadData.message) {
      enhancedData.interactions.push({
        type: 'initial_message',
        timestamp: new Date(),
        details: leadData.message,
        value: this.getMessageValue(leadData.message)
      });
    }

    return enhancedData;
  }

  private getInteractionValue(source: string): number {
    const sourceValues = {
      'demo_request': 80,
      'consultation_request': 75,
      'pricing_inquiry': 70,
      'contact_form': 50,
      'newsletter': 20,
      'website': 30,
      'social_media': 25,
      'referral': 60
    };
    
    return sourceValues[source] || 30;
  }

  private getMessageValue(message: string): number {
    if (!message) return 0;
    
    const messageLower = message.toLowerCase();
    let value = 10; // Base value for any message
    
    // Intent indicators
    if (messageLower.includes('demo')) value += 30;
    if (messageLower.includes('pricing') || messageLower.includes('cost')) value += 25;
    if (messageLower.includes('urgent') || messageLower.includes('asap')) value += 20;
    if (messageLower.includes('meeting') || messageLower.includes('call')) value += 15;
    if (messageLower.includes('budget')) value += 15;
    
    return Math.min(value, 80); // Cap at 80
  }

  private async triggerLeadWorkflows(leadData: any): Promise<void> {
    try {
      // Trigger lead qualification workflow in DWC Engine
      await fetch('http://localhost:5000/api/dwc/trigger/lead-qualification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadData,
          priority: leadData.interestLevel === 'very_high' ? 'critical' : 'high'
        })
      });
    } catch (error) {
      console.error('Failed to trigger lead workflows:', error);
    }
  }

  private async updateLeadStatus(leadId: string, updates: any): Promise<void> {
    // In a real implementation, this would update the database
    console.log(`Updating lead ${leadId} with:`, updates);
  }

  private async scheduleAutoFollowUp(leadId: string): Promise<string> {
    const followUpId = `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Schedule follow-up sequence
    const followUpSequence = [
      { delay: 0, type: 'welcome_email', template: 'welcome_new_lead' },
      { delay: 24 * 60 * 60 * 1000, type: 'value_email', template: 'case_study_showcase' },
      { delay: 3 * 24 * 60 * 60 * 1000, type: 'demo_offer', template: 'demo_invitation' },
      { delay: 7 * 24 * 60 * 60 * 1000, type: 'check_in', template: 'gentle_follow_up' }
    ];

    // In a real implementation, this would schedule emails
    console.log(`Scheduled follow-up sequence ${followUpId} for lead ${leadId}`);
    
    return followUpId;
  }

  private async convertLeadToDeal(leadId: string): Promise<string> {
    const dealId = `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create deal record
    const dealData = {
      id: dealId,
      leadId,
      stage: 'discovery',
      value: 50000, // Estimated deal value
      probability: 0.3,
      expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      assignedTo: 'watson@dwcsystems.com',
      createdAt: new Date()
    };

    console.log('Created deal:', dealData);
    
    return dealId;
  }

  private async getDashboardData(leadId: string): Promise<any> {
    // Return dashboard-specific data
    return {
      leadId,
      lastUpdated: new Date().toISOString(),
      metrics: {
        qnisScore: 85,
        leadVelocity: 2.3,
        conversionProbability: 68
      },
      recentActivities: [
        { type: 'email_opened', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { type: 'website_visit', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) }
      ]
    };
  }
}

export function setupNewLeadAPI(app: express.Application): NewLeadAPI {
  return new NewLeadAPI(app);
}