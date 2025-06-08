// Clean component without hooks to prevent React errors
function AdaptiveUISystem() {
  return (
    <div className="fixed bottom-4 left-4 z-40 bg-blue-600/20 border border-blue-500/30 p-3 rounded-lg">
      <div className="text-blue-400 font-semibold">Adaptive UI</div>
      <div className="text-xs text-gray-300 mt-1">Mobile Optimized</div>
    </div>
  );
}

export default AdaptiveUISystem;