
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { useIsMobile } from '../../hooks/use-mobile';

interface ProjectGridProps {
  projects: any[];
  activeCategory: string;
  onViewProject: (project: any, source?: 'section' | 'view-only') => void;
  source?: 'section' | 'view-only';
  lastOpenedProject?: any;
}

interface ProjectGridRef {
  scrollToProject: (projectId: number) => void;
}

const ProjectGrid = forwardRef<ProjectGridRef, ProjectGridProps>(
  ({ projects, activeCategory, onViewProject, source = 'section', lastOpenedProject }, ref) => {
    const isMobile = useIsMobile();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    useImperativeHandle(ref, () => ({
      scrollToProject: (projectId: number) => {
        if (projectId === -1) {
          // Scroll to start
          scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
          return;
        }
        
        const element = document.querySelector(`[data-project-id="${projectId}"]`);
        if (element && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const elementRect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Calculate the scroll position to center the element
          const scrollLeft = container.scrollLeft + elementRect.left - containerRect.left - (containerRect.width - elementRect.width) / 2;
          
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
          
          console.log('Found project element, scrolling to:', projectId);
        } else {
          console.log('Project element not found:', projectId);
        }
      }
    }));

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };

    // Check scroll arrows visibility immediately when container loads
    const checkScrollArrows = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1);
      });
    };

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener('scroll', handleScroll);
      
      // Check initial state
      checkScrollArrows();
      
      // Also check after a small delay to ensure all content is loaded
      const timeoutId = setTimeout(checkScrollArrows, 100);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }, [projects, activeCategory]); // Re-run when projects or category changes

    const scrollLeft = () => {
      scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
      scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
    };

    if (projects.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            No projects found in this category.
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Desktop Navigation Arrows */}
        {!isMobile && showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
        )}
        
        {!isMobile && showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
        )}

        {/* Projects Container */}
        <div 
          ref={scrollContainerRef}
          className={`flex gap-6 overflow-x-auto scrollbar-hide ${
            isMobile ? 'px-4' : 'px-12'
          }`}
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex-shrink-0 ${
                isMobile ? 'w-80' : 'w-96'
              }`}
            >
              <ProjectCard
                project={project}
                onProjectClick={onViewProject}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ProjectGrid.displayName = 'ProjectGrid';

export default ProjectGrid;
