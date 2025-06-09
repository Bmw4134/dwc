import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import CleanLanding from "./pages/clean-landing";
import WorkingLanding from "./pages/working-landing";
import WowLanding from "./pages/wow-landing";
import WowLogin from "./pages/wow-login";
import WowDashboard from "./pages/wow-dashboard";
import EnterpriseCheckout from "./pages/enterprise-checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WowLanding} />
      <Route path="/clean" component={CleanLanding} />
      <Route path="/working" component={WorkingLanding} />
      <Route path="/login" component={WowLogin} />
      <Route path="/dashboard" component={WowDashboard} />
      <Route path="/checkout" component={EnterpriseCheckout} />
      <Route>
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-purple-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;