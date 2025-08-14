import React, { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { getProjectCardImage } from '../../utils/imageMap';
import { useCarouselImages } from '../../hooks/useCarouselImages';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteProject } from '../../hooks/useDeleteProject';
import EditProjectForm from './EditProjectForm';

interface ProjectCardProps {
  project: any;
  onViewProject: (project: any, source?: 'section' | 'view-only') => void;
  source?: 'section' | 'view-only';
  isHovered?: boolean;
  onHover?: (projectId: string, isHovered: boolean) => void;
  onProjectDeleted?: () => void;
}

const ProjectCard = ({ project, onViewProject, source = 'section', isHovered = false, onHover, onProjectDeleted }: ProjectCardProps) => {
  const isMobile = useIsMobile();
  const { data: carouselImages = [] } = useCarouselImages(project.id);
  const [isInternalHovered, setIsInternalHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user } = useAuth();
  const deleteProject = useDeleteProject();

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate(project.id, {
        onSuccess: () => {
          onProjectDeleted?.();
        }
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const handleProjectUpdated = () => {
    onProjectDeleted?.(); // Reuse this callback to refresh the projects list
  };

  const handleMouseEnter = () => {
    setIsInternalHovered(true);
    if (onHover) {
      onHover(project.id, true);
    }
  };

  const handleMouseLeave = () => {
    setIsInternalHovered(false);
    if (onHover) {
      onHover(project.id, false);
    }
  };

  const isWebDevProject = project.category === 'webdev' || project.category === 'web-development';
  const isFunnelDesignProject = project.category === 'funnel' || project.category === 'funnel-design';

  console.log('ProjectCard Debug:', {
    title: project.title,
    category: project.category,
    isWebDev: isWebDevProject,
    isFunnelDesign: isFunnelDesignProject,
    hasLink: !!project.link,
    link: project.link
  });

  // Sequential animation control for funnel projects - Fixed to restart from first project
  useEffect(() => {
    if (isFunnelDesignProject && source === 'section') {
      // Get all funnel projects on the page
      const allFunnelProjects = document.querySelectorAll('[data-project-id]');
      const funnelProjectElements = Array.from(allFunnelProjects).filter(el => {
        const projectId = el.getAttribute('data-project-id');
        return projectId && projectId !== 'undefined';
      });
      
      const currentProjectIndex = funnelProjectElements.findIndex(
        (el) => el.getAttribute('data-project-id') === project.id
      );

      if (currentProjectIndex !== -1) {
        const totalProjects = funnelProjectElements.length;
        const animationDuration = 12000; // 12 seconds animation
        const pauseDuration = 2000; // 2 seconds pause
        const singleCycleDuration = animationDuration + pauseDuration; // 14 seconds per project
        
        let animationTimer: NodeJS.Timeout;
        let cycleInterval: NodeJS.Timeout;

        const startAnimation = () => {
          setIsAnimating(true);
          
          // Stop animation after duration
          animationTimer = setTimeout(() => {
            setIsAnimating(false);
          }, animationDuration);
        };

        // Calculate initial delay for this project
        const initialDelay = currentProjectIndex * singleCycleDuration;
        
        // Start first animation after initial delay
        const firstAnimationTimer = setTimeout(() => {
          startAnimation();
        }, initialDelay);

        // Set up repeating cycle - each project animates in sequence
        cycleInterval = setInterval(() => {
          startAnimation();
        }, totalProjects * singleCycleDuration);

        return () => {
          clearTimeout(firstAnimationTimer);
          clearTimeout(animationTimer);
          clearInterval(cycleInterval);
        };
      }
    }
  }, [isFunnelDesignProject, source, project.id]);

  // Special card for Funnel Design category
  if (isFunnelDesignProject) {
    // Use first carousel image if available, otherwise fall back to project image
    const funnelImage = carouselImages.length > 0 ? carouselImages[0].image_url : project.image;
    
    return (
      <>
        <div
          data-project-id={project.id}
          onClick={() => onViewProject(project, source)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative cursor-pointer h-full ${
            !isMobile ? 'hover:shadow-xl hover:transform hover:-translate-y-2' : ''
          }`}
        >
          {/* Action Buttons - Only show if user is authenticated */}
          {user && (
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                onClick={handleEditClick}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Funnel Design Image with sequential auto scroll animation */}
          <div className="relative h-96 md:h-[600px] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 overflow-hidden">
            <div className={`w-full h-full ${isAnimating ? 'animate-[funnelSequentialScroll_12s_ease-in-out_forwards]' : ''}`}>
              <img
                src={funnelImage}
                alt={project.title}
                className="w-full h-full object-cover"
                style={{ minHeight: '200%' }}
              />
            </div>
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent ${
              !isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}>
              <div className="absolute bottom-4 left-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced keyframe animation with full range and pauses */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes funnelSequentialScroll {
                0% { transform: translateY(0); }
                8% { transform: translateY(0); }
                25% { transform: translateY(-100%); }
                33% { transform: translateY(-100%); }
                50% { transform: translateY(0); }
                58% { transform: translateY(0); }
                75% { transform: translateY(-100%); }
                83% { transform: translateY(-100%); }
                100% { transform: translateY(0); }
              }
            `
          }} />
        </div>

        {/* Edit Project Form */}
        <EditProjectForm
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          project={project}
          onProjectUpdated={handleProjectUpdated}
        />
      </>
    );
  }

  // Regular project card for other categories
  return (
    <>
      <div
        data-project-id={project.id}
        onClick={() => onViewProject(project, source)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative cursor-pointer h-full flex flex-col ${
          !isMobile ? 'hover:shadow-xl hover:transform hover:-translate-y-2' : ''
        }`}
      >
        {project.badge && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-responsive-xs font-bold px-2 py-1 rounded-full z-10">
            {project.badge}
          </div>
        )}

        {/* Action Buttons - Only show if user is authenticated */}
        {user && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={handleEditClick}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Edit Project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Project Image - Enhanced size and fit */}
        <div className="relative h-56 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 overflow-hidden">
          <img
            src={project.project_card_image || getProjectCardImage(project.image)}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              !isMobile ? 'group-hover:scale-110' : ''
            }`}
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent ${
            !isMobile ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}>
            <div className="absolute bottom-4 left-4">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white transition-transform duration-300 shadow-lg ${
                !isMobile ? 'group-hover:rotate-12 group-hover:scale-110' : ''
              }`}>
                {project.icon}
              </div>
              <div className="flex items-center gap-2 text-responsive-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                {project.duration || project.months}
              </div>
            </div>

            <h3 className={`text-responsive-xl font-bold text-slate-800 dark:text-white mb-3 transition-all duration-300 ${
              !isMobile ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''
            }`}>
              {project.title}
            </h3>

            <p className="text-responsive-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              {project.description || project.caption}
            </p>

            {/* Results */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-responsive-sm text-green-700 dark:text-green-300 font-medium">
                  {project.results}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(project.tags || project.skills_used?.split(', ') || []).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 md:px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-responsive-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Live View Button - Only for webdev projects */}
          {isWebDevProject && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
              <button
                onClick={handleLinkClick}
                disabled={!project.link}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-responsive-sm font-medium transition-all duration-300 ${
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
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Form */}
      <EditProjectForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        project={project}
        onProjectUpdated={handleProjectUpdated}
      />
    </>
  );
};

export default ProjectCard;
