
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

interface AddHobbyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onHobbyAdded: () => void;
}

const AddHobbyForm = ({ isOpen, onClose, onHobbyAdded }: AddHobbyFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a hobby title');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('about_hobbies')
        .insert({
          title: title.trim(),
          description: description.trim(),
          icon: icon.trim()
        });

      if (error) throw error;

      toast.success('Hobby added successfully');
      setTitle('');
      setDescription('');
      setIcon('');
      onHobbyAdded();
      onClose();
    } catch (error) {
      console.error('Error adding hobby:', error);
      toast.error('Failed to add hobby');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Hobby</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter hobby title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter hobby description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Lucide icon name)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., Music"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Hobby'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHobbyForm;
