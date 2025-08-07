
import React from 'react';
import { handleBookCall } from '../../utils/bookCall';

interface BookCallButtonProps {
  isMobile?: boolean;
  isVisible: boolean;
}

const BookCallButton = ({ isMobile = false, isVisible }: BookCallButtonProps) => {
  if (!isVisible) return null;

  if (isMobile) {
    return (
      <button
        onClick={handleBookCall}
        className="md:hidden px-4 py-2 bg-gradient-to-r from-nav-button-start to-nav-button-end text-white font-semibold rounded-full text-sm"
      >
        Book a Call
      </button>
    );
  }

  return (
    <div className="hidden md:flex items-center">
      <button
        onClick={handleBookCall}
        className="px-6 py-2 bg-gradient-to-r from-nav-button-start to-nav-button-end text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
      >
        Book a Call
      </button>
    </div>
  );
};

export default BookCallButton;
