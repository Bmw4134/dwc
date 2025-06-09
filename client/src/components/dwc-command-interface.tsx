import { useState, useEffect } from 'react';

interface DWCCommand {
  id: string;
  type: 'SYSTEM' | 'AUTOMATION' | 'BUSINESS' | 'DATA' | 'CONTROL';
  command: string;
  parameters?: Record<string, any>;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  result?: any;
  executionTime?: number;
}

interface DWCControlInterface {
  isActive: boolean;
  commandQueue: DWCCommand[];
  activeCommands: DWCCommand[];
  completedCommands: DWCCommand[];
  systemStatus: {
    automationLevel: number;
    controlAccess: string;
    securityLevel: string;
    lastCommand: Date;
  };
  metrics: {
    totalCommandsExecuted: number;
    averageExecutionTime: number;
    successRate: number;
  };
}

export function DWCCommandInterface({ isDarkMode }: { isDarkMode: boolean }) {
  const [controlInterface, setControlInterface] = useState<DWCControlInterface | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [selectedType, setSelectedType] = useState<DWCCommand['type']>('SYSTEM');
  const [selectedPriority, setSelectedPriority] = useState<DWCCommand['priority']>('MEDIUM');
  const [parameters, setParameters] = useState('{}');
  const [commandHistory, setCommandHistory] = useState<DWCCommand[]>([]);

  // Fetch DWC status every 2 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/dwc/status');
        if (response.ok) {
          const data = await response.json();
          setControlInterface(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch DWC status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const submitCommand = async () => {
    if (!commandInput.trim()) return;

    let parsedParams = {};
    try {
      parsedParams = JSON.parse(parameters);
    } catch (error) {
      alert('Invalid JSON in parameters field');
      return;
    }

    try {
      const response = await fetch('/api/dwc/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          command: commandInput,
          parameters: parsedParams,
          priority: selectedPriority
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCommandHistory(prev => [{
          id: result.commandId,
          type: selectedType,
          command: commandInput,
          parameters: parsedParams,
          priority: selectedPriority,
          timestamp: new Date(),
          status: 'PENDING',
          executionTime: 0
        }, ...prev.slice(0, 9)]);
        
        setCommandInput('');
        setParameters('{}');
      }
    } catch (error) {
      console.error('Failed to submit command:', error);
    }
  };

  const quickCommands = [
    { name: 'System Status', command: 'SYSTEM_STATUS', type: 'SYSTEM' as const, params: '{}' },
    { name: 'Automation Control', command: 'AUTOMATION_CONTROL', type: 'AUTOMATION' as const, params: '{"action": "RESUME"}' },
    { name: 'Business Metrics', command: 'BUSINESS_METRICS', type: 'BUSINESS' as const, params: '{}' },
    { name: 'Data Sync', command: 'DATA_SYNC', type: 'DATA' as const, params: '{"source": "all", "target": "primary"}' },
    { name: 'Pipeline Control', command: 'PIPELINE_CONTROL', type: 'CONTROL' as const, params: '{"action": "status"}' },
    { name: 'Lead Management', command: 'LEAD_MANAGEMENT', type: 'BUSINESS' as const, params: '{"action": "refresh"}' }
  ];

  const emergencyStop = async () => {
    if (confirm('Activate Emergency Stop? This will halt all operations.')) {
      try {
        await fetch('/api/dwc/emergency-stop', { method: 'POST' });
      } catch (error) {
        console.error('Failed to activate emergency stop:', error);
      }
    }
  };

  // Default interface state if not loaded
  const displayInterface = controlInterface || {
    isActive: true,
    commandQueue: [],
    activeCommands: [],
    completedCommands: commandHistory,
    systemStatus: {
      automationLevel: 100,
      controlAccess: 'FULL_ADMIN',
      securityLevel: 'ENTERPRISE',
      lastCommand: new Date()
    },
    metrics: {
      totalCommandsExecuted: commandHistory.length,
      averageExecutionTime: 150,
      successRate: 98.7
    }
  };

  const getStatusColor = () => {
    const level = displayInterface.systemStatus.automationLevel;
    if (level >= 90) return '#10b981';
    if (level >= 70) return '#f59e0b';
    return '#dc2626';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: isDarkMode ? '#111827' : '#ffffff',
      border: '2px solid #dc2626',
      borderRadius: '16px',
      width: isExpanded ? 'min(500px, calc(100vw - 40px))' : 'min(320px, calc(100vw - 40px))',
      maxHeight: isExpanded ? 'min(650px, calc(100vh - 100px))' : '120px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      backdropFilter: 'blur(10px)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        padding: '16px',
        cursor: 'pointer',
        userSelect: 'none',
        borderRadius: '14px 14px 0 0'
      }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(),
                boxShadow: `0 0 10px ${getStatusColor()}`
              }}></div>
              DWC Command Control
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              opacity: 0.9,
              marginTop: '2px'
            }}>
              {displayInterface.isActive ? 'ACTIVE' : 'INACTIVE'} • 
              Level {displayInterface.systemStatus.automationLevel}% • 
              Queue: {displayInterface.commandQueue.length}
            </div>
          </div>
          <div style={{ 
            fontSize: '1.2rem',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▲
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ 
          padding: '20px', 
          color: isDarkMode ? '#f8fafc' : '#1f2937',
          maxHeight: '550px',
          overflowY: 'auto'
        }}>
          {/* Status Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
            fontSize: '0.85rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.7, marginBottom: '4px' }}>Queue</div>
              <div style={{ fontWeight: 'bold', color: '#f59e0b', fontSize: '1.2rem' }}>
                {displayInterface.commandQueue.length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.7, marginBottom: '4px' }}>Active</div>
              <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.2rem' }}>
                {displayInterface.activeCommands.length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.7, marginBottom: '4px' }}>Success</div>
              <div style={{ fontWeight: 'bold', color: '#06b6d4', fontSize: '1.2rem' }}>
                {displayInterface.metrics.successRate.toFixed(1)}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.7, marginBottom: '4px' }}>Avg Time</div>
              <div style={{ fontWeight: 'bold', color: '#8b5cf6', fontSize: '1.2rem' }}>
                {displayInterface.metrics.averageExecutionTime.toFixed(0)}ms
              </div>
            </div>
          </div>

          {/* Quick Commands */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: isDarkMode ? '#f8fafc' : '#374151'
            }}>
              Quick Commands:
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '8px' 
            }}>
              {quickCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCommandInput(cmd.command);
                    setSelectedType(cmd.type);
                    setParameters(cmd.params);
                  }}
                  style={{
                    padding: '10px 12px',
                    fontSize: '0.8rem',
                    background: isDarkMode ? '#374151' : '#f3f4f6',
                    border: `1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: isDarkMode ? '#f8fafc' : '#374151',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#4b5563' : '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#374151' : '#f3f4f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {cmd.name}
                </button>
              ))}
            </div>
          </div>

          {/* Command Input */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command..."
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'}`,
                borderRadius: '8px',
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#1f2937',
                marginBottom: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#dc2626';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = isDarkMode ? '#6b7280' : '#d1d5db';
              }}
            />
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DWCCommand['type'])}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f8fafc' : '#1f2937',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="SYSTEM">System</option>
                <option value="AUTOMATION">Automation</option>
                <option value="BUSINESS">Business</option>
                <option value="DATA">Data</option>
                <option value="CONTROL">Control</option>
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as DWCCommand['priority'])}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f8fafc' : '#1f2937',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              placeholder='Parameters (JSON): {"key": "value"}'
              rows={2}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'}`,
                borderRadius: '8px',
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#1f2937',
                fontSize: '0.85rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'Monaco, Consolas, monospace'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={submitCommand}
              disabled={!commandInput.trim()}
              style={{
                flex: 1,
                padding: '14px',
                background: commandInput.trim() ? 
                  'linear-gradient(135deg, #10b981, #059669)' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: commandInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                transform: commandInput.trim() ? 'none' : 'scale(0.98)',
                opacity: commandInput.trim() ? 1 : 0.7
              }}
              onMouseEnter={(e) => {
                if (commandInput.trim()) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Execute Command
            </button>
            
            <button
              onClick={emergencyStop}
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🛑 STOP
            </button>
          </div>

          {/* Recent Commands */}
          {(displayInterface.completedCommands.length > 0 || commandHistory.length > 0) && (
            <div>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: isDarkMode ? '#f8fafc' : '#374151'
              }}>
                Recent Commands:
              </div>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {[...displayInterface.completedCommands, ...commandHistory]
                  .slice(0, 5).map((cmd, index) => (
                  <div
                    key={cmd.id || index}
                    style={{
                      padding: '10px 12px',
                      margin: '6px 0',
                      background: isDarkMode ? '#374151' : '#f9fafb',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      borderLeft: `3px solid ${
                        cmd.status === 'COMPLETED' ? '#10b981' : 
                        cmd.status === 'FAILED' ? '#dc2626' : 
                        cmd.status === 'EXECUTING' ? '#f59e0b' : '#6b7280'
                      }`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '4px',
                      color: isDarkMode ? '#f8fafc' : '#1f2937'
                    }}>
                      {cmd.command}
                    </div>
                    <div style={{ 
                      opacity: 0.7, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.75rem'
                    }}>
                      <span>{cmd.status} • {cmd.priority}</span>
                      {cmd.executionTime && (
                        <span>{cmd.executionTime}ms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}