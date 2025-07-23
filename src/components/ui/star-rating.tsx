
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  allowHalf?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  allowHalf = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starValue: number, isHalf: boolean = false) => {
    const newRating = isHalf ? starValue - 0.5 : starValue;
    onRatingChange(newRating);
  };

  const handleStarHover = (starValue: number, isHalf: boolean = false) => {
    const newHoverRating = isHalf ? starValue - 0.5 : starValue;
    setHoverRating(newHoverRating);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      const isFull = displayRating >= i;
      const isHalf = displayRating >= i - 0.5 && displayRating < i;
      
      stars.push(
        <div key={i} className="relative inline-block">
          {/* Full star clickable area */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full z-20"
            onClick={() => handleStarClick(i, false)}
            onMouseEnter={() => handleStarHover(i, false)}
            onMouseLeave={() => setHoverRating(0)}
          />
          
          {/* Half star clickable area (only if allowHalf is true) */}
          {allowHalf && (
            <button
              type="button"
              className="absolute inset-0 w-1/2 h-full z-30"
              onClick={() => handleStarClick(i, true)}
              onMouseEnter={() => handleStarHover(i, true)}
              onMouseLeave={() => setHoverRating(0)}
            />
          )}
          
          {/* Star background */}
          <Star className={`${sizeClasses[size]} text-gray-300`} />
          
          {/* Star fill */}
          <div className="absolute inset-0 overflow-hidden">
            <Star
              className={`${sizeClasses[size]} ${isFull ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              style={{
                clipPath: isHalf && !isFull ? 'inset(0 50% 0 0)' : 'none'
              }}
            />
            {isHalf && !isFull && allowHalf && (
              <Star
                className={`absolute inset-0 ${sizeClasses[size]} text-yellow-400 fill-yellow-400`}
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
            )}
          </div>
        </div>
      );
    }

    return stars;
  };

  return (
    <div className="flex gap-1 items-center">
      {renderStars()}
      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
        {rating} {rating === 1 ? 'star' : 'stars'}
      </span>
    </div>
  );
};
