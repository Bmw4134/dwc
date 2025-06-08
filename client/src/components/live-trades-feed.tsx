import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";

export default function LiveTradesFeed() {
  const { data: status } = useQuery({
    queryKey: ["/api/pionex/status"],
    refetchInterval: 1000, // Ultra-fast refresh for live trades
    refetchIntervalInBackground: true
  });

  const trades = status?.recentTrades || [];
  const allTrades = status?.tradingHistory || [];

  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-emerald-400 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Live Trades Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {allTrades.slice(-15).reverse().map((trade, index) => {
              const isProfit = trade.profit > 0;
              const timeAgo = Math.floor((Date.now() - trade.timestamp) / 1000);
              
              return (
                <div
                  key={trade.id || index}
                  className={`p-3 rounded-lg border-l-4 transition-all duration-300 ${
                    isProfit 
                      ? 'bg-emerald-900/20 border-l-emerald-500' 
                      : 'bg-red-900/20 border-l-red-500'
                  } ${index === 0 ? 'animate-pulse' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {isProfit ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium text-white">
                        {trade.pair || 'BTC/USDT'}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          trade.side === 'buy' 
                            ? 'border-emerald-500 text-emerald-400' 
                            : 'border-red-500 text-red-400'
                        }`}
                      >
                        {trade.side?.toUpperCase() || 'BUY'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="h-3 w-3" />
                      {timeAgo < 60 ? `${timeAgo}s` : `${Math.floor(timeAgo / 60)}m`}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span className={`font-bold ${
                        isProfit ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isProfit ? '+' : ''}${trade.profit?.toFixed(3)}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        Signal: {trade.signal || 'BULLISH_MOMENTUM'}
                      </div>
                      <div className="text-xs text-slate-500">
                        Confidence: {((trade.confidence || 0.75) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  {trade.strategy && (
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <Badge variant="secondary" className="text-xs">
                        {trade.strategy}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
            
            {allTrades.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Waiting for trades...</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Live Stats Footer */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-500">
                {status?.tradeCount || 0}
              </div>
              <div className="text-xs text-slate-400">Total Trades</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {status?.winRate?.toFixed(0) || 0}%
              </div>
              <div className="text-xs text-slate-400">Win Rate</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                (status?.totalProfit || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                ${status?.totalProfit?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-slate-400">Total Profit</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}