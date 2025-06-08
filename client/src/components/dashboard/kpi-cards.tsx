import { Card, CardContent } from "@/components/ui/card";
import { useRealTimeData } from "@/hooks/use-real-time-data";

export function KpiCards() {
  const { data: stats, isLoading } = useRealTimeData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Active Leads",
      value: stats?.activeLeads || 0,
      change: "+12% this week",
      changePositive: true,
      icon: "fas fa-building",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Monthly Savings",
      value: `$${stats?.monthlySavings?.toLocaleString() || '0'}`,
      change: "+28% growth",
      changePositive: true,
      icon: "fas fa-dollar-sign",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Automations",
      value: stats?.activeAutomations || 0,
      change: "8 new this month",
      changePositive: true,
      icon: "fas fa-robot",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "ROI Rate",
      value: `${stats?.roiRate?.toFixed(0) || '0'}%`,
      change: "Above industry avg",
      changePositive: true,
      icon: "fas fa-chart-line",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                <i className={`${kpi.icon} ${kpi.color} text-xl`}></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
                <p className="text-3xl font-bold text-slate-900 font-mono">{kpi.value}</p>
                <p className={`text-sm ${kpi.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                  <i className={`fas fa-arrow-${kpi.changePositive ? 'up' : 'down'} mr-1`}></i>
                  {kpi.change}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
