import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Target,
  ExternalLink,
  Globe,
  FileText,
  Users,
  TrendingUp,
  Brain,
  Rocket,
  Database
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface FormAnalysis {
  url: string;
  title: string;
  fields: FormField[];
  submitSelector: string;
  estimatedCompletionTime: number;
  businessValue: 'high' | 'medium' | 'low';
  leadPotential: number;
}

interface FormField {
  selector: string;
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormFillResult {
  success: boolean;
  formUrl: string;
  fieldsCompleted: number;
  totalFields: number;
  submissionStatus: 'submitted' | 'failed' | 'pending_review';
  leadData: any;
  screenshots: string[];
  nextSteps: string[];
  estimatedValue: number;
}

interface LeadProfile {
  businessName: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  employeeCount: string;
  annualRevenue: string;
  painPoints: string[];
  projectBudget: string;
  timeline: string;
  decisionMaker: boolean;
}

export default function IntelligentFormAutomation() {
  const { toast } = useToast();
  
  // Form state
  const [targetUrl, setTargetUrl] = useState('');
  const [targetUrls, setTargetUrls] = useState<string[]>([]);
  const [targetIndustry, setTargetIndustry] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  // Results state
  const [formAnalysis, setFormAnalysis] = useState<FormAnalysis | null>(null);
  const [formResults, setFormResults] = useState<FormFillResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Real-time intelligence state
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [leadScoring, setLeadScoring] = useState<any>(null);

  // Analyze single form
  const analyzeFormMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/form-automation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!response.ok) throw new Error('Failed to analyze form');
      return response.json();
    },
    onSuccess: (result: FormAnalysis) => {
      setFormAnalysis(result);
      toast({
        title: "Form Analyzed",
        description: `Found ${result.fields.length} fields with ${result.businessValue} business value`
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the form. Please check the URL.",
        variant: "destructive"
      });
    }
  });

  // Fill single form
  const fillFormMutation = useMutation({
    mutationFn: async (data: { formAnalysis: FormAnalysis, targetIndustry: string }) => {
      const response = await fetch('/api/form-automation/fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to fill form');
      return response.json();
    },
    onSuccess: (result: FormFillResult) => {
      setFormResults(prev => [...prev, result]);
      if (result.success) {
        toast({
          title: "Form Submitted",
          description: `Successfully submitted form with estimated value of $${result.estimatedValue.toLocaleString()}`
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "Form could not be completed automatically",
          variant: "destructive"
        });
      }
    }
  });

  // Batch form automation
  const batchFillMutation = useMutation({
    mutationFn: async (data: { urls: string[], targetIndustry: string }) => {
      const response = await fetch('/api/form-automation/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to process batch forms');
      return response.json();
    },
    onSuccess: (data) => {
      setFormResults(prev => [...prev, ...data.results]);
      toast({
        title: "Batch Processing Complete",
        description: `Successfully processed ${data.successful} of ${data.totalProcessed} forms. Total value: $${data.totalValue.toLocaleString()}`
      });
    }
  });

  // Real-time market analysis
  const marketAnalysisMutation = useMutation({
    mutationFn: async (data: { industry: string, location: string, query: string }) => {
      const response = await fetch('/api/perplexity/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to get market analysis');
      return response.json();
    },
    onSuccess: (result) => {
      setMarketAnalysis(result);
      toast({
        title: "Market Analysis Complete",
        description: "Real-time intelligence updated"
      });
    }
  });

  // Lead scoring
  const leadScoringMutation = useMutation({
    mutationFn: async (leadData: any) => {
      const response = await fetch('/api/perplexity/lead-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (!response.ok) throw new Error('Failed to score lead');
      return response.json();
    },
    onSuccess: (result) => {
      setLeadScoring(result);
    }
  });

  // Handle form analysis
  const handleAnalyzeForm = () => {
    if (!targetUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a form URL to analyze",
        variant: "destructive"
      });
      return;
    }
    analyzeFormMutation.mutate(targetUrl);
  };

  // Handle form filling
  const handleFillForm = () => {
    if (!formAnalysis) {
      toast({
        title: "Analysis Required",
        description: "Please analyze a form first",
        variant: "destructive"
      });
      return;
    }
    fillFormMutation.mutate({ formAnalysis, targetIndustry });
  };

  // Add URL to batch list
  const addUrlToBatch = () => {
    if (newUrl && !targetUrls.includes(newUrl)) {
      setTargetUrls([...targetUrls, newUrl]);
      setNewUrl('');
    }
  };

  // Remove URL from batch
  const removeUrlFromBatch = (url: string) => {
    setTargetUrls(targetUrls.filter(u => u !== url));
  };

  // Handle batch processing
  const handleBatchProcessing = () => {
    if (targetUrls.length === 0) {
      toast({
        title: "No URLs",
        description: "Please add URLs to the batch list",
        variant: "destructive"
      });
      return;
    }
    batchFillMutation.mutate({ urls: targetUrls, targetIndustry });
  };

  // Get real-time market intelligence
  const getMarketIntelligence = () => {
    if (!targetIndustry) {
      toast({
        title: "Industry Required",
        description: "Please specify target industry",
        variant: "destructive"
      });
      return;
    }
    
    marketAnalysisMutation.mutate({
      industry: targetIndustry,
      location: 'United States',
      query: 'business automation opportunities and lead generation potential'
    });
  };

  // Auto-populate common lead generation forms
  const quickSetupLeadGen = () => {
    setTargetUrls([
      'https://www.salesforce.com/form/demo/',
      'https://www.hubspot.com/contact-sales',
      'https://www.monday.com/pricing/',
      'https://zapier.com/contact-sales/',
      'https://slack.com/contact-sales'
    ]);
    setTargetIndustry('technology');
  };

  // Get result status color
  const getResultStatusColor = (result: FormFillResult) => {
    if (result.success && result.submissionStatus === 'submitted') {
      return 'bg-green-500/20 text-green-400';
    } else if (result.success && result.submissionStatus === 'pending_review') {
      return 'bg-yellow-500/20 text-yellow-400';
    }
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <Bot className="inline h-8 w-8 mr-3 text-purple-400" />
            Intelligent Form Automation
          </h1>
          <p className="text-purple-200">AI-powered lead generation with zero manual work - analyze, fill, and convert automatically</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Perplexity AI Intelligence
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              Auto Form Filling
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
              <Database className="h-4 w-4 mr-2" />
              Lead Qualification
            </Badge>
          </div>
        </div>

        {/* Quick Setup */}
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">🚀 Quick Lead Generation Setup</CardTitle>
            <CardDescription className="text-gray-400">
              Start with pre-configured high-value business forms
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm mb-2">
                Automatically fill forms on Salesforce, HubSpot, Monday.com, Zapier, and Slack
              </p>
              <p className="text-gray-400 text-xs">
                Target technology companies with automation consulting services
              </p>
            </div>
            <Button 
              onClick={quickSetupLeadGen}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Target className="h-4 w-4 mr-2" />
              Quick Setup
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="single">Single Form</TabsTrigger>
            <TabsTrigger value="batch">Batch Processing</TabsTrigger>
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Single Form Tab */}
          <TabsContent value="single">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Form Analysis & Automation</CardTitle>
                  <CardDescription className="text-gray-400">
                    Analyze and automatically fill any web form
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Form URL</label>
                    <Input
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://example.com/contact-form"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Target Industry</label>
                    <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select industry focus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="real_estate">Real Estate</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAnalyzeForm}
                      disabled={analyzeFormMutation.isPending}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {analyzeFormMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4 mr-2" />
                      )}
                      Analyze Form
                    </Button>
                    
                    <Button 
                      onClick={handleFillForm}
                      disabled={fillFormMutation.isPending || !formAnalysis}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {fillFormMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Fill Form
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Form Analysis Results */}
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {formAnalysis ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{formAnalysis.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{formAnalysis.url}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400">Fields Found</label>
                          <p className="text-white font-semibold">{formAnalysis.fields.length}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Business Value</label>
                          <Badge className={`${
                            formAnalysis.businessValue === 'high' ? 'bg-green-500/20 text-green-400' :
                            formAnalysis.businessValue === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {formAnalysis.businessValue}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Completion Time</label>
                          <p className="text-white font-semibold">{formAnalysis.estimatedCompletionTime}s</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Lead Potential</label>
                          <p className="text-white font-semibold">{formAnalysis.leadPotential}%</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">Form Fields</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {formAnalysis.fields.map((field, index) => (
                            <div key={index} className="bg-gray-800/50 p-2 rounded text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-white font-medium">{field.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {field.type}
                                </Badge>
                              </div>
                              {field.required && (
                                <span className="text-red-400 text-xs">Required</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Analyze a form to see details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Batch Processing Tab */}
          <TabsContent value="batch">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-white">Batch Form Processing</CardTitle>
                <CardDescription className="text-gray-400">
                  Process multiple forms simultaneously for maximum lead generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Add Form URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://example.com/form"
                        className="bg-gray-800/50 border-gray-600 text-white flex-1"
                      />
                      <Button 
                        onClick={addUrlToBatch}
                        disabled={!newUrl}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Target Industry</label>
                    <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* URL List */}
                <div>
                  <h4 className="text-white font-medium mb-3">Form Queue ({targetUrls.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {targetUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800/50 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-white text-sm">{url}</span>
                        </div>
                        <Button
                          onClick={() => removeUrlFromBatch(url)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-red-400 hover:bg-red-500/10"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div>
                    <p className="text-white font-medium">
                      {targetUrls.length} forms ready for processing
                    </p>
                    <p className="text-purple-400 text-sm">
                      Estimated completion: {targetUrls.length * 3} minutes
                    </p>
                  </div>
                  <Button 
                    onClick={handleBatchProcessing}
                    disabled={batchFillMutation.isPending || targetUrls.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {batchFillMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Process All Forms
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Intelligence Tab */}
          <TabsContent value="intelligence">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Real-Time Market Intelligence</CardTitle>
                  <CardDescription className="text-gray-400">
                    Get live market insights powered by Perplexity AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={getMarketIntelligence}
                    disabled={marketAnalysisMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {marketAnalysisMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-2" />
                    )}
                    Get Market Intelligence
                  </Button>

                  {marketAnalysis && (
                    <div className="bg-gray-800/50 p-4 rounded">
                      <h4 className="text-white font-medium mb-2">Market Analysis</h4>
                      <pre className="text-gray-300 text-xs whitespace-pre-wrap">
                        {marketAnalysis.analysis}
                      </pre>
                      {marketAnalysis.citations?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-gray-400 text-xs mb-1">Sources:</p>
                          {marketAnalysis.citations.slice(0, 3).map((citation: string, index: number) => (
                            <a 
                              key={index}
                              href={citation} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 text-xs block hover:underline"
                            >
                              {citation}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Lead Scoring Intelligence</CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-powered lead qualification and scoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leadScoring ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400">Lead Score</label>
                          <p className="text-2xl font-bold text-white">{leadScoring.lead_score}/100</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Automation Potential</label>
                          <Badge className={`${
                            leadScoring.automation_potential === 'high' ? 'bg-green-500/20 text-green-400' :
                            leadScoring.automation_potential === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {leadScoring.automation_potential}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">Estimated Budget</label>
                        <p className="text-white">{leadScoring.estimated_budget}</p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">Pain Points</label>
                        <div className="space-y-1">
                          {leadScoring.pain_points?.map((point: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-red-400" />
                              <span className="text-gray-300 text-sm">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">Recommended Approach</label>
                        <p className="text-gray-300 text-sm">{leadScoring.recommended_approach}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Process forms to see lead scoring</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-white">Form Processing Results</CardTitle>
                <CardDescription className="text-gray-400">
                  Track submissions, lead data, and estimated value
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formResults.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No forms processed yet</p>
                    <p className="text-sm mt-2">Start with single form analysis or batch processing</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-800/50 p-4 rounded">
                        <label className="text-xs text-gray-400">Total Forms</label>
                        <p className="text-2xl font-bold text-white">{formResults.length}</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded">
                        <label className="text-xs text-gray-400">Successful</label>
                        <p className="text-2xl font-bold text-green-400">
                          {formResults.filter(r => r.success).length}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded">
                        <label className="text-xs text-gray-400">Total Value</label>
                        <p className="text-2xl font-bold text-blue-400">
                          ${formResults.reduce((sum, r) => sum + r.estimatedValue, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded">
                        <label className="text-xs text-gray-400">Avg. Fields</label>
                        <p className="text-2xl font-bold text-purple-400">
                          {Math.round(formResults.reduce((sum, r) => sum + r.fieldsCompleted, 0) / formResults.length)}
                        </p>
                      </div>
                    </div>

                    {/* Individual Results */}
                    {formResults.map((result, index) => (
                      <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{result.formUrl}</h4>
                          <Badge className={getResultStatusColor(result)}>
                            {result.success ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {result.submissionStatus}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="text-xs text-gray-400">Fields Completed</label>
                            <p className="text-white">{result.fieldsCompleted}/{result.totalFields}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400">Estimated Value</label>
                            <p className="text-green-400 font-semibold">${result.estimatedValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400">Business</label>
                            <p className="text-white">{result.leadData?.businessName}</p>
                          </div>
                        </div>

                        {result.nextSteps && result.nextSteps.length > 0 && (
                          <div>
                            <label className="text-xs text-gray-400 mb-2 block">Next Steps</label>
                            <div className="space-y-1">
                              {result.nextSteps.slice(0, 3).map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-blue-400 flex-shrink-0" />
                                  <span className="text-gray-300 text-sm">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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