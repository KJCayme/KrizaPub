import React, { useState, useEffect, useRef } from 'react';
import { Plus, Settings, ExternalLink } from 'lucide-react';
import ProjectDetails from './ProjectDetails';
import AllProjectsView from './portfolio/AllProjectsView';
import ProjectGrid from './portfolio/ProjectGrid';
import AddProjectForm from './portfolio/AddProjectForm';
import AddCategoryForm from './portfolio/AddCategoryForm';
import ManageCategoriesForm from './portfolio/ManageCategoriesForm';
import PortfolioHeader from './portfolio/PortfolioHeader';
import CategoryTabs from './portfolio/CategoryTabs';
import PortfolioCallToAction from './portfolio/PortfolioCallToAction';

import { useIsMobile } from '../hooks/use-mobile';
import { useProjects } from '../hooks/useProjects';
import { useProjectsByCategory } from '../hooks/useProjectsByCategory';
import { usePrefetchProjects } from '../hooks/usePrefetchProjects';
import { usePrefetchAllProjects } from '../hooks/usePrefetchAllProjects';
import { useAuth } from '../hooks/useAuth';
import { usePortfolioCategories } from '../hooks/usePortfolioCategories';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { transformProjects } from '../utils/projectHelpers';
import { toast } from 'sonner';

interface PortfolioProps {
  onShowAllProjectsChange?: (show: boolean) => void;
}

const Portfolio = ({ onShowAllProjectsChange }: PortfolioProps) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [lastOpenedProject, setLastOpenedProject] = useState<any>(null);
  const [projectDetailsSource, setProjectDetailsSource] = useState<'section' | 'view-only'>('section');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showManageCategoriesForm, setShowManageCategoriesForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shouldScrollToProject, setShouldScrollToProject] = useState(false);
  const [prefetchedCategories, setPrefetchedCategories] = useState<Set<string>>(new Set());
  const [hasTriggeredPrefetch, setHasTriggeredPrefetch] = useState(false);
  const projectGridRef = useRef<{ scrollToProject: (projectId: number) => void }>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Use intersection observer to detect when portfolio section is reached
  const { ref: portfolioRef, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });

  // Fetch portfolio categories from database (show hidden ones only if user is logged in)
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = usePortfolioCategories(!!user);
  const categories = categoriesData?.map(cat => ({
    id: cat.category_key,
    name: cat.name,
    badge: cat.badge || undefined,
    hidden: cat.hidden || false
  })) || [];

  // Hooks for prefetching
  const { prefetchProjectsByCategory } = usePrefetchProjects();
  const { prefetchAllProjects } = usePrefetchAllProjects();

  // Set default category to the first available category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory.id);
      setPrefetchedCategories(new Set([firstCategory.id]));
    }
  }, [categories, activeCategory]);

  // Prefetch all projects when portfolio section is reached
  useEffect(() => {
    if (hasIntersected && !hasTriggeredPrefetch && categories.length > 0) {
      console.log('🎯 Portfolio section reached - triggering prefetch of all projects');
      setHasTriggeredPrefetch(true);
      prefetchAllProjects();
    }
  }, [hasIntersected, hasTriggeredPrefetch, categories.length, prefetchAllProjects]);

  // Fetch projects by category (only fetch for active category or when hovered/clicked)
  const { data: projectsData, isLoading, error, refetch } = useProjectsByCategory(activeCategory, !!activeCategory && hasIntersected);

  // Transform projects for UI compatibility
  const projects = projectsData || [];

  // Initialize dark mode from document
  useEffect(() => {
    const darkModeEnabled = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkModeEnabled);
  }, []);

  // Show error toast if there's an error fetching projects or categories
  useEffect(() => {
    if (error) {
      console.error('Portfolio error:', error);
      toast.error('Failed to load projects. Please try again later.');
    }
    if (categoriesError) {
      console.error('Categories error:', categoriesError);
      toast.error('Failed to load categories. Please try again later.');
    }
  }, [error, categoriesError]);

  // Listen for portfolio category changes from navigation
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      const newCategory = event.detail.category;
      setActiveCategory(newCategory);
      setShouldScrollToProject(false);
      setTimeout(() => {
        if (projectGridRef.current) {
          projectGridRef.current.scrollToProject(-1);
        }
      }, 100);
    };

    window.addEventListener('portfolioCategoryChange', handleCategoryChange as EventListener);
    
    return () => {
      window.removeEventListener('portfolioCategoryChange', handleCategoryChange as EventListener);
    };
  }, []);

  // Listen for add category form trigger event
  useEffect(() => {
    const handleShowAddCategoryForm = () => {
      setShowAddCategoryForm(true);
    };
    
    window.addEventListener('showAddCategoryForm', handleShowAddCategoryForm);
    return () => window.removeEventListener('showAddCategoryForm', handleShowAddCategoryForm);
  }, []);

  // Notify parent component when showAllProjects changes
  useEffect(() => {
    if (onShowAllProjectsChange) {
      onShowAllProjectsChange(showAllProjects);
    }
  }, [showAllProjects, onShowAllProjectsChange]);

  // Scroll to last opened project when returning from project details
  useEffect(() => {
    if (shouldScrollToProject && lastOpenedProject && projectGridRef.current) {
      setTimeout(() => {
        projectGridRef.current?.scrollToProject(lastOpenedProject.id);
        setShouldScrollToProject(false);
      }, 100);
    }
  }, [shouldScrollToProject, lastOpenedProject]);

  const filteredProjects = projects.filter(project => project.category === activeCategory);

  // Prefetch projects for a category on hover
  const handleCategoryHover = async (categoryId: string) => {
    if (!prefetchedCategories.has(categoryId)) {
      console.log(`🚀 Prefetching projects for category: ${categoryId}`);
      setPrefetchedCategories(prev => new Set([...prev, categoryId]));
      
      try {
        await prefetchProjectsByCategory(categoryId);
        console.log(`✅ Successfully prefetched projects for category: ${categoryId}`);
      } catch (error) {
        console.error(`❌ Failed to prefetch projects for ${categoryId}:`, error);
        setPrefetchedCategories(prev => {
          const newSet = new Set([...prev]);
          newSet.delete(categoryId);
          return newSet;
        });
      }
    } else {
      console.log(`⚡ Projects for ${categoryId} already prefetched`);
    }
  };

  const handleViewProject = (project: any, source: 'section' | 'view-only' = 'section') => {
    setSelectedProject(project);
    setLastOpenedProject(project);
    setProjectDetailsSource(source);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setShouldScrollToProject(true);
  };

  const handleSeeMoreProjects = () => {
    setShowAllProjects(true);
  };

  const handleBackFromAllProjects = () => {
    setShowAllProjects(false);
    setTimeout(() => {
      const element = document.getElementById('portfolio');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setShouldScrollToProject(false);
    setTimeout(() => {
      if (projectGridRef.current) {
        projectGridRef.current.scrollToProject(-1);
      }
    }, 100);
  };

  const handleProjectAdded = () => {
    refetch();
    toast.success('Project added successfully!');
  };

  const handleCategoryAdded = () => {
    refetchCategories();
    toast.success('Category added successfully!');
  };

  // Loading state
  if (isLoading || categoriesLoading) {
    return (
      <section ref={portfolioRef} id="portfolio" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || categoriesError) {
    return (
      <section ref={portfolioRef} id="portfolio" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Failed to load portfolio data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (selectedProject) {
    return (
      <section ref={portfolioRef} id="portfolio" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center">
          <ProjectDetails 
            project={selectedProject} 
            onBack={handleBackToProjects}
            source={projectDetailsSource}
          />
        </div>
      </section>
    );
  }

  if (showAllProjects) {
    return (
      <AllProjectsView 
        projects={projects}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onBack={handleBackFromAllProjects}
        onViewProject={handleViewProject}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => {}}
        lastOpenedProject={lastOpenedProject}
        onProjectAdded={handleProjectAdded}
      />
    );
  }

  return (
    <section ref={portfolioRef} id="portfolio" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="container mx-auto px-6">
        <PortfolioHeader
          user={user}
          onAddProject={() => setShowAddProjectForm(true)}
          onAddCategory={() => setShowAddCategoryForm(true)}
          onManageCategories={() => setShowManageCategoriesForm(true)}
        />

        {categoriesLoading ? (
          <div className="text-center text-gray-400">Loading categories...</div>
        ) : categoriesError ? (
          <div className="text-center text-red-400">Error loading categories</div>
        ) : (
          <CategoryTabs
            categories={categories || []}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            prefetchedCategories={prefetchedCategories}
            onCategoryHover={handleCategoryHover}
          />
        )}

        {/* Projects Grid */}
        <ProjectGrid 
          ref={projectGridRef}
          projects={filteredProjects}
          activeCategory={activeCategory}
          onViewProject={handleViewProject}
          source="section"
          lastOpenedProject={lastOpenedProject}
        />

        {/* See More Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleSeeMoreProjects}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <span>See More Projects</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        <PortfolioCallToAction />
      </div>

      {/* Add Project Form Dialog */}
      <AddProjectForm
        isOpen={showAddProjectForm}
        onClose={() => setShowAddProjectForm(false)}
        onProjectAdded={handleProjectAdded}
      />

      {/* Add Category Form Dialog */}
      <AddCategoryForm
        isOpen={showAddCategoryForm}
        onClose={() => setShowAddCategoryForm(false)}
        onCategoryAdded={handleCategoryAdded}
      />

      {/* Manage Categories Form Dialog */}
      <ManageCategoriesForm
        isOpen={showManageCategoriesForm}
        onClose={() => setShowManageCategoriesForm(false)}
      />
    </section>
  );
};

export default Portfolio;