/**
 * NEXUS Platform Diagnostic Trace
 * Identifies loading and authentication issues
 */

console.log('🔍 NEXUS Diagnostic Trace Starting...');

// Check 1: Platform Loading Detection
function checkPlatformLoading() {
    console.log('\n📋 PLATFORM LOADING DIAGNOSTIC:');
    
    // Check DOM elements that should exist in comprehensive platform
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const moduleGrid = document.querySelector('.dashboard-grid');
    const testingInfo = document.getElementById('testing-info');
    
    console.log('✓ Login section present:', !!loginSection);
    console.log('✓ Dashboard section present:', !!dashboardSection);
    console.log('✓ Module grid present:', !!moduleGrid);
    console.log('✓ Testing info present:', !!testingInfo);
    
    // Check for 20+ modules
    const moduleCards = document.querySelectorAll('.module-card');
    console.log('✓ Module cards count:', moduleCards.length);
    
    // Check navigation categories
    const categories = ['overview', 'automation', 'intelligence', 'trading', 'analytics', 'control'];
    categories.forEach(cat => {
        const element = document.getElementById(cat + '-modules');
        console.log(`✓ ${cat} category:`, !!element);
    });
    
    return {
        loginPresent: !!loginSection,
        dashboardPresent: !!dashboardSection,
        moduleCount: moduleCards.length,
        testingInfoPresent: !!testingInfo,
        isComprehensivePlatform: moduleCards.length >= 15
    };
}

// Check 2: Authentication System
function checkAuthenticationSystem() {
    console.log('\n🔐 AUTHENTICATION SYSTEM DIAGNOSTIC:');
    
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const loginForm = document.querySelector('form');
    
    console.log('✓ Username field present:', !!usernameField);
    console.log('✓ Password field present:', !!passwordField);
    console.log('✓ Login form present:', !!loginForm);
    console.log('✓ handleLogin function available:', typeof handleLogin === 'function');
    
    // Test credentials visibility
    if (usernameField && passwordField) {
        console.log('✓ Form fields are interactive');
        
        // Test auto-fill with admin credentials
        usernameField.value = 'admin';
        passwordField.value = 'nexus2024';
        console.log('✓ Auto-filled admin credentials');
        
        // Attempt login
        if (typeof handleLogin === 'function') {
            console.log('🚀 Attempting admin login...');
            const event = new Event('submit');
            event.preventDefault = () => {};
            handleLogin(event);
        }
    }
    
    return {
        formPresent: !!(usernameField && passwordField && loginForm),
        loginFunctionAvailable: typeof handleLogin === 'function'
    };
}

// Check 3: Testing Suite Integration
function checkTestingSuite() {
    console.log('\n🧪 TESTING SUITE DIAGNOSTIC:');
    
    const testingFunctions = [
        'runNexusDeepDive',
        'runUserBehaviorTests', 
        'runRedeploymentValidation',
        'showTestingPanel'
    ];
    
    testingFunctions.forEach(func => {
        console.log(`✓ ${func} available:`, typeof window[func] === 'function');
    });
    
    return testingFunctions.every(func => typeof window[func] === 'function');
}

// Check 4: Module Configuration System
function checkModuleSystem() {
    console.log('\n⚙️ MODULE SYSTEM DIAGNOSTIC:');
    
    const configFunctions = [
        'saveSystemConfig',
        'generateNewLeads',
        'queryWatsonAI',
        'executeTrade',
        'createUser',
        'exportSystemData'
    ];
    
    configFunctions.forEach(func => {
        console.log(`✓ ${func} available:`, typeof window[func] === 'function');
    });
    
    // Test module info retrieval
    if (typeof getModuleInfo === 'function') {
        const testModule = getModuleInfo('system-status');
        console.log('✓ Module info system working:', !!(testModule.title && testModule.content));
    }
    
    return configFunctions.every(func => typeof window[func] === 'function');
}

// Check 5: Platform Version Detection
function detectPlatformVersion() {
    console.log('\n🔍 PLATFORM VERSION DETECTION:');
    
    // Look for specific indicators
    const title = document.title;
    const hasNexusBranding = title.includes('NEXUS');
    const hasTestingPanel = typeof showTestingPanel === 'function';
    const hasDeepDive = typeof runNexusDeepDive === 'function';
    const moduleCount = document.querySelectorAll('.module-card').length;
    
    console.log('✓ Page title:', title);
    console.log('✓ NEXUS branding:', hasNexusBranding);
    console.log('✓ Testing panel function:', hasTestingPanel);
    console.log('✓ Deep dive function:', hasDeepDive);
    console.log('✓ Module count:', moduleCount);
    
    // Determine platform version
    if (hasNexusBranding && hasTestingPanel && hasDeepDive && moduleCount >= 15) {
        console.log('🟢 PLATFORM VERSION: Comprehensive NEXUS Enterprise Platform');
        return 'comprehensive';
    } else if (moduleCount > 0 && moduleCount < 10) {
        console.log('🟡 PLATFORM VERSION: Basic Dashboard (OLD VERSION)');
        return 'basic';
    } else {
        console.log('🔴 PLATFORM VERSION: Unknown or corrupted');
        return 'unknown';
    }
}

// Execute Full Diagnostic
function runFullDiagnostic() {
    console.log('🚀 NEXUS PLATFORM FULL DIAGNOSTIC STARTING...');
    console.log('=' .repeat(60));
    
    const results = {
        platformLoading: checkPlatformLoading(),
        authentication: checkAuthenticationSystem(),
        testingSuite: checkTestingSuite(),
        moduleSystem: checkModuleSystem(),
        version: detectPlatformVersion()
    };
    
    console.log('\n📊 DIAGNOSTIC SUMMARY:');
    console.log('=' .repeat(60));
    console.log('Platform Loading:', results.platformLoading.isComprehensivePlatform ? '✅ PASS' : '❌ FAIL');
    console.log('Authentication:', results.authentication.formPresent ? '✅ PASS' : '❌ FAIL');
    console.log('Testing Suite:', results.testingSuite ? '✅ PASS' : '❌ FAIL');
    console.log('Module System:', results.moduleSystem ? '✅ PASS' : '❌ FAIL');
    console.log('Platform Version:', results.version);
    
    // Provide fix recommendations
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    if (results.version === 'basic') {
        console.log('❌ ISSUE: Loading basic dashboard instead of comprehensive platform');
        console.log('🔧 FIX: Server routing issue - check server/index.js file paths');
    } else if (results.version === 'comprehensive') {
        console.log('✅ Platform loading correctly - checking authentication...');
        if (!results.authentication.formPresent) {
            console.log('❌ ISSUE: Authentication form not rendering');
            console.log('🔧 FIX: Check login section HTML structure');
        }
    }
    
    return results;
}

// Auto-execute diagnostic
setTimeout(runFullDiagnostic, 1000);

// Make functions globally available
window.runDiagnostic = runFullDiagnostic;
window.checkPlatformVersion = detectPlatformVersion;

console.log('🔍 Diagnostic trace loaded - run runDiagnostic() for full analysis');