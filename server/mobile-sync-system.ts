import fs from 'fs';
import path from 'path';

interface DashboardRoute {
  name: string;
  path: string;
  hasMobileSupport: boolean;
  component: string;
  file: string;
}

interface MobileSyncResult {
  totalDashboards: number;
  updatedDashboards: number;
  newMobileRoutes: number;
  enhancedRoutes: number;
  errors: string[];
  timestamp: string;
}

class MobileDashboardSync {
  private dashboardRoutes: DashboardRoute[] = [];
  private syncResult: MobileSyncResult = {
    totalDashboards: 0,
    updatedDashboards: 0,
    newMobileRoutes: 0,
    enhancedRoutes: 0,
    errors: [],
    timestamp: new Date().toISOString()
  };

  async scanDashboardRoutes(): Promise<DashboardRoute[]> {
    const appPath = path.join(process.cwd(), 'client/src/App.tsx');
    const pagesDir = path.join(process.cwd(), 'client/src/pages');
    
    try {
      const appContent = fs.readFileSync(appPath, 'utf-8');
      const routes = this.extractRoutes(appContent);
      
      // Check for mobile support in each dashboard
      for (const route of routes) {
        const componentFile = this.findComponentFile(pagesDir, route.component);
        const hasMobileSupport = componentFile ? this.checkMobileSupport(componentFile) : false;
        
        this.dashboardRoutes.push({
          ...route,
          hasMobileSupport,
          file: componentFile || ''
        });
      }
      
      this.syncResult.totalDashboards = this.dashboardRoutes.length;
      return this.dashboardRoutes;
    } catch (error) {
      this.syncResult.errors.push(`Failed to scan routes: ${error}`);
      return [];
    }
  }

  private extractRoutes(appContent: string): Omit<DashboardRoute, 'hasMobileSupport' | 'file'>[] {
    const routes: Omit<DashboardRoute, 'hasMobileSupport' | 'file'>[] = [];
    const routeRegex = /<Route\s+path="([^"]+)"\s+component=\{([^}]+)\}\s*\/>/g;
    
    let match;
    while ((match = routeRegex.exec(appContent)) !== null) {
      const [, path, component] = match;
      if (path && component && !path.includes('*') && path !== '/') {
        routes.push({
          name: this.pathToName(path),
          path,
          component
        });
      }
    }
    
    return routes;
  }

  private pathToName(path: string): string {
    return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private findComponentFile(pagesDir: string, componentName: string): string | null {
    try {
      const files = fs.readdirSync(pagesDir);
      const kebabCase = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      
      for (const file of files) {
        if (file.includes(kebabCase) || file.includes(componentName.toLowerCase())) {
          return path.join(pagesDir, file);
        }
      }
    } catch (error) {
      // Directory might not exist or be accessible
    }
    return null;
  }

  private checkMobileSupport(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.includes('mobile') || 
             content.includes('responsive') || 
             content.includes('sm:') ||
             content.includes('md:') ||
             content.includes('lg:');
    } catch (error) {
      return false;
    }
  }

  async augmentDashboardWithSparklines(dashboard: DashboardRoute): Promise<boolean> {
    if (!dashboard.file) return false;
    
    try {
      const content = fs.readFileSync(dashboard.file, 'utf-8');
      
      // Check if sparklines already integrated
      if (content.includes('InteractiveQuantumSparklines')) {
        this.syncResult.enhancedRoutes++;
        return true;
      }
      
      // Add sparklines import
      const importLine = `import InteractiveQuantumSparklines from "@/components/interactive-quantum-sparklines";`;
      let updatedContent = content;
      
      if (!content.includes(importLine)) {
        const importRegex = /(import.*from.*["'];?\n)/g;
        const matches = Array.from(content.matchAll(importRegex));
        if (matches.length > 0) {
          const lastImport = matches[matches.length - 1];
          const insertIndex = lastImport.index! + lastImport[0].length;
          updatedContent = content.slice(0, insertIndex) + importLine + '\n' + content.slice(insertIndex);
        }
      }
      
      // Add mobile optimization wrapper
      const mobileWrapper = this.generateMobileWrapper(dashboard.name);
      updatedContent = this.wrapWithMobileOptimization(updatedContent, mobileWrapper);
      
      fs.writeFileSync(dashboard.file, updatedContent, 'utf-8');
      this.syncResult.updatedDashboards++;
      return true;
    } catch (error) {
      this.syncResult.errors.push(`Failed to augment ${dashboard.name}: ${error}`);
      return false;
    }
  }

  private generateMobileWrapper(dashboardName: string): string {
    return `
      {/* Mobile Quantum Sparklines Integration */}
      <div className="lg:hidden">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Real-time Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <InteractiveQuantumSparklines />
          </CardContent>
        </Card>
      </div>
    `;
  }

  private wrapWithMobileOptimization(content: string, wrapper: string): string {
    // Find main content area and inject mobile wrapper
    const mainRegex = /<div[^>]*className[^>]*main|content|dashboard[^>]*>/i;
    const match = content.match(mainRegex);
    
    if (match) {
      const insertIndex = content.indexOf(match[0]) + match[0].length;
      return content.slice(0, insertIndex) + '\n' + wrapper + '\n' + content.slice(insertIndex);
    }
    
    return content;
  }

  async createMobileDashboardRoute(dashboard: DashboardRoute): Promise<boolean> {
    const mobileRoutePath = dashboard.path.replace(/^\//, '/mobile-');
    const mobileComponentName = `Mobile${dashboard.component}`;
    
    try {
      // Create mobile-optimized component
      const mobileContent = this.generateMobileDashboard(dashboard);
      const mobilePath = path.join(process.cwd(), `client/src/pages/mobile-${dashboard.component.toLowerCase()}.tsx`);
      
      fs.writeFileSync(mobilePath, mobileContent, 'utf-8');
      
      // Add route to App.tsx
      await this.addRouteToApp(mobileRoutePath, mobileComponentName);
      
      this.syncResult.newMobileRoutes++;
      return true;
    } catch (error) {
      this.syncResult.errors.push(`Failed to create mobile route for ${dashboard.name}: ${error}`);
      return false;
    }
  }

  private generateMobileDashboard(dashboard: DashboardRoute): string {
    return `import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Activity, Gauge } from 'lucide-react';
import InteractiveQuantumSparklines from "@/components/interactive-quantum-sparklines";

export default function Mobile${dashboard.component}() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Mobile Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">${dashboard.name}</h1>
            </div>
            <Badge variant="outline" className="text-xs">Mobile</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="sparklines" className="text-xs">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">${dashboard.name} Mobile Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mobile-optimized view for ${dashboard.name.toLowerCase()} operations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sparklines" className="space-y-4">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Real-time Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <InteractiveQuantumSparklines />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}`;
  }

  private async addRouteToApp(routePath: string, componentName: string): Promise<void> {
    const appPath = path.join(process.cwd(), 'client/src/App.tsx');
    let content = fs.readFileSync(appPath, 'utf-8');
    
    // Add import
    const importLine = `import ${componentName} from "@/pages/${componentName.toLowerCase()}";`;
    if (!content.includes(importLine)) {
      const importRegex = /(import.*from.*["'];?\n)/g;
      const matches = Array.from(content.matchAll(importRegex));
      if (matches.length > 0) {
        const lastImport = matches[matches.length - 1];
        const insertIndex = lastImport.index! + lastImport[0].length;
        content = content.slice(0, insertIndex) + importLine + '\n' + content.slice(insertIndex);
      }
    }
    
    // Add route
    const routeLine = `            <Route path="${routePath}" component={${componentName}} />`;
    if (!content.includes(routeLine)) {
      const routeRegex = /(\s+<Route path="[^"]*" component=\{[^}]+\} \/>)/g;
      const matches = Array.from(content.matchAll(routeRegex));
      if (matches.length > 0) {
        const lastRoute = matches[matches.length - 1];
        const insertIndex = lastRoute.index! + lastRoute[0].length;
        content = content.slice(0, insertIndex) + '\n' + routeLine + content.slice(insertIndex);
      }
    }
    
    fs.writeFileSync(appPath, content, 'utf-8');
  }

  async syncAllDashboards(scope: 'mobile' | 'all' = 'mobile', force: boolean = false): Promise<MobileSyncResult> {
    console.log(`🔄 Starting mobile dashboard sync - scope: ${scope}, force: ${force}`);
    
    // Scan all dashboard routes
    await this.scanDashboardRoutes();
    
    for (const dashboard of this.dashboardRoutes) {
      console.log(`📱 Processing ${dashboard.name}...`);
      
      if (dashboard.hasMobileSupport || force) {
        // Augment existing dashboard with sparklines
        await this.augmentDashboardWithSparklines(dashboard);
      } else {
        // Create new mobile route
        await this.createMobileDashboardRoute(dashboard);
      }
    }
    
    // Save sync status to Watson storage
    await this.saveToWatsonStorage();
    
    console.log(`✅ Mobile sync complete: ${this.syncResult.updatedDashboards} updated, ${this.syncResult.newMobileRoutes} new routes`);
    return this.syncResult;
  }

  private async saveToWatsonStorage(): Promise<void> {
    try {
      const storageDir = path.join(process.cwd(), 'WATSON');
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      
      const syncData = {
        ...this.syncResult,
        dashboards: this.dashboardRoutes,
        lastSync: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(storageDir, 'mobile_sync.json'),
        JSON.stringify(syncData, null, 2),
        'utf-8'
      );
    } catch (error) {
      this.syncResult.errors.push(`Failed to save to Watson storage: ${error}`);
    }
  }

  getStatus(): MobileSyncResult {
    return this.syncResult;
  }
}

export { MobileDashboardSync, type MobileSyncResult, type DashboardRoute };