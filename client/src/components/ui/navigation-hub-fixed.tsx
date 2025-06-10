import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Globe, 
  Terminal, 
  Activity, 
  RefreshCw, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { useLocation } from 'wouter';

const navigationSections = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    path: '/dw-executive-dashboard',
    badge: 'LIVE'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: Activity,
    path: '/analytics',
    badge: 'NEW'
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: RefreshCw,
    path: '/automation',
    badge: null
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: Terminal,
    path: '/intelligence',
    badge: 'AI'
  },
  {
    id: 'network',
    label: 'Network',
    icon: Globe,
    path: '/network',
    badge: null
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: Monitor,
    path: '/monitoring',
    badge: null
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    badge: null
  }
];

export function NavigationHub() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [location] = useLocation();

  const isActiveSection = (path: string) => {
    return location === path || location.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-sm border-r border-green-500/20 z-50 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      {/* NEXUS Header */}
      <div className="p-4 border-b border-green-500/20">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div>
              <h1 className="text-green-300 font-bold text-lg font-mono">QNIS/PTNI</h1>
              <p className="text-green-400/70 text-xs font-mono">Intelligence Platform</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
          >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-4 space-y-2">
        {navigationSections.map((section) => {
          const Icon = section.icon;
          const isActive = isActiveSection(section.path);
          
          return (
            <button
              key={section.id}
              onClick={() => handleNavigation(section.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'text-green-400/70 hover:text-green-300 hover:bg-green-500/10'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <>
                  <span className="font-mono text-sm flex-grow text-left">
                    {section.label}
                  </span>
                  {section.badge && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"}
                      className={`text-xs ${
                        isActive 
                          ? 'bg-green-400 text-black' 
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {section.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status */}
      {isExpanded && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="text-green-400 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span>System Health:</span>
                <span className="text-green-300">98.7%</span>
              </div>
              <div className="flex justify-between">
                <span>Active Modules:</span>
                <span className="text-green-300">18/18</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-green-300">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}