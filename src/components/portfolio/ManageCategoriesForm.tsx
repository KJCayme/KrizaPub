
import React, { useState } from 'react';
import { X, Eye, EyeOff, Trash2 } from 'lucide-react';
import { usePortfolioCategories } from '../../hooks/usePortfolioCategories';
import { useCategoryActions } from '../../hooks/useCategoryActions';

interface ManageCategoriesFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageCategoriesForm = ({ isOpen, onClose }: ManageCategoriesFormProps) => {
  const { data: categoriesData, refetch } = usePortfolioCategories(true); // Show all categories including hidden
  const { toggleCategoryVisibility, deleteCategory } = useCategoryActions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const categories = categoriesData || [];

  const handleToggleVisibility = async (categoryId: string, currentlyHidden: boolean) => {
    setTogglingId(categoryId);
    try {
      await toggleCategoryVisibility.mutateAsync({
        categoryId,
        hidden: !currentlyHidden
      });
      refetch();
    } catch (error) {
      console.error('Error toggling category visibility:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }
    
    setDeletingId(categoryId);
    try {
      await deleteCategory.mutateAsync(categoryId);
      refetch();
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Key: {category.category_key}
                  </span>
                </div>
                {category.badge && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {category.badge}
                  </span>
                )}
                {category.hidden && (
                  <span className="text-xs text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                    Hidden
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVisibility(category.id, category.hidden)}
                  disabled={togglingId === category.id}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={category.hidden ? 'Show category' : 'Hide category'}
                >
                  {togglingId === category.id ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : category.hidden ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={deletingId === category.id}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete category"
                >
                  {deletingId === category.id ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategoriesForm;
