import React from 'react';

interface Category {
  id: string;
  name: string;
  badge?: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  prefetchedCategories: Set<string>;
  onCategoryHover: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  prefetchedCategories,
  onCategoryHover
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      <button
        onClick={() => onCategoryChange('')}
        onMouseEnter={() => onCategoryHover('')}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
          activeCategory === ''
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        All Projects
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          onMouseEnter={() => onCategoryHover(category.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 ${
            activeCategory === category.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          } ${prefetchedCategories.has(category.id) ? 'ring-1 ring-green-500/30' : ''}`}
        >
          {category.name}
          {category.badge && (
            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
              {category.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;