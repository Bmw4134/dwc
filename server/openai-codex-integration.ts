import OpenAI from 'openai';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CodexRequest {
  prompt: string;
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css';
  context?: string;
}

interface CodexResponse {
  code: string;
  explanation: string;
  suggestions: string[];
  complexity: 'simple' | 'intermediate' | 'advanced';
}

interface PlaywrightStep {
  action: string;
  selector?: string;
  value?: string;
  description: string;
  screenshot?: boolean;
}

interface AutomationWalkthrough {
  title: string;
  description: string;
  steps: PlaywrightStep[];
  expectedOutcome: string;
  estimatedDuration: string;
}

export class OpenAICodexIntegration {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  // Generate code using OpenAI GPT-4
  async generateCode(request: CodexRequest): Promise<CodexResponse> {
    try {
      const systemPrompt = `You are an expert software engineer specializing in ${request.language}. 
      Generate clean, production-ready code with explanations and best practices.
      Always include error handling and follow modern coding standards.`;

      const userPrompt = `${request.context ? `Context: ${request.context}\n\n` : ''}
      Generate ${request.language} code for: ${request.prompt}
      
      Please provide:
      1. The complete, working code
      2. A clear explanation of how it works
      3. Suggestions for improvements or alternatives
      4. Complexity assessment (simple/intermediate/advanced)
      
      Format your response as JSON with keys: code, explanation, suggestions, complexity`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        code: result.code || '',
        explanation: result.explanation || '',
        suggestions: result.suggestions || [],
        complexity: result.complexity || 'intermediate'
      };

    } catch (error) {
      console.error('OpenAI Codex error:', error);
      throw new Error('Failed to generate code. Please ensure your OpenAI API key is configured.');
    }
  }

  // Generate Playwright automation script
  async generatePlaywrightScript(description: string, targetUrl: string): Promise<AutomationWalkthrough> {
    try {
      const prompt = `Create a detailed Playwright automation script for: ${description}
      Target URL: ${targetUrl}
      
      Generate a comprehensive walkthrough including:
      1. Step-by-step actions (click, type, wait, etc.)
      2. CSS selectors for each element
      3. Expected outcomes
      4. Error handling steps
      5. Screenshot points for verification
      
      Format as JSON with structure:
      {
        "title": "Automation Title",
        "description": "What this automation does",
        "steps": [
          {
            "action": "navigate|click|type|wait|screenshot",
            "selector": "CSS selector if needed",
            "value": "text to type if needed",
            "description": "What this step does",
            "screenshot": true/false
          }
        ],
        "expectedOutcome": "What should happen",
        "estimatedDuration": "X minutes"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert in web automation and Playwright. Create detailed, executable automation scripts."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as AutomationWalkthrough;

    } catch (error) {
      console.error('Playwright script generation error:', error);
      throw new Error('Failed to generate automation script. Please ensure your OpenAI API key is configured.');
    }
  }

  // Execute Playwright automation
  async executeAutomation(walkthrough: AutomationWalkthrough): Promise<{
    success: boolean;
    completedSteps: number;
    screenshots: string[];
    error?: string;
  }> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const screenshots: string[] = [];
    let completedSteps = 0;

    try {
      for (const step of walkthrough.steps) {
        console.log(`Executing: ${step.description}`);

        switch (step.action) {
          case 'navigate':
            if (step.value) {
              await this.page.goto(step.value, { waitUntil: 'networkidle2' });
            }
            break;

          case 'click':
            if (step.selector) {
              await this.page.waitForSelector(step.selector, { timeout: 10000 });
              await this.page.click(step.selector);
            }
            break;

          case 'type':
            if (step.selector && step.value) {
              await this.page.waitForSelector(step.selector, { timeout: 10000 });
              await this.page.type(step.selector, step.value);
            }
            break;

          case 'wait':
            if (step.value) {
              await this.page.waitForTimeout(parseInt(step.value));
            } else {
              await this.page.waitForTimeout(2000);
            }
            break;

          case 'screenshot':
            const screenshot = await this.page.screenshot({ 
              encoding: 'base64',
              fullPage: true 
            });
            screenshots.push(`data:image/png;base64,${screenshot}`);
            break;
        }

        if (step.screenshot) {
          const screenshot = await this.page.screenshot({ 
            encoding: 'base64',
            fullPage: false 
          });
          screenshots.push(`data:image/png;base64,${screenshot}`);
        }

        completedSteps++;
        await this.page.waitForTimeout(1000); // Brief pause between steps
      }

      return {
        success: true,
        completedSteps,
        screenshots
      };

    } catch (error) {
      console.error('Automation execution error:', error);
      return {
        success: false,
        completedSteps,
        screenshots,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Analyze webpage for automation opportunities
  async analyzePageForAutomation(url: string): Promise<{
    forms: Array<{ selector: string; description: string; }>;
    buttons: Array<{ selector: string; text: string; }>;
    inputs: Array<{ selector: string; type: string; placeholder?: string; }>;
    suggestions: string[];
  }> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    await this.page.goto(url, { waitUntil: 'networkidle2' });

    const analysis = await this.page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form')).map((form, index) => ({
        selector: form.id ? `#${form.id}` : `form:nth-child(${index + 1})`,
        description: form.getAttribute('name') || form.getAttribute('action') || `Form ${index + 1}`
      }));

      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]')).map((btn, index) => ({
        selector: btn.id ? `#${btn.id}` : btn.className ? `.${btn.className.split(' ')[0]}` : `button:nth-child(${index + 1})`,
        text: (btn as HTMLElement).innerText || (btn as HTMLInputElement).value || 'Button'
      }));

      const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map((input, index) => ({
        selector: input.id ? `#${input.id}` : input.name ? `[name="${input.name}"]` : `input:nth-child(${index + 1})`,
        type: (input as HTMLInputElement).type || 'text',
        placeholder: (input as HTMLInputElement).placeholder
      }));

      return { forms, buttons, inputs };
    });

    // Generate automation suggestions using OpenAI
    const suggestions = await this.generateAutomationSuggestions(analysis);

    return {
      ...analysis,
      suggestions
    };
  }

  private async generateAutomationSuggestions(pageElements: any): Promise<string[]> {
    try {
      const prompt = `Based on this webpage analysis, suggest practical automation opportunities:
      Forms: ${JSON.stringify(pageElements.forms)}
      Buttons: ${JSON.stringify(pageElements.buttons)}
      Inputs: ${JSON.stringify(pageElements.inputs)}
      
      Provide 5-7 specific automation suggestions that would be valuable for business operations.
      Format as a JSON array of strings.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an automation expert. Suggest practical, business-valuable automation opportunities."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];

    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [
        'Automate form submissions for lead capture',
        'Create automated testing workflows',
        'Set up periodic data extraction',
        'Implement automated login sequences',
        'Monitor for page changes or updates'
      ];
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

export const openaiCodexIntegration = new OpenAICodexIntegration();