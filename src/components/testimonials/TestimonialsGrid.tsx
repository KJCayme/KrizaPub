
import React from 'react';
import TestimonialCard from './TestimonialCard';

interface TestimonialsGridProps {
  testimonials: any[];
  isLoading?: boolean;
}

const TestimonialsGrid = ({ testimonials, isLoading = false }: TestimonialsGridProps) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-pulse text-slate-600 dark:text-slate-300">Loading testimonials...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-slate-600 dark:text-slate-300">
        <p className="text-lg mb-4">No testimonials yet.</p>
      </div>
    );
  }

  const padding = 24; // 1.5rem = 24px - consistent padding throughout

  return (
    <div className="block">
      {/* Mobile: Single column layout */}
      <div className="md:hidden grid grid-cols-1 gap-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial}
            padding={padding}
          />
        ))}
      </div>

      {/* Desktop: Dynamic masonry layout */}
      <div 
        className="hidden md:block"
        style={{ 
          columnCount: 2,
          columnGap: `${padding}px`,
          columnFill: 'balance'
        }}
      >
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            style={{ 
              breakInside: 'avoid',
              marginBottom: `${padding}px`,
              display: 'inline-block',
              width: '100%'
            }}
          >
            <TestimonialCard 
              testimonial={testimonial}
              padding={padding}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsGrid;
