import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, Shield, Clock, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface LLCPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

const CheckoutForm = ({ selectedPackage, customerEmail }: { selectedPackage: LLCPackage; customerEmail: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/llc-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">{selectedPackage.name}</h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ${(selectedPackage.price / 100).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {selectedPackage.description}
        </p>
      </div>

      <PaymentElement />

      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        size="lg"
      >
        {isLoading ? "Processing..." : `Pay $${(selectedPackage.price / 100).toFixed(2)}`}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <Shield className="inline-block w-4 h-4 mr-1" />
        Secured by Stripe • SSL Encrypted
      </div>
    </form>
  );
};

export default function LLCFormation() {
  const [selectedPackage, setSelectedPackage] = useState<LLCPackage | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ["/api/llc/packages"],
  });

  const createPaymentIntent = useMutation({
    mutationFn: async ({ packageId, email }: { packageId: string; email: string }) => {
      return apiRequest("POST", "/api/llc/payment-intent", { 
        packageId, 
        customerEmail: email 
      });
    },
    onSuccess: (data: any) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePackageSelect = (pkg: LLCPackage) => {
    if (!customerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setSelectedPackage(pkg);
    createPaymentIntent.mutate({ packageId: pkg.id, email: customerEmail });
  };

  const packages = packagesData?.packages || [];

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'starter': return <Users className="w-6 h-6" />;
      case 'professional': return <Star className="w-6 h-6" />;
      case 'enterprise': return <CheckCircle className="w-6 h-6" />;
      default: return <Users className="w-6 h-6" />;
    }
  };

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'starter': return 'border-green-200 dark:border-green-800';
      case 'professional': return 'border-blue-200 dark:border-blue-800';
      case 'enterprise': return 'border-purple-200 dark:border-purple-800';
      default: return 'border-gray-200 dark:border-gray-800';
    }
  };

  if (packagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            LLC Formation Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional LLC formation with DWC Systems - trusted by entrepreneurs nationwide. 
            Get your business started with our comprehensive formation packages.
          </p>
          
          {!selectedPackage && (
            <div className="max-w-md mx-auto mb-8">
              <Label htmlFor="email" className="text-left block mb-2">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="text-lg"
                required
              />
            </div>
          )}
        </div>

        {!selectedPackage ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg: LLCPackage) => (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${getPackageColor(pkg.id)}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {getPackageIcon(pkg.id)}
                  </div>
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    ${(pkg.price / 100).toFixed(0)}
                  </div>
                  <CardDescription className="mt-2">{pkg.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handlePackageSelect(pkg)}
                    disabled={!customerEmail}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                  >
                    Select Package
                  </Button>
                </CardContent>
                
                {pkg.id === 'professional' && (
                  <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                    Popular
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Complete Your Order</CardTitle>
                <CardDescription className="text-center">
                  Secure payment processing powered by Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#2563eb',
                        }
                      }
                    }}
                  >
                    <CheckoutForm 
                      selectedPackage={selectedPackage} 
                      customerEmail={customerEmail}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p>Initializing secure payment...</p>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPackage(null);
                      setClientSecret("");
                    }}
                    className="w-full"
                  >
                    Choose Different Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Quick Processing
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Money Back Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}