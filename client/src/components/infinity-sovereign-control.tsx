// Clean infinity sovereign control component without hooks
function InfinitySovereignControl() {
  return (
    <div className="fixed bottom-32 right-4 z-40 bg-purple-600/20 border border-purple-500/30 p-3 rounded-lg">
      <div className="text-purple-400 font-semibold">Infinity Control</div>
      <div className="text-xs text-gray-300 mt-1">Sovereign Ready</div>
    </div>
  );
}

export default InfinitySovereignControl;