
import React from 'react';
import TestimonialCard from './TestimonialCard';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface TestimonialsGridProps {
  testimonials: any[];
  isLoading: boolean;
}

const TestimonialsGrid = ({ testimonials, isLoading }: TestimonialsGridProps) => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });

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
    <div ref={ref} className="block">
      {/* Mobile: Single column layout */}
      <div className="md:hidden grid grid-cols-1 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`${
              hasIntersected 
                ? 'animate-slide-in-left' 
                : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <TestimonialCard 
              testimonial={testimonial}
              padding={padding}
            />
          </div>
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
        {testimonials.map((testimonial, index) => {
          // Determine which column this item will be in based on index
          const isLeftColumn = index % 2 === 0;
          const animationClass = isLeftColumn ? 'animate-slide-in-left' : 'animate-slide-in-right';
          
          return (
            <div 
              key={testimonial.id}
              className={`${
                hasIntersected 
                  ? animationClass 
                  : 'opacity-0'
              }`}
              style={{ 
                breakInside: 'avoid',
                marginBottom: `${padding}px`,
                display: 'inline-block',
                width: '100%',
                animationDelay: `${Math.floor(index / 2) * 150}ms`
              }}
            >
              <TestimonialCard 
                testimonial={testimonial}
                padding={padding}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestimonialsGrid;
