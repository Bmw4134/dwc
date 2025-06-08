import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function ProfessionalRoadmap() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");

  const roadmapData = {
    Q1: {
      title: "Foundation & MVP Launch",
      timeline: "January - March 2025",
      progress: 75,
      milestones: [
        { title: "LLC Formation & Legal Structure", status: "in-progress", impact: "High" },
        { title: "Quantum AGI Core Development", status: "completed", impact: "Critical" },
        { title: "Initial Client Acquisition (5 clients)", status: "in-progress", impact: "High" },
        { title: "Fort Worth Market Analysis Complete", status: "completed", impact: "Medium" },
        { title: "$50K Initial Funding Secured", status: "pending", impact: "Critical" }
      ],
      revenue: "$25,000 - $50,000",
      focus: "Establishing foundation and proving concept"
    },
    Q2: {
      title: "Market Expansion & Scaling",
      timeline: "April - June 2025",
      progress: 25,
      milestones: [
        { title: "Expand to 25 active clients", status: "planned", impact: "High" },
        { title: "Series A Funding Round ($250K)", status: "planned", impact: "Critical" },
        { title: "Team Expansion (5 employees)", status: "planned", impact: "High" },
        { title: "Advanced AI Automation Suite", status: "planned", impact: "High" },
        { title: "Strategic Partnerships", status: "planned", impact: "Medium" }
      ],
      revenue: "$100,000 - $200,000",
      focus: "Scaling operations and client base"
    },
    Q3: {
      title: "Technology Leadership & Innovation",
      timeline: "July - September 2025",
      progress: 10,
      milestones: [
        { title: "Proprietary AI Models Deployment", status: "planned", impact: "Critical" },
        { title: "100+ Client Milestone", status: "planned", impact: "High" },
        { title: "Industry Recognition & Awards", status: "planned", impact: "Medium" },
        { title: "Advanced Analytics Platform", status: "planned", impact: "High" },
        { title: "Intellectual Property Portfolio", status: "planned", impact: "High" }
      ],
      revenue: "$300,000 - $500,000",
      focus: "Technology leadership and market dominance"
    },
    Q4: {
      title: "Market Dominance & Expansion",
      timeline: "October - December 2025",
      progress: 5,
      milestones: [
        { title: "Regional Market Expansion (Texas)", status: "planned", impact: "Critical" },
        { title: "$1M ARR Achievement", status: "planned", impact: "Critical" },
        { title: "Enterprise Client Acquisition", status: "planned", impact: "High" },
        { title: "Series B Preparation", status: "planned", impact: "High" },
        { title: "Industry Disruption Recognition", status: "planned", impact: "Medium" }
      ],
      revenue: "$750,000 - $1,000,000",
      focus: "Market leadership and preparation for national expansion"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "planned": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            DWC Systems LLC Strategic Roadmap
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Brett Michael Watson & Christina Carolynn Dion
          </p>
          <p className="text-lg text-slate-500">
            Elite AI Automation Platform - Fort Worth, TX 76140
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                Revolutionize business automation through quantum-powered AI solutions, 
                enabling companies to achieve unprecedented efficiency and growth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">
                Become the leading AI automation platform that transforms how 
                businesses operate, making advanced AI accessible to organizations of all sizes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Target</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Achieve $1M ARR by Q4 2025 while securing $250K line of credit 
                to accelerate growth and market expansion.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={selectedQuarter} onValueChange={setSelectedQuarter} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="Q1">Q1 2025</TabsTrigger>
          <TabsTrigger value="Q2">Q2 2025</TabsTrigger>
          <TabsTrigger value="Q3">Q3 2025</TabsTrigger>
          <TabsTrigger value="Q4">Q4 2025</TabsTrigger>
        </TabsList>

        {Object.entries(roadmapData).map(([quarter, data]) => (
          <TabsContent key={quarter} value={quarter}>
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{data.title}</CardTitle>
                      <CardDescription className="text-lg">{data.timeline}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{data.revenue}</div>
                      <div className="text-sm text-slate-500">Projected Revenue</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-slate-500">{data.progress}%</span>
                    </div>
                    <Progress value={data.progress} className="h-3" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-6">{data.focus}</p>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Key Milestones</h4>
                    {data.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex-1">
                          <h5 className="font-medium">{milestone.title}</h5>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getImpactColor(milestone.impact)}>
                            {milestone.impact}
                          </Badge>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Projections</CardTitle>
            <CardDescription>Revenue and funding milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Q1 2025 Revenue</span>
                <span className="font-semibold">$25K - $50K</span>
              </div>
              <div className="flex justify-between">
                <span>Q2 2025 Revenue</span>
                <span className="font-semibold">$100K - $200K</span>
              </div>
              <div className="flex justify-between">
                <span>Q3 2025 Revenue</span>
                <span className="font-semibold">$300K - $500K</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Q4 2025 Target</span>
                <span className="font-bold text-green-600">$1M ARR</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Client Acquisition</span>
                <span className="font-semibold">100+ by Q3</span>
              </div>
              <div className="flex justify-between">
                <span>Market Penetration</span>
                <span className="font-semibold">Fort Worth → Texas</span>
              </div>
              <div className="flex justify-between">
                <span>Team Growth</span>
                <span className="font-semibold">2 → 15 employees</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Funding Secured</span>
                <span className="font-bold text-green-600">$250K+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-blue-700">
            <p>
              <strong>DWC Systems LLC</strong> represents a paradigm shift in business automation, 
              founded by industry veterans Brett Michael Watson and Christina Carolynn Dion. 
              Our quantum-powered AI platform addresses the critical gap in accessible, 
              intelligent automation solutions for businesses of all sizes.
            </p>
            <p>
              With our proven MVP and initial client traction in Fort Worth (ZIP 76140), 
              we are positioned to capture significant market share in the rapidly growing 
              business automation sector, projected to reach $19.6 billion by 2026.
            </p>
            <p>
              Our strategic roadmap outlines a clear path to $1M ARR within 12 months, 
              supported by strong financial projections and a comprehensive growth strategy 
              that leverages cutting-edge AI technology and proven business methodologies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}