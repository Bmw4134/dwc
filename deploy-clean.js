#!/usr/bin/env node

/**
 * Clean Deployment Script for DWC Systems
 * Excludes trading components to prevent bloat
 */

import fs from 'fs';
import path from 'path';

const EXCLUDED_PATTERNS = [
  /trading-bot/,
  /pionex/i,
  /binance/i,
  /alpaca/i,
  /bybit/i,
  /quantum.*trading/i,
  /hyperdrive.*trading/i,
  /dual.*trading/i,
  /modules\/quantum_trading_agent/,
  /\.zip$/,
  /logs\//,
  /data\//,
  /attached_assets\//
];

const ESSENTIAL_FILES = [
  'client/',
  'server/routes.ts',
  'server/index.ts',
  'server/domain-email-automation.ts',
  'server/intelligent-email-agent.ts',
  'server/automated-api-key-manager.ts',
  'server/lean-deployment-extractor.ts',
  'shared/schema.ts',
  'package.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json',
  'drizzle.config.ts'
];

function shouldExclude(filePath) {
  return EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath));
}

function cleanRoutes() {
  const routesPath = 'server/routes.ts';
  if (!fs.existsSync(routesPath)) return;
  
  let content = fs.readFileSync(routesPath, 'utf8');
  
  // Remove trading-related imports
  content = content.replace(/import.*quantum_trading_agent.*$/gm, '');
  content = content.replace(/import.*pionex.*$/gm, '');
  content = content.replace(/import.*binance.*$/gm, '');
  content = content.replace(/import.*trading.*engine.*$/gm, '');
  
  // Remove trading routes
  content = content.replace(/\/\/ Trading.*?(?=\/\/ [A-Z]|\n\n|$)/gs, '');
  content = content.replace(/app\.(get|post|put|delete)\(['"]\S*trading\S*['"].*?\}\);/gs, '');
  
  // Clean up extra whitespace
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(routesPath, content);
  console.log('✓ Cleaned routes.ts - removed trading components');
}

function generateCleanPackageJson() {
  const cleanDeps = {
    "express": "^4.18.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.1",
    "puppeteer": "^21.7.0",
    "openai": "^4.24.7",
    "lucide-react": "^0.307.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "@tailwindcss/typography": "^0.5.10",
    "wouter": "^3.0.0",
    "@tanstack/react-query": "^5.17.15",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  };

  const packageJson = {
    "name": "dwc-systems-automation",
    "version": "1.0.0",
    "description": "DWC Systems - Enterprise Business Automation Platform",
    "main": "server/index.ts",
    "type": "module",
    "scripts": {
      "dev": "NODE_ENV=development tsx server/index.ts",
      "build": "vite build",
      "start": "NODE_ENV=production tsx server/index.ts",
      "deploy": "npm run build && npm start",
      "clean-deploy": "node deploy-clean.js && npm run deploy"
    },
    "dependencies": cleanDeps,
    "devDependencies": {
      "@types/node": "^20.10.5",
      "@types/express": "^4.17.21"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };

  fs.writeFileSync('package-clean.json', JSON.stringify(packageJson, null, 2));
  console.log('✓ Generated clean package.json');
}

function createDeploymentManifest() {
  const manifest = {
    "name": "DWC Systems Automation Platform",
    "version": "1.0.0",
    "deployment_type": "business_automation",
    "excluded_components": [
      "trading_systems",
      "cryptocurrency_integrations", 
      "quantum_trading_agents",
      "financial_trading_bots"
    ],
    "included_components": [
      "nasa_api_integration",
      "domain_email_automation",
      "intelligent_email_agent",
      "form_automation",
      "lead_intelligence",
      "api_key_management"
    ],
    "environment_requirements": [
      "NASA_API_KEY",
      "OPENAI_API_KEY",
      "GOOGLE_PLACES_API_KEY"
    ],
    "deployment_size": "lean",
    "estimated_build_time": "2-3 minutes",
    "memory_usage": "minimal"
  };

  fs.writeFileSync('deployment-manifest.json', JSON.stringify(manifest, null, 2));
  console.log('✓ Created deployment manifest');
}

function main() {
  console.log('🚀 Starting clean deployment preparation...\n');
  
  cleanRoutes();
  generateCleanPackageJson();
  createDeploymentManifest();
  
  console.log('\n✅ Clean deployment ready!');
  console.log('\nTo deploy:');
  console.log('1. Copy package-clean.json to package.json');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run deploy');
  console.log('\nThis excludes all trading components to prevent deployment bloat.');
}

main();