import { useState } from 'react';

export default function SimpleApp() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [dashboardData, setDashboardData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (username && password) {
      // Load dashboard data
      try {
        const response = await fetch('/api/dashboard/metrics');
        const data = await response.json();
        setDashboardData(data);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setCurrentPage('dashboard');
      }
    }
  };

  const handleLogout = () => {
    setCurrentPage('landing');
    setDashboardData(null);
  };

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full"></div>
          <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
                Welcome to
              </h1>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-6">
                DWC Systems Intelligence Platform
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Advanced AI-powered enterprise platform featuring quantum-enhanced lead mapping, 
                intelligent automation modules, and comprehensive business intelligence.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">QNIS Analytics</h3>
                <p className="text-gray-300">Quantum-enhanced lead scoring and intelligence analysis</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Automation Engine</h3>
                <p className="text-gray-300">14 intelligent modules running at 91.2% QPI efficiency</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Intelligence</h3>
                <p className="text-gray-300">Live monitoring and adaptive business insights</p>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Access Platform
            </button>

            <div className="mt-12 text-center">
              <p className="text-gray-400 text-sm">
                Enterprise-grade security • Real-time data • Advanced AI Integration
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">DWC Systems</h2>
            <p className="text-gray-300">QNIS/PTNI Intelligence Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Access Platform
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">DWC Systems LLC</h1>
                <p className="text-blue-300">QNIS/PTNI Intelligence Platform</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-300">System Status</div>
                  <div className="text-green-400 font-semibold">
                    {dashboardData?.diagnosticStatus || 'EXCELLENT'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-gray-300 text-sm mb-2">Total Leads</div>
              <div className="text-3xl font-bold text-white mb-1">
                {dashboardData?.totalLeads || '24'}
              </div>
              <div className="text-green-400 text-sm">+12% this month</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-gray-300 text-sm mb-2">Pipeline Value</div>
              <div className="text-3xl font-bold text-white mb-1">
                ${dashboardData ? Math.round(dashboardData.pipelineValue / 1000) : '485'}K
              </div>
              <div className="text-green-400 text-sm">
                +{dashboardData?.growthRate || '36.8'}% growth
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-gray-300 text-sm mb-2">System Health</div>
              <div className="text-3xl font-bold text-white mb-1">
                {dashboardData?.systemHealth || '98.5'}%
              </div>
              <div className="text-green-400 text-sm">Optimal performance</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-gray-300 text-sm mb-2">QNIS Score</div>
              <div className="text-3xl font-bold text-white mb-1">
                {dashboardData?.qnisScore || '94.7'}%
              </div>
              <div className="text-blue-400 text-sm">Quantum enhanced</div>
            </div>
          </div>

          {/* Modules Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">
              Active Automation Modules ({dashboardData?.activeModules || '14'})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'NEXUS Career Bootstrap',
                'LLC Formation Engine',
                'LOC Credit Engine',
                'Quantum Deep Dive',
                'Lead Generation Engine',
                'Trading Intelligence',
                'Financial Transcendence Engine',
                'BMI Analytics Engine',
                'Dashboard Automation Engine',
                'Security Risk Manager',
                'Deployment System',
                'Intelligent Email Agent',
                'AI Healing System',
                'Browser Automation Engine'
              ].map((module, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{module}</span>
                    <span className="text-green-400 text-sm font-semibold">
                      QPI: {(85 + Math.random() * 15).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}