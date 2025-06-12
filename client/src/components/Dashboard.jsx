import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [modules, setModules] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [modulesRes, metricsRes, careerRes, llcRes, locRes, quantumRes] = await Promise.all([
        fetch('/api/modules/registry'),
        fetch('/api/system/status'),
        fetch('/api/career/metrics'),
        fetch('/api/llc/formations'),
        fetch('/api/loc/metrics'),
        fetch('/api/quantum/metrics')
      ]);
      
      const modulesData = await modulesRes.json();
      const metricsData = await metricsRes.json();
      const careerData = await careerRes.json();
      const llcData = await llcRes.json();
      const locData = await locRes.json();
      const quantumData = await quantumRes.json();
      
      setModules(modulesData.modules || []);
      setSystemMetrics({
        ...metricsData,
        careerMatches: careerData.totalMatches || 0,
        llcFormations: llcData.count || 0,
        locApplications: locData.metrics?.totalApplications || 0,
        quantumAnalyses: quantumData.metrics?.totalAnalyses || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-white mt-4">Loading NEXUS Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">DWC Systems LLC</h1>
                <p className="text-gray-400">NEXUS Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400 text-sm font-medium">System Online</span>
              </div>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Modules</p>
                <p className="text-2xl font-bold text-white">{modules.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Career Matches</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.careerMatches || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">LLC Formations</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.llcFormations || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">LOC Applications</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.locApplications || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Quantum Analyses</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.quantumAnalyses || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">System Load</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.cpuUsage || '12'}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Memory Usage</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.memoryUsage || '68'}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">System Uptime</p>
                <p className="text-2xl font-bold text-white">{systemMetrics.uptime || '99.9'}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Automation Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <div key={module.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      module.status === 'active' ? 'bg-green-400' : 
                      module.status === 'standby' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <span className={`ml-2 text-xs font-medium ${
                      module.status === 'active' ? 'text-green-400' : 
                      module.status === 'standby' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {module.status.toUpperCase()}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{module.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Module ID: {module.id}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Module Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white ml-3">Career Bootstrap</h3>
            </div>
            <p className="text-gray-300 mb-4">AI-powered career acceleration with personalized opportunity matching and skill development recommendations.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Access Module
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white ml-3">LLC Formation</h3>
            </div>
            <p className="text-gray-300 mb-4">Automated business entity formation with state-specific compliance tracking and cost optimization.</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Form Business
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white ml-3">Quantum Deep Dive</h3>
            </div>
            <p className="text-gray-300 mb-4">Advanced quantum computing analytics for portfolio optimization and market prediction algorithms.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Run Analysis
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Platform Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              System Diagnostics
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              Analytics Report
            </button>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              Trading Console
            </button>
            <button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              LOC Processing
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}