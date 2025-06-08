import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Settings,
  Languages,
  Accessibility,
  Headphones,
  Brain
} from 'lucide-react';

interface VoiceSettings {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
  autoDescribe: boolean;
  dataReadout: boolean;
  contextualHelp: boolean;
}

interface QuantumDataPoint {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  confidence?: number;
  description?: string;
}

export const QuantumVoiceNarration = ({
  data,
  isVisualizationActive = false,
  onSettingsChange
}: {
  data?: QuantumDataPoint[];
  isVisualizationActive?: boolean;
  onSettingsChange?: (settings: VoiceSettings) => void;
}) => {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: false,
    voice: 'default',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    language: 'en-US',
    autoDescribe: true,
    dataReadout: true,
    contextualHelp: true
  });

  const [isNarrating, setIsNarrating] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      
      updateVoices();
      speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        handleVoiceCommand(transcript);
      };
    }
  }, []);

  // Auto-narrate when visualization data changes
  useEffect(() => {
    if (settings.enabled && settings.autoDescribe && data && isVisualizationActive) {
      narrateDataUpdate(data);
    }
  }, [data, settings.enabled, settings.autoDescribe, isVisualizationActive]);

  const speak = (text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!settings.enabled || !('speechSynthesis' in window)) return;

    // Stop current speech if high priority
    if (priority === 'high' && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    const selectedVoice = availableVoices.find(voice => 
      voice.name === settings.voice || voice.lang === settings.language
    );
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.lang = settings.language;

    utterance.onstart = () => {
      setIsNarrating(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsNarrating(false);
      setCurrentText('');
    };

    utterance.onerror = () => {
      setIsNarrating(false);
      setCurrentText('');
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const narrateDataUpdate = (dataPoints: QuantumDataPoint[]) => {
    if (!settings.dataReadout) return;

    const descriptions = dataPoints.map(point => {
      let description = `${point.label}: ${point.value}`;
      if (point.unit) description += ` ${point.unit}`;
      if (point.trend) {
        const trendWord = point.trend > 0 ? 'increasing' : 'decreasing';
        description += `, ${trendWord} by ${Math.abs(point.trend).toFixed(1)} percent`;
      }
      if (point.confidence) {
        description += `, confidence level ${(point.confidence * 100).toFixed(0)} percent`;
      }
      return description;
    });

    const narrative = `Quantum data update. ${descriptions.join('. ')}.`;
    speak(narrative, 'medium');
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('stop') || lowerCommand.includes('quiet')) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    } else if (lowerCommand.includes('repeat') || lowerCommand.includes('again')) {
      if (currentText) {
        speak(currentText, 'high');
      }
    } else if (lowerCommand.includes('explain') || lowerCommand.includes('describe')) {
      const explanation = generateContextualExplanation();
      speak(explanation, 'high');
    } else if (lowerCommand.includes('help')) {
      const helpText = "Available commands: stop, repeat, explain, help, slower, faster, volume up, volume down";
      speak(helpText, 'high');
    } else if (lowerCommand.includes('slower')) {
      updateSettings({ rate: Math.max(0.5, settings.rate - 0.2) });
      speak("Speech rate decreased", 'high');
    } else if (lowerCommand.includes('faster')) {
      updateSettings({ rate: Math.min(2.0, settings.rate + 0.2) });
      speak("Speech rate increased", 'high');
    }
  };

  const generateContextualExplanation = (): string => {
    if (!data || data.length === 0) {
      return "No quantum visualization data is currently available.";
    }

    const totalMetrics = data.length;
    const highConfidenceItems = data.filter(d => d.confidence && d.confidence > 0.9).length;
    const trendingUp = data.filter(d => d.trend && d.trend > 0).length;
    
    return `Currently displaying ${totalMetrics} quantum metrics. ${highConfidenceItems} items show high confidence levels above 90 percent. ${trendingUp} metrics are trending upward. This visualization represents real-time quantum state analysis for enterprise automation systems.`;
  };

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onSettingsChange?.(updated);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      speak("Voice commands active. Say help for available commands.", 'high');
    }
  };

  const testVoice = () => {
    const testText = "Quantum voice narration system active. All visualization elements will be described with real-time data updates and contextual explanations.";
    speak(testText, 'high');
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardContent className="p-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Voice Narration</h3>
            {settings.enabled && (
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                Active
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant={settings.enabled ? "default" : "outline"}
              onClick={() => updateSettings({ enabled: !settings.enabled })}
              className="flex-1 mr-2"
            >
              {settings.enabled ? (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Narration On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Narration Off
                </>
              )}
            </Button>

            <Button
              variant={isListening ? "default" : "outline"}
              onClick={toggleListening}
              disabled={!recognitionRef.current}
              className="mr-2"
            >
              {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={testVoice}
              disabled={!settings.enabled}
            >
              Test
            </Button>
          </div>

          {/* Current Status */}
          <AnimatePresence>
            {isNarrating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Headphones className="h-4 w-4 text-blue-600" />
                  </motion.div>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Currently Speaking
                  </span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-3">
                  {currentText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Speech Rate
              </label>
              <Slider
                value={[settings.rate]}
                onValueChange={(value) => updateSettings({ rate: value[0] })}
                min={0.5}
                max={2.0}
                step={0.1}
                disabled={!settings.enabled}
                className="w-full"
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {settings.rate.toFixed(1)}x
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Volume
              </label>
              <Slider
                value={[settings.volume]}
                onValueChange={(value) => updateSettings({ volume: value[0] })}
                min={0}
                max={1}
                step={0.1}
                disabled={!settings.enabled}
                className="w-full"
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {Math.round(settings.volume * 100)}%
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Voice
                    </label>
                    <Select
                      value={settings.voice}
                      onValueChange={(value) => updateSettings({ voice: value })}
                      disabled={!settings.enabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Language
                    </label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => updateSettings({ language: value })}
                      disabled={!settings.enabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                        <SelectItem value="ja-JP">Japanese</SelectItem>
                        <SelectItem value="zh-CN">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Auto-describe visualizations
                    </label>
                    <Button
                      variant={settings.autoDescribe ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ autoDescribe: !settings.autoDescribe })}
                      disabled={!settings.enabled}
                    >
                      {settings.autoDescribe ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Data readout
                    </label>
                    <Button
                      variant={settings.dataReadout ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ dataReadout: !settings.dataReadout })}
                      disabled={!settings.enabled}
                    >
                      {settings.dataReadout ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Contextual help
                    </label>
                    <Button
                      variant={settings.contextualHelp ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ contextualHelp: !settings.contextualHelp })}
                      disabled={!settings.enabled}
                    >
                      {settings.contextualHelp ? "On" : "Off"}
                    </Button>
                  </div>
                </div>

                {/* Voice Commands Help */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Voice Commands
                  </h4>
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div>"Stop" - Stop current narration</div>
                    <div>"Repeat" - Repeat last message</div>
                    <div>"Explain" - Get detailed description</div>
                    <div>"Help" - List all commands</div>
                    <div>"Slower/Faster" - Adjust speech rate</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};