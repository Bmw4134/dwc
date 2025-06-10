import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const [, navigate] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');
      
      if (!token || !username) {
        navigate('/login');
        return;
      }

      // Check if user has access to this specific console
      if (requiredRole && username !== requiredRole) {
        navigate('/admin');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, requiredRole]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authenticating</h2>
          <p className="text-blue-400">DWC Systems LLC - Verifying Access</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}