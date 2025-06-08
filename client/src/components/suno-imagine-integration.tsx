import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Image, 
  Play, 
  Pause, 
  Download,
  Upload,
  Sparkles,
  Wand2,
  Headphones,
  Palette,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SunoTrack {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  genre: string;
  mood: string;
  status: 'generating' | 'completed' | 'error';
  progress: number;
}

interface ImagineArtwork {
  id: string;
  prompt: string;
  imageUrl: string;
  style: string;
  dimensions: string;
  status: 'generating' | 'completed' | 'error';
  progress: number;
}

interface CreativeProject {
  id: string;
  name: string;
  type: 'music' | 'art' | 'combined';
  tracks: SunoTrack[];
  artworks: ImagineArtwork[];
  createdAt: Date;
}

export default function SunoImagineIntegration() {
  const [musicPrompt, setMusicPrompt] = useState('');
  const [artPrompt, setArtPrompt] = useState('');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CreativeProject | null>(null);
  const [musicProgress, setMusicProgress] = useState(0);
  const [artProgress, setArtProgress] = useState(0);

  // Music generation styles
  const musicGenres = [
    'Electronic', 'Hip-Hop', 'Jazz', 'Classical', 'Rock', 'Pop',
    'Ambient', 'Cinematic', 'Lo-Fi', 'Trap', 'House', 'Techno'
  ];

  const musicMoods = [
    'Energetic', 'Calm', 'Dark', 'Uplifting', 'Melancholic', 'Aggressive',
    'Mysterious', 'Romantic', 'Epic', 'Chill', 'Intense', 'Dreamy'
  ];

  // Art generation styles
  const artStyles = [
    'Photorealistic', 'Digital Art', 'Oil Painting', 'Watercolor', 'Sketch',
    'Abstract', 'Cyberpunk', 'Fantasy', 'Minimalist', 'Vintage', 'Anime', 'Renaissance'
  ];

  const artDimensions = [
    '1024x1024', '1024x1792', '1792x1024', '1536x1536', '512x512'
  ];

  // Generate music with SUNO API
  const generateMusic = async (prompt: string, genre: string, mood: string) => {
    setIsGeneratingMusic(true);
    setMusicProgress(0);

    try {
      // Simulate SUNO API call with progress tracking
      const stages = [
        'Analyzing musical prompt',
        'Generating melodic patterns',
        'Creating harmonic structure',
        'Adding rhythmic elements',
        'Mixing and mastering',
        'Finalizing audio track'
      ];

      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMusicProgress(((i + 1) / stages.length) * 100);
      }

      const newTrack: SunoTrack = {
        id: Date.now().toString(),
        title: `Generated Track - ${genre}`,
        description: prompt,
        audioUrl: '/api/suno/track/' + Date.now(),
        duration: Math.floor(Math.random() * 180) + 60, // 1-4 minutes
        genre,
        mood,
        status: 'completed',
        progress: 100
      };

      // Add to current project or create new one
      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          tracks: [...currentProject.tracks, newTrack]
        });
      } else {
        const newProject: CreativeProject = {
          id: Date.now().toString(),
          name: `Project ${Date.now()}`,
          type: 'music',
          tracks: [newTrack],
          artworks: [],
          createdAt: new Date()
        };
        setProjects(prev => [...prev, newProject]);
        setCurrentProject(newProject);
      }

    } catch (error) {
      console.error('Music generation failed:', error);
    } finally {
      setIsGeneratingMusic(false);
      setMusicProgress(0);
    }
  };

  // Generate art with IMAGINE API
  const generateArt = async (prompt: string, style: string, dimensions: string) => {
    setIsGeneratingArt(true);
    setArtProgress(0);

    try {
      // Simulate IMAGINE API call with progress tracking
      const stages = [
        'Processing art prompt',
        'Generating initial composition',
        'Applying style filters',
        'Enhancing details',
        'Color correction',
        'Final rendering'
      ];

      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setArtProgress(((i + 1) / stages.length) * 100);
      }

      const newArtwork: ImagineArtwork = {
        id: Date.now().toString(),
        prompt,
        imageUrl: `https://picsum.photos/${dimensions.split('x')[0]}/${dimensions.split('x')[1]}?random=${Date.now()}`,
        style,
        dimensions,
        status: 'completed',
        progress: 100
      };

      // Add to current project or create new one
      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          artworks: [...currentProject.artworks, newArtwork]
        });
      } else {
        const newProject: CreativeProject = {
          id: Date.now().toString(),
          name: `Project ${Date.now()}`,
          type: 'art',
          tracks: [],
          artworks: [newArtwork],
          createdAt: new Date()
        };
        setProjects(prev => [...prev, newProject]);
        setCurrentProject(newProject);
      }

    } catch (error) {
      console.error('Art generation failed:', error);
    } finally {
      setIsGeneratingArt(false);
      setArtProgress(0);
    }
  };

  // Handle music generation
  const handleGenerateMusic = () => {
    if (!musicPrompt.trim()) return;
    
    const randomGenre = musicGenres[Math.floor(Math.random() * musicGenres.length)];
    const randomMood = musicMoods[Math.floor(Math.random() * musicMoods.length)];
    
    generateMusic(musicPrompt, randomGenre, randomMood);
  };

  // Handle art generation
  const handleGenerateArt = () => {
    if (!artPrompt.trim()) return;
    
    const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)];
    const randomDimensions = artDimensions[Math.floor(Math.random() * artDimensions.length)];
    
    generateArt(artPrompt, randomStyle, randomDimensions);
  };

  return (
    <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Wand2 className="h-6 w-6 mr-2 text-purple-400" />
          SUNO + IMAGINE Creative Suite
          <Badge className="ml-2 bg-purple-500/20 text-purple-300">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="music" className="text-slate-300 flex items-center">
              <Music className="h-4 w-4 mr-2" />
              SUNO Music
            </TabsTrigger>
            <TabsTrigger value="art" className="text-slate-300 flex items-center">
              <Image className="h-4 w-4 mr-2" />
              IMAGINE Art
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-slate-300 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-slate-300 flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
          </TabsList>

          {/* SUNO Music Generation */}
          <TabsContent value="music" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Describe Your Music
                </label>
                <Textarea
                  placeholder="A relaxing ambient track with soft piano melodies and nature sounds for meditation..."
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Preferred Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {musicGenres.slice(0, 6).map(genre => (
                      <Badge key={genre} variant="outline" className="text-slate-300 border-slate-500 cursor-pointer hover:bg-slate-700">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {musicMoods.slice(0, 6).map(mood => (
                      <Badge key={mood} variant="outline" className="text-slate-300 border-slate-500 cursor-pointer hover:bg-slate-700">
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerateMusic}
                disabled={!musicPrompt.trim() || isGeneratingMusic}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGeneratingMusic ? (
                  <>
                    <Headphones className="h-4 w-4 mr-2 animate-pulse" />
                    Generating Music...
                  </>
                ) : (
                  <>
                    <Music className="h-4 w-4 mr-2" />
                    Generate with SUNO
                  </>
                )}
              </Button>

              {isGeneratingMusic && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Music Generation Progress</span>
                    <span>{musicProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={musicProgress} className="h-2" />
                </div>
              )}
            </div>
          </TabsContent>

          {/* IMAGINE Art Generation */}
          <TabsContent value="art" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Describe Your Artwork
                </label>
                <Textarea
                  placeholder="A futuristic cityscape at sunset with flying cars and neon lights, cyberpunk style..."
                  value={artPrompt}
                  onChange={(e) => setArtPrompt(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Art Style</label>
                  <div className="flex flex-wrap gap-2">
                    {artStyles.slice(0, 6).map(style => (
                      <Badge key={style} variant="outline" className="text-slate-300 border-slate-500 cursor-pointer hover:bg-slate-700">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Dimensions</label>
                  <div className="flex flex-wrap gap-2">
                    {artDimensions.map(dim => (
                      <Badge key={dim} variant="outline" className="text-slate-300 border-slate-500 cursor-pointer hover:bg-slate-700">
                        {dim}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerateArt}
                disabled={!artPrompt.trim() || isGeneratingArt}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingArt ? (
                  <>
                    <Palette className="h-4 w-4 mr-2 animate-pulse" />
                    Generating Art...
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Generate with IMAGINE
                  </>
                )}
              </Button>

              {isGeneratingArt && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Art Generation Progress</span>
                    <span>{artProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={artProgress} className="h-2" />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Projects Management */}
          <TabsContent value="projects" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Creative Projects</h3>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No projects yet. Generate some music or art to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map(project => (
                    <Card key={project.id} className="bg-slate-800/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium">{project.name}</h4>
                          <Badge className={`${
                            project.type === 'music' ? 'bg-purple-500/20 text-purple-300' :
                            project.type === 'art' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {project.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400 mb-3">
                          {project.tracks.length} tracks • {project.artworks.length} artworks
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                            <Play className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Gallery View */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Music */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Music className="h-5 w-5 mr-2 text-purple-400" />
                    Recent Music
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentProject?.tracks.length === 0 ? (
                    <div className="text-slate-400 text-center py-4">
                      No music generated yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentProject?.tracks.slice(0, 3).map(track => (
                        <div key={track.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                          <div>
                            <div className="text-white font-medium text-sm">{track.title}</div>
                            <div className="text-slate-400 text-xs">{track.genre} • {track.mood}</div>
                          </div>
                          <Button size="sm" variant="outline" className="text-slate-300">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Art */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center">
                    <Image className="h-5 w-5 mr-2 text-blue-400" />
                    Recent Art
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentProject?.artworks.length === 0 ? (
                    <div className="text-slate-400 text-center py-4">
                      No artwork generated yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {currentProject?.artworks.slice(0, 4).map(artwork => (
                        <div key={artwork.id} className="relative group">
                          <img 
                            src={artwork.imageUrl} 
                            alt={artwork.prompt}
                            className="w-full h-20 object-cover rounded border border-slate-600"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                            <Button size="sm" variant="outline" className="text-white border-white">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}