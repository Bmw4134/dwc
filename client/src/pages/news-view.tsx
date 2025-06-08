import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Newspaper, TrendingUp, TrendingDown, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  published_at: string;
  sentiment_score: number;
  sentiment_label: string;
  relevance_score: number;
  keywords: string[];
}

interface SentimentData {
  overall_sentiment: number;
  fear_greed_index: number;
  reddit_sentiment: number;
  news_sentiment: number;
  social_volume: number;
}

export default function NewsView() {
  const [isMonitoring, setIsMonitoring] = useState(false);

  const { data: newsData } = useQuery({
    queryKey: ['/api/news/feed'],
    refetchInterval: 60000 // 60 seconds
  });

  const { data: sentimentData } = useQuery({
    queryKey: ['/api/news/sentiment'],
    refetchInterval: 30000 // 30 seconds
  });

  const { data: newsMetrics } = useQuery({
    queryKey: ['/api/multiview/news/metrics'],
    refetchInterval: 10000 // 10 seconds
  });

  const startNewsMonitoring = async () => {
    setIsMonitoring(true);
    try {
      await fetch('/api/multiview/news/start-monitoring', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to start news monitoring:', error);
    }
  };

  const stopNewsMonitoring = async () => {
    setIsMonitoring(false);
    try {
      await fetch('/api/multiview/news/stop-monitoring', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to stop news monitoring:', error);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-400';
    if (score < -0.1) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.1) return <TrendingUp className="w-4 h-4" />;
    if (score < -0.1) return <TrendingDown className="w-4 h-4" />;
    return <Heart className="w-4 h-4" />;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const published = new Date(timestamp);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMinutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">News Intelligence View</h1>
            <p className="text-gray-300">Live sentiment analysis from Reddit, NewsAPI, and Fear & Greed Index</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={isMonitoring ? "destructive" : "secondary"}>
              {isMonitoring ? "Monitoring Active" : "Standby"}
            </Badge>
            <Button 
              onClick={isMonitoring ? stopNewsMonitoring : startNewsMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
            >
              <Newspaper className="w-4 h-4 mr-2" />
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
          </div>
        </div>

        {/* Sentiment Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-black/20 border-orange-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Overall Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSentimentColor(sentimentData?.overall_sentiment || 0)}`}>
                {sentimentData?.overall_sentiment?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Fear & Greed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {sentimentData?.fear_greed_index || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Reddit Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSentimentColor(sentimentData?.reddit_sentiment || 0)}`}>
                {sentimentData?.reddit_sentiment?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">News Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSentimentColor(sentimentData?.news_sentiment || 0)}`}>
                {sentimentData?.news_sentiment?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Social Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {sentimentData?.social_volume || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Trend */}
        <Card className="bg-black/20 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-white">Market Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Overall Market Mood</span>
                <div className="flex items-center space-x-2">
                  {getSentimentIcon(sentimentData?.overall_sentiment || 0)}
                  <span className={getSentimentColor(sentimentData?.overall_sentiment || 0)}>
                    {sentimentData?.overall_sentiment > 0.1 ? 'Bullish' :
                     sentimentData?.overall_sentiment < -0.1 ? 'Bearish' : 'Neutral'}
                  </span>
                </div>
              </div>
              <Progress 
                value={Math.max(0, Math.min(100, ((sentimentData?.overall_sentiment || 0) + 1) * 50))}
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Newspaper className="w-5 h-5 mr-2" />
                Live News Feed
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time crypto and market news with sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {newsData?.articles?.map((article: NewsItem) => (
                  <div key={article.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.source}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {getSentimentIcon(article.sentiment_score)}
                        <span className={`text-xs ${getSentimentColor(article.sentiment_score)}`}>
                          {article.sentiment_label}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{formatTimeAgo(article.published_at)}</span>
                      <span>Relevance: {Math.round(article.relevance_score * 100)}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.keywords?.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <Newspaper className="w-8 h-8 mx-auto mb-2" />
                    No news articles loaded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Panel */}
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Sentiment Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                AI-powered market sentiment indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* News Source Breakdown */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">News Source Sentiment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">CoinDesk</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-green-400 text-sm">+0.25</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">CryptoPanic</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={60} className="w-20 h-2" />
                        <span className="text-yellow-400 text-sm">+0.10</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Reddit</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-red-400 text-sm">-0.05</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyword Trends */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Trending Keywords</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Bitcoin', 'Ethereum', 'Bull Run', 'DeFi', 'NFT', 'Regulation'].map((keyword, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-800/50 rounded">
                        <span className="text-gray-300 text-sm">{keyword}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 100)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Mood Indicator */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Market Mood</h4>
                  <div className="p-4 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Extreme Fear</span>
                      <span className="text-sm text-gray-300">Extreme Greed</span>
                    </div>
                    <div className="relative">
                      <Progress value={sentimentData?.fear_greed_index || 50} className="h-3" />
                      <div 
                        className="absolute top-0 w-1 h-3 bg-white"
                        style={{ left: `${sentimentData?.fear_greed_index || 50}%` }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-lg font-bold text-white">
                        {sentimentData?.fear_greed_index || 50}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}