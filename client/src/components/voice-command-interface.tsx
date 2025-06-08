import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface VoiceCommand {
  id: string;
  command: string;
  timestamp: Date;
  status: 'processing' | 'safe' | 'warning' | 'blocked' | 'executed';
  interpretation: string;
  riskLevel: 'low' | 'medium' | 'high' | 'destructive';
  response: string;
}

interface VoiceCommandInterfaceProps {
  className?: string;
}

export function VoiceCommandInterface({ className = "" }: VoiceCommandInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCurrentTranscript(transcript);
          
          if (event.results[event.results.length - 1].isFinal) {
            processVoiceCommand(transcript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setCurrentTranscript('');
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const analyzeCommandSafety = (command: string) => {
    const destructiveKeywords = [
      'delete', 'remove', 'destroy', 'wipe', 'clear all', 'reset everything',
      'drop table', 'truncate', 'format', 'erase', 'purge all'
    ];
    
    const warningKeywords = [
      'modify', 'change all', 'update all', 'alter', 'replace all',
      'shutdown', 'restart', 'disable', 'stop all'
    ];

    const safeKeywords = [
      'show', 'display', 'view', 'get', 'fetch', 'list', 'find',
      'create', 'add', 'generate', 'build', 'optimize', 'improve'
    ];

    const lowerCommand = command.toLowerCase();
    
    if (destructiveKeywords.some(keyword => lowerCommand.includes(keyword))) {
      return { riskLevel: 'destructive' as const, reason: 'Contains destructive operations' };
    }
    
    if (warningKeywords.some(keyword => lowerCommand.includes(keyword))) {
      return { riskLevel: 'high' as const, reason: 'Contains potentially risky operations' };
    }
    
    if (safeKeywords.some(keyword => lowerCommand.includes(keyword))) {
      return { riskLevel: 'low' as const, reason: 'Safe operation detected' };
    }
    
    return { riskLevel: 'medium' as const, reason: 'Unknown operation - requires review' };
  };

  const interpretCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Dashboard navigation
    if (lowerCommand.includes('show dashboard') || lowerCommand.includes('open dashboard')) {
      return { action: 'navigate', target: '/dashboard', description: 'Navigate to main dashboard' };
    }
    
    // Watson console access
    if (lowerCommand.includes('watson') || lowerCommand.includes('console')) {
      return { action: 'navigate', target: '/watson-console', description: 'Open Watson command console' };
    }
    
    // Lead generation
    if (lowerCommand.includes('generate leads') || lowerCommand.includes('find leads')) {
      return { action: 'trigger', target: 'lead-generation', description: 'Initiate lead generation process' };
    }
    
    // System status
    if (lowerCommand.includes('system status') || lowerCommand.includes('health check')) {
      return { action: 'query', target: 'system-status', description: 'Check system health and metrics' };
    }
    
    // Automation tasks
    if (lowerCommand.includes('automation') || lowerCommand.includes('tasks')) {
      return { action: 'query', target: 'automation-tasks', description: 'Show automation task status' };
    }
    
    // User management
    if (lowerCommand.includes('show users') || lowerCommand.includes('list users')) {
      return { action: 'query', target: 'users', description: 'Display user management interface' };
    }
    
    return { action: 'unknown', target: 'none', description: `Unable to interpret: "${command}"` };
  };

  const processVoiceCommand = async (command: string) => {
    const commandId = `cmd_${Date.now()}`;
    const safety = analyzeCommandSafety(command);
    const interpretation = interpretCommand(command);
    
    const newCommand: VoiceCommand = {
      id: commandId,
      command,
      timestamp: new Date(),
      status: 'processing',
      interpretation: interpretation.description,
      riskLevel: safety.riskLevel,
      response: ''
    };

    setCommands(prev => [newCommand, ...prev.slice(0, 4)]);

    // Block destructive commands
    if (safety.riskLevel === 'destructive') {
      const blockedCommand = {
        ...newCommand,
        status: 'blocked' as const,
        response: `Command blocked: ${safety.reason}. Only evolutionary improvements are permitted.`
      };
      setCommands(prev => [blockedCommand, ...prev.slice(1)]);
      speak(blockedCommand.response);
      return;
    }

    // Warn about risky commands but allow execution
    if (safety.riskLevel === 'high') {
      const warningCommand = {
        ...newCommand,
        status: 'warning' as const,
        response: `Warning: ${safety.reason}. Proceeding with caution.`
      };
      setCommands(prev => [warningCommand, ...prev.slice(1)]);
      speak(warningCommand.response);
    }

    // Execute safe commands
    try {
      const executedCommand = await executeCommand(interpretation, newCommand);
      setCommands(prev => [executedCommand, ...prev.slice(1)]);
      speak(executedCommand.response);
    } catch (error) {
      const errorCommand = {
        ...newCommand,
        status: 'blocked' as const,
        response: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
      setCommands(prev => [errorCommand, ...prev.slice(1)]);
      speak(errorCommand.response);
    }
  };

  const executeCommand = async (interpretation: any, command: VoiceCommand): Promise<VoiceCommand> => {
    switch (interpretation.action) {
      case 'navigate':
        window.location.href = interpretation.target;
        return {
          ...command,
          status: 'executed',
          response: `Navigating to ${interpretation.target}`
        };
        
      case 'query':
        const response = await fetch(`/api/${interpretation.target}`);
        const data = await response.json();
        return {
          ...command,
          status: 'executed',
          response: `Retrieved ${interpretation.target} data successfully`
        };
        
      case 'trigger':
        return {
          ...command,
          status: 'executed',
          response: `Initiated ${interpretation.target} process`
        };
        
      default:
        return {
          ...command,
          status: 'safe',
          response: interpretation.description
        };
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getStatusIcon = (status: VoiceCommand['status']) => {
    switch (status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-purple-400 animate-pulse" />;
    }
  };

  const getRiskBadgeColor = (riskLevel: VoiceCommand['riskLevel']) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'destructive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  if (!isSupported) {
    return (
      <Card className={`bg-slate-900/50 border-slate-700 ${className}`}>
        <CardContent className="p-4 text-center">
          <p className="text-slate-400">Voice commands not supported in this browser</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-900/50 border-slate-700 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-purple-400" />
          Voice Command Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Input Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            className={isListening ? "bg-red-600 hover:bg-red-700" : "border-purple-500 text-purple-400 hover:bg-purple-900/50"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Stop" : "Listen"}
          </Button>
          
          {currentTranscript && (
            <div className="flex-1 bg-slate-800 rounded p-2 text-sm text-slate-300">
              {currentTranscript}
            </div>
          )}
        </div>

        {/* Command History */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {commands.map((cmd) => (
            <div key={cmd.id} className="bg-slate-800/50 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(cmd.status)}
                  <span className="text-sm text-slate-300 font-medium">
                    "{cmd.command}"
                  </span>
                </div>
                <Badge className={`text-xs ${getRiskBadgeColor(cmd.riskLevel)}`}>
                  {cmd.riskLevel}
                </Badge>
              </div>
              
              <div className="text-xs text-slate-400">
                {cmd.interpretation}
              </div>
              
              {cmd.response && (
                <div className="text-xs text-slate-300 bg-slate-700/50 rounded p-2">
                  {cmd.response}
                </div>
              )}
              
              <div className="text-xs text-slate-500">
                {cmd.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {/* Command Examples */}
        <div className="bg-slate-800/30 rounded-lg p-3">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Safe Commands:</h4>
          <div className="text-xs text-slate-400 space-y-1">
            <div>"Show dashboard" - Navigate to main dashboard</div>
            <div>"Open Watson console" - Access command interface</div>
            <div>"Generate leads" - Start lead generation</div>
            <div>"System status" - Check health metrics</div>
            <div>"Show automation tasks" - View task status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}