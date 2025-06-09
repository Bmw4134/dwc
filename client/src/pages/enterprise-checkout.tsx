import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Lock } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

const CheckoutForm = ({ selectedPlan }: { selectedPlan: Plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    setProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: `Welcome to ${selectedPlan.name}! Your enterprise automation suite is now active.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Your payment information is encrypted and secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button 
              type="submit" 
              disabled={!stripe || processing}
              className="w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700"
              size="lg"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Subscribe to {selectedPlan.name} - ${selectedPlan.price}/month
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function EnterpriseCheckout() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load subscription plans
    apiRequest("GET", "/api/subscription-plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlans(data.plans);
          // Default to professional plan
          const professional = data.plans.find((p: Plan) => p.id === 'professional');
          if (professional) {
            setSelectedPlan(professional);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      // Create subscription payment intent
      apiRequest("POST", "/api/create-subscription", {
        planId: selectedPlan.id,
        email: "enterprise@dwcsystems.com",
        name: "DWC Systems Enterprise"
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        });
    }
  }, [selectedPlan]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-purple-50">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-4">
            DWC Systems Enterprise Automation
          </h1>
          <p className="text-xl text-gray-600">
            Choose your enterprise automation plan and unlock the power of AI-driven business intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Select Your Plan</h2>
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id 
                    ? 'ring-2 ring-green-600 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        {plan.id === 'professional' && (
                          <Badge className="bg-green-600">Recommended</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        ${plan.price}/{plan.interval}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        ${plan.price}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Complete Your Subscription</h2>
            {selectedPlan && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm selectedPlan={selectedPlan} />
              </Elements>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              PCI DSS Compliant
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}