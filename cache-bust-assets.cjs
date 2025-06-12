#!/usr/bin/env node
/**
 * Cache-Busting Asset Updater
 * Adds timestamp versioning to all asset references
 */

const fs = require('fs');
const path = require('path');

function addCacheBustingToAssets(filePath) {
    if (!fs.existsSync(filePath)) return false;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const timestamp = Date.now();
    
    // Add cache-busting to CSS and JS files
    content = content.replace(
        /href="([^"]+\.css)"/g,
        `href="$1?v=${timestamp}"`
    );
    
    content = content.replace(
        /src="([^"]+\.js)"/g,
        `src="$1?v=${timestamp}"`
    );
    
    // Update build timestamp
    content = content.replace(
        /<meta name="build-timestamp" content="\d+">/,
        `<meta name="build-timestamp" content="${timestamp}">`
    );
    
    fs.writeFileSync(filePath, content);
    return timestamp;
}

// Update both files
const rootTimestamp = addCacheBustingToAssets('index.html');
const distTimestamp = addCacheBustingToAssets('dist/public/index.html');

console.log(`✓ Cache-busting applied: ${rootTimestamp}`);
console.log(`✓ Distribution synced: ${distTimestamp}`);