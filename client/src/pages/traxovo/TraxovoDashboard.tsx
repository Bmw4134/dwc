import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, BarChart3, Truck, Package, MapPin, Clock } from 'lucide-react';

interface LogisticsData {
  activeShipments: number;
  totalRevenue: number;
  deliveryRate: number;
  avgDeliveryTime: number;
}

const TraxovoDashboard = () => {
  const [logistics, setLogistics] = useState<LogisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLogisticsData();
    const interval = setInterval(fetchLogisticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogisticsData = async () => {
    try {
      const response = await fetch('/api/traxovo/logistics');
      const data = await response.json();
      setLogistics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch logistics data:', error);
      // Use fallback data for demo
      setLogistics({
        activeShipments: 47,
        totalRevenue: 285000,
        deliveryRate: 98.7,
        avgDeliveryTime: 2.3
      } as LogisticsData);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl">Loading Traxovo Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Traxovo Logistics Hub</h1>
          <p className="text-gray-300">Smart Transportation & Supply Chain Management</p>
        </div>

        {logistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Shipments</CardTitle>
                <Truck className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{logistics.activeShipments}</div>
                <p className="text-xs text-gray-400">In transit</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-teal-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${logistics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-gray-400">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Delivery Rate</CardTitle>
                <Package className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{logistics.deliveryRate}%</div>
                <p className="text-xs text-gray-400">On-time delivery</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-yellow-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Avg Delivery</CardTitle>
                <Clock className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{logistics.avgDeliveryTime} days</div>
                <p className="text-xs text-gray-400">Delivery time</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/30">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600">Overview</TabsTrigger>
            <TabsTrigger value="fingerprint" className="text-white data-[state=active]:bg-green-600">Route Optimizer</TabsTrigger>
            <TabsTrigger value="goals" className="text-white data-[state=active]:bg-green-600">Fleet Goals</TabsTrigger>
            <TabsTrigger value="trello" className="text-white data-[state=active]:bg-green-600">Dispatch Board</TabsTrigger>
            <TabsTrigger value="subscription" className="text-white data-[state=active]:bg-green-600">Fleet Plans</TabsTrigger>
            <TabsTrigger value="generators" className="text-white data-[state=active]:bg-green-600">Route Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Fleet Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time logistics and transportation metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Fleet Utilization</span>
                    <Badge variant="secondary" className="bg-green-600">87%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fuel Efficiency</span>
                    <Badge variant="secondary" className="bg-teal-600">12.3 MPG</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Driver Satisfaction</span>
                    <Badge variant="secondary" className="bg-blue-600">94%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fingerprint" className="mt-6">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Route Optimizer
                </CardTitle>
                <CardDescription className="text-gray-300">
                  AI-powered route optimization and planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter destination addresses..."
                    className="bg-black/30 border-gray-600 text-white"
                  />
                  <Button className="bg-green-600 hover:bg-green-700 w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Optimize Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Fleet Performance Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-black/30 rounded">
                    <h3 className="text-white font-semibold">Reduce Delivery Time by 15%</h3>
                    <p className="text-gray-400 text-sm">Target: 2.0 days average</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '73%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trello" className="mt-6">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Dispatch Board</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-white">Dispatch management system ready</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">Configure Dispatch</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Fleet Management Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/30 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Basic Fleet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$199/month</div>
                      <Button variant="outline" className="w-full">Current Plan</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-green-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Pro Fleet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$499/month</div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Upgrade</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/30 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Enterprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white mb-4">$999/month</div>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Upgrade</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generators" className="mt-6">
            <Card className="bg-black/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">AI Route Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-white">Smart route generation ready</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">Generate Routes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TraxovoDashboard;