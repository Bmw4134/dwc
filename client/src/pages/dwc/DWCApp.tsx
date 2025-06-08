import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, Users, DollarSign, Target, Bot, Zap, Cpu, Eye } from 'lucide-react';

interface DashboardMetrics {
  totalLeads: number;
  activeProposals: number;
  monthlyRevenue: number;
  conversionRate: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  automationLinkage: number;
}

const DWCApp = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [promptText, setPromptText] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics');
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setLoading(false);
    }
  };

  const handlePromptSubmit = async () => {
    if (!promptText.trim()) return;
    
    try {
      const response = await fetch('/api/prompt/fingerprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const result = await response.json();
      setPromptText('');
    } catch (error) {
      console.error('Prompt analysis failed:', error);
    }
  };

  const handleGoalSubmit = async () => {
    if (!goalTitle.trim() || !goalDescription.trim()) return;
    
    try {
      const response = await fetch('/api/goals/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: goalTitle, description: goalDescription })
      });
      const result = await response.json();
      setGoalTitle('');
      setGoalDescription('');
    } catch (error) {
      console.error('Goal creation failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl">Loading DWC Systems...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DWC Systems LLC</h1>
          <p className="text-gray-300">Enterprise Automation Platform</p>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.totalLeads}</div>
                <p className="text-xs text-gray-400">Active prospects</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${metrics.totalPipelineValue.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Total opportunity</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">System Health</CardTitle>
                <Cpu className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.systemHealth.toFixed(1)}%</div>
                <p className="text-xs text-gray-400">Operational status</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-yellow-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">ROI Proven</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.roiProven}%</div>
                <p className="text-xs text-gray-400">Return on investment</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/30">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="fingerprint" className="text-white data-[state=active]:bg-purple-600">Prompt Fingerprint</TabsTrigger>
            <TabsTrigger value="goals" className="text-white data-[state=active]:bg-purple-600">Goal Tracker</TabsTrigger>
            <TabsTrigger value="trello" className="text-white data-[state=active]:bg-purple-600">Trello Sync</TabsTrigger>
            <TabsTrigger value="subscription" className="text-white data-[state=active]:bg-purple-600">Subscription</TabsTrigger>
            <TabsTrigger value="generators" className="text-white data-[state=active]:bg-purple-600">AI Generators</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">System Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time business intelligence and automation status
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Automation Linkage</span>
                    <Badge variant="secondary" className="bg-green-600">{metrics?.automationLinkage}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conversion Rate</span>
                    <Badge variant="secondary" className="bg-blue-600">{metrics?.conversionRate}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monthly Revenue</span>
                    <Badge variant="secondary" className="bg-yellow-600">${metrics?.monthlyRevenue}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fingerprint" className="mt-6">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Prompt Fingerprint Analysis
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Analyze and optimize your AI prompts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your prompt for analysis..."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white"
                    rows={4}
                  />
                  <Button 
                    onClick={handlePromptSubmit}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!promptText.trim()}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Analyze Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Goal Tracker
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Set and track business objectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Goal title..."
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white"
                  />
                  <Textarea
                    placeholder="Goal description..."
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white"
                    rows={3}
                  />
                  <Button 
                    onClick={handleGoalSubmit}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!goalTitle.trim() || !goalDescription.trim()}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Create Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trello" className="mt-6">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Trello Sync</CardTitle>
                <CardDescription className="text-gray-300">
                  Synchronize with Trello boards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-white">Trello integration ready for configuration</p>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Configure Trello</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Subscription Engine</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage subscription tiers and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/30 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Free</CardTitle>
                      <CardDescription className="text-gray-300">Basic features</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$0/month</div>
                      <Button variant="outline" className="w-full">Current Plan</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-purple-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Pro</CardTitle>
                      <CardDescription className="text-gray-300">Advanced automation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$99/month</div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Elite</CardTitle>
                      <CardDescription className="text-gray-300">Full enterprise suite</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$299/month</div>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Upgrade</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generators" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">SUNO Generator</CardTitle>
                  <CardDescription className="text-gray-300">
                    AI-powered audio generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-white">Audio generation ready</p>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Generate Audio</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">DALL·E Generator</CardTitle>
                  <CardDescription className="text-gray-300">
                    AI image creation and editing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-white">Image generation ready</p>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Generate Image</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DWCApp;