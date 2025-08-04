
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { cn } from '@/lib/utils';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-screen-xl w-full h-[90vh] bg-black p-0 flex items-center justify-center relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Prev Button */}
        {activeIndex > 0 && (
          <button
            onClick={showPrev}
            className="absolute left-4 z-50 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Next Button */}
        {activeIndex < images.length - 1 && (
          <button
            onClick={showNext}
            className="absolute right-4 z-50 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Image */}
        <div className="relative w-full h-full max-h-full flex items-center justify-center">
          <img
            src={images[activeIndex]}
            alt={`${projectTitle} - Image ${activeIndex + 1}`}
            className="object-contain max-h-full max-w-full"
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarouselPopup;
