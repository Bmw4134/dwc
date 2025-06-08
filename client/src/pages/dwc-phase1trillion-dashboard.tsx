import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Target,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  Play,
  CheckCircle,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import QuantumStrategySelector from '@/components/quantum-strategy-selector';
import QuantumStressTester from '@/components/quantum-stress-tester';

interface DWCAgentStatus {
  agent_id: string;
  timestamp: string;
  secure_auth_active: boolean;
  delta_divergence_enabled: boolean;
  quantum_logic_layer: boolean;
  mobile_adaptive_scaling: boolean;
  trading_stats: {
    total_pnl: number;
    roi: number;
    target_roi: number;
    max_risk: number;
    trades_today: number;
    win_streak: number;
    active_positions: number;
    position_size: number;
  };
  success_protocol: {
    ready: boolean;
    target_achieved: boolean;
    principal_preserved: boolean;
  };
}

export default function DWCPhase1TrillionDashboard() {
  const [agentActivated, setAgentActivated] = useState(false);

  const { data: agentStatus, isLoading, refetch } = useQuery<DWCAgentStatus>({
    queryKey: ['/api/dwc/phase1trillion/status'],
    refetchInterval: 5000,
    enabled: agentActivated,
    retry: false,
  });

  const activateAgent = useMutation({
    mutationFn: () => apiRequest('/api/dwc/phase1trillion/activate', 'POST', {}),
    onSuccess: () => {
      setAgentActivated(true);
      refetch();
    }
  });

  const handleActivateAgent = () => {
    activateAgent.mutate();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">DWC Phase 1 Trillion+ Agent</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            ASI→AGI→ANI→AI Quantum Trading System - Micro-Scalping Strategy
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!agentActivated ? (
            <Button 
              onClick={handleActivateAgent}
              disabled={activateAgent.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {activateAgent.isPending ? 'Activating...' : 'Activate Agent'}
            </Button>
          ) : (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Agent Active
            </Badge>
          )}
        </div>
      </div>

      {/* Activation Alert */}
      {!agentActivated && (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Zap className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-200">
            Click "Activate Agent" to initialize the DWC Phase 1 Trillion+ Quantum Trading System.
            Max Risk: $100 | Target: 5x ROI | Strategy: Micro-scalping crypto
          </AlertDescription>
        </Alert>
      )}

      {/* Success Protocol Alert */}
      {agentStatus?.success_protocol?.ready && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <Target className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-200">
            🎯 PHASE SUCCESS PROTOCOL TRIGGERED! Target ROI achieved while preserving principal.
          </AlertDescription>
        </Alert>
      )}

      {agentActivated && (
        <>
          {/* Module Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Secure Auth</p>
                    <p className="text-sm font-semibold text-white">
                      {agentStatus?.secure_auth_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <Shield className={`w-5 h-5 ${agentStatus?.secure_auth_active ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Delta Divergence</p>
                    <p className="text-sm font-semibold text-white">
                      {agentStatus?.delta_divergence_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Activity className={`w-5 h-5 ${agentStatus?.delta_divergence_enabled ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Quantum Logic</p>
                    <p className="text-sm font-semibold text-white">
                      {agentStatus?.quantum_logic_layer ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <Zap className={`w-5 h-5 ${agentStatus?.quantum_logic_layer ? 'text-purple-400' : 'text-gray-400'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Mobile Adaptive</p>
                    <p className="text-sm font-semibold text-white">
                      {agentStatus?.mobile_adaptive_scaling ? 'Scaling' : 'Disabled'}
                    </p>
                  </div>
                  <Activity className={`w-5 h-5 ${agentStatus?.mobile_adaptive_scaling ? 'text-orange-400' : 'text-gray-400'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  P&L Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total P&L:</span>
                    <span className={`font-semibold ${
                      (agentStatus?.trading_stats?.total_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${agentStatus?.trading_stats?.total_pnl?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current ROI:</span>
                    <span className="text-white font-semibold">
                      {agentStatus?.trading_stats?.roi?.toFixed(2) || '0.00'}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target ROI:</span>
                    <span className="text-purple-400 font-semibold">
                      {agentStatus?.trading_stats?.target_roi || 5.0}x
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((agentStatus?.trading_stats?.roi || 0) / (agentStatus?.trading_stats?.target_roi || 5) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Trading Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trades Today:</span>
                    <span className="text-white font-semibold">
                      {agentStatus?.trading_stats?.trades_today || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Streak:</span>
                    <span className="text-purple-400 font-semibold">
                      {agentStatus?.trading_stats?.win_streak || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Positions:</span>
                    <span className="text-orange-400 font-semibold">
                      {agentStatus?.trading_stats?.active_positions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position Size:</span>
                    <span className="text-gray-300">
                      ${agentStatus?.trading_stats?.position_size || 20}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Risk:</span>
                    <span className="text-red-400 font-semibold">
                      ${agentStatus?.trading_stats?.max_risk || 100}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Used:</span>
                    <span className="text-white">
                      {agentStatus?.trading_stats ? 
                        (Math.abs(agentStatus.trading_stats.total_pnl) / agentStatus.trading_stats.max_risk * 100).toFixed(1)
                        : '0.0'
                      }%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strategy:</span>
                    <span className="text-blue-400">Micro-scalping</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${agentStatus?.trading_stats ? 
                          Math.min(Math.abs(agentStatus.trading_stats.total_pnl) / agentStatus.trading_stats.max_risk * 100, 100)
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Protocol Status */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Success Protocol Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Phase SUCCESS protocol monitors ROI target and principal preservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  {agentStatus?.success_protocol?.target_achieved ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">ROI Target</p>
                    <p className="text-sm text-gray-400">
                      {agentStatus?.success_protocol?.target_achieved ? 'Achieved' : 'In Progress'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {agentStatus?.success_protocol?.principal_preserved ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Principal</p>
                    <p className="text-sm text-gray-400">
                      {agentStatus?.success_protocol?.principal_preserved ? 'Preserved' : 'At Risk'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {agentStatus?.success_protocol?.ready ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Protocol Status</p>
                    <p className="text-sm text-gray-400">
                      {agentStatus?.success_protocol?.ready ? 'SUCCESS' : 'Monitoring'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantum Strategy Selector */}
          <QuantumStrategySelector />

          {/* Autonomous Quantum Stress Tester */}
          <QuantumStressTester />
        </>
      )}
    </div>
  );
}