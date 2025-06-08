import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation } from 'wouter';
import { 
  Bot, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Sun,
  Moon,
  Shield
} from 'lucide-react';

export default function WowTesterLogin() {
  const [, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      if (credentials.username === 'demo_user' && credentials.password === 'nexus_2024') {
        setLocation('/wow-tester-dashboard');
      } else {
        alert('Invalid credentials. Use: demo_user / nexus_2024');
      }
      setIsLoading(false);
    }, 1500);
  };

  const themeClass = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClass}`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-96 h-96 ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/5'
        } rounded-full filter blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'
        } rounded-full filter blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
        <Card className={`w-full max-w-md ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/80 border-gray-200 backdrop-blur-sm'
        }`}>
          <CardHeader className="space-y-6 text-center">
            
            {/* Theme Toggle */}
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                <Sun className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Moon className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
            </div>

            {/* Animated Nexus Icon */}
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              } flex items-center justify-center animate-pulse`}>
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome to Nexus
              </CardTitle>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Autonomous Intelligence Portal
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-purple-500">
                <Shield className="w-3 h-3" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            
            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Username
                </Label>
                <div className="relative">
                  <User className={`absolute left-3 top-3 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className={`pl-10 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className={`pl-10 pr-10 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3 ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
            }`}>
              <p className={`text-xs font-medium mb-1 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Demo Credentials:
              </p>
              <p className={`text-xs font-mono ${
                isDarkMode ? 'text-purple-200' : 'text-purple-600'
              }`}>
                Username: demo_user<br />
                Password: nexus_2024
              </p>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || !credentials.username || !credentials.password}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Intelligence Portal'
              )}
            </Button>

            {/* Security Notice */}
            <div className="text-center space-y-2">
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Secure demo environment • No real data access
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Nexus Intelligence Framework v2.0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}