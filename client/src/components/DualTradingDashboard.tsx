import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Play, Square, RotateCcw, Eye, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TradingComparison {
  simBalance: number;
  realBalance: number;
  simTrades: TradeRecord[];
  realTrades: TradeRecord[];
  divergence: number;
  performance: {
    simROI: number;
    realROI: number;
    accuracy: number;
  };
}

interface TradeRecord {
  timestamp: Date;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  amount: number;
  profit: number;
  confidence: number;
  type: 'SIM' | 'REAL';
}

interface DualTradingStatus {
  isRunning: boolean;
  comparison: TradingComparison;
  runtime: string;
}

export function DualTradingDashboard() {
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch trading status
  const { data: status, isLoading } = useQuery<DualTradingStatus>({
    queryKey: ['/api/dual-trading/status'],
    refetchInterval: 5000
  });

  // Start dual trading mutation
  const startTradingMutation = useMutation({
    mutationFn: () => fetch('/api/dual-trading/start', { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dual-trading/status'] });
    }
  });

  // Stop dual trading mutation
  const stopTradingMutation = useMutation({
    mutationFn: () => fetch('/api/dual-trading/stop', { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dual-trading/status'] });
    }
  });

  // Reset simulation mutation
  const resetSimMutation = useMutation({
    mutationFn: () => fetch('/api/dual-trading/reset', { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dual-trading/status'] });
      setResetConfirm(false);
    }
  });

  const handleStartTrading = () => {
    startTradingMutation.mutate();
  };

  const handleStopTrading = () => {
    stopTradingMutation.mutate();
  };

  const handleResetSim = () => {
    if (resetConfirm) {
      resetSimMutation.mutate();
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  // Performance chart data
  const performanceData = status?.comparison ? [
    {
      name: 'SIM',
      balance: status.comparison.simBalance,
      roi: status.comparison.performance.simROI,
      trades: status.comparison.simTrades.length
    },
    {
      name: 'REAL',
      balance: status.comparison.realBalance,
      roi: status.comparison.performance.realROI,
      trades: status.comparison.realTrades.length
    }
  ] : [];

  // Combined trades for timeline
  const allTrades = status?.comparison ? [
    ...status.comparison.simTrades.map(t => ({ ...t, timestamp: new Date(t.timestamp) })),
    ...status.comparison.realTrades.map(t => ({ ...t, timestamp: new Date(t.timestamp) }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SIM vs REAL Trading Comparison</h2>
          <p className="text-muted-foreground">Monitor model learning through simultaneous trading comparison</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleResetSim}
            variant={resetConfirm ? "destructive" : "outline"}
            size="sm"
            disabled={status?.isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {resetConfirm ? 'Confirm Reset' : 'Reset SIM'}
          </Button>
          {status?.isRunning ? (
            <Button
              onClick={handleStopTrading}
              variant="destructive"
              disabled={stopTradingMutation.isPending}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Trading
            </Button>
          ) : (
            <Button
              onClick={handleStartTrading}
              disabled={startTradingMutation.isPending}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Dual Trading
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trading Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${status?.isRunning ? 'bg-green-500' : 'bg-slate-400'}`} />
              <span className="text-lg font-bold">{status?.isRunning ? 'ACTIVE' : 'STOPPED'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Runtime: {status?.runtime || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SIM Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {status?.comparison ? formatCurrency(status.comparison.simBalance) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {status?.comparison?.performance.simROI !== undefined && (
                <>
                  {status.comparison.performance.simROI >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {formatPercentage(status.comparison.performance.simROI)}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">REAL Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {status?.comparison ? formatCurrency(status.comparison.realBalance) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {status?.comparison?.performance.realROI !== undefined && (
                <>
                  {status.comparison.performance.realROI >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {formatPercentage(status.comparison.performance.realROI)}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.comparison ? `${status.comparison.performance.accuracy.toFixed(1)}%` : '0%'}
            </div>
            <div className="mt-2">
              <Progress 
                value={status?.comparison?.performance.accuracy || 0} 
                className="h-2" 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Divergence: {status?.comparison ? `${status.comparison.divergence.toFixed(2)}%` : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>SIM vs REAL trading performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'balance' ? formatCurrency(value as number) : 
                    name === 'roi' ? formatPercentage(value as number) : value,
                    name === 'balance' ? 'Balance' : 
                    name === 'roi' ? 'ROI' : 'Trades'
                  ]}
                />
                <Bar dataKey="balance" fill="hsl(var(--chart-2))" name="balance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="trades" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Combined SIM and REAL trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTrades.slice(0, 10).map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">
                        {trade.timestamp.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'SIM' ? 'secondary' : 'default'}>
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.action === 'BUY' ? 'default' : 'secondary'}>
                          {trade.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{formatCurrency(trade.price)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(trade.amount)}</TableCell>
                      <TableCell className={`font-mono ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(trade.profit)}
                      </TableCell>
                      <TableCell>
                        <Progress value={trade.confidence * 100} className="w-16 h-2" />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Trade Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {trade.type} trade
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Type</label>
                                  <p className="text-sm text-muted-foreground">{trade.type}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Symbol</label>
                                  <p className="text-sm text-muted-foreground">{trade.symbol}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Action</label>
                                  <p className="text-sm text-muted-foreground">{trade.action}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Price</label>
                                  <p className="text-sm text-muted-foreground">{formatCurrency(trade.price)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <p className="text-sm text-muted-foreground">{formatCurrency(trade.amount)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Profit/Loss</label>
                                  <p className={`text-sm ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(trade.profit)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Confidence</label>
                                  <p className="text-sm text-muted-foreground">{(trade.confidence * 100).toFixed(1)}%</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Timestamp</label>
                                  <p className="text-sm text-muted-foreground">{trade.timestamp.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {allTrades.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No trades executed yet. Start dual trading to see results.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Learning Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Performance Gap</h4>
                  <p className="text-sm text-muted-foreground">
                    SIM vs REAL divergence indicates areas for model improvement
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={status?.comparison ? Math.min(status.comparison.divergence * 10, 100) : 0} 
                      className="h-2" 
                    />
                    <p className="text-xs mt-1">
                      {status?.comparison ? `${status.comparison.divergence.toFixed(2)}% divergence` : 'No data'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Trade Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    Percentage of matching profit/loss outcomes
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={status?.comparison?.performance.accuracy || 0} 
                      className="h-2" 
                    />
                    <p className="text-xs mt-1">
                      {status?.comparison ? `${status.comparison.performance.accuracy.toFixed(1)}% accuracy` : 'No data'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Risk Alerts</span>
                </div>
                
                {status?.comparison && status.comparison.realBalance < 100 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Real balance approaching minimum threshold ($100)
                    </p>
                  </div>
                )}
                
                {status?.comparison && status.comparison.divergence > 20 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      High divergence detected - model may need recalibration
                    </p>
                  </div>
                )}
                
                {(!status?.comparison || status.comparison.performance.accuracy < 60) && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Low accuracy - consider extending learning period
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Configuration</CardTitle>
              <CardDescription>Manage dual trading parameters and safety settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">SIM Starting Balance</label>
                  <p className="text-sm text-muted-foreground">$150.00</p>
                </div>
                <div>
                  <label className="text-sm font-medium">REAL Starting Balance</label>
                  <p className="text-sm text-muted-foreground">Auto-detected from browser</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Trade Size (SIM)</label>
                  <p className="text-sm text-muted-foreground">$50.00 (10% of balance)</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Trade Size (REAL)</label>
                  <p className="text-sm text-muted-foreground">$25.00 (5% of balance)</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Stop Loss</label>
                  <p className="text-sm text-muted-foreground">$100.00 minimum balance</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Trading Interval</label>
                  <p className="text-sm text-muted-foreground">30 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}