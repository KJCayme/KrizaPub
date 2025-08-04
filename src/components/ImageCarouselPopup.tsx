
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

  if (!images.length) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[70] text-white hover:text-gray-300 transition-colors"
        aria-label="Close image popup"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation sidebar */}
      {images.length > 1 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] flex flex-col gap-2">
          <button
            onClick={showPrev}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Previous image"
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-full text-sm font-medium">
            {activeIndex + 1} / {images.length}
          </div>
          
          <button
            onClick={showNext}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Next image"
            disabled={activeIndex === images.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main image */}
      <div className="flex items-center justify-center w-full h-full p-4">
        <img
          src={images[activeIndex]}
          alt={`${projectTitle} - Image ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 z-[65]"
        onClick={onClose}
      />
    </div>
  );
};

export default ImageCarouselPopup;
