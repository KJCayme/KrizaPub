
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
              ? 'text-nav-text-active bg-nav-bg-active'
              : 'text-nav-text hover:text-nav-text-hover hover:bg-nav-bg-hover'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DesktopNavigation;
