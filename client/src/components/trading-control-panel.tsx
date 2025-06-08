import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, BarChart3, Download, Zap, Target } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function TradingControlPanel() {
  const [showReport, setShowReport] = useState(false);
  const queryClient = useQueryClient();

  // Get current trading status
  const { data: status } = useQuery({
    queryKey: ['/api/pionex/status'],
    refetchInterval: 2000
  });

  // Get session report
  const { data: sessionReport } = useQuery({
    queryKey: ['/api/trading/session-report'],
    enabled: showReport,
    refetchInterval: showReport ? 5000 : false
  });

  // Start trading mutation
  const startTrading = useMutation({
    mutationFn: () => apiRequest('/api/trading/start', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    }
  });

  // Stop trading mutation
  const stopTrading = useMutation({
    mutationFn: () => apiRequest('/api/trading/stop', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    }
  });

  // Activate transcendent trading
  const activateTranscendent = useMutation({
    mutationFn: () => apiRequest('/api/pionex/activate', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    }
  });

  const downloadSessionReport = () => {
    if (sessionReport) {
      const dataStr = JSON.stringify(sessionReport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trading-session-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const isActive = status?.active;
  const balance = status?.balance || 150.49;

  return (
    <div className="space-y-6">
      {/* Main Control Panel */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Trading Control Center
            </span>
            <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600" : ""}>
              {isActive ? "ACTIVE" : "STOPPED"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Balance Display */}
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-slate-400">Current Balance</p>
              <p className="text-2xl font-bold text-green-400">
                ${balance.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">
                Target: ${status?.target?.toLocaleString() || '1,000'}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col gap-2">
              {!isActive ? (
                <>
                  <Button
                    onClick={() => startTrading.mutate()}
                    disabled={startTrading.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {startTrading.isPending ? 'Starting...' : 'Start Trading'}
                  </Button>
                  <Button
                    onClick={() => activateTranscendent.mutate()}
                    disabled={activateTranscendent.isPending}
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    {activateTranscendent.isPending ? 'Activating...' : 'TRANSCENDENT MODE'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => stopTrading.mutate()}
                  disabled={stopTrading.isPending}
                  variant="destructive"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  {stopTrading.isPending ? 'Stopping...' : 'Stop Trading'}
                </Button>
              )}
            </div>

            {/* Session Report */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setShowReport(!showReport)}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showReport ? 'Hide Report' : 'Session Report'}
              </Button>
              {sessionReport && (
                <Button
                  onClick={downloadSessionReport}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-400"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Report Display */}
      {showReport && sessionReport && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Session Report
              <Badge variant="outline" className="ml-2">
                Live Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Session Stats */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300">Session Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white">{sessionReport.duration?.toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Balance:</span>
                    <span className="text-white">${sessionReport.startBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Balance:</span>
                    <span className="text-green-400">${sessionReport.currentBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Profit:</span>
                    <span className={sessionReport.profit >= 0 ? "text-green-400" : "text-red-400"}>
                      {sessionReport.profit >= 0 ? '+' : ''}${sessionReport.profit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ROI:</span>
                    <span className="text-blue-400">{sessionReport.roi}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Trades:</span>
                    <span className="text-white">{sessionReport.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Win Rate:</span>
                    <span className="text-green-400">{sessionReport.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Profit/Trade:</span>
                    <span className="text-purple-400">${sessionReport.performance?.profitPerTrade}</span>
                  </div>
                </div>
              </div>

              {/* Strategy */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300">Strategy</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current:</span>
                    <Badge variant="outline" className="text-xs">
                      {sessionReport.strategy}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Level:</span>
                    <span className="text-yellow-400">{sessionReport.riskLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge variant={sessionReport.tradingActive ? "default" : "secondary"}>
                      {sessionReport.tradingActive ? "ACTIVE" : "STOPPED"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Success Rate */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-300">Trade Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Successful:</span>
                    <span className="text-green-400">{sessionReport.performance?.successfulTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Failed:</span>
                    <span className="text-red-400">{sessionReport.performance?.failedTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Interval:</span>
                    <span className="text-blue-400">{sessionReport.performance?.avgTradeInterval}s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Trades */}
            {sessionReport.tradingHistory && sessionReport.tradingHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-slate-300 mb-3">Recent Trades</h4>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {sessionReport.tradingHistory.slice(-5).map((trade: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">{trade.timestamp}</span>
                        <span className="text-slate-300">{trade.action}</span>
                        <span className={trade.profit >= 0 ? "text-green-400" : "text-red-400"}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit?.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}