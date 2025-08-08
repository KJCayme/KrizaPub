
import React, { useState } from 'react';
import { Palette, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useDatabaseTheme } from '../contexts/DatabaseThemeContext';

const Config = () => {
  const { activeTheme, allThemes, setActiveTheme, isSettingTheme, isLoading } = useDatabaseTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(activeTheme?.id || '');

  React.useEffect(() => {
    if (activeTheme?.id) {
      setSelectedThemeId(activeTheme.id);
    }
  }, [activeTheme]);

  const handleQuickToggle = () => {
    if (!activeTheme || allThemes.length === 0) return;
    
    const currentIndex = allThemes.findIndex(theme => theme.id === activeTheme.id);
    const nextIndex = (currentIndex + 1) % allThemes.length;
    const nextTheme = allThemes[nextIndex];
    
    if (nextTheme) {
      setActiveTheme(nextTheme.id);
    }
  };

  const handleThemeSelect = () => {
    if (selectedThemeId && selectedThemeId !== activeTheme?.id) {
      setActiveTheme(selectedThemeId);
    }
    setIsDialogOpen(false);
  };

  const getQuickToggleText = () => {
    if (!activeTheme || allThemes.length === 0) return 'Switch Theme';
    
    const currentIndex = allThemes.findIndex(theme => theme.id === activeTheme.id);
    const nextIndex = (currentIndex + 1) % allThemes.length;
    const nextTheme = allThemes[nextIndex];
    
    return nextTheme ? `Switch to ${nextTheme.theme_name} Theme` : 'Switch Theme';
  };

  if (isLoading) {
    return (
      <section id="config" className="py-20 bg-gradient-to-br from-config-bg-start to-config-bg-end transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-config-text-primary">Loading themes...</p>
          </div>
        </div>
      </section>
    );
  }

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
            disabled={isSettingTheme || allThemes.length <= 1}
            className="bg-gradient-to-r from-config-button-purple-start to-config-button-purple-end text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4 disabled:opacity-50"
          >
            <Palette className="w-5 h-5 mr-2" />
            {isSettingTheme ? 'Switching...' : getQuickToggleText()}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-config-button-blue-start to-config-button-blue-end text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4"
              >
                <Settings className="w-5 h-5 mr-2" />
                Theme Manager
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Choose Theme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-select">Available Themes</Label>
                  <Select value={selectedThemeId} onValueChange={setSelectedThemeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {allThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{theme.theme_name}</span>
                            {theme.is_active && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                Active
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleThemeSelect} 
                    disabled={isSettingTheme || selectedThemeId === activeTheme?.id}
                  >
                    {isSettingTheme ? 'Applying...' : 'Apply Theme'}
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
