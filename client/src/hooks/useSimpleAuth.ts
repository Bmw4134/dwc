import { useState, useEffect } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  role: string | null;
}

export function useSimpleAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    username: null,
    role: null
  });

  useEffect(() => {
    // Check if user is authenticated by looking for session
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const user = await response.json();
          setAuthState({
            isLoggedIn: true,
            username: user.username,
            role: user.role
          });
        }
      } catch (error) {
        // Silent fail - user not authenticated
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
    if (data.success) {
      setAuthState({
        isLoggedIn: true,
        username: username,
        role: data.role
      });
      return { success: true, username };
    }
    
    return { success: false, message: data.message };
  };

  const logout = () => {
    setAuthState({
      isLoggedIn: false,
      username: null,
      role: null
    });
    window.location.href = '/login';
  };

  return {
    ...authState,
    login,
    logout
  };
}