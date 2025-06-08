import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface PionexCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export function PionexCredentialSetup() {
  const [credentials, setCredentials] = useState<PionexCredentials>({
    email: 'bm.watson34@gmail.com',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const queryClient = useQueryClient();

  // Test credentials mutation
  const testCredentialsMutation = useMutation({
    mutationFn: async (creds: PionexCredentials) => {
      const response = await fetch('/api/pionex/setup-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to setup credentials');
      }
      
      return response.json();
    },
    onMutate: () => {
      setStatus('testing');
      setErrorMessage('');
    },
    onSuccess: (data) => {
      setStatus('success');
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/trading-status'] });
    },
    onError: (error: Error) => {
      setStatus('error');
      setErrorMessage(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setErrorMessage('Email and password are required');
      setStatus('error');
      return;
    }
    
    testCredentialsMutation.mutate(credentials);
  };

  const handleInputChange = (field: keyof PionexCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Pionex.us Account Setup
        </CardTitle>
        <CardDescription>
          Enter your Pionex.us credentials to enable real money trading
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'testing'}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                disabled={status === 'testing'}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 2FA Code */}
          <div className="space-y-2">
            <Label htmlFor="twoFactorCode">
              2FA Code (if enabled)
              <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
            </Label>
            <Input
              id="twoFactorCode"
              type="text"
              value={credentials.twoFactorCode}
              onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
              placeholder="123456"
              maxLength={6}
              disabled={status === 'testing'}
            />
          </div>

          {/* Status Messages */}
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Pionex.us credentials verified! Real trading is now enabled.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={status === 'testing' || !credentials.email || !credentials.password}
          >
            {status === 'testing' ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Testing Connection...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              'Connect to Pionex.us'
            )}
          </Button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5 text-slate-500" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <p className="font-medium mb-1">Security Notice:</p>
              <ul className="space-y-1">
                <li>• Credentials are encrypted and stored securely</li>
                <li>• Only used for automated trading execution</li>
                <li>• Stop-loss protection active at $100 minimum</li>
                <li>• Emergency stop available at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}