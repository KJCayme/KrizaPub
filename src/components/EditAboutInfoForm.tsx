
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAboutInfo, useUpdateAboutInfo } from '../hooks/useAboutInfo';
import { toast } from 'sonner';

interface EditAboutInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditAboutInfoForm = ({ isOpen, onClose }: EditAboutInfoFormProps) => {
  const { data: aboutInfo } = useAboutInfo();
  const updateAboutInfo = useUpdateAboutInfo();
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (aboutInfo?.info) {
      // Convert database format (separated by -) to display format (paragraphs)
      setInfo(aboutInfo.info.split(' - ').join('\n\n'));
    }
  }, [aboutInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert paragraphs back to database format (separated by -)
      const formattedInfo = info.split('\n\n').filter(p => p.trim()).join(' - ');
      await updateAboutInfo.mutateAsync(formattedInfo);
      toast.success('About info updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update about info');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit About Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="info">About Information</Label>
            <Textarea
              id="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Enter your about information. Separate paragraphs with double line breaks."
              rows={10}
              className="resize-vertical"
            />
            <p className="text-xs text-slate-500">
              Each paragraph should be separated by double line breaks. They will be displayed as separate paragraphs.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateAboutInfo.isPending}>
              {updateAboutInfo.isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAboutInfoForm;
