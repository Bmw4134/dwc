// Clean banker lender landing without hooks
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Award, 
  Users, 
  DollarSign,
  BarChart3,
  Lock,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Briefcase,
  PieChart,
  Activity,
  Globe,
  Rocket
} from 'lucide-react';
import { Link } from 'wouter';

export default function BankerLenderLanding() {
  const selectedMetric = 'confidence';

  const metrics = {
    confidence: { value: 94.7, label: 'System Confidence', trend: '+12.3%' },
    reliability: { value: 98.2, label: 'Reliability Score', trend: '+5.8%' },
    efficiency: { value: 89.5, label: 'Process Efficiency', trend: '+18.4%' },
    roi: { value: 156.8, label: 'ROI Projection', trend: '+24.7%' }
  };

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security protocols with real-time monitoring'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Generation',
      description: 'Dual-mode trading bot with API and browser automation'
    },
    {
      icon: Target,
      title: 'Lead Intelligence',
      description: 'AI-powered lead generation and qualification system'
    },
    {
      icon: Zap,
      title: 'Automated Operations',
      description: 'Complete business process automation suite'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-white">DWC Systems LLC</h1>
                <p className="text-sm text-slate-400">Professional Consulting Automation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                System Active
              </Badge>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Access Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              Enterprise-Grade <span className="text-blue-400">Automation Platform</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Advanced AI-powered consulting automation with dual-mode trading capabilities, 
              role-based access control, and real-time business intelligence for institutional partners.
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {Object.entries(metrics).map(([key, metric]) => (
                <Card 
                  key={key}
                  className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${
                    selectedMetric === key ? 'border-blue-500 bg-blue-900/20' : ''
                  }`}
                  onClick={() => {}}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {metric.value}%
                    </div>
                    <div className="text-sm text-slate-400 mb-2">
                      {metric.label}
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      {metric.trend}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch Platform
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-slate-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Platform Capabilities
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive automation suite designed for banking and lending institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
                <CardHeader className="pb-3">
                  <feature.icon className="h-8 w-8 text-blue-400 mb-3" />
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">Bank-Grade Security</h4>
                <p className="text-slate-400 text-sm">
                  Military-grade encryption with multi-layer authentication protocols
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <Activity className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">Real-Time Operations</h4>
                <p className="text-slate-400 text-sm">
                  Live monitoring and automated decision-making capabilities
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">Proven Results</h4>
                <p className="text-slate-400 text-sm">
                  Demonstrated ROI improvements for institutional clients
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Building className="h-6 w-6 text-blue-400" />
              <span className="text-white font-semibold">DWC Systems LLC</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <span>© 2025 DWC Systems LLC</span>
              <span>•</span>
              <span>Enterprise Solutions</span>
              <span>•</span>
              <span>Secure Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}