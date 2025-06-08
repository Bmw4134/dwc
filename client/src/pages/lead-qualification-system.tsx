import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LeadData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  yearsInBusiness: number;
  currentRevenue: string;
  targetRevenue: string;
  primaryChallenges: string;
  currentMarketingMethods: string;
  websiteUrl: string;
  socialMediaPresence: string;
  geographicLocation: string;
  targetClientType: string;
  budgetRange: string;
  timelineExpectation: string;
  referralSource: string;
}

interface QualificationResult {
  score: number;
  tier: string;
  recommendations: string[];
  potentialRevenue: string;
  consultationPlan: string;
  nextSteps: string[];
}

export default function LeadQualificationSystem() {
  const { toast } = useToast();
  const [leadData, setLeadData] = useState<LeadData>({
    businessName: "Kate's Photography Studio",
    ownerName: "Kate Smith",
    email: "kate@photography.com",
    phone: "(555) 123-4567",
    businessType: "Photography Studio",
    yearsInBusiness: 3,
    currentRevenue: "$45,000",
    targetRevenue: "$85,000",
    primaryChallenges: "Inconsistent lead generation, manual booking process, no client retention system, pricing challenges, social media management taking too much time",
    currentMarketingMethods: "Instagram posts, word of mouth referrals, local networking events, occasional Facebook ads",
    websiteUrl: "www.katesphotography.com",
    socialMediaPresence: "Instagram: 2.5K followers, Facebook business page",
    geographicLocation: "Austin, TX",
    targetClientType: "Wedding photography, family portraits, corporate headshots",
    budgetRange: "$3,000-6,000",
    timelineExpectation: "4-6 months",
    referralSource: "Coworker Pro Bono"
  });

  const [qualificationResult, setQualificationResult] = useState<QualificationResult | null>(null);

  const qualifyLeadMutation = useMutation({
    mutationFn: async (data: LeadData) => {
      const response = await apiRequest("/api/qualify-lead", "POST", data);
      return response;
    },
    onSuccess: (result: QualificationResult) => {
      setQualificationResult(result);
      toast({
        title: "Lead Qualified Successfully",
        description: `Business tier: ${result.tier} with ${result.score}% qualification score`,
      });
    },
    onError: () => {
      toast({
        title: "Qualification Failed",
        description: "Unable to process lead qualification",
        variant: "destructive",
      });
    },
  });

  const { data: existingLeads } = useQuery({
    queryKey: ["/api/qualified-leads"],
  });

  const handleInputChange = (field: keyof LeadData, value: string | number) => {
    setLeadData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    qualifyLeadMutation.mutate(leadData);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium": return "bg-green-100 text-green-800";
      case "Standard": return "bg-blue-100 text-blue-800";
      case "Basic": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Lead Qualification System
          </h1>
          <p className="text-gray-600 text-lg">
            Photography Business Consultation Pipeline
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lead Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name</label>
                  <Input
                    value={leadData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Kate's Photography Studio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Owner Name</label>
                  <Input
                    value={leadData.ownerName}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    placeholder="Kate Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={leadData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="kate@photography.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={leadData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Years in Business</label>
                  <Input
                    type="number"
                    value={leadData.yearsInBusiness}
                    onChange={(e) => handleInputChange("yearsInBusiness", parseInt(e.target.value) || 0)}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Geographic Location</label>
                  <Input
                    value={leadData.geographicLocation}
                    onChange={(e) => handleInputChange("geographicLocation", e.target.value)}
                    placeholder="Austin, TX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Revenue</label>
                  <Input
                    value={leadData.currentRevenue}
                    onChange={(e) => handleInputChange("currentRevenue", e.target.value)}
                    placeholder="$50,000/year"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Revenue</label>
                  <Input
                    value={leadData.targetRevenue}
                    onChange={(e) => handleInputChange("targetRevenue", e.target.value)}
                    placeholder="$100,000/year"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Primary Business Challenges</label>
                <Textarea
                  value={leadData.primaryChallenges}
                  onChange={(e) => handleInputChange("primaryChallenges", e.target.value)}
                  placeholder="Lead generation, pricing strategy, client retention..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Marketing Methods</label>
                <Textarea
                  value={leadData.currentMarketingMethods}
                  onChange={(e) => handleInputChange("currentMarketingMethods", e.target.value)}
                  placeholder="Instagram, word of mouth, local networking..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Budget Range</label>
                  <Input
                    value={leadData.budgetRange}
                    onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                    placeholder="$2,000-5,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Timeline</label>
                  <Input
                    value={leadData.timelineExpectation}
                    onChange={(e) => handleInputChange("timelineExpectation", e.target.value)}
                    placeholder="3-6 months"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={qualifyLeadMutation.isPending}
              >
                {qualifyLeadMutation.isPending ? "Analyzing..." : "Qualify Lead"}
              </Button>
            </CardContent>
          </Card>

          {/* Qualification Results */}
          <div className="space-y-6">
            {qualificationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    📊 Qualification Results
                    <Badge className={getTierColor(qualificationResult.tier)}>
                      {qualificationResult.tier} Tier
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-blue-600">
                      {qualificationResult.score}%
                    </div>
                    <div>
                      <p className="font-medium">Qualification Score</p>
                      <p className="text-sm text-gray-600">Revenue Potential: {qualificationResult.potentialRevenue}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Consultation Plan</h4>
                    <p className="text-sm text-gray-700">{qualificationResult.consultationPlan}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {qualificationResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {qualificationResult.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Leads */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Lead Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                {existingLeads && existingLeads.length > 0 ? (
                  <div className="space-y-3">
                    {existingLeads.map((lead: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{lead.businessName}</h4>
                            <p className="text-sm text-gray-600">{lead.ownerName}</p>
                          </div>
                          <Badge className={getTierColor(lead.tier)}>
                            {lead.tier}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          Score: {lead.score}% | Revenue: {lead.potentialRevenue}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No qualified leads yet. Start by qualifying your first photography business!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}