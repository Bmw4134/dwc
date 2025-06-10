import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Edit, Trash2, Users, DollarSign, TrendingUp, Activity, BarChart3, PieChart, LineChart, Target, Zap, Eye, ChevronDown, Filter, Calendar, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { DrillDownModal } from "@/components/DrillDownModal";

interface Lead {
  id?: string;
  name: string;
  value: number;
  status: string;
  industry: string;
  contact?: string;
  notes?: string;
}

interface MetricsData {
  totalLeads: number;
  activeProposals: number;
  totalPipelineValue: number;
  roiProven: number;
  systemHealth: number;
  monthlyRevenue: number;
  realLeads: Lead[];
  chartData: {
    revenue: Array<{month: string, value: number, growth: number}>;
    leadSources: Array<{source: string, count: number, value: number, color: string}>;
    conversionFunnel: Array<{stage: string, count: number, rate: number}>;
    industryBreakdown: Array<{industry: string, value: number, leads: number}>;
    performanceMetrics: Array<{metric: string, current: number, target: number, trend: number}>;
  };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  
  const [newLead, setNewLead] = useState<Lead>({
    name: "",
    value: 0,
    status: "Initial Contact",
    industry: "",
    contact: "",
    notes: ""
  });

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [drilldownView, setDrilldownView] = useState<string>("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [drilldownData, setDrilldownData] = useState<any>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);

  const { data: metrics, isLoading } = useQuery<MetricsData>({
    queryKey: ['/api/dashboard/metrics'],
    refetchInterval: 30000,
    retry: false,
  });

  const addLeadMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!response.ok) throw new Error('Failed to add lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      setIsAddingLead(false);
      setNewLead({ name: "", value: 0, status: "Initial Contact", industry: "", contact: "", notes: "" });
      toast({ title: "Success", description: "Lead added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add lead", variant: "destructive" });
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!response.ok) throw new Error('Failed to update lead');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
      setEditingLead(null);
      toast({ title: "Success", description: "Lead updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update lead", variant: "destructive" });
    }
  });

  const statusColors = {
    "Initial Contact": "bg-gray-500",
    "Discovery Phase": "bg-blue-500", 
    "Proposal Submitted": "bg-yellow-500",
    "Contract Review": "bg-orange-500",
    "Active Prospect": "bg-green-500",
    "Strategic Partnership": "bg-emerald-500",
    "Contacted": "bg-purple-500"
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.industry || newLead.value <= 0) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    addLeadMutation.mutate(newLead);
  };

  const handleUpdateLead = () => {
    if (!editingLead) return;
    updateLeadMutation.mutate(editingLead);
  };

  const handleDrillDown = (metric: string, details: any) => {
    setSelectedMetric(metric);
    setDrilldownData(details);
    setIsDrilldownOpen(true);
    console.log(`Drilling down into ${metric}:`, details);
    toast({
      title: "Analytics Deep Dive",
      description: `Analyzing ${metric} data with ${Array.isArray(details) ? details.length : 1} data points`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Admin Dashboard</h2>
          <p className="text-emerald-400">DWC Systems LLC</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                DWC Systems LLC - Admin Dashboard
              </h1>
              <p className="text-emerald-400 font-bold text-sm">Business Management Console</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Public Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-black text-white">
                  {metrics?.totalLeads || 0}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-400 font-bold">Total Leads</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-black text-white">
                  {metrics?.activeProposals || 0}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-400 font-bold">Active Proposals</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-black text-white">
                  ${((metrics?.totalPipelineValue || 0) / 1000).toFixed(0)}K
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-400 font-bold">Pipeline Value</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Activity className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-black text-white">
                  {(metrics?.systemHealth || 0).toFixed(1)}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-400 font-bold">System Health</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Visual Analytics */}
        {metrics?.chartData && (
          <div className="mb-8">
            <AdvancedCharts 
              data={metrics.chartData} 
              onDrillDown={handleDrillDown}
            />
          </div>
        )}

        {/* Lead Management */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-white">Lead Management</CardTitle>
                <CardDescription className="text-white/70">
                  Manage your business pipeline and client relationships
                </CardDescription>
              </div>
              <Dialog open={isAddingLead} onOpenChange={setIsAddingLead}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Lead</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Enter the details for the new business lead
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Company Name *</Label>
                      <Input
                        id="name"
                        value={newLead.name}
                        onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry" className="text-white">Industry *</Label>
                      <Input
                        id="industry"
                        value={newLead.industry}
                        onChange={(e) => setNewLead({...newLead, industry: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="e.g., Technology, Manufacturing"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value" className="text-white">Deal Value ($) *</Label>
                      <Input
                        id="value"
                        type="number"
                        value={newLead.value}
                        onChange={(e) => setNewLead({...newLead, value: parseInt(e.target.value) || 0})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter deal value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-white">Status</Label>
                      <Select value={newLead.status} onValueChange={(value) => setNewLead({...newLead, status: value})}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/20">
                          <SelectItem value="Initial Contact">Initial Contact</SelectItem>
                          <SelectItem value="Discovery Phase">Discovery Phase</SelectItem>
                          <SelectItem value="Proposal Submitted">Proposal Submitted</SelectItem>
                          <SelectItem value="Contract Review">Contract Review</SelectItem>
                          <SelectItem value="Active Prospect">Active Prospect</SelectItem>
                          <SelectItem value="Strategic Partnership">Strategic Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contact" className="text-white">Contact Information</Label>
                      <Input
                        id="contact"
                        value={newLead.contact}
                        onChange={(e) => setNewLead({...newLead, contact: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Email or phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-white">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newLead.notes}
                        onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Additional notes about this lead"
                      />
                    </div>
                    <Button 
                      onClick={handleAddLead} 
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                      disabled={addLeadMutation.isPending}
                    >
                      {addLeadMutation.isPending ? "Adding..." : "Add Lead"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.realLeads?.map((lead, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                        <Badge className={`${statusColors[lead.status as keyof typeof statusColors]} text-white`}>
                          {lead.status}
                        </Badge>
                      </div>
                      <p className="text-white/70 mb-1">{lead.industry}</p>
                      <p className="text-emerald-400 font-bold text-xl">${lead.value.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => setEditingLead(lead)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) || <p className="text-white/70">No leads found</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Lead Dialog */}
      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent className="bg-slate-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Lead</DialogTitle>
            <DialogDescription className="text-white/70">
              Update the lead information
            </DialogDescription>
          </DialogHeader>
          {editingLead && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-white">Company Name</Label>
                <Input
                  id="edit-name"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-industry" className="text-white">Industry</Label>
                <Input
                  id="edit-industry"
                  value={editingLead.industry}
                  onChange={(e) => setEditingLead({...editingLead, industry: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-value" className="text-white">Deal Value ($)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editingLead.value}
                  onChange={(e) => setEditingLead({...editingLead, value: parseInt(e.target.value) || 0})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-white">Status</Label>
                <Select value={editingLead.status} onValueChange={(value) => setEditingLead({...editingLead, status: value})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20">
                    <SelectItem value="Initial Contact">Initial Contact</SelectItem>
                    <SelectItem value="Discovery Phase">Discovery Phase</SelectItem>
                    <SelectItem value="Proposal Submitted">Proposal Submitted</SelectItem>
                    <SelectItem value="Contract Review">Contract Review</SelectItem>
                    <SelectItem value="Active Prospect">Active Prospect</SelectItem>
                    <SelectItem value="Strategic Partnership">Strategic Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleUpdateLead} 
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                disabled={updateLeadMutation.isPending}
              >
                {updateLeadMutation.isPending ? "Updating..." : "Update Lead"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={isDrilldownOpen}
        onClose={() => setIsDrilldownOpen(false)}
        metric={selectedMetric || ""}
        data={drilldownData}
      />
    </div>
  );
}