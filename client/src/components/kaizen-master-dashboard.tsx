// Clean kaizen master dashboard component without hooks
function KaizenMasterDashboard() {
  return (
    <div className="fixed bottom-24 right-4 z-40 bg-blue-600/20 border border-blue-500/30 p-3 rounded-lg">
      <div className="text-blue-400 font-semibold">Kaizen Deploy</div>
      <div className="text-xs text-gray-300 mt-1">Uniform Ready</div>
    </div>
  );
}

export default KaizenMasterDashboard;