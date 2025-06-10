import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import DiagnosticOverlay from "@/components/diagnostic_overlay";
import Landing from "@/pages/Landing";
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
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      },
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DiagnosticOverlay />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Landing} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/dashboard" component={AdminDashboard} />
        <Route path="/qnis" component={AdminDashboard} />
        <Route path="/watson" component={WatsonMasterConsole} />
        <Route path="/dion" component={DionMasterConsole} />
        <Route path="/nexus" component={DionMasterConsole} />
        <Route path="/intelligence" component={AdminDashboard} />
        <Route path="/analyst" component={AdminDashboard} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;