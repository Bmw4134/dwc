#!/usr/bin/env python3
"""
Binance Futures Connector - Multi-Platform Trading Compatibility
Phase 1.000000001 - Binance Testnet Integration
"""

import asyncio
import logging
import os
import hmac
import hashlib
import time
from datetime import datetime
from typing import Dict, Any, Optional, List
import aiohttp
import json

logger = logging.getLogger(__name__)

class BinanceFuturesConnector:
    def __init__(self):
        self.api_key = os.getenv('BINANCE_KEY')
        self.api_secret = os.getenv('BINANCE_SECRET')
        self.testnet = os.getenv('BINANCE_TESTNET', 'true').lower() == 'true'
        
        # API endpoints
        if self.testnet:
            self.base_url = "https://testnet.binancefuture.com"
        else:
            self.base_url = "https://fapi.binance.com"
        
        # Connection state
        self.is_connected = False
        self.account_info = {}
        self.positions = []
        self.orders = []
        
        # Rate limiting
        self.rate_limiter = True
        self.last_request_time = 0
        self.min_request_interval = 0.1  # 100ms between requests
        
        # Trading configuration
        self.preview_only = True
        self.trade_override = False
        
    def get_headers(self) -> Dict[str, str]:
        """Get authentication headers for Binance API"""
        return {
            'X-MBX-APIKEY': self.api_key or '',
            'Content-Type': 'application/json'
        }
    
    def generate_signature(self, query_string: str) -> str:
        """Generate HMAC SHA256 signature for Binance API"""
        if not self.api_secret:
            return ""
        
        return hmac.new(
            self.api_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    async def rate_limit_check(self):
        """Enforce rate limiting to avoid IP bans"""
        if self.rate_limiter:
            current_time = time.time()
            time_since_last = current_time - self.last_request_time
            
            if time_since_last < self.min_request_interval:
                sleep_time = self.min_request_interval - time_since_last
                await asyncio.sleep(sleep_time)
            
            self.last_request_time = time.time()
    
    async def check_credentials(self) -> Dict[str, Any]:
        """Check if Binance credentials are configured"""
        status = {
            "credentials_configured": bool(self.api_key and self.api_secret),
            "testnet": self.testnet,
            "base_url": self.base_url,
            "missing_credentials": []
        }
        
        if not self.api_key:
            status["missing_credentials"].append("BINANCE_KEY")
        if not self.api_secret:
            status["missing_credentials"].append("BINANCE_SECRET")
        
        return status
    
    async def test_connectivity(self) -> Dict[str, Any]:
        """Test basic connectivity to Binance API"""
        try:
            await self.rate_limit_check()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/fapi/v1/ping",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        return {
                            "success": True,
                            "status": "connected",
                            "timestamp": datetime.now().isoformat()
                        }
                    else:
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "details": await response.text()
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_server_time(self) -> Dict[str, Any]:
        """Get Binance server time"""
        try:
            await self.rate_limit_check()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/fapi/v1/time",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        server_time = data.get("serverTime", 0)
                        
                        return {
                            "success": True,
                            "server_time": server_time,
                            "server_datetime": datetime.fromtimestamp(server_time / 1000).isoformat(),
                            "local_time": datetime.now().isoformat()
                        }
                    else:
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}"
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_account_info(self) -> Dict[str, Any]:
        """Get account information"""
        try:
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials",
                    "details": credentials_check
                }
            
            await self.rate_limit_check()
            
            # Prepare signed request
            timestamp = int(time.time() * 1000)
            query_string = f"timestamp={timestamp}"
            signature = self.generate_signature(query_string)
            
            url = f"{self.base_url}/fapi/v2/account?{query_string}&signature={signature}"
            headers = self.get_headers()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    
                    if response.status == 200:
                        account_data = await response.json()
                        self.account_info = account_data
                        self.is_connected = True
                        
                        return {
                            "success": True,
                            "account_info": {
                                "total_wallet_balance": account_data.get("totalWalletBalance"),
                                "total_unrealized_pnl": account_data.get("totalUnrealizedPnL"),
                                "total_margin_balance": account_data.get("totalMarginBalance"),
                                "available_balance": account_data.get("availableBalance"),
                                "max_withdraw_amount": account_data.get("maxWithdrawAmount"),
                                "can_trade": account_data.get("canTrade"),
                                "can_deposit": account_data.get("canDeposit"),
                                "can_withdraw": account_data.get("canWithdraw")
                            },
                            "positions": account_data.get("positions", []),
                            "timestamp": datetime.now().isoformat()
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "details": error_text
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_positions(self) -> Dict[str, Any]:
        """Get current positions"""
        try:
            account_info = await self.get_account_info()
            if not account_info["success"]:
                return account_info
            
            positions = account_info.get("positions", [])
            active_positions = [
                pos for pos in positions 
                if float(pos.get("positionAmt", 0)) != 0
            ]
            
            return {
                "success": True,
                "active_positions": active_positions,
                "total_positions": len(positions),
                "active_count": len(active_positions)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_open_orders(self) -> Dict[str, Any]:
        """Get open orders"""
        try:
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials"
                }
            
            await self.rate_limit_check()
            
            timestamp = int(time.time() * 1000)
            query_string = f"timestamp={timestamp}"
            signature = self.generate_signature(query_string)
            
            url = f"{self.base_url}/fapi/v1/openOrders?{query_string}&signature={signature}"
            headers = self.get_headers()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    
                    if response.status == 200:
                        orders = await response.json()
                        self.orders = orders
                        
                        return {
                            "success": True,
                            "open_orders": orders,
                            "order_count": len(orders)
                        }
                    else:
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "details": await response.text()
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def cancel_all_orders(self, symbol: Optional[str] = None) -> Dict[str, Any]:
        """Cancel all open orders (or for specific symbol)"""
        try:
            if self.preview_only and not self.trade_override:
                return {
                    "success": True,
                    "preview_mode": True,
                    "message": "Cancel all orders (preview only)",
                    "symbol": symbol
                }
            
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials"
                }
            
            await self.rate_limit_check()
            
            timestamp = int(time.time() * 1000)
            
            if symbol:
                query_string = f"symbol={symbol}&timestamp={timestamp}"
            else:
                query_string = f"timestamp={timestamp}"
            
            signature = self.generate_signature(query_string)
            
            url = f"{self.base_url}/fapi/v1/allOpenOrders?{query_string}&signature={signature}"
            headers = self.get_headers()
            
            async with aiohttp.ClientSession() as session:
                async with session.delete(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        return {
                            "success": True,
                            "cancelled_orders": result,
                            "symbol": symbol
                        }
                    else:
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "details": await response.text()
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def place_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Place a futures order"""
        try:
            if self.preview_only and not self.trade_override:
                return {
                    "success": True,
                    "preview_mode": True,
                    "message": "Order placement (preview only)",
                    "order_data": order_data
                }
            
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials"
                }
            
            # Validate required fields
            required_fields = ["symbol", "side", "type", "quantity"]
            for field in required_fields:
                if field not in order_data:
                    return {
                        "success": False,
                        "error": f"Missing required field: {field}"
                    }
            
            await self.rate_limit_check()
            
            timestamp = int(time.time() * 1000)
            
            # Build order parameters
            params = {
                "symbol": order_data["symbol"],
                "side": order_data["side"].upper(),
                "type": order_data["type"].upper(),
                "quantity": str(order_data["quantity"]),
                "timestamp": timestamp
            }
            
            # Add optional parameters
            if "price" in order_data:
                params["price"] = str(order_data["price"])
            if "stopPrice" in order_data:
                params["stopPrice"] = str(order_data["stopPrice"])
            if "timeInForce" in order_data:
                params["timeInForce"] = order_data["timeInForce"]
            
            # Create query string and signature
            query_string = "&".join([f"{k}={v}" for k, v in params.items()])
            signature = self.generate_signature(query_string)
            
            url = f"{self.base_url}/fapi/v1/order"
            headers = self.get_headers()
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    headers=headers,
                    data=f"{query_string}&signature={signature}",
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    
                    if response.status == 200:
                        order_result = await response.json()
                        return {
                            "success": True,
                            "order": order_result
                        }
                    else:
                        return {
                            "success": False,
                            "error": f"HTTP {response.status}",
                            "details": await response.text()
                        }
                        
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def comprehensive_health_check(self) -> Dict[str, Any]:
        """Perform comprehensive health check"""
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
            
            # Test connectivity
            connectivity = await self.test_connectivity()
            health_report["checks"]["connectivity"] = connectivity
            
            # Get server time
            server_time = await self.get_server_time()
            health_report["checks"]["server_time"] = server_time
            
            # Get account info
            account_info = await self.get_account_info()
            health_report["checks"]["account_info"] = account_info
            
            # Get positions
            positions = await self.get_positions()
            health_report["checks"]["positions"] = positions
            
            # Get open orders
            orders = await self.get_open_orders()
            health_report["checks"]["orders"] = orders
            
            # Determine overall status
            critical_checks = [connectivity, account_info]
            all_critical_passed = all(check.get("success", False) for check in critical_checks)
            
            if all_critical_passed:
                can_trade = account_info.get("account_info", {}).get("can_trade", False)
                if can_trade:
                    health_report["overall_status"] = "healthy"
                else:
                    health_report["overall_status"] = "connected_no_trading"
            else:
                health_report["overall_status"] = "connection_issues"
            
            # Add configuration info
            health_report["configuration"] = {
                "testnet": self.testnet,
                "preview_only": self.preview_only,
                "trade_override": self.trade_override,
                "rate_limiter": self.rate_limiter
            }
            
            return health_report
            
        except Exception as e:
            health_report["overall_status"] = "error"
            health_report["error"] = str(e)
            return health_report
    
    def get_connection_status(self) -> Dict[str, Any]:
        """Get current connection status"""
        return {
            "is_connected": self.is_connected,
            "testnet": self.testnet,
            "credentials_configured": bool(self.api_key and self.api_secret),
            "preview_only": self.preview_only,
            "trade_override": self.trade_override,
            "rate_limiter": self.rate_limiter,
            "base_url": self.base_url
        }

# Global connector instance
binance_connector = BinanceFuturesConnector()

async def main():
    """Test the Binance connector"""
    # Run comprehensive health check
    health_report = await binance_connector.comprehensive_health_check()
    print(f"Health report: {json.dumps(health_report, indent=2)}")
    
    # Get connection status
    status = binance_connector.get_connection_status()
    print(f"Connection status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())