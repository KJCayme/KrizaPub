import React from 'react';
import { Award, Clock, Heart, Target } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

interface Highlight {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface AboutHighlightsProps {
  highlights: Highlight[];
  hasIntersected: boolean;
}

const AboutHighlights: React.FC<AboutHighlightsProps> = ({ highlights, hasIntersected }) => {
  const defaultHighlights = [
    {
      id: 1,
      icon: 'Award',
      title: 'Quality Work',
      description: 'Delivering excellence in every project with attention to detail and professional standards.'
    },
    {
      id: 2,
      icon: 'Clock',
      title: 'Timely Delivery',
      description: 'Meeting deadlines consistently while maintaining high-quality output and client satisfaction.'
    },
    {
      id: 3,
      icon: 'Heart',
      title: 'Passionate',
      description: 'Bringing enthusiasm and dedication to every task, ensuring the best possible outcomes.'
    },
    {
      id: 4,
      icon: 'Target',
      title: 'Results-Driven',
      description: 'Focused on achieving measurable results that drive business growth and success.'
    }
  ];

  const displayHighlights = highlights.length > 0 ? highlights : defaultHighlights;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {displayHighlights.map((highlight, index) => (
        <div
          key={highlight.id}
          className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform ${
            hasIntersected ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ 
            transitionDelay: hasIntersected ? `${index * 100}ms` : '0ms' 
          }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <DynamicIcon 
                iconName={highlight.icon} 
                className="w-6 h-6 text-white"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{highlight.title}</h3>
              <p className="text-gray-300 leading-relaxed">{highlight.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutHighlights;