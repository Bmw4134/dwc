// Clean watson command console component without hooks
function WatsonCommandConsole() {
  return (
    <div className="fixed bottom-16 right-4 z-40 bg-green-600/20 border border-green-500/30 p-3 rounded-lg">
      <div className="text-green-400 font-semibold">Watson Console</div>
      <div className="text-xs text-gray-300 mt-1">Command Ready</div>
    </div>
  );
}

export default WatsonCommandConsole;