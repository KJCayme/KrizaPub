
import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

interface Certificate {
  id: string;
  name: string;
  year: string;
  issued_by: string;
  caption?: string;
  link?: string;
  skills_covered: string[];
  certificate_image_card: string;
  title_color?: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onViewCertificate: (url: string) => void;
  isMobile: boolean;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onViewCertificate,
  isMobile
}) => {
  return (
    <div
      className={`flex-shrink-0 w-80 group bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col ${
        isMobile ? '' : 'hover:shadow-xl hover:-translate-y-2'
      }`}
      style={{ minHeight: '520px' }}
    >
      {/* Header with background image - Fixed height */}
      <div className="h-48 relative overflow-hidden flex-shrink-0">
        <img
          src={certificate.certificate_image_card}
          alt={certificate.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - flexible to push buttons to bottom */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and Year */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-2 ${
            certificate.title_color === 'dark' 
              ? 'text-slate-900 dark:text-slate-100' 
              : 'text-white dark:text-white'
          }`}>
            {certificate.name}
          </h3>
          <div className={`flex items-center gap-2 text-sm ${
            certificate.title_color === 'dark'
              ? 'text-slate-700 dark:text-slate-300'
              : 'text-white/90 dark:text-white/90'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>{certificate.year}</span>
          </div>
        </div>

        <div className="flex-grow">
          <div className="mb-4">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Issued by {certificate.issued_by}
            </div>
            {certificate.caption && (
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {certificate.caption}
              </p>
            )}
          </div>

          {/* Skills */}
          {certificate.skills_covered.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Skills Covered:
              </div>
              <div className="flex flex-wrap gap-2">
                {certificate.skills_covered.map((skill, index) => (
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

        {/* Button - pushed to bottom */}
        <div className="mt-auto">
          <button
            onClick={() => onViewCertificate(certificate.link || '')}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isMobile ? '' : 'group-hover:scale-105'
            } ${
              certificate.link
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
            disabled={!certificate.link}
          >
            <span>{certificate.link ? 'View Certificate' : 'Certificate Available'}</span>
            {certificate.link && <ExternalLink className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
