
import React, { useState } from 'react';
import { ArrowLeft, Plus, Code } from 'lucide-react';
import { Button } from './ui/button';
import { useTestimonials } from '../hooks/useTestimonials';
import { useAuth } from '../hooks/useAuth';
import { useGenerateCode } from '../hooks/useClientTestimonials';
import AddTestimonialForm from './AddTestimonialForm';
import AddClientTestimonialForm from './AddClientTestimonialForm';
import CodeGenerationPopup from './CodeGenerationPopup';
import TestimonialsHeader from './testimonials/TestimonialsHeader';
import TestimonialsGrid from './testimonials/TestimonialsGrid';
import AuthRequiredDialog from './auth/AuthRequiredDialog';

interface TestimonialsViewOnlyProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

const TestimonialsViewOnly = ({ isDarkMode, onToggleDarkMode, onBack }: TestimonialsViewOnlyProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const { data: testimonials = [], isLoading } = useTestimonials();
  const { user } = useAuth();
  const generateCode = useGenerateCode();

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
                onClick={onToggleDarkMode}
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

              <TestimonialsGrid testimonials={testimonials} isLoading={isLoading} />

              {!isLoading && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => setShowClientForm(true)}
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Client Testimonial
                  </Button>
                </div>
              )}

              {!isLoading && testimonials.length === 0 && (
                <div className="text-center text-slate-600 dark:text-slate-300">
                  <p className="text-lg mb-4">No testimonials yet.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleAddTestimonial}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Be the First to Add a Testimonial
                    </Button>
                    <Button
                      onClick={() => setShowClientForm(true)}
                      variant="outline"
                      className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Client Testimonial
                    </Button>
                  </div>
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
