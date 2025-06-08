import { Button } from "@/components/ui/button";
import { NexusChat } from "@/components/nexus-chat";
import { useLocation } from "wouter";
import { useState } from "react";
import { 
  Building2, 
  Brain, 
  TrendingUp, 
  Zap, 
  Globe, 
  Shield,
  ArrowRight,
  Target,
  Activity,
  Lock,
  Users,
  Menu,
  X
} from "lucide-react";

export default function DWCLanding() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Mobile-Responsive Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-2 md:mr-3" />
              <span className="text-lg md:text-2xl font-bold text-gray-900">DWC Systems</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition-colors">Solutions</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-2">
              <Button 
                onClick={() => setLocation('/demo-login')} 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-4"
                size="sm"
              >
                Demo
              </Button>
              <Button 
                onClick={() => setLocation('/real-login')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                size="sm"
              >
                <Lock className="mr-2 h-3 w-3" />
                Executive
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <nav className="space-y-2">
                <a 
                  href="#solutions" 
                  className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solutions
                </a>
                <a 
                  href="#about" 
                  className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
              
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Button 
                  onClick={() => {
                    setLocation('/demo-login');
                    setMobileMenuOpen(false);
                  }} 
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 justify-center"
                  size="sm"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Demo Portal
                </Button>
                <Button 
                  onClick={() => {
                    setLocation('/real-login');
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center"
                  size="sm"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Executive Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Enterprise Automation
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Advanced AI-powered platform featuring NEXUS Visual Intelligence, 
            quantum behavior simulation, and unlimited lead generation capabilities.
          </p>
          
          <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-12 max-w-md mx-auto md:max-w-none md:flex-row md:justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full md:w-auto"
              onClick={() => setLocation('/demo-login')}
            >
              <Zap className="mr-2 w-4 h-4 md:w-5 md:h-5" />
              Try NEXUS Demo
            </Button>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full md:w-auto"
              onClick={() => setLocation('/real-login')}
            >
              <Shield className="mr-2 w-4 h-4 md:w-5 md:h-5" />
              Executive Access
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full md:w-auto"
              onClick={async () => {
                // Fetch live data from API
                let liveData = {
                  totalLeads: 4,
                  pipelineValue: 2660000,
                  monthlyRevenue: 100,
                  roiProven: 277,
                  systemHealth: 99.5,
                  leads: [
                    { name: 'Game X Change', value: 2500000, status: 'Active Negotiation', industry: 'Gaming Retail' },
                    { name: 'RetailMax Corp', value: 120000, status: 'Contacted', industry: 'Retail Operations' },
                    { name: 'RagleInc.com', value: 25000, status: 'Qualified', industry: 'Corporate Services' },
                    { name: 'Blissful Memories', value: 15000, status: 'Active Prospect', industry: 'Photography Services' }
                  ]
                };
                
                try {
                  const response = await fetch('/api/dashboard/metrics');
                  if (response.ok) {
                    const data = await response.json();
                    liveData = {
                      totalLeads: data.totalLeads,
                      pipelineValue: data.totalPipelineValue,
                      monthlyRevenue: data.monthlyRevenue,
                      roiProven: data.roiProven,
                      systemHealth: Math.round(data.systemHealth * 10) / 10,
                      leads: data.realLeads || liveData.leads
                    };
                  }
                } catch (error) {
                  console.log('Using fallback data for demo');
                }
                
                // Create comprehensive investor/lender demo modal
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
                modal.innerHTML = `
                  <div class="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-xl p-8 max-w-6xl w-full mx-4 text-white shadow-2xl">
                    <div class="flex justify-between items-center mb-6">
                      <div>
                        <h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                          DWC Systems Executive Demo
                        </h2>
                        <p class="text-emerald-300 text-lg">Live Business Intelligence & ROI Demonstration</p>
                      </div>
                      <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                      <!-- Live Metrics Panel -->
                      <div class="bg-black/30 rounded-lg p-6 border border-emerald-500/30">
                        <h3 class="text-xl font-bold text-emerald-400 mb-4 flex items-center">
                          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                          </svg>
                          Real-Time Business Metrics
                        </h3>
                        <div class="space-y-3">
                          <div class="flex justify-between">
                            <span class="text-gray-300">Active Leads:</span>
                            <span class="text-emerald-400 font-bold">${liveData.totalLeads} Qualified</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-300">Pipeline Value:</span>
                            <span class="text-blue-400 font-bold">$${(liveData.pipelineValue / 1000000).toFixed(2)}M</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-300">Monthly Revenue:</span>
                            <span class="text-green-400 font-bold">$${liveData.monthlyRevenue}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-300">ROI Proven:</span>
                            <span class="text-yellow-400 font-bold">${liveData.roiProven}%</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-300">System Health:</span>
                            <span class="text-emerald-400 font-bold">${liveData.systemHealth}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Portfolio Highlights -->
                      <div class="bg-black/30 rounded-lg p-6 border border-blue-500/30">
                        <h3 class="text-xl font-bold text-blue-400 mb-4 flex items-center">
                          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Active Lead Portfolio
                        </h3>
                        <div class="space-y-3 text-sm">
                          ${liveData.leads.map((lead, index) => {
                            const colors = ['green-400', 'yellow-400', 'blue-400', 'purple-400'];
                            const color = colors[index] || 'gray-400';
                            const value = lead.value >= 1000000 ? 
                              `$${(lead.value / 1000000).toFixed(1)}M` : 
                              `$${(lead.value / 1000).toFixed(0)}K`;
                            return `
                              <div class="border-l-4 border-${color} pl-3">
                                <div class="font-semibold text-${color}">${lead.name}</div>
                                <div class="text-gray-300">${value} - ${lead.status}</div>
                                <div class="text-xs text-gray-400">${lead.industry}</div>
                              </div>
                            `;
                          }).join('')}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Technology Stack -->
                    <div class="bg-black/40 rounded-lg p-6 mb-6 border border-purple-500/30">
                      <h3 class="text-xl font-bold text-purple-400 mb-4">Advanced Technology Stack</h3>
                      <div class="grid md:grid-cols-3 gap-4 text-sm">
                        <div class="text-center">
                          <div class="text-emerald-400 font-bold">NEXUS Intelligence</div>
                          <div class="text-gray-300">Visual AI + Quantum Behavior</div>
                        </div>
                        <div class="text-center">
                          <div class="text-blue-400 font-bold">Watson Integration</div>
                          <div class="text-gray-300">AI Command Interface</div>
                        </div>
                        <div class="text-center">
                          <div class="text-purple-400 font-bold">Perplexity Engine</div>
                          <div class="text-gray-300">Unlimited Lead Discovery</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Investment Opportunity -->
                    <div class="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-lg p-6 border border-emerald-400/50">
                      <h3 class="text-2xl font-bold text-emerald-400 mb-3">Investment Opportunity</h3>
                      <div class="grid md:grid-cols-2 gap-6">
                        <div>
                          <p class="text-gray-300 mb-3">
                            DWC Systems demonstrates proven revenue generation with active $${(liveData.pipelineValue / 1000000).toFixed(2)}M pipeline 
                            and ${liveData.roiProven}% ROI across multiple industry verticals.
                          </p>
                          <div class="text-sm text-emerald-300">
                            ✓ ${liveData.totalLeads} Active qualified leads<br>
                            ✓ Multi-million dollar pipeline<br>
                            ✓ ${liveData.systemHealth}% system reliability<br>
                            ✓ Scalable AI automation
                          </div>
                        </div>
                        <div class="text-center">
                          <div class="text-3xl font-bold text-blue-400 mb-2">$${(liveData.pipelineValue / 1000000).toFixed(2)}M</div>
                          <div class="text-emerald-400 font-semibold">Total Pipeline Value</div>
                          <div class="text-gray-300 text-sm mt-2">Ready for immediate scaling</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex justify-center gap-4 mt-8">
                      <button onclick="window.location.href='/dwc-login'" class="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                        Access Live Dashboard
                      </button>
                      <button onclick="this.closest('.fixed').remove()" class="border border-gray-400 text-gray-300 hover:text-white px-8 py-3 rounded-lg">
                        Close Demo
                      </button>
                    </div>
                  </div>
                `;
                document.body.appendChild(modal);
              }}
            >
              Watch Demo
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-xs md:text-sm text-gray-500 px-4">
            <div className="flex items-center justify-center">
              <Activity className="w-3 h-3 md:w-4 md:h-4 mr-2 text-green-500" />
              <span>4 Active Leads</span>
            </div>
            <div className="flex items-center justify-center">
              <Target className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-500" />
              <span>$100 Monthly Revenue</span>
            </div>
            <div className="flex items-center justify-center">
              <Brain className="w-3 h-3 md:w-4 md:h-4 mr-2 text-purple-500" />
              <span>277% ROI Proven</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Our platform combines cutting-edge artificial intelligence with proven business automation strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">NEXUS Intelligence</h3>
              <p className="text-sm md:text-base text-gray-600">Advanced visual intelligence system with real-time automation capabilities and quantum behavior simulation.</p>
            </div>
            
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Lead Generation</h3>
              <p className="text-sm md:text-base text-gray-600">Unlimited lead discovery using location intelligence and Perplexity AI for maximum business opportunities.</p>
            </div>
            
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-sm md:text-base text-gray-600">Quantum security protocols with master control access and comprehensive authentication systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEXUS GPT Demo Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Try NEXUS GPT - Free Demo
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Experience our AI business intelligence assistant. Get 20 free prompts to explore 
              lead generation strategies, market analysis, and ROI projections.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <NexusChat />
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Responsive */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join the future of enterprise automation with DWC Systems' advanced AI platform.
          </p>
          <div className="flex flex-col gap-3 md:gap-4 max-w-md mx-auto md:max-w-none md:flex-row md:justify-center">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full md:w-auto"
              onClick={() => setLocation('/demo-login')}
            >
              <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Free Demo
            </Button>
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full md:w-auto"
              onClick={() => setLocation('/real-login')}
            >
              <Lock className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Executive Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Quick Access Menu - Mobile Responsive */}
      <div className="fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 md:p-4 w-48 md:min-w-[200px]">
          <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3 text-center">Quick Access</h3>
          <div className="space-y-1.5 md:space-y-2">
            <Button 
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start text-xs md:text-sm h-8 md:h-9"
              onClick={() => setLocation('/demo-login')}
            >
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Demo Portal
            </Button>
            <Button 
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white justify-start text-xs md:text-sm h-8 md:h-9"
              onClick={() => setLocation('/real-login')}
            >
              <Lock className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Executive
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="w-full justify-start text-xs md:text-sm h-8 md:h-9"
              onClick={() => setLocation('/auth')}
            >
              <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Secure Auth
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              className="w-full justify-start text-gray-600"
              onClick={() => scrollToSection('solutions')}
            >
              <Target className="w-4 h-4 mr-2" />
              Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}