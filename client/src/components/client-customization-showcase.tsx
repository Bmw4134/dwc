import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  Layout, 
  Zap, 
  BarChart3, 
  Settings, 
  Users, 
  Building2,
  Brain,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Save,
  Download,
  Share,
  Eye,
  Play,
  Pause
} from 'lucide-react';

interface ClientRequirement {
  industry: string;
  companySize: 'startup' | 'sme' | 'enterprise';
  primaryGoals: string[];
  budgetRange: string;
  timeline: string;
  specificNeeds: string[];
}

interface CustomizationOption {
  category: 'layout' | 'features' | 'branding' | 'integrations';
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  timeToImplement: string;
  costMultiplier: number;
  previewUrl?: string;
}

interface ShowcaseConfiguration {
  clientInfo: ClientRequirement;
  selectedFeatures: string[];
  brandingOptions: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    companyName: string;
  };
  layoutPreference: 'executive' | 'operational' | 'hybrid';
  enabledModules: string[];
}

export default function ClientCustomizationShowcase() {
  const [currentStep, setCurrentStep] = useState<'discovery' | 'showcase' | 'customization' | 'proposal'>('discovery');
  const [isShowcasing, setIsShowcasing] = useState(false);
  const [config, setConfig] = useState<ShowcaseConfiguration>({
    clientInfo: {
      industry: '',
      companySize: 'sme',
      primaryGoals: [],
      budgetRange: '',
      timeline: '',
      specificNeeds: []
    },
    selectedFeatures: [],
    brandingOptions: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      companyName: 'Your Company'
    },
    layoutPreference: 'hybrid',
    enabledModules: []
  });

  // Industry-specific feature recommendations
  const industryFeatures = {
    'healthcare': ['HIPAA Compliance', 'Patient Data Management', 'Appointment Automation', 'Medical AI Insights'],
    'finance': ['Financial Forecasting', 'Risk Assessment', 'Compliance Monitoring', 'Real-time Analytics'],
    'manufacturing': ['Supply Chain Optimization', 'Quality Control', 'Predictive Maintenance', 'Production Analytics'],
    'retail': ['Inventory Management', 'Customer Analytics', 'Sales Forecasting', 'Marketing Automation'],
    'technology': ['Development Workflows', 'Code Analytics', 'Team Collaboration', 'Performance Monitoring'],
    'consulting': ['Client Portal', 'Project Management', 'Time Tracking', 'Proposal Generation'],
    'real_estate': ['Property Management', 'Lead Tracking', 'Market Analysis', 'Client Communication']
  };

  // Available customization options
  const customizationOptions: CustomizationOption[] = [
    {
      category: 'layout',
      name: 'Executive Dashboard',
      description: 'High-level overview with key metrics and strategic insights',
      impact: 'high',
      timeToImplement: '1-2 weeks',
      costMultiplier: 1.2
    },
    {
      category: 'layout',
      name: 'Operational Dashboard',
      description: 'Detailed operational metrics and workflow management',
      impact: 'high',
      timeToImplement: '2-3 weeks',
      costMultiplier: 1.5
    },
    {
      category: 'features',
      name: 'AI-Powered Analytics',
      description: 'Advanced machine learning insights and predictions',
      impact: 'high',
      timeToImplement: '3-4 weeks',
      costMultiplier: 2.0
    },
    {
      category: 'features',
      name: 'Real-time Collaboration',
      description: 'Multi-user real-time editing and communication tools',
      impact: 'medium',
      timeToImplement: '2-3 weeks',
      costMultiplier: 1.3
    },
    {
      category: 'branding',
      name: 'Custom Branding Package',
      description: 'Full brand integration with logos, colors, and styling',
      impact: 'medium',
      timeToImplement: '1 week',
      costMultiplier: 1.1
    },
    {
      category: 'integrations',
      name: 'Enterprise API Integration',
      description: 'Connect with existing enterprise systems and databases',
      impact: 'high',
      timeToImplement: '4-6 weeks',
      costMultiplier: 1.8
    }
  ];

  // Start live showcase
  const startShowcase = () => {
    setIsShowcasing(true);
    setCurrentStep('showcase');
    
    // Apply client-specific branding
    applyClientBranding();
    
    // Enable relevant modules based on industry
    enableIndustryModules();
  };

  // Apply client branding in real-time
  const applyClientBranding = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.brandingOptions.primaryColor);
    root.style.setProperty('--secondary-color', config.brandingOptions.secondaryColor);
    
    // Update page title
    document.title = `${config.brandingOptions.companyName} - AI Platform`;
  };

  // Enable industry-specific modules
  const enableIndustryModules = () => {
    const industryModules = industryFeatures[config.clientInfo.industry as keyof typeof industryFeatures] || [];
    setConfig(prev => ({
      ...prev,
      enabledModules: industryModules
    }));
  };

  // Generate proposal based on selections
  const generateProposal = () => {
    const selectedOptions = customizationOptions.filter(option => 
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

  const calculateTimeline = (features: CustomizationOption[]) => {
    const weeks = features.reduce((total, feature) => {
      const weeks = parseInt(feature.timeToImplement.split('-')[1] || feature.timeToImplement.split(' ')[0]);
      return total + weeks;
    }, 0);
    return `${Math.ceil(weeks * 0.8)}-${weeks} weeks`; // Account for parallel development
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

  // Discovery Phase
  const DiscoveryPhase = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Let's Understand Your Needs</h2>
        <p className="text-slate-400">Tell us about your business so we can showcase the perfect solution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Industry</label>
              <select 
                className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                value={config.clientInfo.industry}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo, industry: e.target.value }
                }))}
              >
                <option value="">Select Industry</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance & Banking</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="technology">Technology</option>
                <option value="consulting">Consulting</option>
                <option value="real_estate">Real Estate</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Company Size</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {['startup', 'sme', 'enterprise'].map(size => (
                  <Button
                    key={size}
                    variant={config.clientInfo.companySize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      clientInfo: { ...prev.clientInfo, companySize: size as any }
                    }))}
                  >
                    {size.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300">Company Name</label>
              <input
                type="text"
                className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                value={config.brandingOptions.companyName}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  brandingOptions: { ...prev.brandingOptions, companyName: e.target.value }
                }))}
                placeholder="Your Company Name"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Project Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Primary Goals</label>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {[
                  'Increase operational efficiency',
                  'Reduce manual processes',
                  'Improve data insights',
                  'Enhance customer experience',
                  'Scale business operations',
                  'Ensure compliance'
                ].map(goal => (
                  <label key={goal} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.clientInfo.primaryGoals.includes(goal)}
                      onChange={(e) => {
                        const goals = e.target.checked 
                          ? [...config.clientInfo.primaryGoals, goal]
                          : config.clientInfo.primaryGoals.filter(g => g !== goal);
                        setConfig(prev => ({
                          ...prev,
                          clientInfo: { ...prev.clientInfo, primaryGoals: goals }
                        }));
                      }}
                    />
                    <span className="text-sm text-slate-300">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300">Timeline</label>
              <select 
                className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                value={config.clientInfo.timeline}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  clientInfo: { ...prev.clientInfo, timeline: e.target.value }
                }))}
              >
                <option value="">Select Timeline</option>
                <option value="urgent">ASAP (4-6 weeks)</option>
                <option value="normal">Standard (8-12 weeks)</option>
                <option value="flexible">Flexible (3-6 months)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={startShowcase}
          disabled={!config.clientInfo.industry || !config.brandingOptions.companyName}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Live Showcase
        </Button>
      </div>
    </div>
  );

  // Live Showcase Phase
  const ShowcasePhase = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Showcase for {config.brandingOptions.companyName}</h2>
          <p className="text-slate-400">Experience your customized platform in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500">Live Demo</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep('customization')}
          >
            Customize Features
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Monthly Savings</p>
                    <p className="text-2xl font-bold text-white">$25,400</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Efficiency Gain</p>
                    <p className="text-2xl font-bold text-white">+340%</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">AI Insights</p>
                    <p className="text-2xl font-bold text-white">24/7</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Industry-Specific Features for {config.clientInfo.industry}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {config.enabledModules.map((module, index) => (
                  <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-white">{module}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customizationOptions.map((option, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{option.name}</h3>
                    <Badge className={`${option.impact === 'high' ? 'bg-red-500' : option.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {option.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{option.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{option.timeToImplement}</span>
                    <Button
                      size="sm"
                      variant={config.selectedFeatures.includes(option.name) ? 'default' : 'outline'}
                      onClick={() => {
                        const features = config.selectedFeatures.includes(option.name)
                          ? config.selectedFeatures.filter(f => f !== option.name)
                          : [...config.selectedFeatures, option.name];
                        setConfig(prev => ({ ...prev, selectedFeatures: features }));
                      }}
                    >
                      {config.selectedFeatures.includes(option.name) ? 'Selected' : 'Add'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics Dashboard</h3>
                <p className="text-slate-400">Your data-driven insights would appear here</p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-400">94%</p>
                    <p className="text-sm text-slate-400">Accuracy Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">2.3s</p>
                    <p className="text-sm text-slate-400">Response Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">24/7</p>
                    <p className="text-sm text-slate-400">Monitoring</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Available Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Salesforce', 'Microsoft 365', 'Google Workspace', 'Slack', 'Zoom', 'QuickBooks', 'HubSpot', 'Zapier'].map((integration) => (
                    <div key={integration} className="p-3 bg-slate-700/50 rounded-lg text-center">
                      <Globe className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                      <span className="text-sm text-white">{integration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button
          onClick={() => setCurrentStep('proposal')}
          className="bg-green-600 hover:bg-green-700 px-8 py-3"
        >
          Generate Proposal
        </Button>
      </div>
    </div>
  );

  // Proposal Phase
  const ProposalPhase = () => {
    const proposal = generateProposal();
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Your Custom Solution Proposal</h2>
          <p className="text-slate-400">Tailored specifically for {config.brandingOptions.companyName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-600 to-teal-600 border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-white font-bold mb-2">Investment</h3>
              <p className="text-3xl font-bold text-white">${proposal.estimatedCost.toLocaleString()}</p>
              <p className="text-green-100 text-sm mt-1">One-time setup</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-white font-bold mb-2">Timeline</h3>
              <p className="text-3xl font-bold text-white">{proposal.timeline}</p>
              <p className="text-blue-100 text-sm mt-1">To full deployment</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-white font-bold mb-2">3-Year ROI</h3>
              <p className="text-3xl font-bold text-white">{proposal.roi.threeYearROI}%</p>
              <p className="text-purple-100 text-sm mt-1">Return on investment</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Included Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposal.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{feature.name}</h4>
                    <p className="text-sm text-slate-400">{feature.timeToImplement}</p>
                  </div>
                  <Badge className={`${feature.impact === 'high' ? 'bg-red-500' : feature.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                    {feature.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download Proposal
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share with Team
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Schedule Implementation
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {['discovery', 'showcase', 'customization', 'proposal'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-blue-600 text-white' : 
                  ['discovery', 'showcase'].includes(step) && currentStep !== 'discovery' ? 'bg-green-600 text-white' : 
                  'bg-slate-600 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && <div className="w-16 h-1 bg-slate-600 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        {currentStep === 'discovery' && <DiscoveryPhase />}
        {currentStep === 'showcase' && <ShowcasePhase />}
        {currentStep === 'proposal' && <ProposalPhase />}
      </div>
    </div>
  );
}