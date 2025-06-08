#!/usr/bin/env python3
"""
Bybit Trade Dispatch - Multi-Platform Trading Compatibility
Phase 1.000000001 - Bybit USDT Perpetual Integration
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

class BybitTradeDispatch:
    def __init__(self):
        self.api_key = os.getenv('BYBIT_API_KEY')
        self.api_secret = os.getenv('BYBIT_SECRET')
        self.testnet = os.getenv('BYBIT_TESTNET', 'true').lower() == 'true'
        
        # API endpoints
        if self.testnet:
            self.base_url = "https://api-testnet.bybit.com"
        else:
            self.base_url = "https://api.bybit.com"
        
        # Connection state
        self.is_connected = False
        self.account_info = {}
        self.positions = []
        self.orders = []
        
        # Rate limiting
        self.rate_limiter = True
        self.last_request_time = 0
        self.min_request_interval = 0.1  # 100ms between requests
        self.request_count = 0
        self.rate_limit_window = 60  # 1 minute window
        self.max_requests_per_window = 120
        
        # Trading configuration
        self.preview_only = True
        self.cancel_all_before_entry = True
        
    def generate_signature(self, params: str, timestamp: str) -> str:
        """Generate HMAC SHA256 signature for Bybit API"""
        if not self.api_secret:
            return ""
        
        param_str = timestamp + self.api_key + "5000" + params  # recv_window = 5000
        return hmac.new(
            self.api_secret.encode('utf-8'),
            param_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    async def rate_limit_check(self):
        """Enforce rate limiting to avoid IP bans"""
        if self.rate_limiter:
            current_time = time.time()
            
            # Check request interval
            time_since_last = current_time - self.last_request_time
            if time_since_last < self.min_request_interval:
                sleep_time = self.min_request_interval - time_since_last
                await asyncio.sleep(sleep_time)
            
            # Track requests per window
            self.request_count += 1
            if self.request_count >= self.max_requests_per_window:
                logger.warning("Rate limit approaching, sleeping...")
                await asyncio.sleep(self.rate_limit_window)
                self.request_count = 0
            
            self.last_request_time = time.time()
    
    async def check_credentials(self) -> Dict[str, Any]:
        """Check if Bybit credentials are configured"""
        status = {
            "credentials_configured": bool(self.api_key and self.api_secret),
            "testnet": self.testnet,
            "base_url": self.base_url,
            "missing_credentials": []
        }
        
        if not self.api_key:
            status["missing_credentials"].append("BYBIT_API_KEY")
        if not self.api_secret:
            status["missing_credentials"].append("BYBIT_SECRET")
        
        return status
    
    async def test_connectivity(self) -> Dict[str, Any]:
        """Test basic connectivity to Bybit API"""
        try:
            await self.rate_limit_check()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/v5/market/time",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "success": True,
                            "status": "connected",
                            "server_time": data.get("result", {}).get("timeNano"),
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
            timestamp = str(int(time.time() * 1000))
            params = ""
            signature = self.generate_signature(params, timestamp)
            
            headers = {
                "X-BAPI-API-KEY": self.api_key,
                "X-BAPI-SIGN": signature,
                "X-BAPI-SIGN-TYPE": "2",
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": "5000",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/v5/account/wallet-balance?accountType=UNIFIED",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get("retCode") == 0:
                            account_data = data.get("result", {})
                            wallet_list = account_data.get("list", [])
                            
                            if wallet_list:
                                wallet = wallet_list[0]
                                self.account_info = wallet
                                self.is_connected = True
                                
                                return {
                                    "success": True,
                                    "account_info": {
                                        "account_type": wallet.get("accountType"),
                                        "total_wallet_balance": wallet.get("totalWalletBalance"),
                                        "total_available_balance": wallet.get("totalAvailableBalance"),
                                        "total_margin_balance": wallet.get("totalMarginBalance"),
                                        "account_im": wallet.get("accountIM"),
                                        "account_mm": wallet.get("accountMM")
                                    },
                                    "coins": wallet.get("coin", []),
                                    "timestamp": datetime.now().isoformat()
                                }
                            else:
                                return {
                                    "success": False,
                                    "error": "No wallet data found"
                                }
                        else:
                            return {
                                "success": False,
                                "error": f"API Error: {data.get('retMsg', 'Unknown error')}",
                                "ret_code": data.get("retCode")
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
            credentials_check = await self.check_credentials()
            if not credentials_check["credentials_configured"]:
                return {
                    "success": False,
                    "error": "Missing credentials"
                }
            
            await self.rate_limit_check()
            
            timestamp = str(int(time.time() * 1000))
            params = "category=linear"  # USDT Perpetual
            signature = self.generate_signature(params, timestamp)
            
            headers = {
                "X-BAPI-API-KEY": self.api_key,
                "X-BAPI-SIGN": signature,
                "X-BAPI-SIGN-TYPE": "2",
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": "5000",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/v5/position/list?{params}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get("retCode") == 0:
                            positions = data.get("result", {}).get("list", [])
                            
                            # Filter active positions
                            active_positions = [
                                pos for pos in positions 
                                if float(pos.get("size", 0)) > 0
                            ]
                            
                            self.positions = active_positions
                            
                            return {
                                "success": True,
                                "positions": active_positions,
                                "active_count": len(active_positions),
                                "total_count": len(positions)
                            }
                        else:
                            return {
                                "success": False,
                                "error": f"API Error: {data.get('retMsg', 'Unknown error')}"
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
            
            timestamp = str(int(time.time() * 1000))
            params = "category=linear"  # USDT Perpetual
            signature = self.generate_signature(params, timestamp)
            
            headers = {
                "X-BAPI-API-KEY": self.api_key,
                "X-BAPI-SIGN": signature,
                "X-BAPI-SIGN-TYPE": "2",
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": "5000",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/v5/order/realtime?{params}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get("retCode") == 0:
                            orders = data.get("result", {}).get("list", [])
                            self.orders = orders
                            
                            return {
                                "success": True,
                                "orders": orders,
                                "order_count": len(orders)
                            }
                        else:
                            return {
                                "success": False,
                                "error": f"API Error: {data.get('retMsg', 'Unknown error')}"
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
        """Cancel all open orders"""
        try:
            if self.preview_only:
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
            
            timestamp = str(int(time.time() * 1000))
            
            payload = {
                "category": "linear"
            }
            
            if symbol:
                payload["symbol"] = symbol
            
            params = json.dumps(payload)
            signature = self.generate_signature(params, timestamp)
            
            headers = {
                "X-BAPI-API-KEY": self.api_key,
                "X-BAPI-SIGN": signature,
                "X-BAPI-SIGN-TYPE": "2",
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": "5000",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/v5/order/cancel-all",
                    headers=headers,
                    data=params,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get("retCode") == 0:
                            result = data.get("result", {})
                            return {
                                "success": True,
                                "cancelled_orders": result.get("list", []),
                                "symbol": symbol
                            }
                        else:
                            return {
                                "success": False,
                                "error": f"API Error: {data.get('retMsg', 'Unknown error')}"
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
        """Place a USDT perpetual order"""
        try:
            if self.preview_only:
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
            required_fields = ["symbol", "side", "orderType", "qty"]
            for field in required_fields:
                if field not in order_data:
                    return {
                        "success": False,
                        "error": f"Missing required field: {field}"
                    }
            
            await self.rate_limit_check()
            
            timestamp = str(int(time.time() * 1000))
            
            # Build order payload
            payload = {
                "category": "linear",
                "symbol": order_data["symbol"],
                "side": order_data["side"],
                "orderType": order_data["orderType"],
                "qty": str(order_data["qty"])
            }
            
            # Add optional parameters
            if "price" in order_data:
                payload["price"] = str(order_data["price"])
            if "timeInForce" in order_data:
                payload["timeInForce"] = order_data["timeInForce"]
            if "stopLoss" in order_data:
                payload["stopLoss"] = str(order_data["stopLoss"])
            if "takeProfit" in order_data:
                payload["takeProfit"] = str(order_data["takeProfit"])
            
            params = json.dumps(payload)
            signature = self.generate_signature(params, timestamp)
            
            headers = {
                "X-BAPI-API-KEY": self.api_key,
                "X-BAPI-SIGN": signature,
                "X-BAPI-SIGN-TYPE": "2",
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": "5000",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/v5/order/create",
                    headers=headers,
                    data=params,
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get("retCode") == 0:
                            result = data.get("result", {})
                            return {
                                "success": True,
                                "order": result
                            }
                        else:
                            return {
                                "success": False,
                                "error": f"API Error: {data.get('retMsg', 'Unknown error')}"
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
    
    async def process_trade_signal(self, signal: Dict[str, Any]) -> Dict[str, Any]:
        """Process trade signal for Bybit"""
        try:
            # Cancel all orders first if enabled
            if self.cancel_all_before_entry:
                symbol = signal.get("symbol")
                if symbol:
                    cancel_result = await self.cancel_all_orders(symbol)
                    if not cancel_result["success"]:
                        logger.warning(f"Failed to cancel orders for {symbol}: {cancel_result.get('error')}")
            
            # Convert signal to Bybit order format
            order_data = self.convert_signal_to_order(signal)
            
            if not order_data:
                return {
                    "success": False,
                    "error": "Failed to convert signal to order format"
                }
            
            # Place order
            order_result = await self.place_order(order_data)
            
            return {
                "success": order_result["success"],
                "platform": "bybit",
                "signal": signal,
                "order_result": order_result,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def convert_signal_to_order(self, signal: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Convert trading signal to Bybit order format"""
        try:
            action = signal.get("action", "").upper()
            
            # Map actions to Bybit sides
            side_mapping = {
                "BUY": "Buy",
                "LONG": "Buy",
                "SELL": "Sell",
                "SHORT": "Sell"
            }
            
            if action not in side_mapping:
                return None
            
            order_data = {
                "symbol": signal["symbol"],
                "side": side_mapping[action],
                "orderType": "Market",  # Default to market order
                "qty": signal.get("quantity", 0.01)
            }
            
            # Add limit price if available
            if signal.get("entry_price"):
                order_data["orderType"] = "Limit"
                order_data["price"] = signal["entry_price"]
                order_data["timeInForce"] = "GTC"  # Good Till Cancelled
            
            # Add stop loss
            if signal.get("stop_loss"):
                order_data["stopLoss"] = signal["stop_loss"]
            
            # Add take profit
            if signal.get("take_profit"):
                order_data["takeProfit"] = signal["take_profit"]
            
            return order_data
            
        except Exception as e:
            logger.error(f"Error converting signal to order: {e}")
            return None
    
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
                health_report["overall_status"] = "healthy"
            else:
                health_report["overall_status"] = "connection_issues"
            
            # Add configuration info
            health_report["configuration"] = {
                "testnet": self.testnet,
                "preview_only": self.preview_only,
                "cancel_all_before_entry": self.cancel_all_before_entry,
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
            "cancel_all_before_entry": self.cancel_all_before_entry,
            "rate_limiter": self.rate_limiter,
            "base_url": self.base_url,
            "request_count": self.request_count
        }

# Global dispatch instance
bybit_dispatch = BybitTradeDispatch()

async def main():
    """Test the Bybit trade dispatch"""
    # Run comprehensive health check
    health_report = await bybit_dispatch.comprehensive_health_check()
    print(f"Health report: {json.dumps(health_report, indent=2)}")
    
    # Get connection status
    status = bybit_dispatch.get_connection_status()
    print(f"Connection status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())