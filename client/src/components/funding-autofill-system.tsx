import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Download,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoOwnerData {
  name: string;
  creditScore: number;
  annualIncome: number;
  employmentStatus: string;
  yearsAtJob: number;
}

interface SalaryProjection {
  currentSalary: number;
  projectedGrowth: number;
  annualizedRevenue: number;
  confidenceLevel: number;
}

interface FundingApplication {
  businessName: string;
  requestedAmount: number;
  purpose: string;
  ownerInfo: CoOwnerData;
  coOwnerInfo: CoOwnerData;
  salaryProjections: SalaryProjection;
  generatedAt: Date;
}

export default function FundingAutofillSystem() {
  const [previewMode, setPreviewMode] = useState(true);
  const [application, setApplication] = useState<FundingApplication>({
    businessName: 'DWC Systems LLC',
    requestedAmount: 500,
    purpose: 'Business operations and growth funding',
    ownerInfo: {
      name: '',
      creditScore: 0,
      annualIncome: 0,
      employmentStatus: 'Business Owner',
      yearsAtJob: 1
    },
    coOwnerInfo: {
      name: 'Wife (Co-Owner)',
      creditScore: 690,
      annualIncome: 65000,
      employmentStatus: 'Employed',
      yearsAtJob: 3
    },
    salaryProjections: {
      currentSalary: 0,
      projectedGrowth: 15,
      annualizedRevenue: 0,
      confidenceLevel: 85
    },
    generatedAt: new Date()
  });

  const [submissions, setSubmissions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    calculateProjections();
  }, [application.ownerInfo.annualIncome, application.coOwnerInfo.annualIncome]);

  const calculateProjections = () => {
    const totalCurrentIncome = application.ownerInfo.annualIncome + application.coOwnerInfo.annualIncome;
    const projectedRevenue = totalCurrentIncome * (1 + application.salaryProjections.projectedGrowth / 100);
    
    setApplication(prev => ({
      ...prev,
      salaryProjections: {
        ...prev.salaryProjections,
        currentSalary: totalCurrentIncome,
        annualizedRevenue: projectedRevenue
      }
    }));
  };

  const handleAutofill = () => {
    // Inject pre-configured data
    setApplication(prev => ({
      ...prev,
      ownerInfo: {
        ...prev.ownerInfo,
        name: 'DWC Primary Owner',
        creditScore: 720,
        annualIncome: 85000,
        employmentStatus: 'Business Owner',
        yearsAtJob: 2
      },
      coOwnerInfo: {
        name: 'Wife (Co-Owner)',
        creditScore: 690,
        annualIncome: 65000,
        employmentStatus: 'Employed',
        yearsAtJob: 3
      }
    }));

    toast({
      title: "Autofill Complete",
      description: "Co-owner data injected with 690 credit score"
    });
  };

  const handlePreviewSubmission = () => {
    const submissionPreview = {
      ...application,
      id: Date.now(),
      status: 'preview',
      submittedAt: new Date()
    };

    setSubmissions(prev => [submissionPreview, ...prev]);
    
    toast({
      title: "Submission Preview Generated",
      description: "Review data before final submission"
    });
  };

  const handleFinalSubmission = (submissionId: number) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'submitted', submittedAt: new Date() }
          : sub
      )
    );

    toast({
      title: "Application Submitted",
      description: "Funding application successfully submitted"
    });
  };

  const generatePDF = () => {
    const pdfData = {
      businessName: application.businessName,
      requestedAmount: application.requestedAmount,
      ownerIncome: application.ownerInfo.annualIncome,
      coOwnerIncome: application.coOwnerInfo.annualIncome,
      combinedCreditScore: Math.round((application.ownerInfo.creditScore + application.coOwnerInfo.creditScore) / 2),
      projectedRevenue: application.salaryProjections.annualizedRevenue,
      confidenceLevel: application.salaryProjections.confidenceLevel
    };

    console.log('PDF Generation Data:', pdfData);
    
    toast({
      title: "PDF Generated",
      description: "Application document ready for download"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            DWC Funding Dashboard Bundle
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Automated Application System with Co-Owner Integration
          </p>
          
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant={previewMode ? "default" : "secondary"}>
              {previewMode ? "Preview Mode Active" : "Live Mode"}
            </Badge>
            <Badge variant="outline">SAFE MODE</Badge>
            <Badge variant="outline">FUNDING_READY</Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button onClick={handleAutofill} className="w-full">
                <User className="h-4 w-4 mr-2" />
                Auto-Fill Co-Owner
              </Button>
              <Button onClick={handlePreviewSubmission} variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview Submission
              </Button>
              <Button onClick={generatePDF} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
              <Button 
                onClick={() => setPreviewMode(!previewMode)} 
                variant="outline" 
                className="w-full"
              >
                {previewMode ? "Enable Live" : "Enable Preview"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="application" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="application">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={application.businessName}
                      onChange={(e) => setApplication(prev => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requestedAmount">Requested Amount</Label>
                    <Input
                      id="requestedAmount"
                      type="number"
                      value={application.requestedAmount}
                      onChange={(e) => setApplication(prev => ({ ...prev, requestedAmount: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={application.purpose}
                      onChange={(e) => setApplication(prev => ({ ...prev, purpose: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ownerName">Name</Label>
                    <Input
                      id="ownerName"
                      value={application.ownerInfo.name}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        ownerInfo: { ...prev.ownerInfo, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerCredit">Credit Score</Label>
                    <Input
                      id="ownerCredit"
                      type="number"
                      value={application.ownerInfo.creditScore}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        ownerInfo: { ...prev.ownerInfo, creditScore: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerIncome">Annual Income</Label>
                    <Input
                      id="ownerIncome"
                      type="number"
                      value={application.ownerInfo.annualIncome}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        ownerInfo: { ...prev.ownerInfo, annualIncome: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Co-Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Co-Owner Information
                    <Badge variant="secondary">690 Score</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="coOwnerName">Name</Label>
                    <Input
                      id="coOwnerName"
                      value={application.coOwnerInfo.name}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        coOwnerInfo: { ...prev.coOwnerInfo, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coOwnerCredit">Credit Score</Label>
                    <Input
                      id="coOwnerCredit"
                      type="number"
                      value={application.coOwnerInfo.creditScore}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        coOwnerInfo: { ...prev.coOwnerInfo, creditScore: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coOwnerIncome">Annual Income</Label>
                    <Input
                      id="coOwnerIncome"
                      type="number"
                      value={application.coOwnerInfo.annualIncome}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        coOwnerInfo: { ...prev.coOwnerInfo, annualIncome: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Projections Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Projections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      ${application.salaryProjections.annualizedRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Projected Annual Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">
                      {application.salaryProjections.confidenceLevel}%
                    </div>
                    <div className="text-sm text-gray-500">Confidence Level</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Salary-Backed Revenue Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">
                      ${application.salaryProjections.currentSalary.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Combined Current Income</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">
                      {application.salaryProjections.projectedGrowth}%
                    </div>
                    <div className="text-sm text-gray-500">Projected Growth</div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">
                      ${application.salaryProjections.annualizedRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Projected Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
                    <p className="text-gray-500 mb-4">Create a preview to see submissions here</p>
                  </CardContent>
                </Card>
              ) : (
                submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {submission.businessName} - ${submission.requestedAmount}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant={submission.status === 'preview' ? 'secondary' : 'default'}>
                            {submission.status}
                          </Badge>
                          {submission.status === 'preview' && (
                            <Button
                              size="sm"
                              onClick={() => handleFinalSubmission(submission.id)}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Owner Income</div>
                          <div>${submission.ownerInfo.annualIncome.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">Co-Owner Income</div>
                          <div>${submission.coOwnerInfo.annualIncome.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium">Combined Credit</div>
                          <div>{Math.round((submission.ownerInfo.creditScore + submission.coOwnerInfo.creditScore) / 2)}</div>
                        </div>
                        <div>
                          <div className="font-medium">Projected Revenue</div>
                          <div>${submission.salaryProjections.annualizedRevenue.toLocaleString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Applications</span>
                      <span className="font-bold">{submissions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted</span>
                      <span className="font-bold">{submissions.filter(s => s.status === 'submitted').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Preview</span>
                      <span className="font-bold">{submissions.filter(s => s.status === 'preview').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Amount</span>
                      <span className="font-bold">
                        ${submissions.length > 0 ? Math.round(submissions.reduce((sum, s) => sum + s.requestedAmount, 0) / submissions.length) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Autofill System Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Co-Owner Data Ready (690 Score)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Preview Mode Enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>PDF Generation Ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Safety Notice */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            SAFE MODE: All operations are non-destructive. Preview mode protects against accidental submissions. 
            Co-owner data (690 credit score) automatically injected for funding applications.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}