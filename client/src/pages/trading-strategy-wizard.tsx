import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, TrendingUp, DollarSign, Target, Clock, Zap } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: string;
  expectedReturn: string;
  timeframe: string;
  allocation: number;
  features: string[];
}

interface RiskQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    risk: number;
  }>;
}

export default function TradingStrategyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [riskAnswers, setRiskAnswers] = useState<Record<string, string>>({});
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [customAllocations, setCustomAllocations] = useState({
    conservative: 50,
    aggressive: 25,
    microHyper: 25
  });
  const [timeframe, setTimeframe] = useState('moderate');
  const queryClient = useQueryClient();

  // Fetch available strategies
  const { data: strategiesData, isLoading: strategiesLoading } = useQuery({
    queryKey: ['/api/trading/wizard/strategies'],
  });

  // Fetch risk assessment questions
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ['/api/trading/wizard/risk-assessment'],
  });

  // Configure strategy mutation
  const configureStrategy = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/trading/wizard/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error('Configuration failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
      setCurrentStep(4);
    }
  });

  const strategies = strategiesData?.strategies || [];
  const riskQuestions = riskData?.questions || [];
  const currentRiskProfile = riskData?.currentRiskProfile;

  const calculateRiskScore = () => {
    const scores = Object.values(riskAnswers).map(answer => {
      const question = riskQuestions.find(q => 
        q.options.some(opt => opt.value === answer)
      );
      const option = question?.options.find(opt => opt.value === answer);
      return option?.risk || 0;
    });
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const handleStrategyToggle = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const handleConfigureStrategy = () => {
    const riskScore = calculateRiskScore();
    const riskTolerance = riskScore <= 1.5 ? 'low' : riskScore <= 2.5 ? 'moderate' : riskScore <= 3.5 ? 'high' : 'ultra';
    
    configureStrategy.mutate({
      riskTolerance,
      timeframe,
      preferredStrategies: selectedStrategies,
      customAllocations
    });
  };

  if (strategiesLoading || riskLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading Trading Strategy Wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            QQ ASI Trading Strategy Wizard
          </h1>
          <p className="text-xl text-slate-300 mt-2">
            Configure your personalized trading strategy for maximum ROI
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-slate-400">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        <Tabs value={currentStep.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 mb-8">
            <TabsTrigger value="1" className="data-[state=active]:bg-blue-600">Risk Assessment</TabsTrigger>
            <TabsTrigger value="2" className="data-[state=active]:bg-blue-600">Strategy Selection</TabsTrigger>
            <TabsTrigger value="3" className="data-[state=active]:bg-blue-600">Configuration</TabsTrigger>
            <TabsTrigger value="4" className="data-[state=active]:bg-blue-600">Results</TabsTrigger>
          </TabsList>

          {/* Step 1: Risk Assessment */}
          <TabsContent value="1" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>
                  Help us understand your trading preferences to recommend the best strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {riskQuestions.map((question: RiskQuestion) => (
                  <div key={question.id} className="space-y-3">
                    <Label className="text-lg font-medium">{question.question}</Label>
                    <RadioGroup
                      value={riskAnswers[question.id] || ''}
                      onValueChange={(value) => 
                        setRiskAnswers(prev => ({ ...prev, [question.id]: value }))
                      }
                    >
                      {question.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            {option.label}
                          </Label>
                          <Badge variant={option.risk <= 2 ? 'default' : option.risk <= 3 ? 'secondary' : 'destructive'}>
                            Risk: {option.risk}/4
                          </Badge>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                {currentRiskProfile && (
                  <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                    <h3 className="font-semibold mb-2">Current Trading Profile</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Risk Level:</span>
                        <p className="font-medium">{currentRiskProfile.level}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Score:</span>
                        <p className="font-medium">{currentRiskProfile.score}/4</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Recommendation:</span>
                        <p className="font-medium capitalize">{currentRiskProfile.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={Object.keys(riskAnswers).length < riskQuestions.length}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Strategy Selection
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Strategy Selection */}
          <TabsContent value="2" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Strategy Selection
                </CardTitle>
                <CardDescription>
                  Choose the trading strategies that match your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {strategies.map((strategy: Strategy) => (
                    <Card 
                      key={strategy.id}
                      className={`cursor-pointer transition-all ${
                        selectedStrategies.includes(strategy.id)
                          ? 'ring-2 ring-blue-500 bg-slate-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      onClick={() => handleStrategyToggle(strategy.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{strategy.name}</h3>
                            <p className="text-slate-400 text-sm">{strategy.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                strategy.riskLevel === 'LOW' ? 'default' :
                                strategy.riskLevel === 'HIGH' ? 'secondary' : 'destructive'
                              }
                            >
                              {strategy.riskLevel} RISK
                            </Badge>
                            <p className="text-sm text-slate-400 mt-1">{strategy.expectedReturn}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Timeframe:</span>
                            <p className="font-medium">{strategy.timeframe}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Allocation:</span>
                            <p className="font-medium">{strategy.allocation}%</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-slate-400 mb-1">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {strategy.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={selectedStrategies.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Configure Strategies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Configuration */}
          <TabsContent value="3" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Strategy Configuration
                </CardTitle>
                <CardDescription>
                  Fine-tune your strategy allocations and trading preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Allocation Sliders */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Portfolio Allocation</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Conservative Strategy</Label>
                        <span className="text-sm font-medium">{customAllocations.conservative}%</span>
                      </div>
                      <Slider
                        value={[customAllocations.conservative]}
                        onValueChange={([value]) => 
                          setCustomAllocations(prev => ({ ...prev, conservative: value }))
                        }
                        max={80}
                        min={20}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Aggressive Strategy</Label>
                        <span className="text-sm font-medium">{customAllocations.aggressive}%</span>
                      </div>
                      <Slider
                        value={[customAllocations.aggressive]}
                        onValueChange={([value]) => 
                          setCustomAllocations(prev => ({ ...prev, aggressive: value }))
                        }
                        max={50}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Micro Hyper Strategy</Label>
                        <span className="text-sm font-medium">{customAllocations.microHyper}%</span>
                      </div>
                      <Slider
                        value={[customAllocations.microHyper]}
                        onValueChange={([value]) => 
                          setCustomAllocations(prev => ({ ...prev, microHyper: value }))
                        }
                        max={40}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-slate-400">
                    Total: {customAllocations.conservative + customAllocations.aggressive + customAllocations.microHyper}%
                  </div>
                </div>

                {/* Trading Timeframe */}
                <div className="space-y-3">
                  <Label className="text-lg font-medium">Trading Timeframe</Label>
                  <RadioGroup value={timeframe} onValueChange={setTimeframe}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conservative" id="conservative" />
                      <Label htmlFor="conservative" className="flex-1">
                        Conservative (15-30 second intervals)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="flex-1">
                        Moderate (5-15 second intervals)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aggressive" id="aggressive" />
                      <Label htmlFor="aggressive" className="flex-1">
                        Aggressive (0.8-5 second intervals)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleConfigureStrategy}
                    disabled={configureStrategy.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {configureStrategy.isPending ? 'Configuring...' : 'Apply Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Results */}
          <TabsContent value="4" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  Configuration Complete
                </CardTitle>
                <CardDescription>
                  Your trading strategy has been successfully configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Strategy Activated!</h3>
                  <p className="text-slate-400">
                    Your personalized trading strategy is now active and optimized for your risk profile.
                  </p>
                </div>

                {configureStrategy.data && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="bg-slate-700">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Estimated Daily Returns</p>
                        <p className="text-lg font-semibold">{configureStrategy.data.estimatedReturns.daily}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Weekly Projection</p>
                        <p className="text-lg font-semibold">{configureStrategy.data.estimatedReturns.weekly}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700">
                      <CardContent className="p-4 text-center">
                        <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Monthly Target</p>
                        <p className="text-lg font-semibold">{configureStrategy.data.estimatedReturns.monthly}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Button 
                  onClick={() => window.location.href = '/live-trading-control'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  View Live Trading Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}