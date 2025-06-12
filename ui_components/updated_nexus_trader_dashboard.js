/**
 * NEXUS-Trader Dashboard - Advanced Trading Intelligence Platform
 * DWC Systems LLC - Kaizen Final Bundle
 */

class NexusTraderDashboard {
  constructor() {
    this.metrics = {
      totalPortfolioValue: 0,
      dailyPnL: 0,
      activeTrades: 0,
      successRate: 0,
      quantumAnalyses: 0,
      riskLevel: 'low'
    };
    
    this.tradingModules = [
      { id: 'quantum-optimizer', name: 'Quantum Portfolio Optimizer', status: 'active' },
      { id: 'ai-predictor', name: 'AI Market Predictor', status: 'active' },
      { id: 'risk-manager', name: 'Dynamic Risk Manager', status: 'active' },
      { id: 'sentiment-analyzer', name: 'Market Sentiment Analyzer', status: 'active' },
      { id: 'arbitrage-detector', name: 'Arbitrage Opportunity Detector', status: 'standby' }
    ];
    
    this.init();
  }

  async init() {
    await this.loadRealTimeData();
    this.setupEventListeners();
    this.startDataRefresh();
    this.renderDashboard();
  }

  async loadRealTimeData() {
    try {
      const [portfolioRes, tradesRes, quantumRes] = await Promise.all([
        fetch('/api/trading/portfolio'),
        fetch('/api/trading/active-trades'),
        fetch('/api/quantum/metrics')
      ]);

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        this.metrics.totalPortfolioValue = portfolioData.totalValue || 0;
        this.metrics.dailyPnL = portfolioData.dailyPnL || 0;
      }

      if (tradesRes.ok) {
        const tradesData = await tradesRes.json();
        this.metrics.activeTrades = tradesData.count || 0;
        this.metrics.successRate = tradesData.successRate || 0;
      }

      if (quantumRes.ok) {
        const quantumData = await quantumRes.json();
        this.metrics.quantumAnalyses = quantumData.metrics?.totalAnalyses || 0;
      }
    } catch (error) {
      console.error('Failed to load real-time trading data:', error);
    }
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.attachClickHandlers();
      this.setupKeyboardShortcuts();
    });
  }

  attachClickHandlers() {
    const quantumButton = document.getElementById('quantum-analysis-btn');
    if (quantumButton) {
      quantumButton.addEventListener('click', () => this.runQuantumAnalysis());
    }

    const riskButton = document.getElementById('risk-assessment-btn');
    if (riskButton) {
      riskButton.addEventListener('click', () => this.performRiskAssessment());
    }

    const optimizeButton = document.getElementById('portfolio-optimize-btn');
    if (optimizeButton) {
      optimizeButton.addEventListener('click', () => this.optimizePortfolio());
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'q':
            event.preventDefault();
            this.runQuantumAnalysis();
            break;
          case 'r':
            event.preventDefault();
            this.performRiskAssessment();
            break;
          case 'o':
            event.preventDefault();
            this.optimizePortfolio();
            break;
        }
      }
    });
  }

  async runQuantumAnalysis() {
    try {
      const response = await fetch('/api/quantum/sample-analysis');
      const data = await response.json();
      
      if (data.success) {
        this.displayQuantumResults(data.analysis);
        this.updateMetrics({ quantumAnalyses: this.metrics.quantumAnalyses + 1 });
      }
    } catch (error) {
      console.error('Quantum analysis failed:', error);
    }
  }

  async performRiskAssessment() {
    try {
      const response = await fetch('/api/trading/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId: 'current' })
      });
      
      const data = await response.json();
      if (data.success) {
        this.displayRiskAssessment(data.assessment);
      }
    } catch (error) {
      console.error('Risk assessment failed:', error);
    }
  }

  async optimizePortfolio() {
    try {
      const assets = [
        { symbol: 'AAPL', allocation: 25 },
        { symbol: 'GOOGL', allocation: 20 },
        { symbol: 'MSFT', allocation: 20 },
        { symbol: 'TSLA', allocation: 15 },
        { symbol: 'NVDA', allocation: 20 }
      ];

      const response = await fetch('/api/quantum/optimize-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assets, 
          constraints: { maxAllocation: 0.3, minAllocation: 0.05 } 
        })
      });

      const data = await response.json();
      if (data.success) {
        this.displayOptimizationResults(data.optimization);
      }
    } catch (error) {
      console.error('Portfolio optimization failed:', error);
    }
  }

  displayQuantumResults(analysis) {
    const resultsContainer = document.getElementById('quantum-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-4 border border-purple-500/30">
        <h3 class="text-lg font-bold text-purple-400 mb-3">Quantum Analysis Results</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-400 text-sm">Quantum States</p>
            <p class="text-white font-semibold">${analysis.quantumStates?.length || 0}</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Speedup Factor</p>
            <p class="text-white font-semibold">${analysis.quantumAdvantage?.speedup?.toFixed(2) || '1.00'}x</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Accuracy</p>
            <p class="text-white font-semibold">${((analysis.quantumAdvantage?.accuracy || 0) * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Coherence</p>
            <p class="text-white font-semibold">${analysis.decoherenceMetrics?.stabilityIndex?.toFixed(3) || '0.000'}</p>
          </div>
        </div>
      </div>
    `;
  }

  displayRiskAssessment(assessment) {
    const riskContainer = document.getElementById('risk-assessment');
    if (!riskContainer) return;

    const riskColor = assessment?.riskLevel === 'low' ? 'text-green-400' : 
                     assessment?.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400';

    riskContainer.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-4 border border-yellow-500/30">
        <h3 class="text-lg font-bold text-yellow-400 mb-3">Risk Assessment</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-400">Risk Level:</span>
            <span class="${riskColor} font-semibold">${assessment?.riskLevel?.toUpperCase() || 'UNKNOWN'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">VaR (95%):</span>
            <span class="text-white">${assessment?.var95?.toFixed(2) || '0.00'}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Max Drawdown:</span>
            <span class="text-white">${assessment?.maxDrawdown?.toFixed(2) || '0.00'}%</span>
          </div>
        </div>
      </div>
    `;
  }

  displayOptimizationResults(optimization) {
    const optimizationContainer = document.getElementById('optimization-results');
    if (!optimizationContainer) return;

    optimizationContainer.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-4 border border-green-500/30">
        <h3 class="text-lg font-bold text-green-400 mb-3">Portfolio Optimization</h3>
        <div class="space-y-2">
          ${optimization.assets?.map(asset => `
            <div class="flex justify-between">
              <span class="text-gray-400">${asset.symbol}:</span>
              <span class="text-white">${asset.allocation?.toFixed(1) || '0.0'}%</span>
            </div>
          `).join('') || '<p class="text-gray-400">No optimization data available</p>'}
        </div>
      </div>
    `;
  }

  updateMetrics(newMetrics) {
    Object.assign(this.metrics, newMetrics);
    this.refreshMetricsDisplay();
  }

  refreshMetricsDisplay() {
    const metricsElements = {
      'portfolio-value': this.formatCurrency(this.metrics.totalPortfolioValue),
      'daily-pnl': this.formatCurrency(this.metrics.dailyPnL),
      'active-trades': this.metrics.activeTrades.toString(),
      'success-rate': `${this.metrics.successRate.toFixed(1)}%`,
      'quantum-analyses': this.metrics.quantumAnalyses.toString()
    };

    Object.entries(metricsElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  startDataRefresh() {
    // Refresh data every 30 seconds
    setInterval(() => {
      this.loadRealTimeData();
      this.refreshMetricsDisplay();
    }, 30000);
  }

  renderDashboard() {
    const dashboardContainer = document.getElementById('nexus-trader-dashboard');
    if (!dashboardContainer) return;

    dashboardContainer.innerHTML = `
      <div class="nexus-trader-dashboard bg-gray-900 min-h-screen p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">NEXUS-Trader Intelligence</h1>
            <p class="text-gray-400">Advanced Quantum Trading Platform</p>
          </div>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p class="text-gray-400 text-sm">Portfolio Value</p>
              <p id="portfolio-value" class="text-2xl font-bold text-green-400">$0.00</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p class="text-gray-400 text-sm">Daily P&L</p>
              <p id="daily-pnl" class="text-2xl font-bold text-blue-400">$0.00</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p class="text-gray-400 text-sm">Active Trades</p>
              <p id="active-trades" class="text-2xl font-bold text-white">0</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p class="text-gray-400 text-sm">Success Rate</p>
              <p id="success-rate" class="text-2xl font-bold text-purple-400">0.0%</p>
            </div>
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p class="text-gray-400 text-sm">Quantum Analyses</p>
              <p id="quantum-analyses" class="text-2xl font-bold text-cyan-400">0</p>
            </div>
          </div>

          <!-- Control Panel -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <button id="quantum-analysis-btn" class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              Run Quantum Analysis (Ctrl+Q)
            </button>
            <button id="risk-assessment-btn" class="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              Risk Assessment (Ctrl+R)
            </button>
            <button id="portfolio-optimize-btn" class="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              Optimize Portfolio (Ctrl+O)
            </button>
          </div>

          <!-- Results Display -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="quantum-results"></div>
            <div id="risk-assessment"></div>
            <div id="optimization-results"></div>
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize dashboard when DOM is loaded
if (typeof document !== 'undefined') {
  const nexusTrader = new NexusTraderDashboard();
  window.nexusTrader = nexusTrader;
}

export default NexusTraderDashboard;