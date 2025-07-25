import React from 'react';
import { Skeleton } from '../ui/skeleton';

const AboutSectionSkeleton = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left side - Content */}
          <div>
            {/* Title */}
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-48" />
            </div>
            
            {/* Paragraphs */}
            <div className="space-y-4 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Highlights */}
            <div className="mb-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Image Carousel */}
          <div className="relative">
            <div className="relative z-10">
              <Skeleton className="w-full h-96 rounded-2xl" />
              
              {/* Navigation buttons */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="w-2 h-2 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom sections - Hobbies and Things to Do */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hobbies Section */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Things to Do Section */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <Skeleton className="h-6 w-44 mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionSkeleton;