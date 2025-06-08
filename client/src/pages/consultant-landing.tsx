import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Zap, TrendingUp, Shield, ArrowRight, Phone, Mail } from 'lucide-react';

interface ConsultantLandingProps {
  refreshTrigger: number;
}

export default function ConsultantLanding({ refreshTrigger }: ConsultantLandingProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactEmail: '',
    phoneNumber: '',
    message: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const consultationRequest = {
      ...formData,
      selectedService: 'automation_consultation',
      timestamp: new Date().toISOString(),
      source: 'consultant_landing',
      industry: 'technology',
      address: 'Fort Worth, TX',
      zipCode: '76140'
    };

    try {
      const response = await fetch('/api/consultation/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationRequest)
      });

      if (response.ok) {
        alert('Consultation request submitted! We\'ll contact you within 24 hours.');
        setFormData({
          businessName: '',
          contactEmail: '',
          phoneNumber: '',
          message: ''
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Please try again or contact us directly.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-orange-400" />
              <div>
                <h1 className="text-2xl font-bold">DWC Systems LLC</h1>
                <p className="text-slate-300">Quantum AGI Architects</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>817-995-3894</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>bm.watson34@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ASI → AGI → AI Complete Intelligence Hierarchy
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Enterprise AI Automation
              <span className="block text-orange-600">for Fort Worth Businesses</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              DWC Systems delivers ASI-first automation with AGI reasoning and AI foundation layers.
              Achieve quantum leap efficiency gains in 6-12 weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">$50K - $200K</h3>
              <p className="text-slate-600 text-sm">Annual Savings</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">6-12 Weeks</h3>
              <p className="text-slate-600 text-sm">Implementation</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">ASI Powered</h3>
              <p className="text-slate-600 text-sm">Autonomous Intelligence</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Fort Worth</h3>
              <p className="text-slate-600 text-sm">Local Expertise</p>
            </div>
          </div>

          <Button 
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
          >
            Get Free ASI Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Choose Your Competitive Advantage
            </h2>
            <p className="text-xl text-slate-600">
              Each service is designed to catapult your business into the future with ASI-enhanced capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  ASI-Powered Complete Automation
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-orange-600 font-semibold">Starting at $25,000</span>
                  <span className="text-slate-600">6-12 weeks</span>
                </div>
                <ul className="space-y-3 text-slate-600 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span>ASI autonomous decision-making across all processes</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span>AGI cross-domain reasoning and optimization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span>AI foundation layer for data processing</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span>Real-time predictive analytics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <span>Continuous ASI learning and adaptation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  ASI Executive Dashboard Modernization
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-blue-600 font-semibold">Starting at $15,000</span>
                  <span className="text-slate-600">4-8 weeks</span>
                </div>
                <ul className="space-y-3 text-slate-600 mb-8">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span>Real-time ASI performance analytics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span>Predictive business intelligence</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span>Automated strategic recommendations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span>Cross-functional AGI insights</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span>Executive-level ASI reporting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Get Free ASI Assessment</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
                <Textarea
                  placeholder="Tell us about your automation needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                />
                
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Request Assessment
                </Button>
              </form>
              
              <div className="text-center mt-4">
                <p className="text-sm text-slate-600">
                  We'll analyze your business and show you exactly how to achieve quantum leap results
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-6 w-6 text-orange-400" />
            <span className="text-xl font-bold">DWC Systems LLC</span>
          </div>
          <p className="text-slate-400 mb-4">
            Quantum AGI Architects delivering ASI-first automation solutions
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <span>Fort Worth, TX 76140</span>
            <span>817-995-3894</span>
            <span>bm.watson34@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}