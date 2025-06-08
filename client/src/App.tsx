import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import SimpleLanding from "./pages/simple-landing";
import DWCLogin from "./pages/dwc-login";
import DemoLogin from "./pages/demo-login";
import DemoDashboard from "./pages/demo-dashboard";
import RealLogin from "./pages/real-login";
import DWExecutiveDashboard from "./pages/dw-executive-dashboard";
import NexusObserver from "./pages/nexus-observer";
import ApiTesting from "./pages/api-testing";
import SystemLogs from "./pages/system-logs";
import NEXUSTotalRecall from "./pages/nexus-total-recall";
import NexusConfig from "./pages/nexus-config";
import WowTesterLanding from "./pages/wow-tester-landing";
import WowTesterLogin from "./pages/wow-tester-login";
import WowTesterDashboard from "./pages/wow-tester-dashboard";
import DataIntegrityPage from "./pages/DataIntegrityPage";
import QNISMasterControl from "./pages/QNISMasterControl";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Switch>
          {/* Public Landing Page - Default Route */}
          <Route path="/" component={SimpleLanding} />
          <Route path="/dwc-landing" component={SimpleLanding} />
          
          {/* Real Authentication Routes */}
          <Route path="/real-login" component={RealLogin} />
          <Route path="/auth" component={RealLogin} />
          <Route path="/secure-login" component={RealLogin} />
          
          {/* Demo Authentication Routes */}
          <Route path="/dwc-login" component={DWCLogin} />
          <Route path="/demo-login" component={DemoLogin} />
          <Route path="/login" component={DWCLogin} />
          
          {/* Demo Dashboard Access - Restricted */}
          <Route path="/demo-dashboard" component={DemoDashboard} />
          <Route path="/demo-nexus" component={DemoDashboard} />
          
          {/* Real Executive Dashboard Routes */}
          <Route path="/dw-executive-dashboard" component={DWExecutiveDashboard} />
          <Route path="/dashboard" component={DWExecutiveDashboard} />
          <Route path="/executive" component={DWExecutiveDashboard} />
          
          {/* QNIS Master Control - Primary Reasoning Engine */}
          <Route path="/qnis" component={QNISMasterControl} />
          <Route path="/qnis-master" component={QNISMasterControl} />
          <Route path="/quantum-intelligence" component={QNISMasterControl} />
          
          {/* Real NEXUS System Routes */}
          <Route path="/nexus-observer" component={NexusObserver} />
          <Route path="/nexus-config" component={NexusConfig} />
          <Route path="/nexus-total-recall" component={NEXUSTotalRecall} />
          
          {/* System Monitoring Routes */}
          <Route path="/api-testing" component={ApiTesting} />
          <Route path="/system-logs" component={SystemLogs} />
          
          {/* WOW Tester Routes */}
          <Route path="/wow-tester" component={WowTesterLanding} />
          <Route path="/wow-tester-login" component={WowTesterLogin} />
          <Route path="/wow-tester-dashboard" component={WowTesterDashboard} />
          
          {/* Data Integrity Route */}
          <Route path="/data-integrity" component={DataIntegrityPage} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;