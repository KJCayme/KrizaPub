import React from 'react';

interface AboutInfoProps {
  info: string;
  hasIntersected: boolean;
}

const AboutInfo: React.FC<AboutInfoProps> = ({ info, hasIntersected }) => {
  const defaultInfo = `I'm Kenneth John Cayme, a dedicated General Virtual Assistant with a passion for helping businesses thrive through exceptional support and innovative solutions. With years of experience in various administrative and technical tasks, I bring a unique blend of efficiency, creativity, and reliability to every project.

My journey in virtual assistance has equipped me with diverse skills ranging from administrative support to digital marketing, content creation, and project management. I believe in building strong relationships with clients and understanding their unique needs to deliver personalized solutions that drive real results.

When I'm not helping businesses grow, you can find me exploring new technologies, reading about industry trends, or enjoying quality time with family and friends. I'm always eager to take on new challenges and contribute to meaningful projects that make a difference.`;

  const displayInfo = info || defaultInfo;

  return (
    <div className={`transition-all duration-700 ${hasIntersected ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-8">
        About Me
      </h2>
      <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
        {displayInfo.split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AboutInfo;