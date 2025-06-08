"""
Global Risk Controller for Kaizen Phase 2 Trillion
Advanced risk management and position sizing controller
"""

import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import logging

class GlobalRiskController:
    """
    Global risk management system for all trading operations
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.risk_config = {
            "max_portfolio_risk": 0.02,  # 2% max portfolio risk
            "max_position_size": 0.10,   # 10% max per position
            "max_daily_trades": 50,
            "max_daily_loss": 0.05,      # 5% max daily loss
            "emergency_stop_loss": 0.15,  # 15% emergency stop
            "compound_protection": True,
            "preview_mode": True
        }
        self.daily_stats = {
            "trades_executed": 0,
            "total_pnl": 0.0,
            "max_drawdown": 0.0,
            "last_reset": datetime.now().date()
        }
        self.emergency_stop = False
        self.active_positions = {}
        
    def calculate_position_size(self, signal_data: Dict[str, Any], account_balance: float) -> Dict[str, Any]:
        """
        Calculate safe position size based on risk parameters
        """
        try:
            if self.emergency_stop:
                return {
                    "position_size": 0,
                    "risk_level": "EMERGENCY_STOP",
                    "reason": "Emergency stop activated"
                }
            
            # Reset daily stats if new day
            if datetime.now().date() > self.daily_stats["last_reset"]:
                self._reset_daily_stats()
            
            # Check daily trade limit
            if self.daily_stats["trades_executed"] >= self.risk_config["max_daily_trades"]:
                return {
                    "position_size": 0,
                    "risk_level": "MAX_TRADES_REACHED",
                    "reason": f"Daily trade limit reached: {self.risk_config['max_daily_trades']}"
                }
            
            # Check daily loss limit
            if self.daily_stats["total_pnl"] <= -self.risk_config["max_daily_loss"] * account_balance:
                return {
                    "position_size": 0,
                    "risk_level": "MAX_LOSS_REACHED",
                    "reason": f"Daily loss limit reached: {self.risk_config['max_daily_loss'] * 100}%"
                }
            
            # Calculate base position size
            risk_amount = account_balance * self.risk_config["max_portfolio_risk"]
            stop_loss_distance = signal_data.get("stop_loss_distance", 0.02)
            
            if stop_loss_distance <= 0:
                stop_loss_distance = 0.02  # Default 2% stop loss
            
            base_position_size = risk_amount / stop_loss_distance
            
            # Apply position size limits
            max_position_value = account_balance * self.risk_config["max_position_size"]
            final_position_size = min(base_position_size, max_position_value)
            
            # Additional safety checks for compound strategy
            if signal_data.get("strategy_type") == "compound":
                final_position_size *= 0.7  # More conservative for compound trades
            
            # Preview mode safety
            if self.risk_config["preview_mode"]:
                final_position_size = min(final_position_size, 50)  # Max $50 in preview
            
            return {
                "position_size": final_position_size,
                "risk_level": self._calculate_risk_level(final_position_size, account_balance),
                "stop_loss_distance": stop_loss_distance,
                "risk_amount": risk_amount,
                "max_loss": final_position_size * stop_loss_distance,
                "approved": True
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating position size: {e}")
            return {
                "position_size": 0,
                "risk_level": "ERROR",
                "reason": f"Calculation error: {str(e)}",
                "approved": False
            }
    
    def validate_trade_signal(self, signal: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate trading signal against risk parameters
        """
        try:
            validation_result = {
                "valid": True,
                "risk_score": 0,
                "warnings": [],
                "blocks": []
            }
            
            # Check required fields
            required_fields = ["symbol", "direction", "confidence", "entry_price"]
            for field in required_fields:
                if field not in signal:
                    validation_result["valid"] = False
                    validation_result["blocks"].append(f"Missing required field: {field}")
            
            # Check confidence level
            confidence = signal.get("confidence", 0)
            if confidence < 0.6:
                validation_result["warnings"].append(f"Low confidence signal: {confidence}")
                validation_result["risk_score"] += 20
            
            # Check market conditions
            market_volatility = signal.get("market_volatility", "normal")
            if market_volatility == "high":
                validation_result["warnings"].append("High market volatility detected")
                validation_result["risk_score"] += 15
            
            # Check timing
            current_hour = datetime.now().hour
            if current_hour < 9 or current_hour > 16:  # Outside market hours
                validation_result["warnings"].append("Trading outside normal market hours")
                validation_result["risk_score"] += 10
            
            # Emergency checks
            if self.emergency_stop:
                validation_result["valid"] = False
                validation_result["blocks"].append("Emergency stop activated")
            
            # Final risk assessment
            if validation_result["risk_score"] > 50:
                validation_result["valid"] = False
                validation_result["blocks"].append(f"Risk score too high: {validation_result['risk_score']}")
            
            return validation_result
            
        except Exception as e:
            self.logger.error(f"Error validating trade signal: {e}")
            return {
                "valid": False,
                "risk_score": 100,
                "blocks": [f"Validation error: {str(e)}"]
            }
    
    def update_position(self, position_id: str, pnl: float, status: str) -> None:
        """
        Update position tracking and risk metrics
        """
        try:
            if position_id in self.active_positions:
                self.active_positions[position_id]["pnl"] = pnl
                self.active_positions[position_id]["status"] = status
                self.active_positions[position_id]["last_update"] = datetime.now()
                
                # Update daily stats
                if status == "closed":
                    self.daily_stats["total_pnl"] += pnl
                    self.daily_stats["trades_executed"] += 1
                    
                    # Check emergency stop conditions
                    if pnl < 0 and abs(pnl) > self.risk_config["emergency_stop_loss"] * 100:
                        self._trigger_emergency_stop(f"Large loss detected: ${pnl}")
                
                # Update max drawdown
                current_drawdown = abs(min(0, self.daily_stats["total_pnl"]))
                self.daily_stats["max_drawdown"] = max(self.daily_stats["max_drawdown"], current_drawdown)
                
        except Exception as e:
            self.logger.error(f"Error updating position {position_id}: {e}")
    
    def get_risk_metrics(self) -> Dict[str, Any]:
        """
        Get current risk metrics and system status
        """
        return {
            "emergency_stop": self.emergency_stop,
            "daily_stats": self.daily_stats.copy(),
            "active_positions": len(self.active_positions),
            "risk_config": self.risk_config.copy(),
            "system_status": "EMERGENCY" if self.emergency_stop else "ACTIVE",
            "daily_pnl": self.daily_stats["total_pnl"],
            "max_drawdown": self.daily_stats["max_drawdown"],
            "trades_remaining": max(0, self.risk_config["max_daily_trades"] - self.daily_stats["trades_executed"])
        }
    
    def _calculate_risk_level(self, position_size: float, account_balance: float) -> str:
        """
        Calculate risk level for position
        """
        risk_percentage = (position_size / account_balance) * 100
        
        if risk_percentage < 2:
            return "LOW"
        elif risk_percentage < 5:
            return "MEDIUM"
        elif risk_percentage < 10:
            return "HIGH"
        else:
            return "CRITICAL"
    
    def _reset_daily_stats(self) -> None:
        """
        Reset daily statistics for new trading day
        """
        self.daily_stats = {
            "trades_executed": 0,
            "total_pnl": 0.0,
            "max_drawdown": 0.0,
            "last_reset": datetime.now().date()
        }
        self.logger.info("Daily stats reset for new trading day")
    
    def _trigger_emergency_stop(self, reason: str) -> None:
        """
        Trigger emergency stop and halt all trading
        """
        self.emergency_stop = True
        self.logger.critical(f"EMERGENCY STOP TRIGGERED: {reason}")
        
        # Close all active positions (simulation)
        for position_id in self.active_positions:
            self.active_positions[position_id]["status"] = "emergency_closed"
        
    def reset_emergency_stop(self, authorization_code: str) -> bool:
        """
        Reset emergency stop with proper authorization
        """
        if authorization_code == "DWC_OVERRIDE_2025":
            self.emergency_stop = False
            self.logger.info("Emergency stop reset with valid authorization")
            return True
        else:
            self.logger.warning(f"Invalid authorization code for emergency reset: {authorization_code}")
            return False
    
    def get_system_health(self) -> Dict[str, Any]:
        """
        Get comprehensive system health report
        """
        return {
            "timestamp": datetime.now().isoformat(),
            "system_operational": not self.emergency_stop,
            "risk_controller_status": "ACTIVE" if not self.emergency_stop else "EMERGENCY_STOP",
            "daily_performance": {
                "trades_executed": self.daily_stats["trades_executed"],
                "total_pnl": self.daily_stats["total_pnl"],
                "max_drawdown": self.daily_stats["max_drawdown"],
                "success_rate": self._calculate_success_rate()
            },
            "risk_limits": {
                "daily_trade_limit": self.risk_config["max_daily_trades"],
                "max_position_size": self.risk_config["max_position_size"],
                "max_portfolio_risk": self.risk_config["max_portfolio_risk"],
                "emergency_stop_threshold": self.risk_config["emergency_stop_loss"]
            },
            "safety_status": {
                "preview_mode": self.risk_config["preview_mode"],
                "compound_protection": self.risk_config["compound_protection"],
                "emergency_override_required": self.emergency_stop
            }
        }
    
    def _calculate_success_rate(self) -> float:
        """
        Calculate success rate of trades
        """
        if not self.active_positions:
            return 0.0
        
        closed_positions = [p for p in self.active_positions.values() if p["status"] == "closed"]
        if not closed_positions:
            return 0.0
        
        profitable_trades = len([p for p in closed_positions if p["pnl"] > 0])
        return (profitable_trades / len(closed_positions)) * 100

# Global instance
risk_controller = GlobalRiskController()