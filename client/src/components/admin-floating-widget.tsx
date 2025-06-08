import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Settings, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Move,
  Navigation,
  Home,
  Camera,
  BarChart3,
  FileText,
  Smartphone
} from "lucide-react";

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  action: string;
  status: "pending" | "active" | "completed" | "skipped";
  automatable: boolean;
  estimatedTime: string;
}

interface AdminFloatingWidgetProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AdminFloatingWidget({ isVisible, onClose }: AdminFloatingWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [tradingStatus, setTradingStatus] = useState({
    active: false,
    balance: 150.49,
    hyperdriveMode: false,
    quantumMode: false,
    tradeCount: 18
  });

  // Trading control functions
  const toggleTrading = async () => {
    try {
      const response = await fetch('/api/trading/toggle', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !tradingStatus.active })
      });
      const result = await response.json();
      setTradingStatus(prev => ({ ...prev, active: result.active }));
    } catch (error) {
      console.error('Trading toggle failed:', error);
    }
  };

  const toggleHyperdrive = async () => {
    try {
      const response = await fetch('/api/trading/hyperdrive', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hyperdrive: !tradingStatus.hyperdriveMode })
      });
      const result = await response.json();
      setTradingStatus(prev => ({ ...prev, hyperdriveMode: result.hyperdriveMode }));
    } catch (error) {
      console.error('Hyperdrive toggle failed:', error);
    }
  };

  const toggleQuantum = async () => {
    try {
      const response = await fetch('/api/trading/quantum', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantum: !tradingStatus.quantumMode })
      });
      const result = await response.json();
      setTradingStatus(prev => ({ ...prev, quantumMode: result.quantumMode }));
    } catch (error) {
      console.error('Quantum mode toggle failed:', error);
    }
  };
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();
  const [walkthroughSteps, setWalkthroughSteps] = useState<WalkthroughStep[]>([
    {
      id: "automation-session",
      title: "Create Automation Session",
      description: "Initialize dashboard automation with Puppeteer",
      action: "Create new automation session for dashboard control",
      status: "active",
      automatable: true,
      estimatedTime: "30 seconds"
    },
    {
      id: "qq-trading-automation",
      title: "QQ Trading Automation",
      description: "Start quantum trading engine with real market data",
      action: "Execute automated trading setup and monitoring",
      status: "pending",
      automatable: true,
      estimatedTime: "2 minutes"
    },
    {
      id: "business-scan-automation",
      title: "Business Scan Automation",
      description: "Automated lead scanning with free business sources",
      action: "Run comprehensive business discovery and scoring",
      status: "pending",
      automatable: true,
      estimatedTime: "3 minutes"
    },
    {
      id: "dashboard-workflow",
      title: "Full Dashboard Workflow",
      description: "Complete end-to-end automation pipeline",
      action: "Execute comprehensive dashboard automation sequence",
      status: "pending",
      automatable: true,
      estimatedTime: "5 minutes"
    },
    {
      id: "stress-testing",
      title: "System Stress Testing",
      description: "Validate automation performance and reliability",
      action: "Run stress tests on all automation components",
      status: "pending",
      automatable: true,
      estimatedTime: "2 minutes"
    }
  ]);

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Navigation shortcuts
  const navigationLinks = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/qq-trading", label: "QQ Trading", icon: Camera },
    { path: "/automation-hub", label: "Automation Hub", icon: Smartphone },
    { path: "/quantum-intelligence", label: "Intelligence", icon: BarChart3 },
    { path: "/qq-pipeline", label: "QQ Pipeline", icon: Zap },
    { path: "/client-reports", label: "Reports", icon: FileText },
  ];

  const executeStep = async (stepIndex: number) => {
    const step = walkthroughSteps[stepIndex];
    
    // Update step status to active
    setWalkthroughSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: "active" } : s
    ));

    try {
      // Execute step based on step type
      switch (step.id) {
        case "automation-session":
          // Create automation session
          await fetch('/api/automation/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          break;
        case "qq-trading-automation":
          // Start QQ trading automation
          await fetch('/api/qq-trading/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          break;
        case "business-scan-automation":
          // Run business scan automation
          await fetch('/api/business/scan-free-sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              location: 'Fort Worth, TX',
              businessTypes: ['restaurant', 'retail', 'healthcare', 'professional_services']
            })
          });
          break;
        case "dashboard-workflow":
          // Execute full dashboard automation
          const sessionResponse = await fetch('/api/automation/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const sessionData = await sessionResponse.json();
          if (sessionData.sessionId) {
            await fetch(`/api/automation/execute-full-workflow/${sessionData.sessionId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
          }
          break;
        case "stress-testing":
          // Run comprehensive stress testing
          await fetch('/api/stress-test/run-comprehensive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          break;
      }

      // Mark step as completed after delay
      setTimeout(() => {
        setWalkthroughSteps(prev => prev.map((s, i) => 
          i === stepIndex ? { ...s, status: "completed" } : s
        ));
        
        if (isAutoMode && stepIndex < walkthroughSteps.length - 1) {
          setCurrentStep(stepIndex + 1);
          executeStep(stepIndex + 1);
        }
      }, 2000);
    } catch (error) {
      // Mark step as failed
      setWalkthroughSteps(prev => prev.map((s, i) => 
        i === stepIndex ? { ...s, status: "pending" } : s
      ));
      console.error('Step execution failed:', error);
    }
  };

  const startAutoMode = () => {
    setIsAutoMode(true);
    executeStep(currentStep);
  };

  const stopAutoMode = () => {
    setIsAutoMode(false);
  };

  const resetWalkthrough = () => {
    setCurrentStep(0);
    setIsAutoMode(false);
    setWalkthroughSteps(prev => prev.map(step => ({ 
      ...step, 
      status: step.id === "client-intake" ? "active" : "pending" 
    })));
  };

  const nextStep = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "active": return <Clock className="h-4 w-4 text-blue-400 animate-pulse" />;
      case "pending": return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const completedSteps = walkthroughSteps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / walkthroughSteps.length) * 100;

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 select-none"
      style={{ left: position.x, top: position.y }}
      ref={dragRef}
    >
      <Card className={`bg-gray-900/95 border-gray-700/50 backdrop-blur-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-auto"
      } ${isDragging ? "cursor-grabbing" : ""}`}>
        {/* Header with Drag Handle */}
        <CardHeader className="pb-3 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-grab active:cursor-grabbing flex-1"
              onMouseDown={handleMouseDown}
            >
              <Move className="h-4 w-4 text-gray-400" />
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-400" />
                Admin Control
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNavigation(!showNavigation)}
                className="text-gray-400 hover:text-white"
              >
                <Navigation className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Current Location Display */}
          <div className="mt-2 text-sm text-gray-400">
            Current: {location}
          </div>
          {!isMinimized && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{completedSteps}/{walkthroughSteps.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-700" />
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 space-y-4">
            {/* Trading Control Panel */}
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-white font-medium mb-3 text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                Live Trading Control
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Balance:</span>
                  <span className="text-green-400 font-mono">${tradingStatus.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Trades:</span>
                  <span className="text-blue-400">#{tradingStatus.tradeCount}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={toggleTrading}
                    className={`${tradingStatus.active 
                      ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30" 
                      : "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                    }`}
                  >
                    {tradingStatus.active ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                    {tradingStatus.active ? "Stop" : "Start"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={toggleHyperdrive}
                    className={`${tradingStatus.hyperdriveMode 
                      ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" 
                      : "bg-gray-700/20 text-gray-400 border border-gray-600/30 hover:bg-orange-500/20 hover:text-orange-300"
                    }`}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Hyperdrive
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={toggleQuantum}
                  className={`w-full ${tradingStatus.quantumMode 
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                    : "bg-gray-700/20 text-gray-400 border border-gray-600/30 hover:bg-purple-500/20 hover:text-purple-300"
                  }`}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Quantum Mode
                </Button>
              </div>
            </div>

            {/* Quick Navigation Panel */}
            {showNavigation && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30 mb-4">
                <h4 className="text-white font-medium mb-3 text-sm">Quick Navigation</h4>
                <div className="grid grid-cols-2 gap-2">
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={link.path}
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation(link.path)}
                        className={`justify-start text-xs ${
                          location === link.path 
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                            : "text-gray-300 hover:bg-gray-700/50"
                        }`}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {link.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Current Step */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-start gap-3">
                {getStepIcon(walkthroughSteps[currentStep]?.status)}
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {walkthroughSteps[currentStep]?.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {walkthroughSteps[currentStep]?.description}
                  </p>
                  <p className="text-blue-300 text-sm font-medium">
                    {walkthroughSteps[currentStep]?.action}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {walkthroughSteps[currentStep]?.estimatedTime}
                    </Badge>
                    {walkthroughSteps[currentStep]?.automatable && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        Automatable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextStep}
                  disabled={currentStep === walkthroughSteps.length - 1}
                  className="border-gray-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {!isAutoMode ? (
                  <Button
                    size="sm"
                    onClick={startAutoMode}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Auto Run
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopAutoMode}
                    className="border-orange-600 text-orange-400"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetWalkthrough}
                  className="border-gray-600"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Step List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {walkthroughSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    index === currentStep 
                      ? "bg-blue-500/20 border border-blue-500/30" 
                      : "bg-gray-800/30 hover:bg-gray-700/30"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{step.title}</p>
                    <p className="text-gray-400 text-xs">{step.estimatedTime}</p>
                  </div>
                  {step.automatable && (
                    <Zap className="h-3 w-3 text-green-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Emergency Controls */}
            <div className="border-t border-gray-700/50 pt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetch('/api/automation/emergency-stop', { method: 'POST' })}
                className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Stop All Automation
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}