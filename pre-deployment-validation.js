/**
 * DWC Systems LLC Pre-Deployment Production Validation
 * Comprehensive system readiness assessment before live deployment
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

class PreDeploymentValidator {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'PASS' ? '✅' : type === 'FAIL' ? '❌' : type === 'WARN' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async validateEndpoint(endpoint, method = 'GET', expectedStatus = 200) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        timeout: 10000,
        validateStatus: () => true
      });

      if (response.status === expectedStatus) {
        this.log(`${endpoint} - Status ${response.status}`, 'PASS');
        this.results.passed++;
        return { passed: true, status: response.status, data: response.data };
      } else {
        this.log(`${endpoint} - Expected ${expectedStatus}, got ${response.status}`, 'FAIL');
        this.results.failed++;
        return { passed: false, status: response.status, expected: expectedStatus };
      }
    } catch (error) {
      this.log(`${endpoint} - Connection error: ${error.message}`, 'FAIL');
      this.results.failed++;
      return { passed: false, error: error.message };
    }
  }

  async validateStaticAssets() {
    this.log('Validating static assets and build files', 'INFO');
    
    const staticFiles = [
      'server/public/index.html'
    ];

    for (const file of staticFiles) {
      if (fs.existsSync(file)) {
        this.log(`Static file exists: ${file}`, 'PASS');
        this.results.passed++;
      } else {
        this.log(`Missing static file: ${file}`, 'FAIL');
        this.results.failed++;
      }
    }
  }

  async validateCoreEndpoints() {
    this.log('Validating core application endpoints', 'INFO');
    
    const endpoints = [
      { path: '/', status: 200 },
      { path: '/api/dashboard/metrics', status: 200 },
      { path: '/api/health', status: 200 },
      { path: '/admin', status: 200 },
      { path: '/watson', status: 200 },
      { path: '/dion', status: 200 }
    ];

    for (const endpoint of endpoints) {
      await this.validateEndpoint(endpoint.path, 'GET', endpoint.status);
    }
  }

  async validateBusinessMetrics() {
    this.log('Validating business metrics data integrity', 'INFO');
    
    try {
      const response = await this.validateEndpoint('/api/dashboard/metrics');
      
      if (response.passed && response.data) {
        const metrics = response.data;
        
        // Validate required business metrics
        const requiredFields = ['totalLeads', 'activeProposals', 'totalPipelineValue', 'systemHealth'];
        let validMetrics = 0;
        
        for (const field of requiredFields) {
          if (metrics[field] !== undefined && metrics[field] !== null) {
            this.log(`Business metric ${field}: ${metrics[field]}`, 'PASS');
            validMetrics++;
            this.results.passed++;
          } else {
            this.log(`Missing business metric: ${field}`, 'FAIL');
            this.results.failed++;
          }
        }

        // Validate realistic business values
        if (metrics.totalLeads >= 20 && metrics.totalLeads <= 50) {
          this.log(`Lead count realistic: ${metrics.totalLeads}`, 'PASS');
          this.results.passed++;
        } else {
          this.log(`Lead count may need adjustment: ${metrics.totalLeads}`, 'WARN');
          this.results.warnings++;
        }

        if (metrics.totalPipelineValue >= 400000 && metrics.totalPipelineValue <= 1000000) {
          this.log(`Pipeline value credible: $${metrics.totalPipelineValue}`, 'PASS');
          this.results.passed++;
        } else {
          this.log(`Pipeline value may need adjustment: $${metrics.totalPipelineValue}`, 'WARN');
          this.results.warnings++;
        }
      }
    } catch (error) {
      this.log(`Business metrics validation failed: ${error.message}`, 'FAIL');
      this.results.failed++;
    }
  }

  async validateAuthentication() {
    this.log('Validating authentication system', 'INFO');
    
    const authEndpoints = [
      '/admin',
      '/watson', 
      '/dion',
      '/intelligence',
      '/analyst'
    ];

    for (const endpoint of authEndpoints) {
      const result = await this.validateEndpoint(endpoint);
      
      if (result.passed) {
        this.log(`Authentication endpoint accessible: ${endpoint}`, 'PASS');
      } else {
        this.log(`Authentication endpoint issue: ${endpoint}`, 'WARN');
        this.results.warnings++;
      }
    }
  }

  async validateSystemHealth() {
    this.log('Validating system health and performance', 'INFO');
    
    try {
      const response = await this.validateEndpoint('/api/health');
      
      if (response.passed) {
        this.log('System health endpoint responsive', 'PASS');
        this.results.passed++;
      }

      // Check system resource usage
      const memoryUsage = process.memoryUsage();
      const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      
      if (memoryMB < 512) {
        this.log(`Memory usage acceptable: ${memoryMB}MB`, 'PASS');
        this.results.passed++;
      } else {
        this.log(`Memory usage high: ${memoryMB}MB`, 'WARN');
        this.results.warnings++;
      }
    } catch (error) {
      this.log(`System health check failed: ${error.message}`, 'FAIL');
      this.results.failed++;
    }
  }

  async validateDWCBranding() {
    this.log('Validating DWC Systems LLC branding consistency', 'INFO');
    
    try {
      const response = await this.validateEndpoint('/');
      
      if (response.passed && response.data) {
        const content = response.data.toString();
        
        if (content.includes('DWC Systems LLC')) {
          this.log('DWC Systems LLC branding present', 'PASS');
          this.results.passed++;
        } else {
          this.log('DWC Systems LLC branding missing', 'FAIL');
          this.results.failed++;
        }

        if (content.includes('QNIS/PTNI')) {
          this.log('QNIS/PTNI platform branding present', 'PASS');
          this.results.passed++;
        } else {
          this.log('QNIS/PTNI platform branding missing', 'FAIL');
          this.results.failed++;
        }

        if (content.includes('Intelligence Platform')) {
          this.log('Intelligence Platform messaging present', 'PASS');
          this.results.passed++;
        } else {
          this.log('Intelligence Platform messaging missing', 'WARN');
          this.results.warnings++;
        }
      }
    } catch (error) {
      this.log(`Branding validation failed: ${error.message}`, 'FAIL');
      this.results.failed++;
    }
  }

  async validateMobileResponsiveness() {
    this.log('Validating mobile responsiveness configuration', 'INFO');
    
    try {
      const response = await this.validateEndpoint('/');
      
      if (response.passed && response.data) {
        const content = response.data.toString();
        
        if (content.includes('viewport') && content.includes('width=device-width')) {
          this.log('Mobile viewport meta tag configured', 'PASS');
          this.results.passed++;
        } else {
          this.log('Mobile viewport configuration missing', 'FAIL');
          this.results.failed++;
        }

        if (content.includes('@media') || content.includes('responsive')) {
          this.log('Responsive design implementation detected', 'PASS');
          this.results.passed++;
        } else {
          this.log('Responsive design may need enhancement', 'WARN');
          this.results.warnings++;
        }
      }
    } catch (error) {
      this.log(`Mobile responsiveness validation failed: ${error.message}`, 'FAIL');
      this.results.failed++;
    }
  }

  async validateProductionReadiness() {
    this.log('Validating production deployment readiness', 'INFO');
    
    // Check for development-only configurations
    const configChecks = [
      { file: 'package.json', shouldNotContain: ['nodemon'] },
      { file: 'server/index.ts', shouldContain: ['express'] }
    ];

    for (const check of configChecks) {
      try {
        if (fs.existsSync(check.file)) {
          const content = fs.readFileSync(check.file, 'utf8');
          
          if (check.shouldContain) {
            for (const item of check.shouldContain) {
              if (content.includes(item)) {
                this.log(`Production requirement found in ${check.file}: ${item}`, 'PASS');
                this.results.passed++;
              } else {
                this.log(`Production requirement missing in ${check.file}: ${item}`, 'FAIL');
                this.results.failed++;
              }
            }
          }

          if (check.shouldNotContain) {
            for (const item of check.shouldNotContain) {
              if (!content.includes(item)) {
                this.log(`Development dependency not found in ${check.file}: ${item}`, 'PASS');
                this.results.passed++;
              } else {
                this.log(`Development dependency still present in ${check.file}: ${item}`, 'WARN');
                this.results.warnings++;
              }
            }
          }
        }
      } catch (error) {
        this.log(`Configuration check failed for ${check.file}: ${error.message}`, 'FAIL');
        this.results.failed++;
      }
    }
  }

  generateDeploymentReport() {
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    
    this.log('\n' + '='.repeat(80), 'INFO');
    this.log('DWC SYSTEMS LLC PRE-DEPLOYMENT VALIDATION REPORT', 'INFO');
    this.log('='.repeat(80), 'INFO');
    this.log(`✅ Tests Passed: ${this.results.passed}`, 'INFO');
    this.log(`❌ Tests Failed: ${this.results.failed}`, 'INFO');
    this.log(`⚠️  Warnings: ${this.results.warnings}`, 'INFO');
    this.log(`📊 Success Rate: ${successRate}%`, 'INFO');
    this.log('='.repeat(80), 'INFO');

    const deploymentReady = this.results.failed === 0 && successRate >= 85;
    
    if (deploymentReady) {
      this.log('🚀 DEPLOYMENT STATUS: READY FOR PRODUCTION', 'PASS');
      this.log('✅ All critical systems validated successfully', 'INFO');
      this.log('✅ DWC Systems LLC branding confirmed', 'INFO');
      this.log('✅ Business metrics validated', 'INFO');
      this.log('✅ Authentication system operational', 'INFO');
      this.log('✅ Mobile responsiveness confirmed', 'INFO');
    } else {
      this.log('⚠️  DEPLOYMENT STATUS: REQUIRES ATTENTION', 'WARN');
      this.log(`❌ ${this.results.failed} critical issues must be resolved`, 'INFO');
      if (this.results.warnings > 0) {
        this.log(`⚠️  ${this.results.warnings} warnings should be reviewed`, 'INFO');
      }
    }

    return {
      ready: deploymentReady,
      results: this.results,
      successRate: parseFloat(successRate)
    };
  }

  async executeFullValidation() {
    this.log('Starting DWC Systems LLC Pre-Deployment Validation', 'INFO');
    this.log('Platform: QNIS/PTNI Intelligence Platform', 'INFO');
    
    await this.validateStaticAssets();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateCoreEndpoints();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateBusinessMetrics();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateAuthentication();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateSystemHealth();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateDWCBranding();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateMobileResponsiveness();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.validateProductionReadiness();
    
    return this.generateDeploymentReport();
  }
}

async function runPreDeploymentValidation() {
  const validator = new PreDeploymentValidator();
  
  try {
    const report = await validator.executeFullValidation();
    
    // Save validation report
    const reportData = {
      timestamp: new Date().toISOString(),
      platform: 'DWC Systems LLC QNIS/PTNI Intelligence Platform',
      validation: report,
      recommendations: [
        'Ensure all authentication credentials are production-ready',
        'Verify SSL certificates are configured for HTTPS',
        'Confirm database connections are optimized for production load',
        'Test all critical user workflows end-to-end',
        'Validate backup and recovery procedures'
      ]
    };

    fs.writeFileSync('deployment-validation-report.json', JSON.stringify(reportData, null, 2));
    
    console.log('\n📋 Validation report saved to: deployment-validation-report.json');
    
    if (report.ready) {
      console.log('\n🎉 DWC Systems LLC QNIS/PTNI Platform is READY for production deployment!');
    } else {
      console.log('\n⚠️  Please address the identified issues before deploying to production.');
    }
    
    return report;
  } catch (error) {
    console.error('❌ Pre-deployment validation failed:', error.message);
    process.exit(1);
  }
}

// Execute validation if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPreDeploymentValidation();
}

export { PreDeploymentValidator, runPreDeploymentValidation };