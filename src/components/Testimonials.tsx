
import React, { useState } from 'react';
import { ChevronDown, Plus, Code } from 'lucide-react';
import { Button } from './ui/button';
import { handleBookCall } from '../utils/bookCall';
import { useTestimonials } from '../hooks/useTestimonials';
import { useAuth } from '../hooks/useAuth';
import { useGenerateCode } from '../hooks/useClientTestimonials';
import { useIsMobile } from '../hooks/use-mobile';
import { useIsTablet } from '../hooks/use-tablet';
import AddTestimonialForm from './AddTestimonialForm';
import AddClientTestimonialForm from './AddClientTestimonialForm';
import CodeGenerationPopup from './CodeGenerationPopup';
import TestimonialsHeader from './testimonials/TestimonialsHeader';
import TestimonialsGrid from './testimonials/TestimonialsGrid';
import TestimonialsSkeleton from './testimonials/TestimonialsSkeleton';

interface TestimonialsProps {
  onShowTestimonialsOnly: (show: boolean) => void;
}

const Testimonials = ({ onShowTestimonialsOnly }: TestimonialsProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
   const { data: testimonials = [], isLoading, error } = useTestimonials(6);
   const { user } = useAuth();
   const generateCode = useGenerateCode();
   const isMobile = useIsMobile();
   const isTablet = useIsTablet();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleSeeMoreTestimonials = () => {
    onShowTestimonialsOnly(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleGenerateCode = async () => {
    try {
      const code = await generateCode.mutateAsync();
      setGeneratedCode(code);
      setShowCodePopup(true);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  // Check if we're offline and have no cached data
  const isOfflineWithNoCache = error && testimonials.length === 0;
  const isNetworkError = error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError');

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  // Show no data message if offline with no cache or if no testimonials exist
  if (isOfflineWithNoCache || (testimonials.length === 0 && !user)) {
    return (
      <TestimonialsSkeleton 
        showNoDataMessage={true} 
        isOffline={isNetworkError} 
      />
    );
  }

  const displayedTestimonials = testimonials;

  return (
    <>
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">
                What Clients Say
              </h2>
              <div className="flex-1 flex justify-end gap-2">
                {user && (
                  <>
                     <Button
                       onClick={handleGenerateCode}
                       disabled={generateCode.isPending}
                       className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                     >
                       <Code className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                       <span className={`text-xs sm:text-sm lg:text-base whitespace-nowrap ${isMobile ? 'sr-only' : isTablet ? 'ml-1 sm:ml-2' : 'ml-1 sm:ml-2'}`}>
                         {generateCode.isPending ? 'Generating...' : isTablet ? 'Generate' : 'Generate Code'}
                       </span>
                     </Button>
                     <Button
                       onClick={() => setShowAddForm(true)}
                       className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                     >
                       <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                       <span className={`text-xs sm:text-sm lg:text-base whitespace-nowrap ${isMobile ? 'sr-only' : isTablet ? 'ml-1 sm:ml-2' : 'ml-1 sm:ml-2'}`}>
                         {isTablet ? 'Add' : 'Add Testimonial'}
                       </span>
                     </Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Don't just take my word for it. Here's what my clients have to say about working with me and the results we've achieved together.
            </p>
          </div>

          {/* Add Client Testimonial Button - positioned below caption - public use */}
          <div className="mb-12 flex justify-center">
            <Button
              onClick={() => setShowClientForm(true)}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base whitespace-nowrap">
                Add Client Testimonial
              </span>
            </Button>
          </div>

          {displayedTestimonials.length > 0 ? (
            <TestimonialsGrid testimonials={displayedTestimonials} isLoading={false} />
          ) : (
            <div className="text-center text-slate-600 dark:text-slate-300">
              <p className="text-lg mb-4">No testimonials yet.</p>
              {user && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowClientForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Client Testimonial
                  </Button>
                </div>
              )}
            </div>
          )}

          {testimonials.length >= 6 && (
            <div className="text-center mt-12">
              <button
                onClick={handleSeeMoreTestimonials}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>See More Testimonials</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white inline-block">
              <h3 className="text-2xl font-bold mb-4">
                Ready to see similar results for your business?
              </h3>
              <p className="text-blue-100 mb-6 max-w-xl">
                Experience the same level of excellence and results that my clients rave about.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleBookCall}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Book a Call
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
};

export default Testimonials;
