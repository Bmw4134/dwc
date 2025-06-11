import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { nexusCareerBootstrap } from './nexus-career-bootstrap.js';
import { llcFormationEngine } from './llc-formation-engine.js';
import { locCreditEngine } from './loc-credit-engine.js';
import { nexusQuantumDeepDive } from './nexus-quantum-deep-dive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication credentials
const users: Record<string, { password: string; role: string }> = {
  watson: { password: 'dwc2025', role: 'CEO' },
  admin: { password: 'qnis2025', role: 'Admin' },
  dion: { password: 'nexus2025', role: 'Director' }
};

// Core dashboard data
const dashboardData = {
  totalLeads: 24,
  activeProposals: 7,
  pipelineValue: 485000,
  conversionRate: 32.4,
  systemHealth: 98.5,
  activeModules: 12
};

// Simple authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (users[username] && users[username].password === password) {
    res.json({ 
      success: true, 
      user: { username, role: users[username].role },
      token: `token-${Date.now()}`
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Dashboard metrics
app.get('/api/dashboard/metrics', (req, res) => {
  res.json(dashboardData);
});

// System status
app.get('/api/system/status', (req, res) => {
  res.json({
    status: 'operational',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Lead Generation Engine
app.get('/api/leads/generate', async (req, res) => {
  try {
    const { AdvancedLeadGenerationEngine } = await import('./lead-generation-engine.js');
    const engine = new AdvancedLeadGenerationEngine();
    const leads = await engine.generateTargetedLeads('Dallas, TX', 5);
    res.json({ success: true, leads, count: leads.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Business Intelligence Analytics
app.get('/api/analytics/business-intelligence', async (req, res) => {
  try {
    const { BMIAnalyticsEngine } = await import('./bmi-analytics-engine.js');
    const engine = new BMIAnalyticsEngine();
    const analytics = await engine.generateComprehensiveAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trading Engine Status
app.get('/api/trading/status', async (req, res) => {
  try {
    const { ConsolidatedTradingEngine } = await import('./consolidated-trading-engine.js');
    const engine = new ConsolidatedTradingEngine();
    const status = await engine.getSystemStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Intelligence Engine
app.get('/api/ai/intelligence-status', async (req, res) => {
  try {
    const { NexusIntelligenceEngine } = await import('./nexus-intelligence-engine.js');
    const engine = new NexusIntelligenceEngine();
    const status = await engine.getIntelligenceStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Automation Hub Control
app.get('/api/automation/status', async (req, res) => {
  try {
    const { DashboardAutomationEngine } = await import('./dashboard-automation-engine.js');
    const engine = new DashboardAutomationEngine();
    const status = await engine.getAutomationStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Financial Analytics
app.get('/api/financial/analysis', async (req, res) => {
  try {
    const { FinancialTranscendenceEngine } = await import('./financial-transcendence-engine.js');
    const engine = new FinancialTranscendenceEngine();
    const analysis = await engine.generateFinancialAnalysis();
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Security Center Status
app.get('/api/security/status', async (req, res) => {
  try {
    const { QQPlatformRiskManager } = await import('./qq-platform-risk-manager.js');
    const manager = new QQPlatformRiskManager();
    const status = await manager.getSecurityStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deployment Hub Status
app.get('/api/deployment/status', async (req, res) => {
  try {
    const { AutonomousDeploymentSystem } = await import('./autonomous-deployment-system.js');
    const system = new AutonomousDeploymentSystem();
    const status = await system.getDeploymentStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Module Registry - List all available modules
app.get('/api/modules/registry', (req, res) => {
  const modules = [
    { id: 'lead-generation', name: 'Advanced Lead Generation', status: 'active', description: 'AI-powered location-based lead discovery' },
    { id: 'business-intelligence', name: 'Business Intelligence Analytics', status: 'active', description: 'Comprehensive market and competitor analysis' },
    { id: 'trading-engine', name: 'Consolidated Trading Engine', status: 'standby', description: 'Multi-platform automated trading system' },
    { id: 'ai-intelligence', name: 'NEXUS AI Intelligence', status: 'active', description: 'Advanced AI decision-making system' },
    { id: 'automation-hub', name: 'Automation Control Hub', status: 'active', description: 'Central automation management system' },
    { id: 'financial-analytics', name: 'Financial Transcendence Engine', status: 'active', description: 'Advanced financial modeling and analysis' },
    { id: 'security-center', name: 'Platform Risk Manager', status: 'active', description: 'Comprehensive security monitoring' },
    { id: 'deployment-hub', name: 'Autonomous Deployment System', status: 'active', description: 'Automated deployment and scaling' },
    { id: 'browser-automation', name: 'Universal Browser Automation', status: 'active', description: 'Intelligent browser task automation' },
    { id: 'email-intelligence', name: 'Intelligent Email Agent', status: 'active', description: 'AI-powered email automation' },
    { id: 'market-data', name: 'Real-time Market Data Service', status: 'active', description: 'Live financial market intelligence' },
    { id: 'quantum-override', name: 'Watson Quantum Override', status: 'standby', description: 'Advanced system override capabilities' },
    { id: 'career-bootstrap', name: 'NEXUS Career Bootstrap', status: 'active', description: 'AI-powered career acceleration and opportunity matching' },
    { id: 'llc-formation', name: 'LLC Formation Engine', status: 'active', description: 'Automated business entity formation and compliance' },
    { id: 'loc-credit', name: 'Letter of Credit Engine', status: 'active', description: 'Trade finance and credit facilitation system' },
    { id: 'quantum-deep-dive', name: 'Quantum Deep Dive Analysis', status: 'active', description: 'Advanced quantum computing analytics and optimization' }
  ];
  
  res.json({ success: true, modules, totalCount: modules.length });
});

// Error testing endpoint for demonstrating error context expansion
app.get('/api/test/error/:type', (req, res) => {
  const errorType = req.params.type;
  
  switch (errorType) {
    case 'network':
      res.status(500).json({ 
        success: false, 
        message: 'Network timeout occurred',
        details: 'Connection to external service failed after 30 seconds'
      });
      break;
    case 'auth':
      res.status(401).json({ 
        success: false, 
        message: 'Authentication token expired',
        details: 'Session has expired and requires re-authentication'
      });
      break;
    case 'validation':
      res.status(400).json({ 
        success: false, 
        message: 'Invalid data format provided',
        details: 'Required fields missing or incorrect data types'
      });
      break;
    case 'server':
      res.status(503).json({ 
        success: false, 
        message: 'Service temporarily unavailable',
        details: 'Database connection lost, attempting reconnection'
      });
      break;
    default:
      res.json({ success: true, message: 'No error simulation requested' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-index.html'));
});

// Serve login page explicitly
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-index.html'));
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-dashboard.html'));
});

// NEXUS Control Center
app.get('/nexus', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'nexus-control.html'));
});

// Settings page
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Modules registry page
app.get('/modules', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'modules.html'));
});

// Career Bootstrap page
app.get('/career', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'nexus-career-bootstrap.html'));
});

// Initialize all module routes
nexusCareerBootstrap.setupRoutes(app);
llcFormationEngine.setupRoutes(app);
locCreditEngine.setupRoutes(app);
nexusQuantumDeepDive.setupRoutes(app);

// Catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DWC Systems Server running on port ${PORT}`);
});
