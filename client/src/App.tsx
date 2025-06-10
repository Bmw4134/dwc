import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import LoginPage from "@/pages/LoginPage";
import WatsonMasterConsole from "@/pages/WatsonMasterConsole";
import DionMasterConsole from "@/pages/DionMasterConsole";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

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
        <Route path="/login" component={LoginPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/qnis" component={AdminDashboard} />
        <Route path="/watson" component={WatsonMasterConsole} />
        <Route path="/dion" component={DionMasterConsole} />
        <Route path="/nexus" component={DionMasterConsole} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;