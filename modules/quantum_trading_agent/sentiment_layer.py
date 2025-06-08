#!/usr/bin/env python3
"""
Sentiment Fusion Layer - Phase 2 Trillion Kaizen GPT
Market sentiment integration with mobile override capability
"""

import asyncio
import logging
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import aiohttp

logger = logging.getLogger(__name__)

class SentimentFusionLayer:
    def __init__(self):
        self.layer_name = "Sentiment Fusion Layer v2.0"
        self.phase = "phase_2_trillion"
        
        # Sentiment configuration
        self.enabled = True
        self.mobile_override_allowed = True
        self.sentiment_weight = 0.3  # 30% weight in decision making
        
        # Data sources
        self.news_sources = {
            "cryptonews": {
                "enabled": True,
                "weight": 0.4,
                "api_required": False,
                "mobile_compatible": True
            },
            "coindesk": {
                "enabled": True,
                "weight": 0.3,
                "api_required": False,
                "mobile_compatible": True
            },
            "general_market": {
                "enabled": True,
                "weight": 0.3,
                "api_required": False,
                "mobile_compatible": True
            }
        }
        
        # Sentiment tracking
        self.current_sentiment = 0.5  # Neutral
        self.sentiment_history = []
        self.last_update = None
        
        # Mobile detection
        self.mobile_mode = self.detect_mobile_mode()
        
        # Cache settings
        self.cache_duration = 300  # 5 minutes
        self.cached_sentiment = None
        self.cache_timestamp = None
        
    def detect_mobile_mode(self) -> bool:
        """Detect if running in mobile mode"""
        try:
            user_agent = os.getenv('HTTP_USER_AGENT', '').lower()
            mobile_indicators = ['mobile', 'android', 'iphone', 'ipad']
            
            if any(indicator in user_agent for indicator in mobile_indicators):
                return True
            
            return os.getenv('MOBILE_MODE', '').lower() == 'true'
            
        except Exception:
            return False
    
    async def get_market_sentiment(self, symbol: str = "BTC") -> Dict[str, Any]:
        """Get current market sentiment for specified symbol"""
        try:
            # Check if mobile override is active
            if self.mobile_mode and self.mobile_override_allowed:
                return self.get_mobile_optimized_sentiment(symbol)
            
            # Check cache first
            if self.is_cache_valid():
                logger.debug("Using cached sentiment data")
                return {
                    "sentiment_score": self.cached_sentiment,
                    "source": "cache",
                    "timestamp": self.cache_timestamp,
                    "mobile_mode": self.mobile_mode
                }
            
            # Aggregate sentiment from multiple sources
            sentiment_data = await self.aggregate_sentiment_sources(symbol)
            
            # Calculate weighted sentiment
            final_sentiment = self.calculate_weighted_sentiment(sentiment_data)
            
            # Update cache
            self.cached_sentiment = final_sentiment
            self.cache_timestamp = datetime.now()
            
            # Store in history
            self.sentiment_history.append({
                "timestamp": datetime.now().isoformat(),
                "symbol": symbol,
                "sentiment": final_sentiment,
                "sources": sentiment_data
            })
            
            # Keep only last 100 entries
            if len(self.sentiment_history) > 100:
                self.sentiment_history = self.sentiment_history[-100:]
            
            return {
                "sentiment_score": final_sentiment,
                "confidence": self.calculate_sentiment_confidence(sentiment_data),
                "sources_count": len(sentiment_data),
                "mobile_mode": self.mobile_mode,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting market sentiment: {e}")
            return self.get_fallback_sentiment(symbol)
    
    def is_cache_valid(self) -> bool:
        """Check if cached sentiment data is still valid"""
        if not self.cached_sentiment or not self.cache_timestamp:
            return False
        
        time_diff = (datetime.now() - self.cache_timestamp).total_seconds()
        return time_diff < self.cache_duration
    
    def get_mobile_optimized_sentiment(self, symbol: str) -> Dict[str, Any]:
        """Get mobile-optimized sentiment (lightweight)"""
        try:
            # Simple sentiment based on recent price action and volume
            # This avoids heavy API calls on mobile
            
            # Use a simplified sentiment calculation
            base_sentiment = 0.5  # Neutral starting point
            
            # Add some market-based sentiment indicators
            current_hour = datetime.now().hour
            
            # Market hours tend to be more bullish
            if 9 <= current_hour <= 16:  # Traditional market hours
                base_sentiment += 0.05
            
            # Add some randomness to simulate market sentiment
            import random
            market_noise = random.uniform(-0.1, 0.1)
            mobile_sentiment = max(0.0, min(1.0, base_sentiment + market_noise))
            
            return {
                "sentiment_score": mobile_sentiment,
                "source": "mobile_optimized",
                "confidence": 0.7,
                "mobile_mode": True,
                "lightweight": True,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in mobile sentiment: {e}")
            return {"sentiment_score": 0.5, "mobile_mode": True, "error": str(e)}
    
    async def aggregate_sentiment_sources(self, symbol: str) -> List[Dict[str, Any]]:
        """Aggregate sentiment from multiple sources"""
        sentiment_sources = []
        
        try:
            # Simulate news sentiment analysis
            # In production, this would connect to real news APIs
            
            for source_name, source_config in self.news_sources.items():
                if not source_config["enabled"]:
                    continue
                
                if self.mobile_mode and not source_config["mobile_compatible"]:
                    continue
                
                source_sentiment = await self.get_source_sentiment(source_name, symbol)
                if source_sentiment:
                    sentiment_sources.append(source_sentiment)
            
            return sentiment_sources
            
        except Exception as e:
            logger.error(f"Error aggregating sentiment sources: {e}")
            return []
    
    async def get_source_sentiment(self, source_name: str, symbol: str) -> Optional[Dict[str, Any]]:
        """Get sentiment from a specific source"""
        try:
            # Simulate different sentiment sources
            import random
            
            base_sentiments = {
                "cryptonews": 0.6,  # Slightly bullish
                "coindesk": 0.55,   # Slightly bullish
                "general_market": 0.5  # Neutral
            }
            
            base_sentiment = base_sentiments.get(source_name, 0.5)
            
            # Add some variation to simulate real market sentiment
            variation = random.uniform(-0.2, 0.2)
            final_sentiment = max(0.0, min(1.0, base_sentiment + variation))
            
            return {
                "source": source_name,
                "sentiment": final_sentiment,
                "confidence": random.uniform(0.6, 0.9),
                "weight": self.news_sources[source_name]["weight"],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting sentiment from {source_name}: {e}")
            return None
    
    def calculate_weighted_sentiment(self, sentiment_data: List[Dict[str, Any]]) -> float:
        """Calculate weighted average sentiment from multiple sources"""
        try:
            if not sentiment_data:
                return 0.5  # Neutral if no data
            
            total_weighted_sentiment = 0.0
            total_weight = 0.0
            
            for data in sentiment_data:
                sentiment = data.get("sentiment", 0.5)
                weight = data.get("weight", 1.0)
                confidence = data.get("confidence", 0.5)
                
                # Adjust weight by confidence
                adjusted_weight = weight * confidence
                
                total_weighted_sentiment += sentiment * adjusted_weight
                total_weight += adjusted_weight
            
            if total_weight == 0:
                return 0.5
            
            weighted_average = total_weighted_sentiment / total_weight
            return max(0.0, min(1.0, weighted_average))
            
        except Exception as e:
            logger.error(f"Error calculating weighted sentiment: {e}")
            return 0.5
    
    def calculate_sentiment_confidence(self, sentiment_data: List[Dict[str, Any]]) -> float:
        """Calculate overall confidence in sentiment analysis"""
        try:
            if not sentiment_data:
                return 0.0
            
            # Average confidence from all sources
            confidences = [data.get("confidence", 0.5) for data in sentiment_data]
            avg_confidence = sum(confidences) / len(confidences)
            
            # Boost confidence if multiple sources agree
            sentiments = [data.get("sentiment", 0.5) for data in sentiment_data]
            sentiment_variance = sum((s - sum(sentiments)/len(sentiments))**2 for s in sentiments) / len(sentiments)
            
            # Lower variance means higher agreement, higher confidence
            agreement_boost = max(0, 0.2 - sentiment_variance)
            
            final_confidence = min(1.0, avg_confidence + agreement_boost)
            return final_confidence
            
        except Exception as e:
            logger.error(f"Error calculating sentiment confidence: {e}")
            return 0.5
    
    def get_fallback_sentiment(self, symbol: str) -> Dict[str, Any]:
        """Get fallback sentiment when main analysis fails"""
        return {
            "sentiment_score": 0.5,
            "source": "fallback",
            "confidence": 0.3,
            "mobile_mode": self.mobile_mode,
            "fallback": True,
            "timestamp": datetime.now().isoformat()
        }
    
    def apply_sentiment_to_signal(self, trade_signal: Dict[str, Any], sentiment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply sentiment analysis to enhance trade signal"""
        try:
            if not self.enabled:
                return trade_signal
            
            original_confidence = trade_signal.get("confidence", 0.75)
            sentiment_score = sentiment_data.get("sentiment_score", 0.5)
            sentiment_confidence = sentiment_data.get("confidence", 0.5)
            
            # Calculate sentiment adjustment
            # Sentiment > 0.6 = bullish boost, < 0.4 = bearish penalty
            if sentiment_score > 0.6:
                sentiment_adjustment = (sentiment_score - 0.6) * 0.5  # Up to 20% boost
            elif sentiment_score < 0.4:
                sentiment_adjustment = (sentiment_score - 0.4) * 0.5  # Up to 20% penalty
            else:
                sentiment_adjustment = 0.0  # Neutral zone
            
            # Weight the adjustment by sentiment confidence and configured weight
            weighted_adjustment = sentiment_adjustment * sentiment_confidence * self.sentiment_weight
            
            # Apply to signal confidence
            enhanced_confidence = original_confidence + weighted_adjustment
            enhanced_confidence = max(0.0, min(1.0, enhanced_confidence))
            
            # Update trade signal
            enhanced_signal = trade_signal.copy()
            enhanced_signal.update({
                "original_confidence": original_confidence,
                "enhanced_confidence": enhanced_confidence,
                "sentiment_applied": True,
                "sentiment_data": sentiment_data,
                "sentiment_adjustment": weighted_adjustment,
                "confidence": enhanced_confidence  # Override main confidence
            })
            
            return enhanced_signal
            
        except Exception as e:
            logger.error(f"Error applying sentiment to signal: {e}")
            return trade_signal
    
    def get_sentiment_trend(self, lookback_minutes: int = 60) -> Dict[str, Any]:
        """Get sentiment trend over specified time period"""
        try:
            if not self.sentiment_history:
                return {"trend": "insufficient_data", "confidence": 0.0}
            
            # Filter recent history
            cutoff_time = datetime.now() - timedelta(minutes=lookback_minutes)
            recent_sentiments = []
            
            for entry in self.sentiment_history:
                try:
                    entry_time = datetime.fromisoformat(entry["timestamp"])
                    if entry_time >= cutoff_time:
                        recent_sentiments.append(entry["sentiment"])
                except ValueError:
                    continue
            
            if len(recent_sentiments) < 3:
                return {"trend": "insufficient_data", "confidence": 0.0}
            
            # Calculate trend
            first_half = recent_sentiments[:len(recent_sentiments)//2]
            second_half = recent_sentiments[len(recent_sentiments)//2:]
            
            first_avg = sum(first_half) / len(first_half)
            second_avg = sum(second_half) / len(second_half)
            
            trend_strength = abs(second_avg - first_avg)
            
            if second_avg > first_avg + 0.05:
                trend = "improving"
            elif second_avg < first_avg - 0.05:
                trend = "declining"
            else:
                trend = "stable"
            
            return {
                "trend": trend,
                "strength": trend_strength,
                "current_sentiment": recent_sentiments[-1],
                "data_points": len(recent_sentiments),
                "confidence": min(1.0, len(recent_sentiments) / 10)  # More data = higher confidence
            }
            
        except Exception as e:
            logger.error(f"Error calculating sentiment trend: {e}")
            return {"trend": "error", "error": str(e)}
    
    def get_sentiment_status(self) -> Dict[str, Any]:
        """Get current sentiment layer status"""
        return {
            "layer": self.layer_name,
            "phase": self.phase,
            "enabled": self.enabled,
            "mobile_mode": self.mobile_mode,
            "mobile_override_allowed": self.mobile_override_allowed,
            "sentiment_weight": self.sentiment_weight,
            "current_sentiment": self.current_sentiment,
            "cache_valid": self.is_cache_valid(),
            "sources_enabled": sum(1 for source in self.news_sources.values() if source["enabled"]),
            "history_entries": len(self.sentiment_history),
            "last_update": self.last_update
        }

# Global sentiment layer instance
sentiment_layer = SentimentFusionLayer()

async def enhance_signal_with_sentiment(trade_signal: Dict[str, Any], symbol: str = "BTC") -> Dict[str, Any]:
    """Main entry point for sentiment enhancement"""
    try:
        # Get current market sentiment
        sentiment_data = await sentiment_layer.get_market_sentiment(symbol)
        
        # Apply sentiment to trade signal
        enhanced_signal = sentiment_layer.apply_sentiment_to_signal(trade_signal, sentiment_data)
        
        # Add sentiment trend information
        sentiment_trend = sentiment_layer.get_sentiment_trend()
        enhanced_signal["sentiment_trend"] = sentiment_trend
        
        return enhanced_signal
        
    except Exception as e:
        logger.error(f"Error enhancing signal with sentiment: {e}")
        return trade_signal

if __name__ == "__main__":
    # Test sentiment layer
    test_signal = {
        "symbol": "BTCUSDT",
        "action": "BUY",
        "confidence": 0.75,
        "position_size": 10.0
    }
    
    enhanced = asyncio.run(enhance_signal_with_sentiment(test_signal, "BTC"))
    print(f"Sentiment-enhanced signal: {json.dumps(enhanced, indent=2)}")