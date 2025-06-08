import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import GamifiedLearningPath from '@/components/gamified-learning-path';
import { 
  Trophy, 
  Star, 
  Target, 
  BookOpen, 
  Zap, 
  Award, 
  ChevronRight, 
  Lock,
  CheckCircle,
  Play,
  Brain,
  Rocket,
  Crown,
  Gem,
  Users,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';

interface UserProgress {
  totalXP: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  completedModules: string[];
  currentPath: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: Date;
  points: number;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'business' | 'leadership' | 'creative';
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  unlocked: boolean;
  prerequisites: string[];
  rewards: Achievement[];
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  skillId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number;
  xpReward: number;
  completed: boolean;
  locked: boolean;
  content: LearningContent[];
}

interface LearningContent {
  type: 'video' | 'article' | 'interactive' | 'quiz' | 'project';
  title: string;
  duration: number;
  completed: boolean;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  totalXP: number;
  streak: number;
}

export default function LearningAcademy() {
  const [selectedView, setSelectedView] = useState<'overview' | 'skills' | 'achievements' | 'leaderboard'>('overview');
  const [selectedSkill, setSelectedSkill] = useState<string>('ai-automation');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user progress
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ['/api/learning/user-progress'],
  });

  // Fetch skills
  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ['/api/learning/skills'],
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/learning/achievements'],
  });

  // Fetch leaderboard
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/learning/leaderboard'],
  });

  // Fetch modules for selected skill
  const { data: modules, isLoading: modulesLoading } = useQuery<LearningModule[]>({
    queryKey: ['/api/learning/modules', selectedSkill],
    enabled: !!selectedSkill,
  });

  // Start module mutation
  const startModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const response = await fetch('/api/learning/start-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId }),
      });
      if (!response.ok) throw new Error('Failed to start module');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/modules'] });
      toast({
        title: "Module Started",
        description: "Good luck with your learning journey!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start module. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete module mutation
  const completeModuleMutation = useMutation({
    mutationFn: async ({ moduleId, skillId, xpEarned }: { moduleId: string; skillId: string; xpEarned: number }) => {
      const response = await fetch('/api/learning/complete-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, skillId, xpEarned }),
      });
      if (!response.ok) throw new Error('Failed to complete module');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning/user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/skills'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/modules'] });
      
      toast({
        title: data.newLevel ? "Level Up!" : "Module Completed!",
        description: data.message,
      });

      if (data.achievementsUnlocked?.length > 0) {
        data.achievementsUnlocked.forEach((achievement: Achievement) => {
          toast({
            title: "Achievement Unlocked!",
            description: `${achievement.name}: ${achievement.description}`,
          });
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete module. Please try again.",
        variant: "destructive",
      });
    },
  });

  const skillCategories = {
    technical: { name: 'Technical Skills', color: 'bg-blue-500', icon: Brain },
    business: { name: 'Business Skills', color: 'bg-green-500', icon: Target },
    leadership: { name: 'Leadership Skills', color: 'bg-purple-500', icon: Crown },
    creative: { name: 'Creative Skills', color: 'bg-orange-500', icon: Gem }
  };

  const rarityColors = {
    common: 'bg-gray-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500'
  };

  if (selectedView === 'skills') {
    return <GamifiedLearningPath />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            DWC Learning Academy
          </h1>
          <p className="text-gray-300">
            Master new skills and advance your career with our gamified learning platform
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'skills', label: 'Skill Tree', icon: Brain },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'leaderboard', label: 'Leaderboard', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id as any)}
                  variant={selectedView === tab.id ? "default" : "ghost"}
                  className={`mr-1 ${
                    selectedView === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content based on selected view */}
        <AnimatePresence mode="wait">
          {selectedView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* User Progress Summary */}
              {userProgress && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-400" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-400">{userProgress.level}</div>
                        <div className="text-sm text-gray-300">Current Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{userProgress.totalXP.toLocaleString()}</div>
                        <div className="text-sm text-gray-300">Total XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-400">{userProgress.streak}</div>
                        <div className="text-sm text-gray-300">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{userProgress.completedModules.length}</div>
                        <div className="text-sm text-gray-300">Modules Completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Skills Overview */}
              {skills && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-cyan-400" />
                      Skills Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.slice(0, 4).map((skill) => {
                        const category = skillCategories[skill.category];
                        const Icon = category.icon;
                        
                        return (
                          <div
                            key={skill.id}
                            className="p-4 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center mb-3">
                              <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center mr-3`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{skill.name}</h3>
                                <p className="text-xs text-gray-400">Level {skill.level}/{skill.maxLevel}</p>
                              </div>
                            </div>
                            <Progress 
                              value={(skill.xp / (skill.xp + skill.xpToNext)) * 100} 
                              className="h-2"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>{skill.xp} XP</span>
                              <span>{skill.xp + skill.xpToNext} XP</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Achievements */}
              {userProgress?.achievements && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userProgress.achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="p-4 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/50"
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">{achievement.icon}</span>
                            <Badge className={`${rarityColors[achievement.rarity]} text-white`}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-yellow-400">{achievement.name}</h4>
                          <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{achievement.points} pts</span>
                            <span className="text-xs text-gray-400">
                              {achievement.earnedDate && new Date(achievement.earnedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {selectedView === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                    All Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements?.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50' 
                            : 'bg-gray-800/50 border-gray-600'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{achievement.icon}</span>
                          <Badge className={`${rarityColors[achievement.rarity]} text-white`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <h4 className={`font-semibold ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {achievement.name}
                        </h4>
                        <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{achievement.points} pts</span>
                          {achievement.earned && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedView === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-400" />
                    Global Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard?.map((entry, index) => (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border flex items-center ${
                          entry.rank <= 3
                            ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                          entry.rank === 1 ? 'bg-yellow-500' :
                          entry.rank === 2 ? 'bg-gray-400' :
                          entry.rank === 3 ? 'bg-orange-600' :
                          'bg-gray-600'
                        }`}>
                          <span className="text-white font-bold text-sm">{entry.rank}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white">{entry.username}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-300">
                              <span>Level {entry.level}</span>
                              <span>{entry.totalXP.toLocaleString()} XP</span>
                              <span className="flex items-center">
                                <Zap className="w-3 h-3 mr-1 text-orange-400" />
                                {entry.streak}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}