// Clean component without hooks to prevent React errors
function PricingStrategyEngine() {
  return (
    <div className="fixed bottom-56 right-4 z-40 bg-blue-600/20 border border-blue-500/30 p-3 rounded-lg">
      <div className="text-blue-400 font-semibold">Pricing Engine</div>
      <div className="text-xs text-gray-300 mt-1">ROI Ready</div>
    </div>
  );
}

export default PricingStrategyEngine;