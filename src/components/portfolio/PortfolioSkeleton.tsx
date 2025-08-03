
import React, { forwardRef } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useIsMobile } from '../../hooks/use-mobile';
import { Plus } from 'lucide-react';

interface PortfolioSkeletonProps {
  categories?: Array<{ id: string; name: string; badge?: string; hidden?: boolean }>;
  activeCategory?: string;
}

const PortfolioSkeleton = forwardRef<HTMLElement, PortfolioSkeletonProps>(({ categories = [], activeCategory }, ref) => {
  const isMobile = useIsMobile();

  // Create skeleton for 4 projects (matching the typical first category load)
  const skeletonProjects = Array.from({ length: 4 }, (_, index) => (
    <div
      key={index}
      className={`flex-shrink-0 ${
        isMobile ? 'w-80' : 'w-96'
      }`}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
        {/* Project Image Skeleton */}
        <div className="relative h-56 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Project Content Skeleton */}
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            {/* Icon and Duration */}
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Title */}
            <Skeleton className="h-6 w-3/4 mb-3" />

            {/* Description */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Results Box */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-18 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section ref={ref} id="portfolio" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 relative">
          {/* Header Skeleton */}
          <div className="space-y-4 mb-8">
            <Skeleton className="h-10 md:h-12 lg:h-14 w-64 mx-auto" />
            <div className="space-y-2 max-w-3xl mx-auto">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6 mx-auto" />
              <Skeleton className="h-5 w-4/5 mx-auto" />
            </div>
          </div>

          {/* Category Filter - Desktop only */}
          <div className="hidden md:flex flex-wrap justify-center gap-4 items-center">
            {categories.length > 0 ? (
              <>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    } ${category.hidden ? 'opacity-60' : ''}`}
                    disabled
                  >
                    {category.name}
                    {category.badge && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {category.badge}
                      </span>
                    )}
                  </button>
                ))}
                <Skeleton className="w-12 h-12 rounded-full" />
              </>
            ) : (
              Array.from({ length: 6 }, (_, index) => (
                <Skeleton 
                  key={index}
                  className="h-12 w-32 rounded-full"
                />
              ))
            )}
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="relative">
          {/* Navigation Arrows Skeleton - Desktop */}
          {!isMobile && (
            <>
              <Skeleton className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full" />
              <Skeleton className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full" />
            </>
          )}

          {/* Projects Container */}
          <div 
            className={`flex gap-6 overflow-x-auto scrollbar-hide ${
              isMobile ? 'px-4' : 'px-12'
            }`}
          >
            {skeletonProjects}
          </div>
        </div>

        {/* See More Button Skeleton */}
        <div className="text-center mt-12">
          <Skeleton className="h-12 w-48 rounded-full mx-auto" />
        </div>

        {/* Call to Action Skeleton */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8">
            <Skeleton className="h-6 md:h-8 w-80 mx-auto mb-4 bg-white/20" />
            <div className="space-y-2 mb-6 max-w-2xl mx-auto">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 mx-auto bg-white/20" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-32 rounded-full bg-white/20" />
              <Skeleton className="h-12 w-32 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

PortfolioSkeleton.displayName = 'PortfolioSkeleton';

export default PortfolioSkeleton;
