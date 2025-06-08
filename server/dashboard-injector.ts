import { WebsiteIQ } from './lead-enhancer';

export interface AIUXComponent {
  id: string;
  type: 'analytics-widget' | 'conversion-tracker' | 'lead-capture' | 'performance-monitor' | 'booking-system' | 'client-portal';
  position: 'header' | 'footer' | 'sidebar' | 'overlay' | 'inline';
  config: any;
  styles: string;
  script: string;
  enabled: boolean;
  priority: number;
}

export interface ClientPortalConfig {
  businessName: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  features: string[];
  customDomain?: string;
  analyticsEnabled: boolean;
  bookingEnabled: boolean;
  leadTrackingEnabled: boolean;
}

export interface MountResult {
  success: boolean;
  componentsInjected: string[];
  performanceImpact: number;
  estimatedConversionIncrease: number;
  implementationDetails: string[];
  nextSteps: string[];
}

export class DashboardInjector {
  private components: Map<string, AIUXComponent> = new Map();

  constructor() {
    this.initializeComponents();
  }

  private initializeComponents(): void {
    // Analytics Widget Component
    this.components.set('analytics-widget', {
      id: 'analytics-widget',
      type: 'analytics-widget',
      position: 'sidebar',
      config: {
        realTimeMetrics: true,
        conversionTracking: true,
        heatmapEnabled: true,
        userJourneyTracking: true
      },
      styles: this.getAnalyticsWidgetStyles(),
      script: this.getAnalyticsWidgetScript(),
      enabled: true,
      priority: 1
    });

    // Lead Capture System
    this.components.set('lead-capture', {
      id: 'lead-capture',
      type: 'lead-capture',
      position: 'overlay',
      config: {
        triggerDelay: 30000, // 30 seconds
        exitIntent: true,
        scrollPercentage: 70,
        formFields: ['name', 'email', 'phone', 'service'],
        integrations: ['email', 'crm', 'calendar']
      },
      styles: this.getLeadCaptureStyles(),
      script: this.getLeadCaptureScript(),
      enabled: true,
      priority: 2
    });

    // Performance Monitor
    this.components.set('performance-monitor', {
      id: 'performance-monitor',
      type: 'performance-monitor',
      position: 'footer',
      config: {
        realTimeMetrics: true,
        alertThresholds: {
          loadTime: 3000,
          errorRate: 0.1,
          conversionDrop: 0.15
        },
        reportingInterval: 300000 // 5 minutes
      },
      styles: this.getPerformanceMonitorStyles(),
      script: this.getPerformanceMonitorScript(),
      enabled: true,
      priority: 3
    });

    // Booking System Integration
    this.components.set('booking-system', {
      id: 'booking-system',
      type: 'booking-system',
      position: 'inline',
      config: {
        serviceTypes: ['portrait', 'wedding', 'commercial', 'event'],
        availability: true,
        pricing: true,
        deposits: true,
        contracts: true
      },
      styles: this.getBookingSystemStyles(),
      script: this.getBookingSystemScript(),
      enabled: true,
      priority: 4
    });

    // Client Portal
    this.components.set('client-portal', {
      id: 'client-portal',
      type: 'client-portal',
      position: 'header',
      config: {
        galleries: true,
        messaging: true,
        invoicing: true,
        scheduling: true,
        fileSharing: true
      },
      styles: this.getClientPortalStyles(),
      script: this.getClientPortalScript(),
      enabled: true,
      priority: 5
    });
  }

  async mountAIUX(websiteIQ: WebsiteIQ, portalConfig: ClientPortalConfig): Promise<MountResult> {
    try {
      const selectedComponents = this.selectOptimalComponents(websiteIQ);
      const injectionCode = this.generateInjectionCode(selectedComponents, portalConfig);
      const implementationPlan = this.createImplementationPlan(selectedComponents, websiteIQ);
      
      // Calculate expected impact
      const performanceImpact = this.calculatePerformanceImpact(selectedComponents);
      const conversionIncrease = this.estimateConversionIncrease(websiteIQ, selectedComponents);
      
      const result: MountResult = {
        success: true,
        componentsInjected: selectedComponents.map(c => c.id),
        performanceImpact,
        estimatedConversionIncrease: conversionIncrease,
        implementationDetails: implementationPlan.steps,
        nextSteps: implementationPlan.nextSteps
      };

      // Store implementation details for deployment
      await this.storeImplementationConfig(websiteIQ.url, {
        components: selectedComponents,
        portalConfig,
        injectionCode,
        result
      });

      return result;

    } catch (error) {
      console.error('Dashboard injection error:', error);
      throw new Error(`Failed to mount AI UX components: ${error}`);
    }
  }

  private selectOptimalComponents(websiteIQ: WebsiteIQ): AIUXComponent[] {
    const selected: AIUXComponent[] = [];
    
    // Always include analytics for performance tracking
    selected.push(this.components.get('analytics-widget')!);
    
    // Add lead capture if conversion rate is low
    if (websiteIQ.conversionRate < 5) {
      selected.push(this.components.get('lead-capture')!);
    }
    
    // Add performance monitoring if site is slow
    if (websiteIQ.performanceScore < 70) {
      selected.push(this.components.get('performance-monitor')!);
    }
    
    // Add booking system for service businesses
    if (websiteIQ.businessType === 'photography' || websiteIQ.businessType === 'wedding') {
      selected.push(this.components.get('booking-system')!);
    }
    
    // Add client portal for businesses with repeat customers
    if (websiteIQ.potentialRevenue > 50000) {
      selected.push(this.components.get('client-portal')!);
    }
    
    return selected.sort((a, b) => a.priority - b.priority);
  }

  private generateInjectionCode(components: AIUXComponent[], config: ClientPortalConfig): string {
    let injectionCode = `
<!-- DWC AI UX Enhancement Suite -->
<script>
window.DWCConfig = ${JSON.stringify(config)};
window.DWCComponents = {};
</script>
`;

    // Add component styles
    injectionCode += '<style>\n';
    components.forEach(component => {
      injectionCode += `/* ${component.id} styles */\n`;
      injectionCode += component.styles + '\n\n';
    });
    injectionCode += '</style>\n';

    // Add component scripts
    components.forEach(component => {
      injectionCode += `<script>\n/* ${component.id} initialization */\n`;
      injectionCode += component.script + '\n</script>\n';
    });

    // Add main initialization script
    injectionCode += `
<script>
// DWC AI UX Suite Main Initialization
(function() {
  'use strict';
  
  // Initialize all components after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDWCComponents);
  } else {
    initializeDWCComponents();
  }
  
  function initializeDWCComponents() {
    console.log('Initializing DWC AI UX Components...');
    
    // Start real-time analytics
    if (window.DWCComponents.Analytics) {
      window.DWCComponents.Analytics.start();
    }
    
    // Initialize lead capture
    if (window.DWCComponents.LeadCapture) {
      window.DWCComponents.LeadCapture.initialize();
    }
    
    // Start performance monitoring
    if (window.DWCComponents.PerformanceMonitor) {
      window.DWCComponents.PerformanceMonitor.start();
    }
    
    // Initialize booking system
    if (window.DWCComponents.BookingSystem) {
      window.DWCComponents.BookingSystem.mount();
    }
    
    // Initialize client portal
    if (window.DWCComponents.ClientPortal) {
      window.DWCComponents.ClientPortal.initialize();
    }
    
    console.log('DWC AI UX Components initialized successfully');
  }
})();
</script>
`;

    return injectionCode;
  }

  private createImplementationPlan(components: AIUXComponent[], websiteIQ: WebsiteIQ): any {
    const steps: string[] = [];
    const nextSteps: string[] = [];
    
    steps.push('1. Backup existing website files');
    steps.push('2. Add DWC AI UX component scripts to website header');
    steps.push('3. Configure component settings based on business requirements');
    steps.push('4. Test all components in staging environment');
    steps.push('5. Deploy to production with monitoring enabled');
    
    if (components.some(c => c.type === 'analytics-widget')) {
      steps.push('6. Set up analytics dashboards and reporting');
      nextSteps.push('Monitor conversion metrics daily for first 2 weeks');
    }
    
    if (components.some(c => c.type === 'lead-capture')) {
      steps.push('7. Configure lead capture forms and CRM integration');
      nextSteps.push('Review lead capture performance and optimize triggers');
    }
    
    if (components.some(c => c.type === 'booking-system')) {
      steps.push('8. Set up booking calendar and payment processing');
      nextSteps.push('Train staff on new booking system workflow');
    }
    
    nextSteps.push('Schedule performance review in 30 days');
    nextSteps.push('Plan next phase of optimization based on data');
    
    return { steps, nextSteps };
  }

  private calculatePerformanceImpact(components: AIUXComponent[]): number {
    // Calculate estimated performance impact (negative = improvement)
    let impact = 0;
    
    components.forEach(component => {
      switch (component.type) {
        case 'analytics-widget':
          impact += 2; // Small script load
          break;
        case 'lead-capture':
          impact += 1; // Minimal impact
          break;
        case 'performance-monitor':
          impact -= 5; // Actually improves performance through optimization
          break;
        case 'booking-system':
          impact += 3; // Additional functionality
          break;
        case 'client-portal':
          impact += 4; // More complex component
          break;
      }
    });
    
    return Math.max(-10, Math.min(10, impact)); // Cap between -10 and 10
  }

  private estimateConversionIncrease(websiteIQ: WebsiteIQ, components: AIUXComponent[]): number {
    let increase = 0;
    
    components.forEach(component => {
      switch (component.type) {
        case 'analytics-widget':
          increase += 5; // 5% from better tracking
          break;
        case 'lead-capture':
          increase += 25; // 25% from better lead capture
          break;
        case 'performance-monitor':
          increase += 10; // 10% from performance optimization
          break;
        case 'booking-system':
          increase += 35; // 35% from streamlined booking
          break;
        case 'client-portal':
          increase += 15; // 15% from improved client experience
          break;
      }
    });
    
    // Adjust based on current performance
    const currentEfficiency = (websiteIQ.seoScore + websiteIQ.designScore + websiteIQ.performanceScore) / 3;
    const multiplier = (100 - currentEfficiency) / 100;
    
    return Math.round(increase * multiplier);
  }

  private async storeImplementationConfig(url: string, config: any): Promise<void> {
    // Store implementation configuration for later deployment
    // This would typically save to database or file system
    console.log(`Storing implementation config for ${url}:`, {
      timestamp: new Date(),
      components: config.components.length,
      estimatedImpact: config.result.estimatedConversionIncrease
    });
  }

  // Component Style Definitions
  private getAnalyticsWidgetStyles(): string {
    return `
.dwc-analytics-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 10px;
  padding: 15px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  z-index: 10000;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dwc-analytics-widget h4 {
  margin: 0 0 10px 0;
  color: #4ade80;
  font-size: 14px;
}

.dwc-metric {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  padding: 5px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
}

.dwc-metric-value {
  font-weight: bold;
  color: #60a5fa;
}
`;
  }

  private getAnalyticsWidgetScript(): string {
    return `
window.DWCComponents.Analytics = {
  data: {
    pageViews: 0,
    sessionTime: 0,
    conversions: 0,
    bounceRate: 0
  },
  
  start: function() {
    this.createWidget();
    this.startTracking();
    this.updateMetrics();
  },
  
  createWidget: function() {
    const widget = document.createElement('div');
    widget.className = 'dwc-analytics-widget';
    widget.innerHTML = \`
      <h4>📊 Live Metrics</h4>
      <div class="dwc-metric">
        <span>Page Views</span>
        <span class="dwc-metric-value" id="dwc-pageviews">0</span>
      </div>
      <div class="dwc-metric">
        <span>Session Time</span>
        <span class="dwc-metric-value" id="dwc-sessiontime">0s</span>
      </div>
      <div class="dwc-metric">
        <span>Conversions</span>
        <span class="dwc-metric-value" id="dwc-conversions">0</span>
      </div>
    \`;
    document.body.appendChild(widget);
  },
  
  startTracking: function() {
    // Track page view
    this.data.pageViews++;
    
    // Track session time
    this.sessionStart = Date.now();
    setInterval(() => {
      this.data.sessionTime = Math.floor((Date.now() - this.sessionStart) / 1000);
      this.updateDisplay();
    }, 1000);
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      maxScroll = Math.max(maxScroll, scrollPercent);
    });
  },
  
  updateMetrics: function() {
    setInterval(() => {
      this.updateDisplay();
    }, 5000);
  },
  
  updateDisplay: function() {
    if (document.getElementById('dwc-pageviews')) {
      document.getElementById('dwc-pageviews').textContent = this.data.pageViews;
      document.getElementById('dwc-sessiontime').textContent = this.data.sessionTime + 's';
      document.getElementById('dwc-conversions').textContent = this.data.conversions;
    }
  }
};
`;
  }

  private getLeadCaptureStyles(): string {
    return `
.dwc-lead-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dwc-lead-overlay.show {
  opacity: 1;
}

.dwc-lead-form {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
  position: relative;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dwc-lead-form h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  text-align: center;
}

.dwc-form-group {
  margin-bottom: 15px;
}

.dwc-form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.dwc-form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.dwc-submit-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dwc-submit-btn:hover {
  background: #2563eb;
}

.dwc-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
}
`;
  }

  private getLeadCaptureScript(): string {
    return `
window.DWCComponents.LeadCapture = {
  triggered: false,
  
  initialize: function() {
    this.setupTriggers();
    this.createForm();
  },
  
  setupTriggers: function() {
    // Time-based trigger
    setTimeout(() => {
      if (!this.triggered) this.show();
    }, 30000);
    
    // Scroll-based trigger
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !this.triggered) {
        this.show();
      }
    });
    
    // Exit intent trigger
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !this.triggered) {
        this.show();
      }
    });
  },
  
  createForm: function() {
    const overlay = document.createElement('div');
    overlay.className = 'dwc-lead-overlay';
    overlay.id = 'dwc-lead-overlay';
    overlay.innerHTML = \`
      <div class="dwc-lead-form">
        <button class="dwc-close-btn" onclick="window.DWCComponents.LeadCapture.hide()">&times;</button>
        <h3>Get Your Free Consultation</h3>
        <form id="dwc-lead-form" onsubmit="window.DWCComponents.LeadCapture.submit(event)">
          <div class="dwc-form-group">
            <input type="text" name="name" placeholder="Your Name" required>
          </div>
          <div class="dwc-form-group">
            <input type="email" name="email" placeholder="Your Email" required>
          </div>
          <div class="dwc-form-group">
            <input type="tel" name="phone" placeholder="Your Phone">
          </div>
          <button type="submit" class="dwc-submit-btn">Get Free Consultation</button>
        </form>
      </div>
    \`;
    document.body.appendChild(overlay);
  },
  
  show: function() {
    if (this.triggered) return;
    this.triggered = true;
    const overlay = document.getElementById('dwc-lead-overlay');
    if (overlay) {
      overlay.classList.add('show');
    }
  },
  
  hide: function() {
    const overlay = document.getElementById('dwc-lead-overlay');
    if (overlay) {
      overlay.classList.remove('show');
    }
  },
  
  submit: function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Track conversion
    if (window.DWCComponents.Analytics) {
      window.DWCComponents.Analytics.data.conversions++;
    }
    
    console.log('Lead captured:', data);
    this.hide();
    alert('Thank you! We\\'ll be in touch soon.');
  }
};
`;
  }

  private getPerformanceMonitorStyles(): string {
    return `
.dwc-performance-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  z-index: 9999;
  opacity: 0.9;
}

.dwc-perf-metrics {
  display: flex;
  gap: 20px;
}

.dwc-perf-metric {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dwc-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.dwc-status-dot.warning {
  background: #f59e0b;
}

.dwc-status-dot.error {
  background: #ef4444;
}
`;
  }

  private getPerformanceMonitorScript(): string {
    return `
window.DWCComponents.PerformanceMonitor = {
  metrics: {
    loadTime: 0,
    errorCount: 0,
    status: 'good'
  },
  
  start: function() {
    this.createBar();
    this.startMonitoring();
    this.updateDisplay();
  },
  
  createBar: function() {
    const bar = document.createElement('div');
    bar.className = 'dwc-performance-bar';
    bar.innerHTML = \`
      <div class="dwc-perf-metrics">
        <div class="dwc-perf-metric">
          <div class="dwc-status-dot" id="dwc-status-dot"></div>
          <span>Performance: <span id="dwc-load-time">0</span>ms</span>
        </div>
        <div class="dwc-perf-metric">
          <span>Errors: <span id="dwc-error-count">0</span></span>
        </div>
        <div class="dwc-perf-metric">
          <span>Status: <span id="dwc-status">Good</span></span>
        </div>
      </div>
    \`;
    document.body.appendChild(bar);
  },
  
  startMonitoring: function() {
    // Monitor load time
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.updateStatus();
    });
    
    // Monitor errors
    window.addEventListener('error', () => {
      this.metrics.errorCount++;
      this.updateStatus();
    });
  },
  
  updateStatus: function() {
    if (this.metrics.loadTime > 3000 || this.metrics.errorCount > 2) {
      this.metrics.status = 'poor';
    } else if (this.metrics.loadTime > 2000 || this.metrics.errorCount > 0) {
      this.metrics.status = 'fair';
    } else {
      this.metrics.status = 'good';
    }
    this.updateDisplay();
  },
  
  updateDisplay: function() {
    if (document.getElementById('dwc-load-time')) {
      document.getElementById('dwc-load-time').textContent = this.metrics.loadTime;
      document.getElementById('dwc-error-count').textContent = this.metrics.errorCount;
      document.getElementById('dwc-status').textContent = this.metrics.status;
      
      const dot = document.getElementById('dwc-status-dot');
      dot.className = 'dwc-status-dot';
      if (this.metrics.status === 'fair') dot.classList.add('warning');
      if (this.metrics.status === 'poor') dot.classList.add('error');
    }
  }
};
`;
  }

  private getBookingSystemStyles(): string {
    return `
.dwc-booking-widget {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.dwc-booking-widget h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  text-align: center;
}

.dwc-service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.dwc-service-card {
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dwc-service-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.dwc-service-card.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}

.dwc-booking-form {
  display: none;
  margin-top: 20px;
}

.dwc-booking-form.show {
  display: block;
}

.dwc-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.dwc-form-group input,
.dwc-form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
}

.dwc-book-btn {
  width: 100%;
  background: #10b981;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.dwc-book-btn:hover {
  background: #059669;
}
`;
  }

  private getBookingSystemScript(): string {
    return `
window.DWCComponents.BookingSystem = {
  selectedService: null,
  
  mount: function() {
    this.createWidget();
    this.attachEvents();
  },
  
  createWidget: function() {
    const target = document.querySelector('.booking-section, #booking, [data-booking]') || document.body;
    const widget = document.createElement('div');
    widget.className = 'dwc-booking-widget';
    widget.innerHTML = \`
      <h3>Book Your Session</h3>
      <div class="dwc-service-grid">
        <div class="dwc-service-card" data-service="portrait">
          <h4>Portrait</h4>
          <p>$200</p>
        </div>
        <div class="dwc-service-card" data-service="wedding">
          <h4>Wedding</h4>
          <p>$1,500</p>
        </div>
        <div class="dwc-service-card" data-service="commercial">
          <h4>Commercial</h4>
          <p>$500</p>
        </div>
        <div class="dwc-service-card" data-service="event">
          <h4>Event</h4>
          <p>$400</p>
        </div>
      </div>
      <div class="dwc-booking-form" id="dwc-booking-form">
        <div class="dwc-form-row">
          <div class="dwc-form-group">
            <input type="text" name="name" placeholder="Your Name" required>
          </div>
          <div class="dwc-form-group">
            <input type="email" name="email" placeholder="Your Email" required>
          </div>
        </div>
        <div class="dwc-form-row">
          <div class="dwc-form-group">
            <input type="date" name="date" required>
          </div>
          <div class="dwc-form-group">
            <select name="time" required>
              <option value="">Select Time</option>
              <option value="09:00">9:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>
        </div>
        <button type="button" class="dwc-book-btn" onclick="window.DWCComponents.BookingSystem.submitBooking()">
          Book Session
        </button>
      </div>
    \`;
    target.appendChild(widget);
  },
  
  attachEvents: function() {
    document.querySelectorAll('.dwc-service-card').forEach(card => {
      card.addEventListener('click', (e) => {
        document.querySelectorAll('.dwc-service-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedService = card.dataset.service;
        document.getElementById('dwc-booking-form').classList.add('show');
      });
    });
  },
  
  submitBooking: function() {
    if (!this.selectedService) {
      alert('Please select a service first');
      return;
    }
    
    const form = document.getElementById('dwc-booking-form');
    const formData = new FormData();
    form.querySelectorAll('input, select').forEach(input => {
      if (input.value) formData.append(input.name, input.value);
    });
    formData.append('service', this.selectedService);
    
    console.log('Booking submitted:', Object.fromEntries(formData));
    alert('Booking request submitted! We\\'ll confirm your appointment soon.');
    
    // Track conversion
    if (window.DWCComponents.Analytics) {
      window.DWCComponents.Analytics.data.conversions++;
    }
  }
};
`;
  }

  private getClientPortalStyles(): string {
    return `
.dwc-portal-link {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #3b82f6;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  z-index: 10000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.dwc-portal-link:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.dwc-client-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.dwc-client-modal.show {
  display: flex;
}

.dwc-modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.dwc-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.dwc-feature-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.dwc-feature-list li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dwc-feature-icon {
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.dwc-access-btn {
  width: 100%;
  background: #10b981;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
`;
  }

  private getClientPortalScript(): string {
    return `
window.DWCComponents.ClientPortal = {
  initialize: function() {
    this.createPortalLink();
    this.createModal();
  },
  
  createPortalLink: function() {
    const link = document.createElement('a');
    link.className = 'dwc-portal-link';
    link.href = '#';
    link.textContent = '👤 Client Portal';
    link.onclick = (e) => {
      e.preventDefault();
      this.showModal();
    };
    document.body.appendChild(link);
  },
  
  createModal: function() {
    const modal = document.createElement('div');
    modal.className = 'dwc-client-modal';
    modal.id = 'dwc-client-modal';
    modal.innerHTML = \`
      <div class="dwc-modal-content">
        <div class="dwc-modal-header">
          <h3>Client Portal Access</h3>
          <button onclick="window.DWCComponents.ClientPortal.hideModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <p>Access your exclusive client portal for:</p>
        <ul class="dwc-feature-list">
          <li><div class="dwc-feature-icon">📷</div> Private Photo Galleries</li>
          <li><div class="dwc-feature-icon">💬</div> Direct Messaging</li>
          <li><div class="dwc-feature-icon">📅</div> Session Scheduling</li>
          <li><div class="dwc-feature-icon">💳</div> Invoices & Payments</li>
          <li><div class="dwc-feature-icon">📁</div> File Downloads</li>
        </ul>
        <button class="dwc-access-btn" onclick="window.DWCComponents.ClientPortal.accessPortal()">
          Access Portal
        </button>
      </div>
    \`;
    document.body.appendChild(modal);
  },
  
  showModal: function() {
    document.getElementById('dwc-client-modal').classList.add('show');
  },
  
  hideModal: function() {
    document.getElementById('dwc-client-modal').classList.remove('show');
  },
  
  accessPortal: function() {
    alert('Portal access would redirect to secure client area');
    this.hideModal();
    
    // Track portal access
    if (window.DWCComponents.Analytics) {
      window.DWCComponents.Analytics.data.conversions++;
    }
  }
};
`;
  }
}

export const dashboardInjector = new DashboardInjector();