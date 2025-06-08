import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { 
  Building2, 
  Lock, 
  Shield,
  Users,
  Eye,
  AlertTriangle
} from "lucide-react";

export default function DemoLogin() {
  const [, setLocation] = useLocation();
  const [demoKey, setDemoKey] = useState("");
  const [error, setError] = useState("");

  const handleDemoAccess = () => {
    // Demo access validation
    if (demoKey === "NEXUS-DEMO-2025") {
      // Redirect to restricted demo dashboard
      setLocation('/demo-dashboard');
    } else {
      setError("Invalid demo access key. Contact DWC Systems for authorized demo access.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-900/90 border-emerald-500/30 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Building2 className="w-12 h-12 text-emerald-400" />
                <Shield className="w-6 h-6 text-purple-400 absolute -top-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-400">
              DWC Systems Demo Access
            </CardTitle>
            <p className="text-slate-300 text-sm">
              Authorized demonstration environment
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-semibold">Demo Environment</span>
              </div>
              <p className="text-orange-200 text-sm">
                Limited access with read-only permissions. No live trading or system modifications.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="demoKey" className="text-slate-300">
                  Demo Access Key
                </Label>
                <Input
                  id="demoKey"
                  type="password"
                  value={demoKey}
                  onChange={(e) => setDemoKey(e.target.value)}
                  placeholder="Enter authorized demo key"
                  className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400"
                />
              </div>
              
              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleDemoAccess}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                disabled={!demoKey}
              >
                <Eye className="w-4 h-4 mr-2" />
                Access Demo Environment
              </Button>
              
              <Button 
                onClick={() => setLocation('/')}
                variant="outline"
                className="w-full border-slate-500 text-slate-300 hover:bg-slate-800/50"
              >
                Back to Home
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Lock className="w-3 h-3" />
                  <span>Read-only access to dashboard metrics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3" />
                  <span>Limited user management views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>No live trading or system controls</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}