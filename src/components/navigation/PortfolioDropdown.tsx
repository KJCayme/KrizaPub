
import React, { useState } from 'react';
import { ChevronDown, Plus, Eye, EyeOff } from 'lucide-react';
import { usePortfolioCategories } from '../../hooks/usePortfolioCategories';
import { useCategoryActions } from '../../hooks/useCategoryActions';
import { useAuth } from '../../hooks/useAuth';
import AddCategoryForm from '../portfolio/AddCategoryForm';

interface PortfolioDropdownProps {
  portfolioCategories?: any[]; // Keep for backward compatibility
  activePortfolioCategory: string;
  showPortfolioDropdown: boolean;
  onToggleDropdown: () => void;
  onCategoryChange: (categoryId: string) => void;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

const PortfolioDropdown = ({ 
  portfolioCategories: propCategories,
  activePortfolioCategory, 
  showPortfolioDropdown, 
  onToggleDropdown,
  onCategoryChange,
  onAddClick,
  showAddButton = false
}: PortfolioDropdownProps) => {
  const { user } = useAuth();
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  
  // Listen for the add category form trigger event
  React.useEffect(() => {
    const handleShowAddCategoryForm = () => {
      setShowAddCategoryForm(true);
    };
    
    window.addEventListener('showAddCategoryForm', handleShowAddCategoryForm);
    return () => window.removeEventListener('showAddCategoryForm', handleShowAddCategoryForm);
  }, []);
  
  // Fetch categories from database - show hidden ones only if user is logged in
  const { data: categoriesData, refetch } = usePortfolioCategories(!!user);
  const { toggleCategoryVisibility } = useCategoryActions();
  
  // Categories are already sorted by the hook (visible first, then hidden, then alphabetically)
  const portfolioCategories = categoriesData?.map(cat => ({
    id: cat.category_key,
    name: cat.name,
    badge: cat.badge || undefined,
    hidden: cat.hidden || false,
    dbId: cat.id
  })) || propCategories || [];

  const handleToggleVisibility = async (categoryDbId: string, currentlyHidden: boolean) => {
    await toggleCategoryVisibility.mutateAsync({
      categoryId: categoryDbId,
      hidden: !currentlyHidden
    });
  };

  const handleCategoryAdded = () => {
    refetch(); // Refresh categories after adding new one
  };

  return (
    <div className="flex-1 flex justify-center items-center gap-2">
      <div className="relative">
        <button
          onClick={onToggleDropdown}
          className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg text-sm"
        >
          <span className="truncate max-w-32">{portfolioCategories.find(cat => cat.id === activePortfolioCategory)?.name}</span>
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showPortfolioDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showPortfolioDropdown && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-56 max-h-80 overflow-y-auto">
            {portfolioCategories.map((category) => (
              <div key={category.id} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0 relative group">
                {/* Category button */}
                <button
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full text-left px-4 py-3 font-medium transition-colors ${
                    activePortfolioCategory === category.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  } ${category.hidden ? 'opacity-60' : ''} first:rounded-t-lg`}
                >
                  <div className="flex items-center">
                    <span>{category.name}</span>
                    {category.badge && (
                      <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {category.badge}
                      </span>
                    )}
                    {category.hidden && (
                      <span className="ml-2 text-xs text-slate-400">(Hidden)</span>
                    )}
                  </div>
                </button>
                
                {/* Floating Eye icon - only show if user is logged in */}
                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(category.dbId, category.hidden);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-50 dark:hover:bg-slate-600 z-10"
                    title={category.hidden ? 'Show category' : 'Hide category'}
                  >
                    {category.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                )}
              </div>
            ))}
            
            {/* Add Category button - only show if user is logged in */}
            {user && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowAddCategoryForm(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors rounded-b-lg font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showAddButton && onAddClick && (
        <button
          onClick={onAddClick}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          title="Add New Project"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
      
      {/* Add Category Form Dialog */}
      <AddCategoryForm
        isOpen={showAddCategoryForm}
        onClose={() => setShowAddCategoryForm(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
};

export default PortfolioDropdown;
