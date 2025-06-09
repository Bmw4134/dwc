import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Download, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  type: 'hosted' | 'standalone';
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export function SubscriptionPlans() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'hosted' | 'standalone'>('hosted');

  const hostedPlans: Plan[] = [
    {
      id: 'starter',
      name: 'Business Starter',
      type: 'hosted',
      price: 297,
      period: 'month',
      description: 'Essential automation for small businesses',
      features: [
        'Lead generation dashboard',
        'Basic AI analytics',
        'Email automation',
        'Customer support',
        'Cloud hosting included',
        'SSL & security',
        'Monthly backups'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      type: 'hosted',
      price: 597,
      period: 'month',
      description: 'Advanced features for growing businesses',
      features: [
        'Everything in Starter',
        'Advanced AI insights',
        'Custom integrations',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom branding',
        'Daily backups'
      ],
      popular: true,
      badge: 'Most Popular'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'hosted',
      price: 1497,
      period: 'month',
      description: 'Full-scale automation for large operations',
      features: [
        'Everything in Professional',
        'Unlimited automation',
        'White-label solution',
        'Dedicated support',
        'Custom development',
        'SLA guarantee',
        'Real-time sync',
        'Continuous backups'
      ],
      badge: 'Enterprise'
    }
  ];

  const standalonePlans: Plan[] = [
    {
      id: 'basic-license',
      name: 'Basic License',
      type: 'standalone',
      price: 4997,
      period: 'one-time',
      description: 'Complete platform for self-hosting',
      features: [
        'Full source code',
        'Installation guides',
        'Basic documentation',
        '1 year updates',
        'Email support',
        'Single domain license',
        'Self-hosting rights'
      ]
    },
    {
      id: 'professional-license',
      name: 'Professional License',
      type: 'standalone',
      price: 9997,
      period: 'one-time',
      description: 'Advanced platform with extended rights',
      features: [
        'Everything in Basic',
        'Advanced modules',
        'API documentation',
        '2 years updates',
        'Priority support',
        '5 domain licenses',
        'Reseller rights',
        'Custom branding'
      ],
      popular: true,
      badge: 'Best Value'
    },
    {
      id: 'enterprise-license',
      name: 'Enterprise License',
      type: 'standalone',
      price: 24997,
      period: 'one-time',
      description: 'Unlimited commercial usage rights',
      features: [
        'Everything in Professional',
        'Full commercial rights',
        'Unlimited domains',
        'Lifetime updates',
        'Phone support',
        'Custom development',
        'White-label rights',
        'Training included'
      ],
      badge: 'Enterprise'
    }
  ];

  const plans = selectedType === 'hosted' ? hostedPlans : standalonePlans;

  const handleSubscribe = async (planId: string) => {
    toast({
      title: "Processing...",
      description: "Setting up your subscription",
    });

    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      if (plan.type === 'hosted') {
        // Handle hosted subscription
        const response = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId,
            type: 'hosted',
            amount: plan.price * 100, // Convert to cents
          })
        });

        const { clientSecret, subscriptionId } = await response.json();
        
        // Redirect to Stripe checkout
        window.location.href = `/checkout?client_secret=${clientSecret}&type=subscription`;
      } else {
        // Handle standalone purchase
        const response = await fetch('/api/licenses/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            licenseType: planId,
            amount: plan.price * 100,
          })
        });

        const { clientSecret, licenseId } = await response.json();
        
        // Redirect to Stripe checkout for one-time payment
        window.location.href = `/checkout?client_secret=${clientSecret}&type=license&license_id=${licenseId}`;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Business Solution
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Scale your operations with our AI-powered automation platform
          </p>
          
          {/* Toggle between hosted and standalone */}
          <div className="inline-flex bg-gray-200 rounded-lg p-1 mb-8">
            <button
              onClick={() => setSelectedType('hosted')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedType === 'hosted'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Cloud className="w-4 h-4 inline mr-2" />
              Hosted SaaS
            </button>
            <button
              onClick={() => setSelectedType('standalone')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedType === 'standalone'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Download className="w-4 h-4 inline mr-2" />
              Standalone License
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={`
                    ${plan.popular ? 'bg-blue-600' : 'bg-gray-600'} text-white px-3 py-1
                  `}>
                    {plan.badge === 'Most Popular' && <Star className="w-3 h-3 mr-1" />}
                    {plan.badge === 'Enterprise' && <Crown className="w-3 h-3 mr-1" />}
                    {plan.badge === 'Best Value' && <Zap className="w-3 h-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-lg">
                    /{plan.period === 'one-time' ? 'lifetime' : plan.period}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.type === 'hosted' ? 'Start Subscription' : 'Purchase License'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  {plan.type === 'hosted' 
                    ? 'Cancel anytime. 30-day money-back guarantee.'
                    : 'One-time payment. Includes support and updates.'
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-gray-600 mb-6">
            Enterprise clients with specific requirements can get a tailored solution.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales Team
          </Button>
        </div>
      </div>
    </div>
  );
}