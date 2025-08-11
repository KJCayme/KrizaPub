
import React from 'react';
import type { Project } from '../../hooks/useProjects';

interface ProjectInfoSectionProps {
  project: Project;
}

const ProjectInfoSection = ({ project }: ProjectInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-nav-button-start to-nav-button-end flex items-center justify-center text-white">
          {project.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-funnel-text-primary mb-2">{project.title}</h1>
          <div className="flex items-center gap-2 text-funnel-text-secondary">
            <span>{project.duration}</span>
          </div>
        </div>
      </div>

      <p className="text-lg text-funnel-text-secondary leading-relaxed">
        {project.description}
      </p>

      {project.tags && project.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-funnel-text-primary mb-3">Technologies & Skills Used</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-funnel-device-bg text-funnel-device-text rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.results && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">Results Achieved</h3>
              <p className="text-green-700 dark:text-green-400">{project.results}</p>
            </div>
          </div>
        </div>
      )}

      {project.problem && (
        <div>
          <h3 className="text-lg font-semibold text-funnel-text-primary mb-3">Problem</h3>
          <p className="text-funnel-text-secondary leading-relaxed">
            {project.problem}
          </p>
        </div>
      )}

      {project.solution && (
        <div>
          <h3 className="text-lg font-semibold text-funnel-text-primary mb-3">Solution</h3>
          <p className="text-funnel-text-secondary leading-relaxed">
            {project.solution}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectInfoSection;
