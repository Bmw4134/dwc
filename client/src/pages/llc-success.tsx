import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Mail, Phone, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LLCSuccess() {
  const [location] = useLocation();
  const [customerInfo, setCustomerInfo] = useState({
    email: "customer@example.com",
    packageType: "Professional LLC Formation"
  });

  useEffect(() => {
    // Extract payment intent from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get("payment_intent");
    const clientSecret = urlParams.get("payment_intent_client_secret");
    
    if (paymentIntent) {
      console.log("Payment successful:", paymentIntent);
      // In production, you would fetch the actual payment details
    }
  }, [location]);

  const nextSteps = [
    {
      title: "Confirmation Email Sent",
      description: "Check your inbox for order confirmation and next steps",
      icon: <Mail className="w-5 h-5" />,
      status: "complete"
    },
    {
      title: "Document Preparation",
      description: "Our team is preparing your LLC formation documents",
      icon: <Clock className="w-5 h-5" />,
      status: "in-progress"
    },
    {
      title: "State Filing",
      description: "Documents will be filed with your state within 2-3 business days",
      icon: <Shield className="w-5 h-5" />,
      status: "pending"
    },
    {
      title: "EIN Application",
      description: "Federal tax ID number application and processing",
      icon: <Download className="w-5 h-5" />,
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Your LLC formation order has been received and processing has begun.
            </p>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              Order Confirmed
            </Badge>
          </div>

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Order Summary
              </CardTitle>
              <CardDescription>
                Your LLC formation package details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Package Selected</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                    {customerInfo.packageType}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Confirmation Email</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {customerInfo.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happens Next</CardTitle>
              <CardDescription>
                Track your LLC formation progress through these key milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${step.status === 'complete' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 
                        step.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                    `}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {step.description}
                      </p>
                      <Badge 
                        variant={step.status === 'complete' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {step.status === 'complete' ? 'Complete' : 
                         step.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Our expert team is here to assist you throughout the process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <p className="text-gray-600 dark:text-gray-400">1-800-DWC-SYSTEMS</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-gray-600 dark:text-gray-400">support@dwcsystems.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => window.location.href = '/dashboard'}
            >
              View Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/llc-formation'}
            >
              Form Another LLC
            </Button>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Important Reminders</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>• Keep your confirmation email for your records</p>
                <p>• You'll receive updates as your LLC formation progresses</p>
                <p>• Most formations are completed within 5-10 business days</p>
                <p>• Contact support if you have any questions or concerns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}