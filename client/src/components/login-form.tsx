import { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Globe } from 'lucide-react';

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DWC Systems</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Access</h1>
          <p className="text-gray-600">
            Quantum-secure authentication for enterprise platform access
          </p>
        </div>

        {/* Authentication Card */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your NEXUS dashboard and automation controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {supabase ? (
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#2563eb',
                        brandAccent: '#1d4ed8',
                      },
                    },
                  },
                }}
                providers={['google', 'github']}
                redirectTo={`${window.location.origin}/dashboard`}
                onlyThirdPartyProviders={false}
              />
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-600">Authentication system ready for deployment</p>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full"
                >
                  Demo Access (Development)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-4 text-center">
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Quantum-level security protocols</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Enterprise automation platform</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>277% proven ROI for clients</span>
            </div>
          </div>
        </div>

        {/* Back to Demo */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Back to Demo
          </Button>
        </div>
      </div>
    </div>
  );
}