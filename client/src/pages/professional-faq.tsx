import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export default function ProfessionalFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqData: FAQItem[] = [
    {
      id: "platform-overview",
      question: "What makes DWC Systems LLC's platform different from traditional automation tools?",
      answer: "Our platform uniquely combines three layers of artificial intelligence: ASI (Artificial Superintelligence) for strategic decision-making, AGI (Artificial General Intelligence) for cross-domain reasoning, and specialized AI for task execution. This hierarchical approach, powered by our proprietary quantum development methodology, enables truly autonomous business operations rather than simple rule-based automation.",
      category: "platform",
      tags: ["platform", "AI", "automation", "competitive advantage"]
    },
    {
      id: "quantum-methodology",
      question: "What is quantum development methodology and how does it benefit our clients?",
      answer: "Quantum development methodology is our proprietary approach to autonomous software development using quantum-inspired algorithms. It enables real-time system health monitoring, predictive issue detection, autonomous problem resolution, and continuous self-optimization. This reduces operational overhead by 70-80% while improving system reliability and performance across all client implementations.",
      category: "technology",
      tags: ["quantum", "methodology", "autonomous", "optimization"]
    },
    {
      id: "roi-expectations",
      question: "What kind of ROI can businesses expect from implementing your automation platform?",
      answer: "Our clients typically see ROI improvements of 300-500% within the first year of implementation. This includes cost reductions through automated processes, increased efficiency, reduced human error, and enhanced decision-making capabilities. The platform pays for itself within 3-6 months for most mid-market businesses.",
      category: "business",
      tags: ["ROI", "cost savings", "efficiency", "implementation"]
    },
    {
      id: "implementation-timeline",
      question: "How long does it take to implement the platform for a typical business?",
      answer: "Implementation timelines vary based on business complexity and scope. For standard implementations: Small businesses (2-4 weeks), Mid-market companies (4-8 weeks), Enterprise deployments (8-16 weeks). Our quantum methodology enables rapid deployment with minimal disruption to existing operations.",
      category: "implementation",
      tags: ["timeline", "implementation", "deployment", "business size"]
    },
    {
      id: "pricing-structure",
      question: "What is your pricing model and what's included in each tier?",
      answer: "We offer three main tiers: Starter ($499/month) for small businesses with core automation features, Professional ($1,499/month) for mid-market companies with advanced AI capabilities, and Enterprise ($4,999/month) for large organizations with full platform access. Custom implementations range from $25K-$250K based on complexity.",
      category: "pricing",
      tags: ["pricing", "tiers", "subscription", "enterprise"]
    },
    {
      id: "data-security",
      question: "How do you ensure data security and compliance with industry regulations?",
      answer: "Our platform employs enterprise-grade security including end-to-end encryption, multi-tenant data isolation, SOC 2 compliance, GDPR compliance, and regular security audits. All data processing occurs within secure cloud infrastructure with 99.9% uptime guarantees and comprehensive backup systems.",
      category: "security",
      tags: ["security", "compliance", "encryption", "GDPR"]
    },
    {
      id: "integration-capabilities",
      question: "What systems and platforms can your solution integrate with?",
      answer: "Our API-first architecture enables integration with virtually any business system including CRM platforms (Salesforce, HubSpot), ERP systems (SAP, Oracle), accounting software (QuickBooks, NetSuite), and custom applications. We provide pre-built connectors for 200+ popular business applications.",
      category: "integration",
      tags: ["integration", "API", "CRM", "ERP", "connectivity"]
    },
    {
      id: "support-services",
      question: "What level of support and training do you provide?",
      answer: "We provide comprehensive support including dedicated client success managers for enterprise accounts, 24/7 platform monitoring, comprehensive onboarding programs, regular training sessions, and proactive optimization recommendations. Our goal is 95%+ client satisfaction with 90%+ annual renewal rates.",
      category: "support",
      tags: ["support", "training", "client success", "monitoring"]
    },
    {
      id: "scalability",
      question: "Can the platform scale as our business grows?",
      answer: "Absolutely. Our microservices architecture is designed for horizontal scaling from startup to enterprise levels. The platform automatically adjusts resources based on usage patterns and can support growth from 5 to 500+ clients on the same infrastructure without performance degradation.",
      category: "technology",
      tags: ["scalability", "growth", "microservices", "performance"]
    },
    {
      id: "competitive-moat",
      question: "How sustainable is your competitive advantage in the automation market?",
      answer: "Our competitive moat is built on proprietary quantum development methodology and multi-layer AI orchestration, protected through patents and trade secrets. We maintain an 18-24 month technology lead over competitors through continuous R&D investment and cutting-edge AI research partnerships.",
      category: "business",
      tags: ["competitive advantage", "patents", "technology lead", "moat"]
    },
    {
      id: "funding-status",
      question: "What is your current funding status and growth plans?",
      answer: "We are currently seeking $250K in Series A funding to accelerate growth and market expansion. With proven product-market fit in Fort Worth and clear path to $1M ARR within 12 months, we're positioned for significant scaling across Texas and Southwest regions.",
      category: "investment",
      tags: ["funding", "Series A", "growth", "expansion"]
    },
    {
      id: "team-expertise",
      question: "What expertise does your founding team bring to the business?",
      answer: "Brett Michael Watson (CTO) brings deep technical expertise in AI and automation systems, while Christina Carolynn Dion (CEO) provides strategic business leadership and market development experience. Together, they combine technical innovation with proven business execution capabilities.",
      category: "team",
      tags: ["founders", "expertise", "leadership", "experience"]
    },
    {
      id: "market-opportunity",
      question: "What is the market opportunity for AI automation platforms?",
      answer: "The global business automation market is projected to reach $19.6B by 2026 with 15.1% CAGR. The Texas enterprise software market represents $4.2B annually, with Fort Worth showing 23% annual automation adoption growth. We're targeting the optimal segment of mid-market businesses ready for advanced automation.",
      category: "market",
      tags: ["market size", "growth", "opportunity", "Texas"]
    },
    {
      id: "client-success-stories",
      question: "Can you share examples of successful client implementations?",
      answer: "While maintaining client confidentiality, our Fort Worth pilot clients have achieved average cost reductions of 40-60%, process efficiency improvements of 300-500%, and automation coverage of 70-80% of routine business operations. These results demonstrate consistent value delivery across diverse industries.",
      category: "results",
      tags: ["case studies", "results", "efficiency", "cost reduction"]
    },
    {
      id: "future-roadmap",
      question: "What's on your technology roadmap for the next 12-24 months?",
      answer: "Our roadmap includes advanced predictive analytics, enhanced AI model deployment, expanded industry-specific templates, enterprise-grade workflow orchestration, and strategic partnership integrations. We're also developing proprietary AI models for specialized business intelligence applications.",
      category: "roadmap",
      tags: ["roadmap", "development", "AI models", "partnerships"]
    }
  ];

  const categories = [
    { id: "all", label: "All Questions", count: faqData.length },
    { id: "platform", label: "Platform", count: faqData.filter(f => f.category === "platform").length },
    { id: "technology", label: "Technology", count: faqData.filter(f => f.category === "technology").length },
    { id: "business", label: "Business", count: faqData.filter(f => f.category === "business").length },
    { id: "implementation", label: "Implementation", count: faqData.filter(f => f.category === "implementation").length },
    { id: "pricing", label: "Pricing", count: faqData.filter(f => f.category === "pricing").length },
    { id: "security", label: "Security", count: faqData.filter(f => f.category === "security").length },
    { id: "support", label: "Support", count: faqData.filter(f => f.category === "support").length }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          ❓ DWC Systems LLC Frequently Asked Questions
        </h1>
        <p className="text-xl text-slate-600 mb-6">
          Comprehensive answers to common questions about our AI automation platform
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            📋 Quick Reference Guide
          </h2>
          <p className="text-slate-700">
            Find answers to questions about our platform capabilities, implementation process, 
            pricing structure, and business value proposition.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-slate-500">No questions found matching your search criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-lg transition-shadow">
                  <Collapsible 
                    open={openItems.includes(faq.id)}
                    onOpenChange={() => toggleItem(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {openItems.includes(faq.id) ? 
                                <ChevronDown className="h-4 w-4 text-slate-500" /> : 
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              }
                              <CardTitle className="text-lg">{faq.question}</CardTitle>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="capitalize">
                                {faq.category}
                              </Badge>
                              {faq.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent>
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">📞 Have More Questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-green-700">
            <p>
              <strong>For Technical Questions:</strong> Contact our technical team for detailed 
              discussions about platform capabilities, integration requirements, or custom development needs.
            </p>
            <p>
              <strong>For Business Inquiries:</strong> Reach out to our business development team 
              to discuss pricing, implementation timelines, and strategic partnership opportunities.
            </p>
            <p>
              <strong>For Investment Information:</strong> Connect with our executive team to 
              learn about funding opportunities, growth projections, and strategic vision.
            </p>
            <div className="bg-white p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-green-800 mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p><strong>Location:</strong> Fort Worth, Texas 76140</p>
                <p><strong>Business:</strong> DWC Systems LLC</p>
                <p><strong>Founders:</strong> Brett Michael Watson & Christina Carolynn Dion</p>
                <p><strong>Focus:</strong> Quantum-Powered AI Automation Platform</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}