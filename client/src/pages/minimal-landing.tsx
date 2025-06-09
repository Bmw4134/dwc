import { Button } from "@/components/ui/button";

export default function MinimalLanding() {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            DWC Systems
          </h1>
          <p className="text-2xl text-slate-300 mb-8">
            Enterprise Automation Platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleNavigation('/demo-dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Try NEXUS GPT (20 Free Prompts)
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleNavigation('/dashboard')}
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
            >
              Executive Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}