import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function DevLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  // Simple rate limiting - lock after 5 failed attempts
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 300000; // 5 minutes

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('dev-token', data.token);
        localStorage.setItem('dev-user', JSON.stringify(data.user));
        
        toast({
          title: "Login Successful",
          description: "Welcome to DWC Systems Development Environment"
        });

        // Redirect to main app
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setLoginAttempts(prev => prev + 1);
        
        if (loginAttempts + 1 >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
          }, LOCKOUT_TIME);
        }

        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication server",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Shield className="h-12 w-12 text-blue-400" />
                <Lock className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-white">DWC Systems</CardTitle>
              <p className="text-slate-300 text-sm mt-2">Development Environment Access</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter username"
                  required
                  disabled={isLocked}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                    placeholder="Enter password"
                    required
                    disabled={isLocked}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || isLocked}
              >
                {isLoading ? "Authenticating..." : isLocked ? "Account Locked" : "Login"}
              </Button>
            </form>

            {loginAttempts > 0 && !isLocked && (
              <div className="text-center">
                <p className="text-yellow-400 text-sm">
                  Failed attempts: {loginAttempts}/{MAX_ATTEMPTS}
                </p>
              </div>
            )}

            {isLocked && (
              <div className="text-center">
                <p className="text-red-400 text-sm">
                  Account locked for 5 minutes due to multiple failed attempts
                </p>
              </div>
            )}

            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-slate-400 text-xs">
                Development Environment • Secure Authentication Required
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}