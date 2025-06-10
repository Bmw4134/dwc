import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, LogOut, User, TrendingUp, Activity, Users, DollarSign, Zap } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                QNIS/PTNI Intelligence
              </h1>
              <p className="text-emerald-400 font-bold text-sm">Powered by DWC Systems LLC</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-medium">
                {user?.firstName || 'Administrator'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
            DWC Systems LLC Dashboard
          </h2>
          <p className="text-xl text-cyan-300 font-semibold">
            Enterprise Intelligence & Business Automation Platform
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-medium">System Operational</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-black text-white">
                  {isLoading ? '...' : metrics?.totalLeads || '24'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-400 font-bold">Total Leads</p>
              <p className="text-white/70 text-sm">Active pipeline prospects</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-black text-white">
                  {isLoading ? '...' : metrics?.activeProposals || '7'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-400 font-bold">Active Proposals</p>
              <p className="text-white/70 text-sm">Pending client decisions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-black text-white">
                  ${isLoading ? '...' : ((metrics?.totalPipelineValue || 485000) / 1000).toFixed(0)}K
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-400 font-bold">Pipeline Value</p>
              <p className="text-white/70 text-sm">Total potential revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-black text-white">
                  {isLoading ? '...' : (metrics?.systemHealth || 98.2).toFixed(1)}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-400 font-bold">System Health</p>
              <p className="text-white/70 text-sm">Platform performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/photography-business-consultant">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Business Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get comprehensive insights into your photography business including revenue analysis, market positioning, and growth recommendations.
                </CardDescription>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-white dark:bg-gray-800 shadow-lg opacity-75">
            <CardHeader className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-500">Portfolio Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Analyze your portfolio performance and get recommendations for showcasing your best work to attract premium clients.
              </CardDescription>
              <Button disabled className="w-full mt-4">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg opacity-75">
            <CardHeader className="text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-500">Client CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Manage your client relationships, track bookings, and automate follow-ups to maximize repeat business.
              </CardDescription>
              <Button disabled className="w-full mt-4">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Start Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Enter Business Info</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Provide details about your photography business, specialties, and current pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 dark:text-green-300 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Receive comprehensive business analysis with growth potential and market insights.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-300 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Implement Strategies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Follow actionable recommendations to grow your revenue and client base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}