
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Menu, X, Plus, Settings } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAuth } from '../../hooks/useAuth';
import { usePrefetchProjects } from '../../hooks/usePrefetchProjects';
import { usePortfolioCategories } from '../../hooks/usePortfolioCategories';
import ProjectGrid from './ProjectGrid';
import AddProjectForm from './AddProjectForm';
import ManageCategoriesForm from './ManageCategoriesForm';

interface AllProjectsViewProps {
  projects: any[];
  categories: any[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onBack: () => void;
  onViewProject: (project: any, source?: 'section' | 'view-only') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lastOpenedProject?: any;
  onProjectAdded?: () => void;
}

const AllProjectsView = ({ 
  projects, 
  categories: propCategories, 
  activeCategory, 
  onCategoryChange, 
  onBack, 
  onViewProject,
  isDarkMode,
  onToggleDarkMode,
  lastOpenedProject,
  onProjectAdded
}: AllProjectsViewProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { prefetchProjectsByCategory } = usePrefetchProjects();
  
  // Fetch categories from database, but fall back to props if needed
  const { data: categoriesData } = usePortfolioCategories();
  const categories = categoriesData?.map(cat => ({
    id: cat.category_key,
    name: cat.name,
    badge: cat.badge || undefined
  })) || propCategories;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showManageCategoriesForm, setShowManageCategoriesForm] = useState(false);
  const [internalLastOpenedProject, setInternalLastOpenedProject] = useState<any>(lastOpenedProject);
  const projectGridRef = useRef<{ scrollToProject: (projectId: number) => void }>(null);

  const filteredProjects = projects.filter(project => project.category === activeCategory);

  // Update internal state when prop changes
  useEffect(() => {
    if (lastOpenedProject) {
      setInternalLastOpenedProject(lastOpenedProject);
    }
  }, [lastOpenedProject]);

  // Scroll to last opened project when returning from project details
  useEffect(() => {
    if (!selectedProject && internalLastOpenedProject && projectGridRef.current) {
      // Check if the project is in the current category
      const isProjectInCurrentCategory = filteredProjects.some(p => p.id === internalLastOpenedProject.id);
      
      if (isProjectInCurrentCategory) {
        // Small delay to ensure the grid is rendered
        const timer = setTimeout(() => {
          console.log('Scrolling to project:', internalLastOpenedProject.id);
          projectGridRef.current?.scrollToProject(internalLastOpenedProject.id);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedProject, internalLastOpenedProject, activeCategory, filteredProjects]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsMobileMenuOpen(false);
  };

  const handleCategoryHover = (categoryId: string) => {
    console.log('Hovering over category:', categoryId);
    prefetchProjectsByCategory(categoryId);
  };

  const handleViewProject = (project: any, source: 'section' | 'view-only' = 'view-only') => {
    console.log('Opening project:', project.id, project.title);
    setSelectedProject(project);
    setInternalLastOpenedProject(project); // Track the opened project internally
    onViewProject(project, source);
  };

  const handleBackToProjects = () => {
    console.log('Returning to projects, last opened:', internalLastOpenedProject?.id);
    setSelectedProject(null);
    
    // If the last opened project is in a different category, switch to that category first
    if (internalLastOpenedProject && internalLastOpenedProject.category !== activeCategory) {
      console.log('Switching category to:', internalLastOpenedProject.category);
      onCategoryChange(internalLastOpenedProject.category);
    }
  };

  const handleProjectAdded = () => {
    if (onProjectAdded) {
      onProjectAdded(); // Call the parent's callback
    }
  };

  // If a project is selected, show project details
  if (selectedProject) {
    const ProjectDetails = React.lazy(() => import('../ProjectDetails'));
    
    return (
      <section id="portfolio" className="py-0 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
          <React.Suspense fallback={<div>Loading...</div>}>
            <ProjectDetails 
              project={selectedProject} 
              onBack={handleBackToProjects}
              source="view-only"
            />
          </React.Suspense>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-0 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900 min-h-screen">
      {/* Navigation Bar - Sticky from the start */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-white">Projects</h1>
              {/* Add Project Button - Only show if user is authenticated */}
              {user && (
                <button
                  onClick={() => setShowAddProjectForm(true)}
                  className="flex items-center gap-2 text-white px-3 py-2 rounded-lg transition-colors hover:bg-white/20"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Project</span>
                </button>
              )}
              {/* Manage Categories Button - Only show if user is authenticated */}
              {user && (
                <button
                  onClick={() => setShowManageCategoriesForm(true)}
                  className="flex items-center gap-2 text-white px-3 py-2 rounded-lg transition-colors hover:bg-white/20"
                >
                  <Settings className="w-5 h-5" />
                  <span className="hidden sm:inline">Manage</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white px-3 py-2 rounded-lg transition-colors hover:bg-white/20"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="text-white px-3 py-2 rounded-lg transition-colors hover:bg-white/20"
              >
                {isDarkMode ? (
                  <span className="text-lg">☀️</span>
                ) : (
                  <span className="text-lg">🌙</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-purple-600 to-blue-600 border-t border-white/20">
            <div className="container mx-auto px-4 md:px-6 py-4">
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    className={`relative text-left px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {category.name}
                    {category.badge && (
                      <span className="absolute top-1 right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {category.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 md:px-6 pt-8 pb-8">
        {/* Category Filter - Desktop */}
        <div className="hidden md:flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              onMouseEnter={() => handleCategoryHover(category.id)}
              className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              {category.name}
              {category.badge && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {category.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Category Display - Mobile */}
        <div className="md:hidden mb-8 mt-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {categories.find(cat => cat.id === activeCategory)?.name}
            </h2>
          </div>
        </div>

        {/* All Projects Grid */}
        <ProjectGrid 
          ref={projectGridRef}
          projects={filteredProjects}
          activeCategory={activeCategory}
          onViewProject={handleViewProject}
          source="view-only"
          lastOpenedProject={internalLastOpenedProject}
        />
      </div>

      {/* Add Project Form Dialog */}
      <AddProjectForm
        isOpen={showAddProjectForm}
        onClose={() => setShowAddProjectForm(false)}
        onProjectAdded={handleProjectAdded}
      />

      {/* Manage Categories Form Dialog */}
      <ManageCategoriesForm
        isOpen={showManageCategoriesForm}
        onClose={() => setShowManageCategoriesForm(false)}
      />
    </section>
  );
};

export default AllProjectsView;
