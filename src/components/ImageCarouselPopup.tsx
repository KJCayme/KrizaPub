
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import { ScrollArea } from './ui/scroll-area';

interface ImageCarouselPopupProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  projectTitle: string;
  currentIndex: number;
}

const ImageCarouselPopup: React.FC<ImageCarouselPopupProps> = ({
  isOpen,
  onClose,
  images,
  projectTitle,
  currentIndex
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [api, setApi] = useState<any>();

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // Hide/show navbar when popup opens/closes
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (isOpen) {
      if (navbar) navbar.style.display = 'none';
    } else {
      if (navbar) navbar.style.display = '';
    }

    // Cleanup function to ensure navbar is shown when component unmounts
    return () => {
      if (navbar) navbar.style.display = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!api) return;

    api.scrollTo(activeIndex);
    
    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex]);

  const goToPrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
    api?.scrollTo(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    api?.scrollTo(newIndex);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen">
      {/* Full viewport overlay */}
      <div 
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />
      
      {/* Scrollable content container */}
      <ScrollArea className="h-full w-full">
        <div className="min-h-screen flex items-center justify-center p-4 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close image popup"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Top-right button (same column as right navigation) */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-20 z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            aria-label="More options"
          >
            <MoreVertical className="w-6 h-6" />
          </button>

          {/* Main Image Area - contained and responsive */}
          <div className="w-full max-w-6xl mx-auto">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {images.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center relative p-4">
                      <img
                        src={imageUrl}
                        alt={`${projectTitle} - Image ${index + 1}`}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      {/* Image counter */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                        {activeIndex + 1} / {images.length}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Navigation arrows - only show on desktop and if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 hidden lg:block"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 hidden lg:block"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImageCarouselPopup;
