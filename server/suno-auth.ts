import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const COOKIES_FILE = path.join(process.cwd(), 'suno_cookies.json');

export interface SunoSession {
  cookies: any[];
  userAgent: string;
  sessionValid: boolean;
  loginTime: Date;
}

export class SunoAuthManager {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;

  async initSecureLogin(): Promise<{ success: boolean; message: string; sessionId?: string }> {
    try {
      console.log('🚀 Starting SUNO secure login session...');
      
      // Launch browser with visible interface for manual input
      this.browser = await puppeteer.launch({
        headless: false, // Keep visible for manual interaction
        defaultViewport: null,
        args: [
          '--start-maximized',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });

      this.page = await this.browser.newPage();
      
      // Set user agent
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Navigate to SUNO login
      console.log('📱 Navigating to SUNO login page...');
      await this.page.goto('https://app.suno.com', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for page to load and look for login elements
      await this.page.waitForTimeout(3000);
      
      console.log('✅ SUNO login page loaded. Please complete manual login:');
      console.log('1. Enter your phone number when prompted');
      console.log('2. Enter the 2FA SMS code when it arrives');
      console.log('3. Complete any additional verification steps');
      
      // Monitor for successful login by watching for dashboard elements
      const sessionId = await this.waitForLoginCompletion();
      
      if (sessionId) {
        await this.saveCookieSession();
        return {
          success: true,
          message: 'SUNO login successful. Session cookies saved for future auto-login.',
          sessionId
        };
      } else {
        return {
          success: false,
          message: 'Login timeout or failed. Please try again.'
        };
      }

    } catch (error) {
      console.error('SUNO login error:', error);
      return {
        success: false,
        message: `Login failed: ${error.message}`
      };
    }
  }

  private async waitForLoginCompletion(): Promise<string | null> {
    if (!this.page) return null;

    try {
      console.log('⏳ Waiting for login completion...');
      
      // Wait for either successful login indicators or timeout
      const result = await Promise.race([
        // Look for dashboard/app elements that indicate successful login
        this.page.waitForSelector('[data-testid="dashboard"]', { timeout: 300000 }).then(() => 'dashboard'),
        this.page.waitForSelector('.app-container', { timeout: 300000 }).then(() => 'app-container'),
        this.page.waitForSelector('[class*="dashboard"]', { timeout: 300000 }).then(() => 'dashboard-class'),
        this.page.waitForFunction(() => {
          return window.location.href.includes('/app') || 
                 window.location.href.includes('/dashboard') ||
                 document.querySelector('[data-testid*="user"]') !== null;
        }, { timeout: 300000 }).then(() => 'url-change'),
        
        // Timeout after 5 minutes
        new Promise(resolve => setTimeout(() => resolve('timeout'), 300000))
      ]);

      if (result === 'timeout') {
        console.log('⏰ Login timeout reached');
        return null;
      }

      console.log('✅ Login completion detected:', result);
      
      // Give extra time for any redirects or page loads
      await this.page.waitForTimeout(5000);
      
      // Generate session ID
      const sessionId = `suno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return sessionId;

    } catch (error) {
      console.error('Error waiting for login:', error);
      return null;
    }
  }

  private async saveCookieSession(): Promise<void> {
    if (!this.page) return;

    try {
      // Get all cookies from the current page
      const cookies = await this.page.cookies();
      
      // Get user agent
      const userAgent = await this.page.evaluate(() => navigator.userAgent);
      
      // Prepare session data
      const sessionData: SunoSession = {
        cookies,
        userAgent,
        sessionValid: true,
        loginTime: new Date()
      };

      // Save to file
      await fs.writeFile(COOKIES_FILE, JSON.stringify(sessionData, null, 2));
      console.log('💾 Session cookies saved to suno_cookies.json');

    } catch (error) {
      console.error('Error saving cookies:', error);
    }
  }

  async loadSavedSession(): Promise<boolean> {
    try {
      // Check if cookies file exists
      const cookiesData = await fs.readFile(COOKIES_FILE, 'utf-8');
      const session: SunoSession = JSON.parse(cookiesData);
      
      // Check if session is not too old (24 hours)
      const sessionAge = Date.now() - new Date(session.loginTime).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > maxAge) {
        console.log('🕐 Saved session expired');
        return false;
      }

      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }

      this.page = await this.browser.newPage();
      await this.page.setUserAgent(session.userAgent);
      
      // Set cookies
      await this.page.setCookie(...session.cookies);
      
      // Test session by navigating to SUNO
      await this.page.goto('https://app.suno.com', { waitUntil: 'networkidle2' });
      
      // Check if we're logged in
      const isLoggedIn = await this.page.evaluate(() => {
        return !window.location.href.includes('/login') && 
               !window.location.href.includes('/auth');
      });

      if (isLoggedIn) {
        console.log('✅ Saved session restored successfully');
        return true;
      } else {
        console.log('❌ Saved session invalid');
        return false;
      }

    } catch (error) {
      console.log('📝 No valid saved session found');
      return false;
    }
  }

  async generateTrack(config: {
    prompt: string;
    style?: string;
    title?: string;
  }): Promise<{ success: boolean; trackId?: string; message: string }> {
    if (!this.page) {
      return { success: false, message: 'No active SUNO session. Please login first.' };
    }

    try {
      console.log('🎵 Generating track with SUNO API...');
      
      // Navigate to generation page
      await this.page.goto('https://app.suno.com/create', { waitUntil: 'networkidle2' });
      
      // Look for prompt input field
      const promptSelector = 'textarea[placeholder*="prompt"], textarea[placeholder*="describe"], input[placeholder*="prompt"]';
      await this.page.waitForSelector(promptSelector, { timeout: 10000 });
      
      // Clear and enter prompt
      await this.page.click(promptSelector);
      await this.page.keyboard.selectAll();
      await this.page.type(promptSelector, config.prompt);
      
      // Look for generate button
      const generateSelector = 'button[type="submit"], button:contains("Generate"), button:contains("Create")';
      await this.page.click(generateSelector);
      
      console.log('🚀 Track generation started...');
      
      // Wait for generation to complete (this might take several minutes)
      await this.page.waitForSelector('[data-testid="track-result"], .track-result, .generated-track', {
        timeout: 180000 // 3 minutes
      });
      
      // Extract track ID or URL
      const trackResult = await this.page.evaluate(() => {
        const trackElement = document.querySelector('[data-testid="track-result"], .track-result, .generated-track');
        if (trackElement) {
          const trackId = trackElement.getAttribute('data-track-id') || 
                         trackElement.getAttribute('id') ||
                         window.location.pathname.split('/').pop();
          return trackId;
        }
        return null;
      });

      if (trackResult) {
        return {
          success: true,
          trackId: trackResult,
          message: `Track generated successfully. ID: ${trackResult}`
        };
      } else {
        return {
          success: false,
          message: 'Track generation completed but could not extract track ID'
        };
      }

    } catch (error) {
      console.error('Track generation error:', error);
      return {
        success: false,
        message: `Generation failed: ${error.message}`
      };
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// Export singleton instance
export const sunoAuth = new SunoAuthManager();