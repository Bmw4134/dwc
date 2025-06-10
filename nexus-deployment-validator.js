/**
 * NEXUS Deployment Validator - Real Issues Detector
 * Identifies and fixes actual deployment blockers
 */

import { writeFileSync } from 'fs';

class NEXUSDeploymentValidator {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.issues = [];
    this.fixes = [];
    this.validationResults = [];
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${type}: ${message}`);
    this.validationResults.push({ timestamp, type, message });
  }

  async validateAuthentication() {
    this.log('Testing authentication system integrity');
    
    const testCredentials = [
      { username: 'watson', password: 'dwc2025' },
      { username: 'admin', password: 'qnis2025' }
    ];

    for (const cred of testCredentials) {
      try {
        const response = await fetch(`${this.baseUrl}/api/auth/quantum-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cred)
        });

        const data = await response.json();
        
        if (response.ok && data.success && data.token && data.user) {
          this.log(`Authentication working for ${cred.username}`, 'SUCCESS');
        } else {
          this.issues.push(`Authentication incomplete for ${cred.username}`);
          this.log(`Authentication issue for ${cred.username}: ${JSON.stringify(data)}`, 'ERROR');
        }
      } catch (error) {
        this.issues.push(`Authentication error: ${error.message}`);
        this.log(`Authentication error: ${error.message}`, 'ERROR');
      }
    }
  }

  async validateDashboardFlow() {
    this.log('Testing complete dashboard user flow');
    
    try {
      // Test login → dashboard redirect
      const loginResponse = await fetch(`${this.baseUrl}/api/auth/quantum-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'watson', password: 'dwc2025' })
      });

      if (!loginResponse.ok) {
        this.issues.push('Login API not responding correctly');
        return;
      }

      // Test dashboard access
      const dashboardResponse = await fetch(`${this.baseUrl}/admin`);
      const dashboardContent = await dashboardResponse.text();
      
      if (!dashboardContent.includes('DWC Systems LLC') || !dashboardContent.includes('Executive Dashboard')) {
        this.issues.push('Dashboard content missing essential elements');
        this.log('Dashboard missing critical content', 'ERROR');
      } else {
        this.log('Dashboard content validated', 'SUCCESS');
      }

      // Test metrics API
      const metricsResponse = await fetch(`${this.baseUrl}/api/dashboard/metrics`);
      const metricsData = await metricsResponse.json();
      
      if (!metricsData.totalLeads || !metricsData.totalPipelineValue) {
        this.issues.push('Dashboard metrics missing essential data');
        this.log('Dashboard metrics incomplete', 'ERROR');
      } else {
        this.log(`Dashboard metrics complete: ${metricsData.totalLeads} leads`, 'SUCCESS');
      }
    } catch (error) {
      this.issues.push(`Dashboard flow error: ${error.message}`);
      this.log(`Dashboard flow error: ${error.message}`, 'ERROR');
    }
  }

  async validateModuleAccessibility() {
    this.log('Testing module accessibility and functionality');
    
    const criticalModules = [
      '/api/quantum/dashboard',
      '/api/leads/intelligence', 
      '/api/financial/reports',
      '/api/automation/control'
    ];

    for (const module of criticalModules) {
      try {
        const response = await fetch(`${this.baseUrl}${module}`);
        const content = await response.text();
        
        if (response.ok && content.includes('<title>') && content.includes('Back to Dashboard')) {
          this.log(`Module ${module} fully functional`, 'SUCCESS');
        } else if (response.ok) {
          this.issues.push(`Module ${module} serving content but missing navigation`);
          this.log(`Module ${module} content issue`, 'WARNING');
        } else {
          this.issues.push(`Module ${module} not accessible`);
          this.log(`Module ${module} failed: ${response.status}`, 'ERROR');
        }
      } catch (error) {
        this.issues.push(`Module ${module} error: ${error.message}`);
        this.log(`Module ${module} error: ${error.message}`, 'ERROR');
      }
    }
  }

  async validateSystemIntegrity() {
    this.log('Testing system integrity and data consistency');
    
    try {
      // Test NEXUS status
      const nexusResponse = await fetch(`${this.baseUrl}/api/nexus/status`);
      if (nexusResponse.ok) {
        const nexusData = await nexusResponse.json();
        if (nexusData.activeModules && nexusData.systemHealth) {
          this.log(`NEXUS system operational: ${nexusData.activeModules} modules`, 'SUCCESS');
        } else {
          this.issues.push('NEXUS status data incomplete');
        }
      } else {
        this.issues.push('NEXUS status endpoint not responding');
      }

      // Test intelligence core
      const intelligenceResponse = await fetch(`${this.baseUrl}/api/qnis/core-intelligence`);
      if (intelligenceResponse.ok) {
        const intelligenceData = await intelligenceResponse.json();
        if (intelligenceData.success && intelligenceData.data) {
          this.log('Intelligence core operational', 'SUCCESS');
        } else {
          this.issues.push('Intelligence core returning incomplete data');
        }
      } else {
        this.issues.push('Intelligence core not accessible');
      }
    } catch (error) {
      this.issues.push(`System integrity error: ${error.message}`);
      this.log(`System integrity error: ${error.message}`, 'ERROR');
    }
  }

  async validateUserExperience() {
    this.log('Testing complete user experience flow');
    
    try {
      // Test landing page
      const landingResponse = await fetch(`${this.baseUrl}/`);
      const landingContent = await landingResponse.text();
      
      if (!landingContent.includes('loginForm') || !landingContent.includes('quick-btn')) {
        this.issues.push('Landing page missing login elements');
        this.log('Landing page incomplete', 'ERROR');
      } else {
        this.log('Landing page functional', 'SUCCESS');
      }

      // Test responsive design
      if (!landingContent.includes('@media') || !landingContent.includes('viewport')) {
        this.issues.push('Landing page missing responsive design');
        this.log('Responsive design missing', 'WARNING');
      } else {
        this.log('Responsive design present', 'SUCCESS');
      }

      // Test admin dashboard completeness
      const adminResponse = await fetch(`${this.baseUrl}/admin`);
      const adminContent = await adminResponse.text();
      
      if (!adminContent.includes('modules-grid') || !adminContent.includes('metric-card')) {
        this.issues.push('Admin dashboard missing module interface');
        this.log('Admin dashboard incomplete', 'ERROR');
      } else {
        this.log('Admin dashboard complete', 'SUCCESS');
      }
    } catch (error) {
      this.issues.push(`User experience error: ${error.message}`);
      this.log(`User experience error: ${error.message}`, 'ERROR');
    }
  }

  async performLoadTesting() {
    this.log('Performing load testing on critical endpoints');
    
    const criticalEndpoints = [
      '/api/auth/quantum-login',
      '/api/dashboard/metrics',
      '/api/nexus/status'
    ];

    for (const endpoint of criticalEndpoints) {
      try {
        const startTime = Date.now();
        const promises = [];
        
        for (let i = 0; i < 5; i++) {
          if (endpoint === '/api/auth/quantum-login') {
            promises.push(fetch(`${this.baseUrl}${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: 'watson', password: 'dwc2025' })
            }));
          } else {
            promises.push(fetch(`${this.baseUrl}${endpoint}`));
          }
        }
        
        const responses = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const successCount = responses.filter(r => r.ok).length;
        
        if (successCount === 5 && duration < 1000) {
          this.log(`Load test passed for ${endpoint}: ${duration}ms`, 'SUCCESS');
        } else if (successCount < 5) {
          this.issues.push(`Load test failed for ${endpoint}: only ${successCount}/5 requests succeeded`);
          this.log(`Load test failed for ${endpoint}`, 'ERROR');
        } else {
          this.issues.push(`Load test slow for ${endpoint}: ${duration}ms`);
          this.log(`Load test slow for ${endpoint}`, 'WARNING');
        }
      } catch (error) {
        this.issues.push(`Load test error for ${endpoint}: ${error.message}`);
        this.log(`Load test error for ${endpoint}: ${error.message}`, 'ERROR');
      }
    }
  }

  generateFixRecommendations() {
    this.log('Generating fix recommendations for identified issues');
    
    this.fixes = [];
    
    if (this.issues.length === 0) {
      this.fixes.push('System is deployment ready - no fixes required');
      return;
    }

    for (const issue of this.issues) {
      if (issue.includes('Authentication')) {
        this.fixes.push('Fix authentication system: verify credential validation and token generation');
      } else if (issue.includes('Dashboard')) {
        this.fixes.push('Fix dashboard system: ensure all metrics APIs return complete data');
      } else if (issue.includes('Module')) {
        this.fixes.push('Fix module endpoints: ensure all modules serve complete HTML with navigation');
      } else if (issue.includes('NEXUS')) {
        this.fixes.push('Fix NEXUS core: verify status endpoint returns complete system data');
      } else if (issue.includes('responsive')) {
        this.fixes.push('Fix responsive design: add mobile viewport and media queries');
      } else if (issue.includes('Load test')) {
        this.fixes.push('Optimize performance: reduce response times and improve reliability');
      } else {
        this.fixes.push(`Fix general issue: ${issue}`);
      }
    }

    // Remove duplicates
    this.fixes = [...new Set(this.fixes)];
  }

  generateDeploymentReport() {
    const successCount = this.validationResults.filter(r => r.type === 'SUCCESS').length;
    const errorCount = this.validationResults.filter(r => r.type === 'ERROR').length;
    const warningCount = this.validationResults.filter(r => r.type === 'WARNING').length;
    const totalTests = this.validationResults.length;
    
    const deploymentReady = this.issues.length === 0;
    const criticalIssues = this.issues.filter(issue => 
      issue.includes('Authentication') || 
      issue.includes('Dashboard') || 
      issue.includes('not accessible')
    ).length;
    
    return {
      deploymentStatus: deploymentReady ? 'READY' : (criticalIssues > 0 ? 'BLOCKED' : 'NEEDS_ATTENTION'),
      summary: {
        totalTests,
        successCount,
        errorCount,
        warningCount,
        successRate: `${((successCount / totalTests) * 100).toFixed(1)}%`,
        issuesFound: this.issues.length,
        criticalIssues,
        timestamp: new Date().toISOString()
      },
      issues: this.issues,
      fixes: this.fixes,
      validationResults: this.validationResults,
      readinessScore: deploymentReady ? 100 : Math.max(0, 100 - (criticalIssues * 25) - (this.issues.length * 5)),
      recommendations: deploymentReady ? 
        ['System is ready for production deployment'] : 
        ['Address critical issues before deployment', ...this.fixes]
    };
  }

  async executeComprehensiveValidation() {
    this.log('Starting comprehensive NEXUS deployment validation');
    
    try {
      await this.validateAuthentication();
      await this.validateDashboardFlow();
      await this.validateModuleAccessibility();
      await this.validateSystemIntegrity();
      await this.validateUserExperience();
      await this.performLoadTesting();
      
      this.generateFixRecommendations();
      const report = this.generateDeploymentReport();
      
      // Save detailed report
      writeFileSync('nexus-deployment-validation.json', JSON.stringify(report, null, 2));
      
      this.log(`Validation complete: ${report.deploymentStatus}`, 
        report.deploymentStatus === 'READY' ? 'SUCCESS' : 'ERROR');
      this.log(`Issues found: ${this.issues.length}`, 'INFO');
      this.log(`Readiness score: ${report.readinessScore}%`, 'INFO');
      
      return report;
    } catch (error) {
      this.log(`Validation execution error: ${error.message}`, 'ERROR');
      throw error;
    }
  }
}

// Execute validation
const validator = new NEXUSDeploymentValidator();
validator.executeComprehensiveValidation()
  .then(report => {
    console.log('\n=== NEXUS DEPLOYMENT VALIDATION COMPLETE ===');
    console.log(`Status: ${report.deploymentStatus}`);
    console.log(`Readiness Score: ${report.readinessScore}%`);
    console.log(`Issues Found: ${report.issues.length}`);
    
    if (report.issues.length > 0) {
      console.log('\nCritical Issues:');
      report.issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
      
      console.log('\nRecommended Fixes:');
      report.fixes.forEach((fix, i) => console.log(`${i + 1}. ${fix}`));
    }
    
    console.log('\nReport saved to nexus-deployment-validation.json');
    process.exit(report.deploymentStatus === 'READY' ? 0 : 1);
  })
  .catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });