import { useState } from 'react';

export const useViewState = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showCertificatesOnly, setShowCertificatesOnly] = useState(false);
  const [showTestimonialsOnly, setShowTestimonialsOnly] = useState(false);

  const handleShowAllProjectsChange = (show: boolean) => {
    setShowAllProjects(show);
    if (show) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleShowCertificatesOnly = (show: boolean) => {
    setShowCertificatesOnly(show);
    if (show) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleShowTestimonialsOnly = (show: boolean) => {
    setShowTestimonialsOnly(show);
    if (show) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleBackFromCertificates = () => {
    setShowCertificatesOnly(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const certificatesSection = document.getElementById('certificates');
        if (certificatesSection) {
          certificatesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    });
  };

  const handleBackFromTestimonials = () => {
    setShowTestimonialsOnly(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const testimonialsSection = document.getElementById('testimonials');
        if (testimonialsSection) {
          testimonialsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 800);
    });
  };

  return {
    showAllProjects,
    showCertificatesOnly,
    showTestimonialsOnly,
    handleShowAllProjectsChange,
    handleShowCertificatesOnly,
    handleShowTestimonialsOnly,
    handleBackFromCertificates,
    handleBackFromTestimonials,
  };
};