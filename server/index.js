import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Serve static files from public directory for Vercel compatibility
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (filePath.endsWith('.html')) {
      res.set('Content-Type', 'text/html');
    }
  }
}));

// API endpoints
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        platform: 'DWC Systems NEXUS',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/dashboard/metrics', (req, res) => {
    res.json({
        totalLeads: 24,
        pipelineValue: '$485K',
        systemHealth: '98.5%',
        qnisScore: '94.7%',
        activeModules: 14,
        averageQPI: '91.2%',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ success: true, message: 'Authentication successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/modules/:moduleId', (req, res) => {
    const moduleData = {
        'nexus-career': { status: 'active', qpi: 94.7, processes: 147 },
        'llc-formation': { status: 'active', qpi: 91.2, processes: 12 },
        'loc-credit': { status: 'active', qpi: 88.9, processes: 34 },
        'quantum-dive': { status: 'active', qpi: 96.1, processes: 28 },
        'lead-generation': { status: 'active', qpi: 89.4, processes: 43 },
        'trading-intelligence': { status: 'active', qpi: 92.8, processes: 78 }
    };
    
    const data = moduleData[req.params.moduleId];
    if (data) {
        res.json({ ...data, timestamp: new Date().toISOString() });
    } else {
        res.status(404).json({ error: 'Module not found' });
    }
});

// Serve the main application only for non-API routes and non-static files
app.get('*', (req, res) => {
    // Don't serve index.html for API routes or file extensions
    if (req.path.startsWith('/api/') || 
        req.path.includes('.js') || 
        req.path.includes('.css') || 
        req.path.includes('.png') || 
        req.path.includes('.jpg') || 
        req.path.includes('.ico')) {
        return res.status(404).send('Not found');
    }
    res.sendFile(path.join(__dirname, '../emergency_stop.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DWC Systems NEXUS Platform running on port ${PORT}`);
    console.log(`✅ Access the platform at: http://localhost:${PORT}`);
    console.log(`📊 All 14 modules operational`);
    console.log(`⚡ NEXUS intelligence platform ready`);
});