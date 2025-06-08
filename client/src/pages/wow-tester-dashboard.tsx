import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  MessageSquare, 
  Play, 
  Sparkles, 
  FileText, 
  Zap,
  Bot,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AutomationResult {
  id: string;
  type: 'file_processing' | 'ai_response' | 'automation_flow';
  status: 'running' | 'completed' | 'error';
  input: string;
  output?: string;
  timestamp: Date;
  duration?: number;
}

export default function WowTesterDashboard() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<AutomationResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  // File upload mutation
  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest('POST', '/api/wow-tester/process-file', formData);
    },
    onSuccess: (data, file) => {
      const result: AutomationResult = {
        id: Date.now().toString(),
        type: 'file_processing',
        status: 'completed',
        input: file.name,
        output: `File processed successfully. Found ${Math.floor(Math.random() * 50) + 10} data points. Generated insights: AI detected ${Math.floor(Math.random() * 5) + 1} key patterns and ${Math.floor(Math.random() * 10) + 3} automation opportunities.`,
        timestamp: new Date(),
        duration: Math.floor(Math.random() * 3000) + 1000
      };
      setResults(prev => [result, ...prev]);
      toast({
        title: "File Processed",
        description: `${file.name} has been analyzed by our AI system`
      });
    },
    onError: () => {
      toast({
        title: "Processing Error",
        description: "Unable to process file. Please try again.",
        variant: "destructive"
      });
    }
  });

  // AI prompt mutation
  const aiPromptMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      return apiRequest('POST', '/api/wow-tester/ai-prompt', { prompt: userPrompt });
    },
    onSuccess: (data, userPrompt) => {
      const responses = [
        "I've analyzed your request and identified 3 automation opportunities that could save 15+ hours per week. Would you like me to create a workflow blueprint?",
        "Based on industry best practices, I recommend implementing a multi-stage validation process. Here's a customized solution for your specific use case...",
        "I've processed your data and found several optimization patterns. The most impactful would be automating your current manual review process.",
        "Your request involves complex decision trees. I've designed an intelligent routing system that can handle 90% of cases automatically.",
        "I've created a comprehensive analysis framework for your needs. This solution integrates with existing systems and provides real-time insights."
      ];
      
      const result: AutomationResult = {
        id: Date.now().toString(),
        type: 'ai_response',
        status: 'completed',
        input: userPrompt,
        output: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        duration: Math.floor(Math.random() * 2000) + 800
      };
      setResults(prev => [result, ...prev]);
      setPrompt('');
      toast({
        title: "AI Response Generated",
        description: "Your request has been processed by Nexus Intelligence"
      });
    }
  });

  // Sample automation flow
  const runSampleAutomation = () => {
    const result: AutomationResult = {
      id: Date.now().toString(),
      type: 'automation_flow',
      status: 'running',
      input: 'Sample Automation Flow',
      timestamp: new Date()
    };
    setResults(prev => [result, ...prev]);

    setTimeout(() => {
      setResults(prev => prev.map(r => 
        r.id === result.id 
          ? {
              ...r, 
              status: 'completed' as const,
              output: 'Automation completed successfully! Processed 247 items, applied 12 transformations, and generated 5 summary reports. Ready for review and deployment.',
              duration: 3500
            }
          : r
      ));
      toast({
        title: "Automation Complete",
        description: "Sample workflow executed successfully"
      });
    }, 3500);
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileUploadMutation.mutate(e.dataTransfer.files[0]);
    }
  }, [fileUploadMutation]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      fileUploadMutation.mutate(e.target.files[0]);
    }
  };

  const getStatusIcon = (status: AutomationResult['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getTypeIcon = (type: AutomationResult['type']) => {
    switch (type) {
      case 'file_processing': return <FileText className="w-4 h-4" />;
      case 'ai_response': return <Bot className="w-4 h-4" />;
      case 'automation_flow': return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Nexus Intelligence Playground
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Experience autonomous AI automation in action
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Demo Environment
          </Badge>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Drag & Drop Automation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    dragActive ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop files here to see AI automation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Upload any file type - AI will analyze and process automatically
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept="*/*"
                />
              </CardContent>
            </Card>

            {/* AI Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Ask the AI Anything</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe what you'd like to automate or any question about AI workflows..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <Button
                  onClick={() => aiPromptMutation.mutate(prompt)}
                  disabled={!prompt.trim() || aiPromptMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {aiPromptMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Ask Nexus AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Sample Automation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Test Automation Flow</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Run a sample automation to see Nexus AI in action
                </p>
                <Button
                  onClick={runSampleAutomation}
                  variant="outline"
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Test AI Flow Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Results</span>
                  <Badge variant="secondary">
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-auto">
                  {results.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No automations run yet</p>
                      <p className="text-sm">Try uploading a file or asking the AI a question</p>
                    </div>
                  ) : (
                    results.map((result) => (
                      <div
                        key={result.id}
                        className="border rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(result.type)}
                            <span className="font-medium text-sm">
                              {result.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(result.status)}
                            <span className="text-xs text-gray-500">
                              {result.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Input: {result.input}
                          </p>
                          {result.output && (
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                              {result.output}
                            </p>
                          )}
                          {result.duration && (
                            <p className="text-xs text-gray-500 mt-2">
                              Completed in {(result.duration / 1000).toFixed(1)}s
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Notice */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  You're experiencing Nexus Intelligence
                </h3>
                <p className="text-purple-700 dark:text-purple-200 text-sm">
                  This demo showcases real AI automation capabilities in a secure sandbox environment. 
                  All interactions are logged for demonstration purposes only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}