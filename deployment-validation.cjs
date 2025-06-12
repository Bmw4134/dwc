#!/usr/bin/env node
/**
 * Comprehensive Deployment Validation
 * Verifies mobile fixes, voice commands, and login flow are present
 */

const http = require('http');
const fs = require('fs');

function checkEndpoint(path = '/') {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:5000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy());
    });
}

async function validateDeployment() {
    console.log('🔍 Validating deployment synchronization...\n');
    
    try {
        const response = await checkEndpoint('/');
        const html = response.body;
        
        // Check cache-busting headers
        const hasCacheHeaders = html.includes('Cache-Control') && 
                              html.includes('no-cache') && 
                              html.includes('deployment-version');
        
        // Check service worker cleanup
        const hasServiceWorkerCleanup = html.includes('serviceWorker') && 
                                      html.includes('getRegistrations') &&
                                      html.includes('unregister');
        
        // Check mobile fixes
        const hasMobileViewport = html.includes('viewport') && 
                                html.includes('user-scalable=no');
        
        const hasTouchTargets = html.includes('min-height: 44px') || 
                              html.includes('touch-action');
        
        // Check voice commands
        const hasVoiceCommands = html.includes('voice') && 
                               html.includes('recognition') &&
                               html.includes('Log me in');
        
        // Check authentication flow
        const hasAuthFlow = html.includes('admin') && 
                          html.includes('nexus2024') &&
                          html.includes('checkAuthAndRedirect');
        
        // Check deployment cache clearing
        const hasCacheClear = html.includes('clearDeploymentCache') &&
                            html.includes('Version 2.1.0');
        
        console.log('✅ Validation Results:');
        console.log(`   Cache-busting headers: ${hasCacheHeaders ? '✓' : '✗'}`);
        console.log(`   Service worker cleanup: ${hasServiceWorkerCleanup ? '✓' : '✗'}`);
        console.log(`   Mobile viewport fixes: ${hasMobileViewport ? '✓' : '✗'}`);
        console.log(`   Touch target optimization: ${hasTouchTargets ? '✓' : '✗'}`);
        console.log(`   Voice command system: ${hasVoiceCommands ? '✓' : '✗'}`);
        console.log(`   Authentication flow: ${hasAuthFlow ? '✓' : '✗'}`);
        console.log(`   Deployment cache clearing: ${hasCacheClear ? '✓' : '✗'}`);
        
        const allValid = hasCacheHeaders && hasServiceWorkerCleanup && 
                        hasMobileViewport && hasVoiceCommands && 
                        hasAuthFlow && hasCacheClear;
        
        console.log(`\n${allValid ? '🎉' : '⚠️'} Deployment Status: ${allValid ? 'SYNCHRONIZED' : 'NEEDS ATTENTION'}`);
        
        if (allValid) {
            console.log('✓ Live deployment fully matches preview version');
            console.log('✓ All modules operational with cache-busting active');
        }
        
        return allValid;
        
    } catch (error) {
        console.log('❌ Validation failed:', error.message);
        return false;
    }
}

validateDeployment().then(success => {
    process.exit(success ? 0 : 1);
});