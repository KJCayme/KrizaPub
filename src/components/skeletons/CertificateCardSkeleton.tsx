import React from 'react';
import { Skeleton } from '../ui/skeleton';

const CertificateCardSkeleton = () => {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col w-full max-w-sm flex-shrink-0">
      {/* Image placeholder */}
      <div className="h-48 relative overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Icon overlay */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        
        {/* Bottom overlay content */}
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="h-6 w-3/4 mb-2 bg-white/20" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded bg-white/20" />
            <Skeleton className="h-4 w-16 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Issuer */}
          <div className="mb-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Skills */}
          <div className="mb-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default CertificateCardSkeleton;