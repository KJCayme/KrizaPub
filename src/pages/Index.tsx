import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Portfolio from '../components/Portfolio';
import Tools from '../components/Tools';
import Certificates from '../components/Certificates';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import CertificatesViewOnly from '../components/CertificatesViewOnly';
import TestimonialsViewOnly from '../components/TestimonialsViewOnly';
import NetworkStatusIndicator from '../components/NetworkStatusIndicator';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showCertificatesOnly, setShowCertificatesOnly] = useState(false);
  const [showTestimonialsOnly, setShowTestimonialsOnly] = useState(false);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }

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

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleShowAllProjectsChange = (show: boolean) => {
    setShowAllProjects(show);
    // Scroll to top when showing all projects with reduced motion
    if (show) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleShowCertificatesOnly = (show: boolean) => {
    setShowCertificatesOnly(show);
    // Scroll to top when showing certificates only with reduced motion
    if (show) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleShowTestimonialsOnly = (show: boolean) => {
    setShowTestimonialsOnly(show);
    // Scroll to top when showing testimonials only with reduced motion
    if (show) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleBackFromCertificates = () => {
    setShowCertificatesOnly(false);
  };

  const handleBackFromTestimonials = () => {
    setShowTestimonialsOnly(false);
    // Wait longer for DOM to fully re-render all sections
    setTimeout(() => {
      const testimonialsSection = document.getElementById('testimonials');
      if (testimonialsSection) {
        console.log(`Testimonials section found, scrolling to it`);
        testimonialsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.log('Testimonials section not found');
      }
    }, 500); // Increased timeout to ensure DOM is fully updated
  };

  // Show certificates-only view
  if (showCertificatesOnly) {
    return (
      <div className="min-h-screen transition-colors duration-300">
        <NetworkStatusIndicator />
        <CertificatesViewOnly 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode}
          onBack={handleBackFromCertificates}
        />
      </div>
    );
  }

  // Show testimonials-only view
  if (showTestimonialsOnly) {
    return (
      <div className="min-h-screen transition-colors duration-300">
        <NetworkStatusIndicator />
        <TestimonialsViewOnly 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode}
          onBack={handleBackFromTestimonials}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <NetworkStatusIndicator />
      {!showAllProjects && <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />}
      <div className={!showAllProjects ? "pt-16" : ""}> {/* Add padding only when navigation is visible */}
        {!showAllProjects && (
          <section id="hero">
            <Hero />
          </section>
        )}
        {!showAllProjects && (
          <section id="about">
            <About />
          </section>
        )}
        {!showAllProjects && (
          <section id="skills">
            <Skills />
          </section>
        )}
        <section id="portfolio">
          <Portfolio onShowAllProjectsChange={handleShowAllProjectsChange} />
        </section>
        {!showAllProjects && (
          <section id="tools">
            <Tools />
          </section>
        )}
        {!showAllProjects && (
          <section id="certificates">
            <Certificates onShowCertificatesOnly={handleShowCertificatesOnly} />
          </section>
        )}
        {!showAllProjects && (
          <section id="testimonials">
            <Testimonials onShowTestimonialsOnly={handleShowTestimonialsOnly} />
          </section>
        )}
        {!showAllProjects && (
          <section id="contact">
            <Contact />
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
