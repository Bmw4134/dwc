import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { insightsApi } from "@/lib/api";
import { useAIInsights } from "@/hooks/use-real-time-data";

export function AiInsights() {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["/api/insights"],
    queryFn: () => insightsApi.getAll(),
  });

  const liveInsights = useAIInsights();
  const allInsights = [...liveInsights, ...insights].slice(0, 4);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return 'fas fa-lightbulb';
      case 'pattern': return 'fas fa-chart-line';
      case 'alert': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-info-circle';
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-blue-200 bg-blue-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-green-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-slate-900">AI Recommendations</CardTitle>
        <p className="text-sm text-slate-600">Real-time insights and suggestions</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {allInsights.map((insight, index) => (
            <div
              key={insight.id || index}
              className={`p-4 border rounded-lg ${getInsightColor(insight.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-white/50 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <i className={`${getInsightIcon(insight.type)} ${getIconColor(insight.priority)} text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{insight.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{insight.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`mt-2 text-xs ${getIconColor(insight.priority)} hover:underline p-0 h-auto`}
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm">
              <i className="fas fa-plus-circle text-blue-600 mr-2"></i>
              Add New Lead
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <i className="fas fa-calculator text-green-600 mr-2"></i>
              Calculate ROI
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <i className="fas fa-robot text-purple-600 mr-2"></i>
              Create Automation
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <i className="fas fa-chart-bar text-orange-600 mr-2"></i>
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
