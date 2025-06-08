import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Download, 
  Share2, 
  Trash2, 
  Copy,
  Eye,
  Clock,
  Tag,
  Search,
  Filter,
  Grid,
  List,
  Star,
  StarOff,
  Users,
  Link,
  Edit3
} from 'lucide-react';

interface QuantumSnapshot {
  id: string;
  timestamp: number;
  name: string;
  description: string;
  data: any;
  thumbnail: string;
  duration: number;
  speed: number;
  tags: string[];
  isFavorite: boolean;
  sharedWith: string[];
  collaborators: string[];
  views: number;
  size: string;
}

interface CollaborativeSession {
  id: string;
  name: string;
  participants: string[];
  activeSnapshot: string;
  isLive: boolean;
  created: number;
}

export const QuantumSnapshotGallery = ({
  onSnapshotLoad,
  onSnapshotShare,
  snapshots: initialSnapshots = []
}: {
  onSnapshotLoad?: (snapshot: QuantumSnapshot) => void;
  onSnapshotShare?: (snapshot: QuantumSnapshot, recipients: string[]) => void;
  snapshots?: QuantumSnapshot[];
}) => {
  const [snapshots, setSnapshots] = useState<QuantumSnapshot[]>([
    {
      id: 'snap_001',
      timestamp: Date.now() - 3600000,
      name: 'Quantum Compactor Analysis',
      description: 'Northeast corridor optimization showing 23% efficiency gains',
      data: { utilization: 94.7, efficiency: 89.1, savings: 847 },
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMGZmZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiMwMGZmZmYiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjYwIiByPSIxNSIgZmlsbD0iI2ZmMDBmZiIgb3BhY2l0eT0iMC44Ii8+PC9zdmc+',
      duration: 45.2,
      speed: 1.5,
      tags: ['optimization', 'northeast', 'efficiency'],
      isFavorite: true,
      sharedWith: ['team@dwcsystems.com'],
      collaborators: ['john.doe@dwc.com', 'jane.smith@dwc.com'],
      views: 24,
      size: '2.3 MB'
    },
    {
      id: 'snap_002',
      timestamp: Date.now() - 7200000,
      name: 'Phoenix Market Expansion',
      description: 'Emerging market analysis showing 340% growth potential',
      data: { marketGrowth: 340, revenue: 2100000, confidence: 0.89 },
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmNTlmMGEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNiKSIgb3BhY2l0eT0iMC4xIi8+PHBhdGggZD0iTTIwIDgwIFE2MCA0MCA5MCA2MCBUMTU4IDMwIDE4MCA1MCIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
      duration: 62.8,
      speed: 2.0,
      tags: ['market-analysis', 'phoenix', 'expansion'],
      isFavorite: false,
      sharedWith: ['executives@dwcsystems.com'],
      collaborators: ['mike.wilson@dwc.com'],
      views: 18,
      size: '3.1 MB'
    },
    {
      id: 'snap_003',
      timestamp: Date.now() - 10800000,
      name: 'Client Satisfaction Metrics',
      description: 'Real-time satisfaction tracking with 15% improvement potential',
      data: { satisfaction: 98.2, improvement: 15, automation: 28 },
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImMiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNmI2ZDQiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNjKSIgb3BhY2l0eT0iMC4xIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4YjVjZjYiIHN0cm9rZS13aWR0aD0iNCIvPjwvc3ZnPg==',
      duration: 38.5,
      speed: 1.0,
      tags: ['satisfaction', 'metrics', 'automation'],
      isFavorite: true,
      sharedWith: [],
      collaborators: [],
      views: 12,
      size: '1.8 MB'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSnapshot, setSelectedSnapshot] = useState<QuantumSnapshot | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareEmails, setShareEmails] = useState('');
  const [collaborativeSession, setCollaborativeSession] = useState<CollaborativeSession | null>(null);

  // Get all available tags
  const allTags = Array.from(new Set(snapshots.flatMap(s => s.tags)));

  // Filter snapshots based on search and tags
  const filteredSnapshots = snapshots.filter(snapshot => {
    const matchesSearch = snapshot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snapshot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => snapshot.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleSnapshotLoad = (snapshot: QuantumSnapshot) => {
    setSnapshots(prev => prev.map(s => 
      s.id === snapshot.id ? { ...s, views: s.views + 1 } : s
    ));
    onSnapshotLoad?.(snapshot);
  };

  const handleToggleFavorite = (snapshotId: string) => {
    setSnapshots(prev => prev.map(s => 
      s.id === snapshotId ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const handleDeleteSnapshot = (snapshotId: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== snapshotId));
  };

  const handleShareSnapshot = () => {
    if (!selectedSnapshot) return;
    
    const emails = shareEmails.split(',').map(email => email.trim()).filter(Boolean);
    onSnapshotShare?.(selectedSnapshot, emails);
    
    setSnapshots(prev => prev.map(s => 
      s.id === selectedSnapshot.id 
        ? { ...s, sharedWith: [...s.sharedWith, ...emails] }
        : s
    ));
    
    setIsSharing(false);
    setShareEmails('');
    setSelectedSnapshot(null);
  };

  const startCollaborativeSession = (snapshot: QuantumSnapshot) => {
    const session: CollaborativeSession = {
      id: `session_${Date.now()}`,
      name: `Collaborative Review: ${snapshot.name}`,
      participants: ['current_user@dwc.com'],
      activeSnapshot: snapshot.id,
      isLive: true,
      created: Date.now()
    };
    setCollaborativeSession(session);
  };

  const SnapshotCard = ({ snapshot, index }: { snapshot: QuantumSnapshot; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      layout
      className="group"
    >
      <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02]">
        <CardContent className="p-4">
          {/* Thumbnail */}
          <div className="relative mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
            <img 
              src={snapshot.thumbnail} 
              alt={snapshot.name}
              className="w-full h-24 object-cover"
            />
            
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSnapshotLoad(snapshot)}
                  className="text-white hover:bg-white/20"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setSelectedSnapshot(snapshot); setIsSharing(true); }}
                  className="text-white hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status indicators */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {snapshot.isFavorite && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Star className="h-3 w-3" />
                </Badge>
              )}
              {snapshot.sharedWith.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <Users className="h-3 w-3" />
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                {snapshot.name}
              </h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleToggleFavorite(snapshot.id)}
                className="text-slate-400 hover:text-yellow-500 p-1 h-auto"
              >
                {snapshot.isFavorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {snapshot.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {snapshot.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {snapshot.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{snapshot.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>{new Date(snapshot.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-3 w-3" />
                <span>{snapshot.views}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startCollaborativeSession(snapshot)}
                  className="text-slate-400 hover:text-purple-600 p-1 h-auto"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-green-600 p-1 h-auto"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteSnapshot(snapshot.id)}
                className="text-slate-400 hover:text-red-600 p-1 h-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quantum State Gallery</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filteredSnapshots.length} snapshots • Interactive collaborative visualization sharing
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search snapshots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
              }}
              className="text-xs"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Collaborative Session Banner */}
      <AnimatePresence>
        {collaborativeSession && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300">
                        {collaborativeSession.name}
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        Live collaborative session • {collaborativeSession.participants.length} participants
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollaborativeSession(null)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        <AnimatePresence>
          {filteredSnapshots.map((snapshot, index) => (
            <SnapshotCard key={snapshot.id} snapshot={snapshot} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredSnapshots.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No snapshots found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={isSharing} onOpenChange={setIsSharing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Quantum Snapshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Share with (comma-separated emails):
              </label>
              <Textarea
                value={shareEmails}
                onChange={(e) => setShareEmails(e.target.value)}
                placeholder="colleague1@company.com, colleague2@company.com"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSharing(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareSnapshot}>
                Share Snapshot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};