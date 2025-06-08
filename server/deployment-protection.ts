import type { Request, Response, NextFunction } from 'express';

interface DeploymentConfig {
  isProduction: boolean;
  restrictedRoutes: string[];
  adminOnlyRoutes: string[];
  allowedUserRoles: string[];
  emergencyAccess: boolean;
}

export class DeploymentProtection {
  private config: DeploymentConfig;
  private authorizedAdmins = ['DWC2025ASI', 'QuantumWife2025', 'AdminWatson'];

  constructor() {
    this.config = {
      isProduction: process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === 'true',
      restrictedRoutes: [
        '/api/admin/*',
        '/api/test/*',
        '/api/ui/*',
        '/api/deployment/*',
        '/api/puppeteer/*',
        '/api/qq-routing/*',
        '/puppeteer-viewer',
        '/ui-audit-control-panel',
        '/system-command-center',
        '/asi-display-simulator',
        '/quantum-parser',
        '/internal-llm'
      ],
      adminOnlyRoutes: [
        '/mission-control',
        '/financial-command-center',
        '/secure-financial-dashboard',
        '/email-dns-automation'
      ],
      allowedUserRoles: ['customer', 'client', 'prospect'],
      emergencyAccess: false
    };
  }

  // Middleware to protect routes on deployment
  deploymentRouteProtection = (req: Request, res: Response, next: NextFunction) => {
    const requestPath = req.path;
    const isAdmin = this.checkAdminAccess(req);

    // Allow all access in development
    if (!this.config.isProduction) {
      return next();
    }

    // Check if route is completely restricted in production
    const isRestrictedRoute = this.config.restrictedRoutes.some(route => {
      if (route.endsWith('/*')) {
        return requestPath.startsWith(route.slice(0, -2));
      }
      return requestPath === route;
    });

    if (isRestrictedRoute && !isAdmin) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'This feature is not available in the deployed version',
        redirect: '/demo-showcase'
      });
    }

    // Check admin-only routes
    const isAdminOnlyRoute = this.config.adminOnlyRoutes.some(route => 
      requestPath === route || requestPath.startsWith(route + '/')
    );

    if (isAdminOnlyRoute && !isAdmin) {
      return res.status(403).json({
        error: 'Administrative Access Required',
        message: 'Please contact DWC Systems for access to this feature',
        redirect: '/consultant-landing'
      });
    }

    next();
  };

  // Check if user has admin access
  private checkAdminAccess(req: Request): boolean {
    // Check session for admin authentication
    const session = req.session as any;
    if (session?.adminAuthenticated) {
      return true;
    }

    // Check authorization header for admin tokens
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return this.authorizedAdmins.includes(token);
    }

    // Check for emergency access override
    return this.config.emergencyAccess && req.query.emergency === 'DWC_OVERRIDE_2025';
  }

  // Customer-safe route configuration
  getCustomerRoutes(): string[] {
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
      '/resource-estimator',
      '/client-portal',
      '/business-file-system',
      '/funding-research',
      '/professional-roadmap',
      '/professional-whitepaper',
      '/professional-notes',
      '/professional-faq',
      '/contract-generator',
      '/market-expansion-analyzer',
      '/pricing-analytics',
      '/quantum-predictive-analytics',
      '/quantum-compactor-dashboard',
      '/modern-quantum-dashboard'
    ];
  }

  // Generate customer-safe navigation
  getCustomerNavigation(): any[] {
    return [
      { 
        name: 'Overview', 
        path: '/demo-showcase',
        description: 'Platform capabilities and ROI demonstration'
      },
      { 
        name: 'Dashboard', 
        path: '/dashboard',
        description: 'Business intelligence and analytics'
      },
      { 
        name: 'Lead Intelligence', 
        path: '/lead-intelligence',
        description: 'Advanced lead generation and CRM'
      },
      { 
        name: 'ROI Calculator', 
        path: '/roi-calculator',
        description: 'Calculate automation returns'
      },
      { 
        name: 'Automation Builder', 
        path: '/automation-builder',
        description: 'Configure business processes'
      },
      { 
        name: 'Market Research', 
        path: '/market-research',
        description: 'Industry analysis and insights'
      },
      { 
        name: 'Client Portal', 
        path: '/client-portal',
        description: 'Project management and communication'
      },
      { 
        name: 'Roadmap', 
        path: '/professional-roadmap',
        description: 'Strategic planning and milestones'
      }
    ];
  }

  // Hide admin components in production
  shouldShowAdminPanel(): boolean {
    return !this.config.isProduction;
  }

  // Filter admin routes from navigation
  filterNavigationForCustomers(navigation: any[]): any[] {
    if (!this.config.isProduction) return navigation;

    return navigation.filter(item => {
      const isRestricted = this.config.restrictedRoutes.some(route => 
        item.path?.startsWith(route.replace('/*', ''))
      );
      const isAdminOnly = this.config.adminOnlyRoutes.includes(item.path);
      
      return !isRestricted && !isAdminOnly;
    });
  }

  // Emergency admin access (for support)
  enableEmergencyAccess(token: string): boolean {
    if (token === 'DWC_EMERGENCY_2025_OVERRIDE') {
      this.config.emergencyAccess = true;
      setTimeout(() => {
        this.config.emergencyAccess = false;
      }, 30 * 60 * 1000); // 30 minutes
      return true;
    }
    return false;
  }

  // Get deployment status
  getDeploymentStatus() {
    return {
      isProduction: this.config.isProduction,
      customerRoutesCount: this.getCustomerRoutes().length,
      restrictedRoutesCount: this.config.restrictedRoutes.length,
      adminOnlyRoutesCount: this.config.adminOnlyRoutes.length,
      emergencyAccessActive: this.config.emergencyAccess
    };
  }
}

export const deploymentProtection = new DeploymentProtection();