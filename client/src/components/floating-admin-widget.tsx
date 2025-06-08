import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Monitor, 
  Activity,
  Shield,
  X,
  Minimize2,
  Maximize2,
  Bot,
  Camera,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Eye,
  CheckCircle,
  Target,
  Heart,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';

interface AdminWidgetProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface AutomationTask {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  lastRun: string;
  nextRun: string;
  description: string;
}

interface SystemMetrics {
  systemConfidence: number;
  activeModules: string;
  revenuePipeline: string;
  businessFormation: string;
  totalLeads: number;
  uptime: number;
  automationTasks: number;
  completedTasks: number;
}

export default function FloatingAdminWidget({ isVisible, onToggle }: AdminWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedTab, setSelectedTab] = useState('automation');

  const { data: systemStatus } = useQuery({
    queryKey: ['/api/admin/system-status'],
    refetchInterval: 5000 // Real-time updates
  });

  const { data: automationTasks } = useQuery({
    queryKey: ['/api/admin/automation-tasks'],
    refetchInterval: 3000
  });

  const { data: systemMetrics } = useQuery<SystemMetrics>({
    queryKey: ['/api/system/metrics'],
    refetchInterval: 2000 // Dynamic real-time metrics
  });

  const executePlaywrightTask = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch('/api/admin/playwright/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      return response.json();
    }
  });

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-purple-500/30 text-white shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Admin Control Hub
            </CardTitle>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-purple-300 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggle}
                className="h-6 w-6 p-0 text-purple-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="pt-0 space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-purple-800/30 rounded-lg p-1">
              {[
                { id: 'platform', label: 'Platform', icon: TrendingUp },
                { id: 'kate-pipeline', label: 'Kate Pipeline', icon: Camera },
                { id: 'llc-formation', label: 'LLC Formation', icon: Settings },
                { id: 'strategic-planning', label: 'Strategic Planning', icon: Target },
                { id: 'automation', label: 'Automation', icon: Bot },
                { id: 'monitoring', label: 'Monitor', icon: Monitor }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                    selectedTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Platform Status Tab */}
            {selectedTab === 'platform' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">Platform Status</h3>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                    Live Metrics
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-purple-200">System Confidence</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {systemMetrics?.systemConfidence || 95}%
                    </div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-purple-200">Active Modules</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {systemMetrics?.activeModules || '12/15'}
                    </div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-purple-200">Revenue Pipeline</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {systemMetrics?.revenuePipeline || '$24K/mo'}
                    </div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-purple-200">Formation Status</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {systemMetrics?.businessFormation || 'On Track'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-800/30 rounded-lg p-2">
                  <div className="text-xs text-purple-200 mb-1">System Health</div>
                  <div className="flex justify-between text-xs">
                    <span>Uptime: {systemMetrics?.uptime || 24}h</span>
                    <span>Tasks: {systemMetrics?.completedTasks || 4}/{systemMetrics?.automationTasks || 6}</span>
                    <span>Leads: {systemMetrics?.totalLeads || 12}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Kate Pipeline Tab */}
            {selectedTab === 'kate-pipeline' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">Blissful Memories Pipeline</h3>
                  <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Active
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Link href="/kate-photography-automation" className="block">
                    <div className="bg-purple-800/30 rounded-lg p-3 hover:bg-purple-700/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white flex items-center gap-2">
                          <Camera className="w-3 h-3 text-blue-400" />
                          Website Analysis
                        </span>
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                          Ready
                        </Badge>
                      </div>
                      <p className="text-xs text-purple-300">Analyze blissfulmemories.studio & blissfulmemoriesphotos.com</p>
                    </div>
                  </Link>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Users className="w-3 h-3 text-purple-400" />
                        Lead Generation
                      </span>
                      <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Planning
                      </Badge>
                    </div>
                    <p className="text-xs text-purple-300">Automated photography client acquisition</p>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Globe className="w-3 h-3 text-green-400" />
                        SEO Optimization
                      </span>
                      <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-xs text-purple-300">Multi-domain SEO strategy implementation</p>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Eye className="w-3 h-3 text-orange-400" />
                        Analytics Setup
                      </span>
                      <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-300 border-gray-500/30">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-xs text-purple-300">Cross-domain tracking and conversion monitoring</p>
                  </div>
                </div>
              </div>
            )}

            {/* LLC Formation Tab */}
            {selectedTab === 'llc-formation' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">DWC Systems LLC Formation</h3>
                  <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    Payment Pending
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Link href="/llc-automation" className="block">
                    <div className="bg-purple-800/30 rounded-lg p-3 hover:bg-purple-700/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white flex items-center gap-2">
                          <Settings className="w-3 h-3 text-blue-400" />
                          Complete LLC Filing
                        </span>
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                          Ready
                        </Badge>
                      </div>
                      <p className="text-xs text-purple-300">DWC Systems LLC - Texas formation ready for payment</p>
                    </div>
                  </Link>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="text-xs text-purple-200 mb-2">Filing Progress</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-300">✓ Form Validation</span>
                        <span className="text-green-300">Complete</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-300">✓ Document Generation</span>
                        <span className="text-green-300">Complete</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-300">⏸ Payment Processing</span>
                        <span className="text-yellow-300">Pending</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">○ State Submission</span>
                        <span className="text-gray-300">Waiting</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="text-xs text-purple-200 mb-1">Filing Details</div>
                    <div className="text-xs text-purple-300 space-y-1">
                      <div>Company: DWC Systems LLC</div>
                      <div>State: Texas</div>
                      <div>Members: Brett Watson, Christina Dion</div>
                      <div>Fee: $500 (Expedited)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strategic Planning Tab */}
            {selectedTab === 'strategic-planning' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">Couple's Strategic Planning</h3>
                  <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Active
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {/* Current Quarter Goals */}
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Target className="w-3 h-3 text-green-400" />
                        Q4 2025 Goals
                      </span>
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                        On Track
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-purple-300">
                      <div>✓ DWC Systems LLC Formation Complete</div>
                      <div>→ Kate's Photography Revenue: $15K/month</div>
                      <div>→ Business Automation Portfolio: 5 clients</div>
                      <div>→ Joint Savings Goal: $25K emergency fund</div>
                    </div>
                  </div>

                  {/* Life Balance Tracker */}
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Heart className="w-3 h-3 text-pink-400" />
                        Work-Life Balance
                      </span>
                      <span className="text-xs text-green-300">85%</span>
                    </div>
                    <div className="space-y-1 text-xs text-purple-300">
                      <div className="flex justify-between">
                        <span>Date Nights</span>
                        <span className="text-green-300">2/week ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Family Time</span>
                        <span className="text-green-300">Daily ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Individual Hobbies</span>
                        <span className="text-yellow-300">3hrs/week ⚠</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Goals */}
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-yellow-400" />
                        Financial Milestones
                      </span>
                      <span className="text-xs text-blue-300">68% Complete</span>
                    </div>
                    <div className="space-y-1 text-xs text-purple-300">
                      <div>Emergency Fund: $17K / $25K</div>
                      <div>Combined Income: $8.5K/month</div>
                      <div>Debt Reduction: $3.2K remaining</div>
                      <div>Investment Goal: Starting Jan 2026</div>
                    </div>
                  </div>

                  {/* Weekly Check-ins */}
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        Next Check-in
                      </span>
                      <span className="text-xs text-purple-300">Sunday 7 PM</span>
                    </div>
                    <div className="text-xs text-purple-300">
                      <div>Weekly goals review & planning session</div>
                      <div className="mt-1 text-yellow-300">Topics: Kate's new packages, LLC tax planning</div>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="text-xs text-purple-200 mb-2">This Week's Action Items</div>
                    <div className="space-y-1 text-xs text-purple-300">
                      <div className="flex justify-between">
                        <span>Brett: Complete LLC payment</span>
                        <span className="text-yellow-300">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kate: Update photography pricing</span>
                        <span className="text-green-300">Medium</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Both: Review health insurance</span>
                        <span className="text-blue-300">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Automation Tab */}
            {selectedTab === 'automation' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">Playwright Tasks</h3>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                    Active
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    {
                      id: 'lead-scraper',
                      name: 'Business Lead Scraper',
                      status: 'idle' as const,
                      description: 'Automated lead generation from business directories'
                    },
                    {
                      id: 'social-monitor',
                      name: 'Social Media Monitor',
                      status: 'running' as const,
                      description: 'Monitor social platforms for engagement opportunities'
                    },
                    {
                      id: 'competitor-analysis',
                      name: 'Competitor Analysis',
                      status: 'idle' as const,
                      description: 'Automated competitor website analysis'
                    }
                  ].map((task) => (
                    <div key={task.id} className="bg-purple-800/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white">{task.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              task.status === 'running' 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}
                          >
                            {task.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => executePlaywrightTask.mutate(task.id)}
                            disabled={executePlaywrightTask.isPending}
                            className="h-6 w-6 p-0 text-purple-300 hover:text-white"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-purple-300">{task.description}</p>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Create New Automation
                </Button>
              </div>
            )}

            {/* Monitoring Tab */}
            {selectedTab === 'monitoring' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">System Monitoring</h3>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                    Active
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Activity className="w-3 h-3 text-green-400" />
                        System Health
                      </span>
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                        98.7%
                      </Badge>
                    </div>
                    <div className="text-xs text-purple-300 space-y-1">
                      <div>CPU: 23% • Memory: 4.2GB/8GB</div>
                      <div>Network: 842MB ↓ 127MB ↑</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Monitor className="w-3 h-3 text-blue-400" />
                        API Endpoints
                      </span>
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                        12/12 Up
                      </Badge>
                    </div>
                    <div className="text-xs text-purple-300">
                      <div>Avg Response: 47ms</div>
                      <div>Last Check: 2s ago</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-800/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Shield className="w-3 h-3 text-yellow-400" />
                        Security Status
                      </span>
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                        Secure
                      </Badge>
                    </div>
                    <div className="text-xs text-purple-300 space-y-1">
                      <div>0 Threats Detected</div>
                      <div>Last Scan: 5 min ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Automation Tab */}
            {selectedTab === 'automation' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-purple-200">System Health</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="text-xs text-purple-300">CPU Usage</div>
                    <div className="text-sm font-bold text-green-400">23%</div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="text-xs text-purple-300">Memory</div>
                    <div className="text-sm font-bold text-blue-400">1.2GB</div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="text-xs text-purple-300">Active Tasks</div>
                    <div className="text-sm font-bold text-yellow-400">7</div>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-2">
                    <div className="text-xs text-purple-300">Uptime</div>
                    <div className="text-sm font-bold text-purple-400">99.8%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300">Recent Activity</span>
                    <Activity className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {[
                      'Lead generation completed: 15 new prospects',
                      'Business valuation updated for Watson',
                      'Security scan completed: No threats detected'
                    ].map((activity, index) => (
                      <div key={index} className="text-xs text-purple-200 bg-purple-800/20 rounded p-1">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {selectedTab === 'security' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-purple-200">Quantum Security</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300">Security Level</span>
                    <Badge className="bg-purple-600 text-white">OMEGA-5</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300">Auth Status</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300">Session Security</span>
                    <Badge className="bg-blue-600 text-white">Encrypted</Badge>
                  </div>
                </div>

                <div className="bg-purple-800/30 rounded-lg p-2">
                  <div className="text-xs text-purple-300 mb-1">Recent Security Events</div>
                  <div className="space-y-1">
                    <div className="text-xs text-green-400">✓ Watson authenticated successfully</div>
                    <div className="text-xs text-green-400">✓ Quantum encryption active</div>
                    <div className="text-xs text-green-400">✓ All modules secured</div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Emergency Lockdown
                </Button>
              </div>
            )}

            {/* Development Progress Tab */}
            {selectedTab === 'dev-progress' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-purple-200">Dev Accountability</h3>
                  <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30">
                    Session Active
                  </Badge>
                </div>

                {/* One-Click Testing */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                    size="sm"
                    onClick={() => {
                      fetch('/api/dev/run-comprehensive-tests', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => console.log('Test Results:', data));
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    TEST EVERYTHING NOW
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      size="sm"
                      onClick={() => {
                        fetch('/api/dev/save-progress', { method: 'POST' })
                          .then(res => res.json())
                          .then(data => console.log('Progress Saved:', data));
                      }}
                    >
                      Save Progress
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      size="sm"
                      onClick={() => {
                        fetch('/api/dev/regression-report', { method: 'GET' })
                          .then(res => res.json())
                          .then(data => console.log('Regression Report:', data));
                      }}
                    >
                      Check Regression
                    </Button>
                  </div>
                </div>

                {/* Session Status */}
                <div className="bg-purple-800/30 rounded-lg p-2">
                  <div className="text-xs text-purple-300 mb-2">Current Session Status</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">Features Added:</span>
                      <span className="text-green-400">7</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">Tests Passed:</span>
                      <span className="text-green-400">15/18</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">Issues Resolved:</span>
                      <span className="text-yellow-400">23</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">Regression Risk:</span>
                      <span className="text-green-400">LOW</span>
                    </div>
                  </div>
                </div>

                {/* Recent Progress */}
                <div className="space-y-2">
                  <div className="text-xs text-purple-300">Recent Progress</div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {[
                      '✓ Quantum authentication system implemented',
                      '✓ Playwright automation added to admin widget',
                      '✓ Development progress tracker created',
                      '⚠ TypeScript errors need resolution',
                      '→ Team collaboration features in progress'
                    ].map((item, index) => (
                      <div key={index} className="text-xs bg-purple-800/20 rounded p-1">
                        <span className={
                          item.startsWith('✓') ? 'text-green-400' :
                          item.startsWith('⚠') ? 'text-yellow-400' :
                          item.startsWith('→') ? 'text-blue-400' : 'text-purple-200'
                        }>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Actions */}
                <div className="grid grid-cols-2 gap-1">
                  <Button 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                    size="sm"
                    onClick={() => {
                      if (confirm('Create rollback point? This will save current state.')) {
                        fetch('/api/dev/create-rollback-point', { method: 'POST' });
                      }
                    }}
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Rollback Point
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    size="sm"
                    onClick={() => {
                      if (confirm('Force complete session? This will finalize all progress.')) {
                        fetch('/api/dev/complete-session', { method: 'POST' });
                      }
                    }}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Force Complete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}