import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route, useLocation } from "wouter";
import { NavigationHub } from "@/components/ui/navigation-hub";
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
import { BarChart3, Zap, Settings } from "lucide-react";

function MobileNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: BarChart3,
      active: location === "/dashboard" || location === "/dw-executive-dashboard"
    },
    { 
      path: "/nexus-observer", 
      label: "NEXUS", 
      icon: Zap,
      active: location.startsWith("/nexus")
    },
    { 
      path: "/system-logs", 
      label: "Logs", 
      icon: Settings,
      active: location === "/system-logs" || location === "/api-testing"
    },
    { 
      path: "/nexus-config", 
      label: "Config", 
      icon: Settings,
      active: location === "/nexus-config"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-emerald-500/20 lg:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center px-3 py-1 rounded-lg transition-all duration-200 ${
                item.active 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileNavigationWrapper() {
  const [location] = useLocation();
  
  // Hide mobile navigation on public landing pages
  if (location === '/' || location.startsWith('/dwc-')) {
    return null;
  }
  
  return <MobileNavigation />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900">
        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <NavigationHub />
        </div>
        
        {/* Main content area with mobile bottom padding */}
        <div className="flex-1 lg:ml-16 overflow-auto pb-20 lg:pb-0">
          <Switch>
            {/* Public Landing Page - Default Route */}
            <Route path="/" component={DWCLanding} />
            <Route path="/dwc-landing" component={DWCLanding} />
            
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
        
        {/* Mobile Navigation - Conditional rendering */}
        <MobileNavigationWrapper />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;