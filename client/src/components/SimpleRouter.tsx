import { useState, useEffect } from "react";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import LoginPage from "@/pages/LoginPage";
import WatsonMasterConsole from "@/pages/WatsonMasterConsole";
import DionMasterConsole from "@/pages/DionMasterConsole";

export function SimpleRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  // Simple path matching without loops
  switch (currentPath) {
    case '/login':
      return <LoginPage />;
    case '/watson':
      return <WatsonMasterConsole />;
    case '/dion':
    case '/nexus':
      return <DionMasterConsole />;
    case '/admin':
    case '/qnis':
      return <AdminDashboard />;
    case '/':
      return <Home />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black text-white mb-4">Page Not Found</h1>
            <p className="text-cyan-400 mb-6">The requested page does not exist.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
  }
}