import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, LogOut, User, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Photography Business Console
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user?.profileImageUrl && (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.firstName || user?.email || 'User'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || 'Photographer'}!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ready to analyze and grow your photography business? Let's get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/photography-business-consultant">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Business Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get comprehensive insights into your photography business including revenue analysis, market positioning, and growth recommendations.
                </CardDescription>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-white dark:bg-gray-800 shadow-lg opacity-75">
            <CardHeader className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-500">Portfolio Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Analyze your portfolio performance and get recommendations for showcasing your best work to attract premium clients.
              </CardDescription>
              <Button disabled className="w-full mt-4">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg opacity-75">
            <CardHeader className="text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl text-gray-500">Client CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Manage your client relationships, track bookings, and automate follow-ups to maximize repeat business.
              </CardDescription>
              <Button disabled className="w-full mt-4">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Start Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Enter Business Info</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Provide details about your photography business, specialties, and current pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 dark:text-green-300 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Receive comprehensive business analysis with growth potential and market insights.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-300 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Implement Strategies</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Follow actionable recommendations to grow your revenue and client base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}