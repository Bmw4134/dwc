import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Send, 
  Shield,
  CheckCircle,
  Clock,
  User,
  Mail,
  DollarSign,
  Signature,
  Download,
  Eye,
  Lock,
  Unlock,
  Calendar,
  AlertTriangle,
  FileCheck,
  Users,
  Bell,
  Zap
} from "lucide-react";

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: "consulting" | "hosting" | "maintenance" | "custom";
  basePrice: string;
  duration: string;
  fields: ContractField[];
  status: "draft" | "active" | "archived";
}

interface ContractField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "signature" | "checkbox" | "dropdown";
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

interface ContractInstance {
  id: string;
  templateId: string;
  clientName: string;
  clientEmail: string;
  status: "draft" | "sent" | "signed" | "completed" | "expired";
  createdAt: Date;
  sentAt?: Date;
  signedAt?: Date;
  expiresAt?: Date;
  totalValue: string;
  signatories: Signatory[];
}

interface Signatory {
  id: string;
  name: string;
  email: string;
  role: "client" | "dwc_admin" | "witness";
  status: "pending" | "signed" | "declined";
  signedAt?: Date;
  ipAddress?: string;
}

export default function ContractExecutionPortal() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const { toast } = useToast();

  // Contract templates
  const { data: templates = [] } = useQuery({
    queryKey: ["/api/contracts/templates"],
    initialData: [
      {
        id: "website-consolidation",
        name: "Website Consolidation Service Agreement",
        description: "Comprehensive website merger and optimization service",
        category: "consulting",
        basePrice: "$12,500",
        duration: "30-45 days",
        fields: [
          { id: "client-name", label: "Client Business Name", type: "text", required: true },
          { id: "primary-url", label: "Primary Website URL", type: "text", required: true },
          { id: "secondary-url", label: "Secondary Website URL", type: "text", required: true },
          { id: "project-value", label: "Total Project Value", type: "number", required: true, defaultValue: "12500" },
          { id: "timeline", label: "Project Timeline", type: "dropdown", required: true, options: ["30 days", "45 days", "60 days"] },
          { id: "hosting-plan", label: "Ongoing Hosting Plan", type: "dropdown", required: true, options: ["Professional ($149/mo)", "Enterprise ($349/mo)"] }
        ],
        status: "active"
      },
      {
        id: "hosting-agreement",
        name: "DWC Hosting Service Agreement",
        description: "Monthly hosting and maintenance service contract",
        category: "hosting",
        basePrice: "$149/month",
        duration: "12 months",
        fields: [
          { id: "business-name", label: "Business Name", type: "text", required: true },
          { id: "website-url", label: "Website URL", type: "text", required: true },
          { id: "hosting-tier", label: "Hosting Tier", type: "dropdown", required: true, options: ["Starter ($49/mo)", "Professional ($149/mo)", "Enterprise ($349/mo)"] },
          { id: "contract-term", label: "Contract Term", type: "dropdown", required: true, options: ["6 months", "12 months", "24 months"] },
          { id: "auto-renewal", label: "Auto-renewal", type: "checkbox", required: false }
        ],
        status: "active"
      },
      {
        id: "succession-agreement",
        name: "Client Succession & Migration Agreement", 
        description: "Terms for client taking hosting externally",
        category: "custom",
        basePrice: "$2,500",
        duration: "90 days",
        fields: [
          { id: "migration-date", label: "Target Migration Date", type: "date", required: true },
          { id: "external-host", label: "New Hosting Provider", type: "text", required: true },
          { id: "support-period", label: "Transition Support Period", type: "dropdown", required: true, options: ["30 days", "60 days", "90 days"] },
          { id: "backup-retention", label: "Backup Retention Period", type: "dropdown", required: true, options: ["6 months", "12 months", "24 months"] }
        ],
        status: "active"
      }
    ]
  });

  // Active contracts
  const { data: contracts = [], refetch: refetchContracts } = useQuery({
    queryKey: ["/api/contracts/active"],
    initialData: [
      {
        id: "kate-consolidation-001",
        templateId: "website-consolidation",
        clientName: "Kate White Photography",
        clientEmail: "kate@blissfulmemoriesphotos.com",
        status: "draft",
        createdAt: new Date(),
        totalValue: "$12,500",
        signatories: [
          { id: "kate-sig", name: "Kate White", email: "kate@blissfulmemoriesphotos.com", role: "client", status: "pending" },
          { id: "dwc-sig", name: "DWC Admin", email: "contracts@dwc.ai", role: "dwc_admin", status: "pending" }
        ]
      }
    ]
  });

  // Send contract mutation
  const sendContractMutation = useMutation({
    mutationFn: async (data: { templateId: string; clientName: string; clientEmail: string; customFields: Record<string, any> }) => {
      return await apiRequest("/api/contracts/send", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Contract Sent",
        description: "Secure contract sent to client for signature"
      });
      refetchContracts();
    },
    onError: () => {
      toast({
        title: "Send Failed",
        description: "Unable to send contract",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-500/20 text-gray-400";
      case "sent": return "bg-blue-500/20 text-blue-400";
      case "signed": return "bg-green-500/20 text-green-400";
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "expired": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <FileText className="h-4 w-4" />;
      case "sent": return <Send className="h-4 w-4" />;
      case "signed": return <Signature className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "expired": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Secure Contract Execution Portal
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Free-to-start secure contract platform with DocuSign-style functionality for client deal execution
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Free to Start
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Legally Binding
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Enterprise Security
            </Badge>
          </div>
        </div>

        {/* Security Features */}
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Security & Compliance Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Lock className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">256-bit Encryption</p>
                  <p className="text-gray-400 text-xs">Bank-level security</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <FileCheck className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm font-medium">Audit Trail</p>
                  <p className="text-gray-400 text-xs">Complete signature history</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Bell className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white text-sm font-medium">Real-time Notifications</p>
                  <p className="text-gray-400 text-xs">Instant status updates</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-white text-sm font-medium">Instant Execution</p>
                  <p className="text-gray-400 text-xs">No delays or paperwork</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="contracts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="contracts">Active Contracts</TabsTrigger>
            <TabsTrigger value="templates">Contract Templates</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Active Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {contracts.map((contract: ContractInstance) => (
                <Card key={contract.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {contract.clientName}
                      </CardTitle>
                      <Badge className={getStatusColor(contract.status)}>
                        {getStatusIcon(contract.status)}
                        {contract.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Client Email</p>
                        <p className="text-white">{contract.clientEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Contract Value</p>
                        <p className="text-white font-semibold">{contract.totalValue}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Created</p>
                        <p className="text-white">{contract.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Template</p>
                        <p className="text-white">{templates.find(t => t.id === contract.templateId)?.name || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Signatories Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {contract.signatories.map((signatory) => (
                          <div key={signatory.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{signatory.name}</p>
                              <p className="text-gray-400 text-xs">{signatory.email}</p>
                              <p className="text-gray-400 text-xs">{signatory.role}</p>
                            </div>
                            <Badge className={getStatusColor(signatory.status)}>
                              {signatory.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Eye className="h-3 w-3 mr-1" />
                        View Contract
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="h-3 w-3 mr-1" />
                        Resend
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contract Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {template.category}
                      </Badge>
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Base Price:</span>
                        <span className="text-white font-semibold">{template.basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Duration:</span>
                        <span className="text-white">{template.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Fields:</span>
                        <span className="text-white">{template.fields.length} fields</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Required Fields:</p>
                      <div className="space-y-1">
                        {template.fields.filter(f => f.required).slice(0, 3).map((field) => (
                          <div key={field.id} className="text-xs text-gray-300">• {field.label}</div>
                        ))}
                        {template.fields.filter(f => f.required).length > 3 && (
                          <div className="text-xs text-gray-400">+ {template.fields.filter(f => f.required).length - 3} more</div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedTemplate(template.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create New Contract Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  Create New Contract
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Contract Template</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded text-white"
                    >
                      <option value="">Select Template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Client Name</label>
                    <Input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="Kate White Photography"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Client Email</label>
                    <Input
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="kate@blissfulmemoriesphotos.com"
                    />
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Contract Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.find(t => t.id === selectedTemplate)?.fields.map((field) => (
                        <div key={field.id}>
                          <label className="text-gray-400 text-sm mb-2 block">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          {field.type === "dropdown" ? (
                            <select className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded text-white">
                              <option value="">Select {field.label}</option>
                              {field.options?.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : field.type === "checkbox" ? (
                            <div className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-gray-300 text-sm">{field.label}</span>
                            </div>
                          ) : (
                            <Input
                              type={field.type}
                              defaultValue={field.defaultValue}
                              className="bg-gray-700/50 border-gray-600 text-white"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-blue-400 font-medium mb-2">Contract Preview</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Secure digital signatures with legal binding</p>
                    <p>• Automatic notifications and reminders</p>
                    <p>• Complete audit trail with timestamps</p>
                    <p>• Instant execution upon all signatures</p>
                  </div>
                </div>

                <Button
                  onClick={() => sendContractMutation.mutate({ 
                    templateId: selectedTemplate, 
                    clientName, 
                    clientEmail, 
                    customFields: {} 
                  })}
                  disabled={!selectedTemplate || !clientName || !clientEmail || sendContractMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {sendContractMutation.isPending ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Contract for Signature
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Contracts Sent</p>
                      <p className="text-3xl font-bold text-white">24</p>
                      <p className="text-green-400 text-sm">This month</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Send className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Signature Rate</p>
                      <p className="text-3xl font-bold text-white">87%</p>
                      <p className="text-green-400 text-sm">+12% vs last month</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Signature className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Value</p>
                      <p className="text-3xl font-bold text-white">$187K</p>
                      <p className="text-emerald-400 text-sm">Executed contracts</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg. Sign Time</p>
                      <p className="text-3xl font-bold text-white">2.4</p>
                      <p className="text-purple-400 text-sm">Days to execute</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Contract Performance by Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{template.name}</p>
                        <p className="text-gray-400 text-sm">{template.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">94% signature rate</p>
                        <p className="text-gray-400 text-sm">12 sent this month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}