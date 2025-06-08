// Clean TRD User Management Dashboard without hooks
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  Eye,
  Edit,
  Trash2,
  Key,
  Database,
  Lock
} from 'lucide-react';

export function TRDUserManagementDashboard() {
  // Static data for display
  const users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@dwcsystems.com',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2024-06-05 14:30',
      dashboards: ['watson_command_console', 'admin_panel'],
      modules: ['system_configuration', 'user_management']
    },
    {
      id: '2',
      username: 'watson_ai',
      email: 'watson@dwcsystems.com',
      role: 'AI System',
      status: 'active',
      lastLogin: '2024-06-05 15:45',
      dashboards: ['watson_dw_unlock', 'kaizen_master_dashboard'],
      modules: ['watson_intelligence_core', 'workflow_automation']
    }
  ];

  const roles = [
    { id: 'admin', name: 'Administrator', permissions: 'Full Access' },
    { id: 'manager', name: 'Manager', permissions: 'Limited Admin' },
    { id: 'user', name: 'Standard User', permissions: 'Read Only' },
    { id: 'ai_system', name: 'AI System', permissions: 'Automated Access' }
  ];

  const availableDashboards = [
    'infinity_sovereign_control',
    'kaizen_master_dashboard', 
    'watson_command_console',
    'watson_dw_unlock',
    'authentic_lead_generator',
    'admin_panel'
  ];

  const availableModules = [
    'admin_panel_access',
    'database_direct_access',
    'system_configuration',
    'user_management',
    'watson_intelligence_core',
    'workflow_automation'
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[750px] max-h-[90vh] overflow-auto">
      <Card className="bg-gradient-to-br from-blue-900/95 via-cyan-900/95 to-teal-900/95 border-blue-500/30 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">TRD User Management System</CardTitle>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Watson Synchronized
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              ×
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-3 p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-lg border border-blue-500/20">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-white">{users.length}</div>
                <div className="text-xs text-blue-300">Total Users</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">{roles.length}</div>
                <div className="text-xs text-blue-300">Roles</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">2</div>
                <div className="text-xs text-blue-300">Active</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">100%</div>
                <div className="text-xs text-blue-300">Security</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-blue-900/30">
              <TabsTrigger value="users" className="text-white">Users</TabsTrigger>
              <TabsTrigger value="roles" className="text-white">Roles</TabsTrigger>
              <TabsTrigger value="create" className="text-white">Create User</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.username}</div>
                          <div className="text-blue-300 text-sm">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-500/20 text-green-400">{user.status}</Badge>
                        <Button size="sm" variant="ghost" className="text-gray-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-300">Role:</span>
                        <span className="text-white ml-2">{user.role}</span>
                      </div>
                      <div>
                        <span className="text-blue-300">Last Login:</span>
                        <span className="text-white ml-2">{user.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="roles" className="mt-4">
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className="bg-purple-800/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="text-white font-medium">{role.name}</div>
                          <div className="text-purple-300 text-sm">{role.permissions}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Username</label>
                    <Input placeholder="Enter username" className="bg-blue-800/30 border-blue-500/30 text-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Email</label>
                    <Input placeholder="Enter email" className="bg-blue-800/30 border-blue-500/30 text-white" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Role</label>
                  <Select>
                    <SelectTrigger className="bg-blue-800/30 border-blue-500/30 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Dashboard Access</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableDashboards.map((dashboard) => (
                      <div key={dashboard} className="flex items-center space-x-2">
                        <Checkbox id={dashboard} />
                        <label htmlFor={dashboard} className="text-sm text-blue-300">
                          {dashboard.replace(/_/g, ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default TRDUserManagementDashboard;