#!/usr/bin/env python3
"""
Session Recorder - Comprehensive Trading Session Documentation
Phase 1 Trillion Autonomous Quantum Trading Agent
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import sqlite3
import threading

logger = logging.getLogger(__name__)

class TradingSessionRecorder:
    def __init__(self):
        self.db_path = Path("logs/trading_sessions.db")
        self.json_log_path = Path("logs/session_records.json")
        self.current_session_id = None
        self.session_start_time = None
        self.session_data = {}
        
        # Initialize database
        self.init_database()
        
        # Recording state
        self.recording_active = False
        self.recorded_events = []
        self.performance_metrics = {}
        
    def init_database(self):
        """Initialize SQLite database for session storage"""
        try:
            self.db_path.parent.mkdir(exist_ok=True)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Sessions table
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    start_time TEXT NOT NULL,
                    end_time TEXT,
                    total_trades INTEGER DEFAULT 0,
                    winning_trades INTEGER DEFAULT 0,
                    losing_trades INTEGER DEFAULT 0,
                    total_pnl REAL DEFAULT 0.0,
                    max_drawdown REAL DEFAULT 0.0,
                    win_rate REAL DEFAULT 0.0,
                    avg_trade_duration INTEGER DEFAULT 0,
                    quantum_coherence_avg REAL DEFAULT 0.0,
                    session_notes TEXT,
                    status TEXT DEFAULT 'ACTIVE'
                )
                ''')
                
                # Trade events table
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS trade_events (
                    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    symbol TEXT,
                    action TEXT,
                    quantity REAL,
                    price REAL,
                    confidence REAL,
                    quantum_params TEXT,
                    outcome TEXT,
                    pnl REAL,
                    notes TEXT,
                    FOREIGN KEY (session_id) REFERENCES sessions (session_id)
                )
                ''')
                
                # Market analysis table
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS market_analysis (
                    analysis_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    symbol TEXT NOT NULL,
                    analysis_data TEXT NOT NULL,
                    confidence REAL,
                    recommendation TEXT,
                    quantum_state TEXT,
                    FOREIGN KEY (session_id) REFERENCES sessions (session_id)
                )
                ''')
                
                conn.commit()
                logger.info("Database initialized successfully")
                
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
    
    def start_session(self, session_config: Dict[str, Any] = None) -> str:
        """Start a new trading session"""
        try:
            self.current_session_id = f"QTA_SESSION_{int(time.time())}"
            self.session_start_time = datetime.now()
            self.recording_active = True
            self.recorded_events = []
            self.performance_metrics = {
                "total_trades": 0,
                "winning_trades": 0,
                "losing_trades": 0,
                "total_pnl": 0.0,
                "max_drawdown": 0.0,
                "running_pnl": 0.0,
                "peak_equity": 0.0
            }
            
            # Store session in database
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                INSERT INTO sessions (session_id, start_time, session_notes)
                VALUES (?, ?, ?)
                ''', (
                    self.current_session_id,
                    self.session_start_time.isoformat(),
                    json.dumps(session_config or {})
                ))
                conn.commit()
            
            logger.info(f"Started trading session: {self.current_session_id}")
            return self.current_session_id
            
        except Exception as e:
            logger.error(f"Error starting session: {e}")
            return None
    
    def record_trade_event(self, event_data: Dict[str, Any]):
        """Record a trade event"""
        if not self.recording_active or not self.current_session_id:
            return
        
        try:
            event = {
                "session_id": self.current_session_id,
                "timestamp": datetime.now().isoformat(),
                "event_type": event_data.get("event_type", "TRADE_SIGNAL"),
                "symbol": event_data.get("symbol"),
                "action": event_data.get("action"),
                "quantity": event_data.get("quantity", 0.0),
                "price": event_data.get("price", 0.0),
                "confidence": event_data.get("confidence", 0.0),
                "quantum_params": json.dumps(event_data.get("quantum_params", {})),
                "outcome": event_data.get("outcome"),
                "pnl": event_data.get("pnl", 0.0),
                "notes": event_data.get("notes", "")
            }
            
            # Store in database
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                INSERT INTO trade_events (
                    session_id, timestamp, event_type, symbol, action,
                    quantity, price, confidence, quantum_params, outcome, pnl, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    event["session_id"], event["timestamp"], event["event_type"],
                    event["symbol"], event["action"], event["quantity"],
                    event["price"], event["confidence"], event["quantum_params"],
                    event["outcome"], event["pnl"], event["notes"]
                ))
                conn.commit()
            
            # Update performance metrics
            self.update_performance_metrics(event)
            
            # Store in memory
            self.recorded_events.append(event)
            
            logger.info(f"Recorded trade event: {event['event_type']} for {event['symbol']}")
            
        except Exception as e:
            logger.error(f"Error recording trade event: {e}")
    
    def record_market_analysis(self, analysis_data: Dict[str, Any]):
        """Record market analysis results"""
        if not self.recording_active or not self.current_session_id:
            return
        
        try:
            analysis = {
                "session_id": self.current_session_id,
                "timestamp": datetime.now().isoformat(),
                "symbol": analysis_data.get("symbol"),
                "analysis_data": json.dumps(analysis_data.get("technical_analysis", {})),
                "confidence": analysis_data.get("confidence", 0.0),
                "recommendation": analysis_data.get("recommendation"),
                "quantum_state": json.dumps(analysis_data.get("quantum_state", {}))
            }
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                INSERT INTO market_analysis (
                    session_id, timestamp, symbol, analysis_data,
                    confidence, recommendation, quantum_state
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    analysis["session_id"], analysis["timestamp"], analysis["symbol"],
                    analysis["analysis_data"], analysis["confidence"],
                    analysis["recommendation"], analysis["quantum_state"]
                ))
                conn.commit()
                
        except Exception as e:
            logger.error(f"Error recording market analysis: {e}")
    
    def update_performance_metrics(self, event: Dict[str, Any]):
        """Update session performance metrics"""
        try:
            event_type = event.get("event_type")
            pnl = event.get("pnl", 0.0)
            outcome = event.get("outcome")
            
            if event_type == "TRADE_CLOSE" and outcome:
                self.performance_metrics["total_trades"] += 1
                self.performance_metrics["total_pnl"] += pnl
                self.performance_metrics["running_pnl"] += pnl
                
                if outcome == "WIN":
                    self.performance_metrics["winning_trades"] += 1
                elif outcome == "LOSS":
                    self.performance_metrics["losing_trades"] += 1
                
                # Update peak equity and drawdown
                if self.performance_metrics["running_pnl"] > self.performance_metrics["peak_equity"]:
                    self.performance_metrics["peak_equity"] = self.performance_metrics["running_pnl"]
                
                current_drawdown = self.performance_metrics["peak_equity"] - self.performance_metrics["running_pnl"]
                if current_drawdown > self.performance_metrics["max_drawdown"]:
                    self.performance_metrics["max_drawdown"] = current_drawdown
                
                # Calculate win rate
                total_closed = self.performance_metrics["winning_trades"] + self.performance_metrics["losing_trades"]
                if total_closed > 0:
                    self.performance_metrics["win_rate"] = self.performance_metrics["winning_trades"] / total_closed
                    
        except Exception as e:
            logger.error(f"Error updating performance metrics: {e}")
    
    def end_session(self, session_notes: str = "") -> Dict[str, Any]:
        """End current trading session and generate report"""
        if not self.current_session_id:
            return {}
        
        try:
            end_time = datetime.now()
            session_duration = end_time - self.session_start_time
            
            # Calculate final metrics
            final_metrics = self.performance_metrics.copy()
            final_metrics["session_duration_minutes"] = int(session_duration.total_seconds() / 60)
            final_metrics["avg_trades_per_hour"] = (
                final_metrics["total_trades"] / (session_duration.total_seconds() / 3600)
                if session_duration.total_seconds() > 0 else 0
            )
            
            # Update session in database
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                UPDATE sessions SET
                    end_time = ?,
                    total_trades = ?,
                    winning_trades = ?,
                    losing_trades = ?,
                    total_pnl = ?,
                    max_drawdown = ?,
                    win_rate = ?,
                    status = 'COMPLETED'
                WHERE session_id = ?
                ''', (
                    end_time.isoformat(),
                    final_metrics["total_trades"],
                    final_metrics["winning_trades"],
                    final_metrics["losing_trades"],
                    final_metrics["total_pnl"],
                    final_metrics["max_drawdown"],
                    final_metrics["win_rate"],
                    self.current_session_id
                ))
                conn.commit()
            
            # Generate session report
            session_report = {
                "session_id": self.current_session_id,
                "start_time": self.session_start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "duration_minutes": final_metrics["session_duration_minutes"],
                "performance_metrics": final_metrics,
                "total_events": len(self.recorded_events),
                "session_notes": session_notes
            }
            
            # Save report to JSON
            self.save_session_report(session_report)
            
            logger.info(f"Session {self.current_session_id} ended. "
                       f"Total trades: {final_metrics['total_trades']}, "
                       f"Win rate: {final_metrics['win_rate']:.1%}, "
                       f"Total P&L: {final_metrics['total_pnl']:.4f}")
            
            # Reset state
            self.recording_active = False
            self.current_session_id = None
            
            return session_report
            
        except Exception as e:
            logger.error(f"Error ending session: {e}")
            return {}
    
    def save_session_report(self, report: Dict[str, Any]):
        """Save session report to JSON file"""
        try:
            reports = []
            if self.json_log_path.exists():
                with open(self.json_log_path, 'r') as f:
                    reports = json.load(f)
            
            reports.append(report)
            
            # Keep only last 100 session reports
            reports = reports[-100:]
            
            with open(self.json_log_path, 'w') as f:
                json.dump(reports, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving session report: {e}")
    
    def get_session_summary(self, session_id: str = None) -> Dict[str, Any]:
        """Get summary of current or specified session"""
        target_session = session_id or self.current_session_id
        if not target_session:
            return {}
        
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get session data
                cursor.execute('''
                SELECT * FROM sessions WHERE session_id = ?
                ''', (target_session,))
                session_row = cursor.fetchone()
                
                if not session_row:
                    return {}
                
                # Get trade events
                cursor.execute('''
                SELECT COUNT(*) as total_events,
                       SUM(CASE WHEN outcome = 'WIN' THEN 1 ELSE 0 END) as wins,
                       SUM(CASE WHEN outcome = 'LOSS' THEN 1 ELSE 0 END) as losses,
                       AVG(confidence) as avg_confidence
                FROM trade_events 
                WHERE session_id = ? AND event_type = 'TRADE_CLOSE'
                ''', (target_session,))
                events_stats = cursor.fetchone()
                
                # Get unique symbols traded
                cursor.execute('''
                SELECT DISTINCT symbol FROM trade_events 
                WHERE session_id = ? AND symbol IS NOT NULL
                ''', (target_session,))
                symbols = [row[0] for row in cursor.fetchall()]
                
                summary = {
                    "session_id": target_session,
                    "start_time": session_row[1],
                    "end_time": session_row[2],
                    "status": session_row[13],
                    "total_trades": session_row[3],
                    "winning_trades": session_row[4],
                    "losing_trades": session_row[5],
                    "total_pnl": session_row[6],
                    "max_drawdown": session_row[7],
                    "win_rate": session_row[8],
                    "symbols_traded": symbols,
                    "avg_confidence": events_stats[3] if events_stats[3] else 0.0,
                    "is_current_session": target_session == self.current_session_id
                }
                
                return summary
                
        except Exception as e:
            logger.error(f"Error getting session summary: {e}")
            return {}
    
    def get_recent_sessions(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent trading sessions"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                SELECT session_id, start_time, end_time, total_trades, 
                       win_rate, total_pnl, status
                FROM sessions 
                ORDER BY start_time DESC 
                LIMIT ?
                ''', (limit,))
                
                sessions = []
                for row in cursor.fetchall():
                    sessions.append({
                        "session_id": row[0],
                        "start_time": row[1],
                        "end_time": row[2],
                        "total_trades": row[3],
                        "win_rate": row[4],
                        "total_pnl": row[5],
                        "status": row[6]
                    })
                
                return sessions
                
        except Exception as e:
            logger.error(f"Error getting recent sessions: {e}")
            return []
    
    async def continuous_recording_loop(self):
        """Continuous recording and monitoring loop"""
        logger.info("Starting session recording loop...")
        
        while True:
            try:
                if self.recording_active:
                    # Update session metrics periodically
                    current_summary = self.get_session_summary()
                    if current_summary:
                        logger.info(f"Session {self.current_session_id}: "
                                  f"{current_summary['total_trades']} trades, "
                                  f"Win rate: {current_summary['win_rate']:.1%}")
                
                await asyncio.sleep(300)  # 5 minutes
                
            except Exception as e:
                logger.error(f"Error in recording loop: {e}")
                await asyncio.sleep(60)

# Standalone execution for testing
async def main():
    recorder = TradingSessionRecorder()
    
    # Start a test session
    session_id = recorder.start_session({"mode": "test", "strategy": "quantum"})
    
    # Record some test events
    recorder.record_trade_event({
        "event_type": "TRADE_SIGNAL",
        "symbol": "BTC/USD",
        "action": "BUY",
        "confidence": 0.85,
        "quantum_params": {"coherence": 0.9}
    })
    
    await asyncio.sleep(2)
    
    recorder.record_trade_event({
        "event_type": "TRADE_CLOSE",
        "symbol": "BTC/USD",
        "action": "SELL",
        "pnl": 0.025,
        "outcome": "WIN"
    })
    
    # Get summary
    summary = recorder.get_session_summary()
    print(f"Session summary: {summary}")
    
    # End session
    report = recorder.end_session("Test session completed")
    print(f"Final report: {report}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())