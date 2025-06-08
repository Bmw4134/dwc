#!/bin/bash

# Quantum Trading Bot Startup Script
echo "Starting Quantum Trading Bot..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ to continue."
    exit 1
fi

# Check if we're in the trading-bot directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the trading-bot directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating default .env file..."
    cat > .env << EOL
# Quantum Trading Bot Configuration
PORT=3001
NODE_ENV=development

# Optional: Add your Perplexity API key for enhanced market analysis
# PERPLEXITY_API_KEY=your_api_key_here

# Trading Engine Settings
LOG_LEVEL=info
EOL
    echo "Created .env file. You can edit it to add your API keys."
fi

# Start the trading bot server
echo "Starting trading bot server on port 3001..."
echo "Dashboard will be available at: http://localhost:3001/health"
echo "Frontend interface: Open client/index.html in your browser"
echo ""
echo "Press Ctrl+C to stop the trading bot"
echo ""

npm run dev