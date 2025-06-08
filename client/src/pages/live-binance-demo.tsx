import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Activity, CheckCircle, AlertCircle, Play, Square } from "lucide-react";

interface LiveAutomationStep {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  timestamp?: string;
  details?: string;
}

interface LiveAutomationStatus {
  isRunning: boolean;
  currentStep: string;
  progress: number;
  screenshot?: string;
  logs: string[];
}

export default function LiveBinanceDemo() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    apiKeyLabel: "DWC-Live-Trading-2025"
  });
  
  const [automationStatus, setAutomationStatus] = useState<LiveAutomationStatus>({
    isRunning: false,
    currentStep: 'Ready',
    progress: 0,
    logs: []
  });
  
  const [steps, setSteps] = useState<LiveAutomationStep[]>([
    { id: 'init', title: 'Initialize Browser Environment', status: 'pending' },
    { id: 'navigate', title: 'Navigate to Binance Registration', status: 'pending' },
    { id: 'consent', title: 'Handle Cookie Consent', status: 'pending' },
    { id: 'register', title: 'Fill Registration Form', status: 'pending' },
    { id: 'verify', title: 'Process Email Verification', status: 'pending' },
    { id: 'login', title: 'Login to Account', status: 'pending' },
    { id: 'api_access', title: 'Access API Management', status: 'pending' },
    { id: 'api_create', title: 'Create API Credentials', status: 'pending' },
    { id: 'extract', title: 'Extract API Keys', status: 'pending' },
    { id: 'validate', title: 'Validate Integration', status: 'pending' }
  ]);

  const startLiveAutomation = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please provide email and password for live account creation",
        variant: "destructive"
      });
      return;
    }

    setAutomationStatus(prev => ({ ...prev, isRunning: true, progress: 0, logs: [] }));
    
    try {
      // Start the live automation
      const response = await fetch('/api/binance/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to start automation');
      }
      
      // Start polling for status updates
      pollAutomationStatus();
      
      toast({
        title: "Live Automation Started",
        description: "Real browser automation initiated - watch the progress below",
        duration: 3000
      });
      
    } catch (error: any) {
      console.error('Automation error:', error);
      toast({
        title: "Automation Failed",
        description: error.message || "Failed to start live automation",
        variant: "destructive"
      });
      setAutomationStatus(prev => ({ ...prev, isRunning: false }));
    }
  };

  const pollAutomationStatus = async () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/binance/live-automation-status', {
          method: 'POST'
        });
        
        if (response.ok) {
          const status = await response.json();
          setAutomationStatus(prev => ({
            ...prev,
            currentStep: status.currentStep || prev.currentStep,
            progress: status.progress || prev.progress,
            screenshot: status.screenshot,
            logs: [...prev.logs, ...(status.newLogs || [])]
          }));
          
          // Update step statuses based on current progress
          if (status.completedSteps) {
            setSteps(prev => prev.map(step => ({
              ...step,
              status: status.completedSteps.includes(step.id) ? 'completed' :
                     status.currentStep === step.id ? 'active' : step.status
            })));
          }
          
          // Stop polling if automation is complete
          if (status.isComplete) {
            clearInterval(pollInterval);
            setAutomationStatus(prev => ({ ...prev, isRunning: false }));
            toast({
              title: "Automation Complete",
              description: "Binance account and API keys successfully created",
              duration: 5000
            });
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 10 minutes max
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  const stopAutomation = () => {
    setAutomationStatus(prev => ({ ...prev, isRunning: false }));
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    toast({
      title: "Automation Stopped",
      description: "Live automation has been terminated",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Live Binance Account Automation
          </h1>
          <p className="text-xl text-purple-300">
            Real-time browser automation for Binance account creation and API setup
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Control Panel */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                Automation Control
              </CardTitle>
              <CardDescription className="text-purple-300">
                Configure and start live Binance automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your-email@example.com"
                  className="bg-slate-700 border-purple-500/30 text-white"
                  disabled={automationStatus.isRunning}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Secure password"
                  className="bg-slate-700 border-purple-500/30 text-white"
                  disabled={automationStatus.isRunning}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiLabel" className="text-white">API Key Label</Label>
                <Input
                  id="apiLabel"
                  value={formData.apiKeyLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKeyLabel: e.target.value }))}
                  className="bg-slate-700 border-purple-500/30 text-white"
                  disabled={automationStatus.isRunning}
                />
              </div>
              
              <div className="flex gap-2">
                {!automationStatus.isRunning ? (
                  <Button 
                    onClick={startLiveAutomation} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Live Automation
                  </Button>
                ) : (
                  <Button 
                    onClick={stopAutomation} 
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Automation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Status */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Live Status
              </CardTitle>
              <CardDescription className="text-purple-300">
                Real-time automation progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Progress</span>
                  <span className="text-purple-300">{automationStatus.progress}%</span>
                </div>
                <Progress value={automationStatus.progress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Current Step</Label>
                <div className="p-3 bg-slate-700 rounded-lg">
                  <p className="text-green-400 font-mono">{automationStatus.currentStep}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Status</Label>
                <Badge variant={automationStatus.isRunning ? "default" : "secondary"}>
                  {automationStatus.isRunning ? "Running" : "Idle"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automation Steps */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Automation Steps</CardTitle>
            <CardDescription className="text-purple-300">
              Real-time step-by-step progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-shrink-0">
                    {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {step.status === 'active' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
                    {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                    {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-slate-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{step.title}</p>
                    {step.timestamp && (
                      <p className="text-xs text-purple-300">{step.timestamp}</p>
                    )}
                  </div>
                  <Badge variant={
                    step.status === 'completed' ? 'default' :
                    step.status === 'active' ? 'secondary' :
                    step.status === 'error' ? 'destructive' : 'outline'
                  }>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Live Automation Logs</CardTitle>
            <CardDescription className="text-purple-300">
              Real-time browser automation activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {automationStatus.logs.length === 0 ? (
                <p className="text-green-400">Waiting for automation to start...</p>
              ) : (
                automationStatus.logs.map((log, index) => (
                  <div key={index} className="text-green-400 mb-1">
                    {log}
                  </div>
                ))
              )}
              {automationStatus.isRunning && (
                <div className="text-blue-400 animate-pulse">
                  ▶ Automation running...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}