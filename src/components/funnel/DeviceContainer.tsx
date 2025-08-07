
import React from 'react';
import { getCarouselImage } from '../../utils/imageMap';

interface DeviceContainerProps {
  deviceType: 'desktop' | 'tablet' | 'mobile';
  displayImage: string;
  projectTitle: string;
}

const DeviceContainer = ({ deviceType, displayImage, projectTitle }: DeviceContainerProps) => {
  const renderDesktopContainer = () => (
    <div className="relative bg-funnel-container-bg rounded-lg p-6 shadow-2xl w-full max-w-6xl h-[500px]">
      <div className="bg-funnel-screen-bg rounded-md overflow-hidden relative h-full">
        <div className="w-full h-full overflow-hidden">
          <div className="animate-[scrollLoop_10s_ease-in-out_infinite] hover:[animation-play-state:paused]">
            <img
              src={displayImage}
              alt={projectTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabletContainer = () => (
    <div className="relative bg-funnel-container-bg-dark rounded-2xl p-3 shadow-2xl w-full max-w-2xl">
      <div className="w-full bg-funnel-screen-bg rounded-xl overflow-hidden relative h-[600px]">
        <div className="w-full h-full overflow-hidden">
          <div className="animate-[scrollLoop_10s_ease-in-out_infinite] hover:[animation-play-state:paused]">
            <img
              src={displayImage}
              alt={projectTitle}
              className="w-full h-auto object-cover"
              style={{ minHeight: '200%' }}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-funnel-container-bg rounded-full border-2 border-nav-border"></div>
    </div>
  );

  const renderMobileContainer = () => (
    <div className="relative bg-funnel-container-bg-dark rounded-3xl p-2 shadow-2xl w-full max-w-sm h-[550px]">
      <div className="w-full h-full bg-funnel-screen-bg rounded-3xl overflow-hidden relative">
        <div className="w-full h-full overflow-hidden">
          <div className="animate-[scrollLoop_10s_ease-in-out_infinite] hover:[animation-play-state:paused]">
            <img
              src={displayImage}
              alt={projectTitle}
              className="w-full h-auto object-cover"
              style={{ minHeight: '200%' }}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-nav-text rounded-full"></div>
    </div>
  );

  switch (deviceType) {
    case 'desktop':
      return renderDesktopContainer();
    case 'tablet':
      return renderTabletContainer();
    case 'mobile':
      return renderMobileContainer();
    default:
      return renderMobileContainer();
  }
};

export default DeviceContainer;
