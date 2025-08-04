
import React, { forwardRef } from 'react';
import ProjectGridLayout from './ProjectGridLayout';

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
    // Portfolio section uses horizontal scroll layout
    const layout = source === 'section' ? 'horizontal-scroll' : 'flex-wrap';

    return (
      <ProjectGridLayout
        ref={ref}
        projects={projects}
        activeCategory={activeCategory}
        onViewProject={onViewProject}
        source={source}
        lastOpenedProject={lastOpenedProject}
        layout={layout}
      />
    );
  }
);

ProjectGrid.displayName = 'ProjectGrid';

export default ProjectGrid;
