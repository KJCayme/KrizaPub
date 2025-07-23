
import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Plus, Code2 } from 'lucide-react';
import TestimonialsGrid from './testimonials/TestimonialsGrid';
import TestimonialsHeader from './testimonials/TestimonialsHeader';
import AddTestimonialForm from './AddTestimonialForm';
import AddClientTestimonialForm from './AddClientTestimonialForm';
import CodeGenerationPopup from './CodeGenerationPopup';
import { useTestimonials } from '../hooks/useTestimonials';
import { useGenerateCode } from '../hooks/useClientTestimonials';
import { useAuth } from '../hooks/useAuth';

interface TestimonialsViewOnlyProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

const TestimonialsViewOnly: React.FC<TestimonialsViewOnlyProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onBack,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const { data: testimonials, isLoading, error } = useTestimonials();
  const generateCodeMutation = useGenerateCode();
  const { user } = useAuth();

  const handleGenerateCode = async () => {
    try {
      const result = await generateCodeMutation.mutateAsync();
      setGeneratedCode(result.code);
      setShowCodePopup(true);
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
            
            <div className="flex items-center gap-4">
              {user && (
                <Button
                  onClick={handleGenerateCode}
                  disabled={generateCodeMutation.isPending}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  {generateCodeMutation.isPending ? 'Generating...' : 'Generate Code'}
                </Button>
              )}
              
              <Button
                onClick={onToggleDarkMode}
                variant="outline"
                size="icon"
                className="w-10 h-10"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </Button>
            </div>
          </div>

          <TestimonialsHeader 
            title="What People Say"
            description="Here's what clients and colleagues have to say about working with me."
          />

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">Error loading testimonials</p>
            </div>
          ) : (
            <div className="relative">
              <TestimonialsGrid testimonials={testimonials || []} isLoading={isLoading} />
              
              {/* Add Client Testimonial Button positioned in the grid */}
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => setShowClientForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-6 py-3"
                >
                  <Plus className="w-5 h-5" />
                  Add Client Testimonial
                </Button>
              </div>
            </div>
          )}

          {user && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3"
              >
                <Plus className="w-5 h-5" />
                Add Testimonial
              </Button>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <AddTestimonialForm onClose={() => setShowAddForm(false)} />
      )}

      {showClientForm && (
        <AddClientTestimonialForm onClose={() => setShowClientForm(false)} />
      )}

      {showCodePopup && (
        <CodeGenerationPopup 
          code={generatedCode} 
          onClose={() => setShowCodePopup(false)} 
        />
      )}
    </div>
  );
};

export default TestimonialsViewOnly;
