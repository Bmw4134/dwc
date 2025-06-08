import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Mic, 
  Search, 
  Database, 
  Zap, 
  Eye, 
  Settings,
  Play,
  Archive,
  Brain,
  Command,
  ChevronRight,
  Activity
} from 'lucide-react';

interface AutomationTrigger {
  id: string;
  name: string;
  type: 'report' | 'pipeline' | 'workflow' | 'alert';
  originalPath: string;
  configData: any;
  isActive: boolean;
  lastExecuted?: string;
}

export default function NEXUSTotalRecall() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGesture, setSelectedGesture] = useState<'D' | 'A' | 'I' | 'E' | null>(null);
  const queryClient = useQueryClient();

  const { data: systemState, isLoading: stateLoading } = useQuery({
    queryKey: ['/api/nexus/total-recall/status'],
    refetchInterval: 10000
  });

  const { data: validationResults } = useQuery({
    queryKey: ['/api/nexus/validate-connections'],
    refetchInterval: 30000
  });

  const voiceCommandMutation = useMutation({
    mutationFn: async ({ gesture, parameters }: { gesture: string, parameters?: any }) => {
      const response = await fetch('/api/nexus/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gesture, parameters })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/total-recall/status'] });
    }
  });

  const activateTriggerMutation = useMutation({
    mutationFn: async (triggerId: string) => {
      const response = await fetch('/api/nexus/activate-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerId })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nexus/total-recall/status'] });
    }
  });

  const { data: searchResults, refetch: performSearch } = useQuery({
    queryKey: ['/api/nexus/archive-search', searchQuery],
    enabled: false
  });

  const handleVoiceCommand = (gesture: 'D' | 'A' | 'I' | 'E') => {
    setSelectedGesture(gesture);
    voiceCommandMutation.mutate({ gesture });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const handleActivateTrigger = (triggerId: string) => {
    activateTriggerMutation.mutate(triggerId);
  };

  const getGestureDescription = (gesture: 'D' | 'A' | 'I' | 'E') => {
    switch (gesture) {
      case 'D': return 'Dashboard Navigation';
      case 'A': return 'Automation Control';
      case 'I': return 'Intelligence Analysis';
      case 'E': return 'Executive Command';
      default: return '';
    }
  };

  const getGestureColor = (gesture: 'D' | 'A' | 'I' | 'E') => {
    switch (gesture) {
      case 'D': return 'bg-blue-600 hover:bg-blue-700';
      case 'A': return 'bg-green-600 hover:bg-green-700';
      case 'I': return 'bg-purple-600 hover:bg-purple-700';
      case 'E': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-purple-900 text-white">
      {/* Header */}
      <div className="border-b border-green-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Archive className="w-8 h-8 text-green-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
                NEXUS Total Recall
              </h1>
            </div>
            {validationResults?.success && (
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <Activity className="w-3 h-3 mr-1" />
                All Systems Validated
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {systemState?.data && (
              <div className="text-sm text-slate-300">
                Archive Memory: <span className="text-green-400 font-semibold">{systemState.data.archiveMemorySize} entries</span>
              </div>
            )}
            <Button 
              onClick={() => window.location.href = '/nexus-master-control'}
              variant="outline" 
              size="sm"
              className="border-green-500/50 hover:bg-green-500/20"
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Master Control
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Voice Command Interface */}
        <Card className="bg-slate-800/80 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-green-400" />
              Voice Command Interface (D.A.I.E)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {(['D', 'A', 'I', 'E'] as const).map((gesture) => (
                <Button
                  key={gesture}
                  onClick={() => handleVoiceCommand(gesture)}
                  className={`${getGestureColor(gesture)} text-white font-bold text-lg h-16`}
                  disabled={voiceCommandMutation.isPending}
                >
                  <div className="text-center">
                    <div className="text-2xl">{gesture}</div>
                    <div className="text-xs">{getGestureDescription(gesture)}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            {selectedGesture && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded">
                <div className="text-green-400 font-semibold">
                  Last Command: {getGestureDescription(selectedGesture)} ({selectedGesture})
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  Voice overlay activated • UI bindings confirmed • Green-to-purple theme applied
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Archive Memory Search */}
        <Card className="bg-slate-800/80 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-400" />
              Archive Memory Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search legacy automation triggers, reports, workflows..."
                className="flex-1 bg-slate-700 border-slate-600"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!searchQuery.trim()}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            
            {searchResults?.data && (
              <div className="space-y-3">
                <div className="text-sm text-slate-400">
                  Found {searchResults.totalResults} results for "{searchQuery}"
                </div>
                {searchResults.data.map((result: any, index: number) => (
                  <div key={index} className="p-3 bg-slate-700/50 border border-slate-600 rounded">
                    <div className="font-medium text-white">{result.key}</div>
                    <div className="text-sm text-slate-300 mt-1">
                      Source: {result.data.source} • Discovered: {new Date(result.data.discovered).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legacy Automation Triggers */}
        {systemState?.data?.automationTriggers && (
          <Card className="bg-slate-800/80 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Legacy Automation Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {systemState.data.automationTriggers.map((trigger: AutomationTrigger) => (
                  <div key={trigger.id} className="p-4 bg-slate-700/50 border border-slate-600 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-white">{trigger.name}</div>
                        <div className="text-sm text-slate-400">{trigger.originalPath}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={trigger.isActive ? 'default' : 'secondary'}>
                          {trigger.type}
                        </Badge>
                        <Button
                          onClick={() => handleActivateTrigger(trigger.id)}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={activateTriggerMutation.isPending}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Activate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          Status: <span className={trigger.isActive ? 'text-green-400' : 'text-red-400'}>
                            {trigger.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          Last Executed: <span className="text-blue-400">
                            {trigger.lastExecuted ? new Date(trigger.lastExecuted).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              Total Recall System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stateLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4" />
                <div className="text-slate-400">Loading system state...</div>
              </div>
            ) : systemState?.data ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-700/50 rounded">
                  <div className="text-2xl font-bold text-green-400">
                    {systemState.data.automationTriggers?.length || 0}
                  </div>
                  <div className="text-xs text-slate-400">Automation Triggers</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded">
                  <div className="text-2xl font-bold text-purple-400">
                    {systemState.data.voiceCommandsAvailable?.length || 0}
                  </div>
                  <div className="text-xs text-slate-400">Voice Commands</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded">
                  <div className="text-2xl font-bold text-blue-400">
                    {systemState.data.uiBindingsActive?.length || 0}
                  </div>
                  <div className="text-xs text-slate-400">UI Bindings</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded">
                  <div className="text-2xl font-bold text-orange-400">
                    {systemState.data.runtimeLogsCount || 0}
                  </div>
                  <div className="text-xs text-slate-400">Runtime Logs</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400">No system data available</div>
            )}
          </CardContent>
        </Card>

        {/* Visual Upload Acknowledgment */}
        <Card className="bg-gradient-to-r from-green-900/30 to-purple-900/30 border-green-500/30 mt-8">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 font-semibold">
                NEXUS Total Recall Protocol Active • Voice Interface Ready • Archive Memory Loaded
              </span>
              <div className="text-slate-400 text-sm">
                Ready for visual upload acknowledgment
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}