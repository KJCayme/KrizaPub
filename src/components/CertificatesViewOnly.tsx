
import React, { useState } from 'react';
import { Award, Calendar } from 'lucide-react';
import { useCertificates } from '../hooks/useCertificates';
import { useAuth } from '../hooks/useAuth';
import AddCertificateForm from './AddCertificateForm';
import AuthRequiredDialog from './auth/AuthRequiredDialog';
import CertificatesViewOnlyNav from './certificates/CertificatesViewOnlyNav';
import CertificatesViewOnlyGrid from './certificates/CertificatesViewOnlyGrid';

interface CertificatesViewOnlyProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

const CertificatesViewOnly = ({ isDarkMode, onToggleDarkMode, onBack }: CertificatesViewOnlyProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const { certificates, loading, error } = useCertificates();
  const { user } = useAuth();

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
        <CertificatesViewOnlyNav 
          onBack={onBack}
          onToggleDarkMode={onToggleDarkMode}
          onAddCertificate={handleAddCertificate}
          isDarkMode={isDarkMode}
          user={user}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <p className="text-slate-600 dark:text-slate-300">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <CertificatesViewOnlyNav 
          onBack={onBack}
          onToggleDarkMode={onToggleDarkMode}
          onAddCertificate={handleAddCertificate}
          isDarkMode={isDarkMode}
          user={user}
        />

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

              <CertificatesViewOnlyGrid 
                certificates={certificates} 
                onViewCertificate={handleViewCertificate}
              />

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
