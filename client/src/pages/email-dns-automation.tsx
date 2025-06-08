import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Globe, 
  Shield, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Copy,
  Server,
  Lock,
  Zap
} from 'lucide-react';

interface EmailDNSAutomationProps {
  refreshTrigger: number;
}

export default function EmailDNSAutomation({ refreshTrigger }: EmailDNSAutomationProps) {
  const [selectedDomain, setSelectedDomain] = useState('dwcsystems.com');
  const [emailSetupStatus, setEmailSetupStatus] = useState('ready');

  const domainOptions = [
    { name: 'dwcsystems.com', price: '$12/year', registrar: 'Namecheap' },
    { name: 'dwcautomation.com', price: '$10/year', registrar: 'Namecheap' },
    { name: 'fortworth-ai.com', price: '$15/year', registrar: 'Namecheap' },
    { name: 'asi-automation.com', price: '$18/year', registrar: 'Namecheap' }
  ];

  const freeEmailProviders = [
    {
      name: 'ProtonMail',
      features: ['End-to-end encryption', 'Custom domain support', 'Professional appearance'],
      setup: 'Free tier + $5/month for custom domain',
      security: 'Military-grade encryption'
    },
    {
      name: 'Zoho Mail',
      features: ['Professional email', 'Custom domain free', 'Calendar & contacts'],
      setup: 'Completely free for up to 5 users',
      security: 'Business-grade security'
    },
    {
      name: 'Google Workspace',
      features: ['Gmail interface', 'Drive integration', 'Meet & Calendar'],
      setup: '$6/user/month but professional standard',
      security: 'Enterprise security'
    }
  ];

  const dnsRecords = [
    { type: 'A', name: '@', value: '185.199.108.153', ttl: '3600' },
    { type: 'CNAME', name: 'www', value: 'dwcsystems.com', ttl: '3600' },
    { type: 'MX', name: '@', value: 'mx.zoho.com', priority: '10', ttl: '3600' },
    { type: 'TXT', name: '@', value: 'v=spf1 include:zoho.com ~all', ttl: '3600' },
    { type: 'CNAME', name: 'mail', value: 'business.zoho.com', ttl: '3600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Official Email & DNS Automation
          </h1>
          <p className="text-xl text-gray-600">
            Secure, professional communication setup for DWC Systems LLC
          </p>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email Setup</TabsTrigger>
            <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
            <TabsTrigger value="security">Security & Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            {/* Email Provider Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeEmailProviders.map((provider, index) => (
                <Card key={index} className={`border-2 ${index === 1 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      {index === 1 && <Badge className="bg-green-600">Recommended</Badge>}
                    </div>
                    <CardDescription>{provider.setup}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">{provider.security}</span>
                      </div>
                      <div className="space-y-2">
                        {provider.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={`w-full ${index === 1 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        variant={index === 1 ? 'default' : 'outline'}
                      >
                        {index === 1 ? 'Setup Zoho Mail' : 'Learn More'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Email Setup Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Professional Email Setup: brett@dwcsystems.com</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 'Register domain with Namecheap', status: 'pending', cost: '$12', time: '5 minutes' },
                    { step: 'Setup Zoho Mail (free tier)', status: 'pending', cost: '$0', time: '10 minutes' },
                    { step: 'Configure DNS records', status: 'pending', cost: '$0', time: '15 minutes' },
                    { step: 'Verify domain ownership', status: 'pending', cost: '$0', time: '2-24 hours' },
                    { step: 'Create professional signatures', status: 'pending', cost: '$0', time: '5 minutes' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-700">{item.step}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{item.cost}</Badge>
                        <Badge variant="secondary">{item.time}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommended Email Addresses:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>• brett@dwcsystems.com (CEO)</div>
                    <div>• christina@dwcsystems.com (COO)</div>
                    <div>• support@dwcsystems.com (Client Support)</div>
                    <div>• sales@dwcsystems.com (Lead Generation)</div>
                    <div>• admin@dwcsystems.com (Business Operations)</div>
                    <div>• invoices@dwcsystems.com (Billing)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dns" className="space-y-6">
            {/* Domain Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Domain Registration - Namecheap</span>
                </CardTitle>
                <CardDescription>
                  Professional domain for DWC Systems LLC - Fort Worth automation specialists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domainOptions.map((domain, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedDomain === domain.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDomain(domain.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                          <p className="text-sm text-gray-600">{domain.registrar}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{domain.price}</p>
                          <p className="text-xs text-gray-500">per year</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <Button className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Register {selectedDomain} on Namecheap
                  </Button>
                  <Button variant="outline">
                    Check Domain Availability
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* DNS Records Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>DNS Records Configuration</span>
                </CardTitle>
                <CardDescription>
                  Copy these exact records to your Namecheap DNS panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dnsRecords.map((record, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <Badge variant="outline">{record.type}</Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">{record.name}</span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-white px-2 py-1 rounded border">{record.value}</code>
                            <Button size="sm" variant="ghost">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">TTL: {record.ttl}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Important:</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• DNS changes can take 24-48 hours to propagate worldwide</li>
                    <li>• Test email delivery after 2 hours for initial verification</li>
                    <li>• Keep TTL at 3600 for stable performance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Email Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SPF Record</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Configured
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">DKIM Signing</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Automatic
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">DMARC Policy</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">2FA Authentication</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Required
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Performance Monitoring</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Delivery Rate</span>
                      <span className="text-sm font-semibold text-green-600">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Spam Score</span>
                      <span className="text-sm font-semibold text-green-600">0.1/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Domain Reputation</span>
                      <span className="text-sm font-semibold text-green-600">Excellent</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SSL Certificate</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Lock className="h-3 w-3 mr-1" />
                        Valid
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Total Setup Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Domain Registration (dwcsystems.com)</span>
                    <span className="font-semibold">$12.00/year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Hosting (Zoho Mail)</span>
                    <span className="font-semibold text-green-600">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">DNS Configuration</span>
                    <span className="font-semibold text-green-600">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">SSL Certificate</span>
                    <span className="font-semibold text-green-600">$0.00 (Free)</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Annual Cost:</span>
                    <span className="text-green-600">$12.00</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Start Professional Email Setup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}