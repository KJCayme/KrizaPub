
import React, { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useCarouselImages } from '../hooks/useCarouselImages';
import { getCarouselImage } from '../utils/imageMap';
import DeviceContainer from './funnel/DeviceContainer';
import DeviceSelector from './funnel/DeviceSelector';
import ProjectInfoSection from './funnel/ProjectInfoSection';
import type { Project } from '../hooks/useProjects';

interface FunnelProjectDetailsProps {
  project: Project;
  onBack: () => void;
  source?: 'section' | 'view-only';
}

const FunnelProjectDetails = ({ project, onBack, source = 'section' }: FunnelProjectDetailsProps) => {
  const isMobile = useIsMobile();
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  const { data: carouselImages = [] } = useCarouselImages(project.id);

  useEffect(() => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  const showBackButton = !isMobile && (source === 'view-only' || source === 'section');

  const displayImage = carouselImages.length > 0 
    ? getCarouselImage(carouselImages[0].image_url)
    : project.image;

  return (
    <div className="max-w-7xl mx-auto relative z-20 w-full">
      {showBackButton && (
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-30 p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 min-h-[600px]">
          <div className="order-2 lg:order-1 flex flex-col justify-center items-center h-full">
            <DeviceContainer
              deviceType={selectedDevice}
              displayImage={displayImage}
              projectTitle={project.title}
            />
          </div>

          <div className="order-1 lg:order-2">
            <ProjectInfoSection project={project} />
            
            <div className="mt-6">
              <DeviceSelector
                selectedDevice={selectedDevice}
                onDeviceChange={setSelectedDevice}
              />
            </div>

            {/* Live View Button - moved to right column */}
            {project.link && (
              <div className="mt-6">
                <button
                  onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scrollLoop {
            0% { transform: translateY(0); }
            15% { transform: translateY(0); }
            35% { transform: translateY(-50%); }
            50% { transform: translateY(-50%); }
            65% { transform: translateY(-50%); }
            85% { transform: translateY(0); }
            100% { transform: translateY(0); }
          }
        `
      }} />
    </div>
  );
};

export default FunnelProjectDetails;
