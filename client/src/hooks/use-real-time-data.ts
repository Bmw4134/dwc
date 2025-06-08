import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, type DashboardStats } from '@/lib/api';

export function useRealTimeData(intervalMs: number = 30000) {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await dashboardApi.getRealTimeMetrics();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, intervalMs);
    
    return () => clearInterval(interval);
  }, [fetchData, intervalMs]);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData,
  };
}

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);

  return {
    socket,
    messages,
    isConnected,
    sendMessage,
  };
}

export function useLeadUpdates() {
  const [leadUpdates, setLeadUpdates] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate real-time lead updates
    const interval = setInterval(() => {
      const updateTypes = [
        'new_lead_identified',
        'lead_qualification_updated', 
        'automation_score_calculated',
        'contact_attempt_logged'
      ];
      
      const randomUpdate = {
        id: Date.now(),
        type: updateTypes[Math.floor(Math.random() * updateTypes.length)],
        timestamp: new Date().toISOString(),
        data: {
          leadName: `Business ${Math.floor(Math.random() * 1000)}`,
          zipCode: '76140',
          automationScore: Math.floor(Math.random() * 40) + 60,
        }
      };
      
      setLeadUpdates(prev => [randomUpdate, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return leadUpdates;
}

export function useAIInsights() {
  const [insights, setInsights] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate AI-generated insights
    const insightTemplates = [
      {
        type: 'pattern',
        title: 'Healthcare Conversion Trending Up',
        description: 'Healthcare leads showing 35% higher conversion rate this month',
        priority: 'medium',
      },
      {
        type: 'recommendation',
        title: 'Expand ZIP Code Coverage',
        description: 'ZIP 76116 shows similar demographics to 76140. Consider expansion.',
        priority: 'high',
      },
      {
        type: 'alert',
        title: 'Follow-up Required',
        description: '3 high-priority leads haven\'t been contacted in 7 days',
        priority: 'high',
      },
    ];
    
    const interval = setInterval(() => {
      const randomInsight = {
        ...insightTemplates[Math.floor(Math.random() * insightTemplates.length)],
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      
      setInsights(prev => [randomInsight, ...prev.slice(0, 2)]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return insights;
}
