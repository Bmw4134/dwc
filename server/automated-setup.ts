import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export class AutomatedSetup {
  private logFile: string;

  constructor() {
    this.logFile = path.join(process.cwd(), 'setup.log');
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logMessage);
  }

  async setupChromeBrowser(): Promise<boolean> {
    try {
      this.log('🔧 Setting up Chrome browser for Puppeteer...');
      
      // Check if Chrome is already installed
      try {
        execSync('which google-chrome || which chromium-browser || which chromium', { stdio: 'ignore' });
        this.log('✅ Chrome/Chromium already available');
        return true;
      } catch {
        this.log('Chrome not found, proceeding with installation...');
      }

      // Set PUPPETEER_EXECUTABLE_PATH to use system Chrome
      const chromePaths = [
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
        '/usr/bin/google-chrome-stable'
      ];

      for (const chromePath of chromePaths) {
        if (fs.existsSync(chromePath)) {
          process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;
          this.log(`✅ Using Chrome at: ${chromePath}`);
          return true;
        }
      }

      // Try to install Chrome via puppeteer
      this.log('Installing Chrome via Puppeteer...');
      execSync('npx puppeteer browsers install chrome --path /tmp/chrome', { 
        stdio: 'inherit',
        timeout: 300000 // 5 minutes
      });
      
      process.env.PUPPETEER_EXECUTABLE_PATH = '/tmp/chrome/chrome/linux-*/chrome';
      this.log('✅ Chrome installed via Puppeteer');
      return true;

    } catch (error) {
      this.log(`❌ Chrome setup failed: ${error}`);
      return false;
    }
  }

  async setupPionexCredentials(): Promise<void> {
    this.log('🔑 Setting up Pionex credentials management...');
    
    // Create credentials directory if it doesn't exist
    const credentialsDir = path.join(process.cwd(), 'data', 'credentials');
    if (!fs.existsSync(credentialsDir)) {
      fs.mkdirSync(credentialsDir, { recursive: true });
    }

    // Create encrypted credentials file structure
    const credentialsTemplate = {
      pionex: {
        email: process.env.PIONEX_EMAIL || '',
        password: '', // Will be encrypted when user provides it
        twoFactorEnabled: false,
        lastLogin: null,
        sessionValid: false
      },
      security: {
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-key-change-in-production',
        lastUpdated: new Date().toISOString()
      }
    };

    const credentialsFile = path.join(credentialsDir, 'trading-credentials.json');
    if (!fs.existsSync(credentialsFile)) {
      fs.writeFileSync(credentialsFile, JSON.stringify(credentialsTemplate, null, 2));
      this.log('✅ Credentials template created');
    }
  }

  async setupTradingEnvironment(): Promise<void> {
    this.log('📊 Setting up trading environment...');
    
    // Create trading data directories
    const directories = [
      'data/trading/sim',
      'data/trading/real',
      'data/trading/logs',
      'data/trading/screenshots',
      'data/trading/backups'
    ];

    for (const dir of directories) {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`✅ Created directory: ${dir}`);
      }
    }

    // Create initial trading configuration
    const tradingConfig = {
      riskManagement: {
        maxRiskPerTrade: 0.02, // 2%
        stopLossThreshold: 0.10, // 10%
        emergencyStopAt: 100, // $100
        maxDailyLoss: 0.15 // 15%
      },
      tradingParams: {
        initialBalance: 150,
        currency: 'USD',
        allowedPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
        tradingHours: {
          start: '09:00',
          end: '17:00',
          timezone: 'UTC'
        }
      },
      automation: {
        enabled: true,
        maxConcurrentTrades: 3,
        rebalanceInterval: 300000, // 5 minutes
        heartbeatInterval: 60000 // 1 minute
      }
    };

    const configFile = path.join(process.cwd(), 'data', 'trading-config.json');
    if (!fs.existsSync(configFile)) {
      fs.writeFileSync(configFile, JSON.stringify(tradingConfig, null, 2));
      this.log('✅ Trading configuration created');
    }
  }

  async validateSystemHealth(): Promise<boolean> {
    this.log('🏥 Validating system health...');
    
    const checks = [
      {
        name: 'Node.js version',
        check: () => {
          const version = process.version;
          return version.startsWith('v18') || version.startsWith('v20');
        }
      },
      {
        name: 'Environment variables',
        check: () => {
          return process.env.DATABASE_URL && process.env.PERPLEXITY_API_KEY;
        }
      },
      {
        name: 'File permissions',
        check: () => {
          try {
            const testFile = path.join(process.cwd(), 'test-write.tmp');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            return true;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Required directories',
        check: () => {
          const requiredDirs = ['data', 'logs', 'server', 'client'];
          return requiredDirs.every(dir => fs.existsSync(path.join(process.cwd(), dir)));
        }
      }
    ];

    let allPassed = true;
    for (const check of checks) {
      const passed = check.check();
      this.log(`${passed ? '✅' : '❌'} ${check.name}: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) allPassed = false;
    }

    return allPassed;
  }

  async runCompleteSetup(): Promise<{
    success: boolean;
    message: string;
    details: string[];
  }> {
    const details: string[] = [];
    
    try {
      this.log('🚀 Starting automated setup process...');
      
      // Step 1: System health check
      const healthCheck = await this.validateSystemHealth();
      if (!healthCheck) {
        details.push('System health check failed');
      } else {
        details.push('System health check passed');
      }

      // Step 2: Setup Chrome browser
      const chromeSetup = await this.setupChromeBrowser();
      if (!chromeSetup) {
        details.push('Chrome setup failed - will use headless mode');
      } else {
        details.push('Chrome browser configured successfully');
      }

      // Step 3: Setup credentials management
      await this.setupPionexCredentials();
      details.push('Credentials management configured');

      // Step 4: Setup trading environment
      await this.setupTradingEnvironment();
      details.push('Trading environment configured');

      // Step 5: Final validation
      const finalCheck = chromeSetup && healthCheck;
      
      this.log(`🎉 Setup completed with ${finalCheck ? 'SUCCESS' : 'WARNINGS'}`);
      
      return {
        success: finalCheck,
        message: finalCheck 
          ? 'All systems configured and ready for trading'
          : 'Setup completed with warnings - system partially ready',
        details
      };

    } catch (error) {
      this.log(`❌ Setup failed: ${error}`);
      return {
        success: false,
        message: `Setup failed: ${error}`,
        details
      };
    }
  }
}

export const automatedSetup = new AutomatedSetup();