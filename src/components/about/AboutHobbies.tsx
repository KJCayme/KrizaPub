import React from 'react';
import { Coffee, Music, Camera, Book, Plane } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

interface Hobby {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface AboutHobbiesProps {
  hobbies: Hobby[];
  hasIntersected: boolean;
}

const AboutHobbies: React.FC<AboutHobbiesProps> = ({ hobbies, hasIntersected }) => {
  const defaultHobbies = [
    {
      id: 1,
      icon: 'Coffee',
      title: 'Coffee Enthusiast',
      description: 'Exploring different coffee blends and brewing methods'
    },
    {
      id: 2,
      icon: 'Music',
      title: 'Music Lover',
      description: 'Enjoying various genres and discovering new artists'
    },
    {
      id: 3,
      icon: 'Camera',
      title: 'Photography',
      description: 'Capturing moments and exploring creative perspectives'
    },
    {
      id: 4,
      icon: 'Book',
      title: 'Reading',
      description: 'Continuous learning through books and articles'
    },
    {
      id: 5,
      icon: 'Plane',
      title: 'Travel',
      description: 'Exploring new places and experiencing different cultures'
    }
  ];

  const displayHobbies = hobbies.length > 0 ? hobbies : defaultHobbies;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Hobbies & Interests</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayHobbies.map((hobby, index) => (
          <div
            key={hobby.id}
            className={`text-center transition-all duration-500 transform ${
              hasIntersected ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ 
              transitionDelay: hasIntersected ? `${(index + 4) * 100}ms` : '0ms' 
            }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <DynamicIcon 
                  iconName={hobby.icon} 
                  className="w-6 h-6 text-white"
                />
              </div>
              <h4 className="text-white font-semibold mb-2">{hobby.title}</h4>
              <p className="text-gray-400 text-sm">{hobby.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutHobbies;