import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Activity, TrendingUp, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ChartSignal {
  timestamp: string;
  signal_type: string;
  confidence: number;
  price_level: number;
  volume_spike: boolean;
  trend_direction: string;
}

export default function ChartView() {
  const [isRecording, setIsRecording] = useState(false);
  const [signalsDetected, setSignalsDetected] = useState<ChartSignal[]>([]);
  const tradingViewRef = useRef<HTMLDivElement>(null);

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['/api/chart/signals'],
    refetchInterval: 5000
  });

  const { data: viewMetrics } = useQuery({
    queryKey: ['/api/multiview/chart/metrics'],
    refetchInterval: 1000
  });

  useEffect(() => {
    // Initialize TradingView widget
    if (tradingViewRef.current && !tradingViewRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#000000",
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: false,
        studies: [
          "RSI@tv-basicstudies",
          "MACD@tv-basicstudies",
          "Volume@tv-basicstudies"
        ],
        container_id: "tradingview_chart"
      });
      
      tradingViewRef.current.appendChild(script);
    }
  }, []);

  const startSignalRecording = async () => {
    setIsRecording(true);
    try {
      const response = await fetch('/api/multiview/chart/start-recording', {
        method: 'POST'
      });
      const result = await response.json();
      console.log('Signal recording started:', result);
    } catch (error) {
      console.error('Failed to start signal recording:', error);
    }
  };

  const stopSignalRecording = async () => {
    setIsRecording(false);
    try {
      const response = await fetch('/api/multiview/chart/stop-recording', {
        method: 'POST'
      });
      const result = await response.json();
      console.log('Signal recording stopped:', result);
    } catch (error) {
      console.error('Failed to stop signal recording:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chart Intelligence View</h1>
            <p className="text-gray-300">Live TradingView integration with AI signal detection</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isRecording ? "destructive" : "secondary"}>
              {isRecording ? "Recording Signals" : "Standby"}
            </Badge>
            <Button 
              onClick={isRecording ? stopSignalRecording : startSignalRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Signal Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {viewMetrics?.confidence || 0}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Signals Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {viewMetrics?.signals_count || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-yellow-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                ${viewMetrics?.current_price || "Loading..."}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Trend Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-5 h-5 ${viewMetrics?.trend === 'bullish' ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-white font-bold">
                  {viewMetrics?.trend || "Neutral"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live BTC/USDT Chart</CardTitle>
                <CardDescription className="text-gray-400">
                  TradingView embedded chart with AI signal overlay
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  ref={tradingViewRef}
                  id="tradingview_chart"
                  className="h-[600px] w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Signal Detection Panel */}
          <div className="space-y-4">
            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Live Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {chartData?.signals?.slice(0, 5).map((signal: ChartSignal, index: number) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="text-xs">
                        {signal.signal_type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(signal.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-white">
                      Price: ${signal.price_level}
                    </div>
                    <div className="text-xs text-gray-300">
                      Confidence: {signal.confidence}% | Trend: {signal.trend_direction}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    No signals detected yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Learning Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pattern Recognition</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Volume Analysis</span>
                    <Badge variant="secondary">Learning</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Trend Detection</span>
                    <Badge variant="secondary">Optimizing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}