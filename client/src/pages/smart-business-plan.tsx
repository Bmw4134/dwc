import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle,
  Calendar,
  BarChart3,
  Building2,
  Camera,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartBusinessPlan() {
  const [activeSection, setActiveSection] = useState('smart');

  const smartGoals = {
    specific: {
      title: "Specific",
      description: "Clear, well-defined objectives with precise outcomes",
      goals: [
        "Launch DWC Systems LLC as AI-powered business automation consultancy",
        "Deploy Pokemon card market intelligence platform for immediate revenue",
        "Scale Kate's photography business automation to $15K/month",
        "Secure 5 enterprise consulting clients in Texas healthcare/automotive sectors",
        "Establish voice-activated lead research platform for mobile professionals"
      ]
    },
    measurable: {
      title: "Measurable",
      description: "Quantifiable metrics with clear success indicators",
      metrics: [
        { metric: "Pokemon Revenue", target: "$2,730", timeframe: "Month 1", status: "Ready" },
        { metric: "Kate's Photography", target: "$15,000/month", timeframe: "Month 6", status: "In Progress" },
        { metric: "Consulting Clients", target: "5 active", timeframe: "Month 3", status: "Pipeline" },
        { metric: "Platform Users", target: "100 businesses", timeframe: "Month 12", status: "Planned" },
        { metric: "Revenue Growth", target: "$50K/month", timeframe: "Month 12", status: "Target" }
      ]
    },
    achievable: {
      title: "Achievable",
      description: "Realistic goals based on current capabilities and market conditions",
      evidence: [
        "91 Pokemon cards ready for immediate analysis and sale",
        "Existing photography client base for Kate's business expansion",
        "Proven AI platform with enterprise-grade mobile responsiveness",
        "Identified target market: Texas Health Hugley Hospital, Superstar Car Wash",
        "Full-time commitment from primary founder with 2+ weeks development investment"
      ]
    },
    relevant: {
      title: "Relevant",
      description: "Aligned with market needs and business objectives",
      alignment: [
        "Business automation demand growing 40% annually in SMB market",
        "Mobile-first AI solutions addressing real pain points",
        "Photography industry digitization creating automation opportunities",
        "Trading card market reaching $6B+ with technology gaps",
        "Texas business market underserved in AI consulting space"
      ]
    },
    timebound: {
      title: "Time-bound",
      description: "Clear deadlines and milestone schedules",
      timeline: [
        { phase: "Launch Phase", duration: "Month 1", deliverables: "LLC formation, Pokemon revenue, first client" },
        { phase: "Growth Phase", duration: "Months 2-6", deliverables: "Kate's $15K/month, 3 consulting clients" },
        { phase: "Scale Phase", duration: "Months 7-12", deliverables: "5 clients, $50K/month revenue" },
        { phase: "Expansion", duration: "Year 2", deliverables: "Regional presence, $100K/month" }
      ]
    }
  };

  const targetMarket = {
    primary: {
      segment: "Small-Medium Businesses (10-500 employees)",
      size: "$280B market in Texas",
      painPoints: [
        "Manual processes costing 20-40% productivity loss",
        "Limited AI adoption due to complexity and cost",
        "Mobile workforce needs hands-free solutions",
        "Data entry and lead management inefficiencies"
      ],
      value: "$5,000-$25,000 annual savings per client"
    },
    secondary: {
      segment: "Photography/Creative Professionals",
      size: "$15B market nationwide",
      painPoints: [
        "Time-intensive client management and booking",
        "Manual photo organization and delivery",
        "Limited marketing automation capabilities",
        "Revenue optimization challenges"
      ],
      value: "300-500% ROI through automation"
    },
    immediate: {
      segment: "Trading Card Collectors/Dealers",
      size: "$6B market opportunity",
      painPoints: [
        "Manual card identification and valuation",
        "Time-intensive market research",
        "Pricing accuracy and speed challenges",
        "Bulk inventory management"
      ],
      value: "80% time savings, 15-25% revenue increase"
    }
  };

  const competitiveAdvantage = [
    {
      advantage: "Multi-AI Integration",
      description: "Claude Sonnet 4.0 + OpenAI GPT-4o + Perplexity real-time data",
      competition: "Single-model solutions with limited capabilities"
    },
    {
      advantage: "Mobile-First Design",
      description: "iPhone-native experience with voice activation",
      competition: "Desktop-focused tools requiring laptop/computer"
    },
    {
      advantage: "Industry-Specific Solutions",
      description: "Pre-built workflows for photography, healthcare, automotive",
      competition: "Generic automation requiring extensive customization"
    },
    {
      advantage: "Immediate Revenue Proof",
      description: "Pokemon card platform demonstrating instant ROI",
      competition: "Theoretical benefits without proven results"
    },
    {
      advantage: "Texas Market Focus",
      description: "Local presence with identified target clients",
      competition: "National companies without local expertise"
    }
  ];

  const financialProjections = {
    year1: {
      q1: { revenue: 8500, expenses: 3000, profit: 5500 },
      q2: { revenue: 25000, expenses: 8000, profit: 17000 },
      q3: { revenue: 45000, expenses: 15000, profit: 30000 },
      q4: { revenue: 65000, expenses: 22000, profit: 43000 }
    },
    collateral: [
      "Personal residence equity: $75,000 available",
      "Vehicle assets: $35,000 combined value",
      "Existing business equipment and tools: $15,000",
      "Pokemon card collection (verified): $8,500+ current value",
      "Personal guarantee with full-time business commitment"
    ],
    roi: [
      { investor: "Angel/Family", amount: "$25,000", roi: "200% by month 12", timeline: "8-10 months" },
      { investor: "SBA Loan", amount: "$50,000", roi: "Business cash flow", timeline: "6-8 months positive" },
      { investor: "Revenue-Based", amount: "$15,000", roi: "15% monthly revenue share", timeline: "Immediate" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            DWC Systems LLC: S.M.A.R.T. Business Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Comprehensive business strategy addressing Specific, Measurable, Achievable, 
            Relevant, and Time-bound objectives with detailed market analysis and ROI projections
          </p>
          
          <div className="flex justify-center gap-4">
            <Badge className="bg-green-500/20 text-green-600 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Investment Ready
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-600 px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              S.M.A.R.T. Validated
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-600 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              ROI Proven
            </Badge>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            {[
              { id: 'smart', label: 'S.M.A.R.T. Goals' },
              { id: 'market', label: 'Target Market' },
              { id: 'competitive', label: 'Why Choose Us' },
              { id: 'financial', label: 'ROI & Collateral' }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeSection === tab.id ? "default" : "ghost"}
                onClick={() => setActiveSection(tab.id)}
                className="transition-all duration-200"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          
          {activeSection === 'smart' && (
            <div className="space-y-8">
              {Object.entries(smartGoals).map(([key, section]) => (
                <Card key={key} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-blue-500" />
                      {section.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    {key === 'measurable' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.metrics.map((metric, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{metric.metric}</span>
                              <Badge className="text-xs">{metric.status}</Badge>
                            </div>
                            <div className="text-2xl font-bold text-green-600">{metric.target}</div>
                            <div className="text-sm text-gray-500">{metric.timeframe}</div>
                          </div>
                        ))}
                      </div>
                    ) : key === 'timebound' ? (
                      <div className="space-y-4">
                        {section.timeline.map((phase, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Calendar className="h-6 w-6 text-blue-500" />
                            <div className="flex-1">
                              <div className="font-medium">{phase.phase}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{phase.deliverables}</div>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-600">{phase.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {(section.goals || section.evidence || section.alignment).map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === 'market' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Object.entries(targetMarket).map(([key, market]) => (
                <Card key={key} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-purple-500" />
                      {market.segment}
                    </CardTitle>
                    <p className="text-lg font-semibold text-green-600">{market.size}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Pain Points:</h4>
                      <ul className="space-y-2">
                        {market.painPoints.map((pain, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {pain}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-green-600">Value Proposition:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{market.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === 'competitive' && (
            <div className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    Why Choose DWC Systems Over Competitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {competitiveAdvantage.map((advantage, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h3 className="font-semibold text-lg text-blue-600 mb-2">{advantage.advantage}</h3>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <strong>Our Solution:</strong> {advantage.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Competition:</strong> {advantage.competition}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'financial' && (
            <div className="space-y-8">
              
              {/* ROI Timeline */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                    Anticipated ROI Timeline for Investors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {financialProjections.roi.map((investment, index) => (
                      <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="text-lg font-semibold text-green-700 dark:text-green-400">{investment.investor}</div>
                        <div className="text-2xl font-bold text-green-600">{investment.amount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          <div><strong>ROI:</strong> {investment.roi}</div>
                          <div><strong>Timeline:</strong> {investment.timeline}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Collateral */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-500" />
                    Collateral Available to Secure Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {financialProjections.collateral.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-semibold mb-2">Total Collateral Value: $133,500+</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Demonstrates commitment and provides security for investors. 
                      Full-time business dedication with personal assets backing the venture.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Projections */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    Year 1 Revenue Projections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(financialProjections.year1).map(([quarter, data]) => (
                      <div key={quarter} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600 mb-2">{quarter.toUpperCase()}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Revenue:</span>
                            <span className="font-medium text-green-600">${data.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Expenses:</span>
                            <span className="font-medium text-red-600">${data.expenses.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Profit:</span>
                            <span className="font-bold text-green-600">${data.profit.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      Year 1 Total Profit: $95,500
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Conservative projections based on current platform capabilities and identified market opportunities
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Action Section */}
        <div className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ready to Launch Tomorrow</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Full-time commitment secured. Platform operational. Target clients identified. 
            Immediate revenue streams ready. All S.M.A.R.T. criteria validated with substantial collateral backing.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              <DollarSign className="h-5 w-5 mr-2" />
              Request Funding Meeting
            </Button>
            <Button variant="outline" className="px-8 py-3">
              <BarChart3 className="h-5 w-5 mr-2" />
              Download Full Business Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}