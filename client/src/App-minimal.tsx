import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Core DWC pages
import BankerLenderLanding from "./pages/banker-lender-landing";
import ConsultingDashboard from "./pages/consulting-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BankerLenderLanding} />
      <Route path="/dashboard" component={ConsultingDashboard} />
      <Route>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">DWC Systems LLC</h1>
            <p className="text-xl">Professional Consulting Automation Platform</p>
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
    </QueryClientProvider>
  );
}

export default App;