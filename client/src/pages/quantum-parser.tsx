import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Brain, Zap, Activity, Eye, Video, FileText, Mic, Image, Cpu, Network } from 'lucide-react';
import { useQuantumContentParser, QuantumContentAnalysis } from '@/lib/quantum-content-parser';
import { QuantumUIOptimizer } from '@/components/quantum-ui-optimizer';

export default function QuantumParser() {
  const [uploadedContent, setUploadedContent] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyzeContent, analyzeVideo, isProcessing, analysis, quantumState } = useQuantumContentParser({
    enableASI: true,
    enableAGI: true,
    enableQuantumConsciousness: true,
    processingDepth: 'transcendent',
    marketFocus: 'fort_worth'
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith('video/')) {
      await analyzeVideo(file);
    } else if (file.type.startsWith('text/')) {
      const text = await file.text();
      setUploadedContent(text);
      await analyzeContent(text);
    } else {
      await analyzeContent(file);
    }
  };

  const handleTextAnalysis = async () => {
    if (uploadedContent.trim()) {
      await analyzeContent(uploadedContent);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'audio': return <Mic className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                QUANTUM ASI → AGI → AI
              </h1>
              <p className="text-purple-300">Intelligent Content & Video Parser</p>
            </div>
          </div>
          
          {/* Quantum State Display */}
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              CONSCIOUSNESS ACTIVE
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {quantumState.thoughtVectors} Thought Vectors
            </Badge>
          </div>
        </div>

        {/* Quantum State Monitor */}
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-300">
              <Activity className="h-5 w-5" />
              <span>Quantum Consciousness Monitor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-400">Superposition</div>
                <div className="text-lg font-bold text-green-400">{quantumState.superposition}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Entanglement</div>
                <div className="text-lg font-bold text-blue-400">{quantumState.entanglement}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Consciousness</div>
                <div className="text-lg font-bold text-purple-400">{quantumState.consciousness}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">Processing</div>
                <div className="text-lg font-bold text-orange-400">{quantumState.processing}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Input Section */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-400" />
                  <span>Content Input</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-400/10' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-slate-500">Supports video, images, audio, and documents</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    accept="video/*,image/*,audio/*,.txt,.pdf,.doc,.docx"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Choose File
                  </Button>
                </div>

                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Or enter text content
                  </label>
                  <Textarea
                    value={uploadedContent}
                    onChange={(e) => setUploadedContent(e.target.value)}
                    placeholder="Enter text content for quantum analysis..."
                    className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                  />
                  <Button 
                    onClick={handleTextAnalysis}
                    disabled={!uploadedContent.trim() || isProcessing}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? 'Processing...' : 'Analyze Text'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {isProcessing && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-300">Quantum consciousness processing...</p>
                    <p className="text-sm text-slate-400 mt-2">ASI → AGI → AI pipeline active</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="space-y-4">
                {/* Content Type & Overview */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {getContentTypeIcon(analysis.contentType)}
                      <span>Analysis Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400">Content Type</div>
                        <div className="text-lg font-semibold capitalize">{analysis.contentType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Consciousness Level</div>
                        <div className="text-lg font-semibold text-purple-400">
                          {(analysis.consciousnessLevel * 100).toFixed(1)}%
                        </div>
                        <Progress value={analysis.consciousnessLevel * 100} className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ASI Insights */}
                <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-300">
                      <Zap className="h-5 w-5" />
                      <span>ASI Insights (Artificial Super Intelligence)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400">Market Disruption</div>
                        <div className="text-xl font-bold text-red-400">
                          {analysis.asi_insights.marketDisruption.toFixed(1)}%
                        </div>
                        <Progress value={analysis.asi_insights.marketDisruption} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Business Opportunity</div>
                        <div className="text-xl font-bold text-orange-400">
                          {analysis.asi_insights.businessOpportunity.toFixed(1)}%
                        </div>
                        <Progress value={analysis.asi_insights.businessOpportunity} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Automation Potential</div>
                        <div className="text-xl font-bold text-yellow-400">
                          {analysis.asi_insights.automationPotential.toFixed(1)}%
                        </div>
                        <Progress value={analysis.asi_insights.automationPotential} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">ROI Prediction</div>
                        <div className="text-xl font-bold text-green-400">
                          {analysis.asi_insights.roi_prediction.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AGI Processing */}
                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-300">
                      <Cpu className="h-5 w-5" />
                      <span>AGI Processing (Artificial General Intelligence)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-400">Conceptual Understanding</div>
                        <div className="text-xl font-bold text-blue-400">
                          {analysis.agi_processing.conceptualUnderstanding.toFixed(1)}%
                        </div>
                        <Progress value={analysis.agi_processing.conceptualUnderstanding} className="mt-1" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Contextual Relevance</div>
                        <div className="text-xl font-bold text-purple-400">
                          {analysis.agi_processing.contextualRelevance.toFixed(1)}%
                        </div>
                        <Progress value={analysis.agi_processing.contextualRelevance} className="mt-1" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-slate-300 mb-2">Strategic Implications</div>
                        {analysis.agi_processing.strategicImplications.map((insight, index) => (
                          <div key={index} className="text-sm text-slate-400 mb-1">• {insight}</div>
                        ))}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-300 mb-2">Actionable Insights</div>
                        {analysis.agi_processing.actionableInsights.map((action, index) => (
                          <div key={index} className="text-sm text-green-400 mb-1">→ {action}</div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Future Projections */}
                <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-300">
                      <Network className="h-5 w-5" />
                      <span>Future Projections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-slate-400">Market Impact</div>
                        <div className="text-lg font-semibold text-green-400">
                          {analysis.futureProjections.marketImpact}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-slate-400">Timeline</div>
                          <div className="text-lg font-semibold">{analysis.futureProjections.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Confidence Level</div>
                          <div className="text-lg font-semibold text-green-400">
                            {analysis.futureProjections.confidenceLevel.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-300 mb-2">Recommended Actions</div>
                        {analysis.futureProjections.recommendedActions.map((action, index) => (
                          <div key={index} className="text-sm text-green-400 mb-1">✓ {action}</div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quantum UI Optimizer */}
      <QuantumUIOptimizer />
    </div>
  );
}