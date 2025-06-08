/**
 * Lean Deployment Extractor
 * Extract only essential DWC Systems components for clean deployment
 */

export interface ComponentExtract {
  name: string;
  type: 'automation' | 'intelligence' | 'api' | 'ui';
  essential: boolean;
  dependencies: string[];
  size: 'small' | 'medium' | 'large';
}

export class LeanDeploymentExtractor {
  private essentialComponents: ComponentExtract[] = [
    {
      name: 'NASA API Integration',
      type: 'api',
      essential: true,
      dependencies: ['NASA_API_KEY'],
      size: 'small'
    },
    {
      name: 'Domain Email Automation',
      type: 'automation',
      essential: true,
      dependencies: ['puppeteer'],
      size: 'medium'
    },
    {
      name: 'Intelligent Email Agent',
      type: 'intelligence',
      essential: true,
      dependencies: ['OPENAI_API_KEY', 'puppeteer'],
      size: 'medium'
    },
    {
      name: 'Form Automation',
      type: 'automation',
      essential: true,
      dependencies: ['puppeteer'],
      size: 'small'
    },
    {
      name: 'Lead Intelligence Dashboard',
      type: 'ui',
      essential: true,
      dependencies: ['react', 'shadcn'],
      size: 'small'
    }
  ];

  private excludedComponents = [
    'trading-bot',
    'pionex-integration',
    'binance-connector',
    'quantum-trading',
    'hyperdrive-trading',
    'alpaca-trading'
  ];

  extractEssentials(): { 
    components: ComponentExtract[], 
    totalSize: number,
    deploymentReady: boolean 
  } {
    const totalSize = this.essentialComponents.reduce((acc, comp) => {
      const sizeMap = { small: 1, medium: 3, large: 5 };
      return acc + sizeMap[comp.size];
    }, 0);

    return {
      components: this.essentialComponents,
      totalSize,
      deploymentReady: totalSize <= 15 // Keep under 15 units for clean deployment
    };
  }

  generateCleanPackage(): {
    name: string;
    version: string;
    description: string;
    main: string;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    files: string[];
  } {
    return {
      name: "dwc-systems-automation",
      version: "1.0.0",
      description: "DWC Systems - Enterprise Automation Platform",
      main: "server/index.ts",
      scripts: {
        "start": "NODE_ENV=production tsx server/index.ts",
        "dev": "NODE_ENV=development tsx server/index.ts",
        "build": "vite build",
        "deploy": "npm run build && npm start"
      },
      dependencies: {
        "express": "^4.18.2",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "tsx": "^4.7.0",
        "vite": "^5.0.0",
        "@vitejs/plugin-react": "^4.2.1",
        "puppeteer": "^21.7.0",
        "openai": "^4.24.7",
        "lucide-react": "^0.307.0",
        "@radix-ui/react-dialog": "^1.0.5",
        "@radix-ui/react-tabs": "^1.0.4",
        "tailwindcss": "^3.4.0"
      },
      files: [
        "client/**/*",
        "server/**/*",
        "shared/**/*",
        "package.json",
        "vite.config.ts",
        "tailwind.config.ts",
        "tsconfig.json"
      ]
    };
  }

  excludeUnnecessaryFiles(): string[] {
    return [
      'trading-bot/**/*',
      'modules/quantum_trading_agent/**/*',
      'server/pionex-*.ts',
      'server/binance-*.ts',
      'server/hyperdrive-*.ts',
      'server/dual-trading-*.ts',
      'client/src/pages/pionex-*.tsx',
      'client/src/pages/trading-*.tsx',
      'client/src/components/trading-*.tsx',
      '*.zip',
      'logs/**/*',
      'data/**/*',
      'attached_assets/**/*'
    ];
  }

  getDeploymentManifest(): {
    essential: string[];
    optional: string[];
    excluded: string[];
    environmentVars: string[];
  } {
    return {
      essential: [
        'client/',
        'server/routes.ts',
        'server/index.ts',
        'server/domain-email-automation.ts',
        'server/intelligent-email-agent.ts',
        'server/automated-api-key-manager.ts',
        'shared/schema.ts',
        'package.json',
        'vite.config.ts'
      ],
      optional: [
        'server/google-api-automation.ts',
        'server/openai-codex-integration.ts'
      ],
      excluded: this.excludeUnnecessaryFiles(),
      environmentVars: [
        'NASA_API_KEY',
        'OPENAI_API_KEY',
        'GOOGLE_PLACES_API_KEY'
      ]
    };
  }
}

export const leanDeploymentExtractor = new LeanDeploymentExtractor();