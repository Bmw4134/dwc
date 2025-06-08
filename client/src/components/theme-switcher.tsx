import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme, moodThemes, type MoodTheme } from '@/contexts/theme-context';
import { 
  Palette, 
  Sun, 
  Moon, 
  Briefcase, 
  Zap, 
  Waves, 
  Sparkles, 
  Focus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const themeIcons = {
  professional: Briefcase,
  energetic: Zap,
  calm: Waves,
  creative: Sparkles,
  focus: Focus,
  dark: Moon,
  light: Sun
};

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, isDark, toggleDarkMode } = useTheme();

  const handleThemeSelect = (selectedTheme: MoodTheme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  const currentThemeConfig = moodThemes[theme];
  const CurrentIcon = themeIcons[theme];

  return (
    <>
      {/* Floating Theme Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className={`
            bg-black/80 backdrop-blur-sm border-purple-500/30 text-white hover:bg-black/90 
            transition-all duration-300 shadow-lg hover:shadow-xl
            ${isOpen ? 'ring-2 ring-purple-500/50' : ''}
          `}
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{currentThemeConfig.name}</span>
            <Palette className="h-4 w-4" />
          </div>
        </Button>
      </motion.div>

      {/* Theme Selector Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="fixed top-16 left-4 sm:top-20 sm:left-6 z-50 w-80 max-w-[90vw]"
            >
              <Card className="bg-black/95 backdrop-blur-sm border border-purple-500/30 text-white shadow-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Choose Your Mood</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Dark/Light Toggle */}
                  <div className="flex items-center justify-between mb-4 p-2 rounded-lg bg-gray-800/50">
                    <span className="text-sm">Dark Mode</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleDarkMode}
                      className="h-8 w-8 p-0"
                    >
                      {isDark ? (
                        <Moon className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Sun className="h-4 w-4 text-yellow-400" />
                      )}
                    </Button>
                  </div>

                  {/* Theme Grid */}
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(moodThemes).map(([themeKey, themeConfig]) => {
                      const ThemeIcon = themeIcons[themeKey as MoodTheme];
                      const isSelected = theme === themeKey;

                      return (
                        <motion.button
                          key={themeKey}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleThemeSelect(themeKey as MoodTheme)}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                            ${isSelected 
                              ? 'border-purple-500 bg-purple-500/20 text-white' 
                              : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500 hover:bg-gray-700/30'
                            }
                          `}
                        >
                          <div className="flex-shrink-0">
                            <ThemeIcon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{themeConfig.name}</span>
                              {isSelected && (
                                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {themeConfig.description}
                            </p>
                          </div>

                          {/* Theme Preview Colors */}
                          <div className="flex gap-1">
                            <div 
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ backgroundColor: `hsl(${themeConfig.primary})` }}
                            />
                            <div 
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ backgroundColor: `hsl(${themeConfig.accent})` }}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Current Theme Info */}
                  <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <CurrentIcon className="h-4 w-4 text-purple-400" />
                      <span className="font-medium text-sm">Current: {currentThemeConfig.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {currentThemeConfig.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}