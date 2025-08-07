
import React from 'react';
import { Button } from './ui/button';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { useDeleteSkill, useToggleSkillVisibility } from '../hooks/useSkills';

interface SkillActionsProps {
  skillId: string;
  skillName: string;
  isHidden?: boolean;
}

const SkillActions = ({ skillId, skillName, isHidden = false }: SkillActionsProps) => {
  const deleteSkillMutation = useDeleteSkill();
  const toggleVisibilityMutation = useToggleSkillVisibility();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${skillName}"? This action cannot be undone.`)) {
      deleteSkillMutation.mutate(skillId);
    }
  };

  const handleToggleVisibility = () => {
    toggleVisibilityMutation.mutate({ skillId, hidden: !isHidden });
  };

  return (
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleVisibility}
        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        disabled={toggleVisibilityMutation.isPending}
        title={isHidden ? "Show skill" : "Hide skill"}
      >
        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        disabled={deleteSkillMutation.isPending}
        title="Delete skill"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SkillActions;
