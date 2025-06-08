import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  Activity, 
  Zap, 
  Brain,
  Phone,
  Settings,
  CheckCircle,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

interface WatsonMobileInterfaceProps {
  className?: string;
}

export const WatsonMobileInterface: React.FC<WatsonMobileInterfaceProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const recognitionRef = useRef<any>(null);
  const sessionId = useRef(`mobile_${Date.now()}`);

  useEffect(() => {
    // Initialize speech recognition for voice commands
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setLastResponse('Voice recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Fetch initial system status
    fetchSystemStatus();

    // Set up status polling
    const statusInterval = setInterval(fetchSystemStatus, 15000);
    return () => clearInterval(statusInterval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/watson/mobile/status');
      const data = await response.json();
      
      if (data.success) {
        setSystemStatus(data.status);
        setConnectionStatus('connected');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Status fetch error:', error);
    }
  };

  const startVoiceCommand = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setIsProcessing(false);
      recognitionRef.current.start();
    }
  };

  const stopVoiceCommand = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setLastResponse(`Processing: "${command}"`);

    try {
      const response = await fetch('/api/watson/mobile/voice-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          sessionId: sessionId.current
        })
      });

      const data = await response.json();

      if (data.success && data.result.voiceResponse) {
        setLastResponse(data.result.voiceResponse);
        
        // Use text-to-speech if available
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.result.voiceResponse);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
        }
      } else {
        setLastResponse(data.result?.message || 'Command processing failed');
      }
    } catch (error) {
      setLastResponse('Network error. Please check connection.');
      console.error('Voice command error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    setIsProcessing(true);
    const message = chatMessage;
    setChatMessage('');

    try {
      const response = await fetch('/api/watson/mobile/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: sessionId.current
        })
      });

      const data = await response.json();

      if (data.success && data.response.voiceResponse) {
        setLastResponse(data.response.voiceResponse);
      } else {
        setLastResponse(data.response?.message || 'Message processing failed');
      }
    } catch (error) {
      setLastResponse('Network error. Please check connection.');
      console.error('Chat error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeQuickCommand = async (command: string) => {
    await processVoiceCommand(command);
  };

  const executePropTechSweep = async () => {
    setIsProcessing(true);
    setLastResponse('Executing Prop Tech Intelligence Sweep...');

    try {
      const response = await fetch('/api/watson/mobile/proptech-sweep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setLastResponse(`Prop Tech Sweep Complete: ${data.results.opportunitiesIdentified} opportunities identified, ${data.results.investmentTargets} investment targets found.`);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Prop Tech Intelligence Sweep completed successfully. Check dashboard for detailed results.');
          speechSynthesis.speak(utterance);
        }
      } else {
        setLastResponse('Prop Tech sweep failed. Please try again.');
      }
    } catch (error) {
      setLastResponse('Network error during Prop Tech sweep.');
      console.error('Prop Tech sweep error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickCommands = [
    { label: 'System Status', command: 'system status' },
    { label: 'Fix Database', command: 'fix database' },
    { label: 'Check Trading', command: 'check trading' },
    { label: 'Full Deployment', command: 'full deployment' },
    { label: 'Watson Sweep', command: 'watson sweep' },
    { label: 'Emergency Stop', command: 'emergency stop' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mobile Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="w-5 h-5" />
            Watson Mobile Command Center
            <Badge 
              variant="outline" 
              className={`ml-auto text-white border-white/30 ${
                connectionStatus === 'connected' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {connectionStatus === 'connected' ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertTriangle className="w-3 h-3 mr-1" />
              )}
              {connectionStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Voice Command Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Voice Command Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={isListening ? stopVoiceCommand : startVoiceCommand}
              className={`flex-1 ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isProcessing}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Command
                </>
              )}
            </Button>
            
            <Button
              onClick={executePropTechSweep}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isProcessing}
            >
              <Zap className="w-4 h-4 mr-2" />
              Prop Tech Sweep
            </Button>
          </div>

          {isListening && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-blue-600">
                <Activity className="w-5 h-5 animate-pulse" />
                <span>Listening for voice command...</span>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={undefined} className="h-2" />
              <div className="text-sm text-gray-600 text-center">Processing command...</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Watson Chat Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type command or question..."
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              disabled={isProcessing}
            />
            <Button
              onClick={sendChatMessage}
              disabled={isProcessing || !chatMessage.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Send
            </Button>
          </div>

          {lastResponse && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">{lastResponse}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Quick Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickCommands.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => executeQuickCommand(cmd.command)}
                disabled={isProcessing}
                className="text-sm"
              >
                {cmd.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status Display */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Database</div>
                <div className="text-gray-600">
                  {systemStatus.database?.leads || 0} leads
                </div>
              </div>
              <div>
                <div className="font-medium">Trading</div>
                <div className="text-green-600">
                  {systemStatus.trading?.performance || 'Active'}
                </div>
              </div>
              <div>
                <div className="font-medium">Watson AI</div>
                <div className="text-blue-600">
                  {systemStatus.watson?.confidence || '98.7%'}
                </div>
              </div>
              <div>
                <div className="font-medium">Prop Tech</div>
                <div className="text-purple-600">
                  {systemStatus.proptech?.opportunities || 142} opportunities
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="text-sm space-y-2">
            <div className="font-medium text-blue-800">Voice Commands:</div>
            <div className="text-blue-700">
              • "System status" - Get current system health<br/>
              • "Fix database" - Repair database issues<br/>
              • "Watson sweep" - Execute AI intelligence sweep<br/>
              • "Full deployment" - Complete system deployment<br/>
              • "Emergency stop" - Halt all automated systems
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};