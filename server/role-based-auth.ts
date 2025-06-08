import { bmiAnalyticsEngine } from './bmi-analytics-engine';
import { tradingEngine } from './pionex-robinhood-trading-engine';

// User roles with specific access levels
export type UserRole = 
  | 'lender'           // Banks, financial institutions
  | 'partner'          // Business partners, Game X Change
  | 'shareholder'      // Equity holders
  | 'board_member'     // Board of directors
  | 'investor'         // Potential investors
  | 'co_owner'         // Tina - full access
  | 'founder'          // Primary founder - full access
  | 'advisor'          // Strategic advisors
  | 'auditor'          // Financial auditors
  | 'compliance';      // Regulatory compliance

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization?: string;
  accessLevel: number; // 1-10 scale
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
  isActive: boolean;
  securityClearance: 'basic' | 'standard' | 'elevated' | 'maximum';
  dashboardConfig: DashboardConfig;
}

export interface DashboardConfig {
  modules: string[];
  widgets: string[];
  dataAccess: string[];
  restrictions: string[];
  theme: 'executive' | 'financial' | 'technical' | 'compliance';
}

// Role-based access matrix
export const rolePermissions: Record<UserRole, {
  accessLevel: number;
  permissions: string[];
  securityClearance: 'basic' | 'standard' | 'elevated' | 'maximum';
  dashboardModules: string[];
  dataAccess: string[];
  restrictions: string[];
}> = {
  lender: {
    accessLevel: 7,
    permissions: [
      'view_financials',
      'view_bmi_analytics',
      'view_revenue_projections',
      'view_risk_assessment',
      'view_collateral_analysis',
      'view_business_metrics',
      'export_financial_reports'
    ],
    securityClearance: 'elevated',
    dashboardModules: [
      'financial_overview',
      'risk_dashboard',
      'revenue_analytics',
      'bmi_confidence_metrics',
      'loan_security_analysis',
      'cash_flow_projections',
      'market_validation'
    ],
    dataAccess: [
      'bmi_analytics',
      'financial_metrics',
      'revenue_data',
      'risk_scores',
      'market_data'
    ],
    restrictions: [
      'no_trading_operations',
      'no_internal_processes',
      'no_technical_details'
    ]
  },
  
  partner: {
    accessLevel: 6,
    permissions: [
      'view_partnership_metrics',
      'view_revenue_sharing',
      'view_market_analytics',
      'view_customer_data',
      'view_growth_projections'
    ],
    securityClearance: 'standard',
    dashboardModules: [
      'partnership_dashboard',
      'revenue_sharing',
      'market_intelligence',
      'customer_analytics',
      'growth_metrics'
    ],
    dataAccess: [
      'partnership_data',
      'revenue_metrics',
      'market_intelligence',
      'customer_insights'
    ],
    restrictions: [
      'no_financial_details',
      'no_trading_operations',
      'no_internal_systems'
    ]
  },

  shareholder: {
    accessLevel: 8,
    permissions: [
      'view_equity_value',
      'view_company_performance',
      'view_financial_statements',
      'view_growth_metrics',
      'view_market_position',
      'view_competitive_analysis',
      'vote_on_proposals'
    ],
    securityClearance: 'elevated',
    dashboardModules: [
      'equity_dashboard',
      'performance_metrics',
      'financial_overview',
      'growth_analytics',
      'market_position',
      'voting_portal'
    ],
    dataAccess: [
      'equity_data',
      'financial_statements',
      'performance_metrics',
      'market_data',
      'competitive_analysis'
    ],
    restrictions: [
      'no_operational_details',
      'no_trading_operations'
    ]
  },

  board_member: {
    accessLevel: 9,
    permissions: [
      'view_all_financials',
      'view_strategic_metrics',
      'view_risk_management',
      'view_governance_data',
      'access_board_materials',
      'vote_on_resolutions',
      'view_executive_reports'
    ],
    securityClearance: 'maximum',
    dashboardModules: [
      'board_dashboard',
      'strategic_overview',
      'financial_governance',
      'risk_management',
      'executive_metrics',
      'governance_portal'
    ],
    dataAccess: [
      'all_financial_data',
      'strategic_metrics',
      'governance_data',
      'risk_assessments',
      'executive_reports'
    ],
    restrictions: [
      'no_trading_operations',
      'no_technical_systems'
    ]
  },

  investor: {
    accessLevel: 5,
    permissions: [
      'view_investment_overview',
      'view_growth_potential',
      'view_market_opportunity',
      'view_financial_highlights',
      'view_team_overview'
    ],
    securityClearance: 'standard',
    dashboardModules: [
      'investor_overview',
      'growth_potential',
      'market_opportunity',
      'financial_highlights',
      'team_showcase'
    ],
    dataAccess: [
      'investment_metrics',
      'growth_data',
      'market_analysis',
      'financial_summary'
    ],
    restrictions: [
      'no_detailed_financials',
      'no_internal_operations',
      'no_trading_data'
    ]
  },

  co_owner: {
    accessLevel: 10,
    permissions: [
      'full_system_access',
      'view_all_data',
      'modify_configurations',
      'access_all_modules',
      'override_restrictions'
    ],
    securityClearance: 'maximum',
    dashboardModules: [
      'executive_command_center',
      'full_analytics_suite',
      'trading_operations',
      'system_administration',
      'all_modules'
    ],
    dataAccess: [
      'all_data_access'
    ],
    restrictions: []
  },

  founder: {
    accessLevel: 10,
    permissions: [
      'full_system_access',
      'view_all_data',
      'modify_configurations',
      'access_all_modules',
      'override_restrictions'
    ],
    securityClearance: 'maximum',
    dashboardModules: [
      'founder_command_center',
      'full_analytics_suite',
      'trading_operations',
      'system_administration',
      'all_modules'
    ],
    dataAccess: [
      'all_data_access'
    ],
    restrictions: []
  },

  advisor: {
    accessLevel: 6,
    permissions: [
      'view_strategic_data',
      'view_market_analysis',
      'view_growth_metrics',
      'provide_recommendations'
    ],
    securityClearance: 'standard',
    dashboardModules: [
      'advisor_dashboard',
      'strategic_insights',
      'market_analysis',
      'recommendation_portal'
    ],
    dataAccess: [
      'strategic_data',
      'market_intelligence',
      'growth_metrics'
    ],
    restrictions: [
      'no_financial_details',
      'no_trading_operations'
    ]
  },

  auditor: {
    accessLevel: 8,
    permissions: [
      'view_financial_records',
      'view_compliance_data',
      'access_audit_trails',
      'generate_audit_reports'
    ],
    securityClearance: 'elevated',
    dashboardModules: [
      'audit_dashboard',
      'financial_records',
      'compliance_monitoring',
      'audit_trails'
    ],
    dataAccess: [
      'financial_records',
      'compliance_data',
      'audit_trails',
      'transaction_logs'
    ],
    restrictions: [
      'no_trading_operations',
      'no_strategic_planning'
    ]
  },

  compliance: {
    accessLevel: 7,
    permissions: [
      'view_compliance_metrics',
      'view_regulatory_data',
      'monitor_violations',
      'generate_compliance_reports'
    ],
    securityClearance: 'elevated',
    dashboardModules: [
      'compliance_dashboard',
      'regulatory_monitoring',
      'violation_tracking',
      'reporting_center'
    ],
    dataAccess: [
      'compliance_data',
      'regulatory_metrics',
      'violation_records',
      'audit_data'
    ],
    restrictions: [
      'no_trading_operations',
      'no_financial_planning'
    ]
  }
};

export class RoleBasedAccessControl {
  private users: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    // Tina - Co-owner with full access
    this.createUser({
      id: 'tina-dwc-001',
      email: 'tina@dwcsystems.com',
      firstName: 'Tina',
      lastName: 'Wilson',
      role: 'co_owner',
      organization: 'DWC Systems LLC',
      isActive: true
    });

    // Founder account
    this.createUser({
      id: 'founder-dwc-001',
      email: 'founder@dwcsystems.com',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'founder',
      organization: 'DWC Systems LLC',
      isActive: true
    });

    // Sample stakeholder accounts for demonstration
    this.createUser({
      id: 'lender-demo-001',
      email: 'lending@firstnational.com',
      firstName: 'Sarah',
      lastName: 'Thompson',
      role: 'lender',
      organization: 'First National Bank',
      isActive: true
    });

    this.createUser({
      id: 'partner-gxc-001',
      email: 'partnership@gamexchange.com',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      role: 'partner',
      organization: 'Game X Change',
      isActive: true
    });
  }

  createUser(userData: Partial<UserProfile>): UserProfile {
    const roleConfig = rolePermissions[userData.role!];
    
    const user: UserProfile = {
      id: userData.id || this.generateUserId(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      role: userData.role!,
      organization: userData.organization,
      accessLevel: roleConfig.accessLevel,
      permissions: roleConfig.permissions,
      createdAt: new Date(),
      isActive: userData.isActive ?? true,
      securityClearance: roleConfig.securityClearance,
      dashboardConfig: {
        modules: roleConfig.dashboardModules,
        widgets: this.generateWidgetsForRole(userData.role!),
        dataAccess: roleConfig.dataAccess,
        restrictions: roleConfig.restrictions,
        theme: this.getThemeForRole(userData.role!)
      }
    };

    this.users.set(user.id, user);
    return user;
  }

  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateWidgetsForRole(role: UserRole): string[] {
    const baseWidgets = ['system_status', 'notifications'];
    
    switch (role) {
      case 'lender':
        return [...baseWidgets, 'bmi_confidence', 'financial_metrics', 'risk_assessment', 'loan_security'];
      case 'partner':
        return [...baseWidgets, 'partnership_metrics', 'revenue_sharing', 'market_data'];
      case 'shareholder':
        return [...baseWidgets, 'equity_value', 'performance_metrics', 'growth_projections'];
      case 'board_member':
        return [...baseWidgets, 'strategic_overview', 'governance_metrics', 'executive_summary'];
      case 'investor':
        return [...baseWidgets, 'investment_overview', 'growth_potential', 'market_opportunity'];
      case 'co_owner':
      case 'founder':
        return [...baseWidgets, 'full_analytics', 'trading_status', 'system_control', 'all_metrics'];
      default:
        return baseWidgets;
    }
  }

  private getThemeForRole(role: UserRole): 'executive' | 'financial' | 'technical' | 'compliance' {
    switch (role) {
      case 'lender':
      case 'auditor':
        return 'financial';
      case 'board_member':
      case 'co_owner':
      case 'founder':
        return 'executive';
      case 'compliance':
        return 'compliance';
      default:
        return 'technical';
    }
  }

  authenticateUser(email: string, password: string): { success: boolean; user?: UserProfile; token?: string } {
    // In production, this would verify against secure password storage
    const user = Array.from(this.users.values()).find(u => u.email === email && u.isActive);
    
    if (user) {
      user.lastLogin = new Date();
      const token = this.generateAccessToken(user);
      
      return {
        success: true,
        user,
        token
      };
    }

    return { success: false };
  }

  private generateAccessToken(user: UserProfile): string {
    // In production, use proper JWT with expiration
    return Buffer.from(JSON.stringify({
      userId: user.id,
      role: user.role,
      accessLevel: user.accessLevel,
      issued: Date.now()
    })).toString('base64');
  }

  verifyAccess(token: string, requiredPermission: string): boolean {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      const user = this.users.get(decoded.userId);
      
      return user?.isActive && user.permissions.includes(requiredPermission);
    } catch {
      return false;
    }
  }

  getUserDashboardData(userId: string): any {
    const user = this.users.get(userId);
    if (!user) return null;

    const bmiData = bmiAnalyticsEngine.generateBMIAnalytics();
    const tradingMetrics = tradingEngine.getTradingMetrics();

    // Filter data based on user's access level and permissions
    return this.filterDataByRole(user, {
      bmi: bmiData,
      trading: tradingMetrics,
      user: user
    });
  }

  private filterDataByRole(user: UserProfile, data: any): any {
    const filtered: any = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization,
        accessLevel: user.accessLevel,
        dashboardConfig: user.dashboardConfig
      }
    };

    // Apply role-based data filtering
    if (user.permissions.includes('view_bmi_analytics')) {
      filtered.bmi = {
        overallConfidence: data.bmi.overallConfidence,
        reliabilityScore: data.bmi.reliabilityScore,
        performanceIndex: data.bmi.performanceIndex,
        businessReadiness: data.bmi.businessReadiness,
        marketConfidence: data.bmi.marketConfidence,
        investorAttractiveness: data.bmi.investorAttractiveness
      };
    }

    if (user.permissions.includes('view_financials') && user.accessLevel >= 7) {
      filtered.financial = {
        revenue: this.generateRevenueData(user.role),
        profitability: this.generateProfitabilityData(user.role),
        cashFlow: this.generateCashFlowData(user.role)
      };
    }

    if (user.role === 'co_owner' || user.role === 'founder') {
      filtered.trading = data.trading;
      filtered.systemMetrics = this.getSystemMetrics();
    }

    return filtered;
  }

  private generateRevenueData(role: UserRole): any {
    // Generate role-appropriate revenue projections
    const baseRevenue = 2500000; // $2.5M projected first year
    
    return {
      current: baseRevenue * 0.15, // Current run rate
      projected: baseRevenue,
      growth: 0.35, // 35% month-over-month
      confidence: role === 'lender' ? 0.92 : 0.85
    };
  }

  private generateProfitabilityData(role: UserRole): any {
    return {
      grossMargin: 0.78,
      netMargin: 0.42,
      ebitda: role === 'lender' ? 0.38 : undefined,
      breakEven: '4 months',
      confidence: 0.87
    };
  }

  private generateCashFlowData(role: UserRole): any {
    return {
      monthly: role === 'lender' ? 125000 : undefined,
      runway: role === 'lender' ? '18 months' : '12+ months',
      burnRate: role === 'lender' ? 45000 : undefined,
      confidence: 0.91
    };
  }

  private getSystemMetrics(): any {
    return {
      uptime: '99.8%',
      responseTime: '120ms',
      errorRate: '0.02%',
      activeUsers: this.getActiveUserCount(),
      systemHealth: 'Excellent'
    };
  }

  private getActiveUserCount(): number {
    return Array.from(this.users.values()).filter(u => u.isActive).length;
  }

  getAllUsers(): UserProfile[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): UserProfile | undefined {
    return this.users.get(id);
  }

  updateUserRole(userId: string, newRole: UserRole): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    const roleConfig = rolePermissions[newRole];
    user.role = newRole;
    user.accessLevel = roleConfig.accessLevel;
    user.permissions = roleConfig.permissions;
    user.securityClearance = roleConfig.securityClearance;
    user.dashboardConfig = {
      modules: roleConfig.dashboardModules,
      widgets: this.generateWidgetsForRole(newRole),
      dataAccess: roleConfig.dataAccess,
      restrictions: roleConfig.restrictions,
      theme: this.getThemeForRole(newRole)
    };

    return true;
  }

  deactivateUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    
    user.isActive = false;
    return true;
  }

  generateConfidenceReport(role: UserRole): any {
    const bmiData = bmiAnalyticsEngine.generateBMIAnalytics();
    
    return {
      role,
      confidenceScore: bmiData.overallConfidence,
      businessReadiness: bmiData.businessReadiness,
      marketValidation: bmiData.marketConfidence,
      riskProfile: bmiData.riskProfile,
      investorAttractiveness: bmiData.investorAttractiveness,
      dataPoints: bmiData.totalDataPoints,
      lastUpdated: new Date(),
      recommendation: this.getRecommendationForRole(role, bmiData.overallConfidence)
    };
  }

  private getRecommendationForRole(role: UserRole, confidence: number): string {
    if (confidence >= 0.9) {
      switch (role) {
        case 'lender':
          return 'STRONG APPROVAL RECOMMENDED - Exceptional business metrics and risk profile';
        case 'investor':
          return 'HIGHLY RECOMMENDED INVESTMENT - Superior growth potential and execution capability';
        case 'partner':
          return 'PREFERRED PARTNERSHIP STATUS - Outstanding collaboration potential';
        default:
          return 'EXCEPTIONAL PERFORMANCE - All metrics exceed industry standards';
      }
    } else if (confidence >= 0.8) {
      switch (role) {
        case 'lender':
          return 'APPROVAL RECOMMENDED - Strong financials with manageable risk';
        case 'investor':
          return 'RECOMMENDED INVESTMENT - Solid growth trajectory and proven execution';
        case 'partner':
          return 'STRATEGIC PARTNERSHIP OPPORTUNITY - Strong mutual benefit potential';
        default:
          return 'STRONG PERFORMANCE - Metrics demonstrate solid execution capability';
      }
    } else {
      return 'DEVELOPING OPPORTUNITY - Continue monitoring performance metrics';
    }
  }
}

export const roleBasedAuth = new RoleBasedAccessControl();