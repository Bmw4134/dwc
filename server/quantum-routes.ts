import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

interface QuantumMetric {
  id: string;
  name: string;
  value: number;
  trend: number[];
  quantumState: 'coherent' | 'entangled' | 'superposition' | 'collapsed';
  performanceIndex: number;
  criticalThreshold: number;
  unit: string;
  color: string;
  lastUpdate: string;
}

interface SystemPerformance {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  databaseOperations: number;
  activeUsers: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

// Store real-time metrics data
let quantumMetrics: QuantumMetric[] = [
  {
    id: 'qcpu',
    name: 'Q-CPU',
    value: 87.3,
    trend: [],
    quantumState: 'coherent',
    performanceIndex: 98.7,
    criticalThreshold: 85,
    unit: '%',
    color: '#3b82f6',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'qmem',
    name: 'Q-Memory',
    value: 73.2,
    trend: [],
    quantumState: 'entangled',
    performanceIndex: 91.4,
    criticalThreshold: 80,
    unit: 'GB',
    color: '#10b981',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'qnet',
    name: 'Q-Network',
    value: 45.8,
    trend: [],
    quantumState: 'superposition',
    performanceIndex: 76.3,
    criticalThreshold: 70,
    unit: 'Mbps',
    color: '#f59e0b',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'qdb',
    name: 'Q-Database',
    value: 92.1,
    trend: [],
    quantumState: 'coherent',
    performanceIndex: 95.8,
    criticalThreshold: 90,
    unit: 'ops/s',
    color: '#8b5cf6',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'quser',
    name: 'Q-Users',
    value: 3847293,
    trend: [],
    quantumState: 'entangled',
    performanceIndex: 99.2,
    criticalThreshold: 4000000,
    unit: 'active',
    color: '#ef4444',
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'qlatency',
    name: 'Q-Latency',
    value: 12.7,
    trend: [],
    quantumState: 'superposition',
    performanceIndex: 88.9,
    criticalThreshold: 15,
    unit: 'ms',
    color: '#06b6d4',
    lastUpdate: new Date().toISOString()
  }
];

let systemPerformance: SystemPerformance = {
  cpuUsage: 0,
  memoryUsage: 0,
  networkLatency: 0,
  databaseOperations: 0,
  activeUsers: 0,
  responseTime: 0,
  errorRate: 0,
  throughput: 0
};

// Simulate real system performance data
const updateSystemPerformance = () => {
  const now = Date.now();
  const baseLoad = Math.sin(now / 60000) * 20 + 50; // 60 second cycle
  
  systemPerformance = {
    cpuUsage: Math.max(0, Math.min(100, baseLoad + (Math.random() - 0.5) * 20)),
    memoryUsage: Math.max(0, Math.min(100, baseLoad * 0.8 + (Math.random() - 0.5) * 15)),
    networkLatency: Math.max(1, baseLoad * 0.3 + (Math.random() - 0.5) * 10),
    databaseOperations: Math.max(0, baseLoad * 100 + (Math.random() - 0.5) * 500),
    activeUsers: Math.max(100000, 3800000 + Math.sin(now / 300000) * 200000 + (Math.random() - 0.5) * 50000),
    responseTime: Math.max(1, baseLoad * 0.4 + (Math.random() - 0.5) * 20),
    errorRate: Math.max(0, Math.min(5, (100 - baseLoad) * 0.05 + Math.random() * 0.5)),
    throughput: Math.max(0, baseLoad * 50 + (Math.random() - 0.5) * 500)
  };
};

// Update quantum metrics based on system performance
const updateQuantumMetrics = () => {
  updateSystemPerformance();
  
  quantumMetrics = quantumMetrics.map(metric => {
    let newValue = metric.value;
    let newQuantumState = metric.quantumState;
    
    // Update values based on system performance and quantum physics simulation
    switch (metric.id) {
      case 'qcpu':
        newValue = systemPerformance.cpuUsage + (Math.random() - 0.5) * 5;
        break;
      case 'qmem':
        newValue = systemPerformance.memoryUsage * 0.8 + (Math.random() - 0.5) * 8;
        break;
      case 'qnet':
        newValue = Math.max(0, 100 - systemPerformance.networkLatency * 2 + (Math.random() - 0.5) * 10);
        break;
      case 'qdb':
        newValue = systemPerformance.databaseOperations / 50 + (Math.random() - 0.5) * 15;
        break;
      case 'quser':
        newValue = systemPerformance.activeUsers;
        break;
      case 'qlatency':
        newValue = systemPerformance.responseTime + (Math.random() - 0.5) * 3;
        break;
    }
    
    // Determine quantum state based on performance relative to threshold
    const performanceRatio = newValue / metric.criticalThreshold;
    const randomFactor = Math.random();
    
    if (performanceRatio > 1.1) {
      newQuantumState = 'coherent';
    } else if (performanceRatio < 0.8) {
      newQuantumState = 'collapsed';
    } else if (randomFactor > 0.7) {
      newQuantumState = randomFactor > 0.85 ? 'entangled' : 'superposition';
    }
    
    // Apply quantum fluctuations based on state
    let quantumFluctuation = 0;
    switch (newQuantumState) {
      case 'coherent':
        quantumFluctuation = (Math.random() - 0.5) * 2;
        break;
      case 'entangled':
        quantumFluctuation = Math.sin(Date.now() / 5000) * 3;
        break;
      case 'superposition':
        quantumFluctuation = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5;
        break;
      case 'collapsed':
        quantumFluctuation = (Math.random() - 0.5) * 8;
        break;
    }
    
    newValue = Math.max(0, newValue + quantumFluctuation);
    
    // Update trend data (keep last 100 points)
    const newTrend = [...metric.trend, newValue].slice(-100);
    
    // Calculate performance index
    const performanceIndex = Math.min(100, Math.max(0, (newValue / metric.criticalThreshold) * 100));
    
    return {
      ...metric,
      value: newValue,
      trend: newTrend,
      quantumState: newQuantumState,
      performanceIndex,
      lastUpdate: new Date().toISOString()
    };
  });
};

// Update metrics every 2 seconds
setInterval(updateQuantumMetrics, 2000);

// Initialize with some trend data
for (let i = 0; i < 50; i++) {
  updateQuantumMetrics();
}

// API Routes

// Get all quantum metrics
router.get('/quantum/metrics', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: quantumMetrics,
      timestamp: new Date().toISOString(),
      systemCoherence: quantumMetrics.reduce((acc, m) => acc + m.performanceIndex, 0) / quantumMetrics.length
    });
  } catch (error) {
    console.error('Error fetching quantum metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quantum metrics'
    });
  }
});

// Get specific metric by ID
router.get('/quantum/metrics/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const metric = quantumMetrics.find(m => m.id === id);
    
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }
    
    res.json({
      success: true,
      data: metric,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching metric:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metric'
    });
  }
});

// Get system performance data
router.get('/quantum/performance', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: systemPerformance,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    });
  } catch (error) {
    console.error('Error fetching system performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system performance'
    });
  }
});

// Get quantum coherence status
router.get('/quantum/coherence', (req: Request, res: Response) => {
  try {
    const avgPerformance = quantumMetrics.reduce((acc, m) => acc + m.performanceIndex, 0) / quantumMetrics.length;
    const coherentMetrics = quantumMetrics.filter(m => m.quantumState === 'coherent').length;
    const totalMetrics = quantumMetrics.length;
    
    const coherenceScore = (avgPerformance + (coherentMetrics / totalMetrics) * 100) / 2;
    
    res.json({
      success: true,
      data: {
        coherenceScore,
        avgPerformance,
        coherentMetrics,
        totalMetrics,
        quantumStates: quantumMetrics.reduce((acc, m) => {
          acc[m.quantumState] = (acc[m.quantumState] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error calculating quantum coherence:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate quantum coherence'
    });
  }
});

// Update simulation parameters
router.post('/quantum/simulation', (req: Request, res: Response) => {
  try {
    const { userLoad, simulationSpeed } = req.body;
    
    if (userLoad !== undefined) {
      // Adjust user load simulation
      const userMetric = quantumMetrics.find(m => m.id === 'quser');
      if (userMetric) {
        userMetric.value = Math.max(100000, Math.min(4000000, userLoad));
      }
    }
    
    res.json({
      success: true,
      message: 'Simulation parameters updated',
      data: {
        userLoad: quantumMetrics.find(m => m.id === 'quser')?.value,
        simulationSpeed
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating simulation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update simulation parameters'
    });
  }
});

// Reset quantum metrics
router.post('/quantum/reset', (req: Request, res: Response) => {
  try {
    quantumMetrics.forEach(metric => {
      metric.trend = [];
      metric.quantumState = 'coherent';
      metric.performanceIndex = 95;
      metric.lastUpdate = new Date().toISOString();
    });
    
    res.json({
      success: true,
      message: 'Quantum metrics reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resetting quantum metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset quantum metrics'
    });
  }
});

// Stream metrics (Server-Sent Events)
router.get('/quantum/stream', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendMetrics = () => {
    const data = JSON.stringify({
      metrics: quantumMetrics,
      performance: systemPerformance,
      timestamp: new Date().toISOString()
    });
    
    res.write(`data: ${data}\n\n`);
  };

  // Send initial data
  sendMetrics();

  // Send updates every 2 seconds
  const interval = setInterval(sendMetrics, 2000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

export default router;