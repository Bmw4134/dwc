import os
import json
import time
from typing import Dict, Optional, Tuple

class APIKeyManager:
    def __init__(self):
        self.api_key = os.getenv("BINANCE_API_KEY")
        self.secret_key = os.getenv("BINANCE_SECRET_KEY")

    def is_configured(self):
        return bool(self.api_key and self.secret_key)

    def display_status(self):
        if self.is_configured():
            print("[✅] Binance API keys are set and active.")
            return True
        else:
            print("[❌] Binance API keys are missing! Add via Replit secrets.")
            return False

    def get_connection_status(self) -> Dict:
        """Returns detailed connection status for the quantum trading system"""
        return {
            "api_configured": self.is_configured(),
            "api_key_present": bool(self.api_key),
            "secret_key_present": bool(self.secret_key),
            "timestamp": time.time(),
            "ready_for_trading": self.is_configured()
        }

    def validate_keys(self) -> Tuple[bool, str]:
        """Validates the API keys format and basic structure"""
        if not self.api_key or not self.secret_key:
            return False, "API keys not configured"
        
        # Basic validation - Binance API keys have specific formats
        if len(self.api_key) < 40 or len(self.secret_key) < 40:
            return False, "API keys appear to be invalid format"
        
        return True, "API keys validated successfully"

    def get_masked_keys(self) -> Dict:
        """Returns masked versions of keys for display purposes"""
        if not self.is_configured():
            return {"api_key": "Not Set", "secret_key": "Not Set"}
        
        return {
            "api_key": f"{self.api_key[:8]}...{self.api_key[-4:]}",
            "secret_key": f"{self.secret_key[:8]}...{self.secret_key[-4:]}"
        }

def get_api_status():
    """Function for external API status checks"""
    manager = APIKeyManager()
    return manager.get_connection_status()

def check_binance_readiness():
    """Comprehensive readiness check for Binance integration"""
    manager = APIKeyManager()
    status = manager.get_connection_status()
    validation = manager.validate_keys()
    
    return {
        "ready": status["ready_for_trading"] and validation[0],
        "status": status,
        "validation": {
            "valid": validation[0],
            "message": validation[1]
        },
        "masked_keys": manager.get_masked_keys(),
        "timestamp": time.time()
    }

if __name__ == "__main__":
    # Quick test when run directly
    manager = APIKeyManager()
    manager.display_status()
    print(json.dumps(check_binance_readiness(), indent=2))