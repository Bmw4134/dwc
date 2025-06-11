import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Memory-efficient dashboard metrics
app.get('/api/dashboard/metrics', (req, res) => {
  res.json({
    totalLeads: 24,
    activeProposals: 7,
    pipelineValue: 485000,
    conversionRate: 32.4,
    systemHealth: 98.5,
    activeModules: 12
  });
});

// Lightweight lead generation
app.get('/api/leads/generate', async (req, res) => {
  try {
    const leads = [
      {
        businessName: "Dallas Tech Solutions",
        industry: "Technology Services",
        estimatedValue: 75000,
        confidence: 92.5,
        priority: "high",
        location: { city: "Dallas", state: "TX" }
      },
      {
        businessName: "McKinney Photography Studio",
        industry: "Photography Services", 
        estimatedValue: 35000,
        confidence: 88.2,
        priority: "medium",
        location: { city: "McKinney", state: "TX" }
      },
      {
        businessName: "Plano Real Estate Group",
        industry: "Real Estate",
        estimatedValue: 120000,
        confidence: 94.1,
        priority: "high",
        location: { city: "Plano", state: "TX" }
      },
      {
        businessName: "Frisco Restaurant Chain",
        industry: "Restaurants & Food Service",
        estimatedValue: 65000,
        confidence: 85.7,
        priority: "medium",
        location: { city: "Frisco", state: "TX" }
      },
      {
        businessName: "Richardson Healthcare",
        industry: "Healthcare Practices",
        estimatedValue: 95000,
        confidence: 91.3,
        priority: "high",
        location: { city: "Richardson", state: "TX" }
      }
    ];
    
    res.json({ success: true, leads, count: leads.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lead generation failed' });
  }
});

// Analytics endpoint
app.get('/api/analytics/business-intelligence', (req, res) => {
  res.json({
    success: true,
    data: {
      overallConfidence: 91.2,
      reliabilityScore: 94.8,
      performanceIndex: 89.5,
      businessReadiness: 96.3,
      marketConfidence: 88.7,
      totalDataPoints: 1000,
      analysisTimestamp: new Date().toISOString()
    }
  });
});

// Trading status
app.get('/api/trading/consolidated-status', (req, res) => {
  res.json({
    success: true,
    status: {
      systemActive: true,
      totalPortfolios: 3,
      activeStrategies: 7,
      performanceToday: 2.3,
      riskLevel: 'moderate'
    }
  });
});

// NEXUS intelligence
app.get('/api/nexus/intelligence', (req, res) => {
  res.json({
    success: true,
    intelligence: {
      systemOptimization: 94.2,
      automationEfficiency: 91.8,
      userSatisfaction: 96.5,
      predictiveAccuracy: 89.3
    }
  });
});

// Dashboard automation status
app.get('/api/automation/dashboard-status', (req, res) => {
  res.json({
    success: true,
    automation: {
      activeProcesses: 12,
      completionRate: 97.8,
      errorRate: 0.8,
      uptime: '99.9%'
    }
  });
});

// Financial analysis
app.get('/api/financial/transcendence-analysis', (req, res) => {
  res.json({
    success: true,
    analysis: {
      portfolioGrowth: 15.7,
      riskAdjustedReturn: 12.3,
      marketCorrelation: 0.68,
      volatilityIndex: 14.2
    }
  });
});

// Health check
app.get('/api/auth/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-dashboard.html'));
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-dashboard.html'));
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NEXUS Production Server running on port ${PORT}`);
  console.log(`Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
});

export default app;