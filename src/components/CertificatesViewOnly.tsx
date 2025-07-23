
import React from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import { CertificatesViewOnlyHeader } from './certificates/CertificatesViewOnlyHeader';
import { CertificatesViewOnlyGrid } from './certificates/CertificatesViewOnlyGrid';

export const CertificatesViewOnly = () => {
  const { certificates, isLoading } = useCertificates();

  const handleBack = () => {
    // Navigate back to portfolio and scroll to certificates section
    window.history.pushState({}, '', '/');
    
    // Use a timeout to ensure the DOM is ready
    setTimeout(() => {
      const certificatesSection = document.getElementById('certificates');
      if (certificatesSection) {
        certificatesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CertificatesViewOnlyHeader onBack={handleBack} />
      <CertificatesViewOnlyGrid certificates={certificates || []} />
    </div>
  );
};
