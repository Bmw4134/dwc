import express, { type Request, Response, NextFunction } from "express";
import { registerConsultingRoutes } from "./consulting-routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Emergency deployment override - serve HTML directly
const EMERGENCY_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DWC Systems LLC - QNIS/PTNI Intelligence Platform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3730a3 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      width: 100%;
      text-align: center;
    }
    .header {
      margin-bottom: 3rem;
    }
    .logo {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle {
      font-size: 1.5rem;
      color: #06b6d4;
      margin-bottom: 2rem;
    }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    .status-card {
      background: rgba(16, 185, 129, 0.1);
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid rgba(16, 185, 129, 0.3);
      backdrop-filter: blur(10px);
    }
    .status-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #10b981;
      margin-bottom: 1rem;
    }
    .status-value {
      font-size: 2rem;
      font-weight: 900;
      color: white;
    }
    .navigation {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin: 3rem 0;
    }
    .nav-btn {
      display: inline-block;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }
    .nav-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }
    @media (max-width: 768px) {
      .logo { font-size: 2.5rem; }
      .subtitle { font-size: 1.25rem; }
      .status-grid { grid-template-columns: 1fr; }
      .navigation { flex-direction: column; align-items: center; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">DWC Systems LLC</h1>
      <p class="subtitle">QNIS/PTNI Intelligence Platform</p>
    </div>

    <div class="status-grid">
      <div class="status-card">
        <div class="status-title">Platform Status</div>
        <div class="status-value">OPERATIONAL</div>
      </div>
      <div class="status-card">
        <div class="status-title">System Health</div>
        <div class="status-value">98.2%</div>
      </div>
      <div class="status-card">
        <div class="status-title">Active Modules</div>
        <div class="status-value">18</div>
      </div>
    </div>

    <div class="navigation">
      <a href="/admin" class="nav-btn">Admin Console</a>
      <a href="/watson" class="nav-btn">Watson AI</a>
      <a href="/dion" class="nav-btn">DION Interface</a>
      <a href="/intelligence" class="nav-btn">Intelligence Hub</a>
    </div>
  </div>

  <script>
    console.log('DWC Systems LLC QNIS/PTNI Platform loaded successfully');
  </script>
</body>
</html>
`;

// Remove the catch-all route that blocks the React app

// Allow iframe embedding for Replit preview
app.use((req, res, next) => {
  // Completely remove X-Frame-Options to allow iframe embedding
  res.removeHeader('X-Frame-Options');
  
  // Comprehensive CSP for Replit iframe embedding
  const csp = [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
    "frame-ancestors 'self' https://replit.com https://*.replit.com https://*.replit.dev https://*.replit.app",
    "frame-src 'self' https://replit.com https://*.replit.com https://*.replit.dev https://*.replit.app",
    "connect-src 'self' ws: wss: https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  
  // Essential iframe compatibility headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  
  // Prevent caching issues in iframe
  if (req.path === '/' || req.path.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerConsultingRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error('Server error:', err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use environment PORT or fallback to 5000 for Replit compatibility
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
