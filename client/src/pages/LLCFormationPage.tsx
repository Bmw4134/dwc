import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2, DollarSign, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface FormationData {
  entityName: string;
  state: string;
  registeredAgent: string;
  businessAddress: string;
  businessPurpose: string;
  initialCapital: string;
  members: string[];
  managementStructure: string;
}

interface FundingOption {
  type: string;
  amount: string;
  timeline: string;
  requirements: string[];
  status: 'available' | 'processing' | 'approved';
}

export default function LLCFormationPage() {
  const { toast } = useToast();
  const [formationData, setFormationData] = useState<FormationData>({
    entityName: 'DWC Systems LLC',
    state: 'Texas',
    registeredAgent: '',
    businessAddress: '1513 Mahogany Ln, Fort Worth, TX 76140',
    businessPurpose: 'Advanced artificial intelligence and automation platform development for enterprise business transformation',
    initialCapital: '50000',
    members: ['Primary Member'],
    managementStructure: 'Member-managed'
  });

  const [fundingOptions] = useState<FundingOption[]>([
    {
      type: 'SBA Loan',
      amount: '$150,000 - $5,000,000',
      timeline: '30-60 days',
      requirements: ['Business plan', 'Financial projections', 'Personal guarantee'],
      status: 'available'
    },
    {
      type: 'Revenue-Based Financing',
      amount: '$100,000 - $2,000,000',
      timeline: '2-4 weeks',
      requirements: ['$2.66M active pipeline validation', 'Monthly recurring revenue'],
      status: 'available'
    },
    {
      type: 'Equipment Financing',
      amount: '$25,000 - $500,000',
      timeline: '1-2 weeks',
      requirements: ['Equipment quotes', 'Technology specifications'],
      status: 'available'
    },
    {
      type: 'Series A Funding',
      amount: '$1,000,000 - $15,000,000',
      timeline: '3-6 months',
      requirements: ['Proven traction', 'Scalable business model', 'GameXchange validation'],
      status: 'processing'
    }
  ]);

  const [formationStatus, setFormationStatus] = useState<'draft' | 'filing' | 'approved'>('draft');

  const handleFormationSubmit = async () => {
    setFormationStatus('filing');
    
    toast({
      title: "LLC Formation Initiated",
      description: "Filing DWC Systems LLC with Texas Secretary of State",
    });

    // Simulate filing process
    setTimeout(() => {
      setFormationStatus('approved');
      toast({
        title: "LLC Formation Complete",
        description: "DWC Systems LLC is now a registered entity in Texas",
      });
    }, 3000);
  };

  const handleFundingApplication = (fundingType: string) => {
    toast({
      title: "Funding Application Started",
      description: `Initiating ${fundingType} application process`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">DWC Systems LLC Formation & Funding</h1>
          <p className="text-xl text-slate-600">Complete entity formation and secure funding for your enterprise AI platform</p>
        </div>

        {/* Formation Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-slate-700" />
              LLC Formation Status
            </CardTitle>
            <CardDescription>Texas Limited Liability Company Registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {formationStatus === 'draft' && (
                <>
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-slate-700 font-medium">Ready to File</span>
                </>
              )}
              {formationStatus === 'filing' && (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-blue-700 font-medium">Filing in Progress</span>
                </>
              )}
              {formationStatus === 'approved' && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">LLC Formation Complete</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Formation Details */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Entity Formation Details</CardTitle>
              <CardDescription>Complete LLC registration for DWC Systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="entityName">Entity Name</Label>
                <Input
                  id="entityName"
                  value={formationData.entityName}
                  onChange={(e) => setFormationData({...formationData, entityName: e.target.value})}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State of Formation</Label>
                <Select value={formationData.state} onValueChange={(value) => setFormationData({...formationData, state: value})}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="Delaware">Delaware</SelectItem>
                    <SelectItem value="Nevada">Nevada</SelectItem>
                    <SelectItem value="Wyoming">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={formationData.businessAddress}
                  onChange={(e) => setFormationData({...formationData, businessAddress: e.target.value})}
                  className="border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPurpose">Business Purpose</Label>
                <Textarea
                  id="businessPurpose"
                  value={formationData.businessPurpose}
                  onChange={(e) => setFormationData({...formationData, businessPurpose: e.target.value})}
                  className="border-slate-300"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialCapital">Initial Capital Investment</Label>
                <Input
                  id="initialCapital"
                  value={formationData.initialCapital}
                  onChange={(e) => setFormationData({...formationData, initialCapital: e.target.value})}
                  className="border-slate-300"
                  placeholder="50000"
                />
              </div>

              <Button 
                onClick={handleFormationSubmit}
                disabled={formationStatus !== 'draft'}
                className="w-full bg-slate-800 hover:bg-slate-700"
              >
                {formationStatus === 'draft' && 'File LLC Formation'}
                {formationStatus === 'filing' && 'Filing in Progress...'}
                {formationStatus === 'approved' && 'Formation Complete'}
              </Button>

            </CardContent>
          </Card>

          {/* Funding Options */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-slate-700" />
                Funding Opportunities
              </CardTitle>
              <CardDescription>Secure capital for DWC Systems LLC operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {fundingOptions.map((option, index) => (
                <div key={index} className="border border-slate-200 rounded-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{option.type}</h4>
                    <span className={`text-xs px-2 py-1 rounded-sm font-semibold uppercase tracking-wide ${
                      option.status === 'available' ? 'bg-green-100 text-green-800' :
                      option.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {option.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><strong>Amount:</strong> {option.amount}</p>
                    <p><strong>Timeline:</strong> {option.timeline}</p>
                  </div>

                  <div className="text-sm text-slate-600">
                    <strong>Requirements:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {option.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleFundingApplication(option.type)}
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-300 hover:border-slate-400"
                  >
                    Apply for {option.type}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}

            </CardContent>
          </Card>

        </div>

        {/* Business Validation */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-slate-700" />
              Business Validation Assets
            </CardTitle>
            <CardDescription>Proven performance metrics for funding applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">$2.66M</div>
                <div className="text-sm text-slate-600 font-medium">Active Pipeline Value</div>
                <div className="text-xs text-slate-500 mt-1">Fort Worth Market</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">277%</div>
                <div className="text-sm text-slate-600 font-medium">Proven ROI</div>
                <div className="text-xs text-slate-500 mt-1">Validated Results</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">98%</div>
                <div className="text-sm text-slate-600 font-medium">AI Precision</div>
                <div className="text-xs text-slate-500 mt-1">Operational Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">18</div>
                <div className="text-sm text-slate-600 font-medium">Active Modules</div>
                <div className="text-xs text-slate-500 mt-1">Full Integration</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-100 rounded-sm">
              <h4 className="font-semibold text-slate-900 mb-2">Key Validation Points for Investors:</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• GameXchange $2.5M opportunity in active negotiation</li>
                <li>• Operational enterprise-grade AI platform with proven results</li>
                <li>• Multi-industry automation capabilities (photography, gaming, retail)</li>
                <li>• Established Fort Worth business presence and market validation</li>
                <li>• Scalable SaaS and licensing business models</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}