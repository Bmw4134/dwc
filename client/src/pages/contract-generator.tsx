import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contractFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientEmail: z.string().email("Valid email is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  projectTitle: z.string().min(1, "Project title is required"),
  serviceType: z.string().min(1, "Service type is required"),
  projectDescription: z.string().min(10, "Project description must be at least 10 characters"),
  contractValue: z.string().min(1, "Contract value is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  deliverables: z.string().min(10, "Deliverables must be specified"),
  additionalTerms: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractFormSchema>;

interface GeneratedContract {
  id: string;
  contractNumber: string;
  clientName: string;
  projectTitle: string;
  status: string;
  createdDate: string;
  contractValue: string;
  content: string;
}

export default function ContractGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [generatedContract, setGeneratedContract] = useState<GeneratedContract | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      contactPerson: "",
      projectTitle: "",
      serviceType: "automation_implementation",
      projectDescription: "",
      contractValue: "",
      paymentTerms: "net_30",
      startDate: "",
      endDate: "",
      deliverables: "",
      additionalTerms: "",
    },
  });

  const { data: contractTemplates } = useQuery({
    queryKey: ['/api/contracts/templates'],
  });

  const { data: existingContracts } = useQuery({
    queryKey: ['/api/contracts'],
  });

  const generateContractMutation = useMutation({
    mutationFn: async (data: ContractFormData & { template: string }) => {
      return await apiRequest('/api/contracts/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (contract) => {
      setGeneratedContract(contract);
      setPreviewMode(true);
      toast({
        title: "Contract Generated",
        description: "Your automation agreement has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveContractMutation = useMutation({
    mutationFn: async (contractId: string) => {
      return await apiRequest(`/api/contracts/${contractId}/save`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Contract Saved",
        description: "Contract has been saved and is ready for client review.",
      });
    },
  });

  const onSubmit = (data: ContractFormData) => {
    generateContractMutation.mutate({
      ...data,
      template: selectedTemplate,
    });
  };

  const serviceTypes = [
    { value: "automation_implementation", label: "Automation Implementation" },
    { value: "ai_integration", label: "AI System Integration" },
    { value: "process_optimization", label: "Process Optimization" },
    { value: "custom_development", label: "Custom Development" },
    { value: "consulting", label: "Strategic Consulting" },
    { value: "maintenance_support", label: "Maintenance & Support" },
  ];

  const paymentTermsOptions = [
    { value: "net_15", label: "Net 15 Days" },
    { value: "net_30", label: "Net 30 Days" },
    { value: "net_45", label: "Net 45 Days" },
    { value: "milestone_based", label: "Milestone Based" },
    { value: "upfront_50", label: "50% Upfront, 50% on Completion" },
    { value: "monthly_retainer", label: "Monthly Retainer" },
  ];

  const contractTemplates_data = [
    {
      id: "standard",
      name: "Standard Automation Agreement",
      description: "Standard template for automation implementation projects",
      suitable_for: ["Small to medium businesses", "Standard automation projects"]
    },
    {
      id: "enterprise",
      name: "Enterprise Service Agreement",
      description: "Comprehensive template for large-scale enterprise implementations",
      suitable_for: ["Enterprise clients", "Complex multi-phase projects"]
    },
    {
      id: "consulting",
      name: "Consulting Services Agreement",
      description: "Template for strategic consulting and advisory services",
      suitable_for: ["Consulting engagements", "Strategic advisory services"]
    },
    {
      id: "maintenance",
      name: "Maintenance & Support Agreement",
      description: "Ongoing support and maintenance contract template",
      suitable_for: ["Post-implementation support", "Ongoing maintenance"]
    }
  ];

  const mockContracts: GeneratedContract[] = [
    {
      id: "1",
      contractNumber: "DWC-2025-001",
      clientName: "TechCorp Industries",
      projectTitle: "CRM Automation Implementation",
      status: "Draft",
      createdDate: "2025-01-15",
      contractValue: "$75,000",
      content: ""
    },
    {
      id: "2",
      contractNumber: "DWC-2025-002",
      clientName: "MedCore Solutions",
      projectTitle: "Patient Management System Integration",
      status: "Sent for Review",
      createdDate: "2025-01-12",
      contractValue: "$120,000",
      content: ""
    }
  ];

  if (previewMode && generatedContract) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Contract Preview</h1>
              <p className="text-slate-600">Review and finalize your automation agreement</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                Edit Contract
              </Button>
              <Button 
                onClick={() => saveContractMutation.mutate(generatedContract.id)}
                disabled={saveContractMutation.isPending}
              >
                Save & Send for Review
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Automation Services Agreement</CardTitle>
                <CardDescription>Contract Number: {generatedContract.contractNumber}</CardDescription>
              </div>
              <Badge variant="secondary">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-w-4xl">
              <div className="text-sm leading-relaxed space-y-4">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold">AUTOMATION SERVICES AGREEMENT</h2>
                  <p className="text-slate-600 mt-2">Contract No: {generatedContract.contractNumber}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">PARTIES</h3>
                  <p>This Agreement is entered into between:</p>
                  <div className="ml-4 mt-2 space-y-1">
                    <p><strong>Service Provider:</strong> DWC Systems LLC</p>
                    <p>Address: Fort Worth, Texas 76140</p>
                    <p>Email: contact@dwcsystems.com</p>
                  </div>
                  <div className="ml-4 mt-3 space-y-1">
                    <p><strong>Client:</strong> {form.watch('clientName')}</p>
                    <p>Address: {form.watch('clientAddress')}</p>
                    <p>Email: {form.watch('clientEmail')}</p>
                    <p>Contact Person: {form.watch('contactPerson')}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">PROJECT SCOPE</h3>
                  <p><strong>Project Title:</strong> {form.watch('projectTitle')}</p>
                  <p><strong>Service Type:</strong> {serviceTypes.find(s => s.value === form.watch('serviceType'))?.label}</p>
                  <p><strong>Description:</strong> {form.watch('projectDescription')}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">DELIVERABLES</h3>
                  <div className="whitespace-pre-line">{form.watch('deliverables')}</div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">FINANCIAL TERMS</h3>
                  <p><strong>Total Contract Value:</strong> {form.watch('contractValue')}</p>
                  <p><strong>Payment Terms:</strong> {paymentTermsOptions.find(p => p.value === form.watch('paymentTerms'))?.label}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">PROJECT TIMELINE</h3>
                  <p><strong>Start Date:</strong> {form.watch('startDate')}</p>
                  <p><strong>Completion Date:</strong> {form.watch('endDate')}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">TERMS AND CONDITIONS</h3>
                  <div className="space-y-2">
                    <p><strong>1. Service Delivery:</strong> DWC Systems LLC will provide automation services as specified in the project scope using our proprietary quantum-powered AI platform.</p>
                    <p><strong>2. Intellectual Property:</strong> All custom developments remain the property of DWC Systems LLC. Client receives unlimited usage rights for their business operations.</p>
                    <p><strong>3. Data Security:</strong> All client data will be handled in accordance with industry-standard security protocols and applicable privacy regulations.</p>
                    <p><strong>4. Support & Maintenance:</strong> Initial 90-day support included. Extended support agreements available separately.</p>
                    <p><strong>5. Limitation of Liability:</strong> Service provider's liability is limited to the total contract value.</p>
                  </div>
                  {form.watch('additionalTerms') && (
                    <div className="mt-4">
                      <p><strong>Additional Terms:</strong></p>
                      <div className="whitespace-pre-line mt-2">{form.watch('additionalTerms')}</div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p><strong>DWC Systems LLC</strong></p>
                      <div className="mt-8 border-b border-slate-300 w-48"></div>
                      <p className="text-sm text-slate-600 mt-1">Signature</p>
                      <div className="mt-4 border-b border-slate-300 w-32"></div>
                      <p className="text-sm text-slate-600 mt-1">Date</p>
                    </div>
                    <div>
                      <p><strong>{form.watch('clientName')}</strong></p>
                      <div className="mt-8 border-b border-slate-300 w-48"></div>
                      <p className="text-sm text-slate-600 mt-1">Signature</p>
                      <div className="mt-4 border-b border-slate-300 w-32"></div>
                      <p className="text-sm text-slate-600 mt-1">Date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Contract Generator
        </h1>
        <p className="text-xl text-slate-600">
          Generate professional automation service agreements for your clients
        </p>
      </div>

      <Tabs defaultValue="new-contract" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-contract">Generate New Contract</TabsTrigger>
          <TabsTrigger value="existing-contracts">Existing Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="new-contract" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                  <CardDescription>
                    Fill in the client and project information to generate a professional service agreement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Client Name *</Label>
                        <Input
                          id="clientName"
                          {...form.register('clientName')}
                          placeholder="Company or individual name"
                        />
                        {form.formState.errors.clientName && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          {...form.register('contactPerson')}
                          placeholder="Primary contact name"
                        />
                        {form.formState.errors.contactPerson && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactPerson.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="clientAddress">Client Address *</Label>
                      <Textarea
                        id="clientAddress"
                        {...form.register('clientAddress')}
                        placeholder="Complete business address"
                        rows={2}
                      />
                      {form.formState.errors.clientAddress && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientAddress.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="clientEmail">Client Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        {...form.register('clientEmail')}
                        placeholder="business@company.com"
                      />
                      {form.formState.errors.clientEmail && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientEmail.message}</p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="projectTitle">Project Title *</Label>
                      <Input
                        id="projectTitle"
                        {...form.register('projectTitle')}
                        placeholder="e.g., CRM Automation Implementation"
                      />
                      {form.formState.errors.projectTitle && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.projectTitle.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select onValueChange={(value) => form.setValue('serviceType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="projectDescription">Project Description *</Label>
                      <Textarea
                        id="projectDescription"
                        {...form.register('projectDescription')}
                        placeholder="Detailed description of the automation project scope and objectives"
                        rows={4}
                      />
                      {form.formState.errors.projectDescription && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.projectDescription.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="deliverables">Key Deliverables *</Label>
                      <Textarea
                        id="deliverables"
                        {...form.register('deliverables')}
                        placeholder="List the specific deliverables and milestones"
                        rows={4}
                      />
                      {form.formState.errors.deliverables && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.deliverables.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contractValue">Contract Value *</Label>
                        <Input
                          id="contractValue"
                          {...form.register('contractValue')}
                          placeholder="$75,000"
                        />
                        {form.formState.errors.contractValue && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.contractValue.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="paymentTerms">Payment Terms *</Label>
                        <Select onValueChange={(value) => form.setValue('paymentTerms', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTermsOptions.map((term) => (
                              <SelectItem key={term.value} value={term.value}>
                                {term.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          {...form.register('startDate')}
                        />
                        {form.formState.errors.startDate && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.startDate.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="endDate">Expected Completion *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          {...form.register('endDate')}
                        />
                        {form.formState.errors.endDate && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.endDate.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="additionalTerms">Additional Terms (Optional)</Label>
                      <Textarea
                        id="additionalTerms"
                        {...form.register('additionalTerms')}
                        placeholder="Any additional terms or conditions specific to this project"
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={generateContractMutation.isPending}
                    >
                      {generateContractMutation.isPending ? "Generating..." : "Generate Contract"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contract Templates</CardTitle>
                  <CardDescription>Choose a template for your agreement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contractTemplates_data.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTemplate === template.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                        <div className="mt-2">
                          {template.suitable_for.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="existing-contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>View and manage existing automation service agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{contract.projectTitle}</h4>
                        <p className="text-sm text-slate-600">Client: {contract.clientName}</p>
                        <p className="text-sm text-slate-600">Contract: {contract.contractNumber}</p>
                        <p className="text-sm text-slate-600">Created: {contract.createdDate}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={contract.status === 'Draft' ? 'secondary' : 'default'}>
                          {contract.status}
                        </Badge>
                        <p className="text-lg font-semibold mt-2">{contract.contractValue}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Send</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}