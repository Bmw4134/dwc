import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Shield, Database, AlertTriangle, CheckCircle, Key } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DataIntegrityReport {
  integrityLevel: string;
  authenticatedSources: number;
  totalSources: number;
  missingAuthentication: string[];
  syntheticDataUsed: boolean;
  fallbackDataUsed: boolean;
  realTimeDataOnly: boolean;
}

export function DataIntegrityDashboard() {
  const { data: integrityData, isLoading, error } = useQuery({
    queryKey: ['/api/data/integrity'],
    refetchInterval: 30000
  });

  const { data: authenticData } = useQuery({
    queryKey: ['/api/data/authentic'],
    retry: false
  });

  const getIntegrityColor = (level: string) => {
    const percentage = parseInt(level.replace('%', ''));
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIntegrityStatus = (level: string) => {
    const percentage = parseInt(level.replace('%', ''));
    if (percentage === 100) return 'OPTIMAL';
    if (percentage >= 75) return 'PARTIAL';
    return 'CRITICAL';
  };

  const requiredAPIs = [
    { name: 'HubSpot CRM', key: 'HUBSPOT_API_KEY', description: 'Live lead and customer data' },
    { name: 'QuickBooks', key: 'QUICKBOOKS_API_KEY', description: 'Real financial metrics' },
    { name: 'Coinbase Pro', key: 'COINBASE_API_KEY', description: 'Authentic trading data' },
    { name: 'Google Analytics', key: 'GA_API_KEY', description: 'Real traffic insights' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Data Integrity Monitor</h2>
          <p className="text-muted-foreground">100% Authentic Business Data Only</p>
        </div>
      </div>

      {/* Main Integrity Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Integrity Status
          </CardTitle>
          <CardDescription>
            Real-time validation of authentic data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrityData?.dataIntegrity && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Data Authenticity</span>
                <Badge 
                  className={`${getIntegrityColor(integrityData.dataIntegrity.integrityLevel)} text-white`}
                >
                  {integrityData.dataIntegrity.integrityLevel} {getIntegrityStatus(integrityData.dataIntegrity.integrityLevel)}
                </Badge>
              </div>
              
              <Progress 
                value={parseInt(integrityData.dataIntegrity.integrityLevel.replace('%', ''))} 
                className="h-3"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Authenticated: {integrityData.dataIntegrity.authenticatedSources}/{integrityData.dataIntegrity.totalSources}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {integrityData.dataIntegrity.syntheticDataUsed ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">
                    {integrityData.dataIntegrity.syntheticDataUsed ? 'Synthetic Data Detected' : 'No Synthetic Data'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Missing Authentication Alert */}
      {integrityData?.missingAuthentication?.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Authentication Required:</strong> Connect {integrityData.missingAuthentication.length} API sources for 100% realistic performance.
          </AlertDescription>
        </Alert>
      )}

      {/* Required API Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Required API Connections
          </CardTitle>
          <CardDescription>
            Connect these business APIs for authentic data access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredAPIs.map((api) => {
              const isConnected = !integrityData?.missingAuthentication?.includes(api.key);
              return (
                <div key={api.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{api.name}</h4>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Connected" : "Required"}
                    </Badge>
                    {!isConnected && (
                      <Button size="sm" variant="outline">
                        Setup API
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Authentic Data Preview */}
      {authenticData?.success && (
        <Card>
          <CardHeader>
            <CardTitle>Authentic Data Preview</CardTitle>
            <CardDescription>
              Live data from connected business sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
              {JSON.stringify(authenticData.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {authenticData?.success === false && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Authentic Data Unavailable:</strong> {authenticData.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}