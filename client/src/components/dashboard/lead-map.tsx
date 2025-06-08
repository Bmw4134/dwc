import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { leadsApi } from "@/lib/api";

export function LeadMap() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/leads/zip/76140"],
    queryFn: () => leadsApi.getByZipCode("76140"),
  });

  const priorityCounts = leads.reduce((acc, lead) => {
    acc[lead.priority] = (acc[lead.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Lead Intelligence - ZIP 76140</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-slate-100 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 shadow-sm border border-slate-200">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Lead Intelligence - ZIP 76140
            </CardTitle>
            <p className="text-sm text-slate-600">Fort Worth, TX - Real-time business data</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Live Data</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Interactive Map Placeholder */}
        <div className="relative h-80 bg-slate-100 rounded-lg overflow-hidden mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-map-marked-alt text-4xl text-slate-400 mb-2"></i>
              <p className="text-slate-600 font-medium">Interactive Business Map</p>
              <p className="text-sm text-slate-500">{leads.length} potential leads identified</p>
            </div>
          </div>
          
          {/* Sample business markers */}
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute top-3/4 right-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Lead Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-lg font-bold text-red-500">{priorityCounts.high || 0}</p>
            <p className="text-xs text-slate-600">High Priority</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-500">{priorityCounts.medium || 0}</p>
            <p className="text-xs text-slate-600">Medium Priority</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-lg font-bold text-slate-400">{priorityCounts.low || 0}</p>
            <p className="text-xs text-slate-600">Low Priority</p>
          </div>
        </div>

        {/* Top Prospects */}
        {leads.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Top Prospects</h4>
            <div className="space-y-3">
              {leads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      lead.priority === 'high' ? 'bg-red-500' :
                      lead.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{lead.businessName}</p>
                      <p className="text-xs text-slate-600">
                        {lead.industry} • {lead.employeeCount || 'Unknown'} employees
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      ${parseInt(lead.estimatedSavings).toLocaleString()}/mo potential
                    </p>
                    <p className="text-xs text-slate-600">
                      {lead.automationScore || 75}% automation score
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
