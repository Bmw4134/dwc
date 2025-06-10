import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Target, TrendingUp, TrendingDown, Eye, ChevronDown, Filter } from "lucide-react";

interface ChartData {
  revenue: Array<{month: string, value: number, growth: number}>;
  leadSources: Array<{source: string, count: number, value: number, color: string}>;
  conversionFunnel: Array<{stage: string, count: number, rate: number}>;
  industryBreakdown: Array<{industry: string, value: number, leads: number}>;
  performanceMetrics: Array<{metric: string, current: number, target: number, trend: number}>;
}

interface AdvancedChartsProps {
  data: ChartData;
  onDrillDown: (metric: string, details: any) => void;
}

export function AdvancedCharts({ data, onDrillDown }: AdvancedChartsProps) {
  const [selectedChart, setSelectedChart] = useState<string>("revenue");

  // Revenue Vector Matrix Chart
  const RevenueMatrixChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Revenue Vector Analysis</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDrillDown("revenue", data.revenue)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Eye className="w-4 h-4 mr-2" />
          Drill Down
        </Button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {data.revenue.map((item, index) => (
          <div
            key={item.month}
            className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => onDrillDown("revenue-month", item)}
          >
            <div className="text-xs text-white/60 mb-1">{item.month}</div>
            <div className="text-lg font-bold text-white">${(item.value / 1000).toFixed(0)}K</div>
            <div className={`flex items-center text-xs ${item.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {item.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(item.growth)}%
            </div>
            <div className="mt-2 h-1 bg-white/20 rounded">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded transition-all"
                style={{ width: `${Math.min(100, (item.value / Math.max(...data.revenue.map(r => r.value))) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Lead Sources Pie Chart
  const LeadSourcesPieChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Lead Source Distribution</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDrillDown("lead-sources", data.leadSources)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <PieChart className="w-4 h-4 mr-2" />
          Analyze
        </Button>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {data.leadSources.map((source, index) => {
              const total = data.leadSources.reduce((sum, s) => sum + s.count, 0);
              const percentage = (source.count / total) * 100;
              const circumference = 2 * Math.PI * 80;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -index * (circumference / data.leadSources.length);
              
              return (
                <circle
                  key={source.source}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={source.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer hover:stroke-white transition-all"
                  onClick={() => onDrillDown("lead-source", source)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {data.leadSources.reduce((sum, s) => sum + s.count, 0)}
              </div>
              <div className="text-xs text-white/60">Total Leads</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.leadSources.map((source) => (
          <div
            key={source.source}
            className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => onDrillDown("lead-source", source)}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: source.color }}
              />
              <span className="text-sm text-white/80">{source.source}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {source.count}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  // Conversion Funnel Chart
  const ConversionFunnelChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Conversion Funnel Analysis</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDrillDown("conversion-funnel", data.conversionFunnel)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Target className="w-4 h-4 mr-2" />
          Optimize
        </Button>
      </div>
      <div className="space-y-2">
        {data.conversionFunnel.map((stage, index) => {
          const maxCount = Math.max(...data.conversionFunnel.map(s => s.count));
          const width = (stage.count / maxCount) * 100;
          
          return (
            <div
              key={stage.stage}
              className="relative group cursor-pointer"
              onClick={() => onDrillDown("funnel-stage", stage)}
            >
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{stage.stage}</span>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary" 
                      className={`${stage.rate >= 25 ? 'bg-emerald-500/20 text-emerald-400' : stage.rate >= 15 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {stage.rate}%
                    </Badge>
                    <span className="text-white/60 text-sm">{stage.count}</span>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Performance Metrics Vector Grid
  const PerformanceVectorGrid = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Performance Vector Matrix</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDrillDown("performance", data.performanceMetrics)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Deep Dive
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {data.performanceMetrics.map((metric) => {
          const progress = (metric.current / metric.target) * 100;
          const isOnTarget = progress >= 90;
          
          return (
            <Card
              key={metric.metric}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              onClick={() => onDrillDown("performance-metric", metric)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium text-sm">{metric.metric}</h4>
                  <div className={`flex items-center text-xs ${metric.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metric.trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(metric.trend)}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-white">{metric.current}</span>
                    <span className="text-sm text-white/60">/ {metric.target}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Progress</span>
                      <span className={`${isOnTarget ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          isOnTarget ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const chartComponents = {
    revenue: RevenueMatrixChart,
    leadSources: LeadSourcesPieChart,
    funnel: ConversionFunnelChart,
    performance: PerformanceVectorGrid,
  };

  const ChartComponent = chartComponents[selectedChart as keyof typeof chartComponents] || RevenueMatrixChart;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Advanced Analytics Dashboard</CardTitle>
            <CardDescription className="text-white/70">
              Interactive visual intelligence with drill-down capabilities
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {Object.keys(chartComponents).map((key) => (
              <Button
                key={key}
                size="sm"
                variant={selectedChart === key ? "default" : "outline"}
                onClick={() => setSelectedChart(key)}
                className={`${
                  selectedChart === key 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {key === "revenue" && <LineChart className="w-4 h-4" />}
                {key === "leadSources" && <PieChart className="w-4 h-4" />}
                {key === "funnel" && <Target className="w-4 h-4" />}
                {key === "performance" && <BarChart3 className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartComponent />
      </CardContent>
    </Card>
  );
}