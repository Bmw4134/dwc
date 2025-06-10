import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string);
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("401: Unauthorized");
          }
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-black text-white mb-4">Page Not Found</h1>
              <p className="text-cyan-400 mb-6">The requested page does not exist.</p>
              <a href="/" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200">
                Return to Dashboard
              </a>
            </div>
          </div>
        </Route>
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;