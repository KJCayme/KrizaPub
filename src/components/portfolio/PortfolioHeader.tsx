import React from 'react';
import { Settings, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface PortfolioHeaderProps {
  user: any;
  onAddProject: () => void;
  onAddCategory: () => void;
  onManageCategories: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  user,
  onAddProject,
  onAddCategory,
  onManageCategories
}) => {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Portfolio
        </h2>
        {user && (
          <div className="flex gap-2">
            <Button
              onClick={onAddProject}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
            <Button
              onClick={onAddCategory}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
            <Button
              onClick={onManageCategories}
              variant="outline"
              size="sm"
              className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
        Explore my diverse collection of projects, from web development to creative solutions
      </p>
    </div>
  );
};

export default PortfolioHeader;