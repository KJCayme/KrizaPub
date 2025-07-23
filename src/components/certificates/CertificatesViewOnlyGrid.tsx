
import React from 'react';
import CertificateCard from './CertificateCard';
import { Certificate } from '@/hooks/useCertificates';

interface CertificatesViewOnlyGridProps {
  certificates: Certificate[];
}

export const CertificatesViewOnlyGrid = ({ certificates }: CertificatesViewOnlyGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} />
      ))}
    </div>
  );
};
