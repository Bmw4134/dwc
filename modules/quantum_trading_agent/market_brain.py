#!/usr/bin/env python3
"""
Market Brain - Quantum Financial Intelligence Processing
Phase 1 Trillion Autonomous Quantum Trading Agent
"""

import asyncio
import json
import logging
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Tuple
import time

logger = logging.getLogger(__name__)

class QuantumMarketBrain:
    def __init__(self):
        self.config_path = Path("modules/quantum_trading_agent/thresholds.json")
        self.brain_state_path = Path("logs/brain_state.json")
        
        # Quantum neural network parameters
        self.quantum_neurons = 512
        self.entanglement_matrix = np.random.uniform(0, 1, (self.quantum_neurons, self.quantum_neurons))
        self.coherence_threshold = 0.75
        
        # Market memory
        self.market_memory = []
        self.pattern_library = {}
        self.confidence_history = []
        
        # Learning parameters
        self.learning_rate = 0.001
        self.momentum = 0.9
        self.decay_factor = 0.95
        
        self.load_brain_state()
    
    def load_brain_state(self):
        """Load previous brain state and learned patterns"""
        try:
            if self.brain_state_path.exists():
                with open(self.brain_state_path, 'r') as f:
                    state = json.load(f)
                    
                self.pattern_library = state.get('pattern_library', {})
                self.confidence_history = state.get('confidence_history', [])
                self.market_memory = state.get('market_memory', [])[-1000:]  # Keep last 1000
                
                logger.info(f"Loaded brain state: {len(self.pattern_library)} patterns, "
                          f"{len(self.market_memory)} memories")
            else:
                logger.info("Initializing new brain state")
                
        except Exception as e:
            logger.error(f"Error loading brain state: {e}")
    
    def save_brain_state(self):
        """Save current brain state"""
        try:
            state = {
                'pattern_library': self.pattern_library,
                'confidence_history': self.confidence_history[-1000:],
                'market_memory': self.market_memory[-1000:],
                'last_updated': datetime.now().isoformat(),
                'quantum_coherence': self.calculate_quantum_coherence()
            }
            
            with open(self.brain_state_path, 'w') as f:
                json.dump(state, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving brain state: {e}")
    
    def calculate_quantum_coherence(self) -> float:
        """Calculate quantum coherence of the neural network"""
        try:
            # Simulate quantum coherence based on entanglement matrix
            eigenvalues = np.linalg.eigvals(self.entanglement_matrix)
            coherence = np.mean(np.abs(eigenvalues)) / np.max(np.abs(eigenvalues))
            return min(1.0, max(0.0, coherence))
        except:
            return 0.5
    
    def quantum_superposition_analysis(self, market_data: Dict[str, Any]) -> Dict[str, float]:
        """Analyze market in quantum superposition states"""
        try:
            # Extract numerical features
            features = []
            for key, value in market_data.items():
                if isinstance(value, (int, float)):
                    features.append(value)
                elif isinstance(value, dict):
                    for subkey, subvalue in value.items():
                        if isinstance(subvalue, (int, float)):
                            features.append(subvalue)
            
            if not features:
                return {"probability_up": 0.5, "probability_down": 0.5, "uncertainty": 1.0}
            
            features = np.array(features)
            
            # Quantum transformation
            quantum_state = np.dot(features, self.entanglement_matrix[:len(features), :len(features)])
            quantum_probs = np.abs(quantum_state) ** 2
            
            # Normalize probabilities
            prob_sum = np.sum(quantum_probs)
            if prob_sum > 0:
                quantum_probs /= prob_sum
            
            # Calculate market direction probabilities
            prob_up = np.sum(quantum_probs[quantum_probs > np.median(quantum_probs)])
            prob_down = 1.0 - prob_up
            uncertainty = np.std(quantum_probs)
            
            return {
                "probability_up": prob_up,
                "probability_down": prob_down,
                "uncertainty": uncertainty,
                "quantum_coherence": self.calculate_quantum_coherence()
            }
            
        except Exception as e:
            logger.error(f"Error in quantum superposition analysis: {e}")
            return {"probability_up": 0.5, "probability_down": 0.5, "uncertainty": 1.0}
    
    def pattern_recognition(self, market_sequence: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Advanced pattern recognition using quantum neural networks"""
        if len(market_sequence) < 3:
            return {"pattern_detected": False, "confidence": 0.0}
        
        try:
            # Convert sequence to feature vectors
            feature_vectors = []
            for data in market_sequence[-10:]:  # Last 10 data points
                vector = []
                for key, value in data.items():
                    if isinstance(value, (int, float)):
                        vector.append(value)
                feature_vectors.append(vector)
            
            if not feature_vectors or not feature_vectors[0]:
                return {"pattern_detected": False, "confidence": 0.0}
            
            # Calculate pattern signature
            pattern_signature = self.calculate_pattern_signature(feature_vectors)
            
            # Search for similar patterns in library
            best_match = self.find_best_pattern_match(pattern_signature)
            
            if best_match:
                return {
                    "pattern_detected": True,
                    "pattern_type": best_match["type"],
                    "confidence": best_match["confidence"],
                    "predicted_direction": best_match["direction"],
                    "historical_accuracy": best_match["accuracy"]
                }
            else:
                # Store new pattern
                new_pattern = {
                    "signature": pattern_signature,
                    "timestamp": datetime.now().isoformat(),
                    "occurrences": 1,
                    "accuracy": 0.5  # Initial neutral accuracy
                }
                
                pattern_id = f"pattern_{len(self.pattern_library)}"
                self.pattern_library[pattern_id] = new_pattern
                
                return {"pattern_detected": False, "confidence": 0.0, "new_pattern_stored": True}
                
        except Exception as e:
            logger.error(f"Error in pattern recognition: {e}")
            return {"pattern_detected": False, "confidence": 0.0}
    
    def calculate_pattern_signature(self, feature_vectors: List[List[float]]) -> List[float]:
        """Calculate unique signature for a pattern"""
        try:
            if not feature_vectors:
                return []
            
            # Flatten and normalize
            flattened = []
            for vector in feature_vectors:
                flattened.extend(vector)
            
            if not flattened:
                return []
            
            # Calculate statistical features
            signature = [
                np.mean(flattened),
                np.std(flattened),
                np.min(flattened),
                np.max(flattened),
                len(flattened)
            ]
            
            # Add trend features
            if len(feature_vectors) > 1:
                trends = []
                for i in range(1, len(feature_vectors)):
                    if len(feature_vectors[i]) == len(feature_vectors[i-1]):
                        trend = np.mean(np.array(feature_vectors[i]) - np.array(feature_vectors[i-1]))
                        trends.append(trend)
                
                if trends:
                    signature.extend([np.mean(trends), np.std(trends)])
            
            return signature
            
        except Exception as e:
            logger.error(f"Error calculating pattern signature: {e}")
            return []
    
    def find_best_pattern_match(self, signature: List[float]) -> Dict[str, Any]:
        """Find best matching pattern in library"""
        if not signature or not self.pattern_library:
            return None
        
        try:
            best_match = None
            best_similarity = 0.0
            
            for pattern_id, pattern in self.pattern_library.items():
                stored_signature = pattern.get("signature", [])
                
                if len(stored_signature) == len(signature):
                    # Calculate cosine similarity
                    similarity = self.cosine_similarity(signature, stored_signature)
                    
                    if similarity > best_similarity and similarity > 0.8:  # Threshold for match
                        best_match = {
                            "pattern_id": pattern_id,
                            "confidence": similarity,
                            "type": pattern.get("type", "unknown"),
                            "direction": pattern.get("direction", "neutral"),
                            "accuracy": pattern.get("accuracy", 0.5)
                        }
                        best_similarity = similarity
            
            return best_match
            
        except Exception as e:
            logger.error(f"Error finding pattern match: {e}")
            return None
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        try:
            v1 = np.array(vec1)
            v2 = np.array(vec2)
            
            dot_product = np.dot(v1, v2)
            norm1 = np.linalg.norm(v1)
            norm2 = np.linalg.norm(v2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            return dot_product / (norm1 * norm2)
            
        except Exception as e:
            return 0.0
    
    def quantum_risk_assessment(self, trade_signal: Dict[str, Any]) -> Dict[str, float]:
        """Quantum-enhanced risk assessment"""
        try:
            base_risk = 0.5
            
            # Confidence-based risk adjustment
            confidence = trade_signal.get("confidence", 0.5)
            confidence_risk = 1.0 - confidence
            
            # Quantum coherence risk
            coherence = self.calculate_quantum_coherence()
            coherence_risk = 1.0 - coherence
            
            # Market volatility risk (simulated)
            volatility_risk = np.random.uniform(0.1, 0.4)
            
            # Position size risk
            position_size = trade_signal.get("position_size", 0.1)
            size_risk = position_size * 2.0  # Higher position = higher risk
            
            # Combined risk score
            total_risk = np.mean([confidence_risk, coherence_risk, volatility_risk, size_risk])
            
            # Risk-adjusted position size
            max_safe_position = min(0.1, 0.05 / total_risk) if total_risk > 0 else 0.1
            
            return {
                "total_risk": total_risk,
                "confidence_risk": confidence_risk,
                "coherence_risk": coherence_risk,
                "volatility_risk": volatility_risk,
                "position_risk": size_risk,
                "recommended_position": max_safe_position,
                "risk_level": "HIGH" if total_risk > 0.7 else "MEDIUM" if total_risk > 0.4 else "LOW"
            }
            
        except Exception as e:
            logger.error(f"Error in risk assessment: {e}")
            return {"total_risk": 1.0, "risk_level": "HIGH"}
    
    def learn_from_outcome(self, trade_id: str, outcome: str, profit_loss: float):
        """Learn from trade outcomes to improve future predictions"""
        try:
            # Update pattern accuracy based on outcome
            for pattern_id, pattern in self.pattern_library.items():
                if pattern.get("last_used_trade") == trade_id:
                    current_accuracy = pattern.get("accuracy", 0.5)
                    outcome_score = 1.0 if outcome == "WIN" else 0.0
                    
                    # Update accuracy with learning rate
                    new_accuracy = current_accuracy * (1 - self.learning_rate) + outcome_score * self.learning_rate
                    pattern["accuracy"] = new_accuracy
                    pattern["occurrences"] = pattern.get("occurrences", 0) + 1
                    
                    logger.info(f"Updated pattern {pattern_id} accuracy: {new_accuracy:.3f}")
            
            # Update confidence history
            self.confidence_history.append({
                "trade_id": trade_id,
                "outcome": outcome,
                "profit_loss": profit_loss,
                "timestamp": datetime.now().isoformat()
            })
            
            # Save updated state
            self.save_brain_state()
            
        except Exception as e:
            logger.error(f"Error learning from outcome: {e}")
    
    async def continuous_learning_loop(self):
        """Continuous learning and adaptation loop"""
        logger.info("Starting continuous learning loop...")
        
        while True:
            try:
                # Update quantum entanglement matrix
                self.evolve_quantum_network()
                
                # Decay old patterns
                self.decay_old_patterns()
                
                # Save state periodically
                self.save_brain_state()
                
                # Calculate and log performance metrics
                self.log_performance_metrics()
                
                # Sleep for learning cycle
                await asyncio.sleep(300)  # 5 minutes
                
            except Exception as e:
                logger.error(f"Error in learning loop: {e}")
                await asyncio.sleep(60)
    
    def evolve_quantum_network(self):
        """Evolve the quantum neural network based on learning"""
        try:
            # Small random mutations to entanglement matrix
            mutation_strength = 0.001
            mutation = np.random.normal(0, mutation_strength, self.entanglement_matrix.shape)
            self.entanglement_matrix += mutation
            
            # Normalize to maintain quantum properties
            self.entanglement_matrix = np.clip(self.entanglement_matrix, -1, 1)
            
        except Exception as e:
            logger.error(f"Error evolving quantum network: {e}")
    
    def decay_old_patterns(self):
        """Apply decay to old, unused patterns"""
        try:
            current_time = datetime.now()
            cutoff_time = current_time - timedelta(days=30)  # 30 days
            
            patterns_to_remove = []
            for pattern_id, pattern in self.pattern_library.items():
                pattern_time = datetime.fromisoformat(pattern.get("timestamp", current_time.isoformat()))
                
                if pattern_time < cutoff_time and pattern.get("occurrences", 0) < 5:
                    patterns_to_remove.append(pattern_id)
            
            for pattern_id in patterns_to_remove:
                del self.pattern_library[pattern_id]
            
            if patterns_to_remove:
                logger.info(f"Removed {len(patterns_to_remove)} old patterns")
                
        except Exception as e:
            logger.error(f"Error decaying old patterns: {e}")
    
    def log_performance_metrics(self):
        """Log current performance metrics"""
        try:
            if not self.confidence_history:
                return
            
            recent_trades = self.confidence_history[-100:]  # Last 100 trades
            win_rate = sum(1 for trade in recent_trades if trade.get("outcome") == "WIN") / len(recent_trades)
            
            total_pnl = sum(trade.get("profit_loss", 0) for trade in recent_trades)
            avg_pnl = total_pnl / len(recent_trades) if recent_trades else 0
            
            logger.info(f"Performance Metrics - Win Rate: {win_rate:.1%}, Avg P&L: {avg_pnl:.4f}, "
                       f"Patterns: {len(self.pattern_library)}, Coherence: {self.calculate_quantum_coherence():.3f}")
            
        except Exception as e:
            logger.error(f"Error logging performance metrics: {e}")

# Standalone execution for testing
async def main():
    brain = QuantumMarketBrain()
    await brain.continuous_learning_loop()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())