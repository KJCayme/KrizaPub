import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ProjectCard from './ProjectCard';
import { useIsMobile } from '../../hooks/use-mobile';

interface ProjectFlexGridProps {
  projects: any[];
  activeCategory: string;
  onViewProject: (project: any, source?: 'section' | 'view-only') => void;
  source?: 'section' | 'view-only';
  lastOpenedProject?: any;
}

interface ProjectFlexGridRef {
  scrollToProject: (projectId: number) => void;
}

const ProjectFlexGrid = forwardRef<ProjectFlexGridRef, ProjectFlexGridProps>(
  ({ projects, activeCategory, onViewProject, source = 'view-only', lastOpenedProject }, ref) => {
    const isMobile = useIsMobile();
    const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      scrollToProject: (projectId: number) => {
        if (projectId === -1) {
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        
        const element = document.querySelector(`[data-project-id="${projectId}"]`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
          
          console.log('Found project element, scrolling to:', projectId);
        } else {
          console.log('Project element not found:', projectId);
        }
      }
    }));

    const handleProjectHover = (projectId: string, isHovered: boolean) => {
      if (isHovered) {
        setHoveredProjectId(projectId);
      } else {
        setHoveredProjectId(null);
      }
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
      <div className="w-full">
        {/* Projects Container with flex-wrap */}
        <div className={`flex flex-wrap gap-6 justify-center ${isMobile ? 'px-4' : 'px-0'}`}>
          {projects.map((project) => (
            <div
              key={project.id}
              data-project-id={project.id}
              className={`flex-shrink-0 ${
                isMobile ? 'w-full max-w-sm' : 'w-96'
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

ProjectFlexGrid.displayName = 'ProjectFlexGrid';

export default ProjectFlexGrid;