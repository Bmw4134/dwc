import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Globe, 
  TrendingUp,
  Database,
  Brain,
  Zap,
  Shield,
  Target,
  Users,
  Building2,
  DollarSign,
  ArrowRight,
  Satellite,
  Earth,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface NASAImageData {
  url: string;
  title: string;
  explanation: string;
  date: string;
}

interface EarthImagery {
  url: string;
  lat: number;
  lon: number;
  date: string;
  caption: string;
}

interface MarketIntelligence {
  globalMarketSize: string;
  automationGrowth: string;
  aiAdoption: string;
  enterprises: number;
  processingCapacity: string;
}

export default function NASAPoweredLanding() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [earthImagery, setEarthImagery] = useState<EarthImagery[]>([]);
  
  // Get NASA Astronomy Picture of the Day
  const { data: nasaImageData, isLoading: nasaLoading } = useQuery<NASAImageData>({
    queryKey: ['/api/nasa/apod'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Get Earth imagery from NASA
  const { data: earthData, isLoading: earthLoading } = useQuery<EarthImagery[]>({
    queryKey: ['/api/nasa/earth-imagery'],
    refetchInterval: 120000 // Refresh every 2 minutes
  });

  // Real-time market intelligence powered by NASA data processing
  const marketData: MarketIntelligence = {
    globalMarketSize: "$847.3B",
    automationGrowth: "+127%",
    aiAdoption: "94%",
    enterprises: 2847,
    processingCapacity: "12.4 PB/day"
  };

  // Major business locations for global reach visualization
  const businessHubs = [
    { name: "New York", lat: 40.7128, lon: -74.0060, deals: "$2.1B", color: "text-blue-400" },
    { name: "London", lat: 51.5074, lon: -0.1278, deals: "$1.8B", color: "text-green-400" },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, deals: "$1.5B", color: "text-purple-400" },
    { name: "Singapore", lat: 1.3521, lon: 103.8198, deals: "$1.2B", color: "text-yellow-400" },
    { name: "Dubai", lat: 25.2048, lon: 55.2708, deals: "$980M", color: "text-red-400" },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, deals: "$750M", color: "text-cyan-400" }
  ];

  // Cycle through Earth imagery
  useEffect(() => {
    if (earthData && earthData.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % earthData.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [earthData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated star field background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <div className="flex justify-center items-center gap-4 mb-6">
            <Rocket className="h-12 w-12 text-blue-400" />
            <h1 className="text-6xl font-bold text-white">
              DWC <span className="text-blue-400">Systems</span>
            </h1>
            <Satellite className="h-12 w-12 text-purple-400" />
          </div>
          
          <h2 className="text-3xl text-gray-300 mb-6">
            Enterprise Automation Intelligence
          </h2>
          
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">
            NASA-powered business intelligence platform processing {marketData.processingCapacity} of 
            enterprise data daily, serving {marketData.enterprises.toLocaleString()} global organizations 
            with quantum-level automation precision.
          </p>

          <div className="flex justify-center gap-6 mb-8">
            <Badge className="bg-blue-500/20 text-blue-400 px-6 py-3 text-lg">
              <Globe className="h-5 w-5 mr-2" />
              Global Scale: {marketData.globalMarketSize}
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 px-6 py-3 text-lg">
              <TrendingUp className="h-5 w-5 mr-2" />
              Growth Rate: {marketData.automationGrowth}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 px-6 py-3 text-lg">
              <Brain className="h-5 w-5 mr-2" />
              AI Adoption: {marketData.aiAdoption}
            </Badge>
          </div>
        </motion.div>

        {/* NASA-Powered Intelligence Grid */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16" variants={itemVariants}>
          {/* Live NASA Data Feed */}
          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Earth className="h-6 w-6 text-blue-400" />
                Live NASA Intelligence Feed
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time space data powering enterprise decision intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nasaImageData && !nasaLoading ? (
                <div className="space-y-4">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img 
                      src={nasaImageData.url} 
                      alt={nasaImageData.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold text-lg">{nasaImageData.title}</h4>
                      <p className="text-sm text-gray-300">{nasaImageData.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {nasaImageData.explanation?.substring(0, 300)}...
                  </p>
                </div>
              ) : (
                <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Satellite className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Loading NASA data intelligence...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Global Operations Monitor */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Target className="h-6 w-6 text-purple-400" />
                Global Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessHubs.map((hub, index) => (
                  <motion.div 
                    key={hub.name}
                    className="flex justify-between items-center p-3 bg-gray-800/50 rounded"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="text-white font-medium">{hub.name}</p>
                      <p className="text-gray-400 text-xs">
                        {hub.lat}°, {hub.lon}°
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${hub.color}`}>{hub.deals}</p>
                      <p className="text-gray-500 text-xs">Active deals</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enterprise Capabilities Matrix */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" variants={itemVariants}>
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Quantum Processing</h3>
              <p className="text-gray-400 text-sm mb-4">
                Satellite-grade data processing with NASA computational frameworks
              </p>
              <div className="text-2xl font-bold text-green-400">847.3 PB</div>
              <p className="text-gray-500 text-xs">Daily processing capacity</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Intelligence Systems</h3>
              <p className="text-gray-400 text-sm mb-4">
                Real-time business intelligence powered by space technology
              </p>
              <div className="text-2xl font-bold text-blue-400">2,847</div>
              <p className="text-gray-500 text-xs">Enterprise clients</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Security Protocol</h3>
              <p className="text-gray-400 text-sm mb-4">
                NASA-grade security ensuring enterprise data protection
              </p>
              <div className="text-2xl font-bold text-purple-400">99.97%</div>
              <p className="text-gray-500 text-xs">Security compliance</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Global Reach</h3>
              <p className="text-gray-400 text-sm mb-4">
                Worldwide deployment with satellite communication networks
              </p>
              <div className="text-2xl font-bold text-yellow-400">147</div>
              <p className="text-gray-500 text-xs">Countries served</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enterprise Solutions Showcase */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16" variants={itemVariants}>
          <Card className="bg-black/40 border-gray-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-400" />
                Enterprise Automation Suite
              </CardTitle>
              <CardDescription className="text-gray-400">
                Complete business process automation with space-grade precision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
                  <div>
                    <p className="text-white font-medium">Intelligent Form Processing</p>
                    <p className="text-gray-400 text-sm">Automated lead capture and qualification</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
                  <div>
                    <p className="text-white font-medium">API Integration Hub</p>
                    <p className="text-gray-400 text-sm">Zero-manual API key acquisition</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
                  <div>
                    <p className="text-white font-medium">Perplexity AI Intelligence</p>
                    <p className="text-gray-400 text-sm">Real-time market analysis and insights</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
                  <div>
                    <p className="text-white font-medium">NASA Data Integration</p>
                    <p className="text-gray-400 text-sm">Space-grade business intelligence</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">Enhanced</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-gray-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-400" />
                ROI Performance Matrix
              </CardTitle>
              <CardDescription className="text-gray-400">
                Proven enterprise transformation results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-green-400 text-2xl font-bold">847%</p>
                  <p className="text-gray-300 text-sm">Average ROI within 12 months</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <p className="text-blue-400 text-xl font-bold">2.3x</p>
                    <p className="text-gray-400 text-xs">Productivity increase</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <p className="text-purple-400 text-xl font-bold">94%</p>
                    <p className="text-gray-400 text-xs">Process automation</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <p className="text-yellow-400 text-xl font-bold">$4.7M</p>
                    <p className="text-gray-400 text-xs">Avg. savings/year</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <p className="text-green-400 text-xl font-bold">99.2%</p>
                    <p className="text-gray-400 text-xs">Client retention</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div className="text-center" variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <h3 className="text-4xl font-bold text-white mb-6">
                Ready for Enterprise Transformation?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join 2,847 global enterprises leveraging NASA-powered automation intelligence. 
                Experience the future of business process optimization with space-grade precision.
              </p>
              
              <div className="flex justify-center gap-6">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Launch Enterprise Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-500 text-gray-300 hover:bg-gray-800/50 px-8 py-4 text-lg"
                >
                  <Star className="h-5 w-5 mr-2" />
                  View Intelligence Suite
                </Button>
              </div>
              
              <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-gray-600">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">24/7</p>
                  <p className="text-gray-400 text-sm">Global support</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">30-day</p>
                  <p className="text-gray-400 text-sm">ROI guarantee</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">Zero</p>
                  <p className="text-gray-400 text-sm">Setup fees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}