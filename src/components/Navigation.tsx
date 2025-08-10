import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { useIsTablet } from '../hooks/use-tablet';
import { useAuth } from '../hooks/useAuth';
import DarkModeToggle from './navigation/DarkModeToggle';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import TabletMenu from './navigation/TabletMenu';
import PortfolioDropdown from './navigation/PortfolioDropdown';
import BookCallButton from './navigation/BookCallButton';
import AuthDialog from './auth/AuthDialog';
import UserMenu from './auth/UserMenu';
import { Button } from './ui/button';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false);
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
  const [activePortfolioCategory, setActivePortfolioCategory] = useState('admin');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { user, loading: authLoading } = useAuth();

  const baseNavItems = [
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Projects' },
    { id: 'tools', label: 'Tools' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contacts' }
  ];

  // Add Config item only for authenticated users
  const navItems = user ? [...baseNavItems, { id: 'config', label: 'Config' }] : baseNavItems;

  const portfolioCategories = [
    { id: 'admin', name: 'Admin Support' },
    { id: 'social', name: 'Social Media' },
    { id: 'project', name: 'Project Management' },
    { id: 'design', name: 'Design & Creative' },
    { id: 'copywriting', name: 'Copywriting' },
    { id: 'webdev', name: 'Web Development', badge: 'Soon!' },
    { id: 'ai', name: 'AI Automation', badge: 'Soon!' }
  ];

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    let scrollHandlerEnabled = true;

    const handleScroll = () => {
      if (!scrollHandlerEnabled) return;
      
      const sections = user 
        ? ['hero', 'skills', 'portfolio', 'tools', 'certificates', 'testimonials', 'contact', 'config']
        : ['hero', 'skills', 'portfolio', 'tools', 'certificates', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            if (activeSection !== section) {
              console.log('Navigation: Active section changed from', activeSection, 'to', section, 'scrollPosition:', scrollPosition);
              setActiveSection(section);
            }
            break;
          }
        }
      }

      if (isMobile) {
        const portfolioElement = document.getElementById('portfolio');
        if (portfolioElement) {
          const rect = portfolioElement.getBoundingClientRect();
          const isVisible = rect.top <= 100 && rect.bottom >= 100;
          setIsPortfolioVisible(isVisible);
        }
      } else {
        setIsPortfolioVisible(false);
      }
    };

    const handleDisableNavScroll = () => {
      scrollHandlerEnabled = false;
      console.log('Navigation: Scroll handler disabled');
    };

    const handleEnableNavScroll = () => {
      scrollHandlerEnabled = true;
      console.log('Navigation: Scroll handler enabled');
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('disableNavScroll', handleDisableNavScroll);
    window.addEventListener('enableNavScroll', handleEnableNavScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('disableNavScroll', handleDisableNavScroll);
      window.removeEventListener('enableNavScroll', handleEnableNavScroll);
    };
  }, [isMobile, user]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handlePortfolioCategoryChange = (categoryId: string) => {
    setActivePortfolioCategory(categoryId);
    setShowPortfolioDropdown(false);
    
    window.dispatchEvent(new CustomEvent('portfolioCategoryChange', { 
      detail: { category: categoryId } 
    }));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 will-change-transform" style={{ minHeight: '64px' }}>
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between h-16 min-h-16">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />

          {/* Desktop Navigation - hidden on tablet and mobile */}
          <DesktopNavigation 
            navItems={navItems} 
            activeSection={activeSection} 
            onSectionClick={scrollToSection} 
          />

          {/* Mobile Portfolio Dropdown */}
          {isMobile && isPortfolioVisible && (
            <PortfolioDropdown
              portfolioCategories={portfolioCategories}
              activePortfolioCategory={activePortfolioCategory}
              showPortfolioDropdown={showPortfolioDropdown}
              onToggleDropdown={() => setShowPortfolioDropdown(!showPortfolioDropdown)}
              onCategoryChange={handlePortfolioCategoryChange}
            />
          )}

          {/* Tablet Layout - Dark Mode Toggle (left), Book Call + Burger Menu (right) */}
          {isTablet && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <BookCallButton isVisible={true} />
              <TabletMenu
                navItems={navItems}
                activeSection={activeSection}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                onSectionClick={scrollToSection}
                user={user}
                authLoading={authLoading}
                onShowAuthDialog={() => setShowAuthDialog(true)}
              />
            </div>
          )}

          {/* Desktop Right Side */}
          {!isTablet && !isMobile && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {!authLoading && (
                <>
                  {user ? (
                    <UserMenu />
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAuthDialog(true)}
                    >
                      Sign In
                    </Button>
                  )}
                </>
              )}
              <BookCallButton isVisible={true} />
            </div>
          )}

          {/* Mobile Right Side */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <BookCallButton isMobile={true} isVisible={!isPortfolioVisible} />
              <MobileMenu
                navItems={navItems}
                activeSection={activeSection}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                onSectionClick={scrollToSection}
                user={user}
                authLoading={authLoading}
                onShowAuthDialog={() => setShowAuthDialog(true)}
              />
            </div>
          )}
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </nav>
  );
};

export default Navigation;
