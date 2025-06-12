/**
 * NEXUS Production Readiness Validator
 * Comprehensive deployment validation for enterprise-grade readiness
 */

class NEXUSProductionValidator {
  constructor() {
    this.validationResults = [];
    this.criticalIssues = [];
    this.warnings = [];
    this.baseUrl = 'http://localhost:5000';
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
    this.validationResults.push({ timestamp, type, message });
  }

  async validateEndpoint(endpoint, method = 'GET', expectedStatus = 200) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { method });
      const isValid = response.status === expectedStatus;
      
      if (isValid) {
        this.log(`✓ ${endpoint} - Status ${response.status}`, 'SUCCESS');
      } else {
        this.log(`✗ ${endpoint} - Status ${response.status} (expected ${expectedStatus})`, 'ERROR');
        this.criticalIssues.push(`Endpoint ${endpoint} returned ${response.status}`);
      }
      
      return isValid;
    } catch (error) {
      this.log(`✗ ${endpoint} - Connection failed: ${error.message}`, 'ERROR');
      this.criticalIssues.push(`Endpoint ${endpoint} unreachable`);
      return false;
    }
  }

  async validateCoreInfrastructure() {
    this.log('=== CORE INFRASTRUCTURE VALIDATION ===');
    
    const coreEndpoints = [
      '/api/dashboard/metrics',
      '/api/leads/generate',
      '/api/auth/health',
      '/modules',
      '/nexus',
      '/settings'
    ];

    let validEndpoints = 0;
    for (const endpoint of coreEndpoints) {
      if (await this.validateEndpoint(endpoint)) {
        validEndpoints++;
      }
    }

    const infrastructureScore = (validEndpoints / coreEndpoints.length) * 100;
    this.log(`Infrastructure Score: ${infrastructureScore.toFixed(1)}%`);
    
    if (infrastructureScore < 90) {
      this.criticalIssues.push('Core infrastructure reliability below 90%');
    }

    return infrastructureScore >= 90;
  }

  async validateAIIntegration() {
    this.log('=== AI INTEGRATION VALIDATION ===');
    
    const hasOpenAI = process.env.OPENAI_API_KEY ? true : false;
    this.log(`OpenAI API Key: ${hasOpenAI ? 'CONFIGURED' : 'MISSING'}`, 
             hasOpenAI ? 'SUCCESS' : 'WARNING');

    if (!hasOpenAI) {
      this.warnings.push('OpenAI API key not configured - AI features limited');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/leads/generate`);
      const data = await response.json();
      
      if (data.success && data.count > 0) {
        this.log(`✓ AI Lead Generation: ${data.count} leads generated`, 'SUCCESS');
        return true;
      } else {
        this.log('✗ AI Lead Generation failed', 'ERROR');
        this.criticalIssues.push('AI lead generation not functional');
        return false;
      }
    } catch (error) {
      this.log(`✗ AI Integration test failed: ${error.message}`, 'ERROR');
      this.criticalIssues.push('AI integration test failed');
      return false;
    }
  }

  async validateModuleRegistry() {
    this.log('=== MODULE REGISTRY VALIDATION ===');
    
    const moduleEndpoints = [
      '/api/analytics/business-intelligence',
      '/api/trading/consolidated-status',
      '/api/nexus/intelligence',
      '/api/automation/dashboard-status',
      '/api/financial/transcendence-analysis'
    ];

    let activeModules = 0;
    for (const endpoint of moduleEndpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (response.status === 200) {
          activeModules++;
          this.log(`✓ Module active: ${endpoint}`, 'SUCCESS');
        } else {
          this.log(`⚠ Module inactive: ${endpoint}`, 'WARNING');
          this.warnings.push(`Module ${endpoint} not responding`);
        }
      } catch (error) {
        this.log(`✗ Module error: ${endpoint}`, 'ERROR');
      }
    }

    const moduleScore = (activeModules / moduleEndpoints.length) * 100;
    this.log(`Active Modules: ${activeModules}/${moduleEndpoints.length} (${moduleScore.toFixed(1)}%)`);
    
    return moduleScore >= 70;
  }

  async validateSecurityHeaders() {
    this.log('=== SECURITY VALIDATION ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/dashboard/metrics`);
      const headers = response.headers;
      
      const securityChecks = [
        { header: 'x-content-type-options', expected: 'nosniff' },
        { header: 'x-frame-options', expected: 'DENY' },
        { header: 'x-xss-protection', expected: '1; mode=block' }
      ];

      let securityScore = 0;
      for (const check of securityChecks) {
        const value = headers.get(check.header);
        if (value && value.toLowerCase().includes(check.expected.toLowerCase())) {
          this.log(`✓ Security header: ${check.header}`, 'SUCCESS');
          securityScore++;
        } else {
          this.log(`⚠ Missing security header: ${check.header}`, 'WARNING');
          this.warnings.push(`Security header ${check.header} not configured`);
        }
      }

      return securityScore >= 2;
    } catch (error) {
      this.log(`✗ Security validation failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async validatePerformance() {
    this.log('=== PERFORMANCE VALIDATION ===');
    
    const performanceTests = [
      { endpoint: '/api/dashboard/metrics', maxTime: 1000 },
      { endpoint: '/modules', maxTime: 2000 },
      { endpoint: '/nexus', maxTime: 2000 }
    ];

    let performanceIssues = 0;
    for (const test of performanceTests) {
      const startTime = Date.now();
      try {
        await fetch(`${this.baseUrl}${test.endpoint}`);
        const responseTime = Date.now() - startTime;
        
        if (responseTime <= test.maxTime) {
          this.log(`✓ ${test.endpoint}: ${responseTime}ms (target: ${test.maxTime}ms)`, 'SUCCESS');
        } else {
          this.log(`⚠ ${test.endpoint}: ${responseTime}ms (slow)`, 'WARNING');
          this.warnings.push(`Slow response: ${test.endpoint} (${responseTime}ms)`);
          performanceIssues++;
        }
      } catch (error) {
        this.log(`✗ Performance test failed: ${test.endpoint}`, 'ERROR');
        performanceIssues++;
      }
    }

    return performanceIssues === 0;
  }

  async validateDataIntegrity() {
    this.log('=== DATA INTEGRITY VALIDATION ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/dashboard/metrics`);
      const data = await response.json();
      
      const requiredFields = ['totalLeads', 'activeProposals', 'pipelineValue', 'conversionRate', 'systemHealth', 'activeModules'];
      let validFields = 0;
      
      for (const field of requiredFields) {
        if (data[field] !== undefined && data[field] !== null) {
          validFields++;
          this.log(`✓ Data field: ${field} = ${data[field]}`, 'SUCCESS');
        } else {
          this.log(`✗ Missing data field: ${field}`, 'ERROR');
          this.criticalIssues.push(`Missing required data field: ${field}`);
        }
      }

      return validFields === requiredFields.length;
    } catch (error) {
      this.log(`✗ Data integrity check failed: ${error.message}`, 'ERROR');
      this.criticalIssues.push('Data integrity validation failed');
      return false;
    }
  }

  generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      status: this.criticalIssues.length === 0 ? 'READY' : 'NEEDS_FIXES',
      criticalIssues: this.criticalIssues,
      warnings: this.warnings,
      summary: {
        totalChecks: this.validationResults.length,
        criticalIssues: this.criticalIssues.length,
        warnings: this.warnings.length,
        deploymentReady: this.criticalIssues.length === 0
      },
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.criticalIssues.length > 0) {
      recommendations.push('Fix all critical issues before deployment');
    }
    
    if (this.warnings.length > 0) {
      recommendations.push('Address warnings for optimal performance');
    }
    
    if (this.criticalIssues.length === 0) {
      recommendations.push('Platform is ready for production deployment');
      recommendations.push('Consider enabling HTTPS for production');
      recommendations.push('Set up monitoring and alerting');
      recommendations.push('Configure backup strategies');
    }

    return recommendations;
  }

  async executeFullValidation() {
    this.log('🚀 NEXUS PRODUCTION READINESS VALIDATION STARTED');
    
    const validationSteps = [
      { name: 'Core Infrastructure', test: () => this.validateCoreInfrastructure() },
      { name: 'AI Integration', test: () => this.validateAIIntegration() },
      { name: 'Module Registry', test: () => this.validateModuleRegistry() },
      { name: 'Security Headers', test: () => this.validateSecurityHeaders() },
      { name: 'Performance', test: () => this.validatePerformance() },
      { name: 'Data Integrity', test: () => this.validateDataIntegrity() }
    ];

    let passedSteps = 0;
    for (const step of validationSteps) {
      try {
        const result = await step.test();
        if (result) {
          passedSteps++;
          this.log(`✅ ${step.name}: PASSED`);
        } else {
          this.log(`❌ ${step.name}: FAILED`);
        }
      } catch (error) {
        this.log(`💥 ${step.name}: ERROR - ${error.message}`);
      }
    }

    const overallScore = (passedSteps / validationSteps.length) * 100;
    this.log(`\n🎯 OVERALL READINESS SCORE: ${overallScore.toFixed(1)}%`);
    
    const report = this.generateDeploymentReport();
    this.log(`\n📊 DEPLOYMENT STATUS: ${report.status}`);
    
    if (report.status === 'READY') {
      this.log('🎉 NEXUS PLATFORM IS PRODUCTION READY!');
    } else {
      this.log('⚠️  CRITICAL ISSUES NEED RESOLUTION BEFORE DEPLOYMENT');
    }

    return report;
  }
}

// Execute validation
async function runProductionValidation() {
  const validator = new NEXUSProductionValidator();
  const report = await validator.executeFullValidation();
  
  console.log('\n' + '='.repeat(60));
  console.log('PRODUCTION READINESS REPORT');
  console.log('='.repeat(60));
  console.log(JSON.stringify(report, null, 2));
  
  return report;
}

// Auto-run if called directly
runProductionValidation().catch(console.error);