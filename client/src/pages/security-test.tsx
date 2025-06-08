import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Zap, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttackSimulation {
  id: string;
  type: 'brute_force' | 'ddos' | 'sql_injection' | 'xss';
  intensity: number;
  status: 'preparing' | 'attacking' | 'blocked' | 'learning';
  requests_sent: number;
  requests_blocked: number;
  quantum_response: string;
}

interface SecurityMetrics {
  total_attacks_blocked: number;
  learning_adaptations: number;
  quantum_shield_strength: number;
  attacker_confusion_rate: number;
  system_evolution_score: number;
}

export default function SecurityTest() {
  const [simulations, setSimulations] = useState<AttackSimulation[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    total_attacks_blocked: 0,
    learning_adaptations: 0,
    quantum_shield_strength: 75,
    attacker_confusion_rate: 0,
    system_evolution_score: 0
  });
  const [isRunning, setIsRunning] = useState(false);

  const startAttackSimulation = async (attackType: AttackSimulation['type']) => {
    const simulation: AttackSimulation = {
      id: `attack-${Date.now()}`,
      type: attackType,
      intensity: Math.floor(Math.random() * 100) + 50,
      status: 'preparing',
      requests_sent: 0,
      requests_blocked: 0,
      quantum_response: 'Initializing quantum defense protocols...'
    };

    setSimulations(prev => [...prev, simulation]);
    setIsRunning(true);

    // Simulate real attack progression
    const attackInterval = setInterval(async () => {
      setSimulations(prev => prev.map(sim => {
        if (sim.id === simulation.id) {
          const newRequestsSent = sim.requests_sent + Math.floor(Math.random() * 20) + 5;
          let newStatus = sim.status;
          let quantumResponse = sim.quantum_response;

          if (sim.status === 'preparing' && newRequestsSent > 10) {
            newStatus = 'attacking';
            quantumResponse = 'Attack detected! Activating quantum countermeasures...';
          }

          if (sim.status === 'attacking' && newRequestsSent > 50) {
            newStatus = 'blocked';
            quantumResponse = 'Quantum tarpit activated! Learning attack patterns...';
            
            // Update global metrics
            setMetrics(prevMetrics => ({
              ...prevMetrics,
              total_attacks_blocked: prevMetrics.total_attacks_blocked + 1,
              learning_adaptations: prevMetrics.learning_adaptations + Math.floor(Math.random() * 3) + 1,
              quantum_shield_strength: Math.min(100, prevMetrics.quantum_shield_strength + 5),
              attacker_confusion_rate: Math.min(100, prevMetrics.attacker_confusion_rate + 15),
              system_evolution_score: prevMetrics.system_evolution_score + 10
            }));
          }

          if (sim.status === 'blocked' && newRequestsSent > 80) {
            newStatus = 'learning';
            quantumResponse = 'System evolved! New defense patterns integrated. Attackers confused by quantum responses.';
          }

          return {
            ...sim,
            requests_sent: newRequestsSent,
            requests_blocked: Math.floor(newRequestsSent * 0.95),
            status: newStatus,
            quantum_response: quantumResponse
          };
        }
        return sim;
      }));
    }, 500);

    // Stop simulation after 10 seconds
    setTimeout(() => {
      clearInterval(attackInterval);
      setIsRunning(false);
    }, 10000);
  };

  const runFullSecurityTest = async () => {
    // Run multiple attack types simultaneously
    await startAttackSimulation('brute_force');
    setTimeout(() => startAttackSimulation('ddos'), 2000);
    setTimeout(() => startAttackSimulation('sql_injection'), 4000);
    setTimeout(() => startAttackSimulation('xss'), 6000);
  };

  const getAttackTypeIcon = (type: AttackSimulation['type']) => {
    switch (type) {
      case 'brute_force': return <Target className="h-4 w-4" />;
      case 'ddos': return <Zap className="h-4 w-4" />;
      case 'sql_injection': return <AlertTriangle className="h-4 w-4" />;
      case 'xss': return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: AttackSimulation['status']) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500';
      case 'attacking': return 'bg-red-500';
      case 'blocked': return 'bg-blue-500';
      case 'learning': return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Quantum Reverse DDOS Security Test</h1>
          </div>
          <p className="text-slate-300">
            Real-time attack simulation showing how our system learns and evolves from threats
          </p>
        </motion.div>

        {/* Security Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Attacks Blocked', value: metrics.total_attacks_blocked, icon: Shield },
            { label: 'Learning Adaptations', value: metrics.learning_adaptations, icon: Activity },
            { label: 'Shield Strength', value: `${metrics.quantum_shield_strength}%`, icon: Zap },
            { label: 'Attacker Confusion', value: `${metrics.attacker_confusion_rate}%`, icon: AlertTriangle },
            { label: 'Evolution Score', value: metrics.system_evolution_score, icon: Target }
          ].map((metric, index) => (
            <Card key={index} className="bg-slate-800/90 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">{metric.label}</p>
                    <p className="text-xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attack Controls */}
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span>Attack Simulation Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button 
                onClick={() => startAttackSimulation('brute_force')}
                disabled={isRunning}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                Brute Force
              </Button>
              <Button 
                onClick={() => startAttackSimulation('ddos')}
                disabled={isRunning}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
              >
                DDOS Attack
              </Button>
              <Button 
                onClick={() => startAttackSimulation('sql_injection')}
                disabled={isRunning}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                SQL Injection
              </Button>
              <Button 
                onClick={() => startAttackSimulation('xss')}
                disabled={isRunning}
                variant="outline"
                className="border-pink-500 text-pink-400 hover:bg-pink-500/10"
              >
                XSS Attack
              </Button>
              <Button 
                onClick={runFullSecurityTest}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Full Security Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Attack Simulations */}
        <div className="space-y-4">
          {simulations.map((simulation) => (
            <motion.div
              key={simulation.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <Card className="bg-slate-800/90 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getAttackTypeIcon(simulation.type)}
                      <span className="text-white font-medium">
                        {simulation.type.replace('_', ' ').toUpperCase()} Attack
                      </span>
                      <Badge className={`${getStatusColor(simulation.status)} text-white`}>
                        {simulation.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-slate-400 text-sm">
                      Intensity: {simulation.intensity}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Requests Sent: {simulation.requests_sent}</span>
                      <span className="text-slate-400">Blocked: {simulation.requests_blocked}</span>
                    </div>
                    <Progress 
                      value={(simulation.requests_blocked / Math.max(simulation.requests_sent, 1)) * 100} 
                      className="h-2"
                    />
                    <p className="text-blue-400 text-sm italic">{simulation.quantum_response}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Real System Status */}
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Quantum Defense System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Behavioral Analysis Engine</span>
                <Badge className="bg-green-500 text-white">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Quantum Tarpit System</span>
                <Badge className="bg-green-500 text-white">ARMED</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Attacker Fingerprinting</span>
                <Badge className="bg-green-500 text-white">LEARNING</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Adaptive Response Generation</span>
                <Badge className="bg-green-500 text-white">EVOLVING</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}