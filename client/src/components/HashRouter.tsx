import { useState, useEffect } from "react";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import LoginPage from "@/pages/LoginPage";
import WatsonMasterConsole from "@/pages/WatsonMasterConsole";
import DionMasterConsole from "@/pages/DionMasterConsole";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

export function HashRouter() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple hash-based routing without loops
  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return <Home />;
      case '/login':
        return <LoginPage />;
      case '/admin':
      case '/qnis':
        return <AdminDashboard />;
      case '/watson':
        return <WatsonMasterConsole />;
      case '/dion':
      case '/nexus':
        return <DionMasterConsole />;
      case '/settings':
        return <Settings />;
      default:
        return <NotFound />;
    }
  };

  return renderRoute();
}

// Navigation helper function
export const navigateTo = (path: string) => {
  window.location.hash = path;
};