
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAddSkill } from '../hooks/useSkills';

interface AddSkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded?: () => void;
}

const AddSkillForm = ({ isOpen, onClose, onSkillAdded }: AddSkillFormProps) => {
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState(['']);
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('from-blue-500 to-cyan-500');
  const [badge, setBadge] = useState('');

  const addSkillMutation = useAddSkill();

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
    { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
    { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
    { value: 'from-teal-500 to-cyan-500', label: 'Teal to Cyan' },
    { value: 'from-indigo-500 to-blue-500', label: 'Indigo to Blue' },
    { value: 'from-violet-500 to-purple-500', label: 'Violet to Purple' },
  ];

  const handleAddDetail = () => {
    setDetails([...details, '']);
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      const filteredDetails = details.filter(detail => detail.trim() !== '');
      
      await addSkillMutation.mutateAsync({
        skill_name: skillName.trim(),
        description: description.trim() || undefined,
        icon: icon.trim() || undefined,
        badge: badge.trim() || undefined,
        color: color,
        details: filteredDetails.length > 0 ? filteredDetails : undefined
      });
      
      // Reset form
      setSkillName('');
      setDescription('');
      setDetails(['']);
      setIcon('');
      setColor('from-blue-500 to-cyan-500');
      setBadge('');
      
      if (onSkillAdded) {
        onSkillAdded();
      }
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name *</Label>
            <Input
              id="skillName"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., Digital Marketing, Web Development"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the skill..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., Target, Code, Palette"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color Gradient</Label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Badge</Label>
            <Input
              id="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g., Soon!, New"
            />
          </div>

          <div className="space-y-2">
            <Label>Key Services</Label>
            {details.map((detail, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={detail}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                  placeholder="Enter a key service..."
                  className="flex-1"
                />
                {details.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDetail(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDetail}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addSkillMutation.isPending}
            >
              {addSkillMutation.isPending ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillForm;
