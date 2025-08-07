import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X } from 'lucide-react';
import { useUpdateSkill } from '../hooks/useSkills';
import type { SkillWithExpertise } from '../hooks/useSkills';

interface EditSkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillWithExpertise | null;
  onSkillUpdated?: () => void;
}

const EditSkillForm = ({ isOpen, onClose, skill, onSkillUpdated }: EditSkillFormProps) => {
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState<string[]>(['']);
  const [icon, setIcon] = useState('Star');
  const [color, setColor] = useState('from-blue-500 to-cyan-500');
  const [badge, setBadge] = useState('');

  const updateSkillMutation = useUpdateSkill();

  // Color options for skills
  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
    { value: 'from-green-500 to-teal-500', label: 'Green to Teal' },
    { value: 'from-red-500 to-orange-500', label: 'Red to Orange' },
    { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo to Purple' },
    { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose' },
    { value: 'from-slate-500 to-slate-600', label: 'Slate' },
  ];

  // Popular icon options
  const iconOptions = [
    'Star', 'Code', 'Database', 'Server', 'Globe', 'Smartphone', 'Monitor',
    'Layers', 'Zap', 'Shield', 'Settings', 'Tool', 'Cpu', 'HardDrive',
    'Wifi', 'Cloud', 'Lock', 'Search', 'BarChart', 'TrendingUp'
  ];

  useEffect(() => {
    if (skill && isOpen) {
      setSkillName(skill.skill_name);
      setDescription(skill.description || '');
      setIcon(skill.icon || 'Star');
      setColor(skill.color || 'from-blue-500 to-cyan-500');
      setBadge(skill.badge || '');
      
      // Get details from expertise data or use default
      const expertiseDetails = skill.skills_expertise?.[0]?.details;
      if (expertiseDetails && expertiseDetails.length > 0) {
        setDetails(expertiseDetails);
      } else {
        setDetails([`Professional ${skill.skill_name} services`]);
      }
    }
  }, [skill, isOpen]);

  const handleAddDetail = () => {
    setDetails([...details, '']);
  };

  const handleRemoveDetail = (index: number) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillName.trim() || !skill) {
      return;
    }

    const filteredDetails = details.filter(detail => detail.trim() !== '');

    updateSkillMutation.mutate({
      skillId: skill.id,
      skillData: {
        skill_name: skillName.trim(),
        description: description.trim() || `Professional ${skillName.trim()} services`,
        icon: icon,
        color: color,
        badge: badge.trim() || undefined,
        details: filteredDetails.length > 0 ? filteredDetails : [`Professional ${skillName.trim()} services`]
      }
    }, {
      onSuccess: () => {
        onClose();
        onSkillUpdated?.();
      }
    });
  };

  const resetForm = () => {
    setSkillName('');
    setDescription('');
    setDetails(['']);
    setIcon('Star');
    setColor('from-blue-500 to-cyan-500');
    setBadge('');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name *</Label>
            <Input
              id="skillName"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Enter skill name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the skill"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((iconOption) => (
                    <SelectItem key={iconOption} value={iconOption}>
                      {iconOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color Theme</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color theme" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((colorOption) => (
                    <SelectItem key={colorOption.value} value={colorOption.value}>
                      {colorOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Badge (Optional)</Label>
            <Input
              id="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g., Popular, New, Premium"
            />
          </div>

          <div className="space-y-4">
            <Label>Key Services</Label>
            {details.map((detail, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={detail}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                  placeholder={`Service ${index + 1}`}
                  className="flex-1"
                />
                {details.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveDetail(index)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddDetail}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateSkillMutation.isPending || !skillName.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {updateSkillMutation.isPending ? 'Updating...' : 'Update Skill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillForm;