/**
 * DWC Universal Component Extractor
 * Enhanced version for DWC Systems business automation platform
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DWCComponent {
  name: string;
  type: 'automation' | 'intelligence' | 'api' | 'ui' | 'security';
  sourceFiles: string[];
  dependencies: string[];
  apiEndpoints: string[];
  businessValue: 'high' | 'medium' | 'low';
  deploymentReady: boolean;
  extractedCode?: string;
  configuration?: Record<string, any>;
}

export class DWCUniversalExtractor {
  private components: Map<string, DWCComponent> = new Map();
  
  constructor() {
    this.initializeComponents();
  }

  private initializeComponents() {
    // NASA Intelligence Integration
    this.components.set('nasa-intelligence', {
      name: 'NASA Intelligence Integration',
      type: 'intelligence',
      sourceFiles: [
        'client/src/pages/nasa-powered-landing.tsx',
        'server/routes.ts'
      ],
      dependencies: ['NASA_API_KEY'],
      apiEndpoints: ['/api/nasa/apod', '/api/nasa/earth-imagery'],
      businessValue: 'high',
      deploymentReady: true
    });

    // Domain Email Automation
    this.components.set('domain-automation', {
      name: 'Domain Email Automation System',
      type: 'automation',
      sourceFiles: [
        'server/domain-email-automation.ts'
      ],
      dependencies: ['puppeteer'],
      apiEndpoints: ['/api/domain/register', '/api/email/setup'],
      businessValue: 'high',
      deploymentReady: true
    });

    // Intelligent Email Agent
    this.components.set('email-intelligence', {
      name: 'Intelligent Email Management',
      type: 'intelligence',
      sourceFiles: [
        'server/intelligent-email-agent.ts',
        'client/src/pages/intelligent-email-management.tsx'
      ],
      dependencies: ['OPENAI_API_KEY', 'puppeteer'],
      apiEndpoints: ['/api/email/process', '/api/email/insights', '/api/email/threats'],
      businessValue: 'high',
      deploymentReady: true
    });

    // API Key Management
    this.components.set('api-management', {
      name: 'Automated API Key Manager',
      type: 'automation',
      sourceFiles: [
        'server/automated-api-key-manager.ts',
        'client/src/pages/automated-api-manager.tsx'
      ],
      dependencies: ['puppeteer'],
      apiEndpoints: ['/api/acquire-api-key'],
      businessValue: 'high',
      deploymentReady: true
    });

    // Form Automation
    this.components.set('form-automation', {
      name: 'Intelligent Form Automation',
      type: 'automation',
      sourceFiles: [
        'client/src/pages/intelligent-form-automation.tsx'
      ],
      dependencies: ['OPENAI_API_KEY'],
      apiEndpoints: ['/api/form-automation'],
      businessValue: 'medium',
      deploymentReady: true
    });

    // Security & Filtering
    this.components.set('security-filtering', {
      name: 'AI Security & Threat Filtering',
      type: 'security',
      sourceFiles: [
        'server/intelligent-email-agent.ts'
      ],
      dependencies: ['OPENAI_API_KEY'],
      apiEndpoints: ['/api/email/threats', '/api/security/analyze'],
      businessValue: 'high',
      deploymentReady: true
    });
  }

  async extractComponent(componentId: string): Promise<DWCComponent | null> {
    const component = this.components.get(componentId);
    if (!component) return null;

    try {
      // Extract source code from files
      let extractedCode = '';
      for (const filePath of component.sourceFiles) {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          extractedCode += `\n// === ${filePath} ===\n${content}\n`;
        }
      }

      component.extractedCode = extractedCode;
      component.configuration = await this.generateConfiguration(component);

      return component;
    } catch (error) {
      console.error(`Error extracting component ${componentId}:`, error);
      return null;
    }
  }

  async extractAllComponents(): Promise<DWCComponent[]> {
    const extracted: DWCComponent[] = [];
    
    const componentEntries = Array.from(this.components.entries());
    for (const [id, component] of componentEntries) {
      const extractedComponent = await this.extractComponent(id);
      if (extractedComponent) {
        extracted.push(extractedComponent);
      }
    }

    return extracted;
  }

  async generateDeploymentPackage(selectedComponents: string[]): Promise<{
    packageInfo: any;
    components: DWCComponent[];
    deploymentScript: string;
    environmentSetup: string[];
    installationGuide: string;
  }> {
    const components: DWCComponent[] = [];
    const allDependencies = new Set<string>();
    const allEndpoints: string[] = [];

    // Extract selected components
    for (const componentId of selectedComponents) {
      const component = await this.extractComponent(componentId);
      if (component) {
        components.push(component);
        component.dependencies.forEach(dep => allDependencies.add(dep));
        allEndpoints.push(...component.apiEndpoints);
      }
    }

    const packageInfo = {
      name: 'dwc-systems-automation-suite',
      version: '1.0.0',
      description: 'DWC Systems Enterprise Automation Platform - Extracted Components',
      created: new Date().toISOString(),
      components: selectedComponents,
      totalEndpoints: allEndpoints.length,
      businessValue: 'enterprise-grade'
    };

    const deploymentScript = this.generateDeploymentScript(components);
    const environmentSetup = Array.from(allDependencies);
    const installationGuide = this.generateInstallationGuide(components);

    return {
      packageInfo,
      components,
      deploymentScript,
      environmentSetup,
      installationGuide
    };
  }

  private async generateConfiguration(component: DWCComponent): Promise<Record<string, any>> {
    const config: Record<string, any> = {
      enabled: true,
      priority: component.businessValue,
      endpoints: component.apiEndpoints,
      dependencies: component.dependencies
    };

    // Component-specific configurations
    switch (component.type) {
      case 'intelligence':
        config.aiEnabled = true;
        config.processingMode = 'real-time';
        break;
      case 'automation':
        config.autoExecution = true;
        config.errorHandling = 'graceful';
        break;
      case 'security':
        config.threatDetection = true;
        config.blockingEnabled = true;
        break;
    }

    return config;
  }

  private generateDeploymentScript(components: DWCComponent[]): string {
    return `#!/bin/bash
# DWC Systems Automated Deployment Script
# Generated: ${new Date().toISOString()}

echo "🚀 Starting DWC Systems deployment..."

# Install dependencies
npm install

# Build application
npm run build

# Set up environment variables
${components.flatMap(c => c.dependencies)
  .filter(dep => dep.includes('_KEY'))
  .map(key => `echo "Set ${key} in your environment"`)
  .join('\n')}

# Start services
npm start

echo "✅ DWC Systems deployment complete!"
echo "Available endpoints:"
${components.flatMap(c => c.apiEndpoints)
  .map(endpoint => `echo "  ${endpoint}"`)
  .join('\n')}
`;
  }

  private generateInstallationGuide(components: DWCComponent[]): string {
    const envVars = components.flatMap(c => c.dependencies)
      .filter(dep => dep.includes('_KEY'))
      .filter((value, index, self) => self.indexOf(value) === index);

    return `# DWC Systems Installation Guide

## Prerequisites
- Node.js 18+
- npm or yarn

## Environment Setup
Add these environment variables:

${envVars.map(key => `export ${key}="your_${key.toLowerCase()}"`).join('\n')}

## Installation Steps
1. Extract deployment package
2. Run: npm install
3. Set environment variables
4. Run: npm start

## Components Included
${components.map(c => `- ${c.name} (${c.type})`).join('\n')}

## Business Value
Each component provides enterprise-grade automation capabilities for:
- Zero manual work requirement
- AI-powered intelligence
- Secure data processing
- Real-time operation monitoring

## Support
Contact DWC Systems for enterprise support and customization.
`;
  }

  async createOptimizedBuild(): Promise<{
    success: boolean;
    buildSize: string;
    excludedFiles: string[];
    includedComponents: string[];
  }> {
    try {
      // Get all essential components
      const essentialComponents = Array.from(this.components.keys())
        .filter(id => this.components.get(id)?.businessValue === 'high');

      // Calculate build metrics
      const { stdout } = await execAsync('du -sh client server shared 2>/dev/null || echo "0K"');
      const buildSize = stdout.trim().split('\t')[0] || 'Unknown';

      return {
        success: true,
        buildSize,
        excludedFiles: [
          'trading-bot/**',
          'modules/quantum_trading_agent/**',
          '*.zip',
          'logs/**',
          'attached_assets/**'
        ],
        includedComponents: essentialComponents
      };
    } catch (error) {
      return {
        success: false,
        buildSize: 'Error',
        excludedFiles: [],
        includedComponents: []
      };
    }
  }

  getAvailableComponents(): Array<{id: string, component: DWCComponent}> {
    return Array.from(this.components.entries()).map(([id, component]) => ({
      id,
      component
    }));
  }
}

export const dwcExtractor = new DWCUniversalExtractor();