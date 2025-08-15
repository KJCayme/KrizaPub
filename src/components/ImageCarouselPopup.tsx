
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsTablet } from '@/hooks/use-tablet';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = !isMobile && !isTablet;

  // Update activeIndex when currentIndex changes and set initial scroll position
  useEffect(() => {
    if (isOpen) {
      console.log('Popup opened with currentIndex:', currentIndex);
      setActiveIndex(currentIndex);
      
      // Set initial scroll position immediately without animation
      if (scrollContainerRef.current) {
        const imageWidth = scrollContainerRef.current.clientWidth;
        console.log('Setting initial scroll position to image', currentIndex, 'with width', imageWidth);
        scrollContainerRef.current.scrollLeft = currentIndex * imageWidth;
      }
    }
  }, [currentIndex, isOpen]);

  const showPrev = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
    scrollToImage(newIndex);
  };

  const showNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    scrollToImage(newIndex);
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const imageWidth = scrollContainerRef.current.clientWidth;
      console.log('Scrolling to image', index, 'with width', imageWidth);
      scrollContainerRef.current.scrollTo({
        left: index * imageWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const imageWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / imageWidth);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      console.log('Popup scroll update: changing index from', activeIndex, 'to', newIndex);
      setActiveIndex(newIndex);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Hide navbar when popup is open
  useEffect(() => {
    if (isOpen) {
      // Hide navbar
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = 'none';
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Show navbar
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = '';
      }
      // Re-enable body scroll
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!images.length) return null;

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[10002] text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/30 hover:bg-black/50"
        aria-label="Close image popup"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Desktop Navigation Buttons */}
      {isDesktop && images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000] text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/30 hover:bg-black/50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000] text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/30 hover:bg-black/50"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10001] bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image container with scroll */}
      <div className="flex items-center justify-center w-full h-full p-8">
        <div 
          ref={scrollContainerRef}
          className="carousel-scroll-container flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory w-full h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((image, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full flex items-center justify-center snap-center">
              <img
                src={image}
                alt={`${projectTitle} - Image ${index + 1}`}
                className="max-w-[calc(100vw-128px)] max-h-[calc(100vh-64px)] object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageCarouselPopup;
