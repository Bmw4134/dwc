import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Target, TrendingUp, Lock, Monitor, Cpu } from 'lucide-react';
import { useAdaptiveDisplay } from '@/components/adaptive-display-handler';
import { FullscreenToggle } from '@/components/fullscreen-toggle';

interface LoginFormData {
  username: string;
  password: string;
}

export default function Landing() {
  const { isMobileView } = useAdaptiveDisplay();
  const [loginForm, setLoginForm] = useState<LoginFormData>({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/master-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.watsonAccess) {
          window.location.href = '/watson-console';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        const error = await response.json();
        setLoginError(error.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Automation",
      description: "Transform business operations with intelligent automation systems"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Lead Generation Engine",
      description: "Automated client acquisition with real-time conversion tracking"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Revenue Optimization",
      description: "Data-driven insights for immediate ROI improvement"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quantum Security",
      description: "Enterprise-grade protection with advanced encryption"
    }
  ];

  const stats = [
    { value: "$2,650", label: "Avg Monthly Savings", color: "text-green-400" },
    { value: "847%", label: "ROI Improvement", color: "text-blue-400" },
    { value: "23K+", label: "Monthly Recurring", color: "text-purple-400" },
    { value: "24/7", label: "Autonomous Operation", color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className={`sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-purple-500/30 ${isMobileView ? 'px-4 py-3' : 'px-8 py-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`font-bold text-white ${isMobileView ? 'text-lg' : 'text-xl'}`}>
                DWC Systems LLC
              </h1>
              <p className={`text-purple-300 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
                Enterprise AI Automation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FullscreenToggle />
            <Button
              onClick={() => setShowLogin(!showLogin)}
              variant="outline"
              size={isMobileView ? "sm" : "default"}
              className="border-purple-500 text-purple-300 hover:bg-purple-600/20"
            >
              <Lock className="h-4 w-4 mr-1" />
              {showLogin ? 'Close' : 'Login'}
            </Button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className={`bg-slate-900/95 border-purple-500/30 ${isMobileView ? 'w-full max-w-sm' : 'w-full max-w-md'}`}>
            <CardHeader>
              <CardTitle className="text-center text-white">Master Access Portal</CardTitle>
              <p className="text-center text-slate-400 text-sm">Authorized Personnel Only</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="bg-slate-800 border-purple-500/30 text-white"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-slate-800 border-purple-500/30 text-white"
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                    {loginError}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? 'Authenticating...' : 'Access System'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLogin(false)}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Section */}
      <div className={`${isMobileView ? 'px-4 py-8' : 'px-8 py-16'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/30">
            <Monitor className="h-3 w-3 mr-1" />
            Live Enterprise Platform
          </Badge>
          
          <h1 className={`font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent ${isMobileView ? 'text-3xl mb-4' : 'text-6xl mb-6'}`}>
            Autonomous Business Intelligence
          </h1>
          
          <p className={`text-slate-300 max-w-3xl mx-auto mb-8 ${isMobileView ? 'text-base' : 'text-xl'}`}>
            Revolutionary AI-powered automation platform transforming enterprise operations. 
            Real-time lead generation, intelligent workflow optimization, and quantum-secured deployment.
          </p>

          {/* Stats Grid */}
          <div className={`grid gap-4 mb-12 ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                <div className={`${stat.color} font-bold ${isMobileView ? 'text-lg' : 'text-2xl'}`}>
                  {stat.value}
                </div>
                <div className={`text-slate-400 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`${isMobileView ? 'px-4 py-8' : 'px-8 py-16'} bg-slate-900/50`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-center font-bold text-white mb-12 ${isMobileView ? 'text-2xl' : 'text-4xl'}`}>
            Enterprise Capabilities
          </h2>
          
          <div className={`grid gap-6 ${isMobileView ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 bg-purple-600/20 rounded-full mb-4 text-purple-400">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className={`text-slate-400 ${isMobileView ? 'text-sm' : 'text-base'}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Showcase */}
      <div className={`${isMobileView ? 'px-4 py-8' : 'px-8 py-16'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`font-bold text-white mb-4 ${isMobileView ? 'text-2xl' : 'text-4xl'}`}>
              Live Portfolio Projects
            </h2>
            <p className={`text-slate-400 max-w-2xl mx-auto ${isMobileView ? 'text-sm' : 'text-base'}`}>
              Real automation deployments generating immediate value for enterprise clients
            </p>
          </div>

          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardContent className="p-8">
              <div className={`${isMobileView ? 'space-y-4' : 'flex items-center justify-between'}`}>
                <div className={isMobileView ? 'text-center' : ''}>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Blissful Memories Photography Automation
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Complete website consolidation and workflow automation platform
                  </p>
                  <div className={`flex gap-4 ${isMobileView ? 'justify-center' : ''}`}>
                    <Badge className="bg-green-600/20 text-green-300">
                      $2,650/month ROI
                    </Badge>
                    <Badge className="bg-blue-600/20 text-blue-300">
                      Live Production
                    </Badge>
                  </div>
                </div>
                <div className={isMobileView ? 'mt-4' : ''}>
                  <Button
                    onClick={() => window.location.href = '/kate-photography-automation'}
                    className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${isMobileView ? 'w-full' : ''}`}
                  >
                    View Live Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className={`bg-slate-900 border-t border-purple-500/30 ${isMobileView ? 'px-4 py-6' : 'px-8 py-8'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={`text-slate-400 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
            © 2025 DWC Systems LLC. Enterprise AI Automation Platform.
          </p>
          <div className={`mt-2 flex justify-center gap-4 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
            <span className="text-purple-400">Quantum Secured</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-400">24/7 Autonomous</span>
            <span className="text-slate-500">•</span>
            <span className="text-green-400">Real-time Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}