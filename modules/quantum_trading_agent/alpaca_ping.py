#!/usr/bin/env python3
"""
Alpaca Heartbeat Ping Module - Multi-Platform Trading Compatibility
Phase 1.000000001 - Alpaca Connection Health Monitor
"""

import asyncio
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import aiohttp
import json

logger = logging.getLogger(__name__)

class AlpacaHeartbeat:
    def __init__(self):
        self.api_key = os.getenv('ALPACA_API_KEY')
        self.secret_key = os.getenv('ALPACA_SECRET_KEY')
        self.paper_trading = os.getenv('ALPACA_PAPER', 'true').lower() == 'true'
        
        # API endpoints
        if self.paper_trading:
            self.base_url = "https://paper-api.alpaca.markets"
            self.data_url = "https://data.alpaca.markets"
        else:
            self.base_url = "https://api.alpaca.markets"
            self.data_url = "https://data.alpaca.markets"
        
        # Connection state
        self.is_connected = False
        self.last_successful_ping = None
        self.connection_errors = []
        self.account_info = {}
        
        # Heartbeat settings
        self.ping_interval = 300  # 5 minutes
        self.max_consecutive_failures = 3
        self.consecutive_failures = 0
        
    def get_headers(self) -> Dict[str, str]:
        """Get authentication headers for Alpaca API"""
        return {
            'APCA-API-KEY-ID': self.api_key or '',
            'APCA-API-SECRET-KEY': self.secret_key or '',
            'Content-Type': 'application/json'
        }
    
    async def check_credentials(self) -> Dict[str, Any]:
        """Check if Alpaca credentials are configured"""
        status = {
            "credentials_configured": bool(self.api_key and self.secret_key),
            "paper_trading": self.paper_trading,
            "base_url": self.base_url,
            "missing_credentials": []
        }
        
        if not self.api_key:
            status["missing_credentials"].append("ALPACA_API_KEY")
        if not self.secret_key:
            status["missing_credentials"].append("ALPACA_SECRET_KEY")
        
        return status
    
    async def ping_account(self) -> Dict[str, Any]:
        """Ping Alpaca account endpoint to check connectivity"""
        try:
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials",
                    "details": credentials_check
                }
            
            headers = self.get_headers()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/v2/account",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        account_data = await response.json()
                        self.account_info = account_data
                        self.is_connected = True
                        self.last_successful_ping = datetime.now()
                        self.consecutive_failures = 0
                        
                        return {
                            "success": True,
                            "status": "connected",
                            "account_status": account_data.get("status"),
                            "buying_power": account_data.get("buying_power"),
                            "cash": account_data.get("cash"),
                            "portfolio_value": account_data.get("portfolio_value"),
                            "timestamp": self.last_successful_ping.isoformat()
                        }
                    else:
                        error_text = await response.text()
                        self.consecutive_failures += 1
                        self.is_connected = False
                        
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "details": error_text,
                            "consecutive_failures": self.consecutive_failures
                        }
                        
        except asyncio.TimeoutError:
            self.consecutive_failures += 1
            self.is_connected = False
            return {
                "success": False,
                "error": "Connection timeout",
                "consecutive_failures": self.consecutive_failures
            }
        except Exception as e:
            self.consecutive_failures += 1
            self.is_connected = False
            error_msg = str(e)
            
            return {
                "success": False,
                "error": error_msg,
                "consecutive_failures": self.consecutive_failures
            }
    
    async def ping_market_data(self) -> Dict[str, Any]:
        """Ping Alpaca market data endpoint"""
        try:
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials"
                }
            
            headers = self.get_headers()
            
            # Test with a simple stock quote
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.data_url}/v2/stocks/quotes/latest?symbols=AAPL",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "success": True,
                            "status": "market_data_connected",
                            "sample_quote": data.get("quotes", {}).get("AAPL"),
                            "timestamp": datetime.now().isoformat()
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "success": False,
                            "error": f"Market data HTTP {response.status}",
                            "details": error_text
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": f"Market data error: {str(e)}"
            }
    
    async def check_trading_permissions(self) -> Dict[str, Any]:
        """Check trading permissions and account restrictions"""
        try:
            if not self.account_info:
                account_ping = await self.ping_account()
                if not account_ping["success"]:
                    return account_ping
            
            permissions = {
                "day_trading_buying_power": self.account_info.get("daytrading_buying_power"),
                "pattern_day_trader": self.account_info.get("pattern_day_trader"),
                "trading_blocked": self.account_info.get("trading_blocked"),
                "transfers_blocked": self.account_info.get("transfers_blocked"),
                "account_blocked": self.account_info.get("account_blocked"),
                "trade_suspended_by_user": self.account_info.get("trade_suspended_by_user")
            }
            
            # Determine overall trading status
            can_trade = not any([
                permissions.get("trading_blocked", False),
                permissions.get("account_blocked", False),
                permissions.get("trade_suspended_by_user", False)
            ])
            
            return {
                "success": True,
                "can_trade": can_trade,
                "permissions": permissions,
                "account_type": "paper" if self.paper_trading else "live"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Permission check error: {str(e)}"
            }
    
    async def comprehensive_health_check(self) -> Dict[str, Any]:
        """Perform comprehensive health check of Alpaca connection"""
        health_report = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": "unknown",
            "checks": {}
        }
        
        try:
            # Check credentials
            credentials = await self.check_credentials()
            health_report["checks"]["credentials"] = credentials
            
            if not credentials["credentials_configured"]:
                health_report["overall_status"] = "credentials_missing"
                return health_report
            
            # Check account connectivity
            account_ping = await self.ping_account()
            health_report["checks"]["account_connectivity"] = account_ping
            
            # Check market data
            market_ping = await self.ping_market_data()
            health_report["checks"]["market_data"] = market_ping
            
            # Check trading permissions
            permissions = await self.check_trading_permissions()
            health_report["checks"]["trading_permissions"] = permissions
            
            # Determine overall status
            all_checks_passed = all([
                account_ping.get("success", False),
                market_ping.get("success", False),
                permissions.get("success", False)
            ])
            
            if all_checks_passed and permissions.get("can_trade", False):
                health_report["overall_status"] = "healthy"
            elif all_checks_passed:
                health_report["overall_status"] = "connected_no_trading"
            else:
                health_report["overall_status"] = "connection_issues"
            
            # Add connection statistics
            health_report["connection_stats"] = {
                "is_connected": self.is_connected,
                "last_successful_ping": self.last_successful_ping.isoformat() if self.last_successful_ping else None,
                "consecutive_failures": self.consecutive_failures,
                "paper_trading": self.paper_trading
            }
            
            return health_report
            
        except Exception as e:
            health_report["overall_status"] = "error"
            health_report["error"] = str(e)
            return health_report
    
    async def start_heartbeat_monitor(self):
        """Start continuous heartbeat monitoring"""
        logger.info(f"Starting Alpaca heartbeat monitor (interval: {self.ping_interval}s)")
        
        while True:
            try:
                health_check = await self.comprehensive_health_check()
                
                if health_check["overall_status"] == "healthy":
                    logger.info("Alpaca connection healthy")
                elif health_check["overall_status"] == "credentials_missing":
                    logger.warning("Alpaca credentials not configured")
                else:
                    logger.warning(f"Alpaca connection issues: {health_check['overall_status']}")
                
                # Log any critical issues
                if self.consecutive_failures >= self.max_consecutive_failures:
                    logger.error(f"Alpaca connection failed {self.consecutive_failures} consecutive times")
                
                await asyncio.sleep(self.ping_interval)
                
            except Exception as e:
                logger.error(f"Error in heartbeat monitor: {e}")
                await asyncio.sleep(60)  # Shorter retry interval on error
    
    def get_connection_status(self) -> Dict[str, Any]:
        """Get current connection status"""
        return {
            "is_connected": self.is_connected,
            "last_successful_ping": self.last_successful_ping.isoformat() if self.last_successful_ping else None,
            "consecutive_failures": self.consecutive_failures,
            "paper_trading": self.paper_trading,
            "credentials_configured": bool(self.api_key and self.secret_key),
            "account_info": self.account_info
        }

# Global heartbeat instance
alpaca_heartbeat = AlpacaHeartbeat()

async def main():
    """Test the Alpaca heartbeat monitor"""
    # Run a comprehensive health check
    health_report = await alpaca_heartbeat.comprehensive_health_check()
    print(f"Health report: {json.dumps(health_report, indent=2)}")
    
    # Get connection status
    status = alpaca_heartbeat.get_connection_status()
    print(f"Connection status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())