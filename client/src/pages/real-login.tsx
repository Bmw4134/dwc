import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Building2, Eye, EyeOff } from 'lucide-react';
import { useLocation } from 'wouter';

export default function RealLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    accessLevel: 'executive'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate with real credentials
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Redirect based on access level
        switch (data.accessLevel) {
          case 'admin':
            setLocation('/system-logs');
            break;
          case 'nexus':
            setLocation('/nexus-observer');
            break;
          case 'executive':
          default:
            setLocation('/dw-executive-dashboard');
            break;
        }
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DWC Systems</h1>
          <p className="text-blue-200">Secure Executive Access Portal</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Executive Authentication</CardTitle>
            <CardDescription className="text-blue-200">
              Enter your credentials to access the enterprise platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/60" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessLevel" className="text-white">Access Level</Label>
                <select
                  id="accessLevel"
                  value={formData.accessLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white"
                >
                  <option value="executive" className="bg-slate-800">Executive Dashboard</option>
                  <option value="nexus" className="bg-slate-800">NEXUS Control Center</option>
                  <option value="admin" className="bg-slate-800">System Administration</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/20 text-center">
              <p className="text-white/60 text-sm mb-4">Need demo access?</p>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setLocation('/demo-login')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Demo Access Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-white/60 text-sm">
          <p>Protected by quantum-secure authentication</p>
          <p>All access attempts are logged and monitored</p>
        </div>
      </div>
    </div>
  );
}