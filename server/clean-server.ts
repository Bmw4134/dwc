import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication credentials
const users = {
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

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DWC Systems Server running on port ${PORT}`);
});