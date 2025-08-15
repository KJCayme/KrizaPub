
import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, ArrowLeft, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { useCertificates } from '../hooks/useCertificates';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import AddCertificateForm from './AddCertificateForm';
import AuthRequiredDialog from './auth/AuthRequiredDialog';

interface CertificatesViewOnlyProps {
  onBack: () => void;
}

const CertificatesViewOnly = ({ onBack }: CertificatesViewOnlyProps) => {
  const isMobile = useIsMobile();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const { certificates, loading, error } = useCertificates();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleBack = () => {
    onBack();
    // Use a more reliable approach to scroll to certificates section
    setTimeout(() => {
      const element = document.getElementById('certificates');
      if (element) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ 
          top: elementTop - 80, // Account for fixed navigation
          behavior: 'smooth' 
        });
      }
    }, 100);
  };

  const handleViewCertificate = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const handleAddCertificate = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Button onClick={handleBack} variant="ghost" className="text-white hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </nav>
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <p className="text-slate-600 dark:text-slate-300">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
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
                <h1 className="text-2xl font-bold text-white">Certificates</h1>
                {/* Add Certificate Button - Only show when user is signed in */}
                {user && (
                  <Button
                    onClick={handleAddCertificate}
                    variant="ghost"
                    className="text-white hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Certificate
                  </Button>
                )}
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
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">
                    All Certificates
                  </h2>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                  Professional certifications and continuous learning achievements that validate my expertise 
                  and commitment to staying current with industry standards.
                </p>
              </div>

              {error && (
                <div className="text-center mb-8">
                  <p className="text-red-600 dark:text-red-400">Error loading certificates: {error}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-8 justify-center">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col w-full max-w-sm flex-shrink-0 ${
                      isMobile ? '' : 'hover:shadow-xl transform hover:-translate-y-2'
                    }`}
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={cert.certificate_image_card}
                        alt={cert.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {cert.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{cert.year}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            Issued by {cert.issued_by}
                          </div>
                          {cert.caption && (
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                              {cert.caption}
                            </p>
                          )}
                        </div>

                        {cert.skills_covered.length > 0 && (
                          <div className="mb-6">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Skills Covered:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {cert.skills_covered.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleViewCertificate(cert.link || '')}
                          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                            isMobile ? '' : 'group-hover:scale-105'
                          } ${
                            cert.link
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                              : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                          }`}
                          disabled={!cert.link}
                        >
                          <span>{cert.link ? 'View Certificate' : 'Certificate Available'}</span>
                          {cert.link && <ExternalLink className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <div className="bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                    Committed to Continuous Learning
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                    These certifications represent my dedication to staying current with industry trends 
                    and continuously expanding my skill set to deliver the best results for my clients.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Industry Recognized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Regularly Updated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AddCertificateForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
      />

      <AuthRequiredDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        feature="certificates"
      />
    </>
  );
};

export default CertificatesViewOnly;
