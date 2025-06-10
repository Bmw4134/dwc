import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Target, DollarSign, Users, Calendar, Filter, Download } from "lucide-react";

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string;
  data: any;
}

export function DrillDownModal({ isOpen, onClose, metric, data }: DrillDownModalProps) {
  const [timeFilter, setTimeFilter] = useState("30d");
  const [viewMode, setViewMode] = useState("detailed");

  const renderRevenueAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${data.reduce((sum: number, item: any) => sum + item.value, 0).toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {(data.reduce((sum: number, item: any) => sum + item.growth, 0) / data.length).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Avg Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="w-8 h-8 text-cyan-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {Math.max(...data.map((item: any) => item.value)).toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Peak Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-bold text-white">Monthly Performance Breakdown</h4>
        {data.map((month: any, index: number) => (
          <Card key={month.month} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {month.month}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">${month.value.toLocaleString()}</div>
                    <div className="text-sm text-white/60">Revenue Generated</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center ${month.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {month.growth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {Math.abs(month.growth)}%
                  </div>
                  
                  <div className="w-24 h-2 bg-white/20 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                      style={{ width: `${(month.value / Math.max(...data.map((d: any) => d.value))) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeadSourcesAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {data.reduce((sum: number, item: any) => sum + item.count, 0)}
                </div>
                <div className="text-sm text-white/60">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${data.reduce((sum: number, item: any) => sum + item.value, 0).toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Total Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-bold text-white">Source Performance Analysis</h4>
        {data.map((source: any) => {
          const avgDealSize = source.value / source.count;
          const totalLeads = data.reduce((sum: number, item: any) => sum + item.count, 0);
          const marketShare = (source.count / totalLeads) * 100;
          
          return (
            <Card key={source.source} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-lg font-bold text-white">{source.source}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {marketShare.toFixed(1)}% share
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Leads Generated</div>
                    <div className="text-xl font-bold text-white">{source.count}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Total Value</div>
                    <div className="text-xl font-bold text-emerald-400">${source.value.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Avg Deal Size</div>
                    <div className="text-xl font-bold text-cyan-400">${avgDealSize.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="mt-3 h-2 bg-white/20 rounded overflow-hidden">
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      width: `${marketShare}%`,
                      backgroundColor: source.color 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderFunnelAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="w-8 h-8 text-purple-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {data[data.length - 1]?.rate || 0}%
                </div>
                <div className="text-sm text-white/60">Overall Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="w-8 h-8 text-orange-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {data.length}
                </div>
                <div className="text-sm text-white/60">Funnel Stages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-bold text-white">Stage-by-Stage Analysis</h4>
        {data.map((stage: any, index: number) => {
          const nextStage = data[index + 1];
          const dropOffRate = nextStage ? ((stage.count - nextStage.count) / stage.count) * 100 : 0;
          
          return (
            <Card key={stage.stage} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-lg font-bold text-white">{stage.stage}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary" 
                      className={`${
                        stage.rate >= 50 ? 'bg-green-500/20 text-green-400' : 
                        stage.rate >= 25 ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {stage.rate}% conversion
                    </Badge>
                    {nextStage && dropOffRate > 0 && (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                        {dropOffRate.toFixed(1)}% drop-off
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Active Prospects</div>
                    <div className="text-2xl font-bold text-white">{stage.count}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Stage Conversion</div>
                    <div className="text-2xl font-bold text-cyan-400">{stage.rate}%</div>
                  </div>
                </div>
                
                <div className="mt-3 h-3 bg-white/20 rounded overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${stage.rate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (metric) {
      case "revenue": return "Revenue Vector Analysis";
      case "lead-sources": return "Lead Source Intelligence";
      case "conversion-funnel": return "Conversion Funnel Deep Dive";
      case "performance": return "Performance Metrics Breakdown";
      default: return "Advanced Analytics";
    }
  };

  const getModalContent = () => {
    switch (metric) {
      case "revenue":
      case "revenue-month":
        return renderRevenueAnalysis();
      case "lead-sources":
      case "lead-source":
        return renderLeadSourcesAnalysis();
      case "conversion-funnel":
      case "funnel-stage":
        return renderFunnelAnalysis();
      default:
        return (
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Analytics Deep Dive</h3>
            <p className="text-white/70">Detailed analysis for {metric} data</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/20 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">{getModalTitle()}</DialogTitle>
              <DialogDescription className="text-white/70 mt-1">
                Comprehensive analysis with actionable insights
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {getModalContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}