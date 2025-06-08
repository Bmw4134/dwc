import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPortal: 'executive' | 'operational';
  onPortalChange: (portal: 'executive' | 'operational') => void;
}

export function Sidebar({ currentPortal, onPortalChange }: SidebarProps) {
  const [location] = useLocation();

  // Executive Portal - Strategic Decision Making & Business Intelligence
  const executiveNavItems = [
    {
      section: "Strategic Intelligence",
      items: [
        { href: "/", icon: "fas fa-chart-line", label: "Executive Dashboard", active: location === "/" },
        { href: "/intelligence-hierarchy", icon: "fas fa-brain", label: "ASI → AGI → AI Command", active: location === "/intelligence-hierarchy" },
        { href: "/asi-display-simulator", icon: "fas fa-desktop", label: "ASI Display Simulator", active: location === "/asi-display-simulator" },
        { href: "/financial-command-center", icon: "fas fa-university", label: "Financial Command Center", active: location === "/financial-command-center" },
        { href: "/market-research", icon: "fas fa-globe-americas", label: "Market Intelligence", active: location === "/market-research" },
        { href: "/financial-forecasting", icon: "fas fa-chart-area", label: "Revenue Forecasting", active: location === "/financial-forecasting" },
      ]
    },
    {
      section: "Business Growth",
      items: [
        { href: "/lead-intelligence", icon: "fas fa-crosshairs", label: "Lead Intelligence", active: location === "/lead-intelligence" },
        { href: "/roi-calculator", icon: "fas fa-calculator", label: "ROI Calculator", active: location === "/roi-calculator" },
        { href: "/consultant-landing", icon: "fas fa-crown", label: "Client Acquisition", active: location === "/consultant-landing" },
        { href: "/mission-control", icon: "fas fa-satellite", label: "Mission Control", active: location === "/mission-control" },
      ]
    },
    {
      section: "Strategic Automation",
      items: [
        { href: "/llc-automation", icon: "fas fa-building", label: "Business Formation", active: location === "/llc-automation" },
        { href: "/automation-builder", icon: "fas fa-magic", label: "Strategy Automation", active: location === "/automation-builder" },
        { href: "/evolver", icon: "fas fa-dna", label: "Business Evolution", active: location === "/evolver" },
      ]
    },
    {
      section: "Phase 2 Trillion Trading",
      items: [
        { href: "/kaizen-phase2-trillion", icon: "fas fa-rocket", label: "Kaizen Phase 2 Trillion", active: location === "/kaizen-phase2-trillion" },
        { href: "/quantum-trading-agent", icon: "fas fa-chart-line", label: "Quantum Trading Agent", active: location === "/quantum-trading-agent" },
        { href: "/personal-credit-maximization", icon: "fas fa-credit-card", label: "Credit Maximization", active: location === "/personal-credit-maximization" },
      ]
    }
  ];

  // Operational Portal - Daily Tasks & Christina's Management
  const operationalNavItems = [
    {
      section: "Daily Operations",
      items: [
        { href: "/", icon: "fas fa-tasks", label: "Operations Dashboard", active: location === "/" },
        { href: "/business-file-system", icon: "fas fa-folder-open", label: "Document Management", active: location === "/business-file-system" },
        { href: "/email-dns-automation", icon: "fas fa-envelope", label: "Email & Communication", active: location === "/email-dns-automation" },
        { href: "/client-portal", icon: "fas fa-users", label: "Client Management", active: location === "/client-portal" },
        { href: "/puppeteer-viewer", icon: "fas fa-eye", label: "Automation Monitor", active: location === "/puppeteer-viewer" },
      ]
    },
    {
      section: "Task Management",
      items: [
        { href: "/task-tracker", icon: "fas fa-clipboard-check", label: "Daily Tasks", active: location === "/task-tracker" },
        { href: "/quickbooks-sync", icon: "fas fa-calculator", label: "Bookkeeping Sync", active: location === "/quickbooks-sync" },
        { href: "/ein-pipeline", icon: "fas fa-id-card", label: "EIN Pipeline", active: location === "/ein-pipeline" },
        { href: "/tax-preparation", icon: "fas fa-receipt", label: "Tax Document Prep", active: location === "/tax-preparation" },
      ]
    },
    {
      section: "Workflow Automation",
      items: [
        { href: "/workflow-builder", icon: "fas fa-sitemap", label: "Process Builder", active: location === "/workflow-builder" },
        { href: "/calendar-integration", icon: "fas fa-calendar", label: "Calendar Management", active: location === "/calendar-integration" },
        { href: "/sms-automation", icon: "fas fa-sms", label: "SMS Communication", active: location === "/sms-automation" },
        { href: "/lead-processing", icon: "fas fa-funnel-dollar", label: "Lead Processing", active: location === "/lead-processing" },
      ]
    }
  ];

  const navItems = currentPortal === 'executive' ? executiveNavItems : operationalNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">DW AI Platform</h1>
            <p className="text-sm text-slate-500">Enterprise Edition</p>
          </div>
        </div>

        {/* Portal Switcher */}
        <div className="mb-6">
          <div className="bg-slate-100 rounded-lg p-1 flex">
            <button
              onClick={() => onPortalChange('executive')}
              className={cn(
                "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                currentPortal === 'executive'
                  ? "text-white bg-primary"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Executive Portal
            </button>
            <button
              onClick={() => onPortalChange('operational')}
              className={cn(
                "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                currentPortal === 'operational'
                  ? "text-white bg-primary"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Operational Portal
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          {navItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                {section.section}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                        item.active
                          ? "text-primary bg-blue-50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i className="fas fa-crown text-white"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">DWC Systems LLC</p>
              <p className="text-xs text-slate-500">Quantum AGI Architects</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
