#!/usr/bin/env python3
"""
Advanced Quantum Trading System with Bidirectional Trades and Range Scalping
Enhanced with TA-Lib indicators, VWAP/RSI divergence, and quantum safe loops
"""
import os
import json
import time
import asyncio
import logging
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
import traceback

# Technical Analysis Libraries
try:
    import pandas_ta as ta
    import talib
    HAS_TA_LIBS = True
except ImportError:
    HAS_TA_LIBS = False
    print("Warning: pandas_ta and/or TA-Lib not available. Install with: pip install pandas_ta TA-Lib")

@dataclass
class TradeSignal:
    symbol: str
    direction: str  # 'LONG', 'SHORT', 'CLOSE_LONG', 'CLOSE_SHORT'
    strength: float  # 0.0 to 1.0
    entry_price: float
    stop_loss: float
    take_profit: float
    timeframe: str
    strategy: str
    confidence: float
    timestamp: datetime

@dataclass
class PositionInfo:
    symbol: str
    side: str  # 'LONG' or 'SHORT'
    size: float
    entry_price: float
    current_price: float
    unrealized_pnl: float
    realized_pnl: float
    timestamp: datetime

class QuantumSafeLoop:
    """Quantum safe loop that adapts strategy weights from recent performance"""
    
    def __init__(self):
        self.strategy_weights = {
            'trend_following': 0.25,
            'mean_reversion': 0.25,
            'momentum': 0.25,
            'range_scalping': 0.25
        }
        self.performance_history = []
        self.adaptation_threshold = 0.1
        self.min_trades_for_adaptation = 10
        
    def update_performance(self, strategy: str, pnl: float):
        """Update performance tracking for strategy adaptation"""
        self.performance_history.append({
            'strategy': strategy,
            'pnl': pnl,
            'timestamp': datetime.now()
        })
        
        # Keep only last 100 trades for adaptation
        if len(self.performance_history) > 100:
            self.performance_history = self.performance_history[-100:]
            
        self._adapt_weights()
        
    def _adapt_weights(self):
        """Adapt strategy weights based on recent performance"""
        if len(self.performance_history) < self.min_trades_for_adaptation:
            return
            
        # Calculate strategy performance over last period
        strategy_performance = {}
        for record in self.performance_history[-self.min_trades_for_adaptation:]:
            strategy = record['strategy']
            if strategy not in strategy_performance:
                strategy_performance[strategy] = []
            strategy_performance[strategy].append(record['pnl'])
            
        # Calculate average performance per strategy
        avg_performance = {}
        for strategy, pnls in strategy_performance.items():
            avg_performance[strategy] = np.mean(pnls) if pnls else 0
            
        # Adapt weights towards better performing strategies
        if avg_performance:
            max_perf = max(avg_performance.values())
            min_perf = min(avg_performance.values())
            
            if max_perf - min_perf > self.adaptation_threshold:
                # Normalize performance to weights
                total_positive_perf = sum(max(0, perf) for perf in avg_performance.values())
                
                if total_positive_perf > 0:
                    for strategy in self.strategy_weights:
                        if strategy in avg_performance:
                            normalized_perf = max(0, avg_performance[strategy]) / total_positive_perf
                            # Gradually adjust weights (20% adaptation rate)
                            self.strategy_weights[strategy] = (
                                0.8 * self.strategy_weights[strategy] + 
                                0.2 * normalized_perf
                            )
                            
                # Ensure weights sum to 1
                total_weight = sum(self.strategy_weights.values())
                if total_weight > 0:
                    for strategy in self.strategy_weights:
                        self.strategy_weights[strategy] /= total_weight

class AdvancedQuantumTrader:
    def __init__(self):
        self.positions = {}
        self.trade_history = []
        self.quantum_safe_loop = QuantumSafeLoop()
        
        # Risk Management Settings
        self.max_daily_loss = float(os.getenv('MAX_DAILY_LOSS', 100.0))
        self.max_position_size = float(os.getenv('MAX_POSITION_SIZE', 0.1))
        self.win_streak_limit = int(os.getenv('WIN_STREAK_LIMIT', 5))
        self.risk_floor = float(os.getenv('RISK_FLOOR', 50.0))
        
        # Trading State
        self.daily_pnl = 0.0
        self.current_win_streak = 0
        self.trading_enabled = True
        self.preview_mode = True  # Always start in preview mode
        
        # Initialize logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Load agent memory markers
        self.load_agent_memory()
        
    def load_agent_memory(self):
        """Load agent memory markers for continuous learning"""
        try:
            # Load view confidence scores
            with open('modules/quantum_trading_agent/view_confidence_score.json', 'r') as f:
                self.view_confidence = json.load(f)
        except FileNotFoundError:
            self.view_confidence = {
                'chart_view': 0.5,
                'heatmap_view': 0.5,
                'vision_view': 0.5,
                'news_view': 0.5
            }
            
        try:
            # Load last view trigger action
            with open('modules/quantum_trading_agent/last_view_trigger_action.json', 'r') as f:
                self.last_trigger = json.load(f)
        except FileNotFoundError:
            self.last_trigger = {
                'timestamp': datetime.now().isoformat(),
                'action': 'INIT',
                'confidence': 0.5
            }
            
    def save_agent_memory(self):
        """Save agent memory markers for continuous learning"""
        # Save view confidence scores
        with open('modules/quantum_trading_agent/view_confidence_score.json', 'w') as f:
            json.dump(self.view_confidence, f, indent=2)
            
        # Save last trigger action
        with open('modules/quantum_trading_agent/last_view_trigger_action.json', 'w') as f:
            json.dump(self.last_trigger, f, indent=2)
            
    def calculate_technical_indicators(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate comprehensive technical indicators using pandas_ta and TA-Lib"""
        if not HAS_TA_LIBS:
            # Fallback basic calculations
            return self._calculate_basic_indicators(df)
            
        indicators = {}
        
        try:
            # VWAP (Volume Weighted Average Price)
            if 'volume' in df.columns:
                indicators['vwap'] = ta.vwap(df['high'], df['low'], df['close'], df['volume'])
            
            # RSI
            indicators['rsi'] = ta.rsi(df['close'], length=14)
            
            # Bollinger Bands
            bb = ta.bbands(df['close'], length=20, std=2)
            if bb is not None:
                indicators['bb_upper'] = bb[f'BBU_20_2.0']
                indicators['bb_middle'] = bb[f'BBM_20_2.0']
                indicators['bb_lower'] = bb[f'BBL_20_2.0']
            
            # MACD
            macd = ta.macd(df['close'])
            if macd is not None:
                indicators['macd'] = macd['MACD_12_26_9']
                indicators['macd_signal'] = macd['MACDs_12_26_9']
                indicators['macd_histogram'] = macd['MACDh_12_26_9']
            
            # Stochastic Oscillator
            stoch = ta.stoch(df['high'], df['low'], df['close'])
            if stoch is not None:
                indicators['stoch_k'] = stoch['STOCHk_14_3_3']
                indicators['stoch_d'] = stoch['STOCHd_14_3_3']
            
            # Average True Range (ATR)
            indicators['atr'] = ta.atr(df['high'], df['low'], df['close'], length=14)
            
            # Volume indicators
            if 'volume' in df.columns:
                indicators['volume_sma'] = ta.sma(df['volume'], length=20)
                indicators['volume_ratio'] = df['volume'] / indicators['volume_sma']
            
        except Exception as e:
            self.logger.error(f"Error calculating technical indicators: {e}")
            return self._calculate_basic_indicators(df)
            
        return indicators
        
    def _calculate_basic_indicators(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Fallback basic indicator calculations"""
        indicators = {}
        
        # Simple Moving Averages
        indicators['sma_20'] = df['close'].rolling(20).mean()
        indicators['sma_50'] = df['close'].rolling(50).mean()
        
        # Basic RSI calculation
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs = gain / loss
        indicators['rsi'] = 100 - (100 / (1 + rs))
        
        # Basic Bollinger Bands
        bb_middle = df['close'].rolling(20).mean()
        bb_std = df['close'].rolling(20).std()
        indicators['bb_upper'] = bb_middle + (bb_std * 2)
        indicators['bb_middle'] = bb_middle
        indicators['bb_lower'] = bb_middle - (bb_std * 2)
        
        return indicators
        
    def detect_rsi_divergence(self, df: pd.DataFrame, rsi: pd.Series) -> Dict[str, bool]:
        """Detect RSI divergence patterns"""
        divergence = {'bullish': False, 'bearish': False}
        
        if len(df) < 50:
            return divergence
            
        # Look for divergence in last 20 periods
        recent_data = df.tail(20)
        recent_rsi = rsi.tail(20)
        
        if len(recent_data) < 10:
            return divergence
            
        # Find price peaks and troughs
        price_highs = []
        price_lows = []
        rsi_highs = []
        rsi_lows = []
        
        for i in range(2, len(recent_data) - 2):
            # Price peaks
            if (recent_data.iloc[i]['high'] > recent_data.iloc[i-1]['high'] and 
                recent_data.iloc[i]['high'] > recent_data.iloc[i+1]['high']):
                price_highs.append((i, recent_data.iloc[i]['high']))
                rsi_highs.append((i, recent_rsi.iloc[i]))
                
            # Price troughs
            if (recent_data.iloc[i]['low'] < recent_data.iloc[i-1]['low'] and 
                recent_data.iloc[i]['low'] < recent_data.iloc[i+1]['low']):
                price_lows.append((i, recent_data.iloc[i]['low']))
                rsi_lows.append((i, recent_rsi.iloc[i]))
                
        # Check for bearish divergence (price higher highs, RSI lower highs)
        if len(price_highs) >= 2 and len(rsi_highs) >= 2:
            if (price_highs[-1][1] > price_highs[-2][1] and 
                rsi_highs[-1][1] < rsi_highs[-2][1]):
                divergence['bearish'] = True
                
        # Check for bullish divergence (price lower lows, RSI higher lows)
        if len(price_lows) >= 2 and len(rsi_lows) >= 2:
            if (price_lows[-1][1] < price_lows[-2][1] and 
                rsi_lows[-1][1] > rsi_lows[-2][1]):
                divergence['bullish'] = True
                
        return divergence
        
    def generate_trading_signals(self, df: pd.DataFrame) -> List[TradeSignal]:
        """Generate comprehensive trading signals"""
        signals = []
        
        if len(df) < 50:
            return signals
            
        indicators = self.calculate_technical_indicators(df)
        current_price = df['close'].iloc[-1]
        
        # Strategy 1: Trend Following
        trend_signal = self._trend_following_strategy(df, indicators, current_price)
        if trend_signal:
            signals.append(trend_signal)
            
        # Strategy 2: Mean Reversion
        mean_reversion_signal = self._mean_reversion_strategy(df, indicators, current_price)
        if mean_reversion_signal:
            signals.append(mean_reversion_signal)
            
        # Strategy 3: Momentum Strategy
        momentum_signal = self._momentum_strategy(df, indicators, current_price)
        if momentum_signal:
            signals.append(momentum_signal)
            
        # Strategy 4: Range Scalping (New)
        range_signal = self._range_scalping_strategy(df, indicators, current_price)
        if range_signal:
            signals.append(range_signal)
            
        return signals
        
    def _trend_following_strategy(self, df: pd.DataFrame, indicators: Dict, current_price: float) -> Optional[TradeSignal]:
        """Trend following strategy using moving averages and MACD"""
        if 'sma_20' not in indicators or 'sma_50' not in indicators:
            return None
            
        sma_20 = indicators['sma_20'].iloc[-1]
        sma_50 = indicators['sma_50'].iloc[-1]
        
        # Long signal: Price above both SMAs and SMA20 > SMA50
        if current_price > sma_20 > sma_50:
            atr = indicators.get('atr', pd.Series([current_price * 0.02])).iloc[-1]
            
            return TradeSignal(
                symbol="BTC/USDT",
                direction="LONG",
                strength=self.quantum_safe_loop.strategy_weights['trend_following'],
                entry_price=current_price,
                stop_loss=current_price - (2 * atr),
                take_profit=current_price + (3 * atr),
                timeframe="1h",
                strategy="trend_following",
                confidence=0.7,
                timestamp=datetime.now()
            )
            
        # Short signal: Price below both SMAs and SMA20 < SMA50
        elif current_price < sma_20 < sma_50:
            atr = indicators.get('atr', pd.Series([current_price * 0.02])).iloc[-1]
            
            return TradeSignal(
                symbol="BTC/USDT",
                direction="SHORT",
                strength=self.quantum_safe_loop.strategy_weights['trend_following'],
                entry_price=current_price,
                stop_loss=current_price + (2 * atr),
                take_profit=current_price - (3 * atr),
                timeframe="1h",
                strategy="trend_following",
                confidence=0.7,
                timestamp=datetime.now()
            )
            
        return None
        
    def _mean_reversion_strategy(self, df: pd.DataFrame, indicators: Dict, current_price: float) -> Optional[TradeSignal]:
        """Mean reversion strategy using Bollinger Bands"""
        if 'bb_upper' not in indicators or 'bb_lower' not in indicators:
            return None
            
        bb_upper = indicators['bb_upper'].iloc[-1]
        bb_lower = indicators['bb_lower'].iloc[-1]
        bb_middle = indicators['bb_middle'].iloc[-1]
        
        # Long signal: Price touches lower Bollinger Band
        if current_price <= bb_lower:
            return TradeSignal(
                symbol="BTC/USDT",
                direction="LONG",
                strength=self.quantum_safe_loop.strategy_weights['mean_reversion'],
                entry_price=current_price,
                stop_loss=current_price * 0.98,
                take_profit=bb_middle,
                timeframe="1h",
                strategy="mean_reversion",
                confidence=0.65,
                timestamp=datetime.now()
            )
            
        # Short signal: Price touches upper Bollinger Band
        elif current_price >= bb_upper:
            return TradeSignal(
                symbol="BTC/USDT",
                direction="SHORT",
                strength=self.quantum_safe_loop.strategy_weights['mean_reversion'],
                entry_price=current_price,
                stop_loss=current_price * 1.02,
                take_profit=bb_middle,
                timeframe="1h",
                strategy="mean_reversion",
                confidence=0.65,
                timestamp=datetime.now()
            )
            
        return None
        
    def _momentum_strategy(self, df: pd.DataFrame, indicators: Dict, current_price: float) -> Optional[TradeSignal]:
        """Momentum strategy using RSI and divergence"""
        if 'rsi' not in indicators:
            return None
            
        rsi = indicators['rsi']
        current_rsi = rsi.iloc[-1]
        
        # Check for RSI divergence
        divergence = self.detect_rsi_divergence(df, rsi)
        
        # Long signal: RSI oversold + bullish divergence
        if current_rsi < 30 and divergence['bullish']:
            atr = indicators.get('atr', pd.Series([current_price * 0.02])).iloc[-1]
            
            return TradeSignal(
                symbol="BTC/USDT",
                direction="LONG",
                strength=self.quantum_safe_loop.strategy_weights['momentum'],
                entry_price=current_price,
                stop_loss=current_price - (1.5 * atr),
                take_profit=current_price + (2.5 * atr),
                timeframe="1h",
                strategy="momentum",
                confidence=0.8,
                timestamp=datetime.now()
            )
            
        # Short signal: RSI overbought + bearish divergence
        elif current_rsi > 70 and divergence['bearish']:
            atr = indicators.get('atr', pd.Series([current_price * 0.02])).iloc[-1]
            
            return TradeSignal(
                symbol="BTC/USDT",
                direction="SHORT",
                strength=self.quantum_safe_loop.strategy_weights['momentum'],
                entry_price=current_price,
                stop_loss=current_price + (1.5 * atr),
                take_profit=current_price - (2.5 * atr),
                timeframe="1h",
                strategy="momentum",
                confidence=0.8,
                timestamp=datetime.now()
            )
            
        return None
        
    def _range_scalping_strategy(self, df: pd.DataFrame, indicators: Dict, current_price: float) -> Optional[TradeSignal]:
        """Range scalping strategy using VWAP and volume analysis"""
        if 'vwap' not in indicators:
            return None
            
        vwap = indicators['vwap'].iloc[-1]
        
        # Check if we're in a sideways market (price oscillating around VWAP)
        recent_prices = df['close'].tail(20)
        price_volatility = recent_prices.std() / recent_prices.mean()
        
        # Only trade in low volatility (sideways) markets
        if price_volatility > 0.03:  # 3% volatility threshold
            return None
            
        # Volume confirmation
        volume_ratio = indicators.get('volume_ratio', pd.Series([1.0])).iloc[-1]
        
        # Long signal: Price below VWAP with volume confirmation
        if current_price < vwap * 0.999 and volume_ratio > 1.2:
            return TradeSignal(
                symbol="BTC/USDT",
                direction="LONG",
                strength=self.quantum_safe_loop.strategy_weights['range_scalping'],
                entry_price=current_price,
                stop_loss=current_price * 0.995,
                take_profit=vwap * 1.001,
                timeframe="15m",
                strategy="range_scalping",
                confidence=0.6,
                timestamp=datetime.now()
            )
            
        # Short signal: Price above VWAP with volume confirmation
        elif current_price > vwap * 1.001 and volume_ratio > 1.2:
            return TradeSignal(
                symbol="BTC/USDT",
                direction="SHORT",
                strength=self.quantum_safe_loop.strategy_weights['range_scalping'],
                entry_price=current_price,
                stop_loss=current_price * 1.005,
                take_profit=vwap * 0.999,
                timeframe="15m",
                strategy="range_scalping",
                confidence=0.6,
                timestamp=datetime.now()
            )
            
        return None
        
    def check_risk_management(self) -> bool:
        """Check all risk management conditions"""
        # Check daily loss limit
        if self.daily_pnl <= -self.max_daily_loss:
            self.logger.warning(f"Daily loss limit reached: {self.daily_pnl}")
            return False
            
        # Check win streak limit (prevent overconfidence)
        if self.current_win_streak >= self.win_streak_limit:
            self.logger.warning(f"Win streak limit reached: {self.current_win_streak}")
            return False
            
        # Check risk floor (minimum account balance)
        if self.daily_pnl <= -self.risk_floor:
            self.logger.warning(f"Risk floor breached: {self.daily_pnl}")
            return False
            
        return True
        
    def preview_trade_intent(self, signal: TradeSignal) -> Dict[str, Any]:
        """Preview trade intent before execution (safety requirement)"""
        intent = {
            'action': f"{signal.direction} {signal.symbol}",
            'entry_price': signal.entry_price,
            'stop_loss': signal.stop_loss,
            'take_profit': signal.take_profit,
            'risk_amount': abs(signal.entry_price - signal.stop_loss),
            'reward_amount': abs(signal.take_profit - signal.entry_price),
            'risk_reward_ratio': abs(signal.take_profit - signal.entry_price) / abs(signal.entry_price - signal.stop_loss),
            'strategy': signal.strategy,
            'confidence': signal.confidence,
            'preview_mode': self.preview_mode,
            'timestamp': signal.timestamp.isoformat()
        }
        
        self.logger.info(f"TRADE PREVIEW: {intent}")
        return intent
        
    async def execute_trade(self, signal: TradeSignal) -> bool:
        """Execute trade with full safety checks"""
        # Always preview first
        intent = self.preview_trade_intent(signal)
        
        # Safety checks
        if not self.trading_enabled:
            self.logger.warning("Trading disabled")
            return False
            
        if not self.check_risk_management():
            self.logger.warning("Risk management check failed")
            return False
            
        # In preview mode, just log and return
        if self.preview_mode:
            self.logger.info(f"PREVIEW MODE: Would execute {intent['action']}")
            return True
            
        # Execute actual trade (when preview mode is disabled)
        try:
            # Here you would integrate with actual trading API
            # For safety, this template only logs the trade
            self.logger.info(f"EXECUTING TRADE: {intent}")
            
            # Update positions tracking
            position = PositionInfo(
                symbol=signal.symbol,
                side=signal.direction,
                size=self.max_position_size,
                entry_price=signal.entry_price,
                current_price=signal.entry_price,
                unrealized_pnl=0.0,
                realized_pnl=0.0,
                timestamp=datetime.now()
            )
            
            self.positions[f"{signal.symbol}_{signal.direction}"] = position
            
            # Update agent memory
            self.last_trigger = {
                'timestamp': datetime.now().isoformat(),
                'action': signal.direction,
                'confidence': signal.confidence
            }
            self.save_agent_memory()
            
            return True
            
        except Exception as e:
            self.logger.error(f"Trade execution failed: {e}")
            return False
            
    def generate_live_pnl_data(self) -> Dict[str, Any]:
        """Generate live P&L data for visual charts"""
        total_unrealized = sum(pos.unrealized_pnl for pos in self.positions.values())
        total_realized = sum(pos.realized_pnl for pos in self.positions.values())
        
        return {
            'timestamp': datetime.now().isoformat(),
            'daily_pnl': self.daily_pnl,
            'unrealized_pnl': total_unrealized,
            'realized_pnl': total_realized,
            'total_pnl': self.daily_pnl + total_unrealized,
            'positions_count': len(self.positions),
            'win_streak': self.current_win_streak,
            'strategy_weights': self.quantum_safe_loop.strategy_weights.copy(),
            'trading_enabled': self.trading_enabled,
            'preview_mode': self.preview_mode
        }
        
    def get_bot_behavior_metrics(self) -> Dict[str, Any]:
        """Get bot behavior metrics for visualization"""
        return {
            'total_trades': len(self.trade_history),
            'strategies_used': list(self.quantum_safe_loop.strategy_weights.keys()),
            'current_strategy_weights': self.quantum_safe_loop.strategy_weights.copy(),
            'risk_metrics': {
                'max_daily_loss': self.max_daily_loss,
                'current_daily_pnl': self.daily_pnl,
                'risk_floor': self.risk_floor,
                'win_streak_limit': self.win_streak_limit,
                'current_win_streak': self.current_win_streak
            },
            'safety_status': {
                'trading_enabled': self.trading_enabled,
                'preview_mode': self.preview_mode,
                'risk_check_passed': self.check_risk_management()
            },
            'agent_memory': {
                'view_confidence': self.view_confidence.copy(),
                'last_trigger': self.last_trigger.copy()
            }
        }

# Global instance for API access
quantum_trader = AdvancedQuantumTrader()

if __name__ == "__main__":
    # Example usage
    print("Advanced Quantum Trading System Initialized")
    print(f"Preview Mode: {quantum_trader.preview_mode}")
    print(f"Strategy Weights: {quantum_trader.quantum_safe_loop.strategy_weights}")