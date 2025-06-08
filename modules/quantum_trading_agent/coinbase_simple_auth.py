"""
Coinbase Advanced Trade API - Simplified Authentication
Works with just API key for basic functionality
"""

import os
import time
import json
import requests
from typing import Dict, Any, Optional, List
import logging
from datetime import datetime

class SimpleCoinbaseAuth:
    """
    Simplified Coinbase authentication using Advanced Trade API
    Requires only COINBASE_API_KEY
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.api_key = os.getenv('COINBASE_API_KEY')
        self.base_url = 'https://api.coinbase.com/v2'
        self.session = requests.Session()
        self.last_request_time = 0
        self.rate_limit_delay = 0.2  # 200ms between requests
        
    def _get_headers(self) -> Dict[str, str]:
        """
        Generate headers for API requests
        """
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'DWC-Systems/1.0'
        }
    
    def _make_request(self, method: str, endpoint: str, params: Optional[Dict] = None, data: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Make request to Coinbase API with rate limiting
        """
        # Rate limiting
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last)
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            headers = self._get_headers()
            
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, headers=headers, json=data, timeout=30)
            else:
                response = self.session.request(method, url, headers=headers, json=data, timeout=30)
            
            self.last_request_time = time.time()
            
            if response.status_code == 401:
                return {
                    "error": "Authentication failed - check API key",
                    "status_code": 401
                }
            
            if response.status_code == 429:
                return {
                    "error": "Rate limit exceeded",
                    "status_code": 429
                }
            
            if not response.ok:
                return {
                    "error": f"API request failed: {response.status_code}",
                    "status_code": response.status_code,
                    "message": response.text
                }
            
            return response.json()
            
        except requests.exceptions.Timeout:
            return {"error": "Request timeout"}
        except requests.exceptions.RequestException as e:
            return {"error": f"Request failed: {str(e)}"}
        except Exception as e:
            self.logger.error(f"Coinbase API request error: {e}")
            return {"error": f"Unexpected error: {str(e)}"}
    
    def test_connection(self) -> Dict[str, Any]:
        """
        Test API connection and authentication
        """
        if not self.api_key:
            return {
                "connected": False,
                "authenticated": False,
                "error": "API key not configured",
                "credentials_required": ["COINBASE_API_KEY"]
            }
        
        try:
            # Test with user endpoint
            response = self._make_request('GET', '/user')
            
            if 'error' in response:
                return {
                    "connected": False,
                    "authenticated": False,
                    "error": response.get("error"),
                    "api_configured": bool(self.api_key)
                }
            
            if 'data' in response:
                return {
                    "connected": True,
                    "authenticated": True,
                    "user_id": response['data'].get('id'),
                    "username": response['data'].get('name'),
                    "api_configured": True
                }
            
            return {
                "connected": True,
                "authenticated": False,
                "error": "Unexpected response format"
            }
            
        except Exception as e:
            return {
                "connected": False,
                "authenticated": False,
                "error": str(e)
            }
    
    def get_account_info(self) -> Dict[str, Any]:
        """
        Get account information
        """
        try:
            response = self._make_request('GET', '/accounts')
            
            if 'error' in response:
                return {
                    "success": False,
                    "error": response.get("error")
                }
            
            if 'data' in response:
                accounts = response['data']
                total_balance = 0
                balances = {}
                
                for account in accounts:
                    currency = account.get('currency', {}).get('code', 'UNKNOWN')
                    balance = float(account.get('balance', {}).get('amount', 0))
                    balances[currency] = balance
                    
                    # Convert to USD estimate (simplified)
                    if currency == 'USD':
                        total_balance += balance
                    elif currency in ['BTC', 'ETH']:
                        # Simple estimation - in production would use real exchange rates
                        if currency == 'BTC':
                            total_balance += balance * 50000  # Rough BTC price
                        elif currency == 'ETH':
                            total_balance += balance * 3000   # Rough ETH price
                
                return {
                    "success": True,
                    "accounts_count": len(accounts),
                    "balances": balances,
                    "total_usd_estimate": round(total_balance, 2),
                    "timestamp": datetime.now().isoformat()
                }
            
            return {
                "success": False,
                "error": "No account data received"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_prices(self, currencies: List[str] = None) -> Dict[str, Any]:
        """
        Get current prices for cryptocurrencies
        """
        if not currencies:
            currencies = ['BTC', 'ETH', 'LTC', 'ADA', 'DOT']
        
        try:
            prices = {}
            
            for currency in currencies:
                response = self._make_request('GET', f'/exchange-rates?currency={currency}')
                
                if 'data' in response and 'rates' in response['data']:
                    usd_rate = response['data']['rates'].get('USD')
                    if usd_rate:
                        prices[currency] = {
                            "price_usd": float(usd_rate),
                            "timestamp": datetime.now().isoformat()
                        }
            
            return {
                "success": True,
                "prices": prices,
                "count": len(prices)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_status_summary(self) -> Dict[str, Any]:
        """
        Get comprehensive status summary
        """
        connection_test = self.test_connection()
        
        status = {
            "coinbase_status": "CONNECTED" if connection_test.get("connected") else "DISCONNECTED",
            "authentication": "VALID" if connection_test.get("authenticated") else "INVALID",
            "api_configured": bool(self.api_key),
            "credentials_required": [],
            "timestamp": datetime.now().isoformat(),
            "api_type": "Coinbase Advanced Trade (Simplified)"
        }
        
        if not self.api_key:
            status["credentials_required"].append("COINBASE_API_KEY")
        
        # Get account info if authenticated
        if connection_test.get("authenticated"):
            account_info = self.get_account_info()
            if account_info.get("success"):
                status["account_balance"] = account_info.get("total_usd_estimate", 0)
                status["active_currencies"] = len(account_info.get("balances", {}))
                status["accounts_count"] = account_info.get("accounts_count", 0)
        
        return status

# Global instance
simple_coinbase_auth = SimpleCoinbaseAuth()

def main():
    """Test the simplified Coinbase authentication"""
    # Test connection
    connection_test = simple_coinbase_auth.test_connection()
    print(f"Connection test: {json.dumps(connection_test, indent=2)}")
    
    # Get status summary
    status = simple_coinbase_auth.get_status_summary()
    print(f"Status summary: {json.dumps(status, indent=2)}")
    
    # Get account info if connected
    if connection_test.get("authenticated"):
        account_info = simple_coinbase_auth.get_account_info()
        print(f"Account info: {json.dumps(account_info, indent=2)}")
        
        # Get current prices
        prices = simple_coinbase_auth.get_prices()
        print(f"Current prices: {json.dumps(prices, indent=2)}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()