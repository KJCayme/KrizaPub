
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

const DynamicIcon = ({ iconName, className = "w-6 h-6" }: DynamicIconProps) => {
  // Convert icon name to PascalCase if it's not already
  const formatIconName = (name: string) => {
    if (!name) return 'HelpCircle';
    
    // If it's already PascalCase, return as is
    if (name.match(/^[A-Z][a-zA-Z]*$/)) {
      return name;
    }
    
    // Convert kebab-case or space-separated to PascalCase
    return name
      .split(/[-\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  const formattedIconName = formatIconName(iconName);
  const IconComponent = (LucideIcons as any)[formattedIconName];
  
  // Fallback to HelpCircle if icon not found
  const FallbackIcon = IconComponent || LucideIcons.HelpCircle;
  
  return <FallbackIcon className={className} />;
};

export default DynamicIcon;
