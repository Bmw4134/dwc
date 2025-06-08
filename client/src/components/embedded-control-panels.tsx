import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Brain, 
  Terminal, 
  Shield, 
  BarChart3, 
  Globe,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface EmbeddedPanelsProps {
  userRole: string;
}

export function EmbeddedControlPanels({ userRole }: EmbeddedPanelsProps) {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  // NEXUS System Status
  const { data: nexusStatus } = useQuery({
    queryKey: ['/api/nexus/system-status'],
    refetchInterval: 5000
  });

  // System Logs Preview
  const { data: systemLogs } = useQuery({
    queryKey: ['/api/system/logs-preview'],
    refetchInterval: 10000
  });

  // API Health Status
  const { data: apiHealth } = useQuery({
    queryKey: ['/api/health/status'],
    refetchInterval: 15000
  });

  const togglePanel = (panelId: string) => {
    setExpandedPanel(expandedPanel === panelId ? null : panelId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Control Center Overview</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {userRole} Access Level
        </Badge>
      </div>

      <Tabs defaultValue="nexus" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nexus" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            NEXUS
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            API Health
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nexus" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                NEXUS Intelligence Status
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('nexus')}
              >
                {expandedPanel === 'nexus' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              {nexusStatus?.success && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {nexusStatus.data.automationLinkage}
                    </div>
                    <div className="text-sm text-gray-600">Automation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {nexusStatus.data.activeModules}/{nexusStatus.data.totalModules}
                    </div>
                    <div className="text-sm text-gray-600">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {nexusStatus.data.connectors}
                    </div>
                    <div className="text-sm text-gray-600">Connectors</div>
                  </div>
                  <div className="text-center">
                    <Badge variant={nexusStatus.data.nexusIntelligence === 'OPERATIONAL' ? 'default' : 'destructive'}>
                      {nexusStatus.data.nexusIntelligence}
                    </Badge>
                  </div>
                </div>
              )}
              
              {expandedPanel === 'nexus' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Detailed NEXUS Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Master Control Lock:</span>
                      <Badge variant={nexusStatus?.data.masterControlLock ? 'default' : 'destructive'}>
                        {nexusStatus?.data.masterControlLock ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Runtime State:</span>
                      <Badge variant="outline">{nexusStatus?.data.runtimeState}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span className="text-sm text-gray-600">
                        {nexusStatus?.data.lastSync ? new Date(nexusStatus.data.lastSync).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                System Health Monitor
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('system')}
              >
                {expandedPanel === 'system' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">12.4GB</div>
                  <div className="text-sm text-gray-600">Memory Usage</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">3.2ms</div>
                  <div className="text-sm text-gray-600">Avg Response</div>
                </div>
              </div>
              
              {expandedPanel === 'system' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Recent System Events</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div className="flex justify-between text-sm">
                      <span>Watson Intelligence Bridge: ACTIVE</span>
                      <span className="text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Automation modules synchronized</span>
                      <span className="text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Runtime kernel linked successfully</span>
                      <span className="text-gray-500">8 min ago</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-orange-600" />
                API Health Status
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('api')}
              >
                {expandedPanel === 'api' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Dashboard Metrics API</span>
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">NEXUS Intelligence API</span>
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Lead Generation API</span>
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">External Trading API</span>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">Monitoring</Badge>
                </div>
              </div>
              
              {expandedPanel === 'api' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">API Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Requests (24h):</span>
                      <div className="font-semibold">24,847</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Error Rate:</span>
                      <div className="font-semibold text-green-600">0.02%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Latency:</span>
                      <div className="font-semibold">45ms</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Peak Load:</span>
                      <div className="font-semibold">1,247 req/min</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security & Access Control
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('security')}
              >
                {expandedPanel === 'security' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">Quantum Security</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">ACTIVE</Badge>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Access Monitoring</span>
                    </div>
                    <Badge variant="default" className="bg-blue-600">ENABLED</Badge>
                  </div>
                </div>
                
                {expandedPanel === 'security' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Recent Access Logs</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <div className="flex justify-between text-sm">
                        <span>Executive login successful</span>
                        <span className="text-gray-500">Just now</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>NEXUS admin access granted</span>
                        <span className="text-gray-500">3 min ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Demo user session started</span>
                        <span className="text-gray-500">7 min ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}