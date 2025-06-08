import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  RefreshCw,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CoinbaseStatus {
  success: boolean;
  status: string;
  api_configured: boolean;
  api_type: string;
  account_balance?: number;
  active_currencies?: number;
  error?: string;
  credentials_required?: string[];
}

interface CryptoPrices {
  success: boolean;
  prices: {
    [key: string]: {
      price_usd: number;
      change_24h: number;
      timestamp: string;
    };
  };
  count: number;
}

interface AccountInfo {
  success: boolean;
  accounts_count: number;
  balances: {
    [key: string]: number;
  };
  total_usd_estimate: number;
}

export default function CoinbaseTradingPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: status, isLoading: statusLoading } = useQuery<CoinbaseStatus>({
    queryKey: ['/api/coinbase/status'],
    refetchInterval: 30000,
  });

  const { data: prices, isLoading: pricesLoading } = useQuery<CryptoPrices>({
    queryKey: ['/api/coinbase/prices'],
    refetchInterval: 10000,
    enabled: status?.api_configured,
  });

  const { data: account, isLoading: accountLoading } = useQuery<AccountInfo>({
    queryKey: ['/api/coinbase/account'],
    refetchInterval: 30000,
    enabled: status?.api_configured,
  });

  const testConnectionMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/coinbase/test-connection'),
    onSuccess: (data: any) => {
      if (data.success) {
        toast({
          title: "Connection Successful",
          description: "Coinbase API connected successfully",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.error || "Failed to connect to Coinbase",
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/coinbase/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to test connection",
        variant: "destructive",
      });
    },
  });

  const handleTestConnection = () => {
    setIsConnecting(true);
    testConnectionMutation.mutate();
    setTimeout(() => setIsConnecting(false), 2000);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    return amount.toFixed(8);
  };

  const formatPriceChange = (change: number) => {
    const isPositive = change > 0;
    return {
      value: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
      isPositive,
    };
  };

  if (statusLoading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
            <span className="text-slate-300">Loading Coinbase status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coinbase Status Card */}
      <Card className="bg-gradient-to-r from-orange-900/40 to-yellow-900/40 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-orange-400">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-400" />
              </div>
              Coinbase Trading Integration
            </div>
            <Badge 
              variant="outline" 
              className={`${
                status?.status === 'CONNECTED' 
                  ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                  : 'border-red-500/50 text-red-400 bg-red-500/10'
              }`}
            >
              {status?.status === 'CONNECTED' ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {status?.status || 'UNKNOWN'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!status?.api_configured ? (
            <div className="text-center space-y-4">
              <div className="text-orange-300">
                Coinbase API key required to enable trading functionality
              </div>
              <div className="text-sm text-slate-400">
                Required: COINBASE_API_KEY
              </div>
              <Button
                onClick={handleTestConnection}
                disabled={isConnecting || testConnectionMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isConnecting || testConnectionMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Activity className="w-4 h-4 mr-2" />
                )}
                Test Connection
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(status.account_balance || 0)}
                </div>
                <div className="text-sm text-slate-400">Account Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {status.active_currencies || 0}
                </div>
                <div className="text-sm text-slate-400">Active Currencies</div>
              </div>
              <div className="text-center">
                <Button
                  onClick={handleTestConnection}
                  disabled={isConnecting || testConnectionMutation.isPending}
                  size="sm"
                  variant="outline"
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                >
                  {isConnecting || testConnectionMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cryptocurrency Prices */}
      {status?.api_configured && (
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Live Cryptocurrency Prices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pricesLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-400 mr-2" />
                <span className="text-slate-300">Loading prices...</span>
              </div>
            ) : prices?.success ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(prices.prices).map(([currency, data]) => {
                  const change = formatPriceChange(data.change_24h);
                  return (
                    <div
                      key={currency}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-white">{currency}</div>
                        <div className={`flex items-center space-x-1 text-sm ${
                          change.isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {change.isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{change.value}</span>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-purple-400">
                        {formatCurrency(data.price_usd)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Last updated: {new Date(data.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                Failed to load cryptocurrency prices
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Account Holdings */}
      {status?.api_configured && account?.success && (
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Account Holdings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accountLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
                <span className="text-slate-300">Loading account data...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(account.total_usd_estimate)}
                  </div>
                  <div className="text-sm text-slate-400">Total Portfolio Value</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(account.balances).map(([currency, balance]) => (
                    <div
                      key={currency}
                      className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700/50"
                    >
                      <div className="font-semibold text-white mb-1">{currency}</div>
                      <div className="text-emerald-400 font-mono">
                        {formatCurrency(balance, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}