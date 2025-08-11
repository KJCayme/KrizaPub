
import React, { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import ProjectImageCarousel from './ProjectImageCarousel';
import ProjectInfo from './ProjectInfo';
import FunnelProjectDetails from './FunnelProjectDetails';
import { useIsMobile } from '../hooks/use-mobile';
import type { Project } from '../hooks/useProjects';

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  source?: 'section' | 'view-only';
}

const ProjectDetails = ({ project, onBack, source = 'section' }: ProjectDetailsProps) => {
  const isMobile = useIsMobile();
  const isFunnelDesignProject = project.category === 'funnel' || project.category === 'funnel-design';

  useEffect(() => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  // Use dedicated funnel project details component for funnel design projects
  if (isFunnelDesignProject) {
    return (
      <FunnelProjectDetails 
        project={project} 
        onBack={onBack} 
        source={source}
      />
    );
  }

  // Show back button only for view-only mode on desktop, or section mode on desktop
  const showBackButton = !isMobile && (source === 'view-only' || source === 'section');

  // Regular rendering for other project types
  return (
    <div className="max-w-7xl mx-auto relative z-20 w-full">
      {showBackButton && (
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-30 p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <div className="order-2 lg:order-1">
            <ProjectImageCarousel 
              projectTitle={project.title}
              mainImage={project.image}
              projectType={project.category}
              projectId={project.id}
            />
          </div>

          <div className="order-1 lg:order-2">
            <ProjectInfo project={project} />
          </div>
        </div>

        {(project.problem || project.solution || project.detailedProcess || project.detailedResults) && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-8">
            <div className="space-y-8">
              {project.problem && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    Problem
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}

              {project.detailedProcess && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    Detailed Process
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.detailedProcess}
                  </p>
                </div>
              )}

              {project.solution && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    Solution
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}

              {project.detailedResults && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                    Detailed Results & Impact
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.detailedResults}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
