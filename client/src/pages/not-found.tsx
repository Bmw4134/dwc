import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-green-300">404</h1>
          <h2 className="text-2xl font-bold text-green-300">NEXUS Route Not Found</h2>
          <p className="text-green-400/70 font-mono">
            The requested system interface does not exist in the NEXUS framework.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => setLocation('/dw-executive-dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-black"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full border-green-500/20 text-green-400 hover:bg-green-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="text-xs text-green-400/50 font-mono">
          NEXUS Intelligence Framework v2.0
        </div>
      </div>
    </div>
  );
}