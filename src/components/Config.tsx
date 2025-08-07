import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';

const Config = () => {
  const handleChooseTheme = () => {
    // Not functional yet - placeholder for future implementation
    console.log('Choose theme functionality not implemented yet');
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

        <div className="flex justify-center">
          <Button
            onClick={handleChooseTheme}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
          >
            <Palette className="w-5 h-5 mr-2" />
            Choose Theme
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Config;