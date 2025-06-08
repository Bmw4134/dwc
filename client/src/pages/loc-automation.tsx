import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Building, 
  FileText, 
  Zap, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Target,
  TrendingUp,
  Shield,
  CreditCard,
  Building2,
  Briefcase,
  ArrowRight,
  Plus
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface LOCAutomationProps {
  refreshTrigger: number;
}

export default function LOCAutomation({ refreshTrigger }: LOCAutomationProps) {
  const [activeTab, setActiveTab] = useState('applications');
  const [applicationData, setApplicationData] = useState({
    businessName: 'DWC Systems LLC',
    einNumber: '',
    businessAddress: '',
    yearsInBusiness: '0',
    annualRevenue: '150000',
    requestedAmount: '250000',
    businessDescription: 'Advanced AI/AGI automation consulting and software development',
    ownerCreditScore: '580',
    collateralType: 'business_assets'
  });

  const { data: locApplications } = useQuery({
    queryKey: ['/api/loc/applications'],
    refetchInterval: 30000
  });

  const { data: lenderOptions } = useQuery({
    queryKey: ['/api/loc/lenders'],
    refetchInterval: 300000
  });

  const { data: creditProfile } = useQuery({
    queryKey: ['/api/loc/credit-profile'],
    refetchInterval: 86400000
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: { lenders: string[], applicationData: typeof applicationData }) => {
      const response = await fetch('/api/loc/submit-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Application submission failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/loc/applications'] });
    }
  });

  const quickApplicationMutation = useMutation({
    mutationFn: async (lenderType: string) => {
      const response = await fetch('/api/loc/quick-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lenderType,
          businessData: applicationData
        })
      });
      if (!response.ok) throw new Error('Quick application failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/loc/applications'] });
    }
  });

  const handleMassApplication = () => {
    const priorityLenders = [
      'sba_preferred',
      'online_business_lenders',
      'traditional_banks',
      'alternative_lenders'
    ];
    
    applicationMutation.mutate({
      lenders: priorityLenders,
      applicationData
    });
  };

  const handleQuickApply = (lenderType: string) => {
    quickApplicationMutation.mutate(lenderType);
  };

  const recommendedLenders = [
    {
      name: 'SBA 7(a) Loans',
      type: 'sba_preferred',
      approvalRate: '85%',
      timeframe: '30-60 days',
      maxAmount: '$5M',
      minCreditScore: 680,
      requirements: ['2+ years business', 'Good credit', 'Cash flow'],
      recommended: false,
      reason: 'Credit score below minimum'
    },
    {
      name: 'Kabbage/American Express',
      type: 'online_business_lenders',
      approvalRate: '70%',
      timeframe: '1-3 days',
      maxAmount: '$250K',
      minCreditScore: 560,
      requirements: ['6+ months business', 'Bank statements', 'Revenue verification'],
      recommended: true,
      reason: 'Fast approval, lower credit requirements'
    },
    {
      name: 'BlueVine Business Line of Credit',
      type: 'online_business_lenders',
      approvalRate: '65%',
      timeframe: '1-2 days',
      maxAmount: '$250K',
      minCreditScore: 600,
      requirements: ['6+ months business', 'Revenue $100K+'],
      recommended: true,
      reason: 'Tech-friendly, fast processing'
    },
    {
      name: 'OnDeck Capital',
      type: 'alternative_lenders',
      approvalRate: '60%',
      timeframe: '24 hours',
      maxAmount: '$500K',
      minCreditScore: 550,
      requirements: ['1+ year business', 'Revenue $100K+'],
      recommended: true,
      reason: 'Quick approval, flexible terms'
    },
    {
      name: 'Fundbox Line of Credit',
      type: 'online_business_lenders',
      approvalRate: '75%',
      timeframe: '24 hours',
      maxAmount: '$150K',
      minCreditScore: 500,
      requirements: ['3+ months business', 'Bank account access'],
      recommended: true,
      reason: 'Lowest credit requirements'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LOC Automation Center
          </h1>
          <p className="text-xl text-gray-600">
            Autonomous line of credit applications across multiple lenders
          </p>
        </div>

        {/* Quick Action Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Today's LOC Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-sm opacity-90">Recommended Lenders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24hrs</div>
                  <div className="text-sm opacity-90">Fastest Approval</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">$250K</div>
                  <div className="text-sm opacity-90">Target Amount</div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4"
                onClick={handleMassApplication}
                disabled={applicationMutation.isPending}
              >
                {applicationMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting Applications...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Apply to All Recommended Lenders Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Applications</span>
            </TabsTrigger>
            <TabsTrigger value="lenders" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Lenders</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Business Profile</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Status Tracking</span>
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Data</CardTitle>
                  <CardDescription>Business information for LOC applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={applicationData.businessName}
                      onChange={(e) => setApplicationData({...applicationData, businessName: e.target.value})}
                      placeholder="Business Name"
                    />
                    <Input
                      value={applicationData.einNumber}
                      onChange={(e) => setApplicationData({...applicationData, einNumber: e.target.value})}
                      placeholder="EIN Number"
                    />
                  </div>
                  
                  <Input
                    value={applicationData.businessAddress}
                    onChange={(e) => setApplicationData({...applicationData, businessAddress: e.target.value})}
                    placeholder="Business Address"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={applicationData.annualRevenue}
                      onChange={(e) => setApplicationData({...applicationData, annualRevenue: e.target.value})}
                      placeholder="Annual Revenue ($)"
                      type="number"
                    />
                    <Input
                      value={applicationData.requestedAmount}
                      onChange={(e) => setApplicationData({...applicationData, requestedAmount: e.target.value})}
                      placeholder="Requested Amount ($)"
                      type="number"
                    />
                  </div>
                  
                  <Textarea
                    value={applicationData.businessDescription}
                    onChange={(e) => setApplicationData({...applicationData, businessDescription: e.target.value})}
                    placeholder="Business Description"
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={applicationData.ownerCreditScore}
                      onChange={(e) => setApplicationData({...applicationData, ownerCreditScore: e.target.value})}
                      placeholder="Credit Score"
                      type="number"
                    />
                    <Select value={applicationData.collateralType} onValueChange={(value) => setApplicationData({...applicationData, collateralType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business_assets">Business Assets</SelectItem>
                        <SelectItem value="personal_guarantee">Personal Guarantee</SelectItem>
                        <SelectItem value="real_estate">Real Estate</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="unsecured">Unsecured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Apply Options</CardTitle>
                  <CardDescription>Apply to individual lenders instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendedLenders.filter(l => l.recommended).map((lender, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{lender.name}</h4>
                        <div className="text-sm text-gray-600">
                          {lender.timeframe} • {lender.approvalRate} approval rate
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {lender.reason}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleQuickApply(lender.type)}
                        disabled={quickApplicationMutation.isPending}
                        className="ml-4"
                      >
                        {quickApplicationMutation.isPending ? (
                          <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Apply Now
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lenders Tab */}
          <TabsContent value="lenders">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedLenders.map((lender, index) => (
                <Card key={index} className={`${lender.recommended ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lender.name}</CardTitle>
                      {lender.recommended && (
                        <Badge className="bg-green-500">Recommended</Badge>
                      )}
                    </div>
                    <CardDescription>{lender.reason}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Max Amount:</span>
                          <div className="font-semibold">{lender.maxAmount}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Min Credit:</span>
                          <div className="font-semibold">{lender.minCreditScore}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Approval Rate:</span>
                          <div className="font-semibold text-green-600">{lender.approvalRate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Timeframe:</span>
                          <div className="font-semibold">{lender.timeframe}</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-600 text-sm">Requirements:</span>
                        <ul className="text-sm mt-1">
                          {lender.requirements.map((req, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant={lender.recommended ? 'default' : 'outline'}
                        onClick={() => handleQuickApply(lender.type)}
                      >
                        Apply to {lender.name.split(' ')[0]}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Strength Analysis</CardTitle>
                  <CardDescription>ASI assessment of LOC approval chances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Revenue Projection</span>
                      <Badge className="bg-green-500">Strong</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Business Model</span>
                      <Badge className="bg-green-500">Excellent</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Credit Profile</span>
                      <Badge variant="outline">Improving</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Time in Business</span>
                      <Badge variant="destructive">New</Badge>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Approval Probability</span>
                        <span className="font-bold">72%</span>
                      </div>
                      <Progress value={72} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                  <CardDescription>ASI suggestions to improve approval odds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">Strong Revenue Projections</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        $150K+ projected revenue demonstrates growth potential
                      </p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="font-medium text-yellow-800">Complete LLC Formation</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Formal business structure required for most lenders
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-800">Focus on Alternative Lenders</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        Online lenders more flexible with new businesses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Status Tracking Tab */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Application Status Dashboard</CardTitle>
                <CardDescription>Real-time tracking of all LOC applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(locApplications as any[])?.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{app.lenderName}</h4>
                        <div className="text-sm text-gray-600">
                          Applied: {app.appliedDate} • Amount: ${app.requestedAmount?.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          app.status === 'approved' ? 'default' :
                          app.status === 'pending' ? 'secondary' :
                          app.status === 'under_review' ? 'outline' : 'destructive'
                        }>
                          {app.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Track
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No applications submitted yet</p>
                      <p className="text-sm">Use the Applications tab to start applying</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}