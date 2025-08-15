
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Code } from 'lucide-react';
import { Button } from './ui/button';
import { useTestimonials } from '../hooks/useTestimonials';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { useGenerateCode } from '../hooks/useClientTestimonials';
import AddTestimonialForm from './AddTestimonialForm';
import AddClientTestimonialForm from './AddClientTestimonialForm';
import CodeGenerationPopup from './CodeGenerationPopup';
import TestimonialsHeader from './testimonials/TestimonialsHeader';
import TestimonialsGrid from './testimonials/TestimonialsGrid';
import AuthRequiredDialog from './auth/AuthRequiredDialog';

interface TestimonialsViewOnlyProps {
  onBack: () => void;
}

const TestimonialsViewOnly = ({ onBack }: TestimonialsViewOnlyProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const { data: testimonials = [], isLoading, error } = useTestimonials();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const generateCode = useGenerateCode();

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determine if we have cached data when offline
  const hasCachedData = isOffline && testimonials.length > 0;
  const hasNoDataOffline = isOffline && testimonials.length === 0 && !isLoading;

  const handleBack = () => {
    // Simply call onBack - let the parent handle all navigation logic
    onBack();
  };

  const handleAddTestimonial = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setShowAddForm(true);
  };

  const handleGenerateCode = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    try {
      const code = await generateCode.mutateAsync();
      setGeneratedCode(code);
      setShowCodePopup(true);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-white hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white">Testimonials</h1>
                <div className="flex gap-2">
                  {user && (
                    <Button
                      onClick={handleGenerateCode}
                      disabled={generateCode.isPending}
                      variant="ghost"
                      className="text-white hover:bg-white/20 transition-colors"
                    >
                      <Code className="w-5 h-5 mr-2" />
                      {generateCode.isPending ? 'Generating...' : 'Generate Code'}
                    </Button>
                  )}
                  {user && (
                    <Button
                      onClick={handleAddTestimonial}
                      variant="ghost"
                      className="text-white hover:bg-white/20 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Testimonial
                    </Button>
                  )}
                </div>
              </div>
              
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 transition-colors"
              >
                {isDarkMode ? (
                  <span className="text-lg">☀️</span>
                ) : (
                  <span className="text-lg">🌙</span>
                )}
              </Button>
            </div>
          </div>
        </nav>

        <div className="pt-16">
          <section className="py-20">
            <div className="container mx-auto px-6">
              <TestimonialsHeader
                title="All Client Testimonials"
                description="Here's what all my clients have to say about working with me and the results we've achieved together."
                showAddButton={false}
              />

              {/* Add Client Testimonial Button - prominently positioned and always visible for public use */}
              <div className="mb-12 flex justify-center">
                <Button
                  onClick={() => setShowClientForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base px-8 py-4"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your Testimonial
                </Button>
              </div>

              <TestimonialsGrid testimonials={testimonials} isLoading={isLoading} />

              {/* Show cached data message when offline */}
              {hasCachedData && (
                <div className="mt-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Failed to load more testimonials
                  </p>
                </div>
              )}

              {/* Show no data message for offline with no cache or online with no data */}
              {!isLoading && testimonials.length === 0 && (
                <div className="text-center text-slate-600 dark:text-slate-300">
                  {hasNoDataOffline ? (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
                      <div className="text-4xl mb-4 opacity-50">📝</div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                        No Testimonials Available
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Connect to the internet to view testimonials.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg mb-4">No testimonials yet.</p>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => setShowClientForm(true)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base px-8 py-4"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Your Testimonial
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
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

      <AuthRequiredDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        feature="testimonials"
      />
    </>
  );
};

export default TestimonialsViewOnly;
