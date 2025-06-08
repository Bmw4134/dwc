import { Button } from "@/components/ui/button";
import { useRealTimeData } from "@/hooks/use-real-time-data";

interface HeaderProps {
  currentPortal: 'executive' | 'operational';
  onRefresh: () => void;
}

export function Header({ currentPortal, onRefresh }: HeaderProps) {
  const { lastUpdated, refreshData } = useRealTimeData();

  const handleRefresh = () => {
    refreshData();
    onRefresh();
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {currentPortal === 'executive' ? 'Executive Dashboard' : 'Operational Dashboard'}
          </h2>
          <p className="text-slate-600">
            Real-time business intelligence for ZIP 76140
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-slate-600">ZIP Focus:</span>
            <span className="font-semibold text-primary">76140</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <i className="fas fa-brain mr-1"></i>
            AI Learning Mode
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-slate-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh Data
          </Button>
          
          <Button size="sm">
            <i className="fas fa-plus mr-2"></i>
            New Client
          </Button>
          
          <button className="relative p-2 text-slate-600 hover:text-slate-900">
            <i className="fas fa-bell"></i>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
