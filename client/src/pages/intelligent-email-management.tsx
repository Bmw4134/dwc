import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Shield, 
  Brain, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Zap,
  Target,
  Search,
  Filter,
  Archive,
  Reply,
  Forward,
  Calendar,
  User,
  Globe,
  Eye,
  EyeOff,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

interface EmailAccount {
  id: string;
  email: string;
  displayName: string;
  department: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastProcessed: Date;
  messagesProcessed: number;
  threatsBlocked: number;
}

interface ActionableInsight {
  id: string;
  emailSubject: string;
  sender: string;
  priority: 'immediate' | 'today' | 'this_week' | 'low_priority';
  actionType: 'respond' | 'schedule_meeting' | 'follow_up' | 'delegate' | 'archive' | 'escalate';
  suggestedResponse?: string;
  deadline?: Date;
  context: string;
  businessImpact: 'high' | 'medium' | 'low';
  estimatedTime: string;
  confidenceScore: number;
}

interface EmailProcessingSummary {
  totalAccounts: number;
  processed: number;
  actionable: number;
  threats: number;
  lastProcessed: Date;
  upcomingDeadlines: ActionableInsight[];
}

interface SecurityThreat {
  id: string;
  type: 'phishing' | 'spam' | 'malware';
  sender: string;
  subject: string;
  riskScore: number;
  blockedAt: Date;
  action: 'blocked' | 'quarantined' | 'deleted';
}

export default function IntelligentEmailManagement() {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showSecurityThreats, setShowSecurityThreats] = useState(false);
  const [processingEmails, setProcessingEmails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'immediate' | 'today' | 'this_week'>('all');
  const queryClient = useQueryClient();

  // Fetch email accounts
  const { data: emailAccounts } = useQuery<EmailAccount[]>({
    queryKey: ['/api/email/accounts'],
  });

  // Fetch processing summary
  const { data: processingSummary } = useQuery<EmailProcessingSummary>({
    queryKey: ['/api/email/summary'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch actionable insights
  const { data: insights } = useQuery<ActionableInsight[]>({
    queryKey: ['/api/email/insights', filter],
  });

  // Fetch security threats
  const { data: securityThreats } = useQuery<SecurityThreat[]>({
    queryKey: ['/api/email/threats'],
    enabled: showSecurityThreats
  });

  // Process emails mutation
  const processEmailsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/email/process', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/email/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/email/insights'] });
      setProcessingEmails(false);
    },
    onError: () => {
      setProcessingEmails(false);
    },
  });

  // Add email account mutation
  const addAccountMutation = useMutation({
    mutationFn: async (accountData: {
      email: string;
      password: string;
      displayName: string;
      department: string;
      provider: string;
    }) => {
      return apiRequest('/api/email/accounts', {
        method: 'POST',
        body: JSON.stringify(accountData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/email/accounts'] });
    },
  });

  const handleProcessEmails = () => {
    setProcessingEmails(true);
    processEmailsMutation.mutate();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500 text-white';
      case 'today': return 'bg-orange-500 text-white';
      case 'this_week': return 'bg-yellow-500 text-black';
      case 'low_priority': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getBusinessImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Intelligent Email Management
            </h1>
            <Shield className="h-10 w-10 text-green-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered email processing with advanced security filtering and autonomous action generation
          </p>
        </motion.div>

        {/* Summary Dashboard */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={itemVariants}>
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {processingSummary?.totalAccounts || 0}
                  </p>
                </div>
                <Mail className="h-12 w-12 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Processed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {processingSummary?.processed || 0}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Action Required</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {processingSummary?.actionable || 0}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Threats Blocked</p>
                  <p className="text-3xl font-bold text-red-600">
                    {processingSummary?.threats || 0}
                  </p>
                </div>
                <Shield className="h-12 w-12 text-red-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div className="flex flex-wrap items-center justify-between gap-4" variants={itemVariants}>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleProcessEmails}
              disabled={processingEmails}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {processingEmails ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Process All Emails
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowSecurityThreats(!showSecurityThreats)}
            >
              {showSecurityThreats ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Threats
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View Threats
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actionable Insights */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  Actionable Insights
                  <Badge variant="secondary">{insights?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights && insights.length > 0 ? (
                    insights.map((insight) => (
                      <motion.div
                        key={insight.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {insight.emailSubject}
                            </h4>
                            <p className="text-sm text-gray-600">
                              From: {insight.sender}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getBusinessImpactColor(insight.businessImpact)}>
                              {insight.businessImpact} impact
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{insight.context}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Action: {insight.actionType.replace('_', ' ')}</span>
                            <span>Time: {insight.estimatedTime}</span>
                            <span>Confidence: {Math.round(insight.confidenceScore * 100)}%</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {insight.actionType === 'respond' && (
                              <Button size="sm" variant="outline">
                                <Reply className="h-4 w-4 mr-1" />
                                Draft Reply
                              </Button>
                            )}
                            {insight.actionType === 'schedule_meeting' && (
                              <Button size="sm" variant="outline">
                                <Calendar className="h-4 w-4 mr-1" />
                                Schedule
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Archive className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          </div>
                        </div>

                        {insight.suggestedResponse && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border">
                            <p className="text-sm font-medium text-blue-800 mb-1">Suggested Response:</p>
                            <p className="text-sm text-blue-700">{insight.suggestedResponse}</p>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No actionable insights</h3>
                      <p className="text-gray-500">Process your emails to generate AI-powered insights</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Email Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-5 w-5 text-green-600" />
                  Email Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailAccounts && emailAccounts.length > 0 ? (
                    emailAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{account.displayName}</p>
                          <p className="text-sm text-gray-500">{account.email}</p>
                          <p className="text-xs text-gray-400">{account.department}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={account.status === 'connected' ? 'default' : 'destructive'}
                            className="mb-1"
                          >
                            {account.status}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {account.messagesProcessed} processed
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-3">No accounts connected</p>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Account
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Threats (when enabled) */}
            {showSecurityThreats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Security Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityThreats && securityThreats.length > 0 ? (
                      securityThreats.slice(0, 5).map((threat) => (
                        <div
                          key={threat.id}
                          className="p-3 border border-red-200 rounded-lg bg-red-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge 
                              variant="destructive"
                              className="text-xs"
                            >
                              {threat.type}
                            </Badge>
                            <span className="text-xs text-red-600">
                              Risk: {threat.riskScore}%
                            </span>
                          </div>
                          <p className="font-medium text-red-900 text-sm">{threat.subject}</p>
                          <p className="text-xs text-red-700">From: {threat.sender}</p>
                          <p className="text-xs text-red-600 mt-1">
                            {threat.action} • {new Date(threat.blockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Shield className="h-12 w-12 text-green-300 mx-auto mb-3" />
                        <p className="text-green-600 font-medium">All Clear</p>
                        <p className="text-green-500 text-sm">No security threats detected</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Processing Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last processed:</span>
                    <span className="text-sm font-medium">
                      {processingSummary?.lastProcessed 
                        ? new Date(processingSummary.lastProcessed).toLocaleString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next processing:</span>
                    <span className="text-sm font-medium text-blue-600">Automated</span>
                  </div>

                  {processingSummary?.upcomingDeadlines && processingSummary.upcomingDeadlines.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Upcoming Deadlines:</p>
                      {processingSummary.upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                        <div key={index} className="text-xs p-2 bg-yellow-50 rounded border mb-1">
                          <p className="font-medium text-yellow-800">{deadline.emailSubject}</p>
                          <p className="text-yellow-600">
                            {deadline.deadline ? new Date(deadline.deadline).toLocaleDateString() : 'No deadline'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}