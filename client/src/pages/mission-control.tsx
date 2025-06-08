// Clean mission control component without hooks
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Flag,
  Zap,
  Brain,
  DollarSign,
  Building,
  User,
  TrendingUp,
  Shield
} from 'lucide-react';

function MissionControl() {
  // Static data for display
  const missions = [
    {
      id: 1,
      title: 'Pokemon Card Revenue Engine',
      description: 'Implement Game X Change partnership automation',
      priority: 'high',
      status: 'in-progress',
      progress: 75,
      dueDate: '2024-06-10',
      assignee: 'AI Trading Bot',
      category: 'revenue'
    },
    {
      id: 2,
      title: 'Lead Generation Optimization',
      description: 'Enhance authentic lead generation pipeline',
      priority: 'high',
      status: 'active',
      progress: 60,
      dueDate: '2024-06-08',
      assignee: 'Watson AI',
      category: 'leads'
    },
    {
      id: 3,
      title: 'Stakeholder Dashboard Access',
      description: 'Deploy role-based access for lenders and partners',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      dueDate: '2024-06-05',
      assignee: 'Security Module',
      category: 'access'
    }
  ];

  const metrics = {
    totalMissions: 3,
    activeMissions: 2,
    completedMissions: 1,
    overdueMissions: 0,
    successRate: 100,
    averageCompletion: 78
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-yellow-400';
      case 'active': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="container mx-auto p-6 bg-slate-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
        <p className="text-slate-400">DWC Systems Strategic Operations Center</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{metrics.totalMissions}</div>
            <div className="text-slate-300 text-sm">Total Missions</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{metrics.activeMissions}</div>
            <div className="text-slate-300 text-sm">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{metrics.completedMissions}</div>
            <div className="text-slate-300 text-sm">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">{metrics.overdueMissions}</div>
            <div className="text-slate-300 text-sm">Overdue</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{metrics.successRate}%</div>
            <div className="text-slate-300 text-sm">Success Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{metrics.averageCompletion}%</div>
            <div className="text-slate-300 text-sm">Avg Progress</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="missions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="missions" className="text-white">Active Missions</TabsTrigger>
          <TabsTrigger value="create" className="text-white">Create Mission</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="mt-6">
          <div className="space-y-4">
            {missions.map((mission) => (
              <Card key={mission.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{mission.title}</h3>
                        <Badge className={getPriorityColor(mission.priority)}>
                          {mission.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(mission.status)}>
                          {mission.status}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-3">{mission.description}</p>
                      <div className="flex items-center gap-6 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {mission.assignee}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {mission.dueDate}
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {mission.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">{mission.progress}%</span>
                    </div>
                    <Progress value={mission.progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Mission</CardTitle>
              <CardDescription className="text-slate-400">
                Define a new strategic objective for DWC Systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Mission Title</label>
                  <Input placeholder="Enter mission title" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Priority</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Description</label>
                <Textarea 
                  placeholder="Describe the mission objectives and expected outcomes"
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Assignee</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-bot">AI Trading Bot</SelectItem>
                      <SelectItem value="watson">Watson AI</SelectItem>
                      <SelectItem value="security">Security Module</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Due Date</label>
                  <Input type="date" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Mission
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Mission Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Revenue Generation</span>
                    <span className="text-green-400 font-semibold">+24%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Lead Quality</span>
                    <span className="text-blue-400 font-semibold">+18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">System Efficiency</span>
                    <span className="text-purple-400 font-semibold">+31%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Strategic Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Deploy enterprise platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-slate-300">Secure investor funding</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300">Scale automation systems</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MissionControl;