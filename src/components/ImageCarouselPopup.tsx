
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const showPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const showNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
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

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[10001] text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-black/30 hover:bg-black/50"
        aria-label="Close image popup"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation - Left side */}
      {images.length > 1 && (
        <button
          onClick={showPrev}
          className="absolute left-0 top-0 bottom-0 w-16 z-[10001] bg-transparent hover:bg-black/10 transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Previous image"
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
        </button>
      )}

      {/* Navigation - Right side */}
      {images.length > 1 && (
        <button
          onClick={showNext}
          className="absolute right-0 top-0 bottom-0 w-16 z-[10001] bg-transparent hover:bg-black/10 transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Next image"
          disabled={activeIndex === images.length - 1}
        >
          <ChevronRight className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
        </button>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10001] bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Main image */}
      <div className="flex items-center justify-center w-full h-full p-8">
        <img
          src={images[activeIndex]}
          alt={`${projectTitle} - Image ${activeIndex + 1}`}
          className="max-w-[calc(100vw-128px)] max-h-[calc(100vh-64px)] object-contain select-none"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 z-[10000]"
        onClick={onClose}
      />
    </div>
  );
};

export default ImageCarouselPopup;
