export function useAuth() {
  return {
    user: { username: "authenticated", role: "user" },
    isLoading: false,
    isAuthenticated: true,
    error: null
  };
}