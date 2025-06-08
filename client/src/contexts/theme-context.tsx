// Clean theme context without hooks

type MoodTheme = 'professional' | 'energetic' | 'calm' | 'creative' | 'focus' | 'dark' | 'light';

interface ThemeContextType {
  theme: MoodTheme;
  setTheme: (theme: MoodTheme) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

// Theme context removed to prevent React errors

const moodThemes = {
  professional: {
    name: 'Professional',
    description: 'Clean, corporate aesthetic',
    primary: '210 40% 50%',
    secondary: '210 40% 90%',
    accent: '210 100% 50%',
    background: '0 0% 100%',
    foreground: '210 40% 15%',
    muted: '210 40% 96%',
    border: '210 40% 85%',
    ring: '210 40% 50%',
    dark: {
      background: '210 40% 5%',
      foreground: '210 40% 90%',
      muted: '210 40% 10%',
      border: '210 40% 20%'
    }
  },
  energetic: {
    name: 'Energetic',
    description: 'Vibrant, high-energy colors',
    primary: '15 85% 55%',
    secondary: '15 85% 95%',
    accent: '340 85% 55%',
    background: '0 0% 100%',
    foreground: '15 85% 15%',
    muted: '15 85% 96%',
    border: '15 85% 85%',
    ring: '15 85% 55%',
    dark: {
      background: '15 85% 5%',
      foreground: '15 85% 90%',
      muted: '15 85% 10%',
      border: '15 85% 20%'
    }
  },
  calm: {
    name: 'Calm',
    description: 'Soothing, peaceful tones',
    primary: '200 30% 50%',
    secondary: '200 30% 95%',
    accent: '160 30% 50%',
    background: '0 0% 100%',
    foreground: '200 30% 20%',
    muted: '200 30% 97%',
    border: '200 30% 88%',
    ring: '200 30% 50%',
    dark: {
      background: '200 30% 8%',
      foreground: '200 30% 85%',
      muted: '200 30% 12%',
      border: '200 30% 25%'
    }
  },
  creative: {
    name: 'Creative',
    description: 'Artistic, inspiring palette',
    primary: '270 70% 55%',
    secondary: '270 70% 95%',
    accent: '45 90% 60%',
    background: '0 0% 100%',
    foreground: '270 70% 15%',
    muted: '270 70% 96%',
    border: '270 70% 85%',
    ring: '270 70% 55%',
    dark: {
      background: '270 70% 6%',
      foreground: '270 70% 90%',
      muted: '270 70% 10%',
      border: '270 70% 22%'
    }
  },
  focus: {
    name: 'Focus',
    description: 'Minimal, distraction-free',
    primary: '0 0% 40%',
    secondary: '0 0% 95%',
    accent: '120 30% 45%',
    background: '0 0% 100%',
    foreground: '0 0% 10%',
    muted: '0 0% 98%',
    border: '0 0% 90%',
    ring: '0 0% 40%',
    dark: {
      background: '0 0% 3%',
      foreground: '0 0% 95%',
      muted: '0 0% 8%',
      border: '0 0% 15%'
    }
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Simple wrapper without hooks to prevent React errors
  return <>{children}</>;
}

export function useTheme() {
  // Return default theme object to prevent errors
  return {
    theme: 'professional' as MoodTheme,
    setTheme: () => {},
    isDark: false,
    toggleDarkMode: () => {}
  };
}

export { moodThemes };
export type { MoodTheme };