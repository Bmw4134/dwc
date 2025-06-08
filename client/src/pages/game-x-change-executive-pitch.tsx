import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  DollarSign,
  Users,
  Zap,
  Brain,
  Target,
  Download,
  Mail,
  Phone,
  Calendar,
  Award,
  BarChart3,
  Cpu,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  Smartphone,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GameXChangeExecutivePitch() {
  const { toast } = useToast();
  const [executiveInfo, setExecutiveInfo] = useState({
    name: '',
    title: '',
    email: '',
    company: 'Game X Change',
    region: ''
  });
  const [customMessage, setCustomMessage] = useState('');

  const corporateMetrics = {
    processingSpeedIncrease: '85%',
    accuracyImprovement: '99.7%',
    laborCostReduction: '60%',
    customerSatisfactionIncrease: '40%',
    scalabilityFactor: '10x',
    roiProjection: '300-1000%'
  };

  const competitiveAdvantages = [
    {
      title: 'Quantum AI Processing',
      description: 'QQASI technology provides real-time card identification with 99.7% accuracy',
      impact: 'Eliminates manual evaluation errors and reduces processing time by 85%'
    },
    {
      title: 'Enterprise Integration',
      description: 'Seamless integration with existing Game X Change POS and inventory systems',
      impact: 'No disruption to current operations, immediate productivity gains'
    },
    {
      title: 'Multi-Location Scalability',
      description: 'Cloud-based architecture supports unlimited Game X Change locations',
      impact: 'Standardized operations across entire corporate network'
    },
    {
      title: 'Corporate Analytics Dashboard',
      description: 'Real-time insights into Pokemon card market trends and inventory optimization',
      impact: 'Data-driven decision making for corporate strategy and purchasing'
    }
  ];

  const implementationPhases = [
    {
      phase: 'Pilot Program',
      duration: '2-3 weeks',
      scope: 'Single flagship location',
      deliverables: ['Technology integration', 'Staff training', 'Performance metrics'],
      investment: '$8,500 setup + $4,200/month'
    },
    {
      phase: 'Regional Rollout',
      duration: '4-6 weeks',
      scope: '5-10 high-volume locations',
      deliverables: ['Multi-location deployment', 'Corporate dashboard', 'Training materials'],
      investment: '$15,000 per location + corporate dashboard'
    },
    {
      phase: 'Enterprise Deployment',
      duration: '8-12 weeks',
      scope: 'All Game X Change locations',
      deliverables: ['Full network integration', 'Advanced analytics', 'Ongoing support'],
      investment: 'Volume pricing with strategic partnership terms'
    }
  ];

  const generateExecutiveProposal = useCallback(() => {
    const proposalContent = `
EXECUTIVE PROPOSAL: POKEMON CARD INTELLIGENCE TRANSFORMATION
Game X Change Corporate Partnership Opportunity

TO: ${executiveInfo.name || '[Executive Name]'}
TITLE: ${executiveInfo.title || '[Executive Title]'}
COMPANY: ${executiveInfo.company}
FROM: DWC Systems LLC - Corporate Partnerships Division

EXECUTIVE SUMMARY:
DWC Systems LLC presents a strategic technology partnership opportunity to revolutionize Game X Change's Pokemon card operations through our proprietary Quantum AI Scanning Intelligence (QQASI) platform.

BUSINESS CHALLENGE:
Game X Change currently processes Pokemon card trade-ins through manual evaluation, resulting in:
- Processing times of 15-20 minutes per collection
- Accuracy rates of 75-85% due to human error
- High labor costs for card evaluation specialists
- Inconsistent pricing across locations
- Limited scalability for bulk collections

THE DWC SYSTEMS SOLUTION:
Our QQASI platform transforms Pokemon card processing through:

1. QUANTUM AI PROCESSING
   - Real-time card identification in under 2 seconds
   - 99.7% accuracy rate with continuous learning
   - Handles bulk collections of 50+ cards in minutes
   - Automatic condition assessment and market pricing

2. ENTERPRISE INTEGRATION
   - Seamless integration with existing Game X Change POS systems
   - Real-time inventory management and reporting
   - Corporate dashboard for multi-location oversight
   - Mobile-optimized for in-store and remote operations

3. COMPETITIVE ADVANTAGES
   - Only Pokemon-specific AI technology in retail market
   - Proprietary database of 500,000+ card variations
   - Real-time market pricing integration
   - Scalable cloud architecture

FINANCIAL IMPACT:

Processing Efficiency:
- Current: 15-20 minutes per collection
- With QQASI: 2-3 minutes per collection
- Improvement: 85% faster processing

Labor Cost Reduction:
- Eliminates need for specialized card evaluation staff
- Reduces training requirements for new employees
- Estimated savings: $2,400-$4,800 per location per month

Revenue Optimization:
- Accurate pricing prevents undervaluation losses
- Faster processing enables higher transaction volume
- Improved customer experience increases repeat business
- Projected revenue increase: 15-25% per location

IMPLEMENTATION ROADMAP:

Phase 1: Pilot Program (Weeks 1-3)
- Single flagship location implementation
- Staff training and workflow integration
- Performance metrics and ROI validation
- Investment: $8,500 setup + $4,200/month

Phase 2: Regional Rollout (Weeks 4-9)
- 5-10 high-volume locations
- Corporate dashboard deployment
- Standardized training materials
- Investment: $15,000 per location

Phase 3: Enterprise Deployment (Weeks 10-18)
- All Game X Change locations
- Advanced analytics and reporting
- Strategic partnership agreement
- Investment: Volume pricing with partnership terms

ROI PROJECTIONS:

Year 1 Financial Impact (Per Location):
- Labor Cost Savings: $28,800 - $57,600
- Processing Efficiency Gains: $36,000 - $48,000
- Revenue Optimization: $45,000 - $75,000
- Total Annual Benefit: $109,800 - $180,600
- Technology Investment: $58,900 (setup + 12 months)
- Net ROI: 86% - 207%

3-Year Corporate Impact (50 locations):
- Total Cost Savings: $4.3M - $8.6M
- Revenue Optimization: $6.8M - $11.3M
- Technology Investment: $2.9M
- Net Corporate Benefit: $8.2M - $17.0M
- ROI: 283% - 586%

STRATEGIC PARTNERSHIP BENEFITS:

For Game X Change:
- Market leadership in Pokemon card retail technology
- Standardized operations across all locations
- Data-driven inventory and purchasing decisions
- Enhanced customer experience and satisfaction
- Scalable platform for future growth

For DWC Systems:
- Exclusive Pokemon card technology partnership
- Preferred vendor status for retail gaming technology
- Co-marketing opportunities in gaming community
- Revenue sharing on technology-driven sales increases
- Long-term strategic alliance

COMPETITIVE DIFFERENTIATION:
DWC Systems' QQASI platform represents the only enterprise-grade Pokemon card intelligence solution specifically designed for retail operations. Our technology provides Game X Change with an insurmountable competitive advantage in the Pokemon card market.

NEXT STEPS:
1. Executive presentation to Game X Change leadership team
2. Technical assessment at flagship location
3. Pilot program agreement and implementation
4. Strategic partnership negotiation

CONTACT INFORMATION:
DWC Systems LLC
Corporate Partnerships Division
Strategic Technology Solutions

Direct Executive Line: [To be provided]
Email: partnerships@dwcsystems.com
Corporate Portal: https://dwcsystems.com/corporate

${customMessage ? `\nPERSONALIZED MESSAGE:\n${customMessage}` : ''}

This proposal represents a transformational opportunity for Game X Change to lead the retail gaming technology market while achieving substantial operational efficiency and financial returns.

We look forward to discussing this strategic partnership opportunity.

Respectfully submitted,
DWC Systems LLC Corporate Partnerships Team
`.trim();

    const blob = new Blob([proposalContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameXChange_Executive_Proposal_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Executive Proposal Generated",
      description: "Complete corporate partnership proposal ready for Game X Change leadership",
    });
  }, [executiveInfo, customMessage, toast]);

  const generatePitchDeck = useCallback(() => {
    const pitchDeckContent = `
GAME X CHANGE CORPORATE PARTNERSHIP
DWC Systems LLC Executive Presentation Outline

SLIDE 1: TITLE
"Revolutionizing Pokemon Card Operations Through Quantum AI Technology"
DWC Systems LLC Corporate Partnership Proposal
Game X Change Executive Team

SLIDE 2: THE OPPORTUNITY
Market Size: $6.2B Pokemon TCG Market
Game X Change Position: Leading Pokemon card retailer
Challenge: Manual processing limits growth and profitability
Solution: AI-powered automation for competitive advantage

SLIDE 3: CURRENT STATE CHALLENGES
- 15-20 minute processing time per collection
- 75-85% accuracy rate with human evaluation
- High labor costs for specialized staff
- Inconsistent pricing across locations
- Limited scalability for bulk operations

SLIDE 4: DWC SYSTEMS SOLUTION
QQASI (Quantum AI Scanning Intelligence)
- 2-second card identification
- 99.7% accuracy rate
- Bulk processing capability
- Enterprise integration ready

SLIDE 5: TECHNOLOGY DEMONSTRATION
Live Demo: Pokemon Card Scanner
- Real-time card identification
- Instant market pricing
- Game X Change trade value calculation
- Mobile-optimized interface

SLIDE 6: FINANCIAL IMPACT
Per Location Annual Savings:
- Labor Cost Reduction: $28,800 - $57,600
- Processing Efficiency: $36,000 - $48,000
- Revenue Optimization: $45,000 - $75,000
Total Annual Benefit: $109,800 - $180,600

SLIDE 7: CORPORATE SCALE IMPACT
50 Locations, 3-Year Projection:
- Total Savings: $4.3M - $8.6M
- Revenue Increase: $6.8M - $11.3M
- Technology Investment: $2.9M
- Net Benefit: $8.2M - $17.0M
- ROI: 283% - 586%

SLIDE 8: IMPLEMENTATION ROADMAP
Phase 1: Pilot (2-3 weeks) - Single location
Phase 2: Regional (4-6 weeks) - 5-10 locations
Phase 3: Enterprise (8-12 weeks) - All locations
Total Implementation: 18 weeks to full deployment

SLIDE 9: COMPETITIVE ADVANTAGE
- Only Pokemon-specific enterprise AI solution
- Proprietary database of 500,000+ cards
- Real-time market integration
- Scalable cloud architecture
- Mobile-first design

SLIDE 10: STRATEGIC PARTNERSHIP
Beyond Technology:
- Market leadership position
- Data-driven business intelligence
- Enhanced customer experience
- Scalable growth platform
- Co-marketing opportunities

SLIDE 11: SUCCESS METRICS
- 85% faster processing times
- 99.7% accuracy improvement
- 60% labor cost reduction
- 40% customer satisfaction increase
- 10x scalability factor

SLIDE 12: NEXT STEPS
1. Executive approval for pilot program
2. Technical integration assessment
3. Flagship location implementation
4. Strategic partnership agreement
5. Corporate-wide deployment

SLIDE 13: CONTACT & PARTNERSHIP
DWC Systems LLC
Corporate Partnerships Division
partnerships@dwcsystems.com

Ready to transform Game X Change Pokemon operations
`.trim();

    const blob = new Blob([pitchDeckContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameXChange_Executive_PitchDeck_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Executive Pitch Deck Generated",
      description: "13-slide presentation outline ready for corporate meeting",
    });
  }, [toast]);

  const generateEmailTemplate = useCallback(() => {
    const emailContent = `
Subject: Strategic Technology Partnership Opportunity - Pokemon Card Operations Enhancement

Dear ${executiveInfo.name || '[Executive Name]'},

I hope this message finds you well. I am writing to present a transformational technology partnership opportunity specifically designed for Game X Change's Pokemon card operations.

DWC Systems LLC has developed proprietary Quantum AI Scanning Intelligence (QQASI) technology that can revolutionize how Game X Change processes Pokemon card trade-ins and sales. Our solution addresses the core operational challenges facing your Pokemon card business while delivering substantial financial returns.

KEY BUSINESS IMPACT:
• 85% reduction in processing time (from 15-20 minutes to 2-3 minutes)
• 99.7% accuracy rate (up from 75-85% with manual evaluation)
• 60% reduction in labor costs through automation
• 300-1000% ROI projection within first year

CORPORATE SCALE BENEFITS:
For a 50-location Game X Change network, our 3-year projections show:
• $4.3M - $8.6M in operational cost savings
• $6.8M - $11.3M in revenue optimization
• Net corporate benefit of $8.2M - $17.0M

STRATEGIC ADVANTAGES:
• Only enterprise-grade Pokemon card AI solution in the market
• Seamless integration with existing Game X Change systems
• Real-time corporate dashboard for multi-location oversight
• Mobile-optimized for modern retail operations

IMPLEMENTATION APPROACH:
We propose a phased rollout beginning with a pilot program at your flagship location, followed by regional deployment, and culminating in enterprise-wide implementation. This approach minimizes risk while maximizing learning and optimization.

NEXT STEPS:
I would welcome the opportunity to present this technology partnership to your executive team. Our demonstration includes:
• Live technology demonstration
• Detailed financial projections
• Implementation roadmap
• Strategic partnership framework

Would you be available for a brief call this week to discuss this opportunity? I can also arrange an in-person demonstration at your convenience.

${customMessage ? `\n${customMessage}` : ''}

Thank you for your time and consideration. I look forward to discussing how DWC Systems can help Game X Change achieve market leadership in Pokemon card retail technology.

Best regards,

[Your Name]
Corporate Partnerships Director
DWC Systems LLC
partnerships@dwcsystems.com
[Direct Phone Number]

P.S. Our technology is currently being piloted with select retail partners. Given Game X Change's market position, we would be honored to establish an exclusive strategic partnership.
`.trim();

    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameXChange_Executive_Email_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Executive Email Template Generated",
      description: "Professional outreach email ready for Game X Change leadership",
    });
  }, [executiveInfo, customMessage, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-12 w-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Game X Change Executive Pitch
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Corporate Partnership Proposal for Pokemon Card Intelligence Platform
          </p>
          <Badge variant="outline" className="border-green-500 text-green-400">
            QQASI TECHNOLOGY PARTNERSHIP
          </Badge>
        </motion.div>

        {/* Corporate Metrics Dashboard */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Speed Increase</p>
                  <p className="text-2xl font-bold text-white">{corporateMetrics.processingSpeedIncrease}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Accuracy</p>
                  <p className="text-2xl font-bold text-white">{corporateMetrics.accuracyImprovement}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Cost Reduction</p>
                  <p className="text-2xl font-bold text-white">{corporateMetrics.laborCostReduction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Satisfaction</p>
                  <p className="text-2xl font-bold text-white">{corporateMetrics.customerSatisfactionIncrease}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">Scalability</p>
                  <p className="text-2xl font-bold text-white">{corporateMetrics.scalabilityFactor}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-slate-400">ROI</p>
                  <p className="text-2xl font-bold text-white">{corporateMetrics.roiProjection}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="proposal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="proposal">Executive Proposal</TabsTrigger>
            <TabsTrigger value="advantages">Competitive Advantages</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="outreach">Corporate Outreach</TabsTrigger>
          </TabsList>

          <TabsContent value="proposal" className="space-y-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400">Executive Partnership Proposal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Button onClick={generateExecutiveProposal} className="bg-purple-600 hover:bg-purple-700">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Executive Proposal
                  </Button>
                  <Button onClick={generatePitchDeck} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Pitch Deck
                  </Button>
                  <Button onClick={() => window.open('/pokemon-card-scanner', '_blank')} className="bg-green-600 hover:bg-green-700">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Live Technology Demo
                  </Button>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Corporate Value Proposition:</h4>
                  <p className="text-slate-300 text-sm">
                    DWC Systems offers Game X Change the opportunity to become the market leader in Pokemon card retail technology. 
                    Our QQASI platform delivers measurable ROI while positioning Game X Change as the most technologically advanced 
                    Pokemon card retailer in the industry.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advantages" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {competitiveAdvantages.map((advantage, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-green-400 text-lg">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-sm">{advantage.description}</p>
                    <div className="bg-green-900/20 border border-green-500 rounded-lg p-3">
                      <p className="text-green-400 text-sm font-medium">Business Impact:</p>
                      <p className="text-green-300 text-sm">{advantage.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6">
            <div className="space-y-6">
              {implementationPhases.map((phase, index) => (
                <Card key={index} className="bg-slate-800/60 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Phase {index + 1}: {phase.phase}</CardTitle>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span><Clock className="h-4 w-4 inline mr-1" />{phase.duration}</span>
                      <span><Package className="h-4 w-4 inline mr-1" />{phase.scope}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Deliverables:</h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable, i) => (
                          <li key={i} className="flex items-center text-slate-300 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3">
                      <p className="text-blue-400 text-sm font-medium">Investment:</p>
                      <p className="text-blue-300 text-sm">{phase.investment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outreach" className="space-y-6">
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Executive Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Executive Name"
                    value={executiveInfo.name}
                    onChange={(e) => setExecutiveInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Executive Title"
                    value={executiveInfo.title}
                    onChange={(e) => setExecutiveInfo(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Email Address"
                    value={executiveInfo.email}
                    onChange={(e) => setExecutiveInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Region/Territory"
                    value={executiveInfo.region}
                    onChange={(e) => setExecutiveInfo(prev => ({ ...prev, region: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <Textarea
                  placeholder="Personalized message or specific talking points..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
                
                <div className="flex gap-4">
                  <Button onClick={generateEmailTemplate} className="bg-orange-600 hover:bg-orange-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Generate Executive Email
                  </Button>
                  <Button onClick={() => window.open('/game-x-change-integration', '_blank')} className="bg-purple-600 hover:bg-purple-700">
                    <Globe className="h-4 w-4 mr-2" />
                    Integration Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}