#!/usr/bin/env python3
"""
TradingView Signal Parser - Multi-Platform Trading Compatibility
Phase 1.000000001 - Alpaca Integration Module
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import re

logger = logging.getLogger(__name__)

class TradingViewSignalParser:
    def __init__(self):
        self.supported_actions = ['BUY', 'SELL', 'CLOSE', 'LONG', 'SHORT']
        self.supported_symbols = ['BTCUSD', 'ETHUSD', 'AAPL', 'TSLA', 'SPY', 'QQQ']
        
    def parse_webhook_signal(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse incoming TradingView webhook signal"""
        try:
            # Extract standard TradingView webhook format
            parsed_signal = {
                "timestamp": datetime.now().isoformat(),
                "source": "tradingview",
                "platform": "alpaca",
                "raw_data": webhook_data
            }
            
            # Parse action
            action = self.extract_action(webhook_data)
            if action:
                parsed_signal["action"] = action
            else:
                logger.warning("No valid action found in webhook")
                return {"error": "Invalid action"}
            
            # Parse symbol
            symbol = self.extract_symbol(webhook_data)
            if symbol:
                parsed_signal["symbol"] = symbol
            else:
                logger.warning("No valid symbol found in webhook")
                return {"error": "Invalid symbol"}
            
            # Parse quantity/position size
            quantity = self.extract_quantity(webhook_data)
            parsed_signal["quantity"] = quantity
            
            # Parse price levels
            prices = self.extract_price_levels(webhook_data)
            parsed_signal.update(prices)
            
            # Parse confidence/score
            confidence = self.extract_confidence(webhook_data)
            parsed_signal["confidence"] = confidence
            
            # Parse additional metadata
            metadata = self.extract_metadata(webhook_data)
            parsed_signal["metadata"] = metadata
            
            # Validate parsed signal
            if self.validate_signal(parsed_signal):
                return parsed_signal
            else:
                return {"error": "Signal validation failed"}
                
        except Exception as e:
            logger.error(f"Error parsing webhook signal: {e}")
            return {"error": f"Parse error: {str(e)}"}
    
    def extract_action(self, data: Dict[str, Any]) -> Optional[str]:
        """Extract trading action from webhook data"""
        # Check direct action field
        if "action" in data:
            action = str(data["action"]).upper()
            if action in self.supported_actions:
                return action
        
        # Check message field for action keywords
        if "message" in data:
            message = str(data["message"]).upper()
            for action in self.supported_actions:
                if action in message:
                    return action
        
        # Check alert field
        if "alert" in data:
            alert = str(data["alert"]).upper()
            for action in self.supported_actions:
                if action in alert:
                    return action
        
        # Parse from strategy field
        if "strategy" in data:
            strategy = str(data["strategy"]).upper()
            if "BUY" in strategy or "LONG" in strategy:
                return "BUY"
            elif "SELL" in strategy or "SHORT" in strategy:
                return "SELL"
        
        return None
    
    def extract_symbol(self, data: Dict[str, Any]) -> Optional[str]:
        """Extract trading symbol from webhook data"""
        # Check direct symbol field
        if "symbol" in data:
            symbol = str(data["symbol"]).upper()
            # Clean symbol format
            symbol = symbol.replace(":", "").replace("-", "")
            if symbol in self.supported_symbols:
                return symbol
        
        # Check ticker field
        if "ticker" in data:
            ticker = str(data["ticker"]).upper()
            ticker = ticker.replace(":", "").replace("-", "")
            if ticker in self.supported_symbols:
                return ticker
        
        # Parse from message
        if "message" in data:
            message = str(data["message"]).upper()
            for symbol in self.supported_symbols:
                if symbol in message:
                    return symbol
        
        # Try to extract from any field containing symbol-like patterns
        for key, value in data.items():
            if isinstance(value, str):
                value_upper = value.upper()
                for symbol in self.supported_symbols:
                    if symbol in value_upper:
                        return symbol
        
        return None
    
    def extract_quantity(self, data: Dict[str, Any]) -> float:
        """Extract quantity/position size from webhook data"""
        # Check direct quantity fields
        for field in ["quantity", "qty", "size", "amount", "shares"]:
            if field in data:
                try:
                    return float(data[field])
                except (ValueError, TypeError):
                    continue
        
        # Check for percentage-based sizing
        if "percent" in data or "percentage" in data:
            try:
                percent = float(data.get("percent", data.get("percentage", 100)))
                return percent / 100.0  # Convert to decimal
            except (ValueError, TypeError):
                pass
        
        # Default to 1 share/unit
        return 1.0
    
    def extract_price_levels(self, data: Dict[str, Any]) -> Dict[str, Optional[float]]:
        """Extract price levels (entry, stop loss, take profit)"""
        prices = {
            "entry_price": None,
            "stop_loss": None,
            "take_profit": None
        }
        
        # Entry price
        for field in ["price", "entry", "entry_price", "limit"]:
            if field in data:
                try:
                    prices["entry_price"] = float(data[field])
                    break
                except (ValueError, TypeError):
                    continue
        
        # Stop loss
        for field in ["stop_loss", "sl", "stop", "stoploss"]:
            if field in data:
                try:
                    prices["stop_loss"] = float(data[field])
                    break
                except (ValueError, TypeError):
                    continue
        
        # Take profit
        for field in ["take_profit", "tp", "target", "takeprofit"]:
            if field in data:
                try:
                    prices["take_profit"] = float(data[field])
                    break
                except (ValueError, TypeError):
                    continue
        
        return prices
    
    def extract_confidence(self, data: Dict[str, Any]) -> float:
        """Extract confidence/score from webhook data"""
        # Check direct confidence fields
        for field in ["confidence", "score", "strength", "probability"]:
            if field in data:
                try:
                    confidence = float(data[field])
                    # Normalize to 0-1 range if needed
                    if confidence > 1.0:
                        confidence = confidence / 100.0
                    return max(0.0, min(1.0, confidence))
                except (ValueError, TypeError):
                    continue
        
        # Parse confidence from message using regex
        if "message" in data:
            message = str(data["message"])
            # Look for percentage patterns
            percentage_match = re.search(r'(\d+(?:\.\d+)?)%', message)
            if percentage_match:
                try:
                    confidence = float(percentage_match.group(1)) / 100.0
                    return max(0.0, min(1.0, confidence))
                except ValueError:
                    pass
            
            # Look for score patterns
            score_match = re.search(r'score[:\s]+(\d+(?:\.\d+)?)', message, re.IGNORECASE)
            if score_match:
                try:
                    score = float(score_match.group(1))
                    if score > 1.0:
                        score = score / 100.0
                    return max(0.0, min(1.0, score))
                except ValueError:
                    pass
        
        # Default confidence based on action type
        return 0.75
    
    def extract_metadata(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract additional metadata from webhook"""
        metadata = {}
        
        # Time-related fields
        for field in ["time", "timestamp", "datetime"]:
            if field in data:
                metadata[field] = data[field]
        
        # Strategy information
        for field in ["strategy", "indicator", "timeframe", "interval"]:
            if field in data:
                metadata[field] = data[field]
        
        # Technical indicators
        for field in ["rsi", "macd", "ema", "sma", "bollinger", "volume"]:
            if field in data:
                try:
                    metadata[field] = float(data[field])
                except (ValueError, TypeError):
                    metadata[field] = data[field]
        
        # Market conditions
        for field in ["trend", "volatility", "momentum"]:
            if field in data:
                metadata[field] = data[field]
        
        return metadata
    
    def validate_signal(self, signal: Dict[str, Any]) -> bool:
        """Validate parsed signal completeness and correctness"""
        try:
            # Required fields
            required_fields = ["action", "symbol", "timestamp", "source"]
            for field in required_fields:
                if field not in signal or signal[field] is None:
                    logger.warning(f"Missing required field: {field}")
                    return False
            
            # Validate action
            if signal["action"] not in self.supported_actions:
                logger.warning(f"Unsupported action: {signal['action']}")
                return False
            
            # Validate symbol
            if signal["symbol"] not in self.supported_symbols:
                logger.warning(f"Unsupported symbol: {signal['symbol']}")
                return False
            
            # Validate quantity
            quantity = signal.get("quantity", 0)
            if not isinstance(quantity, (int, float)) or quantity <= 0:
                logger.warning(f"Invalid quantity: {quantity}")
                return False
            
            # Validate confidence
            confidence = signal.get("confidence", 0)
            if not isinstance(confidence, (int, float)) or not (0 <= confidence <= 1):
                logger.warning(f"Invalid confidence: {confidence}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating signal: {e}")
            return False
    
    def format_for_alpaca(self, signal: Dict[str, Any]) -> Dict[str, Any]:
        """Format parsed signal for Alpaca API"""
        try:
            alpaca_order = {
                "symbol": signal["symbol"],
                "qty": signal["quantity"],
                "side": "buy" if signal["action"] in ["BUY", "LONG"] else "sell",
                "type": "market",  # Default to market order
                "time_in_force": "gtc",  # Good till canceled
                "metadata": {
                    "source": "tradingview_webhook",
                    "confidence": signal.get("confidence", 0.75),
                    "timestamp": signal["timestamp"]
                }
            }
            
            # Add price levels if available
            if signal.get("entry_price"):
                alpaca_order["type"] = "limit"
                alpaca_order["limit_price"] = signal["entry_price"]
            
            # Add stop loss
            if signal.get("stop_loss"):
                alpaca_order["stop_loss"] = {
                    "stop_price": signal["stop_loss"]
                }
            
            # Add take profit
            if signal.get("take_profit"):
                alpaca_order["take_profit"] = {
                    "limit_price": signal["take_profit"]
                }
            
            return alpaca_order
            
        except Exception as e:
            logger.error(f"Error formatting for Alpaca: {e}")
            return {}
    
    def create_confidence_rating(self, signal: Dict[str, Any]) -> Dict[str, Any]:
        """Create comprehensive confidence rating for signal"""
        try:
            base_confidence = signal.get("confidence", 0.75)
            
            # Analyze signal completeness
            completeness_score = 0.0
            if signal.get("entry_price"):
                completeness_score += 0.2
            if signal.get("stop_loss"):
                completeness_score += 0.3
            if signal.get("take_profit"):
                completeness_score += 0.2
            if signal.get("metadata"):
                completeness_score += 0.1
            if len(signal.get("metadata", {})) > 3:
                completeness_score += 0.2
            
            # Analyze metadata quality
            metadata_score = 0.0
            metadata = signal.get("metadata", {})
            if "strategy" in metadata:
                metadata_score += 0.3
            if any(indicator in metadata for indicator in ["rsi", "macd", "ema"]):
                metadata_score += 0.4
            if "timeframe" in metadata:
                metadata_score += 0.3
            
            # Calculate final confidence
            final_confidence = (
                base_confidence * 0.5 +
                completeness_score * 0.3 +
                metadata_score * 0.2
            )
            
            # Normalize to 0-1 range
            final_confidence = max(0.0, min(1.0, final_confidence))
            
            confidence_rating = {
                "overall_confidence": final_confidence,
                "base_confidence": base_confidence,
                "completeness_score": completeness_score,
                "metadata_score": metadata_score,
                "rating_level": self.get_confidence_level(final_confidence),
                "recommendation": "EXECUTE" if final_confidence >= 0.85 else "REVIEW" if final_confidence >= 0.70 else "REJECT"
            }
            
            return confidence_rating
            
        except Exception as e:
            logger.error(f"Error creating confidence rating: {e}")
            return {"overall_confidence": 0.0, "recommendation": "REJECT"}
    
    def get_confidence_level(self, confidence: float) -> str:
        """Get descriptive confidence level"""
        if confidence >= 0.9:
            return "VERY_HIGH"
        elif confidence >= 0.8:
            return "HIGH"
        elif confidence >= 0.7:
            return "MEDIUM"
        elif confidence >= 0.5:
            return "LOW"
        else:
            return "VERY_LOW"

# Global parser instance
signal_parser = TradingViewSignalParser()

def parse_tradingview_webhook(webhook_data: Dict[str, Any]) -> Dict[str, Any]:
    """Main function to parse TradingView webhook"""
    return signal_parser.parse_webhook_signal(webhook_data)

def test_parser():
    """Test the signal parser with sample data"""
    test_webhook = {
        "message": "BUY BTCUSD at 45000 with 85% confidence",
        "action": "BUY",
        "symbol": "BTCUSD",
        "price": 45000.0,
        "stop_loss": 44000.0,
        "take_profit": 47000.0,
        "confidence": 0.85,
        "strategy": "Quantum Momentum",
        "timeframe": "1H",
        "rsi": 65.5,
        "macd": 0.025
    }
    
    parsed = signal_parser.parse_webhook_signal(test_webhook)
    print(f"Parsed signal: {json.dumps(parsed, indent=2)}")
    
    if parsed and "error" not in parsed:
        alpaca_format = signal_parser.format_for_alpaca(parsed)
        print(f"Alpaca format: {json.dumps(alpaca_format, indent=2)}")
        
        confidence_rating = signal_parser.create_confidence_rating(parsed)
        print(f"Confidence rating: {json.dumps(confidence_rating, indent=2)}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    test_parser()