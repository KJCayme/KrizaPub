
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface GlassmorphicToggleProps {
  isGlassmorphic: boolean;
  onToggle: () => void;
}

const GlassmorphicToggle = ({ isGlassmorphic, onToggle }: GlassmorphicToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="icon"
      className="fixed top-4 left-16 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-white/20 hover:scale-110 transition-all duration-300"
    >
      <Sparkles className={`h-4 w-4 ${isGlassmorphic ? 'text-purple-500' : 'text-slate-600'}`} />
    </Button>
  );
};

export default GlassmorphicToggle;
