import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home,
  Brain,
  BarChart3,
  Eye,
  Settings,
  Zap,
  Shield,
  Users,
  Database,
  Globe,
  MessageSquare,
  TrendingUp,
  Activity,
  Target,
  Cpu,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  description?: string;
  category: "primary" | "analytics" | "tools" | "system";
}

const navigationItems: NavigationItem[] = [
  // Primary Navigation
  {
    title: "Home Dashboard",
    href: "/",
    icon: Home,
    category: "primary",
    description: "Main overview"
  },
  {
    title: "DWC Landing",
    href: "/dwc-landing",
    icon: Globe,
    category: "primary",
    description: "Landing experience"
  },
  {
    title: "Demo Portal",
    href: "/demo-login",
    icon: Shield,
    badge: "FREE",
    badgeVariant: "outline",
    category: "primary",
    description: "Free demo access"
  },

  // Analytics & Intelligence
  {
    title: "QNIS Master Control",
    href: "/qnis-master",
    icon: Brain,
    badge: "AI",
    badgeVariant: "default",
    category: "analytics",
    description: "Quantum intelligence hub"
  },
  {
    title: "Executive Dashboard",
    href: "/dw-executive-dashboard",
    icon: BarChart3,
    badge: "LIVE",
    badgeVariant: "destructive",
    category: "analytics",
    description: "Real-time metrics"
  },
  {
    title: "NEXUS Observer",
    href: "/nexus-observer",
    icon: Eye,
    category: "analytics",
    description: "System monitoring"
  },
  {
    title: "Demo Dashboard",
    href: "/demo-dashboard",
    icon: Activity,
    category: "analytics",
    description: "Demo interface"
  },

  // Tools & Features
  {
    title: "Quantum Testing",
    href: "/quantum-testing",
    icon: Zap,
    badge: "BETA",
    badgeVariant: "secondary",
    category: "tools",
    description: "Performance testing"
  },
  {
    title: "NEXUS Chat",
    href: "/nexus-chat",
    icon: MessageSquare,
    badge: "20 FREE",
    badgeVariant: "outline",
    category: "tools",
    description: "AI conversations"
  },
  {
    title: "Lead Intelligence",
    href: "/lead-dashboard",
    icon: Target,
    category: "tools",
    description: "Lead management"
  },
  {
    title: "User Management",
    href: "/user-management",
    icon: Users,
    category: "tools",
    description: "Access controls"
  },

  // System & Config
  {
    title: "System Logs",
    href: "/system-logs",
    icon: Database,
    category: "system",
    description: "System diagnostics"
  },
  {
    title: "API Testing",
    href: "/api-testing",
    icon: Cpu,
    category: "system",
    description: "API endpoints"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    category: "system",
    description: "Configuration"
  }
];

const categoryLabels = {
  primary: "Navigation",
  analytics: "Analytics & Intelligence",
  tools: "Tools & Features",
  system: "System & Configuration"
};

export function EnhancedSidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categorizedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <div className={cn(
      "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-72",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">DWC Platform</h2>
              <p className="text-xs text-gray-500">Enterprise Automation</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {Object.entries(categorizedItems).map(([category, items]) => (
            <div key={category}>
              {!isCollapsed && (
                <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={location === item.href ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start relative group transition-all duration-200",
                        isCollapsed ? "px-2" : "px-3",
                        location === item.href 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      <item.icon className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                      )} />
                      
                      {!isCollapsed && (
                        <>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item.title}</span>
                              {item.badge && (
                                <Badge 
                                  variant={item.badgeVariant || "default"}
                                  className="ml-2 text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs opacity-70 mt-0.5">{item.description}</p>
                            )}
                          </div>
                          
                          {location === item.href && (
                            <ArrowRight className="w-3 h-3 ml-2 flex-shrink-0" />
                          )}
                        </>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs opacity-75 mt-1">{item.description}</div>
                          )}
                          {item.badge && (
                            <Badge variant={item.badgeVariant || "default"} className="mt-1 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
              {category !== "system" && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>System Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>QNIS Engine</span>
              <Badge className="bg-green-600 text-xs">Active</Badge>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}