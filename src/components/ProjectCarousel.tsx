import React, { useRef, useState, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  results: string;
  duration: string;
  icon: React.ReactNode;
}

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectCarousel = ({ projects, onProjectClick }: ProjectCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMouseOnLeft, setIsMouseOnLeft] = useState(false);
  const [isMouseOnRight, setIsMouseOnRight] = useState(false);

  useEffect(() => {
    if (projects.length <= 3) return;

    let interval: ReturnType<typeof setInterval>;
    
    if (isMouseOnLeft) {
      interval = setInterval(() => {
        scrollToPrevious();
      }, 100);
    } else if (isMouseOnRight) {
      interval = setInterval(() => {
        scrollToNext();
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMouseOnLeft, isMouseOnRight, currentIndex, projects.length]);

  const scrollToNext = () => {
    const nextIndex = (currentIndex + 1) % projects.length;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const scrollToPrevious = () => {
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = 320; // Approximate width of each project card
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (projects.length <= 3) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    const leftThreshold = width * 0.2;
    const rightThreshold = width * 0.8;
    
    if (x < leftThreshold) {
      setIsMouseOnLeft(true);
      setIsMouseOnRight(false);
    } else if (x > rightThreshold) {
      setIsMouseOnLeft(false);
      setIsMouseOnRight(true);
    } else {
      setIsMouseOnLeft(false);
      setIsMouseOnRight(false);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseOnLeft(false);
    setIsMouseOnRight(false);
  };

  if (projects.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
            onClick={() => onProjectClick(project)}
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {project.icon}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <span>{project.duration}</span>
                <span className="font-medium text-green-600 dark:text-green-400">{project.results}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Duplicate projects for infinite scroll effect */}
        {[...projects, ...projects].map((project, index) => (
          <div
            key={`${project.id}-${index}`}
            className="flex-shrink-0 w-80 group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
            onClick={() => onProjectClick(project)}
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {project.icon}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <span>{project.duration}</span>
                <span className="font-medium text-green-600 dark:text-green-400">{project.results}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mouse hover indicators */}
      {isMouseOnLeft && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm font-medium px-2 py-1 bg-white/90 rounded">
          ← Scrolling Left
        </div>
      )}
      {isMouseOnRight && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm font-medium px-2 py-1 bg-white/90 rounded">
          Scrolling Right →
        </div>
      )}
    </div>
  );
};

export default ProjectCarousel;
