import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, TrendingUp, Users, BarChart3, Lock, Eye, EyeOff } from "lucide-react";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/quantum-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Login Successful",
          description: `Welcome to DWC Systems LLC QNIS/PTNI Platform`,
        });
        
        // Redirect based on user role
        if (credentials.username === 'watson' || credentials.username === 'dion') {
          window.location.href = '/admin';
        } else if (credentials.username === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const quickLoginOptions = [
    { username: 'watson', password: 'dwc2025', role: 'Master Admin', description: 'Full system access' },
    { username: 'dion', password: 'nexus2025', role: 'Level 15', description: 'Advanced operations' },
    { username: 'admin', password: 'qnis2025', role: 'Administrator', description: 'System management' },
    { username: 'intelligence', password: 'ptni2025', role: 'Intelligence', description: 'Analytics access' },
  ];

  const handleQuickLogin = (username: string, password: string) => {
    setCredentials({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DWC Systems LLC</h1>
                <p className="text-emerald-400 text-sm font-medium">QNIS/PTNI Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-emerald-500/20 rounded-full">
                <span className="text-emerald-400 text-sm font-medium">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Platform Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-white mb-4">
                Enterprise Intelligence Platform
              </h2>
              <p className="text-xl text-cyan-400 mb-8">
                Advanced AI-powered business analytics with quantum-level automation for institutional-grade decision making.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">24 Active Leads</h3>
                <p className="text-gray-300 text-sm">Real-time pipeline management</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <BarChart3 className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">$485K Pipeline</h3>
                <p className="text-gray-300 text-sm">Verified business value</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <Shield className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">98.2% Uptime</h3>
                <p className="text-gray-300 text-sm">Enterprise reliability</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <Users className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">18 AI Modules</h3>
                <p className="text-gray-300 text-sm">Autonomous intelligence</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:max-w-md lg:mx-auto w-full">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Access Platform</CardTitle>
                <CardDescription className="text-gray-300">
                  Secure login to DWC Systems intelligence dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Access Platform
                      </>
                    )}
                  </Button>
                </form>

                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-3">Quick Access Options</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickLoginOptions.map((option) => (
                      <Button
                        key={option.username}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickLogin(option.username, option.password)}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                      >
                        {option.role}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}