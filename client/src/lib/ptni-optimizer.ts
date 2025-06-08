// PTNI (Predictive Technology Neural Intelligence) Optimizer
// Optimizes user behavior patterns and click-through rates

interface UserInteraction {
  timestamp: number;
  action: string;
  element: string;
  duration: number;
  success: boolean;
}

interface ClickPattern {
  element: string;
  frequency: number;
  averageTime: number;
  successRate: number;
  conversionValue: number;
}

class PTNIOptimizer {
  private interactions: UserInteraction[] = [];
  private patterns: Map<string, ClickPattern> = new Map();
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `ptni_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    // Track all click events with enhanced metadata
    document.addEventListener('click', (event) => {
      this.trackInteraction(event);
    });

    // Track scroll behavior for engagement analysis
    let scrollTimer: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.trackScrollEngagement();
      }, 150);
    });

    // Track form interactions
    document.addEventListener('input', (event) => {
      this.trackFormEngagement(event);
    });
  }

  private trackInteraction(event: Event) {
    const target = event.target as HTMLElement;
    const elementInfo = this.getElementInfo(target);
    
    const interaction: UserInteraction = {
      timestamp: Date.now(),
      action: 'click',
      element: elementInfo,
      duration: 0,
      success: this.determineSuccess(target)
    };

    this.interactions.push(interaction);
    this.updatePatterns(elementInfo, interaction);
    this.sendToAnalytics(interaction);
  }

  private getElementInfo(element: HTMLElement): string {
    const classes = element.className || '';
    const id = element.id || '';
    const text = element.textContent?.slice(0, 50) || '';
    const tag = element.tagName.toLowerCase();
    
    return `${tag}${id ? `#${id}` : ''}${classes ? `.${classes.split(' ').join('.')}` : ''}:${text}`;
  }

  private determineSuccess(element: HTMLElement): boolean {
    // High-value elements that indicate successful engagement
    const successIndicators = [
      'nexus-gpt', 'executive-access', 'get-started', 'try-free',
      'dashboard', 'login', 'chat', 'demo'
    ];
    
    const elementInfo = this.getElementInfo(element).toLowerCase();
    return successIndicators.some(indicator => elementInfo.includes(indicator));
  }

  private trackScrollEngagement() {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > 75) {
      this.trackInteraction({
        target: { tagName: 'BODY', className: 'scroll-deep-engagement' }
      } as any);
    }
  }

  private trackFormEngagement(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value.length > 5) {
      this.trackInteraction({
        target: { tagName: 'INPUT', className: 'form-engagement', textContent: 'form-input' }
      } as any);
    }
  }

  private updatePatterns(elementInfo: string, interaction: UserInteraction) {
    const existing = this.patterns.get(elementInfo) || {
      element: elementInfo,
      frequency: 0,
      averageTime: 0,
      successRate: 0,
      conversionValue: 0
    };

    existing.frequency += 1;
    existing.successRate = (existing.successRate + (interaction.success ? 1 : 0)) / existing.frequency;
    existing.conversionValue = this.calculateConversionValue(elementInfo, existing.successRate);

    this.patterns.set(elementInfo, existing);
  }

  private calculateConversionValue(elementInfo: string, successRate: number): number {
    const highValueElements = {
      'nexus-gpt': 850,
      'executive-access': 1200,
      'get-started': 950,
      'dashboard': 1100,
      'chat': 750,
      'demo': 600
    };

    for (const [key, value] of Object.entries(highValueElements)) {
      if (elementInfo.toLowerCase().includes(key)) {
        return value * successRate;
      }
    }

    return 100 * successRate;
  }

  private async sendToAnalytics(interaction: UserInteraction) {
    try {
      await fetch('/api/ptni/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          interaction,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.log('Analytics tracking queued for next sync');
    }
  }

  public getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const sortedPatterns = Array.from(this.patterns.values())
      .sort((a, b) => b.conversionValue - a.conversionValue);

    // Analyze top performing elements
    const topElements = sortedPatterns.slice(0, 5);
    topElements.forEach(pattern => {
      if (pattern.successRate > 0.7) {
        recommendations.push(`Optimize ${pattern.element} - High conversion (${(pattern.successRate * 100).toFixed(1)}%)`);
      }
    });

    // Identify underperforming elements
    const underperforming = sortedPatterns.filter(p => p.frequency > 3 && p.successRate < 0.3);
    underperforming.forEach(pattern => {
      recommendations.push(`Review ${pattern.element} - Low conversion (${(pattern.successRate * 100).toFixed(1)}%)`);
    });

    return recommendations;
  }

  public generatePTNIReport() {
    return {
      sessionId: this.sessionId,
      totalInteractions: this.interactions.length,
      uniqueElements: this.patterns.size,
      averageSuccessRate: this.calculateAverageSuccessRate(),
      topPerformers: this.getTopPerformers(),
      recommendations: this.getOptimizationRecommendations(),
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateAverageSuccessRate(): number {
    if (this.patterns.size === 0) return 0;
    const total = Array.from(this.patterns.values()).reduce((sum, pattern) => sum + pattern.successRate, 0);
    return total / this.patterns.size;
  }

  private getTopPerformers(): ClickPattern[] {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.conversionValue - a.conversionValue)
      .slice(0, 10);
  }
}

// Initialize PTNI optimizer
export const ptniOptimizer = new PTNIOptimizer();

// Export utility functions
export const trackCustomEvent = (eventName: string, value: number = 0) => {
  ptniOptimizer['trackInteraction']({
    target: { tagName: 'CUSTOM', className: eventName, textContent: `custom-${eventName}` }
  } as any);
};

export const getPTNIReport = () => ptniOptimizer.generatePTNIReport();