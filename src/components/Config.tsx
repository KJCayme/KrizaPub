
import React, { useState } from 'react';
import { Palette, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useTheme, Theme } from '../contexts/ThemeContext';

const Config = () => {
  const { currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleQuickToggle = () => {
    const themes: Theme[] = ['default', 'lavender', 'colorful'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handleThemeSelect = () => {
    if (selectedTheme !== 'custom') {
      setTheme(selectedTheme);
    }
    setIsDialogOpen(false);
  };

  // Update selectedTheme when currentTheme changes
  React.useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const getQuickToggleText = () => {
    switch (currentTheme) {
      case 'default':
        return 'Switch to Lavender Theme';
      case 'lavender':
        return 'Switch to Colorful Theme';
      case 'colorful':
        return 'Switch to Default Theme';
      default:
        return 'Switch Theme';
    }
  };

  return (
    <section id="config" className="py-20 bg-gradient-to-br from-config-bg-start to-config-bg-end transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-config-text-primary mb-6">
            Configuration
          </h2>
          <p className="text-lg md:text-xl text-config-text-secondary max-w-3xl mx-auto">
            Customize your experience with various theme options and settings.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleQuickToggle}
            className="bg-gradient-to-r from-config-button-purple-start to-config-button-purple-end text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
          >
            <Palette className="w-5 h-5 mr-2" />
            {getQuickToggleText()}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-config-button-blue-start to-config-button-blue-end text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
              >
                <Settings className="w-5 h-5 mr-2" />
                Custom Color Palette
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Choose Theme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <RadioGroup value={selectedTheme} onValueChange={(value) => setSelectedTheme(value as Theme)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default">Default Theme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lavender" id="lavender" />
                    <Label htmlFor="lavender">Lavender Theme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="colorful" id="colorful" />
                    <Label htmlFor="colorful">Colorful Theme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" disabled />
                    <Label htmlFor="custom" className="text-muted-foreground">Custom Theme (Coming Soon)</Label>
                  </div>
                </RadioGroup>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleThemeSelect}>
                    Apply Theme
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Config;
