#!/bin/bash

# DWC Systems NEXUS Platform - Vercel Build Script
echo "🚀 Building DWC Systems NEXUS Platform for Vercel deployment..."

# Create public directory if it doesn't exist
mkdir -p public

# Copy main application file to public
cp index.html public/index.html

# Copy static assets if they exist
cp favicon-32x32.png public/ 2>/dev/null || echo "Warning: favicon not found"
cp favicon.ico public/ 2>/dev/null || echo "Warning: favicon.ico not found"
cp generated-icon.png public/ 2>/dev/null || echo "Warning: generated-icon.png not found"

# Create a basic robots.txt for SEO
cat > public/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://dwc-nexus-platform.vercel.app/sitemap.xml
EOF

# Create a basic sitemap.xml
cat > public/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dwc-nexus-platform.vercel.app/</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

echo "✅ Build complete - DWC Systems NEXUS Platform ready for Vercel deployment"
echo "📁 Static assets prepared in /public directory"
echo "🔧 Server configuration in /server/index.js"
echo "⚙️ Vercel configuration in vercel.json"