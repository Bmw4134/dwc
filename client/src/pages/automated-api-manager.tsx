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
  Key, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Download,
  ExternalLink,
  Globe,
  Lock,
  Rocket,
  Settings,
  Database,
  Shield
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyRequest {
  serviceName: string;
  email: string;
  businessName: string;
  website: string;
  purpose: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface ApiKeyResult {
  success: boolean;
  serviceName: string;
  apiKey?: string;
  accountDetails?: any;
  screenshots: string[];
  steps: string[];
  error?: string;
  loginCredentials?: {
    email: string;
    password: string;
    accountId?: string;
  };
}

interface ServiceConfig {
  name: string;
  registrationUrl: string;
  rateLimit: {
    free: string;
    paid?: string;
  };
  documentation: string;
}

export default function AutomatedApiManager() {
  const { toast } = useToast();
  
  // Form state
  const [selectedService, setSelectedService] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('DWC Systems LLC');
  const [website, setWebsite] = useState('https://dwc.systems');
  const [purpose, setPurpose] = useState('Business automation and consulting platform integration');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Results state
  const [acquisitionResults, setAcquisitionResults] = useState<ApiKeyResult[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Common services for batch acquisition
  const [selectedBatchServices, setSelectedBatchServices] = useState<string[]>([]);

  // Get supported services
  const { data: supportedServices = [], isLoading: servicesLoading } = useQuery<ServiceConfig[]>({
    queryKey: ['/api/api-keys/supported-services']
  });

  // Single API key acquisition
  const acquireApiKeyMutation = useMutation({
    mutationFn: async (request: ApiKeyRequest) => {
      const response = await fetch('/api/api-keys/acquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error('Failed to acquire API key');
      return response.json();
    },
    onSuccess: (result: ApiKeyResult) => {
      setAcquisitionResults(prev => [...prev, result]);
      if (result.success) {
        toast({
          title: "API Key Acquired",
          description: `Successfully obtained ${result.serviceName} API key`
        });
      } else {
        toast({
          title: "Acquisition Failed",
          description: result.error || `Failed to acquire ${result.serviceName} API key`,
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Automation Error",
        description: "Browser automation system is not available",
        variant: "destructive"
      });
    }
  });

  // Batch API key acquisition
  const batchAcquireMutation = useMutation({
    mutationFn: async (requests: ApiKeyRequest[]) => {
      const response = await fetch('/api/api-keys/batch-acquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests })
      });
      if (!response.ok) throw new Error('Failed to acquire API keys');
      return response.json();
    },
    onSuccess: (data) => {
      setAcquisitionResults(prev => [...prev, ...data.results]);
      toast({
        title: "Batch Acquisition Complete",
        description: `Successfully acquired ${data.successful} of ${data.totalRequested} API keys`
      });
    },
    onError: () => {
      toast({
        title: "Batch Acquisition Failed",
        description: "Failed to process batch API key acquisition",
        variant: "destructive"
      });
    }
  });

  // Handle single service acquisition
  const handleAcquireApiKey = () => {
    if (!selectedService || !email || !businessName) {
      toast({
        title: "Missing Information",
        description: "Please fill in service, email, and business name",
        variant: "destructive"
      });
      return;
    }

    acquireApiKeyMutation.mutate({
      serviceName: selectedService,
      email,
      businessName,
      website,
      purpose,
      firstName,
      lastName,
      phone
    });
  };

  // Handle batch acquisition
  const handleBatchAcquisition = () => {
    if (selectedBatchServices.length === 0 || !email || !businessName) {
      toast({
        title: "Missing Information",
        description: "Please select services and fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const requests = selectedBatchServices.map(serviceName => ({
      serviceName,
      email,
      businessName,
      website,
      purpose,
      firstName,
      lastName,
      phone
    }));

    batchAcquireMutation.mutate(requests);
  };

  // Auto-populate NASA acquisition
  const handleQuickNASA = () => {
    setSelectedService('NASA');
    setPurpose('Business intelligence platform requiring astronomical data and Earth observation imagery for market analysis and consulting services');
    if (!email) setEmail('admin@dwc.systems');
  };

  // Get service status color
  const getStatusColor = (result: ApiKeyResult) => {
    if (result.success) return 'bg-green-500/20 text-green-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <Key className="inline h-8 w-8 mr-3 text-blue-400" />
            Automated API Key Manager
          </h1>
          <p className="text-blue-200">Eliminate manual API key acquisition - full automation for NASA, Google, and 20+ services</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-green-500/20 text-green-400 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Secure Automation
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              Zero Manual Work
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
              <Database className="h-4 w-4 mr-2" />
              Auto Integration
            </Badge>
          </div>
        </div>

        {/* Quick NASA Acquisition */}
        <Card className="bg-black/40 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">🚀 Quick NASA API Setup</CardTitle>
            <CardDescription className="text-gray-400">
              Get your NASA API key in seconds - no manual work required
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-white text-sm mb-2">
                NASA provides free access to astronomical data, satellite imagery, and space intelligence
              </p>
              <p className="text-gray-400 text-xs">
                Rate limit: 1,000 requests/hour • Perfect for business intelligence platforms
              </p>
            </div>
            <Button 
              onClick={handleQuickNASA}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Setup NASA API
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single">Single Service</TabsTrigger>
            <TabsTrigger value="batch">Batch Acquisition</TabsTrigger>
            <TabsTrigger value="results">Results & Keys</TabsTrigger>
          </TabsList>

          {/* Single Service Tab */}
          <TabsContent value="single">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Service Configuration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Select service and configure acquisition parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Service</label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select API service" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedServices.map((service) => (
                          <SelectItem key={service.name} value={service.name}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">First Name</label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Last Name</label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Smith"
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dwc.systems"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Business Name</label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="DWC Systems LLC"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Website</label>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://dwc.systems"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Usage Purpose</label>
                    <Textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Business automation and consulting platform integration"
                      className="bg-gray-800/50 border-gray-600 text-white min-h-[80px]"
                    />
                  </div>

                  <Button 
                    onClick={handleAcquireApiKey}
                    disabled={acquireApiKeyMutation.isPending || !selectedService}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {acquireApiKeyMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Key className="h-4 w-4 mr-2" />
                    )}
                    Acquire API Key
                  </Button>
                </CardContent>
              </Card>

              {/* Service Information */}
              <Card className="bg-black/40 border-gray-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Service Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedService && supportedServices.length > 0 ? (
                    (() => {
                      const service = supportedServices.find(s => s.name === selectedService);
                      return service ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                              Professional API service with enterprise-grade reliability
                            </p>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-2">Rate Limits</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Free Tier:</span>
                                <span className="text-green-400 text-sm">{service.rateLimit.free}</span>
                              </div>
                              {service.rateLimit.paid && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400 text-sm">Paid Tier:</span>
                                  <span className="text-blue-400 text-sm">{service.rateLimit.paid}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-medium mb-2">Registration Process</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Automated form completion</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Email verification handling</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>API key extraction</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span>Account credentials saved</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-600">
                            <Button 
                              variant="outline"
                              onClick={() => window.open(service.documentation, '_blank')}
                              className="border-gray-600 text-gray-300"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Documentation
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })()
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a service to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Batch Acquisition Tab */}
          <TabsContent value="batch">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-white">Batch API Key Acquisition</CardTitle>
                <CardDescription className="text-gray-400">
                  Acquire multiple API keys simultaneously with full automation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Select Services</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {supportedServices.map((service) => (
                      <div 
                        key={service.name}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedBatchServices.includes(service.name)
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                        }`}
                        onClick={() => {
                          setSelectedBatchServices(prev => 
                            prev.includes(service.name)
                              ? prev.filter(s => s !== service.name)
                              : [...prev, service.name]
                          );
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{service.name}</span>
                          {selectedBatchServices.includes(service.name) && (
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{service.rateLimit.free}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dwc.systems"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Business Name</label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="DWC Systems LLC"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div>
                    <p className="text-white font-medium">
                      {selectedBatchServices.length} services selected
                    </p>
                    <p className="text-blue-400 text-sm">
                      Estimated completion: {selectedBatchServices.length * 2} minutes
                    </p>
                  </div>
                  <Button 
                    onClick={handleBatchAcquisition}
                    disabled={batchAcquireMutation.isPending || selectedBatchServices.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {batchAcquireMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Start Batch Acquisition
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card className="bg-black/40 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-white">Acquisition Results</CardTitle>
                <CardDescription className="text-gray-400">
                  API keys, credentials, and integration status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {acquisitionResults.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No API keys acquired yet</p>
                    <p className="text-sm mt-2">Use the acquisition tabs to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {acquisitionResults.map((result, index) => (
                      <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-medium">{result.serviceName}</h4>
                          <Badge className={getStatusColor(result)}>
                            {result.success ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {result.success ? 'Success' : 'Failed'}
                          </Badge>
                        </div>

                        {result.success && result.apiKey ? (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-gray-400">API Key</label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="bg-gray-900 px-3 py-2 rounded text-sm text-green-400 flex-1">
                                  {result.apiKey}
                                </code>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(result.apiKey!);
                                    toast({ title: "Copied", description: "API key copied to clipboard" });
                                  }}
                                  className="border-gray-600"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {result.loginCredentials && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-gray-400">Login Email</label>
                                  <code className="block bg-gray-900 px-3 py-2 rounded text-sm text-blue-400 mt-1">
                                    {result.loginCredentials.email}
                                  </code>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400">Password</label>
                                  <code className="block bg-gray-900 px-3 py-2 rounded text-sm text-purple-400 mt-1">
                                    {result.loginCredentials.password}
                                  </code>
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="text-xs text-gray-400">Automation Steps</label>
                              <div className="mt-1 space-y-1">
                                {result.steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="text-xs text-gray-300 flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                                    {step}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-400 text-sm">
                            {result.error || 'Failed to acquire API key'}
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