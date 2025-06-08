import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Terminal, 
  RefreshCw, 
  Download,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  module: string;
  message: string;
  data?: any;
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time logs from the system
  useEffect(() => {
    const generateLogs = () => {
      const modules = ['NEXUS Observer', 'DW System', 'Watson Bridge', 'Pionex Sync', 'UltraDev Engine', 'Total Recall'];
      const levels: LogEntry['level'][] = ['info', 'warn', 'error', 'debug'];
      const messages = [
        'System health check completed',
        'Automation linkage verified at 100%',
        'Observer monitoring active',
        'Human simulation ready',
        'API endpoint responding normally',
        'Memory usage within normal parameters',
        'Network latency optimized',
        'Voice command interface active',
        'UI bindings synchronized',
        'Runtime kernel linked successfully'
      ];

      const newLog: LogEntry = {
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [newLog, ...prev.slice(0, 499)]); // Keep last 500 logs
    };

    // Initial logs
    for (let i = 0; i < 20; i++) {
      generateLogs();
    }

    // Auto-refresh interval
    if (autoRefresh) {
      const interval = setInterval(generateLogs, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter logs
  useEffect(() => {
    let filtered = logs;
    
    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }
    
    if (filterModule !== 'all') {
      filtered = filtered.filter(log => log.module === filterModule);
    }
    
    setFilteredLogs(filtered);
  }, [logs, filterLevel, filterModule]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'debug': return <Terminal className="w-4 h-4 text-gray-400" />;
      default: return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      error: 'bg-red-500/20 text-red-400',
      warn: 'bg-yellow-500/20 text-yellow-400',
      info: 'bg-blue-500/20 text-blue-400',
      debug: 'bg-gray-500/20 text-gray-400'
    };
    return colors[level] || colors.info;
  };

  const uniqueModules = [...new Set(logs.map(log => log.module))];

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-bold text-green-300">System Runtime Logs</h1>
              <p className="text-green-400/70 font-mono text-sm">Real-time monitoring and debugging interface</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`border-green-500/20 ${autoRefresh ? 'text-green-300 bg-green-500/10' : 'text-green-400'}`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/20 text-green-400 hover:bg-green-500/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Total Logs</p>
                  <p className="text-2xl font-bold text-green-300">{logs.length}</p>
                </div>
                <Terminal className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Errors</p>
                  <p className="text-2xl font-bold text-red-400">
                    {logs.filter(log => log.level === 'error').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {logs.filter(log => log.level === 'warn').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400/70 text-sm">Active Modules</p>
                  <p className="text-2xl font-bold text-green-300">{uniqueModules.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-300 flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Log Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="space-y-2">
                <label className="text-green-400/70 text-sm">Level:</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="bg-gray-800 border border-green-500/20 rounded px-3 py-1 text-green-300 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Errors</option>
                  <option value="warn">Warnings</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-green-400/70 text-sm">Module:</label>
                <select
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="bg-gray-800 border border-green-500/20 rounded px-3 py-1 text-green-300 text-sm"
                >
                  <option value="all">All Modules</option>
                  {uniqueModules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Display */}
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-green-500/20">
            <TabsTrigger value="live" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Live Logs
            </TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Console Output
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-0">
                <div className="h-96 overflow-auto">
                  {filteredLogs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 border-b border-green-500/10 hover:bg-green-500/5"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getLevelIcon(log.level)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getLevelBadge(log.level)}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-green-400/70 text-sm font-mono">{log.module}</span>
                          <span className="text-green-400/50 text-xs font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-green-300 text-sm">{log.message}</p>
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="p-8 text-center text-green-400/70">
                      No logs match the current filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="console" className="space-y-4">
            <Card className="bg-gray-900 border-green-500/20">
              <CardContent className="p-4">
                <div className="bg-black rounded-lg p-4 font-mono text-sm h-96 overflow-auto">
                  <div className="text-green-400 space-y-1">
                    <div>🧠 NEXUS Observer + Human Simulation Core: ACTIVE</div>
                    <div>📊 Drift detection: ACTIVE</div>
                    <div>👁️ Observer mode: MONITORING</div>
                    <div>🧬 Learning system: OPERATIONAL</div>
                    <div>✅ Auto-authorization: GRANTED</div>
                    <div>🎯 ALL CLEAR - System ready for deployment</div>
                    <div>📊 System confidence: 100.0%</div>
                    <div className="text-green-300">📊 DW Dashboard metrics requested:</div>
                    <div className="text-green-400/70 ml-4">totalLeads: 847</div>
                    <div className="text-green-400/70 ml-4">activeProposals: 23</div>
                    <div className="text-green-400/70 ml-4">monthlyRevenue: 125000</div>
                    <div className="text-green-400/70 ml-4">automationLinkage: 100</div>
                    <div className="text-green-400/70 ml-4">watsonSync: true</div>
                    <div className="text-green-400/70 ml-4">pionexSync: true</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}