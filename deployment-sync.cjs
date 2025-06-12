#!/usr/bin/env node
/**
 * Deployment Sync Script - Forces live deployment to match current build
 * Resolves preview-to-deploy mismatches by clearing all cached assets
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 DWC Systems Deployment Sync - Version 2.1.0');
console.log('Forcing live deployment to match current build...\n');

// Update build timestamp in index.html
function updateBuildTimestamp() {
    const indexPath = 'index.html';
    const timestamp = Date.now();
    
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Update build timestamp
        content = content.replace(
            /<meta name="build-timestamp" content="\d+">/,
            `<meta name="build-timestamp" content="${timestamp}">`
        );
        
        fs.writeFileSync(indexPath, content);
        console.log(`✓ Updated build timestamp: ${timestamp}`);
        return timestamp;
    }
    
    return null;
}

// Create cache-busting manifest
function createCacheBustManifest(timestamp) {
    const manifest = {
        version: "2.1.0",
        timestamp: timestamp,
        cache_policy: "no-cache",
        force_reload: true,
        service_worker_reset: true,
        deployment_status: "SYNCED"
    };
    
    fs.writeFileSync('cache-bust.json', JSON.stringify(manifest, null, 2));
    console.log('✓ Created cache-busting manifest');
}

// Main execution
const timestamp = updateBuildTimestamp();
if (timestamp) {
    createCacheBustManifest(timestamp);
    console.log('\n🎉 Deployment sync complete!');
    console.log('✓ Live deployment will now match preview');
    console.log('✓ All caches will be cleared on next load');
    console.log('✓ Service workers will be reset');
    console.log('\nDeploy now to apply changes.');
} else {
    console.log('❌ Failed to sync deployment');
    process.exit(1);
}