
import React from 'react';
import { CertificateCard } from './CertificateCard';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date_issued: string;
  image_url?: string;
  description?: string;
}

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
