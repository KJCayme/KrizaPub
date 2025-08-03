
import React from 'react';

interface NavItem {
  id: string;
  label: string;
}

interface DesktopNavigationProps {
  navItems: NavItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const DesktopNavigation = ({ navItems, activeSection, onSectionClick }: DesktopNavigationProps) => {
  return (
    <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionClick(item.id)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeSection === item.id
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DesktopNavigation;
