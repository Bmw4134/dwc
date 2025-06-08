import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface QQThemeConfig {
  mode: 'executive' | 'operational';
  variant: 'professional' | 'premium' | 'enterprise';
  accentColor: string;
  backgroundStyle: 'gradient' | 'solid' | 'glass';
  animationLevel: 'minimal' | 'standard' | 'enhanced';
  compactMode: boolean;
}

interface QQThemeContextValue {
  theme: QQThemeConfig;
  updateTheme: (updates: Partial<QQThemeConfig>) => void;
  applyTheme: () => void;
}

const QQThemeContext = createContext<QQThemeContextValue | null>(null);

export const useQQTheme = () => {
  const context = useContext(QQThemeContext);
  if (!context) {
    throw new Error('useQQTheme must be used within QQThemeProvider');
  }
  return context;
};

interface QQThemeProviderProps {
  children: ReactNode;
  defaultMode?: 'executive' | 'operational';
}

export function QQThemeProvider({ children, defaultMode = 'executive' }: QQThemeProviderProps) {
  const [theme, setTheme] = useState<QQThemeConfig>({
    mode: defaultMode,
    variant: 'enterprise',
    accentColor: '#8b5cf6',
    backgroundStyle: 'gradient',
    animationLevel: 'enhanced',
    compactMode: false
  });

  const updateTheme = (updates: Partial<QQThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const applyTheme = () => {
    const root = document.documentElement;

    // Executive Theme Variables
    if (theme.mode === 'executive') {
      root.style.setProperty('--qq-primary', '#1e293b');
      root.style.setProperty('--qq-secondary', '#334155');
      root.style.setProperty('--qq-accent', theme.accentColor);
      root.style.setProperty('--qq-surface', '#f8fafc');
      root.style.setProperty('--qq-surface-elevated', '#ffffff');
      root.style.setProperty('--qq-text-primary', '#0f172a');
      root.style.setProperty('--qq-text-secondary', '#475569');
      root.style.setProperty('--qq-border', '#e2e8f0');
      root.style.setProperty('--qq-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
      root.style.setProperty('--qq-gradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    }

    // Operational Theme Variables
    if (theme.mode === 'operational') {
      root.style.setProperty('--qq-primary', '#0f172a');
      root.style.setProperty('--qq-secondary', '#1e293b');
      root.style.setProperty('--qq-accent', '#06b6d4');
      root.style.setProperty('--qq-surface', '#020617');
      root.style.setProperty('--qq-surface-elevated', '#0f172a');
      root.style.setProperty('--qq-text-primary', '#f1f5f9');
      root.style.setProperty('--qq-text-secondary', '#cbd5e1');
      root.style.setProperty('--qq-border', '#334155');
      root.style.setProperty('--qq-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.3)');
      root.style.setProperty('--qq-gradient', 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)');
    }

    // Variant Adjustments
    switch (theme.variant) {
      case 'professional':
        root.style.setProperty('--qq-border-radius', '4px');
        root.style.setProperty('--qq-spacing-unit', '8px');
        break;
      case 'premium':
        root.style.setProperty('--qq-border-radius', '8px');
        root.style.setProperty('--qq-spacing-unit', '12px');
        break;
      case 'enterprise':
        root.style.setProperty('--qq-border-radius', '12px');
        root.style.setProperty('--qq-spacing-unit', '16px');
        break;
    }

    // Background Style
    switch (theme.backgroundStyle) {
      case 'solid':
        root.style.setProperty('--qq-background', 'var(--qq-surface)');
        break;
      case 'gradient':
        root.style.setProperty('--qq-background', 'var(--qq-gradient)');
        break;
      case 'glass':
        root.style.setProperty('--qq-background', 'rgba(255, 255, 255, 0.05)');
        root.style.setProperty('--qq-backdrop-filter', 'blur(10px)');
        break;
    }

    // Animation Level
    switch (theme.animationLevel) {
      case 'minimal':
        root.style.setProperty('--qq-transition-duration', '150ms');
        root.style.setProperty('--qq-animation-scale', '0.5');
        break;
      case 'standard':
        root.style.setProperty('--qq-transition-duration', '200ms');
        root.style.setProperty('--qq-animation-scale', '1');
        break;
      case 'enhanced':
        root.style.setProperty('--qq-transition-duration', '300ms');
        root.style.setProperty('--qq-animation-scale', '1.5');
        break;
    }

    // Compact Mode
    if (theme.compactMode) {
      root.style.setProperty('--qq-component-height', '32px');
      root.style.setProperty('--qq-font-size-base', '14px');
      root.style.setProperty('--qq-padding-base', '8px');
    } else {
      root.style.setProperty('--qq-component-height', '40px');
      root.style.setProperty('--qq-font-size-base', '16px');
      root.style.setProperty('--qq-padding-base', '12px');
    }
  };

  useEffect(() => {
    applyTheme();
  }, [theme]);

  return (
    <QQThemeContext.Provider value={{ theme, updateTheme, applyTheme }}>
      {children}
    </QQThemeContext.Provider>
  );
}

// QQ Themed Components
export const QQCard = ({ children, className = '', elevated = false, ...props }: any) => {
  const baseClasses = `
    bg-[var(--qq-surface-elevated)] 
    border border-[var(--qq-border)] 
    rounded-[var(--qq-border-radius)] 
    shadow-[var(--qq-shadow)]
    transition-all duration-[var(--qq-transition-duration)]
    hover:shadow-lg
    ${elevated ? 'shadow-lg' : ''}
    ${className}
  `;
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export const QQButton = ({ children, variant = 'primary', size = 'default', className = '', ...props }: any) => {
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-[var(--qq-border-radius)]
    font-medium
    transition-all duration-[var(--qq-transition-duration)]
    focus:outline-none focus:ring-2 focus:ring-[var(--qq-accent)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[var(--qq-accent)] 
      text-white 
      hover:opacity-90
      shadow-sm
    `,
    secondary: `
      bg-[var(--qq-secondary)] 
      text-[var(--qq-text-primary)] 
      hover:bg-opacity-80
      border border-[var(--qq-border)]
    `,
    outline: `
      border border-[var(--qq-accent)] 
      text-[var(--qq-accent)] 
      hover:bg-[var(--qq-accent)] hover:text-white
    `,
    ghost: `
      text-[var(--qq-text-primary)] 
      hover:bg-[var(--qq-surface)]
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const QQBadge = ({ children, variant = 'default', className = '', ...props }: any) => {
  const baseClasses = `
    inline-flex items-center
    px-2 py-1
    text-xs font-medium
    rounded-full
    transition-all duration-[var(--qq-transition-duration)]
  `;

  const variants = {
    default: 'bg-[var(--qq-surface)] text-[var(--qq-text-secondary)] border border-[var(--qq-border)]',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    accent: 'bg-[var(--qq-accent)] text-white'
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};