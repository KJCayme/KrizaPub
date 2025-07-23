import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

const AddCategoryForm = ({ isOpen, onClose, onCategoryAdded }: AddCategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category_key: '',
    badge: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category_key.trim()) {
      toast.error('Name and category key are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('port_skill_cat')
        .insert({
          name: formData.name.trim(),
          category_key: formData.category_key.trim().toLowerCase(),
          badge: formData.badge.trim() || null,
          hidden: false
        });

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category. Please try again.');
        return;
      }

      toast.success('Category added successfully!');
      setFormData({ name: '', category_key: '', badge: '' });
      onCategoryAdded();
      onClose();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCategoryKey = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      category_key: generateCategoryKey(value)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Portfolio Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Web Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_key">Category Key</Label>
            <Input
              id="category_key"
              type="text"
              value={formData.category_key}
              onChange={(e) => handleInputChange('category_key', e.target.value)}
              placeholder="e.g., webdev"
              pattern="[a-z0-9]*"
              title="Only lowercase letters and numbers allowed"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used internally. Only lowercase letters and numbers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Badge (Optional)</Label>
            <Input
              id="badge"
              type="text"
              value={formData.badge}
              onChange={(e) => handleInputChange('badge', e.target.value)}
              placeholder="e.g., New, Soon!"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryForm;