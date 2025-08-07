
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { applyTheme, currentTheme } = useTheme();

  useEffect(() => {
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Re-apply current theme when dark mode changes
    applyTheme(currentTheme);
    
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode, applyTheme, currentTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode };
};
