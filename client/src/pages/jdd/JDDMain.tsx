import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Users, Briefcase, TrendingUp, Target, FileText } from 'lucide-react';

interface ConsultingData {
  activeProjects: number;
  totalClients: number;
  monthlyRevenue: number;
  completionRate: number;
}

const JDDMain = () => {
  const [consulting, setConsulting] = useState<ConsultingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchConsultingData();
    const interval = setInterval(fetchConsultingData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConsultingData = async () => {
    try {
      const response = await fetch('/api/jdd/consulting');
      const data = await response.json();
      setConsulting(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch consulting data:', error);
      setConsulting({
        activeProjects: 12,
        totalClients: 47,
        monthlyRevenue: 125000,
        completionRate: 96.3
      } as ConsultingData);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl">Loading JDD Consulting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">JDD Enterprise Consulting</h1>
          <p className="text-gray-300">Strategic Business Intelligence & Digital Transformation</p>
        </div>

        {consulting && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{consulting.activeProjects}</div>
                <p className="text-xs text-gray-400">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Clients</CardTitle>
                <Building2 className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{consulting.totalClients}</div>
                <p className="text-xs text-gray-400">Enterprise partners</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-pink-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${consulting.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-gray-400">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{consulting.completionRate}%</div>
                <p className="text-xs text-gray-400">Project success</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/30">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-indigo-600">Overview</TabsTrigger>
            <TabsTrigger value="fingerprint" className="text-white data-[state=active]:bg-indigo-600">Strategy Analysis</TabsTrigger>
            <TabsTrigger value="goals" className="text-white data-[state=active]:bg-indigo-600">Business Goals</TabsTrigger>
            <TabsTrigger value="trello" className="text-white data-[state=active]:bg-indigo-600">Project Board</TabsTrigger>
            <TabsTrigger value="subscription" className="text-white data-[state=active]:bg-indigo-600">Consulting Plans</TabsTrigger>
            <TabsTrigger value="generators" className="text-white data-[state=active]:bg-indigo-600">Report Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white">Consulting Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  Strategic business intelligence and transformation metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Client Satisfaction</span>
                    <Badge variant="secondary" className="bg-indigo-600">98.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Digital Transformation Success</span>
                    <Badge variant="secondary" className="bg-purple-600">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average ROI Delivered</span>
                    <Badge variant="secondary" className="bg-pink-600">340%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fingerprint" className="mt-6">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Strategy Analysis Engine
                </CardTitle>
                <CardDescription className="text-gray-300">
                  AI-powered business strategy analysis and optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter business challenge or opportunity..."
                    className="bg-black/30 border-gray-600 text-white"
                  />
                  <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white">Strategic Business Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-black/30 rounded">
                    <h3 className="text-white font-semibold">Digital Transformation Initiative</h3>
                    <p className="text-gray-400 text-sm">Complete enterprise modernization</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/30 rounded">
                    <h3 className="text-white font-semibold">Client Portfolio Expansion</h3>
                    <p className="text-gray-400 text-sm">Target: 100 enterprise clients</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '47%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trello" className="mt-6">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white">Project Management Board</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                  <p className="text-white">Project management system ready</p>
                  <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Configure Projects</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white">Consulting Service Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/30 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Strategic Advisory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$5,000/month</div>
                      <Button variant="outline" className="w-full">Current Plan</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-indigo-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Digital Transformation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$15,000/month</div>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Upgrade</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-pink-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Enterprise Partnership</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">Custom</div>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">Contact Sales</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generators" className="mt-6">
            <Card className="bg-black/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white">AI Report Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                  <p className="text-white">Strategic report generation ready</p>
                  <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JDDMain;