
import React from 'react';
import TestimonialCard from './TestimonialCard';
import { Testimonial } from '@/hooks/useTestimonials';

interface TestimonialsViewOnlyGridProps {
  testimonials: Testimonial[];
}

export const TestimonialsViewOnlyGrid = ({ testimonials }: TestimonialsViewOnlyGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
};
