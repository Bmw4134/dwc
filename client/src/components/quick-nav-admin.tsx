import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Zap, 
  Target,
  Activity,
  Settings,
  Eye,
  Rocket
} from 'lucide-react';

export default function QuickNavAdmin() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-2"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="bg-black/90 border-purple-500/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Quick Admin Access
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              ×
            </Button>
          </div>

          <div className="space-y-2">
            <Link href="/qq-excellence-charts">
              <Button variant="ghost" className="w-full justify-start text-green-400 hover:bg-green-900/20">
                <BarChart3 className="w-4 h-4 mr-2" />
                QQ Excellence Charts
                <Badge variant="secondary" className="ml-auto bg-green-900/50">LIVE</Badge>
              </Button>
            </Link>

            <Link href="/qq-transcendent-trading">
              <Button variant="ghost" className="w-full justify-start text-purple-400 hover:bg-purple-900/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Transcendent Trading
                <Badge variant="secondary" className="ml-auto bg-purple-900/50">ACTIVE</Badge>
              </Button>
            </Link>

            <Link href="/mobile-dashboard">
              <Button variant="ghost" className="w-full justify-start text-blue-400 hover:bg-blue-900/20">
                <Activity className="w-4 h-4 mr-2" />
                Mobile Dashboard
              </Button>
            </Link>

            <Link href="/trading-bot">
              <Button variant="ghost" className="w-full justify-start text-cyan-400 hover:bg-cyan-900/20">
                <Rocket className="w-4 h-4 mr-2" />
                Trading Bot
              </Button>
            </Link>

            <Link href="/trading-strategy-wizard">
              <Button variant="ghost" className="w-full justify-start text-orange-400 hover:bg-orange-900/20">
                <Zap className="w-4 h-4 mr-2" />
                Strategy Wizard
              </Button>
            </Link>

            <Link href="/qq-trading">
              <Button variant="ghost" className="w-full justify-start text-pink-400 hover:bg-pink-900/20">
                <Target className="w-4 h-4 mr-2" />
                QQ Trading Dashboard
              </Button>
            </Link>

            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-2">System Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Trading Active</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-purple-400">AI Analysis Running</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}