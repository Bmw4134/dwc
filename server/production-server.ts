import express, { type Request, Response, NextFunction } from "express";
import { registerConsultingRoutes } from "./consulting-routes";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Production-optimized headers for Replit deployment
app.use((req, res, next) => {
  // Remove X-Frame-Options for iframe embedding
  res.removeHeader('X-Frame-Options');
  
  // Optimized CSP for production
  const csp = [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
    "frame-ancestors 'self' https://replit.com https://*.replit.com https://*.replit.dev https://*.replit.app",
    "connect-src 'self' ws: wss: https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Cache static assets in production
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  } else if (req.path === '/' || req.path.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit", 
      second: "2-digit",
      hour12: true,
    });
    console.log(`${formattedTime} [express] ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  
  next();
});

// Register API routes first
const server = registerConsultingRoutes(app);

// Serve static files from client/dist if it exists, otherwise serve development version
const distPath = path.resolve(process.cwd(), "client", "dist");
const clientPath = path.resolve(process.cwd(), "client");

if (fs.existsSync(distPath)) {
  console.log('📦 Serving production build from:', distPath);
  app.use(express.static(distPath));
  
  // Production SPA fallback
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Build not found. Please build the client first.');
    }
  });
} else {
  console.log('🔧 Production build not found, serving development template');
  
  // Development fallback - serve a simple HTML template
  app.get('*', (req, res) => {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DWC Systems LLC - QNIS/PTNI Intelligence Platform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e40af 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 60px 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      border-radius: 20px;
      margin: 0 auto 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
    }
    h1 {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle {
      font-size: 24px;
      font-weight: 700;
      color: #10b981;
      margin-bottom: 15px;
    }
    .description {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin-bottom: 40px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .metric {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
    }
    .metric-value {
      font-size: 32px;
      font-weight: 900;
      color: #10b981;
      margin-bottom: 8px;
    }
    .metric-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
    }
    .status {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.5);
      border-radius: 12px;
      padding: 12px 24px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 30px;
    }
    .pulse {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Q</div>
    <h1>DWC Systems LLC</h1>
    <div class="subtitle">QNIS/PTNI Intelligence Platform</div>
    <div class="description">
      Advanced AI consulting platform delivering enterprise-grade quantum intelligence solutions
      with proven ROI metrics and autonomous neural processing capabilities.
    </div>
    
    <div class="metrics">
      <div class="metric">
        <div class="metric-value">$3.485M</div>
        <div class="metric-label">Pipeline Value</div>
      </div>
      <div class="metric">
        <div class="metric-value">18</div>
        <div class="metric-label">Neural Modules</div>
      </div>
      <div class="metric">
        <div class="metric-value">277%</div>
        <div class="metric-label">Proven ROI</div>
      </div>
      <div class="metric">
        <div class="metric-value">99%</div>
        <div class="metric-label">System Health</div>
      </div>
    </div>
    
    <div class="status">
      <div class="pulse"></div>
      <span>QNIS/PTNI Intelligence Operational</span>
    </div>
  </div>

  <script>
    // Try to fetch real metrics and update display
    async function updateMetrics() {
      try {
        const response = await fetch('/api/dashboard/metrics');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Connection Successful:', data);
          
          // Update metrics with real data
          const metrics = document.querySelectorAll('.metric-value');
          if (metrics.length >= 4) {
            metrics[0].textContent = '$' + (data.totalPipelineValue / 1000000).toFixed(1) + 'M';
            metrics[1].textContent = '18';
            metrics[2].textContent = data.roiProven + '%';
            metrics[3].textContent = data.systemHealth.toFixed(0) + '%';
          }
        }
      } catch (error) {
        console.warn('API connection failed:', error);
      }
    }
    
    // Update metrics immediately and every 10 seconds
    updateMetrics();
    setInterval(updateMetrics, 10000);
    
    console.log('🚀 DWC Systems LLC QNIS/PTNI Platform Initialized');
    console.log('📊 Powered by Quantum Neural Intelligence');
  </script>
</body>
</html>`;
    
    res.status(200).set({ "Content-Type": "text/html" }).send(template);
  });
}

const PORT = parseInt(process.env.PORT || "5000", 10);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 DWC Systems LLC QNIS/PTNI Platform running on port ${PORT}`);
  console.log(`📊 Enterprise Intelligence Dashboard: http://localhost:${PORT}`);
  console.log(`🌟 Powered by Quantum Neural Intelligence Systems`);
});