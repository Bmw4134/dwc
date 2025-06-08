import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  FolderOpen, 
  Upload, 
  Download,
  Calendar,
  Calculator,
  Building,
  Receipt,
  CreditCard,
  Landmark,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Archive
} from 'lucide-react';

interface BusinessFileSystemProps {
  refreshTrigger: number;
}

export default function BusinessFileSystem({ refreshTrigger }: BusinessFileSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState('tax-documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentCategories = [
    {
      id: 'tax-documents',
      name: 'Tax Documents',
      icon: Calculator,
      count: 24,
      color: 'blue',
      description: 'Federal, state, and quarterly tax filings'
    },
    {
      id: 'financial-records',
      name: 'Financial Records',
      icon: Bank,
      count: 156,
      color: 'green',
      description: 'Bank statements, invoices, receipts'
    },
    {
      id: 'business-formation',
      name: 'Business Formation',
      icon: Building,
      count: 12,
      color: 'purple',
      description: 'EIN, Articles of Organization, Operating Agreement'
    },
    {
      id: 'client-contracts',
      name: 'Client Contracts',
      icon: FileText,
      count: 8,
      color: 'orange',
      description: 'Service agreements and project contracts'
    },
    {
      id: 'expenses',
      name: 'Business Expenses',
      icon: Receipt,
      count: 89,
      color: 'red',
      description: 'Equipment, software, travel, and operational costs'
    },
    {
      id: 'payroll',
      name: 'Payroll & HR',
      icon: CreditCard,
      count: 15,
      color: 'yellow',
      description: 'Employee records, payroll, benefits'
    }
  ];

  const taxDocuments = [
    {
      name: 'Form 1120S - S Corporation Tax Return',
      status: 'pending',
      dueDate: '2025-03-15',
      category: 'Federal',
      description: 'Annual S-Corp tax return for DWC Systems LLC',
      required: true
    },
    {
      name: 'Texas Franchise Tax Report',
      status: 'pending',
      dueDate: '2025-05-15',
      category: 'State',
      description: 'Texas state business tax filing',
      required: true
    },
    {
      name: 'Quarterly 941 Payroll Tax',
      status: 'completed',
      dueDate: '2025-01-31',
      category: 'Quarterly',
      description: 'Q4 2024 payroll tax return',
      required: true
    },
    {
      name: 'Business Expense Summary',
      status: 'in-progress',
      dueDate: '2025-02-28',
      category: 'Supporting',
      description: 'Categorized expense report for tax preparation',
      required: false
    },
    {
      name: 'Equipment Depreciation Schedule',
      status: 'pending',
      dueDate: '2025-03-01',
      category: 'Supporting',
      description: 'Computer equipment and software depreciation',
      required: false
    }
  ];

  const einTasks = [
    {
      task: 'Submit EIN Application (SS-4)',
      status: 'completed',
      assignedTo: 'Christina',
      priority: 'high',
      estimatedTime: '30 minutes',
      notes: 'Submitted online via IRS website'
    },
    {
      task: 'Receive EIN Confirmation Letter',
      status: 'in-progress',
      assignedTo: 'System',
      priority: 'high',
      estimatedTime: '1-2 weeks',
      notes: 'IRS processing time for online applications'
    },
    {
      task: 'Update Business Bank Account',
      status: 'pending',
      assignedTo: 'Christina',
      priority: 'medium',
      estimatedTime: '45 minutes',
      notes: 'Provide EIN to bank for account updates'
    },
    {
      task: 'Register with Texas Secretary of State',
      status: 'pending',
      assignedTo: 'Christina',
      priority: 'medium',
      estimatedTime: '1 hour',
      notes: 'Complete Texas business registration with EIN'
    },
    {
      task: 'Setup QuickBooks with EIN',
      status: 'pending',
      assignedTo: 'Christina',
      priority: 'low',
      estimatedTime: '2 hours',
      notes: 'Configure accounting software for tax tracking'
    },
    {
      task: 'File Initial Texas Franchise Tax',
      status: 'pending',
      assignedTo: 'Christina',
      priority: 'low',
      estimatedTime: '1 hour',
      notes: 'Due within 60 days of receiving EIN'
    }
  ];

  const automationOpportunities = [
    {
      process: 'Receipt Scanning & Categorization',
      currentMethod: 'Manual photo + spreadsheet entry',
      automatedSolution: 'AI-powered receipt scanning with automatic categorization',
      timeSavings: '15 hours/month',
      difficultly: 'Easy',
      priority: 'High'
    },
    {
      process: 'Invoice Generation & Tracking',
      currentMethod: 'Manual invoice creation and follow-up',
      automatedSolution: 'Automated invoice generation with payment reminders',
      timeSavings: '8 hours/month',
      difficultly: 'Medium',
      priority: 'High'
    },
    {
      process: 'Bank Transaction Reconciliation',
      currentMethod: 'Manual bank statement review',
      automatedSolution: 'Automatic bank feed integration with categorization',
      timeSavings: '6 hours/month',
      difficultly: 'Easy',
      priority: 'Medium'
    },
    {
      process: 'Tax Document Preparation',
      currentMethod: 'Manual data compilation from multiple sources',
      automatedSolution: 'Automated tax report generation from categorized data',
      timeSavings: '20 hours/quarter',
      difficultly: 'Hard',
      priority: 'High'
    },
    {
      process: 'Expense Report Generation',
      currentMethod: 'Manual Excel spreadsheets',
      automatedSolution: 'Real-time expense dashboard with automatic reports',
      timeSavings: '4 hours/month',
      difficultly: 'Easy',
      priority: 'Medium'
    }
  ];

  const christinaTasks = [
    {
      category: 'Daily Operations',
      tasks: [
        'Review and categorize daily receipts/expenses',
        'Process client invoices and payments',
        'Update QuickBooks transactions',
        'Monitor cash flow dashboard'
      ]
    },
    {
      category: 'Weekly Management',
      tasks: [
        'Generate weekly financial reports',
        'Review accounts receivable aging',
        'Reconcile bank statements',
        'Update project profitability tracking'
      ]
    },
    {
      category: 'Monthly Responsibilities',
      tasks: [
        'Prepare monthly P&L statements',
        'Calculate quarterly tax estimates',
        'Review and file sales tax returns',
        'Update business insurance documentation'
      ]
    },
    {
      category: 'Tax Season Preparation',
      tasks: [
        'Organize all tax-related documents',
        'Generate depreciation schedules',
        'Prepare business expense summaries',
        'Coordinate with tax professional'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business File Management System
          </h1>
          <p className="text-xl text-gray-600">
            Complete document organization and tax preparation for DWC Systems LLC
          </p>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="documents">Document Library</TabsTrigger>
            <TabsTrigger value="tax">Tax Center</TabsTrigger>
            <TabsTrigger value="ein">EIN Pipeline</TabsTrigger>
            <TabsTrigger value="automation">Automation Hub</TabsTrigger>
            <TabsTrigger value="christina">Christina's Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Document Categories Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id} 
                    className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCategory === category.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`h-5 w-5 text-${category.color}-600`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <CardDescription className="text-sm">{category.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Document Upload Center</span>
                </CardTitle>
                <CardDescription>
                  Drag and drop files or click to upload. Automatic categorization and OCR processing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Upload Business Documents</p>
                      <p className="text-sm text-gray-500">Supports PDF, JPG, PNG, Excel, Word documents</p>
                    </div>
                    <div className="flex space-x-4 justify-center">
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                      <Button variant="outline">
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Browse Folder
                      </Button>
                    </div>
                  </div>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Processing documents...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search documents by name, category, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="space-y-6">
            {/* Tax Year Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-700">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-600">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-700">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-600">Pending</p>
                      <p className="text-2xl font-bold text-red-700">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Next Due</p>
                      <p className="text-lg font-bold text-blue-700">Jan 31</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tax Documents Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>2024 Tax Filing Checklist</CardTitle>
                <CardDescription>
                  Track all required documents and deadlines for seamless tax preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          doc.status === 'completed' ? 'bg-green-500' :
                          doc.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h3 className="font-semibold">{doc.name}</h3>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={doc.category === 'Federal' ? 'default' : 
                                      doc.category === 'State' ? 'secondary' : 'outline'}>
                          {doc.category}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">Due: {doc.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ein" className="space-y-6">
            {/* EIN Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>EIN Application Pipeline</span>
                </CardTitle>
                <CardDescription>
                  Track progress from application to full business registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {einTasks.map((task, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{task.task}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.priority === 'high' ? 'destructive' : 
                                        task.priority === 'medium' ? 'default' : 'secondary'}>
                            {task.priority}
                          </Badge>
                          <Badge variant={task.status === 'completed' ? 'default' : 
                                        task.status === 'in-progress' ? 'secondary' : 'outline'}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Assigned to:</span>
                          <span className="font-medium ml-2">{task.assignedTo}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Est. Time:</span>
                          <span className="font-medium ml-2">{task.estimatedTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Notes:</span>
                          <span className="ml-2">{task.notes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            {/* Automation Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {automationOpportunities.map((opportunity, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{opportunity.process}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant={opportunity.priority === 'High' ? 'destructive' : 'secondary'}>
                        {opportunity.priority} Priority
                      </Badge>
                      <Badge variant="outline">{opportunity.difficultly}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">Current Method:</h4>
                        <p className="text-sm text-gray-700">{opportunity.currentMethod}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">Automated Solution:</h4>
                        <p className="text-sm text-gray-700">{opportunity.automatedSolution}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">Time Savings:</span>
                        <span className="font-bold text-blue-700">{opportunity.timeSavings}</span>
                      </div>
                      <Button className="w-full" variant="outline">
                        Implement Automation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="christina" className="space-y-6">
            {/* Christina's Daily Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Christina's Operations Dashboard</CardTitle>
                <CardDescription>
                  Your command center for managing DWC Systems while Brett transitions out of his 8-5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {christinaTasks.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">{section.category}</h3>
                      <div className="space-y-2">
                        {section.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions for Christina */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Priorities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Receipt className="h-4 w-4 mr-2" />
                      Process Daily Receipts
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Client Invoices
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bank className="h-4 w-4 mr-2" />
                      Update QuickBooks
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Weekly P&L Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cash Flow Analysis
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Tax Document Prep
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">EIN Application</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tax Documents</span>
                      <Badge variant="destructive">Needs Attention</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">QuickBooks Sync</span>
                      <Badge variant="default">Up to Date</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}