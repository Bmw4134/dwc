import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Terminal, 
  Play, 
  Square, 
  RotateCcw,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

interface TerminalLog {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface SyncStatus {
  totalDashboards: number;
  updatedDashboards: number;
  newMobileRoutes: number;
  enhancedRoutes: number;
  errors: string[];
  timestamp: string;
  isRunning: boolean;
}

export default function WatsonTerminal() {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (level: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const log: TerminalLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, log]);
  };

  const executeCommand = async (cmd: string) => {
    addLog('info', `> ${cmd}`);
    setIsRunning(true);

    try {
      if (cmd.includes('sync-dashboards')) {
        await executeMobileSync(cmd);
      } else if (cmd.includes('status')) {
        await getSystemStatus();
      } else if (cmd.includes('help')) {
        showHelp();
      } else {
        addLog('warning', `Unknown command: ${cmd}`);
      }
    } catch (error) {
      addLog('error', `Command failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const executeMobileSync = async (cmd: string) => {
    const scope = cmd.includes('--scope mobile') ? 'mobile' : 'all';
    const force = cmd.includes('--force');

    addLog('info', `Starting mobile dashboard sync - scope: ${scope}, force: ${force}`);
    
    try {
      const response = await fetch('/api/watson/mobile-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, force })
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const result = await response.json();
      setSyncStatus({ ...result, isRunning: false });

      addLog('success', `Mobile sync complete:`);
      addLog('info', `  • ${result.totalDashboards} dashboards scanned`);
      addLog('info', `  • ${result.updatedDashboards} dashboards updated`);
      addLog('info', `  • ${result.newMobileRoutes} new mobile routes created`);
      addLog('info', `  • ${result.enhancedRoutes} routes enhanced with sparklines`);
      
      if (result.errors.length > 0) {
        addLog('warning', `${result.errors.length} errors encountered:`);
        result.errors.forEach((error: string) => addLog('error', `  • ${error}`));
      } else {
        addLog('success', 'No regressions detected - all mobile dashboards updated successfully');
      }

      addLog('info', `Status saved to WATSON/mobile_sync.json`);
    } catch (error) {
      addLog('error', `Mobile sync failed: ${error}`);
    }
  };

  const getSystemStatus = async () => {
    try {
      const response = await fetch('/api/watson/mobile-sync/status');
      if (response.ok) {
        const status = await response.json();
        setSyncStatus(status);
        addLog('info', `Last sync: ${new Date(status.timestamp).toLocaleString()}`);
        addLog('info', `Dashboards: ${status.totalDashboards} total, ${status.updatedDashboards} updated`);
      } else {
        addLog('warning', 'No previous sync status found');
      }
    } catch (error) {
      addLog('error', `Failed to get status: ${error}`);
    }
  };

  const showHelp = () => {
    addLog('info', 'Watson Terminal Commands:');
    addLog('info', '  sync-dashboards --scope mobile --force   # Sync all mobile dashboards');
    addLog('info', '  sync-dashboards --scope all              # Sync all dashboards');
    addLog('info', '  status                                   # Show sync status');
    addLog('info', '  clear                                    # Clear terminal');
    addLog('info', '  help                                     # Show this help');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && command.trim() && !isRunning) {
      if (command.trim() === 'clear') {
        setLogs([]);
        setCommand('');
        return;
      }
      executeCommand(command.trim());
      setCommand('');
    }
  };

  const quickCommands = [
    { label: 'Mobile Sync', cmd: 'sync-dashboards --scope mobile --force' },
    { label: 'Status', cmd: 'status' },
    { label: 'Help', cmd: 'help' },
    { label: 'Clear', cmd: 'clear' }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-400">
              <Terminal className="h-6 w-6" />
              <span>Watson Terminal - Mobile Dashboard Sync</span>
              {isRunning && <Badge variant="outline" className="text-yellow-400 border-yellow-400">Running</Badge>}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Quick Commands */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Quick Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickCommands.map((cmd) => (
                <Button
                  key={cmd.label}
                  variant="outline"
                  size="sm"
                  disabled={isRunning}
                  onClick={() => {
                    if (cmd.cmd === 'clear') {
                      setLogs([]);
                    } else {
                      executeCommand(cmd.cmd);
                    }
                  }}
                  className="text-green-400 border-green-600 hover:bg-green-900"
                >
                  {cmd.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        {syncStatus && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm text-gray-300 flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Sync Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Total Dashboards</div>
                  <div className="text-green-400 font-mono">{syncStatus.totalDashboards}</div>
                </div>
                <div>
                  <div className="text-gray-400">Updated</div>
                  <div className="text-green-400 font-mono">{syncStatus.updatedDashboards}</div>
                </div>
                <div>
                  <div className="text-gray-400">New Mobile Routes</div>
                  <div className="text-green-400 font-mono">{syncStatus.newMobileRoutes}</div>
                </div>
                <div>
                  <div className="text-gray-400">Enhanced</div>
                  <div className="text-green-400 font-mono">{syncStatus.enhancedRoutes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terminal */}
        <Card className="bg-black border-gray-700">
          <CardContent className="p-0">
            <div 
              ref={terminalRef}
              className="h-96 overflow-y-auto p-4 font-mono text-sm"
            >
              {logs.length === 0 && (
                <div className="text-gray-500">
                  Watson Terminal v1.0 - Mobile Dashboard Sync System<br/>
                  Type 'help' for available commands.
                </div>
              )}
              {logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2 mb-1">
                  <span className="text-gray-500 text-xs mt-0.5">[{log.timestamp}]</span>
                  {getLogIcon(log.level)}
                  <span className={
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warning' ? 'text-yellow-400' :
                    log.level === 'success' ? 'text-green-400' :
                    'text-gray-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center space-x-2 text-yellow-400">
                  <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">watson@terminal:~$</span>
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isRunning}
                  className="bg-transparent border-none text-green-400 flex-1 focus:ring-0"
                  placeholder="Enter command..."
                />
                <Button
                  size="sm"
                  disabled={!command.trim() || isRunning}
                  onClick={() => {
                    if (command.trim() === 'clear') {
                      setLogs([]);
                      setCommand('');
                    } else {
                      executeCommand(command.trim());
                      setCommand('');
                    }
                  }}
                  className="bg-green-700 hover:bg-green-600"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}