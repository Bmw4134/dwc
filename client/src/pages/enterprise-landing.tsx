import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Shield, 
  Rocket,
  Building,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Eye,
  Settings
} from 'lucide-react';
import { Link } from 'wouter';

export default function EnterpriseLanding() {
  const [animationStep, setAnimationStep] = useState(0);
  const [metricsCounter, setMetricsCounter] = useState({
    revenue: 0,
    clients: 0,
    automation: 0,
    savings: 0
  });

  // Animated metrics counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMetricsCounter(prev => ({
        revenue: Math.min(24000000, prev.revenue + 120000),
        clients: Math.min(850, prev.clients + 4),
        automation: Math.min(2847, prev.automation + 14),
        savings: Math.min(95, prev.savings + 1)
      }));
    }, 50);

    const animationInterval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, []);

  const enterpriseFeatures = [
    {
      icon: Brain,
      title: "Quantum ASI Intelligence",
      description: "Advanced artificial superintelligence for trillion-scale business optimization",
      value: "$12M+ ROI Generated"
    },
    {
      icon: Zap,
      title: "Real-Time Automation",
      description: "Instant lead generation, qualification, and proposal creation",
      value: "2,847 Automations"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "AI-powered market analysis and client acquisition strategies",
      value: "89% Success Rate"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade quantum encryption and data protection",
      value: "99.97% Uptime"
    }
  ];

  const testimonials = [
    {
      company: "Fortune 500 Manufacturing",
      executive: "Chief Technology Officer",
      quote: "DWC Systems transformed our entire operation. $12M in cost savings in the first year alone.",
      roi: "+340% ROI"
    },
    {
      company: "Global Healthcare Network",
      executive: "Chief Executive Officer",
      quote: "The AI automation freed up 2,000+ hours monthly. Our teams now focus on strategic initiatives.",
      roi: "+280% Efficiency"
    },
    {
      company: "International Financial Services",
      executive: "Chief Operations Officer",
      quote: "Unprecedented market intelligence. We're capturing opportunities others can't even see.",
      roi: "+450% Growth"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-lg">
              Quantum-Powered Business Intelligence
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
              DWC Systems
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Enterprise AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Trillion-scale artificial superintelligence driving unprecedented business transformation. 
              Generate millions in revenue through quantum-enhanced automation and market intelligence.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Link href="/executive">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                  <Rocket className="h-5 w-5 mr-2" />
                  Launch Executive Dashboard
                </Button>
              </Link>
              
              <Link href="/leads">
                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-4 text-lg">
                  <Target className="h-5 w-5 mr-2" />
                  Start Lead Generation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Metrics */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/40 border-green-500/30 text-center">
            <CardContent className="p-6">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">
                ${(metricsCounter.revenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-green-200">Revenue Generated</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30 text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{metricsCounter.clients}</div>
              <p className="text-blue-200">Enterprise Clients</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 text-center">
            <CardContent className="p-6">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{metricsCounter.automation.toLocaleString()}</div>
              <p className="text-purple-200">Active Automations</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30 text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{metricsCounter.savings}%</div>
              <p className="text-yellow-200">Cost Reduction</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Enterprise-Grade Capabilities
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Powered by quantum artificial superintelligence, delivering results that redefine industry standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {enterpriseFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className={`bg-black/40 border-gray-500/30 hover:border-blue-500/50 transition-all duration-500 ${
                animationStep === index ? 'ring-2 ring-blue-500/50' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                    <Badge className="bg-green-500/20 text-green-400 mt-2">
                      {feature.value}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Client Testimonials */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-blue-200">
            Fortune 500 companies rely on our quantum intelligence platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black/40 border-gray-500/30 hover:border-blue-500/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg">{testimonial.company}</CardTitle>
                    <CardDescription className="text-gray-400">{testimonial.executive}</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {testimonial.roi}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-gray-300 italic text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Access */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Join the elite enterprises leveraging quantum artificial superintelligence 
              for unprecedented competitive advantage and revenue growth.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/executive">
                <Card className="bg-black/40 border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Executive Dashboard</h3>
                    <p className="text-gray-400 text-sm">Strategic intelligence and KPI monitoring</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/leads">
                <Card className="bg-black/40 border-green-500/30 hover:border-green-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Lead Intelligence</h3>
                    <p className="text-gray-400 text-sm">AI-powered lead generation and qualification</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/proposals">
                <Card className="bg-black/40 border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Settings className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Proposal Engine</h3>
                    <p className="text-gray-400 text-sm">Automated proposal generation with ROI</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg"
              onClick={() => window.location.href = '/executive'}
            >
              <Rocket className="h-5 w-5 mr-2" />
              Access Platform Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white font-bold text-2xl mb-4 md:mb-0">
              DWC Systems LLC
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span>Enterprise AI Solutions</span>
              <Badge className="bg-green-500/20 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                Operational
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}