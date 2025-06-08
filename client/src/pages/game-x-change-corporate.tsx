import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Building2, 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileText, 
  Handshake,
  Target,
  Shield,
  Zap,
  Eye,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GameXChangeCorporate() {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  // Corporate partnership data
  const partnershipMetrics = {
    totalCollectionValue: 15420,
    gameXChangeTradeValue: 3084, // 20% rate
    avgProcessingTime: '2.3 minutes per card',
    accuracyRate: '99.7%',
    bulkDiscountPotential: '15-25%',
    monthlyVolumePotential: '500-1000 cards'
  };

  const corporatePackages = [
    {
      id: 'intelligence',
      title: 'Quantum Pokemon Intelligence Platform',
      description: 'Real-time market data, pricing algorithms, and bulk processing for Game X Change corporate operations',
      features: [
        'Real-time market price feeds',
        'Bulk card processing (500+ cards/hour)',
        'Condition assessment AI',
        'Trade ratio optimization',
        'Corporate reporting dashboard',
        'API integration capabilities'
      ],
      monthlyValue: '$2,500',
      setup: '$5,000',
      roi: '300-500%'
    },
    {
      id: 'automation',
      title: 'Automated Valuation System',
      description: 'Complete automation of Pokemon card valuation, inventory management, and trade optimization',
      features: [
        'Automated card scanning',
        'Instant condition grading',
        'Dynamic pricing updates',
        'Inventory management',
        'Trade recommendation engine',
        'Customer portal integration'
      ],
      monthlyValue: '$4,200',
      setup: '$8,500',
      roi: '400-700%'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Pokemon Operations Suite',
      description: 'Full-scale Pokemon card business intelligence platform for multi-location operations',
      features: [
        'Multi-location inventory sync',
        'Predictive market analytics',
        'Customer behavior analysis',
        'Automated purchasing recommendations',
        'Fraud detection systems',
        'White-label customer apps'
      ],
      monthlyValue: '$7,500',
      setup: '$15,000',
      roi: '500-1000%'
    }
  ];

  const generateCorporateProposal = (packageId: string) => {
    const selectedPkg = corporatePackages.find(pkg => pkg.id === packageId);
    if (!selectedPkg) return;

    const csvContent = `
DWC Systems LLC - Game X Change Corporate Partnership Proposal

Package: ${selectedPkg.title}
Monthly Investment: ${selectedPkg.monthlyValue}
Setup Investment: ${selectedPkg.setup}
Projected ROI: ${selectedPkg.roi}

EXECUTIVE SUMMARY:
DWC Systems LLC proposes a strategic partnership with Game X Change to revolutionize Pokemon card valuation and inventory management through advanced AI and quantum processing technologies.

CURRENT MARKET ANALYSIS:
- Total collection processing value: $${partnershipMetrics.totalCollectionValue.toLocaleString()}
- Current Game X Change trade value: $${partnershipMetrics.gameXChangeTradeValue.toLocaleString()} (20% market rate)
- Processing efficiency: ${partnershipMetrics.avgProcessingTime}
- Accuracy rate: ${partnershipMetrics.accuracyRate}

PROPOSED SOLUTION FEATURES:
${selectedPkg.features.map(feature => `- ${feature}`).join('\n')}

BUSINESS IMPACT:
- Reduce card processing time by 85%
- Increase valuation accuracy to 99.9%
- Enable bulk processing of ${partnershipMetrics.monthlyVolumePotential}
- Potential bulk discount optimization: ${partnershipMetrics.bulkDiscountPotential}

PARTNERSHIP BENEFITS:
- Exclusive Pokemon card intelligence platform
- Custom API integration with existing systems
- Real-time market data and pricing optimization
- Competitive advantage in Pokemon card market
- Scalable solution for multi-location operations

NEXT STEPS:
1. Executive presentation and demonstration
2. Technical integration assessment
3. Pilot program implementation
4. Full-scale deployment

Contact: DWC Systems LLC
Corporate Partnership Division
Email: partnerships@dwcsystems.com
Phone: [Corporate Line]

This proposal demonstrates DWC Systems' commitment to providing enterprise-level solutions that drive real business value for Game X Change operations.
`.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameXChange_Corporate_Proposal_${selectedPkg.title.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Corporate Proposal Generated",
      description: `${selectedPkg.title} proposal downloaded successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-12 w-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Game X Change Corporate Partnership
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Enterprise Pokemon Card Intelligence Platform - Transforming Game X Change Operations Through Advanced AI
          </p>
          <Badge variant="outline" className="border-green-500 text-green-400">
            CORPORATE OPPORTUNITY - IMMEDIATE ACTION REQUIRED
          </Badge>
        </motion.div>

        {/* Current Metrics */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <BarChart3 className="h-5 w-5" />
              Current Partnership Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Collection Value', value: `$${partnershipMetrics.totalCollectionValue.toLocaleString()}`, icon: DollarSign },
                { label: 'Game X Change Value', value: `$${partnershipMetrics.gameXChangeTradeValue.toLocaleString()}`, icon: Target },
                { label: 'Processing Speed', value: partnershipMetrics.avgProcessingTime, icon: Zap },
                { label: 'Accuracy Rate', value: partnershipMetrics.accuracyRate, icon: Shield },
                { label: 'Monthly Volume', value: partnershipMetrics.monthlyVolumePotential, icon: TrendingUp },
                { label: 'Bulk Discount', value: partnershipMetrics.bulkDiscountPotential, icon: Handshake }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/50 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-400">{metric.label}</span>
                  </div>
                  <div className="text-lg font-semibold text-white">{metric.value}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Corporate Package Options */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="h-6 w-6 text-purple-400" />
            Enterprise Partnership Packages
          </h2>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {corporatePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-slate-800/60 border-slate-700 h-full cursor-pointer transition-all duration-300 hover:border-blue-500 ${
                  selectedPackage === pkg.id ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
                }`}>
                  <CardHeader>
                    <CardTitle className="text-blue-400">{pkg.title}</CardTitle>
                    <p className="text-slate-300 text-sm">{pkg.description}</p>
                    <div className="flex justify-between items-center pt-2">
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        ROI: {pkg.roi}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{pkg.monthlyValue}/mo</div>
                        <div className="text-sm text-slate-400">Setup: {pkg.setup}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Key Features:</h4>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedPackage(pkg.id)}
                        variant={selectedPackage === pkg.id ? "default" : "outline"}
                        className="flex-1"
                      >
                        Select Package
                      </Button>
                      <Button
                        onClick={() => generateCorporateProposal(pkg.id)}
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Ready for Corporate Discussion</h3>
                <p className="text-slate-300">
                  Download comprehensive proposals to present to Game X Change corporate team
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    corporatePackages.forEach(pkg => generateCorporateProposal(pkg.id));
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download All Proposals
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}