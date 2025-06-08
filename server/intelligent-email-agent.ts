import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface EmailMessage {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  body: string;
  timestamp: Date;
  attachments: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'business' | 'personal' | 'spam' | 'phishing' | 'promotional' | 'system';
  sentiment: 'positive' | 'neutral' | 'negative';
  actionRequired: boolean;
  confidenceScore: number;
}

interface SecurityAnalysis {
  isPhishing: boolean;
  isSpam: boolean;
  isSafe: boolean;
  riskScore: number;
  threats: string[];
  recommendations: string[];
  confidenceLevel: number;
}

interface ActionableInsight {
  priority: 'immediate' | 'today' | 'this_week' | 'low_priority';
  actionType: 'respond' | 'schedule_meeting' | 'follow_up' | 'delegate' | 'archive' | 'escalate';
  suggestedResponse?: string;
  deadline?: Date;
  context: string;
  businessImpact: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

interface EmailProvider {
  name: string;
  imapServer: string;
  imapPort: number;
  smtpServer: string;
  smtpPort: number;
  security: 'SSL' | 'TLS' | 'STARTTLS';
}

interface EmailAccount {
  email: string;
  password: string;
  provider: EmailProvider;
  displayName: string;
  department: string;
}

export class IntelligentEmailAgent {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private connectedAccounts: EmailAccount[] = [];
  private processingQueue: EmailMessage[] = [];

  // Known phishing and spam indicators
  private securityPatterns = {
    phishingKeywords: [
      'urgent action required',
      'verify your account',
      'suspended account',
      'click here immediately',
      'limited time offer',
      'confirm your identity',
      'security alert',
      'unauthorized access',
      'update payment information',
      'claim your prize'
    ],
    suspiciousDomains: [
      'secure-bank-update.com',
      'paypal-security.net',
      'amazon-verification.org',
      'microsoft-support.info',
      'google-security.biz'
    ],
    spamIndicators: [
      'make money fast',
      'guaranteed income',
      'weight loss miracle',
      'free trial',
      'act now',
      'limited time',
      'no obligation',
      'risk free'
    ]
  };

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1400, height: 900 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  }

  // Connect to email account and fetch messages
  async connectEmailAccount(account: EmailAccount): Promise<boolean> {
    try {
      // Add to connected accounts
      this.connectedAccounts.push(account);
      
      // Access webmail interface for comprehensive email processing
      await this.accessWebmail(account);
      
      console.log(`Successfully connected to ${account.email}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${account.email}:`, error);
      return false;
    }
  }

  // Access webmail through browser automation
  private async accessWebmail(account: EmailAccount): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');

    let webmailUrl = '';
    
    // Determine webmail URL based on provider
    if (account.provider.name === 'Google Workspace' || account.email.includes('@gmail.com')) {
      webmailUrl = 'https://mail.google.com';
    } else if (account.provider.name === 'Microsoft 365' || account.email.includes('@outlook.com')) {
      webmailUrl = 'https://outlook.office.com';
    } else {
      // Generic webmail access
      webmailUrl = `https://mail.${account.email.split('@')[1]}`;
    }

    await this.page.goto(webmailUrl, { waitUntil: 'networkidle2' });
    
    // Handle login process
    await this.performLogin(account);
    
    // Navigate to inbox
    await this.navigateToInbox();
  }

  // Perform automated login
  private async performLogin(account: EmailAccount): Promise<void> {
    if (!this.page) return;

    try {
      // Gmail login
      if (account.email.includes('@gmail.com')) {
        await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await this.page.type('input[type="email"]', account.email);
        await this.page.click('#identifierNext');
        
        await this.page.waitForSelector('input[type="password"]', { timeout: 10000 });
        await this.page.type('input[type="password"]', account.password);
        await this.page.click('#passwordNext');
      }
      // Outlook login
      else if (account.email.includes('@outlook.com')) {
        await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await this.page.type('input[type="email"]', account.email);
        await this.page.click('input[type="submit"]');
        
        await this.page.waitForSelector('input[type="password"]', { timeout: 10000 });
        await this.page.type('input[type="password"]', account.password);
        await this.page.click('input[type="submit"]');
      }
      
      // Wait for successful login
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(`Failed to login to ${account.email}`);
    }
  }

  // Navigate to inbox
  private async navigateToInbox(): Promise<void> {
    if (!this.page) return;

    try {
      // Wait for inbox to load
      await this.page.waitForSelector('[role="main"], .gmail-inbox, .inbox', { timeout: 15000 });
      
      // Additional wait for email list to populate
      await this.page.waitForTimeout(3000);
    } catch (error) {
      console.error('Failed to navigate to inbox:', error);
    }
  }

  // Fetch and process emails from all connected accounts
  async processAllEmails(): Promise<{
    processed: number;
    actionable: number;
    threats: number;
    insights: ActionableInsight[];
  }> {
    let totalProcessed = 0;
    let totalActionable = 0;
    let totalThreats = 0;
    const allInsights: ActionableInsight[] = [];

    for (const account of this.connectedAccounts) {
      try {
        console.log(`Processing emails for ${account.email}...`);
        
        const emails = await this.fetchEmailsFromAccount(account);
        const processedEmails = await this.analyzeEmails(emails);
        
        totalProcessed += processedEmails.length;
        
        for (const email of processedEmails) {
          if (email.actionRequired) totalActionable++;
          if (email.category === 'phishing' || email.category === 'spam') totalThreats++;
          
          const insight = await this.generateActionableInsight(email);
          if (insight) allInsights.push(insight);
        }
        
      } catch (error) {
        console.error(`Error processing emails for ${account.email}:`, error);
      }
    }

    // Sort insights by priority and business impact
    allInsights.sort((a, b) => {
      const priorityOrder = { immediate: 0, today: 1, this_week: 2, low_priority: 3 };
      const impactOrder = { high: 0, medium: 1, low: 2 };
      
      return priorityOrder[a.priority] - priorityOrder[b.priority] ||
             impactOrder[a.businessImpact] - impactOrder[b.businessImpact];
    });

    return {
      processed: totalProcessed,
      actionable: totalActionable,
      threats: totalThreats,
      insights: allInsights.slice(0, 20) // Return top 20 insights
    };
  }

  // Fetch emails from specific account
  private async fetchEmailsFromAccount(account: EmailAccount): Promise<EmailMessage[]> {
    if (!this.page) return [];

    try {
      // Access the account's webmail
      await this.accessWebmail(account);
      
      // Extract email data from the page
      const emailData = await this.page.evaluate(() => {
        const emails: any[] = [];
        
        // Gmail selector patterns
        const gmailRows = document.querySelectorAll('[role="main"] tr, .zA');
        gmailRows.forEach((row, index) => {
          if (index > 50) return; // Limit to recent 50 emails
          
          const senderElement = row.querySelector('[email], .go span[title]');
          const subjectElement = row.querySelector('[role="link"] span, .bog');
          const timeElement = row.querySelector('.xY span, .xW span');
          
          if (senderElement && subjectElement) {
            emails.push({
              id: `email-${index}`,
              sender: senderElement.textContent?.trim() || '',
              senderEmail: senderElement.getAttribute('email') || '',
              subject: subjectElement.textContent?.trim() || '',
              timestamp: timeElement?.textContent?.trim() || '',
              body: '' // Will be fetched when opening email
            });
          }
        });
        
        // Outlook selector patterns
        const outlookRows = document.querySelectorAll('[role="listitem"], .customScrollBar tr');
        outlookRows.forEach((row, index) => {
          if (index > 50) return;
          
          const senderElement = row.querySelector('.sender, [title*="@"]');
          const subjectElement = row.querySelector('.subject, .ms-font-weight-semibold');
          const timeElement = row.querySelector('.time, .ms-font-xs');
          
          if (senderElement && subjectElement) {
            emails.push({
              id: `email-${index}`,
              sender: senderElement.textContent?.trim() || '',
              senderEmail: senderElement.getAttribute('title') || '',
              subject: subjectElement.textContent?.trim() || '',
              timestamp: timeElement?.textContent?.trim() || '',
              body: ''
            });
          }
        });
        
        return emails;
      });

      // Process and structure the email data
      return emailData.map(email => ({
        id: email.id,
        subject: email.subject,
        sender: email.sender,
        senderEmail: email.senderEmail,
        body: email.body,
        timestamp: new Date(),
        attachments: [],
        priority: 'medium' as const,
        category: 'business' as const,
        sentiment: 'neutral' as const,
        actionRequired: false,
        confidenceScore: 0.5
      }));
      
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }

  // Analyze emails using AI for categorization and security
  private async analyzeEmails(emails: EmailMessage[]): Promise<EmailMessage[]> {
    const analyzedEmails: EmailMessage[] = [];

    for (const email of emails) {
      try {
        // Security analysis first
        const securityAnalysis = await this.performSecurityAnalysis(email);
        
        if (securityAnalysis.isPhishing) {
          email.category = 'phishing';
          email.priority = 'urgent';
          email.actionRequired = false; // Don't act on phishing
          email.confidenceScore = securityAnalysis.confidenceLevel;
          analyzedEmails.push(email);
          continue;
        }

        if (securityAnalysis.isSpam) {
          email.category = 'spam';
          email.priority = 'low';
          email.actionRequired = false;
          email.confidenceScore = securityAnalysis.confidenceLevel;
          analyzedEmails.push(email);
          continue;
        }

        // AI-powered analysis for legitimate emails
        const analysis = await this.performAIAnalysis(email);
        email.priority = analysis.priority;
        email.category = analysis.category;
        email.sentiment = analysis.sentiment;
        email.actionRequired = analysis.actionRequired;
        email.confidenceScore = analysis.confidenceScore;
        
        analyzedEmails.push(email);
        
      } catch (error) {
        console.error('Error analyzing email:', error);
        analyzedEmails.push(email); // Add with default values
      }
    }

    return analyzedEmails;
  }

  // Perform security analysis to detect phishing and spam
  private async performSecurityAnalysis(email: EmailMessage): Promise<SecurityAnalysis> {
    const threats: string[] = [];
    let riskScore = 0;

    // Check for phishing indicators
    const emailText = `${email.subject} ${email.body}`.toLowerCase();
    
    for (const keyword of this.securityPatterns.phishingKeywords) {
      if (emailText.includes(keyword.toLowerCase())) {
        threats.push(`Phishing keyword detected: "${keyword}"`);
        riskScore += 20;
      }
    }

    // Check sender domain
    const senderDomain = email.senderEmail.split('@')[1]?.toLowerCase();
    if (senderDomain && this.securityPatterns.suspiciousDomains.includes(senderDomain)) {
      threats.push(`Suspicious sender domain: ${senderDomain}`);
      riskScore += 30;
    }

    // Check for spam indicators
    for (const indicator of this.securityPatterns.spamIndicators) {
      if (emailText.includes(indicator.toLowerCase())) {
        threats.push(`Spam indicator: "${indicator}"`);
        riskScore += 10;
      }
    }

    // Use Claude for advanced security analysis
    try {
      const securityPrompt = `Analyze this email for security threats:
      
      Subject: ${email.subject}
      Sender: ${email.senderEmail}
      Content: ${email.body.substring(0, 1000)}
      
      Evaluate for:
      1. Phishing attempts
      2. Malicious links
      3. Social engineering
      4. Impersonation
      5. Suspicious attachments
      
      Return JSON with: isPhishing, isSpam, riskScore (0-100), threats array.`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          { role: 'user', content: securityPrompt }
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const aiAnalysis = JSON.parse(content.text);
        riskScore = Math.max(riskScore, aiAnalysis.riskScore || 0);
        threats.push(...(aiAnalysis.threats || []));
      }
    } catch (error) {
      console.error('AI security analysis failed:', error);
    }

    const isPhishing = riskScore >= 60;
    const isSpam = riskScore >= 30 && riskScore < 60;
    const isSafe = riskScore < 30;

    return {
      isPhishing,
      isSpam,
      isSafe,
      riskScore,
      threats,
      recommendations: this.generateSecurityRecommendations(threats, riskScore),
      confidenceLevel: Math.min(0.95, riskScore / 100 + 0.5)
    };
  }

  // Perform AI analysis for legitimate emails
  private async performAIAnalysis(email: EmailMessage): Promise<{
    priority: EmailMessage['priority'];
    category: EmailMessage['category'];
    sentiment: EmailMessage['sentiment'];
    actionRequired: boolean;
    confidenceScore: number;
  }> {
    try {
      const analysisPrompt = `Analyze this business email for priority and action requirements:

      Subject: ${email.subject}
      Sender: ${email.senderEmail}
      Content: ${email.body.substring(0, 1500)}
      
      Determine:
      1. Priority level (low, medium, high, urgent)
      2. Category (business, personal, promotional, system)
      3. Sentiment (positive, neutral, negative)
      4. Whether action is required
      5. Confidence score (0-1)
      
      Consider:
      - Time-sensitive keywords
      - Business impact
      - Sender importance
      - Call-to-action phrases
      - Meeting requests
      - Deadlines
      
      Return JSON format only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an expert email analysis assistant. Analyze emails for business priority and required actions." },
          { role: "user", content: analysisPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        priority: analysis.priority || 'medium',
        category: analysis.category || 'business',
        sentiment: analysis.sentiment || 'neutral',
        actionRequired: analysis.actionRequired || false,
        confidenceScore: analysis.confidenceScore || 0.7
      };
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        priority: 'medium',
        category: 'business',
        sentiment: 'neutral',
        actionRequired: false,
        confidenceScore: 0.5
      };
    }
  }

  // Generate actionable insights from analyzed emails
  private async generateActionableInsight(email: EmailMessage): Promise<ActionableInsight | null> {
    if (!email.actionRequired || email.category === 'phishing' || email.category === 'spam') {
      return null;
    }

    try {
      const insightPrompt = `Generate actionable business insight for this email:

      Subject: ${email.subject}
      Sender: ${email.senderEmail}
      Priority: ${email.priority}
      Category: ${email.category}
      Content: ${email.body.substring(0, 1000)}
      
      Generate:
      1. Specific action type (respond, schedule_meeting, follow_up, delegate, escalate)
      2. Priority timeline (immediate, today, this_week, low_priority)
      3. Business impact (high, medium, low)
      4. Estimated time to complete
      5. Context explanation
      6. Suggested response (if applicable)
      7. Deadline (if any)
      
      Return JSON format.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a business efficiency expert. Generate specific, actionable insights from emails." },
          { role: "user", content: insightPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400
      });

      const insight = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        priority: insight.priority || 'today',
        actionType: insight.actionType || 'respond',
        suggestedResponse: insight.suggestedResponse,
        deadline: insight.deadline ? new Date(insight.deadline) : undefined,
        context: insight.context || email.subject,
        businessImpact: insight.businessImpact || 'medium',
        estimatedTime: insight.estimatedTime || '15 minutes'
      };
      
    } catch (error) {
      console.error('Failed to generate insight:', error);
      return null;
    }
  }

  // Generate security recommendations
  private generateSecurityRecommendations(threats: string[], riskScore: number): string[] {
    const recommendations: string[] = [];
    
    if (riskScore >= 60) {
      recommendations.push('DO NOT CLICK any links or download attachments');
      recommendations.push('Mark as phishing and report to IT security');
      recommendations.push('Delete immediately after reporting');
    } else if (riskScore >= 30) {
      recommendations.push('Mark as spam and move to junk folder');
      recommendations.push('Do not respond or engage with content');
      recommendations.push('Block sender if persistent');
    } else {
      recommendations.push('Email appears safe for processing');
      recommendations.push('Continue with normal business workflow');
    }
    
    return recommendations;
  }

  // Get summary of email processing results
  async getProcessingSummary(): Promise<{
    totalAccounts: number;
    lastProcessed: Date;
    threatsBlocked: number;
    actionableItems: number;
    upcomingDeadlines: ActionableInsight[];
  }> {
    const now = new Date();
    const upcomingDeadlines = this.processingQueue
      .map(email => this.generateActionableInsight(email))
      .filter(insight => insight && insight.deadline && insight.deadline > now)
      .sort((a, b) => (a?.deadline?.getTime() || 0) - (b?.deadline?.getTime() || 0))
      .slice(0, 5) as ActionableInsight[];

    return {
      totalAccounts: this.connectedAccounts.length,
      lastProcessed: new Date(),
      threatsBlocked: this.processingQueue.filter(e => e.category === 'phishing' || e.category === 'spam').length,
      actionableItems: this.processingQueue.filter(e => e.actionRequired).length,
      upcomingDeadlines
    };
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

export const intelligentEmailAgent = new IntelligentEmailAgent();