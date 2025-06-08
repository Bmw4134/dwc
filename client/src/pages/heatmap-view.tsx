import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Cpu, Database, Scan, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface OrderBookData {
  bids: Array<{ price: number; size: number; total: number }>;
  asks: Array<{ price: number; size: number; total: number }>;
  spread: number;
  depth_analysis: {
    support_levels: number[];
    resistance_levels: number[];
    liquidity_score: number;
  };
}

interface DOMSignal {
  timestamp: string;
  signal_type: string;
  price_level: number;
  volume_detected: number;
  confidence: number;
  exchange: string;
}

export default function HeatmapView() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['/api/heatmap/orderbook'],
    refetchInterval: 2000
  });

  const { data: domSignals } = useQuery({
    queryKey: ['/api/heatmap/dom-signals'],
    refetchInterval: 1000
  });

  const { data: scanMetrics } = useQuery({
    queryKey: ['/api/multiview/heatmap/metrics'],
    refetchInterval: 500
  });

  const startDOMScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const response = await fetch('/api/multiview/heatmap/start-scan', {
        method: 'POST'
      });
      const result = await response.json();
      
      // Simulate progress
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      
    } catch (error) {
      console.error('Failed to start DOM scan:', error);
      setIsScanning(false);
    }
  };

  const stopDOMScan = async () => {
    setIsScanning(false);
    setScanProgress(0);
    
    try {
      await fetch('/api/multiview/heatmap/stop-scan', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to stop DOM scan:', error);
    }
  };

  const renderOrderBookHeatmap = (data: OrderBookData) => {
    if (!data) return null;

    const maxVolume = Math.max(
      ...data.bids.map(b => b.size),
      ...data.asks.map(a => a.size)
    );

    return (
      <div className="space-y-4">
        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-red-400 mb-2">ASKS (Sell Pressure)</h4>
          {data.asks.slice(0, 10).map((ask, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-16 text-xs text-red-400">${ask.price.toFixed(2)}</div>
              <div className="flex-1 relative h-6 bg-gray-800 rounded">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-500/60 rounded"
                  style={{ width: `${(ask.size / maxVolume) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center px-2 text-xs text-white">
                  {ask.size.toFixed(4)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spread Indicator */}
        <div className="flex items-center justify-center py-2 border-t border-b border-gray-600">
          <Badge variant="outline" className="text-yellow-400">
            Spread: ${data.spread.toFixed(2)}
          </Badge>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-green-400 mb-2">BIDS (Buy Pressure)</h4>
          {data.bids.slice(0, 10).map((bid, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-16 text-xs text-green-400">${bid.price.toFixed(2)}</div>
              <div className="flex-1 relative h-6 bg-gray-800 rounded">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500/60 rounded"
                  style={{ width: `${(bid.size / maxVolume) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center px-2 text-xs text-white">
                  {bid.size.toFixed(4)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Heatmap Intelligence View</h1>
            <p className="text-gray-300">Live DOM scanning and order book depth analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isScanning ? "destructive" : "secondary"}>
              {isScanning ? "Scanning DOM" : "Standby"}
            </Badge>
            <Button 
              onClick={isScanning ? stopDOMScan : startDOMScan}
              variant={isScanning ? "destructive" : "default"}
            >
              <Scan className="w-4 h-4 mr-2" />
              {isScanning ? "Stop Scan" : "Start DOM Scan"}
            </Button>
          </div>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <Card className="bg-black/20 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Cpu className="w-5 h-5 text-yellow-400 animate-pulse" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white">DOM Scanning Progress</span>
                    <span className="text-sm text-yellow-400">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Liquidity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {scanMetrics?.liquidity_score || 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">DOM Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {scanMetrics?.dom_signals_count || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Order Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {scanMetrics?.order_flow || "Neutral"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {scanMetrics?.anomalies_detected || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Book Heatmap */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Live Order Book Heatmap
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time depth analysis with volume visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                renderOrderBookHeatmap(heatmapData)
              )}
            </CardContent>
          </Card>

          {/* DOM Signals */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                DOM Signal Detection
              </CardTitle>
              <CardDescription className="text-gray-400">
                Automated detection of unusual order book patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {domSignals?.signals?.map((signal: DOMSignal, index: number) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          signal.signal_type === 'large_order' ? 'border-red-500 text-red-400' :
                          signal.signal_type === 'wall_detected' ? 'border-yellow-500 text-yellow-400' :
                          'border-blue-500 text-blue-400'
                        }`}
                      >
                        {signal.signal_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(signal.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-white">Price: ${signal.price_level}</div>
                      <div className="text-white">Volume: {signal.volume_detected}</div>
                      <div className="text-gray-300">Exchange: {signal.exchange}</div>
                      <div className="text-gray-300">Confidence: {signal.confidence}%</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <Scan className="w-8 h-8 mx-auto mb-2" />
                    No DOM signals detected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <Card className="bg-black/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Advanced DOM Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Support Levels</h4>
                <div className="space-y-2">
                  {heatmapData?.depth_analysis?.support_levels?.map((level: number, index: number) => (
                    <div key={index} className="flex justify-between p-2 bg-green-500/10 rounded">
                      <span className="text-green-400">${level.toFixed(2)}</span>
                      <Badge variant="outline" className="text-xs">Strong</Badge>
                    </div>
                  )) || <div className="text-gray-500">Calculating...</div>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Resistance Levels</h4>
                <div className="space-y-2">
                  {heatmapData?.depth_analysis?.resistance_levels?.map((level: number, index: number) => (
                    <div key={index} className="flex justify-between p-2 bg-red-500/10 rounded">
                      <span className="text-red-400">${level.toFixed(2)}</span>
                      <Badge variant="outline" className="text-xs">Strong</Badge>
                    </div>
                  )) || <div className="text-gray-500">Calculating...</div>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Market Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Liquidity</span>
                    <Badge variant="secondary">
                      {heatmapData?.depth_analysis?.liquidity_score > 70 ? 'High' : 
                       heatmapData?.depth_analysis?.liquidity_score > 40 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Volatility</span>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Trend Strength</span>
                    <Badge variant="secondary">Moderate</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}