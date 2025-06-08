import puppeteer, { Browser, Page } from 'puppeteer';

interface KateStressTestMetrics {
  testId: string;
  timestamp: Date;
  route: string;
  responseTime: number;
  memoryUsage: number;
  networkRequests: number;
  formSubmissions: number;
  mobileResponsiveness: boolean;
  themeTransitions: number;
  leadCaptureSuccess: boolean;
  adminWidgetDrag: boolean;
  criticalErrors: string[];
  performanceScore: number;
}

interface StressTestConfig {
  simultaneousUsers: number;
  testDuration: number; // minutes
  actionsPerUser: number;
  routes: string[];
  mobileUserPercentage: number;
}

export class KateAutomationStressTester {
  private browsers: Browser[] = [];
  private baseUrl: string;
  private testResults: KateStressTestMetrics[] = [];
  private isRunning: boolean = false;
  private startTime: Date = new Date();

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async initializeStressTest(): Promise<void> {
    console.log('🚀 Initializing Kate Photography Automation Stress Test...');
    
    // Launch multiple browser instances for concurrent testing
    for (let i = 0; i < 5; i++) {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      this.browsers.push(browser);
    }
    
    console.log(`✅ Launched ${this.browsers.length} browser instances`);
  }

  async runComprehensiveStressTest(): Promise<{
    totalTests: number;
    successRate: number;
    avgResponseTime: number;
    criticalIssues: string[];
    performanceReport: KateStressTestMetrics[];
  }> {
    this.isRunning = true;
    this.startTime = new Date();
    
    const config: StressTestConfig = {
      simultaneousUsers: 25,
      testDuration: 10, // 10 minutes intensive testing
      actionsPerUser: 50,
      routes: [
        '/',
        '/kate-photography', 
        '/kate-mobile',
        '/quantum-intelligence',
        '/qq-pipeline',
        '/client-reports'
      ],
      mobileUserPercentage: 40
    };

    console.log('🎯 Starting intensive stress test with configuration:', config);

    const testPromises: Promise<KateStressTestMetrics[]>[] = [];

    // Launch concurrent user simulations
    for (let userId = 0; userId < config.simultaneousUsers; userId++) {
      const browser = this.browsers[userId % this.browsers.length];
      const isMobileUser = Math.random() < (config.mobileUserPercentage / 100);
      
      testPromises.push(
        this.simulateUserSession(browser, userId, config, isMobileUser)
      );
    }

    // Wait for all tests to complete
    console.log(`⏳ Running ${config.simultaneousUsers} concurrent user sessions...`);
    const allResults = await Promise.all(testPromises);
    
    // Flatten results
    this.testResults = allResults.flat();
    
    // Generate comprehensive report
    return this.generateStressTestReport();
  }

  private async simulateUserSession(
    browser: Browser, 
    userId: number, 
    config: StressTestConfig,
    isMobile: boolean
  ): Promise<KateStressTestMetrics[]> {
    const page = await browser.newPage();
    const sessionResults: KateStressTestMetrics[] = [];
    
    try {
      // Set mobile viewport if mobile user
      if (isMobile) {
        await page.setViewport({ width: 375, height: 667 });
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15');
      } else {
        await page.setViewport({ width: 1920, height: 1080 });
      }

      // Monitor network requests
      let networkRequestCount = 0;
      page.on('request', () => networkRequestCount++);

      // Test each route with realistic user behavior
      for (let action = 0; action < config.actionsPerUser; action++) {
        if (!this.isRunning) break;

        const route = config.routes[Math.floor(Math.random() * config.routes.length)];
        const startTime = Date.now();

        try {
          // Navigate to route
          await page.goto(`${this.baseUrl}${route}`, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
          });

          // Perform route-specific actions
          const metrics = await this.performRouteActions(page, route, userId, isMobile);
          
          const responseTime = Date.now() - startTime;
          
          sessionResults.push({
            testId: `user_${userId}_action_${action}`,
            timestamp: new Date(),
            route,
            responseTime,
            memoryUsage: await this.getMemoryUsage(page),
            networkRequests: networkRequestCount,
            formSubmissions: metrics.formSubmissions,
            mobileResponsiveness: metrics.mobileResponsiveness,
            themeTransitions: metrics.themeTransitions,
            leadCaptureSuccess: metrics.leadCaptureSuccess,
            adminWidgetDrag: metrics.adminWidgetDrag,
            criticalErrors: metrics.criticalErrors,
            performanceScore: this.calculatePerformanceScore(responseTime, metrics)
          });

          // Random delay between actions (human-like behavior)
          await page.waitForTimeout(Math.random() * 3000 + 1000);

        } catch (error) {
          sessionResults.push({
            testId: `user_${userId}_action_${action}`,
            timestamp: new Date(),
            route,
            responseTime: 30000,
            memoryUsage: 0,
            networkRequests: networkRequestCount,
            formSubmissions: 0,
            mobileResponsiveness: false,
            themeTransitions: 0,
            leadCaptureSuccess: false,
            adminWidgetDrag: false,
            criticalErrors: [`Navigation failed: ${error.message}`],
            performanceScore: 0
          });
        }
      }

    } catch (error) {
      console.error(`❌ User session ${userId} failed:`, error);
    } finally {
      await page.close();
    }

    return sessionResults;
  }

  private async performRouteActions(
    page: Page, 
    route: string, 
    userId: number,
    isMobile: boolean
  ): Promise<{
    formSubmissions: number;
    mobileResponsiveness: boolean;
    themeTransitions: number;
    leadCaptureSuccess: boolean;
    adminWidgetDrag: boolean;
    criticalErrors: string[];
  }> {
    const metrics = {
      formSubmissions: 0,
      mobileResponsiveness: true,
      themeTransitions: 0,
      leadCaptureSuccess: false,
      adminWidgetDrag: false,
      criticalErrors: []
    };

    try {
      // Wait for page to be fully loaded
      await page.waitForSelector('body', { timeout: 10000 });

      // Test admin widget dragging
      try {
        const adminWidget = await page.$('[data-testid="admin-widget"]');
        if (adminWidget) {
          await page.evaluate(() => {
            const widget = document.querySelector('[data-testid="admin-widget"]') as HTMLElement;
            if (widget) {
              const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
              widget.dispatchEvent(mousedownEvent);
              
              setTimeout(() => {
                const mousemoveEvent = new MouseEvent('mousemove', { 
                  bubbles: true, 
                  clientX: 300, 
                  clientY: 200 
                });
                document.dispatchEvent(mousemoveEvent);
                
                setTimeout(() => {
                  const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
                  document.dispatchEvent(mouseupEvent);
                }, 100);
              }, 100);
            }
          });
          metrics.adminWidgetDrag = true;
        }
      } catch (error) {
        metrics.criticalErrors.push(`Admin widget drag failed: ${error.message}`);
      }

      // Route-specific testing
      switch (route) {
        case '/kate-photography':
        case '/kate-mobile':
          await this.testKatePhotographyFeatures(page, metrics, isMobile);
          break;
        case '/quantum-intelligence':
          await this.testIntelligenceDashboard(page, metrics);
          break;
        case '/qq-pipeline':
          await this.testQQPipeline(page, metrics);
          break;
        default:
          await this.testGeneralFeatures(page, metrics);
      }

      // Test theme switching
      try {
        const themeButton = await page.$('button[aria-label*="theme"], button[data-testid*="theme"]');
        if (themeButton) {
          await themeButton.click();
          await page.waitForTimeout(500);
          metrics.themeTransitions++;
        }
      } catch (error) {
        metrics.criticalErrors.push(`Theme switching failed: ${error.message}`);
      }

      // Test mobile responsiveness
      if (isMobile) {
        const viewport = page.viewport();
        if (viewport && viewport.width <= 768) {
          const mobileElements = await page.$$('[class*="mobile"], [class*="sm:"], [class*="md:"]');
          metrics.mobileResponsiveness = mobileElements.length > 0;
        }
      }

    } catch (error) {
      metrics.criticalErrors.push(`Route action failed: ${error.message}`);
    }

    return metrics;
  }

  private async testKatePhotographyFeatures(page: Page, metrics: any, isMobile: boolean): Promise<void> {
    try {
      // Test lead capture form
      const nameInput = await page.$('input[name="clientName"], input[placeholder*="name" i]');
      const emailInput = await page.$('input[name="email"], input[type="email"]');
      const phoneInput = await page.$('input[name="phone"], input[type="tel"]');

      if (nameInput && emailInput) {
        await nameInput.type(`Test User ${Date.now()}`);
        await emailInput.type(`test${Date.now()}@example.com`);
        if (phoneInput) {
          await phoneInput.type('555-123-4567');
        }

        // Fill additional form fields
        const eventTypeSelect = await page.$('select[name="eventType"], [data-testid="event-type"]');
        if (eventTypeSelect) {
          await page.select('select[name="eventType"]', 'wedding');
        }

        const submitButton = await page.$('button[type="submit"], button[data-testid="submit"]');
        if (submitButton) {
          await submitButton.click();
          metrics.formSubmissions++;
          
          // Wait for success indication
          await page.waitForTimeout(2000);
          const successMessage = await page.$('[data-testid="success"], .success, [class*="success"]');
          metrics.leadCaptureSuccess = !!successMessage;
        }
      }

      // Test website links
      const websiteLinks = await page.$$('a[href*="blissfulmemories"], a[href*="katewhitephotography"]');
      if (websiteLinks.length > 0) {
        // Test first link (don't navigate away)
        const href = await page.evaluate(el => el.getAttribute('href'), websiteLinks[0]);
        if (href && (href.includes('blissfulmemories') || href.includes('katewhitephotography'))) {
          // Link exists and has correct URL
        }
      }

    } catch (error) {
      metrics.criticalErrors.push(`Kate photography test failed: ${error.message}`);
    }
  }

  private async testIntelligenceDashboard(page: Page, metrics: any): Promise<void> {
    try {
      // Test dashboard loading
      await page.waitForSelector('[data-testid="dashboard"], .dashboard, [class*="dashboard"]', { timeout: 5000 });
      
      // Test interactive elements
      const buttons = await page.$$('button');
      if (buttons.length > 0) {
        await buttons[0].click();
        await page.waitForTimeout(1000);
      }

    } catch (error) {
      metrics.criticalErrors.push(`Intelligence dashboard test failed: ${error.message}`);
    }
  }

  private async testQQPipeline(page: Page, metrics: any): Promise<void> {
    try {
      // Test pipeline interface
      await page.waitForSelector('body', { timeout: 5000 });
      
      // Look for pipeline-specific elements
      const pipelineElements = await page.$$('[data-testid*="pipeline"], [class*="pipeline"]');
      
    } catch (error) {
      metrics.criticalErrors.push(`QQ Pipeline test failed: ${error.message}`);
    }
  }

  private async testGeneralFeatures(page: Page, metrics: any): Promise<void> {
    try {
      // Test navigation
      const navLinks = await page.$$('nav a, [role="navigation"] a');
      if (navLinks.length > 0 && Math.random() < 0.3) {
        await navLinks[Math.floor(Math.random() * navLinks.length)].click();
        await page.waitForTimeout(1000);
      }

    } catch (error) {
      metrics.criticalErrors.push(`General features test failed: ${error.message}`);
    }
  }

  private async getMemoryUsage(page: Page): Promise<number> {
    try {
      const metrics = await page.metrics();
      return metrics.JSHeapUsedSize || 0;
    } catch {
      return 0;
    }
  }

  private calculatePerformanceScore(responseTime: number, metrics: any): number {
    let score = 100;
    
    // Penalize slow response times
    if (responseTime > 5000) score -= 30;
    else if (responseTime > 3000) score -= 20;
    else if (responseTime > 1000) score -= 10;
    
    // Penalize critical errors
    score -= metrics.criticalErrors.length * 15;
    
    // Bonus for successful actions
    if (metrics.leadCaptureSuccess) score += 10;
    if (metrics.adminWidgetDrag) score += 5;
    if (metrics.themeTransitions > 0) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private generateStressTestReport(): {
    totalTests: number;
    successRate: number;
    avgResponseTime: number;
    criticalIssues: string[];
    performanceReport: KateStressTestMetrics[];
  } {
    const totalTests = this.testResults.length;
    const successfulTests = this.testResults.filter(r => r.performanceScore > 50).length;
    const avgResponseTime = this.testResults.reduce((sum, r) => sum + r.responseTime, 0) / totalTests;
    
    const allErrors = this.testResults.flatMap(r => r.criticalErrors);
    const criticalIssues = [...new Set(allErrors)];

    console.log('\n📊 KATE AUTOMATION STRESS TEST RESULTS');
    console.log('=====================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Success Rate: ${((successfulTests / totalTests) * 100).toFixed(2)}%`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Critical Issues Found: ${criticalIssues.length}`);
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues:');
      criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    // Performance breakdown by route
    console.log('\n📈 Performance by Route:');
    const routeStats = this.analyzeRoutePerformance();
    Object.entries(routeStats).forEach(([route, stats]) => {
      console.log(`${route}: ${stats.avgScore.toFixed(1)}/100 (${stats.tests} tests)`);
    });

    return {
      totalTests,
      successRate: (successfulTests / totalTests) * 100,
      avgResponseTime,
      criticalIssues,
      performanceReport: this.testResults
    };
  }

  private analyzeRoutePerformance(): Record<string, { avgScore: number; tests: number }> {
    const routeStats: Record<string, { scores: number[]; tests: number }> = {};
    
    this.testResults.forEach(result => {
      if (!routeStats[result.route]) {
        routeStats[result.route] = { scores: [], tests: 0 };
      }
      routeStats[result.route].scores.push(result.performanceScore);
      routeStats[result.route].tests++;
    });

    const finalStats: Record<string, { avgScore: number; tests: number }> = {};
    Object.entries(routeStats).forEach(([route, data]) => {
      finalStats[route] = {
        avgScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
        tests: data.tests
      };
    });

    return finalStats;
  }

  async cleanup(): Promise<void> {
    this.isRunning = false;
    console.log('🧹 Cleaning up stress test resources...');
    
    for (const browser of this.browsers) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
    
    this.browsers = [];
    console.log('✅ Stress test cleanup completed');
  }
}

// Export singleton instance
export const kateStressTester = new KateAutomationStressTester();