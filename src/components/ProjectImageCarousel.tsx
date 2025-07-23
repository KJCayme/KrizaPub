
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCarouselImage } from '../utils/imageMap';
import { useCarouselImages } from '../hooks/useCarouselImages';
import ImageCarouselPopup from './ImageCarouselPopup';

interface ProjectImageCarouselProps {
  projectTitle: string;
  mainImage: string;
  projectType?: string;
  projectId?: string;
}

const ProjectImageCarousel = ({ projectTitle, mainImage, projectType = 'general', projectId }: ProjectImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fetch carousel images from database
  const { data: carouselImagesData, isLoading } = useCarouselImages(projectId || '');
  
  // Project-specific image collections based on project type
  const getProjectImages = (type: string) => {
    const imageCollections = {
      admin: [
        'photo-1551836022-deb4988cc6c0', // Office workspace with documents
        'photo-1507003211169-0a1dd7228f2d', // Person working on laptop
        'photo-1586281380349-632531db7ed4', // Digital calendar and planning
        'photo-1551836022-d5d88e9218df', // Business meeting
        'photo-1460925895917-afdab827c52f', // laptop computer on glass-top table
        'photo-1553877522-43269d4ea984', // Office organization
        'photo-1434626881859-194d67b2b86f' // Business documents
      ],
      social: [
        'photo-1611224923853-80b023f02d71', // Social media icons
        'photo-1563986768609-322da13575f3', // Social media marketing
        'photo-1432888622747-4eb9a8efeb07', // Content creation setup
        'photo-1556742049-0cfed4f6a45d', // Instagram on phone
        'photo-1542744094-3a31f272c490', // Social media engagement
        'photo-1551033406-611cf9a28f67', // Digital marketing workspace
        'photo-1512486130939-2c4f79935e4f' // Social media analytics
      ],
      project: [
        'photo-1454165804606-c3d57bc86b40', // Project planning board
        'photo-1553877522-43269d4ea984', // Team collaboration
        'photo-1560472354-b33ff0c44a43', // Gantt charts and planning
        'photo-1507679799987-c73779587ccf', // Business team meeting
        'photo-1556761175-b413da4baf72', // Project management tools
        'photo-1553877522-43269d4ea984', // Workflow organization
        'photo-1552664730-d307ca884978' // Strategic planning
      ],
      design: [
        'photo-1561070791-2526d30994b5', // Design workspace with tools
        'photo-1558655146-9f40138edfeb', // Creative design process
        'photo-1609921141835-710b7fa6e438', // Digital design tools
        'photo-1572044162444-ad60f128bdea', // Color palette and design
        'photo-1541462608143-67571c6738dd', // Graphic design workspace
        'photo-1586717791821-3f44a563fa4c', // Creative brainstorming
        'photo-1626785774625-0b1c2c4eab67' // Design inspiration board
      ],
      copywriting: [
        'photo-1455390582262-044cdead277a', // Writer at work
        'photo-1486312338219-ce68d2c6f44d', // person using MacBook Pro
        'photo-1517077304055-6e89abbf09b0', // Content writing setup
        'photo-1542435503-956c469947f6', // Typewriter and writing
        'photo-1516321318423-f06f85e504b3', // Blog writing workspace
        'photo-1434626881859-194d67b2b86f', // Documents and writing
        'photo-1455390582262-044cdead277a' // Professional writing
      ],
      webdev: [
        'photo-1488590528505-98d2b5aba04b', // turned on gray laptop computer
        'photo-1461749280684-dccba630e2f6', // monitor showing Java programming
        'photo-1486312338219-ce68d2c6f44d', // person using MacBook Pro
        'photo-1487058792275-0ad4aaf24ca7', // Colorful software or web code
        'photo-1498050108023-c5249f4df085', // A MacBook with lines of code
        'photo-1483058712412-4245e9b90334', // silver iMac with keyboard
        'photo-1551288049-bebda4e38f71' // Programming workspace
      ],
      ai: [
        'photo-1677442136019-21780ecad995', // AI and machine learning
        'photo-1485827404703-89b55fcc595e', // Technology and automation
        'photo-1518709268805-4e9042af2176', // AI neural networks
        'photo-1555255707-c07966088b7b', // Robot and AI technology
        'photo-1507146426996-ef05306b995a', // Digital transformation
        'photo-1460925895917-afdab827c52f', // laptop computer on glass-top table
        'photo-1518709268805-4e9042af2176' // AI automation workspace
      ]
    };

    return imageCollections[type] || imageCollections.webdev;
  };

  // Use actual carousel images if available, otherwise fall back to hardcoded images
  const actualCarouselImages = carouselImagesData?.map(img => img.image_url) || [];
  const fallbackImages = getProjectImages(projectType).map(imageId => getCarouselImage(imageId));
  const projectImages = actualCarouselImages.length > 0 ? actualCarouselImages : fallbackImages;

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const imageWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * imageWidth,
        behavior: 'smooth'
      });
    }
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % projectImages.length;
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    scrollToImage(prevIndex);
  };

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const imageWidth = target.clientWidth;
    const newIndex = Math.round(target.scrollLeft / imageWidth);
    setCurrentImageIndex(newIndex);
  };

  if (isLoading) {
    return (
      <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide h-full snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
        >
          {projectImages.map((imageUrl, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 snap-start flex items-center justify-center p-4"
            >
              <div className="w-full h-full overflow-auto rounded-lg bg-white/10 backdrop-blur-sm">
                <img
                  src={imageUrl}
                  alt={`${projectTitle} - Image ${index + 1}`}
                  className="w-full h-auto min-h-full object-contain select-none cursor-pointer transition-opacity hover:opacity-90"
                  onContextMenu={handleContextMenu}
                  draggable={false}
                  onClick={handleImageClick}
                />
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {projectImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <ImageCarouselPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        images={projectImages}
        projectTitle={projectTitle}
        currentIndex={currentImageIndex}
      />
    </>
  );
};

export default ProjectImageCarousel;
