import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Advanced Lead Generation",
      description: "AI-powered location-based lead discovery with real-time market intelligence",
      icon: "🎯"
    },
    {
      title: "Quantum Analytics",
      description: "Advanced quantum computing analytics and portfolio optimization",
      icon: "⚛️"
    },
    {
      title: "LLC Formation Engine",
      description: "Automated business entity formation with compliance tracking",
      icon: "🏢"
    },
    {
      title: "Trading Automation",
      description: "Multi-platform automated trading with risk management",
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-green-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              DWC Systems
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Intelligence Platform
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Enterprise-grade QNIS/PTNI automation platform with quantum analytics, 
              AI-powered lead generation, and comprehensive business intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Access Platform
              </Link>
              <button className="border border-gray-600 hover:border-gray-500 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:bg-gray-800">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Advanced Automation Modules
            </h2>
            <p className="text-xl text-gray-400">
              16+ integrated systems providing comprehensive business intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-gray-700 border-green-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="text-center">
                <div className="text-6xl mb-6">{features[activeFeature].icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-300 text-lg mb-8">
                  {features[activeFeature].description}
                </p>
                <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
                  Explore Module
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">16+</div>
              <div className="text-gray-400">Active Modules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-400">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1.08x</div>
              <div className="text-gray-400">Quantum Advantage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">DWC Systems LLC</div>
                <div className="text-gray-400 text-sm">Enterprise Intelligence Platform</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>Secure Connection</span>
              <span>•</span>
              <span>All Access Monitored</span>
              <span>•</span>
              <span>© 2025 DWC Systems</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}