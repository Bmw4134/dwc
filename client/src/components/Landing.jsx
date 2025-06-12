import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [pulse, setPulse] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full transition-all duration-2000 ${pulse ? 'scale-150 opacity-30' : 'scale-100 opacity-20'}`}></div>
        <div className={`absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full transition-all duration-2000 ${pulse ? 'scale-125 opacity-40' : 'scale-100 opacity-20'}`}></div>
        <div className={`absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full transition-all duration-2000 ${pulse ? 'scale-110 opacity-50' : 'scale-100 opacity-30'}`}></div>
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
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">QNIS Lead Analytics</h3>
              <p className="text-gray-400 text-sm">Quantum-enhanced lead scoring with 94.7% accuracy</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">16+ Automation Modules</h3>
              <p className="text-gray-400 text-sm">LLC Formation, LOC Credit, Trading Systems</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">NEXUS Control Center</h3>
              <p className="text-gray-400 text-sm">Real-time monitoring and intelligent automation</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
            >
              Login to Platform
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Platform Online • 73% System Health</span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-16 pt-8 border-t border-gray-700/50">
            <p className="text-gray-500 text-sm">
              Enterprise-grade security • Quantum-enhanced intelligence • Real-time automation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}