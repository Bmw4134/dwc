import puppeteer, { Browser, Page } from 'puppeteer';

export interface WebsiteIQ {
  url: string;
  businessType: string;
  currentRevenue: number;
  potentialRevenue: number;
  conversionRate: number;
  seoScore: number;
  performanceScore: number;
  designScore: number;
  contentQuality: number;
  technicalDebt: string[];
  growthOpportunities: string[];
  competitiveAdvantages: string[];
  actionableInsights: ActionableInsight[];
  aiRecommendations: string[];
  implementationPriority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ActionableInsight {
  category: 'conversion' | 'seo' | 'design' | 'content' | 'technical';
  issue: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  revenueImpact: number;
  timeToImplement: string;
  specificActions: string[];
}

export class LeadEnhancer {
  private browser: Browser | null = null;

  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async extractWebsiteIQ(url: string): Promise<WebsiteIQ> {
    await this.initializeBrowser();
    const page = await this.browser!.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Extract comprehensive website intelligence
      const websiteData = await page.evaluate(() => {
        const title = document.title || '';
        const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const h1Tags = Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()).filter(Boolean);
        const images = Array.from(document.querySelectorAll('img')).length;
        const links = Array.from(document.querySelectorAll('a')).length;
        const forms = Array.from(document.querySelectorAll('form')).length;
        const socialLinks = Array.from(document.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="linkedin"]')).length;
        
        // Business indicators
        const businessKeywords = ['photography', 'portrait', 'wedding', 'studio', 'gallery', 'portfolio'];
        const businessType = businessKeywords.find(keyword => 
          (title + metaDescription).toLowerCase().includes(keyword)
        ) || 'general';

        // Content analysis
        const textContent = document.body.textContent || '';
        const wordCount = textContent.split(/\s+/).length;
        
        // Call-to-action analysis
        const ctaKeywords = ['contact', 'book', 'hire', 'schedule', 'quote', 'portfolio'];
        const ctaElements = Array.from(document.querySelectorAll('button, a')).filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return ctaKeywords.some(keyword => text.includes(keyword));
        }).length;

        return {
          title,
          metaDescription,
          h1Tags,
          images,
          links,
          forms,
          socialLinks,
          businessType,
          wordCount,
          ctaElements,
          hasContactForm: forms > 0,
          hasSocialPresence: socialLinks > 0
        };
      });

      // Performance analysis
      const performanceMetrics = await this.analyzePerformance(page);
      
      // SEO analysis
      const seoAnalysis = await this.analyzeSEO(page, websiteData);
      
      // Design analysis
      const designAnalysis = await this.analyzeDesign(page);
      
      // Generate actionable insights
      const insights = this.generateActionableInsights(websiteData, performanceMetrics, seoAnalysis, designAnalysis);
      
      // Calculate scores and potential
      const scores = this.calculateScores(websiteData, performanceMetrics, seoAnalysis, designAnalysis);
      
      const websiteIQ: WebsiteIQ = {
        url,
        businessType: websiteData.businessType,
        currentRevenue: this.estimateCurrentRevenue(websiteData),
        potentialRevenue: scores.potentialRevenue,
        conversionRate: scores.conversionRate,
        seoScore: scores.seoScore,
        performanceScore: scores.performanceScore,
        designScore: scores.designScore,
        contentQuality: scores.contentQuality,
        technicalDebt: this.identifyTechnicalDebt(performanceMetrics),
        growthOpportunities: this.identifyGrowthOpportunities(insights),
        competitiveAdvantages: this.identifyCompetitiveAdvantages(websiteData),
        actionableInsights: insights,
        aiRecommendations: this.generateAIRecommendations(insights),
        implementationPriority: this.determinePriority(insights)
      };

      return websiteIQ;

    } catch (error) {
      console.error('Website IQ extraction error:', error);
      throw new Error(`Failed to analyze website: ${error}`);
    } finally {
      await page.close();
    }
  }

  private async analyzePerformance(page: Page): Promise<any> {
    const performanceMetrics = await page.evaluate(() => {
      const performance = window.performance;
      const timing = performance.timing;
      
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    return performanceMetrics;
  }

  private async analyzeSEO(page: Page, websiteData: any): Promise<any> {
    return {
      hasTitle: !!websiteData.title,
      titleLength: websiteData.title.length,
      hasMetaDescription: !!websiteData.metaDescription,
      metaDescriptionLength: websiteData.metaDescription.length,
      hasH1: websiteData.h1Tags.length > 0,
      h1Count: websiteData.h1Tags.length,
      imageOptimization: websiteData.images > 0 ? 0.7 : 1, // Simplified
      internalLinking: websiteData.links > 5 ? 0.8 : 0.4
    };
  }

  private async analyzeDesign(page: Page): Promise<any> {
    const designMetrics = await page.evaluate(() => {
      const hasResponsiveViewport = !!document.querySelector('meta[name="viewport"]');
      const colorScheme = getComputedStyle(document.body).backgroundColor;
      const fontFamilies = new Set();
      
      // Check common design elements
      const hasModernLayout = !!document.querySelector('.container, .wrapper, .grid, .flex');
      const hasHero = !!document.querySelector('.hero, .banner, .jumbotron, header');
      
      return {
        hasResponsiveViewport,
        hasModernLayout,
        hasHero,
        colorScheme,
        fontFamilies: Array.from(fontFamilies)
      };
    });

    return designMetrics;
  }

  private generateActionableInsights(websiteData: any, performance: any, seo: any, design: any): ActionableInsight[] {
    const insights: ActionableInsight[] = [];

    // Conversion optimization insights
    if (websiteData.ctaElements < 3) {
      insights.push({
        category: 'conversion',
        issue: 'Insufficient call-to-action elements',
        impact: 'high',
        effort: 'low',
        revenueImpact: 15000,
        timeToImplement: '1-2 days',
        specificActions: [
          'Add prominent "Book Session" button in header',
          'Create compelling portfolio CTA sections',
          'Implement contact form optimization'
        ]
      });
    }

    // SEO optimization insights
    if (!seo.hasMetaDescription || seo.metaDescriptionLength < 120) {
      insights.push({
        category: 'seo',
        issue: 'Missing or inadequate meta descriptions',
        impact: 'medium',
        effort: 'low',
        revenueImpact: 8000,
        timeToImplement: '4-6 hours',
        specificActions: [
          'Write compelling meta descriptions for all pages',
          'Include location-based keywords for local SEO',
          'Optimize for voice search queries'
        ]
      });
    }

    // Performance optimization insights
    if (performance.loadTime > 3000) {
      insights.push({
        category: 'technical',
        issue: 'Slow page load times affecting conversions',
        impact: 'critical',
        effort: 'medium',
        revenueImpact: 25000,
        timeToImplement: '1-2 weeks',
        specificActions: [
          'Optimize and compress images',
          'Implement lazy loading',
          'Minimize CSS and JavaScript files',
          'Use CDN for faster content delivery'
        ]
      });
    }

    // Design modernization insights
    if (!design.hasResponsiveViewport || !design.hasModernLayout) {
      insights.push({
        category: 'design',
        issue: 'Outdated design reducing credibility and conversions',
        impact: 'high',
        effort: 'high',
        revenueImpact: 35000,
        timeToImplement: '3-4 weeks',
        specificActions: [
          'Implement responsive design framework',
          'Modernize color scheme and typography',
          'Add professional portfolio gallery',
          'Create mobile-first user experience'
        ]
      });
    }

    // Content optimization insights
    if (websiteData.wordCount < 500) {
      insights.push({
        category: 'content',
        issue: 'Insufficient content for SEO and engagement',
        impact: 'medium',
        effort: 'medium',
        revenueImpact: 12000,
        timeToImplement: '1-2 weeks',
        specificActions: [
          'Create detailed service descriptions',
          'Add client testimonials and case studies',
          'Develop photography tips blog section',
          'Include detailed about page with photographer story'
        ]
      });
    }

    return insights;
  }

  private calculateScores(websiteData: any, performance: any, seo: any, design: any): any {
    // Performance score (0-100)
    const performanceScore = Math.max(0, 100 - (performance.loadTime / 100));
    
    // SEO score (0-100)
    let seoScore = 0;
    if (seo.hasTitle) seoScore += 20;
    if (seo.hasMetaDescription && seo.metaDescriptionLength > 120) seoScore += 25;
    if (seo.hasH1 && seo.h1Count === 1) seoScore += 20;
    if (seo.imageOptimization > 0.7) seoScore += 15;
    if (seo.internalLinking > 0.7) seoScore += 20;
    
    // Design score (0-100)
    let designScore = 0;
    if (design.hasResponsiveViewport) designScore += 30;
    if (design.hasModernLayout) designScore += 30;
    if (design.hasHero) designScore += 20;
    if (websiteData.images > 5) designScore += 20;
    
    // Content quality score (0-100)
    let contentQuality = 0;
    if (websiteData.wordCount > 300) contentQuality += 25;
    if (websiteData.wordCount > 800) contentQuality += 25;
    if (websiteData.hasSocialPresence) contentQuality += 20;
    if (websiteData.hasContactForm) contentQuality += 30;
    
    // Conversion rate estimation
    const conversionRate = Math.min(15, (seoScore + designScore + contentQuality) / 20);
    
    // Potential revenue calculation
    const baseRevenue = this.estimateCurrentRevenue(websiteData);
    const improvementMultiplier = 1 + ((100 - Math.min(performanceScore, seoScore, designScore)) / 100) * 3;
    const potentialRevenue = Math.round(baseRevenue * improvementMultiplier);
    
    return {
      performanceScore: Math.round(performanceScore),
      seoScore,
      designScore,
      contentQuality,
      conversionRate: Math.round(conversionRate * 100) / 100,
      potentialRevenue
    };
  }

  private estimateCurrentRevenue(websiteData: any): number {
    // Business type revenue estimates
    const revenueEstimates = {
      photography: 45000,
      wedding: 65000,
      portrait: 35000,
      commercial: 85000,
      general: 30000
    };
    
    const baseRevenue = revenueEstimates[websiteData.businessType as keyof typeof revenueEstimates] || 30000;
    
    // Adjust based on website maturity indicators
    let multiplier = 1;
    if (websiteData.hasSocialPresence) multiplier += 0.3;
    if (websiteData.hasContactForm) multiplier += 0.2;
    if (websiteData.wordCount > 800) multiplier += 0.2;
    if (websiteData.ctaElements > 2) multiplier += 0.3;
    
    return Math.round(baseRevenue * multiplier);
  }

  private identifyTechnicalDebt(performance: any): string[] {
    const debt: string[] = [];
    
    if (performance.loadTime > 3000) debt.push('Slow page load times');
    if (performance.firstContentfulPaint > 2500) debt.push('Poor perceived performance');
    
    return debt;
  }

  private identifyGrowthOpportunities(insights: ActionableInsight[]): string[] {
    return insights
      .filter(insight => insight.impact === 'high' || insight.impact === 'critical')
      .map(insight => insight.issue)
      .slice(0, 5);
  }

  private identifyCompetitiveAdvantages(websiteData: any): string[] {
    const advantages: string[] = [];
    
    if (websiteData.hasSocialPresence) advantages.push('Strong social media presence');
    if (websiteData.hasContactForm) advantages.push('Direct client contact capability');
    if (websiteData.images > 10) advantages.push('Rich visual portfolio');
    
    return advantages;
  }

  private generateAIRecommendations(insights: ActionableInsight[]): string[] {
    const recommendations: string[] = [];
    
    // Prioritize high-impact, low-effort improvements
    const quickWins = insights
      .filter(insight => insight.impact === 'high' && insight.effort === 'low')
      .slice(0, 3);
    
    quickWins.forEach(insight => {
      recommendations.push(`Immediate action: ${insight.specificActions[0]}`);
    });
    
    // Add strategic recommendations
    recommendations.push('Implement conversion tracking for data-driven optimization');
    recommendations.push('Create automated email sequences for lead nurturing');
    recommendations.push('Develop tiered service packages to increase average order value');
    
    return recommendations;
  }

  private determinePriority(insights: ActionableInsight[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalIssues = insights.filter(insight => insight.impact === 'critical').length;
    const highImpactIssues = insights.filter(insight => insight.impact === 'high').length;
    
    if (criticalIssues > 0) return 'critical';
    if (highImpactIssues > 2) return 'high';
    if (highImpactIssues > 0) return 'medium';
    return 'low';
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const leadEnhancer = new LeadEnhancer();