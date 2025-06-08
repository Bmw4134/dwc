// Clean component without hooks to prevent React errors
function LayerChartDashboard() {
  return (
    <div className="fixed top-4 right-4 z-40 bg-purple-600/20 border border-purple-500/30 p-3 rounded-lg">
      <div className="text-purple-400 font-semibold">Layer Analytics</div>
      <div className="text-xs text-gray-300 mt-1">System Ready</div>
    </div>
  );
}

export default LayerChartDashboard;