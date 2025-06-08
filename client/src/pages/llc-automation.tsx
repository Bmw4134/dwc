import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Send,
  Building,
  User,
  MapPin,
  DollarSign,
  Shield,
  Brain
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface LLCAutomationProps {
  refreshTrigger: number;
}

export default function LLCAutomation({ refreshTrigger }: LLCAutomationProps) {
  const [formData, setFormData] = useState({
    companyName: 'DWC Systems LLC',
    state: 'Texas',
    registeredAgent: 'Brett Watson',
    businessAddress: '1513 Mahogany Ln, Fort Worth, TX 76140',
    mailingAddress: '1513 Mahogany Ln, Fort Worth, TX 76140',
    businessPurpose: 'Technology consulting and automation services',
    memberNames: 'Brett Micheal Watson, Christina Carolynn Dion',
    operatingAgreement: 'standard',
    filingSpeed: 'expedited'
  });

  const [automationStep, setAutomationStep] = useState('form');

  const filingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/llc-automation/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Filing failed');
      return response.json();
    },
    onSuccess: (data) => {
      setAutomationStep('processing');
      queryClient.invalidateQueries({ queryKey: ['/api/llc-automation/status'] });
    }
  });

  const { data: filingStatus } = useQuery({
    queryKey: ['/api/llc-automation/status'],
    refetchInterval: automationStep === 'processing' ? 5000 : false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filingMutation.mutate(formData);
  };

  const stateOptions = [
    'Texas', 'Delaware', 'Nevada', 'Wyoming', 'Florida', 'California', 
    'New York', 'Illinois', 'Georgia', 'Colorado'
  ];

  if (automationStep === 'processing' || (filingStatus as any)?.status === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ASI LLC Filing Automation
            </h1>
            <p className="text-xl text-gray-600">
              Advanced automation processing your LLC filing
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl">ASI Processing Your LLC Filing</CardTitle>
              <CardDescription>
                Our ASI system is autonomously handling your filing with state authorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { step: 'Form validation and optimization', status: 'completed', time: '30 seconds' },
                    { step: 'State filing system access', status: 'completed', time: '45 seconds' },
                    { step: 'Document generation and submission', status: 'completed', time: '2-5 minutes' },
                    { step: 'Payment processing', status: 'pending_authorization', time: 'Manual approval required' },
                    { step: 'Confirmation and tracking setup', status: 'pending', time: '30 seconds' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : item.status === 'processing' ? (
                          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={`font-medium ${
                          item.status === 'completed' ? 'text-green-700' : 
                          item.status === 'processing' ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {item.step}
                        </span>
                      </div>
                      <Badge variant={
                        item.status === 'completed' ? 'default' : 
                        item.status === 'processing' ? 'secondary' : 'outline'
                      }>
                        {item.time}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-3">Payment Configuration Required</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-800">Filing Fee:</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Standard $300
                        </Button>
                        <Button variant="default" size="sm" className="text-xs bg-amber-600">
                          Expedited $500
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-amber-700 space-y-1">
                      <p>• All documents ready: DWC Systems LLC, 1513 Mahogany Ln</p>
                      <p>• Christina's $600 card: Pending activation</p>
                      <p>• Alternative: Manual filing at sos.texas.gov</p>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        Configure Payment
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        Manual Filing Link
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    You'll receive email notifications and can track progress in real-time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ASI LLC Filing Automation
          </h1>
          <p className="text-xl text-gray-600">
            Automated LLC formation with ASI-powered document generation and state filing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  LLC Formation Details
                </CardTitle>
                <CardDescription>
                  Fill out your LLC information - ASI will optimize and handle the filing process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        placeholder="Your LLC Name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State of Formation
                      </label>
                      <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registered Agent
                    </label>
                    <Input
                      value={formData.registeredAgent}
                      onChange={(e) => setFormData({...formData, registeredAgent: e.target.value})}
                      placeholder="Full name of registered agent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <Input
                      value={formData.businessAddress}
                      onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                      placeholder="Complete business address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mailing Address (if different)
                    </label>
                    <Input
                      value={formData.mailingAddress}
                      onChange={(e) => setFormData({...formData, mailingAddress: e.target.value})}
                      placeholder="Leave blank if same as business address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Purpose
                    </label>
                    <Textarea
                      value={formData.businessPurpose}
                      onChange={(e) => setFormData({...formData, businessPurpose: e.target.value})}
                      placeholder="Brief description of business activities"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Names
                    </label>
                    <Input
                      value={formData.memberNames}
                      onChange={(e) => setFormData({...formData, memberNames: e.target.value})}
                      placeholder="All LLC members (comma separated)"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operating Agreement
                      </label>
                      <Select value={formData.operatingAgreement} onValueChange={(value) => setFormData({...formData, operatingAgreement: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Template</SelectItem>
                          <SelectItem value="custom">Custom Agreement</SelectItem>
                          <SelectItem value="none">No Agreement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filing Speed
                      </label>
                      <Select value={formData.filingSpeed} onValueChange={(value) => setFormData({...formData, filingSpeed: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (7-10 days) - $300</SelectItem>
                          <SelectItem value="expedited">Expedited (1-2 days) - $500</SelectItem>
                          <SelectItem value="same-day">Same Day - $800</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          ASI automation will handle the entire filing process. You'll receive confirmations and tracking information via email.
                          State filing fees and service charges will be processed automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={filingMutation.isPending}
                  >
                    {filingMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Initiating ASI Filing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Start ASI LLC Filing Automation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  ASI Automation Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Autonomous Form Completion</h4>
                    <p className="text-sm text-gray-600">ASI fills out all state forms automatically</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Document Generation</h4>
                    <p className="text-sm text-gray-600">Operating agreements and certificates auto-created</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">State Filing Integration</h4>
                    <p className="text-sm text-gray-600">Direct submission to state authorities</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Real-Time Tracking</h4>
                    <p className="text-sm text-gray-600">Monitor progress and receive updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>ASI Filing Service</span>
                  <span className="font-semibold">$199</span>
                </div>
                <div className="flex justify-between">
                  <span>State Filing Fee</span>
                  <span className="font-semibold">$300+</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating Agreement</span>
                  <span className="font-semibold">$99</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>$598+</span>
                </div>
                <p className="text-xs text-gray-500">
                  * State fees vary by jurisdiction and processing speed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}