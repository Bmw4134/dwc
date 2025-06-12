import { useState, useEffect } from 'react';

export default function DWCConsole() {
  const [workflows, setWorkflows] = useState([]);
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeConsole();
    startRealTimeUpdates();
  }, []);

  const initializeConsole = async () => {
    try {
      const [workflowsRes, metricsRes, processesRes] = await Promise.all([
        fetch('/api/dwc/workflows'),
        fetch('/api/dwc/metrics'),
        fetch('/api/dwc/processes/active')
      ]);

      if (workflowsRes.ok) {
        const workflowsData = await workflowsRes.json();
        setWorkflows(workflowsData.workflows || []);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      if (processesRes.ok) {
        const processesData = await processesRes.json();
        setActiveProcesses(processesData.processes || []);
      }

      setIsConnected(true);
      addConsoleOutput('DWC Console initialized successfully', 'success');
    } catch (error) {
      addConsoleOutput(`Failed to initialize console: ${error.message}`, 'error');
    }
  };

  const startRealTimeUpdates = () => {
    setInterval(() => {
      updateMetrics();
      updateActiveProcesses();
    }, 5000); // Update every 5 seconds
  };

  const updateMetrics = async () => {
    try {
      const response = await fetch('/api/dwc/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  };

  const updateActiveProcesses = async () => {
    try {
      const response = await fetch('/api/dwc/processes/active');
      if (response.ok) {
        const data = await response.json();
        setActiveProcesses(data.processes || []);
      }
    } catch (error) {
      console.error('Failed to update active processes:', error);
    }
  };

  const triggerWorkflow = async (workflowId, inputData = {}) => {
    try {
      addConsoleOutput(`Triggering workflow: ${workflowId}`, 'info');
      
      const response = await fetch(`/api/dwc/trigger/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData)
      });

      const result = await response.json();
      
      if (result.success) {
        addConsoleOutput(`Workflow ${workflowId} started successfully. Process ID: ${result.processId}`, 'success');
      } else {
        addConsoleOutput(`Failed to start workflow: ${result.error}`, 'error');
      }
    } catch (error) {
      addConsoleOutput(`Workflow trigger failed: ${error.message}`, 'error');
    }
  };

  const stopProcess = async (processId) => {
    try {
      const response = await fetch(`/api/dwc/processes/${processId}/stop`, {
        method: 'POST'
      });

      if (response.ok) {
        addConsoleOutput(`Process ${processId} stopped successfully`, 'warning');
        updateActiveProcesses();
      }
    } catch (error) {
      addConsoleOutput(`Failed to stop process: ${error.message}`, 'error');
    }
  };

  const addConsoleOutput = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newOutput = {
      id: Date.now(),
      timestamp,
      message,
      type
    };
    
    setConsoleOutput(prev => [...prev.slice(-49), newOutput]); // Keep last 50 messages
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">DWC Engine Console</h1>
            <p className="text-gray-400">Workflow Automation Command Center</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              onClick={initializeConsole}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Workflows</h3>
            <p className="text-3xl font-bold text-blue-400">{metrics.totalWorkflows || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Active Processes</h3>
            <p className="text-3xl font-bold text-green-400">{metrics.activeProcesses || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-purple-400">{metrics.successRate?.toFixed(1) || '0.0'}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Avg Processing</h3>
            <p className="text-3xl font-bold text-yellow-400">{(metrics.avgProcessingTime / 1000)?.toFixed(1) || '0.0'}s</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workflows Panel */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Available Workflows</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedWorkflow?.id === workflow.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{workflow.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      workflow.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      workflow.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {workflow.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{workflow.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{workflow.steps?.length || 0} steps</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerWorkflow(workflow.id);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                    >
                      Trigger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Processes Panel */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Active Processes</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeProcesses.map((process) => (
                <div key={process.id} className="p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{process.workflowId}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(process.status)}`}>
                        {process.status}
                      </span>
                      {process.status === 'running' && (
                        <button
                          onClick={() => stopProcess(process.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    Process ID: {process.id}
                  </div>
                  {process.progress !== undefined && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{process.progress?.toFixed(0) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${process.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Duration: {((process.duration || 0) / 1000).toFixed(1)}s
                  </div>
                </div>
              ))}
              {activeProcesses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No active processes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Console Output */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Console Output</h2>
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {consoleOutput.map((output) => (
              <div key={output.id} className="mb-1">
                <span className="text-gray-500">[{output.timestamp}]</span>
                <span className={`ml-2 ${getOutputColor(output.type)}`}>
                  {output.message}
                </span>
              </div>
            ))}
            {consoleOutput.length === 0 && (
              <div className="text-gray-500">Console output will appear here...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}