import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Settings, 
  Users, 
  BarChart3, 
  Shield, 
  Database, 
  Zap, 
  Terminal,
  Brain,
  Layers
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Main dashboard overview"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Business analytics and metrics"
  },
  {
    name: "Watson Console",
    href: "/watson",
    icon: Brain,
    description: "Watson master control",
    restricted: true
  },
  {
    name: "DION NEXUS",
    href: "/dion",
    icon: Layers,
    description: "DION master console",
    restricted: true
  },
  {
    name: "Admin Panel",
    href: "/admin",
    icon: Shield,
    description: "Administrative controls"
  },
  {
    name: "User Management",
    href: "/users",
    icon: Users,
    description: "Manage system users"
  },
  {
    name: "System",
    href: "/system",
    icon: Database,
    description: "System monitoring"
  },
  {
    name: "Terminal",
    href: "/terminal",
    icon: Terminal,
    description: "Command interface"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration"
  }
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("flex flex-col w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50", className)}>
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">DWC Systems</h2>
            <p className="text-slate-400 text-xs">Quantum Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50",
                item.restricted && "border-l-2 border-yellow-500/50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
              )} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.restricted && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">DW</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">DWC Admin</p>
            <p className="text-slate-400 text-xs">Level 15 Access</p>
          </div>
        </div>
      </div>
    </div>
  );
}