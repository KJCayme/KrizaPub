
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
  images?: Array<{ url: string; alt?: string }>;
  currentIndex?: number;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  isOpen,
  onClose,
  imageUrl,
  altText = '',
  images = [],
  currentIndex = 0
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [currentImage, setCurrentImage] = useState(imageUrl);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
    setCurrentImage(imageUrl);
  }, [currentIndex, imageUrl]);

  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    if (hasMultipleImages) {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      setCurrentImageIndex(newIndex);
      setCurrentImage(images[newIndex].url);
    }
  };

  const goToNext = () => {
    if (hasMultipleImages) {
      const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setCurrentImage(images[newIndex].url);
    }
  };

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
  }, [isOpen, currentImageIndex, hasMultipleImages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex items-center justify-center" style={{ paddingTop: '2vh' }}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[70] text-white hover:text-gray-300 transition-colors"
        aria-label="Close image popup"
        style={{ top: 'calc(2vh + 1rem)' }}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation sidebar - only show if multiple images */}
      {hasMultipleImages && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] flex flex-col gap-2">
          <button
            onClick={goToPrevious}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>
          
          <button
            onClick={goToNext}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main image */}
      <div className="flex items-center justify-center w-full h-full p-4">
        <img
          src={currentImage}
          alt={images[currentImageIndex]?.alt || altText}
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

export default ImagePopup;
