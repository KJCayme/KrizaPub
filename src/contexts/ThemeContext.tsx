
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'default' | 'lavender' | 'custom';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    const isDark = document.documentElement.classList.contains('dark');
    
    if (theme === 'lavender') {
      // Lavender-based color palette
      root.style.setProperty('--hero-bg-start', '270 30% 25%');
      root.style.setProperty('--hero-bg-mid', '280 60% 45%');
      root.style.setProperty('--hero-bg-end', '290 70% 65%');
      root.style.setProperty('--hero-blob-1', '270 80% 75%');
      root.style.setProperty('--hero-blob-2', '300 80% 75%');
      root.style.setProperty('--hero-blob-3', '260 80% 75%');
      
      // Apply lavender theme to other sections
      root.style.setProperty('--about-bg-start', '270 20% 95%');
      root.style.setProperty('--about-bg-end', '280 30% 97%');
      root.style.setProperty('--config-button-purple-start', '270 91% 65%');
      root.style.setProperty('--config-button-purple-end', '300 81% 60%');
    } else if (theme === 'custom') {
      // Custom theme placeholder - will be implemented later
      console.log('Custom theme selected - implementation coming soon');
      return;
    } else {
      // Default theme - restore original values based on current mode
      if (isDark) {
        root.style.setProperty('--hero-bg-start', '222.2 47.4% 6%');
        root.style.setProperty('--hero-bg-mid', '220 60% 20%');
        root.style.setProperty('--hero-bg-end', '270 60% 30%');
        root.style.setProperty('--hero-blob-1', '210 100% 60%');
        root.style.setProperty('--hero-blob-2', '270 100% 60%');
        root.style.setProperty('--hero-blob-3', '330 100% 60%');
        root.style.setProperty('--about-bg-start', '222.2 84% 4.9%');
        root.style.setProperty('--about-bg-end', '215.4 16.3% 25.1%');
      } else {
        root.style.setProperty('--hero-bg-start', '222.2 47.4% 11.2%');
        root.style.setProperty('--hero-bg-mid', '220 60% 40%');
        root.style.setProperty('--hero-bg-end', '270 60% 50%');
        root.style.setProperty('--hero-blob-1', '210 100% 70%');
        root.style.setProperty('--hero-blob-2', '270 100% 70%');
        root.style.setProperty('--hero-blob-3', '330 100% 70%');
        root.style.setProperty('--about-bg-start', '210 40% 98%');
        root.style.setProperty('--about-bg-end', '214 100% 97%');
      }
      
      // Reset config button colors to default
      root.style.setProperty('--config-button-purple-start', '270 91% 65%');
      root.style.setProperty('--config-button-purple-end', '330 81% 60%');
    }
  };

  const setTheme = (theme: Theme) => {
    if (theme === 'custom') {
      // Don't actually set custom theme yet - just log for now
      console.log('Custom theme not yet implemented');
      return;
    }
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('selectedTheme', theme);
  };

  useEffect(() => {
    // Load saved theme preference on mount
    const savedTheme = localStorage.getItem('selectedTheme') as Theme;
    if (savedTheme && (savedTheme === 'default' || savedTheme === 'lavender')) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Set default theme as fallback
      setCurrentTheme('default');
      applyTheme('default');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
