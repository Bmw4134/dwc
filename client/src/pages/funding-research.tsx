import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface FundingSource {
  name: string;
  type: string;
  amount: string;
  requirements: string[];
  timeline: string;
  url: string;
  description: string;
  suitability: number;
}

export default function FundingResearch() {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const { data: fundingSources, isLoading } = useQuery({
    queryKey: ['/api/funding/sources'],
    enabled: false, // We'll trigger this manually
  });

  const startFundingScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate progressive scanning
    const intervals = [
      { progress: 20, message: "Scanning SBA funding programs..." },
      { progress: 40, message: "Researching angel investor networks..." },
      { progress: 60, message: "Analyzing venture capital opportunities..." },
      { progress: 80, message: "Checking crowdfunding platforms..." },
      { progress: 100, message: "Compiling results..." }
    ];

    for (const interval of intervals) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanProgress(interval.progress);
    }

    setIsScanning(false);
  };

  const fundingOpportunities: FundingSource[] = [
    {
      name: "SBA Microloan Program",
      type: "Government Loan",
      amount: "$50,000 - $500,000",
      requirements: ["Credit score 640+", "Business plan", "Personal guarantee"],
      timeline: "30-60 days",
      url: "https://www.sba.gov/funding-programs/loans/microloans",
      description: "Small Business Administration microloans for startups and small businesses",
      suitability: 85
    },
    {
      name: "Texas EDGE Fund",
      type: "State Grant",
      amount: "$25,000 - $250,000",
      requirements: ["Texas-based business", "Tech innovation", "Job creation plan"],
      timeline: "60-90 days",
      url: "https://gov.texas.gov/business/page/texas-economic-development",
      description: "Texas Economic Development and Growth Enterprise fund for tech startups",
      suitability: 90
    },
    {
      name: "Angel Capital Association",
      type: "Angel Investment",
      amount: "$25,000 - $2,000,000",
      requirements: ["Scalable business model", "Strong team", "Market traction"],
      timeline: "90-180 days",
      url: "https://www.angelcapitalassociation.org",
      description: "Network of angel investors focused on early-stage companies",
      suitability: 75
    },
    {
      name: "StartUp Fort Worth",
      type: "Local Accelerator",
      amount: "$50,000 - $150,000",
      requirements: ["Fort Worth location", "Pitch deck", "Working prototype"],
      timeline: "3-6 months",
      url: "https://www.fortworthtexas.gov/departments/economic-development/startup",
      description: "Fort Worth's startup accelerator and funding program",
      suitability: 95
    },
    {
      name: "SCORE Business Mentoring",
      type: "Mentorship + Funding Access",
      amount: "Free mentoring + funding connections",
      requirements: ["Business plan review", "Mentor matching"],
      timeline: "Immediate",
      url: "https://www.score.org",
      description: "Free business mentoring with connections to funding sources",
      suitability: 80
    },
    {
      name: "Kiva Microfunds",
      type: "Crowdfunding",
      amount: "$1,000 - $15,000",
      requirements: ["Community endorsers", "Business story", "0% interest"],
      timeline: "30-45 days",
      url: "https://www.kiva.org/lend/united-states",
      description: "0% interest crowdfunded microloans for small businesses",
      suitability: 70
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          💰 DWC Systems LLC Funding Research Hub
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          Comprehensive funding opportunities to accelerate your AI automation platform
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            🎯 Current Mission: Secure $250K Line of Credit
          </h2>
          <p className="text-slate-700">
            Target: Fort Worth ZIP 76140 | Focus: AI/AGI Business Automation Platform
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 Real-Time Funding Scanner</CardTitle>
            <CardDescription>
              Scan live funding opportunities and grant databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={startFundingScan}
                disabled={isScanning}
                className="w-full"
              >
                {isScanning ? "Scanning..." : "Start Comprehensive Funding Scan"}
              </Button>
              
              {isScanning && (
                <div className="space-y-2">
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-sm text-slate-600 text-center">
                    Scanning funding databases... {scanProgress}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="immediate" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="immediate">Immediate (0-30 days)</TabsTrigger>
          <TabsTrigger value="short">Short-term (1-3 months)</TabsTrigger>
          <TabsTrigger value="medium">Medium-term (3-6 months)</TabsTrigger>
          <TabsTrigger value="strategic">Strategic Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="immediate" className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4">⚡ Immediate Funding Options</h3>
          <div className="grid gap-4">
            {fundingOpportunities
              .filter(f => f.timeline.includes("30") || f.timeline.includes("Immediate"))
              .map((source, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription>{source.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{source.suitability}% Match</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span className="text-green-600 font-semibold">{source.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Timeline:</span>
                        <span>{source.timeline}</span>
                      </div>
                      <div>
                        <span className="font-medium block mb-2">Requirements:</span>
                        <div className="space-x-2">
                          {source.requirements.map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        Apply Now →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="short" className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4">🚀 Short-term Opportunities</h3>
          <div className="grid gap-4">
            {fundingOpportunities
              .filter(f => f.timeline.includes("60") || f.timeline.includes("90"))
              .map((source, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription>{source.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{source.suitability}% Match</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span className="text-green-600 font-semibold">{source.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Timeline:</span>
                        <span>{source.timeline}</span>
                      </div>
                      <div>
                        <span className="font-medium block mb-2">Requirements:</span>
                        <div className="space-x-2">
                          {source.requirements.map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        Learn More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="medium" className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4">📈 Medium-term Growth Capital</h3>
          <Card>
            <CardHeader>
              <CardTitle>Investment Readiness Checklist</CardTitle>
              <CardDescription>Prepare for larger funding rounds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Required Documents:</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li>• Business plan with financial projections</li>
                      <li>• MVP demonstration</li>
                      <li>• Market analysis and TAM</li>
                      <li>• Team bios and expertise</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Metrics:</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li>• Customer acquisition cost</li>
                      <li>• Monthly recurring revenue</li>
                      <li>• Product-market fit evidence</li>
                      <li>• Competitive advantage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategic" className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4">🤝 Strategic Partnership Opportunities</h3>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise AI Partners</CardTitle>
                <CardDescription>Companies that could benefit from your automation platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Microsoft for Startups</h4>
                    <p className="text-sm text-slate-600">Up to $150k in Azure credits + technical support</p>
                    <Button size="sm" className="mt-2" onClick={() => window.open('https://startups.microsoft.com', '_blank')}>
                      Apply →
                    </Button>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold">Google Cloud for Startups</h4>
                    <p className="text-sm text-slate-600">Up to $200k in cloud credits + AI/ML resources</p>
                    <Button size="sm" className="mt-2" onClick={() => window.open('https://cloud.google.com/startup', '_blank')}>
                      Apply →
                    </Button>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold">AWS Activate</h4>
                    <p className="text-sm text-slate-600">Up to $100k in AWS credits + technical support</p>
                    <Button size="sm" className="mt-2" onClick={() => window.open('https://aws.amazon.com/activate', '_blank')}>
                      Apply →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800">⚠️ Risk Mitigation Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-amber-700">
            <p><strong>Gmail vs Company Systems:</strong> Consider Google Workspace Business for legal protection</p>
            <p><strong>IP Protection:</strong> Keep personal projects on personal infrastructure</p>
            <p><strong>Data Separation:</strong> Ensure no proprietary company data is used in your platform</p>
            <p><strong>Timeline:</strong> Focus on immediate funding to enable full-time transition</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}