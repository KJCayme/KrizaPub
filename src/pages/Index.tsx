import * as React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useViewState } from '../hooks/useViewState';
import { NavbarVisibilityProvider } from '../hooks/useNavbarVisibility';
import CertificatesOnlyView from '../components/layout/CertificatesOnlyView';
import TestimonialsOnlyView from '../components/layout/TestimonialsOnlyView';
import MainLayout from '../components/layout/MainLayout';

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    showAllProjects,
    showCertificatesOnly,
    showTestimonialsOnly,
    handleShowAllProjectsChange,
    handleShowCertificatesOnly,
    handleShowTestimonialsOnly,
    handleBackFromCertificates,
    handleBackFromTestimonials,
  } = useViewState();

  React.useEffect(() => {
    // Disable browser scroll restoration to prevent conflicts
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Disable right-click globally
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <NavbarVisibilityProvider>
      {/* Show certificates-only view */}
      {showCertificatesOnly && (
        <CertificatesOnlyView
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onBack={handleBackFromCertificates}
        />
      )}

      {/* Show testimonials-only view */}
      {showTestimonialsOnly && (
        <TestimonialsOnlyView
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onBack={handleBackFromTestimonials}
        />
      )}

      {/* Main layout */}
      {!showCertificatesOnly && !showTestimonialsOnly && (
        <MainLayout
          showAllProjects={showAllProjects}
          onShowAllProjectsChange={handleShowAllProjectsChange}
          onShowCertificatesOnly={handleShowCertificatesOnly}
          onShowTestimonialsOnly={handleShowTestimonialsOnly}
        />
      )}
    </NavbarVisibilityProvider>
  );
};

export default Index;
