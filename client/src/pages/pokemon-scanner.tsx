import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Upload, 
  Trash2, 
  DollarSign, 
  TrendingUp,
  Eye,
  Package,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PokemonCard {
  id: string;
  name: string;
  set: string;
  cardNumber: string;
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'poor';
  marketValue: number;
  tradeInValue: number;
  rarity: string;
  imageUrl: string;
  lastSold: number;
  trend: 'up' | 'down' | 'stable';
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  result?: PokemonCard;
}

export default function PokemonScanner() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newImages: UploadedImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const analyzeCard = async (image: UploadedImage): Promise<PokemonCard> => {
    // Simulate AI analysis with realistic Pokemon card data
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const cardNames = [
      'Charizard VMAX', 'Pikachu V', 'Mewtwo EX', 'Lugia Legend',
      'Rayquaza V', 'Garchomp C Lv.X', 'Dialga V', 'Palkia V',
      'Arceus VSTAR', 'Giratina V', 'Darkrai EX', 'Reshiram & Zekrom GX'
    ];
    
    const sets = [
      'Champion\'s Path', 'Vivid Voltage', 'Battle Styles', 'Chilling Reign',
      'Evolving Skies', 'Fusion Strike', 'Brilliant Stars', 'Astral Radiance'
    ];
    
    const rarities = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare'];
    
    const name = cardNames[Math.floor(Math.random() * cardNames.length)];
    const set = sets[Math.floor(Math.random() * sets.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    const baseValue = rarity === 'Secret Rare' ? 150 + Math.random() * 350 :
                     rarity === 'Ultra Rare' ? 50 + Math.random() * 200 :
                     rarity === 'Rare' ? 10 + Math.random() * 90 :
                     1 + Math.random() * 20;
    
    return {
      id: image.id,
      name,
      set,
      cardNumber: `${Math.floor(Math.random() * 200) + 1}/${Math.floor(Math.random() * 50) + 150}`,
      condition: ['mint', 'near_mint', 'excellent', 'good'][Math.floor(Math.random() * 4)] as any,
      marketValue: Math.round(baseValue * 100) / 100,
      tradeInValue: Math.round(baseValue * 0.6 * 100) / 100,
      rarity,
      imageUrl: image.preview,
      lastSold: Math.round(baseValue * (0.8 + Math.random() * 0.4) * 100) / 100,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
    };
  };

  const analyzeAllCards = async () => {
    setIsAnalyzing(true);
    
    for (let i = 0; i < uploadedImages.length; i++) {
      const image = uploadedImages[i];
      if (image.status === 'pending') {
        setUploadedImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'analyzing' } : img
        ));
        
        try {
          const result = await analyzeCard(image);
          setUploadedImages(prev => prev.map(img => 
            img.id === image.id ? { ...img, status: 'complete', result } : img
          ));
        } catch (error) {
          setUploadedImages(prev => prev.map(img => 
            img.id === image.id ? { ...img, status: 'error' } : img
          ));
        }
      }
    }
    
    setIsAnalyzing(false);
    
    // Calculate total value
    const total = uploadedImages.reduce((sum, img) => 
      sum + (img.result?.marketValue || 0), 0
    );
    setTotalValue(total);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const clearAll = () => {
    setUploadedImages([]);
    setTotalValue(0);
  };

  const completedAnalyses = uploadedImages.filter(img => img.status === 'complete');
  const pendingAnalyses = uploadedImages.filter(img => img.status === 'pending');
  const analyzingCount = uploadedImages.filter(img => img.status === 'analyzing').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pokemon Card Market Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your Pokemon card photos for instant market value analysis and trade-in estimates
          </p>
        </motion.div>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-blue-300 dark:border-blue-600">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  disabled={isAnalyzing}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Photos from Library
                </Button>
                
                {uploadedImages.length > 0 && (
                  <Button
                    onClick={analyzeAllCards}
                    disabled={isAnalyzing || pendingAnalyses.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Eye className="h-5 w-5 mr-2" />
                        Analyze All Cards
                      </>
                    )}
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadedImages.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select multiple photos from your iPhone library</p>
                  <p className="text-sm">Supports JPG, PNG, HEIC formats</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        {uploadedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uploadedImages.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedAnalyses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Market Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Progress Bar */}
        {isAnalyzing && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing cards...</span>
                  <span>{completedAnalyses.length} / {uploadedImages.length}</span>
                </div>
                <Progress 
                  value={(completedAnalyses.length / uploadedImages.length) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {uploadedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Card Analysis Results</h2>
              <Button
                variant="outline"
                onClick={clearAll}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {uploadedImages.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={image.preview}
                          alt="Pokemon card"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Status Overlay */}
                        <div className="absolute top-2 right-2">
                          {image.status === 'pending' && (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {image.status === 'analyzing' && (
                            <Badge className="bg-blue-500">
                              <Clock className="h-3 w-3 mr-1 animate-spin" />
                              Analyzing
                            </Badge>
                          )}
                          {image.status === 'complete' && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                          {image.status === 'error' && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 left-2 h-8 w-8 p-0 bg-black/50 border-white/20 text-white hover:bg-red-500"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Card Details */}
                      {image.result && (
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm line-clamp-1">
                              {image.result.name}
                            </h3>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {image.result.set} • {image.result.cardNumber}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {image.result.rarity}
                              </Badge>
                              <div className="flex items-center text-xs">
                                {image.result.trend === 'up' && (
                                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                )}
                                {image.result.condition}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Market Value:</span>
                                <span className="font-semibold text-green-600">
                                  ${image.result.marketValue}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Trade-In:</span>
                                <span className="font-semibold text-blue-600">
                                  ${image.result.tradeInValue}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {completedAnalyses.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Value Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Market Value</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${completedAnalyses.reduce((sum, img) => sum + (img.result?.marketValue || 0), 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Trade-In Value</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${completedAnalyses.reduce((sum, img) => sum + (img.result?.tradeInValue || 0), 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Card Value</div>
                  <div className="text-xl font-semibold">
                    ${completedAnalyses.length > 0 ? 
                      (completedAnalyses.reduce((sum, img) => sum + (img.result?.marketValue || 0), 0) / completedAnalyses.length).toFixed(2) : 
                      '0.00'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cards Analyzed</div>
                  <div className="text-xl font-semibold">
                    {completedAnalyses.length} / {uploadedImages.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}