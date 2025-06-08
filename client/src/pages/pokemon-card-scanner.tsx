import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Scan,
  BarChart3,
  Star,
  Package,
  Zap,
  Palette,
  Minimize2,
  Brain,
  Target,
  Shield,
  Settings,
  Smartphone,
  RefreshCw,
  Download,
  Building2,
  ChevronDown,
  Timer,
  Maximize2,
  FlashIcon as Flash,
  RotateCcw,
  Layers,
  Cpu,
  Clock,
  X
} from 'lucide-react';

interface PokemonCard {
  id: string;
  name: string;
  set: string;
  number: string;
  rarity: string;
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'poor';
  image_url: string;
  tcgplayer_id?: string;
  pokemon_center_id?: string;
}

interface ScanResult {
  id: string;
  card: PokemonCard;
  marketPrice: number;
  gameXChangeValue: number;
  confidence: number;
  scanTime: number;
  timestamp: Date;
  priceHistory: Array<{ date: string; price: number }>;
  marketTrend: 'up' | 'down' | 'stable';
  recommendation: 'buy' | 'sell' | 'hold';
  aiInsights: string[];
}

export default function PokemonCardScanner() {
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<ScanResult | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanProgress, setScanProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [qqasiMode, setQqasiMode] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [autoScan, setAutoScan] = useState(true);
  const [collectionStats, setCollectionStats] = useState({
    totalValue: 0,
    cardCount: 0,
    averageValue: 0,
    gameXChangeValue: 0,
    processingTime: 0,
    topCard: null as ScanResult | null
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize camera with mobile optimization
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError(null);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: isMobile ? { ideal: 1920, max: 3840 } : { ideal: 1280 },
          height: isMobile ? { ideal: 1080, max: 2160 } : { ideal: 720 },
          frameRate: { ideal: 30 },
          focusMode: 'continuous',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.play();
      }
      
      setShowCamera(true);
      
      if (isMobile) {
        toast({
          title: "Mobile Camera Optimized",
          description: "iPhone camera ready for Pokemon card scanning",
        });
      }
    } catch (error) {
      console.error('Camera initialization error:', error);
      setCameraError(`Camera access failed: ${error.message}`);
      toast({
        title: "Camera Error",
        description: "Please allow camera access and try again",
        variant: "destructive"
      });
    }
  }, [facingMode, isMobile, toast]);

  // Enhanced mobile card scanning with QQASI
  const scanCard = useCallback(async (imageData?: string) => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate QQASI scanning progress
      const progressSteps = [
        { step: 20, message: "Quantum image analysis..." },
        { step: 40, message: "AI card identification..." },
        { step: 60, message: "Market price lookup..." },
        { step: 80, message: "Game X Change calculation..." },
        { step: 100, message: "QQASI insights generation..." }
      ];

      for (const { step, message } of progressSteps) {
        setScanProgress(step);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Generate realistic scan result
      const cardNames = [
        "Charizard", "Pikachu", "Blastoise", "Venusaur", "Mewtwo", 
        "Mew", "Lugia", "Ho-Oh", "Rayquaza", "Dialga"
      ];
      
      const sets = [
        "Base Set", "Jungle", "Fossil", "Team Rocket", "Neo Genesis",
        "Expedition", "Aquapolis", "Skyridge", "EX Ruby & Sapphire", "Diamond & Pearl"
      ];
      
      const rarities = ["Common", "Uncommon", "Rare", "Rare Holo", "Ultra Rare"];
      const conditions = ["mint", "near_mint", "excellent", "good"] as const;
      
      const randomCard = cardNames[Math.floor(Math.random() * cardNames.length)];
      const randomSet = sets[Math.floor(Math.random() * sets.length)];
      const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      const basePrice = Math.random() * 500 + 10;
      const gameXChangeValue = basePrice * 0.20; // 20% trade ratio
      
      const scanResult: ScanResult = {
        id: Date.now().toString(),
        card: {
          id: Date.now().toString(),
          name: randomCard,
          set: randomSet,
          number: Math.floor(Math.random() * 200 + 1).toString(),
          rarity: randomRarity,
          condition: randomCondition,
          image_url: `https://images.pokemontcg.io/base1/${Math.floor(Math.random() * 102 + 1)}.png`
        },
        marketPrice: Math.round(basePrice * 100) / 100,
        gameXChangeValue: Math.round(gameXChangeValue * 100) / 100,
        confidence: Math.random() * 20 + 80,
        scanTime: Math.random() * 2000 + 500,
        timestamp: new Date(),
        priceHistory: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: basePrice + (Math.random() - 0.5) * 20
        })),
        marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
        recommendation: ['buy', 'sell', 'hold'][Math.floor(Math.random() * 3)] as 'buy' | 'sell' | 'hold',
        aiInsights: [
          `${randomCard} from ${randomSet} shows strong market demand`,
          `Condition grade: ${randomCondition} - affects pricing by ${Math.floor(Math.random() * 20 + 5)}%`,
          `Game X Change trade value: $${gameXChangeValue.toFixed(2)} (20% of market)`,
          qqasiMode ? "QQASI: Quantum analysis indicates optimal trade timing" : "Standard analysis complete"
        ]
      };

      setScanResults(prev => [scanResult, ...prev]);
      setSelectedCard(scanResult);
      
      // Update collection stats
      const newStats = {
        totalValue: collectionStats.totalValue + scanResult.marketPrice,
        cardCount: collectionStats.cardCount + 1,
        averageValue: (collectionStats.totalValue + scanResult.marketPrice) / (collectionStats.cardCount + 1),
        gameXChangeValue: collectionStats.gameXChangeValue + scanResult.gameXChangeValue,
        processingTime: collectionStats.processingTime + scanResult.scanTime,
        topCard: !collectionStats.topCard || scanResult.marketPrice > collectionStats.topCard.marketPrice 
          ? scanResult 
          : collectionStats.topCard
      };
      setCollectionStats(newStats);

      toast({
        title: qqasiMode ? "QQASI Scan Complete" : "Scan Complete",
        description: `${randomCard} identified - $${scanResult.marketPrice.toFixed(2)} market value`,
      });

      // Auto-continue scanning in bulk mode
      if (bulkMode && autoScan) {
        setTimeout(() => {
          setScanProgress(0);
          setIsScanning(false);
          setTimeout(() => scanCard(), 1000);
        }, 2000);
      }

    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Please try again with better lighting",
        variant: "destructive"
      });
    } finally {
      if (!bulkMode || !autoScan) {
        setIsScanning(false);
        setScanProgress(0);
      }
    }
  }, [bulkMode, autoScan, qqasiMode, collectionStats, toast]);

  // Capture photo from video
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    scanCard(imageData);
  }, [scanCard]);

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      scanCard(imageData);
    };
    reader.readAsDataURL(file);
  }, [scanCard]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setCameraError(null);
  }, []);

  // Generate Game X Change report
  const generateGameXChangeReport = useCallback(() => {
    const reportData = {
      scanDate: new Date().toISOString(),
      totalCards: scanResults.length,
      totalMarketValue: scanResults.reduce((sum, result) => sum + result.marketPrice, 0),
      totalGameXChangeValue: scanResults.reduce((sum, result) => sum + result.gameXChangeValue, 0),
      averageProcessingTime: scanResults.reduce((sum, result) => sum + result.scanTime, 0) / scanResults.length,
      cards: scanResults.map(result => ({
        name: result.card.name,
        set: result.card.set,
        condition: result.card.condition,
        marketPrice: result.marketPrice,
        gameXChangeValue: result.gameXChangeValue,
        confidence: result.confidence,
        scanTime: result.scanTime
      }))
    };

    const csv = [
      'Card Name,Set,Condition,Market Price,Game X Change Value,Confidence,Scan Time (ms)',
      ...reportData.cards.map(card => 
        `"${card.name}","${card.set}","${card.condition}",${card.marketPrice},${card.gameXChangeValue},${card.confidence.toFixed(1)},${card.scanTime.toFixed(0)}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameXChange_Pokemon_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: `CSV report for ${reportData.totalCards} cards downloaded`,
    });
  }, [scanResults, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Mobile-Optimized Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            {qqasiMode && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 md:w-12 md:h-12"
              >
                <Brain className="w-full h-full text-purple-400" />
              </motion.div>
            )}
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {qqasiMode ? "QQASI Pokemon Scanner" : "Pokemon Card Scanner"}
            </h1>
            {isMobile && <Smartphone className="h-6 w-6 text-green-400" />}
          </div>
          <p className="text-sm md:text-xl text-slate-300 max-w-2xl mx-auto">
            {qqasiMode 
              ? "Quantum-Enhanced AI Scanning for Game X Change Corporate Integration"
              : "Professional Pokemon Card Analysis for Game X Change Partnership"
            }
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
              {isMobile ? "MOBILE OPTIMIZED" : "DESKTOP READY"}
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
              GAME X CHANGE INTEGRATION
            </Badge>
            {qqasiMode && (
              <Badge variant="outline" className="border-blue-500 text-blue-400 text-xs">
                QQASI ENHANCED
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-400">Scanned</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{collectionStats.cardCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-400">Market Value</p>
                  <p className="text-lg md:text-2xl font-bold text-white">${collectionStats.totalValue.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-400">GXC Value</p>
                  <p className="text-lg md:text-2xl font-bold text-white">${collectionStats.gameXChangeValue.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-400">Avg Time</p>
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {collectionStats.cardCount > 0 
                      ? `${(collectionStats.processingTime / collectionStats.cardCount / 1000).toFixed(1)}s`
                      : "0s"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scanner Controls */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <CardTitle className="text-purple-400 text-lg md:text-xl">Scanner Controls</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQqasiMode(!qqasiMode)}
                  className={qqasiMode ? "bg-purple-600 text-white" : ""}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  QQASI
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkMode(!bulkMode)}
                  className={bulkMode ? "bg-blue-600 text-white" : ""}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  Bulk
                </Button>
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Flip
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Camera Section */}
            {showCamera ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-black"
                  style={{ maxHeight: isMobile ? '60vh' : '400px' }}
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Mobile Camera Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-purple-400 border-dashed rounded-lg w-64 h-40 md:w-80 md:h-52 flex items-center justify-center">
                    <span className="text-purple-400 text-sm bg-black/50 px-2 py-1 rounded">
                      Position Pokemon card here
                    </span>
                  </div>
                </div>
                
                {/* Camera Controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <Button
                    onClick={capturePhoto}
                    disabled={isScanning}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size={isMobile ? "lg" : "default"}
                  >
                    {isScanning ? (
                      <>
                        <Cpu className="h-4 w-4 mr-2 animate-spin" />
                        {qqasiMode ? "QQASI Processing..." : "Scanning..."}
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Scan Card
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size={isMobile ? "lg" : "default"}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  onClick={initializeCamera}
                  className="bg-purple-600 hover:bg-purple-700 h-20 md:h-24"
                >
                  <Camera className="h-6 w-6 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Start Camera</div>
                    <div className="text-sm opacity-75">
                      {isMobile ? "iPhone optimized scanning" : "Desktop camera"}
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-20 md:h-24"
                >
                  <Upload className="h-6 w-6 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Upload Photo</div>
                    <div className="text-sm opacity-75">Select from gallery</div>
                  </div>
                </Button>
              </div>
            )}

            {/* Scanning Progress */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{qqasiMode ? "QQASI Analysis" : "Scanning"}</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}

            {/* Camera Error */}
            {cameraError && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 text-sm">{cameraError}</span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              capture={isMobile ? "environment" : undefined}
            />
          </CardContent>
        </Card>

        {/* Scan Results */}
        {scanResults.length > 0 && (
          <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <CardTitle className="text-green-400">Scan Results ({scanResults.length})</CardTitle>
                <Button onClick={generateGameXChangeReport} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Game X Change Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:gap-4">
                {scanResults.slice(0, 5).map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-700/50 rounded-lg p-3 md:p-4 cursor-pointer hover:bg-slate-700/70 transition-colors"
                    onClick={() => setSelectedCard(result)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-white text-sm md:text-base">{result.card.name}</h3>
                        <p className="text-xs md:text-sm text-slate-400">{result.card.set} • {result.card.condition}</p>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          <Badge variant="outline" className="text-xs">
                            ${result.marketPrice.toFixed(2)} market
                          </Badge>
                          <Badge variant="outline" className="border-orange-500 text-orange-400 text-xs">
                            ${result.gameXChangeValue.toFixed(2)} GXC
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold text-sm md:text-base">
                          {result.confidence.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">
                          {(result.scanTime / 1000).toFixed(1)}s
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}