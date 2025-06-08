import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Terminal,
  Eye,
  Shield
} from 'lucide-react';

interface WatsonModuleStatus {
  containerPresent: boolean;
  domMounted: boolean;
  visibility: 'visible' | 'hidden' | 'unmounted';
  accessRestricted: boolean;
  userRole: string;
  fingerprintValid: boolean;
  consoleInitialized: boolean;
}

export function WatsonInterfaceRenderer() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Card className="w-80 bg-slate-900/95 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Watson Control Center
            </CardTitle>
            <Badge variant="outline" className="text-xs text-green-400 border-green-500">
              Unified Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Master Control Status</span>
                <Badge variant="default" className="bg-green-600">
                  All Systems Online
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">Unified Widget</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">Collision-Free</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">Watson Core</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-400">TRD Access</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.location.href = '/unified-control'}
              >
                <Eye className="w-4 h-4 mr-1" />
                Open Master Control
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = '/widget-dashboard'}
              >
                <Shield className="w-4 h-4 mr-1" />
                Widget Dashboard
              </Button>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
              All widgets unified into master control interface
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}