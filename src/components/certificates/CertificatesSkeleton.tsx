
import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface CertificatesSkeletonProps {
  showNoDataMessage?: boolean;
  isOffline?: boolean;
}

const CertificatesSkeleton = ({ showNoDataMessage = false, isOffline = false }: CertificatesSkeletonProps) => {
  if (showNoDataMessage) {
    return (
      <section id="certificates" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Certificates & Achievements
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              My professional certifications and achievements that validate my expertise and commitment to excellence.
            </p>
          </div>

          <div className="text-center text-slate-600 dark:text-slate-300">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4 opacity-50">🏆</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                {isOffline ? 'No Certificates Available Offline' : 'No Certificates Available'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isOffline 
                  ? 'Connect to the internet to view certificates.'
                  : 'Certificates will appear here once they are added.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Loading skeleton
  return (
    <section id="certificates" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-80 mx-auto mb-6" />
          <div className="space-y-2 max-w-3xl mx-auto">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6 mx-auto" />
          </div>
        </div>

        {/* Certificates grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <Skeleton className="w-full h-48" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSkeleton;
