import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AboutCarouselProps {
  images: string[];
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  isFlipping: boolean;
}

const AboutCarousel: React.FC<AboutCarouselProps> = ({
  images,
  currentImageIndex,
  onImageChange,
  isFlipping
}) => {
  const nextImage = () => {
    onImageChange((currentImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    onImageChange(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  };

  // Auto-rotate through images
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, images.length]);

  return (
    <div className="relative group">
      <div className={`aspect-square rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ${isFlipping ? 'scale-95' : 'scale-100'}`}>
        <img
          src={images[currentImageIndex]}
          alt="About Kenneth"
          className="w-full h-full object-cover transition-all duration-700"
          loading="lazy"
        />
      </div>
      
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onImageChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutCarousel;