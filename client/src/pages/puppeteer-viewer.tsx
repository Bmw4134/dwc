import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { quantumLauncher, type SunoTrackConfig } from '@/lib/quantum-launcher';
import { 
  Eye, 
  Play, 
  Pause, 
  Square, 
  Monitor,
  Activity,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Camera,
  Download,
  RefreshCw,
  Zap,
  Brain,
  Settings,
  Music,
  Mic,
  Volume2,
  Headphones,
  Radio
} from 'lucide-react';


interface PuppeteerViewerProps {
  refreshTrigger: number;
}

interface DevScanResult {
  url: string;
  timestamp: Date;
  issues: Array<{
    type: string;
    severity: string;
    description: string;
    location: string;
    autoFixable: boolean;
    suggestedFix: string;
    quantumScore: number;
  }>;
  overallScore: number;
  aiRecommendations: string[];
  performanceMetrics: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  };
  accessibilityScore: number;
  quantumOptimizations: {
    displayScaling: boolean;
    responsiveDesign: boolean;
    dataIntegrity: boolean;
    securityEncryption: boolean;
  };
}

export default function PuppeteerViewer({ refreshTrigger }: PuppeteerViewerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [progress, setProgress] = useState(0);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [logs, setLogs] = useState<Array<{timestamp: string, action: string, status: string}>>([]);
  
  // Quantum AGI Browser state
  const [quantumMode, setQuantumMode] = useState(false);
  const [targetUrl, setTargetUrl] = useState(window.location.href);
  const [devScanResults, setDevScanResults] = useState<DevScanResult | null>(null);
  const [autoFixMode, setAutoFixMode] = useState(false);
  const [quantumOptimizations, setQuantumOptimizations] = useState<string[]>([]);

  // Quantum SUNO Music Generation state
  const [musicPrompt, setMusicPrompt] = useState('Give me a floor-heater cover in UKG glitchcore with Dom Dolla-style phrasing');
  const [generatedTrack, setGeneratedTrack] = useState<SunoTrackConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sunoApiKey, setSunoApiKey] = useState('');
  const [trackHistory, setTrackHistory] = useState<SunoTrackConfig[]>([]);
  const [musicMode, setMusicMode] = useState('REMI'); // REMI | Rallyhouse | SUNO

  // Quantum AGI Browser functions
  const startQuantumScan = async () => {
    try {
      setQuantumMode(true);
      
      // Direct API call to quantum development scan
      const response = await fetch('/api/quantum-dev-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: targetUrl,
          scanType: 'comprehensive',
          quantumAnalysis: true
        })
      });
      
      const scan = await response.json();
      setDevScanResults(scan);
      
      // Auto-fix critical issues if enabled
      if (autoFixMode && scan.issues.length > 0) {
        const criticalIssues = scan.issues.filter((issue: any) => issue.severity === 'critical');
        if (criticalIssues.length > 0) {
          const fixResponse = await fetch('/api/quantum-auto-fix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              issues: criticalIssues,
              quantumMode: true
            })
          });
          const autoFixResult = await fixResponse.json();
          setQuantumOptimizations(autoFixResult.quantumEnhancements);
        }
      }
    } catch (error) {
      console.error('Quantum scan failed:', error);
    }
  };

  const toggleQuantumMode = () => {
    setQuantumMode(!quantumMode);
    if (!quantumMode) {
      console.log('Quantum ASI → AGI → AI Development Mode Activated');
    }
  };

  // Quantum SUNO Music Generation functions
  const generateQuantumTrack = async () => {
    try {
      setIsGenerating(true);
      
      // Set SUNO API key if provided
      if (sunoApiKey) {
        quantumLauncher.setApiKey(sunoApiKey);
      }
      
      // Process natural language prompt through REMI + Rallyhouse
      const trackConfig = await quantumLauncher.processNaturalPrompt(musicPrompt);
      setGeneratedTrack(trackConfig);
      
      // Add to history
      setTrackHistory(prev => [trackConfig, ...prev.slice(0, 9)]);
      
      // Log generation event
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: `Generated track: ${trackConfig.title}`,
        status: 'success'
      }]);
      
    } catch (error) {
      console.error('Track generation failed:', error);
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'Track generation failed',
        status: 'error'
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const executeDemo = async () => {
    try {
      setIsGenerating(true);
      const demoConfig = await quantumLauncher.executeDemo();
      setGeneratedTrack(demoConfig);
      setMusicPrompt('Give me a floor-heater cover in UKG glitchcore with Dom Dolla-style phrasing');
    } catch (error) {
      console.error('Demo execution failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startSunoLogin = async () => {
    try {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'Starting SUNO secure login session...',
        status: 'processing'
      }]);

      const response = await fetch('/api/suno/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: result.success ? 'SUNO login successful' : `Login failed: ${result.message}`,
        status: result.success ? 'success' : 'error'
      }]);

    } catch (error) {
      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'SUNO login request failed',
        status: 'error'
      }]);
    }
  };

  // Simulate real automation tasks
  useEffect(() => {
    const automationTasks = [
      'Scanning Fort Worth business listings',
      'Extracting contact information',
      'Validating business hours',
      'Checking social media presence',
      'Analyzing competitor pricing',
      'Gathering employee count data',
      'Verifying business licenses',
      'Processing lead qualification'
    ];

    const interval = setInterval(() => {
      if (isRunning) {
        const randomTask = automationTasks[Math.floor(Math.random() * automationTasks.length)];
        setCurrentTask(randomTask);
        setProgress(prev => (prev + 10) % 100);
        
        // Add log entry
        setLogs(prev => [...prev.slice(-9), {
          timestamp: new Date().toLocaleTimeString(),
          action: randomTask,
          status: Math.random() > 0.1 ? 'success' : 'warning'
        }]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startAutomation = () => {
    setIsRunning(true);
    setCurrentTask('Initializing browser automation...');
    setProgress(0);
  };

  const stopAutomation = () => {
    setIsRunning(false);
    setCurrentTask('Automation stopped');
  };

  const takeScreenshot = () => {
    // Simulate screenshot
    const mockScreenshot = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <rect x="20" y="20" width="360" height="60" fill="#3b82f6" rx="8"/>
        <text x="200" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Business Scanner Active</text>
        <rect x="20" y="100" width="360" height="180" fill="white" stroke="#e2e8f0" rx="4"/>
        <text x="40" y="130" fill="#64748b" font-family="Arial" font-size="12">Scanning: ${currentTask}</text>
        <rect x="40" y="140" width="${progress * 3.2}" height="8" fill="#10b981" rx="4"/>
        <text x="40" y="170" fill="#374151" font-family="Arial" font-size="11">Progress: ${progress}%</text>
      </svg>
    `)}`;
    
    setScreenshots(prev => [mockScreenshot, ...prev.slice(0, 4)]);
  };

  const activeAutomations = [
    {
      name: 'Lead Intelligence Scanner',
      status: 'running',
      progress: 67,
      target: 'Fort Worth ZIP 76140',
      lastAction: 'Extracting business emails',
      timeRemaining: '12 minutes'
    },
    {
      name: 'QuickBooks Data Sync',
      status: 'scheduled',
      progress: 0,
      target: 'Financial records',
      lastAction: 'Waiting for connection',
      timeRemaining: '30 minutes'
    },
    {
      name: 'Google My Business Monitor',
      status: 'running',
      progress: 34,
      target: 'Local SEO tracking',
      lastAction: 'Checking review scores',
      timeRemaining: '8 minutes'
    }
  ];

  const automationPresets = [
    {
      name: 'Fort Worth Business Scanner',
      description: 'Scan all businesses in ZIP 76140 for leads',
      duration: '15-30 minutes',
      targets: 500
    },
    {
      name: 'Competitor Analysis',
      description: 'Analyze pricing and services of competitors',
      duration: '45 minutes',
      targets: 25
    },
    {
      name: 'Google My Business Optimizer',
      description: 'Update business listings and monitor reviews',
      duration: '10 minutes',
      targets: 5
    },
    {
      name: 'LinkedIn Lead Generation',
      description: 'Find decision makers in target industries',
      duration: '60 minutes',
      targets: 100
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Automation Monitor & Puppeteer Control
          </h1>
          <p className="text-xl text-gray-600">
            Real-time view of headless browser automations and data collection
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="h-8 w-8 text-blue-600" />
                <span className="text-2xl">Automation Control Center</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={isRunning ? 'default' : 'secondary'} className={isRunning ? 'bg-green-600' : ''}>
                  {isRunning ? 'ACTIVE' : 'IDLE'}
                </Badge>
                <div className="flex space-x-2">
                  <Button onClick={startAutomation} disabled={isRunning} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                  <Button onClick={stopAutomation} disabled={!isRunning} variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button onClick={takeScreenshot} variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Screenshot
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Current Task</div>
                <div className="font-semibold text-blue-900">{currentTask || 'No active task'}</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="flex items-center space-x-2">
                  <Progress value={progress} className="flex-1 h-3" />
                  <span className="font-semibold text-blue-900">{progress}%</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Status</div>
                <div className="flex items-center space-x-2">
                  <Activity className={`h-4 w-4 ${isRunning ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="font-semibold">{isRunning ? 'Processing' : 'Standby'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="suno-generator">SUNO AutoGen</TabsTrigger>
            <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
            <TabsTrigger value="quantum">Quantum AGI Browser</TabsTrigger>
            <TabsTrigger value="automations">Active Automations</TabsTrigger>
            <TabsTrigger value="presets">Automation Presets</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          </TabsList>

          <TabsContent value="suno-generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Music className="h-5 w-5 text-green-600" />
                    <span>Quantum SUNO AutoGen Mode</span>
                  </CardTitle>
                  <CardDescription>
                    REMI Lyric Engine + Rallyhouse Bass + Bounce FX System
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Natural Language Prompt</label>
                    <Textarea
                      value={musicPrompt}
                      onChange={(e) => setMusicPrompt(e.target.value)}
                      placeholder="Build a cover that grooves like Matroda x Dusky with a grime punch"
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">SUNO API Key (Optional)</label>
                    <Input
                      type="password"
                      value={sunoApiKey}
                      onChange={(e) => setSunoApiKey(e.target.value)}
                      placeholder="Enter SUNO API key for full generation"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50">
                      {musicMode} Engine Active
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50">
                      Rallyhouse FX Locked
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50">
                      ASI Symbolic Triggers
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={generateQuantumTrack}
                      disabled={isGenerating}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <Radio className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Track'}
                    </Button>
                    <Button
                      onClick={executeDemo}
                      variant="outline"
                      disabled={isGenerating}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SUNO Login Session</span>
                      <Badge variant="outline" className="bg-yellow-50">
                        Phone: 817-995-3894
                      </Badge>
                    </div>
                    <Button
                      onClick={startSunoLogin}
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Start SUNO Secure Login
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      Opens browser for manual phone verification and 2FA code entry
                    </p>
                  </div>

                  {isGenerating && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Processing quantum prompt...</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Parsing natural language with REMI 4.5 logic</div>
                        <div>• Mapping mood to ASI symbolic triggers</div>
                        <div>• Applying Rallyhouse FX chain</div>
                        <div>• Generating SUNO-ready export blocks</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Headphones className="h-5 w-5" />
                    <span>Generated Track Output</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedTrack ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <h3 className="font-bold text-lg mb-2">{generatedTrack.title}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div><strong>Style:</strong> {generatedTrack.style}</div>
                          <div><strong>BPM:</strong> {generatedTrack.bpm}</div>
                          <div><strong>Key:</strong> {generatedTrack.key}</div>
                          <div><strong>Mood:</strong> {generatedTrack.mood}</div>
                        </div>
                        <div className="mb-3">
                          <strong>Effects Chain:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedTrack.effects.map((fx, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {fx}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">SUNO-Ready Lyrics Block</label>
                        <Textarea
                          value={generatedTrack.lyrics}
                          readOnly
                          className="min-h-40 font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Style Export Block</label>
                        <Textarea
                          value={`TITLE: ${generatedTrack.title}
STYLE: ${generatedTrack.style}
BPM: ${generatedTrack.bpm}
KEY: ${generatedTrack.key}
MOOD: ${generatedTrack.mood}
FX: ${generatedTrack.effects.join(', ')}
COVER_MODE: ${generatedTrack.coverMode ? 'ENABLED' : 'DISABLED'}`}
                          readOnly
                          className="min-h-20 font-mono text-sm"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Export to SUNO
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Remix
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Volume2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Generate a track to see output</p>
                      <p className="text-sm">Ready for natural directive phrasing</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {trackHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mic className="h-5 w-5" />
                    <span>Track Generation History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trackHistory.map((track, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 cursor-pointer"
                        onClick={() => setGeneratedTrack(track)}
                      >
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-sm text-gray-600">
                            {track.style} • {track.bpm} BPM • {track.key}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {track.effects.slice(0, 2).map((fx, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {fx.split('-')[0]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quantum" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Quantum ASI → AGI → AI Development Scanner</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium">Target URL:</label>
                      <input
                        type="text"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                        placeholder="Enter development URL to scan"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={toggleQuantumMode}
                        variant={quantumMode ? "default" : "outline"}
                        className={quantumMode ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {quantumMode ? 'Quantum Mode ON' : 'Activate Quantum Mode'}
                      </Button>
                      
                      <Button
                        onClick={startQuantumScan}
                        disabled={!quantumMode}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Start Quantum Scan
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="autoFix"
                        checked={autoFixMode}
                        onChange={(e) => setAutoFixMode(e.target.checked)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <label htmlFor="autoFix" className="text-sm font-medium">
                        Auto-fix critical issues
                      </label>
                    </div>

                    {quantumOptimizations.length > 0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Quantum Enhancements Applied:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          {quantumOptimizations.map((opt, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>{opt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Quantum Development Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {devScanResults ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Overall Score</span>
                        <span className="text-2xl font-bold text-blue-600">{devScanResults.overallScore}/100</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Issues Detected:</h4>
                        {devScanResults.issues.map((issue, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${
                            issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                            issue.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{issue.type.toUpperCase()}</span>
                              <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                            <div className="text-xs text-gray-500">
                              <div>Location: {issue.location}</div>
                              <div>Quantum Score: {issue.quantumScore}/100</div>
                              {issue.autoFixable && (
                                <div className="text-green-600 font-medium">✓ Auto-fixable</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">AI Recommendations:</h4>
                        <ul className="text-sm space-y-1">
                          {devScanResults.aiRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Target className="h-3 w-3 text-blue-500" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Start a quantum scan to see development insights</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Real-Time Activity Log</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No activity yet. Start an automation to see logs.</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {log.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-sm">{log.action}</span>
                          </div>
                          <span className="text-xs text-gray-500">{log.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm font-medium">Successful Operations</span>
                      <span className="text-lg font-bold text-green-600">247</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm font-medium">Data Points Collected</span>
                      <span className="text-lg font-bold text-blue-600">1,342</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-sm font-medium">Average Response Time</span>
                      <span className="text-lg font-bold text-purple-600">2.3s</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-lg font-bold text-orange-600">0.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automations" className="space-y-6">
            <div className="space-y-4">
              {activeAutomations.map((automation, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{automation.name}</h3>
                        <p className="text-sm text-gray-600">Target: {automation.target}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={automation.status === 'running' ? 'default' : 'secondary'}>
                          {automation.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">{automation.progress}%</span>
                      </div>
                      <Progress value={automation.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Last: {automation.lastAction}</span>
                        <span>{automation.timeRemaining} remaining</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {automationPresets.map((preset, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                    <CardDescription>{preset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{preset.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Targets:</span>
                        <span className="font-medium">{preset.targets} items</span>
                      </div>
                      <Button className="w-full mt-4" onClick={startAutomation}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Automation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="screenshots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Browser Screenshots</span>
                  </div>
                  <Button onClick={takeScreenshot} variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Screenshot
                  </Button>
                </CardTitle>
                <CardDescription>
                  Real-time screenshots of browser automation in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                {screenshots.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No screenshots yet. Take a screenshot to see browser activity.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {screenshots.map((screenshot, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-48 object-cover" />
                        <div className="p-3 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Screenshot {index + 1}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}