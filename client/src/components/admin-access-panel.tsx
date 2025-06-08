import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Key, 
  Settings, 
  Zap, 
  Eye, 
  Lock,
  Unlock,
  Terminal,
  Play,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminCommand {
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST';
  requiresAuth: boolean;
  category: 'analysis' | 'optimization' | 'testing' | 'system';
}

export default function AdminAccessPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [executingCommand, setExecutingCommand] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<any>(null);
  const [isProduction, setIsProduction] = useState(false);
  const { toast } = useToast();

  // Check if we're in production and hide admin panel accordingly
  useEffect(() => {
    const checkDeploymentStatus = async () => {
      try {
        const response = await fetch('/api/deployment/status');
        const status = await response.json();
        setIsProduction(status.isProduction);
      } catch (error) {
        // If we can't reach the API, assume development
        setIsProduction(false);
      }
    };
    
    checkDeploymentStatus();
  }, []);

  // Don't render anything in production
  if (isProduction) {
    return null;
  }

  const adminCommands: AdminCommand[] = [
    {
      name: 'UI Audit Suite',
      description: 'Run comprehensive billion-dollar UI analysis',
      endpoint: '/api/ui/comprehensive-audit',
      method: 'POST',
      requiresAuth: true,
      category: 'analysis'
    },
    {
      name: 'Deployment Sweep',
      description: 'Execute quantum optimization deployment sweep',
      endpoint: '/api/deployment/comprehensive-sweep',
      method: 'POST',
      requiresAuth: true,
      category: 'optimization'
    },
    {
      name: 'Puppeteer Test Suite',
      description: 'Run full automated testing suite',
      endpoint: '/api/test/puppeteer-suite',
      method: 'POST',
      requiresAuth: true,
      category: 'testing'
    },
    {
      name: 'Funding Options',
      description: 'Get $500 LLC funding research',
      endpoint: '/api/funding/options',
      method: 'GET',
      requiresAuth: false,
      category: 'system'
    },
    {
      name: 'QQ Route Analysis',
      description: 'Analyze and optimize routing system',
      endpoint: '/api/qq-routing/analysis',
      method: 'GET',
      requiresAuth: false,
      category: 'analysis'
    }
  ];

  const authenticate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
        setPassword('');
        toast({
          title: "Admin Access Granted",
          description: "You now have full administrative privileges",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate admin access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeCommand = async (command: AdminCommand) => {
    setExecutingCommand(command.name);
    setLastResults(null);

    try {
      const response = await fetch(command.endpoint, {
        method: command.method,
        headers: { 'Content-Type': 'application/json' },
        ...(command.method === 'POST' && { body: JSON.stringify({}) })
      });

      const result = await response.json();
      setLastResults(result);

      toast({
        title: "Command Executed",
        description: `${command.name} completed successfully`,
      });
    } catch (error) {
      toast({
        title: "Command Failed",
        description: `Failed to execute ${command.name}`,
        variant: "destructive"
      });
    } finally {
      setExecutingCommand(null);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLastResults(null);
    toast({
      title: "Logged Out",
      description: "Admin session ended",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis': return <Eye className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      case 'testing': return <Play className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Terminal className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis': return 'border-blue-500';
      case 'optimization': return 'border-green-500';
      case 'testing': return 'border-yellow-500';
      case 'system': return 'border-purple-500';
      default: return 'border-gray-500';
    }
  };

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-slate-800/90 text-white border-slate-600 hover:bg-slate-700"
      >
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 space-y-4">
      {/* Authentication Panel */}
      {!isAuthenticated ? (
        <Card className="bg-slate-900/95 border-slate-700 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-red-400" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <div className="text-xs text-gray-400">
                Hint: DWC2025ASI or QuantumWife2025
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={authenticate}
                disabled={isLoading || !password}
                size="sm"
                className="flex-1"
              >
                {isLoading ? (
                  <Settings className="h-3 w-3 animate-spin" />
                ) : (
                  <Key className="h-3 w-3" />
                )}
                <span className="ml-1">
                  {isLoading ? 'Authenticating...' : 'Unlock'}
                </span>
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="outline"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Ctrl+Shift+A to toggle panel
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Admin Control Panel */}
          <Card className="bg-slate-900/95 border-slate-700 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  Admin Control Panel
                </CardTitle>
                <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                  <Unlock className="h-3 w-3 mr-1" />
                  Authenticated
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {adminCommands.map((command) => (
                  <Button
                    key={command.name}
                    onClick={() => executeCommand(command)}
                    disabled={executingCommand === command.name}
                    variant="outline"
                    size="sm"
                    className={`justify-start text-left h-auto p-3 ${getCategoryColor(command.category)} hover:bg-slate-800`}
                  >
                    <div className="flex items-start space-x-2 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        {executingCommand === command.name ? (
                          <Settings className="h-4 w-4 animate-spin" />
                        ) : (
                          getCategoryIcon(command.category)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{command.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {command.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {command.method}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {command.category}
                          </Badge>
                          {command.requiresAuth && (
                            <Lock className="h-3 w-3 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2 pt-2 border-t border-slate-700">
                <Button
                  onClick={logout}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Logout
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          {lastResults && (
            <Card className="bg-slate-900/95 border-slate-700 text-white max-h-60 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Terminal className="h-4 w-4 mr-2 text-blue-400" />
                  Command Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                <div className="text-xs font-mono bg-slate-800/50 p-2 rounded">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(lastResults, null, 2)}
                  </pre>
                </div>
                <Button
                  onClick={() => setLastResults(null)}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Clear Results
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}