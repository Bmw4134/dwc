import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  Briefcase,
  FileText,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FundingOption {
  source: string;
  amount: string;
  timeframe: string;
  requirements: string[];
  applicationUrl: string;
  successRate: number;
  category: 'grant' | 'competition' | 'accelerator' | 'crowdfunding' | 'revenue' | 'asset';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ActionPlan {
  immediateOptions: FundingOption[];
  mediumTermOptions: FundingOption[];
  specificSteps: string[];
  timeline: string;
}

export default function EnhancedFundingDashboard() {
  const [fundingOptions, setFundingOptions] = useState<FundingOption[]>([]);
  const [liveResearch, setLiveResearch] = useState<FundingOption[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [localOptions, setLocalOptions] = useState<FundingOption[]>([]);
  const [targetAmount, setTargetAmount] = useState(500);
  const [zipCode, setZipCode] = useState('76140');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('curated');
  const { toast } = useToast();

  useEffect(() => {
    fetchCuratedOptions();
    fetchActionPlan();
  }, []);

  const fetchCuratedOptions = async () => {
    try {
      const response = await fetch('/api/funding/options');
      const data = await response.json();
      setFundingOptions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch funding options",
        variant: "destructive"
      });
    }
  };

  const fetchLiveResearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/funding/research-live?amount=${targetAmount}`);
      const data = await response.json();
      setLiveResearch(data);
      setActiveTab('live');
      toast({
        title: "Research Complete",
        description: `Found ${data.length} live funding opportunities`
      });
    } catch (error) {
      toast({
        title: "Research Error",
        description: "Live research unavailable. Showing curated options.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActionPlan = async () => {
    try {
      const response = await fetch(`/api/funding/action-plan?amount=${targetAmount}`);
      const data = await response.json();
      setActionPlan(data);
    } catch (error) {
      console.error('Failed to fetch action plan:', error);
    }
  };

  const fetchLocalOptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/funding/local/${zipCode}`);
      const data = await response.json();
      setLocalOptions(data);
      setActiveTab('local');
      toast({
        title: "Local Research Complete",
        description: `Found ${data.length} local opportunities`
      });
    } catch (error) {
      toast({
        title: "Local Research Error",
        description: "Failed to fetch local opportunities",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grant': return <DollarSign className="h-4 w-4" />;
      case 'revenue': return <TrendingUp className="h-4 w-4" />;
      case 'asset': return <Briefcase className="h-4 w-4" />;
      case 'competition': return <Target className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderFundingCard = (option: FundingOption, index: number) => (
    <Card key={index} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center">
            {getCategoryIcon(option.category)}
            <span className="ml-2">{option.source}</span>
          </CardTitle>
          <Badge className={getDifficultyColor(option.difficulty)}>
            {option.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">{option.amount}</div>
            <div className="text-sm text-gray-500">Funding Amount</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{option.timeframe}</div>
            <div className="text-sm text-gray-500">Timeline</div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Success Rate</div>
          <Progress value={option.successRate} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">{option.successRate}%</div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Requirements</div>
          <ul className="text-sm text-gray-600 space-y-1">
            {option.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <Button 
          className="w-full" 
          onClick={() => window.open(option.applicationUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            $500 LLC Funding Research Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            AI-Powered Funding Discovery & Application Intelligence
          </p>
        </div>

        {/* Research Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Research Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Amount</label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(parseInt(e.target.value))}
                  placeholder="500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Zip Code</label>
                <Input
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="76140"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchLiveResearch} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Live Research
                </Button>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchLocalOptions} disabled={isLoading} variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Local Options
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Plan */}
        {actionPlan && (
          <Alert className="mb-8">
            <Target className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Recommended Action Plan for ${targetAmount}</div>
              <div className="text-sm space-y-1">
                <div><strong>Timeline:</strong> {actionPlan.timeline}</div>
                <div><strong>Immediate Options:</strong> {actionPlan.immediateOptions.length} available</div>
                <div><strong>Next Steps:</strong> {actionPlan.specificSteps.slice(0, 2).join(', ')}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Funding Options Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curated">Curated Options ({fundingOptions.length})</TabsTrigger>
            <TabsTrigger value="live">Live Research ({liveResearch.length})</TabsTrigger>
            <TabsTrigger value="local">Local ({localOptions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="curated" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundingOptions.map((option, index) => renderFundingCard(option, index))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            {liveResearch.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveResearch.map((option, index) => renderFundingCard(option, index))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Live Research Yet</h3>
                  <p className="text-gray-500 mb-4">Click "Live Research" to discover current funding opportunities</p>
                  <Button onClick={fetchLiveResearch} disabled={isLoading}>
                    Start Research
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="local" className="mt-6">
            {localOptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localOptions.map((option, index) => renderFundingCard(option, index))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Local Research Yet</h3>
                  <p className="text-gray-500 mb-4">Click "Local Options" to find opportunities in your area</p>
                  <Button onClick={fetchLocalOptions} disabled={isLoading}>
                    Research Local
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">${targetAmount}</div>
              <div className="text-sm text-gray-500">Target Amount</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">1-7</div>
              <div className="text-sm text-gray-500">Days Timeline</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{fundingOptions.length}</div>
              <div className="text-sm text-gray-500">Total Options</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}