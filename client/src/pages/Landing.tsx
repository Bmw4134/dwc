import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, TrendingUp, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Photography Business Consultant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your photography business with AI-powered insights, revenue optimization, and strategic growth recommendations.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started - Sign In
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="text-center">
              <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Business Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive analysis of your photography business including revenue assessment and market positioning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Growth Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Data-driven recommendations to increase bookings, optimize pricing, and expand your client base.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Streamline your client workflow with automated systems and improved communication strategies.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="text-center">
              <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Competitive analysis and pricing insights to position your services in the local market.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Grow Your Photography Business?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join photographers who have increased their revenue by an average of 45% using our insights.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Your Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}