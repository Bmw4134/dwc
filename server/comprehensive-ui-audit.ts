import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export interface UIIssue {
  route: string;
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  screenshot?: string;
  fix: string;
  coordinates?: { x: number; y: number };
}

export interface UIAuditReport {
  timestamp: Date;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  routesCovered: number;
  issues: UIIssue[];
  fixes: string[];
  billionDollarUIScore: number;
}

export class ComprehensiveUIAuditor {
  private browser: Browser | null = null;
  private baseUrl: string;
  private screenshots: string[] = [];

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  async initializeBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080'
      ]
    });
  }

  async runComprehensiveUIAudit(): Promise<UIAuditReport> {
    if (!this.browser) {
      await this.initializeBrowser();
    }

    const issues: UIIssue[] = [];
    const routes = this.getAllRoutes();
    
    console.log(`Starting comprehensive UI audit for ${routes.length} routes...`);

    for (const route of routes) {
      console.log(`Auditing route: ${route}`);
      const routeIssues = await this.auditRoute(route);
      issues.push(...routeIssues);
    }

    const report = this.generateReport(issues, routes.length);
    await this.saveReport(report);
    
    return report;
  }

  private getAllRoutes(): string[] {
    return [
      '/',
      '/demo-showcase',
      '/consultant-landing',
      '/dashboard',
      '/lead-intelligence',
      '/roi-calculator',
      '/automation-builder',
      '/financial-forecasting',
      '/market-research',
      '/system-command-center',
      '/llc-automation',
      '/client-portal',
      '/mission-control',
      '/internal-llm',
      '/intelligence-hierarchy',
      '/business-file-system',
      '/financial-command-center',
      '/email-dns-automation',
      '/puppeteer-viewer',
      '/funding-research',
      '/professional-roadmap',
      '/professional-whitepaper',
      '/professional-notes',
      '/professional-faq',
      '/contract-generator',
      '/market-expansion-analyzer',
      '/pricing-analytics',
      '/quantum-parser',
      '/quantum-predictive-analytics',
      '/asi-display-simulator',
      '/secure-financial',
      '/crm',
      '/ai-trainer',
      '/agent-mesh',
      '/evolver',
      '/business-scanner',
      '/pain-point-analyzer',
      '/process-designer'
    ];
  }

  private async auditRoute(route: string): Promise<UIIssue[]> {
    const page = await this.browser!.newPage();
    const issues: UIIssue[] = [];

    try {
      // Set viewport for desktop and mobile testing
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate to route
      await page.goto(`${this.baseUrl}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForTimeout(3000);

      // Take screenshot
      const screenshotPath = await this.takeScreenshot(page, route);

      // Check for layout issues
      const layoutIssues = await this.checkLayoutIssues(page, route);
      issues.push(...layoutIssues);

      // Check for responsive design issues
      const responsiveIssues = await this.checkResponsiveIssues(page, route);
      issues.push(...responsiveIssues);

      // Check for accessibility issues
      const accessibilityIssues = await this.checkAccessibilityIssues(page, route);
      issues.push(...accessibilityIssues);

      // Check for performance issues
      const performanceIssues = await this.checkPerformanceIssues(page, route);
      issues.push(...performanceIssues);

      // Check for interactive element issues
      const interactionIssues = await this.checkInteractionIssues(page, route);
      issues.push(...interactionIssues);

      // Check for visual hierarchy issues
      const hierarchyIssues = await this.checkVisualHierarchy(page, route);
      issues.push(...hierarchyIssues);

      // Test mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      const mobileIssues = await this.checkMobileIssues(page, route);
      issues.push(...mobileIssues);

    } catch (error) {
      issues.push({
        route,
        element: 'page',
        issue: `Failed to load route: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'critical',
        fix: 'Fix route loading and ensure proper error handling'
      });
    } finally {
      await page.close();
    }

    return issues;
  }

  private async takeScreenshot(page: Page, route: string): Promise<string> {
    const filename = `audit-${route.replace(/\//g, '-')}-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'ui-audit-screenshots', filename);
    
    try {
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await page.screenshot({ path: filepath, fullPage: true });
      this.screenshots.push(filepath);
      return filepath;
    } catch (error) {
      console.error('Screenshot failed:', error);
      return '';
    }
  }

  private async checkLayoutIssues(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const layoutProblems = await page.evaluate(() => {
        const problems: any[] = [];
        
        // Check for elements extending beyond viewport
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth + 50) {
            problems.push({
              type: 'overflow',
              element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : ''),
              width: rect.width,
              viewportWidth: window.innerWidth
            });
          }
        });

        // Check for invisible text (same color as background)
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
        textElements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const textColor = computedStyle.color;
          const bgColor = computedStyle.backgroundColor;
          
          if (textColor === bgColor && textColor !== 'rgba(0, 0, 0, 0)') {
            problems.push({
              type: 'invisible-text',
              element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : ''),
              textColor,
              bgColor
            });
          }
        });

        // Check for missing images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (!img.src || img.naturalWidth === 0) {
            problems.push({
              type: 'broken-image',
              element: 'img',
              src: img.src
            });
          }
        });

        // Check for overlapping elements
        const importantElements = document.querySelectorAll('button, input, select, a, [role="button"]');
        for (let i = 0; i < importantElements.length; i++) {
          for (let j = i + 1; j < importantElements.length; j++) {
            const rect1 = importantElements[i].getBoundingClientRect();
            const rect2 = importantElements[j].getBoundingClientRect();
            
            if (rect1.left < rect2.right && rect2.left < rect1.right &&
                rect1.top < rect2.bottom && rect2.top < rect1.bottom) {
              problems.push({
                type: 'overlapping-elements',
                element1: importantElements[i].tagName,
                element2: importantElements[j].tagName
              });
            }
          }
        }

        return problems;
      });

      layoutProblems.forEach((problem: any) => {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let fix = '';

        switch (problem.type) {
          case 'overflow':
            severity = 'high';
            fix = `Add max-width: 100% and overflow-x: hidden to ${problem.element}. Consider using Flexbox or Grid layout.`;
            break;
          case 'invisible-text':
            severity = 'critical';
            fix = `Change text color for ${problem.element} to ensure proper contrast. Use dark text on light backgrounds.`;
            break;
          case 'broken-image':
            severity = 'high';
            fix = `Fix image source: ${problem.src}. Add proper error handling and fallback images.`;
            break;
          case 'overlapping-elements':
            severity = 'high';
            fix = `Fix overlapping elements: ${problem.element1} and ${problem.element2}. Adjust margins, padding, or z-index.`;
            break;
        }

        issues.push({
          route,
          element: problem.element || `${problem.element1} & ${problem.element2}`,
          issue: `Layout Issue: ${problem.type}`,
          severity,
          fix
        });
      });

    } catch (error) {
      console.error('Layout check failed:', error);
    }

    return issues;
  }

  private async checkResponsiveIssues(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 1024, height: 768, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' }
      ];

      for (const viewport of viewports) {
        await page.setViewport(viewport);
        await page.waitForTimeout(1000);

        const responsiveProblems = await page.evaluate((viewportName) => {
          const problems: any[] = [];

          // Check if navigation is accessible
          const nav = document.querySelector('nav, [role="navigation"]');
          if (nav) {
            const navRect = nav.getBoundingClientRect();
            if (navRect.width > window.innerWidth) {
              problems.push({
                type: 'nav-overflow',
                viewport: viewportName,
                element: 'navigation'
              });
            }
          }

          // Check for tiny clickable elements on mobile
          if (viewportName === 'mobile') {
            const clickables = document.querySelectorAll('button, a, input, select');
            clickables.forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.width < 44 || rect.height < 44) {
                problems.push({
                  type: 'small-touch-target',
                  element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : ''),
                  size: `${rect.width}x${rect.height}`
                });
              }
            });
          }

          // Check for horizontal scrolling
          if (document.body.scrollWidth > window.innerWidth + 10) {
            problems.push({
              type: 'horizontal-scroll',
              viewport: viewportName,
              scrollWidth: document.body.scrollWidth,
              viewportWidth: window.innerWidth
            });
          }

          return problems;
        }, viewport.name);

        responsiveProblems.forEach((problem: any) => {
          let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
          let fix = '';

          switch (problem.type) {
            case 'nav-overflow':
              severity = 'high';
              fix = 'Implement responsive navigation with hamburger menu for mobile. Use CSS media queries.';
              break;
            case 'small-touch-target':
              severity = 'high';
              fix = `Increase touch target size for ${problem.element} to minimum 44x44px. Add padding or increase font size.`;
              break;
            case 'horizontal-scroll':
              severity = 'critical';
              fix = `Fix horizontal overflow on ${problem.viewport}. Add max-width: 100% and proper responsive design.`;
              break;
          }

          issues.push({
            route,
            element: problem.element || 'viewport',
            issue: `Responsive Issue (${problem.viewport}): ${problem.type}`,
            severity,
            fix
          });
        });
      }

    } catch (error) {
      console.error('Responsive check failed:', error);
    }

    return issues;
  }

  private async checkAccessibilityIssues(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const a11yProblems = await page.evaluate(() => {
        const problems: any[] = [];

        // Check for missing alt text
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (!img.alt && !img.getAttribute('aria-label')) {
            problems.push({
              type: 'missing-alt-text',
              element: 'img',
              src: img.src
            });
          }
        });

        // Check for missing form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          const id = input.id;
          const label = document.querySelector(`label[for="${id}"]`);
          const ariaLabel = input.getAttribute('aria-label');
          
          if (!label && !ariaLabel) {
            problems.push({
              type: 'missing-form-label',
              element: input.tagName,
              id: id || 'no-id'
            });
          }
        });

        // Check for insufficient color contrast
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
        textElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const bgColor = style.backgroundColor;
          
          // Simple contrast check (basic implementation)
          if (color === 'rgb(128, 128, 128)' || color === '#808080') {
            problems.push({
              type: 'low-contrast',
              element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : ''),
              color
            });
          }
        });

        // Check for missing focus indicators
        const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        focusableElements.forEach(el => {
          const style = window.getComputedStyle(el, ':focus');
          if (style.outline === 'none' && !style.boxShadow && !style.border) {
            problems.push({
              type: 'missing-focus-indicator',
              element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : '')
            });
          }
        });

        return problems;
      });

      a11yProblems.forEach((problem: any) => {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let fix = '';

        switch (problem.type) {
          case 'missing-alt-text':
            severity = 'high';
            fix = `Add descriptive alt text to image: ${problem.src}`;
            break;
          case 'missing-form-label':
            severity = 'high';
            fix = `Add proper label or aria-label to ${problem.element} input field`;
            break;
          case 'low-contrast':
            severity = 'medium';
            fix = `Improve color contrast for ${problem.element}. Use darker colors for better readability.`;
            break;
          case 'missing-focus-indicator':
            severity = 'medium';
            fix = `Add focus indicator styles for ${problem.element}. Use outline or box-shadow on :focus.`;
            break;
        }

        issues.push({
          route,
          element: problem.element,
          issue: `Accessibility Issue: ${problem.type}`,
          severity,
          fix
        });
      });

    } catch (error) {
      console.error('Accessibility check failed:', error);
    }

    return issues;
  }

  private async checkPerformanceIssues(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const performanceMetrics = await page.evaluate(() => {
        const performance = window.performance;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          largeImages: Array.from(document.querySelectorAll('img')).filter(img => {
            return img.naturalWidth > 1920 || img.naturalHeight > 1080;
          }).length,
          unoptimizedImages: Array.from(document.querySelectorAll('img')).filter(img => {
            return !img.src.includes('webp') && !img.src.includes('avif');
          }).length
        };
      });

      if (performanceMetrics.loadTime > 3000) {
        issues.push({
          route,
          element: 'page',
          issue: `Slow page load time: ${performanceMetrics.loadTime}ms`,
          severity: 'high',
          fix: 'Optimize images, minify CSS/JS, implement lazy loading, use CDN'
        });
      }

      if (performanceMetrics.largeImages > 0) {
        issues.push({
          route,
          element: 'images',
          issue: `${performanceMetrics.largeImages} oversized images found`,
          severity: 'medium',
          fix: 'Resize images to appropriate dimensions and use responsive images'
        });
      }

      if (performanceMetrics.unoptimizedImages > 0) {
        issues.push({
          route,
          element: 'images',
          issue: `${performanceMetrics.unoptimizedImages} unoptimized images (not WebP/AVIF)`,
          severity: 'low',
          fix: 'Convert images to modern formats (WebP, AVIF) for better compression'
        });
      }

    } catch (error) {
      console.error('Performance check failed:', error);
    }

    return issues;
  }

  private async checkInteractionIssues(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const interactionProblems = await page.evaluate(() => {
        const problems: any[] = [];

        // Check for broken buttons
        const buttons = document.querySelectorAll('button, [role="button"]');
        buttons.forEach(button => {
          if (!button.onclick && !button.getAttribute('onClick') && !button.type) {
            problems.push({
              type: 'non-functional-button',
              element: button.tagName + (button.className ? `.${button.className.split(' ')[0]}` : ''),
              text: button.textContent?.slice(0, 30)
            });
          }
        });

        // Check for form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
          const requiredFields = form.querySelectorAll('[required]');
          if (requiredFields.length === 0) {
            problems.push({
              type: 'no-form-validation',
              element: 'form'
            });
          }
        });

        // Check for loading states
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
          if (!button.disabled && !button.getAttribute('aria-busy')) {
            problems.push({
              type: 'missing-loading-state',
              element: 'submit-button',
              text: button.textContent?.slice(0, 30)
            });
          }
        });

        return problems;
      });

      interactionProblems.forEach((problem: any) => {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let fix = '';

        switch (problem.type) {
          case 'non-functional-button':
            severity = 'high';
            fix = `Add click handler or proper type attribute to button: "${problem.text}"`;
            break;
          case 'no-form-validation':
            severity = 'medium';
            fix = 'Add form validation with required fields and error messages';
            break;
          case 'missing-loading-state':
            severity = 'low';
            fix = `Add loading state to submit button: "${problem.text}"`;
            break;
        }

        issues.push({
          route,
          element: problem.element,
          issue: `Interaction Issue: ${problem.type}`,
          severity,
          fix
        });
      });

    } catch (error) {
      console.error('Interaction check failed:', error);
    }

    return issues;
  }

  private async checkVisualHierarchy(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const hierarchyProblems = await page.evaluate(() => {
        const problems: any[] = [];

        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
          const level = parseInt(heading.tagName.charAt(1));
          if (level > lastLevel + 1) {
            problems.push({
              type: 'broken-heading-hierarchy',
              element: heading.tagName,
              text: heading.textContent?.slice(0, 50)
            });
          }
          lastLevel = level;
        });

        // Check for multiple H1 tags
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count > 1) {
          problems.push({
            type: 'multiple-h1',
            count: h1Count
          });
        }

        // Check for inconsistent spacing
        const cards = document.querySelectorAll('.card, [class*="card"]');
        if (cards.length > 1) {
          const spacings = Array.from(cards).map(card => {
            const style = window.getComputedStyle(card);
            return parseInt(style.marginBottom) + parseInt(style.marginTop);
          });
          
          const uniqueSpacings = [...new Set(spacings)];
          if (uniqueSpacings.length > 2) {
            problems.push({
              type: 'inconsistent-spacing',
              element: 'cards',
              spacings: uniqueSpacings
            });
          }
        }

        return problems;
      });

      hierarchyProblems.forEach((problem: any) => {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let fix = '';

        switch (problem.type) {
          case 'broken-heading-hierarchy':
            severity = 'medium';
            fix = `Fix heading hierarchy. Don't skip heading levels. Current: ${problem.element}`;
            break;
          case 'multiple-h1':
            severity = 'medium';
            fix = `Use only one H1 per page. Found ${problem.count} H1 tags.`;
            break;
          case 'inconsistent-spacing':
            severity = 'low';
            fix = `Standardize spacing between cards. Use consistent margin/padding values.`;
            break;
        }

        issues.push({
          route,
          element: problem.element,
          issue: `Visual Hierarchy Issue: ${problem.type}`,
          severity,
          fix
        });
      });

    } catch (error) {
      console.error('Visual hierarchy check failed:', error);
    }

    return issues;
  }

  private async checkMobileIssues(page: Page, route: string): Promise<UIIssue[]> {
    const issues: UIIssue[] = [];

    try {
      const mobileProblems = await page.evaluate(() => {
        const problems: any[] = [];

        // Check for text too small on mobile
        const textElements = document.querySelectorAll('p, span, div, a');
        textElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseInt(style.fontSize);
          if (fontSize < 14) {
            problems.push({
              type: 'small-text-mobile',
              element: el.tagName + (el.className ? `.${el.className.split(' ')[0]}` : ''),
              fontSize: fontSize
            });
          }
        });

        // Check for elements too close together
        const clickables = document.querySelectorAll('button, a, input');
        for (let i = 0; i < clickables.length - 1; i++) {
          const rect1 = clickables[i].getBoundingClientRect();
          const rect2 = clickables[i + 1].getBoundingClientRect();
          
          const distance = Math.abs(rect2.top - rect1.bottom);
          if (distance < 8) {
            problems.push({
              type: 'elements-too-close',
              element1: clickables[i].tagName,
              element2: clickables[i + 1].tagName,
              distance: distance
            });
          }
        }

        // Check for viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
          problems.push({
            type: 'missing-viewport-meta'
          });
        }

        return problems;
      });

      mobileProblems.forEach((problem: any) => {
        let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
        let fix = '';

        switch (problem.type) {
          case 'small-text-mobile':
            severity = 'medium';
            fix = `Increase font size for ${problem.element} to minimum 14px on mobile`;
            break;
          case 'elements-too-close':
            severity = 'medium';
            fix = `Add more spacing between ${problem.element1} and ${problem.element2} (currently ${problem.distance}px)`;
            break;
          case 'missing-viewport-meta':
            severity = 'high';
            fix = 'Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">';
            break;
        }

        issues.push({
          route,
          element: problem.element || problem.element1,
          issue: `Mobile Issue: ${problem.type}`,
          severity,
          fix
        });
      });

    } catch (error) {
      console.error('Mobile check failed:', error);
    }

    return issues;
  }

  private generateReport(issues: UIIssue[], routesCovered: number): UIAuditReport {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    const lowIssues = issues.filter(i => i.severity === 'low').length;

    // Calculate billion dollar UI score
    const totalPossibleIssues = routesCovered * 20; // Assuming max 20 issues per route
    const actualIssues = issues.length;
    const severityWeight = (criticalIssues * 4) + (highIssues * 3) + (mediumIssues * 2) + (lowIssues * 1);
    const billionDollarUIScore = Math.max(0, 100 - (severityWeight / totalPossibleIssues * 100));

    // Generate comprehensive fixes
    const fixes = [
      'Implement consistent design system with standardized spacing, colors, and typography',
      'Add proper responsive breakpoints and mobile-first design approach',
      'Ensure all interactive elements have proper focus states and accessibility',
      'Optimize images with modern formats (WebP/AVIF) and proper sizing',
      'Add loading states and error handling for all user interactions',
      'Implement proper form validation with clear error messages',
      'Use semantic HTML and proper heading hierarchy',
      'Ensure minimum 44px touch targets for mobile interactions',
      'Add proper color contrast ratios (4.5:1 for normal text)',
      'Implement lazy loading for images and content below the fold'
    ];

    return {
      timestamp: new Date(),
      totalIssues: issues.length,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      routesCovered,
      issues,
      fixes,
      billionDollarUIScore
    };
  }

  private async saveReport(report: UIAuditReport): Promise<void> {
    const filename = `ui-audit-report-${report.timestamp.toISOString().replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(process.cwd(), 'ui-audit-reports', filename);
    
    try {
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, JSON.stringify(report, null, 2));
      
      // Also create a readable summary
      const summaryPath = filepath.replace('.json', '-summary.txt');
      const summary = this.generateReadableSummary(report);
      await fs.writeFile(summaryPath, summary);
      
      console.log(`UI Audit report saved to: ${filepath}`);
      console.log(`Summary saved to: ${summaryPath}`);
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  }

  private generateReadableSummary(report: UIAuditReport): string {
    return `
UI AUDIT SUMMARY
================
Generated: ${report.timestamp.toISOString()}
Routes Audited: ${report.routesCovered}
Billion Dollar UI Score: ${report.billionDollarUIScore.toFixed(1)}/100

ISSUE BREAKDOWN:
- Critical Issues: ${report.criticalIssues}
- High Priority Issues: ${report.highIssues}
- Medium Priority Issues: ${report.mediumIssues}
- Low Priority Issues: ${report.lowIssues}
- Total Issues: ${report.totalIssues}

TOP PRIORITY FIXES:
${report.issues
  .filter(i => i.severity === 'critical' || i.severity === 'high')
  .slice(0, 10)
  .map((issue, index) => `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.route} - ${issue.issue}\n   Fix: ${issue.fix}`)
  .join('\n\n')}

COMPREHENSIVE FIXES TO IMPLEMENT:
${report.fixes.map((fix, index) => `${index + 1}. ${fix}`).join('\n')}
`;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const uiAuditor = new ComprehensiveUIAuditor();