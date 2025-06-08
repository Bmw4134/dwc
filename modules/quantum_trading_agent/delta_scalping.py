#!/usr/bin/env python3
"""
Delta Scalping Strategy Engine - Phase 2 Trillion Kaizen GPT
Default strategy engine for micro-movements and compound gains
"""

import asyncio
import logging
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import numpy as np

logger = logging.getLogger(__name__)

class DeltaScalpingEngine:
    def __init__(self):
        self.strategy_name = "Delta Scalping v2.0"
        self.phase = "phase_2_trillion"
        
        # Risk management
        self.max_budget = 100.0  # $100 global cap
        self.target_exit = 500.0  # $500 exit target
        self.current_balance = 100.0
        self.daily_gain_target = 0.05  # 5% daily target
        
        # Scalping parameters
        self.min_movement = 0.001  # 0.1% minimum movement
        self.max_position_time = 300  # 5 minutes max hold
        self.stop_loss_pct = 0.002  # 0.2% stop loss
        self.take_profit_pct = 0.005  # 0.5% take profit
        
        # Delta analysis
        self.delta_threshold = 0.0005  # 0.05% delta sensitivity
        self.volume_multiplier = 1.5  # Volume confirmation
        self.momentum_window = 10  # 10-tick momentum
        
        # Trade tracking
        self.active_trades = {}
        self.completed_trades = []
        self.daily_pnl = 0.0
        self.session_start = datetime.now()
        
        # Memory integration
        self.memory_file = "modules/quantum_trading_agent/agent_memory.json"
        self.load_session_memory()
        
    def load_session_memory(self):
        """Load session memory and error thresholding"""
        try:
            with open(self.memory_file, 'r') as f:
                memory = json.load(f)
                
            # Restore session data
            self.current_balance = memory.get("current_balance", 100.0)
            self.daily_pnl = memory.get("daily_pnl", 0.0)
            self.completed_trades = memory.get("completed_trades", [])
            
            # Error thresholding
            self.error_count = memory.get("error_count", 0)
            self.max_errors = memory.get("max_errors", 5)
            self.last_error_time = memory.get("last_error_time")
            
            logger.info(f"Loaded session memory: Balance ${self.current_balance}")
            
        except FileNotFoundError:
            logger.info("No session memory found, starting fresh")
            self.save_session_memory()
        except Exception as e:
            logger.error(f"Error loading session memory: {e}")
    
    def save_session_memory(self):
        """Save session memory and performance data"""
        try:
            memory = {
                "phase": self.phase,
                "timestamp": datetime.now().isoformat(),
                "current_balance": self.current_balance,
                "daily_pnl": self.daily_pnl,
                "completed_trades": self.completed_trades[-50:],  # Keep last 50 trades
                "error_count": getattr(self, 'error_count', 0),
                "max_errors": getattr(self, 'max_errors', 5),
                "last_error_time": getattr(self, 'last_error_time', None),
                "session_stats": {
                    "session_start": self.session_start.isoformat(),
                    "total_trades": len(self.completed_trades),
                    "win_rate": self.calculate_win_rate(),
                    "avg_profit": self.calculate_avg_profit()
                }
            }
            
            with open(self.memory_file, 'w') as f:
                json.dump(memory, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving session memory: {e}")
    
    def analyze_delta_opportunity(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze micro-movements for delta scalping opportunities"""
        try:
            symbol = market_data.get("symbol", "")
            current_price = float(market_data.get("price", 0))
            volume = float(market_data.get("volume", 0))
            bid = float(market_data.get("bid", current_price))
            ask = float(market_data.get("ask", current_price))
            
            # Calculate spread and delta
            spread = (ask - bid) / current_price if current_price > 0 else 0
            price_delta = market_data.get("price_change_pct", 0)
            
            # Momentum analysis
            momentum_score = self.calculate_momentum(market_data)
            volume_score = self.calculate_volume_score(volume, market_data.get("avg_volume", volume))
            
            # Delta scalping signals
            signals = {
                "symbol": symbol,
                "current_price": current_price,
                "spread": spread,
                "price_delta": price_delta,
                "momentum_score": momentum_score,
                "volume_score": volume_score,
                "timestamp": datetime.now().isoformat()
            }
            
            # Entry conditions
            entry_signal = self.evaluate_entry_conditions(signals)
            signals.update(entry_signal)
            
            return signals
            
        except Exception as e:
            logger.error(f"Error analyzing delta opportunity: {e}")
            self.record_error(str(e))
            return {"error": str(e)}
    
    def calculate_momentum(self, market_data: Dict[str, Any]) -> float:
        """Calculate momentum score for delta scalping"""
        try:
            # Use price history if available
            price_history = market_data.get("price_history", [])
            
            if len(price_history) < self.momentum_window:
                return 0.5  # Neutral momentum
            
            recent_prices = price_history[-self.momentum_window:]
            
            # Calculate momentum using linear regression slope
            x = np.arange(len(recent_prices))
            y = np.array(recent_prices)
            
            slope = np.polyfit(x, y, 1)[0]
            normalized_slope = slope / np.mean(y) if np.mean(y) != 0 else 0
            
            # Convert to 0-1 score
            momentum_score = max(0, min(1, 0.5 + normalized_slope * 1000))
            
            return momentum_score
            
        except Exception as e:
            logger.error(f"Error calculating momentum: {e}")
            return 0.5
    
    def calculate_volume_score(self, current_volume: float, avg_volume: float) -> float:
        """Calculate volume score for confirmation"""
        try:
            if avg_volume <= 0:
                return 0.5
            
            volume_ratio = current_volume / avg_volume
            
            # Score based on volume multiplier
            if volume_ratio >= self.volume_multiplier:
                return min(1.0, volume_ratio / (self.volume_multiplier * 2))
            else:
                return max(0.1, volume_ratio / self.volume_multiplier)
                
        except Exception as e:
            logger.error(f"Error calculating volume score: {e}")
            return 0.5
    
    def evaluate_entry_conditions(self, signals: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate if conditions are met for delta scalping entry"""
        try:
            entry_conditions = {
                "should_enter": False,
                "entry_type": None,
                "confidence": 0.0,
                "position_size": 0.0
            }
            
            # Check budget constraints
            if self.current_balance >= self.target_exit:
                entry_conditions["exit_target_reached"] = True
                return entry_conditions
            
            if self.current_balance <= 10.0:  # Emergency stop at $10
                entry_conditions["emergency_stop"] = True
                return entry_conditions
            
            # Delta thresholds
            price_delta = abs(signals.get("price_delta", 0))
            momentum_score = signals.get("momentum_score", 0.5)
            volume_score = signals.get("volume_score", 0.5)
            spread = signals.get("spread", 0)
            
            # Entry criteria
            delta_valid = price_delta >= self.delta_threshold
            momentum_valid = momentum_score > 0.6 or momentum_score < 0.4  # Strong directional momentum
            volume_valid = volume_score >= 0.7
            spread_valid = spread <= 0.001  # Tight spread
            
            # Calculate confidence
            confidence_factors = [
                delta_valid * 0.3,
                (abs(momentum_score - 0.5) * 2) * 0.4,  # Distance from neutral
                volume_score * 0.2,
                (1 - min(spread * 1000, 1)) * 0.1  # Inverse spread contribution
            ]
            
            confidence = sum(confidence_factors)
            
            # Entry decision
            min_confidence = 0.75
            if confidence >= min_confidence and all([delta_valid, volume_valid, spread_valid]):
                entry_conditions["should_enter"] = True
                entry_conditions["entry_type"] = "LONG" if momentum_score > 0.5 else "SHORT"
                entry_conditions["confidence"] = confidence
                
                # Position sizing (max 20% of balance)
                risk_amount = min(self.current_balance * 0.2, 20.0)
                entry_conditions["position_size"] = risk_amount
            
            return entry_conditions
            
        except Exception as e:
            logger.error(f"Error evaluating entry conditions: {e}")
            self.record_error(str(e))
            return {"should_enter": False, "error": str(e)}
    
    def execute_scalping_trade(self, signal: Dict[str, Any]) -> Dict[str, Any]:
        """Execute delta scalping trade with strict risk management"""
        try:
            if not signal.get("should_enter", False):
                return {"success": False, "reason": "No entry signal"}
            
            # Generate trade ID
            trade_id = f"DELTA_{int(datetime.now().timestamp())}"
            
            # Trade parameters
            symbol = signal.get("symbol", "BTCUSDT")
            entry_price = signal.get("current_price", 0)
            position_size = signal.get("position_size", 0)
            side = signal.get("entry_type", "LONG")
            confidence = signal.get("confidence", 0)
            
            # Risk management calculations
            if side == "LONG":
                stop_loss = entry_price * (1 - self.stop_loss_pct)
                take_profit = entry_price * (1 + self.take_profit_pct)
            else:
                stop_loss = entry_price * (1 + self.stop_loss_pct)
                take_profit = entry_price * (1 - self.take_profit_pct)
            
            # Create trade record
            trade = {
                "trade_id": trade_id,
                "symbol": symbol,
                "side": side,
                "entry_price": entry_price,
                "position_size": position_size,
                "stop_loss": stop_loss,
                "take_profit": take_profit,
                "confidence": confidence,
                "entry_time": datetime.now().isoformat(),
                "max_hold_time": (datetime.now() + timedelta(seconds=self.max_position_time)).isoformat(),
                "status": "ACTIVE",
                "strategy": "delta_scalping",
                "phase": self.phase
            }
            
            # Store active trade
            self.active_trades[trade_id] = trade
            
            # Update memory
            self.save_session_memory()
            
            logger.info(f"Executed delta scalping trade: {trade_id} - {side} {symbol} @ {entry_price}")
            
            return {
                "success": True,
                "trade": trade,
                "execution_mode": "preview_only"  # Enforced safety
            }
            
        except Exception as e:
            logger.error(f"Error executing scalping trade: {e}")
            self.record_error(str(e))
            return {"success": False, "error": str(e)}
    
    def monitor_active_trades(self, market_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Monitor active trades for exit conditions"""
        try:
            current_price = float(market_data.get("price", 0))
            symbol = market_data.get("symbol", "")
            
            closed_trades = []
            
            for trade_id, trade in list(self.active_trades.items()):
                if trade["symbol"] != symbol:
                    continue
                
                # Check exit conditions
                exit_result = self.check_exit_conditions(trade, current_price)
                
                if exit_result["should_exit"]:
                    closed_trade = self.close_trade(trade_id, current_price, exit_result["reason"])
                    if closed_trade:
                        closed_trades.append(closed_trade)
            
            return closed_trades
            
        except Exception as e:
            logger.error(f"Error monitoring trades: {e}")
            self.record_error(str(e))
            return []
    
    def check_exit_conditions(self, trade: Dict[str, Any], current_price: float) -> Dict[str, Any]:
        """Check if trade should be closed"""
        try:
            side = trade["side"]
            entry_price = trade["entry_price"]
            stop_loss = trade["stop_loss"]
            take_profit = trade["take_profit"]
            max_hold_time = datetime.fromisoformat(trade["max_hold_time"])
            
            # Time-based exit
            if datetime.now() >= max_hold_time:
                return {"should_exit": True, "reason": "MAX_TIME"}
            
            # Profit/Loss exits
            if side == "LONG":
                if current_price <= stop_loss:
                    return {"should_exit": True, "reason": "STOP_LOSS"}
                elif current_price >= take_profit:
                    return {"should_exit": True, "reason": "TAKE_PROFIT"}
            else:  # SHORT
                if current_price >= stop_loss:
                    return {"should_exit": True, "reason": "STOP_LOSS"}
                elif current_price <= take_profit:
                    return {"should_exit": True, "reason": "TAKE_PROFIT"}
            
            return {"should_exit": False}
            
        except Exception as e:
            logger.error(f"Error checking exit conditions: {e}")
            return {"should_exit": True, "reason": "ERROR"}
    
    def close_trade(self, trade_id: str, exit_price: float, reason: str) -> Optional[Dict[str, Any]]:
        """Close an active trade and calculate P&L"""
        try:
            if trade_id not in self.active_trades:
                return None
            
            trade = self.active_trades[trade_id]
            
            # Calculate P&L
            entry_price = trade["entry_price"]
            position_size = trade["position_size"]
            side = trade["side"]
            
            if side == "LONG":
                pnl = (exit_price - entry_price) / entry_price * position_size
            else:
                pnl = (entry_price - exit_price) / entry_price * position_size
            
            # Update trade record
            trade.update({
                "exit_price": exit_price,
                "exit_time": datetime.now().isoformat(),
                "exit_reason": reason,
                "pnl": pnl,
                "status": "CLOSED"
            })
            
            # Update balances
            self.current_balance += pnl
            self.daily_pnl += pnl
            
            # Move to completed trades
            self.completed_trades.append(trade)
            del self.active_trades[trade_id]
            
            # Save memory
            self.save_session_memory()
            
            logger.info(f"Closed trade {trade_id}: P&L ${pnl:.2f}, New balance: ${self.current_balance:.2f}")
            
            return trade
            
        except Exception as e:
            logger.error(f"Error closing trade: {e}")
            self.record_error(str(e))
            return None
    
    def calculate_win_rate(self) -> float:
        """Calculate win rate from completed trades"""
        if not self.completed_trades:
            return 0.0
        
        winning_trades = len([t for t in self.completed_trades if t.get("pnl", 0) > 0])
        return (winning_trades / len(self.completed_trades)) * 100
    
    def calculate_avg_profit(self) -> float:
        """Calculate average profit per trade"""
        if not self.completed_trades:
            return 0.0
        
        total_pnl = sum(t.get("pnl", 0) for t in self.completed_trades)
        return total_pnl / len(self.completed_trades)
    
    def record_error(self, error_msg: str):
        """Record error for threshold monitoring"""
        try:
            self.error_count = getattr(self, 'error_count', 0) + 1
            self.last_error_time = datetime.now().isoformat()
            
            if self.error_count >= self.max_errors:
                logger.warning(f"Error threshold reached: {self.error_count} errors")
                
        except Exception as e:
            logger.error(f"Error recording error: {e}")
    
    def get_strategy_status(self) -> Dict[str, Any]:
        """Get current strategy status and performance"""
        return {
            "strategy": self.strategy_name,
            "phase": self.phase,
            "current_balance": self.current_balance,
            "target_exit": self.target_exit,
            "daily_pnl": self.daily_pnl,
            "active_trades": len(self.active_trades),
            "completed_trades": len(self.completed_trades),
            "win_rate": self.calculate_win_rate(),
            "avg_profit": self.calculate_avg_profit(),
            "error_count": getattr(self, 'error_count', 0),
            "ready_for_phase_final": self.current_balance >= self.target_exit,
            "session_duration": str(datetime.now() - self.session_start)
        }

# Global strategy engine instance
delta_engine = DeltaScalpingEngine()

async def process_market_signal(market_data: Dict[str, Any]) -> Dict[str, Any]:
    """Main entry point for processing market signals"""
    try:
        # Analyze delta opportunity
        signal = delta_engine.analyze_delta_opportunity(market_data)
        
        if signal.get("should_enter", False):
            # Execute trade
            trade_result = delta_engine.execute_scalping_trade(signal)
            signal["trade_result"] = trade_result
        
        # Monitor existing trades
        closed_trades = delta_engine.monitor_active_trades(market_data)
        if closed_trades:
            signal["closed_trades"] = closed_trades
        
        # Add strategy status
        signal["strategy_status"] = delta_engine.get_strategy_status()
        
        return signal
        
    except Exception as e:
        logger.error(f"Error processing market signal: {e}")
        delta_engine.record_error(str(e))
        return {"error": str(e)}

if __name__ == "__main__":
    # Test the delta scalping engine
    test_market_data = {
        "symbol": "BTCUSDT",
        "price": 45000.0,
        "bid": 44995.0,
        "ask": 45005.0,
        "volume": 1000000,
        "avg_volume": 800000,
        "price_change_pct": 0.0008,
        "price_history": [44990, 44995, 45000, 45002, 45000]
    }
    
    result = asyncio.run(process_market_signal(test_market_data))
    print(f"Delta scalping result: {json.dumps(result, indent=2)}")