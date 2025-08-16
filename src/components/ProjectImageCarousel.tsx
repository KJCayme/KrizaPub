
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

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  thumbnailUrl?: string;
};

const ProjectImageCarousel = ({ projectTitle, mainImage, projectType = 'general', projectId }: ProjectImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupStartIndex, setPopupStartIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fetch carousel images from database
  const { data: carouselImagesData, isLoading } = useCarouselImages(projectId || '');
  
  // Project-specific image collections based on project type
  const getProjectImages = (type: string) => {
    const imageCollections = {
      admin: [
        'photo-1551836022-deb4988cc6c0',
        'photo-1507003211169-0a1dd7228f2d',
        'photo-1586281380349-632531db7ed4',
        'photo-1551836022-d5d88e9218df',
        'photo-1460925895917-afdab827c52f',
        'photo-1553877522-43269d4ea984',
        'photo-1434626881859-194d67b2b86f'
      ],
      social: [
        'photo-1611224923853-80b023f02d71',
        'photo-1563986768609-322da13575f3',
        'photo-1432888622747-4eb9a8efeb07',
        'photo-1556742049-0cfed4f6a45d',
        'photo-1542744094-3a31f272c490',
        'photo-1551033406-611cf9a28f67',
        'photo-1512486130939-2c4f79935e4f'
      ],
      project: [
        'photo-1454165804606-c3d57bc86b40',
        'photo-1553877522-43269d4ea984',
        'photo-1560472354-b33ff0c44a43',
        'photo-1507679799987-c73779587ccf',
        'photo-1556761175-b413da4baf72',
        'photo-1553877522-43269d4ea984',
        'photo-1552664730-d307ca884978'
      ],
      design: [
        'photo-1561070791-2526d30994b5',
        'photo-1558655146-9f40138edfeb',
        'photo-1609921141835-710b7fa6e438',
        'photo-1572044162444-ad60f128bdea',
        'photo-1541462608143-67571c6738dd',
        'photo-1586717791821-3f44a563fa4c',
        'photo-1626785774625-0b1c2c4eab67'
      ],
      copywriting: [
        'photo-1455390582262-044cdead277a',
        'photo-1486312338219-ce68d2c6f44d',
        'photo-1517077304055-6e89abbf09b0',
        'photo-1542435503-956c469947f6',
        'photo-1516321318423-f06f85e504b3',
        'photo-1434626881859-194d67b2b86f',
        'photo-1455390582262-044cdead277a'
      ],
      webdev: [
        'photo-1488590528505-98d2b5aba04b',
        'photo-1461749280684-dccba630e2f6',
        'photo-1486312338219-ce68d2c6f44d',
        'photo-1487058792275-0ad4aaf24ca7',
        'photo-1498050108023-c5249f4df085',
        'photo-1483058712412-4245e9b90334',
        'photo-1551288049-bebda4e38f71'
      ],
      ai: [
        'photo-1677442136019-21780ecad995',
        'photo-1485827404703-89b55fcc595e',
        'photo-1518709268805-4e9042af2176',
        'photo-1555255707-c07966088b7b',
        'photo-1507146426996-ef05306b995a',
        'photo-1460925895917-afdab827c52f',
        'photo-1518709268805-4e9042af2176'
      ]
    };

    return imageCollections[type] || imageCollections.webdev;
  };

  // Build media from database; fallback to images if none
  const actualCarouselMedia: MediaItem[] = (carouselImagesData || []).map((img: any) => ({
    type: img.media_type === 'video' ? 'video' : 'image',
    url: img.image_url,
    alt: img.alt_text || undefined,
    thumbnailUrl: img.video_thumbnail_url || undefined,
  }));

  const fallbackImages = getProjectImages(projectType).map((imageId) => ({
    type: 'image' as const,
    url: getCarouselImage(imageId),
    alt: `${projectTitle} - Image`,
  }));

  const projectMedia: MediaItem[] = actualCarouselMedia.length > 0 ? actualCarouselMedia : fallbackImages;

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
    const nextIndex = (currentImageIndex + 1) % projectMedia.length;
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + projectMedia.length) % projectMedia.length;
    scrollToImage(prevIndex);
  };

  const handleImageClick = () => {
    console.log('Opening popup with current index:', currentImageIndex);
    setPopupStartIndex(currentImageIndex);
    setIsPopupOpen(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const imageWidth = target.clientWidth;
    const scrollLeft = target.scrollLeft;
    const newIndex = Math.round(scrollLeft / imageWidth);
    
    // Only update if the index actually changed and is valid
    if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < projectMedia.length) {
      console.log('Scroll update: changing index from', currentImageIndex, 'to', newIndex);
      setCurrentImageIndex(newIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderMediaPreview = (item: MediaItem, index: number) => {
    if (item.type === 'image') {
      return (
        <img
          src={item.url}
          alt={item.alt || `${projectTitle} - Image ${index + 1}`}
          className="w-full h-auto min-h-full object-contain select-none cursor-pointer transition-opacity hover:opacity-90"
          onContextMenu={handleContextMenu}
          draggable={false}
          onClick={handleImageClick}
        />
      );
    }

    // Video: prefer thumbnail in card view, fall back to a muted video preview
    if (item.thumbnailUrl) {
      return (
        <img
          src={item.thumbnailUrl}
          alt={item.alt || `${projectTitle} - Video ${index + 1}`}
          className="w-full h-auto min-h-full object-contain select-none cursor-pointer transition-opacity hover:opacity-90"
          onContextMenu={handleContextMenu}
          draggable={false}
          onClick={handleImageClick}
        />
      );
    }

    return (
      <video
        src={item.url}
        className="w-full h-auto min-h-full object-contain select-none cursor-pointer transition-opacity hover:opacity-90"
        muted
        playsInline
        onClick={handleImageClick}
        onContextMenu={handleContextMenu}
      />
    );
  };

  return (
    <>
      <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide h-full snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
        >
          {projectMedia.map((item, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 snap-start flex items-center justify-center p-4"
            >
              <div className="w-full h-full overflow-auto rounded-lg bg-white/10 backdrop-blur-sm">
                {renderMediaPreview(item, index)}
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
          {projectMedia.map((_, index) => (
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
        media={projectMedia}
        projectTitle={projectTitle}
        currentIndex={popupStartIndex}
      />
    </>
  );
};

export default ProjectImageCarousel;
