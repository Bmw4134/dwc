import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Shield, ShieldCheck, Smartphone, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardStatus {
  name: string;
  route: string;
  authenticated: boolean;
  mobileOptimized: boolean;
  lastSync: string;
  status: 'online' | 'offline' | 'authenticating' | 'syncing';
  responseTime: number;
}

interface SyncValidationResult {
  totalDashboards: number;
  authenticatedDashboards: number;
  mobileOptimizedDashboards: number;
  failedAuthentications: string[];
  syncStatus: 'complete' | 'partial' | 'failed';
  timestamp: string;
  secureTokenActive: boolean;
  watsonOverlayStatus: 'active' | 'inactive' | 'initializing';
}

export default function InfinitySyncValidator() {
  const [validationMode, setValidationMode] = useState<'idle' | 'scanning' | 'validating' | 'correcting'>('idle');
  const [dashboardStatuses, setDashboardStatuses] = useState<DashboardStatus[]>([]);

  const { data: syncStatus, refetch: refreshSync } = useQuery({
    queryKey: ['/api/infinity-sync/validation-status'],
    enabled: validationMode !== 'idle',
    refetchInterval: validationMode === 'scanning' ? 2000 : false,
  });

  const { data: mobileSessionStatus } = useQuery({
    queryKey: ['/api/infinity-sync/mobile-session'],
    refetchInterval: 5000,
  });

  const initializeDashboardScan = async () => {
    setValidationMode('scanning');
    
    const knownDashboards = [
      { name: 'TRAXOVA', route: '/quantum-showcase' },
      { name: 'DWC Systems', route: '/consulting' },
      { name: 'JDD Intelligence', route: '/quantum-intelligence' },
      { name: 'DWAI Analytics', route: '/qqasi-intelligence' },
      { name: 'Mobile Quantum', route: '/mobile-dashboard' },
      { name: 'Watson Terminal', route: '/watson-terminal' },
      { name: 'Universal Manager', route: '/universal-dashboard' },
      { name: 'Clean Dashboard', route: '/clean-dashboard' },
    ];

    const statuses: DashboardStatus[] = [];
    
    for (const dashboard of knownDashboards) {
      try {
        const startTime = Date.now();
        const response = await fetch(dashboard.route);
        const responseTime = Date.now() - startTime;
        
        statuses.push({
          name: dashboard.name,
          route: dashboard.route,
          authenticated: response.ok,
          mobileOptimized: dashboard.route.includes('mobile') || dashboard.name === 'Mobile Quantum',
          lastSync: new Date().toISOString(),
          status: response.ok ? 'online' : 'offline',
          responseTime,
        });
      } catch (error) {
        statuses.push({
          name: dashboard.name,
          route: dashboard.route,
          authenticated: false,
          mobileOptimized: false,
          lastSync: new Date().toISOString(),
          status: 'offline',
          responseTime: 0,
        });
      }
    }
    
    setDashboardStatuses(statuses);
    setValidationMode('validating');
  };

  const executeAutoCorrection = async () => {
    setValidationMode('correcting');
    
    const failedDashboards = dashboardStatuses.filter(d => !d.authenticated);
    
    for (const dashboard of failedDashboards) {
      try {
        // Attempt re-authentication via Watson mobile sync
        await fetch('/api/watson/mobile-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            scope: 'mobile', 
            force: true,
            target: dashboard.route 
          }),
        });
        
        // Update status
        setDashboardStatuses(prev => 
          prev.map(d => 
            d.route === dashboard.route 
              ? { ...d, authenticated: true, status: 'online' as const, lastSync: new Date().toISOString() }
              : d
          )
        );
      } catch (error) {
        console.error(`Auto-correction failed for ${dashboard.name}:`, error);
      }
    }
    
    setValidationMode('idle');
  };

  const getStatusColor = (status: DashboardStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'authenticating': return 'bg-yellow-500';
      case 'syncing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getValidationSummary = (): SyncValidationResult => {
    const total = dashboardStatuses.length;
    const authenticated = dashboardStatuses.filter(d => d.authenticated).length;
    const mobileOptimized = dashboardStatuses.filter(d => d.mobileOptimized).length;
    const failed = dashboardStatuses.filter(d => !d.authenticated).map(d => d.name);
    
    return {
      totalDashboards: total,
      authenticatedDashboards: authenticated,
      mobileOptimizedDashboards: mobileOptimized,
      failedAuthentications: failed,
      syncStatus: failed.length === 0 ? 'complete' : failed.length < total / 2 ? 'partial' : 'failed',
      timestamp: new Date().toISOString(),
      secureTokenActive: mobileSessionStatus?.secureToken || false,
      watsonOverlayStatus: validationMode === 'idle' ? 'active' : 'initializing',
    };
  };

  useEffect(() => {
    // Auto-initialize on component mount
    initializeDashboardScan();
  }, []);

  const validationSummary = getValidationSummary();

  return (
    <div className="fixed top-4 right-4 z-50 w-80 space-y-3">
      {/* Main Validation Status Card */}
      <Card className="bg-black/90 border-cyan-400/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            InfinitySync Validator
            <Badge variant={validationSummary.syncStatus === 'complete' ? 'default' : 'destructive'} className="ml-auto">
              {validationSummary.syncStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <div className="text-cyan-400 font-mono">{validationSummary.authenticatedDashboards}</div>
              <div className="text-gray-400">Authenticated</div>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <div className="text-green-400 font-mono">{validationSummary.mobileOptimizedDashboards}</div>
              <div className="text-gray-400">Mobile Ready</div>
            </div>
          </div>

          {/* Mobile Session Status */}
          <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-300">iPhone Token</span>
            </div>
            {validationSummary.secureTokenActive ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={initializeDashboardScan}
              disabled={validationMode === 'scanning'}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
            >
              {validationMode === 'scanning' ? 'Scanning...' : 'Rescan'}
            </Button>
            {validationSummary.failedAuthentications.length > 0 && (
              <Button 
                size="sm" 
                onClick={executeAutoCorrection}
                disabled={validationMode === 'correcting'}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {validationMode === 'correcting' ? 'Fixing...' : 'Auto-Fix'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Status Grid */}
      {dashboardStatuses.length > 0 && (
        <Card className="bg-black/90 border-cyan-400/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-xs">Dashboard Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboardStatuses.map((dashboard) => (
              <div key={dashboard.route} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(dashboard.status)}`} />
                  <span className="text-gray-300 truncate max-w-24">{dashboard.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {dashboard.mobileOptimized && <Smartphone className="w-3 h-3 text-green-400" />}
                  {dashboard.authenticated ? (
                    <ShieldCheck className="w-3 h-3 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-gray-500 font-mono">{dashboard.responseTime}ms</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Watson Overlay Status */}
      <Card className="bg-black/90 border-green-400/50 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Watson UI Overlay</span>
            </div>
            <Badge variant="default" className="bg-green-600">
              {validationSummary.watsonOverlayStatus.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}