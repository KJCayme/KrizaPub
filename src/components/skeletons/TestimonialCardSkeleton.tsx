import React from 'react';
import { Skeleton } from '../ui/skeleton';

const TestimonialCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-all duration-300">
      {/* Header with stars and rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-5 h-5 rounded" />
          ))}
        </div>
        <Skeleton className="h-6 w-12" />
      </div>

      {/* Quote and feedback */}
      <div className="mb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Client info */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCardSkeleton;