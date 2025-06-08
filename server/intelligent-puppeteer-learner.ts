import puppeteer, { Browser, Page } from 'puppeteer';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface UserInteraction {
  timestamp: Date;
  route: string;
  action: string;
  selector?: string;
  value?: string;
  coordinates?: { x: number; y: number };
  elementType?: string;
  success: boolean;
  errorMessage?: string;
  screenshot?: string;
}

export interface LearnedPattern {
  patternId: string;
  triggerConditions: string[];
  expectedElements: string[];
  fixActions: FixAction[];
  confidence: number;
  successRate: number;
  lastUsed: Date;
}

export interface FixAction {
  type: 'click' | 'wait' | 'reload' | 'navigate' | 'inject_css' | 'inject_js';
  selector?: string;
  code?: string;
  delay?: number;
  url?: string;
}

export interface ScreenHealth {
  route: string;
  isHealthy: boolean;
  issues: ScreenIssue[];
  performanceScore: number;
  accessibilityScore: number;
  lastChecked: Date;
  autoFixApplied: boolean;
}

export interface ScreenIssue {
  type: 'loading_error' | 'missing_element' | 'layout_broken' | 'js_error' | 'performance_slow';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  selector?: string;
  suggestedFix?: FixAction;
}

export class IntelligentPuppeteerLearner {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl: string;
  private interactions: UserInteraction[] = [];
  private learnedPatterns: LearnedPattern[] = [];
  private screenHealthMap: Map<string, ScreenHealth> = new Map();
  private isLearning: boolean = false;
  private learningSession: string = '';

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.loadLearnedPatterns();
  }

  // Initialize browser for learning mode
  async initializeLearningMode(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    this.learningSession = `learning_${Date.now()}`;
    this.isLearning = true;

    // Set up event listeners to capture user interactions
    await this.setupInteractionListeners();
    
    console.log(`🧠 Intelligent Puppeteer Learning Mode Activated - Session: ${this.learningSession}`);
  }

  // Set up listeners to capture all user interactions
  private async setupInteractionListeners(): Promise<void> {
    if (!this.page) return;

    // Monitor page navigation
    this.page.on('framenavigated', async (frame) => {
      if (frame === this.page!.mainFrame()) {
        const url = frame.url();
        const route = new URL(url).pathname;
        
        await this.recordInteraction({
          timestamp: new Date(),
          route,
          action: 'navigation',
          success: true
        });

        // Automatically check screen health after navigation
        setTimeout(() => this.checkScreenHealth(route), 2000);
      }
    });

    // Monitor console errors
    this.page.on('console', async (msg) => {
      if (msg.type() === 'error') {
        const route = new URL(this.page!.url()).pathname;
        await this.recordInteraction({
          timestamp: new Date(),
          route,
          action: 'console_error',
          success: false,
          errorMessage: msg.text()
        });
      }
    });

    // Monitor page errors
    this.page.on('pageerror', async (error) => {
      const route = new URL(this.page!.url()).pathname;
      await this.recordInteraction({
        timestamp: new Date(),
        route,
        action: 'page_error',
        success: false,
        errorMessage: error.message
      });
    });

    // Inject client-side monitoring script
    await this.page.evaluateOnNewDocument(() => {
      // Monitor all clicks
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const selector = target.tagName.toLowerCase() + 
          (target.id ? `#${target.id}` : '') + 
          (target.className ? `.${target.className.split(' ').join('.')}` : '');
        
        (window as any).puppeteerInteraction = {
          type: 'click',
          selector,
          coordinates: { x: event.clientX, y: event.clientY },
          elementType: target.tagName.toLowerCase(),
          timestamp: Date.now()
        };
      });

      // Monitor form submissions
      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement;
        (window as any).puppeteerInteraction = {
          type: 'form_submit',
          selector: form.tagName.toLowerCase() + (form.id ? `#${form.id}` : ''),
          timestamp: Date.now()
        };
      });

      // Monitor loading states
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const loadingElements = document.querySelectorAll('[data-loading="true"], .loading, .skeleton');
            (window as any).loadingState = loadingElements.length > 0;
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Record user interaction for learning
  private async recordInteraction(interaction: UserInteraction): Promise<void> {
    this.interactions.push(interaction);
    
    // Save interactions to file for persistence
    const interactionFile = join(process.cwd(), 'learned_interactions.json');
    writeFileSync(interactionFile, JSON.stringify(this.interactions, null, 2));

    // Analyze patterns every 10 interactions
    if (this.interactions.length % 10 === 0) {
      await this.analyzeAndLearnPatterns();
    }
  }

  // Analyze patterns from recorded interactions
  private async analyzeAndLearnPatterns(): Promise<void> {
    const recentInteractions = this.interactions.slice(-50); // Analyze last 50 interactions
    const errorPatterns = recentInteractions.filter(i => !i.success);
    
    if (errorPatterns.length === 0) return;

    // Group errors by route and type
    const errorGroups = new Map<string, UserInteraction[]>();
    
    errorPatterns.forEach(interaction => {
      const key = `${interaction.route}_${interaction.action}`;
      if (!errorGroups.has(key)) {
        errorGroups.set(key, []);
      }
      errorGroups.get(key)!.push(interaction);
    });

    // Create learned patterns for frequent errors
    for (const [key, errors] of errorGroups) {
      if (errors.length >= 3) { // Pattern threshold
        const pattern = await this.createLearnedPattern(errors);
        this.learnedPatterns.push(pattern);
      }
    }

    this.saveLearnedPatterns();
  }

  // Create a learned pattern from error interactions
  private async createLearnedPattern(errors: UserInteraction[]): Promise<LearnedPattern> {
    const route = errors[0].route;
    const errorType = errors[0].action;
    
    return {
      patternId: `pattern_${route}_${errorType}_${Date.now()}`,
      triggerConditions: [
        `route:${route}`,
        `error_type:${errorType}`,
        errors[0].errorMessage ? `error_message:${errors[0].errorMessage}` : ''
      ].filter(Boolean),
      expectedElements: [], // Will be populated during screen analysis
      fixActions: await this.generateFixActions(errors),
      confidence: 0.7,
      successRate: 0,
      lastUsed: new Date()
    };
  }

  // Generate fix actions based on error patterns
  private async generateFixActions(errors: UserInteraction[]): Promise<FixAction[]> {
    const fixes: FixAction[] = [];
    const errorType = errors[0].action;

    switch (errorType) {
      case 'console_error':
      case 'page_error':
        fixes.push({ type: 'wait', delay: 2000 });
        fixes.push({ type: 'reload' });
        break;
      
      case 'loading_error':
        fixes.push(
          { type: 'wait', delay: 5000 },
          { 
            type: 'inject_js', 
            code: 'window.location.reload()' 
          }
        );
        break;
      
      default:
        fixes.push({ type: 'wait', delay: 1000 });
    }

    return fixes;
  }

  // Proactively check screen health
  async checkScreenHealth(route: string): Promise<ScreenHealth> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    const issues: ScreenIssue[] = [];
    let performanceScore = 100;
    let accessibilityScore = 100;

    try {
      // Navigate to route if not already there
      const currentRoute = new URL(this.page.url()).pathname;
      if (currentRoute !== route) {
        await this.page.goto(`${this.baseUrl}${route}`, { waitUntil: 'networkidle0' });
      }

      // Check for JavaScript errors
      const jsErrors = await this.page.evaluate(() => {
        return (window as any).jsErrors || [];
      });

      if (jsErrors.length > 0) {
        issues.push({
          type: 'js_error',
          severity: 'high',
          description: `JavaScript errors detected: ${jsErrors.join(', ')}`
        });
        performanceScore -= 20;
      }

      // Check for missing critical elements
      const criticalElements = [
        'h1', 'main', '[role="main"]', 'nav', '[data-testid]'
      ];

      for (const selector of criticalElements) {
        const element = await this.page.$(selector);
        if (!element) {
          issues.push({
            type: 'missing_element',
            severity: 'medium',
            description: `Critical element missing: ${selector}`,
            selector,
            suggestedFix: {
              type: 'inject_css',
              code: `${selector} { display: block !important; }`
            }
          });
          accessibilityScore -= 10;
        }
      }

      // Check loading performance
      const performanceMetrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        };
      });

      if (performanceMetrics.loadTime > 3000) {
        issues.push({
          type: 'performance_slow',
          severity: 'medium',
          description: `Slow loading detected: ${performanceMetrics.loadTime}ms`
        });
        performanceScore -= 15;
      }

      // Auto-apply fixes if patterns exist
      const autoFixApplied = await this.applyAutoFixes(route, issues);

      const screenHealth: ScreenHealth = {
        route,
        isHealthy: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0,
        issues,
        performanceScore,
        accessibilityScore,
        lastChecked: new Date(),
        autoFixApplied
      };

      this.screenHealthMap.set(route, screenHealth);
      return screenHealth;

    } catch (error) {
      const screenHealth: ScreenHealth = {
        route,
        isHealthy: false,
        issues: [{
          type: 'loading_error',
          severity: 'critical',
          description: `Failed to check screen health: ${error}`
        }],
        performanceScore: 0,
        accessibilityScore: 0,
        lastChecked: new Date(),
        autoFixApplied: false
      };

      this.screenHealthMap.set(route, screenHealth);
      return screenHealth;
    }
  }

  // Apply automatic fixes based on learned patterns
  private async applyAutoFixes(route: string, issues: ScreenIssue[]): Promise<boolean> {
    if (!this.page) return false;

    let fixesApplied = false;

    // Find matching learned patterns
    for (const pattern of this.learnedPatterns) {
      const isMatch = pattern.triggerConditions.some(condition => 
        condition.includes(`route:${route}`)
      );

      if (isMatch && pattern.confidence > 0.6) {
        console.log(`🔧 Applying learned pattern fix: ${pattern.patternId}`);
        
        for (const fixAction of pattern.fixActions) {
          try {
            await this.executeFixAction(fixAction);
            fixesApplied = true;
            
            // Update pattern success rate
            pattern.successRate = Math.min(1, pattern.successRate + 0.1);
            pattern.lastUsed = new Date();
          } catch (error) {
            console.log(`❌ Fix action failed: ${error}`);
            pattern.confidence = Math.max(0, pattern.confidence - 0.1);
          }
        }
      }
    }

    // Apply suggested fixes from issues
    for (const issue of issues) {
      if (issue.suggestedFix) {
        try {
          await this.executeFixAction(issue.suggestedFix);
          fixesApplied = true;
        } catch (error) {
          console.log(`❌ Suggested fix failed: ${error}`);
        }
      }
    }

    return fixesApplied;
  }

  // Execute a specific fix action
  private async executeFixAction(action: FixAction): Promise<void> {
    if (!this.page) return;

    switch (action.type) {
      case 'wait':
        await this.page.waitForTimeout(action.delay || 1000);
        break;
      
      case 'reload':
        await this.page.reload({ waitUntil: 'networkidle0' });
        break;
      
      case 'click':
        if (action.selector) {
          await this.page.click(action.selector);
        }
        break;
      
      case 'navigate':
        if (action.url) {
          await this.page.goto(action.url, { waitUntil: 'networkidle0' });
        }
        break;
      
      case 'inject_css':
        if (action.code) {
          await this.page.addStyleTag({ content: action.code });
        }
        break;
      
      case 'inject_js':
        if (action.code) {
          await this.page.evaluate(action.code);
        }
        break;
    }
  }

  // Run comprehensive automated testing
  async runAutomatedTesting(): Promise<{ healthyScreens: number; brokenScreens: number; fixesApplied: number }> {
    const routes = [
      '/',
      '/dashboard',
      '/modern-quantum-dashboard',
      '/lead-intelligence',
      '/roi-calculator',
      '/automation-builder',
      '/financial-forecasting',
      '/market-research',
      '/system-command-center',
      '/ui-audit-control-panel'
    ];

    let healthyScreens = 0;
    let brokenScreens = 0;
    let fixesApplied = 0;

    console.log('🚀 Starting automated screen testing...');

    for (const route of routes) {
      console.log(`📊 Testing route: ${route}`);
      
      const health = await this.checkScreenHealth(route);
      
      if (health.isHealthy) {
        healthyScreens++;
      } else {
        brokenScreens++;
      }
      
      if (health.autoFixApplied) {
        fixesApplied++;
      }

      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Testing complete: ${healthyScreens} healthy, ${brokenScreens} broken, ${fixesApplied} fixes applied`);

    return { healthyScreens, brokenScreens, fixesApplied };
  }

  // Get current learning status
  getLearningStatus(): {
    isLearning: boolean;
    sessionId: string;
    interactionsRecorded: number;
    patternsLearned: number;
    screensTested: number;
  } {
    return {
      isLearning: this.isLearning,
      sessionId: this.learningSession,
      interactionsRecorded: this.interactions.length,
      patternsLearned: this.learnedPatterns.length,
      screensTested: this.screenHealthMap.size
    };
  }

  // Save learned patterns to disk
  private saveLearnedPatterns(): void {
    const patternsFile = join(process.cwd(), 'learned_patterns.json');
    writeFileSync(patternsFile, JSON.stringify(this.learnedPatterns, null, 2));
  }

  // Load learned patterns from disk
  private loadLearnedPatterns(): void {
    const patternsFile = join(process.cwd(), 'learned_patterns.json');
    if (existsSync(patternsFile)) {
      try {
        const data = readFileSync(patternsFile, 'utf-8');
        this.learnedPatterns = JSON.parse(data);
        console.log(`📚 Loaded ${this.learnedPatterns.length} learned patterns`);
      } catch (error) {
        console.log('❌ Failed to load learned patterns:', error);
        this.learnedPatterns = [];
      }
    }
  }

  // Stop learning mode and close browser
  async stopLearning(): Promise<void> {
    this.isLearning = false;
    this.saveLearnedPatterns();
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
    
    console.log('🧠 Learning mode stopped and patterns saved');
  }
}

export const intelligentPuppeteerLearner = new IntelligentPuppeteerLearner();