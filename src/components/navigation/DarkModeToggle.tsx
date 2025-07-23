
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle = ({ isDarkMode, onToggle }: DarkModeToggleProps) => {
  return (
    <div className="flex items-center -ml-2">
      <button
        onClick={onToggle}
        className="p-2 transition-colors"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-orange-400" />
        ) : (
          <Moon className="h-5 w-5 text-black" />
        )}
      </button>
    </div>
  );
};

export default DarkModeToggle;
