import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Terminal,
  Chrome,
  Settings,
  Zap
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface BrowserStatus {
  chrome: boolean;
  firefox: boolean;
  edge: boolean;
  automationReady: boolean;
}

export default function BrowserInstallationWidget() {
  const [installOutput, setInstallOutput] = useState<string>("");
  const { toast } = useToast();

  // Check browser status
  const { data: browserStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/system/browser-status'],
    refetchInterval: 10000, // Check every 10 seconds
  });

  // Install browsers mutation
  const installMutation = useMutation({
    mutationFn: async (): Promise<{ success: boolean; message: string; output: string }> => {
      const response = await fetch('/api/system/install-browsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Browser installation failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setInstallOutput(data.output || "Installation completed successfully");
      toast({
        title: "Browser Installation Complete",
        description: "Automation browsers are now ready for testing",
        variant: "default",
      });
      refetchStatus();
    },
    onError: (error) => {
      toast({
        title: "Installation Failed",
        description: error.message || "Failed to install browsers",
        variant: "destructive",
      });
    },
  });

  // Check system readiness
  const { data: systemHealth } = useQuery({
    queryKey: ['/api/validation/health-check'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const getReadinessScore = () => {
    if (!systemHealth?.health) return 0;
    
    const health = systemHealth.health;
    let score = 0;
    
    if (health.apiOnline) score += 25;
    if (health.authWorking) score += 25;
    if (health.databaseConnected) score += 25;
    if (browserStatus?.automationReady) score += 25;
    
    return score;
  };

  const readinessScore = getReadinessScore();

  return (
    <Card className="bg-gray-900/95 border-gray-700/50 backdrop-blur-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Chrome className="h-5 w-5 text-blue-400" />
          Automation Browser Setup
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* System Readiness */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Automation Readiness</span>
            <span className={`font-medium ${readinessScore >= 75 ? 'text-green-400' : readinessScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {readinessScore}%
            </span>
          </div>
          <Progress 
            value={readinessScore} 
            className="h-2 bg-gray-700"
          />
          <div className="text-xs text-gray-500 mt-1">
            {readinessScore >= 75 ? 'Ready for full automation' : 
             readinessScore >= 50 ? 'Partial automation available' : 
             'Setup required'}
          </div>
        </div>

        {/* Install Button */}
        <Button
          onClick={() => installMutation.mutate()}
          disabled={installMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {installMutation.isPending ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Installing Browsers...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Install Automation Browsers
            </>
          )}
        </Button>

        {/* Browser Status */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
          <h4 className="text-white font-medium mb-2 text-sm">Browser Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Chrome Automation</span>
              <Badge className={browserStatus?.chrome ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                {browserStatus?.chrome ? "Ready" : "Not Installed"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Puppeteer</span>
              <Badge className={browserStatus?.automationReady ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                {browserStatus?.automationReady ? "Active" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        {/* System Health */}
        {systemHealth?.health && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
            <h4 className="text-white font-medium mb-2 text-sm">System Health</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                {systemHealth.health.apiOnline ? 
                  <CheckCircle className="h-3 w-3 text-green-400" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                }
                <span className="text-gray-400">API</span>
              </div>
              <div className="flex items-center gap-1">
                {systemHealth.health.authWorking ? 
                  <CheckCircle className="h-3 w-3 text-green-400" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                }
                <span className="text-gray-400">Auth</span>
              </div>
              <div className="flex items-center gap-1">
                {systemHealth.health.databaseConnected ? 
                  <CheckCircle className="h-3 w-3 text-green-400" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                }
                <span className="text-gray-400">Database</span>
              </div>
              <div className="flex items-center gap-1">
                {systemHealth.health.allSystemsGo ? 
                  <CheckCircle className="h-3 w-3 text-green-400" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                }
                <span className="text-gray-400">Overall</span>
              </div>
            </div>
          </div>
        )}

        {/* Installation Output */}
        {installOutput && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">Installation Log</span>
            </div>
            <div className="bg-black/50 rounded p-2 max-h-32 overflow-y-auto">
              <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap">
                {installOutput}
              </pre>
            </div>
          </div>
        )}

        {/* Automation Features */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
          <h4 className="text-white font-medium mb-2 text-sm">Automation Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>• Lead capture testing</div>
            <div>• Form validation</div>
            <div>• Mobile responsiveness</div>
            <div>• Performance metrics</div>
            <div>• Theme switching</div>
            <div>• Navigation testing</div>
          </div>
        </div>

        {/* Next Steps */}
        {readinessScore >= 75 && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">
                Automation Ready
              </span>
            </div>
            <div className="text-xs text-green-200 mt-1">
              All systems operational. Ready for comprehensive testing.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}