import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Play, Square, Activity, Brain, Layers, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuantumTestStatus {
  status: string;
  quantumLayers: number;
  recursionDepth: number;
  parallelInstances: number;
  autonomousActions: string[];
  systemReadiness: number;
  quantumCoherence: number;
}

export default function QuantumStressTester() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testStatus, setTestStatus] = useState<QuantumTestStatus | null>(null);
  const { toast } = useToast();

  const initializeQuantumTesting = async () => {
    try {
      const response = await fetch('/api/quantum-stress-test/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsInitialized(true);
        toast({
          title: "Quantum Testing Initialized",
          description: `${data.browsers} browser instances ready across ${data.layers} quantum layers`
        });
      }
    } catch (error) {
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize quantum stress testing",
        variant: "destructive"
      });
    }
  };

  const runQuantumStressTesting = async () => {
    try {
      const response = await fetch('/api/quantum-stress-test/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsRunning(true);
        toast({
          title: "Quantum Stress Testing Started",
          description: `Running ${data.testLayers.length} quantum layers with depth ${data.recursiveDepth}`
        });
        
        // Get status updates
        setTimeout(getTestStatus, 2000);
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to start quantum stress testing",
        variant: "destructive"
      });
    }
  };

  const getTestStatus = async () => {
    try {
      const response = await fetch('/api/quantum-stress-test/status');
      const data = await response.json();
      setTestStatus(data);
    } catch (error) {
      console.warn('Failed to get test status');
    }
  };

  const stopQuantumTesting = async () => {
    try {
      const response = await fetch('/api/quantum-stress-test/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsRunning(false);
        toast({
          title: "Quantum Testing Stopped",
          description: "All autonomous testing instances terminated"
        });
      }
    } catch (error) {
      toast({
        title: "Stop Failed",
        description: "Failed to stop quantum testing",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gray-900/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-purple-400" />
          Autonomous Quantum Stress Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isInitialized ? (
            <Button 
              onClick={initializeQuantumTesting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Initialize Quantum Testing
            </Button>
          ) : (
            <>
              {!isRunning ? (
                <Button 
                  onClick={runQuantumStressTesting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Autonomous Testing
                </Button>
              ) : (
                <Button 
                  onClick={stopQuantumTesting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Testing
                </Button>
              )}
            </>
          )}
        </div>

        {/* Status Display */}
        {testStatus && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">System Readiness</div>
                <Progress 
                  value={testStatus.systemReadiness * 100} 
                  className="h-2"
                />
                <div className="text-xs text-gray-300 mt-1">
                  {(testStatus.systemReadiness * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Quantum Coherence</div>
                <Progress 
                  value={testStatus.quantumCoherence * 100} 
                  className="h-2"
                />
                <div className="text-xs text-gray-300 mt-1">
                  {(testStatus.quantumCoherence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800/50 p-3 rounded">
                <Layers className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{testStatus.quantumLayers}</div>
                <div className="text-xs text-gray-400">Quantum Layers</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{testStatus.recursionDepth}</div>
                <div className="text-xs text-gray-400">Recursion Depth</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded">
                <Cpu className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{testStatus.parallelInstances}</div>
                <div className="text-xs text-gray-400">Parallel Instances</div>
              </div>
            </div>

            {/* Autonomous Actions */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Autonomous Actions</div>
              <div className="flex flex-wrap gap-1">
                {testStatus.autonomousActions.map((action, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-gray-700 text-gray-300"
                  >
                    {action.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge 
                className={`${
                  testStatus.status === 'active' 
                    ? 'bg-green-600' 
                    : 'bg-gray-600'
                } text-white`}
              >
                {testStatus.status.toUpperCase()}
              </Badge>
              {isRunning && (
                <div className="flex items-center gap-2 text-green-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Running recursive quantum tests...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="text-xs text-gray-400 border-t border-gray-700 pt-4">
          Autonomous Quantum Stress Tester uses Puppeteer with recursive quantum technology 
          to simulate user interactions across multiple browser instances. Tests include 
          login flows, dashboard navigation, agent activation, strategy selection, and 
          concurrent trading scenarios with self-healing capabilities.
        </div>
      </CardContent>
    </Card>
  );
}