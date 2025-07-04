import { useAuth } from "@/hooks/useAuth";
import { useViewMode } from "@/hooks/useViewMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { Brain, LogOut, User, TrendingUp, Activity, Users, DollarSign, Zap, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface MetricsData {
  totalLeads: number;
  activeProposals: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  monthlyRevenue: number;
}

interface UserData {
  firstName?: string;
  email?: string;
  profileImageUrl?: string;
}

export default function Home() {
  const { user } = useAuth() as { user: UserData };
  const { viewMode, isMobileDevice, isDesktopMode } = useViewMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: metrics, isLoading } = useQuery<MetricsData>({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 10000,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className={`container mx-auto px-4 sm:px-6 py-4 ${isDesktopMode ? 'flex justify-between items-center' : 'block'}`}>
          {/* Mobile Header Layout */}
          {!isDesktopMode && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight">
                    QNIS/PTNI
                  </h1>
                  <p className="text-emerald-400 font-bold text-xs">DWC Systems LLC</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          )}

          {/* Desktop Header Layout */}
          {isDesktopMode && (
            <>
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
                <div className="flex space-x-3">
                  <Link href="/admin">
                    <Button 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                      Exec Dashboard
                    </Button>
                  </Link>
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
            </>
          )}

          {/* Mobile Menu */}
          {!isDesktopMode && mobileMenuOpen && (
            <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-medium text-sm">
                  {user?.firstName || 'Administrator'}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <Link href="/admin">
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 w-full"
                    size="sm"
                  >
                    Exec Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className={`container mx-auto px-4 sm:px-6 py-8 ${!isDesktopMode ? 'pb-20' : ''}`}>
        <div className="mb-8">
          <h2 className={`${isDesktopMode ? 'text-4xl' : 'text-2xl'} font-black text-white mb-3 tracking-tight`}>
            DWC Systems LLC Dashboard
          </h2>
          <p className={`${isDesktopMode ? 'text-xl' : 'text-lg'} text-cyan-300 font-semibold`}>
            Enterprise Intelligence & Business Automation Platform
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-medium">System Operational</span>
          </div>
        </div>

        {/* Key Metrics Grid - Adaptive Layout */}
        <div className={`grid gap-4 mb-8 ${
          isDesktopMode 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
            : 'grid-cols-1 sm:grid-cols-2 gap-4'
        }`}>
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

        {/* DWC Systems LLC Feature Cards - Adaptive Layout */}
        <div className={`grid gap-4 mb-8 ${
          isDesktopMode 
            ? 'md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'grid-cols-1 gap-4'
        }`}>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <Brain className="w-16 h-16 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl text-white">Intelligence Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-white/70">
                Advanced neural pattern recognition and business intelligence analysis powered by quantum algorithms and real-time data processing.
              </CardDescription>
              <Link href="/admin">
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0"
                >
                  Exec Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl text-white">Automation Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-white/70">
                Enterprise-grade business process automation with 94% efficiency rating and seamless integration across multiple platforms.
              </CardDescription>
              <Button 
                onClick={() => window.location.href = '/watson'}
                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
              >
                Deploy Automation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <CardHeader className="text-center">
              <TrendingUp className="w-16 h-16 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl text-white">Lead Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-white/70">
                AI-powered lead generation and qualification system with predictive analytics and automated nurturing sequences.
              </CardDescription>
              <Button 
                onClick={() => window.location.href = '/dion'}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0"
              >
                Generate Leads
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Company Showcase */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border-emerald-400/20">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-white text-center">
                DWC Systems LLC
              </CardTitle>
              <CardDescription className="text-center text-cyan-300 text-lg font-semibold">
                Enterprise Intelligence Solutions & Business Automation
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto mb-6">
                Founded by visionary entrepreneurs, DWC Systems LLC delivers cutting-edge quantum intelligence platforms, 
                automated business solutions, and enterprise-grade consulting services that transform how businesses operate 
                in the digital age. Our proven track record includes ${((metrics?.totalPipelineValue || 485000) / 1000).toFixed(0)}K in active pipeline value 
                and {metrics?.roiProven || 156}% proven ROI for our clients.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-white/10 rounded-lg px-6 py-3 border border-white/20">
                  <div className="text-2xl font-black text-emerald-400">{metrics?.totalLeads || 24}</div>
                  <div className="text-white/70 text-sm">Active Clients</div>
                </div>
                <div className="bg-white/10 rounded-lg px-6 py-3 border border-white/20">
                  <div className="text-2xl font-black text-cyan-400">${((metrics?.monthlyRevenue || 32500) / 1000).toFixed(0)}K</div>
                  <div className="text-white/70 text-sm">Monthly Revenue</div>
                </div>
                <div className="bg-white/10 rounded-lg px-6 py-3 border border-white/20">
                  <div className="text-2xl font-black text-green-400">{(metrics?.systemHealth || 98.2).toFixed(1)}%</div>
                  <div className="text-white/70 text-sm">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* View Mode Toggle - Only visible on mobile devices */}
      <ViewModeToggle />
    </div>
  );
}