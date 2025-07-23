
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
import { useAboutHighlights, useUpdateAboutHighlight } from '../hooks/useAboutHighlights';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

interface EditHighlightsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditHighlightsForm = ({ isOpen, onClose }: EditHighlightsFormProps) => {
  const { data: highlights = [], isLoading } = useAboutHighlights();
  const updateHighlight = useUpdateAboutHighlight();
  const [editingHighlights, setEditingHighlights] = useState<any[]>([]);

  useEffect(() => {
    console.log('Highlights data in form:', highlights);
    if (highlights.length > 0) {
      setEditingHighlights([...highlights]);
    }
  }, [highlights]);

  const handleHighlightChange = (index: number, field: string, value: string) => {
    const updated = [...editingHighlights];
    updated[index] = { ...updated[index], [field]: value };
    setEditingHighlights(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatePromises = editingHighlights.map(highlight =>
        updateHighlight.mutateAsync({
          id: highlight.id,
          icon: highlight.icon || '',
          title: highlight.title || '',
          description: highlight.description || ''
        })
      );
      
      await Promise.all(updatePromises);
      toast.success('Highlights updated successfully');
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update highlights');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Highlights</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-slate-600">Loading highlights...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (editingHighlights.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Highlights</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-slate-600">No highlights data available to edit.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Highlights</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          
          {editingHighlights.map((highlight, index) => (
            <div key={highlight.id} className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold text-slate-800">Highlight {index + 1}</h4>
              
              <div className="space-y-2">
                <Label htmlFor={`icon-${highlight.id}`}>Icon (Lucide icon name)</Label>
                <Input
                  id={`icon-${highlight.id}`}
                  value={highlight.icon || ''}
                  onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)}
                  placeholder="e.g., Award"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`title-${highlight.id}`}>Title</Label>
                <Input
                  id={`title-${highlight.id}`}
                  value={highlight.title || ''}
                  onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                  placeholder="Enter highlight title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`description-${highlight.id}`}>Description</Label>
                <Input
                  id={`description-${highlight.id}`}
                  value={highlight.description || ''}
                  onChange={(e) => handleHighlightChange(index, 'description', e.target.value)}
                  placeholder="Enter highlight description"
                />
              </div>
            </div>
          ))}
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateHighlight.isPending}>
              {updateHighlight.isPending ? 'Updating...' : 'Update All'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHighlightsForm;
