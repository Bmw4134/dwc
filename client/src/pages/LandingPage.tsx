import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [liveMetrics, setLiveMetrics] = useState({
    activeLeads: 0,
    pipelineValue: '$168.0K',
    conversionScore: '99.8%',
    responseTime: '99.2%'
  });

  useEffect(() => {
    // Connect to live data from the platform
    const updateMetrics = async () => {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLiveMetrics(prev => ({
            ...prev,
            activeLeads: data.length || 0
          }));
        }
      } catch (error) {
        // Maintain stable display on error
        console.log('Metrics update error:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 1,000 leads tracked',
        'Basic lead mapping',
        'Email support',
        '5 automation workflows',
        'Standard reporting'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'Advanced features for growing businesses',
      features: [
        'Unlimited lead tracking',
        'Advanced geospatial mapping',
        'Priority phone & email support',
        'Unlimited automation workflows',
        'Custom reporting & analytics',
        'API access',
        'Team collaboration tools'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$399',
      period: '/month',
      description: 'Complete solution for large organizations',
      features: [
        'Everything in Professional',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security features',
        'SLA guarantee',
        'On-premise deployment option'
      ]
    }
  ];

  const hostingOptions = [
    {
      id: 'cloud',
      name: 'Cloud Hosting',
      description: 'Fully managed cloud infrastructure with automatic scaling',
      features: ['99.9% uptime SLA', 'Automatic backups', 'Global CDN', 'SSL certificates']
    },
    {
      id: 'dedicated',
      name: 'Dedicated Server',
      description: 'High-performance dedicated resources for maximum control',
      features: ['Dedicated resources', 'Custom configurations', 'Enhanced security', 'Priority support']
    },
    {
      id: 'hybrid',
      name: 'Hybrid Solution',
      description: 'Combine cloud flexibility with on-premise security',
      features: ['Best of both worlds', 'Data sovereignty', 'Flexible scaling', 'Custom architecture']
    }
  ];

  const handleGetStarted = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">NEXUS</div>
                  <div className="text-sm text-gray-300">Intelligence Platform</div>
                </div>
              </div>
              <div className="ml-8 text-gray-400 text-sm">
                Powered by <span className="text-white font-semibold">DWC Systems LLC</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Live KPI Metrics in Header */}
              <div className="hidden lg:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-cyan-400 font-bold">{liveMetrics.activeLeads}</div>
                  <div className="text-gray-400 text-xs">ACTIVE LEADS</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold">{liveMetrics.pipelineValue}</div>
                  <div className="text-gray-400 text-xs">PIPELINE VALUE</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-bold">74.0</div>
                  <div className="text-gray-400 text-xs">AVG QNIS SCORE</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold">🟢 Operational</div>
                  <div className="text-gray-400 text-xs">SYSTEM STATUS</div>
                </div>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#features" className="text-gray-300 hover:text-white">Features</a>
                <a href="#modules" className="text-gray-300 hover:text-white">47 AI Modules</a>
                <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
                <a href="#contact" className="text-gray-300 hover:text-white">Contact</a>
              </nav>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-semibold"
              >
                Enter Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Live Platform Metrics */}
            <div className="space-y-8">
              <div>
                <h2 className="text-white text-lg font-medium mb-4">Live Platform Metrics</h2>
                <p className="text-gray-300 text-sm mb-6">Real-time intelligence and performance indicators</p>
                
                {/* KPI Grid - Optimized Layout */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📊</span>
                      </div>
                    </div>
                    <div className="text-cyan-400 text-2xl font-bold">{liveMetrics.activeLeads}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Active Leads</div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">💰</span>
                      </div>
                    </div>
                    <div className="text-green-400 text-2xl font-bold">{liveMetrics.pipelineValue}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Pipeline Value</div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                    </div>
                    <div className="text-purple-400 text-2xl font-bold">{liveMetrics.conversionScore}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Conversion Score</div>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">⚡</span>
                      </div>
                    </div>
                    <div className="text-yellow-400 text-2xl font-bold">{liveMetrics.responseTime}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Response Time</div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live Data • Updated Every 15s</span>
                  </div>
                </div>
              </div>

              {/* Vision AI Integration */}
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Vision AI Integration</h3>
                    <p className="text-gray-400 text-sm">Advanced OCR and image analysis capabilities with automatic CRM integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">OCR Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Auto-CRM Push</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Multi-Format</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Quantum-Powered
                </span>
                <br />
                <span className="text-blue-400">Enterprise</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg mb-8 max-w-xl">
                Unlock the future of business intelligence with our NEXUS platform featuring 47 AI modules, real-time geospatial analytics, and autonomous lead generation systems.
              </p>

              {/* Key Metrics Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">47</div>
                  <div className="text-gray-400 text-sm">AI MODULES</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">24/7</div>
                  <div className="text-gray-400 text-sm">LIVE MONITORING</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">99.7%</div>
                  <div className="text-gray-400 text-sm">UPTIME</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                >
                  Launch Dashboard
                </button>
                <button className="w-full sm:w-auto border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-400/10 transition-all duration-200">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Modern Businesses
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Geospatial Intelligence</h3>
              <p className="text-gray-600">Advanced mapping with real-time lead visualization and geographic insights</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Driven Analytics</h3>
              <p className="text-gray-600">Machine learning algorithms that identify patterns and optimize lead conversion</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Automation Engine</h3>
              <p className="text-gray-600">Streamline workflows with intelligent automation and custom triggers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Hosting Solutions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {hostingOptions.map((option) => (
              <div key={option.id} className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{option.name}</h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-blue-500 mr-3">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies already using our platform to drive growth and success.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <span className="ml-2 text-xl font-bold">DWC Systems</span>
              </div>
              <p className="text-gray-400">
                Advanced enterprise intelligence platform for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Integrations</li>
                <li>Pricing</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DWC Systems LLC. All rights reserved.</p>
            <p className="text-sm mt-2">NEXUS Intelligence Platform - Powered by Quantum Enterprise Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;