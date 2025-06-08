import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FormField {
  selector: string;
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormAnalysis {
  url: string;
  title: string;
  fields: FormField[];
  submitSelector: string;
  estimatedCompletionTime: number;
  businessValue: 'high' | 'medium' | 'low';
  leadPotential: number;
}

interface LeadProfile {
  businessName: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  employeeCount: string;
  annualRevenue: string;
  painPoints: string[];
  projectBudget: string;
  timeline: string;
  decisionMaker: boolean;
}

interface FormFillResult {
  success: boolean;
  formUrl: string;
  fieldsCompleted: number;
  totalFields: number;
  submissionStatus: 'submitted' | 'failed' | 'pending_review';
  leadData: LeadProfile;
  screenshots: string[];
  nextSteps: string[];
  estimatedValue: number;
}

export class IntelligentFormAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private perplexityApiKey: string;

  constructor() {
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  // Analyze form structure and business value
  async analyzeForm(url: string): Promise<FormAnalysis> {
    if (!this.page) throw new Error('Browser not initialized');

    await this.page.goto(url, { waitUntil: 'networkidle2' });

    const formData = await this.page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      if (forms.length === 0) return null;

      const form = forms[0]; // Analyze first form
      const fields: any[] = [];

      // Analyze input fields
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach((input: any, index) => {
        const label = form.querySelector(`label[for="${input.id}"]`)?.textContent ||
                     input.previousElementSibling?.textContent ||
                     input.placeholder ||
                     `Field ${index + 1}`;

        let options: string[] = [];
        if (input.tagName === 'SELECT') {
          options = Array.from(input.options).map((opt: any) => opt.text);
        }

        fields.push({
          selector: input.id ? `#${input.id}` : 
                   input.name ? `[name="${input.name}"]` : 
                   `${input.tagName.toLowerCase()}:nth-child(${index + 1})`,
          type: input.type || input.tagName.toLowerCase(),
          label: label.trim(),
          placeholder: input.placeholder,
          required: input.required,
          options
        });
      });

      // Find submit button
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]') ||
                          form.querySelector('button:not([type])');

      return {
        title: document.title,
        fields,
        submitSelector: submitButton ? 
          (submitButton.id ? `#${submitButton.id}` : 'button[type="submit"]') : 
          'button'
      };
    });

    if (!formData) throw new Error('No forms found on page');

    // Use Perplexity to assess business value
    const businessAnalysis = await this.analyzeBusinessValue(url, formData.title);

    return {
      url,
      title: formData.title,
      fields: formData.fields,
      submitSelector: formData.submitSelector,
      estimatedCompletionTime: formData.fields.length * 15, // 15 seconds per field
      businessValue: businessAnalysis.value,
      leadPotential: businessAnalysis.leadScore
    };
  }

  // Use Perplexity to analyze business value and lead potential
  private async analyzeBusinessValue(url: string, title: string): Promise<{
    value: 'high' | 'medium' | 'low';
    leadScore: number;
    insights: string[];
  }> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a business intelligence analyst. Analyze websites for lead generation potential and business value. Respond in JSON format.'
            },
            {
              role: 'user',
              content: `Analyze this business for lead generation potential:
              URL: ${url}
              Page Title: ${title}
              
              Provide analysis in JSON format:
              {
                "value": "high|medium|low",
                "leadScore": number (1-100),
                "insights": ["insight1", "insight2"],
                "industry": "industry name",
                "estimatedBudget": "budget range",
                "decisionMakerLikelihood": number (1-100)
              }`
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);
      
      return {
        value: analysis.value || 'medium',
        leadScore: analysis.leadScore || 50,
        insights: analysis.insights || []
      };
    } catch (error) {
      console.error('Perplexity analysis error:', error);
      return {
        value: 'medium',
        leadScore: 50,
        insights: ['Unable to analyze - manual review needed']
      };
    }
  }

  // Generate intelligent lead data using OpenAI
  async generateLeadData(formAnalysis: FormAnalysis, targetIndustry?: string): Promise<LeadProfile> {
    const prompt = `Generate realistic business lead data for form filling:
    
    Form Context: ${formAnalysis.title}
    Website: ${formAnalysis.url}
    Target Industry: ${targetIndustry || 'general business'}
    
    Create a realistic business profile that would be interested in automation consulting services.
    
    Format as JSON:
    {
      "businessName": "realistic company name",
      "industry": "specific industry",
      "website": "company website",
      "email": "business email",
      "phone": "business phone",
      "address": "business address",
      "employeeCount": "employee range",
      "annualRevenue": "revenue range",
      "painPoints": ["specific pain point 1", "pain point 2"],
      "projectBudget": "budget range",
      "timeline": "project timeline",
      "decisionMaker": true/false
    }`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a lead generation expert. Create realistic business profiles for B2B outreach." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      throw new Error('Failed to generate lead data');
    }
  }

  // Fill form with intelligent data
  async fillForm(formAnalysis: FormAnalysis, leadData: LeadProfile): Promise<FormFillResult> {
    if (!this.page) throw new Error('Browser not initialized');

    await this.page.goto(formAnalysis.url, { waitUntil: 'networkidle2' });
    
    const screenshots: string[] = [];
    let fieldsCompleted = 0;

    // Take initial screenshot
    let screenshot = await this.page.screenshot({ encoding: 'base64', fullPage: false });
    screenshots.push(`data:image/png;base64,${screenshot}`);

    try {
      for (const field of formAnalysis.fields) {
        await this.page.waitForSelector(field.selector, { timeout: 5000 });
        
        const value = this.getFieldValue(field, leadData);
        if (!value) continue;

        switch (field.type) {
          case 'input':
          case 'textarea':
            await this.page.click(field.selector);
            await this.page.evaluate((selector) => {
              (document.querySelector(selector) as HTMLInputElement).value = '';
            }, field.selector);
            await this.page.type(field.selector, value, { delay: 50 });
            break;

          case 'select':
            await this.page.select(field.selector, value);
            break;

          case 'checkbox':
            if (value.toLowerCase() === 'yes' || value.toLowerCase() === 'true') {
              await this.page.click(field.selector);
            }
            break;
        }

        fieldsCompleted++;
        await this.page.waitForTimeout(500);
      }

      // Take screenshot after filling
      screenshot = await this.page.screenshot({ encoding: 'base64', fullPage: false });
      screenshots.push(`data:image/png;base64,${screenshot}`);

      // Attempt submission
      let submissionStatus: 'submitted' | 'failed' | 'pending_review' = 'pending_review';
      
      try {
        await this.page.click(formAnalysis.submitSelector);
        await this.page.waitForTimeout(3000);
        
        // Check for success indicators
        const url = this.page.url();
        const content = await this.page.content();
        
        if (url.includes('thank') || url.includes('success') || 
            content.includes('thank you') || content.includes('submitted')) {
          submissionStatus = 'submitted';
        }
      } catch (error) {
        submissionStatus = 'failed';
      }

      // Take final screenshot
      screenshot = await this.page.screenshot({ encoding: 'base64', fullPage: false });
      screenshots.push(`data:image/png;base64,${screenshot}`);

      // Generate next steps using OpenAI
      const nextSteps = await this.generateNextSteps(leadData, submissionStatus);

      return {
        success: fieldsCompleted > 0,
        formUrl: formAnalysis.url,
        fieldsCompleted,
        totalFields: formAnalysis.fields.length,
        submissionStatus,
        leadData,
        screenshots,
        nextSteps,
        estimatedValue: this.calculateLeadValue(leadData, formAnalysis.leadPotential)
      };

    } catch (error) {
      return {
        success: false,
        formUrl: formAnalysis.url,
        fieldsCompleted,
        totalFields: formAnalysis.fields.length,
        submissionStatus: 'failed',
        leadData,
        screenshots,
        nextSteps: ['Manual review required', 'Contact lead directly'],
        estimatedValue: 0
      };
    }
  }

  // Map lead data to form fields intelligently
  private getFieldValue(field: FormField, leadData: LeadProfile): string {
    const label = field.label.toLowerCase();
    const placeholder = field.placeholder?.toLowerCase() || '';
    
    // Company/Business name
    if (label.includes('company') || label.includes('business') || label.includes('organization')) {
      return leadData.businessName;
    }
    
    // Email
    if (label.includes('email') || field.type === 'email') {
      return leadData.email;
    }
    
    // Phone
    if (label.includes('phone') || field.type === 'tel') {
      return leadData.phone;
    }
    
    // Website
    if (label.includes('website') || label.includes('url')) {
      return leadData.website;
    }
    
    // Industry
    if (label.includes('industry') || label.includes('sector')) {
      return leadData.industry;
    }
    
    // Employee count
    if (label.includes('employee') || label.includes('staff') || label.includes('team size')) {
      return leadData.employeeCount;
    }
    
    // Budget/Revenue
    if (label.includes('budget') || label.includes('revenue') || label.includes('investment')) {
      return leadData.projectBudget;
    }
    
    // Timeline
    if (label.includes('timeline') || label.includes('deadline') || label.includes('when')) {
      return leadData.timeline;
    }
    
    // Address
    if (label.includes('address') || label.includes('location')) {
      return leadData.address;
    }
    
    // Pain points/needs
    if (label.includes('need') || label.includes('challenge') || label.includes('problem')) {
      return leadData.painPoints.join(', ');
    }
    
    // Default name field
    if (label.includes('name') && !label.includes('company')) {
      return 'John Smith'; // Generic contact name
    }
    
    return '';
  }

  // Generate intelligent next steps
  private async generateNextSteps(leadData: LeadProfile, status: string): Promise<string[]> {
    try {
      const prompt = `Generate follow-up steps for this lead:
      Business: ${leadData.businessName}
      Industry: ${leadData.industry}
      Status: ${status}
      Budget: ${leadData.projectBudget}
      
      Provide 3-5 specific next steps as JSON array.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Generate specific, actionable follow-up steps for B2B lead management." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.steps || ['Schedule follow-up call', 'Send proposal', 'Qualify budget'];
    } catch (error) {
      return [
        'Schedule discovery call within 24 hours',
        'Send automated follow-up email',
        'Research company background',
        'Prepare customized proposal'
      ];
    }
  }

  // Calculate estimated lead value
  private calculateLeadValue(leadData: LeadProfile, leadPotential: number): number {
    const budgetMultipliers: { [key: string]: number } = {
      'under-5k': 2500,
      '5k-15k': 10000,
      '15k-50k': 32500,
      '50k-100k': 75000,
      'over-100k': 150000
    };

    const industryMultipliers: { [key: string]: number } = {
      'technology': 1.5,
      'finance': 1.8,
      'healthcare': 1.6,
      'manufacturing': 1.4,
      'consulting': 1.2
    };

    const baseBudget = budgetMultipliers[leadData.projectBudget] || 15000;
    const industryMultiplier = industryMultipliers[leadData.industry.toLowerCase()] || 1.0;
    const potentialMultiplier = leadPotential / 100;

    return Math.round(baseBudget * industryMultiplier * potentialMultiplier);
  }

  // Batch process multiple forms
  async batchFillForms(urls: string[], targetIndustry?: string): Promise<FormFillResult[]> {
    const results: FormFillResult[] = [];

    for (const url of urls) {
      try {
        const formAnalysis = await this.analyzeForm(url);
        const leadData = await this.generateLeadData(formAnalysis, targetIndustry);
        const result = await this.fillForm(formAnalysis, leadData);
        results.push(result);
        
        // Wait between forms to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to process form at ${url}:`, error);
      }
    }

    return results;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export const intelligentFormAutomation = new IntelligentFormAutomation();