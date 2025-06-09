import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import EnterpriseLanding from "./pages/enterprise-landing";
import DemoDashboard from "./pages/demo-dashboard";
import DWExecutiveDashboard from "./pages/dw-executive-dashboard";
import NexusObserver from "./pages/nexus-observer";
import QNISMasterControl from "./pages/QNISMasterControl";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <Switch>
          {/* Main Enterprise Landing Page */}
          <Route path="/" component={EnterpriseLanding} />
          
          {/* NEXUS GPT Demo Interface */}
          <Route path="/demo-dashboard" component={DemoDashboard} />
          <Route path="/nexus-gpt" component={DemoDashboard} />
          
          {/* Executive Dashboard */}
          <Route path="/dashboard" component={DWExecutiveDashboard} />
          <Route path="/executive" component={DWExecutiveDashboard} />
          
          {/* QNIS Master Control */}
          <Route path="/qnis" component={QNISMasterControl} />
          <Route path="/qnis-master" component={QNISMasterControl} />
          
          {/* NEXUS Observer */}
          <Route path="/nexus-observer" component={NexusObserver} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;