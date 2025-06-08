// Clean component without hooks to prevent React errors
function SmartWorkflowAssistant() {
  return (
    <div className="fixed top-32 right-4 z-45 bg-green-600/20 border border-green-500/30 p-4 rounded-lg">
      <div className="text-green-400 font-semibold">Smart Workflows</div>
      <div className="text-xs text-gray-300 mt-1">8.5h saved this week</div>
    </div>
  );
}

export default SmartWorkflowAssistant;