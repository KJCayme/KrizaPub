import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';

const Config = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  const applyTheme = (theme: 'default' | 'lavender') => {
    const root = document.documentElement;
    
    if (theme === 'lavender') {
      // Lavender-based color palette
      root.style.setProperty('--bg-start', '270 30% 25%');    // Deep lavender
      root.style.setProperty('--bg-mid', '280 60% 45%');      // Medium lavender
      root.style.setProperty('--bg-end', '290 70% 65%');      // Light lavender
      root.style.setProperty('--blob-1', '270 80% 75%');      // Soft lavender
      root.style.setProperty('--blob-2', '300 80% 75%');      // Pink lavender
      root.style.setProperty('--blob-3', '260 80% 75%');      // Blue lavender
    } else {
      // Default theme - restore original values based on current mode
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        root.style.setProperty('--bg-start', '222.2 47.4% 6%');
        root.style.setProperty('--bg-mid', '220 60% 20%');
        root.style.setProperty('--bg-end', '270 60% 30%');
        root.style.setProperty('--blob-1', '210 100% 60%');
        root.style.setProperty('--blob-2', '270 100% 60%');
        root.style.setProperty('--blob-3', '330 100% 60%');
      } else {
        root.style.setProperty('--bg-start', '222.2 47.4% 11.2%');
        root.style.setProperty('--bg-mid', '220 60% 40%');
        root.style.setProperty('--bg-end', '270 60% 50%');
        root.style.setProperty('--blob-1', '210 100% 70%');
        root.style.setProperty('--blob-2', '270 100% 70%');
        root.style.setProperty('--blob-3', '330 100% 70%');
      }
    }
  };

  const handleChooseTheme = () => {
    const newTheme = currentTheme === 'default' ? 'lavender' : 'default';
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <section id="config" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
            Configuration
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Customize your experience with various theme options and settings.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleChooseTheme}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
          >
            <Palette className="w-5 h-5 mr-2" />
            {currentTheme === 'default' ? 'Switch to Lavender Theme' : 'Switch to Default Theme'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Config;