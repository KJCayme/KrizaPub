import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../hooks/useAuth';
import DarkModeToggle from './navigation/DarkModeToggle';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import UserMenu from './auth/UserMenu';
import BookCallButton from './navigation/BookCallButton';

interface NavigationProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Navigation = ({ isDarkMode = false, onToggleDarkMode }: NavigationProps) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isLoading: authLoading } = useAuth();

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'tools', label: 'Tools' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 will-change-transform" style={{ minHeight: '64px' }}>
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-16 min-h-16">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />

          <DesktopNavigation 
            sections={sections}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />

          {isMobile && (
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
              onClose={closeMobileMenu}
              sections={sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          )}

          <div className="flex items-center gap-3 flex-shrink-0">
            {!authLoading && (
              <>
                {user ? (
                  <UserMenu user={user} />
                ) : (
                  <BookCallButton />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
