
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface TestimonialsHeaderProps {
  title: string;
  description: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const TestimonialsHeader = ({ 
  title, 
  description, 
  showAddButton = false, 
  onAddClick 
}: TestimonialsHeaderProps) => {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
            {title}
          </h2>
        </div>
        {showAddButton && (
          <Button
            onClick={onAddClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ml-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Testimonial
          </Button>
        )}
      </div>
      <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default TestimonialsHeader;
