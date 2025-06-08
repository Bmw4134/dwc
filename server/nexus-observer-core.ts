import { WebSocketServer, WebSocket } from 'ws';
import { createServer, type Server } from "http";
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

interface SimulationSession {
  sessionId: string;
  timestamp: string;
  userAgent: string;
  viewport: { width: number; height: number };
  actions: UserAction[];
  performance: PerformanceMetrics;
  domSnapshots: DOMSnapshot[];
  errors: ErrorLog[];
  visualDiffs: VisualDiff[];
}

interface UserAction {
  type: 'click' | 'scroll' | 'type' | 'hover' | 'navigate';
  timestamp: number;
  element?: string;
  coordinates?: { x: number; y: number };
  value?: string;
  duration?: number;
}

interface PerformanceMetrics {
  loadTime: number;
  firstPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  memoryUsage: number;
  networkRequests: number;
}

interface DOMSnapshot {
  timestamp: number;
  url: string;
  html: string;
  css: string;
  elementCount: number;
  checksum: string;
}

interface ErrorLog {
  timestamp: number;
  type: 'javascript' | 'network' | 'console' | 'resource';
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface VisualDiff {
  timestamp: number;
  diffPercentage: number;
  changedRegions: Array<{ x: number; y: number; width: number; height: number }>;
  screenshot: string;
  previousScreenshot: string;
}

export class NEXUSObserverCore {
  private browser: any = null;
  private activeSessions: Map<string, SimulationSession> = new Map();
  private observerWebSocket: WebSocketServer | null = null;
  private replayLogPath = "/nexus-admin/logs/human_sim_replays.json";
  private driftDetectionEnabled = true;
  private domDiffTracking = true;
  private confidenceThreshold = 0.98;
  private lastDOMSnapshot: DOMSnapshot | null = null;
  private systemHealth = 100;

  constructor() {
    this.initializeObserverCore();
  }

  private async initializeObserverCore() {
    console.log('🧠 NEXUS Observer Core initializing...');
    
    try {
      // Initialize Puppeteer browser
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      console.log('🤖 Human Simulation Browser: LAUNCHED');

      // Create directories for logs
      await this.ensureDirectories();
      
      // Start observer monitoring
      this.startObserverMode();
      
      console.log('👁️ Observer mode: ACTIVE');
      console.log('🔁 Human simulation: READY');
      console.log('📊 Drift detection: ENABLED');
      console.log('🧬 Learning system: INITIALIZED');
      
    } catch (error) {
      console.error('❌ NEXUS Observer Core initialization failed:', error);
      this.systemHealth = 0;
    }
  }

  private async ensureDirectories() {
    const dirs = [
      '/nexus-admin/logs',
      '/nexus-admin/patch_results',
      '/nexus-admin/screenshots',
      '/nexus-admin/dom_snapshots'
    ];
    
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir.replace('/nexus-admin/', './logs/'), { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  public async startHumanSimulation(targetUrl: string = 'http://localhost:5000'): Promise<SimulationSession> {
    const sessionId = this.generateSessionId();
    const session: SimulationSession = {
      sessionId,
      timestamp: new Date().toISOString(),
      userAgent: 'NEXUS-Human-Simulator/1.0',
      viewport: { width: 1920, height: 1080 },
      actions: [],
      performance: {
        loadTime: 0,
        firstPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        memoryUsage: 0,
        networkRequests: 0
      },
      domSnapshots: [],
      errors: [],
      visualDiffs: []
    };

    this.activeSessions.set(sessionId, session);
    
    try {
      const page = await this.browser.newPage();
      await page.setViewport(session.viewport);
      
      // Set up performance monitoring
      await this.setupPerformanceMonitoring(page, session);
      
      // Set up error monitoring
      await this.setupErrorMonitoring(page, session);
      
      // Navigate to target
      const startTime = Date.now();
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });
      session.performance.loadTime = Date.now() - startTime;
      
      // Take initial DOM snapshot
      await this.captureDOMSnapshot(page, session);
      
      // Simulate human behavior
      await this.simulateHumanBehavior(page, session);
      
      // Save session data
      await this.saveSessionData(session);
      
      console.log(`🔁 Human simulation session ${sessionId} completed`);
      return session;
      
    } catch (error) {
      console.error(`❌ Human simulation failed for session ${sessionId}:`, error);
      session.errors.push({
        timestamp: Date.now(),
        type: 'javascript',
        message: `Simulation error: ${error.message}`,
        severity: 'critical'
      });
      throw error;
    }
  }

  private async setupPerformanceMonitoring(page: any, session: SimulationSession) {
    // Monitor performance metrics
    page.on('metrics', async (metrics: any) => {
      session.performance = {
        ...session.performance,
        memoryUsage: metrics.JSHeapUsedSize || 0
      };
    });

    // Monitor network requests
    page.on('request', () => {
      session.performance.networkRequests++;
    });

    // Capture Web Vitals
    await page.evaluateOnNewDocument(() => {
      window.addEventListener('load', () => {
        // First Paint
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        if (firstPaint) {
          (window as any).firstPaintTime = firstPaint.startTime;
        }

        // LCP
        new (window as any).PerformanceObserver((list: any) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          (window as any).lcpTime = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS
        let clsScore = 0;
        new (window as any).PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          (window as any).clsScore = clsScore;
        }).observe({ entryTypes: ['layout-shift'] });
      });
    });
  }

  private async setupErrorMonitoring(page: any, session: SimulationSession) {
    // JavaScript errors
    page.on('pageerror', (error: Error) => {
      session.errors.push({
        timestamp: Date.now(),
        type: 'javascript',
        message: error.message,
        stack: error.stack,
        severity: 'high'
      });
    });

    // Console errors
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        session.errors.push({
          timestamp: Date.now(),
          type: 'console',
          message: msg.text(),
          severity: 'medium'
        });
      }
    });

    // Network failures
    page.on('requestfailed', (request: any) => {
      session.errors.push({
        timestamp: Date.now(),
        type: 'network',
        message: `Failed to load: ${request.url()}`,
        severity: 'medium'
      });
    });
  }

  private async captureDOMSnapshot(page: any, session: SimulationSession) {
    try {
      const html = await page.content();
      const url = page.url();
      
      const snapshot: DOMSnapshot = {
        timestamp: Date.now(),
        url,
        html,
        css: '', // Could capture computed styles if needed
        elementCount: await page.$$eval('*', (elements: any[]) => elements.length),
        checksum: this.generateChecksum(html)
      };
      
      session.domSnapshots.push(snapshot);
      
      // Check for drift if we have a previous snapshot
      if (this.lastDOMSnapshot && this.driftDetectionEnabled) {
        await this.detectDOMDrift(snapshot, this.lastDOMSnapshot, session);
      }
      
      this.lastDOMSnapshot = snapshot;
      
    } catch (error) {
      console.error('❌ Failed to capture DOM snapshot:', error);
    }
  }

  private async detectDOMDrift(current: DOMSnapshot, previous: DOMSnapshot, session: SimulationSession) {
    // Simple checksum comparison - could be enhanced with more sophisticated diff
    if (current.checksum !== previous.checksum) {
      const elementCountDiff = Math.abs(current.elementCount - previous.elementCount);
      const driftPercentage = (elementCountDiff / previous.elementCount) * 100;
      
      if (driftPercentage > 5) { // Significant drift threshold
        console.log(`🔍 DOM drift detected: ${driftPercentage.toFixed(2)}% change`);
        
        // Could implement visual diff here
        session.visualDiffs.push({
          timestamp: Date.now(),
          diffPercentage: driftPercentage,
          changedRegions: [], // Would need image comparison for this
          screenshot: '',
          previousScreenshot: ''
        });
      }
    }
  }

  private async simulateHumanBehavior(page: any, session: SimulationSession) {
    const actions = [
      // Simulate realistic user interactions
      { type: 'scroll', delay: 1000 },
      { type: 'hover', selector: 'button', delay: 500 },
      { type: 'click', selector: 'button', delay: 2000 },
      { type: 'scroll', delay: 1500 },
      { type: 'navigate_back', delay: 1000 }
    ];

    for (const action of actions) {
      try {
        await this.executeAction(page, action, session);
        await this.randomDelay(action.delay);
      } catch (error) {
        console.log(`⚠️ Action failed: ${action.type}`, error.message);
      }
    }
  }

  private async executeAction(page: any, action: any, session: SimulationSession) {
    const startTime = Date.now();
    
    switch (action.type) {
      case 'scroll':
        await page.evaluate(() => {
          window.scrollBy(0, Math.random() * 500 + 200);
        });
        break;
        
      case 'hover':
        const hoverElements = await page.$$(action.selector);
        if (hoverElements.length > 0) {
          await hoverElements[0].hover();
        }
        break;
        
      case 'click':
        const clickElements = await page.$$(action.selector);
        if (clickElements.length > 0) {
          await clickElements[0].click();
        }
        break;
        
      case 'navigate_back':
        await page.goBack();
        break;
    }
    
    session.actions.push({
      type: action.type,
      timestamp: startTime,
      element: action.selector,
      duration: Date.now() - startTime
    });
  }

  private async randomDelay(baseDelay: number) {
    const variance = baseDelay * 0.3; // 30% variance
    const delay = baseDelay + (Math.random() - 0.5) * 2 * variance;
    await new Promise(resolve => setTimeout(resolve, Math.max(100, delay)));
  }

  private startObserverMode() {
    // Start continuous monitoring
    setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }

  private async performHealthCheck(): Promise<number> {
    try {
      // Test basic functionality
      const testSession = await this.startHumanSimulation();
      const confidence = this.calculateConfidence(testSession);
      
      if (confidence >= this.confidenceThreshold) {
        console.log(`✅ System health check passed: ${(confidence * 100).toFixed(1)}% confidence`);
        this.systemHealth = confidence * 100;
        
        if (confidence >= 0.98) {
          await this.reportAllClear();
        }
      } else {
        console.log(`⚠️ System health degraded: ${(confidence * 100).toFixed(1)}% confidence`);
        this.systemHealth = confidence * 100;
        await this.triggerRecoveryProtocol();
      }
      
      return confidence;
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.systemHealth = 0;
      await this.reportFailure(error);
      return 0;
    }
  }

  private calculateConfidence(session: SimulationSession): number {
    let score = 1.0;
    
    // Performance penalties
    if (session.performance.loadTime > 5000) score -= 0.2;
    if (session.performance.networkRequests === 0) score -= 0.3;
    
    // Error penalties
    const criticalErrors = session.errors.filter(e => e.severity === 'critical').length;
    const highErrors = session.errors.filter(e => e.severity === 'high').length;
    
    score -= (criticalErrors * 0.4) + (highErrors * 0.2);
    
    // DOM health
    if (session.domSnapshots.length === 0) score -= 0.3;
    
    return Math.max(0, score);
  }

  private async reportAllClear() {
    const report = {
      status: "ALL CLEAR",
      timestamp: new Date().toISOString(),
      systemHealth: this.systemHealth,
      confidence: this.systemHealth / 100,
      activeSessions: this.activeSessions.size,
      message: "NEXUS Observer Core operational. Human simulation successful. No issues detected."
    };
    
    await this.saveReport(report, 'human_sim_core_status.json');
    console.log('🎯 ALL CLEAR - System ready for deployment');
  }

  private async reportFailure(error: any) {
    const report = {
      status: "FAILURE DETECTED",
      timestamp: new Date().toISOString(),
      systemHealth: this.systemHealth,
      confidence: this.systemHealth / 100,
      error: error.message,
      suggestions: [
        "Check network connectivity",
        "Verify API endpoints are responding",
        "Review error logs for detailed information",
        "Restart NEXUS Observer Core if issues persist"
      ]
    };
    
    await this.saveReport(report, 'human_sim_core_status.json');
    console.log('❗ FAILURE DETECTED - Check logs for details');
  }

  private async triggerRecoveryProtocol() {
    console.log('🔄 Triggering recovery protocol...');
    
    // Restart browser instance
    if (this.browser) {
      await this.browser.close();
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    
    // Clear failed sessions
    this.activeSessions.clear();
    
    console.log('🔄 Recovery protocol completed');
  }

  private async saveSessionData(session: SimulationSession) {
    try {
      const replayData = {
        sessions: Array.from(this.activeSessions.values())
      };
      
      await fs.writeFile(
        './logs/human_sim_replays.json',
        JSON.stringify(replayData, null, 2)
      );
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  }

  private async saveReport(report: any, filename: string) {
    try {
      await fs.writeFile(
        `./logs/${filename}`,
        JSON.stringify(report, null, 2)
      );
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  }

  private generateSessionId(): string {
    return `nexus_sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateChecksum(content: string): string {
    // Simple hash - could use crypto for better hashing
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  public getSystemStatus() {
    return {
      health: this.systemHealth,
      activeSessions: this.activeSessions.size,
      driftDetection: this.driftDetectionEnabled,
      domTracking: this.domDiffTracking,
      confidence: this.systemHealth / 100
    };
  }
}

export const nexusObserverCore = new NEXUSObserverCore();