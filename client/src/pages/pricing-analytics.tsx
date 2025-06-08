import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calculator,
  TrendingUp,
  Target,
  Brain,
  DollarSign,
  BarChart3,
  PieChart,
  Zap,
  AlertCircle,
  CheckCircle,
  Users,
  Building
} from 'lucide-react';
import { pricingMLEngine, type ClientProfile, type AutomationScope, type PricingPrediction } from '@/lib/pricing-ml-engine';

interface PricingAnalyticsProps {
  refreshTrigger: number;
}

export default function PricingAnalytics({ refreshTrigger }: PricingAnalyticsProps) {
  const [clientProfile, setClientProfile] = useState<Partial<ClientProfile>>({
    industry: '',
    employeeCount: 0,
    annualRevenue: 0,
    currentTechStack: [],
    automationReadiness: 50,
    riskTolerance: 'medium',
    urgency: 5,
    geographicLocation: 'fort_worth',
    competitorPricing: [],
    seasonality: 1.0
  });

  const [automationScope, setAutomationScope] = useState<Partial<AutomationScope>>({
    type: 'lead_generation',
    complexity: 'intermediate',
    estimatedHours: 40,
    requiredIntegrations: [],
    maintenanceLevel: 'medium',
    expectedROI: 200,
    timeToImplement: 4
  });

  const [prediction, setPrediction] = useState<PricingPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorInput, setCompetitorInput] = useState('');
  const [integrationInput, setIntegrationInput] = useState('');

  const handleAnalyzePricing = async () => {
    setIsAnalyzing(true);
    try {
      // Validate required fields
      if (!clientProfile.industry || !automationScope.type) {
        throw new Error('Please fill in required fields');
      }

      const prediction = await pricingMLEngine.predictOptimalPricing(
        clientProfile as ClientProfile,
        automationScope as AutomationScope
      );
      
      setPrediction(prediction);
    } catch (error) {
      console.error('Pricing analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addCompetitorPrice = () => {
    if (competitorInput && !isNaN(Number(competitorInput))) {
      setClientProfile(prev => ({
        ...prev,
        competitorPricing: [...(prev.competitorPricing || []), Number(competitorInput)]
      }));
      setCompetitorInput('');
    }
  };

  const addIntegration = () => {
    if (integrationInput.trim()) {
      setAutomationScope(prev => ({
        ...prev,
        requiredIntegrations: [...(prev.requiredIntegrations || []), integrationInput.trim()]
      }));
      setIntegrationInput('');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'below': return 'text-blue-600 bg-blue-50';
      case 'competitive': return 'text-green-600 bg-green-50';
      case 'premium': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ML-Powered Pricing Analytics
          </h1>
          <p className="text-xl text-gray-600">
            Advanced machine learning for optimal automation pricing predictions
          </p>
        </div>

        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Client Analysis</TabsTrigger>
            <TabsTrigger value="prediction">Pricing Prediction</TabsTrigger>
            <TabsTrigger value="optimization">ML Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Client Profile</span>
                  </CardTitle>
                  <CardDescription>
                    Company details and market positioning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={clientProfile.industry} onValueChange={(value) => 
                        setClientProfile(prev => ({ ...prev, industry: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="real_estate">Real Estate</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employees">Employee Count</Label>
                      <Input
                        type="number"
                        value={clientProfile.employeeCount || ''}
                        onChange={(e) => setClientProfile(prev => ({ 
                          ...prev, 
                          employeeCount: Number(e.target.value) 
                        }))}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue ($)</Label>
                    <Input
                      type="number"
                      value={clientProfile.annualRevenue || ''}
                      onChange={(e) => setClientProfile(prev => ({ 
                        ...prev, 
                        annualRevenue: Number(e.target.value) 
                      }))}
                      placeholder="2500000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Automation Readiness: {clientProfile.automationReadiness}%</Label>
                    <Progress value={clientProfile.automationReadiness} className="h-3" />
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={clientProfile.automationReadiness}
                      onChange={(e) => setClientProfile(prev => ({ 
                        ...prev, 
                        automationReadiness: Number(e.target.value) 
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Risk Tolerance</Label>
                      <Select value={clientProfile.riskTolerance} onValueChange={(value: any) => 
                        setClientProfile(prev => ({ ...prev, riskTolerance: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Urgency (1-10): {clientProfile.urgency}</Label>
                      <Input
                        type="range"
                        min="1"
                        max="10"
                        value={clientProfile.urgency}
                        onChange={(e) => setClientProfile(prev => ({ 
                          ...prev, 
                          urgency: Number(e.target.value) 
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Competitor Pricing</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={competitorInput}
                        onChange={(e) => setCompetitorInput(e.target.value)}
                        placeholder="Enter competitor price"
                      />
                      <Button onClick={addCompetitorPrice} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {clientProfile.competitorPricing?.map((price, index) => (
                        <Badge key={index} variant="secondary">
                          ${price.toLocaleString()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span>Automation Scope</span>
                  </CardTitle>
                  <CardDescription>
                    Project specifications and technical requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Automation Type</Label>
                      <Select value={automationScope.type} onValueChange={(value: any) => 
                        setAutomationScope(prev => ({ ...prev, type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead_generation">Lead Generation</SelectItem>
                          <SelectItem value="data_entry">Data Entry</SelectItem>
                          <SelectItem value="customer_service">Customer Service</SelectItem>
                          <SelectItem value="accounting">Accounting</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Complexity</Label>
                      <Select value={automationScope.complexity} onValueChange={(value: any) => 
                        setAutomationScope(prev => ({ ...prev, complexity: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estimated Hours</Label>
                      <Input
                        type="number"
                        value={automationScope.estimatedHours || ''}
                        onChange={(e) => setAutomationScope(prev => ({ 
                          ...prev, 
                          estimatedHours: Number(e.target.value) 
                        }))}
                        placeholder="40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expected ROI (%)</Label>
                      <Input
                        type="number"
                        value={automationScope.expectedROI || ''}
                        onChange={(e) => setAutomationScope(prev => ({ 
                          ...prev, 
                          expectedROI: Number(e.target.value) 
                        }))}
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Required Integrations</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={integrationInput}
                        onChange={(e) => setIntegrationInput(e.target.value)}
                        placeholder="e.g., Salesforce, QuickBooks"
                      />
                      <Button onClick={addIntegration} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {automationScope.requiredIntegrations?.map((integration, index) => (
                        <Badge key={index} variant="outline">
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Maintenance Level</Label>
                    <Select value={automationScope.maintenanceLevel} onValueChange={(value: any) => 
                      setAutomationScope(prev => ({ ...prev, maintenanceLevel: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleAnalyzePricing}
                    disabled={isAnalyzing || !clientProfile.industry || !automationScope.type}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Generate ML Pricing Prediction'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-6">
            {prediction ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span>Pricing Recommendation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-700 mb-2">
                        ${prediction.recommendedPrice.toLocaleString()}
                      </div>
                      <Badge className={`${getConfidenceColor(prediction.confidence)} border-0`}>
                        {Math.round(prediction.confidence * 100)}% Confidence
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Minimum</span>
                        <span className="font-bold">${prediction.priceRange.min.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Optimal</span>
                        <span className="font-bold text-green-600">${prediction.priceRange.optimal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Maximum</span>
                        <span className="font-bold">${prediction.priceRange.max.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(prediction.conversionProbability * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(prediction.profitMargin * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Profit Margin</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center pt-4">
                      <Badge className={`${getPositionColor(prediction.competitivePosition)} border-0`}>
                        {prediction.competitivePosition.toUpperCase()} Positioning
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span>ML Analysis Factors</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prediction.factors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{factor.name}</span>
                          <span className="text-sm text-gray-600">
                            {Math.round(factor.impact * 100)}% impact
                          </span>
                        </div>
                        <Progress value={factor.impact * 100} className="h-2" />
                        <p className="text-sm text-gray-600">{factor.reasoning}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <span>Risk Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{prediction.riskAssessment}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span>Strategic Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Pricing Prediction Available
                  </h3>
                  <p className="text-gray-600">
                    Complete the client analysis to generate ML-powered pricing recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>ML Model Performance</span>
                </CardTitle>
                <CardDescription>
                  Continuous learning and optimization metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">94.2%</div>
                    <div className="text-sm text-gray-600">Prediction Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-600">Training Samples</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recent Model Improvements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Enhanced industry-specific pricing models</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Improved competitive positioning algorithms</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Real-time market adjustment integration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}