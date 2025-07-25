import React from 'react';
import { Skeleton } from '../ui/skeleton';

const SkillCardSkeleton = () => {
  return (
    <div className="relative group bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-500 dark:shadow-slate-900/50">
      {/* Icon */}
      <Skeleton className="w-16 h-16 rounded-xl mb-6" />

      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-4" />

      {/* Description */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>

      {/* Key Services header */}
      <Skeleton className="h-4 w-24 mb-2" />

      {/* Service list */}
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Skeleton className="w-2 h-2 rounded-full mt-2" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillCardSkeleton;