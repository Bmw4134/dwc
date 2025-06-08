/**
 * DWC Systems Final Deployment Validation
 * Comprehensive system readiness assessment
 */

import fetch from 'node-fetch';

class DeploymentValidator {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = [];
    this.startTime = Date.now();
  }

  async validateEndpoint(endpoint, method = 'GET') {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const responseTime = Date.now() - start;
      const success = response.status === 200;
      
      this.results.push({
        endpoint,
        status: response.status,
        responseTime,
        success
      });
      
      console.log(`${success ? '✓' : '✗'} ${endpoint} - ${response.status} (${responseTime}ms)`);
      return success;
      
    } catch (error) {
      const responseTime = Date.now() - start;
      this.results.push({
        endpoint,
        status: 0,
        responseTime,
        success: false,
        error: error.message
      });
      
      console.log(`✗ ${endpoint} - ERROR: ${error.message}`);
      return false;
    }
  }

  async runSystemValidation() {
    console.log('='.repeat(60));
    console.log('DWC SYSTEMS DEPLOYMENT VALIDATION');
    console.log('='.repeat(60));
    
    // Core system endpoints
    const coreEndpoints = [
      '/api/system/metrics',
      '/api/admin/system-status',
      '/api/admin/automation-tasks'
    ];
    
    // Watson intelligence endpoints
    const watsonEndpoints = [
      '/api/watson/intelligence-core',
      '/api/watson/unlock-status'
    ];
    
    // Control interface endpoints
    const controlEndpoints = [
      '/api/infinity/system-status',
      '/api/kaizen/deployment-status',
      '/api/kaizen/introspection',
      '/api/users',
      '/api/users/summary',
      '/api/layer-chart/active-goals',
      '/api/layer-chart/live-report'
    ];
    
    // Test all endpoints
    const allEndpoints = [...coreEndpoints, ...watsonEndpoints, ...controlEndpoints];
    
    console.log('Testing core system endpoints...');
    for (const endpoint of coreEndpoints) {
      await this.validateEndpoint(endpoint);
    }
    
    console.log('\nTesting Watson intelligence systems...');
    for (const endpoint of watsonEndpoints) {
      await this.validateEndpoint(endpoint);
    }
    
    console.log('\nTesting control interfaces...');
    for (const endpoint of controlEndpoints) {
      await this.validateEndpoint(endpoint);
    }
    
    // Concurrent load test
    console.log('\nExecuting concurrent load test...');
    const concurrentPromises = [];
    for (let i = 0; i < 20; i++) {
      for (const endpoint of allEndpoints) {
        concurrentPromises.push(this.validateEndpoint(endpoint));
      }
    }
    
    await Promise.all(concurrentPromises);
    
    this.generateReport();
  }
  
  generateReport() {
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    const successRate = (successfulTests / totalTests * 100).toFixed(2);
    const avgResponseTime = (this.results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests).toFixed(2);
    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('DEPLOYMENT VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Successful: ${successfulTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Average Response Time: ${avgResponseTime}ms`);
    console.log(`Total Test Time: ${totalTime}s`);
    
    const deploymentReady = parseFloat(successRate) >= 95.0 && failedTests < 10;
    
    if (deploymentReady) {
      console.log('\n✓ SYSTEM READY FOR DEPLOYMENT');
      console.log('All critical interfaces operational with acceptable performance');
    } else {
      console.log('\n✗ DEPLOYMENT NOT RECOMMENDED');
      console.log(`Success rate: ${successRate}% (minimum 95% required)`);
    }
    
    return deploymentReady;
  }
}

// Execute validation
const validator = new DeploymentValidator();
validator.runSystemValidation()
  .then(() => {
    console.log('\nValidation completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });