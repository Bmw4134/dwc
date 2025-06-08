import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Settings, Play, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  category: string;
  requiredFields: Array<{
    name: string;
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
  }>;
  apiSetupRequired: boolean;
}

interface ActiveSession {
  sessionId: string;
  platformId: string;
  url: string;
  isActive: boolean;
}

export default function UniversalPlatformSetup() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlatforms();
    loadActiveSessions();
  }, []);

  const loadPlatforms = async () => {
    try {
      const response = await apiRequest('/api/platforms/list');
      setPlatforms(response.platforms);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load platform list",
        variant: "destructive",
      });
    }
  };

  const loadActiveSessions = async () => {
    try {
      const response = await apiRequest('/api/platforms/sessions');
      setActiveSessions(response.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handlePlatformChange = async (platformId: string) => {
    setSelectedPlatform(platformId);
    setCredentials({});
    
    try {
      const response = await apiRequest(`/api/platforms/${platformId}/config`);
      const platform = response.config;
      
      // Initialize credentials object with empty values
      const initialCredentials: Record<string, string> = {};
      platform.requiredFields.forEach((field: any) => {
        initialCredentials[field.name] = '';
      });
      setCredentials(initialCredentials);
    } catch (error) {
      toast({
        title: "Config Load Failed",
        description: "Failed to load platform configuration",
        variant: "destructive",
      });
    }
  };

  const handleCredentialChange = (fieldName: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const setupPlatform = async () => {
    if (!selectedPlatform) {
      toast({
        title: "No Platform Selected",
        description: "Please select a platform to setup",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(`/api/platforms/${selectedPlatform}/setup`, {
        method: 'POST',
        body: JSON.stringify({ credentials })
      });

      if (response.success) {
        toast({
          title: "Platform Setup Started",
          description: `${selectedPlatform} automation initiated successfully`,
        });
        
        // Reload sessions to show new session
        await loadActiveSessions();
        
        // Clear form
        setCredentials({});
        setSelectedPlatform('');
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: `Platform setup failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginToPlatform = async () => {
    if (!selectedPlatform) {
      toast({
        title: "No Platform Selected",
        description: "Please select a platform to login",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(`/api/platforms/${selectedPlatform}/login`, {
        method: 'POST',
        body: JSON.stringify({ credentials })
      });

      if (response.success) {
        toast({
          title: "Login Successful",
          description: `Successfully logged into ${selectedPlatform}`,
        });
        
        await loadActiveSessions();
        setCredentials({});
        setSelectedPlatform('');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: `Login failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeSession = async (sessionId: string) => {
    try {
      await apiRequest(`/api/platforms/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      
      toast({
        title: "Session Closed",
        description: "Platform session closed successfully",
      });
      
      await loadActiveSessions();
    } catch (error) {
      toast({
        title: "Close Failed",
        description: "Failed to close session",
        variant: "destructive",
      });
    }
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Setup Form */}
        <Card className="border-qq-blue/20">
          <CardHeader>
            <CardTitle className="text-qq-blue flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Universal Platform Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform-select">Select Platform</Label>
              <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a platform to setup..." />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <span>{platform.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {platform.category}
                        </Badge>
                        {platform.apiSetupRequired && (
                          <Badge variant="secondary" className="text-xs">
                            API
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlatformData && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-qq-blue">
                  {selectedPlatformData.name} Credentials
                </h4>
                {selectedPlatformData.requiredFields.map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={credentials[field.name] || ''}
                      onChange={(e) => handleCredentialChange(field.name, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ))}
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={setupPlatform}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {loading ? 'Setting up...' : 'Auto Setup Account'}
                  </Button>
                  <Button 
                    onClick={loginToPlatform}
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    {loading ? 'Logging in...' : 'Login Existing'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="border-qq-blue/20">
          <CardHeader>
            <CardTitle className="text-qq-blue flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Active Platform Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active platform sessions</p>
                <p className="text-sm">Setup a platform to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div 
                    key={session.sessionId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium capitalize">{session.platformId.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {session.url}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => closeSession(session.sessionId)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Categories */}
      <Card className="border-qq-blue/20">
        <CardHeader>
          <CardTitle className="text-qq-blue">Available Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['trading', 'business', 'marketing', 'social'].map((category) => {
              const categoryPlatforms = platforms.filter(p => p.category === category);
              return (
                <div key={category} className="text-center">
                  <h4 className="font-medium capitalize text-qq-blue mb-2">{category}</h4>
                  <div className="space-y-1">
                    {categoryPlatforms.map((platform) => (
                      <Badge 
                        key={platform.id} 
                        variant="outline" 
                        className="block w-full text-xs"
                      >
                        {platform.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}