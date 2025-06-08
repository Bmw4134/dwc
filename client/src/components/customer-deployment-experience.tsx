import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Building2,
  TrendingUp,
  BarChart3,
  Calculator,
  Settings,
  FileText
} from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  description: string;
  icon: any;
  category: 'core' | 'analytics' | 'tools' | 'resources';
}

interface DeploymentStatus {
  isProduction: boolean;
  customerRoutesCount: number;
  restrictedRoutesCount: number;
  adminOnlyRoutesCount: number;
  emergencyAccessActive: boolean;
}

export default function CustomerDeploymentExperience() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [customerNavigation, setCustomerNavigation] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeploymentData = async () => {
      try {
        // Get deployment status
        const statusResponse = await fetch('/api/deployment/status');
        const status = await statusResponse.json();
        setDeploymentStatus(status);

        // Get customer-safe navigation
        const navResponse = await fetch('/api/navigation/customer');
        const navigation = await navResponse.json();
        
        // Add icons to navigation items
        const enhancedNavigation = navigation.map((item: any) => ({
          ...item,
          icon: getIconForPath(item.path),
          category: getCategoryForPath(item.path)
        }));
        
        setCustomerNavigation(enhancedNavigation);
      } catch (error) {
        console.error('Failed to fetch deployment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeploymentData();
  }, []);

  const getIconForPath = (path: string) => {
    const iconMap: { [key: string]: any } = {
      '/demo-showcase': TrendingUp,
      '/dashboard': BarChart3,
      '/lead-intelligence': Users,
      '/roi-calculator': Calculator,
      '/automation-builder': Settings,
      '/market-research': Building2,
      '/client-portal': Shield,
      '/professional-roadmap': FileText
    };
    return iconMap[path] || CheckCircle;
  };

  const getCategoryForPath = (path: string): 'core' | 'analytics' | 'tools' | 'resources' => {
    if (['/demo-showcase', '/dashboard'].includes(path)) return 'core';
    if (['/market-research', '/quantum-predictive-analytics'].includes(path)) return 'analytics';
    if (['/roi-calculator', '/automation-builder'].includes(path)) return 'tools';
    return 'resources';
  };

  const navigateToPage = (path: string) => {
    window.location.href = path;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading platform...</p>
        </div>
      </div>
    );
  }

  const categorizedNavigation = {
    core: customerNavigation.filter(item => item.category === 'core'),
    analytics: customerNavigation.filter(item => item.category === 'analytics'),
    tools: customerNavigation.filter(item => item.category === 'tools'),
    resources: customerNavigation.filter(item => item.category === 'resources')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              DWC Systems Platform
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Enterprise ASI Automation & Intelligence Suite
          </p>
          
          {/* Deployment Status */}
          {deploymentStatus && (
            <Alert className="max-w-2xl mx-auto mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {deploymentStatus.isProduction ? (
                  <span className="text-green-600 font-medium">
                    Production Environment - {deploymentStatus.customerRoutesCount} features available
                  </span>
                ) : (
                  <span className="text-blue-600 font-medium">
                    Development Environment - Full access enabled
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Core Platform Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Core Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedNavigation.core.map((item) => (
              <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage(item.path)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <item.icon className="h-5 w-5 mr-2 text-blue-600" />
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {item.description}
                  </p>
                  <Button size="sm" className="w-full">
                    Access {item.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Analytics & Intelligence */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-green-600" />
            Analytics & Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedNavigation.analytics.map((item) => (
              <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage(item.path)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <item.icon className="h-5 w-5 mr-2 text-green-600" />
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {item.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Explore {item.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tools & Automation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-purple-600" />
            Tools & Automation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedNavigation.tools.map((item) => (
              <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage(item.path)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <item.icon className="h-5 w-5 mr-2 text-purple-600" />
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {item.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use {item.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources & Documentation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-orange-600" />
            Resources & Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedNavigation.resources.map((item) => (
              <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToPage(item.path)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <item.icon className="h-5 w-5 mr-2 text-orange-600" />
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {item.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    View {item.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        {deploymentStatus?.isProduction && (
          <Alert className="max-w-4xl mx-auto">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Secure deployment active. Administrative features are restricted for customer protection.
                </span>
                <Badge variant="secondary" className="ml-4">
                  Production Mode
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}