// Clean component without hooks to prevent React errors
function BusinessSustainabilityTracker() {
  return (
    <div className="fixed bottom-44 right-4 z-40 bg-green-600/20 border border-green-500/30 p-3 rounded-lg">
      <div className="text-green-400 font-semibold">Sustainability</div>
      <div className="text-xs text-gray-300 mt-1">Plan Active</div>
    </div>
  );
}

export default BusinessSustainabilityTracker;