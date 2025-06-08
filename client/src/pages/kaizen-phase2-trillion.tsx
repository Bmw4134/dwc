import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, DollarSign, BarChart3, Shield, Activity, Settings, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Phase2TrillionStatus {
  phase: string;
  version: string;
  current_balance: number;
  target_balance: number;
  initialization_time: string;
  components: {
    delta_scalping: { status: string; strategy: string };
    compound_strategy: { status: string; controller: string };
    platform_adapter: { status: string; platforms: number };
    sentiment_layer: { status: string; mobile_override: boolean };
    agent_memory: { status: string; error_thresholding: boolean };
  };
  safety_features: {
    preview_only: boolean;
    budget_cap: number;
    withdrawal_prevention: boolean;
    manual_override_required: boolean;
    emergency_code: string;
  };
  platform_readiness: {
    [key: string]: {
      ready: boolean;
      mode: string;
      primary: boolean;
      requires_credentials: boolean;
    };
  };
  readiness_status: {
    PHASE_2_TRILLION_READY: boolean;
    components_initialized: string[];
    deployment_ready: boolean;
    trading_ready: boolean;
    credentials_required: string[];
  };
}

export default function KaizenPhase2Trillion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeComponent, setActiveComponent] = useState("overview");

  const { data: systemStatus, isLoading } = useQuery<Phase2TrillionStatus>({
    queryKey: ["/api/trading/phase2trillion/status"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const initializeMutation = useMutation({
    mutationFn: () => apiRequest("/api/trading/phase2trillion/initialize"),
    onSuccess: () => {
      toast({
        title: "System Initialized",
        description: "Phase 2 Trillion system has been successfully initialized",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trading/phase2trillion/status"] });
    },
    onError: () => {
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize Phase 2 Trillion system",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-yellow-500";
  };

  const getReadinessProgress = () => {
    if (!systemStatus) return 0;
    const total = Object.keys(systemStatus.components).length;
    const active = systemStatus.readiness_status.components_initialized.length;
    return (active / total) * 100;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Phase 2 Trillion System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kaizen Phase 2 Trillion Quantum Trading System
          </h1>
          <p className="text-gray-600 mt-2">Advanced Delta Scalping & Compound Gains Platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={systemStatus?.readiness_status.PHASE_2_TRILLION_READY ? "default" : "secondary"}>
            {systemStatus?.readiness_status.PHASE_2_TRILLION_READY ? "OPERATIONAL" : "INITIALIZING"}
          </Badge>
          <Button 
            onClick={() => initializeMutation.mutate()}
            disabled={initializeMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {initializeMutation.isPending ? "Initializing..." : "Initialize System"}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemStatus?.current_balance || 0}</div>
            <p className="text-xs text-muted-foreground">Starting capital</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Balance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemStatus?.target_balance || 0}</div>
            <p className="text-xs text-muted-foreground">Phase 1 goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Readiness</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(getReadinessProgress())}%</div>
            <Progress value={getReadinessProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Count</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus?.components.platform_adapter.platforms || 0}</div>
            <p className="text-xs text-muted-foreground">Connected platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Safety Alert */}
      {systemStatus?.safety_features.preview_only && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Safety Mode Active:</strong> System is in preview-only mode. Manual approval required for all trades. 
            Budget cap: ${systemStatus.safety_features.budget_cap}. Emergency override: {systemStatus.safety_features.emergency_code}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeComponent} onValueChange={setActiveComponent}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="credentials">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Delta Scalping Engine</span>
                </CardTitle>
                <CardDescription>Primary trading strategy with micro-movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(systemStatus?.components.delta_scalping.status || "")}>
                      {systemStatus?.components.delta_scalping.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategy:</span>
                    <span className="font-semibold">{systemStatus?.components.delta_scalping.strategy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Compound Strategy</span>
                </CardTitle>
                <CardDescription>Automated gain compounding controller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(systemStatus?.components.compound_strategy.status || "")}>
                      {systemStatus?.components.compound_strategy.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Controller:</span>
                    <span className="font-semibold">{systemStatus?.components.compound_strategy.controller}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus && Object.entries(systemStatus.components).map(([key, component]) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{key.replace(/_/g, ' ').toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(component.status)}>
                      {component.status?.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus && Object.entries(systemStatus.platform_readiness).map(([platform, config]) => (
              <Card key={platform}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {platform.toUpperCase()}
                    {config.primary && <Badge variant="outline">PRIMARY</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Ready:</span>
                    <Badge variant={config.ready ? "default" : "secondary"}>
                      {config.ready ? "YES" : "NO"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mode:</span>
                    <span className="text-sm font-semibold">{config.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Credentials:</span>
                    <Badge variant={config.requires_credentials ? "destructive" : "default"}>
                      {config.requires_credentials ? "REQUIRED" : "NOT NEEDED"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Safety Features</span>
              </CardTitle>
              <CardDescription>Active protection mechanisms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus && Object.entries(systemStatus.safety_features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}</span>
                  <Badge variant={typeof value === 'boolean' ? (value ? "default" : "secondary") : "outline"}>
                    {String(value)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Required API Credentials</span>
              </CardTitle>
              <CardDescription>Set up these environment variables to enable trading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus?.readiness_status.credentials_required.map((credential) => (
                  <div key={credential} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <span className="font-mono text-sm">{credential}</span>
                    <Badge variant="outline">REQUIRED</Badge>
                  </div>
                ))}
              </div>
              <Alert className="mt-4">
                <AlertDescription>
                  Add these API keys to your environment variables to enable live trading. 
                  Currently running in safe mode with testnet/sandbox configurations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}