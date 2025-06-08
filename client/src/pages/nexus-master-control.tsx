import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Command, 
  Brain, 
  Zap, 
  Shield, 
  Activity,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Monitor,
  Database,
  Network,
  Lock
} from 'lucide-react';

interface NEXUSModule {
  id: string;
  name: string;
  type: 'dashboard' | 'automation' | 'ai' | 'connector' | 'backend';
  status: 'active' | 'standby' | 'error';
  confidence: number;
  connections: string[];
  lastSync: Date;
}

export default function NEXUSMasterControl() {
  const queryClient = useQueryClient();
  
  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/nexus/system-status'],
    refetchInterval: 5000
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['/api/nexus/modules'],
    refetchInterval: 10000
  });

  const executeSequenceMutation = useMutation({
    mutationFn: async (sequence: string[]) => {
      const response = await fetch('/api/nexus/execute-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/modules'] });
    }
  });

  const syncModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await fetch('/api/nexus/sync-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/modules'] });
    }
  });

  const activateFallbackMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/nexus/activate-fallback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/system-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/modules'] });
    }
  });

  const handleExecuteSequence = (sequence: string[]) => {
    executeSequenceMutation.mutate(sequence);
  };

  const handleSyncModule = (moduleId: string) => {
    syncModuleMutation.mutate(moduleId);
  };

  const handleActivateFallback = () => {
    activateFallbackMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-500/50';
      case 'standby': return 'text-yellow-400 border-yellow-500/50';
      case 'error': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dashboard': return <Monitor className="w-4 h-4" />;
      case 'automation': return <Zap className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'connector': return <Network className="w-4 h-4" />;
      case 'backend': return <Database className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Command className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                NEXUS Master Control
              </h1>
            </div>
            {systemStatus?.data && (
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <Lock className="w-3 h-3 mr-1" />
                Master Control Lock: {systemStatus.data.masterControlLock ? 'ENABLED' : 'DISABLED'}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {systemStatus?.data && (
              <div className="text-sm text-slate-300">
                Automation Linkage: <span className="text-purple-400 font-semibold">{systemStatus.data.automationLinkage}</span>
              </div>
            )}
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline" 
              size="sm"
              className="border-purple-500/50 hover:bg-purple-500/20"
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400 mb-2">
                {systemStatus?.data?.activeModules || 0}
              </div>
              <div className="text-slate-300 text-sm">Active Modules</div>
              <div className="text-green-400 text-xs">
                / {systemStatus?.data?.totalModules || 0} Total
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {systemStatus?.data?.automationLinkage || '0%'}
              </div>
              <div className="text-slate-300 text-sm">Automation Linkage</div>
              <div className="text-purple-400 text-xs">Target: 95%+</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-6 text-center">
              <Network className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {systemStatus?.data?.connectors || 0}
              </div>
              <div className="text-slate-300 text-sm">Connectors</div>
              <div className="text-blue-400 text-xs">API Integrations</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400 mb-2">
                {systemStatus?.data?.runtimeState === 'FULLY_RESTORED' ? 'RESTORED' : 'PENDING'}
              </div>
              <div className="text-slate-300 text-sm">Runtime State</div>
              <div className="text-orange-400 text-xs">System Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Control Actions */}
        <Card className="bg-slate-800/80 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle>Master Control Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => handleExecuteSequence(['automation-kernel', 'ai-trading-bot', 'lead-intelligence'])}
                className="bg-green-600 hover:bg-green-700"
                disabled={executeSequenceMutation.isPending}
              >
                <Play className="w-4 h-4 mr-2" />
                Execute Core Sequence
              </Button>
              
              <Button 
                onClick={handleActivateFallback}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={activateFallbackMutation.isPending}
              >
                <Shield className="w-4 h-4 mr-2" />
                Activate Fallback Protocols
              </Button>
              
              <Button 
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['/api/nexus/system-status'] });
                  queryClient.invalidateQueries({ queryKey: ['/api/nexus/modules'] });
                }}
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle>Module Status & Control</CardTitle>
          </CardHeader>
          <CardContent>
            {modulesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
                <div className="text-slate-400">Loading modules...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules?.data?.map((module: NEXUSModule) => (
                  <Card key={module.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(module.type)}
                          <span className="font-medium text-white text-sm">{module.name}</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(module.status)}>
                          {module.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="text-blue-400">{module.confidence}%</span>
                        </div>
                        <Progress value={module.confidence} className="h-1" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Type:</span>
                          <span className="text-slate-300">{module.type}</span>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Connections:</span>
                          <span className="text-slate-300">{module.connections.length}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleSyncModule(module.id)}
                        size="sm"
                        variant="outline"
                        className="w-full border-blue-500/50 hover:bg-blue-500/20"
                        disabled={syncModuleMutation.isPending}
                      >
                        <Activity className="w-3 h-3 mr-2" />
                        Sync Module
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status Footer */}
        <Card className="bg-slate-800/80 border-slate-700 mt-8">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 font-semibold">
                NEXUS Master Control Operational • All Systems Synchronized
              </span>
              <div className="text-slate-400 text-sm">
                Last Sync: {systemStatus?.data?.lastSync ? new Date(systemStatus.data.lastSync).toLocaleTimeString() : 'Unknown'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}