
import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import type { Certificate } from '../../hooks/useCertificates';

interface CertificatesViewOnlyGridProps {
  certificates: Certificate[];
  onViewCertificate: (url: string) => void;
}

const CertificatesViewOnlyGrid = ({ certificates, onViewCertificate }: CertificatesViewOnlyGridProps) => {
  const isMobile = useIsMobile();

  return (
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
                onClick={() => onViewCertificate(cert.link || '')}
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
  );
};

export default CertificatesViewOnlyGrid;
