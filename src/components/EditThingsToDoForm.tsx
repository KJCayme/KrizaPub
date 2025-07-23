import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAboutTtd, useUpdateAboutTtd } from '../hooks/useAboutTtd';
import { toast } from 'sonner';
import { Plus, Trash2, Info } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface EditThingsToDoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditThingsToDoForm = ({ isOpen, onClose, onUpdate }: EditThingsToDoFormProps) => {
  const { data: thingsToDo = [] } = useAboutTtd();
  const updateTtd = useUpdateAboutTtd();
  const [editingItems, setEditingItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', icon: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (thingsToDo.length > 0) {
      setEditingItems([...thingsToDo]);
    }
  }, [thingsToDo]);

  const handleItemChange = (index: number, field: string, value: string) => {
    const updated = [...editingItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditingItems(updated);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('about_ttd')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEditingItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('about_ttd')
        .insert({
          title: newItem.title.trim(),
          description: newItem.description.trim(),
          icon: newItem.icon.trim() || '🌍'
        })
        .select()
        .single();

      if (error) throw error;

      setEditingItems(prev => [...prev, data]);
      setNewItem({ title: '', description: '', icon: '' });
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updatePromises = editingItems
        .filter(item => item.id) // Only update existing items
        .map(item =>
          updateTtd.mutateAsync({
            id: item.id,
            icon: item.icon,
            title: item.title,
            description: item.description
          })
        );
      
      await Promise.all(updatePromises);
      toast.success('Things to do updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update things to do');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Things I Want to Do</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recommendation Notice */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Recommendation:</span>
              <span>We recommend adding up to 4 items for optimal display and user engagement.</span>
            </div>
          </div>

          {/* Existing Items */}
          {editingItems.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Existing Items</h4>
              {editingItems.map((item, index) => (
                <div key={item.id} className="space-y-3 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-slate-700">Item {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`icon-${item.id}`}>Icon (emoji)</Label>
                    <Input
                      id={`icon-${item.id}`}
                      value={item.icon || ''}
                      onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                      placeholder="e.g., 🌍"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`title-${item.id}`}>Title</Label>
                    <Input
                      id={`title-${item.id}`}
                      value={item.title || ''}
                      onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Input
                      id={`description-${item.id}`}
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Item */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" />
              <h4 className="font-semibold text-slate-800">Add New Item</h4>
            </div>
            
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="new-title">Title *</Label>
                <Input
                  id="new-title"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Input
                  id="new-description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon (emoji)</Label>
                <Input
                  id="new-icon"
                  value={newItem.icon}
                  onChange={(e) => setNewItem(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., 🌍"
                />
              </div>
              
              <Button
                type="button"
                onClick={handleAddItem}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditThingsToDoForm;
