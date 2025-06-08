import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Monitor, 
  Brain, 
  Zap, 
  Eye, 
  Target, 
  Activity,
  Layers,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';

interface QuantumUserBehavior {
  id: string;
  action: string;
  confidence: number;
  impact: number;
  timestamp: Date;
  recommendation: string;
}

interface AutomationKernel {
  isActive: boolean;
  mode: 'manual' | 'semi-auto' | 'full-auto';
  transitions: number;
  efficiency: number;
}

export default function NexusDashboard() {
  const [activeView, setActiveView] = useState<'split' | 'overlay' | 'trace'>('split');
  const [automationKernel, setAutomationKernel] = useState<AutomationKernel>({
    isActive: true,
    mode: 'semi-auto',
    transitions: 23,
    efficiency: 94.7
  });
  
  const [userBehaviors, setUserBehaviors] = useState<QuantumUserBehavior[]>([
    {
      id: 'qub-001',
      action: 'Dashboard Navigation Pattern',
      confidence: 0.97,
      impact: 8.4,
      timestamp: new Date(),
      recommendation: 'Optimize lead flow for 2.3s faster processing'
    },
    {
      id: 'qub-002', 
      action: 'Trading Interface Interaction',
      confidence: 0.89,
      impact: 7.2,
      timestamp: new Date(Date.now() - 120000),
      recommendation: 'Automate recurring portfolio checks'
    },
    {
      id: 'qub-003',
      action: 'Business Intelligence Query',
      confidence: 0.94,
      impact: 9.1,
      timestamp: new Date(Date.now() - 300000),
      recommendation: 'Pre-cache analytics for instant access'
    }
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [domTraceActive, setDomTraceActive] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [visualIntelligence, setVisualIntelligence] = useState({
    scanProgress: 87,
    elementsTracked: 1247,
    automationOpportunities: 34,
    optimizationScore: 94.7
  });

  const simulateQuantumBehavior = async () => {
    try {
      const response = await fetch('/api/nexus/generate-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Manual UI Optimization Trigger' })
      });
      
      if (response.ok) {
        const newBehavior = await response.json();
        setUserBehaviors(prev => [newBehavior.data, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error generating quantum behavior:', error);
      // Fallback to local simulation
      const newBehavior: QuantumUserBehavior = {
        id: `qub-${Date.now()}`,
        action: 'Real-time UI Adaptation',
        confidence: 0.92 + Math.random() * 0.08,
        impact: 8.0 + Math.random() * 2.0,
        timestamp: new Date(),
        recommendation: 'Dynamic layout adjustment detected'
      };
      setUserBehaviors(prev => [newBehavior, ...prev.slice(0, 4)]);
    }
  };

  const toggleAutomationMode = () => {
    const modes: AutomationKernel['mode'][] = ['manual', 'semi-auto', 'full-auto'];
    const currentIndex = modes.indexOf(automationKernel.mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setAutomationKernel(prev => ({
      ...prev,
      mode: nextMode,
      transitions: prev.transitions + 1,
      efficiency: nextMode === 'full-auto' ? 97.3 : nextMode === 'semi-auto' ? 94.7 : 89.2
    }));
  };

  useEffect(() => {
    // Initialize WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('NEXUS Intelligence WebSocket connected');
      setConnectionStatus('connected');
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'quantum_behavior':
            setUserBehaviors(prev => [message.data, ...prev.slice(0, 4)]);
            break;
          case 'automation_kernel':
            setAutomationKernel(message.data);
            break;
          case 'visual_intelligence':
            setVisualIntelligence(message.data);
            break;
          case 'initial_state':
            if (message.data.userBehaviors) {
              setUserBehaviors(message.data.userBehaviors);
            }
            if (message.data.automationKernel) {
              setAutomationKernel(message.data.automationKernel);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('NEXUS Intelligence WebSocket disconnected');
      setConnectionStatus('disconnected');
      setWebsocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    // Fallback local simulation if WebSocket not connected
    if (connectionStatus !== 'connected') {
      const interval = setInterval(simulateQuantumBehavior, 5000);
      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  useEffect(() => {
    // Local visual intelligence updates as fallback
    const progressInterval = setInterval(() => {
      if (connectionStatus !== 'connected') {
        setVisualIntelligence(prev => ({
          ...prev,
          scanProgress: Math.min(100, prev.scanProgress + Math.random() * 3),
          elementsTracked: prev.elementsTracked + Math.floor(Math.random() * 10),
          automationOpportunities: prev.automationOpportunities + (Math.random() > 0.7 ? 1 : 0)
        }));
      }
    }, 2000);
    
    return () => clearInterval(progressInterval);
  }, [connectionStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
      {/* NEXUS Header */}
      <div className="border-b border-blue-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NEXUS Visual Intelligence
              </h1>
            </div>
            <Badge variant="outline" className={`border-${connectionStatus === 'connected' ? 'green' : connectionStatus === 'connecting' ? 'yellow' : 'red'}-500/50 text-${connectionStatus === 'connected' ? 'green' : connectionStatus === 'connecting' ? 'yellow' : 'red'}-400`}>
              {connectionStatus === 'connected' ? 'Intelligence Online' : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline Mode'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">
              Automation Kernel: <span className="text-blue-400 font-semibold">{automationKernel.efficiency}%</span>
            </div>
            <Button 
              onClick={toggleAutomationMode}
              variant="outline" 
              size="sm"
              className="border-blue-500/50 hover:bg-blue-500/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              {automationKernel.mode.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Visual Intelligence Controls */}
        <div className="w-80 border-r border-slate-700/50 bg-slate-900/30 backdrop-blur-sm p-6 overflow-y-auto">
          <Tabs defaultValue="behavior" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="behavior" className="text-xs">Behavior</TabsTrigger>
              <TabsTrigger value="automation" className="text-xs">Automation</TabsTrigger>
              <TabsTrigger value="trace" className="text-xs">DOM Trace</TabsTrigger>
            </TabsList>

            <TabsContent value="behavior" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    Quantum User Simulation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userBehaviors.map((behavior) => (
                    <div key={behavior.id} className="space-y-2 p-3 rounded bg-slate-700/30 border border-slate-600/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-300">{behavior.action}</span>
                        <Badge variant="secondary" className="text-xs">
                          {(behavior.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <Progress 
                        value={behavior.impact * 10} 
                        className="h-2"
                      />
                      <p className="text-xs text-slate-400">{behavior.recommendation}</p>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={simulateQuantumBehavior}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Simulate Behavior
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Automation Kernel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded bg-slate-700/30">
                      <div className="text-2xl font-bold text-green-400">{automationKernel.transitions}</div>
                      <div className="text-xs text-slate-400">Transitions</div>
                    </div>
                    <div className="text-center p-3 rounded bg-slate-700/30">
                      <div className="text-2xl font-bold text-blue-400">{automationKernel.efficiency}%</div>
                      <div className="text-xs text-slate-400">Efficiency</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mode:</span>
                      <Badge variant={automationKernel.mode === 'full-auto' ? 'default' : 'secondary'}>
                        {automationKernel.mode}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Pause className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trace" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-400" />
                    DOM Tracer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scan Progress:</span>
                      <span className="text-sm text-blue-400">{visualIntelligence.scanProgress}%</span>
                    </div>
                    <Progress value={visualIntelligence.scanProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Elements:</span>
                      <span className="text-white">{visualIntelligence.elementsTracked.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Opportunities:</span>
                      <span className="text-green-400">{visualIntelligence.automationOpportunities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Score:</span>
                      <span className="text-blue-400">{visualIntelligence.optimizationScore}%</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setDomTraceActive(!domTraceActive)}
                    className={`w-full ${domTraceActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    size="sm"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {domTraceActive ? 'Stop Trace' : 'Start Trace'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Display Area - Split View */}
        <div className="flex-1 flex flex-col">
          {/* View Controls */}
          <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === 'split' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('split')}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Split View
                </Button>
                <Button
                  variant={activeView === 'overlay' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('overlay')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Overlay
                </Button>
                <Button
                  variant={activeView === 'trace' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('trace')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Trace Mode
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-slate-400">
                  Live Simulation: <span className="text-green-400">{visualIntelligence.elementsTracked.toLocaleString()} elements</span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/50 hover:bg-blue-500/20"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Return to DWC Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Split View Content */}
          <div className="flex-1 flex">
            {/* Left Side - Live Interface */}
            <div className="flex-1 relative bg-slate-900/20">
              <iframe
                ref={iframeRef}
                src="/"
                className="w-full h-full border-none"
                title="Live DWC Interface"
                onLoad={() => {
                  if (domTraceActive && iframeRef.current?.contentWindow) {
                    console.log('DOM trace active on iframe load');
                  }
                }}
              />
              
              {domTraceActive && (
                <div className="absolute inset-0 pointer-events-none bg-blue-500/10 border border-blue-500/30">
                  <div className="absolute top-4 right-4 bg-blue-900/80 text-blue-200 px-3 py-1 rounded text-sm">
                    DOM Trace Active
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Intelligence Analysis */}
            <div className="w-96 border-l border-slate-700/50 bg-slate-900/30 backdrop-blur-sm p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Real-time Metrics */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Live Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 rounded bg-slate-700/30">
                        <div className="text-xl font-bold text-green-400">
                          {Math.round(visualIntelligence.optimizationScore)}%
                        </div>
                        <div className="text-xs text-slate-400">UX Score</div>
                      </div>
                      <div className="text-center p-3 rounded bg-slate-700/30">
                        <div className="text-xl font-bold text-blue-400">
                          {visualIntelligence.automationOpportunities}
                        </div>
                        <div className="text-xs text-slate-400">Auto Ops</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Performance:</span>
                        <span className="text-green-400">Optimal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Load Time:</span>
                        <span className="text-blue-400">1.2s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Efficiency:</span>
                        <span className="text-purple-400">{automationKernel.efficiency}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quantum Recommendations */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userBehaviors.slice(0, 3).map((behavior) => (
                      <div key={behavior.id} className="p-3 rounded bg-slate-700/30 border border-slate-600/30">
                        <div className="text-sm font-medium text-blue-300 mb-1">
                          {behavior.action}
                        </div>
                        <div className="text-xs text-slate-400 mb-2">
                          {behavior.recommendation}
                        </div>
                        <div className="flex items-center justify-between">
                          <Progress value={behavior.confidence * 100} className="h-1 flex-1 mr-2" />
                          <span className="text-xs text-slate-500">
                            {(behavior.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* System Controls */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">System Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={simulateQuantumBehavior}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Insight
                    </Button>
                    
                    <Button 
                      onClick={toggleAutomationMode}
                      variant="outline"
                      className="w-full border-blue-500/50 hover:bg-blue-500/20"
                      size="sm"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Switch to {automationKernel.mode === 'manual' ? 'Semi-Auto' : automationKernel.mode === 'semi-auto' ? 'Full-Auto' : 'Manual'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-green-500/50 hover:bg-green-500/20"
                      size="sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Export Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}