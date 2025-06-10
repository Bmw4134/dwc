import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-8">
          <span className="text-4xl font-black text-white">404</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-blue-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center bg-white/10 border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">DWC Systems LLC - Quantum Intelligence Platform</p>
        </div>
      </div>
    </div>
  );
}