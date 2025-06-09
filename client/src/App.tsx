import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";
import MinimalLanding from "./pages/minimal-landing";
import SimpleDemo from "./pages/simple-demo";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <Switch>
          {/* Landing Page */}
          <Route path="/" component={MinimalLanding} />
          
          {/* Demo Pages */}
          <Route path="/demo" component={SimpleDemo} />
          <Route path="/nexus-gpt" component={SimpleDemo} />
          
          {/* Fallback */}
          <Route component={MinimalLanding} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}

export default App;