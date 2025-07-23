
import React, { useState } from 'react';
import { Star, Quote, Trash2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteTestimonial } from '../../hooks/useDeleteTestimonial';
import { Button } from '../ui/button';

interface TestimonialCardProps {
  testimonial: any;
  padding?: number;
}

const TestimonialCard = ({ testimonial, padding = 24 }: TestimonialCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const deleteTestimonial = useDeleteTestimonial();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial.mutateAsync({ 
          id: testimonial.id, 
          source: testimonial.source 
        });
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const renderStars = (rating: number | null) => {
    const stars = [];
    const ratingValue = rating || 5;
    
    for (let i = 1; i <= 5; i++) {
      const diff = ratingValue - i;
      
      if (diff >= 0) {
        // Full star
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (diff > -1) {
        // Half star
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-gray-300"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 relative flex flex-col ${
        isMobile ? '' : 'hover:shadow-xl transform hover:-translate-y-2'
      }`}
      style={{ padding: `${padding}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-6 right-6 text-blue-200 dark:text-blue-800">
        <Quote className="w-6 h-6" />
      </div>

      {/* Delete Button - Only show for authenticated users on hover */}
      {user && isHovered && (
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
            disabled={deleteTestimonial.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* User Section */}
      <div className="flex items-center" style={{ marginBottom: `${padding}px` }}>
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {(testimonial.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 dark:text-white text-base truncate">
            {testimonial.name || '**********************'}
          </h4>
          {testimonial.company && (
            <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
              {testimonial.company}
            </p>
          )}
          {testimonial.email && (
            <p className="text-slate-500 dark:text-slate-500 text-sm truncate">
              {testimonial.email}
            </p>
          )}
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex" style={{ marginBottom: `${padding}px` }}>
        {renderStars(testimonial.rate)}
      </div>

      {/* Feedback Section */}
      {testimonial.feedback && (
        <div style={{ marginBottom: testimonial.feedback_picture ? `${padding}px` : 0 }}>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic text-base">
            "{testimonial.feedback}"
          </p>
        </div>
      )}

      {/* Evidence Section */}
      {testimonial.feedback_picture && (
        <div className="flex-grow flex items-center justify-center overflow-hidden">
          <div className={`w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900 ${isMobile ? 'h-48' : 'h-64 md:h-80'}`}>
            <img
              src={testimonial.feedback_picture}
              alt="Feedback Evidence"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;
