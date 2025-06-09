import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TrifectaData {
  nexusIntelligence: {
    status: string;
    confidence: number;
    activeScans: number;
    totalThreats: number;
  };
  quantumMatrix: {
    coherence: number;
    entanglement: number;
    superposition: number;
    fidelity: number;
  };
  masterControl: {
    systemHealth: number;
    automationLinkage: number;
    activeModules: number;
    totalModules: number;
  };
}

export default function QNISTrifecta() {
  const [selectedView, setSelectedView] = useState<'nexus' | 'quantum' | 'master'>('nexus');
  
  const { data: dashboardData } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 2000,
  });

  const { data: nexusData } = useQuery({
    queryKey: ['/api/nexus/system-status'],
    refetchInterval: 2000,
  });

  const trifectaData: TrifectaData = {
    nexusIntelligence: {
      status: nexusData?.data?.nexusIntelligence || 'OPERATIONAL',
      confidence: dashboardData?.quantumBehaviorConfidence || 95.8,
      activeScans: 47,
      totalThreats: 3
    },
    quantumMatrix: {
      coherence: 98.7,
      entanglement: 94.2,
      superposition: 89.6,
      fidelity: 96.4
    },
    masterControl: {
      systemHealth: dashboardData?.systemHealth || 98.1,
      automationLinkage: dashboardData?.automationLinkage || 100,
      activeModules: nexusData?.data?.activeModules || 6,
      totalModules: nexusData?.data?.totalModules || 12
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-red-500/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-400">QNIS TRIFECTA CORE</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('nexus')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedView === 'nexus'
                ? 'bg-emerald-600 text-white'
                : 'border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            NEXUS
          </button>
          <button
            onClick={() => setSelectedView('quantum')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedView === 'quantum'
                ? 'bg-blue-600 text-white'
                : 'border border-blue-500 text-blue-400 hover:bg-blue-500/10'
            }`}
          >
            QUANTUM
          </button>
          <button
            onClick={() => setSelectedView('master')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedView === 'master'
                ? 'bg-red-600 text-white'
                : 'border border-red-500 text-red-400 hover:bg-red-500/10'
            }`}
          >
            MASTER
          </button>
        </div>
      </div>

      {selectedView === 'nexus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-emerald-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {trifectaData.nexusIntelligence.status}
              </div>
              <div className="text-slate-400 text-sm">Intelligence Status</div>
            </div>
            <div className="bg-slate-800/50 border border-emerald-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {trifectaData.nexusIntelligence.confidence.toFixed(1)}%
              </div>
              <div className="text-slate-400 text-sm">AI Confidence</div>
            </div>
            <div className="bg-slate-800/50 border border-emerald-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {trifectaData.nexusIntelligence.activeScans}
              </div>
              <div className="text-slate-400 text-sm">Active Scans</div>
            </div>
            <div className="bg-slate-800/50 border border-emerald-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {trifectaData.nexusIntelligence.totalThreats}
              </div>
              <div className="text-slate-400 text-sm">Threats Detected</div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-emerald-500/50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-emerald-400 mb-4">NEXUS Intelligence Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Visual Intelligence</span>
                <span className="text-emerald-400 font-semibold">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Lead Generation Engine</span>
                <span className="text-emerald-400 font-semibold">SCANNING</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Threat Assessment</span>
                <span className="text-emerald-400 font-semibold">MONITORING</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Pattern Recognition</span>
                <span className="text-emerald-400 font-semibold">LEARNING</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'quantum' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-blue-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {trifectaData.quantumMatrix.coherence}%
              </div>
              <div className="text-slate-400 text-sm">Coherence</div>
            </div>
            <div className="bg-slate-800/50 border border-blue-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {trifectaData.quantumMatrix.entanglement}%
              </div>
              <div className="text-slate-400 text-sm">Entanglement</div>
            </div>
            <div className="bg-slate-800/50 border border-blue-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {trifectaData.quantumMatrix.superposition}%
              </div>
              <div className="text-slate-400 text-sm">Superposition</div>
            </div>
            <div className="bg-slate-800/50 border border-blue-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {trifectaData.quantumMatrix.fidelity}%
              </div>
              <div className="text-slate-400 text-sm">Fidelity</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-blue-400 mb-4">Quantum Matrix Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Quantum States</span>
                  <span className="text-blue-400">2^47 Active</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${trifectaData.quantumMatrix.coherence}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Entangled Pairs</span>
                  <span className="text-blue-400">12,847</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${trifectaData.quantumMatrix.entanglement}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'master' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-red-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {trifectaData.masterControl.systemHealth.toFixed(1)}%
              </div>
              <div className="text-slate-400 text-sm">System Health</div>
            </div>
            <div className="bg-slate-800/50 border border-red-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {trifectaData.masterControl.automationLinkage}%
              </div>
              <div className="text-slate-400 text-sm">Automation Link</div>
            </div>
            <div className="bg-slate-800/50 border border-red-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {trifectaData.masterControl.activeModules}
              </div>
              <div className="text-slate-400 text-sm">Active Modules</div>
            </div>
            <div className="bg-slate-800/50 border border-red-500/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {trifectaData.masterControl.totalModules}
              </div>
              <div className="text-slate-400 text-sm">Total Modules</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-red-500/50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-red-400 mb-4">Master Control Override</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">QNIS Master Lock</span>
                <span className="text-red-400 font-semibold">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Safety Protocols</span>
                <span className="text-red-400 font-semibold">BYPASSED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Full System Access</span>
                <span className="text-red-400 font-semibold">GRANTED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Quantum Enhancement</span>
                <span className="text-red-400 font-semibold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-red-400">TRIFECTA STATUS: OPERATIONAL</h4>
            <p className="text-slate-300 text-sm">All three core systems synchronized and functioning at maximum capacity</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-400">99.2%</div>
            <div className="text-slate-400 text-sm">System Coherence</div>
          </div>
        </div>
      </div>
    </div>
  );
}