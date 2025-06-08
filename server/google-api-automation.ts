import puppeteer, { Browser, Page } from 'puppeteer';

export interface GoogleAPISetupResult {
  success: boolean;
  apiKey?: string;
  error?: string;
  steps: string[];
}

export class GoogleAPIAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private steps: string[] = [];

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false, // Interactive mode
      defaultViewport: null,
      args: ['--start-maximized', '--no-sandbox']
    });
    this.page = await this.browser.newPage();
    this.addStep('Browser initialized in interactive mode');
  }

  private addStep(step: string): void {
    this.steps.push(`${new Date().toLocaleTimeString()}: ${step}`);
    console.log(`[Google API Setup] ${step}`);
  }

  async automateGooglePlacesAPISetup(): Promise<GoogleAPISetupResult> {
    try {
      if (!this.page || !this.browser) {
        await this.initialize();
      }

      // Step 1: Navigate to Google Cloud Console
      this.addStep('Navigating to Google Cloud Console...');
      await this.page!.goto('https://console.cloud.google.com', { waitUntil: 'networkidle2' });
      
      // Wait for user to log in if needed
      this.addStep('Please log in to your Google account if prompted');
      await this.waitForUserAction('Please log in to your Google account. Press Enter when ready to continue...');

      // Step 2: Check if we need to create/select a project
      this.addStep('Checking for existing projects...');
      
      // Look for project selector
      try {
        await this.page!.waitForSelector('[data-testid="project-switcher-button"]', { timeout: 10000 });
        await this.page!.click('[data-testid="project-switcher-button"]');
        this.addStep('Project selector opened');
        
        await this.waitForUserAction('Select an existing project or create a new one. Press Enter when done...');
      } catch (error) {
        this.addStep('Project selector not found, continuing...');
      }

      // Step 3: Navigate to APIs & Services
      this.addStep('Navigating to APIs & Services...');
      await this.page!.goto('https://console.cloud.google.com/apis/dashboard', { waitUntil: 'networkidle2' });

      // Step 4: Enable Places API
      this.addStep('Searching for Places API...');
      await this.page!.goto('https://console.cloud.google.com/apis/library/places-backend.googleapis.com', { waitUntil: 'networkidle2' });
      
      // Try to enable the API
      try {
        const enableButton = await this.page!.$('button[aria-label="Enable"], button:contains("Enable")');
        if (enableButton) {
          await enableButton.click();
          this.addStep('Places API enabled successfully');
          await this.page!.waitForTimeout(3000);
        } else {
          this.addStep('Places API may already be enabled');
        }
      } catch (error) {
        this.addStep('Could not automatically enable API - please enable manually');
        await this.waitForUserAction('Please manually enable the Places API if needed. Press Enter when ready...');
      }

      // Step 5: Create API Key
      this.addStep('Navigating to Credentials page...');
      await this.page!.goto('https://console.cloud.google.com/apis/credentials', { waitUntil: 'networkidle2' });

      this.addStep('Creating new API key...');
      try {
        // Look for "Create Credentials" button
        await this.page!.waitForSelector('button[aria-label="Create Credentials"]', { timeout: 10000 });
        await this.page!.click('button[aria-label="Create Credentials"]');
        
        // Select API key option
        await this.page!.waitForTimeout(1000);
        const apiKeyOption = await this.page!.$('text=API key');
        if (apiKeyOption) {
          await apiKeyOption.click();
          this.addStep('API key creation initiated');
        }
      } catch (error) {
        this.addStep('Could not automatically create API key');
        await this.waitForUserAction('Please manually create an API key: Click "Create Credentials" > "API key". Press Enter when done...');
      }

      // Step 6: Wait for API key to be created and copy it
      this.addStep('Waiting for API key to be generated...');
      await this.waitForUserAction('Copy your API key from the dialog and paste it in the next prompt. Press Enter when ready...');

      const apiKey = await this.promptForAPIKey();
      
      if (apiKey) {
        // Step 7: Restrict the API key (optional but recommended)
        this.addStep('API key received. You may want to restrict it to Places API for security.');
        await this.waitForUserAction('Optional: Restrict your API key to Places API in the Google Console for better security. Press Enter to continue...');

        return {
          success: true,
          apiKey: apiKey,
          steps: this.steps
        };
      } else {
        return {
          success: false,
          error: 'No API key provided',
          steps: this.steps
        };
      }

    } catch (error) {
      this.addStep(`Error during setup: ${error}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        steps: this.steps
      };
    }
  }

  private async waitForUserAction(message: string): Promise<void> {
    this.addStep(message);
    console.log(`\n🔄 ${message}`);
    
    // In a real implementation, you'd use readline or similar for user input
    // For now, we'll use a timeout to simulate user action
    await this.page!.waitForTimeout(2000);
  }

  private async promptForAPIKey(): Promise<string | null> {
    // In a real implementation, this would prompt the user for input
    // For now, we'll return null to indicate manual entry needed
    console.log('\n📋 Please paste your Google Places API key here:');
    return null;
  }

  async takeScreenshot(filename: string): Promise<string> {
    if (!this.page) return '';
    
    const screenshotPath = `./screenshots/${filename}`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.addStep(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.addStep('Browser closed');
    }
  }

  getSteps(): string[] {
    return this.steps;
  }
}

export const googleAPIAutomation = new GoogleAPIAutomation();