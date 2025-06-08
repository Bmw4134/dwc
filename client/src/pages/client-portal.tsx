import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Globe, 
  Code, 
  Zap, 
  MessageSquare,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Plus,
  Eye,
  Edit,
  Archive
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface ClientPortalProps {
  refreshTrigger: number;
}

export default function ClientPortal({ refreshTrigger }: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState('clients');
  const [newRequest, setNewRequest] = useState({
    clientId: '',
    type: 'website_development',
    title: '',
    description: '',
    priority: 'medium',
    budget: '',
    deadline: ''
  });

  const { data: clients } = useQuery({
    queryKey: ['/api/crm/clients'],
    refetchInterval: 30000
  });

  const { data: requests } = useQuery({
    queryKey: ['/api/crm/development-requests'],
    refetchInterval: 15000
  });

  const { data: projects } = useQuery({
    queryKey: ['/api/crm/projects'],
    refetchInterval: 30000
  });

  const requestMutation = useMutation({
    mutationFn: async (data: typeof newRequest) => {
      const response = await fetch('/api/crm/development-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/development-requests'] });
      setNewRequest({
        clientId: '',
        type: 'website_development',
        title: '',
        description: '',
        priority: 'medium',
        budget: '',
        deadline: ''
      });
    }
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate(newRequest);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DWC Systems Client Portal
          </h1>
          <p className="text-xl text-gray-600">
            Proprietary CRM suite for client website development and automation requests
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Dev Requests</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Active Projects</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>ASI Automation</span>
            </TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Database</CardTitle>
                    <CardDescription>Proprietary client management system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(clients as any[])?.map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{client.businessName}</h4>
                              <p className="text-sm text-gray-600">{client.contactName}</p>
                              <p className="text-xs text-gray-500">{client.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={client.implementationStatus === 'active' ? 'default' : 'secondary'}>
                              {client.implementationStatus}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No clients loaded yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Clients</span>
                      <span className="font-bold">{(clients as any[])?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Requests</span>
                      <span className="font-bold text-orange-600">
                        {(requests as any[])?.filter(r => r.status === 'pending').length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Projects</span>
                      <span className="font-bold text-green-600">
                        {(projects as any[])?.filter(p => p.status === 'active').length || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Development Requests Tab */}
          <TabsContent value="requests">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>New Development Request</CardTitle>
                  <CardDescription>Submit website and automation requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client
                      </label>
                      <Select value={newRequest.clientId} onValueChange={(value) => setNewRequest({...newRequest, clientId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {(clients as any[])?.map(client => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.businessName}
                            </SelectItem>
                          )) || <SelectItem value="none">No clients available</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Request Type
                      </label>
                      <Select value={newRequest.type} onValueChange={(value) => setNewRequest({...newRequest, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website_development">Website Development</SelectItem>
                          <SelectItem value="automation_setup">Automation Setup</SelectItem>
                          <SelectItem value="dashboard_creation">Dashboard Creation</SelectItem>
                          <SelectItem value="integration_work">System Integration</SelectItem>
                          <SelectItem value="maintenance">Maintenance & Updates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title
                      </label>
                      <Input
                        value={newRequest.title}
                        onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                        placeholder="Brief project title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                        placeholder="Detailed project requirements"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({...newRequest, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Range
                        </label>
                        <Select value={newRequest.budget} onValueChange={(value) => setNewRequest({...newRequest, budget: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under_5k">Under $5,000</SelectItem>
                            <SelectItem value="5k_15k">$5,000 - $15,000</SelectItem>
                            <SelectItem value="15k_50k">$15,000 - $50,000</SelectItem>
                            <SelectItem value="50k_plus">$50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Deadline
                      </label>
                      <Input
                        type="date"
                        value={newRequest.deadline}
                        onChange={(e) => setNewRequest({...newRequest, deadline: e.target.value})}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={requestMutation.isPending}
                    >
                      {requestMutation.isPending ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                  <CardDescription>Latest development requests from clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(requests as any[])?.slice(0, 5).map((request, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{request.title}</h4>
                          <Badge variant={
                            request.priority === 'urgent' ? 'destructive' :
                            request.priority === 'high' ? 'default' : 'secondary'
                          }>
                            {request.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{request.clientName}</span>
                          <span>{request.submittedAt}</span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No requests submitted yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(projects as any[])?.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.clientName}</CardDescription>
                      </div>
                      <Badge variant={
                        project.status === 'completed' ? 'default' :
                        project.status === 'active' ? 'secondary' : 'outline'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Budget: {project.budget}</span>
                        <span>Due: {project.deadline}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No active projects</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ASI Automation Tab */}
          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle>ASI Request Processing Automation</CardTitle>
                <CardDescription>Automated workflow for handling client development requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Request Intake</h4>
                    <p className="text-sm text-blue-700">ASI automatically categorizes and prioritizes incoming requests</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Resource Allocation</h4>
                    <p className="text-sm text-green-700">AGI analyzes workload and assigns optimal team resources</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Progress Tracking</h4>
                    <p className="text-sm text-purple-700">Real-time monitoring and client communication automation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}