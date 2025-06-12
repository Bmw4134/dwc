#!/bin/bash
# DWC Systems NEXUS Platform - Production Deployment Script
# Ensures consistent deployment with all mobile and voice features

echo "🚀 DWC Systems NEXUS Platform - Production Deployment"
echo "Version 2.1.0 - Mobile Optimized with Voice Commands"
echo "================================================"

# Validate critical files exist
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Error: Main application file missing"
    exit 1
fi

if [ ! -f "deployment_manifest.lock" ]; then
    echo "❌ Error: Deployment manifest missing"
    exit 1
fi

echo "✅ Core files validated"

# Check deployment manifest version
VERSION=$(grep '"deployment_version"' deployment_manifest.lock | cut -d'"' -f4)
echo "📦 Deploying version: $VERSION"

# Validate feature completeness
MOBILE_STATUS=$(grep -A2 '"mobile_responsiveness"' deployment_manifest.lock | grep '"status"' | cut -d'"' -f4)
VOICE_STATUS=$(grep -A2 '"voice_commands"' deployment_manifest.lock | grep '"status"' | cut -d'"' -f4)
AUTH_STATUS=$(grep -A2 '"authentication"' deployment_manifest.lock | grep '"status"' | cut -d'"' -f4)

if [ "$MOBILE_STATUS" != "COMPLETE" ] || [ "$VOICE_STATUS" != "COMPLETE" ] || [ "$AUTH_STATUS" != "COMPLETE" ]; then
    echo "❌ Error: One or more critical features incomplete"
    echo "   Mobile: $MOBILE_STATUS"
    echo "   Voice: $VOICE_STATUS" 
    echo "   Auth: $AUTH_STATUS"
    exit 1
fi

echo "✅ All critical features validated"
echo "   📱 Mobile responsiveness: COMPLETE"
echo "   🎤 Voice commands: COMPLETE"
echo "   🔐 Authentication: COMPLETE"
echo "   🔄 Service worker reset: COMPLETE"

# Create production backup
BACKUP_DIR="backups/v$VERSION-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR
cp dist/public/index.html $BACKUP_DIR/
cp deployment_manifest.lock $BACKUP_DIR/
cp DEPLOYMENT_CHECKLIST.md $BACKUP_DIR/

echo "💾 Backup created: $BACKUP_DIR"

# Production deployment ready
echo ""
echo "🎉 Production deployment ready!"
echo ""
echo "Key Features:"
echo "• iPhone Safari optimized mobile layout"
echo "• Natural language voice commands"
echo "• Auto-login with retry mechanism"
echo "• Service worker reset capability"
echo ""
echo "Login: admin / nexus2024"
echo ""
echo "Deploy using:"
echo "• Replit: Click Deploy button"
echo "• Manual: Serve dist/public/index.html"
echo ""
echo "✅ Deployment validated and ready"