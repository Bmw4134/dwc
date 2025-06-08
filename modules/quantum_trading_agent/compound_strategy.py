#!/usr/bin/env python3
"""
Compound Strategy Controller - Phase 2 Trillion Kaizen GPT
Gain-compound controller for exponential growth from $100 to $500
"""

import asyncio
import logging
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import math

logger = logging.getLogger(__name__)

class CompoundGainController:
    def __init__(self):
        self.controller_name = "Compound Gain Controller v2.0"
        self.phase = "phase_2_trillion"
        
        # Compound parameters
        self.initial_capital = 100.0
        self.target_capital = 500.0
        self.compound_rate = 0.05  # 5% per successful cycle
        self.min_compound_gain = 0.02  # 2% minimum to compound
        self.max_daily_trades = 20
        
        # Risk scaling
        self.base_risk_pct = 0.10  # 10% base risk per trade
        self.max_risk_pct = 0.25   # 25% maximum risk
        self.risk_multiplier = 1.2  # Increase risk on wins
        self.risk_reduction = 0.8   # Reduce risk on losses
        
        # Position sizing evolution
        self.current_risk_pct = self.base_risk_pct
        self.consecutive_wins = 0
        self.consecutive_losses = 0
        self.daily_trade_count = 0
        self.last_reset_date = datetime.now().date()
        
        # Compound tracking
        self.compound_cycles = []
        self.total_compounded = 0.0
        self.current_cycle_start = 100.0
        self.cycle_target = 110.0  # First 10% target
        
        # Load existing state
        self.load_compound_state()
        
    def load_compound_state(self):
        """Load compound state from agent memory"""
        try:
            memory_file = "modules/quantum_trading_agent/agent_memory.json"
            with open(memory_file, 'r') as f:
                memory = json.load(f)
            
            compound_data = memory.get("compound_controller", {})
            
            self.current_risk_pct = compound_data.get("current_risk_pct", self.base_risk_pct)
            self.consecutive_wins = compound_data.get("consecutive_wins", 0)
            self.consecutive_losses = compound_data.get("consecutive_losses", 0)
            self.daily_trade_count = compound_data.get("daily_trade_count", 0)
            self.compound_cycles = compound_data.get("compound_cycles", [])
            self.total_compounded = compound_data.get("total_compounded", 0.0)
            self.current_cycle_start = compound_data.get("current_cycle_start", 100.0)
            self.cycle_target = compound_data.get("cycle_target", 110.0)
            
            # Reset daily counter if new day
            last_date = compound_data.get("last_reset_date")
            if last_date and datetime.fromisoformat(last_date).date() != datetime.now().date():
                self.daily_trade_count = 0
                self.last_reset_date = datetime.now().date()
            
            logger.info(f"Loaded compound state: Risk {self.current_risk_pct:.1%}, Cycles: {len(self.compound_cycles)}")
            
        except (FileNotFoundError, json.JSONDecodeError, KeyError):
            logger.info("No compound state found, starting fresh")
            self.save_compound_state()
    
    def save_compound_state(self):
        """Save compound state to agent memory"""
        try:
            memory_file = "modules/quantum_trading_agent/agent_memory.json"
            
            # Load existing memory
            try:
                with open(memory_file, 'r') as f:
                    memory = json.load(f)
            except FileNotFoundError:
                memory = {}
            
            # Update compound controller data
            memory["compound_controller"] = {
                "current_risk_pct": self.current_risk_pct,
                "consecutive_wins": self.consecutive_wins,
                "consecutive_losses": self.consecutive_losses,
                "daily_trade_count": self.daily_trade_count,
                "last_reset_date": self.last_reset_date.isoformat(),
                "compound_cycles": self.compound_cycles,
                "total_compounded": self.total_compounded,
                "current_cycle_start": self.current_cycle_start,
                "cycle_target": self.cycle_target,
                "last_updated": datetime.now().isoformat()
            }
            
            with open(memory_file, 'w') as f:
                json.dump(memory, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving compound state: {e}")
    
    def calculate_optimal_position_size(self, current_balance: float, signal_confidence: float) -> Dict[str, Any]:
        """Calculate optimal position size based on compound strategy"""
        try:
            # Check daily limits
            if self.daily_trade_count >= self.max_daily_trades:
                return {
                    "position_size": 0.0,
                    "reason": "daily_limit_reached",
                    "daily_count": self.daily_trade_count
                }
            
            # Base position calculation
            base_position = current_balance * self.current_risk_pct
            
            # Confidence adjustment
            confidence_multiplier = max(0.5, min(1.5, signal_confidence / 0.75))
            adjusted_position = base_position * confidence_multiplier
            
            # Balance-based scaling (increase size as we approach targets)
            progress_to_target = (current_balance - self.current_cycle_start) / (self.cycle_target - self.current_cycle_start)
            progress_multiplier = 1.0 + (progress_to_target * 0.2)  # Up to 20% increase
            
            final_position = adjusted_position * progress_multiplier
            
            # Apply maximum limits
            max_position = current_balance * self.max_risk_pct
            final_position = min(final_position, max_position)
            
            # Minimum position check
            if final_position < 1.0:  # Minimum $1 position
                return {
                    "position_size": 0.0,
                    "reason": "position_too_small",
                    "calculated_size": final_position
                }
            
            return {
                "position_size": final_position,
                "base_risk_pct": self.current_risk_pct,
                "confidence_multiplier": confidence_multiplier,
                "progress_multiplier": progress_multiplier,
                "daily_trades_remaining": self.max_daily_trades - self.daily_trade_count
            }
            
        except Exception as e:
            logger.error(f"Error calculating position size: {e}")
            return {"position_size": 0.0, "error": str(e)}
    
    def process_trade_result(self, trade_result: Dict[str, Any], current_balance: float) -> Dict[str, Any]:
        """Process trade result and update compound strategy"""
        try:
            pnl = trade_result.get("pnl", 0.0)
            trade_success = pnl > 0
            
            # Update daily counter
            self.daily_trade_count += 1
            
            # Update win/loss streaks
            if trade_success:
                self.consecutive_wins += 1
                self.consecutive_losses = 0
                
                # Increase risk on wins (compound effect)
                risk_increase = min(0.05, self.consecutive_wins * 0.01)  # Max 5% increase
                self.current_risk_pct = min(
                    self.max_risk_pct,
                    self.current_risk_pct * (1 + risk_increase)
                )
                
            else:
                self.consecutive_losses += 1
                self.consecutive_wins = 0
                
                # Reduce risk on losses (preservation)
                risk_reduction = min(0.3, self.consecutive_losses * 0.1)  # Max 30% reduction
                self.current_risk_pct = max(
                    self.base_risk_pct * 0.5,  # Never go below half base risk
                    self.current_risk_pct * (1 - risk_reduction)
                )
            
            # Check for compound cycle completion
            compound_result = self.check_compound_cycle(current_balance)
            
            # Save updated state
            self.save_compound_state()
            
            result = {
                "trade_processed": True,
                "new_balance": current_balance,
                "pnl": pnl,
                "trade_success": trade_success,
                "consecutive_wins": self.consecutive_wins,
                "consecutive_losses": self.consecutive_losses,
                "current_risk_pct": self.current_risk_pct,
                "daily_trade_count": self.daily_trade_count,
                "compound_cycle": compound_result
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing trade result: {e}")
            return {"error": str(e)}
    
    def check_compound_cycle(self, current_balance: float) -> Dict[str, Any]:
        """Check if a compound cycle is complete and calculate next target"""
        try:
            cycle_result = {
                "cycle_complete": False,
                "new_cycle_started": False
            }
            
            # Check if current cycle target is reached
            if current_balance >= self.cycle_target:
                # Calculate cycle performance
                cycle_gain = current_balance - self.current_cycle_start
                cycle_gain_pct = (cycle_gain / self.current_cycle_start) * 100
                
                # Record completed cycle
                completed_cycle = {
                    "cycle_number": len(self.compound_cycles) + 1,
                    "start_balance": self.current_cycle_start,
                    "end_balance": current_balance,
                    "target_balance": self.cycle_target,
                    "gain_amount": cycle_gain,
                    "gain_percentage": cycle_gain_pct,
                    "completion_time": datetime.now().isoformat(),
                    "trades_in_cycle": self.daily_trade_count  # Approximate
                }
                
                self.compound_cycles.append(completed_cycle)
                self.total_compounded += cycle_gain
                
                # Start new cycle
                self.current_cycle_start = current_balance
                
                # Calculate next target (progressive difficulty)
                cycle_number = len(self.compound_cycles)
                if cycle_number <= 3:
                    # First 3 cycles: 10% targets
                    next_gain_pct = 0.10
                elif cycle_number <= 6:
                    # Next 3 cycles: 8% targets
                    next_gain_pct = 0.08
                else:
                    # Later cycles: 6% targets
                    next_gain_pct = 0.06
                
                self.cycle_target = current_balance * (1 + next_gain_pct)
                
                # Reset risk to base level for new cycle
                self.current_risk_pct = self.base_risk_pct
                self.consecutive_wins = 0
                self.consecutive_losses = 0
                
                cycle_result.update({
                    "cycle_complete": True,
                    "new_cycle_started": True,
                    "completed_cycle": completed_cycle,
                    "new_target": self.cycle_target,
                    "next_gain_required": next_gain_pct * 100,
                    "total_cycles": len(self.compound_cycles),
                    "ready_for_phase_final": current_balance >= self.target_capital
                })
                
                logger.info(f"Compound cycle {cycle_number} complete! Gain: ${cycle_gain:.2f} ({cycle_gain_pct:.1f}%)")
                logger.info(f"New cycle target: ${self.cycle_target:.2f}")
                
            else:
                # Calculate progress to current target
                progress = (current_balance - self.current_cycle_start) / (self.cycle_target - self.current_cycle_start)
                cycle_result.update({
                    "current_progress": progress * 100,
                    "remaining_to_target": self.cycle_target - current_balance,
                    "current_target": self.cycle_target
                })
            
            return cycle_result
            
        except Exception as e:
            logger.error(f"Error checking compound cycle: {e}")
            return {"error": str(e)}
    
    def get_compound_performance(self) -> Dict[str, Any]:
        """Get comprehensive compound performance metrics"""
        try:
            total_cycles = len(self.compound_cycles)
            
            if total_cycles == 0:
                return {
                    "total_cycles": 0,
                    "total_compounded": 0.0,
                    "avg_cycle_gain": 0.0,
                    "compound_efficiency": 0.0,
                    "estimated_completion_time": None
                }
            
            # Calculate averages
            total_gain = sum(c["gain_amount"] for c in self.compound_cycles)
            avg_cycle_gain = total_gain / total_cycles
            avg_cycle_gain_pct = sum(c["gain_percentage"] for c in self.compound_cycles) / total_cycles
            
            # Calculate compound efficiency (actual vs theoretical)
            theoretical_balance = self.initial_capital * (1.05 ** total_cycles)  # 5% per cycle
            actual_balance = self.initial_capital + total_gain
            efficiency = (actual_balance / theoretical_balance) * 100 if theoretical_balance > 0 else 0
            
            # Estimate completion time
            remaining_amount = self.target_capital - actual_balance
            cycles_needed = max(1, math.ceil(remaining_amount / avg_cycle_gain)) if avg_cycle_gain > 0 else float('inf')
            
            # Calculate time estimates based on recent performance
            if total_cycles >= 2:
                recent_cycles = self.compound_cycles[-2:]
                recent_times = []
                for i in range(1, len(recent_cycles)):
                    prev_time = datetime.fromisoformat(recent_cycles[i-1]["completion_time"])
                    curr_time = datetime.fromisoformat(recent_cycles[i]["completion_time"])
                    cycle_duration = (curr_time - prev_time).total_seconds() / 3600  # hours
                    recent_times.append(cycle_duration)
                
                if recent_times:
                    avg_cycle_hours = sum(recent_times) / len(recent_times)
                    estimated_hours = cycles_needed * avg_cycle_hours
                    estimated_completion = datetime.now() + timedelta(hours=estimated_hours)
                else:
                    estimated_completion = None
            else:
                estimated_completion = None
            
            return {
                "total_cycles": total_cycles,
                "total_compounded": self.total_compounded,
                "avg_cycle_gain": avg_cycle_gain,
                "avg_cycle_gain_pct": avg_cycle_gain_pct,
                "compound_efficiency": efficiency,
                "cycles_to_target": cycles_needed,
                "estimated_completion": estimated_completion.isoformat() if estimated_completion else None,
                "current_cycle_progress": {
                    "start": self.current_cycle_start,
                    "target": self.cycle_target,
                    "progress_pct": 0.0  # Will be calculated by caller
                },
                "performance_trend": self.calculate_performance_trend()
            }
            
        except Exception as e:
            logger.error(f"Error calculating compound performance: {e}")
            return {"error": str(e)}
    
    def calculate_performance_trend(self) -> str:
        """Calculate if performance is improving, declining, or stable"""
        try:
            if len(self.compound_cycles) < 3:
                return "insufficient_data"
            
            recent_gains = [c["gain_percentage"] for c in self.compound_cycles[-3:]]
            
            # Simple trend analysis
            if recent_gains[-1] > recent_gains[-2] > recent_gains[-3]:
                return "improving"
            elif recent_gains[-1] < recent_gains[-2] < recent_gains[-3]:
                return "declining"
            else:
                return "stable"
                
        except Exception as e:
            logger.error(f"Error calculating performance trend: {e}")
            return "unknown"
    
    def should_pause_trading(self, current_balance: float) -> Dict[str, Any]:
        """Determine if trading should be paused based on compound strategy"""
        try:
            pause_reasons = []
            
            # Daily limit check
            if self.daily_trade_count >= self.max_daily_trades:
                pause_reasons.append("daily_limit_reached")
            
            # Consecutive loss protection
            if self.consecutive_losses >= 5:
                pause_reasons.append("excessive_losses")
            
            # Balance protection
            if current_balance <= self.initial_capital * 0.5:  # 50% drawdown
                pause_reasons.append("major_drawdown")
            
            # Target reached
            if current_balance >= self.target_capital:
                pause_reasons.append("target_reached")
            
            return {
                "should_pause": len(pause_reasons) > 0,
                "reasons": pause_reasons,
                "can_resume_conditions": {
                    "daily_reset": "New trading day starts",
                    "manual_override": "Emergency override: DWC_OVERRIDE_2025",
                    "balance_recovery": "Balance recovery above threshold"
                }
            }
            
        except Exception as e:
            logger.error(f"Error checking pause conditions: {e}")
            return {"should_pause": True, "error": str(e)}
    
    def get_compound_status(self) -> Dict[str, Any]:
        """Get current compound controller status"""
        return {
            "controller": self.controller_name,
            "phase": self.phase,
            "current_risk_pct": self.current_risk_pct,
            "consecutive_wins": self.consecutive_wins,
            "consecutive_losses": self.consecutive_losses,
            "daily_trade_count": self.daily_trade_count,
            "max_daily_trades": self.max_daily_trades,
            "compound_cycles_completed": len(self.compound_cycles),
            "total_compounded": self.total_compounded,
            "current_cycle": {
                "start": self.current_cycle_start,
                "target": self.cycle_target,
                "gain_required": self.cycle_target - self.current_cycle_start
            },
            "risk_management": {
                "base_risk": self.base_risk_pct,
                "current_risk": self.current_risk_pct,
                "max_risk": self.max_risk_pct
            }
        }

# Global compound controller instance
compound_controller = CompoundGainController()

async def optimize_compound_strategy(trade_signal: Dict[str, Any], current_balance: float) -> Dict[str, Any]:
    """Main entry point for compound strategy optimization"""
    try:
        # Check if trading should be paused
        pause_check = compound_controller.should_pause_trading(current_balance)
        if pause_check["should_pause"]:
            return {
                "action": "pause_trading",
                "pause_reasons": pause_check["reasons"],
                "compound_status": compound_controller.get_compound_status()
            }
        
        # Calculate optimal position size
        signal_confidence = trade_signal.get("confidence", 0.75)
        position_calc = compound_controller.calculate_optimal_position_size(current_balance, signal_confidence)
        
        if position_calc["position_size"] <= 0:
            return {
                "action": "skip_trade",
                "reason": position_calc.get("reason", "invalid_position"),
                "compound_status": compound_controller.get_compound_status()
            }
        
        # Update trade signal with compound-optimized position
        optimized_signal = trade_signal.copy()
        optimized_signal.update({
            "compound_optimized": True,
            "original_position_size": trade_signal.get("position_size", 0),
            "optimized_position_size": position_calc["position_size"],
            "compound_metrics": position_calc
        })
        
        return {
            "action": "execute_trade",
            "optimized_signal": optimized_signal,
            "compound_status": compound_controller.get_compound_status()
        }
        
    except Exception as e:
        logger.error(f"Error optimizing compound strategy: {e}")
        return {"action": "pause_trading", "error": str(e)}

if __name__ == "__main__":
    # Test compound controller
    test_balance = 125.0
    test_signal = {
        "symbol": "BTCUSDT",
        "confidence": 0.8,
        "position_size": 10.0
    }
    
    result = asyncio.run(optimize_compound_strategy(test_signal, test_balance))
    print(f"Compound optimization result: {json.dumps(result, indent=2)}")