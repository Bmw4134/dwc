import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target,
  TrendingUp,
  BarChart3,
  Zap,
  Play,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface QuantumStrategy {
  symbol: string;
  type: string;
  confidence: number;
  volatility_grade: string;
  risk_reward_ratio: number;
  expected_roi: number;
  position_size: number;
  stop_loss: number;
  take_profit: number;
  description: string;
  market_data: {
    price: number;
    change_24h: number;
    volatility: number;
    rsi: number;
    timestamp: string;
  };
}

interface StrategyResponse {
  success: boolean;
  strategies: QuantumStrategy[];
  intelligence_hierarchy: string;
  timestamp: string;
}

export default function QuantumStrategySelector() {
  const [selectedStrategy, setSelectedStrategy] = useState<QuantumStrategy | null>(null);
  const [tradeCount, setTradeCount] = useState(0);
  const queryClient = useQueryClient();

  const { data: strategiesData, isLoading, error } = useQuery<StrategyResponse>({
    queryKey: ['/api/quantum/strategies'],
    refetchInterval: 5000, // Update every 5 seconds
    retry: 1
  });

  const activateStrategy = useMutation({
    mutationFn: (strategy: QuantumStrategy) => 
      apiRequest('/api/quantum/strategies/activate', 'POST', {
        symbol: strategy.symbol,
        strategy_type: strategy.type,
        position_size: strategy.position_size
      }),
    onSuccess: () => {
      setTradeCount(prev => prev + 1);
      setSelectedStrategy(null);
      queryClient.invalidateQueries({ queryKey: ['/api/quantum/strategies'] });
    }
  });

  const handleActivateStrategy = (strategy: QuantumStrategy) => {
    activateStrategy.mutate(strategy);
  };

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'delta_divergence':
        return <Target className="w-5 h-5" />;
      case 'mean_reversion':
        return <BarChart3 className="w-5 h-5" />;
      case 'trend_follow':
        return <TrendingUp className="w-5 h-5" />;
      case 'momentum_scalp':
        return <Zap className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 75) return 'text-blue-400';
    if (confidence >= 65) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getVolatilityColor = (grade: string) => {
    switch (grade) {
      case 'LOW': return 'bg-green-500/20 text-green-300';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-300';
      case 'HIGH': return 'bg-yellow-500/20 text-yellow-300';
      case 'EXTREME': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const shouldShowRebalanceAlert = tradeCount >= 5;

  if (error) {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-200">
          Unable to load quantum strategies. Please ensure PERPLEXITY_API_KEY is configured.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Quantum Strategy Selector</h2>
          <p className="text-gray-400">
            {strategiesData?.intelligence_hierarchy || 'ASI→AGI→ANI→AI'} Real-time Market Analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          <Badge className="bg-purple-600">
            Trades: {tradeCount}/5
          </Badge>
        </div>
      </div>

      {/* AI Rebalancing Alert */}
      {shouldShowRebalanceAlert && (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <Zap className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-200">
            🔄 AI REBALANCING TRIGGERED: 5 trades completed. System optimizing risk allocation...
          </AlertDescription>
        </Alert>
      )}

      {/* Strategy Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-700 animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategiesData?.strategies?.slice(0, 9).map((strategy, index) => (
            <Card 
              key={`${strategy.symbol}-${strategy.type}-${index}`}
              className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedStrategy(strategy)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {getStrategyIcon(strategy.type)}
                    {strategy.symbol}
                  </CardTitle>
                  <Badge className={getVolatilityColor(strategy.volatility_grade)}>
                    {strategy.volatility_grade}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 capitalize">
                  {strategy.type.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Confidence:</span>
                    <span className={`font-bold ml-1 ${getConfidenceColor(strategy.confidence)}`}>
                      {strategy.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">ROI:</span>
                    <span className="text-green-400 font-bold ml-1">
                      {strategy.expected_roi.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">R/R:</span>
                    <span className="text-blue-400 font-bold ml-1">
                      {strategy.risk_reward_ratio}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white font-bold ml-1">
                      ${strategy.position_size.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Price: ${strategy.market_data?.price?.toFixed(2)} 
                  <span className={strategy.market_data?.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                    ({strategy.market_data?.change_24h >= 0 ? '+' : ''}{strategy.market_data?.change_24h?.toFixed(2)}%)
                  </span>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivateStrategy(strategy);
                  }}
                  disabled={activateStrategy.isPending || strategy.position_size > 100}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  size="sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  {activateStrategy.isPending ? 'Activating...' : '1-Click Activate'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedStrategy(null)}>
          <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getStrategyIcon(selectedStrategy.type)}
                {selectedStrategy.symbol} - {selectedStrategy.type.replace('_', ' ').toUpperCase()}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedStrategy.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className={`font-bold ${getConfidenceColor(selectedStrategy.confidence)}`}>
                      {selectedStrategy.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected ROI:</span>
                    <span className="text-green-400 font-bold">
                      {selectedStrategy.expected_roi.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk/Reward:</span>
                    <span className="text-blue-400 font-bold">
                      {selectedStrategy.risk_reward_ratio}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position Size:</span>
                    <span className="text-white font-bold">
                      ${selectedStrategy.position_size.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-red-400">
                      ${selectedStrategy.stop_loss.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Take Profit:</span>
                    <span className="text-green-400">
                      ${selectedStrategy.take_profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-2">Market Data</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Price:</span>
                    <span className="text-white">${selectedStrategy.market_data?.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change:</span>
                    <span className={selectedStrategy.market_data?.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {selectedStrategy.market_data?.change_24h >= 0 ? '+' : ''}{selectedStrategy.market_data?.change_24h?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility:</span>
                    <span className="text-yellow-400">{selectedStrategy.market_data?.volatility?.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">RSI:</span>
                    <span className="text-purple-400">{selectedStrategy.market_data?.rsi?.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleActivateStrategy(selectedStrategy)}
                  disabled={activateStrategy.isPending || selectedStrategy.position_size > 100}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {activateStrategy.isPending ? 'Activating...' : 'Activate Strategy'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedStrategy(null)}
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>

              {selectedStrategy.position_size > 100 && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">
                    Position size exceeds $100 risk limit. Strategy cannot be activated.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Management Summary */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Risk Management Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Max Risk:</span>
              <span className="text-white font-bold">$100</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Stop-Loss:</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Auto-Rebalance:</span>
              <span className="text-blue-400">{tradeCount >= 5 ? 'Active' : 'Standby'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Update Freq:</span>
              <span className="text-blue-400">5 seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}