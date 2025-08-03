
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

interface NavItem {
  id: string;
  label: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  activeSection: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onSectionClick: (sectionId: string) => void;
  user: any;
  authLoading: boolean;
  onShowAuthDialog: () => void;
}

const MobileMenu = ({ 
  navItems, 
  activeSection, 
  isMenuOpen, 
  onToggleMenu, 
  onSectionClick,
  user,
  authLoading,
  onShowAuthDialog
}: MobileMenuProps) => {
  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    onToggleMenu(); // Close menu after clicking
  };

  return (
    <>
      <button
        onClick={onToggleMenu}
        className="md:hidden text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors z-50"
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg z-40">
          <div className="py-4 px-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {!authLoading && !user && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    onShowAuthDialog();
                    onToggleMenu();
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
