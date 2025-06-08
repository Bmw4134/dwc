import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, Target, ExternalLink } from 'lucide-react';

interface TradingStatus {
  active: boolean;
  currentBalance: number;
  targetBalance: number;
  progress: number;
  trades: number;
  pnl: number;
  loginRequired: boolean;
  canAutoStart: boolean;
}

export function PionexLiveTradingDashboard() {
  const [tradingStatus, setTradingStatus] = useState<TradingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [sweepResults, setSweepResults] = useState<any>(null);
  const [runningSweep, setRunningSweep] = useState(false);

  const fetchTradingStatus = async () => {
    try {
      const response = await fetch('/api/pionex/trading-status');
      const data = await response.json();
      if (data.success) {
        setTradingStatus({
          active: data.active,
          currentBalance: data.currentBalance,
          targetBalance: data.targetBalance,
          progress: data.progress,
          trades: data.trades,
          pnl: data.pnl,
          loginRequired: data.loginRequired,
          canAutoStart: data.canAutoStart
        });
        setLastUpdate(new Date());
      } else {
        // Set default status when API calls fail
        setTradingStatus({
          active: false,
          currentBalance: 0,
          targetBalance: 1000,
          progress: 0,
          trades: 0,
          pnl: 0,
          loginRequired: true,
          canAutoStart: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch trading status:', error);
    }
  };

  const openPionexLogin = async () => {
    try {
      const response = await fetch('/api/pionex/open-login', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        // Open Pionex login in new tab
        window.open(data.loginUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to open Pionex login:', error);
    }
  };

  const startLiveTrading = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pionex/start-live-trading', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchTradingStatus();
      } else {
        alert(`Trading start failed: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to start trading. Please ensure you have API keys configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopTrading = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pionex/stop-trading', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await fetchTradingStatus();
        alert(`Trading stopped. Final balance: $${data.finalBalance.toFixed(2)}`);
      }
    } catch (error) {
      alert('Failed to stop trading');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTradingStatus();
    const interval = setInterval(fetchTradingStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = tradingStatus ? Math.min(100, tradingStatus.progress) : 0;
  const isProfit = tradingStatus ? tradingStatus.pnl > 0 : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            PIONEX LIVE TRADING ENGINE
          </h2>
          <p className="text-gray-400 mt-1">Quantum Financial Transcendence System</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={openPionexLogin}
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Login to Pionex
          </Button>
          {tradingStatus?.active ? (
            <Button 
              onClick={stopTrading} 
              disabled={isLoading}
              variant="destructive"
            >
              <Activity className="w-4 h-4 mr-2" />
              Stop Trading
            </Button>
          ) : (
            <Button 
              onClick={startLiveTrading} 
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLoading ? 'Starting...' : 'Start Live Trading'}
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${tradingStatus?.currentBalance.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Target Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              ${tradingStatus?.targetBalance.toFixed(2) || '1000.00'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              {isProfit ? <TrendingUp className="w-4 h-4 mr-2" /> : <TrendingDown className="w-4 h-4 mr-2" />}
              P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}${tradingStatus?.pnl.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              variant={tradingStatus?.active ? "default" : "secondary"}
              className={tradingStatus?.active ? "bg-green-600" : "bg-gray-600"}
            >
              {tradingStatus?.active ? 'TRADING LIVE' : 'STOPPED'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Progress to $1000 Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>$150 Start</span>
            <span>{progressPercentage.toFixed(1)}% Complete</span>
            <span>$1000 Target</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              ${(tradingStatus?.targetBalance || 1000) - (tradingStatus?.currentBalance || 150)} to go
            </div>
            <div className="text-sm text-gray-400">
              {tradingStatus?.targetBalance && tradingStatus?.currentBalance 
                ? `${((tradingStatus.currentBalance / 150 - 1) * 100).toFixed(1)}% growth achieved`
                : 'Ready to start trading'
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Stats */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Live Trading Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">
                {tradingStatus?.trades || 0}
              </div>
              <div className="text-sm text-gray-400">Active Trades</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">
                {tradingStatus?.currentBalance ? ((tradingStatus.currentBalance / 150 - 1) * 100).toFixed(1) : '0.0'}%
              </div>
              <div className="text-sm text-gray-400">Total Return</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">
                {tradingStatus?.targetBalance && tradingStatus?.currentBalance 
                  ? Math.ceil((tradingStatus.targetBalance - tradingStatus.currentBalance) / 10)
                  : '85'
                }
              </div>
              <div className="text-sm text-gray-400">Est. Days to Target</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                QUANTUM
              </div>
              <div className="text-sm text-gray-400">AI Strategy</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Smart Instructions */}
      {!tradingStatus?.active && (
        <Card className={`${tradingStatus?.loginRequired ? 'border-yellow-600 bg-yellow-900/20' : 'border-green-600 bg-green-900/20'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${tradingStatus?.loginRequired ? 'text-yellow-400' : 'text-green-400'}`}>
              {tradingStatus?.loginRequired ? 'Login Required' : 'Ready to Trade'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tradingStatus?.loginRequired ? (
              <>
                <div className="text-sm text-gray-300">
                  <strong>Step 1:</strong> Click "Login to Pionex" to access your account with $150
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Step 2:</strong> Once logged in, the system will detect your session automatically
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Step 3:</strong> Click "Start Live Trading" to begin the quantum money printing
                </div>
                <div className="text-xs text-yellow-400 mt-3">
                  The system will automatically detect when you're logged in and enable trading features
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-300">
                  <strong>Status:</strong> Pionex session detected - ready for live trading
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Balance:</strong> ${tradingStatus?.currentBalance.toFixed(2)} available for trading
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Target:</strong> $1000 using quantum crypto strategies
                </div>
                <div className="text-xs text-green-400 mt-3">
                  Click "Start Live Trading" to begin automated profit generation
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}