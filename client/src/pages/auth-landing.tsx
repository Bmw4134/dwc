import { Shield, Lock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            DWC Systems LLC
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enterprise ASI Automation Platform
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <Lock className="h-8 w-8 text-blue-600 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Authorized Access Only
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This platform contains proprietary ASI technology and business intelligence systems.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>DWC Systems Partners Only</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Secure Authentication Required</span>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Secure Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Protected by enterprise-grade security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 DWC Systems LLC. All rights reserved.</p>
          <p className="mt-1">Proprietary technology - unauthorized access prohibited</p>
        </div>
      </div>
    </div>
  );
}