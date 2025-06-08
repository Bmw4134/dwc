import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Globe,
  Code,
  RefreshCw
} from 'lucide-react';

interface AuthBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: 'chatgpt' | 'replit' | 'other';
  onAuthenticated?: (authData: any) => void;
}

interface AuthSession {
  sessionId: string;
  service: string;
  status: string;
  waitingFor2FA: boolean;
  authenticated: boolean;
  createdAt: string;
  expiresAt: string;
}

export function AuthBridgeModal({ isOpen, onClose, service = 'chatgpt', onAuthenticated }: AuthBridgeModalProps) {
  const [activeService, setActiveService] = useState(service);
  const [currentStep, setCurrentStep] = useState<'service' | 'credentials' | '2fa' | 'complete'>('service');
  const [sessionId, setSessionId] = useState<string>('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState<'sms' | 'email' | 'authenticator'>('sms');

  const { data: sessionStatus, refetch: refetchSession } = useQuery<AuthSession>({
    queryKey: ['/api/auth-bridge/session', sessionId],
    enabled: !!sessionId,
    refetchInterval: currentStep === '2fa' ? 2000 : false
  });

  const initiateLoginMutation = useMutation({
    mutationFn: async (service: string) => {
      const response = await fetch('/api/auth-bridge/initiate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service })
      });
      if (!response.ok) throw new Error('Failed to initiate login');
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setCurrentStep('credentials');
    }
  });

  const submitCredentialsMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth-bridge/submit-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          username, 
          password, 
          service: activeService 
        })
      });
      if (!response.ok) throw new Error('Failed to submit credentials');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requires2FA) {
        setCurrentStep('2fa');
      } else {
        setCurrentStep('complete');
        onAuthenticated?.(data);
      }
    }
  });

  const submit2FAMutation = useMutation({
    mutationFn: async ({ code, method }: { code: string; method: string }) => {
      const response = await fetch('/api/auth-bridge/submit-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          code, 
          method 
        })
      });
      if (!response.ok) throw new Error('Failed to submit 2FA code');
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentStep('complete');
      onAuthenticated?.(data);
    }
  });

  const handleServiceSelect = (service: string) => {
    setActiveService(service);
    initiateLoginMutation.mutate(service);
  };

  const handleCredentialsSubmit = () => {
    if (credentials.username && credentials.password) {
      submitCredentialsMutation.mutate(credentials);
    }
  };

  const handle2FASubmit = () => {
    if (twoFactorCode) {
      submit2FAMutation.mutate({ code: twoFactorCode, method: twoFactorMethod });
    }
  };

  const resetModal = () => {
    setCurrentStep('service');
    setSessionId('');
    setCredentials({ username: '', password: '' });
    setTwoFactorCode('');
    setTwoFactorMethod('sms');
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'chatgpt': return '🤖';
      case 'replit': return '💻';
      default: return '🌐';
    }
  };

  const getServiceDisplayName = (serviceName: string) => {
    switch (serviceName) {
      case 'chatgpt': return 'ChatGPT';
      case 'replit': return 'Replit';
      default: return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white border-indigo-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Shield className="h-6 w-6 mr-3 text-indigo-400" />
            Authentication Bridge
          </DialogTitle>
          <p className="text-slate-300">
            Securely connect to external services with 2FA support
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {['service', 'credentials', '2fa', 'complete'].map((step, index) => {
              const isActive = currentStep === step;
              const isCompleted = ['service', 'credentials', '2fa', 'complete'].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isActive ? 'bg-indigo-600 text-white' : 
                      isCompleted ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'}`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-slate-600'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Service Selection */}
          {currentStep === 'service' && (
            <Card className="bg-indigo-800/30 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-indigo-400" />
                  Select Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['chatgpt', 'replit', 'other'].map((serviceName) => (
                    <Button
                      key={serviceName}
                      variant="outline"
                      className="h-20 flex flex-col items-center space-y-2 bg-slate-800/50 border-slate-600 hover:bg-indigo-700/30"
                      onClick={() => handleServiceSelect(serviceName)}
                      disabled={initiateLoginMutation.isPending}
                    >
                      <span className="text-2xl">{getServiceIcon(serviceName)}</span>
                      <span className="text-sm">{getServiceDisplayName(serviceName)}</span>
                    </Button>
                  ))}
                </div>
                {initiateLoginMutation.isPending && (
                  <div className="flex items-center justify-center mt-4 text-indigo-300">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Initializing session...
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Credentials Entry */}
          {currentStep === 'credentials' && (
            <Card className="bg-indigo-800/30 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2 text-indigo-400" />
                  Login to {getServiceDisplayName(activeService)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-indigo-200">
                    Username/Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username or email"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-indigo-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="bg-slate-800/50 border-slate-600"
                  />
                </div>
                <Button
                  onClick={handleCredentialsSubmit}
                  disabled={!credentials.username || !credentials.password || submitCredentialsMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {submitCredentialsMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 2FA Code Entry */}
          {currentStep === '2fa' && (
            <Card className="bg-indigo-800/30 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-indigo-400" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={twoFactorMethod} onValueChange={(value) => setTwoFactorMethod(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                    <TabsTrigger value="sms" className="text-xs">SMS</TabsTrigger>
                    <TabsTrigger value="email" className="text-xs">Email</TabsTrigger>
                    <TabsTrigger value="authenticator" className="text-xs">App</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sms" className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Check your phone for the SMS code
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="email" className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Mail className="h-4 w-4 mr-2" />
                      Check your email for the verification code
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="authenticator" className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Code className="h-4 w-4 mr-2" />
                      Use your authenticator app
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <Label htmlFor="2fa-code" className="text-indigo-200">
                    Verification Code
                  </Label>
                  <Input
                    id="2fa-code"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="bg-slate-800/50 border-slate-600 text-center text-lg tracking-widest"
                  />
                </div>

                {sessionStatus?.waitingFor2FA && (
                  <div className="flex items-center text-yellow-300 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Waiting for verification code...
                  </div>
                )}

                <Button
                  onClick={handle2FASubmit}
                  disabled={!twoFactorCode || twoFactorCode.length !== 6 || submit2FAMutation.isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {submit2FAMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Connect'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Completion */}
          {currentStep === 'complete' && (
            <Card className="bg-green-800/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-green-300">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Successfully Connected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Service:</span>
                  <Badge variant="outline" className="text-green-300 border-green-500/30">
                    {getServiceDisplayName(activeService)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status:</span>
                  <Badge variant="outline" className="text-green-300 border-green-500/30">
                    Authenticated
                  </Badge>
                </div>
                {sessionStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Session:</span>
                    <span className="text-green-300 text-sm font-mono">{sessionStatus.sessionId}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={onClose}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Complete
                  </Button>
                  <Button
                    onClick={resetModal}
                    variant="outline"
                    className="border-slate-600"
                  >
                    Connect Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Handling */}
          {(initiateLoginMutation.isError || submitCredentialsMutation.isError || submit2FAMutation.isError) && (
            <Card className="bg-red-800/30 border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center text-red-300">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>
                    {initiateLoginMutation.error?.message || 
                     submitCredentialsMutation.error?.message || 
                     submit2FAMutation.error?.message || 
                     'An error occurred'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}