
import React, { useState } from 'react';
import { Award, ExternalLink, Calendar, Plus, Edit3, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { useCertificates, Certificate } from '../hooks/useCertificates';
import { useAuth } from '../hooks/useAuth';
import AddCertificateForm from './AddCertificateForm';
import EditCertificateForm from './EditCertificateForm';
import AuthRequiredDialog from './auth/AuthRequiredDialog';
import { toast } from 'sonner';

interface CertificatesProps {
  onShowCertificatesOnly: (show: boolean) => void;
}

const Certificates = ({ onShowCertificatesOnly }: CertificatesProps) => {
  const isMobile = useIsMobile();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const { certificates, loading, error, deleteCertificate } = useCertificates(3);
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

  const handleEditCertificate = (certificate: Certificate) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setEditingCertificate(certificate);
    setShowEditForm(true);
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteCertificate(certificateId);
        toast.success('Certificate deleted successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete certificate');
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300">Loading certificates...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6 relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">
                Certificates
              </h2>
              
              {/* Add Certificate Button - Now matching View All Certificates button color */}
              {user && (
                <Button
                  onClick={handleAddCertificate}
                  className="absolute right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Certificate</span>
                </Button>
              )}
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Professional certifications that validate my expertise and commitment to continuous learning
            </p>
          </div>

          {error && (
            <div className="text-center mb-8">
              <p className="text-red-600 dark:text-red-400">Error loading certificates: {error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-8 justify-center mb-12">
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
                    <h3 className={`text-xl font-bold mb-1 ${
                      cert.title_color === 'dark' 
                        ? 'text-slate-900' 
                        : 'text-white'
                    }`}>
                      {cert.name}
                    </h3>
                    <div className={`flex items-center gap-2 text-sm ${
                      cert.title_color === 'dark'
                        ? 'text-slate-700'
                        : 'text-white/90'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>{cert.year}</span>
                    </div>
                  </div>
                  
                  {/* Edit/Delete buttons for authenticated users */}
                  {user && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-none shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCertificate(cert);
                        }}
                      >
                        <Edit3 className="w-4 h-4 text-white" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8 bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 border-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCertificate(cert.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </Button>
                    </div>
                  )}
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

          <div className="text-center">
            <Button
              onClick={() => onShowCertificatesOnly(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Certificates
            </Button>
          </div>
        </div>
      </section>

      <AddCertificateForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
      />

      {editingCertificate && (
        <EditCertificateForm
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setEditingCertificate(null);
          }}
          certificate={editingCertificate}
        />
      )}

      <AuthRequiredDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        feature="certificates"
      />
    </>
  );
};

export default Certificates;
