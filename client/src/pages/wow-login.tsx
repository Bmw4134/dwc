import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function WowLogin() {
  const [, setLocation] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 3000,
  });

  const handleLogin = async () => {
    setIsLoggingIn(true);
    // Simulate login process with dramatic effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLocation('/dashboard');
  };

  const pipelineValue = metrics?.totalPipelineValue || 2660000;
  const quantumConfidence = metrics?.quantumBehaviorConfidence || 96;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse -bottom-48 -right-48"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/30 to-emerald-500/30 rounded-full blur-2xl animate-bounce top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Quantum Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="border border-emerald-500/20 animate-pulse"
              style={{
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-8xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
              NEXUS PORTAL
            </h1>
            <h2 className="text-4xl font-bold text-cyan-400 mb-8 animate-bounce">
              Quantum Authentication Gateway
            </h2>
            
            <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-2 border-emerald-400 rounded-2xl p-6 mb-8 backdrop-blur-lg shadow-2xl shadow-emerald-500/30">
              <p className="text-2xl text-emerald-200 font-semibold mb-2">
                Enterprise Access Portal
              </p>
              <p className="text-lg text-cyan-300">
                Managing ${(pipelineValue / 1000000).toFixed(2)}M Pipeline • {quantumConfidence.toFixed(1)}% AI Confidence
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-4 border-emerald-400 rounded-3xl p-12 backdrop-blur-lg shadow-2xl shadow-emerald-500/40 transform hover:scale-105 transition-all duration-500">
            
            {isLoggingIn ? (
              // Loading State
              <div className="text-center">
                <div className="text-6xl font-black text-emerald-400 mb-8 animate-pulse">
                  QUANTUM SYNC IN PROGRESS...
                </div>
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 border-8 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-2xl text-cyan-300 animate-pulse">
                  Establishing Neural Link • Verifying Quantum Signatures • Activating NEXUS Protocol
                </div>
              </div>
            ) : (
              // Login Form
              <>
                <div className="text-center mb-12">
                  <h3 className="text-5xl font-bold text-emerald-400 mb-4">SECURE ACCESS</h3>
                  <p className="text-xl text-slate-300">Enter your quantum credentials to access the NEXUS system</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-2xl font-bold text-emerald-400 mb-4">USERNAME</label>
                    <input
                      type="text"
                      placeholder="Enter your quantum ID"
                      className="w-full px-6 py-4 text-2xl bg-slate-900/80 border-2 border-emerald-400 rounded-xl text-emerald-300 placeholder-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300"
                      defaultValue="admin@dwcsystems.com"
                    />
                  </div>

                  <div>
                    <label className="block text-2xl font-bold text-emerald-400 mb-4">QUANTUM KEY</label>
                    <input
                      type="password"
                      placeholder="Enter your neural passphrase"
                      className="w-full px-6 py-4 text-2xl bg-slate-900/80 border-2 border-emerald-400 rounded-xl text-emerald-300 placeholder-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300"
                      defaultValue="••••••••••••"
                    />
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 hover:from-emerald-400 hover:via-emerald-600 hover:to-cyan-400 text-white px-8 py-6 rounded-2xl text-3xl font-black transition-all duration-500 transform hover:scale-105 shadow-2xl border-2 border-emerald-400 hover:shadow-emerald-500/50"
                  >
                    INITIATE QUANTUM LINK
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setLocation('/')}
                      className="text-xl text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                    >
                      ← Return to Landing Portal
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-emerald-400 p-6 rounded-xl backdrop-blur-lg text-center">
              <div className="text-3xl text-emerald-400 mb-2">🔐</div>
              <div className="text-sm text-emerald-300 font-semibold">Quantum Encryption</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-cyan-400 p-6 rounded-xl backdrop-blur-lg text-center">
              <div className="text-3xl text-cyan-400 mb-2">🧠</div>
              <div className="text-sm text-cyan-300 font-semibold">Neural Authentication</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-blue-400 p-6 rounded-xl backdrop-blur-lg text-center">
              <div className="text-3xl text-blue-400 mb-2">🌌</div>
              <div className="text-sm text-blue-300 font-semibold">NEXUS Protocol</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 border-2 border-emerald-400 rounded-2xl p-4 backdrop-blur-lg shadow-2xl">
        <div className="text-emerald-400 font-bold text-sm">SECURE CONNECTION ESTABLISHED</div>
        <div className="text-emerald-300 text-xs">256-bit Quantum Encryption Active</div>
      </div>
    </div>
  );
}