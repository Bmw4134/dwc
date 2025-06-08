import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Navigation, Volume2 } from 'lucide-react';

interface VoiceNavigationControlProps {
  className?: string;
}

// Minimal implementation without hooks to prevent React errors
export default function VoiceNavigationControl({ className }: VoiceNavigationControlProps) {
  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <div className="flex flex-col gap-2">
        
        {/* Main Voice Control Button */}
        <Button
          size="icon"
          variant="default"
          className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <Mic className="h-6 w-6" />
        </Button>

        {/* Navigation Commands Button */}
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg bg-slate-800/90 border-slate-600 hover:bg-slate-700"
        >
          <Navigation className="h-5 w-5 text-slate-300" />
        </Button>

        {/* Voice Settings Button */}
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg bg-slate-800/90 border-slate-600 hover:bg-slate-700"
        >
          <Volume2 className="h-5 w-5 text-green-400" />
        </Button>

      </div>

      {/* Status Display */}
      <div className="absolute left-20 top-0 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg p-3 min-w-64 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-white font-medium">Voice navigation ready</span>
          </div>
          
          <div className="border-t border-slate-600 pt-2">
            <p className="text-xs text-slate-400 mb-1">Quick commands:</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-blue-600">
                dashboard
              </Badge>
              <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-blue-600">
                leads
              </Badge>
              <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-blue-600">
                trading
              </Badge>
              <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-blue-600">
                settings
              </Badge>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}