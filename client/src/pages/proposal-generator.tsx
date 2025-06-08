import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Download, 
  Send, 
  Calculator,
  Target,
  Zap,
  Users,
  Building
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ProposalConfig {
  clientInfo: {
    businessName: string;
    industry: string;
    companySize: 'startup' | 'sme' | 'enterprise';
    contactName: string;
    email: string;
    phone: string;
    currentChallenges: string[];
  };
  selectedFeatures: string[];
  customRequirements: string;
  urgency: 'immediate' | 'within_month' | 'within_quarter' | 'flexible';
  budget: 'under_25k' | '25k_50k' | '50k_100k' | 'over_100k';
}

interface AutomationFeature {
  name: string;
  description: string;
  benefits: string[];
  costMultiplier: number;
  timeToImplement: number;
  category: 'core' | 'advanced' | 'premium';
  industryFit: string[];
}

const automationFeatures: AutomationFeature[] = [
  {
    name: 'Data Entry Automation',
    description: 'Eliminate manual data entry with intelligent form processing and data validation',
    benefits: ['95% reduction in data entry time', 'Zero human errors', 'Real-time data validation'],
    costMultiplier: 0.3,
    timeToImplement: 2,
    category: 'core',
    industryFit: ['healthcare', 'finance', 'legal', 'all']
  },
  {
    name: 'Customer Communication Automation',
    description: 'Automated email sequences, appointment scheduling, and follow-up systems',
    benefits: ['80% faster response times', 'Increased customer satisfaction', '24/7 availability'],
    costMultiplier: 0.4,
    timeToImplement: 3,
    category: 'core',
    industryFit: ['retail', 'healthcare', 'professional_services', 'all']
  },
  {
    name: 'Inventory Management System',
    description: 'Real-time inventory tracking with automated reordering and optimization',
    benefits: ['30% reduction in carrying costs', 'Prevent stockouts', 'Automated supplier management'],
    costMultiplier: 0.6,
    timeToImplement: 4,
    category: 'advanced',
    industryFit: ['retail', 'manufacturing', 'healthcare']
  },
  {
    name: 'Financial Reporting Dashboard',
    description: 'Automated financial reports with real-time analytics and forecasting',
    benefits: ['Daily financial insights', 'Predictive analytics', 'Compliance automation'],
    costMultiplier: 0.5,
    timeToImplement: 3,
    category: 'advanced',
    industryFit: ['all']
  },
  {
    name: 'AI-Powered Analytics',
    description: 'Machine learning insights for business optimization and predictive modeling',
    benefits: ['Predictive insights', 'Automated optimization', 'Competitive advantages'],
    costMultiplier: 1.2,
    timeToImplement: 6,
    category: 'premium',
    industryFit: ['technology', 'finance', 'healthcare', 'manufacturing']
  },
  {
    name: 'Workflow Automation Engine',
    description: 'Custom workflow automation for complex business processes',
    benefits: ['70% process efficiency gain', 'Seamless integrations', 'Scalable architecture'],
    costMultiplier: 0.8,
    timeToImplement: 5,
    category: 'premium',
    industryFit: ['all']
  }
];

export default function ProposalGenerator() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ProposalConfig>({
    clientInfo: {
      businessName: '',
      industry: '',
      companySize: 'sme',
      contactName: '',
      email: '',
      phone: '',
      currentChallenges: []
    },
    selectedFeatures: [],
    customRequirements: '',
    urgency: 'within_month',
    budget: '25k_50k'
  });

  const [generatedProposal, setGeneratedProposal] = useState<any>(null);

  const generateProposal = () => {
    const selectedOptions = automationFeatures.filter(option => 
      config.selectedFeatures.includes(option.name)
    );
    
    const totalCostMultiplier = selectedOptions.reduce((total, option) => 
      total + option.costMultiplier, 1
    );
    
    const basePrice = config.clientInfo.companySize === 'startup' ? 15000 : 
                     config.clientInfo.companySize === 'sme' ? 35000 : 75000;
    
    const finalPrice = Math.round(basePrice * totalCostMultiplier);
    
    return {
      features: selectedOptions,
      estimatedCost: finalPrice,
      timeline: calculateTimeline(selectedOptions),
      roi: calculateROI(finalPrice, config.clientInfo.companySize)
    };
  };

  const calculateTimeline = (features: AutomationFeature[]) => {
    const totalWeeks = features.reduce((total, feature) => total + feature.timeToImplement, 0);
    return {
      totalWeeks,
      phases: [
        { name: 'Discovery & Planning', weeks: 1 },
        { name: 'Core Implementation', weeks: Math.ceil(totalWeeks * 0.6) },
        { name: 'Testing & Optimization', weeks: Math.ceil(totalWeeks * 0.2) },
        { name: 'Training & Deployment', weeks: Math.ceil(totalWeeks * 0.2) }
      ]
    };
  };

  const calculateROI = (cost: number, size: string) => {
    const multipliers = { startup: 3, sme: 4, enterprise: 5 };
    const annualSavings = cost * multipliers[size as keyof typeof multipliers];
    return {
      annualSavings,
      paybackMonths: Math.ceil((cost / annualSavings) * 12),
      threeYearROI: Math.round(((annualSavings * 3 - cost) / cost) * 100)
    };
  };

  const handleFeatureToggle = (featureName: string) => {
    setConfig(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureName)
        ? prev.selectedFeatures.filter(f => f !== featureName)
        : [...prev.selectedFeatures, featureName]
    }));
  };

  const handleChallengeToggle = (challenge: string) => {
    setConfig(prev => ({
      ...prev,
      clientInfo: {
        ...prev.clientInfo,
        currentChallenges: prev.clientInfo.currentChallenges.includes(challenge)
          ? prev.clientInfo.currentChallenges.filter(c => c !== challenge)
          : [...prev.clientInfo.currentChallenges, challenge]
      }
    }));
  };

  const handleGenerateProposal = () => {
    if (!config.clientInfo.businessName || config.selectedFeatures.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in business name and select at least one automation feature",
        variant: "destructive"
      });
      return;
    }

    const proposal = generateProposal();
    setGeneratedProposal(proposal);
    toast({
      title: "Proposal Generated",
      description: "Custom automation proposal has been created successfully"
    });
  };

  const commonChallenges = [
    'Manual data entry errors',
    'Slow customer response times',
    'Inventory management issues',
    'Financial reporting delays',
    'Employee productivity concerns',
    'Compliance and documentation',
    'Customer communication gaps',
    'Process bottlenecks'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Proposal Generator</h1>
          <p className="text-purple-200">Create custom automation proposals with ROI calculations</p>
        </div>

        <Tabs defaultValue="client-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="client-info">Client Info</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="generated">Proposal</TabsTrigger>
          </TabsList>

          {/* Client Information Tab */}
          <TabsContent value="client-info">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="text-white">Business Name</Label>
                    <Input
                      id="businessName"
                      value={config.clientInfo.businessName}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, businessName: e.target.value }
                      }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry" className="text-white">Industry</Label>
                    <Select 
                      value={config.clientInfo.industry}
                      onValueChange={(value) => setConfig(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, industry: value }
                      }))}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="professional_services">Professional Services</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactName" className="text-white">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={config.clientInfo.contactName}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, contactName: e.target.value }
                      }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={config.clientInfo.email}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, email: e.target.value }
                      }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={config.clientInfo.phone}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, phone: e.target.value }
                      }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-3 block">Company Size</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['startup', 'sme', 'enterprise'] as const).map((size) => (
                      <Card 
                        key={size}
                        className={`cursor-pointer transition-colors ${
                          config.clientInfo.companySize === size 
                            ? 'bg-purple-500/20 border-purple-500' 
                            : 'bg-gray-800/50 border-gray-600 hover:border-purple-500/50'
                        }`}
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          clientInfo: { ...prev.clientInfo, companySize: size }
                        }))}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="text-white font-semibold capitalize">{size}</p>
                          <p className="text-gray-400 text-sm">
                            {size === 'startup' && '< 10 employees'}
                            {size === 'sme' && '10-100 employees'}
                            {size === 'enterprise' && '100+ employees'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-3 block">Current Business Challenges</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {commonChallenges.map((challenge) => (
                      <div key={challenge} className="flex items-center space-x-2">
                        <Checkbox
                          id={challenge}
                          checked={config.clientInfo.currentChallenges.includes(challenge)}
                          onCheckedChange={() => handleChallengeToggle(challenge)}
                        />
                        <Label htmlFor={challenge} className="text-sm text-gray-300 cursor-pointer">
                          {challenge}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Selection Tab */}
          <TabsContent value="features">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automation Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {automationFeatures.map((feature) => (
                    <Card 
                      key={feature.name}
                      className={`cursor-pointer transition-colors ${
                        config.selectedFeatures.includes(feature.name)
                          ? 'bg-purple-500/20 border-purple-500' 
                          : 'bg-gray-800/50 border-gray-600 hover:border-purple-500/50'
                      }`}
                      onClick={() => handleFeatureToggle(feature.name)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{feature.name}</CardTitle>
                          <Badge className={
                            feature.category === 'core' ? 'bg-green-500/20 text-green-400' :
                            feature.category === 'advanced' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-purple-500/20 text-purple-400'
                          }>
                            {feature.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-3">{feature.description}</p>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-white">Benefits:</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {feature.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
                          <span className="text-sm text-gray-400">Implementation:</span>
                          <span className="text-sm text-white">{feature.timeToImplement} weeks</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <Label htmlFor="customRequirements" className="text-white">Custom Requirements</Label>
                  <Textarea
                    id="customRequirements"
                    value={config.customRequirements}
                    onChange={(e) => setConfig(prev => ({ ...prev, customRequirements: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="Describe any specific requirements or customizations needed..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Proposal Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3">Selected Features</h3>
                    <div className="space-y-2">
                      {config.selectedFeatures.length > 0 ? (
                        config.selectedFeatures.map((featureName) => (
                          <Badge key={featureName} className="bg-purple-500/20 text-purple-400 mr-2 mb-2">
                            {featureName}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-400">No features selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Client:</span>
                        <span className="text-white">{config.clientInfo.businessName || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Industry:</span>
                        <span className="text-white">{config.clientInfo.industry || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Company Size:</span>
                        <span className="text-white capitalize">{config.clientInfo.companySize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Urgency:</span>
                        <span className="text-white">{config.urgency.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleGenerateProposal}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                    size="lg"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Generate Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generated Proposal Tab */}
          <TabsContent value="generated">
            {generatedProposal ? (
              <div className="space-y-6">
                {/* Proposal Header */}
                <Card className="bg-black/40 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Automation Proposal for {config.clientInfo.businessName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-gray-800/50 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">${generatedProposal.estimatedCost.toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">Total Investment</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">{generatedProposal.timeline.totalWeeks}</p>
                          <p className="text-gray-400 text-sm">Weeks to Complete</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">${generatedProposal.roi.annualSavings.toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">Annual Savings</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/50 border-gray-600">
                        <CardContent className="p-4 text-center">
                          <Target className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">{generatedProposal.roi.threeYearROI}%</p>
                          <p className="text-gray-400 text-sm">3-Year ROI</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Implementation Timeline */}
                <Card className="bg-black/40 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Implementation Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedProposal.timeline.phases.map((phase: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{phase.name}</p>
                            <p className="text-gray-400 text-sm">{phase.weeks} weeks</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Client
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="bg-black/40 border-gray-500/30">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">No Proposal Generated</p>
                  <p className="text-gray-400">Complete the previous steps and generate a proposal to view it here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}