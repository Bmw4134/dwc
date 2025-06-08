import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sun, 
  Moon, 
  Zap, 
  Heart, 
  Brain, 
  Target, 
  Sparkles, 
  Coffee,
  Sunset,
  Waves
} from 'lucide-react';

interface ThemePalette {
  id: string;
  name: string;
  mood: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  description: string;
}

const themePalettes: ThemePalette[] = [
  {
    id: 'quantum-focus',
    name: 'Quantum Focus',
    mood: 'Analytical',
    icon: <Brain className="h-4 w-4" />,
    colors: {
      primary: 'hsl(217, 91%, 60%)', // Blue
      secondary: 'hsl(262, 83%, 58%)', // Purple
      accent: 'hsl(174, 100%, 29%)', // Cyan
      background: 'hsl(220, 13%, 18%)', // Dark blue-gray
      surface: 'hsl(215, 16%, 23%)', // Slightly lighter
      text: 'hsl(0, 0%, 98%)', // Near white
      textSecondary: 'hsl(215, 20%, 65%)', // Light gray-blue
    },
    description: 'Deep focus for analytical trading sessions'
  },
  {
    id: 'profit-surge',
    name: 'Profit Surge',
    mood: 'Energetic',
    icon: <Zap className="h-4 w-4" />,
    colors: {
      primary: 'hsl(142, 76%, 36%)', // Green
      secondary: 'hsl(173, 58%, 39%)', // Teal
      accent: 'hsl(45, 93%, 47%)', // Gold
      background: 'hsl(140, 25%, 8%)', // Dark green
      surface: 'hsl(140, 20%, 12%)', // Dark green-gray
      text: 'hsl(0, 0%, 98%)', // Near white
      textSecondary: 'hsl(140, 15%, 70%)', // Light green-gray
    },
    description: 'High-energy palette for active trading'
  },
  {
    id: 'zen-trader',
    name: 'Zen Trader',
    mood: 'Calm',
    icon: <Heart className="h-4 w-4" />,
    colors: {
      primary: 'hsl(200, 18%, 46%)', // Calm blue-gray
      secondary: 'hsl(160, 15%, 35%)', // Muted green
      accent: 'hsl(25, 50%, 55%)', // Warm orange
      background: 'hsl(210, 11%, 15%)', // Very dark blue-gray
      surface: 'hsl(210, 9%, 20%)', // Dark blue-gray
      text: 'hsl(0, 0%, 95%)', // Off-white
      textSecondary: 'hsl(210, 15%, 65%)', // Muted blue-gray
    },
    description: 'Calming tones for steady decision-making'
  },
  {
    id: 'risk-alert',
    name: 'Risk Alert',
    mood: 'Alert',
    icon: <Target className="h-4 w-4" />,
    colors: {
      primary: 'hsl(0, 84%, 60%)', // Red
      secondary: 'hsl(25, 95%, 53%)', // Orange
      accent: 'hsl(45, 93%, 47%)', // Yellow
      background: 'hsl(0, 20%, 10%)', // Dark red-tinted
      surface: 'hsl(0, 15%, 15%)', // Dark red-gray
      text: 'hsl(0, 0%, 98%)', // Near white
      textSecondary: 'hsl(0, 10%, 70%)', // Light red-gray
    },
    description: 'High-contrast for risk management'
  },
  {
    id: 'midnight-glow',
    name: 'Midnight Glow',
    mood: 'Mystical',
    icon: <Moon className="h-4 w-4" />,
    colors: {
      primary: 'hsl(270, 50%, 40%)', // Deep purple
      secondary: 'hsl(290, 40%, 30%)', // Dark magenta
      accent: 'hsl(320, 60%, 50%)', // Bright magenta
      background: 'hsl(240, 30%, 8%)', // Very dark purple
      surface: 'hsl(250, 25%, 12%)', // Dark purple-gray
      text: 'hsl(0, 0%, 95%)', // Off-white
      textSecondary: 'hsl(260, 20%, 65%)', // Light purple-gray
    },
    description: 'Mysterious late-night trading vibes'
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    mood: 'Dynamic',
    icon: <Sun className="h-4 w-4" />,
    colors: {
      primary: 'hsl(30, 100%, 50%)', // Bright orange
      secondary: 'hsl(45, 100%, 50%)', // Golden yellow
      accent: 'hsl(15, 100%, 55%)', // Red-orange
      background: 'hsl(25, 25%, 8%)', // Dark orange-tinted
      surface: 'hsl(30, 20%, 12%)', // Dark orange-gray
      text: 'hsl(0, 0%, 98%)', // Near white
      textSecondary: 'hsl(30, 15%, 70%)', // Light orange-gray
    },
    description: 'Bright energy for day trading sessions'
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    mood: 'Fluid',
    icon: <Waves className="h-4 w-4" />,
    colors: {
      primary: 'hsl(200, 100%, 35%)', // Deep blue
      secondary: 'hsl(180, 100%, 25%)', // Dark cyan
      accent: 'hsl(190, 80%, 45%)', // Light blue
      background: 'hsl(210, 50%, 6%)', // Very dark blue
      surface: 'hsl(205, 40%, 10%)', // Dark blue
      text: 'hsl(0, 0%, 96%)', // Near white
      textSecondary: 'hsl(200, 25%, 65%)', // Light blue-gray
    },
    description: 'Deep and flowing like market currents'
  },
  {
    id: 'coffee-break',
    name: 'Coffee Break',
    mood: 'Cozy',
    icon: <Coffee className="h-4 w-4" />,
    colors: {
      primary: 'hsl(25, 47%, 40%)', // Brown
      secondary: 'hsl(35, 35%, 30%)', // Dark tan
      accent: 'hsl(45, 60%, 55%)', // Golden
      background: 'hsl(20, 30%, 8%)', // Very dark brown
      surface: 'hsl(25, 25%, 12%)', // Dark brown-gray
      text: 'hsl(0, 0%, 95%)', // Off-white
      textSecondary: 'hsl(25, 15%, 65%)', // Light brown-gray
    },
    description: 'Warm and comfortable for extended sessions'
  }
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>('quantum-focus');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('tradingTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themePalettes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    
    // Update body background
    document.body.style.background = `linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.surface})`;
    
    // Save to localStorage
    localStorage.setItem('tradingTheme', themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    setIsExpanded(false);
  };

  const currentThemeData = themePalettes.find(t => t.id === currentTheme);

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 hover:bg-black/90 text-white shadow-lg"
          size="sm"
        >
          <Palette className="h-5 w-5" />
        </Button>
      ) : (
        <Card className="w-80 bg-black/90 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <h3 className="font-semibold">Theme Moods</h3>
              </div>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
              >
                ×
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {themePalettes.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    currentTheme === theme.id
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-white/80">
                        {theme.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-white/10 text-white/70 border-white/20"
                        >
                          {theme.mood}
                        </Badge>
                      </div>
                    </div>
                    {currentTheme === theme.id && (
                      <Sparkles className="h-4 w-4 text-white/60" />
                    )}
                  </div>
                  
                  <p className="text-xs text-white/60 mb-2">
                    {theme.description}
                  </p>
                  
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: theme.colors.surface }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {currentThemeData && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-white/60">Current:</span>
                  <span className="text-white font-medium">{currentThemeData.name}</span>
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-white/10 text-white/70 border-white/20"
                  >
                    {currentThemeData.mood}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}