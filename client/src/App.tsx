import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import GlobalRouter from "./components/GlobalRouter";
import { Switch, Route, useLocation } from "wouter";
import { NavigationHub } from "@/components/ui/navigation-hub";
import DWCLanding from "./pages/dwc-landing";
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
import NotFound from "./pages/not-found";
import { BarChart3, Zap, Settings, Menu } from "lucide-react";

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
      icon: Menu,
      active: location === "/nexus-config"
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-emerald-500/30 p-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 touch-manipulation
                min-h-[44px] min-w-[44px] active:scale-95 active:bg-slate-800/50
                ${item.active 
                  ? 'text-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }
              `}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <IconComponent size={16} className="mb-1" />
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [location] = useLocation();
  
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
            
            {/* Real NEXUS System Routes */}
            <Route path="/nexus-observer" component={NexusObserver} />
            <Route path="/nexus-dashboard" component={NexusObserver} />
            <Route path="/nexus-master-control" component={NexusObserver} />
            <Route path="/nexus" component={NexusObserver} />
            
            {/* Real System Administration Routes */}
            <Route path="/api-testing" component={ApiTesting} />
            <Route path="/system-logs" component={SystemLogs} />
            <Route path="/admin" component={SystemLogs} />
            <Route path="/logs" component={SystemLogs} />
            
            {/* Real Advanced Configuration Routes */}
            <Route path="/nexus-total-recall" component={NEXUSTotalRecall} />
            <Route path="/nexus-config" component={NexusConfig} />
            <Route path="/config" component={NexusConfig} />
            
            {/* WOW Tester Routes */}
            <Route path="/wow-tester-join" component={WowTesterLanding} />
            <Route path="/wow-tester-login" component={WowTesterLogin} />
            <Route path="/wow-tester-dashboard" component={WowTesterDashboard} />
            
            <Route component={NotFound} />
          </Switch>
        </div>
        
        {/* Mobile Navigation - Hide on public landing pages */}
        {location !== '/' && !location.startsWith('/dwc-') && <MobileNavigation />}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;