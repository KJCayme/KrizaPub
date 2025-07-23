
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
import { useAboutHobbies, useUpdateAboutHobby } from '../hooks/useAboutHobbies';
import { toast } from 'sonner';
import { ExternalLink, Plus, Trash2, Info } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface EditHobbiesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditHobbiesForm = ({ isOpen, onClose, onUpdate }: EditHobbiesFormProps) => {
  const { data: hobbies = [], isLoading } = useAboutHobbies();
  const updateHobby = useUpdateAboutHobby();
  const [editingHobbies, setEditingHobbies] = useState<any[]>([]);
  const [newHobby, setNewHobby] = useState({ title: '', description: '', icon: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Hobbies data in form:', hobbies);
    if (hobbies.length > 0) {
      setEditingHobbies([...hobbies]);
    }
  }, [hobbies]);

  const handleHobbyChange = (index: number, field: string, value: string) => {
    const updated = [...editingHobbies];
    updated[index] = { ...updated[index], [field]: value };
    setEditingHobbies(updated);
  };

  const handleDeleteHobby = async (id: number) => {
    try {
      const { error } = await supabase
        .from('about_hobbies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEditingHobbies(prev => prev.filter(hobby => hobby.id !== id));
      toast.success('Hobby deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete hobby');
    }
  };

  const handleAddHobby = async () => {
    if (!newHobby.title.trim()) {
      toast.error('Please enter a hobby title');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('about_hobbies')
        .insert({
          title: newHobby.title.trim(),
          description: newHobby.description.trim(),
          icon: newHobby.icon.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setEditingHobbies(prev => [...prev, data]);
      setNewHobby({ title: '', description: '', icon: '' });
      toast.success('Hobby added successfully');
    } catch (error) {
      console.error('Error adding hobby:', error);
      toast.error('Failed to add hobby');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update existing hobbies
      const updatePromises = editingHobbies
        .filter(hobby => hobby.id) // Only update existing hobbies
        .map(hobby =>
          updateHobby.mutateAsync({
            id: hobby.id,
            icon: hobby.icon || '',
            title: hobby.title || '',
            description: hobby.description || ''
          })
        );
      
      await Promise.all(updatePromises);
      toast.success('Hobbies updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update hobbies');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Manage Hobbies & Interests</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-slate-600">Loading hobbies...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Hobbies & Interests</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recommendation Notice */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Recommendation:</span>
              <span>We recommend adding up to 6 hobbies for optimal display and user engagement.</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <ExternalLink className="w-4 h-4" />
              <span>Icons are available for Lucide icons only.</span>
              <a 
                href="https://lucide.dev/icons/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Check here
              </a>
            </div>
          </div>

          {/* Existing Hobbies */}
          {editingHobbies.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Existing Hobbies</h4>
              {editingHobbies.map((hobby, index) => (
                <div key={hobby.id} className="space-y-3 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-slate-700">Hobby {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteHobby(hobby.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`icon-${hobby.id}`}>Icon (Lucide icon name)</Label>
                    <Input
                      id={`icon-${hobby.id}`}
                      value={hobby.icon || ''}
                      onChange={(e) => handleHobbyChange(index, 'icon', e.target.value)}
                      placeholder="e.g., Music"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`title-${hobby.id}`}>Title</Label>
                    <Input
                      id={`title-${hobby.id}`}
                      value={hobby.title || ''}
                      onChange={(e) => handleHobbyChange(index, 'title', e.target.value)}
                      placeholder="Enter hobby title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`description-${hobby.id}`}>Description</Label>
                    <Input
                      id={`description-${hobby.id}`}
                      value={hobby.description || ''}
                      onChange={(e) => handleHobbyChange(index, 'description', e.target.value)}
                      placeholder="Enter hobby description"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Hobby */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" />
              <h4 className="font-semibold text-slate-800">Add New Hobby</h4>
            </div>
            
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="new-title">Title *</Label>
                <Input
                  id="new-title"
                  value={newHobby.title}
                  onChange={(e) => setNewHobby(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter hobby title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Input
                  id="new-description"
                  value={newHobby.description}
                  onChange={(e) => setNewHobby(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter hobby description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon (Lucide icon name)</Label>
                <Input
                  id="new-icon"
                  value={newHobby.icon}
                  onChange={(e) => setNewHobby(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., Music"
                />
              </div>
              
              <Button
                type="button"
                onClick={handleAddHobby}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Hobby
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

export default EditHobbiesForm;
