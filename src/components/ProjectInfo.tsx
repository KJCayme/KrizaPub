
import React from 'react';
import { Clock, CheckCircle, ExternalLink } from 'lucide-react';
import type { Project } from '../hooks/useProjects';

interface ProjectInfoProps {
  project: Project;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const isFunnelDesignProject = project.category === 'funnel' || project.category === 'funnel-design';
  const isWebDevProject = project.category === 'webdev' || project.category === 'web-development';

  const handleLinkClick = () => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
          {project.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{project.title}</h1>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            {project.duration}
          </div>
        </div>
      </div>

      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        {project.description}
      </p>

      {/* Results section - optional for funnel design */}
      {(!isFunnelDesignProject || project.results) && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">Results Achieved</h3>
              <p className="text-green-700 dark:text-green-400">{project.results}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technologies & Skills section - optional for funnel design */}
      {(!isFunnelDesignProject || (project.tags && project.tags.length > 0)) && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Technologies & Skills Used</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Live View Button - Only for webdev projects with links, full width */}
          {isWebDevProject && (
            <button
              onClick={handleLinkClick}
              disabled={!project.link}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                project.link
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {project.link ? (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Live View
                </>
              ) : (
                'NDA - Can\'t View'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectInfo;
