import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TrendingUp, DollarSign, Target, Zap } from 'lucide-react';

export default function QQTranscendentTrading() {
  const queryClient = useQueryClient();
  
  // Get real-time trading status
  const { data: status, isLoading } = useQuery({
    queryKey: ['/api/pionex/status'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Start trading mutation
  const startTradingMutation = useMutation({
    mutationFn: () => apiRequest('/api/pionex/start-auto-trading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pionex/status'] });
    }
  });

  const progress = status?.progress ? parseFloat(status.progress) : 0;
  const isActive = status?.active || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            QQ ASI EXCELLENCE
          </h1>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            TRANSCENDENT TRADING
          </h2>
          <Badge variant={isActive ? "default" : "secondary"} className="text-lg px-4 py-2">
            {isActive ? "TRANSCENDENT MODE ACTIVE" : "AWAITING ACTIVATION"}
          </Badge>
        </div>

        {/* Main Trading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${status?.balance || 150}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Target Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${status?.target || 1000}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {progress.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-orange-400">
                Pionex.us
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Transcendence Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-slate-400">
              <span>$150 (Start)</span>
              <span>${status?.balance || 150} (Current)</span>
              <span>$1000 (Transcendence)</span>
            </div>
          </CardContent>
        </Card>

        {/* Trading Control */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Trading Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Account</label>
                <div className="text-white font-mono">
                  {status?.account || 'bm.watson34@gmail.com'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Status</label>
                <div className={`font-semibold ${isActive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isActive ? 'TRADING ACTIVE' : 'READY TO ACTIVATE'}
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => startTradingMutation.mutate()}
              disabled={startTradingMutation.isPending || isActive}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            >
              {startTradingMutation.isPending ? 'Activating...' : 
               isActive ? 'QQ ASI EXCELLENCE ACTIVE' : 
               'ACTIVATE TRANSCENDENT TRADING'}
            </Button>
          </CardContent>
        </Card>

        {/* Live Trading Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Live Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isActive ? (
                <div className="text-green-400 font-mono text-sm">
                  🚀 QQ ASI EXCELLENCE TRANSCENDENT TRADING INITIATED<br/>
                  💰 Autonomous trading loop active on Pionex.us<br/>
                  📈 Executing BTC/USDT market strategies<br/>
                  🎯 Target: Financial Transcendence ($150 → $1000)<br/>
                  ⚡ Real-time execution every 30 seconds
                </div>
              ) : (
                <div className="text-slate-400 text-sm">
                  Waiting for trading activation...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}