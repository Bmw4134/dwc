import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Play,
  Copy,
  Eye
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function APISetupWizard() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);

  // Check current setup status
  const { data: setupStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/setup/status']
  });

  // Start automated Google API setup
  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/setup/google-places-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Setup failed');
      return response.json();
    },
    onSuccess: (data) => {
      setIsRunning(false);
      refetchStatus();
      if (data.success) {
        toast({
          title: "API Setup Complete",
          description: "Google Places API has been configured successfully"
        });
      } else {
        toast({
          title: "Setup Incomplete",
          description: data.error || "Manual steps required",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      setIsRunning(false);
      toast({
        title: "Setup Failed",
        description: "Could not complete automated setup",
        variant: "destructive"
      });
    }
  });

  const handleStartSetup = () => {
    setIsRunning(true);
    setupMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Google Places API Setup Wizard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <p className="text-white font-semibold">API Key Status</p>
              <p className="text-gray-400 text-sm">Required for lead scanning functionality</p>
            </div>
            <Badge className={setupStatus?.hasGooglePlacesKey ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
              {setupStatus?.hasGooglePlacesKey ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Missing
                </>
              )}
            </Badge>
          </div>

          {!setupStatus?.hasGooglePlacesKey && (
            <>
              {/* Automated Setup Option */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The automated setup will open Google Cloud Console in a new browser window and guide you through the process.
                  You'll need to be logged into your Google account.
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <Button 
                  onClick={handleStartSetup}
                  disabled={isRunning || setupMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Play className="h-5 w-5 mr-2 animate-pulse" />
                      Running Automated Setup...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Automated Setup
                    </>
                  )}
                </Button>
              </div>

              {/* Manual Setup Instructions */}
              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-white font-semibold mb-4">Manual Setup Instructions</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="text-white">Go to Google Cloud Console</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => window.open('https://console.cloud.google.com', '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open Console
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="text-white">Create a new project or select existing one</p>
                      <p className="text-gray-400 text-sm">Choose a descriptive name like "Lead Generation API"</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="text-white">Enable the Places API</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => window.open('https://console.cloud.google.com/apis/library/places-backend.googleapis.com', '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Enable Places API
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <p className="text-white">Create an API Key</p>
                      <p className="text-gray-400 text-sm">Go to Credentials → Create Credentials → API Key</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Go to Credentials
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <div>
                      <p className="text-white">Add the API key to Replit Secrets</p>
                      <p className="text-gray-400 text-sm mb-2">Add key: GOOGLE_PLACES_API_KEY with your API key value</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-500 text-green-400 hover:bg-green-500/10"
                          onClick={() => copyToClipboard('GOOGLE_PLACES_API_KEY')}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Key Name
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => window.open('/~/secrets', '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Open Secrets
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Setup Steps Display */}
          {setupStatus?.steps && setupStatus.steps.length > 0 && (
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-white font-semibold mb-4">Setup Progress</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {setupStatus.steps.map((step: string, index: number) => (
                  <div key={index} className="text-sm text-gray-300 font-mono bg-gray-800/30 p-2 rounded">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}