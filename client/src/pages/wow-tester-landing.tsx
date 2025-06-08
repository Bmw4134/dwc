import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  Zap,
  Shield,
  Rocket
} from 'lucide-react';

export default function WowTesterLanding() {
  const [, setLocation] = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLaunchDemo = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setLocation('/wow-tester-login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl">
          
          {/* Animated Nexus Icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-8 transition-transform duration-1000 ${
            isAnimating ? 'scale-150 rotate-180' : 'animate-pulse'
          }`}>
            <Bot className="w-12 h-12 text-white" />
          </div>

          {/* Main Tagline */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              Experience the Future
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold text-white/90">
              of Intelligence
            </h2>
            <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl text-purple-300">
              <Sparkles className="w-6 h-6 animate-spin" />
              <span>Built with Nexus</span>
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-300">
                  <Zap className="w-5 h-5" />
                  <span>Instant Automation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">Drag, drop, and watch AI work its magic in real-time</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-blue-500/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-300">
                  <Bot className="w-5 h-5" />
                  <span>Smart AI Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">Ask anything and get intelligent, contextual responses</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-indigo-500/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-indigo-300">
                  <Shield className="w-5 h-5" />
                  <span>Secure Sandbox</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">Safe environment to explore without limits</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button
              onClick={handleLaunchDemo}
              disabled={isAnimating}
              className={`
                bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                text-white text-xl px-12 py-6 rounded-full shadow-2xl transform transition-all duration-300
                ${isAnimating ? 'scale-110 animate-pulse' : 'hover:scale-105'}
              `}
            >
              {isAnimating ? (
                <div className="flex items-center space-x-2">
                  <Rocket className="w-6 h-6 animate-spin" />
                  <span>Launching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Launch Intelligence Demo</span>
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </Button>
          </div>

          {/* Public Link Display */}
          <div className="mt-8 p-4 bg-black/30 rounded-lg border border-purple-500/30">
            <p className="text-purple-300 text-sm">Public Demo Link:</p>
            <p className="text-white font-mono text-lg">nexusplatform.ai/wow-tester-join</p>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}