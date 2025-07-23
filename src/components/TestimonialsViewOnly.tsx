
import React from 'react';
import { useClientTestimonials } from '@/hooks/useClientTestimonials';
import { TestimonialsViewOnlyHeader } from './testimonials/TestimonialsViewOnlyHeader';
import { TestimonialsViewOnlyGrid } from './testimonials/TestimonialsViewOnlyGrid';

export const TestimonialsViewOnly = () => {
  const { testimonials, isLoading } = useClientTestimonials();

  const handleBack = () => {
    // Navigate back to portfolio and scroll to testimonials section
    window.history.pushState({}, '', '/');
    
    // Use a timeout to ensure the DOM is ready
    setTimeout(() => {
      const testimonialsSection = document.getElementById('testimonials');
      if (testimonialsSection) {
        testimonialsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TestimonialsViewOnlyHeader onBack={handleBack} />
      <TestimonialsViewOnlyGrid testimonials={testimonials || []} />
    </div>
  );
};
