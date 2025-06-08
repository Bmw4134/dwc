import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Shield, Zap, BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingStrategy {
  id: string;
  name: string;
  type: 'conservative' | 'moderate' | 'aggressive';
  riskLevel: number;
  expectedReturn: number;
  timeframe: string;
  description: string;
  requirements: string[];
  indicators: string[];
  stopLoss: number;
  takeProfit: number;
  allocation: number;
}

interface PortfolioMetrics {
  totalValue: number;
  dailyPnL: number;
  weeklyPnL: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

const PRESET_STRATEGIES: TradingStrategy[] = [
  {
    id: 'scalping',
    name: 'High-Frequency Scalping',
    type: 'aggressive',
    riskLevel: 85,
    expectedReturn: 25,
    timeframe: '1-5 minutes',
    description: 'Quick profits from small price movements with high volume',
    requirements: ['Fast execution', 'Low latency', 'High capital'],
    indicators: ['RSI', 'MACD', 'Volume Profile'],
    stopLoss: 2,
    takeProfit: 4,
    allocation: 15
  },
  {
    id: 'swing',
    name: 'Swing Trading Pro',
    type: 'moderate',
    riskLevel: 60,
    expectedReturn: 18,
    timeframe: '2-7 days',
    description: 'Capture medium-term price swings with technical analysis',
    requirements: ['Technical analysis', 'Market timing', 'Patience'],
    indicators: ['Moving Averages', 'Bollinger Bands', 'Fibonacci'],
    stopLoss: 5,
    takeProfit: 12,
    allocation: 40
  },
  {
    id: 'momentum',
    name: 'Momentum Breakout',
    type: 'aggressive',
    riskLevel: 75,
    expectedReturn: 22,
    timeframe: '1-3 days',
    description: 'Follow strong price momentum and breakout patterns',
    requirements: ['Pattern recognition', 'Quick decisions', 'Risk management'],
    indicators: ['Volume', 'ATR', 'Support/Resistance'],
    stopLoss: 4,
    takeProfit: 10,
    allocation: 25
  },
  {
    id: 'value',
    name: 'Value Accumulation',
    type: 'conservative',
    riskLevel: 35,
    expectedReturn: 12,
    timeframe: '1-6 months',
    description: 'Long-term value plays with fundamental analysis',
    requirements: ['Fundamental analysis', 'Long-term view', 'Patience'],
    indicators: ['P/E Ratio', 'Market Cap', 'Revenue Growth'],
    stopLoss: 8,
    takeProfit: 20,
    allocation: 20
  }
];

const MOCK_PORTFOLIO: PortfolioMetrics = {
  totalValue: 125750,
  dailyPnL: 2340,
  weeklyPnL: 8920,
  winRate: 68.5,
  sharpeRatio: 1.42,
  maxDrawdown: -4.2
};

export function TradingStrategyWizard({ className }: { className?: string }) {
  const [activeStrategy, setActiveStrategy] = useState<TradingStrategy | null>(null);
  const [customParams, setCustomParams] = useState({
    riskTolerance: 50,
    capitalAllocation: 10000,
    timeHorizon: 'medium'
  });
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  const getRiskColor = (risk: number) => {
    if (risk < 40) return 'text-green-600 bg-green-50';
    if (risk < 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conservative': return 'bg-blue-100 text-blue-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'aggressive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStrategy = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const calculatePortfolioAllocation = () => {
    const selected = PRESET_STRATEGIES.filter(s => selectedStrategies.includes(s.id));
    const totalAllocation = selected.reduce((sum, s) => sum + s.allocation, 0);
    return selected.map(s => ({
      ...s,
      normalizedAllocation: (s.allocation / totalAllocation) * 100
    }));
  };

  return (
    <Card className={cn("shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50", className)}>
      <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6" />
          Interactive Trading Strategy Wizard
          <Badge variant="secondary" className="bg-white text-blue-600">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={`step-${wizardStep}`} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="step-1" onClick={() => setWizardStep(1)}>
              <Target className="h-4 w-4 mr-1" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="step-2" onClick={() => setWizardStep(2)}>
              <BarChart3 className="h-4 w-4 mr-1" />
              Strategies
            </TabsTrigger>
            <TabsTrigger value="step-3" onClick={() => setWizardStep(3)}>
              <Shield className="h-4 w-4 mr-1" />
              Risk Management
            </TabsTrigger>
            <TabsTrigger value="step-4" onClick={() => setWizardStep(4)}>
              <Zap className="h-4 w-4 mr-1" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step-1" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <input
                      type="range"
                      id="risk-tolerance"
                      min="1"
                      max="100"
                      value={customParams.riskTolerance}
                      onChange={(e) => setCustomParams(prev => ({ ...prev, riskTolerance: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="font-semibold text-lg">{customParams.riskTolerance}%</span>
                  </div>
                  <div className={cn("text-sm mt-1 px-2 py-1 rounded", getRiskColor(customParams.riskTolerance))}>
                    {customParams.riskTolerance < 40 ? 'Conservative' : 
                     customParams.riskTolerance < 70 ? 'Moderate' : 'Aggressive'}
                  </div>
                </div>

                <div>
                  <Label htmlFor="capital">Capital Allocation ($)</Label>
                  <Input
                    id="capital"
                    type="number"
                    value={customParams.capitalAllocation}
                    onChange={(e) => setCustomParams(prev => ({ ...prev, capitalAllocation: parseInt(e.target.value) }))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="time-horizon">Time Horizon</Label>
                  <Select value={customParams.timeHorizon} onValueChange={(value) => setCustomParams(prev => ({ ...prev, timeHorizon: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (1-30 days)</SelectItem>
                      <SelectItem value="medium">Medium-term (1-6 months)</SelectItem>
                      <SelectItem value="long">Long-term (6+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">AI Recommendation</h4>
                  <p className="text-sm text-blue-700">
                    Based on your {customParams.riskTolerance}% risk tolerance and ${customParams.capitalAllocation.toLocaleString()} capital, 
                    I recommend a {customParams.riskTolerance < 40 ? 'conservative diversified' : 
                                   customParams.riskTolerance < 70 ? 'balanced growth' : 'aggressive momentum'} approach.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => setWizardStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
              Continue to Strategy Selection
            </Button>
          </TabsContent>

          <TabsContent value="step-2" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_STRATEGIES.map((strategy) => (
                <Card 
                  key={strategy.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-2",
                    selectedStrategies.includes(strategy.id) 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-300"
                  )}
                  onClick={() => toggleStrategy(strategy.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <Badge className={getTypeColor(strategy.type)}>
                        {strategy.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Expected Return:</span>
                        <div className="text-green-600 font-semibold">{strategy.expectedReturn}%</div>
                      </div>
                      <div>
                        <span className="font-medium">Timeframe:</span>
                        <div className="text-blue-600">{strategy.timeframe}</div>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Risk Level:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={strategy.riskLevel} className="flex-1 h-2" />
                        <span className={cn("text-xs px-2 py-1 rounded", getRiskColor(strategy.riskLevel))}>
                          {strategy.riskLevel}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Key Indicators:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {strategy.indicators.map((indicator) => (
                          <Badge key={indicator} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setWizardStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setWizardStep(3)} 
                disabled={selectedStrategies.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Configure Risk Management ({selectedStrategies.length} selected)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="step-3" className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800">Risk Management Settings</h4>
              </div>
              <p className="text-sm text-yellow-700">
                Configure stop-loss and take-profit levels for your selected strategies.
              </p>
            </div>

            <div className="space-y-4">
              {selectedStrategies.map((strategyId) => {
                const strategy = PRESET_STRATEGIES.find(s => s.id === strategyId);
                if (!strategy) return null;

                return (
                  <Card key={strategyId} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {strategy.name}
                        <Badge className={getTypeColor(strategy.type)}>
                          {strategy.type}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Stop Loss (%)</Label>
                          <Input 
                            type="number" 
                            defaultValue={strategy.stopLoss} 
                            className="mt-1"
                            min="0.1"
                            max="20"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label>Take Profit (%)</Label>
                          <Input 
                            type="number" 
                            defaultValue={strategy.takeProfit} 
                            className="mt-1"
                            min="1"
                            max="50"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <Label>Position Size (%)</Label>
                          <Input 
                            type="number" 
                            defaultValue={strategy.allocation} 
                            className="mt-1"
                            min="5"
                            max="50"
                            step="5"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setWizardStep(2)}>
                Back
              </Button>
              <Button onClick={() => setWizardStep(4)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Generate Portfolio
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="step-4" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-green-600">Total Value</div>
                      <div className="text-2xl font-bold text-green-800">
                        ${MOCK_PORTFOLIO.totalValue.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-green-600">Daily P&L</div>
                      <div className="text-xl font-bold text-green-700">
                        +${MOCK_PORTFOLIO.dailyPnL.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {calculatePortfolioAllocation().map((strategy) => (
                      <div key={strategy.id} className="flex items-center justify-between">
                        <span className="text-sm">{strategy.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={strategy.normalizedAllocation} className="w-16 h-2" />
                          <span className="text-sm font-medium">{strategy.normalizedAllocation.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Win Rate</div>
                      <div className="text-lg font-bold text-blue-700">{MOCK_PORTFOLIO.winRate}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Sharpe Ratio</div>
                      <div className="text-lg font-bold text-blue-700">{MOCK_PORTFOLIO.sharpeRatio}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Max Drawdown</div>
                      <div className="text-lg font-bold text-red-600">{MOCK_PORTFOLIO.maxDrawdown}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Weekly P&L</div>
                      <div className="text-lg font-bold text-green-700">+${MOCK_PORTFOLIO.weeklyPnL.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Ready to Deploy</h4>
              <p className="text-sm text-blue-700 mb-4">
                Your custom trading strategy portfolio is configured and ready for live deployment. 
                Monitor performance in real-time and adjust parameters as needed.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Deploy Live Strategy
                </Button>
                <Button variant="outline">
                  Save as Template
                </Button>
                <Button variant="outline" onClick={() => setWizardStep(1)}>
                  Start Over
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}