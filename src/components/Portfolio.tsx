import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Users, TrendingUp, Palette, Video, CheckCircle, Code, Bot, PenTool, Database, Globe, BarChart3, FileText, ExternalLink, Plus, Settings } from 'lucide-react';
import ProjectDetails from './ProjectDetails';
import AllProjectsView from './portfolio/AllProjectsView';
import ProjectGrid from './portfolio/ProjectGrid';
import AddProjectForm from './portfolio/AddProjectForm';
import AddCategoryForm from './portfolio/AddCategoryForm';
import ManageCategoriesForm from './portfolio/ManageCategoriesForm';
import ProjectCardSkeleton from './skeletons/ProjectCardSkeleton';
import { handleBookCall } from '../utils/bookCall';
import { useIsMobile } from '../hooks/use-mobile';
import { useProjects } from '../hooks/useProjects';
import { useProjectsByCategory } from '../hooks/useProjectsByCategory';
import { usePrefetchProjects } from '../hooks/usePrefetchProjects';
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

  // Set default category to the first available category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory.id);
      setPrefetchedCategories(new Set([firstCategory.id]));
    }
  }, [categories, activeCategory]);

  // Fetch projects by category (only fetch for active category or when hovered/clicked)
  const { data: projectsData, isLoading, error, refetch } = useProjectsByCategory(activeCategory, !!activeCategory && hasIntersected);
  const { prefetchProjectsByCategory } = usePrefetchProjects();

  // Transform projects for UI compatibility
  const projects = projectsData || [];

  // Initialize dark mode from document and prefetch for tablet/mobile
  useEffect(() => {
    const darkModeEnabled = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkModeEnabled);
    
    // For tablet/mobile viewports, prefetch all categories since hover doesn't work
    if (isMobile && categories.length > 0 && hasIntersected) {
      const prefetchAllCategories = async () => {
        console.log('📱 Mobile/tablet detected - prefetching all categories');
        for (const category of categories) {
          if (!prefetchedCategories.has(category.id)) {
            try {
              console.log(`🚀 Auto-prefetching for mobile: ${category.id}`);
              await prefetchProjectsByCategory(category.id);
              setPrefetchedCategories(prev => new Set([...prev, category.id]));
              console.log(`✅ Auto-prefetched for mobile: ${category.id}`);
            } catch (error) {
              console.error(`❌ Failed to auto-prefetch ${category.id}:`, error);
            }
          }
        }
      };
      
      // Delay prefetch to avoid blocking initial render
      setTimeout(prefetchAllCategories, 1000);
    }
  }, [isMobile, categories, prefetchedCategories, prefetchProjectsByCategory, hasIntersected]);

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
      // Reset scroll position to left when category changes
      setShouldScrollToProject(false);
      setTimeout(() => {
        if (projectGridRef.current) {
          projectGridRef.current.scrollToProject(-1); // Scroll to start
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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

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
      // Add to prefetched set to avoid multiple requests
      setPrefetchedCategories(prev => new Set([...prev, categoryId]));
      
      try {
        await prefetchProjectsByCategory(categoryId);
        console.log(`✅ Successfully prefetched projects for category: ${categoryId}`);
      } catch (error) {
        console.error(`❌ Failed to prefetch projects for ${categoryId}:`, error);
        // Remove from prefetched set on error so it can be retried
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
    // Scroll to portfolio section
    setTimeout(() => {
      const element = document.getElementById('portfolio');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Reset scroll position to left when category changes
    setShouldScrollToProject(false);
    setTimeout(() => {
      if (projectGridRef.current) {
        projectGridRef.current.scrollToProject(-1); // Scroll to start
      }
    }, 100);
  };

  const handleProjectAdded = () => {
    refetch(); // Refresh the projects list
    toast.success('Project added successfully!');
  };

  const handleCategoryAdded = () => {
    refetchCategories(); // Refresh the categories list
    toast.success('Category added successfully!');
  };

  // Loading state
  if (isLoading || categoriesLoading) {
    return (
      <section ref={portfolioRef} id="portfolio" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
              My Portfolio
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Real projects, real results. Here's a showcase of my work across different 
              areas of expertise, demonstrating measurable impact and professional excellence.
            </p>
          </div>
          
          {/* Skeleton projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
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
        onToggleDarkMode={toggleDarkMode}
        lastOpenedProject={lastOpenedProject}
        onProjectAdded={handleProjectAdded}
      />
    );
  }

  return (
    <section ref={portfolioRef} id="portfolio" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 relative">
          {/* Add Project Button - Only show if user is authenticated */}
          {user && (
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <button
                onClick={() => setShowAddProjectForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
              <button
                onClick={() => setShowManageCategoriesForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <Settings className="w-5 h-5" />
                Manage
              </button>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
            My Portfolio
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Real projects, real results. Here's a showcase of my work across different 
            areas of expertise, demonstrating measurable impact and professional excellence.
          </p>

          {/* Category Filter - Desktop only */}
          <div className="hidden md:flex flex-wrap justify-center gap-4 items-center">
            {categories.filter(category => !category.hidden || user).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                onMouseEnter={() => handleCategoryHover(category.id)}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                } ${category.hidden ? 'opacity-60' : ''}`}
              >
                {category.name}
                {category.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {category.badge}
                  </span>
                )}
                {category.hidden && user && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
                    (Hidden)
                  </span>
                )}
              </button>
            ))}
            
            {/* Add Category Button - Only show if user is authenticated */}
            {user && (
              <button
                onClick={() => setShowAddCategoryForm(true)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                title="Add New Category"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

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

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Ready to see similar results for your business?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Let's discuss how I can help streamline your operations, boost your digital presence, 
              and deliver measurable outcomes for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleBookCall}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Book a Call
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
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
