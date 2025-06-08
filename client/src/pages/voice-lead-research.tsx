import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, MapPin, Building, TrendingUp, AlertCircle, Phone, Globe, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Speech Recognition type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
}

interface VoiceAnalysisResult {
  businessName: string;
  location: string;
  website?: string;
  industry: string;
  employeeCount?: number;
  estimatedRevenue?: string;
  digitalPresence: {
    hasWebsite: boolean;
    hasSocialMedia: boolean;
    hasOnlineBooking: boolean;
    hasEcommerce: boolean;
    seoScore: number;
  };
  automationOpportunities: {
    leadGeneration: number;
    customerService: number;
    appointmentScheduling: number;
    dataEntry: number;
    emailMarketing: number;
  };
  fitScore: number;
  reasoning: string[];
  recommendedServices: string[];
  potentialValue: string;
  nextSteps: string[];
}

export default function VoiceLeadResearch() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [voiceCommands, setVoiceCommands] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
            processVoiceCommand(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Voice Recognition Error",
            description: "Please try again or check microphone permissions",
            variant: "destructive"
          });
          setIsListening(false);
        };
      }
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
    }
  }, []);

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Check for research trigger phrases
    const triggerPhrases = [
      'research',
      'analyze',
      'look up',
      'check out',
      'investigate',
      'lead research',
      'market research'
    ];

    const hasTrigger = triggerPhrases.some(phrase => lowerCommand.includes(phrase));
    
    if (hasTrigger) {
      setVoiceCommands(prev => [...prev, command]);
      await performLeadResearch(command);
    }
  };

  const performLeadResearch = async (command: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Extract business name and location from command
      const businessMatch = command.match(/(?:research|analyze|look up|check out|investigate)\s+(.+?)(?:\s+in\s+(.+?))?$/i);
      const businessName = businessMatch?.[1]?.trim() || 'Unknown Business';
      const location = businessMatch?.[2]?.trim() || 'Unknown Location';

      // Simulate progressive analysis
      const steps = [
        'Gathering business information...',
        'Analyzing digital presence...',
        'Evaluating automation opportunities...',
        'Calculating fit score...',
        'Generating recommendations...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setAnalysisProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Perform actual research
      const response = await fetch('/api/voice-lead-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, location, command })
      });

      if (!response.ok) throw new Error('Research failed');

      const result = await response.json();
      setAnalysisResult(result);
      setAnalysisProgress(100);

      toast({
        title: "Research Complete",
        description: `Analysis finished for ${businessName}`,
      });

    } catch (error) {
      console.error('Lead research error:', error);
      toast({
        title: "Research Failed",
        description: "Unable to complete analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Say 'research [business name]' to start analysis",
      });
    }
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Voice-Activated Lead Research
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Perform instant market research while on-the-go. Say "research [business name]" to analyze potential clients
        </p>
      </div>

      {/* Voice Control Panel */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>Voice Command Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button
            onClick={toggleListening}
            size="lg"
            className={`w-full h-16 text-lg ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-6 w-6" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-6 w-6" />
                Start Voice Research
              </>
            )}
          </Button>

          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-50 rounded-lg"
            >
              <p className="text-sm text-blue-700 font-medium">
                🎤 Listening for commands...
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Try: "Research Texas Health Hudley Hospital" or "Analyze ABC Company in Dallas"
              </p>
            </motion.div>
          )}

          {transcript && (
            <div className="p-3 bg-gray-100 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-700">Last Command:</p>
              <p className="text-gray-600">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analyzing...</span>
                <span className="text-sm text-gray-500">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Business Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>{analysisResult.businessName}</span>
                  <Badge className={getFitScoreColor(analysisResult.fitScore)}>
                    {analysisResult.fitScore}% Fit Score
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{analysisResult.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{analysisResult.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{analysisResult.potentialValue}</span>
                  </div>
                </div>

                {analysisResult.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a href={analysisResult.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline text-sm">
                      {analysisResult.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Digital Presence Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Presence Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {analysisResult.digitalPresence.seoScore}%
                    </p>
                    <p className="text-sm text-gray-600">SEO Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {analysisResult.digitalPresence.hasWebsite ? '✅' : '❌'}
                    </p>
                    <p className="text-sm text-gray-600">Website</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {analysisResult.digitalPresence.hasSocialMedia ? '✅' : '❌'}
                    </p>
                    <p className="text-sm text-gray-600">Social Media</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {analysisResult.digitalPresence.hasOnlineBooking ? '✅' : '❌'}
                    </p>
                    <p className="text-sm text-gray-600">Online Booking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automation Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Automation Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysisResult.automationOpportunities).map(([area, score]) => (
                  <div key={area} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">
                        {area.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-500">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Recommended Services</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.recommendedServices.map((service, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Next Steps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 font-bold mt-1">{index + 1}.</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Reasoning */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-sm">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Commands */}
      {voiceCommands.length > 0 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Recent Voice Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {voiceCommands.slice(-5).map((command, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  {command}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}