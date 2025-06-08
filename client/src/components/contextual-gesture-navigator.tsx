// Clean component without hooks to prevent React errors
function ContextualGestureNavigator() {
  return (
    <div className="fixed bottom-20 left-4 z-40 bg-indigo-600/20 border border-indigo-500/30 p-3 rounded-lg">
      <div className="text-indigo-400 font-semibold">Gesture Nav</div>
      <div className="text-xs text-gray-300 mt-1">Touch Ready</div>
    </div>
  );
}

export default ContextualGestureNavigator;