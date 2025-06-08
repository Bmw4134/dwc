# Quantum Trading Bot

Advanced AI-powered cryptocurrency trading platform with quantum strategies and Pionex integration.

## Features

### Core Trading Engine
- **Hyperdrive Trading Mode**: High-frequency trading with aggressive profit optimization
- **Quantum Mode**: Advanced signal analysis using quantum-inspired algorithms
- **Exponential Mode**: Rapid balance growth targeting specific amounts and timeframes
- **Multi-Pair Trading**: Simultaneous trading across 15+ cryptocurrency pairs
- **Real-time Market Analysis**: AI-powered opportunity scanning using Perplexity API

### Pionex Integration
- **Browser Automation**: Automated login and bot management
- **Grid Trading Bots**: Automated creation and management of grid trading strategies
- **Balance Monitoring**: Real-time account balance tracking
- **Bot Status Management**: Start, stop, and monitor trading bots

### Advanced Features
- **Parallel Trading Execution**: Multiple trading pairs simultaneously
- **Dynamic Risk Management**: Adaptive position sizing based on market conditions
- **Emergency Stop System**: Instant halt of all trading activities
- **Real-time Logging**: Comprehensive trading activity monitoring
- **Web-based Dashboard**: Modern, responsive trading interface

## Quick Start

### Prerequisites
- Node.js 18+ 
- NPM or Yarn
- Chrome/Chromium browser (for Pionex automation)

### Installation

1. **Clone and setup the trading bot**:
```bash
cd trading-bot
npm install
```

2. **Environment Configuration**:
Create `.env` file in the trading-bot directory:
```env
# Optional: For enhanced market analysis
PERPLEXITY_API_KEY=your_perplexity_api_key

# Server configuration
PORT=3001
NODE_ENV=development
```

3. **Start the trading bot server**:
```bash
npm run dev
```

4. **Access the dashboard**:
Open `client/index.html` in your browser or serve it with a local web server.

## API Documentation

### Trading Control Endpoints

#### Get Trading Status
```
GET /api/trading/status
```
Returns current trading status, balance, targets, and active positions.

#### Toggle Trading
```
POST /api/trading/toggle
Body: { "active": true/false }
```

#### Enable Hyperdrive Mode
```
POST /api/trading/hyperdrive
Body: { "enabled": true/false }
```

#### Enable Quantum Mode
```
POST /api/trading/quantum
Body: { "enabled": true/false }
```

#### Set Exponential Mode
```
POST /api/trading/exponential
Body: { 
  "target": 1000, 
  "timeframe": "1 day", 
  "riskLevel": "moderate" 
}
```

#### Scan Market Opportunities
```
GET /api/trading/opportunities
```

#### Execute Trade
```
POST /api/trading/execute
Body: { "signal": { "pair": "BTCUSDT", "signal": "BUY", ... } }
```

### Pionex Integration Endpoints

#### Initialize Browser Automation
```
POST /api/pionex/initialize
```

#### Login to Pionex
```
POST /api/pionex/login
Body: { 
  "email": "your@email.com", 
  "password": "password", 
  "twoFactorCode": "123456" 
}
```

#### Create Grid Trading Bot
```
POST /api/pionex/create-bot
Body: { 
  "strategy": "grid", 
  "pair": "BTCUSDT", 
  "investment": 100, 
  "gridNumber": 10 
}
```

#### Get Active Bots
```
GET /api/pionex/bots
```

#### Stop Trading Bot
```
POST /api/pionex/stop-bot
Body: { "botId": "bot_123" }
```

#### Get Account Balance
```
GET /api/pionex/balance
```

## Trading Strategies

### 1. Hyperdrive Mode
- **Purpose**: Maximum profit through high-frequency trading
- **Execution**: 2-second trade intervals across all active pairs
- **Risk Level**: High
- **Best For**: Volatile market conditions

### 2. Quantum Mode
- **Purpose**: Advanced signal analysis with quantum-inspired algorithms
- **Execution**: Multi-dimensional market analysis
- **Risk Level**: Medium-High
- **Best For**: Trend identification and momentum trading

### 3. Exponential Mode
- **Purpose**: Rapid balance growth to specific targets
- **Execution**: Aggressive position sizing and rapid reinvestment
- **Risk Level**: Very High
- **Best For**: Short-term profit maximization

### 4. Standard Grid Trading (Pionex)
- **Purpose**: Consistent profits in ranging markets
- **Execution**: Automated buy/sell orders in a price grid
- **Risk Level**: Low-Medium
- **Best For**: Stable, ranging market conditions

## Risk Management

### Built-in Safety Features
- **Position Sizing**: Maximum 5% of balance per trade in exponential mode
- **Stop Loss**: Automatic 1% stop loss on all positions
- **Take Profit**: Automatic 2% profit targets
- **Emergency Stop**: Instant halt of all trading activities
- **Balance Monitoring**: Real-time tracking of all positions

### Risk Levels
- **Conservative**: 2% position sizing, longer timeframes
- **Moderate**: 3% position sizing, balanced approach
- **Aggressive**: 5% position sizing, rapid execution

## Market Analysis

### Data Sources
- **Primary**: Perplexity AI real-time market analysis
- **Fallback**: Simulated market data for development
- **Indicators**: Volatility, momentum, volume analysis
- **Pairs**: 15 major cryptocurrency pairs

### Signal Generation
- **Strength Threshold**: 75+ for trade execution
- **Volatility Threshold**: 60+ for market entry
- **Confidence Scoring**: 60-100% confidence levels
- **Timeframe Analysis**: 1m, 5m, 15m intervals

## Deployment

### Development Mode
```bash
npm run dev
```
Runs with hot reloading and development logging.

### Production Mode
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Configuration

### Environment Variables
- `PERPLEXITY_API_KEY`: For enhanced market analysis
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode
- `LOG_LEVEL`: Logging verbosity

### Trading Parameters
All trading parameters can be adjusted in `hyperdrive-trading-engine.ts`:
- Momentum threshold
- Volatility threshold
- Risk percentages
- Trading pairs list
- Execution intervals

## Monitoring and Logging

### Web Dashboard
- Real-time trading status
- Balance and profit tracking
- Active positions monitoring
- Trading logs and activity

### Console Logging
- Trade executions
- Signal generation
- Error handling
- Performance metrics

## Security Considerations

### API Security
- No sensitive data exposure
- Environment variable protection
- Input validation on all endpoints

### Browser Automation Security
- Credential encryption
- Secure session management
- Automated logout procedures

### Trading Security
- Position size limits
- Balance verification
- Emergency stop mechanisms

## Troubleshooting

### Common Issues

**Trading not starting**:
- Check trading status endpoint
- Verify no emergency stop is active
- Confirm balance is sufficient

**Pionex connection fails**:
- Verify credentials are correct
- Check 2FA code if enabled
- Ensure browser automation initialized

**No trading opportunities**:
- Check Perplexity API key configuration
- Verify market data is being received
- Adjust momentum/volatility thresholds

### Debug Mode
Enable verbose logging by setting `LOG_LEVEL=debug` in environment variables.

## Support

For technical support or questions:
- Review the API documentation
- Check console logs for error details
- Verify all environment variables are configured
- Test individual endpoints using the web dashboard

## License

Proprietary software for authorized users only.

---

**Warning**: Cryptocurrency trading involves significant risk. This software is for educational and authorized use only. Always trade responsibly and never invest more than you can afford to lose.