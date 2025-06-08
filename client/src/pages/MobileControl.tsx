import React from 'react';
import { WatsonMobileInterface } from '@/components/WatsonMobileInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Zap, Brain, Activity } from 'lucide-react';

export default function MobileControl() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Mobile Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Smartphone className="w-6 h-6" />
              Watson Mobile Command
            </CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                <Zap className="w-3 h-3 mr-1" />
                Prop Tech
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                <Brain className="w-3 h-3 mr-1" />
                AI Control
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                <Activity className="w-3 h-3 mr-1" />
                Live Status
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Watson Mobile Interface */}
        <WatsonMobileInterface />

        {/* Quick Access Instructions */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 text-lg">Quick Voice Commands</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-purple-700 space-y-2">
            <div><strong>"System status"</strong> - Get current system health</div>
            <div><strong>"Fix database"</strong> - Repair database connectivity</div>
            <div><strong>"Watson sweep"</strong> - Execute AI intelligence sweep</div>
            <div><strong>"Full deployment"</strong> - Complete system deployment</div>
            <div><strong>"Prop tech sweep"</strong> - Scan property opportunities</div>
            <div><strong>"Emergency stop"</strong> - Halt all automated systems</div>
          </CardContent>
        </Card>

        {/* Mobile Optimization Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4 text-center">
            <div className="text-green-800 font-medium mb-2">Mobile Optimized</div>
            <div className="text-green-700 text-sm">
              Full voice control and chat interface designed for mobile access from anywhere.
              All commands work offline and sync when connection is restored.
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}