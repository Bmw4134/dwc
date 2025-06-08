import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Brain, 
  Target, 
  FileText, 
  Camera,
  Eye,
  Settings,
  Menu,
  X,
  ChevronRight,
  Zap,
  Building,
  TrendingUp,
  Users,
  MessageSquare,
  BookOpen,
  Shield,
  Handshake
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface UnifiedNavigationProps {
  isMobile?: boolean;
  isCollapsed?: boolean;
}

export default function UnifiedNavigation({ isMobile = false, isCollapsed = false }: UnifiedNavigationProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('');
  const [dragStart, setDragStart] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Enhanced mobile touch gesture handling with better sensitivity
  const handlePanStart = useCallback((event: any, info: PanInfo) => {
    setDragStart(info.point.x);
    event.preventDefault();
  }, []);

  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const dragDistance = info.point.x - dragStart;
    const velocity = info.velocity.x;
    
    // More sensitive gesture recognition for mobile
    if (dragDistance < -50 || velocity < -300) {
      setIsOpen(false);
    } else if (dragDistance > 30 && !isOpen) {
      setIsOpen(true);
    }
    event.preventDefault();
  }, [dragStart, isOpen]);

  // Enhanced touch event handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart(touch.clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isOpen) return;
    const touch = e.touches[0];
    const dragDistance = touch.clientX - dragStart;
    
    // Close sidebar on left swipe
    if (dragDistance < -50) {
      setIsOpen(false);
    }
  }, [dragStart, isOpen]);

  // GitHub-style auto-collapse with route optimization
  useEffect(() => {
    if (isMobile && isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 100);
      return () => clearTimeout(timer);
    }
  }, [location, isMobile, isOpen]);

  // Advanced viewport management for enterprise UX
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMobile, isOpen]);

  // Enterprise touch event optimization
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isOpen && isMobile) {
        e.preventDefault();
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isOpen, isMobile]);

  const navigationSections = [
    {
      title: "Executive Command",
      items: [
        {
          href: "/",
          icon: Home,
          label: "Consulting Dashboard",
          description: "Main business overview",
          status: "active"
        },
        {
          href: "/executive", 
          icon: Eye,
          label: "Executive Dashboard",
          description: "Strategic intelligence & KPIs",
          status: "active"
        },
        {
          href: "/enterprise",
          icon: Building,
          label: "Enterprise Landing",
          description: "Billion-dollar platform showcase",
          status: "new"
        }
      ]
    },
    {
      title: "Lead-to-Deal Pipeline",
      items: [
        {
          href: "/leads",
          icon: Target,
          label: "Lead Intelligence",
          description: "AI-powered lead generation",
          status: "active"
        },
        {
          href: "/replit-leads",
          icon: Target,
          label: "Replit Lead Generator",
          description: "Autonomous web development leads",
          status: "new"
        },
        {
          href: "/proposals",
          icon: FileText,
          label: "Proposal Generator",
          description: "Automated ROI proposals",
          status: "active"
        }
      ]
    },
    {
      title: "Client Projects",
      items: [
        {
          href: "/kate-photography",
          icon: Camera,
          label: "Kate Photography",
          description: "Website consolidation project",
          status: "active"
        }
      ]
    },
    {
      title: "Advanced Modules",
      items: [
        {
          href: "/quantum-intelligence",
          icon: Brain,
          label: "Quantum Intelligence",
          description: "ASI research & optimization",
          status: "active"
        },
        {
          href: "/quantum-kaizen",
          icon: Zap,
          label: "Quantum Kaizen",
          description: "Continuous improvement engine",
          status: "active"
        },
        {
          href: "/client-automation",
          icon: Settings,
          label: "Client Automation",
          description: "Automated client dashboard creation",
          status: "active"
        },
        {
          href: "/qqasi-intelligence",
          icon: Brain,
          label: "QQASI Big Brain Intelligence",
          description: "Cutting-edge ASI vector matrices & KPIs",
          status: "bleeding-edge"
        },
        {
          href: "/pokemon-scanner",
          icon: Eye,
          label: "Pokemon Card Scanner",
          description: "Live market pricing & trade analysis",
          status: "active"
        },
        {
          href: "/pokemon-qqasi-report",
          icon: Brain,
          label: "Pokemon QQASI Report",
          description: "Enterprise negotiation power metrics",
          status: "new"
        },
        {
          href: "/pokemon-export-system",
          icon: FileText,
          label: "Pokemon Export System",
          description: "Game X Change bulk export & CSV generation",
          status: "active"
        },
        {
          href: "/corporate-pokemon-strategy",
          icon: Building,
          label: "Corporate Pokemon Strategy",
          description: "Business-level Pokemon negotiations",
          status: "active"
        },
        {
          href: "/game-x-change-corporate",
          icon: Handshake,
          label: "Game X Change Partnership",
          description: "Corporate proposal generator for immediate opportunity",
          status: "urgent"
        },
        {
          href: "/security-test",
          icon: Shield,
          label: "Cyber Security Suite",
          description: "Quantum Reverse DDOS & ASI matrix vectors",
          status: "bleeding-edge"
        },
        {
          href: "/voice-research",
          icon: MessageSquare,
          label: "Voice Lead Research",
          description: "Hands-free business analysis while driving",
          status: "new"
        },
        {
          href: "/watson/business-valuation",
          icon: TrendingUp,
          label: "Business Valuation",
          description: "Private Watson-only module",
          status: "watson-only"
        }
      ]
    },
    {
      title: "Team Collaboration",
      items: [
        {
          href: "/team/chat",
          icon: MessageSquare,
          label: "Team Chat",
          description: "Internal communication hub",
          status: "active"
        },
        {
          href: "/team/consulting",
          icon: Users,
          label: "Consulting Hub",
          description: "Client consultation management",
          status: "active"
        },
        {
          href: "/team/knowledge",
          icon: BookOpen,
          label: "Knowledge Base",
          description: "Shared documentation & resources",
          status: "active"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'development': return 'bg-yellow-500/20 text-yellow-400';
      case 'watson-only': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button - Moved to avoid conflicts */}
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-black/80 backdrop-blur-sm border border-blue-500/30 text-white hover:bg-black/90"
            size="sm"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Enterprise Mobile Navigation with Framer Motion */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 md:hidden"
              ref={constraintsRef}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Sidebar with advanced gestures */}
              <motion.div
                ref={sidebarRef}
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ 
                  type: "spring", 
                  damping: 30, 
                  stiffness: 300,
                  mass: 1
                }}
                drag="x"
                dragConstraints={{ left: -320, right: 0 }}
                dragElastic={0.1}
                onPanStart={handlePanStart}
                onPanEnd={handlePanEnd}
                className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-blue-500/30 shadow-2xl"
                style={{
                  touchAction: 'pan-x',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="h-full overflow-y-auto overscroll-contain">
                  <MobileNavigationContent 
                    sections={navigationSections}
                    location={location}
                    isActive={isActive}
                    getStatusColor={getStatusColor}
                    onNavigate={() => setIsOpen(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className={`hidden md:block fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } bg-gradient-to-b from-gray-900 to-black border-r border-blue-500/30 overflow-y-auto`}>
      <DesktopNavigationContent 
        sections={navigationSections}
        location={location}
        isActive={isActive}
        getStatusColor={getStatusColor}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}

function MobileNavigationContent({ sections, location, isActive, getStatusColor, onNavigate }: any) {
  return (
    <div className="p-6 space-y-6">
      {/* Mobile Header */}
      <div className="text-center border-b border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-white">DWC Systems</h2>
        <p className="text-blue-200 text-sm">Enterprise AI Platform</p>
      </div>

      {/* Mobile Navigation Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {section.title}
          </h3>
          
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <Link key={itemIndex} href={item.href} onClick={onNavigate}>
                <Card className={`cursor-pointer transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'bg-blue-600/20 border-blue-500/50' 
                    : 'bg-black/40 border-gray-600/30 hover:border-blue-500/30'
                }`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 ${
                        isActive(item.href) ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium text-sm ${
                            isActive(item.href) ? 'text-white' : 'text-gray-300'
                          }`}>
                            {item.label}
                          </span>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopNavigationContent({ sections, location, isActive, getStatusColor, isCollapsed }: any) {
  return (
    <div className="p-4 space-y-6">
      {/* Desktop Header */}
      <div className={`text-center border-b border-gray-700 pb-4 ${isCollapsed ? 'hidden' : ''}`}>
        <h2 className="text-xl font-bold text-white">DWC Systems</h2>
        <p className="text-blue-200 text-sm">Enterprise AI Platform</p>
      </div>

      {/* Desktop Navigation Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <Link key={itemIndex} href={item.href}>
                <div className={`group cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'bg-blue-600/20 border border-blue-500/50' 
                    : 'bg-black/40 hover:bg-gray-800/60 border border-transparent hover:border-blue-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 flex-shrink-0 ${
                      isActive(item.href) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                    }`} />
                    
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium text-sm truncate ${
                            isActive(item.href) ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {item.label}
                          </span>
                          <Badge className={`text-xs ml-2 ${getStatusColor(item.status)}`}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Stats - Desktop Only */}
      {!isCollapsed && (
        <Card className="bg-black/40 border-gray-600/30 mt-8">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Platform Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Active Modules</span>
                <span className="text-xs text-green-400">12/15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">System Health</span>
                <span className="text-xs text-green-400">98.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Pipeline Value</span>
                <span className="text-xs text-blue-400">$3.2M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}