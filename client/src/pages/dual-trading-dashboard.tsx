import React from 'react';
import { DualTradingDashboard } from '@/components/DualTradingDashboard';
import { PionexCredentialSetup } from '@/components/PionexCredentialSetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Zap, Target, Settings } from 'lucide-react';

export default function DualTradingDashboardPage() {
  // Fetch rapid deployment status
  const { data: deploymentStatus } = useQuery({
    queryKey: ['/api/rapid-deployment/status'],
    refetchInterval: 10000
  });

  const handleStartRapidDeployment = async () => {
    try {
      const response = await fetch('/api/rapid-deployment/start', { method: 'POST' });
      const result = await response.json();
      console.log('Rapid deployment started:', result);
    } catch (error) {
      console.error('Failed to start rapid deployment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quantum Trading Intelligence
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Advanced AI-powered trading system with simultaneous simulation and real-money comparison for continuous model learning
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                Model Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <p className="text-xs text-muted-foreground">Continuous improvement</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2 text-purple-500" />
                Accuracy Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">85%+</div>
              <p className="text-xs text-muted-foreground">Model performance goal</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 text-green-500" />
                Safety Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Enabled</div>
              <p className="text-xs text-muted-foreground">$100 minimum protection</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-slate-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Settings className="h-4 w-4 mr-2 text-slate-500" />
                Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-600">
                {deploymentStatus?.isRunning ? 'Running' : 'Ready'}
              </div>
              <p className="text-xs text-muted-foreground">
                {deploymentStatus?.progress ? `${deploymentStatus.progress.toFixed(0)}%` : 'Standby'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rapid Deployment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-500" />
              Rapid Deployment Accelerator
            </CardTitle>
            <CardDescription>
              Accelerate deployment from 158 hours to 60 minutes through automated validation and testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={deploymentStatus?.isRunning ? "default" : "secondary"}>
                    {deploymentStatus?.isRunning ? 'Active' : 'Ready'}
                  </Badge>
                  {deploymentStatus?.currentPhase && (
                    <span className="text-sm text-muted-foreground">
                      {deploymentStatus.currentPhase}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Time reduction: 99.4% (158h → 1h)
                </p>
              </div>
              <Button 
                onClick={handleStartRapidDeployment}
                disabled={deploymentStatus?.isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {deploymentStatus?.isRunning ? 'Running...' : 'Start Rapid Deploy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pionex Account Setup */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-green-500" />
              Pionex.us Real Trading Setup
            </CardTitle>
            <CardDescription>
              Connect your Pionex.us account to enable real money trading with your $150 starting balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PionexCredentialSetup />
          </CardContent>
        </Card>

        {/* Main Dual Trading Dashboard */}
        <DualTradingDashboard />

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
            <CardDescription>Current system configuration and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Trading Engine</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dual SIM/REAL comparison</li>
                  <li>• Browser-based execution</li>
                  <li>• Pionex.us integration</li>
                  <li>• Real-time model learning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Safety Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stop-loss protection ($100)</li>
                  <li>• Conservative real trading (5%)</li>
                  <li>• Position size limits</li>
                  <li>• Emergency shutdown</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deployment</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automated testing</li>
                  <li>• Performance validation</li>
                  <li>• Security verification</li>
                  <li>• Production ready</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}