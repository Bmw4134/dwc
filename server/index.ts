import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-dashboard.html'));
});

// Catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clean-index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DWC Systems Server running on port ${PORT}`);
});
