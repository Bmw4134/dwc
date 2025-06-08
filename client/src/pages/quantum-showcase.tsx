import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Smartphone, 
  Camera, 
  MessageSquare,
  Building2,
  Palette,
  Target,
  Rocket,
  DollarSign,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuantumShowcase() {
  const [activeSection, setActiveSection] = useState('overview');

  const achievements = [
    {
      icon: Brain,
      title: "Quantum AI Intelligence Hub",
      description: "Advanced AI-to-AI communication pipeline with multi-model integration",
      status: "Operational",
      color: "bg-purple-500/20 text-purple-400"
    },
    {
      icon: Camera,
      title: "Pokemon Card Revenue Engine",
      description: "Bulk photo analysis for instant market valuation and trade optimization",
      status: "Ready for 91 Photos",
      color: "bg-green-500/20 text-green-400"
    },
    {
      icon: Building2,
      title: "DWC Systems Consulting Platform",
      description: "Complete lead-to-deal automation with voice-activated research",
      status: "Enterprise Ready",
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      icon: Smartphone,
      title: "iPhone-Optimized Mobile Experience",
      description: "Seamless device adaptation with real-time responsive design",
      status: "Wife-Approved UI",
      color: "bg-orange-500/20 text-orange-400"
    },
    {
      icon: Palette,
      title: "One-Click Mood Theme Switcher",
      description: "Professional, Energetic, Calm, Creative, and Focus modes",
      status: "Just Implemented",
      color: "bg-pink-500/20 text-pink-400"
    },
    {
      icon: MessageSquare,
      title: "Voice Lead Research",
      description: "Hands-free business analysis while driving to appointments",
      status: "Production Ready",
      color: "bg-cyan-500/20 text-cyan-400"
    }
  ];

  const businessTargets = [
    { 
      target: "Kate's Photography Revenue", 
      current: "$2,500/month", 
      goal: "$15,000/month", 
      progress: 17,
      icon: Camera
    },
    { 
      target: "Emergency Fund", 
      current: "$5,000", 
      goal: "$25,000", 
      progress: 20,
      icon: DollarSign
    },
    { 
      target: "Consulting Clients", 
      current: "2 active", 
      goal: "5 clients", 
      progress: 40,
      icon: Users
    },
    { 
      target: "Texas Market Penetration", 
      current: "Hugley Hospital + Car Wash", 
      goal: "15 enterprise clients", 
      progress: 13,
      icon: Building2
    }
  ];

  const visionPoints = [
    "Create the most advanced AI-powered consulting business automation platform",
    "Generate immediate revenue through Pokemon card market intelligence",
    "Scale Kate's photography business to $15K/month with automation",
    "Build a sustainable consulting practice targeting Texas healthcare and automotive",
    "Develop voice-activated lead research for mobile professionals",
    "Establish enterprise-grade mobile responsiveness that rivals top tech companies"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-purple-500" />
            <Zap className="h-8 w-8 text-yellow-500" />
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Quantum AI Business Intelligence Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced AI-to-AI modeling pipeline combining multiple revenue streams, 
            enterprise automation, and mobile-first design philosophy
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-green-500/20 text-green-600 px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              Production Ready
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-600 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Quantum Intelligence
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-600 px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Revenue Focused
            </Badge>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            {[
              { id: 'overview', label: 'Platform Overview' },
              { id: 'achievements', label: 'Key Achievements' },
              { id: 'business', label: 'Business Targets' },
              { id: 'vision', label: 'Strategic Vision' }
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
          
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    Core Intelligence Systems
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Anthropic Claude Sonnet 4.0</span>
                      <Badge className="bg-purple-500/20 text-purple-600">Primary AI</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>OpenAI GPT-4o Integration</span>
                      <Badge className="bg-blue-500/20 text-blue-600">Vision & Analysis</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Perplexity Real-Time Research</span>
                      <Badge className="bg-green-500/20 text-green-600">Live Data</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>React TypeScript Frontend</span>
                      <Badge className="bg-orange-500/20 text-orange-600">Enterprise UI</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6 text-blue-500" />
                    Mobile Excellence Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>iPhone-Native Navigation</span>
                      <Badge className="bg-green-500/20 text-green-600">Wife Tested</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Real-Time Device Adaptation</span>
                      <Badge className="bg-blue-500/20 text-blue-600">Auto-Responsive</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Gesture-Based Interface</span>
                      <Badge className="bg-purple-500/20 text-purple-600">Swipe Controls</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voice-Activated Research</span>
                      <Badge className="bg-yellow-500/20 text-yellow-600">Hands-Free</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${achievement.color}`}>
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {achievement.description}
                          </p>
                          <Badge className={achievement.color}>
                            {achievement.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeSection === 'business' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {businessTargets.map((target, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <target.icon className="h-6 w-6 text-blue-500" />
                        <h3 className="font-semibold text-lg">{target.target}</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Current</span>
                          <span className="font-medium">{target.current}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Target</span>
                          <span className="font-medium text-green-600">{target.goal}</span>
                        </div>
                        <Progress value={target.progress} className="h-2" />
                        <div className="text-right text-sm text-gray-500">
                          {target.progress}% Complete
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeSection === 'vision' && (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-500" />
                  Strategic Vision & Accomplishments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-purple-600 dark:text-purple-400">
                      What We've Built
                    </h3>
                    <ul className="space-y-3">
                      {visionPoints.slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-green-600 dark:text-green-400">
                      Next Phase Goals
                    </h3>
                    <ul className="space-y-3">
                      {visionPoints.slice(3).map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Immediate Revenue Opportunities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$2,730</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pokemon Cards (91 photos ready)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$15K/mo</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Kate's Photography Target</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">$50K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Texas Consulting Pipeline</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => window.location.href = '/pokemon-scanner'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              <Camera className="h-5 w-5 mr-2" />
              Launch Pokemon Scanner
            </Button>
            <Button 
              onClick={() => window.location.href = '/consulting'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Open Consulting Dashboard
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            This platform represents months of advanced AI development, creating a comprehensive 
            business automation ecosystem with immediate revenue potential and enterprise scalability.
          </p>
        </div>
      </div>
    </div>
  );
}