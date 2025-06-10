/**
 * DWC Systems LLC User Behavior Simulation
 * Tests all critical user interactions before manual testing
 */

import fetch from 'node-fetch';
const BASE_URL = 'http://localhost:5000';

class UserBehaviorSimulator {
  constructor() {
    this.testResults = [];
    this.userCredentials = [
      { username: 'watson', password: 'dwc2025', role: 'Level 15 Master' },
      { username: 'dion', password: 'nexus2025', role: 'Level 15 Master' },
      { username: 'admin', password: 'qnis2025', role: 'Administrator' },
      { username: 'intelligence', password: 'ptni2025', role: 'Intelligence Officer' },
      { username: 'analyst', password: 'neural2025', role: 'Data Analyst' },
      { username: 'viewer', password: 'view2025', role: 'Viewer' }
    ];
  }

  log(test, status, details = '') {
    const result = { test, status, details, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    console.log(`${status === 'PASS' ? '✅' : '❌'} ${test}: ${details}`);
  }

  async testHomepageLoad() {
    try {
      const response = await fetch(`${BASE_URL}/`);
      const data = await response.text();
      const hasTitle = data.includes('DWC Systems LLC');
      const hasMetrics = data.includes('Total Leads');
      
      if (hasTitle && hasMetrics) {
        this.log('Homepage Load', 'PASS', 'Homepage loads with DWC branding and metrics');
      } else {
        this.log('Homepage Load', 'FAIL', 'Missing DWC branding or metrics');
      }
    } catch (error) {
      this.log('Homepage Load', 'FAIL', `Error: ${error.message}`);
    }
  }

  async testDashboardMetrics() {
    try {
      const response = await fetch(`${BASE_URL}/api/dashboard/metrics`);
      const metrics = await response.json();
      
      const hasRealData = metrics.totalLeads > 0 && 
                         metrics.totalPipelineValue > 0 && 
                         metrics.realLeads && 
                         metrics.realLeads.length > 0;
      
      if (hasRealData) {
        this.log('Dashboard Metrics', 'PASS', 
          `Authentic data: ${metrics.totalLeads} leads, $${metrics.totalPipelineValue} pipeline`);
      } else {
        this.log('Dashboard Metrics', 'FAIL', 'Missing authentic business data');
      }
    } catch (error) {
      this.log('Dashboard Metrics', 'FAIL', `API Error: ${error.message}`);
    }
  }

  async testLoginFlow() {
    for (const cred of this.userCredentials.slice(0, 3)) {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cred.username,
            password: cred.password
          })
        });
        
        if (response.status === 200) {
          this.log(`Login (${cred.username})`, 'PASS', `${cred.role} login successful`);
        } else {
          this.log(`Login (${cred.username})`, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        this.log(`Login (${cred.username})`, 'FAIL', `Error: ${error.message}`);
      }
    }
  }

  async testConsoleAccess() {
    const consoles = [
      { path: '/watson', name: 'Watson Master Console' },
      { path: '/dion', name: 'DION Master Console' },
      { path: '/admin', name: 'Admin Dashboard' }
    ];

    for (const console of consoles) {
      try {
        const response = await fetch(`${BASE_URL}${console.path}`);
        const data = await response.text();
        const hasConsoleContent = data.includes('DWC Systems') || 
                                 data.includes('QNIS') ||
                                 data.includes('Console');
        
        if (hasConsoleContent) {
          this.log(`${console.name} Access`, 'PASS', 'Console loads successfully');
        } else {
          this.log(`${console.name} Access`, 'FAIL', 'Console content missing');
        }
      } catch (error) {
        this.log(`${console.name} Access`, 'FAIL', `Error: ${error.message}`);
      }
    }
  }

  async testResponsiveDesign() {
    try {
      const response = await fetch(`${BASE_URL}/`);
      const data = await response.text();
      const hasResponsiveClasses = data.includes('md:grid-cols') && 
                                  data.includes('lg:grid-cols') &&
                                  data.includes('backdrop-blur');
      
      if (hasResponsiveClasses) {
        this.log('Responsive Design', 'PASS', 'Mobile-first responsive classes detected');
      } else {
        this.log('Responsive Design', 'FAIL', 'Missing responsive design elements');
      }
    } catch (error) {
      this.log('Responsive Design', 'FAIL', `Error: ${error.message}`);
    }
  }

  async testSystemHealth() {
    try {
      const response = await fetch(`${BASE_URL}/api/dashboard/metrics`);
      const data = await response.json();
      const systemHealth = data.systemHealth;
      
      if (systemHealth >= 95) {
        this.log('System Health', 'PASS', `System health: ${systemHealth}%`);
      } else {
        this.log('System Health', 'WARN', `System health: ${systemHealth}% (below 95%)`);
      }
    } catch (error) {
      this.log('System Health', 'FAIL', `Error: ${error.message}`);
    }
  }

  async simulateTypicalUserSession() {
    console.log('\n🚀 DWC Systems LLC User Behavior Simulation\n');
    
    // Simulate typical user journey
    await this.testHomepageLoad();
    await this.testDashboardMetrics();
    await this.testLoginFlow();
    await this.testConsoleAccess();
    await this.testResponsiveDesign();
    await this.testSystemHealth();
    
    // Generate summary
    const passCount = this.testResults.filter(r => r.status === 'PASS').length;
    const failCount = this.testResults.filter(r => r.status === 'FAIL').length;
    const warnCount = this.testResults.filter(r => r.status === 'WARN').length;
    
    console.log('\n📊 SIMULATION RESULTS:');
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⚠️  Warnings: ${warnCount}`);
    
    if (failCount === 0) {
      console.log('\n🎉 PLATFORM READY FOR USER TESTING');
      console.log('All critical user interactions validated successfully');
    } else {
      console.log('\n⚠️  ISSUES DETECTED - FIXING BEFORE USER TESTING');
    }
    
    return { passCount, failCount, warnCount, results: this.testResults };
  }
}

// Run simulation
const simulator = new UserBehaviorSimulator();
simulator.simulateTypicalUserSession().then(results => {
  console.log('\n🔍 DETAILED TEST RESULTS:');
  results.results.forEach(result => {
    console.log(`${result.timestamp}: ${result.test} - ${result.status} - ${result.details}`);
  });
}).catch(error => {
  console.error('Simulation failed:', error);
});