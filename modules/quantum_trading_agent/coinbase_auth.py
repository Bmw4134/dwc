"""
Coinbase Pro/Advanced Trade API Authentication and Trading Module
For Kaizen Phase 2 Trillion System
"""

import os
import time
import hmac
import hashlib
import base64
import json
import requests
from typing import Dict, Any, Optional, List
import logging
from datetime import datetime

class CoinbaseAuthenticator:
    """
    Coinbase Pro/Advanced Trade API authentication and trading interface
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.api_key = os.getenv('COINBASE_API_KEY')
        self.api_secret = os.getenv('COINBASE_SECRET_KEY')
        self.passphrase = os.getenv('COINBASE_PASSPHRASE')
        self.sandbox_mode = os.getenv('COINBASE_SANDBOX', 'true').lower() == 'true'
        
        # API endpoints
        if self.sandbox_mode:
            self.base_url = 'https://api-public.sandbox.pro.coinbase.com'
        else:
            self.base_url = 'https://api.pro.coinbase.com'
            
        self.session = requests.Session()
        self.last_request_time = 0
        self.rate_limit_delay = 0.1  # 100ms between requests
        
    def _generate_signature(self, timestamp: str, method: str, request_path: str, body: str = '') -> str:
        """
        Generate HMAC signature for Coinbase Pro API
        """
        if not self.api_secret:
            raise ValueError("API secret not configured")
            
        message = timestamp + method + request_path + body
        signature = hmac.new(
            base64.b64decode(self.api_secret),
            message.encode('utf-8'),
            hashlib.sha256
        ).digest()
        return base64.b64encode(signature).decode('utf-8')
    
    def _get_headers(self, method: str, request_path: str, body: str = '') -> Dict[str, str]:
        """
        Generate authentication headers for API requests
        """
        if not all([self.api_key, self.api_secret, self.passphrase]):
            raise ValueError("Coinbase API credentials not fully configured")
            
        timestamp = str(time.time())
        signature = self._generate_signature(timestamp, method, request_path, body)
        
        return {
            'CB-ACCESS-KEY': self.api_key,
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'CB-ACCESS-PASSPHRASE': self.passphrase,
            'Content-Type': 'application/json'
        }
    
    def _make_request(self, method: str, endpoint: str, params: Optional[Dict] = None, data: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Make authenticated request to Coinbase API with rate limiting
        """
        # Rate limiting
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last)
        
        url = f"{self.base_url}{endpoint}"
        body = json.dumps(data) if data else ''
        
        try:
            headers = self._get_headers(method, endpoint, body)
            
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, params=params)
            elif method.upper() == 'POST':
                response = self.session.post(url, headers=headers, data=body)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            self.last_request_time = time.time()
            
            if response.status_code == 200:
                return response.json()
            else:
                self.logger.error(f"API request failed: {response.status_code} - {response.text}")
                return {
                    "error": True,
                    "status_code": response.status_code,
                    "message": response.text
                }
                
        except Exception as e:
            self.logger.error(f"Request error: {e}")
            return {
                "error": True,
                "message": str(e)
            }
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Test API connection and authentication
        """
        try:
            response = self._make_request('GET', '/accounts')
            
            if 'error' in response:
                return {
                    "connected": False,
                    "authenticated": False,
                    "error": response.get("message", "Unknown error"),
                    "sandbox_mode": self.sandbox_mode
                }
            
            return {
                "connected": True,
                "authenticated": True,
                "accounts_count": len(response) if isinstance(response, list) else 0,
                "sandbox_mode": self.sandbox_mode,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "connected": False,
                "authenticated": False,
                "error": str(e),
                "sandbox_mode": self.sandbox_mode
            }
    
    def get_account_balance(self) -> Dict[str, Any]:
        """
        Get account balances for all currencies
        """
        try:
            accounts = self._make_request('GET', '/accounts')
            
            if 'error' in accounts:
                return accounts
            
            balances = {}
            total_usd_value = 0.0
            
            for account in accounts:
                currency = account.get('currency', 'UNKNOWN')
                balance = float(account.get('balance', 0))
                available = float(account.get('available', 0))
                hold = float(account.get('hold', 0))
                
                if balance > 0:
                    balances[currency] = {
                        "balance": balance,
                        "available": available,
                        "hold": hold,
                        "currency": currency
                    }
                    
                    # Estimate USD value (simplified)
                    if currency == 'USD':
                        total_usd_value += balance
                    elif currency == 'USDC':
                        total_usd_value += balance
            
            return {
                "success": True,
                "balances": balances,
                "total_usd_estimate": total_usd_value,
                "account_count": len(balances),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error getting account balance: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_products(self) -> Dict[str, Any]:
        """
        Get available trading products/pairs
        """
        try:
            products = self._make_request('GET', '/products')
            
            if 'error' in products:
                return products
            
            active_products = [p for p in products if p.get('status') == 'online']
            
            return {
                "success": True,
                "products_count": len(active_products),
                "active_products": active_products[:10],  # Return first 10 for display
                "all_products": len(products),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def place_order(self, symbol: str, side: str, order_type: str, size: float, price: Optional[float] = None) -> Dict[str, Any]:
        """
        Place a trading order
        """
        try:
            # Safety check - only allow small orders in sandbox/preview mode
            if self.sandbox_mode and size > 0.01:  # Limit to very small sizes
                return {
                    "success": False,
                    "error": "Order size limited in sandbox mode for safety",
                    "max_size": 0.01
                }
            
            order_data = {
                "size": str(size),
                "side": side.lower(),
                "product_id": symbol.upper(),
                "type": order_type.lower()
            }
            
            if price and order_type.lower() == 'limit':
                order_data["price"] = str(price)
            
            # Add additional safety parameters
            if order_type.lower() == 'market':
                order_data["stp"] = "dc"  # Decline and cancel to prevent self-trading
            
            response = self._make_request('POST', '/orders', data=order_data)
            
            if 'error' in response:
                return {
                    "success": False,
                    "error": response.get("message", "Order placement failed"),
                    "order_data": order_data
                }
            
            return {
                "success": True,
                "order_id": response.get("id"),
                "status": response.get("status"),
                "size": response.get("size"),
                "price": response.get("price"),
                "side": response.get("side"),
                "product_id": response.get("product_id"),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error placing order: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """
        Cancel a specific order
        """
        try:
            response = self._make_request('DELETE', f'/orders/{order_id}')
            
            if 'error' in response:
                return {
                    "success": False,
                    "error": response.get("message", "Order cancellation failed")
                }
            
            return {
                "success": True,
                "cancelled_order_id": order_id,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_order_status(self, order_id: str) -> Dict[str, Any]:
        """
        Get status of a specific order
        """
        try:
            response = self._make_request('GET', f'/orders/{order_id}')
            
            if 'error' in response:
                return response
            
            return {
                "success": True,
                "order": response,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_market_data(self, symbol: str) -> Dict[str, Any]:
        """
        Get current market data for a symbol
        """
        try:
            ticker = self._make_request('GET', f'/products/{symbol}/ticker')
            
            if 'error' in ticker:
                return ticker
            
            return {
                "success": True,
                "symbol": symbol,
                "price": float(ticker.get("price", 0)),
                "bid": float(ticker.get("bid", 0)),
                "ask": float(ticker.get("ask", 0)),
                "volume": float(ticker.get("volume", 0)),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_system_status(self) -> Dict[str, Any]:
        """
        Get comprehensive system status including authentication and connectivity
        """
        connection_test = self.test_connection()
        
        status = {
            "coinbase_status": "CONNECTED" if connection_test.get("connected") else "DISCONNECTED",
            "authentication": "VALID" if connection_test.get("authenticated") else "INVALID",
            "sandbox_mode": self.sandbox_mode,
            "api_configured": bool(self.api_key and self.api_secret and self.passphrase),
            "credentials_required": [],
            "timestamp": datetime.now().isoformat()
        }
        
        # Check what credentials are missing
        if not self.api_key:
            status["credentials_required"].append("COINBASE_API_KEY")
        if not self.api_secret:
            status["credentials_required"].append("COINBASE_SECRET_KEY")
        if not self.passphrase:
            status["credentials_required"].append("COINBASE_PASSPHRASE")
        
        # Get balance if authenticated
        if connection_test.get("authenticated"):
            balance_info = self.get_account_balance()
            if balance_info.get("success"):
                status["account_balance"] = balance_info.get("total_usd_estimate", 0)
                status["active_currencies"] = len(balance_info.get("balances", {}))
        
        return status

# Global instance
coinbase_auth = CoinbaseAuthenticator()