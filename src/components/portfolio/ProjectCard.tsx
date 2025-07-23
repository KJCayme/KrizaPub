
import React, { useState } from 'react';
import { ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteProject } from '../../hooks/useDeleteProject';
import { Button } from '../ui/button';
import type { Project } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
}

const ProjectCard = ({ project, onProjectClick }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const deleteProject = useDeleteProject();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(project.id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div
      className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer relative ${
        isMobile ? '' : 'hover:shadow-xl transform hover:-translate-y-2'
      }`}
      onClick={() => onProjectClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delete Button - Only show for authenticated users on hover */}
      {user && isHovered && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg"
            disabled={deleteProject.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="h-48 relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            {project.icon}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{project.duration}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {project.results}
          </span>
          {project.link && (
            <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
