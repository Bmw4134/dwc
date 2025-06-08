#!/usr/bin/env python3
"""
Interactive Brokers Trader - Multi-Platform Trading Compatibility
Phase 1.000000001 - TWS Gateway Integration
"""

import asyncio
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import json

logger = logging.getLogger(__name__)

class IBTrader:
    def __init__(self):
        # TWS connection settings
        self.host = os.getenv('IB_HOST', 'localhost')
        self.port = int(os.getenv('IB_PORT', '7497'))  # Paper trading port
        self.client_id = int(os.getenv('IB_CLIENT_ID', '1'))
        
        # Connection state
        self.is_connected = False
        self.ib_client = None
        self.account_info = {}
        self.positions = []
        self.orders = []
        
        # Watchdog settings
        self.watchdog_enabled = True
        self.connection_timeout = 30
        self.reconnect_attempts = 3
        self.last_heartbeat = None
        
        # Trading configuration
        self.preview_only = True
        self.supported_assets = ['equity', 'futures']
        
    async def check_tws_dependency(self) -> Dict[str, Any]:
        """Check if ib_insync dependency is available"""
        try:
            import ib_insync
            return {
                "success": True,
                "ib_insync_available": True,
                "version": getattr(ib_insync, '__version__', 'unknown')
            }
        except ImportError:
            return {
                "success": False,
                "ib_insync_available": False,
                "error": "ib_insync module not installed",
                "install_command": "pip install ib_insync"
            }
    
    async def initialize_connection(self) -> Dict[str, Any]:
        """Initialize connection to TWS/IB Gateway"""
        try:
            dependency_check = await self.check_tws_dependency()
            if not dependency_check["success"]:
                return dependency_check
            
            from ib_insync import IB, util
            
            # Create IB instance
            self.ib_client = IB()
            
            # Connect to TWS
            await self.ib_client.connectAsync(
                host=self.host,
                port=self.port,
                clientId=self.client_id,
                timeout=self.connection_timeout
            )
            
            if self.ib_client.isConnected():
                self.is_connected = True
                self.last_heartbeat = datetime.now()
                
                # Get account summary
                await self.update_account_info()
                
                return {
                    "success": True,
                    "connected": True,
                    "host": self.host,
                    "port": self.port,
                    "client_id": self.client_id,
                    "account": self.account_info.get("account_id")
                }
            else:
                return {
                    "success": False,
                    "error": "Failed to connect to TWS"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "troubleshooting": [
                    "Ensure TWS or IB Gateway is running",
                    f"Check if port {self.port} is open for API connections",
                    "Verify API settings in TWS configuration",
                    "Ensure 'Enable ActiveX and Socket Clients' is checked"
                ]
            }
    
    async def update_account_info(self) -> Dict[str, Any]:
        """Update account information"""
        try:
            if not self.is_connected or not self.ib_client:
                return {"success": False, "error": "Not connected to TWS"}
            
            # Get account summary
            account_summary = self.ib_client.accountSummary()
            
            # Parse account data
            account_data = {}
            for item in account_summary:
                account_data[item.tag] = item.value
            
            # Get managed accounts
            managed_accounts = self.ib_client.managedAccounts()
            
            self.account_info = {
                "account_id": managed_accounts[0] if managed_accounts else "Unknown",
                "net_liquidation": account_data.get("NetLiquidation", "0"),
                "total_cash_value": account_data.get("TotalCashValue", "0"),
                "buying_power": account_data.get("BuyingPower", "0"),
                "excess_liquidity": account_data.get("ExcessLiquidity", "0"),
                "day_trades_remaining": account_data.get("DayTradesRemaining", "0"),
                "currency": account_data.get("Currency", "USD"),
                "last_updated": datetime.now().isoformat()
            }
            
            return {
                "success": True,
                "account_info": self.account_info
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_positions(self) -> Dict[str, Any]:
        """Get current positions"""
        try:
            if not self.is_connected or not self.ib_client:
                return {"success": False, "error": "Not connected to TWS"}
            
            # Get positions
            positions = self.ib_client.positions()
            
            position_data = []
            for position in positions:
                position_info = {
                    "symbol": position.contract.symbol,
                    "exchange": position.contract.exchange,
                    "currency": position.contract.currency,
                    "position": position.position,
                    "avg_cost": position.avgCost,
                    "market_price": getattr(position, 'marketPrice', 0),
                    "market_value": getattr(position, 'marketValue', 0),
                    "unrealized_pnl": getattr(position, 'unrealizedPNL', 0),
                    "realized_pnl": getattr(position, 'realizedPNL', 0)
                }
                position_data.append(position_info)
            
            self.positions = position_data
            
            return {
                "success": True,
                "positions": position_data,
                "position_count": len(position_data)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_open_orders(self) -> Dict[str, Any]:
        """Get open orders"""
        try:
            if not self.is_connected or not self.ib_client:
                return {"success": False, "error": "Not connected to TWS"}
            
            # Get open orders
            orders = self.ib_client.openOrders()
            
            order_data = []
            for order in orders:
                order_info = {
                    "order_id": order.order.orderId,
                    "symbol": order.contract.symbol,
                    "action": order.order.action,
                    "order_type": order.order.orderType,
                    "total_quantity": order.order.totalQuantity,
                    "limit_price": getattr(order.order, 'lmtPrice', 0),
                    "status": order.orderStatus.status,
                    "filled": order.orderStatus.filled,
                    "remaining": order.orderStatus.remaining,
                    "avg_fill_price": order.orderStatus.avgFillPrice
                }
                order_data.append(order_info)
            
            self.orders = order_data
            
            return {
                "success": True,
                "orders": order_data,
                "order_count": len(order_data)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def place_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Place an order"""
        try:
            if self.preview_only:
                return {
                    "success": True,
                    "preview_mode": True,
                    "message": "Order placement (preview only)",
                    "order_data": order_data
                }
            
            if not self.is_connected or not self.ib_client:
                return {"success": False, "error": "Not connected to TWS"}
            
            from ib_insync import Stock, Option, Future, Order
            
            # Validate required fields
            required_fields = ["symbol", "action", "quantity"]
            for field in required_fields:
                if field not in order_data:
                    return {
                        "success": False,
                        "error": f"Missing required field: {field}"
                    }
            
            # Create contract based on asset type
            asset_type = order_data.get("asset_type", "equity").lower()
            symbol = order_data["symbol"]
            exchange = order_data.get("exchange", "SMART")
            currency = order_data.get("currency", "USD")
            
            if asset_type == "equity":
                contract = Stock(symbol, exchange, currency)
            elif asset_type == "futures":
                expiry = order_data.get("expiry", "")
                contract = Future(symbol, expiry, exchange, currency=currency)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported asset type: {asset_type}"
                }
            
            # Create order
            order = Order()
            order.action = order_data["action"].upper()
            order.totalQuantity = order_data["quantity"]
            order.orderType = order_data.get("order_type", "MKT").upper()
            
            # Add price for limit orders
            if order.orderType == "LMT":
                if "limit_price" not in order_data:
                    return {
                        "success": False,
                        "error": "Limit price required for limit orders"
                    }
                order.lmtPrice = order_data["limit_price"]
            
            # Add stop price for stop orders
            if order.orderType in ["STP", "STP LMT"]:
                if "stop_price" not in order_data:
                    return {
                        "success": False,
                        "error": "Stop price required for stop orders"
                    }
                order.auxPrice = order_data["stop_price"]
            
            # Place order
            trade = self.ib_client.placeOrder(contract, order)
            
            return {
                "success": True,
                "order_id": trade.order.orderId,
                "status": trade.orderStatus.status,
                "contract": {
                    "symbol": contract.symbol,
                    "exchange": contract.exchange,
                    "currency": contract.currency
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def cancel_order(self, order_id: int) -> Dict[str, Any]:
        """Cancel an order"""
        try:
            if self.preview_only:
                return {
                    "success": True,
                    "preview_mode": True,
                    "message": f"Order cancellation (preview only): {order_id}"
                }
            
            if not self.is_connected or not self.ib_client:
                return {"success": False, "error": "Not connected to TWS"}
            
            # Cancel order
            self.ib_client.cancelOrder(order_id)
            
            return {
                "success": True,
                "order_id": order_id,
                "status": "CANCELLED"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_market_data(self, symbol: str, asset_type: str = "equity") -> Dict[str, Any]:
        """Get market data for a symbol"""
        try:
            if not self.is_connected or not self.ib_client:
                return {"success": False, "error": "Not connected to TWS"}
            
            from ib_insync import Stock, Future
            
            # Create contract
            if asset_type.lower() == "equity":
                contract = Stock(symbol, "SMART", "USD")
            elif asset_type.lower() == "futures":
                contract = Future(symbol, "", "CME", currency="USD")  # Example for futures
            else:
                return {
                    "success": False,
                    "error": f"Unsupported asset type: {asset_type}"
                }
            
            # Request market data
            ticker = self.ib_client.reqMktData(contract)
            
            # Wait for data
            await asyncio.sleep(2)
            
            market_data = {
                "symbol": symbol,
                "bid": ticker.bid if ticker.bid and ticker.bid > 0 else None,
                "ask": ticker.ask if ticker.ask and ticker.ask > 0 else None,
                "last": ticker.last if ticker.last and ticker.last > 0 else None,
                "close": ticker.close if ticker.close and ticker.close > 0 else None,
                "volume": ticker.volume if ticker.volume else 0,
                "timestamp": datetime.now().isoformat()
            }
            
            return {
                "success": True,
                "market_data": market_data
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def start_watchdog(self):
        """Start connection watchdog"""
        logger.info("Starting IB connection watchdog...")
        
        while self.watchdog_enabled:
            try:
                if self.is_connected and self.ib_client:
                    # Check if connection is still alive
                    if self.ib_client.isConnected():
                        self.last_heartbeat = datetime.now()
                    else:
                        logger.warning("IB connection lost, attempting reconnection...")
                        await self.attempt_reconnection()
                else:
                    logger.info("IB not connected, attempting connection...")
                    await self.initialize_connection()
                
                await asyncio.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logger.error(f"Error in IB watchdog: {e}")
                await asyncio.sleep(60)
    
    async def attempt_reconnection(self):
        """Attempt to reconnect to TWS"""
        for attempt in range(self.reconnect_attempts):
            try:
                logger.info(f"Reconnection attempt {attempt + 1}/{self.reconnect_attempts}")
                
                # Disconnect first
                if self.ib_client:
                    self.ib_client.disconnect()
                
                # Wait a bit
                await asyncio.sleep(5)
                
                # Attempt reconnection
                result = await self.initialize_connection()
                
                if result["success"]:
                    logger.info("Reconnection successful")
                    return True
                
            except Exception as e:
                logger.error(f"Reconnection attempt failed: {e}")
            
            await asyncio.sleep(10)
        
        logger.error("All reconnection attempts failed")
        self.is_connected = False
        return False
    
    async def comprehensive_health_check(self) -> Dict[str, Any]:
        """Perform comprehensive health check"""
        health_report = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": "unknown",
            "checks": {}
        }
        
        try:
            # Check dependencies
            dependency_check = await self.check_tws_dependency()
            health_report["checks"]["dependencies"] = dependency_check
            
            if not dependency_check["success"]:
                health_report["overall_status"] = "dependencies_missing"
                return health_report
            
            # Check connection
            if not self.is_connected:
                connection_result = await self.initialize_connection()
                health_report["checks"]["connection"] = connection_result
            else:
                health_report["checks"]["connection"] = {"success": True, "already_connected": True}
            
            # Update account info
            account_result = await self.update_account_info()
            health_report["checks"]["account"] = account_result
            
            # Get positions
            positions_result = await self.get_positions()
            health_report["checks"]["positions"] = positions_result
            
            # Get orders
            orders_result = await self.get_open_orders()
            health_report["checks"]["orders"] = orders_result
            
            # Determine overall status
            if all(check.get("success", False) for check in [
                health_report["checks"]["connection"],
                health_report["checks"]["account"]
            ]):
                health_report["overall_status"] = "healthy"
            else:
                health_report["overall_status"] = "connection_issues"
            
            # Add connection info
            health_report["connection_info"] = {
                "host": self.host,
                "port": self.port,
                "client_id": self.client_id,
                "is_connected": self.is_connected,
                "last_heartbeat": self.last_heartbeat.isoformat() if self.last_heartbeat else None,
                "preview_only": self.preview_only
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
            "host": self.host,
            "port": self.port,
            "client_id": self.client_id,
            "last_heartbeat": self.last_heartbeat.isoformat() if self.last_heartbeat else None,
            "watchdog_enabled": self.watchdog_enabled,
            "preview_only": self.preview_only,
            "supported_assets": self.supported_assets
        }

# Global IB trader instance
ib_trader = IBTrader()

async def main():
    """Test the IB trader"""
    # Run comprehensive health check
    health_report = await ib_trader.comprehensive_health_check()
    print(f"Health report: {json.dumps(health_report, indent=2)}")
    
    # Get connection status
    status = ib_trader.get_connection_status()
    print(f"Connection status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())