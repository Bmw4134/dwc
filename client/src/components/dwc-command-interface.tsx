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
        setCommandInput('');
        setParameters('{}');
      }
    } catch (error) {
      console.error('Failed to submit command:', error);
    }
  };

  const quickCommands = [
    { name: 'System Status', command: 'SYSTEM_STATUS', type: 'SYSTEM' as const },
    { name: 'Automation Control', command: 'AUTOMATION_CONTROL', type: 'AUTOMATION' as const },
    { name: 'Business Metrics', command: 'BUSINESS_METRICS', type: 'BUSINESS' as const },
    { name: 'Data Sync', command: 'DATA_SYNC', type: 'DATA' as const },
    { name: 'Pipeline Control', command: 'PIPELINE_CONTROL', type: 'CONTROL' as const }
  ];

  const emergencyStop = async () => {
    if (confirm('Are you sure you want to activate Emergency Stop? This will halt all operations.')) {
      try {
        await fetch('/api/dwc/emergency-stop', { method: 'POST' });
      } catch (error) {
        console.error('Failed to activate emergency stop:', error);
      }
    }
  };

  if (!controlInterface) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: isDarkMode ? '#1f2937' : '#f8fafc',
        border: '2px solid #dc2626',
        borderRadius: '12px',
        padding: '15px',
        color: isDarkMode ? '#f8fafc' : '#1f2937'
      }}>
        Loading DWC Command Interface...
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: isDarkMode ? '#111827' : '#ffffff',
      border: '2px solid #dc2626',
      borderRadius: '16px',
      width: isExpanded ? '500px' : '300px',
      maxHeight: isExpanded ? '600px' : '200px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        padding: '15px',
        cursor: 'pointer',
        userSelect: 'none'
      }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              🎛️ DWC Command Control
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              Status: {controlInterface.isActive ? 'ACTIVE' : 'INACTIVE'} | 
              Level: {controlInterface.systemStatus.automationLevel}%
            </div>
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            {isExpanded ? '▼' : '▲'}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '20px', color: isDarkMode ? '#f8fafc' : '#1f2937' }}>
          {/* Status Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <div>
              <div style={{ opacity: 0.7 }}>Queue:</div>
              <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                {controlInterface.commandQueue.length}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Active:</div>
              <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                {controlInterface.activeCommands.length}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Success Rate:</div>
              <div style={{ fontWeight: 'bold', color: '#06b6d4' }}>
                {controlInterface.metrics.successRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.7 }}>Avg Time:</div>
              <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                {controlInterface.metrics.averageExecutionTime.toFixed(0)}ms
              </div>
            </div>
          </div>

          {/* Quick Commands */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>
              Quick Commands:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {quickCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCommandInput(cmd.command);
                    setSelectedType(cmd.type);
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    background: isDarkMode ? '#374151' : '#f3f4f6',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#4b5563' : '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#374151' : '#f3f4f6';
                  }}
                >
                  {cmd.name}
                </button>
              ))}
            </div>
          </div>

          {/* Command Input */}
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#1f2937',
                marginBottom: '10px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DWCCommand['type'])}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  background: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f8fafc' : '#1f2937'
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
                  padding: '8px',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  background: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f8fafc' : '#1f2937'
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
                padding: '8px',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f8fafc' : '#1f2937',
                fontSize: '0.8rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={submitCommand}
              disabled={!commandInput.trim()}
              style={{
                flex: 1,
                padding: '12px',
                background: commandInput.trim() ? '#10b981' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: commandInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              Execute
            </button>
            
            <button
              onClick={emergencyStop}
              style={{
                padding: '12px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🛑 STOP
            </button>
          </div>

          {/* Recent Commands */}
          {controlInterface.completedCommands.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>
                Recent Commands:
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {controlInterface.completedCommands.slice(-3).reverse().map((cmd, index) => (
                  <div
                    key={cmd.id}
                    style={{
                      padding: '8px',
                      margin: '4px 0',
                      background: isDarkMode ? '#374151' : '#f9fafb',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      borderLeft: `3px solid ${cmd.status === 'COMPLETED' ? '#10b981' : '#dc2626'}`
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{cmd.command}</div>
                    <div style={{ opacity: 0.7 }}>
                      {cmd.status} • {cmd.executionTime}ms • {cmd.priority}
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