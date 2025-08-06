
import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface TestimonialsSkeletonProps {
  showNoDataMessage?: boolean;
  isOffline?: boolean;
}

const TestimonialsSkeleton = ({ showNoDataMessage = false, isOffline = false }: TestimonialsSkeletonProps) => {
  if (showNoDataMessage) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              What Clients Say
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Don't just take my word for it. Here's what my clients have to say about working with me and the results we've achieved together.
            </p>
          </div>

          <div className="text-center text-slate-600 dark:text-slate-300">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4 opacity-50">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
                {isOffline ? 'No Testimonials Available Offline' : 'No Testimonials Available'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isOffline 
                  ? 'Connect to the internet to view testimonials.'
                  : 'Testimonials will appear here once they are added.'
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
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <Skeleton className="h-12 w-64" />
            <div className="flex-1"></div>
          </div>
          <div className="space-y-2 max-w-3xl mx-auto">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6 mx-auto" />
          </div>
        </div>

        {/* Testimonials grid skeleton */}
        <div className="block">
          {/* Mobile: Single column layout */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Skeleton key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Masonry layout */}
          <div 
            className="hidden md:block"
            style={{ 
              columnCount: 2,
              columnGap: '24px',
              columnFill: 'balance'
            }}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div 
                key={index}
                style={{ 
                  breakInside: 'avoid',
                  marginBottom: '24px',
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Skeleton key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    {index % 2 === 0 && <Skeleton className="h-4 w-3/4" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSkeleton;
