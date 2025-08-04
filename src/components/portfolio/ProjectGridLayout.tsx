import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { useIsMobile } from '../../hooks/use-mobile';

interface ProjectGridLayoutProps {
  projects: any[];
  activeCategory: string;
  onViewProject: (project: any, source?: 'section' | 'view-only') => void;
  source?: 'section' | 'view-only';
  lastOpenedProject?: any;
  layout?: 'horizontal-scroll' | 'flex-wrap';
}

interface ProjectGridLayoutRef {
  scrollToProject: (projectId: number) => void;
}

const ProjectGridLayout = forwardRef<ProjectGridLayoutRef, ProjectGridLayoutProps>(
  ({ projects, activeCategory, onViewProject, source = 'section', lastOpenedProject, layout = 'horizontal-scroll' }, ref) => {
    const isMobile = useIsMobile();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      scrollToProject: (projectId: number) => {
        if (layout === 'flex-wrap') {
          // For flex-wrap layout, scroll to the element in the grid
          const element = document.querySelector(`[data-project-id="${projectId}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        if (projectId === -1) {
          // Scroll to start for horizontal scroll
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
      if (!container || layout === 'flex-wrap') return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };

    // Check scroll arrows visibility immediately when container loads
    const checkScrollArrows = () => {
      const container = scrollContainerRef.current;
      if (!container || layout === 'flex-wrap') return;

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1);
      });
    };

    useEffect(() => {
      if (layout === 'flex-wrap') return;

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
    }, [projects, activeCategory, layout]); // Re-run when projects, category, or layout changes

    const handleProjectHover = (projectId: string, isHovered: boolean) => {
      if (isHovered) {
        setHoveredProjectId(projectId);
      } else {
        setHoveredProjectId(null);
      }
    };

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

    // Flex-wrap layout for AllProjectsView
    if (layout === 'flex-wrap') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
          {projects.map((project) => (
            <div key={project.id} data-project-id={project.id}>
              <ProjectCard
                project={project}
                onViewProject={onViewProject}
                source={source}
                isHovered={hoveredProjectId === project.id}
                onHover={handleProjectHover}
              />
            </div>
          ))}
        </div>
      );
    }

    // Horizontal scroll layout for Portfolio section
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

        {/* Projects Container - Horizontal Scroll */}
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
              data-project-id={project.id}
              className={`flex-shrink-0 ${
                isMobile ? 'w-80' : 'w-96'
              }`}
            >
              <ProjectCard
                project={project}
                onViewProject={onViewProject}
                source={source}
                isHovered={hoveredProjectId === project.id}
                onHover={handleProjectHover}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ProjectGridLayout.displayName = 'ProjectGridLayout';

export default ProjectGridLayout;