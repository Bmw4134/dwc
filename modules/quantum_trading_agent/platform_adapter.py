#!/usr/bin/env python3
"""
Platform Adapter - Phase 2 Trillion Kaizen GPT
Mobile + Desktop adaptation logic for cross-platform trading
"""

import asyncio
import logging
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
import os

logger = logging.getLogger(__name__)

class PlatformAdapter:
    def __init__(self):
        self.adapter_name = "Platform Adapter v2.0"
        self.phase = "phase_2_trillion"
        
        # Supported platforms
        self.supported_platforms = {
            "pionex": {
                "name": "Pionex",
                "type": "crypto_grid",
                "mobile_support": True,
                "desktop_support": True,
                "api_available": True,
                "primary_test": True
            },
            "binance": {
                "name": "Binance",
                "type": "crypto_spot_futures",
                "mobile_support": True,
                "desktop_support": True,
                "api_available": True,
                "primary_test": False
            },
            "kucoin": {
                "name": "KuCoin",
                "type": "crypto_spot_futures",
                "mobile_support": True,
                "desktop_support": True,
                "api_available": True,
                "primary_test": False
            },
            "tradingview": {
                "name": "TradingView",
                "type": "signal_provider",
                "mobile_support": True,
                "desktop_support": True,
                "api_available": False,
                "primary_test": False
            },
            "td_ameritrade": {
                "name": "TD Ameritrade",
                "type": "stocks_options",
                "mobile_support": True,
                "desktop_support": True,
                "api_available": True,
                "primary_test": False
            }
        }
        
        # Device detection
        self.current_device = self.detect_device_type()
        self.mobile_mode = self.current_device == "mobile"
        
        # Platform readiness
        self.platform_status = {}
        self.initialize_platform_status()
        
        # Mobile-specific settings
        self.mobile_config = {
            "reduced_ui": True,
            "simple_notifications": True,
            "touch_optimized": True,
            "battery_aware": True,
            "offline_cache": True
        }
        
        # Desktop-specific settings
        self.desktop_config = {
            "full_ui": True,
            "advanced_charts": True,
            "multiple_windows": True,
            "keyboard_shortcuts": True,
            "extended_history": True
        }
        
    def detect_device_type(self) -> str:
        """Detect if running on mobile or desktop"""
        try:
            # Check environment variables for device hints
            user_agent = os.getenv('HTTP_USER_AGENT', '').lower()
            
            mobile_indicators = ['mobile', 'android', 'iphone', 'ipad', 'tablet']
            if any(indicator in user_agent for indicator in mobile_indicators):
                return "mobile"
            
            # Check for mobile-specific environment variables
            if os.getenv('MOBILE_MODE', '').lower() == 'true':
                return "mobile"
            
            # Default to desktop
            return "desktop"
            
        except Exception as e:
            logger.error(f"Error detecting device type: {e}")
            return "desktop"
    
    def initialize_platform_status(self):
        """Initialize platform readiness status"""
        for platform_key, platform_info in self.supported_platforms.items():
            self.platform_status[platform_key] = {
                "ready": False,
                "credentials_configured": False,
                "connection_tested": False,
                "mobile_compatible": platform_info["mobile_support"],
                "desktop_compatible": platform_info["desktop_support"],
                "last_check": None,
                "error_count": 0
            }
    
    def configure_platform_readiness(self, platform_name: str) -> Dict[str, Any]:
        """Configure platform readiness for specified platform"""
        try:
            if platform_name not in self.supported_platforms:
                return {
                    "success": False,
                    "error": f"Unsupported platform: {platform_name}",
                    "supported_platforms": list(self.supported_platforms.keys())
                }
            
            platform_info = self.supported_platforms[platform_name]
            status = self.platform_status[platform_name]
            
            # Check device compatibility
            if self.mobile_mode and not platform_info["mobile_support"]:
                return {
                    "success": False,
                    "error": f"{platform_name} not compatible with mobile devices",
                    "current_device": self.current_device
                }
            
            if not self.mobile_mode and not platform_info["desktop_support"]:
                return {
                    "success": False,
                    "error": f"{platform_name} not compatible with desktop",
                    "current_device": self.current_device
                }
            
            # Platform-specific configuration
            config_result = self.configure_platform_specific(platform_name)
            
            # Update status
            status.update({
                "ready": config_result["success"],
                "last_check": datetime.now().isoformat(),
                "configuration": config_result
            })
            
            if config_result["success"]:
                logger.info(f"Platform {platform_name} configured successfully for {self.current_device}")
            else:
                status["error_count"] += 1
                logger.warning(f"Platform {platform_name} configuration failed: {config_result.get('error')}")
            
            return config_result
            
        except Exception as e:
            logger.error(f"Error configuring platform {platform_name}: {e}")
            return {"success": False, "error": str(e)}
    
    def configure_platform_specific(self, platform_name: str) -> Dict[str, Any]:
        """Configure specific platform based on type"""
        try:
            platform_info = self.supported_platforms[platform_name]
            
            if platform_name == "pionex":
                return self.configure_pionex()
            elif platform_name == "binance":
                return self.configure_binance()
            elif platform_name == "kucoin":
                return self.configure_kucoin()
            elif platform_name == "tradingview":
                return self.configure_tradingview()
            elif platform_name == "td_ameritrade":
                return self.configure_td_ameritrade()
            else:
                return {"success": False, "error": "Platform configuration not implemented"}
                
        except Exception as e:
            logger.error(f"Error in platform-specific configuration: {e}")
            return {"success": False, "error": str(e)}
    
    def configure_pionex(self) -> Dict[str, Any]:
        """Configure Pionex (primary test platform)"""
        try:
            config = {
                "platform": "pionex",
                "primary_test": True,
                "mode": "testnet",
                "features": {
                    "grid_trading": True,
                    "dca_bot": True,
                    "spot_trading": True,
                    "leverage_grid": False  # Disabled for safety
                },
                "mobile_optimizations": {
                    "simple_interface": self.mobile_mode,
                    "quick_actions": self.mobile_mode,
                    "notification_alerts": True
                },
                "risk_limits": {
                    "max_trade_size": 20.0,  # $20 max per trade
                    "daily_limit": 100.0,    # $100 daily limit
                    "grid_spacing": 0.5      # 0.5% grid spacing
                }
            }
            
            # Check for Pionex credentials
            api_key = os.getenv('PIONEX_API_KEY')
            api_secret = os.getenv('PIONEX_API_SECRET')
            
            if api_key and api_secret:
                config["credentials_configured"] = True
                config["api_endpoint"] = "https://api.pionex.com"
            else:
                config["credentials_configured"] = False
                config["credentials_needed"] = ["PIONEX_API_KEY", "PIONEX_API_SECRET"]
            
            return {"success": True, "config": config}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def configure_binance(self) -> Dict[str, Any]:
        """Configure Binance platform"""
        try:
            config = {
                "platform": "binance",
                "mode": "testnet",
                "features": {
                    "spot_trading": True,
                    "futures_trading": True,
                    "margin_trading": False  # Disabled for safety
                },
                "mobile_optimizations": {
                    "lite_mode": self.mobile_mode,
                    "simplified_charts": self.mobile_mode
                },
                "risk_limits": {
                    "max_leverage": 1,  # No leverage
                    "max_position": 25.0
                }
            }
            
            # Use existing Binance connector configuration
            api_key = os.getenv('BINANCE_KEY')
            api_secret = os.getenv('BINANCE_SECRET')
            
            if api_key and api_secret:
                config["credentials_configured"] = True
                config["testnet_endpoint"] = "https://testnet.binancefuture.com"
            else:
                config["credentials_configured"] = False
                config["credentials_needed"] = ["BINANCE_KEY", "BINANCE_SECRET"]
            
            return {"success": True, "config": config}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def configure_kucoin(self) -> Dict[str, Any]:
        """Configure KuCoin platform"""
        try:
            config = {
                "platform": "kucoin",
                "mode": "sandbox",
                "features": {
                    "spot_trading": True,
                    "futures_trading": True,
                    "lending": False
                },
                "mobile_optimizations": {
                    "quick_trade": self.mobile_mode,
                    "price_alerts": True
                },
                "risk_limits": {
                    "max_trade_size": 15.0
                }
            }
            
            api_key = os.getenv('KUCOIN_API_KEY')
            api_secret = os.getenv('KUCOIN_API_SECRET')
            api_passphrase = os.getenv('KUCOIN_API_PASSPHRASE')
            
            if api_key and api_secret and api_passphrase:
                config["credentials_configured"] = True
                config["sandbox_endpoint"] = "https://openapi-sandbox.kucoin.com"
            else:
                config["credentials_configured"] = False
                config["credentials_needed"] = ["KUCOIN_API_KEY", "KUCOIN_API_SECRET", "KUCOIN_API_PASSPHRASE"]
            
            return {"success": True, "config": config}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def configure_tradingview(self) -> Dict[str, Any]:
        """Configure TradingView (signal provider only)"""
        try:
            config = {
                "platform": "tradingview",
                "mode": "webhook",
                "features": {
                    "signal_reception": True,
                    "chart_analysis": True,
                    "alerts": True
                },
                "mobile_optimizations": {
                    "mobile_charts": self.mobile_mode,
                    "touch_interactions": self.mobile_mode
                },
                "webhook_config": {
                    "endpoint": "/alpaca_webhook",
                    "authentication": "none",  # Internal webhook
                    "rate_limit": 60  # 60 requests per minute
                }
            }
            
            return {"success": True, "config": config}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def configure_td_ameritrade(self) -> Dict[str, Any]:
        """Configure TD Ameritrade platform"""
        try:
            config = {
                "platform": "td_ameritrade",
                "mode": "paper",
                "features": {
                    "stock_trading": True,
                    "options_trading": False,  # Disabled for safety
                    "etf_trading": True
                },
                "mobile_optimizations": {
                    "mobile_app_integration": self.mobile_mode,
                    "quick_quotes": self.mobile_mode
                },
                "risk_limits": {
                    "max_stock_position": 30.0,
                    "penny_stocks": False
                }
            }
            
            api_key = os.getenv('TD_AMERITRADE_API_KEY')
            
            if api_key:
                config["credentials_configured"] = True
                config["api_endpoint"] = "https://api.tdameritrade.com/v1"
            else:
                config["credentials_configured"] = False
                config["credentials_needed"] = ["TD_AMERITRADE_API_KEY"]
            
            return {"success": True, "config": config}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_device_specific_config(self) -> Dict[str, Any]:
        """Get configuration optimized for current device"""
        if self.mobile_mode:
            return {
                "device": "mobile",
                "ui_config": self.mobile_config,
                "features": {
                    "simplified_interface": True,
                    "touch_optimized": True,
                    "reduced_data_usage": True,
                    "quick_actions": True,
                    "notification_based": True
                },
                "performance": {
                    "battery_optimization": True,
                    "reduced_polling": True,
                    "cached_data": True
                }
            }
        else:
            return {
                "device": "desktop",
                "ui_config": self.desktop_config,
                "features": {
                    "full_interface": True,
                    "advanced_charts": True,
                    "multiple_panels": True,
                    "keyboard_shortcuts": True,
                    "detailed_analytics": True
                },
                "performance": {
                    "high_refresh_rate": True,
                    "real_time_data": True,
                    "extended_history": True
                }
            }
    
    def adapt_ui_for_platform(self, platform_name: str) -> Dict[str, Any]:
        """Adapt UI elements for specific platform and device"""
        try:
            platform_info = self.supported_platforms.get(platform_name, {})
            device_config = self.get_device_specific_config()
            
            adapted_ui = {
                "platform": platform_name,
                "device": self.current_device,
                "layout": "mobile" if self.mobile_mode else "desktop",
                "components": []
            }
            
            # Platform-specific UI adaptations
            if platform_name == "pionex":
                adapted_ui["components"] = [
                    {"type": "grid_setup", "mobile_simplified": self.mobile_mode},
                    {"type": "bot_status", "compact": self.mobile_mode},
                    {"type": "profit_display", "minimal": self.mobile_mode}
                ]
            elif platform_name in ["binance", "kucoin"]:
                adapted_ui["components"] = [
                    {"type": "order_form", "simplified": self.mobile_mode},
                    {"type": "portfolio", "condensed": self.mobile_mode},
                    {"type": "trade_history", "paginated": self.mobile_mode}
                ]
            elif platform_name == "tradingview":
                adapted_ui["components"] = [
                    {"type": "signal_viewer", "mobile_friendly": self.mobile_mode},
                    {"type": "chart_minimal", "touch_enabled": self.mobile_mode}
                ]
            
            return adapted_ui
            
        except Exception as e:
            logger.error(f"Error adapting UI for {platform_name}: {e}")
            return {"error": str(e)}
    
    def get_platform_readiness_summary(self) -> Dict[str, Any]:
        """Get summary of all platform readiness status"""
        try:
            summary = {
                "adapter": self.adapter_name,
                "phase": self.phase,
                "current_device": self.current_device,
                "mobile_mode": self.mobile_mode,
                "total_platforms": len(self.supported_platforms),
                "ready_platforms": 0,
                "platforms": {}
            }
            
            for platform_name, status in self.platform_status.items():
                platform_info = self.supported_platforms[platform_name]
                
                summary["platforms"][platform_name] = {
                    "name": platform_info["name"],
                    "type": platform_info["type"],
                    "ready": status["ready"],
                    "primary_test": platform_info.get("primary_test", False),
                    "device_compatible": (
                        platform_info["mobile_support"] if self.mobile_mode 
                        else platform_info["desktop_support"]
                    ),
                    "credentials_configured": status.get("credentials_configured", False),
                    "error_count": status.get("error_count", 0)
                }
                
                if status["ready"]:
                    summary["ready_platforms"] += 1
            
            summary["readiness_percentage"] = (summary["ready_platforms"] / summary["total_platforms"]) * 100
            
            return summary
            
        except Exception as e:
            logger.error(f"Error generating readiness summary: {e}")
            return {"error": str(e)}
    
    async def initialize_all_platforms(self) -> Dict[str, Any]:
        """Initialize all supported platforms"""
        try:
            logger.info(f"Initializing platforms for {self.current_device} device")
            
            initialization_results = {}
            
            for platform_name in self.supported_platforms.keys():
                logger.info(f"Configuring platform: {platform_name}")
                result = self.configure_platform_readiness(platform_name)
                initialization_results[platform_name] = result
                
                # Small delay to avoid overwhelming APIs
                await asyncio.sleep(0.5)
            
            summary = self.get_platform_readiness_summary()
            
            return {
                "success": True,
                "initialization_results": initialization_results,
                "readiness_summary": summary,
                "phase_2_trillion_ready": summary["ready_platforms"] > 0
            }
            
        except Exception as e:
            logger.error(f"Error initializing platforms: {e}")
            return {"success": False, "error": str(e)}

# Global platform adapter instance
platform_adapter = PlatformAdapter()

async def initialize_phase_2_trillion_platforms() -> Dict[str, Any]:
    """Main entry point for Phase 2 Trillion platform initialization"""
    try:
        logger.info("Starting Phase 2 Trillion platform initialization")
        
        # Initialize all platforms
        init_result = await platform_adapter.initialize_all_platforms()
        
        if init_result["success"]:
            # Set phase 2 trillion ready flag
            os.environ["PHASE_2_TRILLION_READY"] = "TRUE"
            
            logger.info("Phase 2 Trillion platforms initialized successfully")
            logger.info(f"Ready platforms: {init_result['readiness_summary']['ready_platforms']}")
            
        return init_result
        
    except Exception as e:
        logger.error(f"Error in Phase 2 Trillion initialization: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    # Test platform adapter
    result = asyncio.run(initialize_phase_2_trillion_platforms())
    print(f"Platform adapter initialization: {json.dumps(result, indent=2)}")