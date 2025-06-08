/**
 * Playwright Automation System for Internal Browser Tasks
 * Handles automated web scraping, testing, and monitoring
 */
import { chromium, Browser, Page } from 'playwright';
import { storage } from './storage';

export interface PlaywrightTask {
  id: string;
  name: string;
  description: string;
  script: string;
  schedule?: string;
  lastRun?: Date;
  status: 'idle' | 'running' | 'completed' | 'error';
  results?: any;
}

export class PlaywrightAutomationSystem {
  private browser: Browser | null = null;
  private activeTasks: Map<string, any> = new Map();

  async initialize() {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('Playwright automation system initialized');
    } catch (error) {
      console.error('Failed to initialize Playwright:', error);
    }
  }

  async executeTask(taskId: string): Promise<any> {
    if (!this.browser) {
      await this.initialize();
    }

    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    this.activeTasks.set(taskId, { status: 'running', startTime: new Date() });

    try {
      const context = await this.browser!.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
      const page = await context.newPage();
      
      let results;
      switch (taskId) {
        case 'lead-scraper':
          results = await this.executeLeadScraper(page);
          break;
        case 'social-monitor':
          results = await this.executeSocialMonitor(page);
          break;
        case 'competitor-analysis':
          results = await this.executeCompetitorAnalysis(page);
          break;
        case 'business-directory-scan':
          results = await this.executeBusinessDirectoryScan(page);
          break;
        default:
          throw new Error(`Unknown task: ${taskId}`);
      }

      await context.close();
      
      this.activeTasks.set(taskId, { 
        status: 'completed', 
        endTime: new Date(),
        results 
      });

      // Store results in AI insights
      await storage.createAiInsight({
        type: 'automation_result',
        title: `${task.name} Completed`,
        description: `Automation task completed successfully`,
        priority: 'medium',
        data: results
      });

      return results;
    } catch (error) {
      this.activeTasks.set(taskId, { 
        status: 'error', 
        endTime: new Date(),
        error: error.message 
      });
      throw error;
    }
  }

  private async executeLeadScraper(page: Page): Promise<any> {
    const leads = [];
    
    try {
      // Example: Scrape business directories for automation opportunities
      await page.goto('https://www.yellowpages.com/search?search_terms=accounting&geo_location_terms=Los+Angeles%2C+CA');
      await page.waitForLoadState('networkidle');

      const businesses = await page.$$eval('.result', (elements) => {
        return elements.slice(0, 10).map((el) => {
          const nameEl = el.querySelector('.business-name');
          const addressEl = el.querySelector('.adr');
          const phoneEl = el.querySelector('.phones');
          
          return {
            businessName: nameEl?.textContent?.trim() || '',
            address: addressEl?.textContent?.trim() || '',
            phoneNumber: phoneEl?.textContent?.trim() || '',
            industry: 'accounting',
            automationScore: Math.floor(Math.random() * 50) + 50,
            source: 'yellowpages_automation'
          };
        });
      });

      // Store leads in database
      for (const business of businesses) {
        if (business.businessName) {
          try {
            await storage.createLead({
              businessName: business.businessName,
              address: business.address,
              zipCode: business.address.match(/\d{5}/)?.[0] || '90210',
              industry: business.industry,
              phoneNumber: business.phoneNumber,
              automationScore: business.automationScore,
              priority: business.automationScore > 75 ? 'high' : 'medium',
              status: 'prospect',
              painPoints: ['manual_processes', 'time_consuming_tasks']
            });
            leads.push(business);
          } catch (error) {
            console.error('Error creating lead:', error);
          }
        }
      }

      return {
        taskType: 'lead-scraper',
        leadsFound: leads.length,
        leads: leads,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        taskType: 'lead-scraper',
        error: error.message,
        leadsFound: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeSocialMonitor(page: Page): Promise<any> {
    const insights = [];
    
    try {
      // Monitor LinkedIn for business automation discussions
      await page.goto('https://www.linkedin.com/search/results/content/?keywords=business%20automation&sortBy=relevance');
      await page.waitForTimeout(3000);

      const posts = await page.$$eval('.feed-shared-update-v2', (elements) => {
        return elements.slice(0, 5).map((el) => {
          const textEl = el.querySelector('.feed-shared-text');
          const authorEl = el.querySelector('.feed-shared-actor__name');
          
          return {
            author: authorEl?.textContent?.trim() || '',
            content: textEl?.textContent?.trim() || '',
            platform: 'linkedin',
            timestamp: new Date().toISOString()
          };
        });
      });

      for (const post of posts) {
        insights.push({
          type: 'social_insight',
          content: post.content,
          author: post.author,
          platform: post.platform,
          relevanceScore: Math.floor(Math.random() * 40) + 60
        });
      }

      return {
        taskType: 'social-monitor',
        insightsFound: insights.length,
        insights: insights,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        taskType: 'social-monitor',
        error: error.message,
        insightsFound: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeCompetitorAnalysis(page: Page): Promise<any> {
    const competitors = [
      'https://zapier.com',
      'https://monday.com',
      'https://asana.com'
    ];

    const analysis = [];

    for (const url of competitors) {
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle');

        const title = await page.title();
        const description = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content')).catch(() => '');
        
        const pricing = await page.$eval('a[href*="pricing"], a[href*="plans"]', (el) => el.textContent).catch(() => 'Not found');

        analysis.push({
          url,
          title,
          description,
          pricingInfo: pricing,
          analysisDate: new Date().toISOString()
        });
      } catch (error) {
        analysis.push({
          url,
          error: error.message,
          analysisDate: new Date().toISOString()
        });
      }
    }

    return {
      taskType: 'competitor-analysis',
      competitorsAnalyzed: analysis.length,
      analysis: analysis,
      timestamp: new Date().toISOString()
    };
  }

  private async executeBusinessDirectoryScan(page: Page): Promise<any> {
    const results = [];
    
    try {
      // Scan Yelp for businesses that could benefit from automation
      await page.goto('https://www.yelp.com/search?find_desc=restaurants&find_loc=Los+Angeles%2C+CA');
      await page.waitForLoadState('networkidle');

      const businesses = await page.$$eval('[data-testid="serp-ia-card"]', (elements) => {
        return elements.slice(0, 8).map((el) => {
          const nameEl = el.querySelector('h3 a');
          const addressEl = el.querySelector('[data-testid="address"]');
          const ratingEl = el.querySelector('[data-testid="rating"]');
          
          return {
            businessName: nameEl?.textContent?.trim() || '',
            address: addressEl?.textContent?.trim() || '',
            rating: ratingEl?.textContent?.trim() || '',
            industry: 'restaurant',
            automationOpportunity: 'inventory_management'
          };
        });
      });

      for (const business of businesses) {
        if (business.businessName) {
          results.push(business);
        }
      }

      return {
        taskType: 'business-directory-scan',
        businessesFound: results.length,
        businesses: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        taskType: 'business-directory-scan',
        error: error.message,
        businessesFound: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  getTaskById(taskId: string): PlaywrightTask | null {
    const tasks: Record<string, PlaywrightTask> = {
      'lead-scraper': {
        id: 'lead-scraper',
        name: 'Business Lead Scraper',
        description: 'Automated lead generation from business directories',
        script: 'executeLeadScraper',
        status: 'idle'
      },
      'social-monitor': {
        id: 'social-monitor',
        name: 'Social Media Monitor',
        description: 'Monitor social platforms for engagement opportunities',
        script: 'executeSocialMonitor',
        status: 'idle'
      },
      'competitor-analysis': {
        id: 'competitor-analysis',
        name: 'Competitor Analysis',
        description: 'Automated competitor website analysis',
        script: 'executeCompetitorAnalysis',
        status: 'idle'
      },
      'business-directory-scan': {
        id: 'business-directory-scan',
        name: 'Business Directory Scanner',
        description: 'Scan business directories for automation opportunities',
        script: 'executeBusinessDirectoryScan',
        status: 'idle'
      }
    };

    return tasks[taskId] || null;
  }

  getAllTasks(): PlaywrightTask[] {
    return [
      this.getTaskById('lead-scraper')!,
      this.getTaskById('social-monitor')!,
      this.getTaskById('competitor-analysis')!,
      this.getTaskById('business-directory-scan')!
    ];
  }

  getTaskStatus(taskId: string): any {
    return this.activeTasks.get(taskId) || { status: 'idle' };
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const playwrightAutomation = new PlaywrightAutomationSystem();