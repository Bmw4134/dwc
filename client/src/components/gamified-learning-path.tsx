import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Gem
} from 'lucide-react';

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

interface UserProgress {
  totalXP: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  completedModules: string[];
  currentPath: string;
}

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

export default function GamifiedLearningPath() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 2450,
    level: 12,
    streak: 7,
    achievements: [],
    completedModules: [],
    currentPath: 'ai-automation'
  });

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 'ai-automation',
      name: 'AI Automation',
      description: 'Master artificial intelligence and automation technologies',
      category: 'technical',
      level: 3,
      maxLevel: 10,
      xp: 750,
      xpToNext: 250,
      unlocked: true,
      prerequisites: [],
      rewards: [
        {
          id: 'ai-novice',
          name: 'AI Novice',
          description: 'Completed first AI automation module',
          icon: '🤖',
          rarity: 'common',
          earned: true,
          earnedDate: new Date('2024-06-01'),
          points: 100
        }
      ]
    },
    {
      id: 'quantum-computing',
      name: 'Quantum Computing',
      description: 'Explore quantum algorithms and computing principles',
      category: 'technical',
      level: 1,
      maxLevel: 10,
      xp: 150,
      xpToNext: 350,
      unlocked: true,
      prerequisites: ['ai-automation'],
      rewards: []
    },
    {
      id: 'business-strategy',
      name: 'Business Strategy',
      description: 'Develop strategic thinking and business acumen',
      category: 'business',
      level: 2,
      maxLevel: 10,
      xp: 400,
      xpToNext: 100,
      unlocked: true,
      prerequisites: [],
      rewards: []
    },
    {
      id: 'team-leadership',
      name: 'Team Leadership',
      description: 'Build leadership skills for managing teams',
      category: 'leadership',
      level: 0,
      maxLevel: 10,
      xp: 0,
      xpToNext: 500,
      unlocked: false,
      prerequisites: ['business-strategy'],
      rewards: []
    }
  ]);

  const [learningModules, setLearningModules] = useState<LearningModule[]>([
    {
      id: 'intro-to-ai',
      title: 'Introduction to AI',
      description: 'Learn the fundamentals of artificial intelligence',
      skillId: 'ai-automation',
      difficulty: 'beginner',
      estimatedTime: 45,
      xpReward: 100,
      completed: true,
      locked: false,
      content: [
        { type: 'video', title: 'What is AI?', duration: 15, completed: true },
        { type: 'article', title: 'AI History and Evolution', duration: 20, completed: true },
        { type: 'quiz', title: 'AI Fundamentals Quiz', duration: 10, completed: true }
      ]
    },
    {
      id: 'machine-learning-basics',
      title: 'Machine Learning Basics',
      description: 'Understand core machine learning concepts',
      skillId: 'ai-automation',
      difficulty: 'intermediate',
      estimatedTime: 90,
      xpReward: 200,
      completed: false,
      locked: false,
      content: [
        { type: 'video', title: 'ML Algorithms Overview', duration: 30, completed: false },
        { type: 'interactive', title: 'Build Your First Model', duration: 45, completed: false },
        { type: 'project', title: 'Data Analysis Project', duration: 15, completed: false }
      ]
    },
    {
      id: 'advanced-neural-networks',
      title: 'Advanced Neural Networks',
      description: 'Deep dive into neural network architectures',
      skillId: 'ai-automation',
      difficulty: 'advanced',
      estimatedTime: 120,
      xpReward: 300,
      completed: false,
      locked: true,
      content: []
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first-module',
      name: 'Getting Started',
      description: 'Complete your first learning module',
      icon: '🎯',
      rarity: 'common',
      earned: true,
      earnedDate: new Date('2024-06-01'),
      points: 50
    },
    {
      id: 'week-streak',
      name: 'Consistency Champion',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      rarity: 'rare',
      earned: true,
      earnedDate: new Date('2024-06-04'),
      points: 200
    },
    {
      id: 'skill-master',
      name: 'Skill Master',
      description: 'Reach level 5 in any skill',
      icon: '👑',
      rarity: 'epic',
      earned: false,
      points: 500
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Score 100% on 10 quizzes',
      icon: '⭐',
      rarity: 'legendary',
      earned: false,
      points: 1000
    }
  ]);

  const [selectedSkill, setSelectedSkill] = useState<string>('ai-automation');
  const [showAchievements, setShowAchievements] = useState(false);

  const startModule = (moduleId: string) => {
    setLearningModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, locked: false }
          : module
      )
    );
  };

  const completeModule = (moduleId: string) => {
    const module = learningModules.find(m => m.id === moduleId);
    if (!module) return;

    setUserProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + module.xpReward,
      completedModules: [...prev.completedModules, moduleId]
    }));

    setLearningModules(prev =>
      prev.map(m =>
        m.id === moduleId
          ? { ...m, completed: true }
          : m
      )
    );

    // Update skill XP
    setSkills(prev =>
      prev.map(skill =>
        skill.id === module.skillId
          ? {
              ...skill,
              xp: skill.xp + module.xpReward,
              level: skill.xp + module.xpReward >= skill.xpToNext ? skill.level + 1 : skill.level
            }
          : skill
      )
    );
  };

  const selectedSkillData = skills.find(s => s.id === selectedSkill);
  const skillModules = learningModules.filter(m => m.skillId === selectedSkill);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              DWC Learning Academy
            </h1>
            <p className="text-gray-300">
              Level up your skills with our gamified learning experience
            </p>
          </motion.div>

          {/* User Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Level {userProgress.level}</h3>
                  <p className="text-gray-300">{userProgress.totalXP.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{userProgress.streak}</div>
                  <div className="text-sm text-gray-300">Day Streak</div>
                </div>
                <Button
                  onClick={() => setShowAchievements(!showAchievements)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Achievements
                </Button>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(userProgress.totalXP % 1000) / 10}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{userProgress.totalXP % 1000} XP</span>
              <span>{1000 - (userProgress.totalXP % 1000)} XP to next level</span>
            </div>
          </motion.div>
        </div>

        {/* Achievements Panel */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map((achievement) => (
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
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Tree */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-cyan-400" />
                  Skill Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill) => {
                    const category = skillCategories[skill.category];
                    const Icon = category.icon;
                    
                    return (
                      <motion.div
                        key={skill.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedSkill(skill.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedSkill === skill.id
                            ? 'bg-cyan-500/20 border-cyan-400 border'
                            : skill.unlocked
                            ? 'bg-white/5 hover:bg-white/10 border border-transparent'
                            : 'bg-gray-800/50 border border-gray-600 opacity-50'
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center mr-3`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{skill.name}</h3>
                            <p className="text-xs text-gray-400">Level {skill.level}/{skill.maxLevel}</p>
                          </div>
                          {!skill.unlocked && <Lock className="w-4 h-4 text-gray-500" />}
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{skill.xp} XP</span>
                            <span>{skill.xp + skill.xpToNext} XP</span>
                          </div>
                          <Progress 
                            value={(skill.xp / (skill.xp + skill.xpToNext)) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <p className="text-xs text-gray-300">{skill.description}</p>
                        
                        {skill.prerequisites.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400">
                              Requires: {skill.prerequisites.join(', ')}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Modules */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                  {selectedSkillData?.name} Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillModules.map((module) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-lg border ${
                        module.completed
                          ? 'bg-green-500/10 border-green-400/50'
                          : module.locked
                          ? 'bg-gray-800/50 border-gray-600 opacity-50'
                          : 'bg-white/5 border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-white mr-3">
                              {module.title}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`${
                                module.difficulty === 'beginner' ? 'border-green-400 text-green-400' :
                                module.difficulty === 'intermediate' ? 'border-yellow-400 text-yellow-400' :
                                module.difficulty === 'advanced' ? 'border-orange-400 text-orange-400' :
                                'border-red-400 text-red-400'
                              }`}
                            >
                              {module.difficulty}
                            </Badge>
                            {module.completed && (
                              <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                            )}
                            {module.locked && (
                              <Lock className="w-5 h-5 text-gray-500 ml-2" />
                            )}
                          </div>
                          <p className="text-gray-300 mb-3">{module.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              {module.xpReward} XP
                            </span>
                            <span>{module.estimatedTime} min</span>
                            <span>{module.content.length} lessons</span>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {module.completed ? (
                            <Button disabled className="bg-green-600">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </Button>
                          ) : module.locked ? (
                            <Button disabled variant="outline">
                              <Lock className="w-4 h-4 mr-2" />
                              Locked
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => startModule(module.id)}
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Module
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Module Content Preview */}
                      {!module.locked && module.content.length > 0 && (
                        <div className="border-t border-white/10 pt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-3">Module Content:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {module.content.map((content, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded border text-sm ${
                                  content.completed
                                    ? 'bg-green-500/10 border-green-400/30 text-green-300'
                                    : 'bg-white/5 border-white/10 text-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{content.title}</span>
                                  {content.completed && (
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className="capitalize">{content.type}</span>
                                  <span>{content.duration} min</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}