
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useThemeSettings, ThemeSettings } from '../hooks/useThemeSettings';
import { useDarkMode } from '../hooks/useDarkMode';

interface DatabaseThemeContextType {
  activeTheme: ThemeSettings | undefined;
  allThemes: ThemeSettings[];
  isLoading: boolean;
  setActiveTheme: (themeId: string) => void;
  isSettingTheme: boolean;
}

const DatabaseThemeContext = createContext<DatabaseThemeContextType | undefined>(undefined);

interface DatabaseThemeProviderProps {
  children: ReactNode;
}

export const DatabaseThemeProvider: React.FC<DatabaseThemeProviderProps> = ({ children }) => {
  const {
    activeTheme,
    allThemes,
    isLoading,
    setActiveTheme,
    isSettingTheme,
    applyThemeToDOM,
  } = useThemeSettings();
  
  const { isDarkMode } = useDarkMode();

  // Apply theme changes when active theme or dark mode changes
  useEffect(() => {
    if (activeTheme && !isLoading) {
      applyThemeToDOM(activeTheme, isDarkMode);
    }
  }, [activeTheme, isDarkMode, isLoading, applyThemeToDOM]);

  // Subscribe to real-time theme changes
  useEffect(() => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const channel = supabase
      .channel('theme-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_theme_settings'
        },
        () => {
          // Refetch themes when changes occur
          window.location.reload(); // Simple approach for now
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DatabaseThemeContext.Provider value={{
      activeTheme,
      allThemes,
      isLoading,
      setActiveTheme,
      isSettingTheme,
    }}>
      {children}
    </DatabaseThemeContext.Provider>
  );
};

export const useDatabaseTheme = () => {
  const context = useContext(DatabaseThemeContext);
  if (context === undefined) {
    throw new Error('useDatabaseTheme must be used within a DatabaseThemeProvider');
  }
  return context;
};
