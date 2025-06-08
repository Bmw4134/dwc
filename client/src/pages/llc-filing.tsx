import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  FileText, 
  Clock, 
  DollarSign, 
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';

interface LLCFormData {
  companyName: string;
  state: string;
  businessPurpose: string;
  registeredAgent: string;
  businessAddress: string;
  memberName: string;
  memberAddress: string;
  einRequired: boolean;
  expedited: boolean;
}

export default function LLCFiling() {
  const [formData, setFormData] = useState<LLCFormData>({
    companyName: 'DWC Systems LLC',
    state: 'TX',
    businessPurpose: 'Enterprise automation and AI-powered business solutions',
    registeredAgent: 'CT Corporation System',
    businessAddress: '',
    memberName: '',
    memberAddress: '',
    einRequired: true,
    expedited: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const states = [
    { value: 'TX', label: 'Texas', fee: '$300', time: '15-20 business days' },
    { value: 'DE', label: 'Delaware', fee: '$90', time: '7-10 business days' },
    { value: 'NV', label: 'Nevada', fee: '$425', time: '2-3 weeks' },
    { value: 'FL', label: 'Florida', fee: '$125', time: '5-7 business days' },
    { value: 'WY', label: 'Wyoming', fee: '$100', time: '1-2 weeks' },
    { value: 'CA', label: 'California', fee: '$70', time: '15-20 business days' }
  ];

  const selectedState = states.find(s => s.value === formData.state);

  const calculateTotal = () => {
    const stateFee = parseInt(selectedState?.fee.replace('$', '') || '300');
    const expeditedFee = formData.expedited ? 150 : 0;
    const einFee = formData.einRequired ? 79 : 0;
    const serviceFee = 199;
    
    return stateFee + expeditedFee + einFee + serviceFee;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Submit to authentic LLC filing service
      const response = await fetch('/api/llc/file-formation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalFee: calculateTotal(),
          expeditedProcessing: formData.expedited,
          filingDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        setCurrentStep(4); // Success step
      }
    } catch (error) {
      console.error('LLC filing error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="border-b border-blue-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Building2 className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Instant LLC Formation
            </h1>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              State Authorized
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-orange-500/50 text-orange-400">
              <Zap className="w-4 h-4 mr-1" />
              Express Filing Available
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">LLC Formation Progress</h2>
            <span className="text-blue-400">Step {currentStep} of 4</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  LLC Formation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="bg-slate-700/50 border-slate-600"
                        placeholder="Enter your LLC name"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Name will be verified for availability during filing
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="state">State of Formation</Label>
                      <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label} - {state.fee} ({state.time})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="businessPurpose">Business Purpose</Label>
                      <Textarea
                        id="businessPurpose"
                        value={formData.businessPurpose}
                        onChange={(e) => setFormData({...formData, businessPurpose: e.target.value})}
                        className="bg-slate-700/50 border-slate-600"
                        rows={3}
                        placeholder="Describe your business activities"
                      />
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Business Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessAddress">Business Address</Label>
                      <Input
                        id="businessAddress"
                        value={formData.businessAddress}
                        onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                        className="bg-slate-700/50 border-slate-600"
                        placeholder="123 Business St, City, State 12345"
                      />
                    </div>

                    <div>
                      <Label htmlFor="memberName">Primary Member Name</Label>
                      <Input
                        id="memberName"
                        value={formData.memberName}
                        onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                        className="bg-slate-700/50 border-slate-600"
                        placeholder="Full legal name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="memberAddress">Member Address</Label>
                      <Input
                        id="memberAddress"
                        value={formData.memberAddress}
                        onChange={(e) => setFormData({...formData, memberAddress: e.target.value})}
                        className="bg-slate-700/50 border-slate-600"
                        placeholder="Personal address of member"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Continue to Review
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-blue-400">Review & Submit</h3>
                    
                    <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Company Name:</span>
                        <span className="text-white font-medium">{formData.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">State:</span>
                        <span className="text-white font-medium">{selectedState?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Processing Time:</span>
                        <span className="text-white font-medium">
                          {formData.expedited ? '5-7 business days' : selectedState?.time}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="expedited"
                          checked={formData.expedited}
                          onChange={(e) => setFormData({...formData, expedited: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="expedited">Expedited Processing (+$150)</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="ein"
                          checked={formData.einRequired}
                          onChange={(e) => setFormData({...formData, einRequired: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="ein">EIN (Tax ID) Filing (+$79)</Label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? 'Processing...' : `Submit & Pay $${calculateTotal()}`}
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center space-y-6">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                    <h3 className="text-xl font-semibold text-green-400">LLC Formation Submitted!</h3>
                    <p className="text-slate-300">
                      Your LLC formation documents have been submitted to the {selectedState?.label} Secretary of State.
                      You'll receive confirmation and tracking information via email within 24 hours.
                    </p>
                    <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                      <p className="text-sm text-green-300">
                        Confirmation ID: LLC-{Date.now().toString().slice(-8)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Filing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">State Filing Fee:</span>
                    <span className="text-white">{selectedState?.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Service Fee:</span>
                    <span className="text-white">$199</span>
                  </div>
                  {formData.expedited && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">Expedited Processing:</span>
                      <span className="text-white">$150</span>
                    </div>
                  )}
                  {formData.einRequired && (
                    <div className="flex justify-between">
                      <span className="text-slate-300">EIN Filing:</span>
                      <span className="text-white">$79</span>
                    </div>
                  )}
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total:</span>
                      <span className="text-green-400">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Included Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Articles of Organization filing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Registered Agent service (1 year)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Operating Agreement template</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Filing status updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Compliance monitoring</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  Processing Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Document preparation: 1-2 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>State filing: {formData.expedited ? '5-7 days' : selectedState?.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span>Certificate delivery: 1-2 days after approval</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}