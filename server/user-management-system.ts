/**
 * TRD User Management System - Role-Based Access Control
 * Integrated with Watson Core Memory Ring for dashboard synchronization
 */
import { permissionsBootstrap } from './permissions-bootstrap';

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  dashboardAccess: string[];
  moduleVisibility: string[];
  clearanceLevel: 'viewer' | 'ops' | 'exec' | 'admin';
}

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  fingerprint: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastAccess?: Date;
  dashboardPreferences: Record<string, any>;
}

export interface AccessScope {
  dashboard: string;
  modules: string[];
  permissions: string[];
  restrictions: string[];
}

export class UserManagementSystem {
  private users: Map<string, SystemUser> = new Map();
  private roles: Map<string, UserRole> = new Map();
  private accessScopes: Map<string, AccessScope[]> = new Map();
  private watsonCoreMemoryRing: any;

  constructor() {
    this.initializeDefaultRoles();
    this.initializeWatsonCoreMemoryRing();
  }

  private initializeDefaultRoles() {
    console.log('🔐 Initializing default user roles...');

    // Admin Role - Full System Access
    const adminRole: UserRole = {
      id: 'admin',
      name: 'System Administrator',
      description: 'Full system access with all administrative privileges',
      permissions: [
        'system_administration',
        'user_management',
        'watson_unlock_protocol',
        'database_direct_access',
        'financial_records_access',
        'audit_log_access',
        'deployment_controls',
        'api_key_management',
        'security_settings'
      ],
      dashboardAccess: [
        'infinity_sovereign_control',
        'kaizen_master_dashboard',
        'watson_command_console',
        'watson_dw_unlock',
        'authentic_lead_generator',
        'pricing_strategy_engine',
        'mobile_app_framework',
        'business_sustainability_tracker',
        'layer_chart_dashboard',
        'admin_panel'
      ],
      moduleVisibility: [
        'admin_panel_access',
        'database_direct_access',
        'system_configuration',
        'user_management',
        'financial_records',
        'audit_logs',
        'security_settings',
        'api_key_management',
        'deployment_controls',
        'watson_intelligence_core'
      ],
      clearanceLevel: 'admin'
    };

    // Executive Role - Strategic Access
    const execRole: UserRole = {
      id: 'exec',
      name: 'Executive',
      description: 'Strategic oversight with executive-level reporting and analytics',
      permissions: [
        'executive_reporting',
        'financial_overview',
        'strategic_analytics',
        'business_valuation_access',
        'investor_presentations',
        'performance_metrics'
      ],
      dashboardAccess: [
        'infinity_sovereign_control',
        'kaizen_master_dashboard',
        'watson_command_console',
        'authentic_lead_generator',
        'pricing_strategy_engine',
        'business_sustainability_tracker',
        'layer_chart_dashboard'
      ],
      moduleVisibility: [
        'business_valuation',
        'investor_presentations',
        'strategic_analytics',
        'performance_metrics',
        'financial_overview',
        'lead_management'
      ],
      clearanceLevel: 'exec'
    };

    // Operations Role - Day-to-Day Management
    const opsRole: UserRole = {
      id: 'ops',
      name: 'Operations Manager',
      description: 'Operational management with access to daily workflows and automation',
      permissions: [
        'operations_management',
        'workflow_automation',
        'lead_management',
        'client_communications',
        'task_automation',
        'reporting_access'
      ],
      dashboardAccess: [
        'kaizen_master_dashboard',
        'authentic_lead_generator',
        'pricing_strategy_engine',
        'mobile_app_framework',
        'business_sustainability_tracker',
        'layer_chart_dashboard'
      ],
      moduleVisibility: [
        'lead_management',
        'workflow_automation',
        'client_communications',
        'task_automation',
        'reporting_access',
        'mobile_app_access'
      ],
      clearanceLevel: 'ops'
    };

    // Viewer Role - Read-Only Access
    const viewerRole: UserRole = {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to selected dashboards and reports',
      permissions: [
        'dashboard_viewing',
        'report_viewing',
        'basic_analytics'
      ],
      dashboardAccess: [
        'business_sustainability_tracker',
        'layer_chart_dashboard'
      ],
      moduleVisibility: [
        'basic_analytics',
        'report_viewing',
        'dashboard_viewing'
      ],
      clearanceLevel: 'viewer'
    };

    this.roles.set('admin', adminRole);
    this.roles.set('exec', execRole);
    this.roles.set('ops', opsRole);
    this.roles.set('viewer', viewerRole);

    console.log(`✅ Initialized ${this.roles.size} default roles`);
  }

  private initializeWatsonCoreMemoryRing() {
    console.log('🧠 Initializing Watson Core Memory Ring for user management...');
    
    this.watsonCoreMemoryRing = {
      userSessions: new Map(),
      dashboardStates: new Map(),
      accessLogs: [],
      synchronizedUsers: new Set(),
      
      syncUserToDashboards: (user: SystemUser) => {
        console.log(`🔄 Syncing user ${user.username} to all accessible dashboards`);
        
        user.role.dashboardAccess.forEach(dashboard => {
          this.watsonCoreMemoryRing.dashboardStates.set(`${dashboard}_${user.id}`, {
            userId: user.id,
            dashboard,
            accessLevel: user.role.clearanceLevel,
            modules: user.role.moduleVisibility,
            permissions: user.role.permissions,
            lastSync: new Date()
          });
        });
        
        this.watsonCoreMemoryRing.synchronizedUsers.add(user.id);
        
        // Log to Watson Intelligence Core
        const watsonCore = permissionsBootstrap.getWatsonIntelligenceCore();
        watsonCore.logAccess('USER_SYNC', `user_${user.id}`, 'SUCCESS');
      },
      
      getUserDashboardAccess: (userId: string) => {
        const userStates = [];
        for (const [key, state] of this.watsonCoreMemoryRing.dashboardStates) {
          if (key.includes(`_${userId}`)) {
            userStates.push(state);
          }
        }
        return userStates;
      },
      
      logUserAccess: (userId: string, action: string, resource: string) => {
        this.watsonCoreMemoryRing.accessLogs.push({
          timestamp: new Date(),
          userId,
          action,
          resource,
          synchronized: this.watsonCoreMemoryRing.synchronizedUsers.has(userId)
        });
      }
    };

    console.log('✅ Watson Core Memory Ring initialized');
  }

  public createUser(userData: {
    username: string;
    email: string;
    fingerprint?: string;
    roleId: string;
    dashboardPreferences?: Record<string, any>;
  }): SystemUser {
    console.log(`👤 Creating user: ${userData.username}`);

    const role = this.roles.get(userData.roleId);
    if (!role) {
      throw new Error(`Role ${userData.roleId} not found`);
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const fingerprint = userData.fingerprint || this.generateUserFingerprint(userData.username, userData.email);

    const newUser: SystemUser = {
      id: userId,
      username: userData.username,
      email: userData.email,
      fingerprint,
      role,
      isActive: true,
      createdAt: new Date(),
      dashboardPreferences: userData.dashboardPreferences || {}
    };

    this.users.set(userId, newUser);
    
    // Create access scopes for each dashboard
    this.createUserAccessScopes(newUser);
    
    // Sync to Watson Core Memory Ring
    this.watsonCoreMemoryRing.syncUserToDashboards(newUser);
    
    console.log(`✅ User ${userData.username} created with ${role.name} role`);
    return newUser;
  }

  private createUserAccessScopes(user: SystemUser) {
    const scopes: AccessScope[] = [];
    
    user.role.dashboardAccess.forEach(dashboard => {
      const scope: AccessScope = {
        dashboard,
        modules: user.role.moduleVisibility.filter(module => 
          this.isDashboardModuleCompatible(dashboard, module)
        ),
        permissions: user.role.permissions,
        restrictions: this.getDashboardRestrictions(dashboard, user.role.clearanceLevel)
      };
      scopes.push(scope);
    });
    
    this.accessScopes.set(user.id, scopes);
  }

  private isDashboardModuleCompatible(dashboard: string, module: string): boolean {
    const dashboardModuleMap: Record<string, string[]> = {
      'infinity_sovereign_control': ['admin_panel_access', 'system_configuration', 'watson_intelligence_core'],
      'kaizen_master_dashboard': ['workflow_automation', 'deployment_controls', 'system_configuration'],
      'watson_command_console': ['watson_intelligence_core', 'system_configuration', 'audit_logs'],
      'watson_dw_unlock': ['admin_panel_access', 'watson_intelligence_core', 'security_settings'],
      'authentic_lead_generator': ['lead_management', 'client_communications'],
      'pricing_strategy_engine': ['financial_records', 'business_valuation'],
      'mobile_app_framework': ['mobile_app_access', 'client_communications'],
      'business_sustainability_tracker': ['performance_metrics', 'basic_analytics'],
      'layer_chart_dashboard': ['reporting_access', 'basic_analytics', 'performance_metrics'],
      'admin_panel': ['admin_panel_access', 'user_management', 'security_settings']
    };
    
    const compatibleModules = dashboardModuleMap[dashboard] || [];
    return compatibleModules.includes(module);
  }

  private getDashboardRestrictions(dashboard: string, clearanceLevel: string): string[] {
    const restrictions: Record<string, Record<string, string[]>> = {
      'viewer': {
        'infinity_sovereign_control': ['no_access'],
        'watson_command_console': ['no_access'],
        'watson_dw_unlock': ['no_access'],
        'admin_panel': ['no_access']
      },
      'ops': {
        'watson_dw_unlock': ['no_access'],
        'admin_panel': ['read_only']
      },
      'exec': {
        'watson_dw_unlock': ['limited_access']
      },
      'admin': {}
    };
    
    return restrictions[clearanceLevel]?.[dashboard] || [];
  }

  private generateUserFingerprint(username: string, email: string): string {
    const timestamp = Date.now();
    const hash = btoa(`${username}_${email}_${timestamp}`).replace(/[^a-zA-Z0-9]/g, '');
    return `FP_${hash.substring(0, 16).toUpperCase()}`;
  }

  public assignModuleVisibility(userId: string, modules: string[]): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    // Update user's role module visibility
    user.role.moduleVisibility = [...new Set([...user.role.moduleVisibility, ...modules])];
    
    // Recreate access scopes
    this.createUserAccessScopes(user);
    
    // Re-sync to Watson Core Memory Ring
    this.watsonCoreMemoryRing.syncUserToDashboards(user);
    
    console.log(`📝 Updated module visibility for user ${user.username}`);
    return true;
  }

  public enableDashboardAccess(userId: string, dashboards: string[]): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    // Update user's dashboard access
    user.role.dashboardAccess = [...new Set([...user.role.dashboardAccess, ...dashboards])];
    
    // Recreate access scopes
    this.createUserAccessScopes(user);
    
    // Re-sync to Watson Core Memory Ring
    this.watsonCoreMemoryRing.syncUserToDashboards(user);
    
    console.log(`🔓 Enabled dashboard access for user ${user.username}`);
    return true;
  }

  public getUserAccessPreview(userId: string): {
    user: SystemUser;
    dashboards: string[];
    modules: string[];
    permissions: string[];
    restrictions: Record<string, string[]>;
  } | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const accessScopes = this.accessScopes.get(userId) || [];
    const restrictions: Record<string, string[]> = {};
    
    accessScopes.forEach(scope => {
      if (scope.restrictions.length > 0) {
        restrictions[scope.dashboard] = scope.restrictions;
      }
    });

    return {
      user,
      dashboards: user.role.dashboardAccess,
      modules: user.role.moduleVisibility,
      permissions: user.role.permissions,
      restrictions
    };
  }

  public getAllUsers(): SystemUser[] {
    return Array.from(this.users.values());
  }

  public getAllRoles(): UserRole[] {
    return Array.from(this.roles.values());
  }

  public getUsersSummaryTable(): {
    totalUsers: number;
    usersByRole: Record<string, number>;
    users: Array<{
      username: string;
      email: string;
      role: string;
      dashboardCount: number;
      moduleCount: number;
      isActive: boolean;
      lastSync: string;
    }>;
  } {
    const users = this.getAllUsers();
    const usersByRole: Record<string, number> = {};
    
    const userSummaries = users.map(user => {
      // Count role occurrences
      usersByRole[user.role.name] = (usersByRole[user.role.name] || 0) + 1;
      
      const dashboardState = this.watsonCoreMemoryRing.getUserDashboardAccess(user.id);
      const lastSync = dashboardState.length > 0 
        ? Math.max(...dashboardState.map(d => d.lastSync?.getTime() || 0))
        : 0;
      
      return {
        username: user.username,
        email: user.email,
        role: user.role.name,
        dashboardCount: user.role.dashboardAccess.length,
        moduleCount: user.role.moduleVisibility.length,
        isActive: user.isActive,
        lastSync: lastSync > 0 ? new Date(lastSync).toISOString() : 'Never'
      };
    });

    return {
      totalUsers: users.length,
      usersByRole,
      users: userSummaries
    };
  }

  public getWatsonCoreMemoryRing() {
    return this.watsonCoreMemoryRing;
  }
}

export const userManagementSystem = new UserManagementSystem();