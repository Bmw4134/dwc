// Clean component without hooks to prevent React errors
function KaizenIntelligenceOverlay() {
  return (
    <div className="fixed top-20 right-4 z-50 bg-purple-600/20 border border-purple-500/30 p-4 rounded-lg">
      <div className="text-purple-400 font-semibold">QQQ Intelligence</div>
      <div className="text-xs text-gray-300 mt-1">Transcendence: 84.2%</div>
    </div>
  );
}

export default KaizenIntelligenceOverlay;